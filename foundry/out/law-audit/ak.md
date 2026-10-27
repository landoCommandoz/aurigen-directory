# Alaska (AK) law audit

Checked 2026-10-27 (run 1). Status: done. Ledger: `cloudflare/data/law/ak.json`.

Official code access: Alaska Statutes from the Alaska State Legislature BASIS print view
(https://www.akleg.gov/basis/statutes.asp?media=print&secStart=29.45.290&secEnd=29.45.500), the legislature's own site.

Main finding: Alaska has no public tax lien or tax deed sale to investors. The borough or city forecloses in superior court
(AS 29.45.320–.390), holds the property for at least one year of redemption (AS 29.45.400, .440), takes a deed (AS 29.45.450),
and may then sell property it does not need for a public purpose (AS 29.45.460). The former owner may repurchase within 10
years until the municipality sells (AS 29.45.470), and is entitled to excess proceeds, claimed within six months (AS 29.45.480(b)).
The old text said "1 year" redemption, an AS 29.45.330-only statute, and unsourced claims about Mat-Su, federal land, 19
boroughs and inventory. Those were corrected or removed.

## Claims

| id | shown | statute | link | status |
|---|---|---|---|---|
| type | Tax deed | AS 29.45.460 | [link](https://www.akleg.gov/basis/statutes.asp?media=print&secStart=29.45.290&secEnd=29.45.500) | supported |
| rate | No interest to buyers: the municipality takes the property | AS 29.45.390 | [link](https://www.akleg.gov/basis/statutes.asp?media=print&secStart=29.45.290&secEnd=29.45.500) | corrected |
| rateNote | Unredeemed property is deeded to the borough or city | AS 29.45.450 | [link](https://www.akleg.gov/basis/statutes.asp?media=print&secStart=29.45.290&secEnd=29.45.500) | corrected |
| redemption | At least 1 year after transfer to the municipality | AS 29.45.400 | [link](https://www.akleg.gov/basis/statutes.asp?media=print&secStart=29.45.290&secEnd=29.45.500) | corrected |
| bidMethod | Set by each borough or city | AS 29.45.460 | [link](https://www.akleg.gov/basis/statutes.asp?media=print&secStart=29.45.290&secEnd=29.45.500) | flagged |
| statute | AS 29.45.290–29.45.500 | AS 29.45.320 | [link](https://www.akleg.gov/basis/statutes.asp?media=print&secStart=29.45.290&secEnd=29.45.500) | corrected |
| auctionPlatform | Run by the borough or city that took the property | AS 29.45.460 | [link](https://www.akleg.gov/basis/statutes.asp?media=print&secStart=29.45.290&secEnd=29.45.500) | corrected |
| auctionTiming | Set locally, after unredeemed property is deeded to the municipality | AS 29.45.440 | [link](https://www.akleg.gov/basis/statutes.asp?media=print&secStart=29.45.290&secEnd=29.45.500) | corrected |
| summary.1 | In Alaska, the borough or city (the municipality) forecloses on delinquent real property taxes. | AS 29.45.320 | [link](https://www.akleg.gov/basis/statutes.asp?media=print&secStart=29.45.290&secEnd=29.45.500) | corrected |
| summary.2 | For example, the Municipality of Anchorage held a tax-foreclosed property sale on September 16, 2026. | none: administrative practice (Municipality of Anchorage) | [link](https://www.muni.org/Departments/hlb/pages/resforeclosedproperties.aspx) | corrected |
| summary.3 | Statute: AS 29.45.290–29.45.500. | AS 29.45.320 | [link](https://www.akleg.gov/basis/statutes.asp?media=print&secStart=29.45.290&secEnd=29.45.500) | corrected |
| typeWhy.1 | Property not redeemed is deeded to the municipality, which may sell it if it is not needed for a public purpose. | AS 29.45.460 | [link](https://www.akleg.gov/basis/statutes.asp?media=print&secStart=29.45.290&secEnd=29.45.500) | corrected |
| typeWhy.2 | A party with an interest in the property can redeem it for at least one year after transfer to the municipality. | AS 29.45.400 | [link](https://www.akleg.gov/basis/statutes.asp?media=print&secStart=29.45.290&secEnd=29.45.500) | corrected |
| typeWhy.3 | AS 29.45.400. | AS 29.45.400 | [link](https://www.akleg.gov/basis/statutes.asp?media=print&secStart=29.45.290&secEnd=29.45.500) | corrected |
| rateWhy.1 | Buyers do not receive interest: foreclosed property goes to the municipality for the lien amount. | AS 29.45.390 | [link](https://www.akleg.gov/basis/statutes.asp?media=print&secStart=29.45.290&secEnd=29.45.500) | corrected |
| rateWhy.2 | (removed) | AS 29.45.460 | [link](https://www.akleg.gov/basis/statutes.asp?media=print&secStart=29.45.290&secEnd=29.45.500) | corrected |
| rateWhy.3 | AS 29.45.390. | AS 29.45.390 | [link](https://www.akleg.gov/basis/statutes.asp?media=print&secStart=29.45.290&secEnd=29.45.500) | corrected |
| keyNotes.1 | Boroughs and cities take and sell tax-foreclosed property | AS 29.45.450 | [link](https://www.akleg.gov/basis/statutes.asp?media=print&secStart=29.45.290&secEnd=29.45.500) | corrected |
| keyNotes.2 | (removed) | AS 29.45.360 | [link](https://www.akleg.gov/basis/statutes.asp?media=print&secStart=29.45.290&secEnd=29.45.500) | corrected |
| keyNotes.3 | Each municipality decides by ordinance whether to keep foreclosed property; contact the borough or city before bidding | AS 29.45.460 | [link](https://www.akleg.gov/basis/statutes.asp?media=print&secStart=29.45.290&secEnd=29.45.500) | corrected |
| notBeginnerReason.1 | Each borough or city forecloses under its own ordinances. | AS 29.45.320 | [link](https://www.akleg.gov/basis/statutes.asp?media=print&secStart=29.45.290&secEnd=29.45.500) | corrected |
| notBeginnerReason.2 | (removed) | AS 29.45.320 | [link](https://www.akleg.gov/basis/statutes.asp?media=print&secStart=29.45.290&secEnd=29.45.500) | corrected |
| beginnerTip.1 | (removed) | AS 29.45.320 | [link](https://www.akleg.gov/basis/statutes.asp?media=print&secStart=29.45.290&secEnd=29.45.500) | corrected |
| beginnerTip.2 | Anchorage posts its tax-foreclosed property sale lists and results online. | none: administrative practice (Municipality of Anchorage) | [link](https://www.muni.org/Departments/hlb/pages/resforeclosedproperties.aspx) | corrected |
| risks.1 | Anchorage sells "as is", without warranty | none: administrative practice (Municipality of Anchorage) | [link](https://www.muni.org/Departments/hlb/pages/resforeclosedproperties.aspx) | corrected |
| risks.2 | (removed) | AS 29.45.360 | [link](https://www.akleg.gov/basis/statutes.asp?media=print&secStart=29.45.290&secEnd=29.45.500) | corrected |
| risks.3 | (removed) | AS 29.45.360 | [link](https://www.akleg.gov/basis/statutes.asp?media=print&secStart=29.45.290&secEnd=29.45.500) | corrected |
| risks.4 | Rules vary because each municipality acts by ordinance | AS 29.45.460 | [link](https://www.akleg.gov/basis/statutes.asp?media=print&secStart=29.45.290&secEnd=29.45.500) | corrected |
| ddExtra.1 | Check for prior recorded federal and state tax liens, which survive the transfer to the municipality | AS 29.45.450 | [link](https://www.akleg.gov/basis/statutes.asp?media=print&secStart=29.45.290&secEnd=29.45.500) | corrected |
| ddExtra.2 | (removed) | AS 29.45.360 | [link](https://www.akleg.gov/basis/statutes.asp?media=print&secStart=29.45.290&secEnd=29.45.500) | corrected |
| ddExtra.3 | Research liens, encumbrances and restrictions yourself before bidding (Anchorage terms) | none: administrative practice (Municipality of Anchorage) | [link](https://www.muni.org/Departments/hlb/pages/resforeclosedproperties.aspx) | corrected |
| signup.platform | Borough or city specific | AS 29.45.450 | [link](https://www.akleg.gov/basis/statutes.asp?media=print&secStart=29.45.290&secEnd=29.45.500) | corrected |
| signup.steps.1 | Identify your target borough at commerce.alaska.gov | none: administrative practice (DCRA) |  | unreachable |
| signup.steps.2 | Contact the borough or city clerk; the foreclosure list is open for public inspection at the clerk's office | AS 29.45.330 | [link](https://www.akleg.gov/basis/statutes.asp?media=print&secStart=29.45.290&secEnd=29.45.500) | corrected |
| signup.steps.3 | Ask for the list of tax-foreclosed property the municipality has approved for sale | AS 29.45.460 | [link](https://www.akleg.gov/basis/statutes.asp?media=print&secStart=29.45.290&secEnd=29.45.500) | corrected |
| signup.steps.4 | Follow that municipality's bid instructions; Anchorage uses sealed bids | none: administrative practice (Municipality of Anchorage) | [link](https://www.muni.org/Departments/hlb/pages/resforeclosedproperties.aspx) | corrected |
| signup.deposit.1 | Varies by borough or city. | AS 29.45.460 | [link](https://www.akleg.gov/basis/statutes.asp?media=print&secStart=29.45.290&secEnd=29.45.500) | flagged |
| signup.deposit.2 | (removed) | AS 29.45.460 | [link](https://www.akleg.gov/basis/statutes.asp?media=print&secStart=29.45.290&secEnd=29.45.500) | corrected |
| otc.available | Not generally available | AS 29.45.460 | [link](https://www.akleg.gov/basis/statutes.asp?media=print&secStart=29.45.290&secEnd=29.45.500) | flagged |
| otc.note.1 | No statewide OTC program. | AS 29.45.460 | [link](https://www.akleg.gov/basis/statutes.asp?media=print&secStart=29.45.290&secEnd=29.45.500) | flagged |
| platforms.1 | Borough or city sale (Anchorage: Real Estate Department) | none: administrative practice (Municipality of Anchorage) | [link](https://www.muni.org/Departments/hlb/pages/resforeclosedproperties.aspx) | corrected |
| surplus.1 | If the municipality held the property under 10 years after redemption ended and never designated it for public use, the former owner is entitled to the part of the sale proceeds that exceeds the unpaid taxes and the other amounts listed in AS 29.45.480(b). | AS 29.45.480 | [link](https://www.akleg.gov/basis/statutes.asp?media=print&secStart=29.45.290&secEnd=29.45.500) | corrected |
| surplus.2 | The claim must be filed within six months of the sale. | AS 29.45.480 | [link](https://www.akleg.gov/basis/statutes.asp?media=print&secStart=29.45.290&secEnd=29.45.500) | corrected |
| es.rate | Sin interés para compradores: la municipalidad se queda con la propiedad | AS 29.45.390 | [link](https://www.akleg.gov/basis/statutes.asp?media=print&secStart=29.45.290&secEnd=29.45.500) | corrected |
| es.redemption | Al menos 1 año después de pasar a la municipalidad | AS 29.45.400 | [link](https://www.akleg.gov/basis/statutes.asp?media=print&secStart=29.45.290&secEnd=29.45.500) | corrected |
| es.summary.1 | En Alaska, el borough o la ciudad (la municipalidad) ejecuta los impuestos atrasados sobre bienes inmuebles. | AS 29.45.320 | [link](https://www.akleg.gov/basis/statutes.asp?media=print&secStart=29.45.290&secEnd=29.45.500) | corrected |
| es.summary.2 | Por ejemplo, la Municipalidad de Anchorage realizó una venta de propiedades embargadas por impuestos el 16 de septiembre de 2026. | none: administrative practice (Municipality of Anchorage) | [link](https://www.muni.org/Departments/hlb/pages/resforeclosedproperties.aspx) | corrected |
| es.summary.3 | Estatuto: AS 29.45.290–29.45.500. | AS 29.45.320 | [link](https://www.akleg.gov/basis/statutes.asp?media=print&secStart=29.45.290&secEnd=29.45.500) | corrected |
| es.typeWhy.1 | La propiedad no redimida pasa por escritura a la municipalidad, que puede venderla si no la necesita para un fin público. | AS 29.45.460 | [link](https://www.akleg.gov/basis/statutes.asp?media=print&secStart=29.45.290&secEnd=29.45.500) | corrected |
| es.rateWhy.1 | Los compradores no reciben interés: la propiedad ejecutada pasa a la municipalidad por el monto del gravamen. | AS 29.45.390 | [link](https://www.akleg.gov/basis/statutes.asp?media=print&secStart=29.45.290&secEnd=29.45.500) | corrected |
| es.rateWhy.2 | (removed) | AS 29.45.460 | [link](https://www.akleg.gov/basis/statutes.asp?media=print&secStart=29.45.290&secEnd=29.45.500) | corrected |
| es.notBeginnerReason.1 | Cada borough o ciudad ejecuta según sus propias ordenanzas. | AS 29.45.320 | [link](https://www.akleg.gov/basis/statutes.asp?media=print&secStart=29.45.290&secEnd=29.45.500) | corrected |
| es.beginnerTip.1 | (removed) | AS 29.45.320 | [link](https://www.akleg.gov/basis/statutes.asp?media=print&secStart=29.45.290&secEnd=29.45.500) | corrected |
| es.beginnerTip.2 | Anchorage publica en línea sus listas y resultados de ventas de propiedades embargadas por impuestos. | none: administrative practice (Municipality of Anchorage) | [link](https://www.muni.org/Departments/hlb/pages/resforeclosedproperties.aspx) | corrected |
| es.risks.1 | Anchorage vende "tal como está", sin respaldo ni declaraciones | none: administrative practice (Municipality of Anchorage) | [link](https://www.muni.org/Departments/hlb/pages/resforeclosedproperties.aspx) | corrected |
| es.risks.2 | (removed) | AS 29.45.360 | [link](https://www.akleg.gov/basis/statutes.asp?media=print&secStart=29.45.290&secEnd=29.45.500) | corrected |
| es.risks.3 | (removed) | AS 29.45.360 | [link](https://www.akleg.gov/basis/statutes.asp?media=print&secStart=29.45.290&secEnd=29.45.500) | corrected |
| es.risks.4 | Las reglas varían porque cada municipalidad actúa por ordenanza | AS 29.45.460 | [link](https://www.akleg.gov/basis/statutes.asp?media=print&secStart=29.45.290&secEnd=29.45.500) | corrected |
| es.ddExtra.1 | Revise si hay gravámenes fiscales federales y estatales registrados antes, que subsisten tras pasar a la municipalidad | AS 29.45.450 | [link](https://www.akleg.gov/basis/statutes.asp?media=print&secStart=29.45.290&secEnd=29.45.500) | corrected |
| es.ddExtra.2 | (removed) | AS 29.45.360 | [link](https://www.akleg.gov/basis/statutes.asp?media=print&secStart=29.45.290&secEnd=29.45.500) | corrected |
| es.ddExtra.3 | Investigue usted mismo gravámenes, cargas y restricciones antes de ofertar (condiciones de Anchorage) | none: administrative practice (Municipality of Anchorage) | [link](https://www.muni.org/Departments/hlb/pages/resforeclosedproperties.aspx) | corrected |
| es.signup.platform | Específico por borough o ciudad | AS 29.45.450 | [link](https://www.akleg.gov/basis/statutes.asp?media=print&secStart=29.45.290&secEnd=29.45.500) | corrected |
| es.signup.steps.1 | Identifique su borough objetivo en commerce.alaska.gov | none: administrative practice (DCRA) |  | unreachable |
| es.signup.steps.2 | Contacte al secretario (clerk) del borough o la ciudad; la lista de ejecución está abierta a inspección pública en su oficina | AS 29.45.330 | [link](https://www.akleg.gov/basis/statutes.asp?media=print&secStart=29.45.290&secEnd=29.45.500) | corrected |
| es.signup.steps.3 | Pida la lista de propiedades embargadas por impuestos que la municipalidad aprobó para la venta | AS 29.45.460 | [link](https://www.akleg.gov/basis/statutes.asp?media=print&secStart=29.45.290&secEnd=29.45.500) | corrected |
| es.signup.steps.4 | Siga las instrucciones de oferta de esa municipalidad; Anchorage usa ofertas en sobre cerrado | none: administrative practice (Municipality of Anchorage) | [link](https://www.muni.org/Departments/hlb/pages/resforeclosedproperties.aspx) | corrected |
| es.signup.deposit.1 | Varía por borough o ciudad. | AS 29.45.460 | [link](https://www.akleg.gov/basis/statutes.asp?media=print&secStart=29.45.290&secEnd=29.45.500) | flagged |
| es.signup.deposit.2 | (removed) | AS 29.45.460 | [link](https://www.akleg.gov/basis/statutes.asp?media=print&secStart=29.45.290&secEnd=29.45.500) | corrected |
| es.otc.note.1 | No hay programa OTC estatal. | AS 29.45.460 | [link](https://www.akleg.gov/basis/statutes.asp?media=print&secStart=29.45.290&secEnd=29.45.500) | flagged |

## Corrections (before → after)

- `rate`: “Varies” → “No interest to buyers: the municipality takes the property”
- `rateNote`: “Borough system — not county-based” → “Unredeemed property is deeded to the borough or city”
- `redemption`: “1 year” → “At least 1 year after transfer to the municipality”
- `statute`: “AS §29.45.330” → “AS 29.45.290–29.45.500”
- `auctionPlatform`: “Borough-run — in-person and online varies” → “Run by the borough or city that took the property”
- `auctionTiming`: “Varies by borough” → “Set locally, after unredeemed property is deeded to the municipality”
- `summary.1`: “Alaska operates through boroughs (not counties).” → “In Alaska, the borough or city (the municipality) forecloses on delinquent real property taxes.”
- `summary.2`: “The Matanuska-Susitna and Fairbanks North Star boroughs occasionally sell tax-foreclosed properties.” → “For example, the Municipality of Anchorage held a tax-foreclosed property sale on September 16, 2026.”
- `summary.3`: “Statute: AS §29.45.” → “Statute: AS 29.45.290–29.45.500.”
- `typeWhy.1`: “Alaska sells the property outright through borough-level tax foreclosure auctions — the buyer receives a deed, not a lien.” → “Property not redeemed is deeded to the municipality, which may sell it if it is not needed for a public purpose.”
- `typeWhy.2`: “Some boroughs allow a 1-year redemption period.” → “A party with an interest in the property can redeem it for at least one year after transfer to the municipality.”
- `typeWhy.3`: “AS §29.45.” → “AS 29.45.400.”
- `rateWhy.1`: “Alaska has no fixed statutory interest rate on tax sales.” → “Buyers do not receive interest: foreclosed property goes to the municipality for the lien amount.”
- `rateWhy.2`: “Bidding is market-driven, with prices determined by competitive auction at the borough level.” → “(removed)”
- `rateWhy.3`: “AS §29.45.” → “AS 29.45.390.”
- `keyNotes.1`: “Alaska uses boroughs not counties — 19 organized boroughs plus unorganized areas” → “Boroughs and cities take and sell tax-foreclosed property”
- `keyNotes.2`: “Low inventory state — remote and rural parcels dominate” → “(removed)”
- `keyNotes.3`: “Bidding method varies by municipality — always contact borough directly before registering” → “Each municipality decides by ordinance whether to keep foreclosed property; contact the borough or city before bidding”
- `notBeginnerReason.1`: “Borough-based system, limited inventory, federal land ownership restricts most parcels.” → “Each borough or city forecloses under its own ordinances.”
- `notBeginnerReason.2`: “Requires local connections.” → “(removed)”
- `beginnerTip.1`: “Not a recommended starting state.” → “(removed)”
- `beginnerTip.2`: “If pursuing Alaska, focus on Matanuska-Susitna Borough which has the most consistent auction activity.” → “Anchorage posts its tax-foreclosed property sale lists and results online.”
- `risks.1`: “Federal land ownership restricts a large percentage of available parcels” → “Anchorage sells "as is", without warranty”
- `risks.2`: “Remote properties have extreme logistics costs” → “(removed)”
- `risks.3`: “Very low inventory — not a reliable primary market” → “(removed)”
- `risks.4`: “Borough rules vary significantly” → “Rules vary because each municipality acts by ordinance”
- `ddExtra.1`: “Verify parcel is not federal, state, or Native corporation land before bidding” → “Check for prior recorded federal and state tax liens, which survive the transfer to the municipality”
- `ddExtra.2`: “Check BLM land atlas for ownership classification” → “(removed)”
- `ddExtra.3`: “Confirm road access — many parcels are landlocked or fly-in only” → “Research liens, encumbrances and restrictions yourself before bidding (Anchorage terms)”
- `signup.platform`: “Borough-specific” → “Borough or city specific”
- `signup.steps.2`: “Contact the borough assessor or tax collector directly — no centralized state system” → “Contact the borough or city clerk; the foreclosure list is open for public inspection at the clerk's office”
- `signup.steps.3`: “Request the tax foreclosure list when available” → “Ask for the list of tax-foreclosed property the municipality has approved for sale”
- `signup.steps.4`: “Register and attend the auction per borough instructions — most require in-person attendance” → “Follow that municipality's bid instructions; Anchorage uses sealed bids”
- `signup.deposit.2`: “Confirm directly.” → “(removed)”
- `platforms.1`: “Borough assessor offices” → “Borough or city sale (Anchorage: Real Estate Department)”
- `surplus.1`: “Status pending — monitoring for legislative action.” → “If the municipality held the property under 10 years after redemption ended and never designated it for public use, the former owner is entitled to the part of the sale proceeds that exceeds the unpaid taxes and the other amounts listed in AS 29.45.480(b).”
- `surplus.2`: “(new)” → “The claim must be filed within six months of the sale.”

## Pass 2 trims and removals

- `bidMethod`: flagged: AS 29.45 says unneeded property "may be sold" but sets no bid method; local ordinances not audited
- `typeWhy.1`: trimmed: dropped "auctions" and "buyer receives a deed" (no quote on sale method or buyer deed)
- `rateWhy.2`: removed: no official source says bidding is competitive or market-driven
- `keyNotes.1`: trimmed: removed "19 organized boroughs plus unorganized areas" (DCRA source blocked, HTTP 403)
- `keyNotes.2`: removed: inventory and parcel-type claims have no official source
- `notBeginnerReason.1`: trimmed: removed "limited inventory" and "federal land restricts most parcels" (no official source)
- `notBeginnerReason.2`: removed: opinion, no source
- `beginnerTip.1`: removed: opinion, no source
- `beginnerTip.2`: replaced Mat-Su claim ("most consistent auction activity") which has no official source
- `risks.1`: replaced federal-land percentage claim (no official source)
- `risks.2`: removed: no source
- `risks.3`: removed: no source
- `ddExtra.1`: replaced federal/Native land check (no official source)
- `ddExtra.2`: removed: BLM atlas tip has no official Alaska source fetched
- `ddExtra.3`: replaced road-access claim (no source)
- `signup.steps.1`: unreachable: DCRA site returned HTTP 403
- `signup.steps.4`: trimmed: removed "most require in-person attendance" (no source)
- `signup.deposit.1`: flagged: deposits are not in AS 29.45
- `signup.deposit.2`: removed: the flag note already says to confirm with the county
- `otc.available`: flagged: AS 29.45 does not address over-the-counter sales
- `otc.note.1`: flagged: see otc.available
- `surplus.1`: pass 2 trim: was "...claim sale proceeds above taxes, interest and costs" (quote names unpaid taxes only)

## Conflicts (flagged)

- `bidMethod`: AS 29.45.460 sets no bid method; method comes from municipal ordinances not yet audited
- `signup.deposit.1`: Deposits are not set in AS 29.45; local rules not audited
- `otc.available`: No state OTC rule in AS 29.45; municipalities may sell unsold property by ordinance
- `otc.note.1`: Same as otc.available

## Unreachable sources

- `signup.steps.1` / `es.signup.steps.1` (commerce.alaska.gov DCRA): HTTP 403 on https://www.commerce.alaska.gov/web/dcra/ and
  https://www.commerce.alaska.gov/web/dcra/OfficeoftheStateAssessor.aspx (logged in `attempts/ak.jsonl`). Shown with
  "Couldn't reach source". No other official copy of that page was found.

## 2023–2026 enacted law search

- Searched the legislature's Passed Legislation lists for the 33rd (2023–2024) and 34th (2025–2026) Legislatures
  (https://www.akleg.gov/basis/Bill/Passed/33 and /34, snapshots `passed-33`, `passed-34`) for titles mentioning tax,
  property or foreclosure.
- Candidates read in full (BASIS bill text view, snapshots `sb179-33-text`, `hb13-34-text`):
  - SB 179 (33rd), Chapter 28 SLA 24: amends AS 29.45.050, .060, .110, .180, .200, .210, .650, .700, .750 (exemptions,
    assessment, other taxes). No change to AS 29.45.290–.490 foreclosure, redemption, sale or excess proceeds.
  - HB 13 (34th), Chapter 25 SLA 26: amends AS 29.45.050 and AS 29.45.500 (refund of taxes). No change to the rules the site shows.
  - SB 77 (33rd) "MUNI PROP TAX EXEMPTION/TAX BLIGHTED PROP": listed with status "RETURNED TO (H) RLS"; not shown as a chapter law, so not a claim.
- The legislature's enrolled-bill PDFs under /PDF/ are disallowed by robots.txt, so the HTML bill text view was used.
- Result: no enacted 2023–2026 act changes what the site says for Alaska. Tyler v. Hennepin: AS 29.45.480(b) already gives
  the former owner the excess; the surplus statement was added from that text.

## Watch

- None pending found in the bill titles searched.

## County details

All borough details show "Confirm with the county", except the Municipality of Anchorage, which links its own Foreclosed
Properties page (checked 2026-10-27; sealed bid sales, September 16, 2026 sale).
