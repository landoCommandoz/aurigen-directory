# AURIGEN HANDOFF DOCUMENT
## Updated after every session. Read before every session.

### LAST SESSION DATE:
2026-03-29

### LAST SESSION SUMMARY:
Session 14 — DNA persistence across tools, Sage v2 API backend, First Deal 5-step guided flow, ES county parity, CSP header, @prism headline alternatives. All reviews passed. Ready for merge.

**Step 1 — DNA Persistence Across Tools:**
- Scout: Pre-selects DNA top state in new deal form (aurigen-phase4.js)
- Deadlines: "DNA States" filter button, auto-defaults to DNA filter when archetype exists (aurigen-phase4-tools-a.js)
- Dossier: "YOUR INVESTOR PROFILE" section with archetype, strategy, and top states (aurigen-phase4-tools-b.js)
- Remaining DNA gaps: Analyzer, Versus, Sage, Pulse, Auctions pre-load (Phase 3 backlog)

**Step 2 — C2 Rate Limiting (verified from S13):**
- get-states.js: 60/min per IP — already live

**Step 3 — @prism Headline Alternatives (content deliverable):**
- Current: "The county-by-county intelligence platform built for serious investors."
- Option A: "Every county. Every rate. Every edge. One platform."
- Option B: "Research 3,000+ counties before your next bid."
- Option C: "The investor war room Wall Street doesn't want you to have."
- Lando to choose. No code change until decision.

**Step 4 — Sage v2 API Backend:**
- NEW: netlify/functions/sage-query.js — POST endpoint with JWT auth, 20/min rate limiting
- Anthropic Claude Sonnet 4 API integration with archetype-aware system prompt
- Client calls API first, falls back to local pattern-matcher on failure
- Free users: 3 queries per session (sessionStorage), paid users: unlimited
- Fixed Knox ADV-01: free-query limit check moved before history push

**Step 5 — ES County Data Parity:**
- 11 new i18n keys for county panel labels (EN + ES): yield, redemption, bid, view, counties, county, search, empty, otc
- 5 score tier keys: elite, strong, moderate, weak, pending
- Map detail labels now use t() function instead of hardcoded English

**Step 6 — CSP Header:**
- Content-Security-Policy added to netlify.toml covering all external resources
- No unsafe-eval; unsafe-inline only for style-src (required)
- X-Frame-Options changed from DENY to SAMEORIGIN
- C5 security item RESOLVED

**Step 7 — First Deal 5-Step Guided Flow:**
- 5 steps: Choose State → Pick County → Run Dossier → Scout Checklist → Set Pulse Alert
- Progress persists in localStorage (aurigen_first_deal_step)
- Auto-advances based on tool usage (aurigen_last_state, aurigen_last_county, etc.)
- Paid only (paywall lock + tab-locked class for free users)
- Completion card with booking CTA
- Gold node timeline CSS matching Phase 4 design system

**Reviews:**
- @lex S14: 12/12 PASS, 0 FAIL, 0 ADVISORY
- @knox+@nova S14: 40 PASS / 0 FAIL / 2 ADVISORY (free-query history edge — FIXED, CSP clarification — N/A)
- @cipher-security S14: 17 PASS / 0 FAIL / 3 ADVISORY (x-forwarded-for pre-existing, style attr low risk, localStorage cosmetic)

### WHAT WAS BUILT THIS SESSION (2026-03-29):
1. DNA persistence: Scout pre-selection, Deadlines DNA filter, Dossier investor profile section
2. Sage v2 API backend (sage-query.js) + client integration with local fallback
3. First Deal 5-step guided flow (HTML, JS, CSS, paywall lock)
4. ES county data parity (11 county + 5 score i18n keys, map-detail t() calls)
5. CSP header (netlify.toml) — C5 security item resolved
6. 15+ new First Deal i18n keys (EN + ES)
7. @prism 3 headline alternatives delivered for Lando decision

### WHAT WAS BUILT PRIOR SESSIONS:

**Session 13 (2026-03-29):**
C2 rate limiting, DOMPurify XSS fix, Pre-Call Summary polish, gate hero redesign, Sage v2 UX (duplicate detection, error retry, typing), 28 ES/EN i18n keys, @piper 5-email nurture sequence.

**Session 12 (2026-03-29):**
Referral commission engine, custom subdomain, CORS localhost gate, Pulse CREATE ALERT, Account upgrades, C2 audit, @lex compliance fixes.

**Session 11 (2026-03-28):**
Privacy disclosure, JWT timeout bypass fix, Beehiiv draft, Phase 4 tool audit, Scout IS_PAID guard.

**Session 10 (2026-03-28):**
Security fixes (CORS, rate limiting), admin JWT flag, GHL sync, referral engine, weekly report generator.

