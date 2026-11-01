# Illinois (IL) law audit

Checked 2026-11-01. Status: done. Ledger: `cloudflare/data/law/il.json`.

Official code access: Illinois Compiled Statutes, Property Tax Code (35 ILCS 200), sections 21-90, 21-115, 21-145, 21-190, 21-205, 21-215, 21-225, 21-240, 21-260, 21-350, 21-355, 22-30 and 22-42, current text from ilga.gov (Illinois General Assembly) at www.ilga.gov/Documents/legislation/ilcs/documents/. The old /legislation/ilcs/documents/ path now returns 404; the host passes full certificate checking with the workflow-installed intermediate certificate (certs/log.jsonl).

Finding: the site had Illinois redemption at 2 to 2.5 years and a "9% per 6-month period (18% annualized)" rate. Current § 21-350 gives 3 years (1 year for vacant non-farm, 7+ unit and commercial or industrial property). § 21-215 caps the penalty bid at 9% of the tax amount; § 21-355 multiplies the penalty bid by 1 to 6 for each 6-month period. Platform names (SRI, BidSpencer, GovEase, cooktaxsale.com) and the Cook County pre-funding rule have no official source in the code and were replaced by "Confirm with the county".

Certificate: ilga.gov was reachable once the workflow's cert-chain step had installed the intermediate certificate (certs/log.jsonl). The old address /legislation/ilcs/documents/ now returns 404 (logged in attempts/il.jsonl); the current text is at www.ilga.gov/Documents/legislation/ilcs/documents/003502000K<section>.htm. Full certificate checking stayed on.

## 2023 to 2026 law search log

Enacted acts seen in the "(Source: ...)" lines of the sections fetched (35 ILCS 200 on ilga.gov):
- P.A. 103-555, effective 1-1-24: changed § 21-350 (redemption) and § 21-215, 21-355 (penalty bid and periods); applies to tax certificates issued on or after January 1, 2024 (quote in § 21-350).
- P.A. 103-592, effective 6-7-24: amended § 21-355.
- P.A. 104-553, effective 7-10-26: amended §§ 21-90 to 21-225 incl. 21-190 (county buys every property offered in counties of 3,000,000 or more from the seventh tax sale after the effective date), 21-215(b) (county purchase penalty 0.75% per month) and 21-350 (redemption, applies to certificates issued on or after 7-10-26). The site shows this under keyNotes.2.
- Not done: bill numbers and the act text were not read (bill-status pages disallowed or not searched). Gap IL-1.
- Cook County sale rules changed under P.A. 104-553 take effect at the seventh sale; the date of that sale was not found. Gap IL-2.

## Unreachable

None this run. TLS failures of 2026-10-29 are in attempts/il.jsonl.

## Watch

Seventh Cook County tax sale after 7-10-26 (county becomes buyer of all properties offered).

## Claims

