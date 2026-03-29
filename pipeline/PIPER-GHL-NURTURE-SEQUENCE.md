# PIPER — GHL 5-Email Nurture Sequence
## Aurigen County Intelligence Platform
### For Lando to review and load into GHL (pit-538dfecf-570a-4f22-aca7-c72cddae8990)

---

## SEQUENCE OVERVIEW
- **Trigger:** Free access email submission (gate.html form)
- **Cadence:** Day 0, Day 1, Day 3, Day 5, Day 7
- **Goal:** Convert free users to $197 paid access
- **Tone:** Direct, educational, no hype. Investor-to-investor.
- **CTA:** Every email ends with one clear CTA to the Stripe link
- **Unsubscribe:** Every email includes unsubscribe link (GHL handles automatically)
- **FTC:** No fabricated testimonials. No income claims. No urgency that implies scarcity unless verified.

---

## EMAIL 1 — DAY 0: WELCOME + ORIENTATION
**Subject:** Your Aurigen access is live
**Preview:** Here's what to explore first.

---

You're in.

Your free access to the Aurigen County Intelligence Platform is now active. Here's what you can do right now:

**What's available on your free tier:**
- Interactive map of all 51 jurisdictions
- State-level data: type, yield rate, redemption period, bid method
- Statute citations for every state
- Classification methodology (why each state is labeled lien, deed, hybrid, etc.)

**Your first move:**
Click any state on the map. Read the type rationale. Look at the score. That's the kind of intel you'll have for every county when you upgrade.

[EXPLORE YOUR MAP >>](https://directory.theaurigen.com)

When you're ready for county-level data, live auctions, and the full toolset — it's one payment, no subscription:

[UNLOCK FULL ACCESS — $197 ONE TIME >>](https://buy.stripe.com/14AaEXfcU3aYdCX55E2VG02)

— Aurigen Intelligence

*This directory is for educational purposes only. Not investment advice.*

---

## EMAIL 2 — DAY 1: THE DATA GAP
**Subject:** What most investors don't check before bidding
**Preview:** The county-level difference.

---

Most new tax lien investors pick a state, find an auction, and bid.

They skip the county.

That's a problem — because in tax lien investing, the county is where the risk lives:
- **Platform varies by county** (some are online, some are courthouse-only)
- **Competition varies by county** (institutional buyers dominate certain metros)
- **OTC availability varies by county** (some counties sell surplus liens directly)
- **Redemption rates vary by county** (some areas redeem at 95%+, others under 40%)

The state tells you the rules. The county tells you if it's worth playing.

That's why Aurigen maps 3,200+ counties — not just 51 states.

[SEE COUNTY-LEVEL DATA >>](https://buy.stripe.com/14AaEXfcU3aYdCX55E2VG02)

— Aurigen Intelligence

*Data sourced from public county records. Educational only.*

---

## EMAIL 3 — DAY 3: THE TOOL STACK
**Subject:** 9 tools. One platform. No subscription.
**Preview:** What full access actually includes.

---

Here's what Aurigen full access members use:

1. **DNA Profiler** — 6 questions to find your investor type (Yield Maximizer, Deal Hunter, Patient Capitalist, Local Operator, Portfolio Builder)
2. **Deal Analyzer** — Two-state comparison with projected returns by scenario
3. **Versus** — Side-by-side state analysis on every metric that matters
4. **Sage AI** — Ask anything about tax liens and deeds. Personalizes to your profile.
5. **Scout** — 10-step due diligence checklist. State-specific.
6. **Warbook** — Competition rating per state. Find the edges.
7. **Deadlines** — Countdown dashboard for registration, deposit, and auction dates
8. **Recon** — Step-by-step auction walkthrough for any state
9. **Dossier** — One-page investor briefing you can print or copy

Comparable platforms charge $200+/month for less coverage.

Aurigen is $197. Once. Forever.

[UNLOCK ALL 9 TOOLS >>](https://buy.stripe.com/14AaEXfcU3aYdCX55E2VG02)

— Aurigen Intelligence

*Rates shown are statutory maximums. Actual returns vary. Not financial advice.*

---

## EMAIL 4 — DAY 5: THE STRATEGY QUESTION
**Subject:** Which type of investor are you?
**Preview:** Your strategy determines your state.

---

Tax lien investing isn't one-size-fits-all.

A yield-focused investor should be looking at different states than someone who wants to acquire property. Your capital range matters. Your timeline matters. Your risk tolerance matters.

That's why we built the **DNA Profiler**.

It takes 60 seconds. You answer 6 questions. Aurigen matches you to one of 5 investor archetypes — and then every tool on the platform adapts:

- **Sage** tailors its advice to your archetype
- **Deal Analyzer** pre-loads your best-match states
- **Versus** pre-loads your top 2 for comparison
- **Pulse** filters alerts to your matched states

You stop researching randomly. You start researching strategically.

[TAKE THE DNA QUIZ >>](https://buy.stripe.com/14AaEXfcU3aYdCX55E2VG02)

— Aurigen Intelligence

*This quiz is for educational purposes only. Not investment advice.*

---

## EMAIL 5 — DAY 7: THE DECISION
**Subject:** One question before your next auction
**Preview:** The cost of not knowing.

---

There's an auction coming up in your area. Maybe this month. Maybe next.

When it happens, you'll either:

**A)** Show up with a spreadsheet you built from Google searches, hoping you picked the right county, guessing at the competition level, and unsure about the post-sale process.

**B)** Show up with county-level data on every parcel, a competition assessment, a due diligence checklist specific to your state, countdown deadlines for every filing, and a full investor briefing you can hand to your attorney.

The difference isn't talent. It's preparation.

Aurigen gives you B. For $197. One time.

No subscription. No renewal. No recurring charge. You pay once and keep access permanently — including every update we make.

[UNLOCK FULL ACCESS — $197 >>](https://buy.stripe.com/14AaEXfcU3aYdCX55E2VG02)

If you have questions, reply to this email. We read every one.

— Aurigen Intelligence

*Comparable tools charge $200+/month. Data sourced from public county records. Educational only — not investment advice.*

---

## IMPLEMENTATION NOTES FOR LANDO
1. Load all 5 emails into GHL as a workflow triggered by the "Free Access" tag
2. Set delays: immediate, +1 day, +3 days, +5 days, +7 days
3. Add the Stripe link as the primary CTA in each email
4. If user purchases (Stripe webhook fires), remove from sequence immediately
5. From address: use your GHL verified sender
6. All links should use UTM parameters: `?utm_source=ghl&utm_medium=email&utm_campaign=nurture_seq&utm_content=email_N`
7. **Legal strings** (FTC disclaimers at bottom of each email) — flag for native speaker review if sending Spanish version
