import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  COLS, ROWS, BLOCK_SIZE, Board, ActivePiece, PieceDef,
  createBoard, randomPieceDef, spawnPiece, isValid, rotate,
  lockPiece, clearLines, getSpeed, calcScore, calcComboBonus,
  ghostY, MILESTONES,
} from "../game/engine";
import HighScoresPanel from "./HighScoresPanel";
import {
  pieceLock, pieceMove, pieceRotate, hardDropSound,
  lineClear1, lineClear2, lineClear3, lineClear4,
  comboSound, milestoneSound, deathSound, gameOverSound,
  levelUpSound, swapSound,
} from "../game/sounds";
import "./TetrisGame.css";

const PREVIEW_BLOCK = 20;
const INITIAL_LIVES = 3;
const TOAST_MS = 1800;
const DEATH_MS = 2200;

interface Props {
  playerName: string;
  onGameOver: (score: number, level: number, lines: number) => void;
  onRestart: () => void;
}

interface Toast { text: string; sub: string; start: number; dur: number; }

/* ── Canvas draw helpers ── */

function drawBlock(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, s: number) {
  ctx.fillStyle = color;
  ctx.fillRect(x * s, y * s, s - 1, s - 1);
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  ctx.fillRect(x * s, y * s, s - 1, 3);
  ctx.fillRect(x * s, y * s, 3, s - 1);
  ctx.fillStyle = "rgba(0,0,0,0.15)";
  ctx.fillRect(x * s + s - 4, y * s, 3, s - 1);
  ctx.fillRect(x * s, y * s + s - 4, s - 1, 3);
}
function drawGhost(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, s: number) {
  ctx.strokeStyle = color; ctx.globalAlpha = 0.3; ctx.lineWidth = 2;
  ctx.strokeRect(x * s + 1, y * s + 1, s - 3, s - 3); ctx.globalAlpha = 1;
}
function drawBonus(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, s: number) {
  ctx.save(); ctx.shadowColor = color; ctx.shadowBlur = 12;
  ctx.fillStyle = color; ctx.fillRect(x * s, y * s, s - 1, s - 1); ctx.restore();
  ctx.fillStyle = "rgba(255,255,255,0.30)";
  ctx.fillRect(x * s, y * s, s - 1, 3); ctx.fillRect(x * s, y * s, 3, s - 1);
  ctx.fillStyle = "rgba(0,0,0,0.10)";
  ctx.fillRect(x * s + s - 4, y * s, 3, s - 1); ctx.fillRect(x * s, y * s + s - 4, s - 1, 3);
}
function drawPause(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = "rgba(0,0,0,0.65)"; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#56B4E9"; ctx.font = "bold 36px 'Segoe UI',system-ui,sans-serif";
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText("⏸  PAUSED", w / 2, h / 2 - 16);
  ctx.fillStyle = "#aaa"; ctx.font = "16px 'Segoe UI',system-ui,sans-serif";
  ctx.fillText("Press ESC to resume", w / 2, h / 2 + 24);
}

/** Generic toast renderer at a given Y center */
function renderToast(
  ctx: CanvasRenderingContext2D, w: number, yCenter: number,
  t: Toast, now: number, mainColor: string, subColor: string, mainSize: number,
) {
  const el = now - t.start;
  if (el > t.dur) return;
  let a = 1;
  if (el < 200) a = el / 200;
  else if (el > t.dur - 400) a = (t.dur - el) / 400;
  const drift = -(el / t.dur) * 30;
  ctx.save();
  ctx.globalAlpha = a; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.shadowColor = "#000"; ctx.shadowBlur = 6;
  ctx.fillStyle = mainColor;
  ctx.font = "bold " + mainSize + "px 'Segoe UI',system-ui,sans-serif";
  ctx.fillText(t.text, w / 2, yCenter + drift);
  if (t.sub) {
    ctx.fillStyle = subColor;
    ctx.font = "bold 15px 'Segoe UI',system-ui,sans-serif";
    ctx.fillText(t.sub, w / 2, yCenter + mainSize + 4 + drift);
  }
  ctx.restore();
}

