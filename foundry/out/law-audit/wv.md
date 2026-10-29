# West Virginia (WV) law audit

Checked 2026-10-29. Status: done. Ledger: `cloudflare/data/law/wv.json`.

Official code access: West Virginia Code chapter 11A, article 3 sections fetched from code.wvlegislature.gov (West Virginia Legislature), page dated October 29, 2026.

## Finding

The site described the pre-2022 system (county sheriff lien sales in October and November, 12% on the bid, 18-month
redemption). 2022 Enrolled Committee Substitute for Senate Bill 552 repealed the sheriff sale sections (§§ 11A-3-5,
-14, -15, -19, -23 and others now read "[Repealed.]"). Now unredeemed property is certified to the State Auditor
(§ 11A-3-8), who certifies a sale list between March 1 and August 1 (§ 11A-3-44) and auctions the tax liens
(§ 11A-3-42) at the county courthouse to the highest eligible bidder within 90 days (§ 11A-3-45). Owners may redeem
until a tax deed is issued, paying the taxes, interest and charges due at the sale plus 1% per month from the sale
(§ 11A-3-56(a)): interest runs on the amount due at the sale, not on the bid. The purchaser must ask for the notice to
redeem within 120 days of the Auditor's approval or lose the purchase (§ 11A-3-52); the notice sets the deed date
(§ 11A-3-54). Unsold lands may be sold by the Auditor without auction at an agreed price (§ 11A-3-48). Former owners
may claim surplus in circuit court within two years after confirmation (§ 11A-3-65). All "18 months, not 12" claims,
the 70-80% redemption statistic, and mineral-rights and title opinions were removed.

## 2023 to 2026 enacted-law search

Read the "Bill History" and "Signed Bills" lists on code.wvlegislature.gov for every section cited (11A-3-5, -5a, -8,
-14, -15, -19, -23, -42, -44, -45, -48, -52, -54, -55, -56, -59, -65):
- 2023 Regular Session, Enrolled Committee Substitute for Senate Bill 548: amended §§ 11A-3-45, -48 and -56. Current
  text used. Effective date not on the code pages; not fetched.
- 2022 Regular Session, Enrolled Committee Substitute for Senate Bill 552 (before the 2023 window, but it is why most
  of the old claims are wrong): moved sales from the sheriff to the State Auditor.
- No other signed bills from 2023 to 2026 for these sections.

## Unreachable sources

None.

## Watch

- 2025 Regular Session SB 683 and 2026 Regular Session SB 651 appear in the bill history of §§ 11A-3-44, -45 and -65
  (SB 651) but not in the "Signed Bills" lists. Treated as not enacted. Recheck SB 651 (2026), which touches the
  surplus section.

## Claims

