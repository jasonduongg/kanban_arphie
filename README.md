# Task Tracker

Browser task tracker: list or Kanban, tickets with status/priority/labels, data in **localStorage** (no server).

## Run

```bash
npm install
npm run dev
```

Then open the URL Vite shows (often `http://localhost:5173`). `npm run build` makes a production bundle.

## What it does

- List view with filters; Kanban with four columns (Todo → Done). Backlog is a separate queue (modal), not a column.
- Create/edit tickets; activity history; keyboard shortcuts (`N` new, `F` search, `K`/`L` views, `Esc` close).

## How it’s built

**React + TypeScript + Vite + Tailwind.** `StoreProvider` (`src/store.tsx`) holds all tickets in state, saves to `localStorage`, and exposes `dispatch` for create/update/delete. UI lives under `src/components/`; helpers under `src/utils/`.
