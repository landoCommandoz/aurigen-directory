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
3. First Deal page navigation incomplete
4. Email 3 lists 9 tools — verify all live before GHL deployment
5. "$200+/month comparable tools" claim needs documented comparables

## RESOLVED THIS SESSION (2026-03-29 — Session 13)
- ~~Hero competing CTAs~~ — FIXED (single $197 primary + "Start free" secondary in hero)
- ~~innerHTML XSS via AI advisor (H4)~~ — FIXED (DOMPurify 3.0.9 + sanitizeHTML wrapper)
- ~~Sage error handling~~ — BUILT (duplicate detection, error card with retry, "Still thinking...")
- ~~Pre-Call Summary incomplete~~ — ENHANCED (timestamp, saved states, Scout progress bar)
- ~~ES translations gap~~ — FIXED (28 new keys: Phase 4 tools, journey bar, pulse, account)
- ~~GHL nurture sequence missing~~ — DELIVERED (5 emails, pipeline/PIPER-GHL-NURTURE-SEQUENCE.md)
- ~~get-states.js rate limiting~~ — ADDED (60/min per IP, 429 + Retry-After)
- ~~@lex S13~~ — 3 PASS + 4 ADVISORY (all fixed)
- ~~@knox S13~~ — 8/8 PASS
- ~~@cipher-security S13~~ — 13 PASS + 1 FAIL fixed (onclick XSS) + 1 ADVISORY

## RESOLVED PRIOR SESSION (2026-03-29 — Session 12)
- ~~Referral reward layer missing~~ — BUILT (51% cash commission, PayPal payouts, admin management)
- ~~Affiliate terms missing~~ — FIXED (LEX-S12-01: Referral Program Terms in legal/, FTC disclosure on gate.html)
- ~~CORS localhost in production~~ — FIXED (environment-gated, dev-only localhost)
- ~~Custom subdomain not configured~~ — DONE (canonical/og:url updated, netlify.toml redirects, DNS docs)
- ~~Pulse missing alert creation~~ — BUILT (create-alert.js, sanitized UGC, paid-only)
- ~~Account tab missing usage stats~~ — BUILT (auctions viewed, counties explored, checklists, dossiers)
- ~~Account tab missing data freshness~~ — BUILT (data-freshness.js public endpoint)
- ~~Account tab missing feature comparison (free)~~ — BUILT (14-feature grid with free vs paid)
- ~~Phase 4 design audit~~ — ALL 5 TOOLS COMPLIANT (Bebas Neue, var(--border), var(--accent), mobile responsive)
- ~~C2 audit~~ — ALL SENSITIVE ENDPOINTS VERIFIED (requirePaid/requireAdmin on all routes)
- ~~Email masking in referral stats~~ — FIXED (domain-only: ***@domain.com)
- ~~UGC policy missing~~ — ADDED to privacy.html
- ~~Payout language too binding~~ — SOFTENED ("typically reviewed within 30 days")
- ~~@lex Session 12~~ — 1 FAIL fixed + 3 ADVISORY fixed, all resolved
- ~~@knox+@nova Session 12~~ — 32/32 PASS
- ~~@cipher-security Session 12~~ — 9/9 PASS

## RESOLVED PRIOR SESSIONS
- ~~Privacy policy missing referral disclosure~~ — FIXED (LEX-S10-01: Referral Program section + GHL third-party listing)
- ~~JWT timeout → localStorage bypass~~ — FIXED (Phase 5 C2: retry overlay → revoke on double failure)
- ~~Beehiiv weekly report auto-send~~ — READY (draft creation gated by BEEHIIV_SEND_ENABLED env var)
- ~~Skool/GHL sync not auth-gated~~ — VERIFIED (JWT + x-internal-key dual auth on both)
- ~~Phase 4 tools audit~~ — ALL 5 VERIFIED (Scout, Warbook, Deadlines, Recon, Dossier)
- ~~Scout scoutNewDeal() missing IS_PAID guard~~ — FIXED (SEC-S11-06)
- ~~Free tier showed "FL, IL, AZ" instead of "All 51 States"~~ — FIXED (Account tab + Sage response updated)
- ~~County list expanded by default~~ — FIXED (collapsed by default, toggle chevron)
- ~~Paid features accessible via scroll/click on free tier~~ — FIXED (hard lock: pointer-events:none, blur, opacity:0.15)
- ~~Locked tabs had no preview~~ — FIXED (walkthrough overlays on all 7 locked features)
- ~~CORS wildcards in sms.js/aurigen.js~~ — FIXED (shared utils/cors.js)
- ~~Rate limiting missing on admin-stats, auctions~~ — FIXED (per-IP in-memory limits)
- ~~Admin email whitelist in client JS~~ — FIXED (moved to server-side JWT isAdmin flag)
- ~~OG description "Compare returns"~~ — FIXED ("Compare rates")
- ~~Skool-sync had no auth gate~~ — FIXED (JWT + x-internal-key dual auth)
- ~~GHL CRM sync missing~~ — BUILT (ghl-sync.js with dual auth)
- ~~Referral tracking engine missing~~ — BUILT (referral.js: generate/track/convert/stats)
- ~~Weekly intelligence report missing~~ — BUILT (generate-report.js background function + GitHub Actions)
- ~~validate-session trusted JWT isAdmin claim~~ — FIXED (ADV-S10-01: server-side re-check)
- ~~referral generate used verifyBearer not requirePaid~~ — FIXED (ADV-S10-02)
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

## CURRENT SESSION STATUS (2026-03-29)
- Phase 1 COMPLETE — Foundation rebuild + county data layer
- Phase 2 COMPLETE — All 8 core tools + Pulse CREATE ALERT + Account upgrades
- Phase 3 progress — Journey bar + Next Step Cards + Pre-Call Summary polished. DNA persistence across tools pending.
- Phase 4 VERIFIED — All 5 tools design-compliant + functional
- Phase 5 progress — JWT timeout fix, CORS localhost gate, C2 audit, DOMPurify XSS fix, get-states.js rate limiting
- Phase 6 progress — Referral commissions, subdomain DNS prep, Beehiiv draft, 5-email nurture sequence
- Security: DOMPurify on all Sage innerHTML, shared CORS (env-gated), per-IP rate limiting, requirePaid/requireAdmin
- Integrations: GHL sync, Skool sync, referral commission engine, weekly report + Beehiiv draft
- Legal: Referral Program Terms, FTC disclosure, UGC policy, privacy updates, hero social proof reviewed
- @lex S13: 3 PASS + 4 ADV fixed | @knox S13: 8/8 PASS | @cipher S13: 13 PASS + 1 FAIL fixed + 1 ADV

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
