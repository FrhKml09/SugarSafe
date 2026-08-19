# Work Card 06 — History Component

## Goal

Build the history view that shows past scans from localStorage with expand, delete, and empty state.

## Inputs

- `build-blueprint.md`
- `design.md`
- `work-cards/02-storage-utilities.md`
- `work-cards/05-scan-result.md`

## Files likely touched

- `src/components/HistoryList.jsx` (implement)
- `src/App.css` (add styles)

## Instructions for the coding agent

1. Open `src/components/HistoryList.jsx`
2. Implement a component that:
   - Accepts `history` array prop from localStorage
   - Accepts `onDelete(id)` callback
   - Shows a list of past scans as cards
   - Each card shows: dish name, timestamp (friendly format), calorie estimate
   - Tap/click expands card to show full nutrition + suggestion
   - Delete button on each card (warm gray outline, no red)
   - Empty state when history is empty: centered icon-like element, friendly text ("No scans yet. Take a photo of your meal to get started!")
   - Uses `storage.js` functions for data operations
3. Style with plain CSS:
   - Cards: white background, 8px border-radius, soft shadow, 16px padding
   - Expanded card: shows full details
   - Delete button: warm gray outline, gray text, 48px min touch target
   - Empty state: centered, soft illustration-like icon (emoji or SVG), warm gray text
   - List: single column, 16px vertical rhythm

## What not to do

- Do not add edit functionality yet
- Do not add navigation or view switching here
- Do not call API from this component
- Do not persist images
- Do not use external list/table libraries

## Done when

- History list renders from localStorage data
- Cards expand on tap/click
- Delete removes item and updates list
- Empty state shows when no history
- Styling matches design.md

## Verification steps

- [ ] Run `npm run dev` — app loads
- [ ] Add items to history via storage utilities
- [ ] Confirm history list renders cards
- [ ] Confirm cards expand to show full details
- [ ] Confirm delete removes item
- [ ] Clear history — empty state appears
- [ ] Confirm no console errors
- Design check: history cards, empty state, delete button, and mobile stacking follow design.md — warm off-white background, rounded cards, sage green accents, 48px touch targets, friendly empty state text.

## Localhost test before continuing

After this card, test:

- [ ] Run `npm run dev` and open in mobile viewport (320px)
- [ ] Add 3 test items to history
- [ ] Confirm all 3 cards appear in list
- [ ] Tap a card — confirm it expands to show full details
- [ ] Tap delete — confirm item is removed
- [ ] Clear all history — confirm empty state appears with friendly text
- [ ] Confirm no horizontal scroll on mobile

If all tests pass, reply `continue`.
If anything fails, reply `fix` and paste the error or describe what you see.

## Stop condition

If delete does not update the UI, fix before continuing.

## Status

Not started
