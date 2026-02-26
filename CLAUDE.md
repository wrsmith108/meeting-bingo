# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Meeting Bingo — a browser-based bingo card game that uses live audio transcription (Web Speech API) to auto-detect corporate buzzwords during meetings. Single-player, zero-backend, zero-cost. Integrates with the Linear API for project management.

## Status

The codebase is in pre-implementation. `docs/` contains the PRD, architecture plan, UX research, and implementation plan. No source code exists yet. The architecture doc (`docs/research/meeting-bingo-architecture.md`) contains near-complete reference implementations for all modules.

## Architecture

- **Stack:** React 18 + TypeScript, Vite, Tailwind CSS, canvas-confetti
- **Speech:** Web Speech API (browser-native, free, no API keys)
- **State:** React useState + Context, persisted to localStorage
- **Deployment:** Vercel (free tier)
- **No backend** — everything runs client-side

### Screen flow

Landing Page -> Category Selection (Agile/Corporate/Tech) -> Game Board (5x5 bingo card + live transcript) -> Win Screen (confetti + share)

### Key modules (planned under `src/`)

- `lib/cardGenerator.ts` — Fisher-Yates shuffle, 24 words + free center space
- `lib/bingoChecker.ts` — checks 5 rows, 5 cols, 2 diagonals for wins
- `lib/wordDetector.ts` — normalized regex matching with alias support (CI/CD, MVP, ROI)
- `hooks/useSpeechRecognition.ts` — Web Speech API wrapper with continuous mode and auto-restart
- `hooks/useGame.ts` — game state machine (idle -> setup -> playing -> won)
- `data/categories.ts` — 3 buzzword categories with 40+ words each

## Development Commands

```bash
npm run dev          # Start Vite dev server (port 3000)
npm run build        # TypeScript check + Vite build
npm run preview      # Preview production build
npm run lint         # ESLint
npm run typecheck    # TypeScript --noEmit
vercel               # Deploy to Vercel
```

## Environment Setup

This project uses [varlock](https://varlock.dev/env-spec) for environment variable management with auto-generated TypeScript types (`env.d.ts`).

- **Schema:** `.env.schema` defines required variables and sensitivity
- **Load env:** `varlock load`
- **Run commands with env injected:** `varlock run -- <command>`

### Required Environment Variables

| Variable | Notes |
|---|---|
| `LINEAR_API_KEY` | Sensitive. Linear API key for project management integration. |

## Tools

- **Linear CLI:** installed globally as `@linear/cli`, invoked via `lin` (not `linear`). Run through varlock: `varlock run -- lin <command>`
- **Vercel CLI:** installed globally for deployment via `vercel`

## Key Documentation

- `docs/implementation/implementation-plan.md` — phased build plan (scaffolding -> types/logic -> UI -> state -> speech -> polish)
- `docs/research/meeting-bingo-architecture.md` — full architecture with reference implementations
- `docs/research/meeting-bingo-prd.md` — product requirements, user stories, acceptance criteria
