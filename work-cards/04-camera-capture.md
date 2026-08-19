# Work Card 04 — Camera Capture Component

## Goal

Build the camera capture UI with camera preview, photo capture, and file upload fallback.

## Inputs

- `build-blueprint.md`
- `design.md`
- `work-cards/01-project-skeleton.md`
- `work-cards/02-storage-utilities.md`
- `work-cards/03-api-client-and-serverless.md`

## Files likely touched

- `src/components/CameraCapture.jsx` (implement)
- `src/App.css` (add styles)

## Instructions for the coding agent

1. Open `src/components/CameraCapture.jsx`
2. Implement a component that:
   - Requests camera access via `navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })`
   - Shows a live video preview in a `<video>` element
   - Has a capture button (48px min, sage green per design.md)
   - On capture, draws video frame to hidden `<canvas>`, converts to blob
   - Has a fallback file input for desktop (accept="image/*")
   - Calls `onCapture(file)` prop with the captured/uploaded image file
   - Shows loading state while processing
   - Handles camera permission denied gracefully with friendly message
3. Style with plain CSS:
   - Video preview: full-width, 8px border-radius, soft shadow
   - Capture button: 48px height, sage green (#6B9E8A), white text, centered
   - Upload fallback: dashed border area, warm gray text, 8px radius
   - Error state: warm amber background (#FFF8E7), rounded, friendly text

## What not to do

- Do not call the API yet (just pass file to parent)
- Do not add scan history logic yet
- Do not add navigation or view switching yet
- Do not use any external camera libraries
- Do not add medical disclaimers here (parent handles that)

## Done when

- Camera preview visible on mobile (with https or localhost)
- Capture button takes a photo
- File upload fallback works on desktop
- Error state shows when camera is denied
- Component calls `onCapture(file)` with image file

## Verification steps

- [ ] Run `npm run dev` — app loads
- [ ] On mobile (or dev tools mobile view), camera preview appears
- [ ] Tap capture — photo is taken and `onCapture` is called
- [ ] On desktop, file upload area visible and functional
- [ ] Deny camera permission — friendly error message appears
- [ ] Console has no errors
- Design check: camera preview, capture button, and upload area follow design.md — warm off-white background, sage green primary button, 8px border-radius, 48px touch targets, no medical/clinical styling.

## Localhost test before continuing

After this card, test:

- [ ] Run `npm run dev` and open in mobile viewport (375px)
- [ ] Confirm camera preview is visible and fills width
- [ ] Confirm capture button is visible, sage green, and at least 48px tall
- [ ] Confirm file upload fallback is visible on desktop
- [ ] Deny camera permission — confirm friendly error message appears
- [ ] Confirm no console errors

If all tests pass, reply `continue`.
If anything fails, reply `fix` and paste the error or describe what you see.

## Stop condition

If camera API is not available (non-HTTPS), the fallback upload must work. If neither works, stop and verify environment.

## Status

Not started
