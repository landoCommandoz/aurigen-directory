# Florida (FL) law audit

Checked 2026-11-01. Status: done. Ledger: `cloudflare/data/law/fl.json`.

Official code access: Florida Statutes chapter 197 and section 95.192, 2026 edition (95.192 in the 2025 edition, the section is not cited as changed), from flsenate.gov (The Florida Senate, which publishes the statutes online with the House and the Legislature). The leg.state.fl.us statute pages returned only a JavaScript shell (1391 characters), so flsenate.gov was used.

Finding: the site called Florida a hybrid state with two parallel tracks, an "18% reverse bid", RNG ties, a 5% "guarantee", year-round LienHub over-the-counter sales, vendor names (LienHub, RealAuction), a federal lien survival period, beginner tips and county advice. The statutes (chapter 197) set a maximum certificate rate of 18% per year, lowest-rate bidding in one-quarter-percent steps, tie method chosen by the tax collector, a 5% mandatory minimum on redemption (except zero percent bids), county-held certificates bought from the tax collector, deed application 2 years after April 1 of the issuance year, deed sale by the clerk with a 5%/$200 nonrefundable deposit, and surplus held by the clerk with a 120 day claim period. The old "redemption: 2 years from April 1" was wrong: that date is when the holder may apply for a deed; redemption runs until a deed is issued or full payment for it is made (§197.472(1)).

Lando decision A applied: sale dates, platforms and deposits not set by statute now say "Confirm with the county". Removed with no official source: "largest tax lien state", Miami-Dade/Broward advice, federal lien 120 days, title insurability, beginner tips, small-county advice.

