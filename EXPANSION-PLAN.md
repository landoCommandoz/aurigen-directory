# AURIGEN 10X EXPANSION PLAN
## Unified Synthesis — All 5 Agent Reports
### Date: 2026-03-17

---

## EXECUTIVE SUMMARY

Five specialized agents audited the Aurigen County Resource Directory across creative, engineering, marketing, analytics, and legal dimensions. This document synthesizes their findings into a single, prioritized roadmap.

**The product today:** A genuinely impressive data layer — 51 states, statutory citations, auction guides, bilingual support. Solid at $97. Not yet a $497 product.

**The gap:** Missing server-side email capture (collecting zero leads), no analytics, no onboarding, orphaned features, legal exposure from missing ToS/Privacy Policy, and value leaking through ungated tools.

**The opportunity:** No competitor offers a bilingual, 51-state interactive directory with this data depth. With 15 targeted changes, this becomes a $497 product. With 5 premium features, it becomes a $10M category.

---

## PHASE 1: EMERGENCY FIXES (This Week)

These are revenue-losing bugs, not features. Fix immediately.

### 1.1 Server-Side Email Capture
- **Agent:** Analytics (Critical Finding #1)
- **Problem:** `handleEmailGate()` stores email in localStorage only. Zero emails collected.
- **Fix:** Add `fetch(NETLIFY_FN, { body: { action: 'capture-email', email, lang } })` to the function
- **Impact:** Every day unfixed = 100% lead loss
- **Flag:** `ff_server_email_capture`

### 1.2 Pass Email to Stripe Checkout
- **Agent:** Analytics (#2)
- **Fix:** Append `?client_reference_id=` + email to all `STRIPE_URL` references
- **Impact:** Enables matching purchases to leads
- **Flag:** `ff_stripe_email_passthrough`

### 1.3 Unhide Footer Disclaimer
- **Agent:** Legal (Critical Finding #3)
- **Problem:** `.app-footer-disclaimer { display: none; }` — the most comprehensive disclaimer is invisible
- **Fix:** Remove `display: none` or relocate content
- **Impact:** Removes legal exposure

### 1.4 Create Terms of Service
- **Agent:** Legal (#1)
- **Problem:** Paywall says "See Terms of Service" but no ToS exists
- **Fix:** Create ToS document (EN + ES), link from paywall and footer
- **Impact:** The single highest legal risk

### 1.5 Create Privacy Policy
- **Agent:** Legal (#2)
- **Problem:** Collecting email with no privacy policy anywhere
- **Fix:** Create Privacy Policy (EN + ES), link from gate email form and footer
- **Impact:** Required by law before email collection

---

## PHASE 2: CONVERSION OPTIMIZATION (Weeks 1-2)

Quick wins that directly increase revenue.

### 2.1 State-Specific Paywall Copy
- **Agent:** Analytics (#3)
- **Current:** Generic "Unlock Full Access" for all 48 locked states
- **Fix:** "Unlock Iowa: 2% monthly returns, 4 county links, step-by-step auction signup"
- **Data:** Already in state objects — template s.rate, s.counties.length, s.risks.length
- **Flag:** `ff_dynamic_paywall`

### 2.2 Add Price Anchor to In-App Paywall
- **Agent:** Analytics (#4)
- **Problem:** $297 strikethrough only appears on gate, not in-app paywall
- **Fix:** Add the same price anchor pattern to `openPaywall()`
- **Flag:** `ff_paywall_price_anchor`

### 2.3 Hide Rate/Redemption for Locked States
- **Agent:** Analytics (Leak #3)
- **Problem:** All 51 states show rate + redemption in list, even locked ones
- **Fix:** Show "Unlock to see" for locked state metadata
- **Flag:** `ff_hide_locked_meta`

### 2.4 Allow 1-2 Free AI Messages
- **Agent:** Analytics (#5), Creative (Invisible Moment)
- **Problem:** Sage/Atlas immediately paywall — zero value demonstrated
- **Fix:** Allow 2 free messages, then gate with "Unlock unlimited access"
- **Flag:** `ff_free_ai_messages`

### 2.5 Track Locked State Click Count + Escalate
- **Agent:** Analytics (#6)
- **Fix:** After 3+ locked clicks, change copy: "You've tried to research N states..."
- **Flag:** `ff_escalating_paywall`

### 2.6 Investor Clarity Call CTA for Free Users
- **Agent:** Analytics (#9)
- **Problem:** Booking CTA only appears for paid users
- **Fix:** Add below free state content: "Not sure? Book a free strategy call"
- **Impact:** Captures leads even without purchase
- **Flag:** `ff_free_user_booking`

### 2.7 Pre-fill Deal Analyzer Example
- **Agent:** Analytics (#12), Creative (Invisible Moment)
- **Fix:** On first visit, auto-populate with FL: $5,000 lien, 18%, 12 months
- **Impact:** Accelerates "aha moment"
- **Flag:** `ff_analyzer_prefill`

---

## PHASE 3: PREMIUM UX (Weeks 2-4)

Transform from reference tool to investment system.

### 3.1 Onboarding Flow
- **Agent:** Creative (Invisible Moment #1)
- **What:** 3-step guided onboarding after gate: (1) "Tap any gold state" (2) "Use the Deal Analyzer" (3) "Ask Sage anything"
- **Flag:** `ff_premium_onboarding`

### 3.2 Return Visit Recognition
- **Agent:** Creative (Invisible Moment #6)
- **What:** "Welcome back — you were researching Georgia. Pick up where you left off?"
- **Flag:** `ff_return_visit`

### 3.3 Cross-View Intelligence
- **Agent:** Creative (Invisible Moment #5)
- **What:** Viewing FL's 18% auto-populates Analyzer. Saving 3 lien states auto-selects "Tax Liens" tag.
- **Flag:** `ff_cross_view_intelligence`

### 3.4 View Transitions
- **Agent:** Creative (Invisible Moment #2)
- **What:** 200ms crossfade between tabs instead of instant show/hide
- **Flag:** `ff_view_transitions`

### 3.5 Fix Orphaned Spotlight View
- **Agent:** Creative (Invisible Moment #9)
- **Problem:** Spotlight view exists in HTML but has no nav button
- **Fix:** Wire it into bottom nav or merge into Explore
- **Flag:** `ff_spotlight_nav`

### 3.6 Skeleton Loading for Map
- **Agent:** Creative (Invisible Moment #7)
- **What:** Pulsing map outline while D3/TopoJSON loads
- **Flag:** `ff_map_skeleton`

---

## PHASE 4: $497 VALUE ADDITIONS (Weeks 4-8)

The features that close the gap between $97 and $497.

### 4.1 County Database Expansion
- **Agent:** Marketing (#1 priority addition)
- **What:** Populate top 3-5 counties per state across all 51 entries
- **Impact:** Single highest-ROI addition for perceived value
- **Current:** Most states have `counties: []`

### 4.2 Downloadable State Playbook PDFs
- **Agent:** Marketing (Value Stack)
- **What:** One-page action sheets per state. Print-ready. Type, rate, top 3 counties, risks, registration link.
- **Flag:** `ff_state_playbooks`

### 4.3 Auction Calendar
- **Agent:** Creative (#2 "Auction Pulse"), Marketing (#8)
- **What:** Calendar view with upcoming auction dates, countdown timers, registration deadlines
- **Flag:** `ff_auction_calendar`

### 4.4 "First Deal" Guided Pathway
- **Agent:** Marketing (#9)
- **What:** 5-step flow: Profile quiz → Recommended states → State detail → Deal Analyzer → Register
- **Flag:** `ff_guided_pathway`

### 4.5 Deal Tracker / Portfolio View
- **Agent:** Marketing (#10), Creative
- **What:** localStorage-based tracker: state, county, amount, date, redemption deadline, status
- **Flag:** `ff_deal_tracker`

---

## PHASE 5: "NEVER SEEN THIS BEFORE" FEATURES (Months 2-4)

The features that make people say "I've never seen a tool like this."

### 5.1 "State Versus" — Side-by-Side Comparison
- **Agent:** Creative (#1)
- **What:** Compare 2-3 states visually. Bar charts per metric. AI-generated verdict. Locked states trigger paywall.
- **Revenue thesis:** 15-25% increase in paywall conversions
- **Complexity:** Medium
- **Flag:** `ff_state_comparison`

### 5.2 "Deal Tape" — TikTok-Style Scenario Feed
- **Agent:** Creative (#3)
- **What:** Full-screen swipeable investment scenarios. "$10K Tax Lien in Maricopa County, AZ" with best/likely/worst outcomes.
- **Revenue thesis:** The viral feature. Investors screenshot and share.
- **Complexity:** Medium
- **Flag:** `ff_deal_tape`

### 5.3 "Atlas Property Scout" — Address-to-Analysis
- **Agent:** Creative (#4)
- **What:** Paste any address, get instant tax lien/deed analysis using existing state data.
- **Revenue thesis:** Justifies price increase to $197+ or $29/month recurring
- **Complexity:** Medium-High
- **Flag:** `ff_property_scout`

### 5.4 "Investor DNA" — Adaptive Profile
- **Agent:** Creative (#5)
- **What:** Radar chart (D3) showing investor profile. Tracks behavior, refines recommendations.
- **Revenue thesis:** Retention feature. Creates switching costs.
- **Complexity:** Medium
- **Flag:** `ff_investor_dna`

---

## PHASE 6: $497 PRICING ARCHITECTURE

### Three Tiers (from Marketing Agent)

| | FREE | FULL ACCESS ($497) | VIP ($997) |
|---|---|---|---|
| States | 3 (FL, AZ, IL) | All 51 | All 51 |
| AI Advisor | 5 questions/day | Unlimited | Unlimited |
| Deal Analyzer | Full | Full | Full |
| State Playbooks | — | All 51 PDFs | All 51 PDFs |
| Downloadables | — | OTC Cheat Sheet, Avoid List | Everything |
| Clarity Calls | — | 1 included | 3 included |
| Direct Access to Lando | — | — | 2 emails/month |
| Academy Early Access | — | — | Yes |
| Guarantee | — | 60-day money-back | 60-day money-back |
| Price Anchor | — | ~~$1,497~~ → $497 | ~~$2,997~~ → $997 |

### Gate Copy Rewrite Highlights
- Eyebrow: "THE INVESTOR'S OPERATING SYSTEM"
- Tagline: "The Only Tool That Shows You Exactly Where to Invest, How to Register, and What to Avoid — in All 50 States."
- Stats: 51 States + DC / 200+ County Links / 3 Free States
- CTA: "SEE THE FULL STATE MAP" → "UNLOCK FREE ACCESS"

---

## LEGAL REQUIREMENTS CHECKLIST

From the Legal Agent's audit:

### Must Have (Before Price Increase)
- [ ] Terms of Service (EN + ES)
- [ ] Privacy Policy (EN + ES)
- [ ] Refund Policy (formal document, even if "all sales final")
- [ ] Unhide footer disclaimer
- [ ] Investment information disclaimer on state modals (top, not just bottom)
- [ ] Data accuracy disclaimer with "last verified" dates
- [ ] Remove reference to non-existent ToS from paywall
- [ ] Email consent language at gate

### Should Have (Within 90 Days)
- [ ] Accessibility: ARIA labels, keyboard navigation, color contrast
- [ ] Update `<html lang>` attribute on language switch
- [ ] Physical mailing address in footer (CAN-SPAM)
- [ ] AI disclaimer banners in Sage and Atlas
- [ ] Cookie/storage consent for EU compliance
- [ ] Rename "Recommended States" → "Matching States"
- [ ] Rename "Investor Score" → "Accessibility Score" or "Research Score"

### Language Changes for Compliance
- "The Investor's Edge" → "The Investor's Research Tool"
- "Recommended States" → "States That Match Your Criteria"
- "Investor Score" → "Research Score"
- Sage system prompt: "investment strategy" → "research information"

---

## ANALYTICS EVENT MAP

37 events identified (from Analytics Agent). Top priority:

| Event | Trigger | Why It Matters |
|---|---|---|
| `gate_email_submit` | Email entered | Lead tracking |
| `paywall_view` | Locked state clicked | Purchase intent signal |
| `paywall_cta_click` | "Unlock Now" clicked | Revenue attribution |
| `paywall_close` | Modal closed without buying | Drop-off point |
| `state_open_free` | Free state viewed | Engagement depth |
| `booking_cta_click` | Clarity Call link | High-value lead |
| `analyzer_calculate` | Deal calculated | Aha moment signal |
| `language_switch` | EN ↔ ES toggle | Market segmentation |

---

## FEATURE FLAG SYSTEM (IMPLEMENTED)

The builder agent designed and implemented a complete feature flag system, already committed and pushed. Located in `index.html`:

- `FeatureFlags` class with URL param > localStorage > default priority
- Hidden admin panel (accessible via `?admin=true` or konami code)
- Toggle, reset, export controls
- Pre-defined flags for all features in this plan
- Event system for flag changes

**Access:** Add `?admin=true` to URL or enter ↑↑↓↓←→←→BA

---

## IMPLEMENTATION PRIORITY MATRIX

| Priority | Item | Impact | Effort | Agent Source |
|---|---|---|---|---|
| P0 | Server-side email capture | CRITICAL | Low | Analytics |
| P0 | Terms of Service | CRITICAL | Low | Legal |
| P0 | Privacy Policy | CRITICAL | Low | Legal |
| P0 | Unhide footer disclaimer | CRITICAL | Trivial | Legal |
| P1 | State-specific paywall copy | High | Low | Analytics |
| P1 | Pass email to Stripe | High | Trivial | Analytics |
| P1 | Price anchor in paywall | High | Trivial | Analytics |
| P1 | Hide locked state meta | Medium | Low | Analytics |
| P1 | 2 free AI messages | High | Low | Analytics/Creative |
| P2 | Onboarding flow | High | Medium | Creative |
| P2 | Return visit recognition | Medium | Low | Creative |
| P2 | County data expansion | High | High | Marketing |
| P2 | Downloadable PDFs | High | Medium | Marketing |
| P2 | Analytics layer | High | Medium | Analytics |
| P3 | State Versus comparison | High | Medium | Creative |
| P3 | Auction Calendar | High | High | Creative/Marketing |
| P3 | Deal Tape feed | High | Medium | Creative |
| P3 | Guided pathway | Medium | Medium | Marketing |
| P4 | Property Scout | Very High | High | Creative |
| P4 | Investor DNA | High | Medium | Creative |
| P4 | Accessibility remediation | Medium | High | Legal |

---

## THE $10M VISION

**Today:** A $97 reference tool that 200 people use.
**Phase 2-3:** A $497 investment system that 2,000 investors rely on weekly.
**Phase 4-5:** A $29/month platform with Property Scout, Deal Tape, and Investor DNA that 10,000+ investors can't live without.

The data foundation is already best-in-class. The bilingual advantage is a moat. The cinematic design creates premium perception. What's missing is the operational layer that turns research into action and the retention mechanics that turn one-time buyers into daily users.

This plan builds that layer, one feature-flagged addition at a time.

---

*Generated by the Aurigen Orchestrator — 5 parallel agents, full codebase analysis*
*Creative | Builder | Marketing | Analytics | Legal*
