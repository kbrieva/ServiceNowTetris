import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  COLS, ROWS, BLOCK_SIZE, Board, ActivePiece, PieceDef,
  createBoard, randomPieceDef, spawnPiece, isValid, rotate,
  lockPiece, clearLines, getSpeed, calcScore, ghostY,
} from "../game/engine";
import HighScoresPanel from "./HighScoresPanel";
import "./TetrisGame.css";

const PREVIEW_BLOCK = 20;
const INITIAL_LIVES = 3;

interface Props {
  playerName: string;
  onGameOver: (score: number, level: number, lines: number) => void;
  onRestart: () => void;
}

/* ── Drawing helpers ── */

function drawBlock(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, color: string, size: number,
) {
  ctx.fillStyle = color;
  ctx.fillRect(x * size, y * size, size - 1, size - 1);
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  ctx.fillRect(x * size, y * size, size - 1, 3);
  ctx.fillRect(x * size, y * size, 3, size - 1);
  ctx.fillStyle = "rgba(0,0,0,0.15)";
  ctx.fillRect(x * size + size - 4, y * size, 3, size - 1);
  ctx.fillRect(x * size, y * size + size - 4, size - 1, 3);
}

function drawGhostBlock(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, color: string, size: number,
) {
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.3;
  ctx.lineWidth = 2;
  ctx.strokeRect(x * size + 1, y * size + 1, size - 3, size - 3);
  ctx.globalAlpha = 1;
}

function drawBonusBlock(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, color: string, size: number,
) {
  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowBlur = 12;
  ctx.fillStyle = color;
  ctx.fillRect(x * size, y * size, size - 1, size - 1);
  ctx.restore();
  ctx.fillStyle = "rgba(255,255,255,0.30)";
  ctx.fillRect(x * size, y * size, size - 1, 3);
  ctx.fillRect(x * size, y * size, 3, size - 1);
  ctx.fillStyle = "rgba(0,0,0,0.10)";
  ctx.fillRect(x * size + size - 4, y * size, 3, size - 1);
  ctx.fillRect(x * size, y * size + size - 4, size - 1, 3);
}

function drawPauseOverlay(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#56B4E9";
  ctx.font = "bold 36px 'Segoe UI', system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("⏸  PAUSED", w / 2, h / 2 - 16);
  ctx.fillStyle = "#aaa";
  ctx.font = "16px 'Segoe UI', system-ui, sans-serif";
  ctx.fillText("Press ESC to resume", w / 2, h / 2 + 24);
}

/* ── Component ── */

