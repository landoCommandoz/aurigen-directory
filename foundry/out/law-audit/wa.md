# Washington (WA) law audit

Checked 2026-11-01. Status: done. Ledger: `cloudflare/data/law/wa.json`.

Official code access: Title 84 RCW combined PDF (certified 7/15/2026) and RCW 36.35.150 PDF from lawfilesext.leg.wa.gov (Washington State Legislature, Code Reviser). app.leg.wa.gov is disallowed by robots.txt, so the per-title PDFs on lawfilesext.leg.wa.gov were used.

## Finding (run 7)

WA was `blocked` in earlier runs because app.leg.wa.gov is disallowed by robots.txt. Run 7 found the legislature's own per-title PDFs on lawfilesext.leg.wa.gov (Code Reviser): Title 84 RCW combined PDF (certified 7/15/2026) and RCW 36.35.150. Both pass full certificate checking and rule 2.

Main changes: the site's "April and November" auction months, Bid4Assets vendor claims, "clean title", "no post-sale redemption" (minors and persons adjudicated incompetent may redeem within three years of the sale, RCW 84.64.070(5)), assessor-run tax title sales and all opinion text were removed or rewritten. Surplus rule (RCW 84.64.080(10)) added.

## 2023 to 2026 law search

Searched the Code Reviser's "RCW Sections Affected" lists for 2023, 2024 and 2025 (sources/wa/sl2023, sl2024, sl2025) for sections of chapters 84.56, 84.64 and 36.35. Found: 2023 c 376 s 1 amended RCW 84.56.020 (delinquency interest 9% residential up to four units, 12% other, from Jan 1, 2023; current text read). 2025 c 130 amended RCW 84.56.070 and 84.56.240 (personal property distraint; not real-property tax sales). Nothing found for 84.64 or 36.35 in 2023-2025. The 2026 session list was not found (not searched).

## Unreachable

app.leg.wa.gov (robots.txt disallows). dor.wa.gov tax-foreclosure page 404.

## Watch

None known. County auction platforms, dates and deposits are not official-sourced: all say "Confirm with the county".

## Claims

