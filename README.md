# 🎮 ServiceNow Tetris

A fully-featured Tetris game built as a ServiceNow UI Page with React, Canvas, and the Web Audio API.

**Play at:** `https://your-instance.service-now.com/tetris_game.do`

---

## 📋 Table of Contents

- [How to Play](#-how-to-play)
- [Controls](#-controls)
- [Pieces](#-pieces)
- [Scoring](#-scoring)
- [Combo System](#-combo-system)
- [Levels & Speed](#-levels--speed)
- [Swap Mechanic](#-swap-mechanic)
- [Lives System](#-lives-system)
- [Milestones](#-milestones)
- [High Scores](#-high-scores)
- [Sound Effects](#-sound-effects)
- [Accessibility](#-accessibility)
- [Security](#-security)
- [Technical Architecture](#-technical-architecture)

---

## 🕹️ How to Play

1. Enter your name on the start screen and click **Start Game**
2. Guide falling pieces to complete horizontal lines across the board
3. Completed lines are cleared and you earn points
4. The game ends when all 3 lives are lost (a piece can't be placed)
5. Your score is automatically saved to the leaderboard

---

## 🎯 Controls

| Key | Action |
|-----|--------|
| **← →** Arrow Keys | Move piece left / right |
| **↑** Arrow Up | Rotate piece clockwise |
| **↓** Arrow Down | Soft drop (faster fall) |
| **Space** | Hard drop (instant drop to bottom) |
| **⇧ Shift** | Swap current piece with next piece |
| **Esc** | Pause / Resume game |

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

Every **consecutive** piece that clears at least one line builds your combo. The combo bonus is **doubled by your level**:

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

Press **⇧ Shift** to swap your current falling piece with the next piece in the queue.

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

## 🏆 Milestones

Floating messages appear on screen when you reach cumulative line-clear thresholds:

| Lines Cleared | Message | Sound |
|---------------|---------|-------|
| 20 | **Good!** | Fanfare |
| 40 | **Great!** | Fanfare |
| 60 | **You're a Tetris Pro!** | Fanfare |
| 100 | **You're a Tetris God!** | Fanfare |
| 150 | **INSANE!** | Fanfare |

> Milestone toasts appear at the top of the board. They show independently of combo toasts (which appear at the bottom).

---

## 🏅 High Scores

- Top 10 scores displayed on the **right panel** during gameplay (refreshes every 30s)
- Scores are also shown on the **Game Over** screen
- Your score is **automatically saved** when the game ends
- Stored in the `u_tetris_high_scores` table with player name, score, and level
- 🥇 Gold / 🥈 Silver / 🥉 Bronze highlighting for top 3

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
| Combo (x2+) | Rising pitch per combo count + shimmer at x3+ |
| Milestone | Triumphant chord progression |
| Level up | Fast ascending arpeggio (C5 → E6) |
| Life lost | Descending sawtooth sweep |
| Game over | Sad descending arpeggio (E5 → F4) |
| Swap (⇧) | Quick two-tone switch |

---

## ♿ Accessibility

- **Colorblind-safe palette** — Wong (2011) scientifically-proven colors distinguishable under Protanopia, Deuteranopia, and Tritanopia
- **Ghost piece** — translucent outline shows where the piece will land
- **Keyboard-only controls** — fully playable without a mouse
- **High contrast** — dark background with bright, distinct piece colors
- **Sound feedback** — audio cues for every action (no visual-only feedback)

---

## 🛡️ Security

### Public Access
- Any authenticated ServiceNow user can play and submit scores
- ACLs on `u_tetris_high_scores` allow read + create for all logged-in users
- No role restrictions — share the link with anyone on your instance

### Rate Limiting
- **Business Rule** limits score submissions to **10 per user per minute**
- Prevents automated abuse / spam of the score table
- Aborts insert with error message if limit exceeded

### Platform Security
- ServiceNow platform provides network-level DDoS protection (WAF, CDN)
- All API calls use `X-UserToken` (CSRF protection)
- No external scripts or CDN dependencies

---

## 🏗️ Technical Architecture

### Stack
- **Frontend:** React 19, HTML5 Canvas, Web Audio API, TypeScript
- **Backend:** ServiceNow Table API, Business Rules
- **Platform:** ServiceNow UI Page (`sys_ui_page`)

### File Structure
```
src/
├── client/
│   ├── index.html          # Entry point
│   ├── main.tsx             # React bootstrap
│   ├── app.tsx              # Screen router (start → game → gameover)
│   ├── app.css              # Global styles
│   ├── components/
│   │   ├── StartScreen.tsx  # Name entry + start
│   │   ├── TetrisGame.tsx   # Main game (canvas + sidebar)
│   │   ├── GameOver.tsx     # Final stats + high scores
│   │   └── HighScoresPanel.tsx  # Live leaderboard
│   ├── game/
│   │   ├── engine.ts        # Pure game logic (board, pieces, collision, scoring)
│   │   └── sounds.ts        # Web Audio API synthesized sounds
│   └── services/
│       └── ScoreService.ts  # Table API for high scores
├── fluent/
│   ├── tables/              # u_tetris_high_scores table definition
│   ├── ui-pages/            # UiPage at tetris_game.do
│   ├── navigation/          # App menu + module
│   ├── security/            # ACLs for public access
│   └── business-rules/      # Rate limiting
└── server/
    └── business-rules/      # Rate limit script (server-side)
```

### Key Design Decisions
- **Canvas rendering** — 60fps game loop with requestAnimationFrame
- **No external assets** — all sounds synthesized, no images or fonts loaded
- **Prototype.js safe** — avoids `Array.from` patterns that conflict with ServiceNow's Prototype.js
- **Capture-phase keyboard** — events use `capture: true` to prevent Polaris iframe from eating arrow keys
- **3 independent toast channels** — milestone, combo, and death effects render simultaneously
- **Anti-repeat RNG** — 2-slot history buffer prevents 3 consecutive identical pieces

---

*Built with ❤️ on ServiceNow*
