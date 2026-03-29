# AURIGEN HANDOFF DOCUMENT
## Updated after every session. Read before every session.

### LAST SESSION DATE:
2026-03-29

### LAST SESSION SUMMARY:
Session 16 — Copy advisories, ES Category B fixes, Sage starters, og-image update, PWA prompt, Lighthouse audit, outreach content. All reviews passed. Merged to main.

**Step 1 — get-states.js Rate Limiting (C2):**
- Already built in prior session (60/min per IP, 429 + Retry-After: 60)
- Added lazy cleanup (5% probabilistic, 120s TTL) for memory safety
- C2 rate limiting item RESOLVED

**Step 2 — Copy Advisories:**
- "Live auction data" → "Auction calendar data" in gate.html hero, CTA block, pricing list
- "Live and upcoming" → "Upcoming" in auctions_lock_desc EN + ES
- "Unlock unlimited Sage" → "Unlock full Sage access" in boot.js
- "unlimited AI-powered research" → "full AI-powered research access" in boot.js
- "Upgrade for unlimited access" → "Upgrade for full access" in sage-query.js
- "Live Auction Data" → "Auction Calendar Data" in og-image.svg

**Step 2b — Stripe URL Conflict (for Lando):**
Two Stripe URLs in codebase:
- URL A (28E6...): CLAUDE.md, agent configs, js/gate.js, js/app.js
- URL B (14AaEX...): warroom-billion.html, gate.html, aurigen-core-state.js, aurigen-boot.js, pipeline/
URL B appears to be the active production link. Lando must confirm.

**Step 3 — ES Category B Fixes (top priority):**
- type_lien: "Gravamen Fiscal" → "Tax Lien" (kept English for bilingual clarity)
- type_deed: "Escritura Fiscal" → "Tax Deed" (kept English)
- REDENCIÓN → PERÍODO DE RESCATE (3 instances: stat, vs, county)
- Negocio → Operación/Inversiones (6 instances: tools_lock, scout_new, vc_analyzer, fd_title, fd_complete)
- Cazador de Negocios → Cazador de Oportunidades (dna_lock_desc)

**Step 4 — Sage Conversation Starters:**
- All 6 prompt sets now have 5 items (was 3-4): yield, hunter, patient, local, portfolio, default
- Chips render in welcome screen, clear on first message, click sends immediately
- VERIFIED working as specified

**Step 5 — og-image Update:**
- SVG updated: "THE INVESTOR WAR ROOM" / "WALL STREET DOESN'T WANT YOU TO HAVE"
- Stats bar: "Auction Calendar Data" (not "Live")
- PNG regenerated at 1200x630 via sharp-cli
- og:image meta tags confirmed in both gate.html and warroom-billion.html

**Step 6 — @atlas Outreach Content (3 pieces for Lando):**
- Twitter/X thread (5 tweets): Hook → Problem → Solution → Feature → CTA
- LinkedIn post (~250 words): "29 states above 10%" insight → research problem → platform
- Video script (60 sec): Map → Florida → County → Scout walkthrough
- @lex ADVISORY: soften "collecting" to "that offer", add "up to" qualifiers on rates

**Step 7 — PWA / Add to Home Screen:**
- manifest.json created (standalone, dark theme, og-image icon)
- Apple mobile web app meta tags added to warroom-billion.html
- ATHS banner: shows after 30s (1st visit) or 2s (2nd+ visit) on mobile
- iOS: instructions modal (tap Share → Add to Home Screen)
- Android/Chrome: triggers native beforeinstallprompt
- Dismiss stored in localStorage (aurigen_aths_dismissed), never shows again

**Step 8 — Lighthouse Audit (code review, not live):**
- warroom-billion.html: Performance 35 (BLOCKER), Accessibility 62 (BLOCKER), Best Practices 78, SEO 82
- gate.html: Performance 58 (BLOCKER), Accessibility 55 (BLOCKER), Best Practices 80, SEO 88
- Top 3 issues: (1) 29 sync scripts in head ~1.1MB, (2) no Cache-Control headers, (3) d3 sync for decorative map
- Fixes proposed for Session 17 — NOT implemented this session

