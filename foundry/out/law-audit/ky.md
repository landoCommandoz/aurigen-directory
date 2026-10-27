# Kentucky (KY) law audit

Checked 2026-10-27. Status: done. Ledger: `cloudflare/data/law/ky.json`.

Official code access: Kentucky Revised Statutes fetched as PDFs from apps.legislature.ky.gov (Legislative Research Commission), the official code site.

## Finding

The site described Kentucky as an in-person sealed-bid sheriff sale with purchaser-set rates. The Kentucky Revised Statutes
say otherwise: county clerks administer an annual sale of certificates of delinquency on a statewide schedule set by the
Department of Revenue (KRS 134.128), buyers select and pay certificates in an order set by the clerk (no bidding process is
described), certificates bear simple interest at 12% a year (KRS 134.125), and certificates not paid at the annual sale can
be paid at the clerk afterward (KRS 134.128(6)), so an over-the-counter route exists. A purchaser may sue to collect after
one year from delinquency and must do so within eleven years (KRS 134.546).

## 2023 to 2026 enacted-law search

Searched the "History" lines of every fetched KRS section on apps.legislature.ky.gov (134.125, 134.127, 134.128, 134.129,
134.420, 134.452, 134.490, 134.546). Enacted acts found in 2023 to 2026:
- 2025 Ky. Acts ch. 56, sec. 2, amended KRS 134.128, effective June 27, 2025 (current text is what the ledger quotes).
- 2026 Ky. Acts ch. 161, sec. 36, amended KRS 134.490, effective July 15, 2026 (in effect; ledger quotes current text).
No future-dated change found. Limit: the legislature's bill search (apps.legislature.ky.gov/record) was not run this
session for time; surplus-proceeds sections (e.g., KRS 426 sale proceeds) were not read. Recheck in a later run.

## Unreachable sources

None.

## Watch

- Surplus proceeds after Tyler v. Hennepin County (2023): no Kentucky section read this run; site statement removed.

## Claims

