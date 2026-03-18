# SESSION MEMORY
> Updated after every session. Every agent reads this first.

PROJECT: Aurigen County Resource Directory
VERSION: v9+
LIVE SITE: aurigen-directory.netlify.app
REPO: landoCommandoz/aurigen-directory
GHL: pit-538dfecf-570a-4f22-aca7-c72cddae8990
STRIPE: https://buy.stripe.com/28E6oHfcUbHufL58hQ2VG00
BOOKING: https://api.leadconnectorhq.com/widget/bookings/investor-clarity-call-5oVY4

## AGENT ROSTER
| Codename | Role | Owns |
|----------|------|------|
| Mason | Builder | All code |
| Prism | Creative/Design | UI/UX |
| Blaze | Marketing | Content/campaigns |
| Ace | Sales | Conversion/closing |
| Piper | Email | GHL sequences |
| Rally | Skool/Community | Aurigen Collective |
| Lex | Legal | Compliance/copy review |
| Atlas | Content | Authority/SEO |
| Scout | Outreach | Partnerships |
| Cipher | Analytics | Data/metrics |
| Compass | Operations | Coordination |
| Knox | QA | Testing/verification |
| Recon | Intel | Competitive analysis |
| Cipher-Security | Security | Threat modeling |
| Phantom | Deep security | Threat intelligence |
| Wraith | Absolute security | Complete threat universe |
| Nova | Paid flow QA | Clicks every button in paid view |
| Ghost | Free flow QA | Finds every paywall bypass |

## STANDING RULES (all agents must follow)
- Never reference [seminar brand] in any output
- No fabricated testimonials ever
- Lex must review all user-facing claims before ship
- Knox must pass every PR before merge
- Cipher-Security runs after every major build
- HANDOFF.md must be updated after every session
- CLAUDE.md SESSION MEMORY updated after every session

## OPEN CRITICAL ITEMS
1. FTC: Founding member 500-cap claim — needs Lando confirmation (**partially addressed**)
2. C2: states-en.js still publicly accessible — needs serverless data gating (**partially addressed**)
3. Hero: Two competing CTAs on hero section — HIGH CONVERSION
4. Stats 0,0,0 on iPad still intermittent
5. First Deal page navigation incomplete

## RESOLVED THIS SESSION (2026-03-18)
- ~~FTC: Fabricated social proof ticker~~ — FIXED (Phase E: replaced with real data-derived stats)
- ~~FTC: Deal Tape missing disclaimer~~ — FIXED (Phase E)
- ~~C3: localStorage paid bypass~~ — FIXED (Phase E: client-side secrets removed, server-side only validation)
- ~~Hardcoded CSS colors~~ — FIXED (Phase D: CSS variable system)
- ~~Stats counter showing fabricated numbers~~ — FIXED (Phase C: real STATES data-derived counts)

## CURRENT PR STATUS
All waves 1-4 merged to main.
Branch `claude/morning-checkin-aurigen-HC3BD` ready to merge — Knox 15/15 PASS.
PR needs manual creation: base=main, head=claude/morning-checkin-aurigen-HC3BD
Contains 8 commits: AccessManager, NavManager, CSS vars, stats fix, security hardening, FTC compliance, polish.

## CURRENT SESSION STATUS (2026-03-18)
- Mason: 6-phase implementation (A-F) — AccessManager, NavManager, CSS vars, stats fix, security, polish
- Knox: 15-point QA audit — **15/15 PASS**
- Branch cleared for merge, PR pending manual creation (proxy limitation)
- CLAUDE.md + HANDOFF.md updated

## NEXT SESSION PRIORITIES
1. Merge PR and confirm Netlify deploy
2. C2 server-side data gating — move state data behind authenticated endpoint
3. Hero section redesign — single CTA (Prism mockup → Lando approval → Mason build)
4. Email sequence deployment — Piper's post-seminar sequence in GHL
5. ES translations parity — states-es.js significantly shorter than EN

---

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
- Master password: [STORED IN NETLIFY ENV VAR: VALID_CODES — never commit to source]
- Stripe paywall: https://buy.stripe.com/28E6oHfcUbHufL58hQ2VG00
- Booking (Investor Clarity Call): https://api.leadconnectorhq.com/widget/bookings/investor-clarity-call-5oVY4

## Free States (no gate required)
FL, IL, AZ

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
