# What a per-parcel property search would actually take

Research for bd aurigen-directory-8z1.2. Written 2026-11-04. **Nothing was built and nothing was
bought.** Lando picks; this only lays out the ground.

Read the confidence markers. Property-data pricing is mostly quote-gated, and a lot of what is written
about it online is wrong in a specific way: people divide a vendor's own example wrong and publish the
result. Where a number is secondhand, it says so.

---

## 1. The question underneath the question

The paid thing cannot be the law. That is settled: every public fact stays free on the site, and the
Rules Sheet went free on 2026-11-04 for the same reason. So a paid property search has to sell
**work on a specific parcel**, which is a different kind of product from anything here today:

| | The directory and the Rules Sheet | A per-parcel search |
|---|---|---|
| What it is about | the rules of a jurisdiction | one piece of land |
| How many facts | ~1,200 sourced rows, fixed | one row per lookup, unbounded |
| Goes stale | when a legislature acts | when anything is recorded |
| Cost to serve | zero, it is static | a fee per lookup, every lookup |
| If it is wrong | a rule is misstated | somebody bids on the wrong dirt |

That last row is the whole risk. Everything Aurigen has built so far is defensible because a claim is
tied to a statute quote and a hash. A parcel card cannot be defended that way, because the underlying
record changes and because the buyer will act on it within days. Whatever gets chosen, the card has to
carry its own provenance and date per field, the same discipline as the law pages, or it is a different
business with a different liability.

## 2. Official county sources

**What they are.** Each county's assessor (parcel, owner, assessed value, characteristics), treasurer
or tax collector (delinquency, amounts owed, sale status), recorder or clerk (deeds, mortgages, liens),
and often a GIS portal (boundaries, and sometimes an ArcGIS REST endpoint that is queryable).

**What Aurigen already has.** 51 jurisdictions and **3,291 county and town records**, of which
**3,153 carry a URL** — treasurer pages, sale pages and auction platform links, already researched.
That is the real asset here. It is not parcel data, but it is the map of where parcel data lives, and
it is the part that usually takes a competitor a year.

**The hard truth about coverage.** *(confidence: high on the shape, low on any number)* There is no
usable national count of how many counties publish parcel data in bulk or through an API, and the
search for one came back with vendor marketing and single-county portals. The pattern is plain even
without a census: some counties are genuinely open (Scott County, Iowa publishes a free bulk export of
assessment data for all parcels, though it excludes Davenport; Snohomish County, Washington publishes
assessment-roll CSVs and refreshes some layers three times a week), and others publish nothing
machine-readable at all. Formats, field names, update cadence and terms differ per county. A figure
like "68% of counties" circulates with no traceable source and should not be repeated.

**What it costs.** Nothing per lookup. The cost is engineering: roughly 3,100 bespoke integrations if
done exhaustively, each of which breaks on its own schedule, and several of which are scraping rather
than API access and therefore a terms-of-use question per county. The Aurigen scrapers already died
once; that is on the record in this repo's own history.

**Honest read.** Official sources are the only route that is free per lookup, the only route that can
be cited the way the law pages are cited, and the only route that cannot be built broadly by one
person. They are excellent for a **narrow** product and impossible for a national one.

## 3. Commercial data providers

**Regrid** — nationwide parcels, the closest fit to "a parcel card".
*Billing unit matters more than the rate:* requests are billed **per parcel record returned**, not per
API call, so a sloppy bounding-box query is expensive and a precise lookup is cheap.
*Numbers (confidence: low, all secondhand):* a self-serve tier described as ~2,000 records/month
included, then **$0.10 per standard record and $0.15 per premium record**; enterprise and bulk
licences quoted variously at **$12,000–$18,000/yr** for API and **~$25,000/yr** for nationwide bulk.
The only clearly published per-request figure found is for the narrower address-autocomplete API at
$0.001. There is a 30-day free trial. Real rates are behind an account.

**ATTOM** — the deep one: ownership, sales history, valuation, tax.
*Billing unit:* per **API Report**, and one property returned is one report.
*Numbers (confidence: medium on the unit rate, low on entry price):* ATTOM's own help-centre example
is **$1,000/month for 100,000 reports, i.e. $0.10 per report**. Entry pricing is quoted inconsistently
across third parties ($89.99/mo, ~$95/mo, $499/yr), which means none of them knows. Note a common
error worth not repeating: several blogs divide that same $1,000 by 100,000 and print **$0.01**, which
is simply arithmetic done wrong, not a cheaper tier.

**Estated** — *effectively gone as a separate option.* Its pricing page 404s and the site now says it
is part of ATTOM. The per-call figures of $0.25 and $0.50 still quoted around the web trace to an
**archived May 2022 page**. Its one genuinely good design idea is worth stealing regardless of vendor:
it billed only when a request returned a real property record, so errors and "not found" were free.

**What this means for a price floor.** The defensible planning number is **$0.10 per parcel lookup**,
because two independent providers land there and one of them publishes it in its own example. Assume
it is quote-gated, assume a monthly minimum, and assume the first conversation is with a salesperson.
At $0.10 a lookup, a $3 product can afford about 30 lookups before data cost alone eats it, which sets
the shape of any pricing below.

## 4. What the one-page card should show

The test for every field: **would a bidder change their bid because of it?** If not, it is decoration,
and decoration on a page someone paid for is worse than a blank.

**The six that decide a tax-sale bid**

1. **Is this parcel actually in the sale, and which sale.** Lien or deed, the sale date, and the case
   or certificate number. Everything else is moot if this is wrong or stale.
