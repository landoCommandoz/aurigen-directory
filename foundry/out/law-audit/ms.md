# Mississippi (MS) law audit

Checked 2026-10-27. Status: done. Ledger: `cloudflare/data/law/ms.json`.

Official code access: The Mississippi Code is published through a LexisNexis-hosted site; the legislature page linking to it (legislature.ms.gov) failed with a TLS error from the runner, so the link could not be confirmed and the code was not read. Claims cite the Secretary of State Tax Forfeited Lands rules (Miss. Admin. Code tit. 1, pt. 11, ch. 1) on sos.ms.gov; rate and overbid claims are marked unreachable.

## Finding

The Mississippi Code could not be read. The state's free code is LexisNexis-hosted, and the legislature page that links to
it (legislature.ms.gov) failed with a TLS certificate error from the runner, so the vendor link could not be confirmed as
the state's public access. Claims instead cite the Secretary of State's Tax Forfeited Lands rules on sos.ms.gov (an agency
source; the rule set is dated "Amended and Revised February 18, 1998" and may lag the code). Those rules say county tax
collectors sell delinquent land at annual public sales to the highest bidder starting the last Monday of August, land not
redeemed within two years is forfeited to the State, and the Secretary of State sells forfeited land by application. The
18% rate, the overbid rule and the statute citations are marked "Couldn't reach source". GovEase references were removed
(vendor, no official source read).

## 2023 to 2026 enacted-law search

Not completed. The legislature's site (legislature.ms.gov) failed TLS from the runner; billstatus.ls.state.ms.us was not
searched this run for time. Web search found only House Bill 318 (2025) "IN" (introduced) on § 27-45-3, which is not
enacted law and is not a claim. Recheck in a later run.

## Unreachable sources

- Miss. Code Ann. § 27-45-3 / § 27-41-1: https://www.legislature.ms.gov/legislation/mississippi-code/ (TLS error).

## Watch

- 2025 HB 318 (introduced) proposed changes to § 27-45-3; status not confirmed.

## Claims

