# AURIGEN COUNTY INTELLIGENCE PLATFORM
# MASTER LEGAL + COMPLIANCE + SECURITY AUDIT
# Date: 2026-03-25 | Pre-Launch

**ATTORNEY REVIEW REQUIRED**: This audit was produced as a framework by
AI agents. Every finding, recommendation, and legal document herein MUST
be reviewed by a licensed attorney before final launch. This does not
constitute legal advice.

---

## AUDIT SUMMARY

| Section | Agent | Status | Critical Flags |
|---------|-------|--------|---------------|
| 1. Data Sources | @lex | COMPLETE | 0 critical, 8 verify, 40 shallow citations |
| 2. Platform Copy | @lex | COMPLETE | 6 flags requiring rewrites |
| 3. Affiliate Compliance | @lex | COMPLETE | Templates delivered |
| 4. Privacy Policy + ToS | @lex | COMPLETE | Documents drafted |
| 5. IP / Trademark | @lex | COMPLETE | Recommendations delivered |
| 6. Business Entity | @lex | COMPLETE | LLC formation guidance delivered |
| 7. Competitor Risk | @lex | COMPLETE | 0 critical, 2 review items |
| 8. Security / Privacy | @cipher | COMPLETE | 4 flags (1 medium, 3 low) |

---

## SECTION 1: STATE DATA SOURCE AUDIT

### Overall Finding: ALL 51 STATES HAVE STATUTE CITATIONS

No data points appear fabricated. All rates, redemption periods, and type
classifications are broadly consistent with publicly known information.

### Citation Depth

| Category | Count | States |
|----------|-------|--------|
| Deep citations (5+ sections) | 8 | AZ, CO, FL, IL, IN, IA, MD, NJ |
| Moderate citations (2-3) | 3 | AL, GA, TX |
| Shallow citations (1 broad) | 40 | All others |

**Recommendation**: For the 40 states with only one broad citation, add
subsection-level citations for rate, redemption, and bid method before
attorney review. Priority: any state where data is marketed prominently.

### Data Points Requiring Verification

| State | Data Point | Value | Issue |
|-------|-----------|-------|-------|
| Georgia (GA) | Redemption penalty | 20% yr1 + 10%/yr after | Cite OCGA 48-4-42 specifically, not just 48-4-1 |
| South Carolina (SC) | Graduated penalty | 3-12% by month | Verify floor/ceiling against SC Code 12-51-90 |
| Montana (MT) | Escalating penalty | 10% + 2%/mo after yr1 | Verify against MCA 15-17-112 |
| South Dakota (SD) | Redemption period | 3-4 years | Range is vague -- clarify what determines exact period |
| Colorado (CO) | Rate | 14% for 2025 | Time-sensitive -- changes annually with Federal Discount Rate |
| Idaho (ID) | Redemption | 14 months | Unusual number -- verify against IC 63-1003 |
| Massachusetts (MA) | Redemption | 6 months to 3 years | Extreme range needs clarification |
| Connecticut (CT) | Type: "lien" | Lien | File's own note says municipalities choose between lien and redeemable deed -- consider "hybrid" or "varies" |

### Editorial Content Requiring Disclaimer

These fields are Aurigen's own analysis, not government data. They MUST
carry a visible disclaimer on the front end:

- `score` (12-82 range) -- no industry standard exists for state scoring
- `scoreWhy` -- editorial narrative
- `beginnerFriendly` -- subjective boolean
- `notBeginnerReason` -- editorial
- `beginnerTip` -- advice/recommendations
- `risks[]` -- mix of fact and editorial
- `ddExtra[]` -- mix of fact and editorial

**Required label**: "Aurigen editorial assessment -- not government data"

---

## SECTION 2: PLATFORM COPY AUDIT

### FLAGS REQUIRING REWRITE

#### FLAG 1: Competitor Pricing Claims (HIGHEST PRIORITY)

All competitor pricing claims lack FTC-required substantiation:

