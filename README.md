# 🎮 ServiceNow Tetris

A fully-featured Tetris game built as a ServiceNow UI Page with React, Canvas, and the Web Audio API. Playable on desktop and mobile.

**Play at:** `https://your-instance.service-now.com/tetris_game.do`

---

## 📋 Table of Contents

- [How to Play](#-how-to-play)
- [Controls — Desktop](#-controls--desktop)
- [Controls — Mobile](#-controls--mobile)
- [Pieces](#-pieces)
- [Scoring](#-scoring)
- [Combo System](#-combo-system)
- [Line Clear Effects](#-line-clear-effects)
- [Perfect Clear Bonus](#-perfect-clear-bonus)
- [Levels & Speed](#-levels--speed)
- [Swap Mechanic](#-swap-mechanic)
- [Lives System](#-lives-system)
- [Wall Kick Rotation](#-wall-kick-rotation)
- [Milestones](#-milestones)
- [High Scores & Congratulations](#-high-scores--congratulations)
- [Sound Effects](#-sound-effects)
- [Accessibility](#-accessibility)
- [Security](#-security)
- [Technical Architecture](#-technical-architecture)

---

## 🕹️ How to Play

1. Enter your name on the start screen and click **Start Game**
2. Guide falling pieces to complete horizontal lines across the board
3. Completed lines are cleared and you earn points
4. Build combos by clearing lines consecutively for bonus points
5. The game ends when all 3 lives are lost (a piece can't be placed)
6. Your score is automatically saved to the public leaderboard

---

## ⌨️ Controls — Desktop

| Key | Action |
|-----|--------|
| **← →** Arrow Keys | Move piece left / right |
| **↑** Arrow Up | Rotate piece clockwise (with wall kicks) |
| **↓** Arrow Down | Soft drop (faster fall) |
| **Space** | Hard drop (instant drop to bottom) |
| **⇧ Shift** | Swap current piece with next piece |
| **Esc** | Pause / Resume game |

---

## 📱 Controls — Mobile

The game is fully playable on phones and tablets. Touch controls appear automatically on touch-capable devices.

### Touch Buttons

Three rows of buttons appear below the game board:

```
┌──────────┬──────────┬──────────┐
│ ⟳ Rotate │ ⇧ Swap   │ ⏸ Pause  │
├──────────┼──────────┼──────────┤
│ ◀ Left   │ ▼ Drop   │ ▶ Right  │
├──────────┴──────────┴──────────┤
│          ⏬ Hard Drop            │
└─────────────────────────────────┘
```

### Canvas Swipe Gestures

You can also control pieces directly by touching/swiping the game board:

| Gesture | Action |
|---------|--------|
| **← Swipe Left** | Move piece left |
| **→ Swipe Right** | Move piece right |
| **↓ Swipe Down** | Soft drop |
| **↑ Swipe Up** | Swap piece |
| **Tap** | Rotate piece |
| **Long Press** (300ms+) | Hard drop |

### Mobile Layout

On screens ≤768px, the layout adapts automatically:
- Switches to a single-column vertical stack
- Hides desktop side panels (left/right)
- Shows a compact **mobile stats bar** (Lines, Lives, Swap, Next preview)
- Displays touch control buttons at the bottom
- Canvas scales to fit screen width
- Page scroll and zoom are disabled to prevent interference

---

## 🧩 Pieces

### Standard Pieces (7)

| Piece | Shape | Color |
|-------|-------|-------|
| **I** | ████ | Sky Blue `#56B4E9` |
| **O** | ██ / ██ | Yellow `#F0E442` |
| **T** | ▄█▄ / ███ | Pink `#CC79A7` |
| **S** | ▄██ / ██▄ | Teal `#009E73` |
| **Z** | ██▄ / ▄██ | Vermillion `#D55E00` |
| **J** | █▄▄ / ███ | Blue `#0072B2` |
| **L** | ▄▄█ / ███ | Amber `#E69F00` |

### Bonus Pieces (3) — ~15% spawn chance, glow effect

| Piece | Shape | Color |
|-------|-------|-------|
| **Plus (+)** | Cross shape | White `#FFFFFF` |
| **Corner (⌐)** | L-shape variant | Grey `#999999` |
| **Zigzag** | Extended zigzag | Light Cyan `#66CCEE` |

> **Anti-repeat:** The same piece cannot appear 3 times in a row. The engine re-rolls up to 5 times to ensure variety.

---

## 📊 Scoring

### Base Line Clear Points

Points are multiplied by your current level:

| Lines Cleared | Base Points | × Level 1 | × Level 5 | × Level 10 |
|---------------|-------------|-----------|-----------|------------|
| 1 line | 100 | 100 | 500 | 1,000 |
| 2 lines | 300 | 300 | 1,500 | 3,000 |
| 3 lines | 500 | 500 | 2,500 | 5,000 |
| 4 lines (Tetris!) | 800 | 800 | 4,000 | 8,000 |

**Formula:** `Base Points × Current Level`

---

## 🔥 Combo System

Every **consecutive** piece that clears at least one line builds your combo. The combo bonus **scales with your level**:

**Formula:** `Combo Count × 100 × Current Level`

| Combo | Level 1 | Level 3 | Level 5 | Level 10 |
|-------|---------|---------|---------|----------|
| x1 | +100 | +300 | +500 | +1,000 |
| x2 | +200 | +600 | +1,000 | +2,000 |
| x3 | +300 | +900 | +1,500 | +3,000 |
| x5 | +500 | +1,500 | +2,500 | +5,000 |
| x10 | +1,000 | +3,000 | +5,000 | +10,000 |

> **Combo resets to x0** when a piece locks without clearing any lines.

### Example — Total Score for a Single Clear

At Level 5, combo x3, clearing 2 lines:
- Line clear: 300 × 5 = **1,500**
- Combo bonus: 3 × 100 × 5 = **1,500**
- **Total: 3,000 points**

---

## ✨ Line Clear Effects

When lines are cleared, an animated visual effect plays on the board BEFORE the rows are removed. The game briefly pauses during the animation:

| Lines Cleared | Effect | Duration |
|---------------|--------|----------|
| **1 line** | White flash across the row — fades in/out | 150ms |
| **2 lines** | Blue gradient wave sweeping left → right | 200ms |
| **3 lines** | Gold shimmer with double sine-wave pulse + per-cell sparkle | 300ms |
| **4 lines (TETRIS!)** | 🌈 Rainbow color cycling per block + screen shake + white flash | 400ms |

During the animation, keyboard/touch input and gravity are frozen.

---

## 🌟 Perfect Clear Bonus

When ALL blocks on the board are cleared (completely empty board after a line clear):

**Bonus: 1,000 × Current Level**

| Level | Perfect Clear Bonus |
|-------|-------------------|
| 1 | 1,000 |
| 5 | 5,000 |
| 10 | 10,000 |

### Visual Effects Per Level Range

| Level Range | Visual Effect | Toast |
|-------------|--------------|-------|
| **1–3** | White screen flash fading out | ⭐ PERFECT CLEAR |
| **4–6** | 3 golden pulse rings expanding from center | 🌟 PERFECT CLEAR |
| **7–9** | 8 cyan lightning bolts radiating from center | 💫 PERFECT CLEAR |
| **10** | Rainbow spiral + screen flash | 🔥 PERFECT CLEAR |

---

## ⏩ Levels & Speed

Level increases every **10 lines cleared** (max Level 10). Each level makes pieces fall faster:

| Level | Drop Speed | Lines Required |
|-------|-----------|----------------|
| 1 | 1,000ms | 0 |
| 2 | 900ms | 10 |
| 3 | 800ms | 20 |
| 4 | 700ms | 30 |
| 5 | 600ms | 40 |
| 6 | 500ms | 50 |
| 7 | 400ms | 60 |
| 8 | 300ms | 70 |
| 9 | 200ms | 80 |
| 10 | 100ms | 90 |

> A level-up triggers a sound effect and resets your swap counter.

---

## 🔄 Swap Mechanic

Press **⇧ Shift** (desktop) or **⇧ Swap button / Swipe Up** (mobile) to swap your current falling piece with the next piece in the queue.

### Swap Limits Per Level

| Level | Swaps Allowed |
|-------|--------------|
| 1 | 1 |
| 2 | 2 |
| 3 | 3 |
| ... | ... |
| 10 | 10 |

**Rules:**
- Swap counter **resets when you level up**
- The swap is **blocked** if the new piece can't fit on the board
- The sidebar shows remaining swaps: e.g. `2 / 5`

---

## ❤️ Lives System

You start with **3 lives** (❤️❤️❤️).

**When a new piece can't be placed:**
1. You lose 1 life → 💔 broken heart animation on screen
2. The **entire board is cleared** — fresh start
3. Your score, level, and lines carry over
4. Game continues until all 3 lives are lost → **Game Over**

---

## 🔃 Wall Kick Rotation

Rotation uses **wall kicks** — when a rotated piece would collide with a wall or locked blocks, the engine tries shifting the piece to find a valid position:

- **Standard pieces** (T/S/Z/J/L/bonus): 6 kick offsets — `(0,0) → (±1,0) → (0,-1) → (±1,-1)`
- **I piece**: 11 kick offsets — wider range `(±1,0) → (±2,0) → (0,-1) → (±1,-1) → (±2,-1) → (0,-2)`

This means the I piece can rotate even when flush against a wall — it kicks 1-2 cells away to find room.

---

## 🏆 Milestones

Floating messages appear on screen when you reach cumulative line-clear thresholds:

| Lines Cleared | Message | Sound |
|---------------|---------|-------|
| 20 | **Good!** | Fanfare |
| 40 | **Great!** | Fanfare |
| 60 | **You're a Tetris Pro!** | Fanfare |
| 100 | **You're a Tetris God!** | Fanfare |
| 150 | **INSANE!** | Fanfare |

> Milestone toasts appear at the top of the board. They show independently of combo toasts (bottom) and death effects (center).

---

## 🏅 High Scores & Congratulations

- Top 10 scores displayed on the **right panel** during gameplay (refreshes every 30s)
- Scores are also shown on the **Game Over** screen
- Your score is **automatically saved** when the game ends
- After the save completes, the game checks the leaderboard and shows an in-game congratulations banner with a rank-specific sound for #1 or top-10 placement
- Stored in the `u_tetris_high_scores` table via GlideAjax
- 🥇 Gold / 🥈 Silver / 🥉 Bronze highlighting for top 3

### Congratulations Banners

When the game ends, if your score ranks on the leaderboard:

| Rank | Banner |
|------|--------|
| **#1** | 👑 **Congratulations! You are the #1 Top Scorer!** (gold border) |
| **#2–10** | 🎉 **Congratulations! You made it to the Top 10! (#N)** (blue border) |

Your row in the leaderboard table is highlighted with **"← You"** marker.

---

## 🔊 Sound Effects

All sounds are synthesized using the **Web Audio API** — no external files needed.

| Event | Sound |
|-------|-------|
| Piece move (← →) | Subtle click |
| Piece rotate (↑) | Quick whoosh sweep |
| Hard drop (Space) | Low thud + click |
| Piece lock | Soft click |
| 1 line clear | Ascending chime (C5) |
| 2 line clear | Two-note chime (C5 → E5) |
| 3 line clear | Three-note arpeggio (C5 → E5 → G5) |
| 4 line clear (Tetris!) | Full fanfare (C5 → E5 → G5 → C6) with harmonics |
| Perfect clear | Epic 6-note ascending fanfare with shimmer chord |
| Combo (x2+) | Rising pitch per combo count + shimmer at x3+ |
| Milestone | Triumphant chord progression |
| Level up | Fast ascending arpeggio (C5 → E6) |
| Life lost | Descending sawtooth sweep |
| Game over | Sad descending arpeggio (E5 → F4) |
| #1 high score | Bright ascending champion fanfare |
| Top 10 high score | Short ascending placement chime |
| Swap (⇧) | Quick two-tone switch |

---

## ♿ Accessibility

- **Colorblind-safe palette** — Wong (2011) scientifically-proven colors distinguishable under Protanopia, Deuteranopia, and Tritanopia
- **Ghost piece** — translucent outline shows where the piece will land
- **Keyboard-only controls** — fully playable without a mouse
- **Touch controls** — fully playable on mobile with buttons and swipe gestures
- **High contrast** — dark background with bright, distinct piece colors
- **Sound feedback** — audio cues for every action (no visual-only feedback)
- **Wall kicks** — pieces rotate even near walls, reducing frustration

---

## 🛡️ Security

### Public Access
- The game page and high scores are accessible to **anyone** — no login required
- ACLs on `u_tetris_high_scores` use the **Public** role for both read and create
- Score API uses **GlideAjax** (`xmlhttp.do`) which bypasses CSRF token requirements
- Share the link with anyone — `https://your-instance.service-now.com/tetris_game.do`

### Rate Limiting
- **Business Rule** limits score submissions to **10 per user per minute**
- Prevents automated abuse / spam of the score table
- Aborts insert with error message if limit exceeded

### Platform Security
- ServiceNow platform provides network-level DDoS protection (WAF, CDN)
- No external scripts or CDN dependencies
- All code runs on the ServiceNow instance — no third-party services

---

## 🏗️ Technical Architecture

### Stack
- **Frontend:** React 19, HTML5 Canvas, Web Audio API, TypeScript
- **Backend:** GlideAjax Script Include, Business Rules
- **Platform:** ServiceNow UI Page (`sys_ui_page`)

### File Structure
```
src/
├── client/
│   ├── index.html              # Entry point (viewport meta for mobile)
│   ├── main.tsx                 # React bootstrap
│   ├── app.tsx                  # Screen router (start → game → gameover)
│   ├── app.css                  # Global styles + mobile scroll lock
│   ├── components/
│   │   ├── StartScreen.tsx      # Name entry + start
│   │   ├── TetrisGame.tsx       # Main game (canvas + sidebar + mobile)
│   │   ├── TetrisGame.css       # Grid layout + responsive breakpoints
│   │   ├── MobileControls.tsx   # Touch button controls
│   │   ├── MobileControls.css   # Touch button styling
│   │   ├── GameOver.tsx         # Final stats + congrats + high scores
│   │   └── HighScoresPanel.tsx  # Live leaderboard (auto-refresh)
│   ├── game/
│   │   ├── engine.ts            # Game logic, wall kicks, board clear
│   │   └── sounds.ts            # Web Audio API synthesized sounds
│   └── services/
│       └── ScoreService.ts      # GlideAjax calls for high scores
├── fluent/
│   ├── tables/                  # u_tetris_high_scores table
│   ├── ui-pages/                # UiPage at tetris_game.do
│   ├── navigation/              # App menu + module
│   ├── security/                # ACLs with Public role
│   ├── business-rules/          # Rate limiting
│   └── script-includes/         # TetrisScoreAjax (GlideAjax)
└── server/
    └── business-rules/          # Rate limit script (server-side)
```

### Key Design Decisions
- **Canvas rendering** — 60fps game loop with requestAnimationFrame
- **Two-phase line clear** — detect full rows → animate → clear → score → spawn
- **No external assets** — all sounds synthesized, no images or fonts loaded
- **Prototype.js safe** — avoids `Array.from` patterns that conflict with ServiceNow's Prototype.js
- **Capture-phase keyboard** — events use `capture: true` to prevent Polaris iframe interception
- **GlideAjax for public API** — bypasses CSRF, works for unauthenticated users
- **3 independent toast channels** — milestone, combo, and death effects render simultaneously
- **Wall kick rotation** — SRS-style offsets for standard (6) and I-piece (11)
- **Anti-repeat RNG** — 2-slot history buffer prevents 3 consecutive identical pieces
- **Responsive mobile layout** — CSS grid → flex column at ≤768px, touch-action: none
- **Game actions ref** — bridges keyboard handler and MobileControls via shared ref

---

*Built with ❤️ on ServiceNow*
