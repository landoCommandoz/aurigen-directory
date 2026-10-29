# Colorado (CO) law audit

Checked 2026-10-29. Status: done. Ledger: `cloudflare/data/law/co.json`.

Official code access: Colorado Revised Statutes 2024, title 39, fetched as the PDF published by the Office of Legislative Legal Services on leg.colorado.gov (redirects to content.leg.colorado.gov; marked "Uncertified Printout"). The 2025 edition PDF was not found at the same address (404).

## Finding

Re-verified the first run's change. From C.R.S. 2024 title 39 (OLLS PDF): tax liens go to whoever pays the taxes,
interest and fees and the largest amount over them; that excess goes to the county general fund (§ 39-11-115(1)).
Redemption interest is nine points above the federal discount rate, rounded, set each September 1 and effective
October 1 (§ 39-12-103(3)). The site's "floor 8%" is not in § 39-12-103 (the only "eight percent" floor in title 39 is
in § 39-12-111, refunds for wrongly sold land) and was removed. The year's rate figure (first run: 13% for 2026, from
Denver and Larimer County pages) was dropped from the statewide fields because it is a county page, not code. The sale
starts on or before the second Monday in December (§ 39-11-109), not "October–November". Since HB 24-1056 (effective
July 1, 2024), deeds are no longer issued on demand (§ 39-11-120(1)); at least three years after the sale the lien
holder may apply for a public auction (§ 39-11.5-102), files a notice of intent to redeem within eight business days
after it (§ 39-11.5-111) (the site said "match winning bid"), and any overbid left after lienors goes to the owner
(§ 39-11.5-109). The site's "HB 24-1057" surplus claim was corrected to HB 24-1056. Removed: RealAuction, El Paso and
Garfield deposit examples, HOA/IRS/conservation/7-year title claims, eastern-county OTC advice.

## 2023 to 2026 enacted-law search

Read the "Source:" notes in the C.R.S. 2024 title 39 PDF for every section cited:
- L. 2024, HB 24-1056, ch. 165, effective July 1, 2024: added article 11.5 (public auction of option for treasurer's
  deed, overbid to owner) and amended § 39-11-120. Reflected throughout.
Gap: the 2024 edition predates the 2025 and 2026 sessions, and the 2025 edition PDF was not at the OLLS address. 2025-2026
session laws were not searched this run. Next AR/CO revisit: search leg.colorado.gov for 2025-2026 bills amending
article 11, 11.5 or 12 of title 39.

## Unreachable sources

None marked. crs2025-title-39.pdf returned 404 (not an attempt by the download script).

## Watch

- 2025-2026 amendments to article 11.5 (public auction) and § 39-12-103.

## Claims

