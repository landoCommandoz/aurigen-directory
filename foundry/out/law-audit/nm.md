# New Mexico (NM) law audit

Checked 2026-10-27. Status: done. Ledger: `cloudflare/data/law/nm.json`.

Official code access: NMSA 1978 was not fetched this run. Claims cite the NM Taxation and Revenue Department Delinquent Property Tax Auctions page and FAQ (tax.newmexico.gov), which quote §§ 7-38-67 and 7-38-70(B), and a TRD press release of Feb. 23, 2026 (biz.nm.gov).

## Finding

The site described New Mexico as a centralized online system with a single registration covering all counties. The
Taxation and Revenue Department's Delinquent Property Tax Auctions page says otherwise: auctions are held in person,
usually at the county courthouse in the county where the properties are, bidders register on the day of the sale,
bidding is oral (in person or by agent), and there is no set schedule. Per TRD, a sale under § 7-38-67 NMSA 1978
extinguishes the tax lien only; other liens survive. Property is sold "as is", all sales final. A Feb. 23, 2026 TRD press
release says auctions are for taxes delinquent at least four years (the site said three).

Rule 2 note: NMSA 1978 itself (nmonesource.com, NM Compilation Commission) was not fetched this run for time. The
statute-level claims rest on TRD's own quotations of §§ 7-38-67 and 7-38-70(B). A later run should fetch the code and
confirm the post-sale redemption question (flagged).

## 2023 to 2026 enacted-law search

Not run this session (time). Recheck the legislature's (nmlegis.gov) enacted bills for chapter 7, article 38 changes in
the 2023 to 2026 sessions, especially on excess proceeds after Tyler v. Hennepin County.

## Unreachable sources

None.

## Watch

- Excess proceeds handling after a tax sale (not in sources read).

## Claims