export default function TetrisGame({ playerName, onGameOver, onRestart }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cbRef = useRef(onGameOver);
  cbRef.current = onGameOver;

  const [display, setDisplay] = useState({
    score: 0, level: 1, lines: 0, lives: INITIAL_LIVES,
    paused: false, swapsUsed: 0, swapsMax: 1,
  });

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const pCanvas = previewRef.current!;
    const pCtx = pCanvas.getContext("2d")!;

    if (containerRef.current) containerRef.current.focus();

    let board: Board = createBoard();
    let current: ActivePiece | null = null;
    let next: PieceDef = randomPieceDef();
    let score = 0;
    let level = 1;
    let lines = 0;
    let lives = INITIAL_LIVES;
    let over = false;
    let paused = false;
    let lastDrop = performance.now();
    let rafId = 0;

    // Swap tracking: level = max swaps, resets when level changes
    let swapsUsed = 0;
    let prevLevel = 1;

    function syncDisplay() {
      setDisplay({
        score, level, lines, lives, paused,
        swapsUsed, swapsMax: level,
      });
    }

    function spawn() {
      const piece = spawnPiece(next);
      next = randomPieceDef();
      if (!isValid(board, piece)) {
        lives--;
        syncDisplay();
        if (lives <= 0) {
          over = true;
          cbRef.current(score, level, lines);
          return;
        }
        board = createBoard();
      }
      current = piece;

      // Reset swaps when level increases
      if (level !== prevLevel) {
        swapsUsed = 0;
        prevLevel = level;
      }
    }

    function lock() {
      if (!current) return;
      board = lockPiece(board, current);
      const res = clearLines(board);
      board = res.board;
      if (res.cleared > 0) {
        lines += res.cleared;
        score += calcScore(res.cleared, level);
        const newLevel = Math.min(10, Math.floor(lines / 10) + 1);
        if (newLevel !== level) {
          swapsUsed = 0;
          prevLevel = newLevel;
        }
        level = newLevel;
      }
      current = null;
      syncDisplay();
      spawn();
    }

    function hardDrop() {
      if (!current) return;
      const gy = ghostY(board, current);
      current.y = gy;
      lock();
    }

    function draw() {
      ctx.fillStyle = "#1a1a2e";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "#2a2a4e";
      ctx.lineWidth = 0.5;
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          ctx.strokeRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
      }
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (board[r][c]) drawBlock(ctx, c, r, board[r][c]!, BLOCK_SIZE);
        }
      }
      if (current) {
        const gy = ghostY(board, current);
        if (gy !== current.y) {
          for (let r = 0; r < current.shape.length; r++) {
            for (let c = 0; c < current.shape[r].length; c++) {
              if (current.shape[r][c]) {
                drawGhostBlock(ctx, current.x + c, gy + r, current.color, BLOCK_SIZE);
              }
            }
          }
        }
        const blockFn = current.isBonus ? drawBonusBlock : drawBlock;
        for (let r = 0; r < current.shape.length; r++) {
          for (let c = 0; c < current.shape[r].length; c++) {
            if (current.shape[r][c]) {
              blockFn(ctx, current.x + c, current.y + r, current.color, BLOCK_SIZE);
            }
          }
        }
      }
      if (paused) drawPauseOverlay(ctx, canvas.width, canvas.height);

      // Preview
      pCtx.fillStyle = "#1a1a2e";
      pCtx.fillRect(0, 0, pCanvas.width, pCanvas.height);
      const ox = (pCanvas.width - next.shape[0].length * PREVIEW_BLOCK) / 2;
      const oy = (pCanvas.height - next.shape.length * PREVIEW_BLOCK) / 2;
      for (let r = 0; r < next.shape.length; r++) {
        for (let c = 0; c < next.shape[r].length; c++) {
          if (next.shape[r][c]) {
            if (next.isBonus) {
              pCtx.save();
              pCtx.shadowColor = next.color;
              pCtx.shadowBlur = 8;
            }
            pCtx.fillStyle = next.color;
            pCtx.fillRect(
              ox + c * PREVIEW_BLOCK, oy + r * PREVIEW_BLOCK,
              PREVIEW_BLOCK - 1, PREVIEW_BLOCK - 1,
            );
            if (next.isBonus) pCtx.restore();
          }
        }
      }
    }

    function loop(time: number) {
      if (over) return;
      if (paused) { draw(); rafId = requestAnimationFrame(loop); return; }
      if (!current) spawn();
      if (current && time - lastDrop > getSpeed(level)) {
        if (isValid(board, current, 0, 1)) current.y++;
        else lock();
        lastDrop = time;
      }
      draw();
      rafId = requestAnimationFrame(loop);
    }

    function togglePause() {
      paused = !paused;
      if (!paused) lastDrop = performance.now();
      syncDisplay();
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (!over) togglePause();
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      if (over || paused || !current) return;
      switch (e.key) {
        case "ArrowLeft":
          if (isValid(board, current, -1, 0)) current.x--;
          e.preventDefault(); e.stopPropagation(); break;
        case "ArrowRight":
          if (isValid(board, current, 1, 0)) current.x++;
          e.preventDefault(); e.stopPropagation(); break;
        case "ArrowDown":
          if (isValid(board, current, 0, 1)) {
            current.y++;
            lastDrop = performance.now();
          }
          e.preventDefault(); e.stopPropagation(); break;
        case "ArrowUp": {
          const rotated = rotate(current.shape);
          const test: ActivePiece = { ...current, shape: rotated };
          if (isValid(board, test)) current.shape = rotated;
          e.preventDefault(); e.stopPropagation(); break;
        }
        case " ":
          hardDrop();
          e.preventDefault(); e.stopPropagation(); break;
        case "Shift": {
          // Swap limited by level: level N = N swaps allowed
          if (swapsUsed >= level) break;   // no swaps remaining
          const oldNext = next;
          next = { shape: current.shape, color: current.color, isBonus: current.isBonus };
          const swapped = spawnPiece(oldNext);
          if (isValid(board, swapped)) {
            current = swapped;
            lastDrop = performance.now();
            swapsUsed++;
            syncDisplay();
          } else {
            next = oldNext;               // revert if can't place
          }
          e.preventDefault(); e.stopPropagation(); break;
        }
      }
    }

    document.addEventListener("keydown", onKey, true);
    draw();
    rafId = requestAnimationFrame(loop);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const livesDisplay = useCallback((n: number) => {
    let h = "";
    for (let i = 0; i < n; i++) h += "❤️";
    for (let i = n; i < INITIAL_LIVES; i++) h += "🖤";
    return h;
  }, []);

  const swapsLeft = display.swapsMax - display.swapsUsed;

  return (
    <div className="tetris-container" ref={containerRef} tabIndex={0}>
      <canvas
        ref={canvasRef}
        width={COLS * BLOCK_SIZE}
        height={ROWS * BLOCK_SIZE}
        className="tetris-canvas"
      />
      <div className="tetris-sidebar">
        <div className="sidebar-section">
          <h3>Player</h3>
          <p className="player-name">{playerName}</p>
        </div>
        <div className="sidebar-section">
          <h3>Lives</h3>
          <p className="lives-display">{livesDisplay(display.lives)}</p>
        </div>
        <div className="sidebar-section">
          <h3>Next</h3>
          <canvas ref={previewRef} width={100} height={80} className="preview-canvas" />
        </div>
        <div className="sidebar-section">
          <h3>Score</h3>
          <p className="stat-value">{display.score.toLocaleString()}</p>
        </div>
        <div className="sidebar-section">
          <h3>Level</h3>
          <p className="stat-value">{display.level}</p>
        </div>
        <div className="sidebar-section">
          <h3>Lines</h3>
          <p className="stat-value">{display.lines}</p>
        </div>
        <div className="sidebar-section">
          <h3>⇧ Swap</h3>
          <div className="swap-counter">
            <span className={swapsLeft > 0 ? "swap-available" : "swap-empty"}>
              {swapsLeft}
            </span>
            <span className="swap-label">/ {display.swapsMax} left</span>
          </div>
        </div>
        {display.paused && (
          <div className="pause-badge">⏸ PAUSED</div>
        )}
        <button className="restart-btn" onClick={onRestart}>⟳ Restart</button>
        <div className="controls-hint">
          <p>← → Move</p>
          <p>↑ Rotate</p>
          <p>↓ Soft Drop</p>
          <p>Space Hard Drop</p>
          <p>⇧ Shift Swap</p>
          <p>Esc Pause</p>
        </div>
      </div>
      <HighScoresPanel />
    </div>
  );
}