**Session 9 (2026-03-24):**
3 UX fixes: free tier messaging, county collapse, hard lock + walkthrough previews.

### WHAT IS CURRENTLY PENDING:
- Phase 3 remaining: DNA persistence for Analyzer, Versus, Pulse, Auctions (pre-load from DNA)
- Phase 5: C2 JWT session validation for get-states.js
- Hero section: @prism headline — awaiting Lando decision (3 options delivered)
- GHL 5-email nurture sequence (Lando loads into GHL)
- Sage v2: API key (ANTHROPIC_API_KEY) must be set in Netlify env vars for API mode
- First Deal: aurigen_fd_pulse marker needs to be set by Pulse alert creation flow

### OPEN SECURITY ITEMS:
- **C2 (Critical)**: states-en.js data gated via get-states.js but needs JWT session validation
- ~~**H4 (High)**: innerHTML XSS via AI advisor response~~ — FIXED (DOMPurify + sanitizeHTML)
- ~~**C5 (Low)**: No CSP header configured~~ — FIXED (Session 14)

### OPEN LEGAL/FTC ITEMS:
- **CRITICAL**: "Founding member" 500-cap claim unverified — needs Lando confirmation
- **ADVISORY**: "$200+/month comparable tools" claim in email sequence — document comparables before sending
- **ADVISORY**: Email 3 lists 9 tools — verify all are live before deployment
- **ADVISORY**: Gate hero feature cards list "Equity Cushion Scanner" and "Absentee Owner Filter" — verify these are live before gate launch

### KNOWN WAIVERS:
- **#080**: rgba() opacity variants permanently exempt from CSS variable requirement

### NEXT SESSION STARTS WITH:
**Session 15 Queue:**
1. Phase 3: DNA persistence for Analyzer (pre-load matches), Versus (pre-load top 2), Pulse (filter to DNA states), Auctions (sort DNA first)
2. C2: JWT session validation for get-states.js
3. First Deal: Wire aurigen_fd_pulse marker into Pulse alert creation flow
4. Sage v2: Tune system prompt, reduce CTA frequency, add conversation starters
5. @prism: Implement Lando's headline choice on gate.html
6. ES translations: remaining gaps audit
7. Performance: lazy-load Phase 4 tools JS

### OPEN QUESTIONS FOR LANDO:
- Is the 500 founding member cap real? If so, where is the counter? If not, remove the claim.
- Run the 2 SQL migrations (referrals_commission.sql + pulse_alerts_created_by.sql)
- Add DNS CNAME record: directory → aurigen-directory.netlify.app
- Load the 5-email nurture sequence into GHL (pipeline/PIPER-GHL-NURTURE-SEQUENCE.md)
- Document "$200+/month comparable tools" claim before email sequence goes live
- Set ANTHROPIC_API_KEY in Netlify env vars for Sage v2 API mode
- Choose headline from @prism options (A/B/C)
- Ready to set BEEHIIV_SEND_ENABLED=true?
- Ready to add SKOOL_API_KEY and GHL_API_KEY to Netlify env vars?

### DNS ACTIVATION INSTRUCTIONS (Lando executes manually):
Add CNAME record at your DNS provider:
  Name: directory
  Value: aurigen-directory.netlify.app
  TTL: 3600

Then add "directory.theaurigen.com" as a custom domain in Netlify Site Settings > Domain Management. SSL will provision automatically via Let's Encrypt. Allow 24-48 hours for propagation.

### SQL MIGRATIONS TO RUN (Lando executes manually):
1. `supabase/referrals_commission.sql` — adds commission columns to referrals table
2. `supabase/pulse_alerts_created_by.sql` — adds created_by column to pulse_alerts table

### ENV VARS NEEDED (Netlify):
- `ANTHROPIC_API_KEY` — required for Sage v2 API mode (falls back to local without it)
- `BEEHIIV_API_KEY`, `BEEHIIV_PUBLICATION_ID`, `BEEHIIV_SEND_ENABLED`
- `SKOOL_API_KEY`, `SKOOL_GROUP_ID`
- `GHL_API_KEY`, `GHL_LOCATION_ID`

### AGENT STATUS:
**Mason:** Session 14 complete. DNA persistence, Sage v2 API, First Deal flow, ES parity, CSP header shipped.
**Lex:** Session 14: 12/12 PASS. No FAILs, no ADVISORYs.
**Knox:** Session 14: 40 PASS / 0 FAIL / 2 ADVISORY (both addressed).
**Cipher-Security:** Session 14: 17 PASS / 0 FAIL / 3 ADVISORY (all informational).
**Piper:** Session 13: 5-email nurture sequence delivered. Ready for GHL load.
**Prism:** Session 14: 3 headline alternatives delivered. Awaiting Lando decision.
**Compass:** Session 14 coordinated. Standing by for Session 15.
