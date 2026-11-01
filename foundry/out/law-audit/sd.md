# South Dakota (SD) law audit

Checked 2026-11-01. Status: done. Ledger: `cloudflare/data/law/sd.json`.

Official code access: South Dakota Codified Laws chapters 10-23 (sale), 10-24 (redemption) and 10-25 (tax deeds), current text from sdlegislature.gov (South Dakota Legislature) through its statute pages at /api/Statutes/<section>.html; the /Statutes/<section> web page needs JavaScript.

Finding: the site had a fixed 12% rate, a 3 to 4 year redemption, and "No OTC program". SDCL 10-23-8 caps valid bids at 10% a year and sells to the lowest rate bid; 10-23-7 sets the sale for the third Monday of December; 10-24-1 and 10-25-8 let redemption run until 60 days after the affidavit of completed service of the deed notice; 10-25-1 allows a deed proceeding after three years and within six years of the sale; 10-23-12 requires the treasurer to sell unsold certificates at private sale, which is an over-the-counter route the site denied. Source access: sdlegislature.gov/Statutes/<sec> needs JavaScript; the API page /api/Statutes/<sec>.html returns the section text.

## 2023 to 2026 law search log

- Searched: the "Source:" lines of every section fetched in chapters 10-23, 10-24 and 10-25 on sdlegislature.gov.
- Found: SL 2024 ch. 38 §§ 3 and 4 (eff. Feb. 12, 2024) and SL 2025 ch. 49 §§ 1 and 2 amended SDCL 10-25-39 (surplus) and 10-25-12 (title vested by a county tax deed). The site text now follows the amended § 10-25-39. Bill numbers and act text were not read (gap SD-1).
- Not run: bill-status search for other 2023 to 2026 bills.

## Unreachable

None.

## Watch

None found.

## Claims

