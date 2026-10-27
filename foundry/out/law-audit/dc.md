# District of Columbia (DC) law audit

Checked 2026-10-27. Status: done. Ledger: `cloudflare/data/law/dc.json`.

Official code access: D.C. Code from code.dccouncil.gov, the Council of the District of Columbia's official code site.

Main finding: the site said DC redemption lasts "6–12 months" and that there is no OTC program. The D.C. Code says the owner
may redeem "at any time until the foreclosure of the right of redemption is final" (§ 47-1360); a buyer may file to foreclose
after a 6-month waiting period (§ 47-1370). OTR sells unsold liens over the counter under § 47-1353(a), for the bid-off amount
plus accrued interest. Bidders must have 20% of the purchase price on deposit (§ 47-1346(b)). For owner-occupied Class 1A/1B
homes with 5 or fewer units, a court trustee sells the property after foreclosure (§ 47-1382.01); the surplus statement was
added from that text. The 18% rate is flagged: it was not found in the sections downloaded this run.

## Unreachable sources

None. All D.C. Code sections downloaded from code.dccouncil.gov; the OTR page downloaded from otr.cfo.dc.gov.

## 2023–2026 enacted law search

- Searched the amendment history printed under each fetched D.C. Code section (§§ 47-1330, 47-1332, 47-1342, 47-1346,
  47-1353, 47-1355, 47-1360, 47-1361, 47-1370, 47-1382, 47-1382.01), which the Council's code site keeps current.
- Found: D.C. Law 25-217, § 7243(d)(2)(A) (Fiscal Year 2025 Budget Support Act, effective Sept. 18, 2024) amending § 47-1332;
  D.C. Law 26-41, §§ 303(b)–(c) (effective Oct. 1, 2025) amending §§ 47-1330 and 47-1332. The code notes that the § 47-1332
  amendment by D.C. Law 26-41 "is subject to the inclusion of the law's fiscal effect in an approved budget and financial plan.
  Therefore that amendment has not been implemented." The shown statements use the current text, which already includes
  the 2024 change.
- No other 2023–2026 act appears in the history of the fetched sections.

## Watch

- D.C. Law 26-41 § 303(c) (amends § 47-1332, sale exemptions): enacted, not implemented until funded. Recheck the § 47-1332
  exemptions when it takes effect.
- Interest rate on redemption: find the section that sets it and confirm or correct "18%".

## Claims

