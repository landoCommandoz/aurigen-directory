# AURIGEN COUNTY RESOURCE DIRECTORY — PROJECT MASTER

## What This Project Is
A bilingual (EN/ES) tax lien and tax deed investor directory covering all 50 U.S. states + DC.
Sold as a freemium web app — 7 free states, full access behind a Stripe paywall.
Built for seminar audiences and self-directed real estate investors.

## File Structure
```
/
├── index.html          — Master app (2880+ lines). Single file. All UI, logic, map, gate.
├── states-en.js        — English state data array (STATES_EN). 1723 lines. 51 entries.
├── states-es.js        — Spanish state data array (STATES_ES). 624 lines. 51 entries.
├── netlify.toml        — Build config. Do not touch without explicit instruction.
├── package.json        — Dependencies. Do not touch without explicit instruction.
└── netlify/functions/
    └── aurigen.js      — Netlify serverless function. Handles Stripe gate verification.
```

## Live URLs
- Production: https://statuesque-bublanina-330b9d.netlify.app
- Backup: https://hilarious-llama-2933ac.netlify.app
- Master password: AURIGEN2026
- Stripe paywall: https://buy.stripe.com/28E6oHfcUbHufL58hQ2VG00
- Booking (Investor Clarity Call): https://api.leadconnectorhq.com/widget/bookings/investor-clarity-call-5oVY4

## Free States (no gate required)
FL, IL, IA, NJ, GA, AZ, TX

## Key Architecture Rules — NEVER VIOLATE
1. Scroll chain: every flex ancestor of a scroll container must have min-height:0
2. Never use max-height on tab or list content
3. Never use overflow:hidden on any ancestor of scrollable content
4. Map must call invalidateSize() after any layout change
5. localStorage calls always wrapped in null-safe try/catch
6. Language toggle persists via localStorage key: 'aurigen_lang'
7. Active language loads either STATES_EN or STATES_ES — never both simultaneously
8. Z-index gate fix: .gate-glow must be position:absolute, z-index:0, pointer-events:none !important
9. Never use window.self / window.top / btoa() unsafely in iframe contexts
10. Run node --check on index.html and both .js files before any delivery

## State Data Schema (both EN and ES files must match this exactly)
```
id, name, type, rate, redemption, score, beginnerFriendly,
notBeginnerReason (if beginnerFriendly:false),
scoreWhy, note, risks[], ddExtra[], beginnerTip,
auctionSignup { platform, steps[], depositInfo, directLink },
otc { available, note },
platforms[], counties[]
```

## Business Context
- Owner: Lando (Landon Brewington), Sales Director, real estate education
- Community: Aurigen Collective (free Skool community)
- Lead course: Aurigen Academy
- Target: Tax lien/deed seminar attendees, self-directed investors
- Sales model: Free 7-state access → email gate → Stripe upsell → full 51-state access
- Investor Clarity Call CTA appears per-state for upsell and booking

## Design Identity
Dark cinematic. Near-black backgrounds (#0d0d0d). Gold accent. Off-white text.
Bebas Neue or similar for headlines. DM Sans for body. Motion on load. Glass morphism cards.
Never generic. Never white backgrounds. Never flat.

## NEVER DO
- Reference any specific seminar brand or instructor name in any output
- Deliver any file without running node --check first
- Edit index.html without re-stating the critical connection points first
- Use max-height on tab or list content
- Hardcode colors outside the CSS variable system
