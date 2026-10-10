# React Music Player

A small music player web app built with **React 19 + TypeScript + Vite**. It plays a local song library, lets you create and manage playlists, and persists your playlists in the browser between sessions.

This README explains the whole scenario of the project: what it does, how it is structured, how data flows, and how to run it.

---

## Overview

The app is a single-page application with a persistent audio player docked on the left and a primary content area on the right. The player keeps playing while you navigate between two views:

- **All Songs** — the full song library, where clicking a song plays it.
- **Playlists** — create playlists, search for songs to add, play songs from a playlist, and delete playlists.

All shared state (current song, playback, volume, playlists, etc.) lives in a single React Context (`MusicContext`) so that every component reads from and writes to the same source of truth.

---

## Features

- **Audio playback** with play / pause, next / previous track.
- **Seek bar** to jump to any position, plus live current-time and duration labels.
- **Volume control** slider.
- **Auto-advance** to the next song when a track ends.
- **All Songs view** highlighting the currently playing track.
- **Playlist management**
  - Create playlists by name.
  - Search songs by title or artist and add them from a dropdown.
  - Songs already in a playlist are filtered out of the search results.
  - Play a song directly from a playlist.
  - Delete a playlist with a confirmation prompt.
- **Persistence** — playlists are saved to `localStorage` and restored on reload.
- **Routing** between views using React Router.

---

## Tech Stack

| Area | Choice |
| --- | --- |
| UI library | React 19 |
| Language | TypeScript |
| Build tool | Vite 8 |
| Routing | React Router 8 (`react-router`) |
| Compiler | React Compiler (via `babel-plugin-react-compiler`) |
| Linting / formatting | ESLint (flat config, type-aware) + Prettier |
| State | React Context + hooks |

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
│  ├─ icons.svg
│  └─ songs/
│     ├─ egyptian.mp3
│     └─ paap.mp3
├─ src/
│  ├─ components/
│  │  ├─ Navbar.tsx        # Top navigation between All Songs and Playlists
│  │  ├─ MusicPlayer.tsx   # Persistent audio player (controls, seek, volume)
│  │  ├─ AllSongs.tsx      # Song library grid
│  │  └─ Playlists.tsx     # Playlist creation and management
│  ├─ contexts/
│  │  └─ MusicContext.tsx  # Shared state, song data, and actions
│  ├─ interfaces/
│  │  ├─ Song.ts              # Song shape
│  │  ├─ Playlist.ts          # Playlist shape
│  │  └─ MusicContextValue.ts # Context value type
│  ├─ App.tsx              # Routing + layout, wraps app in MusicProvider
│  ├─ main.tsx             # React entry point
│  └─ index.css            # Global styles
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
       └─ <MusicProvider>            (src/contexts/MusicContext.tsx)
            ├─ <Navbar />
            ├─ <MusicPlayer />        (always mounted, left panel)
            └─ <Routes>
                 ├─ "/"          → <AllSongs />
                 └─ "/playlists" → <Playlists />
