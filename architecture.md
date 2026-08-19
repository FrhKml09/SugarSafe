# Architecture

## Build Shape

**Browser-local tool with server-side AI endpoint**

- Frontend: browser-local photo capture, upload, and results display
- Backend: Vercel serverless function as secure AI proxy
- Data: localStorage for history; no database for MVP

## Stack Decision

- **Frontend framework:** React (via Vite)
- **Build tool:** Vite
- **Styling:** Plain CSS (minimal, mobile-first, beginner-friendly)
- **Backend:** Vercel serverless function (Node.js runtime)
- **AI provider:** Google Gemini vision model (via server-side API call)
- **Deployment:** Vercel (frontend + serverless function together)
- **Persistence:** Browser localStorage (no database)

## Structure Overview

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
│   └── scan.js            # Vercel serverless function
├── public/
│   └── foods/             # Optional local food reference data
└── vercel.json            # Vercel deployment config
```

## Component Map

| Component | Responsibility |
|-----------|----------------|
| `App.jsx` | Main layout, routing between scan and history views |
| `CameraCapture.jsx` | Camera capture via getUserMedia or file upload fallback |
| `ScanResult.jsx` | Display structured nutrition + practical guidance |
| `HistoryList.jsx` | Show past scans from localStorage |
| `Disclaimer.jsx` | Reusable medical disclaimer banner |
| `scan.js` (api) | Receives image, calls Gemini, returns structured JSON |

## Data / State Model

**Scan Result (structured JSON from AI):**
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

## Storage Logic

- **localStorage key:** `sugarsafe_scan_history`
- **Max items:** 50 (FIFO eviction)
- **Data stored:** id, timestamp, dishName, estimatedNutrition, suggestion
- **Image data:** NOT persisted (too large for localStorage); only text results stored
- **Refresh persistence:** Verified — scan results reappear on reload

## User Flow

1. **Landing / Home** — App title, disclaimer banner, two buttons: "Scan Food" and "View History"
2. **Scan View** — Camera preview with capture button, or file upload fallback. Loading state while AI processes.
3. **Result View** — Dish name, components, estimated nutrition, observations, suggestion, disclaimer. Option to save to history or scan again.
4. **History View** — List of past scans with timestamps. Tap to expand full details. Swipe or button to delete.

## File Expectations

- Single-page app with view switching (no router needed for MVP)
- Responsive: mobile-first (320px min), tablet-friendly, desktop-centered with max-width
- No login, no payments, no database
- All API calls go through `/api/scan` serverless function

## Constraints

- MVP limited to ~5 Malaysian dishes (nasi lemak, roti canai, char kway teow, mee goreng, laksa)
- Nutrition values are estimates, not medical measurements
- No blood glucose prediction, medication advice, or diagnosis
- Client never holds API key
- Images not persisted (privacy + localStorage limits)
- Maximum 50 history items

## Technical Non-Goals

- No authentication or user accounts
- No database or backend persistence beyond Vercel serverless
- No glucose logging or pattern analysis in MVP
- No payment integration
- No multi-device sync
- No real-time notifications
- No push notifications

## Verification Notes

- [ ] Frontend builds with `npm run build`
- [ ] Camera capture works on mobile browser
- [ ] File upload fallback works on desktop
- [ ] Serverless function calls Gemini and returns structured JSON
- [ ] Results display correctly on mobile viewport (320px–768px)
- [ ] localStorage persists history across browser refresh
- [ ] Disclaimer visible on every result screen
- [ ] Deploy to Vercel succeeds
