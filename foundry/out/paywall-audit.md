# Paywall audit: what is paid-only today, and what it would take to make each free to read

bd item: aurigen-directory-8z1.1. Written 2026-11-01. Nothing on the site was changed.

## The rule being tested

Lando, 2026-11-01: **No public fact sits behind a paywall. Every row in the Rules Sheet and the
Spreadsheet Pack must also be readable free on the site. People pay for the compiled, sortable,
downloadable version and the cheap property searches, never for access to the law itself.**

So the test for each paid thing is not whether it is sold. It is whether the same fact can also be
read free on the site. Charging for the compiled artefact is allowed; charging for the fact is not.

## Finding 1: today the rule is broken by the deployment, not by the products

Checked live on 2026-11-01:

| Path | Status |
|---|---|
| `/` | 503 |
| `/state/al/` | 503 |
| `/rules-sheet/` | **200** |
| `/status.json` | 200 |

The live Worker is the under-review build (`under-review/worker.js`), which answers every path with
the same 503 page — except the Rules Sheet, which `handleSheet` serves before the 503 (line 38-39),
and `/status.json`.

**So right now the only way to read Aurigen's audited law content is to pay $19.** The free site that
would carry the same facts is switched off. No individual product is at fault; the combination of
"site hidden" and "sheet live" is. Anything that publishes or links the sheet while the site is still
under review would be selling the only available copy of public record.

This is the first thing to fix, and it is already tracked: `aurigen-directory-rkk.5` (take the live
site off the under-review page). Under the new rule that item stops being a nice-to-have and becomes
a precondition of selling anything, so it now gates the launch too.

## Finding 2: the four paid surfaces

| # | Item | Price | Live today | What the buyer actually gets | Every fact also free to read? |
|---|---|---|---|---|---|
| 1 | Aurigen Rules Sheet | $19 once | **Yes**, unlisted at `/rules-sheet/` | 1,181 rows across 44 states, grouped, side by side, each row with statute, official link, date checked **and the quote**; plus a CSV download | Facts: **yes**. Quotes: **no** |
| 2 | Spreadsheet Pack | $19 once | No — `PAID_EXTRAS=off`, `/extras/` 404s | `aurigen-states.csv` (13 columns) and `aurigen-counties.csv` (12 columns), via `/api/export.csv` with a valid `pack` key | **Yes, every column** |
| 3 | Sale Calendar | $3/mo or $29/yr | No — same switch | `.ics` feed of upcoming county sale dates, via `/api/calendar.ics` with a valid `cal` key | **Yes, every date** |
| 4 | `/extras/files/*` | n/a | Never served | The raw build artefacts the two APIs read from. `worker.js` line 49 404s this path unconditionally, by design | n/a — contents covered by rows 2 and 3 |

### 1. Rules Sheet — one real gap: the quotes

Row by row, the sheet's facts are all on the free state page. Checked field by field against
`cloudflare/scripts/build-site.mjs`:

| Sheet group / row | Free state page |
|---|---|
| Basics: Sale type, Interest or penalty, Rate note, Redemption, Bid method, Main statute, When, Where the sale is held | `auditedFacts()` — Sale type, Interest / penalty (+ rate note), Redemption, Bid method, Statute (linked), Auction platform, Auction timing |
| In short | `auditedProse()` — Summary (summary, typeWhy, rateWhy) |
| Registering and paying | "How to sign up for the auction" (signup.platform, steps, deposit) |
| Buying after the sale (OTC) | "Over the counter (OTC)" (otc.available, otc.note) |
| Check before you bid | "Risks" and "Extra due diligence" |
| Money left after the sale | "Surplus proceeds" |

Both sides also hide the same things: the sheet takes only supported or corrected, unheld claims, and
the free page renders through `shownClaims`, which drops held and flagged ones the same way. So the
22 held Oklahoma claims are absent from both, consistently.

**The gap:** the sheet shows the verbatim statute **quote** behind every row (`under-review/sheet.js`
line 65, a `<details>` under each source). The free site never renders a quote — `grep quote` finds
nothing in `build-site.mjs` or `law-pieces.mjs`. The free page gives the statute name, the official
link and the date checked, but not the sentence the claim rests on.

Whether that counts as a public fact behind a paywall is genuinely arguable: the quote is a verbatim
excerpt of a public statute, one click away on the government page that the free site already links.
But it is Aurigen's own saved copy of the fact, it is the thing that makes a claim checkable without
leaving the site, and it is sold. Under the rule as written, it should be free.

**What it would take:** a change to `cloudflare/scripts/build-site.mjs` only. No new data and no new
source fetches — the quote is already in every ledger at `cloudflare/data/law/<st>.json` as
`claims[].quote`, and `law-pieces.mjs` already loads it. The work is to render it next to each fact,
or inside the existing Sources list, in the same collapsed `<details><summary>quote</summary>` shape
the sheet uses. Roughly one function plus a little CSS. The gate `cloudflare/scripts/check-law.mjs`
would want a case proving the quote renders, the way it already proves the status labels do.

After that fix, the sheet sells only the compilation: 44 states side by side, sortable, downloadable,
in one file. That is squarely what the rule permits.

### 2. Spreadsheet Pack — already compliant

`aurigen-states.csv` columns: state, state_name, sale_type, interest_or_penalty, redemption,
bid_method, statute, statute_link, auction_timing, otc_available, last_checked, check_status,
check_source. Every one is in `auditedFacts()` or the freshness line on the free state page.

`aurigen-counties.csv` columns: state, state_name, county_or_town, kind, sale_type, redemption,
interest_or_penalty, auction_platform, official_link, sale_timing, notes, research_dated. Every one is
in the `countyJson` the free state page ships to the browser for its county list
(`n, k, t, r, x, p, u, no, v, e, cs`).

**Nothing to make free.** The pack sells the file, not the facts. The only caveat is Finding 1: the
columns are free to read on pages that are currently 503.

### 3. Sale Calendar — already compliant

The feed is built from `extras/files/sales.json`, which `build-site.mjs` derives from each county's
own date fields, falling back to the state's auction frequency. Those dates reach the free state page
inside `countyJson` as `e: c.extra`, and the state's auction timing is a row in `auditedFacts()`.

What is paid is the aggregation and the subscription: every upcoming sale in the next 12 months across
every county, in one feed a calendar app can follow. Each date is free to read on its county's page;
the 12-month cross-state list is not. That is a compilation of free facts, which the rule permits.

**Nothing to make free**, subject to Finding 1.

## Finding 3: what is not affected

- The free site itself has no paywall, no gate, no account and no login. The $197 Stripe gate and the
  3-free-states model died with the Netlify app.
- `/api/license` only validates a key. It exposes nothing.
- The cheap property search Lando wants does not exist yet, so there is nothing to audit. Its own
  item (`aurigen-directory-8z1.2`) is where the data source and licence question gets settled, and
  that one needs care: a paid search is only clean under this rule if what it sells is the lookup
  work, not exclusive access to a record.

## What this adds up to

1. **Do not publish or link the Rules Sheet while the site is 503.** Under the new rule the under-review
   page turns the sheet into the only readable copy of the law. `rkk.5` now gates the launch.
2. **Render the quotes free** (`build-site.mjs`). One build-script change, no new data, and it closes
   the only place where a fact is sold and not also given.
3. **The Pack and the Calendar need no change.** Both sell format and aggregation over facts that are
   already free on the site.
4. **Nothing was changed on the site to produce this list.** All of it was read from the repo and four
   live HTTP status checks.
