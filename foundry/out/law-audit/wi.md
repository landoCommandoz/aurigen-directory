# Wisconsin (WI) law audit

Checked 2026-10-29. Status: done. Ledger: `cloudflare/data/law/wi.json`.

Official code access: Wisconsin Statutes sections 74.57, 75.01, 75.14, 75.35, 75.36 and 75.69 fetched from docs.legis.wisconsin.gov (Wisconsin Legislature, Legislative Reference Bureau), Updated 2023-24 Wis. Stats. as certified October 1, 2026. The single-column HTML section pages were used because the chapter PDF is two-column.

## Finding

Wisconsin does not sell tax certificates to investors: the county treasurer issues each year's certificate to the county
(§ 74.57(1)). Two years later the county may take a tax deed or foreclose (§ 74.57(2)(b)); owners may redeem until the
tax deed is recorded (§ 75.01(1)(b)); the deed vests fee simple in the county, subject to recorded restrictions
(§ 75.14(1)). The county then sells on terms its county board sets (§ 75.35(2)(am)), after advertising the sale and
appraised value on its website (plus a class 1 notice or a multiple listing service) within 180 days of acquiring the
property, 240 days before 2026 (§ 75.69(1)). At the first attempt, bids below appraised value are rejected; the county
may accept the bid most advantageous to it, and may later sell previously advertised land for any amount. Former owners
of single-family, owner-occupied homes have a repurchase right before sale (§ 75.35(3)), and remaining net proceeds go
to the former owner (§ 75.36(3)(c)). Removed: "year-round" and "72 counties", Milwaukee and Dane inventory claims,
land banks, DNR advice, "clean title", "Returns are market-driven" (banned word), and the § 74.53 statute label.

## 2023 to 2026 enacted-law search

Read the history notes for §§ 74.57, 75.01, 75.14, 75.35, 75.36 and 75.69 on docs.legis.wisconsin.gov (certified
October 1, 2026), then fetched each act from 2023 on:
- 2023 Wisconsin Act 207 (2023 Assembly Bill 969), enacted March 22, 2024, published March 23, 2024; in effect the day
  after publication (s. 991.11): county sale of tax-deeded lands, former owner notice and net proceeds, the 240/180-day
  advertising deadline (180 days "beginning in 2026"), and the repurchase right. Reflected in auctionTiming, risks.3 and surplus.1.
- 2025 Wisconsin Act 129 (2025 Assembly Bill 926), enacted March 27, 2026: correction bill (nonsubstantive). No change to claims.

## Unreachable sources

None cited. docs.legis.wisconsin.gov timed out twice (75.01 and 75.36 first tries, logged in attempts/wi.jsonl); retries worked.

## Watch

- 75.69(1m): counties of 750,000+ (Milwaukee) have a separate 36-month deadline for some property types; not shown on the site.

## Claims

