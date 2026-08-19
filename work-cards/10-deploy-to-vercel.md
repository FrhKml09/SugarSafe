# Work Card 10 — Deploy to Vercel

## Goal

Deploy SugarSafe to Vercel, configure the serverless function, and verify the live app works end-to-end.

## Inputs

- `build-blueprint.md`
- `architecture.md`
- `work-cards/09-testing-and-verification.md`

## Files likely touched

- `vercel.json` (create)
- `.env.production` or Vercel dashboard (set `GEMINI_API_KEY`)
- `package.json` (verify build script)

## Instructions for the coding agent

1. Verify `package.json` has:
   - `"type": "module"` (required for Vercel serverless functions)
   - `"scripts": { "dev": "vite", "build": "vite build", "preview": "vite preview" }`
2. Create `vercel.json`:
   ```json
   {
     "rewrites": [
       { "source": "/api/(.*)", "destination": "/api/$1" },
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```
3. Ensure `api/scan.js` is a valid Vercel serverless function (export default handler)
4. Ensure `.gitignore` includes `.env.local` and `.env.production`
5. Build the project: `npm run build`
6. Deploy to Vercel:
   - Push code to GitHub (if not already)
   - Connect repo to Vercel
   - Add `GEMINI_API_KEY` environment variable in Vercel dashboard
   - Deploy
7. Verify live URL:
   - Open deployed URL
   - Test camera/upload on mobile
   - Complete a scan flow
   - Confirm history persists across refresh
   - Confirm disclaimer visible

## What not to do

- Do not hardcode API keys
- Do not deploy without setting `GEMINI_API_KEY` in Vercel
- Do not add login or database
- Do not modify architecture after deployment
- Do not delete or overwrite production data

## Done when

- Live URL is accessible
- Scan flow works on live deployment
- Serverless function calls Gemini and returns results
- History persists across refresh
- Disclaimer visible on result screen
- No console errors on live site

## Verification steps

- [ ] `npm run build` succeeds
- [ ] Vercel deployment succeeds
- [ ] Live URL loads
- [ ] Scan flow works on live site
- [ ] History persists after refresh on live site
- [ ] No API key exposed in client code
- Design check: live site matches design.md — warm calm mood, sage green/terracotta palette, rounded cards, soft shadows, mobile-responsive, disclaimer visible, no medical/clinical styling.

## Localhost test before continuing

After deployment, test:

- [ ] Open live URL on mobile device or mobile emulator
- [ ] Confirm app loads with warm off-white background
- [ ] Complete a scan with a real photo
- [ ] Confirm result shows dish name, components, nutrition, suggestion, disclaimer
- [ ] Save to history, refresh browser — item persists
- [ ] Confirm no console errors in live DevTools

If all tests pass, reply:
```
Deployment complete. Live proof verified.
```

If anything fails, reply `fix` and describe the issue.

## Stop condition

If deployment fails after 10 minutes, stop and ask for help with Vercel setup.

## Status

Not started
