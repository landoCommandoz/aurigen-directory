# What to sell first (written 2026-11-01)

Premise check: you asked about the 21 audited states. The audit has moved on: 47 states are done and 44 of them have enough confirmed rows to sell (7 "checked", 37 "checked with gaps"). Everything below uses what is audited and unheld today. Oklahoma (22 withheld claims), Mississippi and New Mexico (too few confirmed rows) and the 4 states that could not be reached (GA, IN, NY, TN) are left out.

## Five options, fastest to sell first

| # | Product | Price | Contains | Must not claim | A human must, once |
|---|---|---|---|---|---|
| 1 | **Rules Sheet**: tax sale rules for every audited state, side by side (built) | $19 once, key valid 12 months | Per state: sale type, rate or penalty set by law, redemption, bid method, where and when, registering and paying, buying after the sale, money left after the sale, what to check before you bid. Each row shows statute, official link, date checked and the quote. Audit flag per state, gaps in plain words. CSV download. Free sample: two clean states. | Income, returns or "safe" or "best" states. Legal advice. That it is complete, current to the day or county-level. Anything not audited. | Finish Polar payout setup. Read 10 rows in 3 states against their official links. Say "publish". |
| 2 | **One-state guide, Texas first** | $9 once | The Texas rows from the same data as a short printable guide: monthly first-Tuesday sales, the 2-year and 180-day redemption windows, the premium, buying resales, surplus claims. Texas is "checked" with no open gaps. | Same as above, plus anything about a specific county's practice. | Same Polar step. Pick the state. |
| 3 | **Pre-bid checklist by sale type** | $7 once | The "check before you bid" rows grouped by redeemable deed, lien certificate and plain deed, each line with its statute. | That a checklist replaces a title search or a lawyer. | Same Polar step. |
| 4 | **Auction date calendar feed** (the existing Sale Calendar idea) | $3 a month or $29 a year | A calendar link (.ics) for fixed-schedule states only (for example Texas first Tuesday). Email alerts need a paid mail service, so the feed is the free version. | That dates are live or certain. Sales move; the rule text is not a date list. | Rebuild the feed from audited timing rules; confirm Polar payout. Slower: new date logic. |
| 5 | **County contact and sale list for one state** | $15 once | Tax collector contacts and sale dates for one state's counties. | Contact details or dates we did not read from the county's own page. | A county-level audit does not exist yet (weeks of work), so a human would have to approve a new source list first. |

## Your four ideas

- Single-state guide at a low price: option 2. It sells slower than option 1 because it reaches only people already focused on that state, and it is a subset of the sheet.
- County contact and auction calendar for one state: options 4 and 5, slowest, because the audit covers state law, not county pages.
- Email alert when dates post: option 4 as a calendar feed. Real email needs a paid mail service, which the standing orders rule out.
- "Which states are safest to start in": not offered under that name. "Safest" is an opinion and a risk claim, and the audit removed hundreds of opinion lines on purpose. Option 1 answers the real question with facts: it puts every state's rules and its audit flag side by side so the reader decides.

## What was built

Option 1, at `/rules-sheet/` on the live Worker, unlisted (no link anywhere, `noindex`). Uses only claims that pass the audit gate, are not held, and whose quote is found word for word in the saved official copy. The free page shows two clean states; the full sheet and CSV need a Polar license key checked against a benefit id. Say "publish" and it gets linked from the under-review footer and loses `noindex`.

## What the showcase adds that the single product does not

- **Trust before the buy.** The sheet asks for $19 on the strength of a claim ("audited"). The showcase lets anyone see all 51 states, what was checked, what was corrected and what could not be reached. It is the proof page the sheet needs.
- **A way in for search.** 51 plain state pages with official links give search engines and shared links something to land on. The sheet is behind a key by design.
- **Honesty about gaps.** It shows "checked with gaps" and "couldn't reach source" openly, which protects the sheet's credibility and answers "why only N states?"
- **Room for more products.** Every state page can point to a state guide or the calendar later without changing the audit.
- **What it cannot do.** It has no checkout, so it sells nothing by itself. It should link to the sheet once the sheet is published.
