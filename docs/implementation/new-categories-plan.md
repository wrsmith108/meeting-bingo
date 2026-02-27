# Implementation Plan: New Bingo Categories — Traffic, Kids, Hockey

## Overview

Add three new bingo card categories to the existing set (Agile, Corporate, Tech). Each new category follows the identical data structure and integrates into the existing card generation, word detection, and UI selection flows.

---

## Scope of Changes

### 1. Update `CategoryId` type (`src/types/index.ts`)

Extend the union type to include the new category IDs:

```typescript
export type CategoryId = 'agile' | 'corporate' | 'tech' | 'traffic' | 'kids' | 'hockey';
```

### 2. Add category data (`src/data/categories.ts`)

Append three new entries to the `CATEGORIES` array, each with 40+ words.

---

## New Categories

### Traffic (road commute bingo)

```typescript
{
  id: 'traffic',
  name: 'Traffic & Commute',
  description: 'Road rage, rubbernecking, and rush hour',
  icon: '🚗',
  words: [
    'rubbernecking', 'merge', 'tailgating', 'pothole', 'detour',
    'road rage', 'speed trap', 'fender bender', 'rush hour', 'gridlock',
    'construction zone', 'lane closed', 'bumper to bumper', 'alternate route', 'carpool lane',
    'red light', 'yellow light', 'u-turn', 'jaywalker', 'double parked',
    'parallel parking', 'road work ahead', 'wrong way', 'one way', 'dead end',
    'traffic cone', 'speed bump', 'roundabout', 'off ramp', 'on ramp',
    'shoulder', 'median', 'overpass', 'underpass', 'toll booth',
    'school zone', 'crosswalk', 'blind spot', 'cut off', 'brake check',
    'horn honking', 'turn signal', 'high beams', 'flat tire',
  ],
}
```

### Kids (things kids say/do)

```typescript
{
  id: 'kids',
  name: 'Kids Say & Do',
  description: 'Snack requests, meltdowns, and why why why',
  icon: '🧒',
  words: [
    'snack', 'why', 'no fair', 'are we there yet', 'I\'m bored',
    'he started it', 'she started it', 'not tired', 'five more minutes', 'watch me',
    'I don\'t wanna', 'tattle', 'meltdown', 'time out', 'bedtime',
    'screen time', 'play date', 'juice box', 'chicken nuggets', 'mac and cheese',
    'booger', 'potty', 'monster', 'imaginary friend', 'blankie',
    'sticker', 'cartoon', 'nap time', 'playground', 'recess',
    'show and tell', 'goldfish crackers', 'picky eater', 'sugar rush', 'temper tantrum',
    'inside voice', 'sharing is caring', 'because I said so', 'homework', 'lunchbox',
    'field trip', 'tooth fairy', 'training wheels', 'sippy cup',
  ],
}
```

### Hockey

```typescript
{
  id: 'hockey',
  name: 'Hockey',
  description: 'Breakaways, bar down, and beauty goals',
  icon: '🏒',
  words: [
    'hat trick', 'power play', 'penalty box', 'face off', 'breakaway',
    'slapshot', 'wrist shot', 'top shelf', 'bar down', 'five hole',
    'icing', 'offside', 'boarding', 'cross check', 'high sticking',
    'body check', 'hip check', 'deke', 'dangle', 'snipe',
    'empty net', 'pull the goalie', 'overtime', 'shootout', 'sudden death',
    'blue line', 'red line', 'crease', 'slot', 'point',
    'one timer', 'drop pass', 'odd man rush', 'line change', 'dump and chase',
    'forecheck', 'backcheck', 'neutral zone', 'power forward', 'enforcer',
    'goon', 'beauty', 'barn burner', 'shutout',
  ],
}
```

---

## Word Aliases (`src/lib/wordDetector.ts`)

Add aliases for terms the speech API may transcribe differently:

```typescript
// Traffic
'u-turn': ['u turn', 'uturn'],
'off ramp': ['offramp', 'off-ramp'],
'on ramp': ['onramp', 'on-ramp'],

// Hockey
'face off': ['faceoff', 'face-off'],
'slapshot': ['slap shot', 'slap-shot'],
'one timer': ['one-timer'],
'bar down': ['bardown'],
```

---

## UI Changes

### Category Selection Screen

No structural changes needed — the selection screen already renders from the `CATEGORIES` array. Adding entries to that array is sufficient. Verify:

- Grid layout still looks good with 6 cards (currently 3). May need to adjust from a 3-column row to a 2x3 or 3x2 grid on desktop.
- Mobile layout stacks correctly with 6 items.

---

## Implementation Steps

| Step | File(s) | Description |
|------|---------|-------------|
| 1 | `src/types/index.ts` | Add `'traffic' \| 'kids' \| 'hockey'` to `CategoryId` union |
| 2 | `src/data/categories.ts` | Add three new category objects to `CATEGORIES` array |
| 3 | `src/lib/wordDetector.ts` | Add word aliases for traffic and hockey terms |
| 4 | Category selection UI | Verify layout handles 6 categories; adjust grid if needed |
| 5 | Manual test | Select each new category, generate cards, verify 5x5 grid populates correctly |

---

## Validation Checklist

- [ ] Each category has 44 words (>= 40 minimum, >= 24 required)
- [ ] `CategoryId` type includes all 6 values
- [ ] `npm run typecheck` passes
- [ ] `npm run build` succeeds
- [ ] Card generation works for all 6 categories
- [ ] Word detection matches new terms in transcript text
- [ ] Category selection UI renders 6 cards without layout breakage