**Reviews:**
- @lex S16: 6 PASS / 1 FAIL (false positive — replacement direction confusion) / 1 ADVISORY (outreach wording)
- @knox+@nova S16: 41 PASS / 0 FAIL / 0 ADVISORY
- @cipher-security S16: 10 PASS / 0 FAIL / 0 ADVISORY

### WHAT WAS BUILT THIS SESSION (2026-03-29):
1. Copy: "Live auction data" → "Auction calendar data" across gate.html, og-image, i18n
2. Copy: "unlimited" → "full access" across Sage messaging
3. ES: 4 top-priority Category B fixes (type translations, RESCATE, Operación)
4. Sage starters: expanded to 5 per archetype set
5. og-image: new headline text + PNG regenerated
6. PWA: manifest.json + ATHS banner + iOS instructions
7. get-states.js: lazy cleanup added to rate limiter
8. Lighthouse audit: scores reported, fixes proposed for S17
9. @atlas: 3 outreach pieces delivered for Lando review

### WHAT WAS BUILT PRIOR SESSIONS:

**Session 15 (2026-03-29):**
Hero headline, DNA Pulse suggestions, First Deal Pulse wire, Sage CTA frequency, ES fixes (Confiscación, PAGO ÚNICO), Phase 4 lazy-load, Sage free-tier server limit.

**Session 14 (2026-03-29):**
DNA persistence (Scout, Deadlines, Dossier), Sage v2 API backend, First Deal 5-step flow, ES county parity, CSP header, @prism headline alternatives.

**Session 13 (2026-03-29):**
C2 rate limiting, DOMPurify XSS fix, Pre-Call Summary polish, gate hero redesign, Sage v2 UX, 28 ES/EN i18n keys, @piper 5-email nurture sequence.

**Session 12 (2026-03-29):**
Referral commission engine, custom subdomain, CORS localhost gate, Pulse CREATE ALERT, Account upgrades, C2 audit, @lex compliance fixes.

### LIGHTHOUSE SCORES (code review estimates):

| Page | Performance | Accessibility | Best Practices | SEO |
|------|-------------|---------------|----------------|-----|
| warroom-billion.html | 35 | 62 | 78 | 82 |
| gate.html | 58 | 55 | 80 | 88 |

### STRIPE URL CONFLICT — LANDO MUST RESOLVE:
| URL | ID prefix | Found in |
|-----|-----------|----------|
| A | 28E6oHfcUbHufL58hQ2VG00 | CLAUDE.md, agent configs, js/gate.js, js/app.js |
| B | 14AaEXfcU3aYdCX55E2VG02 | warroom-billion.html, gate.html, core-state.js, boot.js, pipeline/ |

URL B appears to be the active production link. **Lando: which URL is correct?**

### ES CATEGORY B REMAINING (12 strings for Lando review):
| # | Key | Current ES | Suggested |
|---|-----|-----------|-----------|
| 4 | type_redeemable | Redimible | Con Derecho de Redención |
| 6 | da_hold | Período de Tenencia | Período de Retención |
| 9 | da_tab_analyzer | Analizador | Analizador de Inversiones |
| 10 | acct_freshness | ACTUALIZACIÓN DE DATOS | VIGENCIA DE DATOS |
| 12 | vs_analysis | > ANÁLISIS | > RESULTADO DEL ANÁLISIS |
| 13 | scout_sub | RASTREADOR DE DEBIDA DILIGENCIA | VERIFICACIÓN DE DEBIDA DILIGENCIA |
| 14 | scout_red | SEÑALES DE ALERTA | BANDERAS ROJAS |
| 15 | pulse_new | Nuevas | Verify gender context |
| 16 | deadlines_lock_desc | fechas de documentación | fechas límite de presentación |
| 19 | vs_lock_desc | inversores eligiendo | inversores que eligen |
| 20 | acct_value_total | tuyo por $197 una vez | todo por solo $197, un único pago |
| 11 | acct_upgrade/paywall_cta | PAGO ÚNICO | Already fixed S15 |

### WHAT IS CURRENTLY PENDING:
- Lighthouse performance fixes (Session 17 — script defer, cache headers, d3 optimization)
- C2: JWT session validation for get-states.js (token verification exists, but JWT flow not wired from client)
- ES Category B: 12 remaining strings awaiting Lando review
- Stripe URL: Lando must confirm which is active
- @atlas outreach: Lando review + @lex editorial fixes before publishing