2. **What is owed, broken out.** Taxes, interest, penalty, fees, and the opening or minimum bid. The
   number the bidder brings money for.
3. **What the land is.** Acreage, use code, whether there is a structure, and road access. The single
   most common way a beginner loses money is buying a strip of unbuildable land that photographed fine.
4. **What survives the sale.** Jurisdiction-specific, and this is where Aurigen's existing audited law
   data earns its place: in a lien state, what the certificate gets; in a deed state, which liens and
   municipal claims survive. Aurigen can already cite this per state, with a statute quote.
5. **Redemption exposure.** The window, who may redeem, and what redemption pays the holder. Also
   already audited per state.
6. **The two or three things to check before bidding, for this parcel's state.** Not generic advice —
   driven off the state's own due-diligence rows.

**And on every field:** where it came from, the date, and a link. Plus an explicit list of what the card
does **not** know. A card that says "no structure found in the assessor record, last updated 2026-09-14"
is honest and useful. One that says "vacant land" is a claim Aurigen cannot stand behind.

**What to leave out.** Any estimate of value, profit, yield or return. The repo's own gate bans those
words in audited text for good reason, and a tax-sale buyer being handed a valuation is exactly the
FTC exposure the whole project has been avoiding. Comparable sales are a trap for the same reason.

**Where it would live.** Points 4, 5 and 6 need no new data at all — they are already in
`cloudflare/data/law/*.json` with statute quotes. Points 1, 2 and 3 are the ones that need a source.
That split is the most important finding in this document: **about half the card already exists and is
free, and the paid half is three facts about one parcel.**

## 5. Price points

All three assume $0.10/lookup in data cost and a Polar checkout. Polar takes 5% + $0.50, which hurts
small amounts badly: on a $3 sale that is $0.65, over a fifth of it.

**A — Pay per card, $3 each (or 5 for $12).**
Closest to Lando's "cheap property search". Fee maths: $3 − $0.65 Polar − ~$0.10 data ≈ **$2.25**.
*For:* no subscription to justify, no churn, and it matches how a bidder actually behaves — a flurry of
lookups the week before a sale, then nothing. *Against:* Polar's fixed $0.50 is brutal at this size, so
the bundle matters more than the single; and a one-off buyer never becomes a relationship.

**B — $9/month, 50 cards included, $0.50 each after.**
Fee maths: $9 − $0.95 Polar − up to $5 data ≈ **$3 to $8** depending on use.
*For:* survives the data cost at any usage, and 50 cards is more than almost anyone needs in a month,
so most months are nearly pure margin. *Against:* a subscription is a promise of freshness. That means
a refresh pipeline, monitoring, and a support address, and it is the option most likely to end up as a
second unfinished thing.

**C — Free card, paid list. $19 once for every parcel in one county's upcoming sale.**
Fee maths: $19 − $1.45 Polar − data for the whole county list.
*For:* it sells the thing a bidder genuinely cannot assemble (the whole sale list, enriched) rather
than a lookup they could do by hand, it is one purchase per sale per county so the data cost is known
in advance, and it reuses the Rules Sheet's exact shape — a compiled, sourced, downloadable artifact
that is free to read in pieces and paid to have whole. *Against:* county sale lists are the most
fragmented data in this whole space, so coverage would start at a handful of counties, and it needs the
sale calendar to be right.

**Recommendation, since you asked for one: C, scoped to a handful of counties, with the free card as
the front door.** It is the only one of the three that is the same business Aurigen is already good at —
compile something official, cite every line, charge for the compilation and never for the fact. It has
a bounded data cost, no freshness promise beyond a single sale date, and it fails safe: if a county
cannot be done properly, it simply is not offered. A is the right second choice if the goal is to ship
something this month. B is the one I would avoid for now, not because the economics are bad but because
it is the only one that quietly commits to running a pipeline forever.

## 6. What to do before any of this is built

1. **A free Regrid trial, used properly.** 30 days, no money. Pull the three paid-half fields for one
   county that has a real sale coming, then check them against that county's own assessor and treasurer
   pages by hand. That answers the only question that matters and that no amount of reading can:
   *is the commercial data actually right at parcel level?* If it is not, every option above collapses
   and the answer is the narrow official-source product.
2. **Ask ATTOM and Regrid for a written quote** at ~2,000 and ~20,000 lookups a month. Both are
   quote-gated; the numbers in section 3 are mostly secondhand and should not be planned against.
3. **Decide the liability question before the first card ships.** Per-field source and date, an
   explicit "what this does not know" block, and no value, yield or profit language anywhere.

## Sources

Confidence is marked per claim above; these are the pages behind the numbers, and the ones that are
third-party guides rather than vendor pricing pages are flagged as such in the text.

- Regrid API: https://regrid.com/api and https://support.regrid.com/api/section/parcel-api
- Regrid billing by records returned: https://support.regrid.com/docs/api-best-practices
- Regrid pricing, third-party guide: https://scoutdata.com/guides/regrid-pricing
- ATTOM API: https://zillapi.com/blog/attom-api/ and https://marketintelligencetools.com/reports/attom-data-pricing/
- Property data API costs, third-party comparison: https://www.vahorizon.site/blog/property-data-api-costs-for-wholesalers/
- Real estate API pricing overview: https://forage.ai/blog/real-estate-api-pricing/
- County bulk data, examples: https://www.scottcountyiowa.gov/assessor/property-data-bulk-download and https://www.snohomishcountywa.gov/6206/425-388-3331
- Commercial county aggregation, vendor claim: https://taxnetusa.com/data/bulk-licensing/
- Aurigen's own county coverage: `cloudflare/data/states/*.json`, counted 2026-11-04
