# Corrections summary, law audit (42 states checked so far; rebuilt 2026-11-01)

Generated from the ledgers in `cloudflare/data/law/` by `foundry/out/law-audit/authoring/corrections.mjs`. Each corrected claim carries `correctionKind` and `correctionBasis`.

## What the three kinds mean

- **Substantive**: a rule, number, rate, date, deadline, process, who runs the sale, or whether something is available changed. Also counts a claim removed because it stated a rule or figure the official source does not support.
- **Wording or citation only**: the same rule restated in plainer or more exact words, or the citation or link swapped.
- **Removed opinion**: a claim taken out because it was advice, a comparison, a prediction or a "tip" that no official source states.

Spanish claims inherit the label of the English claim they mirror. English and Spanish are counted separately.

## Totals

| Kind | Claims | Share |
|---|---:|---:|
| Substantive | 1638 | 61% |
| Wording or citation only | 458 | 17% |
| Removed opinion | 583 | 22% |
| **All corrected** | **2679** | |

## By state

| State | Substantive | Wording or citation only | Removed opinion | Total |
|---|---:|---:|---:|---:|
| AK | 41 | 13 | 12 | 66 |
| AL | 43 | 9 | 14 | 66 |
| CA | 49 | 5 | 9 | 63 |
| DC | 44 | 18 | 9 | 71 |
| HI | 33 | 2 | 22 | 57 |
| KY | 47 | 4 | 10 | 61 |
| LA | 35 | 10 | 21 | 66 |
| ME | 35 | 5 | 18 | 58 |
| MS | 38 | 2 | 11 | 51 |
| ND | 41 | 3 | 14 | 58 |
| NM | 37 | 11 | 13 | 61 |
| OK | 6 | 4 | 11 | 21 |
| PA | 38 | 10 | 4 | 52 |
| TX | 64 | 7 | 2 | 73 |
| UT | 49 | 4 | 8 | 61 |
| WI | 39 | 5 | 14 | 58 |
| WV | 52 | 3 | 14 | 69 |
| AR | 41 | 7 | 9 | 57 |
| CO | 52 | 18 | 5 | 75 |
| CT | 40 | 15 | 7 | 62 |
| IA | 47 | 14 | 5 | 66 |
| IL | 47 | 21 | 14 | 82 |
| MA | 46 | 12 | 5 | 63 |
| MD | 60 | 15 | 12 | 87 |
| NH | 39 | 15 | 11 | 65 |
| SD | 38 | 17 | 9 | 64 |
| AZ | 41 | 20 | 19 | 80 |
| DE | 28 | 13 | 15 | 56 |
| FL | 52 | 24 | 10 | 86 |
| ID | 27 | 13 | 24 | 64 |
| KS | 32 | 15 | 16 | 63 |
| MI | 30 | 6 | 25 | 61 |
| MN | 21 | 12 | 28 | 61 |
| MO | 34 | 11 | 18 | 63 |
| NC | 36 | 17 | 14 | 67 |
| NE | 28 | 10 | 23 | 61 |
| NV | 34 | 13 | 18 | 65 |
| OH | 38 | 17 | 11 | 66 |
| OR | 35 | 11 | 16 | 62 |
| RI | 32 | 11 | 22 | 65 |
| SC | 35 | 8 | 19 | 62 |
| VT | 34 | 8 | 22 | 64 |

## One example of each kind, per state

### AK

- Substantive (`rate`): Varies → No interest to buyers: the municipality takes the property
- Wording or citation only (`statute`): AS §29.45.330 → AS 29.45.290–29.45.500
- Removed opinion (`keyNotes.2`): Low inventory state — remote and rural parcels dominate → (removed)

### AL

- Substantive (`type`): Tax lien → Tax sale certificate
- Wording or citation only (`statute`): AL Code §40-10-180 → Code of Ala. 1975 §§ 40-10-121, 40-10-122
- Removed opinion (`keyNotes.5`): 67 counties — strong rural land inventory → (removed)