| id | shown | statute | link | status |
|---|---|---|---|---|
| type | Tax lien | C.R.S. § 39-11-115(1) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | supported |
| rate | Maximum rate set by law: federal discount rate + 9 points, rounded (set each September 1) | C.R.S. § 39-12-103(3) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| rateNote | Rate set each September 1, effective October 1 | C.R.S. § 39-12-103(3) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| redemption | Until a treasurer's deed is issued (deed process can start 3 years after the sale) | C.R.S. § 39-12-103(3) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| bidMethod | Highest amount paid over the taxes, interest and fees | C.R.S. § 39-11-115(1) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| statute | CRS §39-11.5 | C.R.S. art. 11.5 of title 39 (HB 24-1056) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | supported |
| auctionPlatform | At the treasurer's office or another county location, or online | C.R.S. § 39-11-108(1) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| auctionTiming | Starts on or before the second Monday in December | C.R.S. § 39-11-109 | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| summary.1 | Colorado county treasurers auction tax liens each year, starting on or before the second Monday in December. | C.R.S. § 39-11-109 | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| summary.2 | Rate = federal discount rate + 9 points, rounded to the nearest whole percent. | C.R.S. § 39-12-103(3) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| summary.3 | (removed) | C.R.S. § 39-12-103(3) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| summary.4 | Bidding is on the amount paid over the taxes, interest and fees; the highest amount wins. | C.R.S. § 39-11-115(1) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| summary.5 | The amount paid over the taxes goes to the county general fund. | C.R.S. § 39-11-115(1) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| summary.6 | HB 24-1056 (effective July 1, 2024) changed the deed process: the lien holder applies for a public auction instead of taking a deed directly. | C.R.S. § 39-11.5-102(1) (HB 24-1056) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| summary.7 | At least 3 years after the sale, the lien holder may apply for a public auction. | C.R.S. § 39-11.5-102(1) (HB 24-1056) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| summary.8 | After that auction, the lien holder has eight business days to file a notice of intent to redeem. | C.R.S. § 39-11.5-111(1)(a) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| summary.9 | Tax certificate liens end 15 years after issuance (CRS §39-11-148). | C.R.S. § 39-11-148(1) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| summary.10 | Statutes: CRS §39-11-101 and following (sale), §39-12-103 (redemption), CRS §39-11.5 (public auction, HB 24-1056). | C.R.S. art. 11.5 of title 39 (HB 24-1056) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| typeWhy.1 | Colorado sells tax liens: the buyer pays the taxes, interest and fees, not the price of the property itself. | C.R.S. § 39-11-115(1) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| typeWhy.2 | The owner may redeem until a treasurer's deed is issued. | C.R.S. § 39-12-103(3) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| typeWhy.3 | CRS §39-11-101. | C.R.S. § 39-11-101 | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | supported |
| rateWhy.1 | Colorado sets the redemption interest rate at nine points above the federal discount rate, set each September 1. | C.R.S. § 39-12-103(3) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| rateWhy.2 | The rate is fixed by law, not bid down. | C.R.S. § 39-11-115(1) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| rateWhy.3 | Buyers compete on the amount paid over the taxes, interest and fees. | C.R.S. § 39-11-115(1) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| rateWhy.4 | CRS §39-11-101. | C.R.S. § 39-11-101 | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | supported |
| keyNotes.1 | Rate is set every September 1 — confirm the current rate before bidding | C.R.S. § 39-12-103(3) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| keyNotes.2 | HB 24-1056: from July 1, 2024, deeds are no longer issued directly on demand; a public auction is used | C.R.S. § 39-11-120(1) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| keyNotes.3 | Interest runs on the taxes, interest and fees; the amount paid over them goes to the county | C.R.S. § 39-11-115(1) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| beginnerTip.1 | Ask the county treasurer about tax liens the county bid in at the sale; they draw interest at the same rates. | C.R.S. § 39-11-115(1) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| risks.1 | Rate changes each year with the federal discount rate — verify the current rate before bidding | C.R.S. § 39-12-103(3) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| risks.2.1 | HB 24-1056: deeds are no longer issued directly to the lien holder; a public auction is held after an application at least 3 years after the sale. | C.R.S. § 39-11.5-102(1) (HB 24-1056) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| risks.2.2 | After that auction, the lien holder has eight business days to file a notice of intent to redeem. | C.R.S. § 39-11.5-111(1)(a) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| risks.3 | The amount paid over the taxes goes to the county general fund | C.R.S. § 39-11-115(1) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| risks.4 | (removed) | C.R.S. § 39-11-115(1) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| risks.5 | (removed) | C.R.S. § 39-11-115(1) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| risks.6 | Tax certificate liens end 15 years after issuance (CRS §39-11-148) | C.R.S. § 39-11-148(1) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| ddExtra.1 | Verify the current rate with the county treasurer — it is set each September 1 | C.R.S. § 39-12-103(3) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| ddExtra.2 | (removed) | C.R.S. § 39-11-115(1) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| ddExtra.3 | (removed) | C.R.S. § 39-11-115(1) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| ddExtra.4 | (removed) | C.R.S. § 39-11-115(1) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| signup.platform | County treasurer (in person or online) | C.R.S. § 39-11-108(1) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| signup.steps.1 | Find your target county treasurer's tax lien sale notice | C.R.S. § 39-11-108(1) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| signup.steps.2 | Follow the treasurer's bidding rules; each treasurer sets them | C.R.S. § 39-11-115(2) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| signup.steps.3.1 | Ask the treasurer about deposit and registration rules. | C.R.S. § 39-11-115(2) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| signup.steps.3.2 | (removed) | C.R.S. § 39-11-115(2) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| signup.steps.4 | You bid the amount you will pay over the taxes, interest and fees, not the rate | C.R.S. § 39-11-115(1) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| signup.deposit.1 | Set by each treasurer's bidding rules. | C.R.S. § 39-11-115(2) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| signup.deposit.2 | (removed) | C.R.S. § 39-11-115(2) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| signup.deposit.3 | (removed) | C.R.S. § 39-11-115(2) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| signup.deposit.4 | (removed) | C.R.S. § 39-11-115(2) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| otc.available | Ask the treasurer: liens not sold may be bid in by the county | C.R.S. § 39-11-115(1) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| otc.note.1 | Tax liens not sold may be bid in by the county and draw interest at the same rates; ask the treasurer about buying them. | C.R.S. § 39-11-115(1) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| platforms.1 | (removed) | C.R.S. § 39-11-108(1) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| platforms.2 | County treasurer (in person or online) | C.R.S. § 39-11-108(1) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| surplus.1 | At the public auction under HB 24-1056, any overbid left after paying lienors goes to the property owner (CRS §39-11.5-109). | C.R.S. § 39-11.5-109(1)(a) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| es.rate | Tasa máxima fijada por la ley: tasa de descuento federal + 9 puntos, redondeada (fijada cada 1 de septiembre) | C.R.S. § 39-12-103(3) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| es.redemption | Hasta que se emite la escritura del tesorero (el proceso puede iniciarse 3 años después de la venta) | C.R.S. § 39-12-103(3) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| es.summary.1 | Los tesoreros de condado de Colorado subastan gravámenes fiscales cada año, a partir del segundo lunes de diciembre o antes. | C.R.S. § 39-11-109 | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| es.summary.2 | Tasa = tasa de descuento federal + 9 puntos, redondeada al porcentaje entero más cercano. | C.R.S. § 39-12-103(3) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| es.summary.3 | Los gravámenes no vendidos pueden quedar para el condado y generan interés a las mismas tasas; pregunte al tesorero si se pueden comprar. | C.R.S. § 39-11-115(1) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| es.summary.4 | Estatuto: CRS §39-11-101. | C.R.S. § 39-11-101 | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | supported |
| es.typeWhy.1 | Colorado vende gravámenes fiscales: el comprador paga los impuestos, intereses y cargos, no el precio de la propiedad (CRS §39-11-101). | C.R.S. § 39-11-115(1) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| es.typeWhy.2 | El propietario puede redimir hasta que se emita la escritura del tesorero. | C.R.S. § 39-12-103(3) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| es.rateWhy.1 | Colorado fija la tasa de interés de redención en nueve puntos sobre la tasa de descuento federal, fijada cada 1 de septiembre. | C.R.S. § 39-12-103(3) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| es.rateWhy.2 | La tasa la fija la ley; no se puja a la baja (CRS §39-11-101). | C.R.S. § 39-11-115(1) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| es.beginnerTip.1 | Pregunte al tesorero del condado por los gravámenes que el condado se quedó en la venta; generan interés a las mismas tasas. | C.R.S. § 39-11-115(1) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| es.risks.1 | La tasa cambia cada año con la tasa de descuento federal — verifique la tasa actual antes de pujar | C.R.S. § 39-12-103(3) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| es.risks.2 | (removed) | C.R.S. § 39-11-115(1) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| es.risks.3 | (removed) | C.R.S. § 39-11-115(1) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| es.ddExtra.1 | Verifique la tasa actual con el tesorero del condado — se fija cada 1 de septiembre | C.R.S. § 39-12-103(3) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| es.ddExtra.2 | (removed) | C.R.S. § 39-11-115(1) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| es.ddExtra.3 | (removed) | C.R.S. § 39-11-115(1) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| es.signup.platform | Tesorero del condado (en persona o en línea) | C.R.S. § 39-11-108(1) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| es.signup.steps.1 | Encuentre el aviso de venta de gravámenes del tesorero de su condado objetivo | C.R.S. § 39-11-108(1) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| es.signup.steps.2 | Siga las reglas de puja del tesorero; cada tesorero las fija | C.R.S. § 39-11-115(2) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| es.signup.steps.3 | Pregunte al tesorero por las reglas de depósito y registro. | C.R.S. § 39-11-115(2) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| es.signup.steps.4 | Usted puja la cantidad que pagará por encima de los impuestos, intereses y cargos, no la tasa | C.R.S. § 39-11-115(1) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| es.signup.deposit.1 | Fijado por las reglas de puja de cada tesorero. | C.R.S. § 39-11-115(2) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| es.signup.deposit.2 | (removed) | C.R.S. § 39-11-115(2) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |
| es.otc.note.1 | Los gravámenes no vendidos pueden quedar para el condado y generan interés a las mismas tasas; pregunte al tesorero si se pueden comprar. | C.R.S. § 39-11-115(1) | [link](https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-39.pdf) | corrected |