```

`MusicProvider` holds every piece of music state and exposes it through context. Components call the `useMusicContext()` hook to read state and trigger actions. Keeping the player mounted outside the routes means playback continues uninterrupted while switching views.

### Context API

The context value is typed by `MusicContextValue` and includes:

**State**

- `songsList` — the full library of songs.
- `currentSong` / `currentSongIndex` — the active track and its index in `songsList`.
- `currentTime` / `duration` — playback position and length (seconds).
- `isPlaying` — playback flag.
- `volume` — 0 to 1.
- `playlists` — array of playlists.

**Actions**

- `handlePlaySong(song, index)` — select and play a song by identity and index.
- `play()` / `pause()` — start/stop playback.
- `nextSong()` / `prevSong()` — move through the library (wraps around).
- `createPlaylist(name)` — add a new empty playlist.
- `addSongToPlaylist(playlistId, song)` — append a song to a playlist.
- `deletePlaylist(id)` — remove a playlist.
- `setCurrentTime` / `setDuration` / `setVolume` / `setCurrentSong` — state setters used by the player and playlist views.
- `formatTime(seconds)` / `formatStringTime(string)` — time formatting helpers.

There is also a `useMusicContext()` hook that throws a clear error if used outside the provider, preventing hard-to-debug `undefined` context access.

---

## Data Models

### `Song` (`src/interfaces/Song.ts`)

```ts
interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string; // e.g. "7:45"
  url: string;      // e.g. "/songs/paap.mp3"
}
```

### `Playlist` (`src/interfaces/Playlist.ts`)

```ts
interface Playlist {
  id: string;
  name: string;
  songs: Song[];
}
```

### Song data

The bundled library is defined at the top of `src/contexts/MusicContext.tsx`. It currently contains two local tracks served from `public/songs/`:

- `Song 1` → `/songs/egyptian.mp3`
- `Song 2` → `/songs/paap.mp3`

Additional (commented-out) song entries using remote URLs are included as templates for adding more tracks.

---

## Components

### `Navbar`
Top navigation with links to `/` (All Songs) and `/playlists`. Highlights the active route using `useLocation`.

### `MusicPlayer`
Owns the `<audio>` element (via a `ref`) and keeps it in sync with context state:

- Applies `volume` whenever it changes.
- Calls `audio.play()` / `audio.pause()` based on `isPlaying`.
- Subscribes to `loadedmetadata` / `canPlay` (to read duration), `timeupdate` (to update current time), and `ended` (to auto-advance with `nextSong`).
- Reloads the audio and resets time/duration whenever `currentSong` changes.
- Renders the seek bar, time labels, previous/play-pause/next controls, and the volume slider.

### `AllSongs`
Renders the full `songsList` as a grid of cards. Clicking a card calls `handlePlaySong(song, index)`; the active song's card is highlighted based on `currentSongIndex`.

### `Playlists`
The most feature-rich view:

- A form to create a new playlist.
- Each playlist renders a search input; typing filters `songsList` by title/artist and excludes songs already in that playlist, showing matches in a dropdown.
- Clicking a dropdown item adds the song to the selected playlist.
- Playlist songs are listed and can be played by resolving the song's global index in `songsList` (needed so the player's `currentSongIndex` and previous/next navigation stay correct).
- A delete button removes a playlist after a `window.confirm` prompt.

---

## Persistence

Playlists are persisted in `localStorage` under the key `musicPlayer`:

- On mount, the provider reads the saved value and hydrates `playlists`.
- Whenever `playlists` changes, it is written back to `localStorage`.
- When the playlist collection becomes empty, the stored key is removed so stale data is not left behind.

Playback state (current song, time, volume, playing flag) is **not** persisted and resets on reload.

---

## Routing

Routing uses `react-router` with `BrowserRouter`:

| Path | View |
| --- | --- |
| `/` | `AllSongs` |
| `/playlists` | `Playlists` |

The `MusicPlayer` and `Navbar` sit outside `<Routes>`, so they remain mounted across navigation and playback is not interrupted.

---

## Adding Songs

1. Drop an audio file into `public/songs/`.
2. Add an entry to the `songs` array in `src/contexts/MusicContext.tsx` with a unique `id`, `title`, `artist`, `album`, `duration`, and a `url` pointing at the file (e.g. `/songs/my-track.mp3`).

---

## Configuration / Tooling

The project follows a shared, centralized configuration baseline:

- **ESLint** — flat config (`eslint.config.js`) with type-aware TypeScript rules, React hooks/refresh rules, and Prettier integration. See [eslint-prettier.md](./eslint-prettier.md).
- **Prettier** — `.prettierrc` and `.prettierignore`, enforced through the `prettier/prettier` lint rule.
- **TypeScript** — `tsconfig.json`, `tsconfig.app.json`, and `tsconfig.node.json`.
- **React Compiler** — enabled in `vite.config.ts` via `babel-plugin-react-compiler`.

---

## Known Limitations / Possible Improvements

- The song library is hard-coded; there is no upload or remote catalog.
- Playback state is not persisted across reloads.
- No shuffle, repeat, or drag-to-reorder playlist features yet.
- Playlists store full song objects rather than song ids, so playlist entries are not automatically updated if the library changes.
- No automated tests are configured yet.