| id | shown | statute | link | status |
|---|---|---|---|---|
| type | Tax lien | D.C. Code § 47-1353(a) (OTR page) | [link](https://otr.cfo.dc.gov/page/real-property-tax-sale) | supported |
| rate | 18% | D.C. Code § 47-1361 | [link](https://code.dccouncil.gov/us/dc/council/code/sections/47-1361) | flagged |
| rateNote | Buyer gets a certificate of sale; a deed requires a court judgment foreclosing redemption | D.C. Code § 47-1382 | [link](https://code.dccouncil.gov/us/dc/council/code/sections/47-1382) | corrected |
| redemption | Until foreclosure of the right of redemption is final | D.C. Code § 47-1360 | [link](https://code.dccouncil.gov/us/dc/council/code/sections/47-1360) | corrected |
| bidMethod | 20% of the purchase price on deposit before bidding | D.C. Code § 47-1346 | [link](https://code.dccouncil.gov/us/dc/council/code/sections/47-1346) | corrected |
| statute | D.C. Code § 47-1330 et seq. | D.C. Code § 47-1332 | [link](https://code.dccouncil.gov/us/dc/council/code/sections/47-1332) | corrected |
| auctionPlatform | One agency named by the Mayor (Office of Tax and Revenue) | D.C. Code § 47-1332 | [link](https://code.dccouncil.gov/us/dc/council/code/sections/47-1332) | corrected |
| auctionTiming | Annual tax sale, plus First-Come-First-Serve and Discount sale events | none: administrative practice (OTR) | [link](https://otr.cfo.dc.gov/page/real-property-tax-sale) | corrected |
| summary.1 | DC holds an annual real property tax sale and sells unsold liens over the counter. | D.C. Code § 47-1353(a) (OTR page) | [link](https://otr.cfo.dc.gov/page/real-property-tax-sale) | corrected |
| summary.2 | Bidders must have 20% of the purchase price on deposit before bidding. | D.C. Code § 47-1346 | [link](https://code.dccouncil.gov/us/dc/council/code/sections/47-1346) | corrected |
| summary.3 | Statute: D.C. Code § 47-1330 et seq. | D.C. Code § 47-1332 | [link](https://code.dccouncil.gov/us/dc/council/code/sections/47-1332) | corrected |
| typeWhy.1 | Washington, D.C. sells tax liens and issues certificates of sale to buyers. | none: administrative practice (OTR) | [link](https://otr.cfo.dc.gov/page/real-property-tax-sale) | corrected |
| typeWhy.2 | The owner can redeem until a court's foreclosure of the right of redemption is final. | D.C. Code § 47-1360 | [link](https://code.dccouncil.gov/us/dc/council/code/sections/47-1360) | corrected |
| typeWhy.3 | D.C. Code § 47-1360. | D.C. Code § 47-1360 | [link](https://code.dccouncil.gov/us/dc/council/code/sections/47-1360) | corrected |
| rateWhy.1 | To redeem, the owner repays the amount the buyer paid, excluding surplus, with interest. | D.C. Code § 47-1361 | [link](https://code.dccouncil.gov/us/dc/council/code/sections/47-1361) | corrected |
| rateWhy.2 | (removed) | D.C. Code § 47-1361 | [link](https://code.dccouncil.gov/us/dc/council/code/sections/47-1361) | corrected |
| rateWhy.3 | D.C. Code § 47-1361. | D.C. Code § 47-1361 | [link](https://code.dccouncil.gov/us/dc/council/code/sections/47-1361) | corrected |
| keyNotes.1.1 | Buyers receive a certificate of sale, not a deed. | none: administrative practice (OTR) | [link](https://otr.cfo.dc.gov/page/real-property-tax-sale) | corrected |
| keyNotes.1.2 | A deed requires a court judgment foreclosing the right of redemption. | D.C. Code § 47-1382 | [link](https://code.dccouncil.gov/us/dc/council/code/sections/47-1382) | corrected |
| keyNotes.2 | Foreclosure can be filed after a 6-month waiting period from the tax sale | D.C. Code § 47-1370 | [link](https://code.dccouncil.gov/us/dc/council/code/sections/47-1370) | corrected |
| keyNotes.3 | On redemption the buyer is repaid the amount paid excluding surplus, with interest | D.C. Code § 47-1361 | [link](https://code.dccouncil.gov/us/dc/council/code/sections/47-1361) | corrected |
| keyNotes.4 | (removed) | D.C. Code § 47-1361 | [link](https://code.dccouncil.gov/us/dc/council/code/sections/47-1361) | corrected |
| keyNotes.5 | For owner-occupied homes, after foreclosure a court-appointed trustee sells the property | D.C. Code § 47-1382.01 | [link](https://code.dccouncil.gov/us/dc/council/code/sections/47-1382.01) | corrected |
| keyNotes.6 | 20% of the purchase price must be on deposit before bidding | D.C. Code § 47-1346 | [link](https://code.dccouncil.gov/us/dc/council/code/sections/47-1346) | corrected |
| notBeginnerReason.1 | A deposit of 20% of the purchase price is required before bidding. | D.C. Code § 47-1346 | [link](https://code.dccouncil.gov/us/dc/council/code/sections/47-1346) | corrected |
| notBeginnerReason.2 | (removed) | D.C. Code § 47-1346 | [link](https://code.dccouncil.gov/us/dc/council/code/sections/47-1346) | corrected |
| beginnerTip.1 | (removed) | D.C. Code § 47-1346 | [link](https://code.dccouncil.gov/us/dc/council/code/sections/47-1346) | corrected |
| beginnerTip.2 | (removed) | D.C. Code § 47-1346 | [link](https://code.dccouncil.gov/us/dc/council/code/sections/47-1346) | corrected |
| risks.1 | Bidders need 20% of the purchase price on deposit | D.C. Code § 47-1346 | [link](https://code.dccouncil.gov/us/dc/council/code/sections/47-1346) | corrected |
| risks.2 | Some property is not sold, such as improved Class 1A or 1B property owing less than $2,500 | D.C. Code § 47-1332 | [link](https://code.dccouncil.gov/us/dc/council/code/sections/47-1332) | corrected |
| risks.3 | The owner can redeem until foreclosure is final | D.C. Code § 47-1360 | [link](https://code.dccouncil.gov/us/dc/council/code/sections/47-1360) | corrected |
| risks.4 | (removed) | D.C. Code § 47-1360 | [link](https://code.dccouncil.gov/us/dc/council/code/sections/47-1360) | corrected |
| ddExtra.1 | Buyers act at their own risk and must do their own due diligence | none: administrative practice (OTR) | [link](https://otr.cfo.dc.gov/page/real-property-tax-sale) | corrected |
| ddExtra.2 | (removed) | none: administrative practice (OTR) | [link](https://otr.cfo.dc.gov/page/real-property-tax-sale) | corrected |
| ddExtra.3 | Foreclosure cannot be filed until 6 months after the tax sale | D.C. Code § 47-1370 | [link](https://code.dccouncil.gov/us/dc/council/code/sections/47-1370) | corrected |
| signup.platform | Office of Tax and Revenue; OTC liens can be bought online | none: administrative practice (OTR) | [link](https://otr.cfo.dc.gov/page/real-property-tax-sale) | corrected |
| signup.steps.1 | (removed) | none: administrative practice (OTR) | [link](https://otr.cfo.dc.gov/page/real-property-tax-sale) | corrected |
| signup.steps.2 | Register for the annual tax sale with the Office of Tax and Revenue | none: administrative practice (OTR) | [link](https://otr.cfo.dc.gov/page/real-property-tax-sale) | corrected |
| signup.steps.3 | Have 20% of the purchase price on deposit before bidding | D.C. Code § 47-1346 | [link](https://code.dccouncil.gov/us/dc/council/code/sections/47-1346) | corrected |
| signup.steps.4 | Bid on the date and at the place stated in the public notice | D.C. Code § 47-1346 | [link](https://code.dccouncil.gov/us/dc/council/code/sections/47-1346) | corrected |
| signup.deposit.1 | 20% of the purchase price, on deposit before bidding. | D.C. Code § 47-1346 | [link](https://code.dccouncil.gov/us/dc/council/code/sections/47-1346) | corrected |
| signup.deposit.2 | (removed) | D.C. Code § 47-1346 | [link](https://code.dccouncil.gov/us/dc/council/code/sections/47-1346) | corrected |
| otc.available | Available | D.C. Code § 47-1353(a) (OTR page) | [link](https://otr.cfo.dc.gov/page/real-property-tax-sale) | corrected |
| otc.note.1 | Liens not sold at the annual sale can be bought over the counter for the bid-off amount plus accrued interest. | D.C. Code § 47-1353(a) (OTR page) | [link](https://otr.cfo.dc.gov/page/real-property-tax-sale) | corrected |
| platforms.1 | Office of Tax and Revenue (online OTC purchases) | none: administrative practice (OTR) | [link](https://otr.cfo.dc.gov/page/real-property-tax-sale) | corrected |
| surplus.1 | After foreclosure on qualifying owner-occupied homes, the court appoints a trustee to sell the property. | D.C. Code § 47-1382.01 | [link](https://code.dccouncil.gov/us/dc/council/code/sections/47-1382.01) | corrected |
| es.rate | 18% | D.C. Code § 47-1361 | [link](https://code.dccouncil.gov/us/dc/council/code/sections/47-1361) | flagged |
| es.redemption | Hasta que la ejecución del derecho de redención sea definitiva | D.C. Code § 47-1360 | [link](https://code.dccouncil.gov/us/dc/council/code/sections/47-1360) | corrected |
| es.summary.1 | DC realiza una venta fiscal anual de bienes inmuebles y vende en mostrador (OTC) los gravámenes no vendidos. | D.C. Code § 47-1353(a) (OTR page) | [link](https://otr.cfo.dc.gov/page/real-property-tax-sale) | corrected |
| es.summary.2 | Los postores deben tener en depósito el 20% del precio de compra antes de pujar. | D.C. Code § 47-1346 | [link](https://code.dccouncil.gov/us/dc/council/code/sections/47-1346) | corrected |
| es.summary.3 | Estatuto: D.C. Code § 47-1330 y siguientes. | D.C. Code § 47-1332 | [link](https://code.dccouncil.gov/us/dc/council/code/sections/47-1332) | corrected |
| es.typeWhy.1 | Washington, D.C. vende gravámenes fiscales y entrega certificados de venta a los compradores. | none: administrative practice (OTR) | [link](https://otr.cfo.dc.gov/page/real-property-tax-sale) | corrected |
| es.rateWhy.1 | Para redimir, el propietario devuelve lo que pagó el comprador, sin el excedente, con intereses. | D.C. Code § 47-1361 | [link](https://code.dccouncil.gov/us/dc/council/code/sections/47-1361) | corrected |
| es.rateWhy.2 | (removed) | D.C. Code § 47-1361 | [link](https://code.dccouncil.gov/us/dc/council/code/sections/47-1361) | corrected |
| es.notBeginnerReason.1 | (removed) | D.C. Code § 47-1346 | [link](https://code.dccouncil.gov/us/dc/council/code/sections/47-1346) | corrected |
| es.notBeginnerReason.2 | Se requiere un depósito del 20% del precio de compra antes de pujar. | D.C. Code § 47-1346 | [link](https://code.dccouncil.gov/us/dc/council/code/sections/47-1346) | corrected |
| es.notBeginnerReason.3 | (removed) | D.C. Code § 47-1346 | [link](https://code.dccouncil.gov/us/dc/council/code/sections/47-1346) | corrected |
| es.beginnerTip.1 | (removed) | D.C. Code § 47-1346 | [link](https://code.dccouncil.gov/us/dc/council/code/sections/47-1346) | corrected |
| es.beginnerTip.2 | (removed) | D.C. Code § 47-1346 | [link](https://code.dccouncil.gov/us/dc/council/code/sections/47-1346) | corrected |
| es.risks.1 | Los postores necesitan el 20% del precio de compra en depósito | D.C. Code § 47-1346 | [link](https://code.dccouncil.gov/us/dc/council/code/sections/47-1346) | corrected |
| es.risks.2 | Algunas propiedades no se venden, como propiedad mejorada Clase 1A o 1B que debe menos de $2,500 | D.C. Code § 47-1332 | [link](https://code.dccouncil.gov/us/dc/council/code/sections/47-1332) | corrected |
| es.risks.3 | El propietario puede redimir hasta que la ejecución sea definitiva | D.C. Code § 47-1360 | [link](https://code.dccouncil.gov/us/dc/council/code/sections/47-1360) | corrected |
| es.risks.4 | (removed) | D.C. Code § 47-1360 | [link](https://code.dccouncil.gov/us/dc/council/code/sections/47-1360) | corrected |
| es.ddExtra.1 | Los compradores actúan bajo su propio riesgo y deben hacer su propia diligencia debida | none: administrative practice (OTR) | [link](https://otr.cfo.dc.gov/page/real-property-tax-sale) | corrected |
| es.ddExtra.2 | (removed) | none: administrative practice (OTR) | [link](https://otr.cfo.dc.gov/page/real-property-tax-sale) | corrected |
| es.ddExtra.3 | La ejecución no puede presentarse hasta 6 meses después de la venta fiscal | D.C. Code § 47-1370 | [link](https://code.dccouncil.gov/us/dc/council/code/sections/47-1370) | corrected |
| es.signup.platform | Oficina de Impuestos e Ingresos (OTR); los gravámenes OTC se compran en línea | none: administrative practice (OTR) | [link](https://otr.cfo.dc.gov/page/real-property-tax-sale) | corrected |
| es.signup.steps.1 | (removed) | none: administrative practice (OTR) | [link](https://otr.cfo.dc.gov/page/real-property-tax-sale) | corrected |
| es.signup.steps.2 | Regístrese para la venta fiscal anual con la Oficina de Impuestos e Ingresos | none: administrative practice (OTR) | [link](https://otr.cfo.dc.gov/page/real-property-tax-sale) | corrected |
| es.signup.steps.3 | Tenga en depósito el 20% del precio de compra antes de pujar | D.C. Code § 47-1346 | [link](https://code.dccouncil.gov/us/dc/council/code/sections/47-1346) | corrected |
| es.signup.steps.4 | Puje en la fecha y el lugar indicados en el aviso público | D.C. Code § 47-1346 | [link](https://code.dccouncil.gov/us/dc/council/code/sections/47-1346) | corrected |
| es.signup.deposit.1 | 20% del precio de compra, en depósito antes de pujar. | D.C. Code § 47-1346 | [link](https://code.dccouncil.gov/us/dc/council/code/sections/47-1346) | corrected |
| es.signup.deposit.2 | (removed) | D.C. Code § 47-1346 | [link](https://code.dccouncil.gov/us/dc/council/code/sections/47-1346) | corrected |
| es.otc.note.1 | Los gravámenes no vendidos en la venta anual pueden comprarse en mostrador por el monto adjudicado al Distrito más intereses acumulados. | D.C. Code § 47-1353(a) (OTR page) | [link](https://otr.cfo.dc.gov/page/real-property-tax-sale) | corrected |

## Corrections (before → after)

- `rateNote`: “Certificate of sale purchased at auction — NOT a deed. Court-supervised foreclosure required.” → “Buyer gets a certificate of sale; a deed requires a court judgment foreclosing redemption”
- `redemption`: “6–12 months” → “Until foreclosure of the right of redemption is final”
- `bidMethod`: “Highest bidder — 20% deposit required” → “20% of the purchase price on deposit before bidding”
- `statute`: “DC Code §47-1330 et seq.; §47-1360; §47-1370; §47-1382” → “D.C. Code § 47-1330 et seq.”
- `auctionPlatform`: “DC Office of Tax and Revenue — in-person (Marion S. Barry Jr. Building)” → “One agency named by the Mayor (Office of Tax and Revenue)”
- `auctionTiming`: “Annual July sale — 2025 sale confirmed July 16, 2025. Discount sale December 2025.” → “Annual tax sale, plus First-Come-First-Serve and Discount sale events”
- `summary.1`: “DC conducts annual tax lien sales starting July 1, running daily until inventory is exhausted.” → “DC holds an annual real property tax sale and sells unsold liens over the counter.”
- `summary.2`: “Minimum 20% deposit required upfront.” → “Bidders must have 20% of the purchase price on deposit before bidding.”
- `summary.3`: “Statute: DC Official Code §47-1301.” → “Statute: D.C. Code § 47-1330 et seq.”
- `typeWhy.1`: “Washington D.C. sells tax lien certificates at its annual July sale.” → “Washington, D.C. sells tax liens and issues certificates of sale to buyers.”
- `typeWhy.2`: “The investor purchases the lien and the property owner retains title during a 6-12 month redemption period.” → “The owner can redeem until a court's foreclosure of the right of redemption is final.”
- `typeWhy.3`: “DC Official Code §47-1301.” → “D.C. Code § 47-1360.”
- `rateWhy.1`: “D.C. sets a fixed statutory interest rate of 18% per annum on tax lien certificates.” → “To redeem, the owner repays the amount the buyer paid, excluding surplus, with interest.”
- `rateWhy.2`: “This rate is not bid-down — all certificates earn the same flat 18%.” → “(removed)”
- `rateWhy.3`: “DC Official Code §47-1301.” → “D.C. Code § 47-1361.”
- `keyNotes.1.1`: “Investor buys certificate of sale — NOT a deed.” → “Buyers receive a certificate of sale, not a deed.”
- `keyNotes.1.2`: “Title requires court foreclosure.” → “A deed requires a court judgment foreclosing the right of redemption.”
- `keyNotes.2`: “6-month wait before foreclosure can be filed — minimum 18-month total timeline to deed” → “Foreclosure can be filed after a 6-month waiting period from the tax sale”
- `keyNotes.3`: “Overbid earns ZERO interest — bid only up to tax amount” → “On redemption the buyer is repaid the amount paid excluding surplus, with interest”
- `keyNotes.4`: “~98% of liens redeem — DC is an interest income market, not a deed acquisition market” → “(removed)”
- `keyNotes.5`: “Owner-occupied residential with 5 or fewer units: surplus returned to former owner after subsequent sale” → “For owner-occupied homes, after foreclosure a court-appointed trustee sells the property”
- `keyNotes.6`: “20% deposit required at time of bid” → “20% of the purchase price must be on deposit before bidding”
- `notBeginnerReason.1`: “Very high property values require substantial capital. 20% deposit required.” → “A deposit of 20% of the purchase price is required before bidding.”
- `notBeginnerReason.2`: “Competitive institutional market.” → “(removed)”
- `beginnerTip.1`: “DC is for experienced investors with significant capital.” → “(removed)”
- `beginnerTip.2`: “The 20% deposit and high property values mean you need $10,000+ just to participate meaningfully.” → “(removed)”
- `risks.1`: “20% upfront deposit is a major capital barrier” → “Bidders need 20% of the purchase price on deposit”
- `risks.2`: “Government-owned properties and historic properties are excluded” → “Some property is not sold, such as improved Class 1A or 1B property owing less than $2,500”
- `risks.3`: “Redemption period varies 6–12 months based on property type” → “The owner can redeem until foreclosure is final”
- `risks.4`: “Environmental and code compliance issues are common in older DC properties” → “(removed)”
- `ddExtra.1`: “Verify property is not government-owned or under historic preservation” → “Buyers act at their own risk and must do their own due diligence”
- `ddExtra.2`: “Check for active DC code violations — these become your responsibility” → “(removed)”
- `ddExtra.3`: “Confirm exact redemption period: 6 months standard, 12 months for owner-occupied” → “Foreclosure cannot be filed until 6 months after the tax sale”
- `signup.platform`: “dc.gov tax sale portal” → “Office of Tax and Revenue; OTC liens can be bought online”
- `signup.steps.1`: “Go to mytax.dc.gov and create an account” → “(removed)”
- `signup.steps.2`: “Register for the annual tax sale (usually begins July 1)” → “Register for the annual tax sale with the Office of Tax and Revenue”
- `signup.steps.3`: “Fund your account with a minimum 20% deposit of your intended bid amount via wire transfer” → “Have 20% of the purchase price on deposit before bidding”
- `signup.steps.4`: “Bid online during the sale window” → “Bid on the date and at the place stated in the public notice”
- `signup.deposit.1`: “20% of intended bid required upfront.” → “20% of the purchase price, on deposit before bidding.”
- `signup.deposit.2`: “This is one of the highest deposit requirements in the country.” → “(removed)”
- `otc.available`: “Not generally available” → “Available”
- `otc.note.1`: “No OTC program.” → “Liens not sold at the annual sale can be bought over the counter for the bid-off amount plus accrued interest.”
- `platforms.1`: “mytax.dc.gov” → “Office of Tax and Revenue (online OTC purchases)”
- `surplus.1`: “Status pending — monitoring for legislative action.” → “After foreclosure on qualifying owner-occupied homes, the court appoints a trustee to sell the property.”

## Pass 2 trims, removals and notes

- `rate`: flagged: rate figure not found in fetched text
- `redemption`: was "6–12 months"
- `bidMethod`: trimmed: "highest bidder" not in fetched text
- `auctionPlatform`: removed in-person building claim (no source)
- `auctionTiming`: removed 2025 dates (past, no source fetched)
- `summary.1`: removed "starting July 1, running daily" (no source)
- `typeWhy.2`: was "6-12 month redemption period"
- `rateWhy.1`: trimmed: removed the 18% figure (see rate, flagged)
- `rateWhy.2`: removed: banned word and unconfirmed rate claim
- `keyNotes.2`: trimmed: removed "minimum 18-month total timeline" (not in quote)
- `keyNotes.3`: rewritten: old text used a banned word
- `keyNotes.4`: removed: "~98% redeem" has no source
- `keyNotes.5`: trimmed: "surplus returned" replaced by the trustee sale the quote states
- `notBeginnerReason.1`: trimmed: removed "very high property values" (no source)
- `notBeginnerReason.2`: removed: no official source
- `beginnerTip.1`: removed: no official source
- `beginnerTip.2`: removed: no official source
- `risks.2`: was "government-owned and historic properties are excluded" (not in fetched text)
- `risks.4`: removed: no official source
- `ddExtra.2`: removed: no official source
- `ddExtra.3`: was "6 months standard, 12 months owner-occupied"
- `signup.steps.1`: removed: mytax.dc.gov account step not in fetched source
- `signup.steps.2`: removed "usually begins July 1"
- `signup.steps.3`: removed wire transfer detail
- `signup.deposit.2`: removed: no official source
- `otc.available`: was "Not generally available"
- `otc.note.1`: was "No OTC program"
- `surplus.1`: was "Status pending"

## Conflicts (flagged)

- `rate`: Fetched D.C. Code §§ 47-1330 to 47-1382.01 say redemption includes "interest thereon" but the 18% figure was not found in the sections read; confirm the rate section