## Corrections (before → after)

- `rate`: “Federal Discount Rate + 9% (14% for 2025, floor 8%)” → “Maximum rate set by law: federal discount rate + 9 points, rounded (set each September 1)”
- `rateNote`: “Variable rate — resets annually September 1” → “Rate set each September 1, effective October 1”
- `redemption`: “3 years” → “Until a treasurer's deed is issued (deed process can start 3 years after the sale)”
- `bidMethod`: “Highest bidder (premium bid)” → “Highest amount paid over the taxes, interest and fees”
- `auctionPlatform`: “Mix of online and in-person by county” → “At the treasurer's office or another county location, or online”
- `auctionTiming`: “October–November (most counties)” → “Starts on or before the second Monday in December”
- `summary.1`: “Colorado holds online county tax lien sales in November.” → “Colorado county treasurers auction tax liens each year, starting on or before the second Monday in December.”
- `summary.2`: “Rate = Federal Discount Rate (Sept 1) + 9%, rounded to nearest whole %, floor 8%. 2025 rate = 14%.” → “Rate = federal discount rate + 9 points, rounded to the nearest whole percent.”
- `summary.3`: “Rate locks for certificate life.” → “(removed)”
- `summary.4`: “Bidding is premium bid-up (NOT rate bid-down) — highest premium over face amount wins.” → “Bidding is on the amount paid over the taxes, interest and fees; the highest amount wins.”
- `summary.5`: “Premium is NOT interest-bearing.” → “The amount paid over the taxes goes to the county general fund.”
- `summary.6`: “CRITICAL: HB 24-1056 (July 2024) changed the deed process — deeds are NO LONGER auto-issued to lien holders.” → “HB 24-1056 (effective July 1, 2024) changed the deed process: the lien holder applies for a public auction instead of taking a deed directly.”
- `summary.7`: “After 3-year redemption, property goes to public auction.” → “At least 3 years after the sale, the lien holder may apply for a public auction.”
- `summary.8`: “Lien holder has 8 business days to match winning bid.” → “After that auction, the lien holder has eight business days to file a notice of intent to redeem.”
- `summary.9`: “Certificates auto-cancel after 15 years (CRS §39-11-148). 64 counties.” → “Tax certificate liens end 15 years after issuance (CRS §39-11-148).”
- `summary.10`: “Statutes: CRS §39-11-101 through §39-12-113 (sale/redemption); CRS §39-11.5 (Treasurer's Deed public auction, HB 24-1056).” → “Statutes: CRS §39-11-101 and following (sale), §39-12-103 (redemption), CRS §39-11.5 (public auction, HB 24-1056).”
- `typeWhy.1`: “Colorado sells tax lien certificates — the investor purchases the right to collect delinquent taxes plus interest, not the property itself.” → “Colorado sells tax liens: the buyer pays the taxes, interest and fees, not the price of the property itself.”
- `typeWhy.2`: “The owner retains title during the 3-year redemption window.” → “The owner may redeem until a treasurer's deed is issued.”
- `rateWhy.1`: “Colorado ties its tax lien interest rate to the Federal Discount Rate plus a statutory 9% premium, recalculated annually (floor 8%). 2025 rate = 14%.” → “Colorado sets the redemption interest rate at nine points above the federal discount rate, set each September 1.”
- `rateWhy.2`: “The rate is NOT bid-down at auction — it's fixed statewide.” → “The rate is fixed by law, not bid down.”
- `rateWhy.3`: “Investors compete by bidding premium over face amount.” → “Buyers compete on the amount paid over the taxes, interest and fees.”
- `keyNotes.1`: “Rate resets every September 1 — confirm current year rate before investing” → “Rate is set every September 1 — confirm the current rate before bidding”
- `keyNotes.2`: “HB 24-1056 (July 2024): deeds no longer auto-issued after lien maturity — public auction now required” → “HB 24-1056: from July 1, 2024, deeds are no longer issued directly on demand; a public auction is used”
- `keyNotes.3`: “Overbid earns no interest — bid only up to tax amount” → “Interest runs on the taxes, interest and fees; the amount paid over them goes to the county”
- `beginnerTip.1`: “Look at rural eastern Colorado counties (Kiowa, Cheyenne, Kit Carson) for OTC purchases at the full rate with zero auction competition.” → “Ask the county treasurer about tax liens the county bid in at the sale; they draw interest at the same rates.”
- `risks.1`: “Rate fluctuates annually with the Federal Discount Rate — verify current rate before bidding (2025 = 14%, floor 8%)” → “Rate changes each year with the federal discount rate — verify the current rate before bidding”
- `risks.2.1`: “HB 24-1056 (July 2024): Deeds NO LONGER auto-issued to lien holder — property goes to public auction after 3-year redemption.” → “HB 24-1056: deeds are no longer issued directly to the lien holder; a public auction is held after an application at least 3 years after the sale.”
- `risks.2.2`: “Lien holder has 8 business days to match winning bid.” → “After that auction, the lien holder has eight business days to file a notice of intent to redeem.”
- `risks.3`: “Premium paid at auction is NOT interest-bearing — avoid overbidding” → “The amount paid over the taxes goes to the county general fund”
- `risks.4`: “HOA and special improvement district liens can compete with or survive tax sales” → “(removed)”
- `risks.5`: “IRS federal tax liens survive if IRS not notified (120-day federal redemption)” → “(removed)”
- `risks.6`: “Certificates auto-cancel after 15 years (CRS §39-11-148)” → “Tax certificate liens end 15 years after issuance (CRS §39-11-148)”
- `ddExtra.1`: “Verify the current rate by calling the county treasurer — it changes annually based on Sept 1 Federal Discount Rate” → “Verify the current rate with the county treasurer — it is set each September 1”
- `ddExtra.2`: “Check for HOA liens and special improvement district assessments” → “(removed)”
- `ddExtra.3`: “Confirm parcel is not in a federal conservation area or water district with superior claims” → “(removed)”
- `ddExtra.4`: “Treasurer's Deed conveys unmarketable title for 7 years — budget for quiet title action” → “(removed)”
- `signup.platform`: “RealAuction (majority of counties)” → “County treasurer (in person or online)”
- `signup.steps.1`: “Find your target county's treasurer at colorado.gov/treasury or Google '[county name] CO treasurer tax lien sale'” → “Find your target county treasurer's tax lien sale notice”
- `signup.steps.2`: “Register on the county's auction platform (majority use RealAuction; some use county portals)” → “Follow the treasurer's bidding rules; each treasurer sets them”
- `signup.steps.3.1`: “Submit ACH or wire deposit per county instructions — typically 2 weeks before November auction.” → “Ask the treasurer about deposit and registration rules.”
- `signup.steps.3.2`: “W-9 required.” → “(removed)”
- `signup.steps.4`: “Bid online during the auction window — you're bidding PREMIUM OVER face amount, NOT rate” → “You bid the amount you will pay over the taxes, interest and fees, not the rate”
- `signup.deposit.1`: “Varies by county.” → “Set by each treasurer's bidding rules.”
- `signup.deposit.2`: “Common: 10% of intended bid (El Paso).” → “(removed)”
- `signup.deposit.3`: “Some flat fee ($75 Garfield).” → “(removed)”
- `signup.deposit.4`: “W-9 required.” → “(removed)”
- `otc.available`: “Available” → “Ask the treasurer: liens not sold may be bid in by the county”
- `otc.note.1`: “Unsold liens available for direct purchase from county treasurers after annual sale.” → “Tax liens not sold may be bid in by the county and draw interest at the same rates; ask the treasurer about buying them.”
- `platforms.1`: “RealAuction.com” → “(removed)”
- `platforms.2`: “County treasurer portals” → “County treasurer (in person or online)”
- `surplus.1`: “Colorado enacted HB 24-1057 requiring surplus proceeds be returned to former owners.” → “At the public auction under HB 24-1056, any overbid left after paying lienors goes to the property owner (CRS §39-11.5-109).”

## Pass 2 trims, removals and notes

- `rate`: was "Federal Discount Rate + 9% (14% for 2025, floor 8%)"; removed year figure (county detail) and 8% floor (the 8% in title 39 is in § 39-12-111, not the redemption rate). pass 2: rounding and September rest on § 39-12-103(3) round/sept quotes
- `rateNote`: was "Variable rate — resets annually September 1"
- `redemption`: was "3 years". pass 2: 3-year start rests on § 39-11.5-102(1)
- `bidMethod`: was "Highest bidder (premium bid)"
- `auctionPlatform`: was "Mix of online and in-person by county". pass 2: online part rests on § 39-11-108(1) online quote
- `auctionTiming`: was "October–November (most counties)"
- `summary.1`: was "online county tax lien sales in November"
- `summary.2`: removed 8% floor and 2025 figure. pass 2: rounding rests on round quote
- `summary.3`: removed: "rate locks for certificate life" not in § 39-12-103 text read
- `summary.4`: removed capitals
- `summary.5`: was "Premium is NOT interest-bearing."
- `summary.6`: removed "CRITICAL"; pass 2: date rests on § 39-11-120(1) and the article 11.5 source note
- `summary.7`: was "After 3-year redemption, property goes to public auction."
- `summary.8`: was "Lien holder has 8 business days to match winning bid." (statute says notice of intent to redeem)
- `summary.9`: removed "64 counties"
- `summary.10`: renamed sections to those read
- `typeWhy.1`: trimmed
- `typeWhy.2`: was "retains title during the 3-year redemption window"
- `rateWhy.1`: removed floor and 2025 figure. pass 2: September rests on sept quote
- `rateWhy.2`: removed capitals
- `rateWhy.3`: trimmed
- `keyNotes.1`: trimmed
- `keyNotes.2`: trimmed
- `keyNotes.3`: was "Overbid earns no interest — bid only up to tax amount" (advice removed). pass 2: county part rests on sold quote
- `beginnerTip.1`: removed county names and "zero auction competition"
- `risks.1`: removed figures and floor
- `risks.2.1`: trimmed
- `risks.2.2`: was "to match winning bid"
- `risks.3`: removed "avoid overbidding"
- `risks.4`: removed: no official source (county example, vendor, HOA/IRS/title opinion)
- `risks.5`: removed: no official source (county example, vendor, HOA/IRS/title opinion)
- `risks.6`: trimmed
- `ddExtra.1`: trimmed
- `ddExtra.2`: removed: no official source (county example, vendor, HOA/IRS/title opinion)
- `ddExtra.3`: removed: no official source (county example, vendor, HOA/IRS/title opinion)
- `ddExtra.4`: removed: no official source (county example, vendor, HOA/IRS/title opinion)
- `signup.platform`: removed RealAuction
- `signup.steps.1`: removed colorado.gov and Google advice
- `signup.steps.2`: removed vendor names
- `signup.steps.3.1`: removed "ACH or wire ... typically 2 weeks before November"
- `signup.steps.3.2`: removed: no official source (county example, vendor, HOA/IRS/title opinion)
- `signup.steps.4`: removed capitals
- `signup.deposit.1`: was "Varies by county."
- `signup.deposit.2`: removed: no official source (county example, vendor, HOA/IRS/title opinion)
- `signup.deposit.3`: removed: no official source (county example, vendor, HOA/IRS/title opinion)
- `signup.deposit.4`: removed: no official source (county example, vendor, HOA/IRS/title opinion)
- `otc.available`: was "Available"
- `otc.note.1`: was "Unsold liens available for direct purchase from county treasurers after annual sale."
- `platforms.1`: removed: RealAuction.com is a vendor, not in statute
- `platforms.2`: was "County treasurer portals"
- `surplus.1`: was "HB 24-1057 requiring surplus proceeds be returned"; the overbid rule is in HB 24-1056

## Conflicts (flagged)

None.