Source access: leg.state.fl.us statute pages return only a JavaScript shell (1391 characters, logged in attempts/fl.jsonl and not cited). flsenate.gov (the Florida Senate's statute pages, Legislature-run, on the official domain list) gave the full text. Cited from the 2026 edition; 2023 and 2026 editions of 197.502 and 197.582 were compared too.

## 2023 to 2026 law search log

- Searched: flsenate.gov section pages for 197.172, 197.402, 197.432, 197.4725, 197.472, 197.502, 197.542, 197.552, 197.582 (2026 edition) and 95.192 (2025 edition). Compared the 2025 and 2026 editions of all nine chapter 197 sections: no text change affecting any quote; only 197.582 differs (cross-reference "s. 717.117(6)" became "s. 717.117", and "within 120 days of" became "after"). History lines show the latest acts: ch. 2024-91 s. 3 (197.502), ch. 2024-140 s. 61 and ch. 2026-174 s. 92 (197.582, conforming changes). Compared 2023 and 2026 text of 197.502 and 197.582 (197.502 differs only in subsection (2): what happens to a canceled tax deed application, per ch. 2024-91, not cited by any claim; 197.582 differs in formatting and the 2024 and 2026 conforming changes).
- Not run: the legislature's bill and session-law search for 2023 to 2026, so the content of ch. 2024-91, 2024-140 and 2026-174 was not read as acts. Gap FL-1.

## Unreachable

None. leg.state.fl.us returned a JavaScript shell; flsenate.gov worked.

## Watch

None found.

## Claims

| id | shown | statute | link | status |
|---|---|---|---|---|
| type | Tax certificate sale, then tax deed sale | Fla. Stat. § 197.502(1) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.502) | corrected |
| rate | Maximum rate set by law: 18% per year (§197.172(2)) | Fla. Stat. § 197.172(2) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.172) | corrected |
| rateNote | The lowest interest rate bid wins (§197.432(6)) | Fla. Stat. § 197.432(6) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.432) | corrected |
| redemption | Until a tax deed is issued, unless full payment for the deed has been made to the clerk (§197.472(1)) | Fla. Stat. § 197.472(1) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.472) | corrected |
| bidMethod | The certificate goes to the bidder who demands the lowest interest rate (§197.432(6)) | Fla. Stat. § 197.432(6) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.432) | corrected |
| statute | FL Stat §197.172 | Fla. Stat. § 197.172(2) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.172) | supported |
| auctionPlatform | Tax collector sells certificates, by electronic means if the tax collector chooses (§197.432(1)). Platform: Confirm with the county. | Fla. Stat. § 197.432(1) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.432) | corrected |
| auctionTiming | Certificate sale on or before June 1, or the 60th day after delinquency if later (§197.402(3)). Tax deed sale dates: Confirm with the county. | Fla. Stat. § 197.402(3) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.402) | corrected |
| summary.1 | After 2 years have elapsed since April 1 of the year the certificate was issued, the holder may apply for a tax deed (§197.502(1)). | Fla. Stat. § 197.502(1) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.502) | corrected |
| summary.2 | At the certificate sale, each certificate goes to the bidder who demands the lowest interest rate, not above the maximum rate allowed (§197.432(6)). | Fla. Stat. § 197.432(6) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.432) | corrected |
| summary.3 | If bidders offer the same lowest rate, the tax collector decides how to pick the bidder; the bid received first and a random-number generator are accepted methods (§197.432(6)). | Fla. Stat. § 197.432(6) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.432) | corrected |
| summary.4 | A certificate that is not purchased is struck to the county at the maximum rate allowed (§197.432(6)). | Fla. Stat. § 197.432(6) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.432) | corrected |
| summary.5 | On redemption, the person redeeming pays the interest rate due or the 5 percent mandatory minimum interest, whichever is greater, except on certificates with a zero percent bid (§197.472(2)). | Fla. Stat. § 197.472(2) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.472) | corrected |
| summary.6 | The holder who applies for a tax deed pays the tax collector all amounts required for redemption or purchase of all other outstanding certificates on the property (§197.502(2)). | Fla. Stat. § 197.502(2) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.502) | corrected |
| summary.7 | The tax deed property is sold at public auction by the clerk of the circuit court (§197.542(1)). | Fla. Stat. § 197.542(1) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.542) | corrected |
| summary.8 | Interest on a county-held certificate that is bought is calculated at 1.5 percent per month, or a fraction thereof, to the date of purchase (§197.4725(2)). | Fla. Stat. § 197.4725(2) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.4725) | corrected |
| summary.9 | Any person may buy a county-held tax certificate after it is issued and before a tax deed application is made (§197.4725(1)). | Fla. Stat. § 197.4725(1) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.4725) | corrected |
| summary.10 | Statutes: FL Stat §197.172 (interest rate), §197.432 (certificate sale), §197.4725 (county-held certificates), §197.472 (redemption), §197.502 (tax deed application), §197.552 (tax deeds). | Fla. Stat. § 197.4725(1) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.4725) | corrected |
| typeWhy.1 | After 2 years have elapsed since April 1 of the year the certificate was issued, the holder may apply for a tax deed (§197.502(1)). | Fla. Stat. § 197.502(1) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.502) | corrected |
| typeWhy.2 | FL Stat §197.432, §197.502. | Fla. Stat. § 197.502(1) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.502) | supported |
| rateWhy.1 | The maximum interest rate on a tax certificate is 18 percent per year (§197.172(2)). | Fla. Stat. § 197.172(2) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.172) | corrected |
| rateWhy.2 | On redemption, the person redeeming pays the interest rate due or the 5 percent mandatory minimum interest, whichever is greater, except on certificates with a zero percent bid (§197.472(2)). | Fla. Stat. § 197.472(2) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.472) | corrected |
| rateWhy.3 | A tax certificate may not bear interest, and the §197.472(2) mandatory minimum interest may not be levied, during the 60 days after delinquency, except the 3 percent mandatory interest under §197.172(1). | Fla. Stat. § 197.172(2) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.172) | corrected |
| rateWhy.4 | FL Stat §197.172, §197.472. | Fla. Stat. § 197.172(2) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.172) | supported |
| keyNotes.1 | (removed) | Fla. Stat. § 197.172(2) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.172) | corrected |
| keyNotes.2 | The certificate goes to the bidder who demands the lowest interest rate (§197.432(6)). | Fla. Stat. § 197.432(6) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.432) | corrected |
| keyNotes.3 | A certificate may be redeemed until a tax deed is issued, unless full payment for the deed has been made to the clerk (§197.472(1)). | Fla. Stat. § 197.472(1) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.472) | corrected |
| beginnerTip.1 | (removed) | Fla. Stat. § 197.4725(1) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.4725) | corrected |
| beginnerTip.2 | (removed) | Fla. Stat. § 197.4725(1) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.4725) | corrected |
| beginnerTip.3 | (removed) | Fla. Stat. § 197.4725(1) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.4725) | corrected |
| risks.1 | (removed) | Fla. Stat. § 197.432(6) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.432) | corrected |
| risks.2 | Once a tax deed has been issued for 4 years, no action may be brought by the former owner or a claimant under the former owner (§95.192(1)). | Fla. Stat. § 95.192(1) | [link](https://www.flsenate.gov/Laws/Statutes/2025/95.192) | corrected |
| risks.3 | A lien of record held by a municipal or county government, special district or community development district that is not satisfied from the sale proceeds survives the tax deed (§197.552). | Fla. Stat. § 197.552 | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.552) | corrected |
| risks.4 | (removed) | Fla. Stat. § 197.552 | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.552) | corrected |
| risks.5.1 | On redemption, the person redeeming pays the interest rate due or the 5 percent mandatory minimum interest, whichever is greater, except on certificates with a zero percent bid (§197.472(2)). | Fla. Stat. § 197.472(2) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.472) | corrected |
| risks.5.2 | A tax certificate may not bear interest, and the §197.472(2) mandatory minimum interest may not be levied, during the 60 days after delinquency, except the 3 percent mandatory interest under §197.172(1). | Fla. Stat. § 197.172(2) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.172) | corrected |
| risks.6 | A tax certificate for less than $250 in delinquent taxes on homestead property is not sold at auction; the tax collector issues it to the county at the maximum rate allowed (§197.432(4)). | Fla. Stat. § 197.432(4) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.432) | corrected |
| ddExtra.1 | Ask the tax collector which county-held certificates can be bought (§197.4725). | Fla. Stat. § 197.4725(1) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.4725) | corrected |
| ddExtra.2 | Check for liens of record held by the city, the county or a special district; they can survive a tax deed (§197.552). | Fla. Stat. § 197.552 | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.552) | corrected |
| ddExtra.3 | Confirm that 2 years have elapsed since April 1 of the year of issuance before applying for a tax deed (§197.502(1)). | Fla. Stat. § 197.502(1) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.502) | corrected |
| ddExtra.4 | The tax collector is entitled to a 5 percent commission on delinquent taxes and interest when a certificate is sold, and it is included in the certificate's face value (§197.432(12)). | Fla. Stat. § 197.432(12) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.432) | corrected |
| signup.platform | Tax collector (certificate sale). Online platform and tax deed sale details: Confirm with the county. | Fla. Stat. § 197.432(1) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.432) | corrected |
| signup.steps.1 | Contact the county tax collector; the sale starts on the day and time in the sale notice. Confirm with the county. | Fla. Stat. § 197.432(1) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.432) | corrected |
| signup.steps.2 | The tax collector may require a reasonable deposit from anyone who wishes to bid (§197.432(7)). Confirm with the county. | Fla. Stat. § 197.432(7) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.432) | corrected |
| signup.steps.3 | The tax collector advertises the certificate sale once each week for 3 weeks before it (§197.402(3)). | Fla. Stat. § 197.402(3) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.402) | corrected |
| signup.steps.4.1 | Bids are interest rates; the certificate goes to the lowest rate bid, not above the maximum rate allowed (§197.432(6)). | Fla. Stat. § 197.432(6) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.432) | corrected |
| signup.steps.4.2 | The lowest interest rate bid wins (§197.432(6)). | Fla. Stat. § 197.432(6) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.432) | corrected |
| signup.steps.5 | A county-held certificate can be bought from the tax collector after it is issued and before a tax deed application is made (§197.4725(1)). | Fla. Stat. § 197.4725(1) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.4725) | corrected |
| signup.deposit.1 | A reasonable deposit may be required to bid (§197.432(7)). Confirm with the county. | Fla. Stat. § 197.432(7) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.432) | corrected |
| signup.deposit.2 | Tax deed sale: the high bidder posts a nonrefundable deposit of 5 percent of the bid or $200, whichever is greater (§197.542(2)). | Fla. Stat. § 197.542(2) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.542) | corrected |
| otc.available | County-held certificates can be bought (§197.4725) | Fla. Stat. § 197.4725(1) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.4725) | corrected |
| otc.note.1 | Any person may buy a county-held tax certificate after it is issued and before a tax deed application is made (§197.4725(1)). | Fla. Stat. § 197.4725(1) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.4725) | corrected |
| otc.note.2 | Interest on a county-held certificate is calculated at 1.5 percent per month, or a fraction thereof, to the date of purchase (§197.4725(2)). | Fla. Stat. § 197.4725(2) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.4725) | corrected |
| platforms.1 | Tax collector (certificate sales) | Fla. Stat. § 197.432(1) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.432) | corrected |
| platforms.2 | Clerk of the circuit court (tax deed sales) | Fla. Stat. § 197.542(1) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.542) | corrected |
| surplus.1 | After a tax deed sale, any balance of undistributed funds is retained by the clerk for the benefit of persons described in §197.522(1)(a), as their interests may appear (§197.582(2)(a)). | Fla. Stat. § 197.582(2)(a) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.582) | corrected |
| surplus.2 | A person who receives the clerk's notice has 120 days from the date of the notice to file a written claim with the clerk for the surplus (§197.582(3)). | Fla. Stat. § 197.582(3) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.582) | corrected |
| es.rate | Tasa máxima fijada por la ley: 18% anual (§197.172(2)) | Fla. Stat. § 197.172(2) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.172) | corrected |
| es.redemption | Hasta que se emita una escritura fiscal, salvo que se haya pagado íntegramente la escritura al secretario del tribunal (§197.472(1)) | Fla. Stat. § 197.472(1) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.472) | corrected |
| es.summary.1 | Después de transcurridos 2 años desde el 1 de abril del año en que se emitió el certificado, el titular puede solicitar una escritura fiscal (§197.502(1)). | Fla. Stat. § 197.502(1) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.502) | corrected |
| es.summary.2 | En la venta de certificados, cada certificado se adjudica al postor que pide la tasa de interés más baja, sin exceder la tasa máxima permitida (§197.432(6)). | Fla. Stat. § 197.432(6) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.432) | corrected |
| es.summary.3 | La propiedad con escritura fiscal se vende en subasta pública por el secretario del tribunal de circuito (§197.542(1)). | Fla. Stat. § 197.542(1) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.542) | corrected |
| es.summary.4 | Cualquier persona puede comprar un certificado fiscal en poder del condado después de emitido y antes de que se presente una solicitud de escritura fiscal (§197.4725(1)). | Fla. Stat. § 197.4725(1) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.4725) | corrected |
| es.summary.5 | Estatutos: FL Stat §197.172 (tasa de interés), §197.432 (venta de certificados), §197.4725 (certificados en poder del condado), §197.472 (redención), §197.502 (solicitud de escritura fiscal), §197.552 (escrituras fiscales). | Fla. Stat. § 197.4725(1) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.4725) | corrected |
| es.typeWhy.1 | Después de transcurridos 2 años desde el 1 de abril del año en que se emitió el certificado, el titular puede solicitar una escritura fiscal (§197.502(1)). | Fla. Stat. § 197.502(1) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.502) | corrected |
| es.rateWhy.1 | La tasa de interés máxima de un certificado fiscal es 18 por ciento anual (§197.172(2)). | Fla. Stat. § 197.172(2) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.172) | corrected |
| es.rateWhy.2 | En la redención, quien redime paga la tasa de interés adeudada o el interés mínimo obligatorio de 5 por ciento, lo que sea mayor, excepto en certificados con puja de cero por ciento (§197.472(2)). | Fla. Stat. § 197.472(2) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.472) | corrected |
| es.beginnerTip.1 | (removed) | Fla. Stat. § 197.4725(1) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.4725) | corrected |
| es.beginnerTip.2 | (removed) | Fla. Stat. § 197.4725(1) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.4725) | corrected |
| es.beginnerTip.3 | (removed) | Fla. Stat. § 197.4725(1) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.4725) | corrected |
| es.risks.1 | (removed) | Fla. Stat. § 197.432(6) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.432) | corrected |
| es.risks.2 | Una vez que una escritura fiscal ha sido emitida por 4 años, el dueño anterior o quien reclame bajo él no puede iniciar ninguna acción (§95.192(1)). | Fla. Stat. § 95.192(1) | [link](https://www.flsenate.gov/Laws/Statutes/2025/95.192) | corrected |
| es.risks.3 | Un gravamen registrado de un gobierno municipal o del condado, un distrito especial o un distrito de desarrollo comunitario que no se pague con el producto de la venta sobrevive a la escritura fiscal (§197.552). | Fla. Stat. § 197.552 | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.552) | corrected |
| es.risks.4.1 | En la redención, quien redime paga la tasa de interés adeudada o el interés mínimo obligatorio de 5 por ciento, lo que sea mayor, excepto en certificados con puja de cero por ciento (§197.472(2)). | Fla. Stat. § 197.472(2) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.472) | corrected |
| es.risks.4.2 | Un certificado fiscal no puede devengar interés, y no puede cobrarse el interés mínimo obligatorio del §197.472(2), durante los 60 días posteriores a la morosidad, salvo el interés obligatorio de 3 por ciento del §197.172(1). | Fla. Stat. § 197.172(2) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.172) | corrected |
| es.ddExtra.1 | Pregunte al recaudador de impuestos qué certificados en poder del condado se pueden comprar (§197.4725). | Fla. Stat. § 197.4725(1) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.4725) | corrected |
| es.ddExtra.2 | Revise si hay gravámenes registrados de la ciudad, el condado o un distrito especial; pueden sobrevivir a una escritura fiscal (§197.552). | Fla. Stat. § 197.552 | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.552) | corrected |
| es.ddExtra.3 | Confirme que han transcurrido 2 años desde el 1 de abril del año de emisión antes de solicitar una escritura fiscal (§197.502(1)). | Fla. Stat. § 197.502(1) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.502) | corrected |
| es.signup.platform | Recaudador de impuestos (venta de certificados). Plataforma en línea y detalles de la venta de escrituras fiscales: Confirme con el condado. | Fla. Stat. § 197.432(1) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.432) | corrected |
| es.signup.steps.1 | Contacte al recaudador de impuestos del condado; la venta comienza el día y la hora indicados en el aviso de venta. Confirme con el condado. | Fla. Stat. § 197.432(1) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.432) | corrected |
| es.signup.steps.2 | El recaudador de impuestos puede exigir un depósito razonable a quien desee pujar (§197.432(7)). Confirme con el condado. | Fla. Stat. § 197.432(7) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.432) | corrected |
| es.signup.steps.3 | El recaudador de impuestos anuncia la venta de certificados una vez por semana durante 3 semanas antes de la venta (§197.402(3)). | Fla. Stat. § 197.402(3) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.402) | corrected |
| es.signup.steps.4.1 | Las pujas son tasas de interés; el certificado se adjudica a la tasa más baja ofrecida, sin exceder la tasa máxima permitida (§197.432(6)). | Fla. Stat. § 197.432(6) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.432) | corrected |
| es.signup.steps.4.2 | Se adjudica a la puja de tasa de interés más baja (§197.432(6)). | Fla. Stat. § 197.432(6) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.432) | corrected |
| es.signup.steps.5 | Un certificado en poder del condado se puede comprar al recaudador de impuestos después de emitido y antes de que se presente una solicitud de escritura fiscal (§197.4725(1)). | Fla. Stat. § 197.4725(1) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.4725) | corrected |
| es.signup.deposit.1 | Puede exigirse un depósito razonable para pujar (§197.432(7)). Confirme con el condado. | Fla. Stat. § 197.432(7) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.432) | corrected |
| es.signup.deposit.2 | Venta de escritura fiscal: el mejor postor deposita un anticipo no reembolsable de 5 por ciento de la puja o $200, lo que sea mayor (§197.542(2)). | Fla. Stat. § 197.542(2) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.542) | corrected |
| es.otc.note.1 | Cualquier persona puede comprar un certificado fiscal en poder del condado después de emitido y antes de que se presente una solicitud de escritura fiscal (§197.4725(1)). | Fla. Stat. § 197.4725(1) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.4725) | corrected |
| es.otc.note.2 | El interés de un certificado en poder del condado se calcula a 1.5 por ciento mensual, o fracción, hasta la fecha de compra (§197.4725(2)). | Fla. Stat. § 197.4725(2) | [link](https://www.flsenate.gov/Laws/Statutes/2026/197.4725) | corrected |

## Corrections (before → after)

- `type`: “Hybrid (lien then deed)” → “Tax certificate sale, then tax deed sale”
- `rate`: “18% per year (reverse bid from ceiling)” → “Maximum rate set by law: 18% per year (§197.172(2))”
- `rateNote`: “Bid-down interest” → “The lowest interest rate bid wins (§197.432(6))”
- `redemption`: “2 years from April 1 of issuance year” → “Until a tax deed is issued, unless full payment for the deed has been made to the clerk (§197.472(1))”
- `bidMethod`: “Bid-down interest” → “The certificate goes to the bidder who demands the lowest interest rate (§197.432(6))”
- `auctionPlatform`: “RealAuction / GovEase (varies by county)” → “Tax collector sells certificates, by electronic means if the tax collector chooses (§197.432(1)). Platform: Confirm with the county.”
- `auctionTiming`: “May annual lien sale; monthly deed auctions” → “Certificate sale on or before June 1, or the 60th day after delinquency if later (§197.402(3)). Tax deed sale dates: Confirm with the county.”
- `summary.1`: “Florida is a hybrid state with two parallel auction tracks.” → “After 2 years have elapsed since April 1 of the year the certificate was issued, the holder may apply for a tax deed (§197.502(1)).”
- `summary.2`: “(1) Annual tax certificate sale online before June 1 — reverse bid auction starting at 18% in 0.25% increments.” → “At the certificate sale, each certificate goes to the bidder who demands the lowest interest rate, not above the maximum rate allowed (§197.432(6)).”
- `summary.3`: “Ties resolved by RNG.” → “If bidders offer the same lowest rate, the tax collector decides how to pick the bidder; the bid received first and a random-number generator are accepted methods (§197.432(6)).”
- `summary.4`: “County takes unsold at 18%.” → “A certificate that is not purchased is struck to the county at the maximum rate allowed (§197.432(6)).”
- `summary.5`: “Min 5% face value guarantee on all certificates (§197.432).” → “On redemption, the person redeeming pays the interest rate due or the 5 percent mandatory minimum interest, whichever is greater, except on certificates with a zero percent bid (§197.472(2)).”
- `summary.6`: “(2) After 2-year redemption (from April 1 of issuance year), certificate holder applies for tax deed (§197.502) — must pay off all other outstanding certificates.” → “The holder who applies for a tax deed pays the tax collector all amounts required for redemption or purchase of all other outstanding certificates on the property (§197.502(2)).”
- `summary.7`: “Clerk conducts title search, publishes notice, holds public auction. 3-6 months from application to deed sale. 67 counties each run their own sale.” → “The tax deed property is sold at public auction by the clerk of the circuit court (§197.542(1)).”
- `summary.8`: “County-held certificates accrue at 18%.” → “Interest on a county-held certificate that is bought is calculated at 1.5 percent per month, or a fraction thereof, to the date of purchase (§197.4725(2)).”
- `summary.9`: “OTC available year-round via LienHub.” → “Any person may buy a county-held tax certificate after it is issued and before a tax deed application is made (§197.4725(1)).”
- `summary.10`: “Statutes: FL Stat §197.172 (rate), §197.432 (certificate sale), §197.4725 (OTC), §197.472 (redemption), §197.502 (deed application), §197.552 (deed issuance/lien survival).” → “Statutes: FL Stat §197.172 (interest rate), §197.432 (certificate sale), §197.4725 (county-held certificates), §197.472 (redemption), §197.502 (tax deed application), §197.552 (tax deeds).”
- `typeWhy.1`: “Florida is a hybrid state operating two parallel systems: tax lien certificates are sold at an annual reverse-bid auction, and after the 2-year redemption period expires, the certificate holder applies for a separate tax deed auction.” → “After 2 years have elapsed since April 1 of the year the certificate was issued, the holder may apply for a tax deed (§197.502(1)).”
- `rateWhy.1`: “Florida caps the lien interest rate at 18% and uses a reverse-bid auction where investors bid the rate down in 0.25% increments.” → “The maximum interest rate on a tax certificate is 18 percent per year (§197.172(2)).”
- `rateWhy.2`: “A statutory minimum 5% penalty applies on any redemption regardless of the winning bid rate.” → “On redemption, the person redeeming pays the interest rate due or the 5 percent mandatory minimum interest, whichever is greater, except on certificates with a zero percent bid (§197.472(2)).”
- `rateWhy.3`: “No interest accrues during the 60-day post-delinquency window (§197.172).” → “A tax certificate may not bear interest, and the §197.472(2) mandatory minimum interest may not be levied, during the 60 days after delinquency, except the 3 percent mandatory interest under §197.172(1).”
- `keyNotes.1`: “Largest tax lien state by volume” → “(removed)”
- `keyNotes.2`: “Bid down the interest rate you're willing to accept” → “The certificate goes to the bidder who demands the lowest interest rate (§197.432(6)).”
- `keyNotes.3`: “Deeds sold monthly — no post-sale redemption period” → “A certificate may be redeemed until a tax deed is issued, unless full payment for the deed has been made to the clerk (§197.472(1)).”
- `beginnerTip.1`: “Your best first move in Florida is LienHub OTC — buy unsold certificates year-round at the full 18% statutory rate with zero competition and no auction schedule to wait for.” → “(removed)”
- `beginnerTip.2`: “Skip the live auctions entirely until you're comfortable.” → “(removed)”
- `beginnerTip.3`: “When you're ready to shop inventory, start with smaller counties like Citrus, Hernando, or Levy for less saturated supply.” → “(removed)”
- `risks.1`: “Miami-Dade and Broward: institutional buyers push rates to 0–1% — avoid for beginners” → “(removed)”
- `risks.2`: “Tax deed title is generally not insurable without quiet title action — FL Stat §95.192 provides 4-year safe harbor” → “Once a tax deed has been issued for 4 years, no action may be brought by the former owner or a claimant under the former owner (§95.192(1)).”
- `risks.3`: “Municipal/county/special district liens and community development district liens survive per §197.552” → “A lien of record held by a municipal or county government, special district or community development district that is not satisfied from the sale proceeds survives the tax deed (§197.552).”
- `risks.4`: “Federal tax liens survive 120 days (IRS redemption right)” → “(removed)”
- `risks.5.1`: “5% mandatory minimum interest applies on all redemptions except 0% bids (§197.472).” → “On redemption, the person redeeming pays the interest rate due or the 5 percent mandatory minimum interest, whichever is greater, except on certificates with a zero percent bid (§197.472(2)).”
- `risks.5.2`: “No interest accrues during 60-day post-delinquency window (§197.172)” → “A tax certificate may not bear interest, and the §197.472(2) mandatory minimum interest may not be levied, during the 60 days after delinquency, except the 3 percent mandatory interest under §197.172(1).”
- `risks.6`: “Homestead-exempt properties with <$250 delinquency auto-struck to county at 18%” → “A tax certificate for less than $250 in delinquent taxes on homestead property is not sold at auction; the tax collector issues it to the county at the maximum rate allowed (§197.432(4)).”
- `ddExtra.1`: “Verify OTC inventory on LienHub for direct purchase certificates” → “Ask the tax collector which county-held certificates can be bought (§197.4725).”
- `ddExtra.2`: “Confirm no government code compliance liens — contact the municipality directly” → “Check for liens of record held by the city, the county or a special district; they can survive a tax deed (§197.552).”
- `ddExtra.3`: “Validate the 2-year redemption timeline (from April 1 of issuance year) before applying for tax deed” → “Confirm that 2 years have elapsed since April 1 of the year of issuance before applying for a tax deed (§197.502(1)).”
- `ddExtra.4`: “Tax collector earns 5% commission on delinquent taxes — factor into cost analysis” → “The tax collector is entitled to a 5 percent commission on delinquent taxes and interest when a certificate is sold, and it is included in the certificate's face value (§197.432(12)).”
- `signup.platform`: “LienHub.com (primary) + RealAuction.com (deed sales)” → “Tax collector (certificate sale). Online platform and tax deed sale details: Confirm with the county.”
- `signup.steps.1`: “Go to LienHub.com and create a free account” → “Contact the county tax collector; the sale starts on the day and time in the sale notice. Confirm with the county.”
- `signup.steps.2`: “Fund your account via ACH or wire transfer (minimum varies by county, typically $500–$2,000)” → “The tax collector may require a reasonable deposit from anyone who wishes to bid (§197.432(7)). Confirm with the county.”
- `signup.steps.3`: “Register for the specific county's annual tax certificate sale (before June 1 each year)” → “The tax collector advertises the certificate sale once each week for 3 weeks before it (§197.402(3)).”
- `signup.steps.4.1`: “Bid online — you're bidding the interest rate DOWN from 18%.” → “Bids are interest rates; the certificate goes to the lowest rate bid, not above the maximum rate allowed (§197.432(6)).”
- `signup.steps.4.2`: “Lowest bid wins.” → “The lowest interest rate bid wins (§197.432(6)).”
- `signup.steps.5`: “For OTC purchases: log into LienHub year-round and browse unsold certificates by county” → “A county-held certificate can be bought from the tax collector after it is issued and before a tax deed application is made (§197.4725(1)).”
- `signup.deposit.1`: “Deposit required per county.” → “A reasonable deposit may be required to bid (§197.432(7)). Confirm with the county.”
- `signup.deposit.2`: “Most counties require pre-funding before auction day.” → “Tax deed sale: the high bidder posts a nonrefundable deposit of 5 percent of the bid or $200, whichever is greater (§197.542(2)).”
- `otc.available`: “Available” → “County-held certificates can be bought (§197.4725)”
- `otc.note.1`: “Unsold tax certificates available year-round on LienHub.com.” → “Any person may buy a county-held tax certificate after it is issued and before a tax deed application is made (§197.4725(1)).”
- `otc.note.2`: “Start here — statutory 18% rate, no competition, no bidding.” → “Interest on a county-held certificate is calculated at 1.5 percent per month, or a fraction thereof, to the date of purchase (§197.4725(2)).”
- `platforms.1`: “LienHub.com” → “Tax collector (certificate sales)”
- `platforms.2`: “RealAuction.com” → “Clerk of the circuit court (tax deed sales)”
- `surplus.1`: “Florida updated its tax deed surplus statute post-Tyler.” → “After a tax deed sale, any balance of undistributed funds is retained by the clerk for the benefit of persons described in §197.522(1)(a), as their interests may appear (§197.582(2)(a)).”
- `surplus.2`: “Surplus funds are now tracked and returned to former owners.” → “A person who receives the clerk's notice has 120 days from the date of the notice to file a written claim with the clerk for the surplus (§197.582(3)).”

## Pass 2 trims, removals and notes

- `type`: was "Hybrid (lien then deed)"; plainer words, same two steps
- `rate`: was "18% per year (reverse bid from ceiling)"; stated as the maximum set by law
- `rateNote`: was "Bid-down interest"
- `redemption`: was "2 years from April 1 of issuance year"; the 2 years is when the holder may apply for a deed (§197.502(1)), not the end of redemption
- `bidMethod`: was "Bid-down interest"
- `auctionPlatform`: was "RealAuction / GovEase (varies by county)"; vendor names are not in the statute
- `auctionTiming`: was "May annual lien sale; monthly deed auctions"; "monthly" is not in the statute
- `summary.1`: was "Florida is a hybrid state with two parallel auction tracks."; "parallel tracks" not in the statute
- `summary.2`: was "(1) Annual tax certificate sale online before June 1 — reverse bid auction starting at 18% in 0.25% increments."; "online" is optional (§197.432(1)); timing moved to auctionTiming
- `summary.3`: was "Ties resolved by RNG."; the tax collector chooses the method
- `summary.4`: was "County takes unsold at 18%."
- `summary.5`: was "Min 5% face value guarantee on all certificates (§197.432)."; "guarantee" removed, section corrected, zero percent exception added
- `summary.6`: was "(2) After 2-year redemption ... certificate holder applies for tax deed (§197.502) — must pay off all other outstanding certificates."; "2-year redemption" moved to summary.1
- `summary.7`: was "Clerk conducts title search, publishes notice, holds public auction. 3-6 months from application to deed sale. 67 counties each run their own sale."; timeline and county count not in the statute
- `summary.8`: was "County-held certificates accrue at 18%."; the section says 1.5 percent per month to the purchase date
- `summary.9`: was "OTC available year-round via LienHub."; year-round and vendor not in the statute
- `summary.10`: only the labels in parentheses changed to match the section titles
- `typeWhy.1`: was "Florida is a hybrid state operating two parallel systems..."; parallel-systems wording not in the statute
- `rateWhy.1`: was "Florida caps the lien interest rate at 18% and uses a reverse-bid auction ... 0.25% increments."; bid steps are in summary.2/summary.3
- `rateWhy.2`: was "A statutory minimum 5% penalty applies on any redemption regardless of the winning bid rate."; "penalty" and "any redemption" overstated
- `rateWhy.3`: was "No interest accrues during the 60-day post-delinquency window (§197.172)."; 3 percent exception added
- `keyNotes.1`: removed: no official source (opinion, advice, comparison, county or platform claim, or figure not in the statute)
- `keyNotes.2`: was "Bid down the interest rate you're willing to accept"
- `keyNotes.3`: was "Deeds sold monthly — no post-sale redemption period"; monthly sales not in statute
- `beginnerTip.1`: removed: no official source (opinion, advice, comparison, county or platform claim, or figure not in the statute)
- `beginnerTip.2`: removed: no official source (opinion, advice, comparison, county or platform claim, or figure not in the statute)
- `beginnerTip.3`: removed: no official source (opinion, advice, comparison, county or platform claim, or figure not in the statute)
- `risks.1`: removed: no official source (opinion, advice, comparison, county or platform claim, or figure not in the statute)
- `risks.2`: was "Tax deed title is generally not insurable without quiet title action — §95.192 provides 4-year safe harbor"; insurability opinion removed
- `risks.3`: was "Municipal/county/special district liens and community development district liens survive per §197.552"; "not satisfied from the proceeds" condition added
- `risks.4`: removed: no official source (opinion, advice, comparison, county or platform claim, or figure not in the statute)
- `risks.5.1`: was "5% mandatory minimum interest applies on all redemptions except 0% bids (§197.472)."; applies when the interest due is under 5 percent
- `risks.5.2`: was "No interest accrues during 60-day post-delinquency window (§197.172)"; 3 percent exception added
- `risks.6`: was "Homestead-exempt properties with <$250 delinquency auto-struck to county at 18%"
- `ddExtra.1`: was "Verify OTC inventory on LienHub for direct purchase certificates"
- `ddExtra.2`: was "Confirm no government code compliance liens — contact the municipality directly"; "code compliance" not in the statute
- `ddExtra.3`: was "Validate the 2-year redemption timeline ..."
- `ddExtra.4`: was "Tax collector earns 5% commission on delinquent taxes — factor into cost analysis"; advice removed, "earns" removed
- `signup.platform`: was "LienHub.com (primary) + RealAuction.com (deed sales)"; vendors not in the statute. pass 2 trim: clerk part removed because the quote names only the tax collector
- `signup.steps.1`: was "Go to LienHub.com and create a free account"
- `signup.steps.2`: was "Fund your account via ACH or wire transfer (minimum varies by county, typically $500–$2,000)"; amounts not in the statute
- `signup.steps.3`: was "Register for the specific county's annual tax certificate sale (before June 1 each year)"
- `signup.steps.4.1`: was "Bid online — you're bidding the interest rate DOWN from 18%."
- `signup.steps.4.2`: was "Lowest bid wins."
- `signup.steps.5`: was "For OTC purchases: log into LienHub year-round and browse unsold certificates by county"
- `signup.deposit.1`: was "Deposit required per county."
- `signup.deposit.2`: was "Most counties require pre-funding before auction day."; replaced with the statutory deed-sale deposit
- `otc.available`: was "Available"
- `otc.note.1`: was "Unsold tax certificates available year-round on LienHub.com."; year-round and vendor not in the statute
- `otc.note.2`: was "Start here — statutory 18% rate, no competition, no bidding."; advice, rate and competition claims removed
- `platforms.1`: was "LienHub.com"
- `platforms.2`: was "RealAuction.com"
- `surplus.1`: was "Florida updated its tax deed surplus statute post-Tyler."; "post-Tyler" is not in the statute
- `surplus.2`: was "Surplus funds are now tracked and returned to former owners."; "returned to former owners" not stated; the claim period is

## Conflicts (flagged)

None.

## Gap queue work (2026-11-08)

- FL-1 closed. Read as chaptered acts (laws.flrules.org, saved under sources/fl/ch2024-91, ch2024-140, ch2026-174):
  - Ch. 2024-91 (HB 113), approved April 15, 2024, effective July 1, 2024. Section 3 amends 197.502(2): interest on a canceled tax deed application. No shown claim rests on it.
  - Ch. 2024-140 (CS/CS/CS HB 989), approved May 2, 2024, effective on becoming law (section 101). Section 61 changes only a cross-reference in 197.582(2)(a).
  - Ch. 2026-174 (CS/CS/CS SB 1452), approved June 26, 2026, effective on becoming law (section 98). Section 92 changes only a cross-reference in 197.582(2)(a).
  - Search: the 2026 history lines of 197.172, 197.402, 197.432, 197.4725, 197.472, 197.502, 197.522, 197.532, 197.542, 197.552, 197.582 and 95.192 list no other act from 2023 to 2026. The legislature's bill-search page needs JavaScript, so this was a history-line search, not a bill search.
  - No shown text changed.
- FL-2 closed under the spec's alternative. Read 197.502(6) (the homestead opening bid adds one-half of the latest assessed value), 197.522 and 197.532 (clerk and sheriff notices). County tax collector and clerk pages were not read, so platforms, registration, deposits and sale dates keep the "Confirm with the county" label.
