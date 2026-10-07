/**
 * Tetris Sound Engine — Web Audio API synthesized sounds.
 * No external assets. Lazy-inits AudioContext on first call (browser autoplay policy).
 */

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

/* ── Helpers ── */

/** Play a single tone with attack/decay envelope */
function tone(
  freq: number,
  duration: number,
  wave: OscillatorType = "sine",
  volume = 0.3,
  delay = 0,
) {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = wave;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, ctx.currentTime + delay);
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + delay + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime + delay);
  osc.stop(ctx.currentTime + delay + duration + 0.01);
}

/** Play a frequency sweep (glide from startFreq to endFreq) */
function sweep(
  startFreq: number,
  endFreq: number,
  duration: number,
  wave: OscillatorType = "sine",
  volume = 0.3,
  delay = 0,
) {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = wave;
  osc.frequency.setValueAtTime(startFreq, ctx.currentTime + delay);
  osc.frequency.linearRampToValueAtTime(endFreq, ctx.currentTime + delay + duration);
  gain.gain.setValueAtTime(0, ctx.currentTime + delay);
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + delay + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime + delay);
  osc.stop(ctx.currentTime + delay + duration + 0.01);
}

/** Play two simultaneous tones (chord) */
function chord(
  freq1: number,
  freq2: number,
  duration: number,
  wave: OscillatorType = "sine",
  volume = 0.2,
  delay = 0,
) {
  tone(freq1, duration, wave, volume, delay);
  tone(freq2, duration, wave, volume, delay);
}

/* ── Sound Effects ── */

/** Subtle click when a piece locks into place */
export function pieceLock(): void {
  tone(200, 0.03, "square", 0.1);
}

/** Tiny blip on horizontal movement */
export function pieceMove(): void {
  tone(300, 0.02, "square", 0.06);
}

/** Quick whoosh sweep on rotation */
export function pieceRotate(): void {
  sweep(400, 600, 0.05, "triangle", 0.15);
}

/** Low thud on hard drop */
export function hardDropSound(): void {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(80, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.1);
  gain.gain.setValueAtTime(0.4, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.12);
  // Add a noise-like click on top
  tone(150, 0.03, "square", 0.15);
}

/** Single line clear — ascending chime C5 */
export function lineClear1(): void {
  tone(523.25, 0.15, "sine", 0.3);
}

/** Double line clear — C5 → E5 */
export function lineClear2(): void {
  tone(523.25, 0.1, "sine", 0.3, 0);
  tone(659.25, 0.12, "sine", 0.35, 0.1);
}

/** Triple line clear — C5 → E5 → G5 */
export function lineClear3(): void {
  tone(523.25, 0.08, "sine", 0.3, 0);
  tone(659.25, 0.08, "sine", 0.33, 0.08);
  tone(783.99, 0.12, "sine", 0.38, 0.16);
}

/** TETRIS! Quad line clear — epic C5 → E5 → G5 → C6 fanfare with sustain */
export function lineClear4(): void {
  tone(523.25, 0.1, "sine", 0.3, 0);
  tone(659.25, 0.1, "sine", 0.33, 0.08);
  tone(783.99, 0.1, "sine", 0.36, 0.16);
  // Big sustained C6 with harmonics
  tone(1046.5, 0.25, "sine", 0.4, 0.24);
  tone(1046.5, 0.25, "triangle", 0.15, 0.24);
  // Sub-octave rumble for weight
  tone(523.25, 0.2, "triangle", 0.12, 0.24);
}

/** Combo sound — rising pitch per combo count */
export function comboSound(comboCount: number): void {
  const freq = 440 + comboCount * 80;
  tone(freq, 0.1, "square", Math.min(0.25, 0.12 + comboCount * 0.02));
  // Add a shimmer overtone for combos ≥ 3
  if (comboCount >= 3) {
    tone(freq * 1.5, 0.08, "sine", 0.1, 0.03);
  }
  // Extra sparkle for big combos
  if (comboCount >= 5) {
    tone(freq * 2, 0.06, "sine", 0.08, 0.05);
  }
}