| id | shown | statute | link | status |
|---|---|---|---|---|
| type | Tax lien | 35 ILCS 200/21-225 | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-225.htm) | supported |
| rate | Maximum rate set by law: a penalty bid of up to 9% of the amount of the tax or special assessment | 35 ILCS 200/21-215(a) | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-215.htm) | corrected |
| rateNote | Redeeming after 6 months and by 12 months costs the certificate amount times 2 times the penalty bid (§ 21-355(b)) | 35 ILCS 200/21-355(b)(2) | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-355.htm) | corrected |
| redemption | Up to 3 years from the date of sale (shorter for some property types) | 35 ILCS 200/21-350 | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-350.htm) | corrected |
| bidMethod | Lowest penalty percentage bid (no bid over 9%) | 35 ILCS 200/21-215(a) | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-215.htm) | corrected |
| statute | 35 ILCS 200/21-215 | 35 ILCS 200/21-215 | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-215.htm) | supported |
| auctionPlatform | County collector; the collector may use an automated bidding system. Confirm with the county. | 35 ILCS 200/21-205(b) | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-205.htm) | corrected |
| auctionTiming | Set by the county collector in a published notice (at least 10 days before the judgment application). Confirm with the county. | 35 ILCS 200/21-115 | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-115.htm) | corrected |
| summary.1 | After the court enters judgment, the county collector conducts the annual tax sale. | 35 ILCS 200/21-190(a) | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-190.htm) | corrected |
| summary.2 | The penalty bid is a percentage of the amount of the tax or special assessment, up to 9%. | 35 ILCS 200/21-215(a) | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-215.htm) | corrected |
| summary.3 | Counties may hold a scavenger sale of forfeited liens and certificates if the county board orders it by resolution. | 35 ILCS 200/21-145 | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-145.htm) | corrected |
| summary.4 | Redemption penalty: the certificate amount times 2 times the penalty bid if redeemed after 6 months and by 12 months (§ 21-355(b)). | 35 ILCS 200/21-355(b)(2) | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-355.htm) | corrected |
| summary.5 | Subsequent taxes paid by the certificate holder carry a 12% penalty for each year or portion of a year until redemption. | 35 ILCS 200/21-355(c) | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-355.htm) | corrected |
| summary.6 | Redemption: up to 3 years from the date of sale, shorter for some property types. | 35 ILCS 200/21-350 | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-350.htm) | corrected |
| summary.7 | To get a tax deed, the certificate holder files a petition in the circuit court (35 ILCS 200/22-30). | 35 ILCS 200/22-30 | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K22-30.htm) | corrected |
| summary.8 | Statute: 35 ILCS 200/21-215 (penalty bids). | 35 ILCS 200/21-215 | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-215.htm) | corrected |
| typeWhy.1 | Illinois offers tax liens or certificates for delinquent property at a public tax sale. | 35 ILCS 200/21-225 | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-225.htm) | corrected |
| typeWhy.2 | Property sold at a tax sale may be redeemed at any time before 3 years from the date of sale (shorter for some property types). 35 ILCS 200/21-350. | 35 ILCS 200/21-350 | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-350.htm) | corrected |
| rateWhy.1 | Illinois caps the penalty bid at 9% of the amount of the tax or special assessment, and the least penalty percentage wins. | 35 ILCS 200/21-215(a) | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-215.htm) | corrected |
| rateWhy.2 | The penalty percentage is applied to the amount of the tax or special assessment. | 35 ILCS 200/21-215(a) | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-215.htm) | corrected |
| rateWhy.3 | Subsequent taxes paid by the holder carry a 12% penalty for each year or part of a year (35 ILCS 200/21-355(c)). | 35 ILCS 200/21-355(c) | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-355.htm) | corrected |
| keyNotes.1 | The penalty bid is a percentage of the tax or special assessment amount | 35 ILCS 200/21-215(a) | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-215.htm) | corrected |
| keyNotes.2 | From the seventh tax sale after July 10, 2026, counties with 3,000,000 or more inhabitants must offer to purchase every property offered at the sale | 35 ILCS 200/21-190(c) (P.A. 104-553, eff. 7-10-26) | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-190.htm) | corrected |
| keyNotes.3 | Vacant non-farm property, property with 7 or more residential units, and commercial or industrial property: 1 year to redeem | 35 ILCS 200/21-350(a) | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-350.htm) | corrected |
| notBeginnerReason.1 | (removed) | 35 ILCS 200/21-215(a) | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-215.htm) | corrected |
| notBeginnerReason.2 | Scavenger sales go to the highest bidder for cash, even if the bid is below the taxes owed. | 35 ILCS 200/21-260 | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-260.htm) | corrected |
| notBeginnerReason.3 | A tax deed requires a petition to the circuit court. | 35 ILCS 200/22-30 | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K22-30.htm) | corrected |
| beginnerTip.1 | (removed) | 35 ILCS 200/21-215(a) | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-215.htm) | corrected |
| beginnerTip.2 | (removed) | 35 ILCS 200/21-215(a) | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-215.htm) | corrected |
| risks.1 | (removed) | 35 ILCS 200/21-190(c) (P.A. 104-553, eff. 7-10-26) | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-190.htm) | corrected |
| risks.2 | The penalty bid is a percentage of the tax amount, and the lowest penalty percentage wins. | 35 ILCS 200/21-215(a) | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-215.htm) | corrected |
| risks.3 | Subsequent taxes paid by the holder carry a 12% penalty for each year or part of a year | 35 ILCS 200/21-355(c) | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-355.htm) | corrected |
| risks.4 | Scavenger sales go to the highest bidder for cash, even if the bid is below the taxes owed | 35 ILCS 200/21-260 | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-260.htm) | corrected |
| risks.5 | A tax deed petition must be filed in the circuit court 3 to 6 months before the redemption period ends | 35 ILCS 200/22-30 | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K22-30.htm) | corrected |
| ddExtra.1 | Check the published notice for the total amount due and the years it covers | 35 ILCS 200/21-115 | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-115.htm) | corrected |
| ddExtra.2 | (removed) | 35 ILCS 200/21-115 | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-115.htm) | corrected |
| ddExtra.3 | A tax year cannot be offered at a scavenger sale before the annual tax sale for that year | 35 ILCS 200/21-145 | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-145.htm) | corrected |
| ddExtra.4 | Confirm the bidding method with the county collector | 35 ILCS 200/21-205(b) | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-205.htm) | corrected |
| signup.platform | County collector | 35 ILCS 200/21-190(a) | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-190.htm) | corrected |
| signup.steps.1 | Watch for the collector's published notice of the tax sale | 35 ILCS 200/21-115 | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-115.htm) | corrected |
| signup.steps.2 | Contact the county collector; the notice includes the registration requirement in counties under 3,000,000 inhabitants | 35 ILCS 200/21-115 | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-115.htm) | corrected |
| signup.steps.3 | Register before the sale where the notice calls for it (counties under 3,000,000 inhabitants) | 35 ILCS 200/21-115 | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-115.htm) | corrected |
| signup.steps.4 | Pay the county collector the amount charged on the property right after the sale (§ 21-240) | 35 ILCS 200/21-240 | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-240.htm) | corrected |
| signup.deposit.1 | Confirm payment rules with the county collector. | 35 ILCS 200/21-240 | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-240.htm) | corrected |
| signup.deposit.2 | (removed) | 35 ILCS 200/21-240 | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-240.htm) | corrected |
| otc.available | Not set by statute. Liens not sold for want of bidders are forfeited to the county. Confirm with the county. | 35 ILCS 200/21-225 | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-225.htm) | corrected |
| otc.note.1 | Not set by statute. Confirm with the county. | 35 ILCS 200/21-225 | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-225.htm) | corrected |
| otc.note.2 | Liens not sold for want of bidders are forfeited to the county as trustee. | 35 ILCS 200/21-225 | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-225.htm) | corrected |
| platforms.1 | County collector | 35 ILCS 200/21-190(a) | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-190.htm) | corrected |
| platforms.2 | (removed) | 35 ILCS 200/21-205(b) | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-205.htm) | corrected |
| platforms.3 | (removed) | 35 ILCS 200/21-190(a) | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-190.htm) | corrected |
| surplus.1 | The owner of the property at the time of the sale may submit a claim for surplus funds to the county treasurer or the circuit court within 3 years of the date on the treasurer's notice (35 ILCS 200/22-42(h)). | 35 ILCS 200/22-42(h) | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K22-42.htm) | corrected |
| surplus.2 | The selling officer deposits surplus funds with the county treasurer 30 days after the court confirms the sale, to the extent the winning bid exceeds the minimum bid (35 ILCS 200/22-42(f)). | 35 ILCS 200/22-42(f) | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K22-42.htm) | corrected |
| es.rate | Tasa máxima fijada por la ley: oferta de penalización de hasta 9% del monto del impuesto o de la tasa especial | 35 ILCS 200/21-215(a) | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-215.htm) | corrected |
| es.redemption | Hasta 3 años desde la fecha de venta (menos para algunos tipos de propiedad) | 35 ILCS 200/21-350 | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-350.htm) | corrected |
| es.summary.1 | Después de que el tribunal dicta sentencia, el recaudador del condado realiza la venta fiscal anual. | 35 ILCS 200/21-190(a) | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-190.htm) | corrected |
| es.summary.2 | La oferta de penalización es un porcentaje del monto del impuesto o de la tasa especial, hasta 9%. | 35 ILCS 200/21-215(a) | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-215.htm) | corrected |
| es.summary.3 | Para obtener una escritura fiscal, el tenedor del certificado presenta una petición ante el tribunal de circuito (35 ILCS 200/22-30). | 35 ILCS 200/22-30 | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K22-30.htm) | corrected |
| es.summary.4 | Estatuto: 35 ILCS 200/21-215 (ofertas de penalización). | 35 ILCS 200/21-215 | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-215.htm) | corrected |
| es.typeWhy.1 | La propiedad vendida en una venta fiscal puede redimirse en cualquier momento antes de 3 años desde la fecha de venta (menos para algunos tipos de propiedad). 35 ILCS 200/21-350. | 35 ILCS 200/21-350 | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-350.htm) | corrected |
| es.rateWhy.1 | Illinois limita la oferta de penalización a 9% del monto del impuesto o de la tasa especial, y resulta comprador quien ofrece el menor porcentaje de penalización. | 35 ILCS 200/21-215(a) | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-215.htm) | corrected |
| es.rateWhy.2 | Los impuestos posteriores pagados por el tenedor llevan una penalización de 12% por cada año o fracción (35 ILCS 200/21-355(c)). | 35 ILCS 200/21-355(c) | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-355.htm) | corrected |
| es.rateWhy.3 | El porcentaje de penalización se aplica al monto del impuesto o de la tasa especial. | 35 ILCS 200/21-215(a) | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-215.htm) | corrected |
| es.notBeginnerReason.1 | (removed) | 35 ILCS 200/21-215(a) | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-215.htm) | corrected |
| es.notBeginnerReason.2 | Las ventas de rezagos van al mejor postor en efectivo, aunque la oferta sea menor que los impuestos adeudados. | 35 ILCS 200/21-260 | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-260.htm) | corrected |
| es.notBeginnerReason.3 | Una escritura fiscal requiere una petición ante el tribunal de circuito. | 35 ILCS 200/22-30 | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K22-30.htm) | corrected |
| es.beginnerTip.1 | (removed) | 35 ILCS 200/21-215(a) | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-215.htm) | corrected |
| es.beginnerTip.2 | (removed) | 35 ILCS 200/21-215(a) | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-215.htm) | corrected |
| es.risks.1 | (removed) | 35 ILCS 200/21-190(c) (P.A. 104-553, eff. 7-10-26) | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-190.htm) | corrected |
| es.risks.2 | Los impuestos posteriores pagados por el tenedor llevan una penalización de 12% por cada año o fracción | 35 ILCS 200/21-355(c) | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-355.htm) | corrected |
| es.risks.3 | Las ventas de rezagos van al mejor postor en efectivo, aunque la oferta sea menor que los impuestos adeudados | 35 ILCS 200/21-260 | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-260.htm) | corrected |
| es.risks.4 | La petición de escritura fiscal debe presentarse ante el tribunal de circuito entre 3 y 6 meses antes de que termine el período de redención | 35 ILCS 200/22-30 | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K22-30.htm) | corrected |
| es.ddExtra.1 | Revise el aviso publicado para ver el monto total adeudado y los años que cubre | 35 ILCS 200/21-115 | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-115.htm) | corrected |
| es.ddExtra.2 | (removed) | 35 ILCS 200/21-115 | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-115.htm) | corrected |
| es.ddExtra.3 | Un año fiscal no puede ofrecerse en una venta de rezagos antes de la venta fiscal anual de ese año | 35 ILCS 200/21-145 | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-145.htm) | corrected |
| es.signup.platform | Recaudador del condado | 35 ILCS 200/21-190(a) | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-190.htm) | corrected |
| es.signup.steps.1 | Esté atento al aviso publicado del recaudador sobre la venta fiscal | 35 ILCS 200/21-115 | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-115.htm) | corrected |
| es.signup.steps.2 | Contacte al recaudador del condado; el aviso incluye el requisito de registro en condados con menos de 3,000,000 de habitantes | 35 ILCS 200/21-115 | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-115.htm) | corrected |
| es.signup.steps.3 | Regístrese antes de la venta donde el aviso lo exija (condados con menos de 3,000,000 de habitantes) | 35 ILCS 200/21-115 | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-115.htm) | corrected |
| es.signup.steps.4 | Pague al recaudador del condado el monto cobrado sobre la propiedad inmediatamente después de la venta (§ 21-240) | 35 ILCS 200/21-240 | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-240.htm) | corrected |
| es.signup.deposit.1 | Confirme las reglas de pago con el recaudador del condado. | 35 ILCS 200/21-240 | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-240.htm) | corrected |
| es.signup.deposit.2 | (removed) | 35 ILCS 200/21-240 | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-240.htm) | corrected |
| es.otc.note.1 | No lo fija la ley. Confirme con el condado. | 35 ILCS 200/21-225 | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-225.htm) | corrected |
| es.otc.note.2 | Los gravámenes que no se venden por falta de postores se confiscan a favor del condado como fiduciario. | 35 ILCS 200/21-225 | [link](https://www.ilga.gov/Documents/legislation/ilcs/documents/003502000K21-225.htm) | corrected |

## Corrections (before → after)

- `rate`: “9% per 6-month period (18% annualized)” → “Maximum rate set by law: a penalty bid of up to 9% of the amount of the tax or special assessment”
- `rateNote`: “Penalty on TAX amount only — not on overbid” → “Redeeming after 6 months and by 12 months costs the certificate amount times 2 times the penalty bid (§ 21-355(b))”
- `redemption`: “2–2.5 years” → “Up to 3 years from the date of sale (shorter for some property types)”
- `bidMethod`: “Bid-down interest rate” → “Lowest penalty percentage bid (no bid over 9%)”
- `auctionPlatform`: “SRI / BidSpencer / county-run (varies)” → “County collector; the collector may use an automated bidding system. Confirm with the county.”
- `auctionTiming`: “Varies by county — mostly fall” → “Set by the county collector in a published notice (at least 10 days before the judgment application). Confirm with the county.”
- `summary.1`: “Illinois holds Annual Sales (county-level, competitive bidding) and Scavenger Sales (Cook County, biennial in odd years for 3+ year delinquent properties).” → “After the court enters judgment, the county collector conducts the annual tax sale.”
- `summary.2`: “CRITICAL: The penalty is on the TAX AMOUNT, not the bid amount.” → “The penalty bid is a percentage of the amount of the tax or special assessment, up to 9%.”
- `summary.3`: “Max 9% per 6-month period (reduced from 18%/6mo effective ~Jan 2022).” → “Counties may hold a scavenger sale of forfeited liens and certificates if the county board orders it by resolution.”
- `summary.4`: “Compounds: bid% × certificate at 6mo, 2× at 12mo, 3× at 18mo, etc.” → “Redemption penalty: the certificate amount times 2 times the penalty bid if redeemed after 6 months and by 12 months (§ 21-355(b)).”
- `summary.5`: “Subtaxing (subsequent taxes) carries separate 12%/year penalty.” → “Subsequent taxes paid by the certificate holder carry a 12% penalty for each year or portion of a year until redemption.”
- `summary.6`: “Redemption: 2 years (residential 1-6 units), 2.5 years for certificates issued on/after Jan 1 2024, 6 months for vacant non-farm/commercial at scavenger sales.” → “Redemption: up to 3 years from the date of sale, shorter for some property types.”
- `summary.7`: “Foreclosure requires Circuit Court petition (35 ILCS 200/22-30, 22-40). 102 counties.” → “To get a tax deed, the certificate holder files a petition in the circuit court (35 ILCS 200/22-30).”
- `summary.8`: “Statute: 35 ILCS 200/21-215 (penalty bids), 200/21-350 (redemption), 200/22-30 (tax deed).” → “Statute: 35 ILCS 200/21-215 (penalty bids).”
- `typeWhy.1`: “Illinois sells tax lien certificates — investors purchase the right to collect delinquent taxes, not the property.” → “Illinois offers tax liens or certificates for delinquent property at a public tax sale.”
- `typeWhy.2`: “The owner retains title during the 2-2.5 year redemption period before the lienholder can petition for a deed. 35 ILCS 200/21-215.” → “Property sold at a tax sale may be redeemed at any time before 3 years from the date of sale (shorter for some property types). 35 ILCS 200/21-350.”
- `rateWhy.1`: “Illinois caps the lien penalty at 9% per 6-month period (reduced from 18% effective ~Jan 2022) and uses a bid-down auction format.” → “Illinois caps the penalty bid at 9% of the amount of the tax or special assessment, and the least penalty percentage wins.”
- `rateWhy.2`: “CRITICAL: This is a PENALTY on the TAX AMOUNT, not the bid amount.” → “The penalty percentage is applied to the amount of the tax or special assessment.”
- `rateWhy.3`: “Subtaxing carries a separate 12%/year penalty. 35 ILCS 200/21-215.” → “Subsequent taxes paid by the holder carry a 12% penalty for each year or part of a year (35 ILCS 200/21-355(c)).”
- `keyNotes.1`: “Interest earned on tax amount only — not on premium overbid” → “The penalty bid is a percentage of the tax or special assessment amount”
- `keyNotes.2`: “Cook County is largest volume in state — institutional dominated” → “From the seventh tax sale after July 10, 2026, counties with 3,000,000 or more inhabitants must offer to purchase every property offered at the sale”
- `keyNotes.3`: “2.5-year redemption is longer than most lien states” → “Vacant non-farm property, property with 7 or more residential units, and commercial or industrial property: 1 year to redeem”
- `notBeginnerReason.1`: “Cook County (Chicago) is dominated by institutional buyers pushing rates to 0%.” → “(removed)”
- `notBeginnerReason.2`: “Complex Scavenger Sale rules.” → “Scavenger sales go to the highest bidder for cash, even if the bid is below the taxes owed.”
- `notBeginnerReason.3`: “Requires attorney for foreclosure.” → “A tax deed requires a petition to the circuit court.”
- `beginnerTip.1`: “Skip Cook County until you have experience.” → “(removed)”
- `beginnerTip.2`: “Start with DuPage, Lake, or Will counties — better rates and less institutional competition than Chicago.” → “(removed)”
- `risks.1`: “Cook County: institutional buyers push rates to 0% — not viable for individual investors” → “(removed)”
- `risks.2`: “CRITICAL: Penalty is on the TAX AMOUNT, not the bid — fundamentally different from interest-rate states” → “The penalty bid is a percentage of the tax amount, and the lowest penalty percentage wins.”
- `risks.3`: “Subtaxing (subsequent tax payments) carries separate 12%/year penalty” → “Subsequent taxes paid by the holder carry a 12% penalty for each year or part of a year”
- `risks.4`: “Scavenger Sale rules differ significantly from Annual Sale — shorter redemption, different bidding” → “Scavenger sales go to the highest bidder for cash, even if the bid is below the taxes owed”
- `risks.5`: “Foreclosure process requires specialized Illinois tax lien attorney and Circuit Court petition” → “A tax deed petition must be filed in the circuit court 3 to 6 months before the redemption period ends”
- `ddExtra.1`: “Verify the current open tax year balance with the county collector before bidding” → “Check the published notice for the total amount due and the years it covers”
- `ddExtra.2`: “Check PACER for active bankruptcy proceedings” → “(removed)”
- `ddExtra.3`: “Confirm you understand the difference between Annual Sale and Scavenger Sale rules” → “A tax year cannot be offered at a scavenger sale before the annual tax sale for that year”
- `ddExtra.4`: “Cook County uses cooktaxsale.com; many other counties use GovEase (govease.com)” → “Confirm the bidding method with the county collector”
- `signup.platform`: “County-specific (Cook uses its own system; others vary)” → “County collector”
- `signup.steps.1`: “For Cook County: go to cookcountytreasurer.com and register for the Annual Tax Sale” → “Watch for the collector's published notice of the tax sale”
- `signup.steps.2`: “For other counties: contact the county clerk or treasurer — find them at revenue.illinois.gov” → “Contact the county collector; the notice includes the registration requirement in counties under 3,000,000 inhabitants”
- `signup.steps.3`: “Pre-register at least 2 weeks in advance with government ID and entity documents if bidding as LLC” → “Register before the sale where the notice calls for it (counties under 3,000,000 inhabitants)”
- `signup.steps.4`: “Fund your account per county instructions — Cook requires pre-funding” → “Pay the county collector the amount charged on the property right after the sale (§ 21-240)”
- `signup.deposit.1`: “Cook County requires pre-funding.” → “Confirm payment rules with the county collector.”
- `signup.deposit.2`: “Other counties vary.” → “(removed)”
- `otc.available`: “Not generally available” → “Not set by statute. Liens not sold for want of bidders are forfeited to the county. Confirm with the county.”
- `otc.note.1`: “No OTC.” → “Not set by statute. Confirm with the county.”
- `otc.note.2`: “Unsold liens go to forfeiture status — contact county for purchase.” → “Liens not sold for want of bidders are forfeited to the county as trustee.”
- `platforms.1`: “cookcountytreasurer.com” → “County collector”
- `platforms.2`: “GovEase” → “(removed)”
- `platforms.3`: “County clerk offices” → “(removed)”
- `surplus.1`: “Illinois passed surplus funds reform aligning with Tyler requirements.” → “The owner of the property at the time of the sale may submit a claim for surplus funds to the county treasurer or the circuit court within 3 years of the date on the treasurer's notice (35 ILCS 200/22-42(h)).”
- `surplus.2`: “(new)” → “The selling officer deposits surplus funds with the county treasurer 30 days after the court confirms the sale, to the extent the winning bid exceeds the minimum bid (35 ILCS 200/22-42(f)).”

## Pass 2 trims, removals and notes

- `rate`: was "9% per 6-month period (18% annualized)"; § 21-215 sets 9% of the tax amount as the cap on the bid
- `rateNote`: was "Penalty on TAX amount only — not on overbid". pass 2: only the 6-to-12-month step is in the quote
- `redemption`: was "2–2.5 years"; § 21-350 (as amended by P.A. 103-555 and 104-553) says 3 years
- `bidMethod`: was "Bid-down interest rate"
- `auctionPlatform`: was "SRI / BidSpencer / county-run (varies)"; vendor names have no official source
- `auctionTiming`: was "Varies by county — mostly fall"
- `summary.1`: was "Annual Sales ... and Scavenger Sales (Cook County, biennial in odd years ...)"; scavenger sale now on summary.3
- `summary.2`: removed "CRITICAL" emphasis; same rule
- `summary.3`: was "Max 9% per 6-month period (reduced from 18%/6mo effective ~Jan 2022)"; the 9% cap is on summary.2
- `summary.4`: was "Compounds: bid% × certificate at 6mo, 2× at 12mo, 3× at 18mo, etc." pass 2: trimmed to the 6-to-12-month step the quote contains
- `summary.5`: was "Subtaxing (subsequent taxes) carries separate 12%/year penalty."
- `summary.6`: was "2 years ... 2.5 years ... 6 months for vacant non-farm/commercial at scavenger sales"
- `summary.7`: was "Foreclosure requires Circuit Court petition ... 102 counties." count not in quote
- `summary.8`: was three sections; each is cited on its own claim
- `typeWhy.1`: was "investors purchase the right to collect delinquent taxes, not the property"
- `typeWhy.2`: was "owner retains title during the 2-2.5 year redemption period"
- `rateWhy.1`: was "9% per 6-month period (reduced from 18% effective ~Jan 2022)"
- `rateWhy.2`: removed "CRITICAL" emphasis
- `rateWhy.3`: was "Subtaxing carries a separate 12%/year penalty. 35 ILCS 200/21-215."
- `keyNotes.1`: removed "Interest earned ... premium overbid"
- `keyNotes.2`: was "Cook County is largest volume in state — institutional dominated"; P.A. 104-553
- `keyNotes.3`: was "2.5-year redemption is longer than most lien states"
- `notBeginnerReason.1`: removed: no official source (opinion, county practice, vendor name, count or advice not in the statute)
- `notBeginnerReason.2`: was "Complex Scavenger Sale rules."
- `notBeginnerReason.3`: was "Requires attorney for foreclosure."
- `beginnerTip.1`: removed: no official source (opinion, county practice, vendor name, count or advice not in the statute)
- `beginnerTip.2`: removed: no official source (opinion, county practice, vendor name, count or advice not in the statute)
- `risks.1`: removed: no official source (opinion, county practice, vendor name, count or advice not in the statute)
- `risks.2`: was "CRITICAL: Penalty is on the TAX AMOUNT ... fundamentally different from interest-rate states"; comparison removed
- `risks.3`: was "Subtaxing (subsequent tax payments) carries separate 12%/year penalty"
- `risks.4`: was "Scavenger Sale rules differ significantly from Annual Sale — shorter redemption, different bidding"
- `risks.5`: was "requires specialized Illinois tax lien attorney"; advice removed, deadline added
- `ddExtra.1`: was "Verify the current open tax year balance with the county collector before bidding"
- `ddExtra.2`: removed: no official source (opinion, county practice, vendor name, count or advice not in the statute)
- `ddExtra.3`: was "Confirm you understand the difference between Annual Sale and Scavenger Sale rules"
- `ddExtra.4`: was "Cook County uses cooktaxsale.com; many other counties use GovEase"; vendor names have no official source
- `signup.platform`: was "County-specific (Cook uses its own system; others vary)"
- `signup.steps.1`: was Cook County website registration step; website not read
- `signup.steps.2`: was "contact the county clerk or treasurer — find them at revenue.illinois.gov"
- `signup.steps.3`: was "Pre-register at least 2 weeks in advance with government ID and entity documents"; 2-week rule not in the statute
- `signup.steps.4`: was "Fund your account per county instructions — Cook requires pre-funding"
- `signup.deposit.1`: was "Cook County requires pre-funding."
- `signup.deposit.2`: removed: no official source (opinion, county practice, vendor name, count or advice not in the statute)
- `otc.available`: was "Not generally available"
- `otc.note.1`: was "No OTC."
- `otc.note.2`: was "Unsold liens go to forfeiture status — contact county for purchase."
- `platforms.1`: was "cookcountytreasurer.com"
- `platforms.2`: removed: no official source (opinion, county practice, vendor name, count or advice not in the statute)
- `platforms.3`: removed: no official source (opinion, county practice, vendor name, count or advice not in the statute)
- `surplus.1`: was "Illinois passed surplus funds reform aligning with Tyler requirements." pass 2: dropped "after a judicial tax deed auction", which the quote does not say

## Conflicts (flagged)

None.