| id | shown | statute | link | status |
|---|---|---|---|---|
| type | Tax lien | KRS § 134.546 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=28449) | supported |
| rate | Interest set by law: 12% simple per year | KRS § 134.125 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=28383) | corrected |
| rateNote | Simple interest at 12% per year, set by statute | KRS § 134.125 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=28383) | corrected |
| redemption | Purchaser may sue to collect 1 year after the taxes became delinquent | KRS § 134.546 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=28449) | corrected |
| bidMethod | County clerk sets the order in which registered buyers select and pay certificates | KRS § 134.128 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=56172) | corrected |
| statute | KRS § 134.128 et seq. | KRS § 134.128 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=56172) | corrected |
| auctionPlatform | Annual sale run by the county clerk | KRS § 134.128 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=56172) | corrected |
| auctionTiming | Each county's sale is 90 to 135 days after the sheriff files unpaid tax claims with the clerk (limited exceptions) | KRS § 134.128 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=56172) | corrected |
| summary.1 | Kentucky county clerks hold an annual sale of certificates of delinquency on a statewide schedule. | KRS § 134.128 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=56172) | corrected |
| summary.2 | A purchaser may sue to collect one year after the taxes became delinquent. | KRS § 134.546 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=28449) | corrected |
| summary.3 | Statute: KRS §134.420. | KRS § 134.420 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=43802) | supported |
| typeWhy.1 | A purchased certificate of delinquency represents the tax lien on the property. | KRS § 134.546 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=28449) | corrected |
| typeWhy.2 | The purchaser may enforce the lien in court after one year from the date the taxes became delinquent. | KRS § 134.546 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=28449) | corrected |
| typeWhy.3 | KRS §134.420. | KRS § 134.420 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=43802) | supported |
| rateWhy.1 | Certificates of delinquency bear simple interest at 12% per year. | KRS § 134.125 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=28383) | corrected |
| rateWhy.2 | KRS § 134.125. | KRS § 134.125 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=28383) | corrected |
| keyNotes.1 | County clerks sell certificates of delinquency to registered third-party purchasers | KRS § 134.128 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=56172) | corrected |
| keyNotes.2 | Buyer must notify the owner within 50 days after receiving the certificate | KRS § 134.490 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=57927) | corrected |
| keyNotes.3 | To foreclose, the purchaser must bring a court action to enforce the lien | KRS § 134.546 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=28449) | corrected |
| keyNotes.4 | A foreclosure sale carries a right of redemption under KRS 426.530 | KRS § 134.546 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=28449) | corrected |
| keyNotes.5 | (removed) | KRS § 134.125 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=28383) | corrected |
| notBeginnerReason.1 | Buyers must keep sending notices to the owner every six months until they start collection. | KRS § 134.490 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=57927) | corrected |
| beginnerTip.1 | (removed) | KRS § 134.128 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=56172) | corrected |
| beginnerTip.2 | (removed) | KRS § 134.128 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=56172) | corrected |
| risks.1 | Collection suits must be filed within 11 years of the date the taxes became delinquent | KRS § 134.546 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=28449) | corrected |
| risks.2 | (removed) | KRS § 134.128 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=56172) | corrected |
| risks.3 | (removed) | KRS § 134.128 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=56172) | corrected |
| ddExtra.1 | (removed) | KRS § 134.128 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=56172) | corrected |
| ddExtra.2 | Check lien priority: the tax lien ranks ahead of other obligations on the property | KRS § 134.420 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=43802) | corrected |
| ddExtra.3 | Certificates in bankruptcy or county or state litigation, or under a payment plan, cannot be paid | KRS § 134.128 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=56172) | corrected |
| signup.platform | County clerk (annual sale) | KRS § 134.128 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=56172) | corrected |
| signup.steps.1 | Check the Department of Revenue's statewide sale schedule for your county | KRS § 134.128 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=56172) | corrected |
| signup.steps.2 | Register with the county clerk at least one week before the sale | KRS § 134.128 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=56172) | corrected |
| signup.steps.3 | If you plan to pay more than five certificates statewide in a year, register with the Department of Revenue | KRS § 134.128 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=56172) | corrected |
| signup.steps.4 | At the sale, the clerk sets the order in which buyers select and pay certificates | KRS § 134.128 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=56172) | corrected |
| signup.deposit.1 | Advance deposit required, based on the most you may pay for certificates | KRS § 134.128 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=56172) | corrected |
| otc.available | Yes, after the annual sale (registration rules apply) | KRS § 134.128 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=56172) | corrected |
| otc.note.1 | Certificates not paid at the annual sale may be paid to the county clerk at any time after the sale, subject to registration rules. | KRS § 134.128 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=56172) | corrected |
| platforms.1 | (removed) | KRS § 134.128 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=56172) | corrected |
| platforms.2 | County clerk offices | KRS § 134.128 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=56172) | supported |
| surplus.1 | (removed) | KRS § 134.128 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=56172) | corrected |
| es.rate | Interés fijado por la ley: 12% simple anual | KRS § 134.125 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=28383) | corrected |
| es.redemption | El comprador puede demandar el cobro 1 año después de la morosidad | KRS § 134.546 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=28449) | corrected |
| es.summary.1 | En Kentucky los secretarios de condado realizan una venta anual de certificados de morosidad según un calendario estatal. | KRS § 134.128 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=56172) | corrected |
| es.summary.2 | (removed) | KRS § 134.546 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=28449) | corrected |
| es.summary.3 | Un comprador puede demandar el cobro un año después de que los impuestos entraron en mora. | KRS § 134.546 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=28449) | corrected |
| es.summary.4 | Estatuto: KRS §134.420. | KRS § 134.420 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=43802) | supported |
| es.typeWhy.1 | Un certificado de morosidad comprado representa el gravamen fiscal sobre la propiedad. | KRS § 134.546 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=28449) | corrected |
| es.rateWhy.1 | Los certificados de morosidad devengan interés simple de 12% anual. | KRS § 134.125 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=28383) | corrected |
| es.rateWhy.2 | KRS § 134.125. | KRS § 134.125 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=28383) | corrected |
| es.notBeginnerReason.1 | Los compradores deben enviar avisos al propietario cada seis meses hasta iniciar el cobro. | KRS § 134.490 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=57927) | corrected |
| es.beginnerTip.1 | (removed) | KRS § 134.128 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=56172) | corrected |
| es.beginnerTip.2 | (removed) | KRS § 134.128 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=56172) | corrected |
| es.risks.1 | Las demandas de cobro deben presentarse dentro de 11 años desde la morosidad | KRS § 134.546 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=28449) | corrected |
| es.risks.2 | (removed) | KRS § 134.128 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=56172) | corrected |
| es.risks.3 | (removed) | KRS § 134.128 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=56172) | corrected |
| es.ddExtra.1 | (removed) | KRS § 134.128 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=56172) | corrected |
| es.ddExtra.2 | Revise la prioridad: el gravamen fiscal tiene prioridad sobre otras obligaciones de la propiedad | KRS § 134.420 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=43802) | corrected |
| es.ddExtra.3 | No pueden pagarse certificados en quiebra, en litigio del condado o del estado, o con plan de pagos | KRS § 134.128 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=56172) | corrected |
| es.signup.platform | Secretario del condado (venta anual) | KRS § 134.128 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=56172) | corrected |
| es.signup.steps.1 | Consulte el calendario estatal de ventas del Departamento de Ingresos para su condado | KRS § 134.128 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=56172) | corrected |
| es.signup.steps.2 | Regístrese con el secretario del condado al menos una semana antes de la venta | KRS § 134.128 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=56172) | corrected |
| es.signup.steps.3 | Si planea pagar más de cinco certificados en el estado en un año, regístrese con el Departamento de Ingresos | KRS § 134.128 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=56172) | corrected |
| es.signup.steps.4 | En la venta, el secretario fija el orden en que los compradores eligen y pagan certificados | KRS § 134.128 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=56172) | corrected |
| es.signup.deposit.1 | Se requiere un depósito anticipado según el monto máximo que puede pagar por certificados | KRS § 134.128 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=56172) | corrected |
| es.otc.note.1 | Los certificados no pagados en la venta anual pueden pagarse al secretario del condado en cualquier momento después de la venta, según las reglas de registro. | KRS § 134.128 | [link](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=56172) | corrected |