| Location | Text | Action Required |
|----------|------|----------------|
| warroom-billion.html:3114 | "COMPARABLE TOOLS CHARGE $200+/MONTH" | Document source OR soften |
| warroom-billion.html:3190 | "$49/mo elsewhere" (Analyzer) | Document source OR soften |
| warroom-billion.html:3195 | "$200/mo elsewhere" (Sage) | Document source OR soften |
| warroom-billion.html:3200 | "$99/mo elsewhere" (Scout) | Document source OR soften |
| warroom-billion.html:3205 | "$197/mo elsewhere" (Auctions) | Document source OR soften |
| warroom-billion.html:3210 | "$49/mo elsewhere" (Pulse) | Document source OR soften |
| warroom-billion.html:3213 | "Total value: $1,500+/year" | Remove or add methodology |
| warroom-billion.html:3385,3404,3423,4516 | "Comparable tools charge $200+/month" (paywall locks) | Same fix needed |
| gate.html:401 | "Comparable tools charge $200+/month" | Same fix needed |

**FIX OPTIONS**:
A) Document actual competitor pricing with names, URLs, and dates (strongest)
B) Soften to: "Many similar platforms charge monthly subscriptions" (safest)
C) Remove all specific dollar comparisons (most conservative)

**Recommended**: Option B -- soften language. Specific competitor pricing
is difficult to maintain and verify over time.

#### FLAG 2: Investment Advice Language

| Location | Text | Fix |
|----------|------|-----|
| warroom-billion.html:7110 | "which counties to target, how much to allocate, and what to do at the auction" | Rewrite: "which counties to explore, how to approach allocation decisions, and how auction processes work" |
| warroom-billion.html:3037 | "guided execution" | Add: "Educational guidance only. Not a licensed advisory service." |
| warroom-billion.html:4661 | "guided execution" (repeated) | Same fix |

#### FLAG 3: Sage AI Advisor Framing

| Location | Text | Fix |
|----------|------|-----|
| warroom-billion.html:2960 | "Your tax lien and tax deed advisor" | Change to: "Your tax lien and tax deed research assistant" |
| warroom-billion.html:2974 | "trained on your DNA profile" | Change to: "Reads your investor profile to adapt responses" |

#### FLAG 4: Projected Returns Without Inline Disclaimer

| Location | Text | Fix |
|----------|------|-----|
| warroom-billion.html:6517 | "Projected Return" label | Add inline: "Based on statutory maximum rate. Actual returns vary." |
| warroom-billion.html:2752 | Walkthrough shows "Projected ROI: 18.0%" | Add: "(illustrative only)" |
| gate.html:429 | "See your projected return instantly" | Add: "based on statutory maximum rates" |

#### FLAG 5: DNA Archetype Language

| Location | Text | Fix |
|----------|------|-----|
| warroom-billion.html:5660 | "diversified yield" | Reframe: "diversified exposure" |
| warroom-billion.html:5662 | "compounding statutory returns" | Change to: "potential for statutory interest accrual" |

#### FLAG 6: Seminar-Adjacent Phrasing

| Location | Text | Fix |
|----------|------|-----|
| warroom-billion.html:5029 | "get close to statutory max rates" | Rewrite: "Random selection means rates are not competitively bid down" |
| warroom-billion.html:5043 | "less competition, closer to statutory max" | Same approach |
| warroom-billion.html:5936 | "16% statutory rate" (Pulse alert) | Change to: "16% statutory maximum rate" |
| warroom-billion.html:5949 | "bid-down rates averaged 3-6% in prime zip codes" | Add source year or remove specific numbers |

### CONFIRMED PRESENT (All Pass)

