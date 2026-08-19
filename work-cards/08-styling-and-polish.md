# Work Card 08 — Styling and Polish

## Goal

Apply the complete design system across all components, ensure responsive behavior, accessibility, and anti-slop rules.

## Inputs

- `build-blueprint.md`
- `design.md`
- `work-cards/01-project-skeleton.md` through `work-cards/07-app-layout.md`

## Files likely touched

- `src/App.css` (complete rewrite/refinement)
- `src/components/*.jsx` (style tweaks)
- `src/index.css` (global resets)

## Instructions for the coding agent

1. Apply the complete color system from design.md:
   - Background: #F7F4EF
   - Cards: #FFFFFF, 8px–12px border-radius
   - Primary accent: #6B9E8A (sage green)
   - Secondary accent: #D4A574 (warm terracotta)
   - Text primary: #2D2A26
   - Text secondary: #6B6560
   - Disclaimer: #FFF8E7 background
   - No pure red or harsh medical blue
2. Apply typography:
   - System font stack
   - Headings: 600–700 weight, 20px–24px
   - Body: 16px base, 1.6 line-height
   - Small: 14px
3. Apply component styles:
   - Cards: soft shadow 0 2px 8px rgba(0,0,0,0.06), 16px padding
   - Buttons: primary (sage green, white text), secondary (terracotta outline), destructive (warm gray)
   - Pills: warm gray #F0EDE8 background, dark text
   - Suggestion block: #FDF8F0 background, left border accent
4. Ensure responsive behavior:
   - Max-width 640px centered on desktop
   - Mobile-first from 320px
   - No horizontal scroll at any width
   - Touch targets ≥ 48px
   - Nutrition grid: 2-column on mobile, scales up on desktop
5. Add accessibility:
   - Focus states: 2px sage green outline
   - Alt text on images
   - aria-labels on icon buttons
   - role="alert" or aria-live on disclaimer
6. Add loading state: gentle pulsing animation
7. Verify anti-slop rules:
   - No fake logos, testimonials, or invented stats
   - No lorem ipsum
   - One primary action per screen
   - All nutrition labeled "estimated"
   - Disclaimer always visible on results

## What not to do

- Do not add new features or components
- Do not add external UI libraries
- Do not add new API endpoints
- Do not change component logic (only styling)
- Do not add login, payments, or database

## Done when

- All screens use warm off-white background
- All cards have rounded corners and soft shadows
- All buttons meet 48px touch target
- App renders correctly at 320px, 375px, 768px, and desktop
- No console errors
- Loading state visible during API call
- Disclaimer persistent and styled warm amber

## Verification steps

- [ ] Run `npm run dev` — app loads
- [ ] Test at 320px width — no horizontal scroll, all text readable
- [ ] Test at 375px — layout comfortable
- [ ] Test at 768px — centered container, max-width respected
- [ ] Test desktop — app centered, not stretched
- [ ] Tab through app — focus states visible (sage green outline)
- [ ] Confirm no red or clinical blue anywhere
- [ ] Confirm loading state appears during scan
- [ ] Confirm disclaimer styled warm amber on result screen
- Design check: every screen, card, button, and input follows design.md — warm calm mood, sage green/terracotta palette, rounded corners, soft shadows, system fonts, WCAG AA contrast, 48px touch targets, friendly empty states.

## Localhost test before continuing

After this card, test:

- [ ] Run `npm run dev` and test at 320px width
- [ ] Confirm background is warm off-white (#F7F4EF)
- [ ] Confirm all cards have rounded corners and soft shadows
- [ ] Confirm all buttons are at least 48px tall
- [ ] Confirm no horizontal scroll at any viewport width
- [ ] Confirm loading state shows during scan
- [ ] Confirm disclaimer is warm amber and persistent
- [ ] Confirm focus states visible when tabbing

If all tests pass, reply `continue`.
If anything fails, reply `fix` and describe the visual issue.

## Stop condition

If any view has horizontal scroll at 320px, fix immediately.

## Status

Not started
