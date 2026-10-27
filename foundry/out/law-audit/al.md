# Alabama (AL) law audit

Checked 2026-10-27. Status: done. Ledger: `cloudflare/data/law/al.json`.

Official code access: Code of Alabama on alison.legislature.state.al.us is a script-only app (no text without JavaScript); the Alabama Department of Revenue rule and pages were used instead.

Main finding: the site said Alabama redemption runs at 12% per year. The Alabama Department of Revenue rule
Ala. Admin. Code r. 810-4-6-.02 (effective January 13, 2020) says redemption from a tax sale after January 1, 2020 uses
8% per year; 12% applies to delinquent tax only until the sale. The DOR "Land Sales" FAQ still says 12%, so the rate is
flagged. The site also said OTC was not available; the DOR sells state-held tax-delinquent property by price quote.
Unverified claims (bid-down bidding, Act 2018-577 conversion, April–June timing, deposits, oral bidding, Jefferson/Madison
competition, deed after 3 years for county certificates) were removed, because no official text for them could be read.

## Unreachable sources

Couldn't reach source: the Code of Alabama itself. alison.legislature.state.al.us serves a JavaScript-only app: both
https://alison.legislature.state.al.us/codeofalabama/1975/coatoc.htm and .../1975/40-10-120.htm downloaded only the
site menu (snapshots \`code-coatoc\`, \`code-40-10-120-static\`, ~1.8 KB, no statute text). The enrolled Act 2018-494
(SB 257) PDF returned 404 (\`attempts/al.jsonl\`); the engrossed version (\`sb257-2018-eng\`) is not the enacted text, so it is
not cited. No claim was kept on the Code text alone; claims rest on DOR pages instead. DOR's land-sales URL
https://www.revenue.alabama.gov/property-tax/land-sales/ returned 404 (the working page is cited).

## 2023–2026 enacted law search

- The legislature's bill search (ALISON) is script-only and could not be used from the runner.
- Lead searches (web search for 2024/2025 Alabama acts on tax sale excess funds and § 40-10-28 after Tyler v. Hennepin) found
  no 2023–2026 act; they found only the 2013 amendment to § 40-10-28 (HB 47, 2013) and a 2017 bill that died.
- Result: none found, but this is not a full official search. A later run with a working ALISON text source should repeat it.

## Watch

- Code of Ala. § 40-10-28 (excess funds) after Tyler v. Hennepin: current text not read. The surplus statement was removed until it is.
- 8% vs 12% redemption rate: DOR FAQ and DOR rule disagree; confirm against Code § 40-10-122 when readable.

## Claims

| id | shown | statute | link | status |
|---|---|---|---|---|
| type | Tax sale certificate | Code of Ala. 1975, Title 40, Ch. 10 (Dept. of Revenue page) | [link](https://www.revenue.alabama.gov/property-tax/tax-delinquent-property-and-land-sales/) | corrected |
| rate | Rate set by law for redemption: 8% per year (tax sales after January 1, 2020) | Ala. Admin. Code r. 810-4-6-.02 | [link](https://www.revenue.alabama.gov/wp-content/uploads/2021/12/810-4-6-.02.pdf) | flagged |
| rateNote | Delinquent tax accrues 12% per year until the tax sale | Ala. Admin. Code r. 810-4-6-.02 | [link](https://www.revenue.alabama.gov/wp-content/uploads/2021/12/810-4-6-.02.pdf) | corrected |
| redemption | 3 years | Ala. Admin. Code r. 810-4-6-.02 | [link](https://www.revenue.alabama.gov/wp-content/uploads/2021/12/810-4-6-.02.pdf) | supported |
| bidMethod | (removed) | Ala. Admin. Code r. 810-4-6-.02 | [link](https://www.revenue.alabama.gov/wp-content/uploads/2021/12/810-4-6-.02.pdf) | corrected |
| statute | Code of Ala. 1975 §§ 40-10-121, 40-10-122 | Ala. Admin. Code r. 810-4-6-.02 | [link](https://www.revenue.alabama.gov/wp-content/uploads/2021/12/810-4-6-.02.pdf) | corrected |
| auctionPlatform | (removed) | Ala. Admin. Code r. 810-4-6-.02 | [link](https://www.revenue.alabama.gov/wp-content/uploads/2021/12/810-4-6-.02.pdf) | corrected |
| auctionTiming | (removed) | Ala. Admin. Code r. 810-4-6-.02 | [link](https://www.revenue.alabama.gov/wp-content/uploads/2021/12/810-4-6-.02.pdf) | corrected |
| summary.1 | Delinquent property is sold at a tax sale, and the buyer receives a tax sale certificate. | Code of Ala. 1975, Title 40, Ch. 10 (Dept. of Revenue page) | [link](https://www.revenue.alabama.gov/property-tax/tax-delinquent-property-and-land-sales/) | corrected |
| summary.2 | For tax sales after January 1, 2020, redemption is figured at 8% interest per year. | Ala. Admin. Code r. 810-4-6-.02 | [link](https://www.revenue.alabama.gov/wp-content/uploads/2021/12/810-4-6-.02.pdf) | corrected |
| summary.3 | (removed) | Code of Ala. 1975, Title 40, Ch. 10 (Dept. of Revenue page) | [link](https://www.revenue.alabama.gov/property-tax/tax-delinquent-property-and-land-sales/) | corrected |
| summary.4 | Statute: Code of Ala. 1975 §§ 40-10-121 and 40-10-122. | Ala. Admin. Code r. 810-4-6-.02 | [link](https://www.revenue.alabama.gov/wp-content/uploads/2021/12/810-4-6-.02.pdf) | corrected |
| typeWhy.1 | The owner can still redeem until the three-year redemption period expires. | Ala. Admin. Code r. 810-4-6-.02 | [link](https://www.revenue.alabama.gov/wp-content/uploads/2021/12/810-4-6-.02.pdf) | corrected |
| typeWhy.2 | Code of Ala. 1975 §§ 40-10-121 and 40-10-122. | Ala. Admin. Code r. 810-4-6-.02 | [link](https://www.revenue.alabama.gov/wp-content/uploads/2021/12/810-4-6-.02.pdf) | corrected |
| rateWhy.1 | Redemption from a tax sale held after January 1, 2020 is figured at 8% per year. | Ala. Admin. Code r. 810-4-6-.02 | [link](https://www.revenue.alabama.gov/wp-content/uploads/2021/12/810-4-6-.02.pdf) | corrected |
| rateWhy.2 | (removed) | Ala. Admin. Code r. 810-4-6-.02 | [link](https://www.revenue.alabama.gov/wp-content/uploads/2021/12/810-4-6-.02.pdf) | corrected |
| rateWhy.3 | Ala. Admin. Code r. 810-4-6-.02. | Ala. Admin. Code r. 810-4-6-.02 | [link](https://www.revenue.alabama.gov/wp-content/uploads/2021/12/810-4-6-.02.pdf) | corrected |
| keyNotes.1 | (removed) | Ala. Admin. Code r. 810-4-6-.02 | [link](https://www.revenue.alabama.gov/wp-content/uploads/2021/12/810-4-6-.02.pdf) | corrected |
| keyNotes.2 | 8% redemption interest for tax sales after January 1, 2020 | Ala. Admin. Code r. 810-4-6-.02 | [link](https://www.revenue.alabama.gov/wp-content/uploads/2021/12/810-4-6-.02.pdf) | corrected |
| keyNotes.3 | Three-year redemption period | Ala. Admin. Code r. 810-4-6-.02 | [link](https://www.revenue.alabama.gov/wp-content/uploads/2021/12/810-4-6-.02.pdf) | corrected |
| keyNotes.4 | Neither a certificate assignment nor a tax deed from the state gives clear title | Code of Ala. 1975, Title 40, Ch. 10 (Dept. of Revenue page) | [link](https://www.revenue.alabama.gov/property-tax/tax-delinquent-property-and-land-sales/) | corrected |
| keyNotes.5 | (removed) | Ala. Admin. Code r. 810-4-6-.02 | [link](https://www.revenue.alabama.gov/wp-content/uploads/2021/12/810-4-6-.02.pdf) | corrected |
| notBeginnerReason.1 | The redemption period is three years. | Ala. Admin. Code r. 810-4-6-.02 | [link](https://www.revenue.alabama.gov/wp-content/uploads/2021/12/810-4-6-.02.pdf) | corrected |
| beginnerTip.1 | (removed) | Ala. Admin. Code r. 810-4-6-.02 | [link](https://www.revenue.alabama.gov/wp-content/uploads/2021/12/810-4-6-.02.pdf) | corrected |
| beginnerTip.2 | (removed) | Ala. Admin. Code r. 810-4-6-.02 | [link](https://www.revenue.alabama.gov/wp-content/uploads/2021/12/810-4-6-.02.pdf) | corrected |
| risks.1 | (removed) | Ala. Admin. Code r. 810-4-6-.02 | [link](https://www.revenue.alabama.gov/wp-content/uploads/2021/12/810-4-6-.02.pdf) | corrected |
| risks.2 | The owner can redeem for up to three years | Ala. Admin. Code r. 810-4-6-.02 | [link](https://www.revenue.alabama.gov/wp-content/uploads/2021/12/810-4-6-.02.pdf) | corrected |
| risks.3 | A tax deed or certificate assignment from the state does not give clear title | Code of Ala. 1975, Title 40, Ch. 10 (Dept. of Revenue page) | [link](https://www.revenue.alabama.gov/property-tax/tax-delinquent-property-and-land-sales/) | corrected |
| risks.4 | (removed) | Ala. Admin. Code r. 810-4-6-.02 | [link](https://www.revenue.alabama.gov/wp-content/uploads/2021/12/810-4-6-.02.pdf) | corrected |
| ddExtra.1 | If the property had a home on it at the sale, a redeeming owner must also repay certain buyer costs | Ala. Admin. Code r. 810-4-6-.02 | [link](https://www.revenue.alabama.gov/wp-content/uploads/2021/12/810-4-6-.02.pdf) | corrected |
| ddExtra.2 | Consult an attorney before buying tax-delinquent property | Code of Ala. 1975, Title 40, Ch. 10 (Dept. of Revenue page) | [link](https://www.revenue.alabama.gov/property-tax/tax-delinquent-property-and-land-sales/) | corrected |
| ddExtra.3 | (removed) | Ala. Admin. Code r. 810-4-6-.02 | [link](https://www.revenue.alabama.gov/wp-content/uploads/2021/12/810-4-6-.02.pdf) | corrected |
| signup.platform | (removed) | Ala. Admin. Code r. 810-4-6-.02 | [link](https://www.revenue.alabama.gov/wp-content/uploads/2021/12/810-4-6-.02.pdf) | corrected |
| signup.steps.1 | Contact the county: property is assessed at the county courthouse | none: administrative practice (Dept. of Revenue) | [link](https://www.revenue.alabama.gov/property-tax/) | corrected |
| signup.steps.2 | (removed) | Ala. Admin. Code r. 810-4-6-.02 | [link](https://www.revenue.alabama.gov/wp-content/uploads/2021/12/810-4-6-.02.pdf) | corrected |
| signup.steps.3 | (removed) | Ala. Admin. Code r. 810-4-6-.02 | [link](https://www.revenue.alabama.gov/wp-content/uploads/2021/12/810-4-6-.02.pdf) | corrected |
| signup.steps.4 | (removed) | Ala. Admin. Code r. 810-4-6-.02 | [link](https://www.revenue.alabama.gov/wp-content/uploads/2021/12/810-4-6-.02.pdf) | corrected |
| signup.deposit.1 | (removed) | Ala. Admin. Code r. 810-4-6-.02 | [link](https://www.revenue.alabama.gov/wp-content/uploads/2021/12/810-4-6-.02.pdf) | corrected |
| signup.deposit.2 | (removed) | Ala. Admin. Code r. 810-4-6-.02 | [link](https://www.revenue.alabama.gov/wp-content/uploads/2021/12/810-4-6-.02.pdf) | corrected |
| otc.available | Available | Code of Ala. 1975, Title 40, Ch. 10 (Dept. of Revenue page) | [link](https://www.revenue.alabama.gov/property-tax/tax-delinquent-property-and-land-sales/) | corrected |
| otc.note.1 | The Department of Revenue sells state-held tax-delinquent property by price quote, listed by county. | Code of Ala. 1975, Title 40, Ch. 10 (Dept. of Revenue page) | [link](https://www.revenue.alabama.gov/property-tax/tax-delinquent-property-and-land-sales/) | corrected |
| platforms.1 | (removed) | Ala. Admin. Code r. 810-4-6-.02 | [link](https://www.revenue.alabama.gov/wp-content/uploads/2021/12/810-4-6-.02.pdf) | corrected |
| surplus.1 | (removed) | Ala. Admin. Code r. 810-4-6-.02 | [link](https://www.revenue.alabama.gov/wp-content/uploads/2021/12/810-4-6-.02.pdf) | corrected |
| es.rate | Tasa fijada por la ley para la redención: 8% anual (ventas después del 1 de enero de 2020) | Ala. Admin. Code r. 810-4-6-.02 | [link](https://www.revenue.alabama.gov/wp-content/uploads/2021/12/810-4-6-.02.pdf) | flagged |
| es.redemption | 3 años | Ala. Admin. Code r. 810-4-6-.02 | [link](https://www.revenue.alabama.gov/wp-content/uploads/2021/12/810-4-6-.02.pdf) | supported |
| es.summary.1 | La propiedad morosa se vende en una venta fiscal y el comprador recibe un certificado de venta fiscal. | Code of Ala. 1975, Title 40, Ch. 10 (Dept. of Revenue page) | [link](https://www.revenue.alabama.gov/property-tax/tax-delinquent-property-and-land-sales/) | corrected |
| es.summary.2 | Para ventas fiscales después del 1 de enero de 2020, la redención se calcula al 8% de interés anual. | Ala. Admin. Code r. 810-4-6-.02 | [link](https://www.revenue.alabama.gov/wp-content/uploads/2021/12/810-4-6-.02.pdf) | corrected |
| es.summary.3 | Estatuto: Code of Ala. 1975 §§ 40-10-121 y 40-10-122. | Ala. Admin. Code r. 810-4-6-.02 | [link](https://www.revenue.alabama.gov/wp-content/uploads/2021/12/810-4-6-.02.pdf) | corrected |
| es.typeWhy.1 | El propietario aún puede redimir hasta que vence el período de redención de tres años. | Ala. Admin. Code r. 810-4-6-.02 | [link](https://www.revenue.alabama.gov/wp-content/uploads/2021/12/810-4-6-.02.pdf) | corrected |
| es.typeWhy.2 | Code of Ala. 1975 §§ 40-10-121 y 40-10-122. | Ala. Admin. Code r. 810-4-6-.02 | [link](https://www.revenue.alabama.gov/wp-content/uploads/2021/12/810-4-6-.02.pdf) | corrected |
| es.rateWhy.1 | La redención de una venta fiscal realizada después del 1 de enero de 2020 se calcula al 8% anual. | Ala. Admin. Code r. 810-4-6-.02 | [link](https://www.revenue.alabama.gov/wp-content/uploads/2021/12/810-4-6-.02.pdf) | corrected |
| es.rateWhy.2 | (removed) | Ala. Admin. Code r. 810-4-6-.02 | [link](https://www.revenue.alabama.gov/wp-content/uploads/2021/12/810-4-6-.02.pdf) | corrected |
| es.notBeginnerReason.1 | El período de redención es de tres años. | Ala. Admin. Code r. 810-4-6-.02 | [link](https://www.revenue.alabama.gov/wp-content/uploads/2021/12/810-4-6-.02.pdf) | corrected |
| es.beginnerTip.1 | (removed) | Ala. Admin. Code r. 810-4-6-.02 | [link](https://www.revenue.alabama.gov/wp-content/uploads/2021/12/810-4-6-.02.pdf) | corrected |
| es.beginnerTip.2 | (removed) | Ala. Admin. Code r. 810-4-6-.02 | [link](https://www.revenue.alabama.gov/wp-content/uploads/2021/12/810-4-6-.02.pdf) | corrected |
| es.risks.1 | (removed) | Ala. Admin. Code r. 810-4-6-.02 | [link](https://www.revenue.alabama.gov/wp-content/uploads/2021/12/810-4-6-.02.pdf) | corrected |
| es.risks.2 | El propietario puede redimir hasta por tres años | Ala. Admin. Code r. 810-4-6-.02 | [link](https://www.revenue.alabama.gov/wp-content/uploads/2021/12/810-4-6-.02.pdf) | corrected |
| es.risks.3 | Una escritura fiscal o cesión de certificado del estado no da título limpio | Code of Ala. 1975, Title 40, Ch. 10 (Dept. of Revenue page) | [link](https://www.revenue.alabama.gov/property-tax/tax-delinquent-property-and-land-sales/) | corrected |
| es.risks.4 | (removed) | Ala. Admin. Code r. 810-4-6-.02 | [link](https://www.revenue.alabama.gov/wp-content/uploads/2021/12/810-4-6-.02.pdf) | corrected |
| es.ddExtra.1 | Si la propiedad tenía una vivienda al momento de la venta, el propietario que redime también debe reembolsar ciertos costos del comprador | Ala. Admin. Code r. 810-4-6-.02 | [link](https://www.revenue.alabama.gov/wp-content/uploads/2021/12/810-4-6-.02.pdf) | corrected |
| es.ddExtra.2 | Consulte a un abogado antes de comprar propiedad morosa | Code of Ala. 1975, Title 40, Ch. 10 (Dept. of Revenue page) | [link](https://www.revenue.alabama.gov/property-tax/tax-delinquent-property-and-land-sales/) | corrected |
| es.ddExtra.3 | (removed) | Ala. Admin. Code r. 810-4-6-.02 | [link](https://www.revenue.alabama.gov/wp-content/uploads/2021/12/810-4-6-.02.pdf) | corrected |
| es.signup.platform | (removed) | Ala. Admin. Code r. 810-4-6-.02 | [link](https://www.revenue.alabama.gov/wp-content/uploads/2021/12/810-4-6-.02.pdf) | corrected |
| es.signup.steps.1 | Contacte al condado: la propiedad se tasa en el tribunal del condado | none: administrative practice (Dept. of Revenue) | [link](https://www.revenue.alabama.gov/property-tax/) | corrected |
| es.signup.steps.2 | (removed) | Ala. Admin. Code r. 810-4-6-.02 | [link](https://www.revenue.alabama.gov/wp-content/uploads/2021/12/810-4-6-.02.pdf) | corrected |
| es.signup.steps.3 | (removed) | Ala. Admin. Code r. 810-4-6-.02 | [link](https://www.revenue.alabama.gov/wp-content/uploads/2021/12/810-4-6-.02.pdf) | corrected |
| es.signup.steps.4 | (removed) | Ala. Admin. Code r. 810-4-6-.02 | [link](https://www.revenue.alabama.gov/wp-content/uploads/2021/12/810-4-6-.02.pdf) | corrected |
| es.signup.deposit.1 | (removed) | Ala. Admin. Code r. 810-4-6-.02 | [link](https://www.revenue.alabama.gov/wp-content/uploads/2021/12/810-4-6-.02.pdf) | corrected |
| es.signup.deposit.2 | (removed) | Ala. Admin. Code r. 810-4-6-.02 | [link](https://www.revenue.alabama.gov/wp-content/uploads/2021/12/810-4-6-.02.pdf) | corrected |
| es.otc.note.1 | El Departamento de Ingresos vende por cotización propiedades morosas en poder del estado, listadas por condado. | Code of Ala. 1975, Title 40, Ch. 10 (Dept. of Revenue page) | [link](https://www.revenue.alabama.gov/property-tax/tax-delinquent-property-and-land-sales/) | corrected |

## Corrections (before → after)

- `type`: “Tax lien” → “Tax sale certificate”
- `rateNote`: “Bid-down interest rate — converted from deed state in 2018” → “Delinquent tax accrues 12% per year until the tax sale”
- `bidMethod`: “Bid-down interest rate” → “(removed)”
- `statute`: “AL Code §40-10-180” → “Code of Ala. 1975 §§ 40-10-121, 40-10-122”
- `auctionPlatform`: “County-run — in-person” → “(removed)”
- `auctionTiming`: “April–June (most counties)” → “(removed)”
- `summary.1`: “Alabama sells tax lien certificates at the county level.” → “Delinquent property is sold at a tax sale, and the buyer receives a tax sale certificate.”
- `summary.2`: “Investors purchase the lien and the property owner has 3 years to redeem at 12% annual interest.” → “For tax sales after January 1, 2020, redemption is figured at 8% interest per year.”
- `summary.3`: “If unredeemed, the investor can pursue a tax deed through a separate process.” → “(removed)”
- `summary.4`: “Statute: AL Code §40-10-1 et seq.” → “Statute: Code of Ala. 1975 §§ 40-10-121 and 40-10-122.”
- `typeWhy.1`: “Alabama sells tax lien certificates at the county level — the investor purchases only the lien, not the property, and the owner retains title during the 3-year redemption period.” → “The owner can still redeem until the three-year redemption period expires.”
- `typeWhy.2`: “AL Code §40-10-1 et seq.” → “Code of Ala. 1975 §§ 40-10-121 and 40-10-122.”
- `rateWhy.1`: “Alabama fixes the interest rate at 12% per annum on the lien amount, accruing for the full 3-year redemption period.” → “Redemption from a tax sale held after January 1, 2020 is figured at 8% per year.”
- `rateWhy.2`: “This is a statutory flat rate, not auction-determined.” → “(removed)”
- `rateWhy.3`: “AL Code §40-10-1 et seq.” → “Ala. Admin. Code r. 810-4-6-.02.”
- `keyNotes.1`: “Converted from deed to lien state via Act 2018-577 — pre-2018 research is outdated” → “(removed)”
- `keyNotes.2`: “12% fixed bid-down rate” → “8% redemption interest for tax sales after January 1, 2020”
- `keyNotes.3`: “3-year redemption then automatic deed conversion” → “Three-year redemption period”
- `keyNotes.4`: “Foreclosure still required for fully clean insurable title post-conversion” → “Neither a certificate assignment nor a tax deed from the state gives clear title”
- `keyNotes.5`: “67 counties — strong rural land inventory” → “(removed)”
- `notBeginnerReason.1`: “Long redemption, title issues common, institutional competition in metro areas.” → “The redemption period is three years.”
- `beginnerTip.1`: “Start with rural counties where institutional buyers are absent.” → “(removed)”
- `beginnerTip.2`: “Avoid Jefferson and Madison counties until you have experience.” → “(removed)”
- `risks.1`: “Institutional buyers dominate Jefferson (Birmingham) and Madison (Huntsville) counties” → “(removed)”
- `risks.2`: “3-year redemption period ties up capital” → “The owner can redeem for up to three years”
- `risks.3`: “Title is not guaranteed — quiet title action may be required” → “A tax deed or certificate assignment from the state does not give clear title”
- `risks.4`: “Many rural parcels have access or environmental issues” → “(removed)”
- `ddExtra.1`: “Verify the 3-year delinquency threshold has been met before bidding” → “If the property had a home on it at the sale, a redeeming owner must also repay certain buyer costs”
- `ddExtra.2`: “Order a title search — Alabama deed sales do not guarantee clean title” → “Consult an attorney before buying tax-delinquent property”
- `ddExtra.3`: “Check county GIS for road access on rural parcels” → “(removed)”
- `signup.platform`: “County-level (varies by county)” → “(removed)”
- `signup.steps.1`: “Contact your target county's Revenue Commissioner office — find them at revenue.alabama.gov/property-tax” → “Contact the county: property is assessed at the county courthouse”
- `signup.steps.2`: “Request the delinquent property list (usually available 30–60 days before auction)” → “(removed)”
- `signup.steps.3`: “Register in person at the courthouse — bring government-issued ID and a cashier's check or wire confirmation for your deposit” → “(removed)”
- `signup.steps.4`: “Attend the auction on the scheduled date — bidding is oral and open” → “(removed)”
- `signup.deposit.1`: “Typically 10–20% of bid required day-of.” → “(removed)”
- `signup.deposit.2`: “Confirm with county.” → “(removed)”
- `otc.available`: “Not generally available” → “Available”
- `otc.note.1`: “No statewide direct purchase program.” → “The Department of Revenue sells state-held tax-delinquent property by price quote, listed by county.”
- `platforms.1`: “County courthouse (in-person)” → “(removed)”
- `surplus.1`: “Status pending — monitoring for legislative action.” → “(removed)”

## Pass 2 trims, removals and notes

- `rate`: flagged: official sources disagree (8% rule vs 12% FAQ)
- `bidMethod`: removed: no official text fetched (Code of Alabama site is script-only; see report)
- `auctionPlatform`: removed: no official text fetched (Code of Alabama site is script-only; see report)
- `auctionTiming`: removed: no official text fetched (Code of Alabama site is script-only; see report)
- `summary.1`: pass 2: quote is about state-held certificates; "tax sale certificate" wording kept, "county level" and "lien" removed
- `summary.2`: was: owner has 3 years to redeem at 12%
- `summary.3`: removed: no official text fetched (Code of Alabama site is script-only; see report)
- `typeWhy.1`: trimmed: removed "purchases only the lien" and "owner retains title" (no code text fetched)
- `rateWhy.1`: was 12% for the full redemption period
- `rateWhy.2`: removed: "not auction-determined" conflicts with bid-down claims elsewhere; no code text fetched
- `keyNotes.1`: removed: "Act 2018-577 converted deed to lien" not verified in any official text fetched
- `keyNotes.2`: was "12% fixed bid-down rate"
- `keyNotes.3`: trimmed: removed "then automatic deed conversion" (no code text fetched)
- `keyNotes.4`: narrowed to state-held property, as the quote says
- `keyNotes.5`: removed: inventory claim has no source
- `notBeginnerReason.1`: trimmed: removed title-issue and competition claims (no source)
- `beginnerTip.1`: removed: opinion, no source
- `beginnerTip.2`: removed: opinion, no source
- `risks.1`: removed: no source for institutional buyer claims
- `risks.2`: trimmed: removed "ties up capital"
- `risks.3`: rewritten: old text used a banned word and named quiet title (not in quote)
- `risks.4`: removed: no source
- `ddExtra.1`: replaced "3-year delinquency threshold" (no source)
- `ddExtra.2`: rewritten: old text used a banned word
- `ddExtra.3`: removed: no source
- `signup.platform`: removed: no official text fetched (Code of Alabama site is script-only; see report)
- `signup.steps.1`: trimmed: removed "Revenue Commissioner" and the DOR link (the page lists no county offices)
- `signup.steps.2`: removed: "30–60 days" has no source
- `signup.steps.3`: removed: ID and payment rules have no source
- `signup.steps.4`: removed: "oral and open" bidding has no source
- `signup.deposit.1`: removed: "10–20%" has no source
- `signup.deposit.2`: removed: covered by the page disclaimer
- `otc.available`: was "Not generally available"; the Dept. of Revenue sells state-held property by price quote
- `platforms.1`: removed: no official text fetched (Code of Alabama site is script-only; see report)
- `surplus.1`: removed: current surplus statute (Code § 40-10-28) not readable; see Watch

## Conflicts (flagged)

- `rate`: Ala. Admin. Code r. 810-4-6-.02 says 8% for tax sales after Jan 1, 2020; the DOR Land Sales FAQ still says 12% per annum; the Code text could not be read (script-only site)
