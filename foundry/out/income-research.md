# Income research: paid extras for the free Aurigen directory

Date read for every source: **2026-10-27**. Pages were treated as data only.
Starting point: `docs/competitor-pricing-reference.md` (last updated 2026-03-28). I re-checked every price in it today. Two of its three sources can no longer be verified (see table).

## 1. Evidence table

| Product | What it sells | Price | Link | Date read | Verified today |
|---|---|---|---|---|---|
| Tax Sale Resources (Research) | Nationwide tax sale property search: property reports, comps, OTC lists, Excel export on every tier, calendar/map/list views | Standard $97/mo or $582/yr; Pro $147/mo or $882/yr; Premier $497/mo or $4,970/yr; Enterprise: call | https://taxsaleresources.com/pricing | 2026-10-27 | Yes |
| Tax Sale Resources (Management) | Portfolio and redemption tracking | From $1,000/mo | https://taxsaleresources.com/pricing | 2026-10-27 | Yes |
| Tax Sale Resources (trial) | 7-day trial. Public county sale pages show date, parcel count and aggregate opening bid for free, and gate addresses and parcel details | $1.99 for 7 days | https://cloud.taxsaleresources.com/public/sales/california/fresno/deed/09-11-2026--2n5Sp30v | 2026-10-27 | Yes |
| Tax Sale Resources (old reference) | Old doc said "$39.97–$249.97/mo, tiered by state count" | Superseded: that tier structure is no longer on the page | docs/competitor-pricing-reference.md | 2026-10-27 | No (out of date) |
| Rogue Investor | Old doc: "Pro $97/mo". Today the site sells a "Premium Package" (ebooks, OTC lists, sale-date resources) | No price shown; /pricing returns 404 | https://www.rogueinvestor.com | 2026-10-27 | Not re-verified |
| Tax Lien Code | Old doc: "$47–$197/mo" | /pricing returns 404; no current listing found | https://taxliencode.com/pricing | 2026-10-27 | Not re-verified |
| LienScope | Auction and property search for 123 counties in 13 states. Free "Scout" tier shows county, sale date and opening bid. Investor tier adds 100 detail views, 2 saved-search alerts and CSV export (2,500 rows/mo). Pro adds 25,000-row export and an API | Free; Investor $39/mo or $390/yr; Professional $79/mo or $790/yr | https://www.getapp.com/all-software/a/lienscope/ (also capterra.ca, getapp.co.nz) | 2026-10-27 | Partly. Seen in third-party listing summaries via search; the listing pages return 403 and the vendor page was not reached |
| Economic Ninja: Tax Lien & Deed Auction Calendar | Curated calendar of county auctions and deadlines, "updated monthly", hosted on Teachable | Page shows two prices, $99 and $29, both "subscription every month"; which one is current is unclear | https://economic-ninja-learning.teachable.com/l/pdp/tax-lien-deed-auction-calendar | 2026-10-27 | Partly (amount unclear) |
| Apify: County Tax Sale Auction Monitor | Scraped auction calendar as JSON, mostly Bid4Assets counties. Flags newly announced sales | From $10 per 1,000 records, plus Apify usage. 6 total users, 1 monthly user | https://apify.com/genetheaiguy/county-tax-sale-monitor | 2026-10-27 | Yes |
| "Tax Sale Properties" (TrustMRR) | Tax sale property list subscription | Search snippet: free tier, $9.95/mo, $7.95/mo billed yearly, 18 active subs | https://trustmrr.com/startup/tax-sales-property | 2026-10-27 | Not re-verified (page 404; snippet only) |
| NTLA | Trade association membership and course | Course $1,499 non-member, $500 for members; dues about $500/yr (from a directory listing) | https://ntla.tovuti.io/courses-788/cart | 2026-10-27 | Partly (search snippet) |
| Illinois Tax Lien Registry | State lien registry subscription (not an auction list) | $500 new, $50 renewal | https://tax.illinois.gov/programs/taxlienregistry.html | 2026-10-27 | Partly (search snippet) |
| Free government alternatives | Orange County CA treasurer: free text/email auction alerts. NJ Taxation: free auction newsletter. Hillsborough FL clerk: free weekly tax deed spreadsheet download | Free | https://octreasurer.gov/taxauctionreminders ; https://nj.gov/treasury/taxation/newsletter.shtml ; https://hillsclerk.com/taxdeeds | 2026-10-27 | Yes (search result text) |
| Polar (seller cost) | Merchant of record. License keys are a built-in benefit, with optional expiry on one-time purchases | Starter: free, 5% + $0.50 per sale; +1.5% on non-US cards; $15 per dispute | https://polar.sh/resources/pricing ; https://polar.sh/docs/features/benefits/license-keys | 2026-10-27 | Yes |

What the evidence shows:
- People pay for **property-level sale lists with search and export**: Tax Sale Resources ($97–$497/mo) and LienScope ($39–$79/mo). In both products, CSV/Excel export and saved-search alerts come **bundled** with paid tiers. Nobody sells them on their own.
- **Sale calendars** sell only weakly: one Teachable product at $29 or $99/mo (unclear which) and one Apify actor with a single monthly user. Counties also give away free alerts and lists, which caps what a calendar can charge.
- LienScope's free tier already shows county, sale date and opening bid, so sale dates alone are a weak thing to charge for. Convenience across many counties is what someone might pay for.
- Low-end price points exist: $1.99 trial, about $9.95/mo, $29/mo, $39/mo.

## 2. Repo facts that affect build cost