| id | shown | statute | link | status |
|---|---|---|---|---|
| type | Tax lien | W. Va. Code § 11A-3-42 | [link](https://code.wvlegislature.gov/11A-3-42/) | supported |
| rate | Maximum rate set by law: 1% per month on the taxes, interest and charges due at the sale | W. Va. Code § 11A-3-56(a)(1) | [link](https://code.wvlegislature.gov/11A-3-56/) | corrected |
| rateNote | Interest runs on the taxes, interest and charges due at the sale. State Auditor-run process | W. Va. Code § 11A-3-56(a)(1) | [link](https://code.wvlegislature.gov/11A-3-56/) | corrected |
| redemption | Until a tax deed is issued (date set in the notice to redeem) | W. Va. Code § 11A-3-56(a) | [link](https://code.wvlegislature.gov/11A-3-56/) | corrected |
| bidMethod | Highest eligible bidder | W. Va. Code § 11A-3-45(a) | [link](https://code.wvlegislature.gov/11A-3-45/) | corrected |
| statute | WV Code §11A-3-45 | W. Va. Code § 11A-3-45(a) | [link](https://code.wvlegislature.gov/11A-3-45/) | corrected |
| auctionPlatform | State Auditor — in person at the county courthouse | W. Va. Code § 11A-3-45(a) | [link](https://code.wvlegislature.gov/11A-3-45/) | corrected |
| auctionTiming | Within 90 days after the Auditor certifies the county list | W. Va. Code § 11A-3-45(a) | [link](https://code.wvlegislature.gov/11A-3-45/) | corrected |
| summary.1 | West Virginia State Auditor manages delinquent land sales. | W. Va. Code § 11A-3-45(a) | [link](https://code.wvlegislature.gov/11A-3-45/) | supported |
| summary.2 | The Auditor auctions tax liens at the county courthouse within 90 days after certifying the list. | W. Va. Code § 11A-3-45(a) | [link](https://code.wvlegislature.gov/11A-3-45/) | corrected |
| summary.3 | If not redeemed by the date in the notice to redeem, the purchaser may get a deed. | W. Va. Code § 11A-3-59 | [link](https://code.wvlegislature.gov/11A-3-59/) | corrected |
| summary.4 | A purchaser's rights may be assigned by written assignment filed with the Auditor. | W. Va. Code § 11A-3-52(d) | [link](https://code.wvlegislature.gov/11A-3-52/) | corrected |
| summary.5 | Statute: WV Code 11A Art.3. | W. Va. Code § 11A-3-42 | [link](https://code.wvlegislature.gov/11A-3-42/) | supported |
| typeWhy.1 | West Virginia's State Auditor sells tax liens on delinquent lands; if the owner does not redeem by the date in the notice to redeem, the purchaser may get a deed. | W. Va. Code § 11A-3-42 | [link](https://code.wvlegislature.gov/11A-3-42/) | corrected |
| typeWhy.2 | WV Code 11A Art.3. | W. Va. Code § 11A-3-42 | [link](https://code.wvlegislature.gov/11A-3-42/) | supported |
| rateWhy.1 | To redeem, the owner pays the taxes, interest and charges due at the sale plus interest at 1% per month from the sale date. | W. Va. Code § 11A-3-56(a)(1) | [link](https://code.wvlegislature.gov/11A-3-56/) | corrected |
| rateWhy.2 | A purchaser's rights may be assigned by written assignment. | W. Va. Code § 11A-3-52(d) | [link](https://code.wvlegislature.gov/11A-3-52/) | corrected |
| rateWhy.3 | WV Code 11A Art.3. | W. Va. Code § 11A-3-42 | [link](https://code.wvlegislature.gov/11A-3-42/) | supported |
| keyNotes.1 | Interest (1% per month) runs on the taxes, interest and charges due at the sale | W. Va. Code § 11A-3-56(a)(1) | [link](https://code.wvlegislature.gov/11A-3-56/) | corrected |
| keyNotes.2 | (removed) | W. Va. Code § 11A-3-56(a)(1) | [link](https://code.wvlegislature.gov/11A-3-56/) | corrected |
| keyNotes.3 | Sheriff sales were repealed; the State Auditor now conducts the sales | W. Va. Code § 11A-3-5 (repealed, 2022 SB 552) | [link](https://code.wvlegislature.gov/11A-3-5/) | corrected |
| notBeginnerReason.1 | The redemption deadline is the deed date set in the notice to redeem, not a fixed period. | W. Va. Code § 11A-3-54 | [link](https://code.wvlegislature.gov/11A-3-54/) | corrected |
| notBeginnerReason.2 | (removed) | W. Va. Code § 11A-3-54 | [link](https://code.wvlegislature.gov/11A-3-54/) | corrected |
| notBeginnerReason.3 | (removed) | W. Va. Code § 11A-3-54 | [link](https://code.wvlegislature.gov/11A-3-54/) | corrected |
| beginnerTip.1 | Within 120 days after the Auditor approves your purchase, you must take the steps to secure a deed, including asking for the notice to redeem. | W. Va. Code § 11A-3-52(a) | [link](https://code.wvlegislature.gov/11A-3-52/) | corrected |
| beginnerTip.2 | (removed) | W. Va. Code § 11A-3-52(a) | [link](https://code.wvlegislature.gov/11A-3-52/) | corrected |
| beginnerTip.3 | (removed) | W. Va. Code § 11A-3-52(a) | [link](https://code.wvlegislature.gov/11A-3-52/) | corrected |
| risks.1 | If you miss the 120-day deed steps, you lose the benefits of your purchase | W. Va. Code § 11A-3-52(b) | [link](https://code.wvlegislature.gov/11A-3-52/) | corrected |
| risks.2 | (removed) | W. Va. Code § 11A-3-52(b) | [link](https://code.wvlegislature.gov/11A-3-52/) | corrected |
| risks.3 | (removed) | W. Va. Code § 11A-3-52(b) | [link](https://code.wvlegislature.gov/11A-3-52/) | corrected |
| ddExtra.1 | Confirm the deed date stated in the notice to redeem | W. Va. Code § 11A-3-54 | [link](https://code.wvlegislature.gov/11A-3-54/) | corrected |
| ddExtra.2 | Ask the State Auditor about lands left unsold at auction, which it may sell without a new auction | W. Va. Code § 11A-3-48(a) | [link](https://code.wvlegislature.gov/11A-3-48/) | corrected |
| ddExtra.3 | (removed) | W. Va. Code § 11A-3-48(a) | [link](https://code.wvlegislature.gov/11A-3-48/) | corrected |
| signup.platform | State Auditor (auction at the county courthouse) | W. Va. Code § 11A-3-45(a) | [link](https://code.wvlegislature.gov/11A-3-45/) | corrected |
| signup.steps.1 | Check the State Auditor's certified sale list for your target county | W. Va. Code § 11A-3-44 | [link](https://code.wvlegislature.gov/11A-3-44/) | corrected |
| signup.steps.2 | Sales are held within 90 days after the Auditor certifies the list | W. Va. Code § 11A-3-45(a) | [link](https://code.wvlegislature.gov/11A-3-45/) | corrected |
| signup.steps.3 | Register with the Auditor's office before the auction, or sign a notarized affidavit on sale day | W. Va. Code § 11A-3-45(c) | [link](https://code.wvlegislature.gov/11A-3-45/) | corrected |
| signup.steps.4 | Your rights as purchaser may be assigned; the assignee files a written assignment with the Auditor | W. Va. Code § 11A-3-52(d) | [link](https://code.wvlegislature.gov/11A-3-52/) | corrected |
| signup.deposit.1 | Pay by check, U.S. currency or money order to the Auditor by close of business on sale day. | W. Va. Code § 11A-3-45(a) | [link](https://code.wvlegislature.gov/11A-3-45/) | corrected |
| signup.deposit.2 | Confirm with the State Auditor. | W. Va. Code § 11A-3-45(a) | [link](https://code.wvlegislature.gov/11A-3-45/) | corrected |
| otc.available | Yes: Auditor sale of unsold lands without auction | W. Va. Code § 11A-3-48(a) | [link](https://code.wvlegislature.gov/11A-3-48/) | corrected |
| otc.note.1 | Lands unsold at auction may be sold by the Auditor at a price agreed with the buyer. | W. Va. Code § 11A-3-48(b) | [link](https://code.wvlegislature.gov/11A-3-48/) | corrected |
| otc.note.2 | Ask the State Auditor about unsold lands. | W. Va. Code § 11A-3-48(a) | [link](https://code.wvlegislature.gov/11A-3-48/) | corrected |
| platforms.1 | County courthouse (auction site) | W. Va. Code § 11A-3-45(a) | [link](https://code.wvlegislature.gov/11A-3-45/) | corrected |
| platforms.2 | WV State Auditor | W. Va. Code § 11A-3-45(a) | [link](https://code.wvlegislature.gov/11A-3-45/) | supported |
| surplus.1 | Former owners may claim sale surplus above taxes, interest and costs by filing in circuit court within two years after the sale is confirmed (W. Va. Code § 11A-3-65). | W. Va. Code § 11A-3-65 | [link](https://code.wvlegislature.gov/11A-3-65/) | corrected |
| es.rate | Tasa máxima fijada por la ley: 1% mensual sobre los impuestos, intereses y cargos adeudados en la venta | W. Va. Code § 11A-3-56(a)(1) | [link](https://code.wvlegislature.gov/11A-3-56/) | corrected |
| es.redemption | Hasta que se emite la escritura fiscal (fecha fijada en el aviso de redención) | W. Va. Code § 11A-3-56(a) | [link](https://code.wvlegislature.gov/11A-3-56/) | corrected |
| es.summary.1 | El Auditor del Estado de Virginia Occidental gestiona las ventas de tierra en mora. | W. Va. Code § 11A-3-45(a) | [link](https://code.wvlegislature.gov/11A-3-45/) | supported |
| es.summary.2 | El Auditor subasta gravámenes fiscales en el tribunal del condado dentro de los 90 días después de certificar la lista. | W. Va. Code § 11A-3-45(a) | [link](https://code.wvlegislature.gov/11A-3-45/) | corrected |
| es.summary.3 | Si no se redime antes de la fecha del aviso de redención, el comprador puede obtener una escritura. | W. Va. Code § 11A-3-59 | [link](https://code.wvlegislature.gov/11A-3-59/) | corrected |
| es.summary.4 | Los derechos del comprador pueden cederse mediante una cesión escrita presentada ante el Auditor. | W. Va. Code § 11A-3-52(d) | [link](https://code.wvlegislature.gov/11A-3-52/) | corrected |
| es.summary.5 | Estatuto: WV Code 11A Art.3. | W. Va. Code § 11A-3-42 | [link](https://code.wvlegislature.gov/11A-3-42/) | supported |
| es.typeWhy.1 | El Auditor del Estado de Virginia Occidental vende gravámenes fiscales sobre tierras en mora; si el propietario no redime antes de la fecha del aviso de redención, el comprador puede obtener una escritura (WV Code 11A Art.3). | W. Va. Code § 11A-3-42 | [link](https://code.wvlegislature.gov/11A-3-42/) | corrected |
| es.rateWhy.1 | Para redimir, el propietario paga los impuestos, intereses y cargos adeudados en la venta más un interés del 1% mensual desde la fecha de venta. | W. Va. Code § 11A-3-56(a)(1) | [link](https://code.wvlegislature.gov/11A-3-56/) | corrected |
| es.rateWhy.2 | Los derechos del comprador pueden cederse mediante cesión escrita (WV Code 11A Art.3). | W. Va. Code § 11A-3-52(d) | [link](https://code.wvlegislature.gov/11A-3-52/) | corrected |
| es.notBeginnerReason.1 | El plazo de redención es la fecha de escritura fijada en el aviso de redención, no un período fijo. | W. Va. Code § 11A-3-54 | [link](https://code.wvlegislature.gov/11A-3-54/) | corrected |
| es.notBeginnerReason.2 | (removed) | W. Va. Code § 11A-3-54 | [link](https://code.wvlegislature.gov/11A-3-54/) | corrected |
| es.notBeginnerReason.3 | (removed) | W. Va. Code § 11A-3-54 | [link](https://code.wvlegislature.gov/11A-3-54/) | corrected |
| es.beginnerTip.1 | Dentro de los 120 días después de que el Auditor apruebe su compra, debe tomar los pasos para obtener la escritura, incluido pedir el aviso de redención. | W. Va. Code § 11A-3-52(a) | [link](https://code.wvlegislature.gov/11A-3-52/) | corrected |
| es.beginnerTip.2 | (removed) | W. Va. Code § 11A-3-52(a) | [link](https://code.wvlegislature.gov/11A-3-52/) | corrected |
| es.beginnerTip.3 | (removed) | W. Va. Code § 11A-3-52(a) | [link](https://code.wvlegislature.gov/11A-3-52/) | corrected |
| es.risks.1 | Si no cumple los pasos de 120 días para la escritura, pierde los beneficios de su compra | W. Va. Code § 11A-3-52(b) | [link](https://code.wvlegislature.gov/11A-3-52/) | corrected |
| es.risks.2 | (removed) | W. Va. Code § 11A-3-52(b) | [link](https://code.wvlegislature.gov/11A-3-52/) | corrected |
| es.risks.3 | (removed) | W. Va. Code § 11A-3-52(b) | [link](https://code.wvlegislature.gov/11A-3-52/) | corrected |
| es.ddExtra.1 | Confirme la fecha de escritura indicada en el aviso de redención | W. Va. Code § 11A-3-54 | [link](https://code.wvlegislature.gov/11A-3-54/) | corrected |
| es.ddExtra.2 | Pregunte al Auditor del Estado por tierras no vendidas en subasta, que puede vender sin nueva subasta | W. Va. Code § 11A-3-48(a) | [link](https://code.wvlegislature.gov/11A-3-48/) | corrected |
| es.ddExtra.3 | (removed) | W. Va. Code § 11A-3-48(a) | [link](https://code.wvlegislature.gov/11A-3-48/) | corrected |
| es.signup.platform | Auditor del Estado (subasta en el tribunal del condado) | W. Va. Code § 11A-3-45(a) | [link](https://code.wvlegislature.gov/11A-3-45/) | corrected |
| es.signup.steps.1 | Revise la lista de venta certificada por el Auditor del Estado para su condado objetivo | W. Va. Code § 11A-3-44 | [link](https://code.wvlegislature.gov/11A-3-44/) | corrected |
| es.signup.steps.2 | Las ventas se realizan dentro de los 90 días después de que el Auditor certifica la lista | W. Va. Code § 11A-3-45(a) | [link](https://code.wvlegislature.gov/11A-3-45/) | corrected |
| es.signup.steps.3 | Regístrese en la oficina del Auditor antes de la subasta, o firme una declaración jurada notariada el día de la venta | W. Va. Code § 11A-3-45(c) | [link](https://code.wvlegislature.gov/11A-3-45/) | corrected |
| es.signup.steps.4 | Sus derechos como comprador pueden cederse; el cesionario presenta una cesión escrita ante el Auditor | W. Va. Code § 11A-3-52(d) | [link](https://code.wvlegislature.gov/11A-3-52/) | corrected |
| es.signup.deposit.1 | Pague con cheque, efectivo en dólares o giro postal al Auditor antes del cierre del día de la venta. | W. Va. Code § 11A-3-45(a) | [link](https://code.wvlegislature.gov/11A-3-45/) | corrected |
| es.signup.deposit.2 | Confirme con el Auditor del Estado. | W. Va. Code § 11A-3-45(a) | [link](https://code.wvlegislature.gov/11A-3-45/) | corrected |
| es.otc.note.1 | El Auditor puede vender las tierras no vendidas en subasta a un precio acordado con el comprador. | W. Va. Code § 11A-3-48(b) | [link](https://code.wvlegislature.gov/11A-3-48/) | corrected |
| es.otc.note.2 | Pregunte al Auditor del Estado por tierras no vendidas. | W. Va. Code § 11A-3-48(a) | [link](https://code.wvlegislature.gov/11A-3-48/) | corrected |

## Corrections (before → after)

- `rate`: “12%” → “Maximum rate set by law: 1% per month on the taxes, interest and charges due at the sale”
- `rateNote`: “Interest on bid amount — not on tax amount. Sheriff-run process” → “Interest runs on the taxes, interest and charges due at the sale. State Auditor-run process”
- `redemption`: “18 months” → “Until a tax deed is issued (date set in the notice to redeem)”
- `bidMethod`: “Highest bidder (premium bid)” → “Highest eligible bidder”
- `statute`: “WV Code §11A-3-9” → “WV Code §11A-3-45”
- `auctionPlatform`: “Sheriff-run — in-person” → “State Auditor — in person at the county courthouse”
- `auctionTiming`: “October–November” → “Within 90 days after the Auditor certifies the county list”
- `summary.2`: “Annual lien sales October 14–November 23 by county sheriff.” → “The Auditor auctions tax liens at the county courthouse within 90 days after certifying the list.”
- `summary.3`: “Unredeemed liens after 18 months → deed sales as needed.” → “If not redeemed by the date in the notice to redeem, the purchaser may get a deed.”
- `summary.4`: “Certificate is assignable.” → “A purchaser's rights may be assigned by written assignment filed with the Auditor.”
- `typeWhy.1`: “West Virginia is a hybrid state — the county sheriff sells tax lien certificates annually, and if unredeemed after 18 months, the properties go to a separate deed sale managed by the State Auditor.” → “West Virginia's State Auditor sells tax liens on delinquent lands; if the owner does not redeem by the date in the notice to redeem, the purchaser may get a deed.”
- `rateWhy.1`: “West Virginia sets a statutory interest rate of 12% per annum on tax lien certificates during the 18-month redemption period.” → “To redeem, the owner pays the taxes, interest and charges due at the sale plus interest at 1% per month from the sale date.”
- `rateWhy.2`: “Certificates are assignable.” → “A purchaser's rights may be assigned by written assignment.”
- `keyNotes.1`: “12% is on the BID amount — not just the tax amount” → “Interest (1% per month) runs on the taxes, interest and charges due at the sale”
- `keyNotes.2`: “High redemption rate (~70–80%) — most liens pay out, rarely reach deed” → “(removed)”
- `keyNotes.3`: “Sheriff conducts sales — not county treasurer” → “Sheriff sales were repealed; the State Auditor now conducts the sales”
- `notBeginnerReason.1`: “Often misquoted as 12-month redemption — it's actually 18 months.” → “The redemption deadline is the deed date set in the notice to redeem, not a fixed period.”
- `notBeginnerReason.2`: “Mineral rights commonly separated.” → “(removed)”
- `notBeginnerReason.3`: “Complex title history.” → “(removed)”
- `beginnerTip.1`: “Confirm the 18-month redemption period before planning your deed execution.” → “Within 120 days after the Auditor approves your purchase, you must take the steps to secure a deed, including asking for the notice to redeem.”
- `beginnerTip.2`: “Many investors incorrectly plan for 12 months and are caught off guard.” → “(removed)”
- `beginnerTip.3`: “Also check for separated mineral rights on any rural WV parcel — they're extremely common.” → “(removed)”
- `risks.1`: “Redemption period is 18 months — commonly misquoted as 12 months” → “If you miss the 120-day deed steps, you lose the benefits of your purchase”
- `risks.2`: “Separated mineral rights are common on rural WV parcels — affects land value significantly” → “(removed)”
- `risks.3`: “Title issues on deed sale properties are common — quiet title may be required” → “(removed)”
- `ddExtra.1`: “Confirm the exact redemption expiration date — 18 months, not 12” → “Confirm the deed date stated in the notice to redeem”
- `ddExtra.2`: “Check the WV State Auditor's delinquent land list for additional inventory” → “Ask the State Auditor about lands left unsold at auction, which it may sell without a new auction”
- `ddExtra.3`: “Verify mineral rights status — separated rights are very common in WV” → “(removed)”
- `signup.platform`: “County sheriff (in-person, October–November)” → “State Auditor (auction at the county courthouse)”
- `signup.steps.1`: “Find your target county sheriff at wv.gov/government/counties.aspx” → “Check the State Auditor's certified sale list for your target county”
- `signup.steps.2`: “Contact the sheriff's office in September to confirm the sale schedule and property list” → “Sales are held within 90 days after the Auditor certifies the list”
- `signup.steps.3`: “Register in person for the October–November auction window” → “Register with the Auditor's office before the auction, or sign a notarized affidavit on sale day”
- `signup.steps.4`: “Note: the lien certificate you receive is assignable — you can transfer it” → “Your rights as purchaser may be assigned; the assignee files a written assignment with the Auditor”
- `signup.deposit.1`: “Varies by county.” → “Pay by check, U.S. currency or money order to the Auditor by close of business on sale day.”
- `signup.deposit.2`: “Confirm with county sheriff.” → “Confirm with the State Auditor.”
- `otc.available`: “Not generally available” → “Yes: Auditor sale of unsold lands without auction”
- `otc.note.1`: “No OTC.” → “Lands unsold at auction may be sold by the Auditor at a price agreed with the buyer.”
- `otc.note.2`: “Check WV State Auditor's delinquent land list for additional opportunities.” → “Ask the State Auditor about unsold lands.”
- `platforms.1`: “County sheriff offices” → “County courthouse (auction site)”
- `surplus.1`: “Status pending — monitoring for legislative action.” → “Former owners may claim sale surplus above taxes, interest and costs by filing in circuit court within two years after the sale is confirmed (W. Va. Code § 11A-3-65).”

## Pass 2 trims, removals and notes

- `rate`: was "12%"
- `rateNote`: was "Interest on bid amount — not on tax amount. Sheriff-run process" (contradicted by § 11A-3-56(a)(1)). pass 2: Auditor part rests on § 11A-3-45
- `redemption`: was "18 months". pass 2: notice date rests on § 11A-3-54
- `bidMethod`: was "Highest bidder (premium bid)"
- `statute`: was "WV Code §11A-3-9" (sheriff's list section, not the sale)
- `auctionPlatform`: was "Sheriff-run — in-person"
- `auctionTiming`: was "October–November"
- `summary.2`: was "Annual lien sales October 14–November 23 by county sheriff." (sheriff sale repealed 2022). pass 2: "tax liens" rests on § 11A-3-42
- `summary.3`: was "Unredeemed liens after 18 months → deed sales as needed."
- `summary.4`: was "Certificate is assignable." (§ 11A-3-15 repealed)
- `typeWhy.1`: was "hybrid state — the county sheriff sells tax lien certificates annually ... 18 months". pass 2: deed part rests on § 11A-3-59
- `rateWhy.1`: was "12% per annum on tax lien certificates during the 18-month redemption period"
- `rateWhy.2`: was "Certificates are assignable."
- `keyNotes.1`: was "12% is on the BID amount — not just the tax amount" (contradicted)
- `keyNotes.2`: removed: no official source (statistic, opinion or mineral/title claim not in the statutes fetched)
- `keyNotes.3`: was "Sheriff conducts sales — not county treasurer". pass 2: Auditor part rests on § 11A-3-45
- `notBeginnerReason.1`: removed: the 18-month period is not in current law; redemption runs until the deed date set in the notice to redeem (§§ 11A-3-54, -56)
- `notBeginnerReason.2`: removed: no official source (statistic, opinion or mineral/title claim not in the statutes fetched)
- `notBeginnerReason.3`: removed: no official source (statistic, opinion or mineral/title claim not in the statutes fetched)
- `beginnerTip.1`: was "Confirm the 18-month redemption period before planning your deed execution."
- `beginnerTip.2`: removed: the 18-month period is not in current law; redemption runs until the deed date set in the notice to redeem (§§ 11A-3-54, -56)
- `beginnerTip.3`: removed: no official source (statistic, opinion or mineral/title claim not in the statutes fetched)
- `risks.1`: removed: the 18-month period is not in current law; redemption runs until the deed date set in the notice to redeem (§§ 11A-3-54, -56)
- `risks.2`: removed: no official source (statistic, opinion or mineral/title claim not in the statutes fetched)
- `risks.3`: removed: no official source (statistic, opinion or mineral/title claim not in the statutes fetched)
- `ddExtra.1`: was "Confirm the exact redemption expiration date — 18 months, not 12"
- `ddExtra.2`: was "Check the WV State Auditor's delinquent land list for additional inventory"
- `ddExtra.3`: removed: no official source (statistic, opinion or mineral/title claim not in the statutes fetched)
- `signup.platform`: was "County sheriff (in-person, October–November)"
- `signup.steps.1`: removed wv.gov county directory
- `signup.steps.2`: was "Contact the sheriff's office in September to confirm the sale schedule and property list"
- `signup.steps.3`: was "Register in person for the October–November auction window"
- `signup.steps.4`: was "the lien certificate you receive is assignable — you can transfer it"
- `signup.deposit.1`: was "Varies by county."
- `signup.deposit.2`: was "Confirm with county sheriff."
- `otc.available`: was "Not generally available"
- `otc.note.1`: was "No OTC." (contradicted by § 11A-3-48)
- `otc.note.2`: trimmed
- `platforms.1`: was "County sheriff offices"
- `surplus.1`: was "Status pending — monitoring for legislative action."

## Conflicts (flagged)

None.
