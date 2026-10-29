# Texas (TX) law audit

Checked 2026-10-29. Status: done. Ledger: `cloudflare/data/law/tx.json`.

Official code access: Texas Tax Code chapter 34 fetched as the official HTML file from tcss.legis.texas.gov, the file server behind statutes.capitol.texas.gov (Texas Legislative Council). The statutes.capitol.texas.gov page itself is a JavaScript app; its direct /Docs/ URL returns only the app shell (saved as tax-code-ch34, not cited).

## Finding

The first audit run could not connect to the Texas statutes site. This run found that statutes.capitol.texas.gov is now a
JavaScript app whose /Docs/ URLs return only the app shell, and that the same official files are served from the
Texas Legislative Council file server tcss.legis.texas.gov (the address configured in the app's own code). Tax Code
chapter 34 was downloaded from there.

Texas sells by deed subject to redemption (§ 34.01(n)). Redemption: 2 years for homestead, agricultural land and mineral
interests, with a premium of 25% (year 1) or 50% (year 2) of the bid plus recording fee, taxes and costs paid
(§ 34.21(a)); 180 days for all other property, premium capped at 25% (§ 34.21(e)). The site said "commercial" where the
statute says all other property, and called the premium a penalty on the auction price. In-person sales run 10 a.m. to
4 p.m. on the first Tuesday (first Wednesday when that is January 1 or July 4); online sales need commissioners court
approval and close at 4 p.m. that day (§ 34.01(a-1), (r-1), (r-2)). The site's claim that struck-off (taxing-unit)
property "often skips redemption" is contradicted by § 34.05(a): resales stay subject to redemption. Vendor names
(RealAuction, GovEase), txdmv.gov, deposit habits, the IRS-lien note and "highest in the US" were removed.
Excess proceeds: claims by petition before the second anniversary of the sale (§ 34.04(a)).

## 2023 to 2026 enacted-law search

Searched the amendment history notes in the official chapter 34 file (tcss.legis.texas.gov, current through the
89th Legislature, 2nd called session). Acts found (current text already includes them; claims are based on it):
- Acts 2023, 88th Leg., R.S., Ch. 9 (S.B. 59), eff. September 1, 2023: amended § 34.01.
- Acts 2023, 88th Leg., R.S., Ch. 962 (S.B. 2091), eff. September 1, 2023: added § 34.0101 (sale to abutting owner), amended § 34.02.
- Acts 2023, 88th Leg., R.S., Ch. 268 (S.B. 62), eff. September 1, 2023: amended § 34.015 (bidder eligibility).
- Acts 2023, 88th Leg., R.S., Ch. 760 (H.B. 4250), eff. September 1, 2023: amended § 34.03 (excess proceeds).
- Acts 2025, 89th Leg., R.S., Ch. 526 (H.B. 3680), eff. September 1, 2025: amended § 34.01.
- Acts 2025, 89th Leg., R.S., Ch. 986 (S.B. 766), eff. September 1, 2025: amended § 34.06.
- Acts 2025, 89th Leg., 2nd C.S., Ch. 7 (H.B. 16), eff. December 4, 2025: amended § 34.03 (shown in keyNotes.5).
The enacted bill texts on Texas Legislature Online were not fetched this run; § 34.21 was last amended in 2019
(S.B. 1642). No 2026 acts appear (Texas has no regular session in 2026).

## Unreachable sources

None cited. statutes.capitol.texas.gov/Docs/TX/htm/TX.34.htm returns only the JavaScript app shell (saved as
tax-code-ch34 for the record, not cited).

## Watch

- Chapter 33 (delinquent tax suits) and chapter 32 (tax liens, transfers) were not audited; the site makes no claims from them.
- Post-Tyler: § 34.04 already pays remaining excess proceeds to former owners who claim within two years; watch for changes.

## Claims

| id | shown | statute | link | status |
|---|---|---|---|---|
| type | Redeemable deed | Tex. Tax Code § 34.01(n) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | supported |
| rate | Maximum premium set by law: 25% yr1 / 50% yr2 (homestead/ag/mineral); 25% (other property) | Tex. Tax Code § 34.21(a) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| rateNote | Premium is figured on the bid plus the deed recording fee and taxes, penalties, interest and costs the purchaser paid | Tex. Tax Code § 34.21(a) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| redemption | 2 years (homestead, agricultural land, mineral interests) / 180 days (other property), from deed recording | Tex. Tax Code § 34.21(a) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| bidMethod | Auction; minimum bid is the lesser of the amount due or the adjudged value | Tex. Tax Code § 34.01(j) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| statute | TX Tax Code §34.21 | Tex. Tax Code § 34.21 | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | supported |
| auctionPlatform | County courthouse, or online where the commissioners court authorizes it | Tex. Tax Code § 34.01(r) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| auctionTiming | First Tuesday of the month, 10 a.m. to 4 p.m. (first Wednesday when that Tuesday is January 1 or July 4) | Tex. Tax Code § 34.01(r-1) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| summary.1 | Texas is a redeemable deed state. | Tex. Tax Code § 34.01(n) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | supported |
| summary.2 | Sales are held on the first Tuesday of the month. | Tex. Tax Code § 34.01(r-1) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| summary.3 | The buyer gets a deed at the sale, subject to the owner's right of redemption. | Tex. Tax Code § 34.01(n) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| summary.4 | Redemption premium: 25% in year 1, 50% in year 2, figured on the bid plus recording fee, taxes and costs paid, not just back taxes. | Tex. Tax Code § 34.21(a) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| summary.5 | Other property (not homestead, agricultural land or mineral interests): 180-day redemption. | Tex. Tax Code § 34.21(e)(1) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| summary.6 | Homestead, agricultural land and mineral interests: 2 years. | Tex. Tax Code § 34.21(a) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| summary.7 | Property bid off to a taxing unit and later resold is still subject to the former owner's right of redemption. | Tex. Tax Code § 34.05(a) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| summary.8 | Statute: TX Tax Code §34.21. | Tex. Tax Code § 34.21 | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | supported |
| typeWhy.1 | Texas is a redeemable deed state: the deed gives the buyer the owner's interest, including use and possession, subject only to the owner's right of redemption. | Tex. Tax Code § 34.01(n) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| typeWhy.2 | TX Tax Code §34.21. | Tex. Tax Code § 34.21 | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | supported |
| rateWhy.1 | Texas sets a redemption premium of 25% in year 1 and 50% in year 2 of the aggregate total paid, not an annual interest rate. | Tex. Tax Code § 34.21(a) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| rateWhy.2 | TX Tax Code §34.21(a). | Tex. Tax Code § 34.21(a) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | supported |
| keyNotes.1 | Homestead, agricultural and mineral property: 25% premium in year 1, 50% in year 2 | Tex. Tax Code § 34.21(a) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| keyNotes.2 | Other property: 180-day redemption, premium capped at 25% | Tex. Tax Code § 34.21(e)(2) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| keyNotes.3 | During redemption the former owner has no right to use or possess the property or collect rents | Tex. Tax Code § 34.21(h) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| keyNotes.4 | Online sales may start at any time and must close by 4 p.m. on the first Tuesday of the month | Tex. Tax Code § 34.01(r-2) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| keyNotes.5 | Excess-proceeds rules (§ 34.03) were last amended by H.B. 16, effective December 4, 2025 | Tex. Tax Code § 34.03 (history note) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| beginnerTip.1 | Property not sold to a bidder may be bid off to a taxing unit, which may resell it at any time by public or private sale. | Tex. Tax Code § 34.05(a) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| beginnerTip.2 | Ask the taxing unit that holds the property how it resells it. | Tex. Tax Code § 34.05(a) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| beginnerTip.3 | (removed) | Tex. Tax Code § 34.05(a) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| risks.1 | If the owner redeems, they repay your bid, recording fee and taxes and costs you paid, plus the premium on that total | Tex. Tax Code § 34.21(a) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| risks.2 | Homestead and agricultural properties: 2-year redemption window | Tex. Tax Code § 34.21(a) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | supported |
| risks.3 | Verify property type before bidding: homestead, agricultural and mineral property has a longer redemption period than other property | Tex. Tax Code § 34.21(e) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| ddExtra.1 | Verify property type (homestead, agricultural land, mineral interest or other) before bidding; it sets the redemption period | Tex. Tax Code § 34.21(e) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| ddExtra.2 | Get a written statement from the county assessor-collector that you owe no delinquent taxes; the officer cannot deliver a deed without it | Tex. Tax Code § 34.015(b) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| ddExtra.3 | (removed) | Tex. Tax Code § 34.01(n) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| signup.platform | County officer conducting the sale; online bidding only where the commissioners court authorizes it | Tex. Tax Code § 34.01(a-1) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| signup.steps.1 | Find your target county's notice of sale; it states the date, time and location of the sale | Tex. Tax Code § 34.01(e)(2) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| signup.steps.2 | Check whether the county holds its sale online | Tex. Tax Code § 34.01(a-1) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| signup.steps.3 | If the county requires it, register as a bidder with the county assessor-collector before the sale begins | Tex. Tax Code § 34.011(b) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| signup.steps.4 | In-person sales run 10 a.m. to 4 p.m. on the first Tuesday of the month | Tex. Tax Code § 34.01(r-1) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| signup.steps.5 | For resale property: contact the taxing unit that holds it | Tex. Tax Code § 34.05(a) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| signup.deposit.1 | Ask the officer conducting the sale about payment terms. | Tex. Tax Code § 34.01(a) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| signup.deposit.2 | Confirm with the county. | Tex. Tax Code § 34.01(a) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| otc.available | Yes: resale by the taxing unit | Tex. Tax Code § 34.05(a) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| otc.note.1 | Property bid off to a taxing unit may be resold by that unit by public or private sale. | Tex. Tax Code § 34.05(a) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| otc.note.2 | Resales remain subject to the former owner's right of redemption. | Tex. Tax Code § 34.05(a) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| otc.note.3 | Ask the taxing unit that holds the property about resale. | Tex. Tax Code § 34.05(a) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| platforms.1 | (removed) | Tex. Tax Code § 34.01(a-1) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| platforms.2 | (removed) | Tex. Tax Code § 34.01(a-1) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| platforms.3 | County officer charged with the sale | Tex. Tax Code § 34.01(a) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| surplus.1 | Anyone with a claim to excess proceeds may petition the court that ordered the sale before the second anniversary of the sale (Tax Code § 34.04). | Tex. Tax Code § 34.04(a) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| es.rate | Prima máxima fijada por la ley: 25% año 1 / 50% año 2 (vivienda/agrícola/mineral); 25% (otra propiedad) | Tex. Tax Code § 34.21(a) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| es.redemption | 2 años (vivienda, tierra agrícola, intereses minerales) / 180 días (otra propiedad), desde el registro de la escritura | Tex. Tax Code § 34.21(a) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| es.summary.1 | Texas es un estado de escritura redimible. | Tex. Tax Code § 34.01(n) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | supported |
| es.summary.2 | Las ventas se realizan el primer martes del mes. | Tex. Tax Code § 34.01(r-1) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| es.summary.3 | El comprador recibe una escritura en la venta, sujeta al derecho de redención del propietario. | Tex. Tax Code § 34.01(n) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| es.summary.4 | Prima de redención: 25% el año 1, 50% el año 2, calculada sobre la puja más la tarifa de registro, los impuestos y los costos pagados, no solo los impuestos atrasados. | Tex. Tax Code § 34.21(a) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| es.summary.5 | Otra propiedad (no vivienda, tierra agrícola ni intereses minerales): redención de 180 días. | Tex. Tax Code § 34.21(e)(1) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| es.summary.6 | Vivienda, tierra agrícola e intereses minerales: 2 años. | Tex. Tax Code § 34.21(a) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| es.summary.7 | La propiedad adjudicada a una entidad fiscal y luego revendida sigue sujeta al derecho de redención del antiguo propietario. | Tex. Tax Code § 34.05(a) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| es.summary.8 | Estatuto: TX Tax Code §34.21. | Tex. Tax Code § 34.21 | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | supported |
| es.typeWhy.1 | Texas es un estado de escritura redimible: la escritura da al comprador el interés del propietario, incluido el uso y la posesión, sujeto solo al derecho de redención del propietario (TX Tax Code §34.21). | Tex. Tax Code § 34.01(n) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| es.rateWhy.1 | Texas fija una prima de redención del 25% el año 1 y del 50% el año 2 sobre el total pagado, no una tasa de interés anual. | Tex. Tax Code § 34.21(a) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| es.rateWhy.2 | TX Tax Code §34.21(a). | Tex. Tax Code § 34.21(a) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| es.beginnerTip.1 | La propiedad no vendida a un postor puede adjudicarse a una entidad fiscal, que puede revenderla en cualquier momento por venta pública o privada. | Tex. Tax Code § 34.05(a) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| es.beginnerTip.2 | Pregunte a la entidad fiscal que tiene la propiedad cómo la revende. | Tex. Tax Code § 34.05(a) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| es.beginnerTip.3 | (removed) | Tex. Tax Code § 34.05(a) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| es.risks.1 | Si el propietario redime, le devuelve su puja, la tarifa de registro y los impuestos y costos que usted pagó, más la prima sobre ese total | Tex. Tax Code § 34.21(a) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| es.risks.2 | Las propiedades de vivienda y agrícolas tienen ventana de redención de 2 años | Tex. Tax Code § 34.21(a) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | supported |
| es.risks.3 | Verifique el tipo de propiedad antes de pujar: la propiedad de vivienda, agrícola y mineral tiene un período de redención más largo que otra propiedad | Tex. Tax Code § 34.21(e) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| es.ddExtra.1 | Verifique el tipo de propiedad (vivienda, tierra agrícola, interés mineral u otra) antes de pujar; determina el período de redención | Tex. Tax Code § 34.21(e) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| es.ddExtra.2 | Obtenga una declaración escrita del recaudador-evaluador del condado de que no debe impuestos morosos; el oficial no puede entregar la escritura sin ella | Tex. Tax Code § 34.015(b) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| es.ddExtra.3 | (removed) | Tex. Tax Code § 34.01(n) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| es.signup.platform | Oficial del condado que realiza la venta; pujas en línea solo donde la corte de comisionados lo autorice | Tex. Tax Code § 34.01(a-1) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| es.signup.steps.1 | Encuentre el aviso de venta de su condado objetivo; indica la fecha, hora y lugar de la venta | Tex. Tax Code § 34.01(e)(2) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| es.signup.steps.2 | Verifique si el condado realiza su venta en línea | Tex. Tax Code § 34.01(a-1) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| es.signup.steps.3 | Si el condado lo exige, regístrese como postor con el recaudador-evaluador del condado antes de que empiece la venta | Tex. Tax Code § 34.011(b) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| es.signup.steps.4 | Las ventas presenciales son de 10 a.m. a 4 p.m. el primer martes del mes | Tex. Tax Code § 34.01(r-1) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| es.signup.steps.5 | Para propiedades en reventa: contacte a la entidad fiscal que las tiene | Tex. Tax Code § 34.05(a) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| es.signup.deposit.1 | Pregunte al oficial que realiza la venta por las condiciones de pago. | Tex. Tax Code § 34.01(a) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| es.signup.deposit.2 | Confirme con el condado. | Tex. Tax Code § 34.01(a) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| es.otc.note.1 | La propiedad adjudicada a una entidad fiscal puede ser revendida por esa entidad por venta pública o privada. | Tex. Tax Code § 34.05(a) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| es.otc.note.2 | Las reventas siguen sujetas al derecho de redención del antiguo propietario. | Tex. Tax Code § 34.05(a) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |
| es.otc.note.3 | Pregunte a la entidad fiscal que tiene la propiedad sobre la reventa. | Tex. Tax Code § 34.05(a) | [link](https://tcss.legis.texas.gov/resources/TX/htm/TX.34.htm) | corrected |

## Corrections (before → after)

- `rate`: “25% yr1 / 50% yr2 (penalty on redemption)” → “Maximum premium set by law: 25% yr1 / 50% yr2 (homestead/ag/mineral); 25% (other property)”
- `rateNote`: “Penalty on purchase price. Homestead/ag = 2-year window. Commercial = 180 days.” → “Premium is figured on the bid plus the deed recording fee and taxes, penalties, interest and costs the purchaser paid”
- `redemption`: “180 days (non-homestead/non-ag) / 2 years (homestead/ag)” → “2 years (homestead, agricultural land, mineral interests) / 180 days (other property), from deed recording”
- `bidMethod`: “Premium bid (highest dollar)” → “Auction; minimum bid is the lesser of the amount due or the adjudged value”
- `auctionPlatform`: “County courthouse steps — in-person (254 counties)” → “County courthouse, or online where the commissioners court authorizes it”
- `auctionTiming`: “Monthly (first Tuesday of every month, all 254 counties)” → “First Tuesday of the month, 10 a.m. to 4 p.m. (first Wednesday when that Tuesday is January 1 or July 4)”
- `summary.2`: “Monthly auctions on the first Tuesday statewide.” → “Sales are held on the first Tuesday of the month.”
- `summary.3`: “Investor gets deed at auction but owner can redeem.” → “The buyer gets a deed at the sale, subject to the owner's right of redemption.”
- `summary.4`: “Redemption penalty: 25% year 1, 50% year 2, calculated on full auction price — not just back taxes.” → “Redemption premium: 25% in year 1, 50% in year 2, figured on the bid plus recording fee, taxes and costs paid, not just back taxes.”
- `summary.5`: “Commercial: 180-day redemption.” → “Other property (not homestead, agricultural land or mineral interests): 180-day redemption.”
- `summary.6`: “Homestead/agricultural: 2 years.” → “Homestead, agricultural land and mineral interests: 2 years.”
- `summary.7`: “Struck-off properties often skip redemption entirely.” → “Property bid off to a taxing unit and later resold is still subject to the former owner's right of redemption.”
- `typeWhy.1`: “Texas is a redeemable deed state — the investor receives the property deed at auction, but the original owner retains a statutory right of redemption (180 days for non-homestead, 2 years for homestead/agricultural).” → “Texas is a redeemable deed state: the deed gives the buyer the owner's interest, including use and possession, subject only to the owner's right of redemption.”
- `rateWhy.1`: “Texas imposes a 25% penalty in year 1 and 50% in year 2 on the full auction purchase price — these are statutory penalties, not annual interest rates.” → “Texas sets a redemption premium of 25% in year 1 and 50% in year 2 of the aggregate total paid, not an annual interest rate.”
- `keyNotes.1`: “Highest redeemable penalty in the US — 25% year 1 on homestead” → “Homestead, agricultural and mineral property: 25% premium in year 1, 50% in year 2”
- `keyNotes.2`: “Commercial properties: 180-day redemption only — faster resolution” → “Other property: 180-day redemption, premium capped at 25%”
- `keyNotes.3`: “Investor CAN take possession and collect rent during redemption period” → “During redemption the former owner has no right to use or possess the property or collect rents”
- `keyNotes.4`: “254 counties all auction same day — first Tuesday monthly” → “Online sales may start at any time and must close by 4 p.m. on the first Tuesday of the month”
- `keyNotes.5`: “Acts 2025, 89th Legislature update confirmed December 4, 2025” → “Excess-proceeds rules (§ 34.03) were last amended by H.B. 16, effective December 4, 2025”
- `beginnerTip.1`: “Start with struck-off properties — these are properties that didn't sell at auction and are available directly from the county with no redemption period in many cases.” → “Property not sold to a bidder may be bid off to a taxing unit, which may resell it at any time by public or private sale.”
- `beginnerTip.2`: “Contact the county tax assessor-collector and ask for the struck-off list.” → “Ask the taxing unit that holds the property how it resells it.”
- `beginnerTip.3`: “This is the best beginner entry into Texas.” → “(removed)”
- `risks.1`: “Redemption penalty calculated on FULL auction price — overbidding is extremely expensive if redeemed” → “If the owner redeems, they repay your bid, recording fee and taxes and costs you paid, plus the premium on that total”
- `risks.3`: “Verify property type before bidding — homestead vs. commercial dramatically changes the redemption window” → “Verify property type before bidding: homestead, agricultural and mineral property has a longer redemption period than other property”
- `ddExtra.1`: “Verify property type (homestead, commercial, agricultural) before bidding — determines redemption window” → “Verify property type (homestead, agricultural land, mineral interest or other) before bidding; it sets the redemption period”
- `ddExtra.2`: “Contact county tax assessor-collector for struck-off list before attending auction” → “Get a written statement from the county assessor-collector that you owe no delinquent taxes; the officer cannot deliver a deed without it”
- `ddExtra.3`: “Check for active IRS liens — these survive Texas tax deed sales” → “(removed)”
- `signup.platform`: “RealAuction.com or GovEase.com (varies by county) + county courthouse” → “County officer conducting the sale; online bidding only where the commissioners court authorizes it”
- `signup.steps.1`: “Find your target county's auction info — txdmv.gov for county directory” → “Find your target county's notice of sale; it states the date, time and location of the sale”
- `signup.steps.2`: “Check if the county uses RealAuction.com or GovEase.com for online bidding” → “Check whether the county holds its sale online”
- `signup.steps.3`: “Register on the platform and verify your identity (government ID + entity docs if LLC)” → “If the county requires it, register as a bidder with the county assessor-collector before the sale begins”
- `signup.steps.4`: “Fund your account before the first Tuesday auction” → “In-person sales run 10 a.m. to 4 p.m. on the first Tuesday of the month”
- `signup.steps.5`: “For struck-off properties: contact the county tax assessor-collector directly for OTC list” → “For resale property: contact the taxing unit that holds it”
- `signup.deposit.1`: “Varies by county.” → “Ask the officer conducting the sale about payment terms.”
- `signup.deposit.2`: “Most require wire or cashier's check.” → “Confirm with the county.”
- `otc.available`: “Available” → “Yes: resale by the taxing unit”
- `otc.note.1`: “Struck-off properties available directly from county tax assessor-collector.” → “Property bid off to a taxing unit may be resold by that unit by public or private sale.”
- `otc.note.2`: “Often no redemption period.” → “Resales remain subject to the former owner's right of redemption.”
- `otc.note.3`: “Call the county and ask for the struck-off inventory list.” → “Ask the taxing unit that holds the property about resale.”
- `platforms.1`: “RealAuction.com” → “(removed)”
- `platforms.2`: “GovEase.com” → “(removed)”
- `platforms.3`: “County tax assessor-collector offices” → “County officer charged with the sale”
- `surplus.1`: “Texas revised its Tax Code to require surplus return after tax foreclosure sales.” → “Anyone with a claim to excess proceeds may petition the court that ordered the sale before the second anniversary of the sale (Tax Code § 34.04).”

## Pass 2 trims, removals and notes

- `rate`: was "25% yr1 / 50% yr2 (penalty on redemption)"; statute calls it a redemption premium. pass 2: the 25% cap for other property rests on § 34.21(e)(2) (summary.5 note)
- `rateNote`: was "Penalty on purchase price. Homestead/ag = 2-year window. Commercial = 180 days."; windows moved to redemption field
- `redemption`: added mineral interests and the start point. pass 2: 180-day part rests on § 34.21(e)(1) (summary.5)
- `bidMethod`: was "Premium bid (highest dollar)"
- `auctionPlatform`: was "County courthouse steps — in-person (254 counties)". pass 2: online part rests on § 34.01(a-1) (signup.platform); dropped county count
- `auctionTiming`: was "Monthly (first Tuesday of every month, all 254 counties)"
- `summary.2`: pass 2: dropped "statewide" and "auctions"
- `summary.3`: was "Investor gets deed at auction but owner can redeem."
- `summary.4`: was "calculated on full auction price"; statute adds recording fee, taxes and costs to the bid. pass 2: what is added rests on the rateNote quote
- `summary.5`: was "Commercial: 180-day redemption." Statute covers all property other than homestead, agricultural and mineral. pass 2: scope rests on § 34.21(e) (risks.3)
- `summary.6`: added mineral interests
- `summary.7`: was "Struck-off properties often skip redemption entirely." (contradicted by § 34.05(a))
- `typeWhy.1`: periods removed here (shown in redemption field); added use and possession from § 34.01(n)
- `rateWhy.1`: was "penalty ... on the full auction purchase price"
- `keyNotes.1`: removed "Highest redeemable penalty in the US" (comparison, no official source). pass 2: scope rests on hs quote
- `keyNotes.2`: was "Commercial properties: 180-day redemption only — faster resolution"; removed opinion. pass 2: 180 days rests on § 34.21(e)(1)
- `keyNotes.3`: was "Investor CAN take possession and collect rent during redemption period"; restated as the statute says it
- `keyNotes.4`: was "254 counties all auction same day — first Tuesday monthly"
- `keyNotes.5`: was "Acts 2025, 89th Legislature update confirmed December 4, 2025"
- `beginnerTip.1`: removed "no redemption period in many cases" (contradicted by § 34.05(a)). pass 2: "bid off" step rests on § 34.01(j)
- `beginnerTip.2`: was "Contact the county tax assessor-collector and ask for the struck-off list."
- `beginnerTip.3`: removed: no official source (opinion, comparison, vendor or county practice claim)
- `risks.1`: was "Redemption penalty calculated on FULL auction price — overbidding is extremely expensive if redeemed"; removed opinion
- `risks.3`: removed "dramatically"
- `ddExtra.1`: added mineral interest; "commercial" replaced by "other"
- `ddExtra.2`: was "Contact county tax assessor-collector for struck-off list before attending auction"
- `ddExtra.3`: removed: IRS lien survival is federal law, not in the Texas Tax Code text fetched
- `signup.platform`: removed RealAuction.com and GovEase.com (vendors, not in statute)
- `signup.steps.1`: removed txdmv.gov (motor vehicles agency, not a tax sale directory)
- `signup.steps.2`: removed vendor names
- `signup.steps.3`: was "Register on the platform and verify your identity (government ID + entity docs if LLC)"
- `signup.steps.4`: was "Fund your account before the first Tuesday auction"
- `signup.steps.5`: was "contact the county tax assessor-collector directly for OTC list"
- `signup.deposit.1`: was "Varies by county."
- `signup.deposit.2`: removed "Most require wire or cashier's check." (no official source)
- `otc.available`: was "Available"
- `otc.note.1`: was "Struck-off properties available directly from county tax assessor-collector."
- `otc.note.2`: was "Often no redemption period." (contradicted by § 34.05(a))
- `otc.note.3`: was "Call the county and ask for the struck-off inventory list."
- `platforms.1`: removed: RealAuction.com is a vendor, not in statute
- `platforms.2`: removed: GovEase.com is a vendor, not in statute
- `platforms.3`: was "County tax assessor-collector offices"
- `surplus.1`: was "Texas revised its Tax Code to require surplus return after tax foreclosure sales."

## Conflicts (flagged)

None.
