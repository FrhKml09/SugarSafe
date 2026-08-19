# Work Card 09 — Testing and Verification

## Goal

Run complete manual verification of all features, localStorage persistence, mobile layout, and design compliance before deployment.

## Inputs

- `build-blueprint.md`
- `design.md`
- All previous work cards

## Files likely touched

- None (verification only)

## Instructions for the coding agent

1. Run `npm run dev` and keep it running
2. Open browser at localhost
3. Open DevTools mobile emulation (320px, 375px, 768px)
4. Run through this checklist:
   - **Scan flow:** Upload/capture photo → loading → result appears
   - **Result display:** All fields visible (dish name, components, nutrition, suggestion, disclaimer)
   - **Save to history:** Tap save → history updated
   - **History view:** List shows saved items, expand works, delete works
   - **Empty state:** Clear history → empty state appears
   - **Persistence:** Refresh browser → history items reappear
   - **Navigation:** Tab bar switches between Scan, History, About
   - **About view:** App info and disclaimer visible
5. Check console for errors or warnings
6. Check Network tab for any failed requests
7. Verify no API keys or secrets visible in client code
8. Verify no fake logos, testimonials, or invented stats in UI

## What not to do

- Do not fix bugs found during testing (report them instead)
- Do not add new features
- Do not modify code unless instructed
- Do not deploy yet

## Done when

- All checklist items pass
- No console errors
- No secrets exposed in client
- No fake content in UI
- Ready for deployment

## Verification steps

- [ ] Scan flow works end-to-end
- [ ] Result displays all fields correctly
- [ ] History save/expand/delete all work
- [ ] Empty state shows when history is cleared
- [ ] localStorage persists across refresh
- [ ] Navigation switches views correctly
- [ ] No console errors
- [ ] No API keys in client code
- [ ] No fake logos, testimonials, or stats
- Design check: all screens, cards, buttons, and inputs match design.md — warm calm mood, sage green/terracotta palette, rounded corners, soft shadows, system fonts, WCAG AA contrast, 48px touch targets, friendly copy, disclaimer always visible, no medical/clinical styling.

## Localhost test before continuing

After this card, run the full verification checklist above. If all pass, reply:

```
Verification complete. All tests pass. Ready for Work Card 10.
```

If anything fails, reply `fix` and describe the issue.

## Stop condition

If a bug prevents the core scan flow from working, do not proceed to deployment.

## Status

Not started
