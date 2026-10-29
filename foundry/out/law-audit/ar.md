# Arkansas (AR) law audit

Checked 2026-10-29. Status: done. Ledger: `cloudflare/data/law/ar.json`.

Official code access: The Arkansas Code is published free through a LexisNexis-hosted site that needs JavaScript and was not fetched. Claims rest on the Arkansas Commissioner of State Lands (state agency) pages at cosl.org and its Rules (2023 ed.) and buyer's guide PDFs, which cosl.org links from its tax-sale page (stored at coslstorage.blob.core.windows.net).

## Finding

Re-verified the first run's change. The Commissioner of State Lands (COSL) states that "Effective July 1, 2023, parcels
sold through the Commissioner of State Lands office cannot be redeemed"; owners may redeem until 4 p.m. on the last
business day before the sale. So the old "2 years", "30-day redemption" and "redeemable deed" claims are wrong; the first
run's "None post-sale" was right. Sales: live auction once a year in the county or a neighboring county; unsold parcels
go to an online auction (auction.cosl.org) after 30 days; minimum bid is the delinquent taxes, penalties, interest,
fees and costs; highest bidder; full payment at the sale, no cash. The buyer gets a Limited Warranty Deed conveying the
state's interest; deed challenges must be filed within 90 days of conveyance (COSL Rules, citing Ark. Code § 26-37-203).
Excess proceeds are held for the former owner, who may apply (COSL Rules Title 4). Removed: "fastest in the US",
Ozarks/Delta volume, land-quality and access opinions, "clean title", "No deposit needed to browse".

Source choice: the Arkansas Code's free public copy is LexisNexis-hosted and needs JavaScript, so this run cites the
COSL (state agency) pages and the Rules and buyer's guide PDFs that cosl.org links (stored on COSL's Azure blob
storage, added to official-domains.json with that reason). No claim cites Ark. Code text directly; the statute field
§ 26-37-101 is confirmed only through the Rules' own citation.

## 2023 to 2026 enacted-law search

Not done from legislature sources this run: arkleg.state.ar.us act search was not used. The COSL notice and Rules record
the July 1, 2023 end of post-sale redemption and Ark. Code § 26-37-317 (dishonored payments, effective July 31, 2023).
The act number behind the July 1, 2023 change was not identified. Next run on AR: find the 2023 act on arkleg.state.ar.us
and cite it.

## Unreachable sources

None marked. Arkansas Code (LexisNexis-hosted) not attempted with the download script; it needs JavaScript.

## Watch

- Identify the 2023 act ending post-sale redemption and any 2025 acts on excess proceeds (post-Tyler).

## Claims

