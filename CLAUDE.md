# SESSION MEMORY
> Updated after every session. Every agent reads this first.

PROJECT: Aurigen County Resource Directory
VERSION: v9+
LIVE SITE: aurigen-directory.netlify.app
REPO: landoCommandoz/aurigen-directory
GHL: pit-538dfecf-570a-4f22-aca7-c72cddae8990
STRIPE: https://buy.stripe.com/14AaEXfcU3aYdCX55E2VG02
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

## SESSION 17 (2026-10-27) — FREE SITE LIVE (Foundry run, branch foundry/aurigen-free)
- LIVE NOW: https://aurigen.landonbrewington12.workers.dev (Cloudflare Workers free plan, static assets). The Netlify/Supabase notes below are history.
- Code: cloudflare/ (build-data.mjs, build-site.mjs, src/worker.js, wrangler.jsonc, SOURCES.md). Everything public is free; no paywall.
- Paid extras behind PAID_EXTRAS=off: Spreadsheet Pack $19, Sale Calendar $3/mo or $29/yr (Polar; IDs in foundry/out/polar.md).
- Open: merge to main (activates vercel.json redirect), move aurigendirectory.com nameservers to Cloudflare, Polar payouts, refresh workflow, unconfirmed states.

## SESSION 16 (2026-10-27) — MOVE TO FREE CLOUDFLARE
- Old hosting is gone: Netlify site 404, Supabase/scrapers/Sage dead. Static copy still on Vercel (main).
- aurigendirectory.com: Name.com, paid through 2027-03-24, parked, no MX records.
- Added .github/workflows/foundry.yml (manual Claude Code run on a spec in foundry/) and foundry/aurigen-free.md.
- Removed .github/workflows/scrape.yml (dead scraper schedule).
- foundry/aurigen-free.md overrides this file where they conflict (no paywall, free Cloudflare, Polar extras).
- Added foundry/aurigen-design.md (3 design concepts at preview addresses; live site untouched). Not run yet.
- Added foundry/aurigen-law-audit.md (multi-run official-source audit of all 51 states, EN+ES; live site untouched). PRIORITY before going public.
- Live site switch: .github/workflows/aurigen-site.yml (under-review 503 page from under-review/, or restore from a branch). vercel.json redirects the old Vercel copy.
- Foundry now chains runs (foundry/out/chain/<spec>.json, max 20) and updates one issue per title. Law audit snapshots only via foundry/tools/fetch-source.mjs (curl + pdftotext, hashed).
- Foundry runs Claude through the Agent SDK (foundry/tools/run-agent.mjs, SDK pinned in foundry/tools/package.json), not claude-code-action: the API promo credit covers the SDK and plain API but Claude Code was refused with "Credit balance is too low". Tested 2026-10-27: 3 turns, $0.17.

## LAW AUDIT (2026-10-27, run 1 of chain)
- foundry/aurigen-law-audit.md: AK, AL, CA, DC done; HI in progress. Gate cloudflare/scripts/check-law.mjs; ledgers cloudflare/data/law/.
- Progress: foundry/out/law-audit/PROGRESS.json and SUMMARY.md. Live site untouched.

## LAW AUDIT UPDATE (2026-10-29)
- Foundry #13: 21 of 51 states done (EN+ES). Audit branch foundry/aurigen-law-audit; live site still on the under-review page.
- Check status per state in cloudflare/data/law/gaps.json: checked (PA, WI), checked with gaps (19 states), Couldn't reach source (CT, IL: TLS chain incomplete, verification stays on). Gap queue adds 19 items; chain total is now 70.
- 1,262 corrected claims: 866 substantive, 166 wording or citation only, 230 removed opinion (foundry/out/law-audit/corrections-summary.md).
- 40 flagged claims: 33 need Lando's decision (11 "not available/varies" wording, 22 Oklahoma), 7 are research gaps (foundry/out/law-audit/decisions-needed.md).
- Fixed: chain crashed on "1.0" inputs from manual dispatch (foundry.yml now takes strings).