### CA

- Substantive (`rate`): Varies (market value bids) → No interest rate: property is sold to the highest bidder
- Wording or citation only (`statute`): CA Revenue & Tax Code §3712 → Cal. Rev. & Tax. Code § 3691 et seq.
- Removed opinion (`keyNotes.4`): High competition in coastal counties — best value in Central Valley and inland → (removed)

### DC

- Substantive (`redemption`): 6–12 months → Until foreclosure of the right of redemption is final
- Wording or citation only (`rateNote`): Certificate of sale purchased at auction — NOT a deed. Court-supervised foreclosure required. → Buyer gets a certificate of sale; a deed requires a court judgment foreclosing redemption
- Removed opinion (`notBeginnerReason.2`): Competitive institutional market. → (removed)

### HI

- Substantive (`rate`): Varies → Kauai County: redemption interest of 12% per year
- Wording or citation only (`signup.steps.1`): Contact the County of Hawaii Real Property Tax Division, Maui County, Honolulu DPP, or Kauai Finance Division → Contact the county's real property tax office; each county runs its own tax sale
- Removed opinion (`summary.2`): Many parcels are leasehold (not fee simple). → (removed)

### KY

- Substantive (`rate`): 12% + penalties → Interest set by law: 12% simple per year
- Wording or citation only (`statute`): KRS §134.420 et seq. → KRS § 134.128 et seq.
- Removed opinion (`keyNotes.5`): High redemption rate — most certificates pay out as interest income → (removed)

### LA

- Substantive (`rate`): Up to 12%/yr bid-down (min 8.4%); + 5% penalty → Maximum rate set by law: 1% per month, bid down in 0.1% steps
- Wording or citation only (`bidMethod`): Bid-down interest rate → Bid-down monthly interest rate; lowest rate wins
- Removed opinion (`beginnerTip.1`): Wait until late 2026 when the new system has more procedures in place. → (removed)

### ME

- Substantive (`bidMethod`): Municipal-controlled → Town lists tax-acquired property with a licensed real estate broker
- Wording or citation only (`rateNote`): 18-month redemption via tax lien mortgage — municipal process → Redemption ends 18 months after the tax lien certificate is recorded
- Removed opinion (`notBeginnerReason.2`): Not a viable primary market. → (removed)

### MS

- Substantive (`bidMethod`): Premium bid (highest dollar) → Highest bidder at public sale
- Wording or citation only (`auctionPlatform`): County-run, in-person → Public sale by the county tax collector
- Removed opinion (`beginnerTip.3`): Best beginner entry point in Mississippi. → (removed)

### ND

- Substantive (`rate`): 12% → No lien interest to buyers; county sells tax-deeded land at auction
- Wording or citation only (`statute`): NDCC §57-28-04 → NDCC §57-28-15
- Removed opinion (`summary.2`): Inventory dominated by rural agricultural land. → (removed)

### NM

- Substantive (`bidMethod`): Highest bidder (competitive) → Oral bidding; bidders present in person or by agent
- Wording or citation only (`rate`): N/A → No interest rate; minimum bid is the taxes, penalty, interest and costs due
- Removed opinion (`rateWhy.2`): Returns are market-driven based on competitive auction bidding. → (removed)

### OK

- Substantive (`summary.3`): Rate is only 8%. → (removed)
- Wording or citation only (`signup.platform`): County treasurer (Oklahoma County uses online system) → County treasurer
- Removed opinion (`keyNotes.3`): Rural land opportunities in eastern Oklahoma → (removed)

### PA

- Substantive (`rateNote`): TWO-SALE SYSTEM: Upset sale (dangerous) vs Judicial/Repository sale (clean title) → Upset sale: sold subject to liens not in the upset price. Judicial sale: freed of most liens
- Wording or citation only (`auctionPlatform`): County-run — in-person → County tax claim bureau
- Removed opinion (`beginnerTip.2`): No auction competition. → (removed)