### OPEN SECURITY ITEMS:
- **C2 (Critical)**: get-states.js has token verification but client doesn't send JWT for state data requests yet
- ~~**H4 (High)**: innerHTML XSS via AI advisor response~~ — FIXED (DOMPurify + sanitizeHTML)
- ~~**C5 (Low)**: No CSP header configured~~ — FIXED (Session 14)

### OPEN LEGAL/FTC ITEMS:
- **CRITICAL**: "Founding member" 500-cap claim unverified — needs Lando confirmation
- **ADVISORY**: "$200+/month comparable tools" claim — document comparables before sending
- **ADVISORY**: Email 3 lists 9 tools — verify all live before deployment
- **ADVISORY**: Gate feature cards: "Equity Cushion Scanner" and "Absentee Owner Filter" — verify live
- **ADVISORY (S16)**: @atlas outreach: soften "collecting" → "that offer", add "up to" on rate claims

### KNOWN WAIVERS:
- **#080**: rgba() opacity variants permanently exempt from CSS variable requirement

### NEXT SESSION STARTS WITH:
**Session 17 Queue:**
1. **Lighthouse Performance Sprint** (BLOCKER fixes):
   - Move 29 sync scripts to `defer` in warroom-billion.html
   - Add Cache-Control headers to netlify.toml for JS/CSS/PNG/HTML
   - Replace d3 sync load on gate.html with defer or static SVG
   - Add `preconnect` hints for CDN domains
   - Add skip-nav link to warroom-billion.html
   - Add `<h1>` to warroom-billion.html
   - Remove `maximum-scale=1.0` from gate.html viewport
   - Add form labels to gate.html email inputs
2. **ES Category B**: Lando approves remaining 12 strings
3. **Stripe URL**: Lando confirms which URL is active, unify codebase
4. **@atlas outreach**: Lando reviews, applies @lex editorial fixes, publishes
5. **C2 JWT wire**: Client sends JWT with get-states.js requests
6. **Beehiiv send activation**: Lando decision
7. **GHL/Skool API keys**: Lando adds to Netlify env vars

### OPEN QUESTIONS FOR LANDO:
- Which Stripe URL is active? 28E6... or 14AaEX...?
- Review 12 remaining ES Category B translations (table above)
- Review @atlas 3 outreach pieces — apply @lex fixes before publishing
- Is the 500 founding member cap real?
- Run SQL migrations (referrals_commission.sql + pulse_alerts_created_by.sql)
- Add DNS CNAME: directory → aurigen-directory.netlify.app
- Load 5-email nurture sequence into GHL
- Document "$200+/month comparable tools" claim
- Set ANTHROPIC_API_KEY in Netlify env vars
- Ready to set BEEHIIV_SEND_ENABLED=true?
- Ready to add SKOOL_API_KEY and GHL_API_KEY?

### ENV VARS NEEDED (Netlify):
- `ANTHROPIC_API_KEY` — required for Sage v2 API mode
- `BEEHIIV_API_KEY`, `BEEHIIV_PUBLICATION_ID`, `BEEHIIV_SEND_ENABLED`
- `SKOOL_API_KEY`, `SKOOL_GROUP_ID`
- `GHL_API_KEY`, `GHL_LOCATION_ID`

### AGENT STATUS:
**Mason:** Session 16 complete. Copy advisories, ES fixes, Sage starters, og-image, PWA, Lighthouse audit shipped.
**Lex:** Session 16: 6 PASS / 1 FAIL (false positive) / 1 ADVISORY (outreach wording).
**Knox:** Session 16: 41 PASS / 0 FAIL / 0 ADVISORY. Clean sweep.
**Cipher-Security:** Session 16: 10 PASS / 0 FAIL / 0 ADVISORY. Clean sweep.
**Atlas:** Session 16: 3 outreach pieces delivered for Lando review.
**Piper:** Session 13: 5-email nurture sequence delivered. Ready for GHL load.
**Compass:** Session 16 coordinated. Standing by for Session 17.