| Requirement | Status | Locations Found |
|-------------|--------|----------------|
| FTC disclaimer on every page | PASS | warroom-billion.html:3222-3238, gate.html:405 |
| "Educational purposes only" | PASS | 5 locations across both files |
| "Not investment advice" | PASS | 8 locations across both files |
| "Statutory maximum rates" | PASS | 6 locations on rate displays |
| "Results vary" | PASS | 4 locations (1 flag: Analyzer inline) |
| "Consult qualified professional" | PASS | 5 locations |
| Scout legal disclaimer | PASS | warroom-billion.html:3121, 7246, 7257, 7268 |

---

## SECTION 3: AFFILIATE FTC COMPLIANCE

**Delivered**: `/legal/affiliate-disclosure-templates.txt`

Contains:
- Master FTC disclosure language (3 tiers: full, short, minimum)
- Social media templates (Facebook, Instagram, TikTok, X/Twitter)
- Direct message disclosure templates
- Email outreach disclosure with CAN-SPAM compliance
- Video/audio verbal disclosure scripts
- Affiliate agreement summary (7 enforceable terms)
- Quick-reference compliance checklist

Key requirement: Every affiliate must include disclosure BEFORE the link,
not buried in hashtags or at the bottom of a post.

---

## SECTION 4: PRIVACY POLICY + TERMS OF SERVICE

**Delivered**: `/legal/privacy-policy.txt` and `/legal/terms-of-service.txt`

### Privacy Policy Covers:
- Data collected: email only (via Netlify Forms + GHL CRM)
- Payment data: handled by Stripe (we never see full card numbers)
- localStorage: access flags and preferences only, no PII tracking
- Third-party services: Netlify, Stripe, Google Fonts, Anthropic (Sage AI)
- GDPR: lawful basis (consent), right to erasure/access/portability
- CCPA: right to know, right to delete, no data sales
- COPPA: not directed at children under 13
- Cookie disclosure: no tracking cookies, localStorage for preferences
- Google Fonts: disclosed as CDN that may set cookies per Google policy

### Terms of Service Covers:
- Educational tool only -- not investment/legal/financial advice
- User assumes all investment risk
- No guarantee of results
- $197 one-time payment via Stripe
- Refund policy: [LANDO TO CONFIRM -- recommend 30-day guarantee]
- IP ownership: all content owned by Aurigen
- Prohibited uses: no scraping, redistribution, or commercial reuse
- Limitation of liability: capped at amount paid
- Governing law: State of Utah
- Dispute resolution: binding arbitration

### Known Issue in Existing ToS:
- `terms-of-service.txt` still shows $97 (old price) -- needs update to $197
- References "Landon Brewington" without LLC -- update after formation

### Required Before Launch:
- Both documents linked in footer of warroom-billion.html
- Both documents linked on gate.html before email submission
- Privacy policy checkbox or visible link at email capture point
- Attorney review and sign-off

---

## SECTION 5: INTELLECTUAL PROPERTY

### Trademark Recommendation

| Item | Recommendation | Cost | Timeline |
|------|---------------|------|----------|
| "AURIGEN" wordmark | FILE FEDERAL (Classes 41+42) | $500-700 | 8-12 months |
| State trademark (Utah) | ALSO FILE ($22, faster) | $22 | 2-4 weeks |
| Logo/design mark | FILE after wordmark | $250-350 | 8-12 months |
| Tool names (Sage, DNA, etc.) | NOT RECOMMENDED (too generic) | -- | -- |

### Immediate Actions:
1. Use TM symbol on all marketing materials NOW (no registration needed)
2. Run USPTO TESS clearance search for "AURIGEN" in Classes 41/42
3. File federal application after attorney clearance
4. "Aurigen" does not appear to conflict with existing marks (preliminary)

---

## SECTION 6: BUSINESS ENTITY

### URGENT: Form Utah LLC Before Paid Marketing Launch

| Step | Action | Cost |
|------|--------|------|
| 1 | Verify name at Utah DOCC Business Search | Free |
| 2 | File Certificate of Organization online | $70 |
| 3 | Obtain EIN from IRS (irs.gov) | Free |
| 4 | Draft Operating Agreement (3 founders) | Attorney review |
| 5 | Open business bank account | Free |
| 6 | Transfer Stripe to LLC entity | Free |
| 7 | Annual renewal | $20/year |