## Corrections (before → after)

- `rate`: “12% + penalties” → “Interest set by law: 12% simple per year”
- `rateNote`: “No fixed statewide rate — purchaser sets rate per certificate within statutory bounds” → “Simple interest at 12% per year, set by statute”
- `redemption`: “1 year” → “Purchaser may sue to collect 1 year after the taxes became delinquent”
- `bidMethod`: “Highest bidder — sheriff sells Certificates of Delinquency” → “County clerk sets the order in which registered buyers select and pay certificates”
- `statute`: “KRS §134.420 et seq.” → “KRS § 134.128 et seq.”
- `auctionPlatform`: “County sheriff — in-person” → “Annual sale run by the county clerk”
- `auctionTiming`: “April–June (most counties)” → “Each county's sale is 90 to 135 days after the sheriff files unpaid tax claims with the clerk (limited exceptions)”
- `summary.1`: “Kentucky conducts in-person sealed bid sales at the county level.” → “Kentucky county clerks hold an annual sale of certificates of delinquency on a statewide schedule.”
- `summary.2`: “No online bidding. 1-year redemption before foreclosure can proceed.” → “A purchaser may sue to collect one year after the taxes became delinquent.”
- `typeWhy.1`: “Kentucky sells tax lien certificates through in-person sealed bid sales at the county level.” → “A purchased certificate of delinquency represents the tax lien on the property.”
- `typeWhy.2`: “The investor purchases the lien while the owner retains title during the 1-year redemption window.” → “The purchaser may enforce the lien in court after one year from the date the taxes became delinquent.”
- `rateWhy.1`: “Kentucky imposes a 12% annual interest rate on tax lien certificates plus additional statutory penalties on redemption.” → “Certificates of delinquency bear simple interest at 12% per year.”
- `rateWhy.2`: “KRS §134.420.” → “KRS § 134.125.”
- `keyNotes.1`: “Sheriff sells Certificates of Delinquency — investors purchase tax bills directly” → “County clerks sell certificates of delinquency to registered third-party purchasers”
- `keyNotes.2`: “50-day notice requirement after purchase to notify owner” → “Buyer must notify the owner within 50 days after receiving the certificate”
- `keyNotes.3`: “Circuit court foreclosure required to obtain deed — no automatic conversion” → “To foreclose, the purchaser must bring a court action to enforce the lien”
- `keyNotes.4`: “Owner can redeem at any time before foreclosure sale is complete” → “A foreclosure sale carries a right of redemption under KRS 426.530”
- `keyNotes.5`: “High redemption rate — most certificates pay out as interest income” → “(removed)”
- `notBeginnerReason.1`: “In-person only, no online bidding, sealed bid format makes it hard to gauge competition.” → “Buyers must keep sending notices to the owner every six months until they start collection.”
- `beginnerTip.1`: “Jefferson (Louisville) and Fayette (Lexington) counties have the best inventory.” → “(removed)”
- `beginnerTip.2`: “The sealed bid format works in your favor in rural counties — less competition means your opening bid often wins.” → “(removed)”
- `risks.1`: “In-person only — cannot participate remotely” → “Collection suits must be filed within 11 years of the date the taxes became delinquent”
- `risks.2`: “Sealed bid format makes it impossible to know competitor bids” → “(removed)”
- `risks.3`: “Limited online infrastructure” → “(removed)”
- `ddExtra.1`: “Visit the property in person before submitting a bid — no online verification is sufficient” → “(removed)”
- `ddExtra.2`: “Verify lien priority in the county records office” → “Check lien priority: the tax lien ranks ahead of other obligations on the property”
- `ddExtra.3`: “Confirm the redemption period has not been extended for any reason” → “Certificates in bankruptcy or county or state litigation, or under a payment plan, cannot be paid”
- `signup.platform`: “County Sheriff or County Clerk (in-person, sealed bid)” → “County clerk (annual sale)”
- `signup.steps.1`: “Find your target county's sheriff or clerk at kycourts.net” → “Check the Department of Revenue's statewide sale schedule for your county”
- `signup.steps.2`: “Contact the office to confirm the upcoming sale date and request the property list” → “Register with the county clerk at least one week before the sale”
- `signup.steps.3`: “Obtain and complete the sealed bid form — submit in person by the deadline” → “If you plan to pay more than five certificates statewide in a year, register with the Department of Revenue”
- `signup.steps.4`: “Attend the opening — winners are announced publicly” → “At the sale, the clerk sets the order in which buyers select and pay certificates”
- `signup.deposit.1`: “Typically cashier's check at time of bid submission.” → “Advance deposit required, based on the most you may pay for certificates”
- `otc.available`: “Not generally available” → “Yes, after the annual sale (registration rules apply)”
- `otc.note.1`: “No OTC program.” → “Certificates not paid at the annual sale may be paid to the county clerk at any time after the sale, subject to registration rules.”
- `platforms.1`: “County sheriff offices” → “(removed)”
- `surplus.1`: “Status pending — monitoring for legislative action.” → “(removed)”

