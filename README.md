# React Memory Card Game

A classic **Memory (Concentration) card game** built with **React 19 + TypeScript + Vite**. Flip cards two at a time and try to find all matching pairs in as few moves as possible.

This README explains the whole scenario of the project: what it does, how the game logic works, how the code is structured, and how to run and customize it.

---

## Overview

The app renders a 4x4 grid of 16 face-down cards (8 pairs of fruit emojis, shuffled on every game). Each turn, a player flips two cards:

- If the two cards **match**, they stay face-up and the score increases by one.
- If they **don't match**, they flip back after a short delay.

The game tracks the player's **score** (matched pairs) and **moves** (pair attempts). When every pair is matched, a congratulations message appears with the total number of moves, and the player can reset to play again.

All interactive state and rules live in a single custom hook, `useGameLogic`, keeping the components presentational and easy to reason about.

---

## Features

- **Shuffled deck** of 8 pairs (16 cards) on every load / reset.
- **Click-to-flip** cards with a 3D-style flip animation.
- **Match detection** with distinct behavior for matches and mismatches.
- **Input locking** while a pair is being evaluated, preventing rapid mis-clicks.
- **Move counter** and **score counter** shown in the header.
- **Win detection** with a congratulations message showing the final move count.
- **Reset button** to reshuffle and start over at any time.
- **Responsive layout** with breakpoints for tablet and mobile.

---

## Tech Stack

| Area | Choice |
| --- | --- |
| UI library | React 19 |
| Language | TypeScript |
| Build tool | Vite 8 |
| Compiler | React Compiler (via `babel-plugin-react-compiler`) |
| State | Custom React hook (`useGameLogic`) + `useState` |
| Styling | Plain CSS (`src/index.css`) |
| Linting / formatting | ESLint (flat config, type-aware) + Prettier |

---

## Getting Started

### Prerequisites

- Node.js (a recent LTS version) and npm.

### Install

```bash
npm install
```

### Run in development

```bash
npm run dev
```

Vite starts a dev server (usually at `http://localhost:5173`) with hot module replacement.

### Build for production

```bash
npm run build
```

This runs the TypeScript project build (`tsc -b`) and then `vite build`, outputting to `dist/`.

### Preview the production build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

---

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server. |
| `npm run build` | Type-check and build for production. |
| `npm run lint` | Run ESLint over the project. |
| `npm run preview` | Serve the built `dist/` locally. |

---

## Project Structure

```
react-demo-projects/
├─ public/
│  ├─ favicon.svg
│  └─ icons.svg
├─ src/
│  ├─ components/
│  │  ├─ Card.tsx        # A single card (front "?" / back emoji)
│  │  ├─ GameHeader.tsx  # Title, score, moves, and reset button
│  │  └─ WinMessage.tsx  # Congratulations banner shown on win
│  ├─ hooks/
│  │  └─ useGameLogic.ts # All game state and rules
│  ├─ interfaces/
│  │  └─ CardType.ts     # Card shape
│  ├─ App.tsx            # Card values, layout, and hook wiring
│  ├─ main.tsx           # React entry point
│  └─ index.css          # Global styles and animations
├─ index.html
├─ vite.config.ts
├─ tsconfig*.json
└─ package.json
```

---

## Architecture and Data Flow

```
main.tsx
  └─ App.tsx
       ├─ cardValues  ──────────────►  useGameLogic({ cardValues })
       │                                  ├─ cards
       │                                  ├─ scores
       │                                  ├─ moves
       │                                  ├─ isGameWon
       │                                  ├─ initializeCardGame()
       │                                  └─ handleCardClick(card)
       │
       ├─ <GameHeader scores moves onReset={initializeCardGame} />
       ├─ {isGameWon && <WinMessage moves={moves} />}
       └─ <div className="cards-grid">
             {cards.map(card => <Card card={card} onClick={handleCardClick} />)}
          </div>
```

- `App` defines the raw `cardValues` (the pairs of emojis) and passes them to the `useGameLogic` hook.
- The hook returns the shuffled `cards` plus the stats and handlers.
- `App` distributes that state to `GameHeader`, `WinMessage`, and the grid of `Card` components.
- `Card` is purely presentational: it renders based on `isFlipped` / `isMatched` and reports clicks back up via `onClick`.

State lives in one place (the hook); components never duplicate game rules.

---

## Game Logic (`src/hooks/useGameLogic.ts`)

The hook owns all state:

