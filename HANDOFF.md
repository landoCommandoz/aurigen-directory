# AURIGEN HANDOFF DOCUMENT
## Updated after every session. Read before every session.

### LAST SESSION DATE:
2026-03-29

### LAST SESSION SUMMARY:
Session 15 — Hero headline, DNA Pulse wire, Sage tuning, lazy-load, ES fixes, server hardening. All reviews passed. Merged to main.

**Step 1 — Hero Headline:**
- gate.html: "The investor war room Wall Street doesn't want you to have" (Bebas Neue, clamp 48-72px, #f5f0e8, letter-spacing 0.03em)
- Subheadline: "3,200+ counties. Live auction data. One-time access." (Plus Jakarta Sans)
- Mobile breakpoints: 860px → clamp(36px,8vw,48px), 480px → 32px
- og:title updated to match

**Step 2 — DNA Persistence (Pulse):**
- Pulse DNA suggestion card: "Based on your [archetype] profile, investors like you track [states]. Save them?"
- DNA_PULSE_STATES mapping: yield→AZ/FL/IA, hunter→TX/GA/OH, patient→IA/NE/IN, local→FL/AZ/IL, portfolio→FL/TX/IA
- YES saves states + dismisses, SKIP just dismisses (localStorage: aurigen_pulse_dna_dismissed)
- DNA persistence now complete for: Scout, Deadlines, Dossier, Analyzer, Versus, Pulse, Auctions

**Step 3 — First Deal Pulse Wire:**
- Step 5 action changed from 'account' to 'fd-pulse'
- Sets aurigen_fd_pulse_pending → switches to map → opens Pulse drawer → auto-opens create alert
- Step 5 completion: checks aurigen_fd_pulse flag OR saved states > 0

**Step 4 — Sage v2 Tuning:**
- System prompt: educational disclaimer, no fabrication, no seminar brands, verify with county sources
- CTA every 3rd free response: "Unlock unlimited Sage →"
- Archetype context includes tone guidance

**Step 5 — ES Fixes:**
- Fixed "Decomiso" → "Confiscación" (type_forfeiture)
- Fixed "$197 ÚNICO PAGO" → "$197 PAGO ÚNICO" word order (acct_upgrade, paywall_cta)
- Full audit: 202 EN / 202 ES keys, 0 missing, 20 Category B awkward for Lando review

**Step 6 — Performance Lazy-Load:**
- Phase 4 tools (3 scripts) lazy-loaded on first tab access via dynamic script injection
- switchTab() refactored: checks PHASE4_TABS → _loadPhase4(callback) → _switchTabInit()
- Original eager <script> tags removed from warroom-billion.html

**Step 7 — Server Hardening:**
- sage-query.js: checkFreeLimit() — 3 queries per IP per 24h for free tier
- 429 response with Retry-After: 86400, upgrade: true flag
- Paid users bypass free limit (auth.tier === 'paid')

**Reviews:**
- @lex S15: 5 PASS / 0 FAIL / 3 ADVISORY (headline puffery, "unlimited" wording, "live data" claim)
- @knox+@nova S15: 30 PASS / 1 FAIL (fixed: duplicate letter-spacing) / 0 ADVISORY
- @cipher-security S15: 12 PASS / 0 FAIL / 1 ADVISORY (upgrade flag in 429 reveals tier — informational)

### WHAT WAS BUILT THIS SESSION (2026-03-29):
1. Hero headline: "The investor war room Wall Street doesn't want you to have" + subheadline
2. DNA Pulse suggestions with archetype-specific state mapping (YES/SKIP flow)
3. First Deal Step 5 → Pulse wire (auto-trigger create alert)
4. Sage v2 prompt tuning + CTA frequency (every 3rd free response)
5. ES fixes: Confiscación, PAGO ÚNICO word order
6. Phase 4 lazy-load (3 scripts on first tab access)
7. Sage free-tier server-side rate limit (3/IP/24h)

### WHAT WAS BUILT PRIOR SESSIONS:

**Session 14 (2026-03-29):**
DNA persistence (Scout, Deadlines, Dossier), Sage v2 API backend, First Deal 5-step flow, ES county parity, CSP header, @prism headline alternatives.

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
- Phase 5: C2 JWT session validation for get-states.js
- GHL 5-email nurture sequence (Lando loads into GHL)
- Sage v2: API key (ANTHROPIC_API_KEY) must be set in Netlify env vars for API mode
- ES Category B translations: 20 awkward strings flagged for Lando review (see list below)

### ES CATEGORY B STRINGS FOR LANDO REVIEW:
1. type_lien: "Gravamen Fiscal" — consider "Tax Lien" untranslated for bilingual audience
2. type_deed: "Escritura Fiscal" — consider "Tax Deed" untranslated
3. type_forfeiture: "Confiscación" — FIXED this session (was "Decomiso")
4. type_redeemable: "Redimible" — consider "Con Derecho de Redención"
5. stat_redemption/county_redemption/vs_redemption: "REDENCIÓN" — religious connotation; consider "RESCATE"
6. da_hold: "Período de Tenencia" — consider "Período de Retención"
7. fd_title/fd_complete/scout_new: "Negocio" for "Deal" — consider "Operación" or "Inversión"
8. tools_lock_title: "ANALIZADOR DE NEGOCIOS" — consider "ANALIZADOR DE INVERSIONES"
9. da_tab_analyzer: "Analizador" drops "Deal" — consider "Analizador de Inversiones"
10. acct_freshness: "ACTUALIZACIÓN DE DATOS" — consider "VIGENCIA DE DATOS"
11. acct_upgrade/paywall_cta: "PAGO ÚNICO" — FIXED this session (was "ÚNICO PAGO")
12. vs_analysis: drops "OUTPUT" — consider "RESULTADO DEL ANÁLISIS"
13. scout_sub: "RASTREADOR" — consider "VERIFICACIÓN DE DEBIDA DILIGENCIA"
14. scout_red: "SEÑALES DE ALERTA" — consider "BANDERAS ROJAS"
15. pulse_new: "Nuevas" gender-locked feminine — verify context
16. deadlines_lock_desc: "fechas de documentación" — consider "fechas límite de presentación"
17. fd_complete: "CONFIGURADO" — consider "LISTA" for natural phrasing
18. dna_lock_desc: "Cazador de Negocios" — consider "Cazador de Oportunidades"
19. vs_lock_desc: "inversores eligiendo" — consider "inversores que eligen"
20. acct_value_total: "tuyo por $197 una vez" — consider "todo por solo $197, un único pago"

### OPEN SECURITY ITEMS:
- **C2 (Critical)**: states-en.js data gated via get-states.js but needs JWT session validation
- ~~**H4 (High)**: innerHTML XSS via AI advisor response~~ — FIXED (DOMPurify + sanitizeHTML)
- ~~**C5 (Low)**: No CSP header configured~~ — FIXED (Session 14)

### OPEN LEGAL/FTC ITEMS:
- **CRITICAL**: "Founding member" 500-cap claim unverified — needs Lando confirmation
- **ADVISORY**: "$200+/month comparable tools" claim in email sequence — document comparables before sending
- **ADVISORY**: Email 3 lists 9 tools — verify all are live before deployment
- **ADVISORY**: Gate hero feature cards list "Equity Cushion Scanner" and "Absentee Owner Filter" — verify these are live before gate launch
- **ADVISORY (S15)**: "Live auction data" in subheadline — @lex recommends "Auction calendar data" or "Updated auction data"
- **ADVISORY (S15)**: "Unlock unlimited Sage" — @lex recommends "Unlock full Sage access"

### KNOWN WAIVERS:
- **#080**: rgba() opacity variants permanently exempt from CSS variable requirement

### NEXT SESSION STARTS WITH:
**Session 16 Queue:**
1. C2: JWT session validation for get-states.js (Critical security item)
2. @lex S15 advisories: "Live auction data" → "Auction calendar data", "unlimited" → "full access"
3. ES Category B: Lando picks which of the 20 translations to fix
4. Sage conversation starters (suggested first questions in empty state)
5. og:image asset — @prism
6. Scout partnership outreach — @scout
7. Add to Home Screen guide — @atlas
8. Performance audit: bundle size, image optimization, Lighthouse score

### OPEN QUESTIONS FOR LANDO:
- Is the 500 founding member cap real? If so, where is the counter? If not, remove the claim.
- Run the 2 SQL migrations (referrals_commission.sql + pulse_alerts_created_by.sql)
- Add DNS CNAME record: directory → aurigen-directory.netlify.app
- Load the 5-email nurture sequence into GHL (pipeline/PIPER-GHL-NURTURE-SEQUENCE.md)
- Document "$200+/month comparable tools" claim before email sequence goes live
- Set ANTHROPIC_API_KEY in Netlify env vars for Sage v2 API mode
- Review 20 ES Category B translations (see list above) — which to fix?
- "Live auction data" in hero subheadline — keep as-is or change to "Auction calendar data"?
- "Unlock unlimited Sage" — keep as-is or change to "Unlock full Sage access"?
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
**Mason:** Session 15 complete. Hero headline, DNA Pulse wire, Sage tuning, lazy-load, ES fixes, server hardening shipped.
**Lex:** Session 15: 5 PASS / 0 FAIL / 3 ADVISORY (informational).
**Knox:** Session 15: 30 PASS / 1 FAIL (fixed) / 0 ADVISORY.
**Cipher-Security:** Session 15: 12 PASS / 0 FAIL / 1 ADVISORY (informational).
**Piper:** Session 13: 5-email nurture sequence delivered. Ready for GHL load.
**Prism:** Session 14: Headline Option C chosen and implemented in S15.
**Compass:** Session 15 coordinated. Standing by for Session 16.