## Pass 2 trims, removals and notes

- `rate`: removed "+ penalties" (no penalty to the buyer in the sections read)
- `rateNote`: was "No fixed statewide rate — purchaser sets rate" (contradicted by KRS 134.125)
- `redemption`: trimmed: "1 year" redemption window replaced with the waiting period the statute states
- `bidMethod`: was "Highest bidder — sheriff sells" (clerk administers the sale under KRS 134.128)
- `statute`: was "KRS §134.420 et seq." (lien section; the sale is in 134.128)
- `auctionPlatform`: removed "sheriff" and "in-person"
- `auctionTiming`: was "April–June (most counties)"
- `summary.1`: was "in-person sealed bid sales"
- `summary.2`: removed "No online bidding" (no source)
- `typeWhy.1`: removed "sealed bid"
- `typeWhy.2`: trimmed: removed "owner retains title" (not in quote)
- `rateWhy.1`: removed "plus additional statutory penalties"
- `rateWhy.2`: was "KRS §134.420" (rate is in 134.125)
- `keyNotes.1`: was "Sheriff sells"
- `keyNotes.3`: trimmed: removed "circuit court" and "no automatic conversion"
- `keyNotes.4`: was "Owner can redeem at any time before foreclosure sale is complete" (not in quote)
- `keyNotes.5`: removed: no official source (opinion, county detail or claim not in the statutes read)
- `notBeginnerReason.1`: was in-person/sealed bid reason (not in statute)
- `beginnerTip.1`: removed: no official source (opinion, county detail or claim not in the statutes read)
- `beginnerTip.2`: removed: no official source (opinion, county detail or claim not in the statutes read)
- `risks.1`: was "In-person only"
- `risks.2`: removed: no official source (opinion, county detail or claim not in the statutes read)
- `risks.3`: removed: no official source (opinion, county detail or claim not in the statutes read)
- `ddExtra.1`: removed: no official source (opinion, county detail or claim not in the statutes read)
- `ddExtra.3`: was "Confirm the redemption period has not been extended"
- `signup.platform`: removed sheriff, in-person and sealed bid
- `signup.steps.1`: removed kycourts.net
- `signup.steps.3`: was "sealed bid form"
- `signup.steps.4`: was "Attend the opening"
- `signup.deposit.1`: was "Typically cashier's check"
- `otc.available`: was "Not generally available"
- `otc.note.1`: was "No OTC program"
- `platforms.1`: removed: sheriff offices do not run the sale (clerk does)
- `surplus.1`: removed "Status pending" (not a legal statement; no surplus section read)

## Conflicts (flagged)

None.
