# Work Card 05 — Scan Result Component

## Goal

Build the scan result display that shows dish identification, estimated nutrition, practical guidance, and the medical disclaimer.

## Inputs

- `build-blueprint.md`
- `design.md`
- `work-cards/01-project-skeleton.md`

## Files likely touched

- `src/components/ScanResult.jsx` (implement)
- `src/components/Disclaimer.jsx` (implement)
- `src/App.css` (add styles)

## Instructions for the coding agent

1. Open `src/components/ScanResult.jsx`
2. Implement a component that receives `result` (structured JSON from AI) and `onScanAgain` callback
3. Display:vercel.cmd dev
   - **Dish name:** Large, 20px–24px, warm dark (#2D2A26), top of card
   - **Components:** Soft pill badges (warm gray #F0EDE8 background, dark text)
   - **Estimated portion:** Simple text line
   - **Nutrition grid:** 2-column on mobile — label + value pairs (carbs, calories, sugar)
   - **Observations:** Paragraph in body text
   - **Suggestion:** Distinct block with #FDF8F0 background and 2px left border in sage green (#6B9E8A)
   - **Confidence:** Small metadata text (e.g., "Confidence: 92%")
   - **Disclaimer banner:** Persistent, warm amber (#FFF8E7), rounded, always visible
4. Add "Scan Again" button (sage green, 48px height)
5. Style with plain CSS matching design.md:
   - Card: white background, 8px border-radius, soft shadow, 16px padding
   - Nutrition grid: 2-column, 16px gap
   - Suggestion block: #FDF8F0 background, left border accent
   - Disclaimer: #FFF8E7 background, rounded, compact
   - All text meets WCAG AA contrast

## What not to do

- Do not call the API from this component
- Do not add history save logic here (parent handles that)
- Do not use external UI libraries
- Do not add navigation or routing here
- Do not claim numbers are medically accurate (use "estimated" labels)

## Done when

- Result card displays all fields from structured JSON
- Nutrition grid is readable on mobile (320px)
- Disclaimer is visible and persistent
- "Scan Again" button works
- Styling matches design.md (warm colors, rounded cards, sage green accents)

## Verification steps

- [ ] Run `npm run dev` — app loads
- [ ] Render `ScanResult` with sample data — all fields visible
- [ ] Check nutrition grid at 320px width — no overflow, readable
- [ ] Confirm disclaimer is visible and styled warm amber
- [ ] Confirm no harsh red or clinical blue colors
- [ ] Confirm "estimated" label appears on nutrition values
- Design check: result card, nutrition grid, suggestion block, disclaimer banner, and pill badges follow design.md — warm off-white cards, sage green accents, 8px border-radius, 16px padding, WCAG AA contrast.

## Localhost test before continuing

After this card, test:

- [ ] Run `npm run dev` and open in mobile viewport (320px)
- [ ] Confirm result card renders with sample data
- [ ] Confirm nutrition grid is 2-column and readable
- [ ] Confirm disclaimer is visible at bottom of result
- [ ] Confirm "Scan Again" button is visible and sage green
- [ ] Confirm no horizontal scroll or cut-off text

If all tests pass, reply `continue`.
If anything fails, reply `fix` and paste the error or describe what you see.

## Stop condition

If the component cannot render at 320px without horizontal scroll, fix styling before continuing.

## Status

Not started