| id | shown | statute | link | status |
|---|---|---|---|---|
| type | Tax certificate sale | SDCL § 10-23-7 | [link](https://sdlegislature.gov/api/Statutes/10-23-7.html) | corrected |
| rate | Maximum rate set by law: 10% a year (the lowest rate bid wins) | SDCL § 10-23-8 | [link](https://sdlegislature.gov/api/Statutes/10-23-8.html) | corrected |
| rateNote | Each bid states the lowest rate of interest per year at which the bidder will pay the taxes due | SDCL § 10-23-8 | [link](https://sdlegislature.gov/api/Statutes/10-23-8.html) | corrected |
| redemption | Until 60 days after the affidavit of completed service of the tax deed notice is filed | SDCL § 10-25-8 | [link](https://sdlegislature.gov/api/Statutes/10-25-8.html) | corrected |
| bidMethod | Lowest rate of interest per year bid | SDCL § 10-23-8 | [link](https://sdlegislature.gov/api/Statutes/10-23-8.html) | corrected |
| statute | SDCL §10-23-8 | SDCL § 10-23-8 | [link](https://sdlegislature.gov/api/Statutes/10-23-8.html) | corrected |
| auctionPlatform | County treasurer, at a public sale at the courthouse | SDCL § 10-23-7 | [link](https://sdlegislature.gov/api/Statutes/10-23-7.html) | corrected |
| auctionTiming | Third Monday of December, between 9 a.m. and 4 p.m. | SDCL § 10-23-7 | [link](https://sdlegislature.gov/api/Statutes/10-23-7.html) | corrected |
| summary.1 | South Dakota county treasurers offer tax certificates at public sale on the third Monday of December each year. | SDCL § 10-23-7 | [link](https://sdlegislature.gov/api/Statutes/10-23-7.html) | corrected |
| summary.2 | A tax deed proceeding may be started after three years from the sale and within six years of the sale (SDCL 10-25-1). | SDCL § 10-25-1 | [link](https://sdlegislature.gov/api/Statutes/10-25-1.html) | corrected |
| summary.3 | Statute: SDCL §10-25-1. | SDCL § 10-25-1 | [link](https://sdlegislature.gov/api/Statutes/10-25-1.html) | corrected |
| typeWhy.1 | South Dakota sells tax certificates for real property with unpaid taxes at an annual public sale. | SDCL § 10-23-7 | [link](https://sdlegislature.gov/api/Statutes/10-23-7.html) | corrected |
| typeWhy.2 | The holder of a tax certificate may start a tax deed proceeding after three years from the sale (SDCL 10-25-1). | SDCL § 10-25-1 | [link](https://sdlegislature.gov/api/Statutes/10-25-1.html) | corrected |
| typeWhy.3 | SDCL §10-25-1. | SDCL § 10-25-1 | [link](https://sdlegislature.gov/api/Statutes/10-25-1.html) | corrected |
| rateWhy.1 | South Dakota caps the interest rate at 10% a year; no bid above that rate is valid. | SDCL § 10-23-8 | [link](https://sdlegislature.gov/api/Statutes/10-23-8.html) | corrected |
| rateWhy.2 | Bidders state the lowest rate of interest per year at which they will pay the taxes due. | SDCL § 10-23-8 | [link](https://sdlegislature.gov/api/Statutes/10-23-8.html) | corrected |
| rateWhy.3 | SDCL §10-23-8. | SDCL § 10-23-8 | [link](https://sdlegislature.gov/api/Statutes/10-23-8.html) | corrected |
| keyNotes.1 | Public sale on the third Monday of December each year | SDCL § 10-23-7 | [link](https://sdlegislature.gov/api/Statutes/10-23-7.html) | corrected |
| keyNotes.2 | A tax deed proceeding may be started after three years from the sale and within six years of the sale | SDCL § 10-25-1 | [link](https://sdlegislature.gov/api/Statutes/10-25-1.html) | corrected |
| keyNotes.3 | (removed) | SDCL § 10-23-7 | [link](https://sdlegislature.gov/api/Statutes/10-23-7.html) | corrected |
| notBeginnerReason.1 | The tax certificate sale and lien are barred if a tax deed proceeding is not completed within six years of the sale. | SDCL § 10-25-16 | [link](https://sdlegislature.gov/api/Statutes/10-25-16.html) | corrected |
| beginnerTip.1 | (removed) | SDCL § 10-23-7 | [link](https://sdlegislature.gov/api/Statutes/10-23-7.html) | corrected |
| beginnerTip.2 | An assignee of a tax certificate takes it subject to the time period of the first owner of the certificate. | SDCL § 10-25-1 | [link](https://sdlegislature.gov/api/Statutes/10-25-1.html) | corrected |
| risks.1 | A tax deed proceeding not completed within six years of the sale is barred, with the certificate and lien | SDCL § 10-25-16 | [link](https://sdlegislature.gov/api/Statutes/10-25-16.html) | corrected |
| risks.2 | (removed) | SDCL § 10-23-7 | [link](https://sdlegislature.gov/api/Statutes/10-23-7.html) | corrected |
| risks.3 | (removed) | SDCL § 10-23-7 | [link](https://sdlegislature.gov/api/Statutes/10-23-7.html) | corrected |
| ddExtra.1 | (removed) | SDCL § 10-23-7 | [link](https://sdlegislature.gov/api/Statutes/10-23-7.html) | corrected |
| ddExtra.2 | Redemption does not end until 60 days after the affidavit of completed service of the notice is filed | SDCL § 10-25-8 | [link](https://sdlegislature.gov/api/Statutes/10-25-8.html) | corrected |
| ddExtra.3 | A person demanding a tax deed must first buy the assignment of all prior tax certificates the county holds on the property | SDCL § 10-25-10 | [link](https://sdlegislature.gov/api/Statutes/10-25-10.html) | corrected |
| signup.platform | County treasurer | SDCL § 10-23-7 | [link](https://sdlegislature.gov/api/Statutes/10-23-7.html) | corrected |
| signup.steps.1 | Watch for the treasurer's notice, published once during the week before the sale in the county's official newspapers | SDCL § 10-23-2 | [link](https://sdlegislature.gov/api/Statutes/10-23-2.html) | corrected |
| signup.steps.2 | The sale is on the third Monday of December; confirm the date and time with the county treasurer | SDCL § 10-23-7 | [link](https://sdlegislature.gov/api/Statutes/10-23-7.html) | corrected |
| signup.steps.3 | The published notice gives the time and place of the sale and lists the tax certificates to be sold | SDCL § 10-23-3 | [link](https://sdlegislature.gov/api/Statutes/10-23-3.html) | corrected |
| signup.steps.4 | Bid the full amount of the taxes, interest and costs due, stating the lowest rate of interest per year at which you will pay the taxes | SDCL § 10-23-8 | [link](https://sdlegislature.gov/api/Statutes/10-23-8.html) | corrected |
| signup.deposit.1 | Confirm with the county treasurer. | SDCL § 10-23-9 | [link](https://sdlegislature.gov/api/Statutes/10-23-9.html) | corrected |
| otc.available | After the sale closes, a certificate unsold for want of bidders is sold by the treasurer at private sale to any person who pays the taxes, penalty and costs due | SDCL § 10-23-12 | [link](https://sdlegislature.gov/api/Statutes/10-23-12.html) | corrected |
| otc.note.1 | Unsold tax certificates are sold at private sale at the treasurer's office. | SDCL § 10-23-12 | [link](https://sdlegislature.gov/api/Statutes/10-23-12.html) | corrected |
| platforms.1 | County treasurer | SDCL § 10-23-7 | [link](https://sdlegislature.gov/api/Statutes/10-23-7.html) | corrected |
| surplus.1 | Surplus proceeds of a tax deed sale go to the prior owner of record; if the owner cannot be found within 180 days, they go to the Unclaimed Property Division (SDCL 10-25-39). | SDCL § 10-25-39 | [link](https://sdlegislature.gov/api/Statutes/10-25-39.html) | corrected |
| es.rate | Tasa máxima fijada por la ley: 10% anual (prevalece la tasa más baja ofrecida) | SDCL § 10-23-8 | [link](https://sdlegislature.gov/api/Statutes/10-23-8.html) | corrected |
| es.redemption | Hasta 60 días después de que se presente la declaración jurada de notificación completa del aviso de escritura fiscal | SDCL § 10-25-8 | [link](https://sdlegislature.gov/api/Statutes/10-25-8.html) | corrected |
| es.summary.1 | Los tesoreros de los condados de Dakota del Sur ofrecen certificados fiscales en venta pública el tercer lunes de diciembre de cada año. | SDCL § 10-23-7 | [link](https://sdlegislature.gov/api/Statutes/10-23-7.html) | corrected |
| es.summary.2 | El cesionario de un certificado fiscal lo recibe sujeto al plazo del primer titular del certificado. | SDCL § 10-25-1 | [link](https://sdlegislature.gov/api/Statutes/10-25-1.html) | corrected |
| es.summary.3 | Un procedimiento de escritura fiscal puede iniciarse después de tres años desde la venta y dentro de seis años de la venta (SDCL 10-25-1). | SDCL § 10-25-1 | [link](https://sdlegislature.gov/api/Statutes/10-25-1.html) | corrected |
| es.summary.4 | Estatuto: SDCL §10-25-1. | SDCL § 10-25-1 | [link](https://sdlegislature.gov/api/Statutes/10-25-1.html) | corrected |
| es.typeWhy.1 | Dakota del Sur vende certificados fiscales de propiedades con impuestos impagos en una venta pública anual. | SDCL § 10-23-7 | [link](https://sdlegislature.gov/api/Statutes/10-23-7.html) | corrected |
| es.typeWhy.2 | El titular de un certificado fiscal puede iniciar un procedimiento de escritura fiscal después de tres años desde la venta (SDCL 10-25-1). | SDCL § 10-25-1 | [link](https://sdlegislature.gov/api/Statutes/10-25-1.html) | corrected |
| es.rateWhy.1 | Dakota del Sur limita la tasa de interés a 10% anual; ninguna oferta por encima de esa tasa es válida. | SDCL § 10-23-8 | [link](https://sdlegislature.gov/api/Statutes/10-23-8.html) | corrected |
| es.notBeginnerReason.1 | La venta del certificado fiscal y el gravamen quedan extinguidos si un procedimiento de escritura fiscal no se completa dentro de seis años desde la venta. | SDCL § 10-25-16 | [link](https://sdlegislature.gov/api/Statutes/10-25-16.html) | corrected |
| es.beginnerTip.1 | (removed) | SDCL § 10-23-7 | [link](https://sdlegislature.gov/api/Statutes/10-23-7.html) | corrected |
| es.beginnerTip.2 | El cesionario de un certificado fiscal lo recibe sujeto al plazo del primer titular del certificado. | SDCL § 10-25-1 | [link](https://sdlegislature.gov/api/Statutes/10-25-1.html) | corrected |
| es.risks.1 | Un procedimiento de escritura fiscal no completado dentro de seis años desde la venta queda extinguido, junto con el certificado y el gravamen | SDCL § 10-25-16 | [link](https://sdlegislature.gov/api/Statutes/10-25-16.html) | corrected |
| es.risks.2 | (removed) | SDCL § 10-23-7 | [link](https://sdlegislature.gov/api/Statutes/10-23-7.html) | corrected |
| es.risks.3 | (removed) | SDCL § 10-23-7 | [link](https://sdlegislature.gov/api/Statutes/10-23-7.html) | corrected |
| es.ddExtra.1 | (removed) | SDCL § 10-23-7 | [link](https://sdlegislature.gov/api/Statutes/10-23-7.html) | corrected |
| es.ddExtra.2 | La redención no termina hasta 60 días después de que se presente la declaración jurada de notificación completa | SDCL § 10-25-8 | [link](https://sdlegislature.gov/api/Statutes/10-25-8.html) | corrected |
| es.ddExtra.3 | Quien exige una escritura fiscal debe comprar primero la cesión de todos los certificados fiscales anteriores que el condado tenga sobre la propiedad | SDCL § 10-25-10 | [link](https://sdlegislature.gov/api/Statutes/10-25-10.html) | corrected |
| es.signup.platform | Tesorero del condado | SDCL § 10-23-7 | [link](https://sdlegislature.gov/api/Statutes/10-23-7.html) | corrected |
| es.signup.steps.1 | Esté atento al aviso del tesorero, publicado una vez durante la semana anterior a la venta en los periódicos oficiales del condado | SDCL § 10-23-2 | [link](https://sdlegislature.gov/api/Statutes/10-23-2.html) | corrected |
| es.signup.steps.2 | La venta es el tercer lunes de diciembre; confirme la fecha y la hora con el tesorero del condado | SDCL § 10-23-7 | [link](https://sdlegislature.gov/api/Statutes/10-23-7.html) | corrected |
| es.signup.steps.3 | El aviso publicado indica la hora y el lugar de la venta y enumera los certificados fiscales a vender | SDCL § 10-23-3 | [link](https://sdlegislature.gov/api/Statutes/10-23-3.html) | corrected |
| es.signup.steps.4 | Ofrezca el monto total de impuestos, intereses y costos adeudados, indicando la tasa de interés anual más baja a la que pagará los impuestos | SDCL § 10-23-8 | [link](https://sdlegislature.gov/api/Statutes/10-23-8.html) | corrected |
| es.signup.deposit.1 | Confirme con el tesorero del condado. | SDCL § 10-23-9 | [link](https://sdlegislature.gov/api/Statutes/10-23-9.html) | corrected |
| es.otc.note.1 | Los certificados fiscales no vendidos se venden en venta privada en la oficina del tesorero. | SDCL § 10-23-12 | [link](https://sdlegislature.gov/api/Statutes/10-23-12.html) | corrected |

## Corrections (before → after)

- `type`: “Tax lien” → “Tax certificate sale”
- `rate`: “12%” → “Maximum rate set by law: 10% a year (the lowest rate bid wins)”
- `rateNote`: “Bid-down system — investor accepts lowest rate willing to take” → “Each bid states the lowest rate of interest per year at which the bidder will pay the taxes due”
- `redemption`: “3–4 years” → “Until 60 days after the affidavit of completed service of the tax deed notice is filed”
- `bidMethod`: “Bid-down interest rate” → “Lowest rate of interest per year bid”
- `statute`: “SDCL §10-23” → “SDCL §10-23-8”
- `auctionPlatform`: “County treasurer — in-person” → “County treasurer, at a public sale at the courthouse”
- `auctionTiming`: “December” → “Third Monday of December, between 9 a.m. and 4 p.m.”
- `summary.1`: “South Dakota holds limited annual lien sales, mostly in December.” → “South Dakota county treasurers offer tax certificates at public sale on the third Monday of December each year.”
- `summary.2`: “Certificates are transferable. 3–4 year redemption before deed.” → “A tax deed proceeding may be started after three years from the sale and within six years of the sale (SDCL 10-25-1).”
- `summary.3`: “Statute: SDCL §10-25.” → “Statute: SDCL §10-25-1.”
- `typeWhy.1`: “South Dakota sells tax lien certificates at limited annual sales.” → “South Dakota sells tax certificates for real property with unpaid taxes at an annual public sale.”
- `typeWhy.2`: “The owner retains title during the 3-4 year redemption period.” → “The holder of a tax certificate may start a tax deed proceeding after three years from the sale (SDCL 10-25-1).”
- `typeWhy.3`: “SDCL §10-25.” → “SDCL §10-25-1.”
- `rateWhy.1`: “South Dakota sets a fixed statutory rate of 12% per annum on tax lien certificates.” → “South Dakota caps the interest rate at 10% a year; no bid above that rate is valid.”
- `rateWhy.2`: “This is a flat, non-auction-determined rate.” → “Bidders state the lowest rate of interest per year at which they will pay the taxes due.”
- `rateWhy.3`: “SDCL §10-25.” → “SDCL §10-23-8.”
- `keyNotes.1`: “December auction — one annual sale per county” → “Public sale on the third Monday of December each year”
- `keyNotes.2`: “3-year redemption plus mandatory 60-day notice before deed” → “A tax deed proceeding may be started after three years from the sale and within six years of the sale”
- `keyNotes.3`: “Low population, rural land heavy — limited inventory” → “(removed)”
- `notBeginnerReason.1`: “Long 3–4 year redemption, limited inventory, December-only auctions.” → “The tax certificate sale and lien are barred if a tax deed proceeding is not completed within six years of the sale.”
- `beginnerTip.1`: “Minnehaha (Sioux Falls) and Pennington (Rapid City) counties have the best SD inventory.” → “(removed)”
- `beginnerTip.2`: “Note that certificates are transferable — you can sell your certificate position to another investor.” → “An assignee of a tax certificate takes it subject to the time period of the first owner of the certificate.”
- `risks.1`: “3–4 year redemption is very long” → “A tax deed proceeding not completed within six years of the sale is barred, with the certificate and lien”
- `risks.2`: “December-only auctions limit timing” → “(removed)”
- `risks.3`: “Limited inventory outside Sioux Falls and Rapid City” → “(removed)”
- `ddExtra.1`: “Calculate opportunity cost over the 3–4 year holding period” → “(removed)”
- `ddExtra.2`: “Verify the exact redemption period for the county” → “Redemption does not end until 60 days after the affidavit of completed service of the notice is filed”
- `ddExtra.3`: “Confirm certificates are transferable if you need liquidity before redemption” → “A person demanding a tax deed must first buy the assignment of all prior tax certificates the county holds on the property”
- `signup.platform`: “County treasurer (in-person)” → “County treasurer”
- `signup.steps.1`: “Find your target county treasurer at sd.gov/government/counties” → “Watch for the treasurer's notice, published once during the week before the sale in the county's official newspapers”
- `signup.steps.2`: “Contact the treasurer in October to confirm a December sale is scheduled” → “The sale is on the third Monday of December; confirm the date and time with the county treasurer”
- `signup.steps.3`: “Request the delinquent property list” → “The published notice gives the time and place of the sale and lists the tax certificates to be sold”
- `signup.steps.4`: “Register in person” → “Bid the full amount of the taxes, interest and costs due, stating the lowest rate of interest per year at which you will pay the taxes”
- `signup.deposit.1`: “Varies by county.” → “Confirm with the county treasurer.”
- `otc.available`: “Not generally available” → “After the sale closes, a certificate unsold for want of bidders is sold by the treasurer at private sale to any person who pays the taxes, penalty and costs due”
- `otc.note.1`: “No OTC program.” → “Unsold tax certificates are sold at private sale at the treasurer's office.”
- `platforms.1`: “County treasurer offices” → “County treasurer”
- `surplus.1`: “Status pending — monitoring for legislative action.” → “Surplus proceeds of a tax deed sale go to the prior owner of record; if the owner cannot be found within 180 days, they go to the Unclaimed Property Division (SDCL 10-25-39).”

## Pass 2 trims, removals and notes

- `type`: was "Tax lien"; SDCL 10-23-7 sells a tax certificate
- `rate`: was "12%"; SDCL 10-23-8 caps valid bids at ten percent per year
- `rateNote`: was "Bid-down system — investor accepts lowest rate willing to take"
- `redemption`: was "3–4 years"; the 3-year point is when a deed proceeding may begin (summary.2)
- `bidMethod`: was "Bid-down interest rate"
- `statute`: was "SDCL §10-23"
- `auctionPlatform`: was "County treasurer — in-person"
- `auctionTiming`: was "December"
- `summary.1`: was "limited annual lien sales, mostly in December"
- `summary.2`: was "Certificates are transferable. 3–4 year redemption before deed."; transferability now on beginnerTip.2
- `summary.3`: was "SDCL §10-25"
- `typeWhy.1`: was "sells tax lien certificates at limited annual sales"
- `typeWhy.2`: was "owner retains title during the 3-4 year redemption period"
- `typeWhy.3`: was "SDCL §10-25."
- `rateWhy.1`: was "fixed statutory rate of 12% per annum"
- `rateWhy.2`: was "flat, non-auction-determined rate"; the rate is set by bidding up to the cap
- `rateWhy.3`: was "SDCL §10-25."
- `keyNotes.1`: was "December auction — one annual sale per county"
- `keyNotes.2`: was "3-year redemption plus mandatory 60-day notice before deed"; redemption is now on the redemption line
- `keyNotes.3`: removed: no official source (opinion, county name, inventory claim or advice not in the statute)
- `notBeginnerReason.1`: was "Long 3–4 year redemption, limited inventory, December-only auctions."
- `beginnerTip.1`: removed: no official source (opinion, county name, inventory claim or advice not in the statute)
- `beginnerTip.2`: was "certificates are transferable — you can sell your certificate position"; sale advice removed, assignment rule kept
- `risks.1`: was "3–4 year redemption is very long"
- `risks.2`: removed: no official source (opinion, county name, inventory claim or advice not in the statute)
- `risks.3`: removed: no official source (opinion, county name, inventory claim or advice not in the statute)
- `ddExtra.1`: removed: no official source (opinion, county name, inventory claim or advice not in the statute)
- `ddExtra.2`: was "Verify the exact redemption period for the county"
- `ddExtra.3`: was "Confirm certificates are transferable if you need liquidity before redemption"
- `signup.platform`: was "County treasurer (in-person)"
- `signup.steps.1`: was "Find your target county treasurer at sd.gov/government/counties"
- `signup.steps.2`: was "Contact the treasurer in October to confirm a December sale is scheduled"
- `signup.steps.3`: was "Request the delinquent property list"
- `signup.steps.4`: was "Register in person"; registration is not in the statute
- `signup.deposit.1`: was "Varies by county."
- `otc.available`: was "Not generally available"
- `otc.note.1`: was "No OTC program."
- `platforms.1`: was "County treasurer offices"
- `surplus.1`: was "Status pending — monitoring for legislative action."; SL 2024 ch. 38 and SL 2025 ch. 49 amended the section

## Conflicts (flagged)

None.
