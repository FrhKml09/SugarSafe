# Work Card 01 — Project Scaffold

## Goal

Initialize the SugarSafe project with Vite + React, create the folder structure, and verify the dev server starts.

## Inputs

- `build-blueprint.md`
- `architecture.md`

## Files likely touched

- `package.json` (created)
- `vite.config.js` (created)
- `index.html` (created)
- `src/main.jsx` (created)
- `src/App.jsx` (created)
- `src/App.css` (created)
- `src/components/` (created)
- `src/utils/` (created)
- `api/` (created)

## Instructions for the coding agent

1. Scaffold a new Vite + React project named `sugarsafe` in the project root.
2. Install dependencies: `npm install`
3. Create folder structure: `src/components/`, `src/utils/`, `api/`
4. Create placeholder files in `components/`: `CameraCapture.jsx`, `ScanResult.jsx`, `HistoryList.jsx`, `Disclaimer.jsx`
5. Create placeholder files in `utils/`: `storage.js`, `api.js`
6. Create placeholder file in `api/`: `scan.js`
7. Verify `npm run dev` starts without errors.

## What not to do

- Do not add styling yet (except default Vite styling)
- Do not implement any component logic
- Do not add the serverless function logic yet
- Do not create `.gitignore`, `vercel.json`, or deploy configs yet
- Do not install extra packages beyond Vite + React defaults

## Done when

- `npm run dev` starts successfully
- App shell renders at localhost
- Folder structure matches architecture.md
- All placeholder files exist

## Verification steps

- [ ] Run `npm run dev` — no errors in terminal
- [ ] Open localhost in browser — blank app with Vite + React logo appears
- [ ] Confirm `src/components/` has 4 placeholder files
- [ ] Confirm `src/utils/` has 2 placeholder files
- [ ] Confirm `api/scan.js` exists
- Design check: app shell uses warm off-white background per design.md, no medical/clinical colors.

## Localhost test before continuing

After this card, test:

- [ ] Run `npm run dev` and confirm the app loads at localhost
- [ ] Confirm no console errors in browser DevTools
- [ ] Confirm the page title shows "SugarSafe" or similar

If all tests pass, reply `continue`.
If anything fails, reply `fix` and paste the error or describe what you see.

## Stop condition

If `npm run dev` fails to start after 5 minutes, stop and ask for help.

## Status

Not started
