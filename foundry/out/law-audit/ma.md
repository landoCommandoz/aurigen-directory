# Massachusetts (MA) law audit

Checked 2026-10-29. Status: done. Ledger: `cloudflare/data/law/ma.json`.

Official code access: Massachusetts General Laws chapter 60, sections 45, 52, 62, 64A and 65, fetched from malegislature.gov (Massachusetts Legislature).

## Finding

Re-verified the first run's changes against M.G.L. c. 60 on malegislature.gov. The current § 62 sets redemption
interest at "8 per cent upon the original sum", not 16% (the site also said 14% in one note). Owners may redeem until a
foreclosure petition is filed (§ 62); the holder may petition the Land Court to foreclose redemption 12 months after
the sale or taking (§ 65). Treasurers may assign tax titles, singly or bundled, to the highest bidder at a public
auction after 14 days' published notice, for not less than the redemption amount (§ 52). After foreclosure, excess
equity goes to valid claimants (§ 64A, the 2024 post-Tyler reform; § 64A(a) as amended by St. 2025, c. 14, § 23,
effective August 5, 2025). Type changed from "Tax lien" to "Tax title". Removed: Land Court cost estimates, city names,
"every 2–3 years", metro capital and access opinions.

## 2023 to 2026 enacted-law search

malegislature.gov section pages do not show amendment histories, except where a version is pending or recently
changed: § 64A shows "as amended by 2025, 14, Sec. 23 effective August 5, 2025" (St. 2025, c. 14). The act that set the
8% rate in § 62 and created § 64A (believed to be the 2024 municipal finance act) was not fetched or identified this
run. §§ 64B and 64C returned 404 (do not exist). Next MA revisit: fetch the 2024 session law and record its chapter and
effective date.

## Unreachable sources

None.

## Watch

- Confirm the session law that changed § 62 to 8% and created § 64A, with its effective date.

## Claims

