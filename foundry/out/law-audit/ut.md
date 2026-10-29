# Utah (UT) law audit

Checked 2026-10-29. Status: done. Ledger: `cloudflare/data/law/ut.json`.

Official code access: Utah Code Title 59, Chapter 2, Part 13 sections fetched from le.utah.gov (Utah State Legislature), using the versioned section files the section pages load (e.g. C59-2-S1351_2023031320230313.html).

## Finding

The site said all Utah counties sell on the same day in May, run by the county treasurer, after five years of
delinquency. The Utah Code says the county auditor selects a date and holds the sale in May or June (§ 59-2-1351(1));
property is listed for sale if not redeemed by March 15 after four years of delinquency (§ 59-2-1343); redemption is
allowed any time before the sale (§ 59-2-1346(1)); bids are to the highest bidder for cash and never below the total
due (§ 59-2-1351(4)); sales may be at the courthouse front door or through an electronic process (§ 59-2-1351(1)(c));
the auditor's deed conveys fee simple (§ 59-2-1351.1(9)). The site's "No OTC program" is contradicted by § 59-2-1351.5:
struck-off property may be sold by the county on terms its legislative body sets. Excess sale funds are treated as
unclaimed property (§ 59-2-1351.1(7)). Removed: the 29-county same-day claim, sheriff sale option, water-rights advice,
inventory and competition opinions, "Returns are market-driven" (banned money word).

## 2023 to 2026 enacted-law search

Searched the section history notes and effective-date versions on le.utah.gov for every Part 13 section cited
(59-2-1343, -1346, -1351, -1351.1, -1351.3, -1351.5); the Part 13 index was checked for new sections on surplus proceeds
(none). Acts found:
- Chapter 97, 2023 General Session: amended § 59-2-1351 (notice and electronic sale), effective 3/13/2023. Current text used.
- Chapter 172, 2025 General Session: amended § 59-2-1343 (tax sale listing), effective 1/1/2026. Current text used.
Bill numbers: the le.utah.gov section bill-history pages returned empty to the runner, so bill numbers were not
recorded. §§ 59-2-1351.1 and 1351.5 were last amended in 2018 (Chapter 197); no post-Tyler change to the
unclaimed-property rule was found.

## Unreachable sources

None.

## Watch

- Post-Tyler: excess proceeds go to unclaimed property (§ 59-2-1351.1(7)); watch for bills changing this.

## Claims

