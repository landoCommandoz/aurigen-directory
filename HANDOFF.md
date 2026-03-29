# AURIGEN HANDOFF DOCUMENT
## Updated after every session. Read before every session.

### LAST SESSION DATE:
2026-03-29

### LAST SESSION SUMMARY:
Session 12 — Referral commission engine, custom subdomain, CORS localhost gate, Pulse CREATE ALERT, Account upgrades, C2 audit, @lex compliance fixes. All reviews passed. Merged to main (b8354c1).

**Step 1 — @prism Phase 4 Design Pass:**
- All 5 tools verified design-compliant: Bebas Neue headers, var(--border) glass cards, var(--accent) interactive elements, mobile responsive at 768px. No fixes needed.

**Step 2 — Referral Reward Layer (51% Cash Commission):**
- $100.47 per converted referral (51% of $197)
- New referral.js actions: stats (with earnings), set-payout-email, mark-paid (admin), admin-stats (admin)
- Account tab: earnings breakdown, PayPal payout settings, referral stats with 3 metric cards
- Admin view: commission management table with MARK PAID button per row
- Email masking: ***@domain.com (domain-only, matching privacy policy)
- SQL migration: supabase/referrals_commission.sql

**Step 3 — Custom Subdomain DNS Activation:**
- canonical/og:url updated to directory.theaurigen.com in both HTML files
- og:image URLs updated to directory.theaurigen.com
- netlify.toml: www.directory.theaurigen.com redirect added
- DNS instructions documented below

**Step 4 — Localhost CORS Gate:**
- cors.js: PROD_ORIGINS (no localhost) vs DEV_ORIGINS (localhost:8888, localhost:3000)
- isProd = process.env.NODE_ENV !== 'development'
- Production builds exclude localhost from allowed origins

**Step 5 — Pulse CREATE ALERT + Account Upgrades:**
- Pulse: + button in header (paid only), create alert panel with state/type/text/date fields
- create-alert.js: POST (create) + DELETE (own alerts only), sanitizeText strips HTML, rate limited
- Account (free): feature comparison grid (14 features, free vs paid columns)
- Account (paid): usage stats (auctions, counties, checklists, dossiers) + data freshness endpoint
- data-freshness.js: public GET, returns last scrape timestamps
- SQL migration: supabase/pulse_alerts_created_by.sql

**Step 6 — C2 Serverless Data Gating:**
- All sensitive endpoints verified with server-side tier enforcement
- requirePaid: auctions properties/warbook, property-lookup, referral generate/stats/set-payout, create-alert
- requireAdmin: admin-stats, referral mark-paid/admin-stats

**@lex Compliance Fixes (b844b91):**
- LEX-S12-01 FIXED: Referral Program Terms added to legal/index.html (8 clauses)
- LEX-S12-01 FIXED: FTC disclosure banner shown on gate.html when ?ref= parameter present
- LEX-S12-02 FIXED: Payout language softened to "typically reviewed within 30 days"
- LEX-S12-03 FIXED: UGC clause added to privacy.html for user-created alerts
- LEX-S12-05 FIXED: Email masking changed to domain-only format

**Reviews:**
- @lex: 1 FAIL fixed + 3 ADVISORY fixed, all resolved
- @knox+@nova: 32/32 PASS
- @cipher-security: 9/9 PASS

### DNS ACTIVATION INSTRUCTIONS (Lando executes manually):
Add CNAME record at your DNS provider:
  Name: directory
  Value: aurigen-directory.netlify.app
  TTL: 3600

Then add "directory.theaurigen.com" as a custom domain in Netlify Site Settings > Domain Management. SSL will provision automatically via Let's Encrypt. Allow 24-48 hours for propagation.

### SQL MIGRATIONS TO RUN (Lando executes manually):
1. `supabase/referrals_commission.sql` — adds commission columns to referrals table
2. `supabase/pulse_alerts_created_by.sql` — adds created_by column to pulse_alerts table