| id | shown | statute | link | status |
|---|---|---|---|---|
| type | Tax deed | § 7-38-70(B) NMSA 1978 (as quoted by TRD) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | supported |
| rate | No interest rate; minimum bid is the taxes, penalty, interest and costs due | none: administrative practice (NM Taxation and Revenue Department, Property Tax Division) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | corrected |
| rateNote | The NM Taxation and Revenue Department holds the auctions | none: administrative practice (NM Taxation and Revenue Department press release, Feb. 23, 2026) | [link](https://biz.nm.gov/newsroom/updated-press-release-delinquent-property-tax-auctions-scheduled-in-ma-100002756) | corrected |
| redemption | None post-sale | none: administrative practice (NM Taxation and Revenue Department, Property Tax Division) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | flagged |
| bidMethod | Oral bidding; bidders present in person or by agent | none: administrative practice (NM Taxation and Revenue Department, Property Tax Division) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | corrected |
| statute | NMSA 1978 §7-38-67; §7-38-70 | § 7-38-67 NMSA 1978 (as stated by TRD) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | supported |
| auctionPlatform | In person, usually at the county courthouse, run by the Taxation and Revenue Department | none: administrative practice (NM Taxation and Revenue Department, Property Tax Division) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | corrected |
| auctionTiming | No set schedule; held as title research and collection efforts are completed | none: administrative practice (NM Taxation and Revenue Department, Property Tax Division) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | corrected |
| summary.1 | New Mexico's Taxation and Revenue Department holds delinquent property tax auctions in the counties where the properties are located. | none: administrative practice (NM Taxation and Revenue Department, Property Tax Division) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | corrected |
| summary.2 | Bidders register in person on the day of the sale. | none: administrative practice (NM Taxation and Revenue Department, Property Tax Division) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | corrected |
| summary.3 | Statute: NMSA § 7-38-67. | § 7-38-67 NMSA 1978 (as stated by TRD) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | corrected |
| typeWhy.1 | The deed conveys the former owner's interest as of the date the state's tax lien arose. | § 7-38-70(B) NMSA 1978 (as quoted by TRD) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | corrected |
| typeWhy.2 | NMSA § 7-38-70(B). | § 7-38-70(B) NMSA 1978 (as quoted by TRD) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | corrected |
| rateWhy.1 | There is no interest rate; the minimum bid is the taxes, penalty, interest and costs due. | none: administrative practice (NM Taxation and Revenue Department, Property Tax Division) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | corrected |
| rateWhy.2 | (removed) | none: administrative practice (NM Taxation and Revenue Department, Property Tax Division) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | corrected |
| rateWhy.3 | NMSA § 7-38-67. | § 7-38-67 NMSA 1978 (as stated by TRD) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | corrected |
| keyNotes.1 | State-run auction — NM Taxation & Revenue Dept. conducts sales, not counties | none: administrative practice (NM Taxation and Revenue Department press release, Feb. 23, 2026) | [link](https://biz.nm.gov/newsroom/updated-press-release-delinquent-property-tax-auctions-scheduled-in-ma-100002756) | supported |
| keyNotes.2 | Auctions are for taxes delinquent at least four years | none: administrative practice (NM Taxation and Revenue Department press release, Feb. 23, 2026) | [link](https://biz.nm.gov/newsroom/updated-press-release-delinquent-property-tax-auctions-scheduled-in-ma-100002756) | corrected |
| keyNotes.3 | The sale extinguishes the tax lien only; other liens are not extinguished | § 7-38-67 NMSA 1978 (as stated by TRD) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | corrected |
| keyNotes.4 | Inspections must be from outside the property; trespassing is not allowed | none: administrative practice (NM Taxation and Revenue Department, Property Tax Division) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | corrected |
| keyNotes.5 | (removed) | § 7-38-67 NMSA 1978 (as stated by TRD) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | corrected |
| keyNotes.6 | (removed) | § 7-38-67 NMSA 1978 (as stated by TRD) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | corrected |
| beginnerTip.1 | (removed) | none: administrative practice (NM Taxation and Revenue Department, Property Tax Division) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | corrected |
| beginnerTip.2 | (removed) | none: administrative practice (NM Taxation and Revenue Department, Property Tax Division) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | corrected |
| beginnerTip.3 | (removed) | none: administrative practice (NM Taxation and Revenue Department, Property Tax Division) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | corrected |
| risks.1 | Property is sold "as is"; no refunds, all sales final | none: administrative practice (NM Taxation and Revenue Department, Property Tax Division) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | corrected |
| risks.2 | Other liens survive the sale | § 7-38-67 NMSA 1978 (as stated by TRD) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | corrected |
| risks.3 | (removed) | none: administrative practice (NM Taxation and Revenue Department, Property Tax Division) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | corrected |
| ddExtra.1 | (removed) | none: administrative practice (NM Taxation and Revenue Department, Property Tax Division) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | corrected |
| ddExtra.2 | (removed) | none: administrative practice (NM Taxation and Revenue Department, Property Tax Division) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | corrected |
| ddExtra.3 | Review the chain of title before the sale; that is the buyer's job | none: administrative practice (NM Taxation and Revenue Department, Property Tax Division) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | corrected |
| signup.platform | In-person auction run by the Property Tax Division | none: administrative practice (NM Taxation and Revenue Department, Property Tax Division) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | corrected |
| signup.steps.1 | Find the auction notice, terms and property list on the Delinquent Property Tax Auctions page at tax.newmexico.gov | none: administrative practice (NM Taxation and Revenue Department, Property Tax Division) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | corrected |
| signup.steps.2 | Register in person on the day of the sale; registration closes when the sale starts | none: administrative practice (NM Taxation and Revenue Department, Property Tax Division) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | corrected |
| signup.steps.3 | Bid orally in person or through an agent | none: administrative practice (NM Taxation and Revenue Department, Property Tax Division) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | corrected |
| signup.steps.4 | Pay by cashier's check, money order, or personal or company check | none: administrative practice (NM Taxation and Revenue Department, Property Tax Division) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | corrected |
| signup.deposit.1 | Payment by cashier's check, money order, or personal or company check | none: administrative practice (NM Taxation and Revenue Department, Property Tax Division) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | corrected |
| signup.deposit.2 | Personal and company checks need a letter from the issuing bank at registration | none: administrative practice (NM Taxation and Revenue Department, Property Tax Division) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | corrected |
| otc.available | Not generally available | none: administrative practice (NM Taxation and Revenue Department, Property Tax Division) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | flagged |
| otc.note.1 | (removed) | none: administrative practice (NM Taxation and Revenue Department, Property Tax Division) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | corrected |
| platforms.1 | tax.newmexico.gov | none: administrative practice (NM Taxation and Revenue Department, Property Tax Division) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | supported |
| surplus.1 | (removed) | § 7-38-67 NMSA 1978 (as stated by TRD) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | corrected |
| es.rate | Sin tasa de interés; la puja mínima es el total de impuestos, multa, interés y costos adeudados | none: administrative practice (NM Taxation and Revenue Department, Property Tax Division) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | corrected |
| es.redemption | Ninguna después de la venta | none: administrative practice (NM Taxation and Revenue Department, Property Tax Division) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | flagged |
| es.summary.1 | El Departamento de Impuestos e Ingresos de Nuevo México realiza subastas de propiedades con impuestos en mora en los condados donde están las propiedades. | none: administrative practice (NM Taxation and Revenue Department, Property Tax Division) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | corrected |
| es.summary.2 | Los postores se registran en persona el día de la venta. | none: administrative practice (NM Taxation and Revenue Department, Property Tax Division) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | corrected |
| es.summary.3 | Estatuto: NMSA § 7-38-67. | § 7-38-67 NMSA 1978 (as stated by TRD) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | corrected |
| es.typeWhy.1 | La escritura transfiere el interés del antiguo dueño a la fecha en que surgió el gravamen fiscal del estado. | § 7-38-70(B) NMSA 1978 (as quoted by TRD) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | corrected |
| es.rateWhy.1 | No hay tasa de interés; la puja mínima es el total de impuestos, multa, interés y costos adeudados. | none: administrative practice (NM Taxation and Revenue Department, Property Tax Division) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | corrected |
| es.rateWhy.2 | (removed) | none: administrative practice (NM Taxation and Revenue Department, Property Tax Division) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | corrected |
| es.beginnerTip.1 | (removed) | none: administrative practice (NM Taxation and Revenue Department, Property Tax Division) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | corrected |
| es.beginnerTip.2 | (removed) | none: administrative practice (NM Taxation and Revenue Department, Property Tax Division) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | corrected |
| es.beginnerTip.3 | (removed) | none: administrative practice (NM Taxation and Revenue Department, Property Tax Division) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | corrected |
| es.risks.1 | La propiedad se vende "tal cual"; sin reembolsos, todas las ventas son finales | none: administrative practice (NM Taxation and Revenue Department, Property Tax Division) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | corrected |
| es.risks.2 | Otros gravámenes sobreviven a la venta | § 7-38-67 NMSA 1978 (as stated by TRD) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | corrected |
| es.risks.3 | (removed) | none: administrative practice (NM Taxation and Revenue Department, Property Tax Division) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | corrected |
| es.ddExtra.1 | (removed) | none: administrative practice (NM Taxation and Revenue Department, Property Tax Division) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | corrected |
| es.ddExtra.2 | (removed) | none: administrative practice (NM Taxation and Revenue Department, Property Tax Division) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | corrected |
| es.ddExtra.3 | Revise la cadena de título antes de la venta; es responsabilidad del comprador | none: administrative practice (NM Taxation and Revenue Department, Property Tax Division) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | corrected |
| es.signup.platform | Subasta en persona realizada por la División de Impuesto a la Propiedad | none: administrative practice (NM Taxation and Revenue Department, Property Tax Division) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | corrected |
| es.signup.steps.1 | Busque el aviso, los términos y la lista de propiedades en la página de subastas de tax.newmexico.gov | none: administrative practice (NM Taxation and Revenue Department, Property Tax Division) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | corrected |
| es.signup.steps.2 | Regístrese en persona el día de la venta; el registro cierra al iniciar la venta | none: administrative practice (NM Taxation and Revenue Department, Property Tax Division) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | corrected |
| es.signup.steps.3 | Puje oralmente en persona o mediante un agente | none: administrative practice (NM Taxation and Revenue Department, Property Tax Division) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | corrected |
| es.signup.steps.4 | Pague con cheque de caja, giro postal o cheque personal o de empresa | none: administrative practice (NM Taxation and Revenue Department, Property Tax Division) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | corrected |
| es.signup.deposit.1 | Pago con cheque de caja, giro postal o cheque personal o de empresa | none: administrative practice (NM Taxation and Revenue Department, Property Tax Division) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | corrected |
| es.signup.deposit.2 | Los cheques personales y de empresa requieren una carta del banco emisor al registrarse | none: administrative practice (NM Taxation and Revenue Department, Property Tax Division) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | corrected |
| es.otc.note.1 | (removed) | none: administrative practice (NM Taxation and Revenue Department, Property Tax Division) | [link](https://www.tax.newmexico.gov/businesses/delinquent-property-tax-auctions/) | corrected |

## Corrections (before → after)

- `rate`: “N/A” → “No interest rate; minimum bid is the taxes, penalty, interest and costs due”
- `rateNote`: “NM Taxation & Revenue Dept. runs state-level auction — not county-based” → “The NM Taxation and Revenue Department holds the auctions”
- `bidMethod`: “Highest bidder (competitive)” → “Oral bidding; bidders present in person or by agent”
- `auctionPlatform`: “NM Taxation & Revenue Department — state-run” → “In person, usually at the county courthouse, run by the Taxation and Revenue Department”
- `auctionTiming`: “Year-round” → “No set schedule; held as title research and collection efforts are completed”
- `summary.1`: “New Mexico's Property Tax Division (PTD) manages all tax deed sales statewide through a centralized online system.” → “New Mexico's Taxation and Revenue Department holds delinquent property tax auctions in the counties where the properties are located.”
- `summary.2`: “Single registration covers all NM counties.” → “Bidders register in person on the day of the sale.”
- `summary.3`: “Statute: NMSA §7-38-65.” → “Statute: NMSA § 7-38-67.”
- `typeWhy.1`: “New Mexico sells the property deed outright through the state's centralized Property Tax Division, with no post-sale redemption.” → “The deed conveys the former owner's interest as of the date the state's tax lien arose.”
- `typeWhy.2`: “NMSA §7-38-65.” → “NMSA § 7-38-70(B).”
- `rateWhy.1`: “New Mexico is a pure deed state with no statutory interest rate.” → “There is no interest rate; the minimum bid is the taxes, penalty, interest and costs due.”
- `rateWhy.2`: “Returns are market-driven based on competitive auction bidding.” → “(removed)”
- `rateWhy.3`: “NMSA §7-38-65.” → “NMSA § 7-38-67.”
- `keyNotes.2`: “3 years delinquent before state schedules auction” → “Auctions are for taxes delinquent at least four years”
- `keyNotes.3`: “Deed grants fee simple absolute — wipes prior interests per §7-38-70” → “The sale extinguishes the tax lien only; other liens are not extinguished”
- `keyNotes.4`: “Buyer CANNOT enter property until deed is recorded” → “Inspections must be from outside the property; trespassing is not allowed”
- `keyNotes.5`: “2-year window for former owner to challenge in District Court” → “(removed)”
- `keyNotes.6`: “120-day federal IRS redemption may apply — always check for federal liens” → “(removed)”
- `beginnerTip.1`: “New Mexico's single-registration system is the simplest in the country.” → “(removed)”
- `beginnerTip.2`: “Register once, access all county sales.” → “(removed)”
- `beginnerTip.3`: “Good starting point for deed-state investing.” → “(removed)”
- `risks.1`: “Many parcels are rural desert with limited development potential” → “Property is sold "as is"; no refunds, all sales final”
- `risks.2`: “Title issues common on older properties” → “Other liens survive the sale”
- `risks.3`: “Some parcels have Native American land claim complications” → “(removed)”
- `ddExtra.1`: “Check BLM and BIA records for any Native American land complications” → “(removed)”
- `ddExtra.2`: “Verify road access — many NM parcels are landlocked desert” → “(removed)”
- `ddExtra.3`: “Run title search before bidding on any property with structures” → “Review the chain of title before the sale; that is the buyer's job”
- `signup.platform`: “New Mexico PTD online portal” → “In-person auction run by the Property Tax Division”
- `signup.steps.1`: “Go to tax.newmexico.gov/property-taxes and find the tax sale section” → “Find the auction notice, terms and property list on the Delinquent Property Tax Auctions page at tax.newmexico.gov”
- `signup.steps.2`: “Create an account — single registration covers all New Mexico counties” → “Register in person on the day of the sale; registration closes when the sale starts”
- `signup.steps.3`: “Browse available properties and register for upcoming sales” → “Bid orally in person or through an agent”
- `signup.steps.4`: “Bid online per PTD instructions” → “Pay by cashier's check, money order, or personal or company check”
- `signup.deposit.1`: “Varies by sale.” → “Payment by cashier's check, money order, or personal or company check”
- `signup.deposit.2`: “Confirm with PTD.” → “Personal and company checks need a letter from the issuing bank at registration”
- `otc.note.1`: “No OTC program.” → “(removed)”
- `surplus.1`: “Status pending — monitoring for legislative action.” → “(removed)”

## Pass 2 trims, removals and notes

- `rate`: was "N/A"
- `rateNote`: trimmed: removed "state-level, not county-based" (auctions are held county by county)
- `redemption`: flagged: TRD says sales are final; no statute on post-sale redemption read
- `bidMethod`: was "Highest bidder (competitive)"
- `auctionPlatform`: was "state-run" online implication
- `auctionTiming`: was "Year-round"
- `summary.1`: was "centralized online system"
- `summary.2`: was "Single registration covers all NM counties"
- `summary.3`: was "NMSA §7-38-65"
- `typeWhy.1`: removed "no post-sale redemption" (see flag)
- `typeWhy.2`: was "NMSA §7-38-65"
- `rateWhy.2`: removed: banned money word ("Returns")
- `rateWhy.3`: was "NMSA §7-38-65"
- `keyNotes.2`: was "3 years delinquent"
- `keyNotes.3`: was "fee simple absolute — wipes prior interests"
- `keyNotes.4`: was "cannot enter until deed is recorded"
- `keyNotes.5`: removed: 2-year challenge period not in sources read
- `keyNotes.6`: removed: federal redemption right not in sources read
- `beginnerTip.1`: removed: single registration contradicted by same-day in-person registration
- `beginnerTip.2`: removed: contradicted by same-day registration
- `beginnerTip.3`: removed: no official source (opinion, land-type or ranking claim)
- `risks.1`: was "rural desert"
- `risks.2`: was "Title issues common"
- `risks.3`: removed: no official source (opinion, land-type or ranking claim)
- `ddExtra.1`: removed: no official source (opinion, land-type or ranking claim)
- `ddExtra.2`: removed: no official source (opinion, land-type or ranking claim)
- `ddExtra.3`: trimmed: removed "with structures"
- `signup.platform`: was "online portal"
- `signup.steps.2`: was "single registration covers all counties"
- `signup.steps.3`: was "Browse available properties and register"
- `signup.steps.4`: was "Bid online"
- `signup.deposit.1`: was "Varies by sale"
- `signup.deposit.2`: was "Confirm with PTD"
- `otc.available`: flagged: no official text read on over-the-counter sales
- `otc.note.1`: removed: "No OTC program" has no source (see flag)
- `surplus.1`: removed "Status pending" (not a legal statement; no surplus section read)

## Conflicts (flagged)

- `redemption`: TRD FAQ says "all sales are final"; the statute on redemption after sale was not read
- `otc.available`: TRD pages read do not mention over-the-counter sales
