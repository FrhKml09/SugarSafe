# Design Direction

## Design Inspiration

**Source:** Calm productivity app (fallback style #4) + clean warm rounded cards  
**URL:** No external URL — internal direction based on learner description

## What We Borrow

- Calm, reassuring color palette (soft blues/greens with warm accents)
- Generous whitespace and gentle spacing rhythm
- Rounded cards with soft shadows
- Clear typographic hierarchy without harshness
- Friendly, approachable micro-interactions

## What We Do Not Copy

- Medical/clinical aesthetics (no hospital blues, no sterile layouts)
- Generic health-app tropes (no heartbeat icons, no red warning banners)
- Corporate dashboard feel
- Heavy borders, sharp corners, or high-contrast alert colors

## Visual Mood

**Warm calmness.** The app should feel like a supportive friend, not a doctor. Think: morning sunlight through a kitchen window, a helpful family member explaining something gently.

- Primary emotion: Reassuring
- Secondary emotion: Encouraging
- Avoid: Clinical, alarming, sterile, corporate

## Layout Rules

- Single-column flow on mobile; centered max-width container on desktop (480px–640px)
- Top: persistent header with app name and subtle tagline
- Middle: active view (scan view, result view, or history view)
- Bottom: primary navigation (Scan / History) as tab bar on mobile, side rail on desktop
- Cards stack with 16px–24px vertical rhythm
- One clear primary action per screen (capture, save, or delete)
- Empty states centered with illustration-like icon and short friendly text

## Color / Contrast Rules

- **Background:** #F7F4EF (warm off-white, like rice paper)
- **Card background:** #FFFFFF with 8px border-radius
- **Primary accent:** #6B9E8A (soft sage green — growth, health, calm)
- **Secondary accent:** #D4A574 (warm terracotta — Malaysian warmth, food connection)
- **Text primary:** #2D2A26 (warm near-black, softer than pure black)
- **Text secondary:** #6B6560 (warm gray for metadata)
- **Success/safe:** #6B9E8A (same as primary — no alarming green)
- **Caution/estimate badge:** #E8B86D (warm amber, not red)
- **All text meets WCAG AA minimum 4.5:1 contrast ratio**
- **No pure red (#FF0000) or harsh medical blue (#007AFF) anywhere**

## Typography Feel

- **Font family:** System font stack (no external fonts needed)
- **Headings:** 600–700 weight, 20px–24px, warm dark color
- **Body:** 400 weight, 16px base, line-height 1.6
- **Small/metadata:** 400 weight, 14px, warm gray
- **Labels:** 500 weight, 13px, uppercase tracking 0.5px
- Max one font family; no script or decorative fonts

## Component Style

**Cards:**
- White background, 8px–12px border-radius
- Soft shadow: 0 2px 8px rgba(0,0,0,0.06)
- 16px internal padding
- One subtle top border (2px) in accent color for result cards

**Buttons:**
- Primary: sage green background, white text, 12px border-radius, 48px height
- Secondary: warm terracotta outline, terracotta text, same radius
- Destructive (delete): warm gray outline, gray text — no red

**Inputs / Upload:**
- Dashed border area with rounded corners
- Warm gray placeholder text
- Camera icon centered, friendly and approachable

**Result cards:**
- Dish name prominent at top
- Components listed as soft pill badges (warm gray background)
- Nutrition grid: 2-column on mobile, simple labels + values
- Suggestion block: distinct background (#FDF8F0) with left border accent

**Disclaimer banner:**
- Persistent, warm amber background (#FFF8E7)
- Rounded, compact, always visible on result screens

## Mobile Rules

- **Min-width:** 320px; max-width: 640px centered
- **Touch targets:** Minimum 48px height for all interactive elements
- **Camera view:** Full-width preview, rounded corners, capture button centered below
- **Cards:** Full-width with 16px side margins
- **Navigation:** Tab bar at bottom, 3 items (Scan, History, About)
- **Stacking:** Single column, no horizontal scrolling
- **Typography:** Scales down slightly below 375px but never below 14px body text
- **Loading state:** Gentle pulsing animation, not a spinner

## Accessibility Basics

- All interactive elements have minimum 48×48px touch target
- Color contrast meets WCAG AA (4.5:1 for text)
- Focus states visible (2px sage green outline)
- Images have alt text or aria-label
- Form inputs have associated labels
- Disclaimer uses role="alert" or aria-live for screen readers
- No information conveyed by color alone (icons or labels accompany colors)

## Anti-Slop Rules

- No fake logos or brand marks
- No fake testimonials or user quotes
- No fake statistics or invented metrics
- No "lorem ipsum" placeholder text
- One clear primary action per screen
- All nutrition values labeled "estimated" with disclaimer visible
- No "trusted by 10,000+ users" or similar invented social proof
- Readable on 320px phone width without horizontal scroll

## Design Verification Checklist

- [ ] App renders legibly on 320px mobile viewport
- [ ] All text meets WCAG AA contrast minimum
- [ ] One primary action visible per screen
- [ ] Cards use warm off-white background, not pure white or gray
- [ ] No medical/clinical color scheme (no harsh blues or reds)
- [ ] Disclaimer visible on every result screen
- [ ] Touch targets ≥ 48px height
- [ ] No placeholder text, lorem ipsum, or fake content
- [ ] Friendly, calm tone in all copy and labels