| id | shown | statute | link | status |
|---|---|---|---|---|
| type | Tax deed | Utah Code § 59-2-1351.1(9)(a) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1351.1_2018050820180508.html) | supported |
| rate | N/A | Utah Code § 59-2-1351.1(9)(a) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1351.1_2018050820180508.html) | supported |
| rateNote | Each county auditor holds its tax sale in May or June | Utah Code § 59-2-1351(1)(b) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1351_2023031320230313.html) | corrected |
| redemption | Until the tax sale only (sale held after four years of delinquency) | Utah Code § 59-2-1346(1) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1346_2022050420220504.html) | corrected |
| bidMethod | Highest bidder for cash; no bid below the total taxes and costs due | Utah Code § 59-2-1351(4) (notice form) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1351_2023031320230313.html) | corrected |
| statute | Utah Code §59-2-1351 | Utah Code § 59-2-1351 | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1351_2023031320230313.html) | supported |
| auctionPlatform | County auditor, at the courthouse front door or through an electronic process | Utah Code § 59-2-1351(1)(c) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1351_2023031320230313.html) | corrected |
| auctionTiming | May or June; each county auditor selects the date | Utah Code § 59-2-1351(1)(a) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1351_2023031320230313.html) | corrected |
| summary.1 | Each Utah county auditor holds a tax sale in May or June. | Utah Code § 59-2-1351(1)(b) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1351_2023031320230313.html) | corrected |
| summary.2 | Property goes to tax sale if it is not redeemed after four years of delinquency. | Utah Code § 59-2-1343(1)(a) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1343_2026010120250507.html) | corrected |
| summary.3 | Each county sets its own sale procedures by ordinance, within state tax commission rules. | Utah Code § 59-2-1351.1(2)(b) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1351.1_2018050820180508.html) | corrected |
| summary.4 | No redemption post-sale. | Utah Code § 59-2-1346(1) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1346_2022050420220504.html) | supported |
| summary.5 | (removed) | Utah Code § 59-2-1346(1) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1346_2022050420220504.html) | corrected |
| summary.6 | (removed) | Utah Code § 59-2-1346(1) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1346_2022050420220504.html) | corrected |
| summary.7 | Statute: UCA §59-2-1351.1. | Utah Code § 59-2-1351.1 | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1351.1_2018050820180508.html) | supported |
| typeWhy.1 | Utah sells the property at a May or June tax sale held after four years of delinquency, and the auditor deeds it to the buyer in fee simple. | Utah Code § 59-2-1346(1) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1346_2022050420220504.html) | corrected |
| typeWhy.2 | There is no post-sale redemption period. | Utah Code § 59-2-1346(1) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1346_2022050420220504.html) | supported |
| typeWhy.3 | UCA §59-2-1351.1. | Utah Code § 59-2-1351.1 | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1351.1_2018050820180508.html) | supported |
| rateWhy.1 | Utah is a deed state with no statutory interest rate. | Utah Code § 59-2-1351.1(9)(a) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1351.1_2018050820180508.html) | supported |
| rateWhy.2 | The price is set by bidding, with a minimum of the total taxes and costs due. | Utah Code § 59-2-1351(4) (notice form) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1351_2023031320230313.html) | corrected |
| rateWhy.3 | UCA §59-2-1351.1. | Utah Code § 59-2-1351.1 | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1351.1_2018050820180508.html) | supported |
| keyNotes.1 | Each county auditor selects its own sale date in May or June — check each county's notice | Utah Code § 59-2-1351(1)(a) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1351_2023031320230313.html) | corrected |
| keyNotes.2 | No redemption after the sale; the auditor's deed conveys fee simple | Utah Code § 59-2-1351.1(9)(a) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1351.1_2018050820180508.html) | corrected |
| keyNotes.3 | (removed) | Utah Code § 59-2-1351.1(9)(a) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1351.1_2018050820180508.html) | corrected |
| keyNotes.4 | (removed) | Utah Code § 59-2-1351.1(9)(a) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1351.1_2018050820180508.html) | corrected |
| notBeginnerReason.1 | Sales happen once a year in May or June, after four years of delinquency, and each county runs its own sale. | Utah Code § 59-2-1346(1) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1346_2022050420220504.html) | corrected |
| beginnerTip.1 | (removed) | Utah Code § 59-2-1346(1) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1346_2022050420220504.html) | corrected |
| beginnerTip.2 | Owners may redeem at any time before the sale, so recheck the county's list close to the sale date. | Utah Code § 59-2-1346(1) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1346_2022050420220504.html) | corrected |
| risks.1 | Property reaches tax sale only after four years of delinquency, and owners may redeem up to the sale | Utah Code § 59-2-1346(1) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1346_2022050420220504.html) | corrected |
| risks.2 | Each county sets its own sale procedures by ordinance | Utah Code § 59-2-1351.1(2)(b) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1351.1_2018050820180508.html) | corrected |
| risks.3 | (removed) | Utah Code § 59-2-1346(1) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1346_2022050420220504.html) | corrected |
| ddExtra.1 | Check each target county's sale procedures before its sale | Utah Code § 59-2-1351.1(2)(b) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1351.1_2018050820180508.html) | corrected |
| ddExtra.2 | Confirm each county's sale date from its notice; sales are in May or June | Utah Code § 59-2-1351(1)(b) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1351_2023031320230313.html) | corrected |
| ddExtra.3 | Recheck the county's list just before the sale; owners may redeem until then | Utah Code § 59-2-1346(1) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1346_2022050420220504.html) | corrected |
| signup.platform | County auditor (each county runs its own sale) | Utah Code § 59-2-1351(1)(a) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1351_2023031320230313.html) | corrected |
| signup.steps.1 | Find your target county auditor's published tax sale notice | Utah Code § 59-2-1351(3) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1351_2023031320230313.html) | corrected |
| signup.steps.2 | Contact each target county auditor separately; each county sets its own sale procedures | Utah Code § 59-2-1351.1(2)(b) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1351.1_2018050820180508.html) | corrected |
| signup.steps.3 | The published notice lists each parcel by street address or parcel number | Utah Code § 59-2-1351(5)(b) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1351_2023031320230313.html) | corrected |
| signup.steps.4 | The notice says whether the sale is at the courthouse or through an electronic process | Utah Code § 59-2-1351(1)(c)(ii)(C) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1351_2023031320230313.html) | corrected |
| signup.deposit.1 | Sales are to the highest bidder for cash; ask the county auditor about payment. | Utah Code § 59-2-1351(4) (notice form) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1351_2023031320230313.html) | corrected |
| signup.deposit.2 | Confirm with each county auditor separately. | Utah Code § 59-2-1351.1(2)(b) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1351.1_2018050820180508.html) | corrected |
| otc.available | Yes: county sale of struck-off property | Utah Code § 59-2-1351.5(1)(a) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1351.5_2018050820180508.html) | corrected |
| otc.note.1 | Property with no buyer at the tax sale is struck off to the county, which may sell it at a price and on terms its legislative body sets. | Utah Code § 59-2-1351.5(1)(a) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1351.5_2018050820180508.html) | corrected |
| platforms.1 | County auditor offices | Utah Code § 59-2-1351(1)(a) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1351_2023031320230313.html) | corrected |
| surplus.1 | Sale money above the taxes and costs due is treated as unclaimed property under Utah's unclaimed property act (Utah Code § 59-2-1351.1(7)). | Utah Code § 59-2-1351.1(7) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1351.1_2018050820180508.html) | corrected |
| es.rate | N/A | Utah Code § 59-2-1351.1(9)(a) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1351.1_2018050820180508.html) | supported |
| es.redemption | Solo hasta la venta fiscal (la venta se realiza tras cuatro años de morosidad) | Utah Code § 59-2-1346(1) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1346_2022050420220504.html) | corrected |
| es.summary.1 | Cada auditor de condado de Utah realiza una venta fiscal en mayo o junio. | Utah Code § 59-2-1351(1)(b) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1351_2023031320230313.html) | corrected |
| es.summary.2 | Cada condado fija sus propios procedimientos de venta por ordenanza, dentro de las reglas de la comisión estatal de impuestos. | Utah Code § 59-2-1351.1(2)(b) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1351.1_2018050820180508.html) | corrected |
| es.summary.3 | (removed) | Utah Code § 59-2-1346(1) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1346_2022050420220504.html) | corrected |
| es.summary.4 | (removed) | Utah Code § 59-2-1346(1) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1346_2022050420220504.html) | corrected |
| es.summary.5 | Estatuto: UCA §59-2-1351.1. | Utah Code § 59-2-1351.1 | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1351.1_2018050820180508.html) | supported |
| es.typeWhy.1 | Utah vende la propiedad en una venta fiscal en mayo o junio tras cuatro años de morosidad, y el auditor la escritura al comprador en pleno dominio. | Utah Code § 59-2-1346(1) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1346_2022050420220504.html) | corrected |
| es.typeWhy.2 | No hay período de redención posterior a la venta (UCA §59-2-1351.1). | Utah Code § 59-2-1346(1) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1346_2022050420220504.html) | corrected |
| es.rateWhy.1 | No se aplica tasa de interés ya que es un estado de escritura. | Utah Code § 59-2-1351.1(9)(a) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1351.1_2018050820180508.html) | supported |
| es.rateWhy.2 | El precio se fija por puja, con un mínimo del total de impuestos y costos adeudados (UCA §59-2-1351.1). | Utah Code § 59-2-1351(4) (notice form) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1351_2023031320230313.html) | corrected |
| es.notBeginnerReason.1 | Las ventas son una vez al año en mayo o junio, tras cuatro años de morosidad, y cada condado realiza su propia venta. | Utah Code § 59-2-1346(1) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1346_2022050420220504.html) | corrected |
| es.beginnerTip.1 | (removed) | Utah Code § 59-2-1346(1) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1346_2022050420220504.html) | corrected |
| es.beginnerTip.2 | Los propietarios pueden redimir en cualquier momento antes de la venta, así que revise de nuevo la lista del condado cerca de la fecha de venta. | Utah Code § 59-2-1346(1) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1346_2022050420220504.html) | corrected |
| es.risks.1 | La propiedad llega a venta fiscal solo tras cuatro años de morosidad, y los propietarios pueden redimir hasta la venta | Utah Code § 59-2-1346(1) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1346_2022050420220504.html) | corrected |
| es.risks.2 | Cada condado fija sus propios procedimientos de venta por ordenanza | Utah Code § 59-2-1351.1(2)(b) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1351.1_2018050820180508.html) | corrected |
| es.risks.3 | (removed) | Utah Code § 59-2-1346(1) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1346_2022050420220504.html) | corrected |
| es.ddExtra.1 | Revise los procedimientos de venta de cada condado objetivo antes de su venta | Utah Code § 59-2-1351.1(2)(b) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1351.1_2018050820180508.html) | corrected |
| es.ddExtra.2 | Confirme la fecha de venta de cada condado en su aviso; las ventas son en mayo o junio | Utah Code § 59-2-1351(1)(b) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1351_2023031320230313.html) | corrected |
| es.ddExtra.3 | Revise de nuevo la lista del condado justo antes de la venta; los propietarios pueden redimir hasta entonces | Utah Code § 59-2-1346(1) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1346_2022050420220504.html) | corrected |
| es.signup.platform | Auditor del condado (cada condado realiza su propia venta) | Utah Code § 59-2-1351(1)(a) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1351_2023031320230313.html) | corrected |
| es.signup.steps.1 | Encuentre el aviso de venta fiscal publicado por el auditor de su condado objetivo | Utah Code § 59-2-1351(3) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1351_2023031320230313.html) | corrected |
| es.signup.steps.2 | Contacte a cada auditor de condado objetivo por separado; cada condado fija sus propios procedimientos de venta | Utah Code § 59-2-1351.1(2)(b) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1351.1_2018050820180508.html) | corrected |
| es.signup.steps.3 | El aviso publicado indica cada parcela por dirección o número de parcela | Utah Code § 59-2-1351(5)(b) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1351_2023031320230313.html) | corrected |
| es.signup.steps.4 | El aviso indica si la venta es en el tribunal del condado o por un proceso electrónico | Utah Code § 59-2-1351(1)(c)(ii)(C) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1351_2023031320230313.html) | corrected |
| es.signup.deposit.1 | Las ventas son al mejor postor en efectivo; pregunte al auditor del condado sobre el pago. | Utah Code § 59-2-1351(4) (notice form) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1351_2023031320230313.html) | corrected |
| es.signup.deposit.2 | Confirme con cada auditor del condado por separado. | Utah Code § 59-2-1351.1(2)(b) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1351.1_2018050820180508.html) | corrected |
| es.otc.note.1 | La propiedad sin comprador en la venta fiscal pasa al condado, que puede venderla al precio y en los términos que fije su órgano legislativo. | Utah Code § 59-2-1351.5(1)(a) | [link](https://le.utah.gov/xcode/Title59/Chapter2/C59-2-S1351.5_2018050820180508.html) | corrected |

## Corrections (before → after)

- `rateNote`: “Statewide same-day auction — all counties sell on same day in May” → “Each county auditor holds its tax sale in May or June”
- `redemption`: “None post-sale (5-year delinquency required before sale)” → “Until the tax sale only (sale held after four years of delinquency)”
- `bidMethod`: “Highest bidder (premium bid)” → “Highest bidder for cash; no bid below the total taxes and costs due”
- `auctionPlatform`: “County treasurer — in-person (all counties same day)” → “County auditor, at the courthouse front door or through an electronic process”
- `auctionTiming`: “May — all counties statewide on same day” → “May or June; each county auditor selects the date”
- `summary.1`: “Utah holds all county tax deed auctions on the same day each May.” → “Each Utah county auditor holds a tax sale in May or June.”
- `summary.2`: “Properties must be 5 years delinquent before auction.” → “Property goes to tax sale if it is not redeemed after four years of delinquency.”
- `summary.3`: “Each county registers separately — no statewide system.” → “Each county sets its own sale procedures by ordinance, within state tax commission rules.”
- `summary.5`: “Sheriff sale option also available.” → “(removed)”
- `summary.6`: “Limited urban inventory outside Salt Lake City.” → “(removed)”
- `typeWhy.1`: “Utah sells the property deed outright at annual May auctions after 5 years of tax delinquency.” → “Utah sells the property at a May or June tax sale held after four years of delinquency, and the auditor deeds it to the buyer in fee simple.”
- `rateWhy.2`: “Returns are market-driven at auction.” → “The price is set by bidding, with a minimum of the total taxes and costs due.”
- `keyNotes.1`: “All 29 counties auction on the same day in May — investor must choose which county to attend” → “Each county auditor selects its own sale date in May or June — check each county's notice”
- `keyNotes.2`: “No post-sale redemption — clean title conveyed” → “No redemption after the sale; the auditor's deed conveys fee simple”
- `keyNotes.3`: “Always research water rights on Utah properties — water rights are separate from land and critical in this state” → “(removed)”
- `keyNotes.4`: “Salt Lake and Utah County properties attract heavy competition” → “(removed)”
- `notBeginnerReason.1`: “All counties auction same day in May, 5-year delinquency required before sale, separate registration per county required.” → “Sales happen once a year in May or June, after four years of delinquency, and each county runs its own sale.”
- `beginnerTip.1`: “Salt Lake and Utah counties have the best inventory.” → “(removed)”
- `beginnerTip.2`: “Contact each county treasurer separately in March — by April, the list of remaining properties after owner payments shrinks significantly.” → “Owners may redeem at any time before the sale, so recheck the county's list close to the sale date.”
- `risks.1`: “5-year delinquency requirement before sale limits available inventory” → “Property reaches tax sale only after four years of delinquency, and owners may redeem up to the sale”
- `risks.2`: “Separate registration for each county — time-intensive” → “Each county sets its own sale procedures by ordinance”
- `risks.3`: “Limited urban inventory outside Wasatch Front” → “(removed)”
- `ddExtra.1`: “Register with each target county separately at least 30 days before May auction” → “Check each target county's sale procedures before its sale”
- `ddExtra.2`: “Confirm the exact May auction date — it can vary by a few days” → “Confirm each county's sale date from its notice; sales are in May or June”
- `ddExtra.3`: “Review the delinquent list in April for remaining properties after owner payments” → “Recheck the county's list just before the sale; owners may redeem until then”
- `signup.platform`: “County treasurer (each county registers separately)” → “County auditor (each county runs its own sale)”
- `signup.steps.1`: “Find your target county treasurer at utah.gov/government/counties.html” → “Find your target county auditor's published tax sale notice”
- `signup.steps.2`: “Contact each target county separately — no statewide registration system” → “Contact each target county auditor separately; each county sets its own sale procedures”
- `signup.steps.3`: “Request the property list 60 days before the May auction” → “The published notice lists each parcel by street address or parcel number”
- `signup.steps.4`: “Attend in-person — most Utah counties do not offer online bidding” → “The notice says whether the sale is at the courthouse or through an electronic process”
- `signup.deposit.1`: “Varies by county.” → “Sales are to the highest bidder for cash; ask the county auditor about payment.”
- `signup.deposit.2`: “Confirm with each county treasurer separately.” → “Confirm with each county auditor separately.”
- `otc.available`: “Not generally available” → “Yes: county sale of struck-off property”
- `otc.note.1`: “No OTC program.” → “Property with no buyer at the tax sale is struck off to the county, which may sell it at a price and on terms its legislative body sets.”
- `platforms.1`: “County treasurer offices” → “County auditor offices”
- `surplus.1`: “Status pending — monitoring for legislative action.” → “Sale money above the taxes and costs due is treated as unclaimed property under Utah's unclaimed property act (Utah Code § 59-2-1351.1(7)).”

## Pass 2 trims, removals and notes

- `rateNote`: was "Statewide same-day auction — all counties sell on same day in May"; statute lets each auditor pick a date in May or June
- `redemption`: was "None post-sale (5-year delinquency required before sale)"
- `bidMethod`: was "Highest bidder (premium bid)"
- `auctionPlatform`: was "County treasurer — in-person (all counties same day)"; statute names the county auditor
- `auctionTiming`: was "May — all counties statewide on same day". pass 2: May or June rests on § 59-2-1351(1)(b) (rateNote)
- `summary.1`: was "Utah holds all county tax deed auctions on the same day each May."
- `summary.2`: was "Properties must be 5 years delinquent before auction."
- `summary.3`: was "Each county registers separately — no statewide system."
- `summary.5`: removed: "Sheriff sale option" is not in the tax sale statutes fetched
- `summary.6`: removed: no official source (opinion, inventory, competition or practice claim)
- `typeWhy.1`: was "annual May auctions after 5 years". pass 2: fee simple rests on § 59-2-1351.1(9)(a) (type)
- `rateWhy.2`: was "Returns are market-driven at auction." (banned money word)
- `keyNotes.1`: was "All 29 counties auction on the same day in May"
- `keyNotes.2`: removed "clean title". pass 2: no-redemption part rests on § 59-2-1346(1)
- `keyNotes.3`: removed: water-rights advice is not in the tax sale statutes fetched
- `keyNotes.4`: removed: no official source (opinion, inventory, competition or practice claim)
- `notBeginnerReason.1`: was "All counties auction same day in May, 5-year delinquency..."
- `beginnerTip.1`: removed: no official source (opinion, inventory, competition or practice claim)
- `beginnerTip.2`: removed "in March" and "shrinks significantly"
- `risks.1`: was "5-year delinquency requirement before sale limits available inventory"
- `risks.2`: was "Separate registration for each county — time-intensive"
- `risks.3`: removed: no official source (opinion, inventory, competition or practice claim)
- `ddExtra.1`: removed "at least 30 days before May auction" (not in statute)
- `ddExtra.2`: was "Confirm the exact May auction date — it can vary by a few days"
- `ddExtra.3`: removed "in April"
- `signup.platform`: was "County treasurer (each county registers separately)"
- `signup.steps.1`: removed utah.gov directory link
- `signup.steps.2`: removed "no statewide registration system"
- `signup.steps.3`: was "Request the property list 60 days before the May auction"
- `signup.steps.4`: was "Attend in-person — most Utah counties do not offer online bidding"
- `signup.deposit.1`: was "Varies by county."
- `signup.deposit.2`: treasurer replaced by auditor
- `otc.available`: was "Not generally available"
- `otc.note.1`: was "No OTC program." (contradicted by § 59-2-1351.5). pass 2: struck-off step rests on § 59-2-1351.3(1)
- `platforms.1`: was "County treasurer offices"
- `surplus.1`: was "Status pending — monitoring for legislative action."

## Conflicts (flagged)

None.
