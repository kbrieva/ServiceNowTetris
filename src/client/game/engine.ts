export const COLS = 10;
export const ROWS = 20;
export const BLOCK_SIZE = 30;

export type CellColor = string | null;
export type Board = CellColor[][];
export type Shape = number[][];

export interface PieceDef {
  shape: Shape;
  color: string;
  isBonus?: boolean;
}

export interface ActivePiece {
  shape: Shape;
  color: string;
  x: number;
  y: number;
  isBonus?: boolean;
}

/* ── Colorblind-safe palette (Wong 2011) ─────────────────────
 *  Every piece has a distinct hue that remains distinguishable
 *  under Protanopia, Deuteranopia, and Tritanopia.
 * ──────────────────────────────────────────────────────────── */
export const PIECE_DEFS: Record<string, PieceDef> = {
  I: { shape: [[1, 1, 1, 1]],             color: "#56B4E9" },  // sky blue
  O: { shape: [[1, 1], [1, 1]],           color: "#F0E442" },  // yellow
  T: { shape: [[0, 1, 0], [1, 1, 1]],     color: "#CC79A7" },  // pink
  S: { shape: [[0, 1, 1], [1, 1, 0]],     color: "#009E73" },  // teal
  Z: { shape: [[1, 1, 0], [0, 1, 1]],     color: "#D55E00" },  // vermillion
  J: { shape: [[1, 0, 0], [1, 1, 1]],     color: "#0072B2" },  // blue
  L: { shape: [[0, 0, 1], [1, 1, 1]],     color: "#E69F00" },  // amber
};

/* ── Bonus pieces (~15 % chance) — also colorblind-safe ── */
export const BONUS_PIECE_DEFS: Record<string, PieceDef> = {
  Plus: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0],
    ],
    color: "#FFFFFF",   // white — stands out against every other hue
    isBonus: true,
  },
  Corner: {
    shape: [
      [1, 1],
      [1, 0],
      [1, 0],
    ],
    color: "#999999",   // neutral grey
    isBonus: true,
  },
  Zigzag: {
    shape: [
      [1, 0, 0],
      [1, 1, 0],
      [0, 1, 1],
    ],
    color: "#66CCEE",   // light cyan
    isBonus: true,
  },
};

const PIECE_NAMES = Object.keys(PIECE_DEFS);
const BONUS_NAMES = Object.keys(BONUS_PIECE_DEFS);
const LINE_SCORES = [0, 100, 300, 500, 800];

/* ── Safe board constructors (no Array.from — avoids Prototype.js conflict) ── */

function makeRow(): CellColor[] {
  const row: CellColor[] = new Array(COLS);
  for (let i = 0; i < COLS; i++) row[i] = null;
  return row;
}

export function createBoard(): Board {
  const board: Board = new Array(ROWS);
  for (let i = 0; i < ROWS; i++) board[i] = makeRow();
  return board;
}

/* ── Piece helpers ── */

function cloneShape(s: Shape): Shape {
  const out: Shape = new Array(s.length);
  for (let r = 0; r < s.length; r++) {
    out[r] = new Array(s[r].length);
    for (let c = 0; c < s[r].length; c++) out[r][c] = s[r][c];
  }
  return out;
}

export function randomPieceDef(): PieceDef {
  if (Math.random() < 0.15 && BONUS_NAMES.length > 0) {
    const name = BONUS_NAMES[Math.floor(Math.random() * BONUS_NAMES.length)];
    const def = BONUS_PIECE_DEFS[name];
    return { shape: cloneShape(def.shape), color: def.color, isBonus: true };
  }
  const name = PIECE_NAMES[Math.floor(Math.random() * PIECE_NAMES.length)];
  const def = PIECE_DEFS[name];
  return { shape: cloneShape(def.shape), color: def.color };
}

export function spawnPiece(def: PieceDef): ActivePiece {
  return {
    shape: cloneShape(def.shape),
    color: def.color,
    x: Math.floor((COLS - def.shape[0].length) / 2),
    y: 0,
    isBonus: !!def.isBonus,
  };
}

export function isValid(board: Board, piece: ActivePiece, dx = 0, dy = 0): boolean {
  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (!piece.shape[r][c]) continue;
      const nx = piece.x + c + dx;
      const ny = piece.y + r + dy;
      if (nx < 0 || nx >= COLS || ny >= ROWS) return false;
      if (ny >= 0 && board[ny][nx]) return false;
    }
  }
  return true;
}

export function rotate(shape: Shape): Shape {
  const rows = shape.length;
  const cols = shape[0].length;
  const result: Shape = new Array(cols);
  for (let i = 0; i < cols; i++) {
    result[i] = new Array(rows);
    for (let j = 0; j < rows; j++) result[i][j] = 0;
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      result[c][rows - 1 - r] = shape[r][c];
    }
  }
  return result;
}

export function lockPiece(board: Board, piece: ActivePiece): Board {
  const nb: Board = new Array(board.length);
  for (let i = 0; i < board.length; i++) {
    nb[i] = new Array(board[i].length);
    for (let j = 0; j < board[i].length; j++) nb[i][j] = board[i][j];
  }
  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (!piece.shape[r][c]) continue;
      const y = piece.y + r;
      const x = piece.x + c;
      if (y >= 0 && y < ROWS && x >= 0 && x < COLS) nb[y][x] = piece.color;
    }
  }
  return nb;
}

export function clearLines(board: Board): { board: Board; cleared: number } {
  const kept: Board = [];
  for (let r = 0; r < board.length; r++) {
    let full = true;
    for (let c = 0; c < board[r].length; c++) {
      if (!board[r][c]) { full = false; break; }
    }
    if (!full) kept.push(board[r]);
  }
  const cleared = ROWS - kept.length;
  const result: Board = new Array(ROWS);
  for (let i = 0; i < cleared; i++) result[i] = makeRow();
  for (let i = 0; i < kept.length; i++) result[cleared + i] = kept[i];
  return { board: result, cleared };
}

export function getSpeed(level: number): number {
  return Math.max(100, 1100 - level * 100);
}

export function calcScore(linesCleared: number, level: number): number {
  return (LINE_SCORES[linesCleared] || 0) * level;
}

/** Compute the ghost-piece Y (where the piece would land). */
export function ghostY(board: Board, piece: ActivePiece): number {
  let dy = 0;
  while (isValid(board, piece, 0, dy + 1)) dy++;
  return piece.y + dy;
}
