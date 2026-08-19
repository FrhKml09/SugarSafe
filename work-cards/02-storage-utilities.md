# Work Card 02 — Storage Utilities

## Goal

Create localStorage helper functions for scan history so the app can save, load, and delete scan results.

## Inputs

- `build-blueprint.md`
- `architecture.md`
- `work-cards/01-project-skeleton.md`

## Files likely touched

- `src/utils/storage.js` (implement)

## Instructions for the coding agent

1. Open `src/utils/storage.js`
2. Implement these functions using plain JavaScript and `localStorage`:
   - `getHistory()` — returns array of history items from `sugarsafe_scan_history` key, or empty array if none
   - `addToHistory(item)` — adds a new item (with id and timestamp) to history, enforces max 50 items (FIFO eviction)
   - `deleteFromHistory(id)` — removes item by id
   - `clearHistory()` — removes all items
3. Each item must have: `id` (crypto.randomUUID()), `timestamp` (ISO string), `dishName`, `estimatedNutrition`, `suggestion`
4. Use try/catch for all localStorage operations to handle private browsing restrictions
5. Export all functions as named exports

## What not to do

- Do not use any external storage library
- Do not persist images or large data
- Do not add React hooks or context yet
- Do not modify App.jsx or any component yet
- Do not add backend calls

## Done when

- `src/utils/storage.js` exports all four functions
- Functions handle empty storage and max 50 items correctly
- No external dependencies added

## Verification steps

- [ ] Run `npm run dev` — app still loads
- [ ] In browser console, call `import { getHistory, addToHistory, deleteFromHistory }` and test each function
- [ ] Add 51 items, confirm only 50 remain (oldest evicted)
- [ ] Delete an item by id, confirm it is removed
- [ ] Clear history, confirm array is empty
- Design check: no visual changes expected; utility file only.

## Localhost test before continuing

After this card, test:

- [ ] Run `npm run dev` and open browser console
- [ ] Test `getHistory()` returns empty array initially
- [ ] Test `addToHistory({...})` adds an item with id and timestamp
- [ ] Test adding 51 items, confirm only 50 stored
- [ ] Test `deleteFromHistory(id)` removes the correct item
- [ ] Test `clearHistory()` empties the array

If all tests pass, reply `continue`.
If anything fails, reply `fix` and paste the error or describe what you see.

## Stop condition

If localStorage throws persistent errors in private browsing mode, note it and continue (storage will fail gracefully in that environment).

## Status

Not started