| id | shown | statute | link | status |
|---|---|---|---|---|
| type | Tax title (municipal taking; titles may be assigned at auction) | M.G.L. c. 60, § 52 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section52) | corrected |
| rate | Maximum rate set by law: 8% interest on the original sum, from the date of sale | M.G.L. c. 60, § 62 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section62) | corrected |
| rateNote | Holder may petition the Land Court to foreclose redemption 12 months after the sale or taking | M.G.L. c. 60, § 65 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section65) | corrected |
| redemption | Until a foreclosure petition is filed (petition allowed 12 months after the sale or taking) | M.G.L. c. 60, § 62 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section62) | corrected |
| bidMethod | Highest bidder for assignment of tax titles, at least the redemption amount | M.G.L. c. 60, § 52 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section52) | corrected |
| statute | MGL Ch. 60 | M.G.L. c. 60, § 62 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section62) | supported |
| auctionPlatform | City or town treasurer, public auction | M.G.L. c. 60, § 52 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section52) | corrected |
| auctionTiming | Set by each treasurer, after 14 days' published notice | M.G.L. c. 60, § 52 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section52) | corrected |
| summary.1 | Massachusetts city and town treasurers may assign tax titles, singly or bundled, at public auction. | M.G.L. c. 60, § 52 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section52) | corrected |
| summary.2 | Redemption is cut off by a Land Court foreclosure petition, allowed 12 months after the sale or taking. | M.G.L. c. 60, § 65 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section65) | corrected |
| summary.3 | Each city or town sets its own rules for land taken for taxes. | M.G.L. c. 60, § 52 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section52) | corrected |
| summary.4 | Statute: MGL c.60 §62. | M.G.L. c. 60, § 62 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section62) | supported |
| typeWhy.1 | Massachusetts cities and towns take land for unpaid taxes and may assign the tax titles at auction. | M.G.L. c. 60, § 52 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section52) | corrected |
| typeWhy.2 | The owner may redeem until a foreclosure petition is filed. | M.G.L. c. 60, § 62 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section62) | corrected |
| typeWhy.3 | Foreclosure of redemption is by petition in the Land Court. | M.G.L. c. 60, § 65 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section65) | corrected |
| typeWhy.4 | MGL c.60 §62. | M.G.L. c. 60, § 62 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section62) | supported |
| rateWhy.1 | Massachusetts sets redemption interest at 8% on the original sum, from the date of sale. | M.G.L. c. 60, § 62 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section62) | corrected |
| rateWhy.2 | An assignee is paid the assignment amount plus interest at the same rate from the date of assignment. | M.G.L. c. 60, § 62 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section62) | corrected |
| rateWhy.3 | MGL c.60 §62. | M.G.L. c. 60, § 62 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section62) | supported |
| keyNotes.1 | Municipality takes the land first; the treasurer may then assign the tax title at auction | M.G.L. c. 60, § 52 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section52) | corrected |
| keyNotes.2 | Land Court petition forecloses the right of redemption | M.G.L. c. 60, § 65 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section65) | corrected |
| keyNotes.3 | 8% interest on the original sum (§ 62) | M.G.L. c. 60, § 62 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section62) | corrected |
| keyNotes.4 | Tax titles may be assigned individually or bundled | M.G.L. c. 60, § 52 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section52) | corrected |
| keyNotes.5 | (removed) | M.G.L. c. 60, § 52 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section52) | corrected |
| notBeginnerReason.1 | Each town sets its own rules, and foreclosing redemption takes a Land Court petition. | M.G.L. c. 60, § 65 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section65) | corrected |
| beginnerTip.1 | (removed) | M.G.L. c. 60, § 52 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section52) | corrected |
| beginnerTip.2 | (removed) | M.G.L. c. 60, § 65 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section65) | corrected |
| risks.1 | Foreclosing redemption requires a Land Court petition | M.G.L. c. 60, § 65 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section65) | corrected |
| risks.2 | (removed) | M.G.L. c. 60, § 52 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section52) | corrected |
| risks.3 | (removed) | M.G.L. c. 60, § 52 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section52) | corrected |
| ddExtra.1 | Watch for the treasurer's published auction notice (at least 14 days ahead) | M.G.L. c. 60, § 52 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section52) | corrected |
| ddExtra.2 | Plan for a Land Court foreclosure petition before any resale | M.G.L. c. 60, § 65 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section65) | corrected |
| ddExtra.3 | (removed) | M.G.L. c. 60, § 65 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section65) | corrected |
| signup.platform | City or town treasurer | M.G.L. c. 60, § 52 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section52) | corrected |
| signup.steps.1 | Identify your target city or town treasurer | M.G.L. c. 60, § 52 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section52) | corrected |
| signup.steps.2 | Watch for the auction notice, published at least 14 days before | M.G.L. c. 60, § 52 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section52) | corrected |
| signup.steps.3 | Ask the treasurer for the list of tax titles offered and the auction rules | M.G.L. c. 60, § 52 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section52) | corrected |
| signup.steps.4 | Bids must be at least the redemption amount | M.G.L. c. 60, § 52 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section52) | corrected |
| signup.deposit.1 | Set by each city or town; confirm with the treasurer. | M.G.L. c. 60, § 52 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section52) | corrected |
| otc.available | Not set by statute; towns set their own rules for land taken for taxes | M.G.L. c. 60, § 52 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section52) | corrected |
| otc.note.1 | Ask the treasurer about tax titles the town holds. | M.G.L. c. 60, § 52 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section52) | corrected |
| platforms.1 | City and town treasurer offices | M.G.L. c. 60, § 52 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section52) | corrected |
| surplus.1 | After foreclosure, excess equity is paid to parties who make a valid claim (M.G.L. c. 60, § 64A). | M.G.L. c. 60, § 64A(b)(2) | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section64A) | corrected |
| es.rate | Tasa máxima fijada por la ley: 8% de interés sobre la suma original, desde la fecha de venta | M.G.L. c. 60, § 62 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section62) | corrected |
| es.redemption | Hasta que se presenta una petición de ejecución (permitida 12 meses después de la venta o toma) | M.G.L. c. 60, § 62 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section62) | corrected |
| es.summary.1 | Los tesoreros de ciudades y pueblos de Massachusetts pueden ceder títulos fiscales, solos o en lotes, en subasta pública. | M.G.L. c. 60, § 52 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section52) | corrected |
| es.summary.2 | La redención termina con una petición de ejecución ante el Tribunal de Tierras, permitida 12 meses después de la venta o toma. | M.G.L. c. 60, § 65 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section65) | corrected |
| es.summary.3 | Cada ciudad o pueblo fija sus propias reglas para la tierra tomada por impuestos. | M.G.L. c. 60, § 52 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section52) | corrected |
| es.summary.4 | Estatuto: MGL c.60 §62. | M.G.L. c. 60, § 62 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section62) | supported |
| es.typeWhy.1 | Las ciudades y pueblos de Massachusetts toman la tierra por impuestos impagos y pueden ceder los títulos fiscales en subasta (MGL c.60 §62). | M.G.L. c. 60, § 52 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section52) | corrected |
| es.typeWhy.2 | La ejecución de la redención se hace por petición ante el Tribunal de Tierras. | M.G.L. c. 60, § 65 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section65) | corrected |
| es.rateWhy.1 | Massachusetts fija el interés de redención en 8% sobre la suma original, desde la fecha de venta. | M.G.L. c. 60, § 62 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section62) | corrected |
| es.notBeginnerReason.1 | Cada pueblo fija sus propias reglas, y ejecutar la redención requiere una petición ante el Tribunal de Tierras. | M.G.L. c. 60, § 65 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section65) | corrected |
| es.beginnerTip.1 | (removed) | M.G.L. c. 60, § 52 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section52) | corrected |
| es.beginnerTip.2 | (removed) | M.G.L. c. 60, § 65 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section65) | corrected |
| es.risks.1 | Ejecutar la redención requiere una petición ante el Tribunal de Tierras | M.G.L. c. 60, § 65 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section65) | corrected |
| es.risks.2 | (removed) | M.G.L. c. 60, § 52 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section52) | corrected |
| es.risks.3 | (removed) | M.G.L. c. 60, § 52 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section52) | corrected |
| es.ddExtra.1 | Esté atento al aviso de subasta publicado por el tesorero (al menos 14 días antes) | M.G.L. c. 60, § 52 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section52) | corrected |
| es.ddExtra.2 | Prevea una petición de ejecución ante el Tribunal de Tierras antes de cualquier reventa | M.G.L. c. 60, § 65 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section65) | corrected |
| es.ddExtra.3 | (removed) | M.G.L. c. 60, § 65 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section65) | corrected |
| es.signup.platform | Tesorero de la ciudad o pueblo | M.G.L. c. 60, § 52 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section52) | corrected |
| es.signup.steps.1 | Identifique al tesorero de su ciudad o pueblo objetivo | M.G.L. c. 60, § 52 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section52) | corrected |
| es.signup.steps.2 | Esté atento al aviso de subasta, publicado al menos 14 días antes | M.G.L. c. 60, § 52 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section52) | corrected |
| es.signup.steps.3 | Pida al tesorero la lista de títulos fiscales ofrecidos y las reglas de la subasta | M.G.L. c. 60, § 52 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section52) | corrected |
| es.signup.steps.4 | Las ofertas deben ser al menos el monto de redención | M.G.L. c. 60, § 52 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section52) | corrected |
| es.signup.deposit.1 | Fijado por cada ciudad o pueblo; confirme con el tesorero. | M.G.L. c. 60, § 52 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section52) | corrected |
| es.otc.note.1 | Pregunte al tesorero por los títulos fiscales que tiene el pueblo. | M.G.L. c. 60, § 52 | [link](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter60/Section52) | corrected |