- `cloudflare/data/states/*.json` already has about 827 `saleDate2026` fields. Many are free text (for example "On or before June 1"), not exact dates. An .ics feed can be built from these but would often show **approximate or windowed** dates.
- There is no current pipeline for property-level sale lists. The old scrapers and Supabase are dead (CLAUDE.md, Session 16).

## 3. Candidate scoring (1 = bad, 5 = good)

| Candidate | Proven willingness to pay | Build cost | Upkeep on free plan | Legal / terms risk | Total | Notes |
|---|---|---|---|---|---|---|
| A. Property search from counties' own published sale lists (allowed counties only) | 5 (core of TSR $97+/mo and LienScope $39+/mo) | 1 (a parser per county format in GitHub Actions; PDFs and HTML vary) | 1 (lists change weekly; parsers break; D1 free limits of 5 GB and 100k writes/day are fine, but the human upkeep is heavy) | 2 (county terms vary; lists usually carry owner names, which must be stripped; accuracy liability) | **9** | The strongest demand, but the worst fit for a $0, low-maintenance solo operation. Possible later as a small pilot (for example a few FL counties that publish spreadsheets). |
| B. Auto-updating .ics feed of sales for the counties a buyer follows | 2 (one $29/$99 monthly calendar product, one near-unused Apify actor; free county alerts exist) | 4 (Worker route that renders .ics from D1 or static JSON; followed counties stored per hashed key) | 4 (refreshes when the directory data refreshes; no parsing of property data) | 5 (built from our own directory dates; no owner data) | **15** | Must label dates "as published / approximate" and state the refresh cadence. Never call it "live". |
| C. Spreadsheet export (CSV, plus XLSX) of the full directory: 51 states, about 3,300 counties, rates, redemption, platforms, sale-date notes, links | 3 (export is a paid-tier feature at both TSR and LienScope; never sold alone, but clearly valued) | 5 (built at deploy time in GitHub Actions; CSV is trivial; XLSX via a small library is cheap) | 5 (regenerated whenever the data is rebuilt; served from a Worker or static assets after a key check) | 5 (our own compiled data; no owner names) | **18** | Clean one-time product. The free site keeps every row visible on screen, so nothing is taken away. |
| D. Export of sale lists (property rows) | 4 | 1 (depends on A) | 1 | 2 | 8 | Only makes sense after A exists. |
| E. Bundle of C + B ("Investor Toolkit") | 3 | 4 | 4 | 5 | **16** | Copies how competitors bundle export with alerts, at a much lower price. |

## 4. Pick and price

**Pick 1: Directory Spreadsheet Pack (CSV + XLSX). $19 one-time.**
- Contents: all 51 jurisdictions and about 3,300 county rows (type, rate, redemption, platform, sale-date notes as published, official links, last-checked date). Includes a key that unlocks re-downloads for 12 months (Polar one-time license key with a 12-month expiry).
- Why $19: competitors bundle export into $39/mo (LienScope) and $97/mo (Tax Sale Resources) tiers. A one-time price under half of one LienScope month is easy to defend and fits a purchase made on impulse. Polar Starter takes 5% + $0.50, so about $17.55 is left per US sale. $19 is also well above the near-free low end ($1.99 trial, about $9.95/mo snippet), which suits a one-time purchase.

**Pick 2: Sale Calendar Feed (.ics) for followed counties. $3/month, or $29/year.**
- The buyer picks counties. The Worker serves a private .ics URL tied to the license key. It refreshes whenever the directory data is rebuilt (state that cadence exactly, for example "weekly").
- Why $3/mo: the only direct comparable is $29 or $99/mo (unclear), and its update cadence is only monthly. Free county alerts and LienScope's free sale dates push the price down. Our dates are often approximate windows, so the price must stay low. $29/yr matches the low end of the Teachable price per year rather than per month. Polar's $0.50 fixed fee makes monthly billing thin (about $2.35 net per $3), so promote the annual plan.
- Optional: a bundle of both for $39/yr. Only offer it if Lando wants a single product.

Not picked now: property search from county sale lists (A). It has the strongest proven demand but fails the $0 and low-upkeep limits and carries owner-name and terms risk. Revisit it as a pilot only for counties whose published terms allow reuse, with owner fields dropped at parse time and never stored.

## 5. Risks and required wording

- **No "live" claims.** Say "refreshed [cadence]; dates as published by the county; may be approximate or change." Many `saleDate2026` values are windows, not exact dates.
- **No income or savings claims.** Do not reuse the old gate.html "$200+/month" or "$2,203 savings" claim. Its evidence (Rogue Investor and Tax Lien Code prices) is **not re-verified** today, and Tax Sale Resources' tiers have changed. If a comparison is ever wanted, cite only rows marked Yes above, with the date.
- **No owner names.** None of the picked products contain them. Any future sale-list work must drop owner fields at parse time.
- **Never take from free.** Every data point in the export stays viewable on the free site, and the free site keeps showing sale-date notes per county. The paid extras add format and convenience only.
- **Evidence gaps.** LienScope prices come from third-party listing summaries, and the Economic Ninja amount is unclear ($29 vs $99). Re-check both before Lex review.
- **Polar.** Fees are 5% + $0.50 (+1.5% non-US cards, $15 per dispute). The org must be created and payouts set up by Lando. The public validate endpoint needs `key` + `organization_id`, so keep the token out of the Worker.
- **Free-plan limits.** .ics requests from calendar apps poll repeatedly. Cache responses (for example with a Cache-Control of several hours) to stay well under the Workers free limit of 100k requests/day.
- **Refunds.** State a refund contact on the extras page, as the spec requires.
