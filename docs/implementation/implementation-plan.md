# Meeting Bingo — Implementation Plan

## Context

Meeting Bingo is a browser-based bingo card game that uses live audio transcription to auto-detect corporate buzzwords during meetings. The repository currently contains only documentation (PRD, architecture doc, UX research) — no source code exists yet. The architecture doc at `docs/research/meeting-bingo-architecture.md` contains near-complete reference implementations for most modules, which we'll leverage directly.

**Tech stack:** React 18 + TypeScript, Vite, Tailwind CSS, Web Speech API, localStorage, canvas-confetti, Vercel deployment. Zero backend, zero cost.

---

## Phase 0: Project Scaffolding

**Goal:** Running Vite dev server with React + TypeScript + Tailwind.

**Create files:**
- `package.json` — dependencies from architecture doc (react, react-dom, canvas-confetti, tailwindcss, vite, typescript, etc.)
- `index.html` — entry point with `<div id="root">`
- `tsconfig.json` — strict mode, jsx react-jsx, include `env.d.ts`
- `vite.config.ts` — React plugin
- `tailwind.config.js` — custom animations (pulse-dot, bounce-in, fade-in)
- `postcss.config.js` — tailwindcss + autoprefixer
- `src/main.tsx` — ReactDOM.createRoot renders `<App />`
- `src/index.css` — Tailwind directives
- `src/App.tsx` — placeholder
- `public/favicon.svg` — simple icon

**Steps:** Create files → `npm install` → `npm run dev` → verify renders.

---

## Phase 1: Types, Data, and Pure Logic

**Goal:** All type definitions, buzzword data, and pure logic modules (no React).

**Create files:**
- `src/types/index.ts` — `CategoryId`, `BingoSquare`, `BingoCard`, `GameState`, `WinningLine`, `SpeechRecognitionState` interfaces
- `src/data/categories.ts` — 3 categories (Agile/Scrum, Corporate Speak, Tech/Engineering) with 40+ words each
- `src/lib/cardGenerator.ts` — Fisher-Yates shuffle, pick 24 words, 5x5 grid with free center
- `src/lib/bingoChecker.ts` — check 5 rows, 5 cols, 2 diagonals; `countFilled()`; `getClosestToWin()`
- `src/lib/wordDetector.ts` — normalize text, regex word boundaries, substring matching for phrases, alias support (CI/CD, MVP, ROI, etc.)
- `src/lib/shareUtils.ts` — `generateShareText()` (emoji grid), `copyToClipboard()`, `canNativeShare()`, `nativeShare()`
- `src/lib/utils.ts` — `cn()` className merger utility

**Verify:** Console-test `generateCard()`, `checkForBingo()`, `detectWords()` from App.tsx.

---

## Phase 2: UI Components (Bottom-Up)

**Goal:** All presentational components, wired for manual play (no speech yet).

**Create files:**
- `src/components/ui/Button.tsx` — variants: primary, secondary, ghost
- `src/components/ui/Card.tsx` — wrapper with padding/shadow
- `src/components/ui/Toast.tsx` — toast notification + container
- `src/components/BingoSquare.tsx` — states: default, filled, auto-filled (pulse), free space, winning (green)
- `src/components/BingoCard.tsx` — 5x5 CSS grid rendering BingoSquare components
- `src/components/TranscriptPanel.tsx` — live transcript display, listening indicator, detected words list
- `src/components/GameControls.tsx` — new card, listening toggle, back button
- `src/components/GameBoard.tsx` — composes BingoCard + TranscriptPanel + GameControls + header
- `src/components/LandingPage.tsx` — welcome screen, "New Game" CTA, how-it-works, privacy note
- `src/components/CategorySelect.tsx` — 3 category cards with icons, sample words, select buttons
- `src/components/WinScreen.tsx` — confetti on mount, winning card, stats, share + play-again buttons

**Update:** `src/App.tsx` — screen-based navigation (landing → category → game → win)

**Verify:** Full manual play flow works — landing → select category → click squares → get BINGO → confetti → share.

---

## Phase 3: Game State Management

**Goal:** Centralize game logic in hooks.

**Create files:**
- `src/hooks/useGame.ts` — state machine: `startGame()`, `toggleSquare()`, `fillSquare()`, `newCard()`, `resetGame()`. Inline BINGO detection on each fill.
- `src/hooks/useLocalStorage.ts` — generic localStorage persistence with JSON serialization

**Update:** `src/App.tsx` — replace inline state with `useGame()` hook

**Verify:** Manual play works end-to-end. Page refresh restores game state from localStorage.

---

## Phase 4: Speech Recognition Integration

**Goal:** Live audio transcription and automatic square filling.

**Create files:**
- `src/hooks/useSpeechRecognition.ts` — Web Speech API wrapper: continuous mode, interim results, auto-restart on silence, feature detection, error handling
- `src/types/speech.d.ts` — type augmentation for `webkitSpeechRecognition`

**Update:**
- `src/components/GameBoard.tsx` — wire speech hook, run `detectWordsWithAliases()` on transcript results, auto-fill matching squares
- `src/components/GameControls.tsx` — microphone toggle with listening state indicator

**Key details:**
- Only act on final results (not interim) for auto-fill reliability
- Auto-restart recognition when it stops due to silence
- Retry counter: give up after 3 consecutive restart failures within 5 seconds
- Graceful fallback: if Speech API unavailable (Firefox), show message and allow manual play

**Verify:** In Chrome — start listening → speak a buzzword → square auto-fills → transcript panel shows text. In Firefox — manual mode works with helpful message.

---

## Phase 5: Polish and Deploy

**Goal:** Visual polish, share, responsive design, deployment.

**Updates:**
- `src/components/WinScreen.tsx` — wire share functionality
- `src/components/BingoSquare.tsx` — fill animation (scale bounce on auto-fill)
- `src/components/ui/Toast.tsx` — wire toast system for "Detected: [word]", "Copied to clipboard!", errors
- `src/index.css` — custom transitions, responsive tweaks
- Multiple components — responsive text sizing (`text-[10px]` mobile → `text-sm` desktop)

**Deploy:**
1. `npm run build` — verify no TypeScript errors
2. `vercel` — deploy to Vercel
3. Verify full flow on deployed HTTPS URL (required for microphone access)

---

## Risk Mitigations

| Risk | Mitigation |
|------|-----------|
| Web Speech API unavailable | Feature detection + graceful fallback to manual mode |
| `recognition.start()` throws on restart | Retry counter (max 3 in 5s), show toast on failure |
| Missing `@types/canvas-confetti` | Install as devDep or add `declare module 'canvas-confetti'` |
| Long transcript performance | Only run detection on new final text, not cumulative |
| Punctuation in transcript | Strip all punctuation except apostrophes in normalizer |

---

## Verification Strategy

After each phase, verify the app works end-to-end:
1. **Phase 0:** Dev server runs, page renders with Tailwind styles
2. **Phase 1:** Console-test pure functions (card gen, bingo check, word detect)
3. **Phase 2:** Full manual play flow in browser
4. **Phase 3:** Game state persists across refresh
5. **Phase 4:** Speech auto-fills squares in Chrome
6. **Phase 5:** Share works, responsive on mobile, deployed URL functional

**Primary reference:** `docs/research/meeting-bingo-architecture.md` — contains reference implementations for types, logic, hooks, and components.