/** Death effect — big broken heart that pulses and fades */
function renderDeath(ctx: CanvasRenderingContext2D, w: number, h: number, t: Toast, now: number) {
  const el = now - t.start;
  if (el > t.dur) return;
  // Dark flash overlay
  const flashA = el < 300 ? 0.4 * (1 - el / 300) : 0;
  if (flashA > 0) {
    ctx.save(); ctx.globalAlpha = flashA;
    ctx.fillStyle = "#D55E00"; ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }
  // Broken heart — scales up then settles, then fades out
  let scale = 1;
  if (el < 300) scale = 0.5 + 1.5 * (el / 300);      // burst from 0.5 → 2
  else if (el < 600) scale = 2 - 0.6 * ((el - 300) / 300); // settle to 1.4
  else scale = 1.4;
  let a = 1;
  if (el > t.dur - 600) a = (t.dur - el) / 600;
  const drift = -(el / t.dur) * 20;
  ctx.save();
  ctx.globalAlpha = a; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.font = "bold " + Math.round(48 * scale) + "px 'Segoe UI',system-ui,sans-serif";
  ctx.shadowColor = "#D55E00"; ctx.shadowBlur = 20;
  ctx.fillStyle = "#D55E00";
  ctx.fillText("💔", w / 2, h / 2 - 20 + drift);
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#fff";
  ctx.font = "bold 22px 'Segoe UI',system-ui,sans-serif";
  ctx.fillText(t.text, w / 2, h / 2 + 30 + drift);
  ctx.fillStyle = "#aaa";
  ctx.font = "15px 'Segoe UI',system-ui,sans-serif";
  ctx.fillText(t.sub, w / 2, h / 2 + 56 + drift);
  ctx.restore();
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
    paused: false, swapsUsed: 0, swapsMax: 1, combo: 0,
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
    let score = 0, level = 1, lines = 0, lives = INITIAL_LIVES;
    let over = false, paused = false;
    let lastDrop = performance.now(), rafId = 0;
    let swapsUsed = 0, prevLevel = 1;
    let combo = 0, lastMilestoneShown = 0;

    // 3 independent toast channels — all can show at once
    let milestoneToast: Toast | null = null;  // top area
    let comboToast: Toast | null = null;      // bottom area
    let deathToast: Toast | null = null;      // center — big 💔

    function sync() {
      setDisplay({ score, level, lines, lives, paused, swapsUsed, swapsMax: level, combo });
    }

    function checkMilestone() {
      for (let i = MILESTONES.length - 1; i >= 0; i--) {
        if (lines >= MILESTONES[i].lines && MILESTONES[i].lines > lastMilestoneShown) {
          lastMilestoneShown = MILESTONES[i].lines;
          milestoneSound(); // 🔊 milestone fanfare
          milestoneToast = {
            text: MILESTONES[i].text,
            sub: lines + " lines cleared!",
            start: performance.now(), dur: TOAST_MS,
          };
          return;
        }
      }
    }

    function spawn() {
      const piece = spawnPiece(next);
      next = randomPieceDef();
      if (!isValid(board, piece)) {
        lives--;
        deathSound(); // 🔊 life lost
        // Trigger death effect
        deathToast = {
          text: "LIFE LOST",
          sub: lives > 0 ? lives + " remaining" : "GAME OVER",
          start: performance.now(), dur: DEATH_MS,
        };
        sync();
        if (lives <= 0) {
          over = true;
          gameOverSound(); // 🔊 game over
          cbRef.current(score, level, lines);
          return;
        }
        board = createBoard();
      }
      current = piece;
      if (level !== prevLevel) { swapsUsed = 0; prevLevel = level; }
    }

    function lock() {
      if (!current) return;
      board = lockPiece(board, current);
      pieceLock(); // 🔊 piece lock click
      const res = clearLines(board);
      board = res.board;

      if (res.cleared > 0) {
        // 🔊 line clear sounds — escalate 1→4
        if (res.cleared === 1) lineClear1();
        else if (res.cleared === 2) lineClear2();
        else if (res.cleared === 3) lineClear3();
        else lineClear4();

        combo++;
        const cb = calcComboBonus(combo);
        score += calcScore(res.cleared, level) + cb;
        lines += res.cleared;
        const nl = Math.min(10, Math.floor(lines / 10) + 1);
        if (nl !== level) { swapsUsed = 0; prevLevel = nl; levelUpSound(); } // 🔊 level up
        level = nl;

        // Combo toast (bottom) — independent from milestone
        if (combo > 1) {
          comboSound(combo); // 🔊 combo
          comboToast = {
            text: "🔥 COMBO x" + combo,
            sub: "+" + cb + " bonus!",
            start: performance.now(), dur: TOAST_MS,
          };
        }
        // Milestone toast (top) — fires independently
        checkMilestone();
      } else {
        combo = 0;
      }
      current = null;
      sync();
      spawn();
    }

    function hardDrop() {
      if (!current) return;
      hardDropSound(); // 🔊 hard drop thud
      current.y = ghostY(board, current);
      lock();
    }

    function draw() {
      const W = canvas.width, H = canvas.height;
      ctx.fillStyle = "#1a1a2e"; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "#2a2a4e"; ctx.lineWidth = 0.5;
      for (let r = 0; r < ROWS; r++)
        for (let c = 0; c < COLS; c++)
          ctx.strokeRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      for (let r = 0; r < ROWS; r++)
        for (let c = 0; c < COLS; c++)
          if (board[r][c]) drawBlock(ctx, c, r, board[r][c]!, BLOCK_SIZE);

      if (current) {
        const gy = ghostY(board, current);
        if (gy !== current.y)
          for (let r = 0; r < current.shape.length; r++)
            for (let c = 0; c < current.shape[r].length; c++)
              if (current.shape[r][c])
                drawGhost(ctx, current.x + c, gy + r, current.color, BLOCK_SIZE);
        const fn = current.isBonus ? drawBonus : drawBlock;
        for (let r = 0; r < current.shape.length; r++)
          for (let c = 0; c < current.shape[r].length; c++)
            if (current.shape[r][c])
              fn(ctx, current.x + c, current.y + r, current.color, BLOCK_SIZE);
      }

      // ── Toast overlays (3 independent channels) ──
      const now = performance.now();

      // Milestone — top third of board
      if (milestoneToast && now - milestoneToast.start < milestoneToast.dur)
        renderToast(ctx, W, H * 0.22, milestoneToast, now, "#56B4E9", "#88d0f0", 30);
      else milestoneToast = null;

      // Combo — lower third of board
      if (comboToast && now - comboToast.start < comboToast.dur)
        renderToast(ctx, W, H * 0.78, comboToast, now, "#F0E442", "#E69F00", 24);
      else comboToast = null;

      // Death — center, on top of everything
      if (deathToast && now - deathToast.start < deathToast.dur)
        renderDeath(ctx, W, H, deathToast, now);
      else deathToast = null;

      if (paused) drawPause(ctx, W, H);

      // Preview
      pCtx.fillStyle = "#1a1a2e"; pCtx.fillRect(0, 0, pCanvas.width, pCanvas.height);
      const ox = (pCanvas.width - next.shape[0].length * PREVIEW_BLOCK) / 2;
      const oy = (pCanvas.height - next.shape.length * PREVIEW_BLOCK) / 2;
      for (let r = 0; r < next.shape.length; r++)
        for (let c = 0; c < next.shape[r].length; c++)
          if (next.shape[r][c]) {
            if (next.isBonus) { pCtx.save(); pCtx.shadowColor = next.color; pCtx.shadowBlur = 8; }
            pCtx.fillStyle = next.color;
            pCtx.fillRect(ox + c * PREVIEW_BLOCK, oy + r * PREVIEW_BLOCK, PREVIEW_BLOCK - 1, PREVIEW_BLOCK - 1);
            if (next.isBonus) pCtx.restore();
          }
    }

    function loop(time: number) {
      if (over) {
        // Keep drawing for a moment so death toast finishes
        if (deathToast && performance.now() - deathToast.start < deathToast.dur) {
          draw(); rafId = requestAnimationFrame(loop);
        }
        return;
      }
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
      sync();
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (!over) togglePause();
        e.preventDefault(); e.stopPropagation(); return;
      }
      if (over || paused || !current) return;
      switch (e.key) {
        case "ArrowLeft":
          if (isValid(board, current, -1, 0)) { current.x--; pieceMove(); } // 🔊
          e.preventDefault(); e.stopPropagation(); break;
        case "ArrowRight":
          if (isValid(board, current, 1, 0)) { current.x++; pieceMove(); } // 🔊
          e.preventDefault(); e.stopPropagation(); break;
        case "ArrowDown":
          if (isValid(board, current, 0, 1)) { current.y++; lastDrop = performance.now(); }
          e.preventDefault(); e.stopPropagation(); break;
        case "ArrowUp": {
          const rot = rotate(current.shape);
          const t: ActivePiece = { ...current, shape: rot };
          if (isValid(board, t)) { current.shape = rot; pieceRotate(); } // 🔊
          e.preventDefault(); e.stopPropagation(); break;
        }
        case " ":
          hardDrop(); e.preventDefault(); e.stopPropagation(); break;
        case "Shift": {
          if (swapsUsed >= level) break;
          const old = next;
          next = { shape: current.shape, color: current.color, isBonus: current.isBonus };
          const sw = spawnPiece(old);
          if (isValid(board, sw)) { current = sw; lastDrop = performance.now(); swapsUsed++; swapSound(); sync(); } // 🔊
          else { next = old; }
          e.preventDefault(); e.stopPropagation(); break;
        }
      }
    }

    document.addEventListener("keydown", onKey, true);
    draw();
    rafId = requestAnimationFrame(loop);
    return () => { document.removeEventListener("keydown", onKey, true); cancelAnimationFrame(rafId); };
  }, []);

  const hearts = useCallback((n: number) => {
    let h = "";
    for (let i = 0; i < n; i++) h += "❤️";
    for (let i = n; i < INITIAL_LIVES; i++) h += "🖤";
    return h;
  }, []);

  const swapsLeft = display.swapsMax - display.swapsUsed;

  return (
    <div className="tetris-container" ref={containerRef} tabIndex={0}>
      {/* ── TOP BAR: Score | Combo | Level ── */}
      <div className="top-bar">
        <div className="sidebar-section">
          <h3>Score</h3>
          <p className="stat-value-lg">{display.score.toLocaleString()}</p>
        </div>
        <div className="sidebar-section">
          <h3>🔥 Combo</h3>
          <div className="combo-display">
            <span className={display.combo > 0 ? "combo-active" : "combo-zero"}>x{display.combo}</span>
            {display.combo > 1 && <span className="combo-bonus">+{(display.combo * 100).toLocaleString()}</span>}
          </div>
        </div>
        <div className="sidebar-section">
          <h3>Level</h3>
          <p className="stat-value-lg">{display.level}</p>
        </div>
      </div>

      {/* ── LEFT PANEL: Swap → Lines → Restart ── */}
      <div className="left-panel">
        <div className="sidebar-section">
          <h3>⇧ Swap</h3>
          <div className="swap-counter">
            <span className={swapsLeft > 0 ? "swap-available" : "swap-empty"}>{swapsLeft}</span>
            <span className="swap-label">/ {display.swapsMax}</span>
          </div>
        </div>
        <div className="sidebar-section">
          <h3>Lines</h3>
          <p className="stat-value">{display.lines}</p>
        </div>
        {display.paused && <div className="pause-badge">⏸ PAUSED</div>}
        <button className="restart-btn" onClick={onRestart}>⟳ Restart</button>
      </div>

      {/* ── CENTER: Game board ── */}
      <div className="board-area">
        <canvas ref={canvasRef} width={COLS * BLOCK_SIZE} height={ROWS * BLOCK_SIZE} className="tetris-canvas" />
      </div>

      {/* ── RIGHT PANEL: Player, Lives, Next, High Scores ── */}
      <div className="right-panel">
        <div className="sidebar-section"><h3>Player</h3><p className="player-name">{playerName}</p></div>
        <div className="sidebar-section"><h3>Lives</h3><p className="lives-display">{hearts(display.lives)}</p></div>
        <div className="sidebar-section">
          <h3>Next</h3>
          <canvas ref={previewRef} width={100} height={80} className="preview-canvas" />
        </div>
        <HighScoresPanel />
      </div>

      {/* ── BOTTOM: Controls guide ── */}
      <div className="bottom-bar">
        <div className="controls-hint">
          <span>← → Move</span><span>↑ Rotate</span><span>↓ Soft Drop</span>
          <span>Space Hard Drop</span><span>⇧ Shift Swap</span><span>Esc Pause</span>
        </div>
      </div>
    </div>
  );
}