### WHAT WAS BUILT THIS SESSION (2026-03-29):
1. Referral commission engine (6 new actions in referral.js)
2. Admin commission management table
3. Custom subdomain configuration
4. Environment-gated CORS (localhost blocked in production)
5. Pulse CREATE ALERT flow (create-alert.js)
6. Account feature comparison grid (free users)
7. Account usage stats + data freshness (paid users)
8. data-freshness.js public endpoint
9. Referral Program Terms (legal/index.html)
10. FTC referral disclosure banner (gate.html)
11. UGC policy (privacy.html)

### WHAT WAS BUILT PRIOR SESSIONS:

**Session 11 (2026-03-28):**
Privacy disclosure, JWT timeout bypass fix, Beehiiv draft, Phase 4 tool audit, Scout IS_PAID guard.

**Session 10 (2026-03-28):**
Security fixes (CORS, rate limiting), admin JWT flag, GHL sync, referral engine, weekly report generator.

**Session 9 (2026-03-24):**
3 UX fixes: free tier messaging, county collapse, hard lock + walkthrough previews.

### WHAT IS CURRENTLY PENDING:
- Phase 3: Funnel intelligence — Journey bar, DNA persistence, tool interconnection, Pre-Call Summary
- Phase 5: C2 serverless data gating for get-states.js (JWT session validation)
- Hero section redesign from Prism audit
- GHL 5-email nurture sequence (Piper)
- ES translations parity (states-es.js)
- Sage v2 — more genuine conversation, reduced CTA frequency

### OPEN SECURITY ITEMS:
- **C2 (Critical)**: states-en.js data gated via get-states.js but needs JWT session validation
- **H4 (High)**: innerHTML XSS via AI advisor response — needs DOMPurify
- **C5 (Low)**: No CSP header configured

### OPEN LEGAL/FTC ITEMS:
- **CRITICAL**: "Founding member" 500-cap claim unverified — needs Lando confirmation

### KNOWN WAIVERS:
- **#080**: rgba() opacity variants permanently exempt from CSS variable requirement

### NEXT SESSION STARTS WITH:
**Session 13 Queue:**
1. Phase 3: Funnel intelligence (Journey bar, Next Step Cards, DNA persistence across tools)
2. Phase 3: Pre-Call Summary page
3. C2: JWT session validation for get-states.js
4. Hero section redesign (fix competing CTAs)
5. Sage v2 (more genuine conversation)
6. DOMPurify for AI advisor innerHTML (H4 security fix)
7. ES translations parity
8. GHL 5-email nurture sequence (@piper)

### OPEN QUESTIONS FOR LANDO:
- Is the 500 founding member cap real? If so, where is the counter? If not, remove the claim.
- Run the 2 SQL migrations (referrals_commission.sql + pulse_alerts_created_by.sql)
- Add DNS CNAME record: directory → aurigen-directory.netlify.app
- Ready to set BEEHIIV_SEND_ENABLED=true?
- Ready to add SKOOL_API_KEY and GHL_API_KEY to Netlify env vars?

### ENV VARS NEEDED (Netlify):
- `BEEHIIV_API_KEY`, `BEEHIIV_PUBLICATION_ID`, `BEEHIIV_SEND_ENABLED`
- `SKOOL_API_KEY`, `SKOOL_GROUP_ID`
- `GHL_API_KEY`, `GHL_LOCATION_ID`

### AGENT STATUS:
**Mason:** Session 12 complete. Referral commissions, CORS gate, Pulse alerts, Account upgrades shipped.
**Lex:** Session 12: 1 FAIL fixed (affiliate terms) + 3 ADVISORY fixed. All compliance issues resolved.
**Knox:** Session 12: 32/32 PASS. Design spot-check + full QA clean.
**Cipher-Security:** Session 12: 9/9 PASS. All auth gates, sanitization, CORS verified.
**Prism:** Phase 4 design audit complete — all 5 tools compliant. No fixes needed.
**Compass:** Sessions 10-12 coordinated. Standing by for Session 13.
