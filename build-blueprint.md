# Build Blueprint

## Source Files

- `project-brief.md`
- `architecture.md`
- `design.md`

## Project Identity

**Name:** SugarSafe  
**Tagline:** Malaysian food photos → simple, culturally relevant diabetes guidance  
**Owner:** Farah Eiman Kamal  
**Inspiration:** Personal experience supporting a family member through diabetes management

## Build Shape

**Browser-local tool with server-side AI endpoint**

- Frontend: browser-local photo capture, upload, and results display
- Backend: Vercel serverless function as secure AI proxy
- Data: localStorage for history; no database for MVP

## Version-One Promise

A user can photograph a Malaysian dish, receive estimated nutrition with practical culturally relevant guidance, and see their scan history persist across browser refreshes — all with a calm, friendly interface and a visible medical disclaimer.

## Scope Lock

### Now
- Photo capture and upload UI (camera + file upload)
- Vercel serverless function (`/api/scan`) as secure AI proxy
- Google Gemini vision model for food recognition
- Structured nutrition display with practical guidance
- localStorage scan history (max 50 items)
- Medical disclaimer on every result screen
- Responsive mobile layout (320px–768px)

### Later
- Glucose logging and pattern comparison
- User profiles and preferences
- Expanded Malaysian food database
- Meal logging with timestamps
- Favorites and saved meals

### Never
- Blood glucose measurement or prediction
- Medication/insulin recommendations
- Diagnosis or medical advice
- Login, payments, or multi-user accounts
- Backend database for MVP

## Architecture Summary

- **Frontend:** Vite + React, plain CSS (mobile-first)
- **Backend:** Vercel serverless function (Node.js runtime) at `/api/scan`
- **AI:** Google Gemini vision model, called server-side only
- **Deployment:** Vercel (frontend + serverless function together)
- **Persistence:** Browser localStorage (`sugarsafe_scan_history`, max 50 items)
- **No API keys in client code**

### Key Files
- `src/App.jsx` — main layout, view switching
- `src/components/CameraCapture.jsx` — camera + upload
- `src/components/ScanResult.jsx` — nutrition display
- `src/components/HistoryList.jsx` — past scans
- `src/components/Disclaimer.jsx` — reusable banner
- `src/utils/storage.js` — localStorage helpers
- `src/utils/api.js` — API client
- `api/scan.js` — Vercel serverless function

## Data / State / Storage Rules

**Scan Result (from AI):**
```json
{
  "dishName": "Nasi Lemak",
  "components": ["coconut rice", "sambal", "egg", "ikan bilis", "cucumber"],
  "confidence": 0.92,
  "estimatedPortion": "1 standard plate",
  "estimatedNutrition": {
    "carbohydrates": "65g",
    "calories": "580 kcal",
    "sugar": "12g"
  },
  "observations": "High carbohydrate meal. Most carbs from rice.",
  "suggestion": "Try setengah nasi next time while keeping protein and vegetables."
}
```

**History Item (localStorage):**
```json
{
  "id": "uuid",
  "timestamp": "ISO string",
  "dishName": "Nasi Lemak",
  "estimatedNutrition": { ... },
  "suggestion": "..."
}
```

**Storage Rules:**
- Key: `sugarsafe_scan_history`
- Max: 50 items (FIFO eviction)
- Images NOT persisted (privacy + size limits)
- Refresh persistence: verified

## Design Direction Summary

**Borrow:** Calm productivity app feel — soft sage green and warm terracotta palette, generous whitespace, rounded cards with soft shadows, system font stack, gentle spacing rhythm, friendly micro-interactions.

**Do Not Copy:** Medical/clinical aesthetics, health-app tropes (heartbeat icons, red warnings), corporate dashboard feel, harsh borders, pure red or clinical blue colors.

**Mood:** Warm calmness — reassuring and encouraging, like a supportive family member. Avoid clinical, alarming, sterile, or corporate tones.

**Key Rules:**
- Background #F7F4EF (warm off-white), cards #FFFFFF with 8px radius
- Primary accent #6B9E8A (sage green), secondary #D4A574 (terracotta)
- All text meets WCAG AA 4.5:1 contrast
- 320px min-width, max 640px centered, single-column
- Touch targets ≥ 48px
- One clear primary action per screen
- Disclaimer always visible on results