## Corrections (before → after)

- `type`: “Tax lien” → “Tax title (municipal taking; titles may be assigned at auction)”
- `rate`: “16%” → “Maximum rate set by law: 8% interest on the original sum, from the date of sale”
- `rateNote`: “Municipal tax taking — Land Court required for clean title” → “Holder may petition the Land Court to foreclose redemption 12 months after the sale or taking”
- `redemption`: “6 months to 3 years (Land Court process)” → “Until a foreclosure petition is filed (petition allowed 12 months after the sale or taking)”
- `bidMethod`: “Municipal-controlled process” → “Highest bidder for assignment of tax titles, at least the redemption amount”
- `auctionPlatform`: “Municipal — varies by city/town” → “City or town treasurer, public auction”
- `auctionTiming`: “Year-round” → “Set by each treasurer, after 14 days' published notice”
- `summary.1`: “Massachusetts municipalities sell tax liens.” → “Massachusetts city and town treasurers may assign tax titles, singly or bundled, at public auction.”
- `summary.2`: “After purchase, full title requires Land Court quiet title.” → “Redemption is cut off by a Land Court foreclosure petition, allowed 12 months after the sale or taking.”
- `summary.3`: “No statewide platform.” → “Each city or town sets its own rules for land taken for taxes.”
- `typeWhy.1`: “Massachusetts municipalities sell tax lien certificates.” → “Massachusetts cities and towns take land for unpaid taxes and may assign the tax titles at auction.”
- `typeWhy.2`: “The investor holds the lien while the owner has 6 months to 3 years to redeem.” → “The owner may redeem until a foreclosure petition is filed.”
- `typeWhy.3`: “Full title requires a quiet title action in Land Court.” → “Foreclosure of redemption is by petition in the Land Court.”
- `rateWhy.1`: “Massachusetts sets a statutory interest rate of 16% per annum on tax lien certificates.” → “Massachusetts sets redemption interest at 8% on the original sum, from the date of sale.”
- `rateWhy.2`: “This fixed rate is uniform across all municipalities.” → “An assignee is paid the assignment amount plus interest at the same rate from the date of assignment.”
- `keyNotes.1`: “Municipality initiates tax taking — not a traditional auction” → “Municipality takes the land first; the treasurer may then assign the tax title at auction”
- `keyNotes.2`: “Land Court action required to obtain clean, insurable title” → “Land Court petition forecloses the right of redemption”
- `keyNotes.3`: “14% statutory rate on the taking amount” → “8% interest on the original sum (§ 62)”
- `keyNotes.4`: “Bulk sales used in some municipalities — individual retail access limited” → “Tax titles may be assigned individually or bundled”
- `keyNotes.5`: “Boston and Cambridge have essentially no retail investor access” → “(removed)”
- `notBeginnerReason.1`: “Municipal auctions only, Land Court process required for title, expensive in metro areas.” → “Each town sets its own rules, and foreclosing redemption takes a Land Court petition.”
- `beginnerTip.1`: “Worcester, Springfield, and Fall River have the most consistent municipal sale activity.” → “(removed)”
- `beginnerTip.2`: “Budget for Land Court quiet title costs ($3,000–$8,000) before bidding on anything you'd want to resell.” → “(removed)”
- `risks.1`: “Land Court process is required for insurable title — adds $3,000–$8,000 in costs” → “Foreclosing redemption requires a Land Court petition”
- `risks.2`: “Many municipalities auction every 2–3 years — limited auction activity” → “(removed)”
- `risks.3`: “Metro areas (Boston, Cambridge) require significant capital for any meaningful position” → “(removed)”
- `ddExtra.1`: “Confirm the municipal sale schedule — many towns only sell every 2–3 years” → “Watch for the treasurer's published auction notice (at least 14 days ahead)”
- `ddExtra.2`: “Budget for Land Court quiet title action before planning any resale” → “Plan for a Land Court foreclosure petition before any resale”
- `ddExtra.3`: “Check for municipal improvement liens that could be superior to your lien” → “(removed)”
- `signup.platform`: “Municipal tax collector (town-specific)” → “City or town treasurer”
- `signup.steps.1`: “Identify your target municipality at mass.gov/info-details/mass-interactive-property-tax-data” → “Identify your target city or town treasurer”
- `signup.steps.2`: “Contact the town tax collector 60 days before their scheduled sale” → “Watch for the auction notice, published at least 14 days before”
- `signup.steps.3`: “Request the delinquent property list and registration instructions” → “Ask the treasurer for the list of tax titles offered and the auction rules”
- `signup.steps.4`: “Most sales are in-person at the town hall or courthouse” → “Bids must be at least the redemption amount”
- `signup.deposit.1`: “Varies by municipality.” → “Set by each city or town; confirm with the treasurer.”
- `otc.available`: “Not generally available” → “Not set by statute; towns set their own rules for land taken for taxes”
- `otc.note.1`: “No OTC program.” → “Ask the treasurer about tax titles the town holds.”
- `platforms.1`: “Municipal tax collector offices” → “City and town treasurer offices”
- `surplus.1`: “Status pending — monitoring for legislative action.” → “After foreclosure, excess equity is paid to parties who make a valid claim (M.G.L. c. 60, § 64A).”