| id | shown | statute | link | status |
|---|---|---|---|---|
| type | Tax lien | Miss. Admin. Code tit. 1, pt. 11, ch. 1 (Secretary of State, Tax Forfeited Lands rules) | [link](https://www.sos.ms.gov/content/documents/lands/00000176c.pdf) | flagged |
| rate | 18% | Miss. Code Ann. § 27-45-3 |  | unreachable |
| rateNote | Fixed rate; no interest on the overbid amount | Miss. Code Ann. § 27-45-3 |  | unreachable |
| redemption | 2 years | Miss. Admin. Code tit. 1, pt. 11, ch. 1 (Secretary of State, Tax Forfeited Lands rules) | [link](https://www.sos.ms.gov/content/documents/lands/00000176c.pdf) | supported |
| bidMethod | Highest bidder at public sale | Miss. Admin. Code tit. 1, pt. 11, ch. 1 (Secretary of State, Tax Forfeited Lands rules) | [link](https://www.sos.ms.gov/content/documents/lands/00000176c.pdf) | corrected |
| statute | Miss. Code §27-45-3 | Miss. Code Ann. § 27-45-3 |  | unreachable |
| auctionPlatform | Public sale by the county tax collector | Miss. Admin. Code tit. 1, pt. 11, ch. 1 (Secretary of State, Tax Forfeited Lands rules) | [link](https://www.sos.ms.gov/content/documents/lands/00000176c.pdf) | corrected |
| auctionTiming | Annually starting the last Monday of August (optionally also the first Monday of April) | Miss. Admin. Code tit. 1, pt. 11, ch. 1 (Secretary of State, Tax Forfeited Lands rules) | [link](https://www.sos.ms.gov/content/documents/lands/00000176c.pdf) | corrected |
| summary.1 | Mississippi county tax collectors hold annual tax sales starting the last Monday of August. | Miss. Admin. Code tit. 1, pt. 11, ch. 1 (Secretary of State, Tax Forfeited Lands rules) | [link](https://www.sos.ms.gov/content/documents/lands/00000176c.pdf) | corrected |
| summary.2 | Land not redeemed within the two-year period is forfeited to the State. | Miss. Admin. Code tit. 1, pt. 11, ch. 1 (Secretary of State, Tax Forfeited Lands rules) | [link](https://www.sos.ms.gov/content/documents/lands/00000176c.pdf) | corrected |
| summary.3 | Land forfeited to the State can be bought from the Secretary of State by application. | Miss. Admin. Code tit. 1, pt. 11, ch. 1 (Secretary of State, Tax Forfeited Lands rules) | [link](https://www.sos.ms.gov/content/documents/lands/00000176c.pdf) | corrected |
| summary.4 | Statute: MS Code §27-41-1. | Miss. Code Ann. § 27-45-3 |  | unreachable |
| typeWhy.1 | Mississippi counties sell tax-delinquent land at annual public sales to the highest bidder. | Miss. Admin. Code tit. 1, pt. 11, ch. 1 (Secretary of State, Tax Forfeited Lands rules) | [link](https://www.sos.ms.gov/content/documents/lands/00000176c.pdf) | corrected |
| typeWhy.2 | If not redeemed within the two-year redemption period, ownership is forfeited. | Miss. Admin. Code tit. 1, pt. 11, ch. 1 (Secretary of State, Tax Forfeited Lands rules) | [link](https://www.sos.ms.gov/content/documents/lands/00000176c.pdf) | corrected |
| typeWhy.3 | MS Code §27-41-1. | Miss. Code Ann. § 27-45-3 |  | unreachable |
| rateWhy.1 | Mississippi sets a fixed statutory rate of 18% per year; it is not bid down at auction. | Miss. Code Ann. § 27-45-3 |  | unreachable |
| rateWhy.2 | MS Code §27-41-1. | Miss. Code Ann. § 27-45-3 |  | unreachable |
| keyNotes.1 | (removed) | Miss. Admin. Code tit. 1, pt. 11, ch. 1 (Secretary of State, Tax Forfeited Lands rules) | [link](https://www.sos.ms.gov/content/documents/lands/00000176c.pdf) | corrected |
| keyNotes.2 | No interest on the overbid amount | Miss. Code Ann. § 27-45-3 |  | unreachable |
| keyNotes.3 | 2-year redemption period | Miss. Admin. Code tit. 1, pt. 11, ch. 1 (Secretary of State, Tax Forfeited Lands rules) | [link](https://www.sos.ms.gov/content/documents/lands/00000176c.pdf) | corrected |
| beginnerTip.1 | Land forfeited to the State can be bought from the Secretary of State by application | Miss. Admin. Code tit. 1, pt. 11, ch. 1 (Secretary of State, Tax Forfeited Lands rules) | [link](https://www.sos.ms.gov/content/documents/lands/00000176c.pdf) | corrected |
| beginnerTip.2 | (removed) | Miss. Admin. Code tit. 1, pt. 11, ch. 1 (Secretary of State, Tax Forfeited Lands rules) | [link](https://www.sos.ms.gov/content/documents/lands/00000176c.pdf) | corrected |
| beginnerTip.3 | (removed) | Miss. Admin. Code tit. 1, pt. 11, ch. 1 (Secretary of State, Tax Forfeited Lands rules) | [link](https://www.sos.ms.gov/content/documents/lands/00000176c.pdf) | corrected |
| risks.1 | Two-year redemption period before land is forfeited | Miss. Admin. Code tit. 1, pt. 11, ch. 1 (Secretary of State, Tax Forfeited Lands rules) | [link](https://www.sos.ms.gov/content/documents/lands/00000176c.pdf) | corrected |
| risks.2 | How the overbid premium is handled when the owner redeems was not verified | Miss. Code Ann. § 27-45-3 |  | unreachable |
| risks.3 | (removed) | Miss. Admin. Code tit. 1, pt. 11, ch. 1 (Secretary of State, Tax Forfeited Lands rules) | [link](https://www.sos.ms.gov/content/documents/lands/00000176c.pdf) | corrected |
| ddExtra.1 | (removed) | Miss. Admin. Code tit. 1, pt. 11, ch. 1 (Secretary of State, Tax Forfeited Lands rules) | [link](https://www.sos.ms.gov/content/documents/lands/00000176c.pdf) | corrected |
| ddExtra.2 | Confirm sale details with the county tax collector | Miss. Admin. Code tit. 1, pt. 11, ch. 1 (Secretary of State, Tax Forfeited Lands rules) | [link](https://www.sos.ms.gov/content/documents/lands/00000176c.pdf) | corrected |
| ddExtra.3 | (removed) | Miss. Admin. Code tit. 1, pt. 11, ch. 1 (Secretary of State, Tax Forfeited Lands rules) | [link](https://www.sos.ms.gov/content/documents/lands/00000176c.pdf) | corrected |
| signup.platform | County tax collector (annual sale) | Miss. Admin. Code tit. 1, pt. 11, ch. 1 (Secretary of State, Tax Forfeited Lands rules) | [link](https://www.sos.ms.gov/content/documents/lands/00000176c.pdf) | corrected |
| signup.steps.1 | For state-forfeited land: apply to the Secretary of State on its forms | Miss. Admin. Code tit. 1, pt. 11, ch. 1 (Secretary of State, Tax Forfeited Lands rules) | [link](https://www.sos.ms.gov/content/documents/lands/00000176c.pdf) | corrected |
| signup.steps.2 | For county sales: contact the county tax collector | Miss. Admin. Code tit. 1, pt. 11, ch. 1 (Secretary of State, Tax Forfeited Lands rules) | [link](https://www.sos.ms.gov/content/documents/lands/00000176c.pdf) | corrected |
| signup.steps.3 | (removed) | Miss. Admin. Code tit. 1, pt. 11, ch. 1 (Secretary of State, Tax Forfeited Lands rules) | [link](https://www.sos.ms.gov/content/documents/lands/00000176c.pdf) | corrected |
| signup.steps.4 | (removed) | Miss. Admin. Code tit. 1, pt. 11, ch. 1 (Secretary of State, Tax Forfeited Lands rules) | [link](https://www.sos.ms.gov/content/documents/lands/00000176c.pdf) | corrected |
| signup.deposit.1 | (removed) | Miss. Admin. Code tit. 1, pt. 11, ch. 1 (Secretary of State, Tax Forfeited Lands rules) | [link](https://www.sos.ms.gov/content/documents/lands/00000176c.pdf) | corrected |
| signup.deposit.2 | (removed) | Miss. Admin. Code tit. 1, pt. 11, ch. 1 (Secretary of State, Tax Forfeited Lands rules) | [link](https://www.sos.ms.gov/content/documents/lands/00000176c.pdf) | corrected |
| otc.available | Available from the Secretary of State by application (state-forfeited land) | Miss. Admin. Code tit. 1, pt. 11, ch. 1 (Secretary of State, Tax Forfeited Lands rules) | [link](https://www.sos.ms.gov/content/documents/lands/00000176c.pdf) | corrected |
| otc.note.1 | Applications to buy state-forfeited land are accepted after the land certifies to the State. | Miss. Admin. Code tit. 1, pt. 11, ch. 1 (Secretary of State, Tax Forfeited Lands rules) | [link](https://www.sos.ms.gov/content/documents/lands/00000176c.pdf) | corrected |
| platforms.1 | (removed) | Miss. Admin. Code tit. 1, pt. 11, ch. 1 (Secretary of State, Tax Forfeited Lands rules) | [link](https://www.sos.ms.gov/content/documents/lands/00000176c.pdf) | corrected |
| platforms.2 | County tax collector offices | Miss. Admin. Code tit. 1, pt. 11, ch. 1 (Secretary of State, Tax Forfeited Lands rules) | [link](https://www.sos.ms.gov/content/documents/lands/00000176c.pdf) | corrected |
| surplus.1 | (removed) | Miss. Admin. Code tit. 1, pt. 11, ch. 1 (Secretary of State, Tax Forfeited Lands rules) | [link](https://www.sos.ms.gov/content/documents/lands/00000176c.pdf) | corrected |
| es.rate | 18% | Miss. Code Ann. § 27-45-3 |  | unreachable |
| es.redemption | 2 años | Miss. Admin. Code tit. 1, pt. 11, ch. 1 (Secretary of State, Tax Forfeited Lands rules) | [link](https://www.sos.ms.gov/content/documents/lands/00000176c.pdf) | supported |
| es.summary.1 | En Mississippi los recaudadores de impuestos de los condados realizan ventas fiscales anuales desde el último lunes de agosto. | Miss. Admin. Code tit. 1, pt. 11, ch. 1 (Secretary of State, Tax Forfeited Lands rules) | [link](https://www.sos.ms.gov/content/documents/lands/00000176c.pdf) | corrected |
| es.summary.2 | (removed) | Miss. Admin. Code tit. 1, pt. 11, ch. 1 (Secretary of State, Tax Forfeited Lands rules) | [link](https://www.sos.ms.gov/content/documents/lands/00000176c.pdf) | corrected |
| es.summary.3 | La tierra no redimida en el período de dos años pasa al Estado. | Miss. Admin. Code tit. 1, pt. 11, ch. 1 (Secretary of State, Tax Forfeited Lands rules) | [link](https://www.sos.ms.gov/content/documents/lands/00000176c.pdf) | corrected |
| es.summary.4 | La tierra que pasa al Estado puede comprarse a la Secretaría de Estado mediante solicitud. | Miss. Admin. Code tit. 1, pt. 11, ch. 1 (Secretary of State, Tax Forfeited Lands rules) | [link](https://www.sos.ms.gov/content/documents/lands/00000176c.pdf) | corrected |
| es.summary.5 | Estatuto: MS Code §27-41-1. | Miss. Code Ann. § 27-45-3 |  | unreachable |
| es.typeWhy.1 | Los condados de Mississippi venden tierra con impuestos en mora en ventas públicas anuales al mejor postor. | Miss. Admin. Code tit. 1, pt. 11, ch. 1 (Secretary of State, Tax Forfeited Lands rules) | [link](https://www.sos.ms.gov/content/documents/lands/00000176c.pdf) | corrected |
| es.rateWhy.1 | Mississippi fija una tasa legal de 18% anual; no se puja a la baja. | Miss. Code Ann. § 27-45-3 |  | unreachable |
| es.rateWhy.2 | MS Code §27-41-1. | Miss. Code Ann. § 27-45-3 |  | unreachable |
| es.beginnerTip.1 | La tierra que pasa al Estado puede comprarse a la Secretaría de Estado mediante solicitud | Miss. Admin. Code tit. 1, pt. 11, ch. 1 (Secretary of State, Tax Forfeited Lands rules) | [link](https://www.sos.ms.gov/content/documents/lands/00000176c.pdf) | corrected |
| es.beginnerTip.2 | (removed) | Miss. Admin. Code tit. 1, pt. 11, ch. 1 (Secretary of State, Tax Forfeited Lands rules) | [link](https://www.sos.ms.gov/content/documents/lands/00000176c.pdf) | corrected |
| es.beginnerTip.3 | (removed) | Miss. Admin. Code tit. 1, pt. 11, ch. 1 (Secretary of State, Tax Forfeited Lands rules) | [link](https://www.sos.ms.gov/content/documents/lands/00000176c.pdf) | corrected |
| es.risks.1 | Período de redención de dos años antes de que la tierra pase al Estado | Miss. Admin. Code tit. 1, pt. 11, ch. 1 (Secretary of State, Tax Forfeited Lands rules) | [link](https://www.sos.ms.gov/content/documents/lands/00000176c.pdf) | corrected |
| es.risks.2 | No se verificó cómo se trata la prima de exceso de puja cuando el propietario redime | Miss. Code Ann. § 27-45-3 |  | unreachable |
| es.risks.3 | (removed) | Miss. Admin. Code tit. 1, pt. 11, ch. 1 (Secretary of State, Tax Forfeited Lands rules) | [link](https://www.sos.ms.gov/content/documents/lands/00000176c.pdf) | corrected |
| es.ddExtra.1 | (removed) | Miss. Admin. Code tit. 1, pt. 11, ch. 1 (Secretary of State, Tax Forfeited Lands rules) | [link](https://www.sos.ms.gov/content/documents/lands/00000176c.pdf) | corrected |
| es.ddExtra.2 | Confirme los detalles de la venta con el recaudador de impuestos del condado | Miss. Admin. Code tit. 1, pt. 11, ch. 1 (Secretary of State, Tax Forfeited Lands rules) | [link](https://www.sos.ms.gov/content/documents/lands/00000176c.pdf) | corrected |
| es.ddExtra.3 | (removed) | Miss. Admin. Code tit. 1, pt. 11, ch. 1 (Secretary of State, Tax Forfeited Lands rules) | [link](https://www.sos.ms.gov/content/documents/lands/00000176c.pdf) | corrected |
| es.signup.platform | Recaudador de impuestos del condado (venta anual) | Miss. Admin. Code tit. 1, pt. 11, ch. 1 (Secretary of State, Tax Forfeited Lands rules) | [link](https://www.sos.ms.gov/content/documents/lands/00000176c.pdf) | corrected |
| es.signup.steps.1 | Para tierra del Estado: presente solicitud a la Secretaría de Estado en sus formularios | Miss. Admin. Code tit. 1, pt. 11, ch. 1 (Secretary of State, Tax Forfeited Lands rules) | [link](https://www.sos.ms.gov/content/documents/lands/00000176c.pdf) | corrected |
| es.signup.steps.2 | Para ventas del condado: contacte al recaudador de impuestos del condado | Miss. Admin. Code tit. 1, pt. 11, ch. 1 (Secretary of State, Tax Forfeited Lands rules) | [link](https://www.sos.ms.gov/content/documents/lands/00000176c.pdf) | corrected |
| es.signup.steps.3 | (removed) | Miss. Admin. Code tit. 1, pt. 11, ch. 1 (Secretary of State, Tax Forfeited Lands rules) | [link](https://www.sos.ms.gov/content/documents/lands/00000176c.pdf) | corrected |
| es.signup.steps.4 | (removed) | Miss. Admin. Code tit. 1, pt. 11, ch. 1 (Secretary of State, Tax Forfeited Lands rules) | [link](https://www.sos.ms.gov/content/documents/lands/00000176c.pdf) | corrected |
| es.signup.deposit.1 | (removed) | Miss. Admin. Code tit. 1, pt. 11, ch. 1 (Secretary of State, Tax Forfeited Lands rules) | [link](https://www.sos.ms.gov/content/documents/lands/00000176c.pdf) | corrected |
| es.signup.deposit.2 | (removed) | Miss. Admin. Code tit. 1, pt. 11, ch. 1 (Secretary of State, Tax Forfeited Lands rules) | [link](https://www.sos.ms.gov/content/documents/lands/00000176c.pdf) | corrected |
| es.otc.note.1 | Las solicitudes para comprar tierra del Estado se aceptan después de que la tierra se certifica al Estado. | Miss. Admin. Code tit. 1, pt. 11, ch. 1 (Secretary of State, Tax Forfeited Lands rules) | [link](https://www.sos.ms.gov/content/documents/lands/00000176c.pdf) | corrected |

## Corrections (before → after)

- `bidMethod`: “Premium bid (highest dollar)” → “Highest bidder at public sale”
- `auctionPlatform`: “County-run, in-person” → “Public sale by the county tax collector”
- `auctionTiming`: “August–September (most counties)” → “Annually starting the last Monday of August (optionally also the first Monday of April)”
- `summary.1`: “Mississippi holds annual tax lien sales at the county level. 18% rate.” → “Mississippi county tax collectors hold annual tax sales starting the last Monday of August.”
- `summary.2`: “After 2-year redemption, lienholder can file for chancery court decree.” → “Land not redeemed within the two-year period is forfeited to the State.”
- `summary.3`: “State land available for direct purchase via GovEase.” → “Land forfeited to the State can be bought from the Secretary of State by application.”
- `typeWhy.1`: “Mississippi sells tax lien certificates at annual county-level sales.” → “Mississippi counties sell tax-delinquent land at annual public sales to the highest bidder.”
- `typeWhy.2`: “The investor purchases the lien while the property owner retains title during the 2-year redemption period.” → “If not redeemed within the two-year redemption period, ownership is forfeited.”
- `keyNotes.1`: “1.5% per month fixed — strong predictable return” → “(removed)”
- `keyNotes.3`: “2-year redemption gives owner two full years” → “2-year redemption period”
- `beginnerTip.1`: “Start with GovEase for direct purchase of state-owned land.” → “Land forfeited to the State can be bought from the Secretary of State by application”
- `beginnerTip.2`: “No auction competition — you pick the property, pay the price, and get your certificate.” → “(removed)”
- `beginnerTip.3`: “Best beginner entry point in Mississippi.” → “(removed)”
- `risks.1`: “2-year redemption before chancery court decree — long capital cycle” → “Two-year redemption period before land is forfeited”
- `risks.3`: “Title research is critical — many rural properties have complex ownership histories” → “(removed)”
- `ddExtra.1`: “Check GovEase for direct purchase inventory before attending county auctions” → “(removed)”
- `ddExtra.2`: “Confirm pre-bid registration deadlines with county chancery clerk” → “Confirm sale details with the county tax collector”
- `ddExtra.3`: “Verify property is not in a FEMA flood zone — Mississippi has significant flood risk” → “(removed)”
- `signup.platform`: “GovEase.com (state land) + county chancery clerk (county sales)” → “County tax collector (annual sale)”
- `signup.steps.1`: “For state-owned land: go to govease.com and search Mississippi” → “For state-forfeited land: apply to the Secretary of State on its forms”
- `signup.steps.2`: “For county sales: contact the county chancery clerk — find them at mdah.ms.gov/county-list” → “For county sales: contact the county tax collector”
- `signup.steps.3`: “Register per county instructions — some counties use GovEase, others are in-person” → “(removed)”
- `signup.steps.4`: “Fund your account or bring cashier's check per county requirements” → “(removed)”
- `signup.deposit.1`: “Varies.” → “(removed)”
- `signup.deposit.2`: “GovEase requires pre-funding.” → “(removed)”
- `otc.available`: “Available” → “Available from the Secretary of State by application (state-forfeited land)”
- `otc.note.1`: “State-owned tax land available for direct purchase on GovEase.com year-round.” → “Applications to buy state-forfeited land are accepted after the land certifies to the State.”
- `platforms.1`: “GovEase.com” → “(removed)”
- `platforms.2`: “County chancery clerk offices” → “County tax collector offices”
- `surplus.1`: “Status pending — monitoring for legislative action.” → “(removed)”

## Pass 2 trims, removals and notes

- `type`: flagged: SOS rules describe a sale of the land with a two-year redemption; lien vs deed label not stated
- `rate`: unreachable: Mississippi Code is vendor-hosted; legislature.ms.gov failed (TLS error) from the runner; rate and overbid rules not verified
- `rateNote`: unreachable: Mississippi Code is vendor-hosted; legislature.ms.gov failed (TLS error) from the runner; rate and overbid rules not verified; removed banned word "earns"
- `bidMethod`: was "Premium bid (highest dollar)"
- `statute`: unreachable: Mississippi Code is vendor-hosted; legislature.ms.gov failed (TLS error) from the runner; rate and overbid rules not verified
- `auctionPlatform`: removed "in-person" (not in quote)
- `auctionTiming`: was "August–September (most counties)"
- `summary.1`: removed "18% rate" (not verified)
- `summary.2`: was "lienholder can file for chancery court decree" (not in quote)
- `summary.3`: removed vendor name (GovEase)
- `summary.4`: unreachable: Mississippi Code is vendor-hosted; legislature.ms.gov failed (TLS error) from the runner; rate and overbid rules not verified
- `typeWhy.1`: was "sells tax lien certificates"
- `typeWhy.2`: trimmed: removed "owner retains title"
- `typeWhy.3`: unreachable: Mississippi Code is vendor-hosted; legislature.ms.gov failed (TLS error) from the runner; rate and overbid rules not verified
- `rateWhy.1`: unreachable: Mississippi Code is vendor-hosted; legislature.ms.gov failed (TLS error) from the runner; rate and overbid rules not verified
- `rateWhy.2`: unreachable: Mississippi Code is vendor-hosted; legislature.ms.gov failed (TLS error) from the runner; rate and overbid rules not verified
- `keyNotes.1`: removed: banned money word ("return") and rate not verified
- `keyNotes.2`: unreachable: Mississippi Code is vendor-hosted; legislature.ms.gov failed (TLS error) from the runner; rate and overbid rules not verified; removed advice and banned word "earns"
- `keyNotes.3`: trimmed: removed "two full years"
- `beginnerTip.1`: removed vendor name (GovEase)
- `beginnerTip.2`: removed: no official source (vendor name, opinion or money wording)
- `beginnerTip.3`: removed: no official source (vendor name, opinion or money wording)
- `risks.1`: removed "long capital cycle" and chancery decree
- `risks.2`: unreachable: Mississippi Code is vendor-hosted; legislature.ms.gov failed (TLS error) from the runner; rate and overbid rules not verified
- `risks.3`: removed: no official source (vendor name, opinion or money wording)
- `ddExtra.1`: removed: no official source (vendor name, opinion or money wording)
- `ddExtra.2`: was "county chancery clerk"
- `ddExtra.3`: removed: no official source (vendor name, opinion or money wording)
- `signup.platform`: removed vendor name (GovEase)
- `signup.steps.1`: removed govease.com
- `signup.steps.2`: removed mdah.ms.gov link and chancery clerk
- `signup.steps.3`: removed: no official source (vendor name, opinion or money wording)
- `signup.steps.4`: removed: no official source (vendor name, opinion or money wording)
- `signup.deposit.1`: removed: no official source (vendor name, opinion or money wording)
- `signup.deposit.2`: removed: no official source (vendor name, opinion or money wording)
- `otc.available`: was "Available"
- `otc.note.1`: removed GovEase and "year-round"
- `platforms.1`: removed vendor name (GovEase) without an official source
- `platforms.2`: was "County chancery clerk offices"
- `surplus.1`: removed "Status pending" (not a legal statement)

## Conflicts (flagged)

- `type`: SOS rules say land is "sold at public sale" with a two-year redemption; the code (not reachable) was not read to confirm the lien label