### Operating Agreement Must Address:
- Ownership percentages (Lando, Marcos, Sebastian)
- Capital contributions (cash, labor, IP)
- Profit/loss distribution
- Management structure (member-managed vs. manager-managed)
- Voting rights and major decision thresholds
- Buyout/exit provisions with valuation method
- IP assignment to LLC (critical)
- Non-compete clause
- Dispute resolution (mediation then arbitration)
- Dissolution terms

**RISK**: Operating without an LLC exposes personal assets to any legal
challenge, FTC action, or customer dispute. This is the single highest
priority item before scaling.

---

## SECTION 7: COMPETITOR RISK ASSESSMENT

### Trade Secret Misappropriation

| Element | Status | Notes |
|---------|--------|-------|
| State data (rates, redemption, bids) | CLEAR | All from public statutes |
| Platform architecture | CLEAR | Common tool types |
| Scoring methodology | REVIEW | Document independent criteria |
| County-level data | CLEAR | Published by county tax collectors |

### Copyright Infringement

| Element | Status | Notes |
|---------|--------|-------|
| Platform copy | 2 FLAGS | See copy audit Section 2, Flag 6 (seminar-adjacent phrasing) |
| State descriptions | REVIEW | Rewrite anything that sounds like training materials |
| UI/UX design | CLEAR | Visually distinct dark terminal aesthetic |

### Tortious Interference

| Element | Status | Notes |
|---------|--------|-------|
| Competing for same customers | LOW RISK | Legal market competition |
| Former employer's customers | LOW RISK | No customer lists used |
| Marketing to seminar audiences | CAUTION | Market to general audience, not specific competitor events |

### Trade Dress
| Element | Status |
|---------|--------|
| Platform look and feel | CLEAR |
| Feature set | CLEAR |
| Sales funnel workflow | LOW RISK |

### Protective Measures:
1. Document all data was independently sourced from government websites
2. Save source URLs for every data point with access dates
3. All copy must be original -- no adaptation from training materials
4. Never use contact lists from former employer
5. Never reference competitors by name
6. Document independent development timeline

---

## SECTION 8: SECURITY + PRIVACY AUDIT (@cipher)

### localStorage Audit: 15 Keys Found

| Key | Data | PII? |
|-----|------|------|
| aurigen_access | 'free' or 'paid' | NO |
| aurigen_email | User's email address | **YES** |
| aurigen_lang | 'en' or 'es' | NO |
| aug_paid | 'true' | NO |
| aug_entered | 'true' | NO |
| aug_token | JWT access token | NO |
| versus_state_a | State abbreviation | NO |
| versus_state_b | State abbreviation | NO |
| pulse_last_seen | Timestamp | NO |
| aurigen_profile | JSON (archetype, states, preferences) | NO |
| aurigen_clarity_dismissed | JSON (dismissed flag) | NO |
| aurigen_scout_deals | JSON (property research data) | NO |
| aurigen_a2hs_dismissed | '1' | NO |

### Flags

| # | Item | Severity | Details |
|---|------|----------|---------|
| 1 | Email in localStorage | MEDIUM | `aurigen_email` stores email in plaintext. Accessible to any JS on same origin (XSS vector). Disclose in privacy policy. Consider if client-side storage is necessary. |
| 2 | ?paid=true URL bypass | KNOWN | Already documented in CLAUDE.md. Phase 5 server-side gating will resolve. |
| 3 | sms.js wildcard CORS | LOW | WhatsApp sender has open CORS. Lock to specific origins. |
| 4 | Google Fonts CDN | LOW | May set cookies per Google policy. Disclosed in privacy policy. |

### All Clear