| id | shown | statute | link | status |
|---|---|---|---|---|
| type | Tax deed | Wis. Stat. § 75.14(1) | [link](https://docs.legis.wisconsin.gov/document/statutes/75.14) | supported |
| rate | N/A | Wis. Stat. § 75.14(1) | [link](https://docs.legis.wisconsin.gov/document/statutes/75.14) | supported |
| rateNote | County sells land it took by tax deed; at the first attempt, bids below appraised value are rejected | Wis. Stat. § 75.69(1) | [link](https://docs.legis.wisconsin.gov/document/statutes/75.69) | corrected |
| redemption | Until the county's tax deed is recorded (county may take the deed 2 years after the tax certificate) | Wis. Stat. § 75.01(1)(b) | [link](https://docs.legis.wisconsin.gov/document/statutes/75.01) | corrected |
| bidMethod | County may accept the bid most advantageous to it | Wis. Stat. § 75.69(1) | [link](https://docs.legis.wisconsin.gov/document/statutes/75.69) | corrected |
| statute | Wis. Stat. §§ 74.57, 75.35, 75.69 | Wis. Stat. § 75.69(1) | [link](https://docs.legis.wisconsin.gov/document/statutes/75.69) | corrected |
| auctionPlatform | County sale, advertised on the county's website with the appraised value | Wis. Stat. § 75.69(1) | [link](https://docs.legis.wisconsin.gov/document/statutes/75.69) | corrected |
| auctionTiming | Set by each county; the sale must be advertised within 180 days after the county acquires the property (240 days before 2026) | Wis. Stat. § 75.69(1) | [link](https://docs.legis.wisconsin.gov/document/statutes/75.69) | corrected |
| summary.1 | Wisconsin counties sell land they took by tax deed, which they may take two years after the tax certificate. | Wis. Stat. § 74.57(2)(b) | [link](https://docs.legis.wisconsin.gov/document/statutes/74.57) | corrected |
| summary.2 | (removed) | Wis. Stat. § 74.57(2)(b) | [link](https://docs.legis.wisconsin.gov/document/statutes/74.57) | corrected |
| summary.3 | (removed) | Wis. Stat. § 74.57(2)(b) | [link](https://docs.legis.wisconsin.gov/document/statutes/74.57) | corrected |
| summary.4 | (removed) | Wis. Stat. § 74.57(2)(b) | [link](https://docs.legis.wisconsin.gov/document/statutes/74.57) | corrected |
| summary.5 | Statute: WS §74.57. | Wis. Stat. § 74.57 | [link](https://docs.legis.wisconsin.gov/document/statutes/74.57) | supported |
| typeWhy.1 | Wisconsin issues tax certificates only to the county; if the property is not redeemed within two years, the county may take a tax deed and later sell the land. | Wis. Stat. § 74.57(2)(b) | [link](https://docs.legis.wisconsin.gov/document/statutes/74.57) | corrected |
| typeWhy.2 | There is no post-sale redemption. | Wis. Stat. § 75.01(1)(b) | [link](https://docs.legis.wisconsin.gov/document/statutes/75.01) | supported |
| typeWhy.3 | WS §74.57. | Wis. Stat. § 74.57 | [link](https://docs.legis.wisconsin.gov/document/statutes/74.57) | supported |
| rateWhy.1 | Wisconsin is a deed state with no statutory interest rate. | Wis. Stat. § 75.14(1) | [link](https://docs.legis.wisconsin.gov/document/statutes/75.14) | supported |
| rateWhy.2 | The county may accept the bid most advantageous to it, but rejects bids below appraised value at the first attempt. | Wis. Stat. § 75.69(1) | [link](https://docs.legis.wisconsin.gov/document/statutes/75.69) | corrected |
| rateWhy.3 | WS §74.57. | Wis. Stat. § 74.57 | [link](https://docs.legis.wisconsin.gov/document/statutes/74.57) | supported |
| keyNotes.1 | Each county sells its tax-deeded land on terms set by its county board | Wis. Stat. § 75.35(2)(am) | [link](https://docs.legis.wisconsin.gov/document/statutes/75.35) | corrected |
| keyNotes.2 | (removed) | Wis. Stat. § 75.35(2)(am) | [link](https://docs.legis.wisconsin.gov/document/statutes/75.35) | corrected |
| keyNotes.3 | (removed) | Wis. Stat. § 75.35(2)(am) | [link](https://docs.legis.wisconsin.gov/document/statutes/75.35) | corrected |
| keyNotes.4 | The county's tax deed vests fee simple title, subject to recorded restrictions | Wis. Stat. § 75.14(1) | [link](https://docs.legis.wisconsin.gov/document/statutes/75.14) | corrected |
| notBeginnerReason.1 | Counties sell only land they took by tax deed, each on its own terms, after a 2-year redemption period. | Wis. Stat. § 75.35(2)(am) | [link](https://docs.legis.wisconsin.gov/document/statutes/75.35) | corrected |
| beginnerTip.1 | (removed) | Wis. Stat. § 75.35(2)(am) | [link](https://docs.legis.wisconsin.gov/document/statutes/75.35) | corrected |
| beginnerTip.2 | (removed) | Wis. Stat. § 75.35(2)(am) | [link](https://docs.legis.wisconsin.gov/document/statutes/75.35) | corrected |
| risks.1 | The county may take a tax deed only two years after the tax certificate | Wis. Stat. § 74.57(2)(b) | [link](https://docs.legis.wisconsin.gov/document/statutes/74.57) | corrected |
| risks.2 | Each county sells under its own ordinance or resolution | Wis. Stat. § 75.35(2)(am) | [link](https://docs.legis.wisconsin.gov/document/statutes/75.35) | corrected |
| risks.3 | Former owners of single-family, owner-occupied homes have a right to repurchase before the county sells | Wis. Stat. § 75.35(3) | [link](https://docs.legis.wisconsin.gov/document/statutes/75.35) | corrected |
| ddExtra.1 | Confirm the county's tax deed is recorded; owners may redeem until then | Wis. Stat. § 75.01(1)(b) | [link](https://docs.legis.wisconsin.gov/document/statutes/75.01) | corrected |
| ddExtra.2 | (removed) | Wis. Stat. § 75.01(1)(b) | [link](https://docs.legis.wisconsin.gov/document/statutes/75.01) | corrected |
| ddExtra.3 | Check the county's website for its sale notice and appraised value | Wis. Stat. § 75.69(1) | [link](https://docs.legis.wisconsin.gov/document/statutes/75.69) | corrected |
| signup.platform | County (sale terms set by the county board) | Wis. Stat. § 75.35(2)(am) | [link](https://docs.legis.wisconsin.gov/document/statutes/75.35) | corrected |
| signup.steps.1 | Find your target county's sale notice on its website | Wis. Stat. § 75.69(1) | [link](https://docs.legis.wisconsin.gov/document/statutes/75.69) | corrected |
| signup.steps.2 | Check the appraised value; at the first attempt, lower bids are rejected | Wis. Stat. § 75.69(1) | [link](https://docs.legis.wisconsin.gov/document/statutes/75.69) | corrected |
| signup.steps.3 | (removed) | Wis. Stat. § 75.69(1) | [link](https://docs.legis.wisconsin.gov/document/statutes/75.69) | corrected |
| signup.steps.4 | Follow the county's sale terms, set by its county board | Wis. Stat. § 75.35(2)(am) | [link](https://docs.legis.wisconsin.gov/document/statutes/75.35) | corrected |
| signup.deposit.1 | Set by each county's sale terms; confirm with the county. | Wis. Stat. § 75.35(2)(am) | [link](https://docs.legis.wisconsin.gov/document/statutes/75.35) | corrected |
| otc.available | Yes: previously advertised land may later be sold for any amount | Wis. Stat. § 75.69(1) | [link](https://docs.legis.wisconsin.gov/document/statutes/75.69) | corrected |
| otc.note.1 | Ask the county about previously advertised land it has not sold. | Wis. Stat. § 75.69(1) | [link](https://docs.legis.wisconsin.gov/document/statutes/75.69) | corrected |
| platforms.1 | County board or the committee it delegates | Wis. Stat. § 75.35(2)(d) | [link](https://docs.legis.wisconsin.gov/document/statutes/75.35) | corrected |
| surplus.1 | When a county sells tax-deeded land, remaining net proceeds go to the former owner (Wis. Stat. § 75.36(3)(c)). | Wis. Stat. § 75.36(3)(c) | [link](https://docs.legis.wisconsin.gov/document/statutes/75.35) | corrected |
| es.rate | N/A | Wis. Stat. § 75.14(1) | [link](https://docs.legis.wisconsin.gov/document/statutes/75.14) | supported |
| es.redemption | Hasta que se registra la escritura fiscal del condado (el condado puede tomarla 2 años después del certificado fiscal) | Wis. Stat. § 75.01(1)(b) | [link](https://docs.legis.wisconsin.gov/document/statutes/75.01) | corrected |
| es.summary.1 | Los condados de Wisconsin venden terrenos que tomaron por escritura fiscal, la cual pueden tomar dos años después del certificado fiscal. | Wis. Stat. § 74.57(2)(b) | [link](https://docs.legis.wisconsin.gov/document/statutes/74.57) | corrected |
| es.summary.2 | (removed) | Wis. Stat. § 74.57(2)(b) | [link](https://docs.legis.wisconsin.gov/document/statutes/74.57) | corrected |
| es.summary.3 | (removed) | Wis. Stat. § 74.57(2)(b) | [link](https://docs.legis.wisconsin.gov/document/statutes/74.57) | corrected |
| es.summary.4 | (removed) | Wis. Stat. § 74.57(2)(b) | [link](https://docs.legis.wisconsin.gov/document/statutes/74.57) | corrected |
| es.summary.5 | Estatuto: WS §74.57. | Wis. Stat. § 74.57 | [link](https://docs.legis.wisconsin.gov/document/statutes/74.57) | supported |
| es.typeWhy.1 | Wisconsin emite certificados fiscales solo al condado; si la propiedad no se redime en dos años, el condado puede tomar una escritura fiscal y luego vender el terreno (WS §74.57). | Wis. Stat. § 74.57(2)(b) | [link](https://docs.legis.wisconsin.gov/document/statutes/74.57) | corrected |
| es.rateWhy.1 | No se aplica tasa de interés ya que es un estado de escritura. | Wis. Stat. § 75.14(1) | [link](https://docs.legis.wisconsin.gov/document/statutes/75.14) | supported |
| es.rateWhy.2 | El condado puede aceptar la oferta más ventajosa, pero rechaza las ofertas por debajo del valor tasado en el primer intento (WS §74.57). | Wis. Stat. § 75.69(1) | [link](https://docs.legis.wisconsin.gov/document/statutes/75.69) | corrected |
| es.notBeginnerReason.1 | Los condados venden solo terrenos que tomaron por escritura fiscal, cada uno en sus propios términos, tras un período de redención de 2 años. | Wis. Stat. § 75.35(2)(am) | [link](https://docs.legis.wisconsin.gov/document/statutes/75.35) | corrected |
| es.beginnerTip.1 | (removed) | Wis. Stat. § 75.35(2)(am) | [link](https://docs.legis.wisconsin.gov/document/statutes/75.35) | corrected |
| es.beginnerTip.2 | (removed) | Wis. Stat. § 75.35(2)(am) | [link](https://docs.legis.wisconsin.gov/document/statutes/75.35) | corrected |
| es.risks.1 | El condado puede tomar una escritura fiscal solo dos años después del certificado fiscal | Wis. Stat. § 74.57(2)(b) | [link](https://docs.legis.wisconsin.gov/document/statutes/74.57) | corrected |
| es.risks.2 | Cada condado vende según su propia ordenanza o resolución | Wis. Stat. § 75.35(2)(am) | [link](https://docs.legis.wisconsin.gov/document/statutes/75.35) | corrected |
| es.risks.3 | Los antiguos propietarios de viviendas unifamiliares ocupadas por el dueño tienen derecho a recomprar antes de que el condado venda | Wis. Stat. § 75.35(3) | [link](https://docs.legis.wisconsin.gov/document/statutes/75.35) | corrected |
| es.ddExtra.1 | Confirme que la escritura fiscal del condado está registrada; los propietarios pueden redimir hasta entonces | Wis. Stat. § 75.01(1)(b) | [link](https://docs.legis.wisconsin.gov/document/statutes/75.01) | corrected |
| es.ddExtra.2 | (removed) | Wis. Stat. § 75.01(1)(b) | [link](https://docs.legis.wisconsin.gov/document/statutes/75.01) | corrected |
| es.ddExtra.3 | Revise el sitio web del condado para su aviso de venta y el valor tasado | Wis. Stat. § 75.69(1) | [link](https://docs.legis.wisconsin.gov/document/statutes/75.69) | corrected |
| es.signup.platform | Condado (términos de venta fijados por la junta del condado) | Wis. Stat. § 75.35(2)(am) | [link](https://docs.legis.wisconsin.gov/document/statutes/75.35) | corrected |
| es.signup.steps.1 | Encuentre el aviso de venta de su condado objetivo en su sitio web | Wis. Stat. § 75.69(1) | [link](https://docs.legis.wisconsin.gov/document/statutes/75.69) | corrected |
| es.signup.steps.2 | Revise el valor tasado; en el primer intento, las ofertas menores se rechazan | Wis. Stat. § 75.69(1) | [link](https://docs.legis.wisconsin.gov/document/statutes/75.69) | corrected |
| es.signup.steps.3 | (removed) | Wis. Stat. § 75.69(1) | [link](https://docs.legis.wisconsin.gov/document/statutes/75.69) | corrected |
| es.signup.steps.4 | Siga los términos de venta del condado, fijados por su junta | Wis. Stat. § 75.35(2)(am) | [link](https://docs.legis.wisconsin.gov/document/statutes/75.35) | corrected |
| es.signup.deposit.1 | Fijado por los términos de venta de cada condado; confirme con el condado. | Wis. Stat. § 75.35(2)(am) | [link](https://docs.legis.wisconsin.gov/document/statutes/75.35) | corrected |
| es.otc.note.1 | Pregunte al condado por terrenos anunciados previamente que no ha vendido. | Wis. Stat. § 75.69(1) | [link](https://docs.legis.wisconsin.gov/document/statutes/75.69) | corrected |

## Corrections (before → after)

- `rateNote`: “Year-round sales — clean title conveyed” → “County sells land it took by tax deed; at the first attempt, bids below appraised value are rejected”
- `redemption`: “None post-sale (2-year delinquency before county takes deed)” → “Until the county's tax deed is recorded (county may take the deed 2 years after the tax certificate)”
- `bidMethod`: “Highest bidder” → “County may accept the bid most advantageous to it”
- `statute`: “WI Statutes §74.53” → “Wis. Stat. §§ 74.57, 75.35, 75.69”
- `auctionPlatform`: “County-run — in-person and online varies” → “County sale, advertised on the county's website with the appraised value”
- `auctionTiming`: “Year-round” → “Set by each county; the sale must be advertised within 180 days after the county acquires the property (240 days before 2026)”
- `summary.1`: “Wisconsin counties sell tax deeds after 2-year tax certificate.” → “Wisconsin counties sell land they took by tax deed, which they may take two years after the tax certificate.”
- `summary.2`: “Milwaukee and Dane have best inventory.” → “(removed)”
- `summary.3`: “Online infrastructure is growing but limited.” → “(removed)”
- `summary.4`: “Some counties use land banks.” → “(removed)”
- `typeWhy.1`: “Wisconsin sells the property deed outright after a 2-year tax certificate period during which the county holds the delinquent property.” → “Wisconsin issues tax certificates only to the county; if the property is not redeemed within two years, the county may take a tax deed and later sell the land.”
- `rateWhy.2`: “Returns are market-driven at auction.” → “The county may accept the bid most advantageous to it, but rejects bids below appraised value at the first attempt.”
- `keyNotes.1`: “Year-round sales across all 72 counties” → “Each county sells its tax-deeded land on terms set by its county board”
- `keyNotes.2`: “Rural Wisconsin strong for land and recreational property” → “(removed)”
- `keyNotes.3`: “Environmental title risks in industrial counties — always check DNR records before bidding on former industrial land” → “(removed)”
- `keyNotes.4`: “Clean title conveyed at sale” → “The county's tax deed vests fee simple title, subject to recorded restrictions”
- `notBeginnerReason.1`: “2-year redemption, limited centralized platform, and county-by-county coordination required.” → “Counties sell only land they took by tax deed, each on its own terms, after a 2-year redemption period.”
- `beginnerTip.1`: “Milwaukee and Dane (Madison) counties have the best WI inventory.” → “(removed)”
- `beginnerTip.2`: “Contact the Milwaukee County Treasurer specifically — they have the most organized auction process in the state.” → “(removed)”
- `risks.1`: “2-year cycle before auction” → “The county may take a tax deed only two years after the tax certificate”
- `risks.2`: “No statewide online platform” → “Each county sells under its own ordinance or resolution”
- `risks.3`: “Some counties use land banks rather than public auctions” → “Former owners of single-family, owner-occupied homes have a right to repurchase before the county sells”
- `ddExtra.1`: “Contact the county treasurer to confirm the 2-year delinquency threshold has passed” → “Confirm the county's tax deed is recorded; owners may redeem until then”
- `ddExtra.2`: “Check the Milwaukee County Land Records System for upcoming actions” → “(removed)”
- `ddExtra.3`: “Verify whether the county plans to auction vs. use a land bank for specific parcels” → “Check the county's website for its sale notice and appraised value”
- `signup.platform`: “County treasurer (varies — Milwaukee uses online system)” → “County (sale terms set by the county board)”
- `signup.steps.1`: “Find your target county treasurer at wi.gov/government/counties” → “Find your target county's sale notice on its website”
- `signup.steps.2`: “Contact the treasurer to confirm the delinquency threshold and upcoming sale schedule” → “Check the appraised value; at the first attempt, lower bids are rejected”
- `signup.steps.3`: “Milwaukee County has online auction capabilities — check milwaukee.county.gov/treasurer” → “(removed)”
- `signup.steps.4`: “Register per county instructions” → “Follow the county's sale terms, set by its county board”
- `signup.deposit.1`: “Varies by county.” → “Set by each county's sale terms; confirm with the county.”
- `otc.available`: “Not generally available” → “Yes: previously advertised land may later be sold for any amount”
- `otc.note.1`: “Check county land bank for properties not in public auction.” → “Ask the county about previously advertised land it has not sold.”
- `platforms.1`: “County treasurer offices” → “County board or the committee it delegates”
- `surplus.1`: “Status pending — monitoring for legislative action.” → “When a county sells tax-deeded land, remaining net proceeds go to the former owner (Wis. Stat. § 75.36(3)(c)).”

## Pass 2 trims, removals and notes

- `rateNote`: was "Year-round sales — clean title conveyed". pass 2: tax-deed part rests on § 75.14(1) (type)
- `redemption`: was "None post-sale (2-year delinquency before county takes deed)". pass 2: 2-year part rests on § 74.57(2)(b) (summary.1)
- `bidMethod`: was "Highest bidder"; statute lets the county accept the most advantageous bid
- `statute`: was "WI Statutes §74.53" (§ 74.53 not the tax-deed sale law; replaced with the sections cited here)
- `auctionPlatform`: was "County-run — in-person and online varies"
- `auctionTiming`: was "Year-round"
- `summary.1`: was "Wisconsin counties sell tax deeds after 2-year tax certificate." pass 2: sale part rests on § 75.35(2)(am)
- `summary.2`: removed: no official source (inventory, opinion, county or platform claim)
- `summary.3`: removed: no official source (inventory, opinion, county or platform claim)
- `summary.4`: removed: land banks are not in the tax-deed statutes fetched
- `typeWhy.1`: was "sells the property deed outright after a 2-year tax certificate period". pass 2: certificate-to-county rests on § 74.57(1); sale on § 75.35(2)(am)
- `rateWhy.2`: was "Returns are market-driven at auction." (banned money word)
- `keyNotes.1`: was "Year-round sales across all 72 counties"
- `keyNotes.2`: removed: no official source (inventory, opinion, county or platform claim)
- `keyNotes.3`: removed: DNR environmental advice not supported by a quote fetched
- `keyNotes.4`: was "Clean title conveyed at sale"
- `notBeginnerReason.1`: was "2-year redemption, limited centralized platform, and county-by-county coordination required." pass 2: 2-year part rests on § 74.57(2)(b)
- `beginnerTip.1`: removed: no official source (inventory, opinion, county or platform claim)
- `beginnerTip.2`: removed: no official source (inventory, opinion, county or platform claim)
- `risks.1`: was "2-year cycle before auction"
- `risks.2`: was "No statewide online platform"
- `risks.3`: was "Some counties use land banks rather than public auctions"
- `ddExtra.1`: was "Contact the county treasurer to confirm the 2-year delinquency threshold has passed"
- `ddExtra.2`: removed: Milwaukee County records system claim (no county source fetched)
- `ddExtra.3`: was "Verify whether the county plans to auction vs. use a land bank"
- `signup.platform`: removed Milwaukee online system claim
- `signup.steps.1`: removed wi.gov directory link
- `signup.steps.2`: was "Contact the treasurer to confirm the delinquency threshold and upcoming sale schedule"
- `signup.steps.3`: removed: Milwaukee County website claim (no county source fetched)
- `signup.steps.4`: was "Register per county instructions"
- `signup.deposit.1`: was "Varies by county."
- `otc.available`: was "Not generally available"
- `otc.note.1`: was "Check county land bank for properties not in public auction."
- `platforms.1`: was "County treasurer offices"
- `surplus.1`: was "Status pending — monitoring for legislative action." (2023 Wis. Act 207)

## Conflicts (flagged)

None.