| id | shown | statute | link | status |
|---|---|---|---|---|
| type | Tax deed | none: administrative practice (Commissioner of State Lands), FAQ | [link](https://www.cosl.org/Home/Faq) | supported |
| rate | N/A (no redemption after the sale) | none: administrative practice (Commissioner of State Lands), notice for bidders | [link](https://www.cosl.org/Home/Contents/1) | corrected |
| rateNote | No redemption after the sale; owners may redeem until 4 p.m. the last business day before the sale | none: administrative practice (Commissioner of State Lands), FAQ | [link](https://www.cosl.org/Home/Faq) | corrected |
| redemption | None after the sale (redeem until 4 p.m. the last business day before the sale) | none: administrative practice (Commissioner of State Lands), FAQ | [link](https://www.cosl.org/Home/Faq) | corrected |
| bidMethod | Highest bidder | Commissioner of State Lands Rules (2023 ed.), Title 2 | [link](https://coslstorage.blob.core.windows.net/web-resources/rules-and-regs.pdf) | supported |
| statute | Ark. Code §26-37-101 | Ark. Code Ann. §§ 26-37-101 to -105 (as cited in Commissioner of State Lands Rules (2023 ed.)) | [link](https://coslstorage.blob.core.windows.net/web-resources/rules-and-regs.pdf) | supported |
| auctionPlatform | Commissioner of State Lands — live auction in the county or a neighboring county | none: administrative practice (Commissioner of State Lands), FAQ | [link](https://www.cosl.org/Home/Faq) | corrected |
| auctionTiming | Once a year per county; unsold parcels go online after 30 days | none: administrative practice (Commissioner of State Lands), FAQ | [link](https://www.cosl.org/Home/Faq) | corrected |
| summary.1 | Arkansas counties certify tax-delinquent parcels to the Commissioner of State Lands, which sells them. | Commissioner of State Lands Rules (2023 ed.), Title 1 | [link](https://coslstorage.blob.core.windows.net/web-resources/rules-and-regs.pdf) | corrected |
| summary.2 | Unsold parcels can be bought through the Commissioner's online auction. | none: administrative practice (Commissioner of State Lands), FAQ | [link](https://www.cosl.org/Home/Faq) | corrected |
| summary.3 | The buyer gets a Limited Warranty Deed, conveying whatever interest the state has. | none: administrative practice (Commissioner of State Lands), FAQ | [link](https://www.cosl.org/Home/Faq) | corrected |
| summary.4 | Statute: ACA §26-37-101. | Ark. Code Ann. §§ 26-37-101 to -105 (as cited in Commissioner of State Lands Rules (2023 ed.)) | [link](https://coslstorage.blob.core.windows.net/web-resources/rules-and-regs.pdf) | supported |
| typeWhy.1 | Arkansas sells tax-delinquent land by deed; since July 1, 2023, parcels sold by the Commissioner cannot be redeemed. | none: administrative practice (Commissioner of State Lands), notice for bidders | [link](https://www.cosl.org/Home/Contents/1) | corrected |
| typeWhy.2 | The state's Limited Warranty Deed conveys whatever interest the state has in the property. | none: administrative practice (Commissioner of State Lands), FAQ | [link](https://www.cosl.org/Home/Faq) | corrected |
| typeWhy.3 | ACA §26-37-101. | Ark. Code Ann. §§ 26-37-101 to -105 (as cited in Commissioner of State Lands Rules (2023 ed.)) | [link](https://coslstorage.blob.core.windows.net/web-resources/rules-and-regs.pdf) | supported |
| rateWhy.1 | There is no interest rate: the minimum bid is the delinquent taxes, penalties, interest, fees and costs. | Commissioner of State Lands Rules (2023 ed.), Title 2 | [link](https://coslstorage.blob.core.windows.net/web-resources/rules-and-regs.pdf) | corrected |
| rateWhy.2 | ACA §26-37-101. | Ark. Code Ann. §§ 26-37-101 to -105 (as cited in Commissioner of State Lands Rules (2023 ed.)) | [link](https://coslstorage.blob.core.windows.net/web-resources/rules-and-regs.pdf) | supported |
| keyNotes.1 | No redemption after the sale since July 1, 2023 | none: administrative practice (Commissioner of State Lands), notice for bidders | [link](https://www.cosl.org/Home/Contents/1) | corrected |
| keyNotes.2 | (removed) | none: administrative practice (Commissioner of State Lands), notice for bidders | [link](https://www.cosl.org/Home/Contents/1) | corrected |
| keyNotes.3 | The Commissioner makes no promise that the property is usable, accessible or exists | none: administrative practice (Commissioner of State Lands), buyer's guide | [link](https://coslstorage.blob.core.windows.net/web-resources/purchasing.pdf) | corrected |
| beginnerTip.1 | Unsold parcels can be bid on online at auction.cosl.org, starting 30 days after the live auction. | none: administrative practice (Commissioner of State Lands), FAQ | [link](https://www.cosl.org/Home/Faq) | corrected |
| beginnerTip.2 | (removed) | none: administrative practice (Commissioner of State Lands), FAQ | [link](https://www.cosl.org/Home/Faq) | corrected |
| beginnerTip.3 | Research the property with the county assessor before you bid. | none: administrative practice (Commissioner of State Lands), FAQ | [link](https://www.cosl.org/Home/Faq) | corrected |
| risks.1 | The Commissioner recommends no significant improvements before the 90-day litigation period ends | none: administrative practice (Commissioner of State Lands), FAQ | [link](https://www.cosl.org/Home/Faq) | corrected |
| risks.2 | (removed) | none: administrative practice (Commissioner of State Lands), FAQ | [link](https://www.cosl.org/Home/Faq) | corrected |
| risks.3 | Buyers usually use the Limited Warranty Deed to bring a quiet title action | Commissioner of State Lands Rules (2023 ed.), Definitions | [link](https://coslstorage.blob.core.windows.net/web-resources/rules-and-regs.pdf) | corrected |
| risks.4 | (removed) | none: administrative practice (Commissioner of State Lands), FAQ | [link](https://www.cosl.org/Home/Faq) | corrected |
| ddExtra.1 | Check county assessor, tax collector and circuit clerk records for other fees owed | none: administrative practice (Commissioner of State Lands), FAQ | [link](https://www.cosl.org/Home/Faq) | corrected |
| ddExtra.2 | Ask the county assessor about the property's location and structures | none: administrative practice (Commissioner of State Lands), FAQ | [link](https://www.cosl.org/Home/Faq) | corrected |
| ddExtra.3 | Expect to use the Limited Warranty Deed in a quiet title action | Commissioner of State Lands Rules (2023 ed.), Definitions | [link](https://coslstorage.blob.core.windows.net/web-resources/rules-and-regs.pdf) | corrected |
| signup.platform | cosl.org (Commissioner of State Lands) | none: administrative practice (Commissioner of State Lands), FAQ | [link](https://www.cosl.org/Home/Faq) | supported |
| signup.steps.1 | Find upcoming sales in the Public Auction Catalog on cosl.org | none: administrative practice (Commissioner of State Lands), FAQ | [link](https://www.cosl.org/Home/Faq) | corrected |
| signup.steps.2 | Live auctions: register at the sale site, starting 1 hour before the auction | none: administrative practice (Commissioner of State Lands), buyer's guide | [link](https://coslstorage.blob.core.windows.net/web-resources/purchasing.pdf) | corrected |
| signup.steps.3 | Unsold parcels: bid online at auction.cosl.org | none: administrative practice (Commissioner of State Lands), FAQ | [link](https://www.cosl.org/Home/Faq) | corrected |
| signup.steps.4 | Pay the full price at the sale by check, card, cashier's check or money order | none: administrative practice (Commissioner of State Lands), notice for bidders | [link](https://www.cosl.org/Home/Contents/1) | corrected |
| signup.deposit.1 | Payment required at time of purchase. | Commissioner of State Lands Rules (2023 ed.), Title 2 | [link](https://coslstorage.blob.core.windows.net/web-resources/rules-and-regs.pdf) | supported |
| signup.deposit.2 | (removed) | Commissioner of State Lands Rules (2023 ed.), Title 2 | [link](https://coslstorage.blob.core.windows.net/web-resources/rules-and-regs.pdf) | corrected |
| otc.available | Yes: online auction of unsold parcels | none: administrative practice (Commissioner of State Lands), FAQ | [link](https://www.cosl.org/Home/Faq) | corrected |
| otc.note.1 | Parcels unsold at the live auction go to the online post-auction list after 30 days. | none: administrative practice (Commissioner of State Lands), FAQ | [link](https://www.cosl.org/Home/Faq) | corrected |
| otc.note.2 | Online sales of unsold parcels go to the highest bidder. | Commissioner of State Lands Rules (2023 ed.), Definitions | [link](https://coslstorage.blob.core.windows.net/web-resources/rules-and-regs.pdf) | corrected |
| platforms.1 | cosl.org | none: administrative practice (Commissioner of State Lands), FAQ | [link](https://www.cosl.org/Home/Faq) | supported |
| surplus.1 | Sale money above taxes, fees and costs is held by the Commissioner for the former owner, who may apply for it (Commissioner of State Lands Rules, Title 4). | Commissioner of State Lands Rules (2023 ed.), Title 4 | [link](https://coslstorage.blob.core.windows.net/web-resources/rules-and-regs.pdf) | corrected |
| es.rate | N/A (sin redención después de la venta) | none: administrative practice (Commissioner of State Lands), notice for bidders | [link](https://www.cosl.org/Home/Contents/1) | corrected |
| es.redemption | Ninguna después de la venta (redima antes de las 4 p.m. del último día hábil previo a la venta) | none: administrative practice (Commissioner of State Lands), FAQ | [link](https://www.cosl.org/Home/Faq) | corrected |
| es.summary.1 | Los condados de Arkansas certifican las parcelas con impuestos morosos al Comisionado de Tierras del Estado, que las vende. | Commissioner of State Lands Rules (2023 ed.), Title 1 | [link](https://coslstorage.blob.core.windows.net/web-resources/rules-and-regs.pdf) | corrected |
| es.summary.2 | Las parcelas no vendidas pueden comprarse en la subasta en línea del Comisionado. | none: administrative practice (Commissioner of State Lands), FAQ | [link](https://www.cosl.org/Home/Faq) | corrected |
| es.summary.3 | El comprador recibe una Escritura de Garantía Limitada, que transmite el interés que tenga el estado. | none: administrative practice (Commissioner of State Lands), FAQ | [link](https://www.cosl.org/Home/Faq) | corrected |
| es.summary.4 | Estatuto: ACA §26-37-101. | Ark. Code Ann. §§ 26-37-101 to -105 (as cited in Commissioner of State Lands Rules (2023 ed.)) | [link](https://coslstorage.blob.core.windows.net/web-resources/rules-and-regs.pdf) | supported |
| es.typeWhy.1 | Arkansas vende tierras con impuestos morosos por escritura; desde el 1 de julio de 2023, las parcelas vendidas por el Comisionado no pueden redimirse (ACA §26-37-101). | none: administrative practice (Commissioner of State Lands), notice for bidders | [link](https://www.cosl.org/Home/Contents/1) | corrected |
| es.rateWhy.1 | No hay tasa de interés: la oferta mínima es el total de impuestos morosos, multas, intereses, cargos y costos. | Commissioner of State Lands Rules (2023 ed.), Title 2 | [link](https://coslstorage.blob.core.windows.net/web-resources/rules-and-regs.pdf) | corrected |
| es.rateWhy.2 | ACA §26-37-101. | Ark. Code Ann. §§ 26-37-101 to -105 (as cited in Commissioner of State Lands Rules (2023 ed.)) | [link](https://coslstorage.blob.core.windows.net/web-resources/rules-and-regs.pdf) | corrected |
| es.beginnerTip.1 | Las parcelas no vendidas pueden ofertarse en línea en auction.cosl.org, a partir de 30 días después de la subasta presencial. | none: administrative practice (Commissioner of State Lands), FAQ | [link](https://www.cosl.org/Home/Faq) | corrected |
| es.beginnerTip.2 | (removed) | none: administrative practice (Commissioner of State Lands), FAQ | [link](https://www.cosl.org/Home/Faq) | corrected |
| es.risks.1 | El Comisionado recomienda no hacer mejoras importantes antes de que termine el período de litigio de 90 días | none: administrative practice (Commissioner of State Lands), FAQ | [link](https://www.cosl.org/Home/Faq) | corrected |
| es.risks.2 | (removed) | none: administrative practice (Commissioner of State Lands), FAQ | [link](https://www.cosl.org/Home/Faq) | corrected |
| es.risks.3 | Los compradores suelen usar la Escritura de Garantía Limitada para una acción de saneamiento de título | Commissioner of State Lands Rules (2023 ed.), Definitions | [link](https://coslstorage.blob.core.windows.net/web-resources/rules-and-regs.pdf) | corrected |
| es.risks.4 | (removed) | none: administrative practice (Commissioner of State Lands), FAQ | [link](https://www.cosl.org/Home/Faq) | corrected |
| es.ddExtra.1 | Revise los registros del tasador, el recaudador y el secretario del tribunal del condado por otros cargos adeudados | none: administrative practice (Commissioner of State Lands), FAQ | [link](https://www.cosl.org/Home/Faq) | corrected |
| es.ddExtra.2 | Pregunte al tasador del condado por la ubicación y las construcciones de la propiedad | none: administrative practice (Commissioner of State Lands), FAQ | [link](https://www.cosl.org/Home/Faq) | corrected |
| es.ddExtra.3 | Prevea usar la Escritura de Garantía Limitada en una acción de saneamiento de título | Commissioner of State Lands Rules (2023 ed.), Definitions | [link](https://coslstorage.blob.core.windows.net/web-resources/rules-and-regs.pdf) | corrected |
| es.signup.platform | cosl.org (Comisionado de Tierras del Estado) | none: administrative practice (Commissioner of State Lands), FAQ | [link](https://www.cosl.org/Home/Faq) | supported |
| es.signup.steps.1 | Encuentre las próximas ventas en el Catálogo de Subastas Públicas en cosl.org | none: administrative practice (Commissioner of State Lands), FAQ | [link](https://www.cosl.org/Home/Faq) | corrected |
| es.signup.steps.2 | Subastas presenciales: regístrese en el lugar de la venta, desde 1 hora antes de la subasta | none: administrative practice (Commissioner of State Lands), buyer's guide | [link](https://coslstorage.blob.core.windows.net/web-resources/purchasing.pdf) | corrected |
| es.signup.steps.3 | Parcelas no vendidas: oferte en línea en auction.cosl.org | none: administrative practice (Commissioner of State Lands), FAQ | [link](https://www.cosl.org/Home/Faq) | corrected |
| es.signup.steps.4 | Pague el precio total en la venta con cheque, tarjeta, cheque de caja o giro postal | none: administrative practice (Commissioner of State Lands), notice for bidders | [link](https://www.cosl.org/Home/Contents/1) | corrected |
| es.signup.deposit.1 | Pago requerido al momento de la compra. | Commissioner of State Lands Rules (2023 ed.), Title 2 | [link](https://coslstorage.blob.core.windows.net/web-resources/rules-and-regs.pdf) | supported |
| es.signup.deposit.2 | (removed) | Commissioner of State Lands Rules (2023 ed.), Title 2 | [link](https://coslstorage.blob.core.windows.net/web-resources/rules-and-regs.pdf) | corrected |
| es.otc.note.1 | Las parcelas no vendidas en la subasta presencial pasan a la lista en línea posterior a la subasta después de 30 días. | none: administrative practice (Commissioner of State Lands), FAQ | [link](https://www.cosl.org/Home/Faq) | corrected |
| es.otc.note.2 | Las ventas en línea de parcelas no vendidas son para el mejor postor. | Commissioner of State Lands Rules (2023 ed.), Definitions | [link](https://coslstorage.blob.core.windows.net/web-resources/rules-and-regs.pdf) | corrected |

## Corrections (before → after)

- `rate`: “Penalty only” → “N/A (no redemption after the sale)”
- `rateNote`: “30-day redemption only — fastest deed resolution in the US” → “No redemption after the sale; owners may redeem until 4 p.m. the last business day before the sale”
- `redemption`: “2 years” → “None after the sale (redeem until 4 p.m. the last business day before the sale)”
- `auctionPlatform`: “County-run — in-person” → “Commissioner of State Lands — live auction in the county or a neighboring county”
- `auctionTiming`: “Year-round” → “Once a year per county; unsold parcels go online after 30 days”
- `summary.1`: “Arkansas Commissioner of State Lands (COSL) manages all tax-delinquent properties statewide.” → “Arkansas counties certify tax-delinquent parcels to the Commissioner of State Lands, which sells them.”
- `summary.2`: “Online purchasing available.” → “Unsold parcels can be bought through the Commissioner's online auction.”
- `summary.3`: “Deed issued is quitclaim-equivalent with a 90-day litigation risk window.” → “The buyer gets a Limited Warranty Deed, conveying whatever interest the state has.”
- `typeWhy.1`: “Arkansas transfers the deed at sale but grants the original owner a 2-year right of redemption, making it a redeemable deed state.” → “Arkansas sells tax-delinquent land by deed; since July 1, 2023, parcels sold by the Commissioner cannot be redeemed.”
- `typeWhy.2`: “The deed issued is a quitclaim-equivalent managed through the Commissioner of State Lands.” → “The state's Limited Warranty Deed conveys whatever interest the state has in the property.”
- `rateWhy.1`: “Arkansas uses a penalty-only structure rather than an interest rate — the redemption cost is set by statute as a flat penalty on the original tax amount owed.” → “There is no interest rate: the minimum bid is the delinquent taxes, penalties, interest, fees and costs.”
- `keyNotes.1`: “30-day redemption is one of the shortest in the US — fast resolution for investors” → “No redemption after the sale since July 1, 2023”
- `keyNotes.2`: “Strong rural land state — Ozarks and Delta regions offer volume” → “(removed)”
- `keyNotes.3`: “Clean title conveyed after 30-day window closes” → “The Commissioner makes no promise that the property is usable, accessible or exists”
- `beginnerTip.1`: “The COSL website lets you buy properties from your computer without attending any auction.” → “Unsold parcels can be bid on online at auction.cosl.org, starting 30 days after the live auction.”
- `beginnerTip.2`: “Perfect starting point.” → “(removed)”
- `beginnerTip.3`: “Filter by property type and stick to properties with structures — raw land quality varies wildly.” → “Research the property with the county assessor before you bid.”
- `risks.1`: “90-day litigation window — make no improvements during this period” → “The Commissioner recommends no significant improvements before the 90-day litigation period ends”
- `risks.2`: “Many auction parcels are closed timber land or undevelopable” → “(removed)”
- `risks.3`: “Quitclaim-equivalent deed makes title insurance difficult without quiet title action” → “Buyers usually use the Limited Warranty Deed to bring a quiet title action”
- `risks.4`: “Rural parcels frequently have access problems” → “(removed)”
- `ddExtra.1`: “Request COSL deed history to confirm no prior failed redemptions” → “Check county assessor, tax collector and circuit clerk records for other fees owed”
- `ddExtra.2`: “Check land use classification in county records before committing” → “Ask the county assessor about the property's location and structures”
- `ddExtra.3`: “Budget for quiet title action if you intend to resell with title insurance” → “Expect to use the Limited Warranty Deed in a quiet title action”
- `signup.steps.1`: “Go to cosl.org and create a free account” → “Find upcoming sales in the Public Auction Catalog on cosl.org”
- `signup.steps.2`: “Browse available properties — updated regularly” → “Live auctions: register at the sale site, starting 1 hour before the auction”
- `signup.steps.3`: “Submit an online offer for any available property” → “Unsold parcels: bid online at auction.cosl.org”
- `signup.steps.4`: “If accepted, pay via credit card or ACH and receive your deed electronically” → “Pay the full price at the sale by check, card, cashier's check or money order”
- `signup.deposit.2`: “No deposit needed to browse.” → “(removed)”
- `otc.available`: “Available” → “Yes: online auction of unsold parcels”
- `otc.note.1`: “COSL sells directly year-round at cosl.org.” → “Parcels unsold at the live auction go to the online post-auction list after 30 days.”
- `otc.note.2`: “No auction required.” → “Online sales of unsold parcels go to the highest bidder.”
- `surplus.1`: “Status pending — monitoring for legislative action.” → “Sale money above taxes, fees and costs is held by the Commissioner for the former owner, who may apply for it (Commissioner of State Lands Rules, Title 4).”

## Pass 2 trims, removals and notes

- `rate`: was "Penalty only"
- `rateNote`: was "30-day redemption only — fastest deed resolution in the US"
- `redemption`: was "2 years"; first run had changed it to "None post-sale"; re-verified
- `statute`: pass 2: section number confirmed only through the Commissioner's rules; Arkansas Code text itself not fetched (vendor-hosted, JavaScript only)
- `auctionPlatform`: was "County-run — in-person"
- `auctionTiming`: was "Year-round". pass 2: online part rests on the FAQ unsold quote
- `summary.1`: was "manages all tax-delinquent properties statewide"
- `summary.2`: was "Online purchasing available."
- `summary.3`: was "quitclaim-equivalent with a 90-day litigation risk window"; 90-day part kept in risks.1
- `typeWhy.1`: was "grants the original owner a 2-year right of redemption, making it a redeemable deed state"
- `typeWhy.2`: was "quitclaim-equivalent"
- `rateWhy.1`: was "penalty-only structure ... flat penalty on the original tax amount owed"
- `keyNotes.1`: was "30-day redemption is one of the shortest in the US"
- `keyNotes.2`: removed: no official source (opinion, land-quality or access claim)
- `keyNotes.3`: was "Clean title conveyed after 30-day window closes"
- `beginnerTip.1`: was "buy properties from your computer without attending any auction"
- `beginnerTip.2`: removed: no official source (opinion, land-quality or access claim)
- `beginnerTip.3`: removed "raw land quality varies wildly"
- `risks.1`: was "90-day litigation window — make no improvements during this period"
- `risks.2`: removed: no official source (opinion, land-quality or access claim)
- `risks.3`: was "Quitclaim-equivalent deed makes title insurance difficult without quiet title action"
- `risks.4`: removed: no official source (opinion, land-quality or access claim)
- `ddExtra.1`: was "Request COSL deed history to confirm no prior failed redemptions"
- `ddExtra.2`: was "Check land use classification in county records before committing"
- `ddExtra.3`: was "Budget for quiet title action if you intend to resell with title insurance"
- `signup.steps.1`: was "Go to cosl.org and create a free account"
- `signup.steps.2`: was "Browse available properties — updated regularly"
- `signup.steps.3`: was "Submit an online offer for any available property"
- `signup.steps.4`: was "pay via credit card or ACH and receive your deed electronically"
- `signup.deposit.2`: removed: no official source
- `otc.available`: was "Available"
- `otc.note.1`: was "COSL sells directly year-round at cosl.org."
- `otc.note.2`: was "No auction required."
- `surplus.1`: was "Status pending — monitoring for legislative action."

## Conflicts (flagged)

None.
