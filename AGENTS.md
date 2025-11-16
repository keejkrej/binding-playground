# Repository Guidelines

## Project Structure & Module Organization
- `src/app/` holds the App Router entrypoints. `page.tsx` is a client component that boots the 3Dmol viewer; `page.module.css` and `globals.css` define both local and global styling. 3Dmol typing helpers live in `src/types/`.
- Static assets (favicons, etc.) live under `public/`. Build artifacts land in `.next/` when running dev or build, and should not be committed.

## Build, Test, and Development Commands
- `npm run dev` – Starts the Next.js dev server at `http://localhost:3000` with hot reload.
- `npm run lint` – Executes ESLint with the configuration in `eslint.config.mjs`.
- `npm run build` / `npm start` – Produces a production build and serves it locally. Run both before shipping changes touching the viewer logic.

## Coding Style & Naming Conventions
- TypeScript + React with functional components. Prefer hooks over legacy lifecycle APIs.
- Stick to 2-space indentation (auto-enforced by Prettier defaults baked into Next). Keep CSS modules scoped and descriptive (e.g., `.viewerPanel`).
- Import aliases: `@/*` resolves to `src/`. Use relative paths only inside tight module clusters.

## Testing Guidelines
- No dedicated unit test suite yet. Validate changes by exercising the viewer locally (`npm run dev`) and running `npm run build` to catch SSR issues (e.g., improper window usage). Add playwright/vitest coverage if you introduce complex logic.

## Commit & Pull Request Guidelines
- Follow conventional, action-oriented commits (e.g., `feat: enhance ligand contrast`). Group related file updates into a single commit.
- PRs should include: summary of visual or interaction changes, screenshots/GIFs for front-end tweaks, links to tracked issues, and notes on manual verification (lint/build/dev steps). Mention any new dependencies or scripts.

## Security & Configuration Tips
- 3Dmol runs on the client only; always guard imports with dynamic `import('3dmol')` to avoid SSR `window` errors.
- External data loads hit `https://files.rcsb.org`. Keep fetch URLs configurable if you later support alternate data sources or authenticated APIs.