- `cards` — the current deck of `CardType` objects.
- `flippedCards` — ids of the currently face-up, unevaluated cards.
- `matchedCards` — ids of all cards that have been matched.
- `scores` — number of matched pairs.
- `moves` — number of pair attempts.
- `isLocked` — blocks input while a pair is being resolved.

### Initialization and shuffle

`initializeCardGame` copies `cardValues`, sorts with a random comparator to shuffle, then maps each entry to a card with a unique `id` (its index in the array):

```ts
const shuffleCards = [...cardValues].sort(() => Math.random() - 0.5);
const shuffledCards = shuffleCards.map((value, index) => ({
  id: index,
  value,
  isFlipped: false,
  isMatched: false,
}));
```

It then resets score, moves, flipped/matched lists, and the lock. A `useEffect` with an empty dependency array calls it once on mount, so the board is shuffled when the app loads.

### Handling a click

`handleCardClick` ignores clicks when:

- the card is already flipped or already matched, or
- the board is locked, or
- two cards are already flipped.

It then flips the clicked card and adds its id to `flippedCards`. When a second card is clicked (`flippedCards.length === 1` before this click), the pair is evaluated:

- **Match** (`firstCard.value === clickedCard.value`): after a `500ms` delay, both ids are added to `matchedCards`, the score increases by one, the cards are marked `isMatched`, and the selection clears.
- **Mismatch**: after a `1000ms` delay, both cards flip back, the selection clears, and the board unlocks.

`moves` increments once per pair attempt (i.e. when the second card of a pair is revealed). The `isLocked` flag plus the `setTimeout` delays let the player briefly see the cards before they flip back.

### Win condition

```ts
const isGameWon = matchedCards.length === cards.length && cards.length > 0;
```

When every card is matched, `App` renders the `WinMessage` with the final move count.

---

## Data Model (`src/interfaces/CardType.ts`)

```ts
interface CardType {
  id: number;      // unique identifier (the card's index)
  value: string;   // the emoji shown on the card's face
  isFlipped: boolean;
  isMatched: boolean;
}
```

---

## Components

### `Card`
Renders a single card with a hidden front (`?`) and a back showing `card.value`. Applies `flipped` and `matched` modifier classes for styling and forwards clicks to `onClick`.

### `GameHeader`
Shows the game title, the current **score** and **moves**, and a **Reset Game** button wired to `onReset`.

### `WinMessage`
A banner shown only when `isGameWon` is true. Displays "Congratulations!" and how many moves the win took.

---

## Styling (`src/index.css`)

- Dark theme with a centered layout and gradient accents.
- Cards use `transform-style: preserve-3d`, `backface-visibility`, and opacity transitions to create a flip effect.
- Matched cards get a green glow and are disabled via `pointer-events: none`.
- A `slideDown` keyframe animates the win message.
- Responsive breakpoints at `768px` and `480px` shrink the header and card fonts and tighten the grid gap.

The grid is fixed at four columns (`grid-template-columns: repeat(4, 1fr)`).

---

## Customization

### Change the emojis

Edit the `cardValues` array in `src/App.tsx`. Keep every value duplicated so each has a matching pair. For example, to use animals:

```ts
const cardValues = ["🐶", "🐱", "🐭", "🐹", "🐶", "🐱", "🐭", "🐹"];
```

### Change the difficulty / grid size

Because the grid is `repeat(4, 1fr)`, the layout is designed around a 4-column board. To change the number of pairs, update `cardValues` and adjust `grid-template-columns` in `src/index.css` to match the new board shape.

### Tune the flip-back timing

The mismatch delay (`1000ms`) and match delay (`500ms`) are hard-coded in `useGameLogic.ts` and can be adjusted to taste.

---

## Behavior Notes / Known Limitations

- Card `id` is assumed to equal its index in the array; the match logic relies on this (`cards[flippedCards[0]]`). Keep ids as sequential indices if you change the deck.
- Match/mismatch delays are fixed rather than configurable.
- Best-move tracking, high scores, and persistence across reloads are not included.
- The shuffle uses `Array.prototype.sort` with a random comparator, which is simple but not a perfectly uniform shuffle.
- No automated tests are configured.

---

## Tooling / Configuration

- **ESLint** — flat config (`eslint.config.js`) with type-aware TypeScript rules, React hooks/refresh rules, and Prettier integration. See [eslint-prettier.md](./eslint-prettier.md).
- **Prettier** — `.prettierrc` and `.prettierignore`, enforced through the `prettier/prettier` lint rule.
- **TypeScript** — `tsconfig.json`, `tsconfig.app.json`, and `tsconfig.node.json`.
- **React Compiler** — enabled in `vite.config.ts` via `babel-plugin-react-compiler`.
