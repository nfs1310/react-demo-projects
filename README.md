# 🚀 Crypto Tracker

A single-page cryptocurrency tracking application built with **React 19 + TypeScript + Vite**. It consumes the public [CoinGecko API](https://www.coingecko.com/en/api) to display live market data for the top 100 cryptocurrencies, with search, sorting, grid/list views, auto-refresh, and an interactive 7-day price chart for every coin.

This project lives on the **`4-crypto-website`** branch and is built on top of the shared template configuration (ESLint, Prettier, TypeScript, React Compiler) maintained in the base branch.

---

## Overview

The app is a two-page experience:

1. **Home (`/`)** — a live dashboard of the top 100 coins by market cap.
2. **Coin Detail (`/coin/:id`)** — a deeper look at a single coin, including price stats and a 7-day chart.

Data is fetched directly from CoinGecko's REST API in the browser — no backend, no API key required for the endpoints used.

---

## Features

### Home page

- **Live market list** — top 100 cryptocurrencies ranked by market cap.
- **Search** — filter coins instantly by name or symbol (case-insensitive).
- **Sorting** — by rank, name, price (asc/desc), 24h change, or market cap.
- **Grid / List views** — toggle between a responsive card grid and a stacked list.
- **Auto-refresh** — data reloads every **30 seconds**, with a live countdown timer and progress bar showing the last updated time.
- **Loading state** — animated spinner while data is being fetched.

### Coin detail page

- **Coin header** — logo, name, symbol, and market-cap rank.
- **Current price** with 24h high/low ranges and a colored change badge (green up / red down).
- **7-day price chart** — interactive line chart rendered with [Recharts](https://recharts.org/).
- **Key stats** — market cap, volume, circulating supply, and total supply.
- **Back navigation** and a graceful "Coin not found" fallback.

---

## Tech Stack

| Concern       | Choice                                                 |
| ------------- | ------------------------------------------------------ |
| UI library    | React 19                                               |
| Language      | TypeScript                                             |
| Build tool    | Vite 8                                                 |
| Routing       | React Router v8 (`BrowserRouter`, `Routes`)            |
| Charts        | Recharts                                               |
| Data source   | CoinGecko REST API                                     |
| Styling       | Plain CSS (`src/index.css`) — glassmorphism dark theme |
| Compiler      | React Compiler (via Babel plugin)                      |
| Lint / Format | ESLint (flat config) + Prettier                        |

---

## Project Structure

```
src/
├── api/
│   └── coinGecko.ts        # All CoinGecko API calls (markets, coin detail, chart)
├── components/
│   └── CryptoCard.tsx      # Card used in the Home grid/list
├── interfaces/
│   ├── Coin.ts             # Full coin detail response type
│   ├── Crypto.ts           # Market list item type (Home)
│   └── MarketChart.ts      # Price/market-cap/volume chart data type
├── pages/
│   ├── Home.tsx            # Dashboard: list, search, sort, auto-refresh
│   └── CoinDetail.tsx      # Single coin view + chart
├── utils/
│   └── formatter.ts        # Price + short-scale (B/T/M) number formatting
├── App.tsx                 # Route definitions
├── main.tsx                # React entry point
└── index.css               # Global styles
```

---

## Data Flow

```
CoinGecko API ──► src/api/coinGecko.ts ──► pages (Home / CoinDetail)
                                             │
                                             ├─► components (CryptoCard)
                                             └─► utils (formatter)
```

All API logic is centralized in `src/api/coinGecko.ts`:

| Function               | Endpoint                          | Used by    |
| ---------------------- | --------------------------------- | ---------- |
| `getCryptoData()`      | `/coins/markets` (USD, top 100)   | Home       |
| `getCryptoById(id)`    | `/coins/{id}` (market data only)  | CoinDetail |
| `gettDataForChart(id)` | `/coins/{id}/market_chart?days=7` | CoinDetail |

The API base URL is `https://api.coingecko.com/api/v3` and is defined as `BASE_URL` in that file.

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

Then open the URL printed by Vite (usually `http://localhost:5173`).

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

---

## Available Scripts

| Script            | Description                               |
| ----------------- | ----------------------------------------- |
| `npm run dev`     | Start the Vite dev server with HMR        |
| `npm run build`   | Type-check (`tsc -b`) and build with Vite |
| `npm run lint`    | Run ESLint across the project             |
| `npm run preview` | Serve the production build locally        |

---

## How It Works (key considerations)

- **Auto-refresh loop** — `Home.tsx` runs a 1-second interval that decrements a 30-second countdown; when it hits 30 (reset), the data reloads and the "last updated" time is refreshed.
- **Filtering & sorting** — derived in a `useEffect` that depends on `sortBy`, `cryptoList`, and `searchQuery`, producing a separate `filteredList` so the source data stays intact.
- **Request cancellation** — `CoinDetail.tsx` uses a `cancelled` flag in its `useEffect` cleanup to ignore state updates from out-of-date requests when the route changes.
- **Number formatting** — `formatPrice()` handles sub-cent prices (8 decimals) and normal currency formatting, while `formatToShortScale()` condenses large values into `M` / `B` / `T`.
- **No API key needed** — only public CoinGecko endpoints are used, which are rate-limited; heavy use may hit those limits.

---

## React Compiler

The React Compiler is enabled on this project through the Babel plugin in `vite.config.ts`. See the [React Compiler docs](https://react.dev/learn/react-compiler) for details. Note that this affects Vite dev and build performance.

---

## Shared Configuration

This branch inherits the project's shared tooling baseline:

- **ESLint** — `eslint.config.js` (flat config, type-aware TypeScript rules, React hooks/refresh rules, Prettier integration).
- **Prettier** — `.prettierrc` and `.prettierignore`.
- **TypeScript** — `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`.
- **Build** — `vite.config.ts`.
- **Setup notes** — see [eslint-prettier.md](./eslint-prettier.md) for how ESLint and Prettier are wired together.

---

## Security & Best Practices

- No API keys or secrets are required — only CoinGecko's public endpoints are used, so nothing sensitive is stored in the app.
- `.gitignore` excludes `node_modules`, `dist`, build outputs, and `*.local` files. If you later add secrets, add a `.env` entry to `.gitignore` before committing.
- Formatting and code quality are enforced through ESLint/Prettier; run `npm run lint` before committing.

---

## Disclaimer

Prices and market data are provided by the CoinGecko public API and are for informational/demo purposes only. This is a demo project and not financial advice.