## Pass 2 trims, removals and notes

- `type`: was "Tax lien"
- `rate`: was "16%" (current § 62 says 8 per cent)
- `rateNote`: was "Municipal tax taking — Land Court required for clean title"
- `redemption`: was "6 months to 3 years (Land Court process)". pass 2: 12-month part rests on § 65
- `bidMethod`: was "Municipal-controlled process". pass 2: minimum rests on § 52 min quote
- `auctionPlatform`: was "Municipal — varies by city/town"
- `auctionTiming`: was "Year-round"
- `summary.1`: was "municipalities sell tax liens"
- `summary.2`: was "full title requires Land Court quiet title"
- `summary.3`: was "No statewide platform."
- `typeWhy.1`: was "sell tax lien certificates"
- `typeWhy.2`: was "6 months to 3 years"
- `typeWhy.3`: was "quiet title action in Land Court"
- `rateWhy.1`: was "16% per annum"
- `rateWhy.2`: was "uniform across all municipalities"
- `keyNotes.1`: trimmed
- `keyNotes.2`: was "Land Court action required to obtain clean, insurable title"
- `keyNotes.3`: was "14% statutory rate on the taking amount"
- `keyNotes.4`: removed "individual retail access limited"
- `keyNotes.5`: removed: no official source (cost estimate, city names, schedule or access opinion)
- `notBeginnerReason.1`: removed "expensive in metro areas". pass 2: town rules rest on § 52 regs quote
- `beginnerTip.1`: removed: no official source (cost estimate, city names, schedule or access opinion)
- `beginnerTip.2`: removed: no official source (cost estimate, city names, schedule or access opinion)
- `risks.1`: removed "$3,000–$8,000"
- `risks.2`: removed: no official source (cost estimate, city names, schedule or access opinion)
- `risks.3`: removed: no official source (cost estimate, city names, schedule or access opinion)
- `ddExtra.1`: was "many towns only sell every 2–3 years"
- `ddExtra.2`: was "Budget for Land Court quiet title action"
- `ddExtra.3`: removed: no official source (cost estimate, city names, schedule or access opinion)
- `signup.platform`: was "Municipal tax collector (town-specific)"
- `signup.steps.1`: removed mass.gov data link
- `signup.steps.2`: was "Contact the town tax collector 60 days before"
- `signup.steps.3`: trimmed
- `signup.steps.4`: was "Most sales are in-person at the town hall or courthouse"
- `signup.deposit.1`: was "Varies by municipality."
- `otc.available`: was "Not generally available"
- `otc.note.1`: was "No OTC program."
- `platforms.1`: collector replaced by treasurer
- `surplus.1`: was "Status pending — monitoring for legislative action."

## Conflicts (flagged)

None.