/** Milestone — triumphant fanfare with chords */
export function milestoneSound(): void {
  // C5 + E5 chord
  chord(523.25, 659.25, 0.2, "sine", 0.2, 0);
  // E5 + G5 chord
  chord(659.25, 783.99, 0.2, "sine", 0.22, 0.2);
  // G5 + C6 chord — big finish
  chord(783.99, 1046.5, 0.25, "sine", 0.25, 0.4);
  // Sparkle on top
  tone(1318.5, 0.15, "triangle", 0.1, 0.45);
}

/** Death — sad descending sawtooth sweep */
export function deathSound(): void {
  sweep(400, 100, 0.5, "sawtooth", 0.25);
  // Add a low rumble underneath
  sweep(200, 60, 0.4, "sine", 0.15, 0.05);
}

/** Game over — extended sad descending arpeggio E5→C5→A4→F4 */
export function gameOverSound(): void {
  tone(659.25, 0.2, "sawtooth", 0.2, 0);       // E5
  tone(523.25, 0.2, "sawtooth", 0.2, 0.2);      // C5
  tone(440.0, 0.2, "sawtooth", 0.2, 0.4);       // A4
  tone(349.23, 0.35, "sawtooth", 0.25, 0.6);    // F4 — longer, sadder
  // Low drone under the last note
  tone(174.61, 0.3, "sine", 0.1, 0.6);          // F3 undertone
}

/** Level up — fast ascending arpeggio C5→E5→G5→C6→E6 */
export function levelUpSound(): void {
  tone(523.25, 0.06, "triangle", 0.25, 0);      // C5
  tone(659.25, 0.06, "triangle", 0.27, 0.06);   // E5
  tone(783.99, 0.06, "triangle", 0.29, 0.12);   // G5
  tone(1046.5, 0.06, "triangle", 0.31, 0.18);   // C6
  tone(1318.5, 0.12, "triangle", 0.35, 0.24);   // E6 — sustained
  // Victory shimmer
  tone(1318.5, 0.1, "sine", 0.15, 0.28);
}

/** Swap — quick two-tone switch */
export function swapSound(): void {
  tone(500, 0.04, "triangle", 0.2, 0);
  tone(700, 0.06, "triangle", 0.25, 0.04);
}

/** Board clear (PERFECT CLEAR) — epic ascending fanfare with shimmer */
export function boardClearSound(): void {
  // Big ascending arpeggio: C5 → E5 → G5 → C6 → E6 → G6
  tone(523.25, 0.08, "triangle", 0.3, 0);
  tone(659.25, 0.08, "triangle", 0.32, 0.07);
  tone(783.99, 0.08, "triangle", 0.34, 0.14);
  tone(1046.5, 0.1, "triangle", 0.36, 0.21);
  tone(1318.5, 0.1, "triangle", 0.38, 0.28);
  tone(1567.98, 0.15, "triangle", 0.4, 0.35);
  // Sustained shimmer chord at the top
  chord(1046.5, 1567.98, 0.3, "sine", 0.2, 0.4);
  // Sparkle overtone
  tone(2093.0, 0.2, "sine", 0.12, 0.45);
  // Sub-bass rumble for weight
  tone(261.63, 0.3, "sine", 0.15, 0.35);
}

/** Celebration for finishing as the #1 high scorer. */
export function topScorerSound(): void {
  // A bright ascending fanfare with a sustained major chord.
  tone(659.25, 0.12, "triangle", 0.28, 0);
  tone(783.99, 0.12, "triangle", 0.3, 0.12);
  tone(1046.5, 0.16, "triangle", 0.34, 0.24);
  chord(1046.5, 1318.5, 0.35, "sine", 0.22, 0.38);
  tone(1567.98, 0.2, "sine", 0.13, 0.42);
}

/** Celebration for placing in the top ten. */
export function topTenSound(): void {
  tone(523.25, 0.1, "triangle", 0.24, 0);
  tone(659.25, 0.14, "triangle", 0.28, 0.1);
  tone(783.99, 0.22, "sine", 0.3, 0.22);
}