## Implementation Rules

1. Read `build-status.md`, `build-blueprint.md`, and the current work card before editing
2. Implement only the current work card
3. Do not jump ahead to later work cards
4. Stop after verification steps for each work card
5. Update `build-status.md` after each work card completion
6. Do not add backend/auth/database/API unless explicitly allowed by this blueprint
7. Do not add secrets or keys to code
8. Do not invent claims, testimonials, logos, or fake numbers
9. Apply browser-local tool guardrails (no login, no payments, no multi-user)
10. If a legacy file uses `Build Mode`, treat it as `Build Shape`

## File and Folder Expectations

```
sugarsafe/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── components/
│   │   ├── CameraCapture.jsx
│   │   ├── ScanResult.jsx
│   │   ├── HistoryList.jsx
│   │   └── Disclaimer.jsx
│   └── utils/
│       ├── storage.js
│       └── api.js
├── api/
│   └── scan.js
├── public/
│   └── foods/ (optional)
└── vercel.json
```

**Build expectations:**
- `npm run dev` starts Vite dev server
- `npm run build` creates production build
- All components functional, no placeholder stubs
- Mobile-first CSS, no external UI libraries

## Work Card Plan

| Order | Work Card | Focus |
|-------|-----------|-------|
| 01 | Project Scaffold | Initialize Vite + React, folder structure, basic app shell |
| 02 | Storage Utilities | localStorage helpers for scan history |
| 03 | API Client & Serverless Function | `/api/scan` endpoint, frontend API client |
| 04 | Camera Capture Component | Camera preview, capture, file upload fallback |
| 05 | Scan Result Component | Display structured nutrition, suggestions, disclaimer |
| 06 | History Component | List past scans, expand, delete |
| 07 | App Layout & Navigation | Main App.jsx, view switching, tab bar |
| 08 | Styling & Polish | Apply design system, responsive, accessibility |
| 09 | Testing & Verification | Manual tests, localStorage persistence, mobile check |
| 10 | Deploy to Vercel | Vercel setup, environment variables, live proof |

## Review Mirror

After each work card, run this quick mirror:
- [ ] Does the feature work as specified?
- [ ] Does it match the design direction?
- [ ] Is it mobile-responsive?
- [ ] Are there any console errors?
- [ ] Is the code clean and beginner-readable?
- [ ] Does it respect the scope lock (no extra features)?

## Proof Ladder

1. **Work Card 01:** `npm run dev` starts without errors; blank app shell renders
2. **Work Card 02:** Scan and save a test item; confirm it reappears after refresh
3. **Work Card 03:** Upload a test image; confirm API returns structured JSON
4. **Work Card 04:** Camera preview visible; capture and upload both work
5. **Work Card 05:** Result card shows dish name, components, nutrition, suggestion, disclaimer
6. **Work Card 06:** History list shows past scans; delete removes item
7. **Work Card 07:** Navigation switches between Scan, History, and About views
8. **Work Card 08:** App looks calm, warm, and friendly on mobile (320px)
9. **Work Card 09:** All manual tests pass; localStorage persists; disclaimer visible
10. **Work Card 10:** Live URL on Vercel; real photo scan works end-to-end

## 60-Second Explanation Template

"SugarSafe is a browser app that helps people with diabetes understand Malaysian food. You take a photo of your meal, AI identifies the dish and its components, and the app shows estimated nutrition with simple, culturally relevant suggestions — like asking for half rice next time. Everything stays in your browser, and the app never claims to measure blood sugar or give medical advice."

## Guardrails for the Coding Agent

- Read `build-status.md`, `build-blueprint.md`, and the current work card before editing
- Implement only the current work card
- Do not jump ahead to later work cards
- Stop after verification steps for each work card
- Update `build-status.md` after each work card completion
- Do not add backend/auth/database/API unless explicitly allowed by this blueprint
- Do not add secrets or keys to code
- Do not invent claims, testimonials, logos, or real numbers
- Apply browser-local tool guardrails (no login, no payments, no multi-user)
- If a legacy file uses `Build Mode`, treat it as `Build Shape` without stopping