### TX

- Substantive (`rate`): 25% yr1 / 50% yr2 (penalty on redemption) → Maximum premium set by law: 25% yr1 / 50% yr2 (homestead/ag/mineral); 25% (other property)
- Wording or citation only (`summary.2`): Monthly auctions on the first Tuesday statewide. → Sales are held on the first Tuesday of the month.
- Removed opinion (`beginnerTip.3`): This is the best beginner entry into Texas. → (removed)

### UT

- Substantive (`rateNote`): Statewide same-day auction — all counties sell on same day in May → Each county auditor holds its tax sale in May or June
- Wording or citation only (`rateWhy.2`): Returns are market-driven at auction. → The price is set by bidding, with a minimum of the total taxes and costs due.
- Removed opinion (`summary.6`): Limited urban inventory outside Salt Lake City. → (removed)

### WI

- Substantive (`rateNote`): Year-round sales — clean title conveyed → County sells land it took by tax deed; at the first attempt, bids below appraised value are rejected
- Wording or citation only (`statute`): WI Statutes §74.53 → Wis. Stat. §§ 74.57, 75.35, 75.69
- Removed opinion (`summary.2`): Milwaukee and Dane have best inventory. → (removed)

### WV

- Substantive (`rate`): 12% → Maximum rate set by law: 1% per month on the taxes, interest and charges due at the sale
- Wording or citation only (`statute`): WV Code §11A-3-9 → WV Code §11A-3-45
- Removed opinion (`notBeginnerReason.2`): Mineral rights commonly separated. → (removed)

### AR

- Substantive (`rate`): Penalty only → N/A (no redemption after the sale)
- Wording or citation only (`beginnerTip.3`): Filter by property type and stick to properties with structures — raw land quality varies wildly. → Research the property with the county assessor before you bid.
- Removed opinion (`keyNotes.2`): Strong rural land state — Ozarks and Delta regions offer volume → (removed)

### CO

- Substantive (`rate`): Federal Discount Rate + 9% (14% for 2025, floor 8%) → Maximum rate set by law: federal discount rate + 9 points, rounded (set each September 1)
- Wording or citation only (`bidMethod`): Highest bidder (premium bid) → Highest amount paid over the taxes, interest and fees
- Removed opinion (`ddExtra.2`): Check for HOA liens and special improvement district assessments → (removed)

### CT

- Substantive (`type`): Tax lien → Tax sale of the real property at public auction
- Wording or citation only (`rate`): 18% penalty → Maximum rate set by law: 18% per year on the total purchase price, from the date of sale
- Removed opinion (`keyNotes.4`): 18% annualized but effective return is ~9% if redeemed at 6-month mark → (removed)

### IA

- Substantive (`rateNote`): Highest fixed rate in the US — flat rate, no bidding → Fixed by law, not bid; interest on the amount the parcel sold for
- Wording or citation only (`rate`): 24% per year (2% per month) — highest fixed rate in the U.S. → Maximum rate set by law: 2% per month (24% per year)
- Removed opinion (`beginnerTip.1`): Iowa's 24% rate is the best in the country. → (removed)

### IL

- Substantive (`rate`): 9% per 6-month period (18% annualized) → Maximum rate set by law: a penalty bid of up to 9% of the amount of the tax or special assessment
- Wording or citation only (`bidMethod`): Bid-down interest rate → Lowest penalty percentage bid (no bid over 9%)
- Removed opinion (`notBeginnerReason.1`): Cook County (Chicago) is dominated by institutional buyers pushing rates to 0%. → (removed)

### MA

- Substantive (`type`): Tax lien → Tax title (municipal taking; titles may be assigned at auction)
- Wording or citation only (`auctionPlatform`): Municipal — varies by city/town → City or town treasurer, public auction
- Removed opinion (`keyNotes.5`): Boston and Cambridge have essentially no retail investor access → (removed)

