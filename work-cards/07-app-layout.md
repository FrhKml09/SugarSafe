# Work Card 07 — App Layout and Navigation

## Goal

Wire all components together in App.jsx with view switching (Scan, History, About) and a bottom tab bar.

## Inputs

- `build-blueprint.md`
- `design.md`
- `work-cards/04-camera-capture.md`
- `work-cards/05-scan-result.md`
- `work-cards/06-history-component.md`

## Files likely touched

- `src/App.jsx` (implement)
- `src/App.css` (update)

## Instructions for the coding agent

1. Open `src/App.jsx`
2. Implement state management with `useState`:
   - `currentView`: 'scan' | 'history' | 'about'
   - `scanResult`: object or null
   - `history`: array (loaded from storage on mount)
3. Implement `handleCapture(file)`:
   - Show loading state
   - Call `api.analyzeFoodImage(file)`
   - On success, set `scanResult` and switch to result view
   - On error, show friendly error message
4. Implement `handleSaveToHistory()`:
   - Save `scanResult` to localStorage via `storage.addToHistory`
   - Update local `history` state
   - Show confirmation
5. Implement `handleDeleteHistory(id)`:
   - Delete from localStorage via `storage.deleteFromHistory`
   - Update local `history` state
6. Implement bottom tab bar (mobile):
   - 3 tabs: Scan (camera icon), History (list icon), About (info icon)
   - Active tab highlighted in sage green
   - 48px min height, full width
   - Fixed at bottom on mobile
7. Implement About view:
   - App name and tagline
   - Brief explanation (1–2 sentences)
   - Disclaimer text
   - No fake logos or testimonials
8. Ensure single-view rendering (no router needed)

## What not to do

- Do not add login or user accounts
- Do not add payment or backend database
- Do not add glucose logging yet
- Do not add routing library
- Do not use external state management

## Done when

- App switches between Scan, History, and About views
- Scan flow: capture → API call → result display → save to history
- History flow: list → expand → delete
- Tab bar navigation works on mobile
- All views render correctly at 320px–768px

## Verification steps

- [ ] Run `npm run dev` — app loads
- [ ] Switch between Scan, History, About tabs
- [ ] Capture photo → result appears → save to history
- [ ] Go to History → item appears → delete works
- [ ] Confirm localStorage has saved item
- [ ] Refresh browser — history persists
- [ ] No console errors
- Design check: tab bar, views, spacing, and all screens follow design.md — warm off-white background, sage green accents, rounded cards, 48px touch targets, friendly copy, no medical styling.

## Localhost test before continuing

After this card, test:

- [ ] Run `npm run dev` and open in mobile viewport (375px)
- [ ] Confirm tab bar visible at bottom with 3 items
- [ ] Tap Scan tab → camera/upload area visible
- [ ] Tap History tab → empty state or list visible
- [ ] Tap About tab → app info and disclaimer visible
- [ ] Complete a full scan flow: capture → result → save → check history
- [ ] Refresh browser — history item still appears
- [ ] Confirm no horizontal scroll on any view

If all tests pass, reply `continue`.
If anything fails, reply `fix` and paste the error or describe what you see.

## Stop condition

If the scan flow does not complete end-to-end, fix before continuing.

## Status

Not started