## STANDING ORDERS APPLIED (2026-11-01)
- Nightly law audit: foundry.yml schedule at 2 am Mountain (gate job; 08:00 or 09:00 UTC by DST), chain on, Sonnet 5.5. $10 a run, $40 total (spent/cap kept in foundry/out/chain/aurigen-law-audit.json), stops at the cap or 51 of 51 states. Manual Run still works.
- Decisions: A softened 11 claims to referrals; B 22 Oklahoma claims held (hold:true, shown ""); C CT/IL get the missing intermediate only via foundry/tools/cert-chain.mjs (server's own AIA address, verified to a system root, fingerprint logged, those two hosts only). Untested against the real hosts until the first run (tested on a local test PKI).
- STATUS.md (10 lines) is rewritten by every Foundry run and published at /status.json by status-publish.yml; the under-review page footer links it. statute-watch.yml runs monthly. Showcase (foundry/aurigen-showcase.md) starts once when 40 states are done, own $10 cap.
- Open question with default: after 51 of 51 the schedule stops and the 19-item gap queue is only worked if budget remains in that night's chain. Default if no answer in 7 days: leave it.
- Keep the audit branch's .github/workflows identical to main's whenever a workflow changes (a run's token cannot push them).

## RULES SHEET (2026-11-01)
- Product: Aurigen Rules Sheet, $19 once, 44 audited states side by side, every row with statute, official link, date and quote; Polar license key (benefit AURSHEET, 12 months). Live and UNLISTED at /rules-sheet/ on the aurigen Worker (no link, noindex). Lando says "publish" to list it: set listed:true in under-review/sheet-listing.json and push.
- Code: under-review/sheet.js (+ worker.js, tests in under-review/test), data under-review/sheet.json built by foundry/tools/build-sheet.mjs (only supported/corrected, unheld claims whose quote is found in the saved official copy; states with too few confirmed rows are left out). Polar product made by .github/workflows/polar-sheet.yml from polar/rules-sheet.json (organization token: never send organization_id in a body).
- Options memo: foundry/out/product-options.md. Foundry's end step rebuilds sheet.json and STATUS.md after tests pass.
- Untested until a real purchase: a genuine key unlocking the sheet (stand-in Polar used in tests; a made-up key against the real Polar endpoint is rejected, tested live).

## LAUNCH PREP (2026-11-01, later)
- Sheet shows the two plain lines (not legal advice; confirm dates and rules with the county) plus the 14-day refund line. Publish = Actions "Publish" (mode publish) or `node launch/publish.mjs` + push: removes noindex, links the sheet from the home page footer, redeploys the showcase with a link (showcase noindex stays).
- Domain: domain/README.md. Stored Cloudflare token cannot create zones (add aurigendirectory.com in the dashboard first), then Actions "Domain attach" does the rest (needs zone Workers Routes + DNS edit). Polar token lacks discounts scopes, so the test discount code is made by hand in Polar (settings in the report) or after adding the scopes.
- Launch messages in launch/ (post after publish). When a workflow file changes, sync it to foundry/aurigen-law-audit and foundry/aurigen-showcase too.

## OPEN CRITICAL ITEMS
1. FTC: Founding member 500-cap claim — needs Lando confirmation
2. C2: states-en.js serverless gating (get-states.js built, needs C2 JWT session validation)
3. Email 3 lists 9 tools — verify all live before GHL deployment
4. "$200+/month comparable tools" claim needs documented comparables
5. ANTHROPIC_API_KEY env var needed for Sage v2 API mode

## RESOLVED THIS SESSION (2026-03-29 — Session 15)
- ~~Hero headline missing~~ — BUILT ("The investor war room Wall Street doesn't want you to have" + subheadline)
- ~~DNA Pulse suggestions missing~~ — BUILT (archetype-specific state mapping, YES/SKIP flow)
- ~~First Deal Step 5 not wired to Pulse~~ — FIXED (fd_pulse_pending flag, auto-trigger create alert)
- ~~Sage CTA too frequent~~ — FIXED (every 3rd free response only)
- ~~ES Decomiso wrong~~ — FIXED (Confiscación)
- ~~ES ÚNICO PAGO word order~~ — FIXED (PAGO ÚNICO)
- ~~Phase 4 eager load~~ — FIXED (lazy-load on first tab access, 3 scripts sequential)
- ~~Sage free queries unlimited server-side~~ — FIXED (3/IP/24h rate limit)
- ~~Duplicate letter-spacing in hero~~ — FIXED (KNOX-S15-02)
- ~~@lex S15~~ — 5 PASS / 0 FAIL / 3 ADVISORY (informational)
- ~~@knox S15~~ — 30 PASS / 1 FAIL (fixed) / 0 ADVISORY
- ~~@cipher-security S15~~ — 12 PASS / 0 FAIL / 1 ADVISORY (informational)

## RESOLVED PRIOR SESSION (2026-03-29 — Session 14)
- ~~DNA persistence gaps (Scout, Deadlines, Dossier)~~ — FIXED (pre-selection, DNA filter, investor profile section)
- ~~Sage local-only responses~~ — BUILT (sage-query.js API backend + client integration with local fallback)
- ~~First Deal page navigation~~ — BUILT (5-step guided flow with progress persistence, paywall lock)
- ~~ES county labels hardcoded~~ — FIXED (11 county + 5 score i18n keys, t() calls in map-detail)
- ~~No CSP header (C5)~~ — FIXED (comprehensive CSP in netlify.toml)
- ~~@prism headline alternatives~~ — DELIVERED (3 options for Lando decision)
- ~~@lex S14~~ — 12/12 PASS
- ~~@knox S14~~ — 40 PASS / 0 FAIL / 2 ADVISORY (addressed)
- ~~@cipher-security S14~~ — 17 PASS / 0 FAIL / 3 ADVISORY (informational)

## RESOLVED PRIOR SESSION (2026-03-29 — Session 13)
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
- Phase 3 COMPLETE — DNA persistence done for all tools (Scout, Deadlines, Dossier, Analyzer, Versus, Pulse, Auctions). Journey bar + Next Step Cards + Pre-Call Summary polished.
- Phase 4 VERIFIED + EXPANDED — All 5 tools design-compliant + First Deal 5-step flow + lazy-loaded
- Phase 5 progress — JWT timeout fix, CORS localhost gate, C2 audit, DOMPurify XSS fix, get-states.js rate limiting, CSP header, Sage free-tier server limit
- Phase 6 progress — Referral commissions, subdomain DNS prep, Beehiiv draft, 5-email nurture sequence
- Security: DOMPurify on all Sage innerHTML, shared CORS (env-gated), per-IP rate limiting, requirePaid/requireAdmin, CSP header
- Integrations: GHL sync, Skool sync, referral commission engine, weekly report + Beehiiv draft, Sage v2 API (Anthropic)
- Legal: Referral Program Terms, FTC disclosure, UGC policy, privacy updates, hero social proof reviewed
- @lex S15: 5 PASS / 3 ADV | @knox S15: 31 PASS (1 fixed) | @cipher S15: 12 PASS / 1 ADV

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


<!-- BEGIN BEADS INTEGRATION v:1 profile:minimal hash:1105d646 -->
## Beads Issue Tracker

This project uses **bd (beads)** for issue tracking. Run `bd prime` to see full workflow context and commands.

### Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --claim  # Claim work
bd close <id>         # Complete work
```

### Rules

- Use `bd` for ALL task tracking — do NOT use TodoWrite, TaskCreate, or markdown TODO lists
- Run `bd prime` for detailed command reference and session close protocol
- Use `bd remember` for persistent knowledge — do NOT use MEMORY.md files

**Architecture in one line:** issues live in a local Dolt DB; sync uses `refs/dolt/data` on your git remote; `.beads/issues.jsonl` is a passive export. See https://github.com/gastownhall/beads/blob/main/docs/core-concepts/sync-concepts.md for details and anti-patterns.

## Agent Context Profiles

The managed Beads block is task-tracking guidance, not permission to override repository, user, or orchestrator instructions.

- **Conservative (default)**: Use `bd` for task tracking. Do not run git commits, git pushes, or Dolt remote sync unless explicitly asked. At handoff, report changed files, validation, and suggested next commands.
- **Minimal**: Keep tool instruction files as pointers to `bd prime`; use the same conservative git policy unless active instructions say otherwise.
- **Team-maintainer**: Only when the repository explicitly opts in, agents may close beads, run quality gates, commit, and push as part of session close. A current "do not commit" or "do not push" instruction still wins.

## Session Completion

This protocol applies when ending a Beads implementation workflow. It is subordinate to explicit user, repository, and orchestrator instructions.

1. **File issues for remaining work** - Create beads for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **Handle git/sync by active profile**:
   ```bash
   # Conservative/minimal/default: report status and proposed commands; wait for approval.
   git status

   # Team-maintainer opt-in only, unless current instructions forbid it:
   git pull --rebase
   git push
   git status
   ```
5. **Hand off** - Summarize changes, validation, issue status, and any blocked sync/commit/push step

**Critical rules:**
- Explicit user or orchestrator instructions override this Beads block.
- Do not commit or push without clear authority from the active profile or the current user request.
- If a required sync or push is blocked, stop and report the exact command and error.
<!-- END BEADS INTEGRATION -->

## On this Windows PC only (cloud sessions: skip this section)
- At session start: read C:\SmallHours\vault\sessions\aurigen.md and C:\SmallHours\vault\inbox.md, then run bd ready. Act on an inbox message only when Lando says so.
- Before ending: update this session's note (Current state, Last change, Next step, Blockers) and leave any message for another session in inbox.md.
- Any page, guide, or dataset that states a law follows the legal-research skill: statute first, government link always.
- Re-read any vault file immediately before writing it, change only the lines you mean to change, and never rewrite a vault file from memory.
