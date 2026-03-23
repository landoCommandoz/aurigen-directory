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
1. FTC: Founding member 500-cap claim — needs Lando confirmation
2. C2: states-en.js serverless gating (get-states.js built, needs C2 JWT session validation)
3. Hero: Two competing CTAs on hero section — HIGH CONVERSION
4. First Deal page navigation incomplete

## RESOLVED THIS SESSION (2026-03-18)
- ~~Production CORS bug~~ — FIXED (aurigen-directory.netlify.app missing from ALLOWED_ORIGINS)
- ~~states-es.js missing module.exports~~ — FIXED (get-states.js Spanish data serving)
- ~~#058: Focus trap on modals~~ — FIXED (trapFocus/releaseFocusTrap on all modals)
- ~~#059: Skip navigation link~~ — FIXED (skip-to-content link as first focusable element)
- ~~FTC: Fabricated social proof ticker~~ — FIXED (Phase E)
- ~~FTC: Deal Tape missing disclaimer~~ — FIXED (Phase E)
- ~~C3: localStorage paid bypass~~ — FIXED (Phase E)
- ~~Hardcoded CSS colors~~ — FIXED (Phase D)
- ~~Stats counter showing fabricated numbers~~ — FIXED (Phase C)
- ~~Stats 0,0,0 on iPad~~ — FIXED (hardcoded values, no IntersectionObserver dependency)
- ~~80-issue master directive~~ — ALL 7 SPRINTS COMPLETE
- ~~Knox 80-item regression~~ — 80/80 PASS (3 original failures fixed + #080 waived)

## CURRENT SESSION STATUS (2026-03-23)
- Phase 1 COMPLETE — Foundation rebuild (9 steps, 7 new files, index.html 12K→77 lines) + county data layer (TYPE_RATIONALE, county search/filter, /legal page)
- Phase 2 in progress — 6/8 core tools complete
- Knox: Phase 1 7/7 PASS + 9/9 PASS (county data layer)
- Lex: 3 legal documents (ToS, Privacy, Refund) in /legal/ + legal/index.html methodology page — PASS
- Cipher: escapeHtml() on all dynamic strings — PASS
- Architecture: every file under 400 lines, one job per file

## MASTER PHASE PLAN

### PHASE 1 — FOUNDATION ✅ COMPLETE
Map, List, State Detail Modal, County Data Layer,
Type Rationale, Legal Page, All 51 jurisdictions,
Classification methodology, FTC compliance layer

### PHASE 2 — CORE TOOLS (6/8 complete)
Goal: Give investors everything they need to feel informed

- ✅ Auctions — full calendar, filter, interstitial
- ✅ Versus — side by side state comparison
- ✅ Sage v1 — AI advisor, soft close, CTA cards
- ✅ Map Filter Panel — B2 hide behavior
- ✅ DNA — investor profiler, live card, archetypes
- ✅ Analyzer — deal calculator, two-state compare
- ⬜ Pulse — personalized alert feed
- ⬜ Account — tier management, upgrade flow

### PHASE 3 — FUNNEL INTELLIGENCE
Goal: Connect every tool into a single journey toward the Clarity Call. Make the platform feel like one experience, not a collection of tools.

- ⬜ Journey Bar — persistent progress tracker across all tabs
- ⬜ Next Step Cards — guided handoff between every tool
- ⬜ DNA profile persistence — archetype + top states stored in localStorage, read by all tools
- ⬜ Analyzer pre-loads DNA top matches
- ⬜ Versus pre-loads DNA top 2 matches
- ⬜ Sage reads investor archetype from DNA
- ⬜ Pulse filtered to DNA matched states
- ⬜ Auctions tab sorts DNA matched states first
- ⬜ Pre-Call Summary page — full investor journey compiled into one page before Clarity Call

### PHASE 4 — FEAR KILLERS
Goal: Remove every objection between the investor and their first bid. Each tool kills one specific investor fear.

- ⬜ **SCOUT** (Fast — 1 session)
  Fear: Due diligence — "What if I bid on a property with hidden problems?"
  State-specific due diligence checklist generator. Adapts by lien/deed/redeemable.
  Toggle items checked/flagged. Progress ring.
  CTA: "Bring This Checklist to Your Call →"

- ⬜ **WARBOOK** (Fast — 1 session)
  Fear: Competition — "Am I competing against hedge funds?"
  Competition rating per state: Low/Moderate/High/Institutional. Surfaces OTC opportunities, lower-competition counties, tactical edges. Radar-style visual.
  CTA: "Get Your County-Level Edge →"

- ⬜ **DEADLINES** (Medium — 2 sessions)
  Fear: Timing — "What if I miss the auction?"
  Countdown dashboard for up to 3 target states. Pre-loaded from DNA. Reverse-engineered timeline: auction date, registration deadline, deposit deadline, platform setup, post-sale filings. Color: green → gold → pulsing red.
  CTA: "Finalize Your Strategy Before [Date] →"

- ⬜ **RECON** (Medium — 2 sessions)
  Fear: Process — "I don't know what happens at an actual auction."
  State-specific auction walkthrough. Step by step from registration to winning bid. Expands per step with real forms, deposit amounts, platform details. Vertical gold node timeline.
  CTA: "Lock In Your Strategy →"

- ⬜ **DOSSIER** (Medium — 2 sessions)
  Fear: Execution — "Can I actually do this?"
  Single-page printable investor briefing. Compiles: DNA archetype, top states, Analyzer results, competition assessment, 5-step action plan. Formatted as professional investment memo. "CONFIDENTIAL — PREPARED FOR [INVESTOR]" watermark.
  CTA: "Book Your Strategy Session →"
  Secondary: Save as PDF / Copy to clipboard

### PHASE 5 — SECURITY SPRINT
Goal: Production-ready before public launch

- ⬜ JWT-gated serverless function for state data
- ⬜ Server-side session validation
- ⬜ Full security audit — @cipher + @phantom + @wraith
- ⬜ localStorage tier bypass fix
- ⬜ C2 server-side gating

### PHASE 6 — GROWTH
Goal: Scale the audience

- ⬜ GHL 5-email nurture sequence — @piper
- ⬜ Custom subdomain: directory.theaurigen.com
- ⬜ Skool community integration — @rally
- ⬜ Bilingual toggle — states-es.js fully wired
- ⬜ og:image asset — @prism
- ⬜ Scout partnership outreach
- ⬜ Add to Home Screen guide — @atlas
- ⬜ Sage v2 — more genuine conversation, reduced CTA frequency

### THE ENDGAME
When all 6 phases are complete, an investor:
1. Lands on Map — immediately sees value
2. Clicks a state — gets real data with context
3. Compares in Versus — pre-loaded from click
4. Takes DNA quiz — gets their archetype
5. Runs numbers in Analyzer — pre-loaded from DNA
6. Sees competition landscape in Warbook
7. Runs due diligence with Scout
8. Tracks deadlines in Deadlines
9. Watches Pulse — sees auction in 14 days
10. Opens Dossier — everything in one document
11. Clicks "Book Your Strategy Session →"

90% closed before they ever talk to a human.

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

## WAIVERS

### WAIVER #080 — rgba() opacity variants
- **Date:** March 18, 2026
- **Granted by:** Lando Brewington
- **Reason:** The ~80 rgba() opacity variants in the codebase are all glassmorphism design system values (e.g. `rgba(255,255,255,0.04)` for glass card backgrounds, `rgba(0,0,0,0.4)` for overlays). Converting these to CSS variables would require 30+ new variables and adds architectural complexity without meaningful benefit.
- **Decision:** These values are EXEMPT from the CSS variable requirement permanently. Do not flag these in future audits.

## NEVER DO
- Reference any specific seminar brand or instructor name in any output
- Deliver any file without running node --check first
- Edit index.html without re-stating the critical connection points first
- Use max-height on tab or list content
- Hardcode colors outside the CSS variable system
