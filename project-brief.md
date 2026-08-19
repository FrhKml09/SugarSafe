# Project Brief

## Project Identity

**Name:** SugarSafe  
**Tagline:** Malaysian food photos → simple, culturally relevant diabetes guidance  
**Owner:** Farah Eiman Kamal  
**Inspiration:** Personal experience supporting a family member through diabetes management

## One-Sentence Concept

A browser-based app that lets users photograph Malaysian dishes, sends the image to a vision AI for food recognition, and returns estimated nutrition with practical, culturally relevant guidance.

## Target User

Malaysian adults managing type 2 diabetes or prediabetes, especially older users who want realistic, non-alarmist guidance about familiar foods.

## User Goal

Take or upload a photo of a Malaysian meal and receive:
- Dish and component identification
- Estimated nutrition (carbs, calories, sugar, portion)
- Simple, actionable suggestions (e.g., "ask for setengah nasi next time")

## Build Shape

**Browser-local tool with server-side AI endpoint**

- Frontend: browser-local photo capture, upload, and results display
- Backend: secure server-side proxy for vision AI API calls (no API keys in client)
- Data: localStorage for history and favorites; no database required for MVP

## Shape Confirmation

Confirmed by learner on 2026-08-17.

## Version-One Success

1. User can take or upload a food photo in the browser.
2. Photo is sent to a vision AI model via a secure server endpoint.
3. App returns structured JSON: dish name, components, estimated portion, estimated nutrition, observations.
4. Results are displayed in simple language with culturally relevant suggestions.
5. App clearly labels all numbers as estimates and includes medical disclaimer.
6. History of scanned meals persists in localStorage across refreshes.
7. MVP covers ~5 dishes: nasi lemak, roti canai, char kway teow, mee goreng, laksa.

## Now / Later / Never

### Now
- Photo capture and upload UI
- Server-side AI endpoint proxy
- Vision AI food recognition (Google Gemini or similar)
- Structured nutrition display with practical guidance
- localStorage scan history
- Medical disclaimer on every result
- Responsive mobile layout

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

## Assumptions

- Learner has access to a vision AI API (Google Gemini or compatible) with server-side proxy capability.
- Server environment supports Node.js/Express or similar lightweight backend.
- Browser supports camera capture (getUserMedia) and file upload.
- MVP tested primarily on mobile browsers.

## Proof Target

1. A real photo of nasi lemak is recognized and returns structured nutrition + guidance.
2. Results persist in localStorage after browser refresh.
3. Disclaimer is visible on every result screen.
4. Mobile layout works on a phone viewport.

## Trainer / Learner Notes

Learner is a beginner live-build participant. Coaching should proceed one question at a time through the KDBM Lite phases. Do not scaffold full project until Work Cards are generated and learner says "Start Work Card 01".