| id | shown | statute | link | status |
|---|---|---|---|---|
| type | Tax deed sale after court foreclosure (RCW 84.64.050, 84.64.080) | RCW 84.64.080(11) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| rate | No lien-purchase rate. Interest on delinquent taxes set by law: 9% per year for residential property of four or fewer units, 12% per year for other property (RCW 84.56.020(5)) | RCW 84.56.020(5)(a) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| rateNote | A redeeming owner pays interest at the statutory rate charged on delinquent taxes (RCW 84.64.070(1)); the 12% rate applies to all other property (RCW 84.56.020(5)) | RCW 84.56.020(5)(a) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| redemption | Owner may redeem up to the close of business the day before the sale (RCW 84.64.070(1)). A certificate of delinquency is issued after three years from delinquency (RCW 84.64.050(1)) | RCW 84.64.070(1) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| bidMethod | Highest and best bidder; the minimum bid is the total of taxes, interest and costs (RCW 84.64.080(4)) | RCW 84.64.080(4) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| statute | RCW 84.64.050, 84.64.070, 84.64.080 and 84.64.225 | RCW 84.64.080(4) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| auctionPlatform | The county treasurer sells at a location in the county, or by public auction by electronic media (RCW 84.64.080(5), 84.64.225). Platform: Confirm with the county. | RCW 84.64.225(1) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| auctionTiming | Date and time set by the county treasurer, with ten days of posted notice in three public places (RCW 84.64.080(5)). Dates: Confirm with the county. | RCW 84.64.080(5) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| summary.1 | In Washington the county treasurer sells foreclosed property to the highest and best bidder on a date the treasurer directs (RCW 84.64.080(4), (5)). | RCW 84.64.080(5) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| summary.2 | The auction platform and who uses it are not set by the statutes read. Confirm with the county. | RCW 84.64.225(1) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| summary.3 | Counties may dispose of tax foreclosed property by private negotiation, without a call for bids, in listed cases (RCW 36.35.150). A certificate of delinquency issues after three years from delinquency (RCW 84.64.050(1)). | RCW 36.35.150(1) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2036%20%20TITLE/RCW%20%2036%20.%2035%20%20CHAPTER/RCW%20%2036%20.%2035%20.150.pdf) | corrected |
| summary.4 | Statute: RCW 84.64.050, 84.64.070 and 84.64.080. | RCW 84.64.080(4) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| typeWhy.1 | After a court judgment, the county treasurer sells the property and executes a tax deed to the purchaser (RCW 84.64.080(3), (11)). | RCW 84.64.080(11) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| typeWhy.2 | The owner may redeem only until the close of business the day before the sale (RCW 84.64.070(1)); the sections read give no redemption after the sale for adults. | RCW 84.64.070(1) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| typeWhy.3 | RCW §84.64. | RCW 84.64.080(4) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | supported |
| rateWhy.1 | Washington sets no rate for a purchaser; the statutory rate applies to delinquent taxes, 9% or 12% per year (RCW 84.56.020(5)). | RCW 84.56.020(5)(a) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| rateWhy.2 | (removed) | RCW 84.64.080(4) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| rateWhy.3 | RCW §84.64. | RCW 84.64.080(4) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | supported |
| keyNotes.1 | The property is sold "as is" with no warranty of title (RCW 84.64.080(4)). | RCW 84.64.080(4) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| keyNotes.2 | The minimum bid is the total amount of taxes, interest, and costs (RCW 84.64.080(4)). | RCW 84.64.080(4) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| keyNotes.3 | (removed) | RCW 84.64.080(4) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| notBeginnerReason.1 | (removed) | RCW 84.64.050(1) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| notBeginnerReason.2 | (removed) | RCW 84.64.080(5) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| notBeginnerReason.3 | (removed) | RCW 84.64.080(5) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| beginnerTip.1 | (removed) | RCW 36.35.150(1) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2036%20%20TITLE/RCW%20%2036%20.%2035%20%20CHAPTER/RCW%20%2036%20.%2035%20.150.pdf) | corrected |
| beginnerTip.2 | (removed) | RCW 36.35.150(1) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2036%20%20TITLE/RCW%20%2036%20.%2035%20%20CHAPTER/RCW%20%2036%20.%2035%20.150.pdf) | corrected |
| risks.1 | (removed) | RCW 84.64.080(4) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| risks.2 | (removed) | RCW 84.64.050(1) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| risks.3 | (removed) | RCW 84.64.080(4) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| ddExtra.1 | Sold "as is": no warranty of any kind on title, zoning, size, location or fitness (RCW 84.64.080(4)). | RCW 84.64.080(4) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| ddExtra.2 | (removed) | RCW 84.64.080(4) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| ddExtra.3 | (removed) | RCW 84.64.080(4) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| signup.platform | County treasurer sale, in person or by electronic media (RCW 84.64.080(5), 84.64.225). Platform: Confirm with the county. | RCW 84.64.225(1) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| signup.steps.1 | Sale notice: posted ten days in three public places in the county, one in the treasurer's office (RCW 84.64.080(5)). | RCW 84.64.080(5) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| signup.steps.2 | Registration: Confirm with the county. | RCW 84.64.225(1) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| signup.steps.3 | Registration and deposit: Confirm with the county. | RCW 84.64.225(2) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| signup.steps.4 | Counties may sell tax foreclosed property without bids in listed cases (RCW 36.35.150). Contact the county. | RCW 36.35.150(1) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2036%20%20TITLE/RCW%20%2036%20.%2035%20%20CHAPTER/RCW%20%2036%20.%2035%20.150.pdf) | corrected |
| signup.deposit.1 | Deposit: if a county sets one for an electronic auction, the sale notice states it (RCW 84.64.225(2)). Amounts: Confirm with the county. | RCW 84.64.225(2) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| signup.deposit.2 | A winning bidder's deposit is applied to the balance, and forfeited if the bidder does not comply with the terms of sale (RCW 84.64.225(2)). | RCW 84.64.225(2) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| otc.available | Confirm with the county. | RCW 36.35.150(1) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2036%20%20TITLE/RCW%20%2036%20.%2035%20%20CHAPTER/RCW%20%2036%20.%2035%20.150.pdf) | corrected |
| otc.note.1 | A county may dispose of tax foreclosed property by private negotiation, without a call for bids, in listed cases (RCW 36.35.150). | RCW 36.35.150(1) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2036%20%20TITLE/RCW%20%2036%20.%2035%20%20CHAPTER/RCW%20%2036%20.%2035%20.150.pdf) | corrected |
| otc.note.2 | Current lists: Confirm with the county. | RCW 36.35.150(1) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2036%20%20TITLE/RCW%20%2036%20.%2035%20%20CHAPTER/RCW%20%2036%20.%2035%20.150.pdf) | corrected |
| platforms.1 | (removed) | RCW 84.64.225(1) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| platforms.2 | County treasurer | RCW 84.64.080(11) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| surplus.1 | If the highest bid exceeds the minimum bid, the excess is refunded to the record owner after recorded water-sewer district liens are paid, on application; if no claim is received within three years of the sale, it goes to the county current expense fund (RCW 84.64.080(10)). | RCW 84.64.080(10) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| es.rate | Sin tasa para el comprador de gravámenes. Interés sobre impuestos morosos fijado por la ley: 9% anual para propiedad residencial de cuatro unidades o menos, 12% anual para otra propiedad (RCW 84.56.020(5)) | RCW 84.56.020(5)(a) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| es.redemption | El propietario puede redimir hasta el cierre del día anterior a la venta (RCW 84.64.070(1)). El certificado de morosidad se emite tras tres años desde la morosidad (RCW 84.64.050(1)) | RCW 84.64.070(1) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| es.summary.1 | En Washington el tesorero del condado vende la propiedad ejecutada al mejor postor en la fecha que el tesorero indique (RCW 84.64.080(4), (5)). | RCW 84.64.080(5) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| es.summary.2 | La plataforma de subasta y quién la usa no los fijan los estatutos leídos. Confirme con el condado. | RCW 84.64.225(1) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| es.summary.3 | Los condados pueden disponer de la propiedad ejecutada por negociación privada, sin convocar ofertas, en casos listados (RCW 36.35.150). | RCW 36.35.150(1) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2036%20%20TITLE/RCW%20%2036%20.%2035%20%20CHAPTER/RCW%20%2036%20.%2035%20.150.pdf) | corrected |
| es.summary.4 | El certificado de morosidad se emite tras tres años desde la morosidad (RCW 84.64.050(1)). | RCW 36.35.150(1) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2036%20%20TITLE/RCW%20%2036%20.%2035%20%20CHAPTER/RCW%20%2036%20.%2035%20.150.pdf) | corrected |
| es.summary.5 | Estatuto: RCW 84.64.050, 84.64.070 y 84.64.080. | RCW 84.64.080(4) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| es.typeWhy.1 | Tras una sentencia judicial, el tesorero del condado vende la propiedad y otorga una escritura de impuestos al comprador (RCW 84.64.080(3), (11)). | RCW 84.64.080(11) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| es.typeWhy.2 | El propietario puede redimir solo hasta el cierre del día anterior a la venta (RCW 84.64.070(1)); las secciones leídas no dan redención posterior a la venta a adultos. | RCW 84.64.070(1) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| es.rateWhy.1 | Washington no fija tasa para el comprador; la tasa legal se aplica a impuestos morosos, 9% o 12% anual (RCW 84.56.020(5)). | RCW 84.56.020(5)(a) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| es.rateWhy.2 | (removed) | RCW 84.64.080(4) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| es.notBeginnerReason.1 | (removed) | RCW 84.64.050(1) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| es.notBeginnerReason.2 | (removed) | RCW 84.64.080(5) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| es.notBeginnerReason.3 | (removed) | RCW 84.64.080(5) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| es.beginnerTip.1 | (removed) | RCW 36.35.150(1) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2036%20%20TITLE/RCW%20%2036%20.%2035%20%20CHAPTER/RCW%20%2036%20.%2035%20.150.pdf) | corrected |
| es.beginnerTip.2 | (removed) | RCW 36.35.150(1) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2036%20%20TITLE/RCW%20%2036%20.%2035%20%20CHAPTER/RCW%20%2036%20.%2035%20.150.pdf) | corrected |
| es.risks.1 | (removed) | RCW 84.64.080(4) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| es.risks.2 | (removed) | RCW 84.64.050(1) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| es.risks.3 | (removed) | RCW 84.64.080(4) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| es.ddExtra.1 | Vendida "tal como está": sin responsabilidad alguna sobre el título, la zonificación, tamaño, ubicación ni idoneidad (RCW 84.64.080(4)). | RCW 84.64.080(4) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| es.ddExtra.2 | (removed) | RCW 84.64.080(4) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| es.ddExtra.3 | (removed) | RCW 84.64.080(4) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| es.signup.platform | Venta del tesorero del condado, en persona o por medios electrónicos (RCW 84.64.080(5), 84.64.225). Plataforma: Confirme con el condado. | RCW 84.64.225(1) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| es.signup.steps.1 | Aviso de venta: se fija durante diez días en tres lugares públicos del condado, uno en la oficina del tesorero (RCW 84.64.080(5)). | RCW 84.64.080(5) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| es.signup.steps.2 | Registro: Confirme con el condado. | RCW 84.64.225(1) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| es.signup.steps.3 | Registro y depósito: Confirme con el condado. | RCW 84.64.225(2) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| es.signup.steps.4 | Los condados pueden vender la propiedad ejecutada sin ofertas en casos listados (RCW 36.35.150). Contacte al condado. | RCW 36.35.150(1) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2036%20%20TITLE/RCW%20%2036%20.%2035%20%20CHAPTER/RCW%20%2036%20.%2035%20.150.pdf) | corrected |
| es.signup.deposit.1 | Depósito: si un condado fija uno para una subasta electrónica, el aviso de venta lo indica (RCW 84.64.225(2)). Montos: Confirme con el condado. | RCW 84.64.225(2) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| es.signup.deposit.2 | El depósito del postor ganador se aplica al saldo y se pierde si no cumple los términos de la venta (RCW 84.64.225(2)). | RCW 84.64.225(2) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2084%20%20TITLE/RCW%20%2084%20%20%20TITLE/RCW%20%2084%20%20%20COMBINEDTITLE.pdf) | corrected |
| es.otc.note.1 | Un condado puede disponer de la propiedad ejecutada por negociación privada, sin convocar ofertas, en casos listados (RCW 36.35.150). | RCW 36.35.150(1) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2036%20%20TITLE/RCW%20%2036%20.%2035%20%20CHAPTER/RCW%20%2036%20.%2035%20.150.pdf) | corrected |
| es.otc.note.2 | Listas actuales: Confirme con el condado. | RCW 36.35.150(1) | [link](https://lawfilesext.leg.wa.gov/Law/RCWPDF/RCW%20%2036%20%20TITLE/RCW%20%2036%20.%2035%20%20CHAPTER/RCW%20%2036%20.%2035%20.150.pdf) | corrected |

## Corrections (before → after)

- `type`: “Tax deed” → “Tax deed sale after court foreclosure (RCW 84.64.050, 84.64.080)”
- `rate`: “N/A” → “No lien-purchase rate. Interest on delinquent taxes set by law: 9% per year for residential property of four or fewer units, 12% per year for other property (RCW 84.56.020(5))”
- `rateNote`: “County auctions property — clean title conveyed” → “A redeeming owner pays interest at the statutory rate charged on delinquent taxes (RCW 84.64.070(1)); the 12% rate applies to all other property (RCW 84.56.020(5))”
- `redemption`: “3 years delinquency + county hold” → “Owner may redeem up to the close of business the day before the sale (RCW 84.64.070(1)). A certificate of delinquency is issued after three years from delinquency (RCW 84.64.050(1))”
- `bidMethod`: “Highest bidder” → “Highest and best bidder; the minimum bid is the total of taxes, interest and costs (RCW 84.64.080(4))”
- `statute`: “RCW Ch. 84.64” → “RCW 84.64.050, 84.64.070, 84.64.080 and 84.64.225”
- `auctionPlatform`: “County treasurer — online and in-person varies” → “The county treasurer sells at a location in the county, or by public auction by electronic media (RCW 84.64.080(5), 84.64.225). Platform: Confirm with the county.”
- `auctionTiming`: “Winter (most counties)” → “Date and time set by the county treasurer, with ten days of posted notice in three public places (RCW 84.64.080(5)). Dates: Confirm with the county.”
- `summary.1`: “Washington counties hold deed auctions in April and November.” → “In Washington the county treasurer sells foreclosed property to the highest and best bidder on a date the treasurer directs (RCW 84.64.080(4), (5)).”
- `summary.2`: “King, Pierce, and Snohomish use Bid4Assets.” → “The auction platform and who uses it are not set by the statutes read. Confirm with the county.”
- `summary.3`: “Tax title properties available for direct purchase. 3-year delinquency required before auction.” → “Counties may dispose of tax foreclosed property by private negotiation, without a call for bids, in listed cases (RCW 36.35.150). A certificate of delinquency issues after three years from delinquency (RCW 84.64.050(1)).”
- `summary.4`: “Statute: RCW §84.64.” → “Statute: RCW 84.64.050, 84.64.070 and 84.64.080.”
- `typeWhy.1`: “Washington sells the property deed outright at county-level auctions after a 3-year delinquency period.” → “After a court judgment, the county treasurer sells the property and executes a tax deed to the purchaser (RCW 84.64.080(3), (11)).”
- `typeWhy.2`: “There is no post-sale redemption.” → “The owner may redeem only until the close of business the day before the sale (RCW 84.64.070(1)); the sections read give no redemption after the sale for adults.”
- `rateWhy.1`: “Washington is a deed state with no statutory interest rate.” → “Washington sets no rate for a purchaser; the statutory rate applies to delinquent taxes, 9% or 12% per year (RCW 84.56.020(5)).”
- `rateWhy.2`: “Returns are market-driven through competitive bidding.” → “(removed)”
- `keyNotes.1`: “Clean title conveyed at sale — no post-sale redemption” → “The property is sold "as is" with no warranty of title (RCW 84.64.080(4)).”
- `keyNotes.2`: “Minimum bid includes all taxes, fees, penalties” → “The minimum bid is the total amount of taxes, interest, and costs (RCW 84.64.080(4)).”
- `keyNotes.3`: “Seattle-area properties attract institutional competition” → “(removed)”
- `notBeginnerReason.1`: “3-year delinquency plus county hold period.” → “(removed)”
- `notBeginnerReason.2`: “Auction windows in April and November.” → “(removed)”
- `notBeginnerReason.3`: “Tenant-friendly state.” → “(removed)”
- `beginnerTip.1`: “Tax title properties (available from the county assessor after the regular auction cycle) are your best beginner entry in Washington.” → “(removed)”
- `beginnerTip.2`: “Less competition than the regular auction, and often available at discounted prices.” → “(removed)”
- `risks.1`: “Strong tenant protections — eviction can take 12+ months in King County” → “(removed)”
- `risks.2`: “Long cycle before auctions” → “(removed)”
- `risks.3`: “King County: strong competition from institutional buyers” → “(removed)”
- `ddExtra.1`: “Verify the county's judicial foreclosure schedule and deed sale timing” → “Sold "as is": no warranty of any kind on title, zoning, size, location or fitness (RCW 84.64.080(4)).”
- `ddExtra.2`: “Check King County GIS for zoning designation before bidding” → “(removed)”
- `ddExtra.3`: “Verify no IRS liens — federal liens survive Washington tax sales” → “(removed)”
- `signup.platform`: “Bid4Assets.com (King, Pierce, Snohomish) + county-specific others” → “County treasurer sale, in person or by electronic media (RCW 84.64.080(5), 84.64.225). Platform: Confirm with the county.”
- `signup.steps.1`: “For King, Pierce, Snohomish: go to bid4assets.com and search Washington state” → “Sale notice: posted ten days in three public places in the county, one in the treasurer's office (RCW 84.64.080(5)).”
- `signup.steps.2`: “Create a Bid4Assets account and verify identity” → “Registration: Confirm with the county.”
- `signup.steps.3`: “Submit deposit and register for the April or November auction” → “Registration and deposit: Confirm with the county.”
- `signup.steps.4`: “For tax title properties: contact the county assessor directly for direct purchase list” → “Counties may sell tax foreclosed property without bids in listed cases (RCW 36.35.150). Contact the county.”
- `signup.deposit.1`: “Bid4Assets deposit: $500–$2,000.” → “Deposit: if a county sets one for an electronic auction, the sale notice states it (RCW 84.64.225(2)). Amounts: Confirm with the county.”
- `signup.deposit.2`: “Varies by county.” → “A winning bidder's deposit is applied to the balance, and forfeited if the bidder does not comply with the terms of sale (RCW 84.64.225(2)).”
- `otc.available`: “Available” → “Confirm with the county.”
- `otc.note.1`: “Tax title properties available for direct purchase from county assessor.” → “A county may dispose of tax foreclosed property by private negotiation, without a call for bids, in listed cases (RCW 36.35.150).”
- `otc.note.2`: “Contact King County Assessor's office for current list.” → “Current lists: Confirm with the county.”
- `platforms.1`: “Bid4Assets.com” → “(removed)”
- `platforms.2`: “County assessor offices” → “County treasurer”
- `surplus.1`: “Status pending — monitoring for legislative action.” → “If the highest bid exceeds the minimum bid, the excess is refunded to the record owner after recorded water-sewer district liens are paid, on application; if no claim is received within three years of the sale, it goes to the county current expense fund (RCW 84.64.080(10)).”

## Pass 2 trims, removals and notes

- `type`: was "Tax deed"
- `rate`: was "N/A"; statute sets delinquency interest
- `rateNote`: was "County auctions property — clean title conveyed"; "clean title" is not in the statute (sale is "as is", no title warranty)
- `redemption`: was "3 years delinquency + county hold"; "county hold" not in statute
- `bidMethod`: was "Highest bidder"
- `statute`: was "RCW Ch. 84.64"
- `auctionPlatform`: was "County treasurer — online and in-person varies"
- `auctionTiming`: was "Winter (most counties)"; not in statute
- `summary.1`: was "Washington counties hold deed auctions in April and November."; months are not in the statute
- `summary.2`: was "King, Pierce, and Snohomish use Bid4Assets."; vendor claim, no official source read
- `summary.3`: was "Tax title properties available for direct purchase. 3-year delinquency required before auction."
- `summary.4`: was "Statute: RCW §84.64."
- `typeWhy.1`: was "...deed outright at county-level auctions after a 3-year delinquency period."
- `typeWhy.2`: was "There is no post-sale redemption."; minors and persons adjudicated incompetent may redeem within three years of the sale (RCW 84.64.070(5)), so the flat statement was too broad
- `rateWhy.1`: was "Washington is a deed state with no statutory interest rate."
- `rateWhy.2`: removed: no official source (opinion, advice or market claim not in the statute)
- `keyNotes.1`: was "Clean title conveyed at sale — no post-sale redemption"; statute gives no title warranty
- `keyNotes.2`: was "Minimum bid includes all taxes, fees, penalties"
- `keyNotes.3`: removed: no official source (opinion, advice or market claim not in the statute)
- `notBeginnerReason.1`: removed: no official source (opinion, advice or market claim not in the statute)
- `notBeginnerReason.2`: removed: no official source (opinion, advice or market claim not in the statute)
- `notBeginnerReason.3`: removed: no official source (opinion, advice or market claim not in the statute)
- `beginnerTip.1`: removed: no official source (opinion, advice or market claim not in the statute)
- `beginnerTip.2`: removed: no official source (opinion, advice or market claim not in the statute)
- `risks.1`: removed: no official source (opinion, advice or market claim not in the statute)
- `risks.2`: removed: no official source (opinion, advice or market claim not in the statute)
- `risks.3`: removed: no official source (opinion, advice or market claim not in the statute)
- `ddExtra.1`: was "Verify the county's judicial foreclosure schedule and deed sale timing"
- `ddExtra.2`: removed: no official source (opinion, advice or market claim not in the statute)
- `ddExtra.3`: removed: no official source (opinion, advice or market claim not in the statute)
- `signup.platform`: was "Bid4Assets.com (King, Pierce, Snohomish) + county-specific others"
- `signup.steps.1`: was "For King, Pierce, Snohomish: go to bid4assets.com..."
- `signup.steps.2`: was "Create a Bid4Assets account and verify identity"
- `signup.steps.3`: was "Submit deposit and register for the April or November auction"
- `signup.steps.4`: was "...contact the county assessor directly for direct purchase list"
- `signup.deposit.1`: was "Bid4Assets deposit: $500–$2,000."
- `signup.deposit.2`: was "Varies by county."
- `otc.available`: was "Available"
- `otc.note.1`: was "Tax title properties available for direct purchase from county assessor."; the statute names the county legislative authority, not the assessor
- `otc.note.2`: was "Contact King County Assessor's office for current list."
- `platforms.1`: removed: no official source (opinion, advice or market claim not in the statute)
- `platforms.2`: was "County assessor offices"; the treasurer holds the sale
- `surplus.1`: was "Status pending — monitoring for legislative action."

## Conflicts (flagged)

None.
