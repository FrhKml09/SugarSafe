# Work Card 03 — API Client and Serverless Function

## Goal

Create the frontend API client and the Vercel serverless function that securely calls the Google Gemini vision model.

## Inputs

- `build-blueprint.md`
- `architecture.md`
- `work-cards/01-project-skeleton.md`

## Files likely touched

- `src/utils/api.js` (implement)
- `api/scan.js` (implement)
- `.env` or `.env.local` (create, for local dev)

## Instructions for the coding agent

### Frontend API Client (`src/utils/api.js`)

1. Create `api.js` with an `analyzeFoodImage(imageFile)` async function
2. Convert `imageFile` to base64 using `FileReader`
3. Send `POST` to `/api/scan` with JSON body: `{ image: base64String, mimeType }`
4. Return the parsed JSON response
5. Handle network errors and non-200 responses with clear error messages
6. Export `analyzeFoodImage` as default

### Serverless Function (`api/scan.js`)

1. Create `api/scan.js` as a Vercel serverless function (Node.js runtime)
2. Accept `POST` requests with JSON body containing `image` (base64) and `mimeType`
3. Read `GEMINI_API_KEY` from environment variables (never expose in client)
4. Call Google Gemini vision API with the image and a system prompt requesting structured JSON output with these fields:
   - `dishName`
   - `components` (array)
   - `confidence` (0–1)
   - `estimatedPortion`
   - `estimatedNutrition` (object with carbohydrates, calories, sugar)
   - `observations`
   - `suggestion`
5. Validate the response has required fields; if missing, return fallback safe values
6. Return `{ success: true, data: { ... } }` or `{ success: false, error: "..." }`
7. Set CORS headers to allow frontend origin

### Environment Variables

1. Create `.env.local` with `GEMINI_API_KEY=your_key_here`
2. Create `.env.example` with placeholder (do not include real key)
3. Add `.env.local` to `.gitignore`

## What not to do

- Do not expose `GEMINI_API_KEY` in any client-side code
- Do not hardcode the API key
- Do not use a backend framework beyond Vercel serverless functions
- Do not add authentication or login
- Do not call the Gemini API directly from the browser
- Do not implement any UI yet

## Done when

- `src/utils/api.js` exports `analyzeFoodImage`
- `api/scan.js` is a valid Vercel serverless function
- `.env.local` exists with placeholder
- `.env.example` exists with placeholder
- `.env.local` is in `.gitignore`

## Verification steps

- [ ] Run `npm run dev` — app loads
- [ ] In browser console, `import api from './utils/api.js'` — function exists
- [ ] Check `api/scan.js` has correct export structure
- [ ] Confirm `.env.local` is in `.gitignore`
- Design check: no visual changes yet; backend plumbing only.

## Localhost test before continuing

After this card, test:

- [ ] Run `npm run dev` and confirm app loads
- [ ] In browser console, verify `api.analyzeFoodImage` is a function
- [ ] Check `api/scan.js` exports a valid handler
- [ ] Confirm `.env.local` exists and `.gitignore` blocks it
- [ ] No API key visible in any client-side file

If all tests pass, reply `continue`.
If anything fails, reply `fix` and paste the error or describe what you see.

## Stop condition

If Vercel serverless function structure causes build errors, stop and verify Vercel setup.

## Status

Not started