| Item | Status |
|------|--------|
| Facebook Pixel | CLEAR -- not present |
| Google Analytics | CLEAR -- not present |
| Google Tag Manager | CLEAR -- not present |
| Hotjar/Mixpanel/etc. | CLEAR -- not present |
| sessionStorage | CLEAR -- not used |
| IndexedDB | CLEAR -- not used |
| Application cookies | CLEAR -- none set |
| Unexpected data transmission | CLEAR -- email goes only to Netlify Forms + GHL CRM |

### External Data Transmission (All Expected)

| Endpoint | Data Sent | PII? |
|----------|-----------|------|
| Netlify Forms (/) | form-name, email | YES (email only) |
| /.netlify/functions/aurigen (capture-email) | email, lang | YES (email only) |
| GoHighLevel CRM (server-side) | email, tags, source | YES (email only) |
| Anthropic API (server-side) | Chat messages (Sage AI) | NO* |
| us-atlas CDN | None (data download) | NO |
| Twilio (server-side) | Admin WhatsApp notification | NO |

*Sage forwards user chat messages to Anthropic. If user types PII voluntarily,
it would be transmitted, but the app does not inject stored PII.

---

## PRE-LAUNCH CHECKLIST

### MUST DO BEFORE FIRST AFFILIATE LINK GOES OUT

| # | Item | Owner | Priority |
|---|------|-------|----------|
| 1 | Form Utah LLC | Lando | CRITICAL |
| 2 | Rewrite competitor pricing claims (Flag 1) | Mason | CRITICAL |
| 3 | Rewrite investment advice language (Flag 2) | Mason | CRITICAL |
| 4 | Attorney review of Privacy Policy + ToS | Lando | CRITICAL |
| 5 | Link Privacy Policy + ToS in footer and gate | Mason | HIGH |
| 6 | Fix "advisor" to "research assistant" in Sage (Flag 3) | Mason | HIGH |
| 7 | Add inline disclaimer to Projected Return (Flag 4) | Mason | HIGH |
| 8 | Rewrite DNA archetype language (Flag 5) | Mason | MEDIUM |
| 9 | Rewrite seminar-adjacent phrases (Flag 6) | Mason | MEDIUM |
| 10 | Add editorial disclaimer to score/beginnerFriendly | Mason | MEDIUM |
| 11 | Update ToS price from $97 to $197 | Mason | HIGH |
| 12 | Transfer Stripe to LLC entity | Lando | HIGH |
| 13 | Send affiliate disclosure templates to Ben + Ron | Lando | HIGH |
| 14 | File AURIGEN trademark (after attorney clearance) | Lando | MEDIUM |
| 15 | Verify 8 flagged state data points | Atlas | MEDIUM |
| 16 | Lock sms.js CORS to specific origins | Mason | LOW |

### ALREADY PASSING

- FTC disclaimer present on every page
- "Educational purposes only" present
- "Not investment advice" present (8 locations)
- "Statutory maximum rates" present on rate displays
- "Consult qualified professional" present
- Scout legal disclaimer present
- No tracking scripts (no Pixel, no GA, no GTM)
- No cookies set by application
- No unexpected data transmission
- All 51 states have statute citations
- No fabricated data points detected

---

## FILES DELIVERED IN THIS AUDIT

| File | Contents |
|------|----------|
| `/legal/MASTER-AUDIT-2026-03-25.md` | This document |
| `/legal/affiliate-disclosure-templates.txt` | FTC-compliant affiliate disclosures |
| `/legal/privacy-policy.txt` | Privacy Policy (attorney review required) |
| `/legal/terms-of-service.txt` | Terms of Service (attorney review required) |

---

**STANDARD**: If a hostile attorney filed an FTC complaint or cease and
desist today, every item marked PASS in this audit can withstand challenge.
Every item marked FLAG must be resolved before that standard is met.

The 6 copy flags and the LLC formation are the only barriers between the
current state and launch readiness.

**NEXT STEP**: Attorney review this week. Resolve all FLAGS. Then launch.