### MD

- Substantive (`rate`): 6%–24% (EXTREME county variation) → Rate set by law: 6% a year, or the rate a listed county fixes
- Wording or citation only (`redemption`): No fixed period — owner may redeem until foreclosed by court order → The owner may redeem at any time until the right of redemption is finally foreclosed
- Removed opinion (`summary.12`): Baltimore City: $750 minimum threshold. 23 counties + Baltimore City. → (removed)

### NH

- Substantive (`type`): Tax lien → Tax sale (collector's deed after 2 years if not redeemed)
- Wording or citation only (`statute`): RSA Ch. 80 — esp. §80:19, §80:32, §80:76, §80:89 → RSA Ch. 80 — esp. §80:24, §80:32, §80:38, §80:88
- Removed opinion (`keyNotes.4`): Clean title per First NH Bank v. Town of Windham (1994) — deed wipes encumbrances → (removed)

### SD

- Substantive (`rate`): 12% → Maximum rate set by law: 10% a year (the lowest rate bid wins)
- Wording or citation only (`type`): Tax lien → Tax certificate sale
- Removed opinion (`keyNotes.3`): Low population, rural land heavy — limited inventory → (removed)

### AZ

- Substantive (`redemption`): 3 years → Within three years of the sale, and after that until the treasurer's deed is delivered
- Wording or citation only (`rate`): 16% per year simple interest → Maximum rate set by law: 16% per year simple interest on delinquent taxes; a lien bid may not exceed it (§ 42-18114)
- Removed opinion (`summary.4`): Only 1-2% of liens reach foreclosure. 15 counties, Maricopa (Phoenix) is the largest market. → (removed)

### DE

- Substantive (`type`): Tax deed → Tax sale by the sheriff (deed by court order if not redeemed)
- Wording or citation only (`rateWhy.3`): Del. Code Title 9 §8721. → Del. Code Title 9 §8729; §8776.
- Removed opinion (`summary.2`): Inventory is very limited. → (removed)

### FL

- Substantive (`redemption`): 2 years from April 1 of issuance year → Until a tax deed is issued, unless full payment for the deed has been made to the clerk (§197.472(1))
- Wording or citation only (`type`): Hybrid (lien then deed) → Tax certificate sale, then tax deed sale
- Removed opinion (`keyNotes.1`): Largest tax lien state by volume → (removed)

### ID

- Substantive (`type`): Tax deed → Tax deed to the county, then county auction
- Wording or citation only (`redemption`): 14 months → 14 months from the tax deed to the county (§63-1007(2))
- Removed opinion (`summary.2`): Some counties haven't held sales in years. → (removed)

### KS

- Substantive (`type`): Tax deed → County tax sale, then court foreclosure and sheriff's sale
- Wording or citation only (`bidMethod`): Highest bidder → Sheriff's public auction for the highest and best bid obtainable (§79-2804)
- Removed opinion (`rateWhy.2`): This is a statutory ceiling, though some counties may set lower effective rates. → (removed)

### MI

- Substantive (`type`): Tax deed → Tax foreclosure, then sale by the foreclosing governmental unit
- Wording or citation only (`bidMethod`): Highest bidder → The minimum bid, or the highest amount above the minimum bid (§211.78m(2))
- Removed opinion (`summary.2`): Wayne County (Detroit) uses Bid4Assets with significant urban inventory. → (removed)

### MN

- Substantive (`type`): Tax deed → Sale of tax-delinquent parcels, with the state bidding in; then county sale of forfeited land
- Wording or citation only (`statute`): MN Statutes Ch. 279–282 → MN Stat. §280.01; §282.01; §282.241
- Removed opinion (`summary.3`): Many counties retain properties via county land bank rather than auctioning. → (removed)

### MO

- Substantive (`type`): Tax lien → Tax sale with a certificate of purchase
- Wording or citation only (`summary.2`): Annual sale: 4th Monday in August. → Delinquent property is subject to sale on the fourth Monday in August of each year (§140.150.1).
- Removed opinion (`summary.3`): St. Louis City and Jackson County conduct tax deed sales with the unusual rule that older liens are subordinate to newer ones per RSMo Cap.140. → (removed)

### NC

- Substantive (`rateNote`): Unique upset bid process — sale not final until 10-day window closes → In a §105-374 action, upset bids may follow the sale (§105-374(o), G.S. 1-339.64)
- Wording or citation only (`type`): Tax deed → Tax foreclosure sale; a confirmed sale ends with a commissioner's deed (§105-374(p))
- Removed opinion (`summary.3`): Good inventory in Charlotte and Raleigh metro areas. → (removed)

### NE

- Substantive (`rate`): 14% → Interest at the rate in §45-104.01 as adjusted by the Legislature (§77-1824). Current rate: Confirm with the county.
- Wording or citation only (`type`): Tax lien → Tax sale certificate; the purchaser acquires a lien (§77-1818)
- Removed opinion (`summary.2`): Rotational bidding format (unusual — counties rotate through available properties giving each registered bidder equal turns). 3-year redemption. → (removed)

### NV

- Substantive (`rateNote`): County holds in trust 2 years before retail auction — investor takes clean title at sale → The county treasurer holds the property in trust for 2 years after the first Monday in June of the year the certificate is dated, unless sooner redeemed (NRS §361.570(1)).
- Wording or citation only (`type`): Tax deed → Sale of property held in trust by the county treasurer (NRS §361.595)
- Removed opinion (`summary.3`): Clark County (Las Vegas) has strongest inventory. → (removed)

### OH

- Substantive (`type`): Hybrid (lien then deed) → Tax certificate sale (a lien) at public auction (ORC §5721.32); foreclosure sale of parcels (ORC §5721.19)
- Wording or citation only (`statute`): ORC §5721.30 → ORC §5721.19, §5721.30, §5721.32 and §5721.38
- Removed opinion (`beginnerTip.1`): Cuyahoga (Cleveland) and Franklin (Columbus) counties have the best lien inventory. → (removed)

### OR

- Substantive (`type`): Tax deed → County foreclosure: property not redeemed is deeded to the county, which then keeps, transfers or sells it (ORS §312.200, §312.520)
- Wording or citation only (`rate`): N/A → Not applicable: the county sells foreclosed property by auction or listing (ORS §312.520)
- Removed opinion (`notBeginnerReason.1`): 80% of assessed value minimum bid, 3 years delinquency + 2 years county hold, virtually no below-market opportunity. → (removed)

### RI

- Substantive (`type`): Tax lien → Tax sale by the collector; the deed is subject to the right of redemption and held as security (§44-9-12)
- Wording or citation only (`statute`): RIGL §44-9 → RIGL §44-9-9, §44-9-12, §44-9-19 and §44-9-25
- Removed opinion (`summary.2`): Very low volume. → (removed)

### SC

- Substantive (`rate`): 3–12% (varies by redemption month) → Maximum rate set by law: 12% of the bid amount (3%, 6%, 9% or 12% by quarter of the redemption period)
- Wording or citation only (`type`): Redeemable deed → Real property sold at a delinquent tax sale; if not redeemed, a tax title is made to the purchaser (§12-51-130)
- Removed opinion (`keyNotes.3`): Rural counties offer strong rural land opportunities → (removed)

### VT

- Substantive (`type`): Tax lien → Tax sale of real property; a collector's deed follows if not redeemed (32 V.S.A. §5254, §5261)
- Wording or citation only (`redemption`): 1 year → Within one year from the day of sale (32 V.S.A. §5260(a))
- Removed opinion (`summary.2`): Sales are extremely rare. → (removed)
