# Hawaii (HI) law audit

Checked 2026-10-27. Status: done. Ledger: `cloudflare/data/law/hi.json`.

Official code access: Hawaii Revised Statutes on capitol.hawaii.gov returned HTTP 403 to the runner (data.capitol.hawaii.gov 404). Maui County and Hawaii County pages also returned 403. Claims cite the County of Kauai tax sale instructions (rev. Sept. 27, 2018) on kauai.gov, for Kauai only; statewide HRS citations are marked unreachable.

## Finding

Hawaii's statutes could not be read: capitol.hawaii.gov returned HTTP 403 for HRS §§ 246-55 to 246-63 (https and http) and
data.capitol.hawaii.gov returned 404. Maui County (mauicounty.gov) and Hawaii County (hawaiipropertytax.com) documents also
returned 403. The Honolulu Real Property Assessment page fetched but does not contain the tax sale ordinance (ROH §§ 8-5.1 to
8-5.9). The only official tax-sale text read is the County of Kauai's sale instructions (rev. Sept. 27, 2018), so every
rule shown is labeled "Kauai County" and the statewide HRS § 246-60 citations are marked "Couldn't reach source".
The Kauai document is from 2018; a newer one was found only on a vendor host (qpublic.net) and was not used.

Leads not used as citations (web search only): a Honolulu May 5, 2026 auction notice cites ROH §§ 8-5.1 to 8-5.9 and a
one-year redemption; Maui County FAQ and Ordinance 2404 (1995, MCC § 3.48.270) state one year and 12%. Next run on HI
(if revisited) should try the Honolulu ROH PDF and the Maui County Code via the county's own link.

## 2023 to 2026 enacted-law search

- Tried the Hawaii Legislature's measure reports (capitol.hawaii.gov advreports, 2024): HTTP 403, logged in
  `attempts/hi.jsonl`. The legislature's bill and session-law search could not be reached, so no enacted act was
  confirmed or ruled out. Terms intended: "tax sale", "real property tax lien", "redemption", "surplus" (sessions 2023 to 2026).
- Note: since the 1978 constitutional amendment, real property tax is a county power, so county ordinances (ROH ch. 8,
  MCC ch. 3.48, HCC ch. 19, KCC ch. 5A) are the likely governing text. Not verified this run.

## Unreachable sources

- HRS § 246-60: https://www.capitol.hawaii.gov/hrscurrent/Vol05_Ch0261-0319/HRS0246/HRS_0246-0060.htm (403), http copy (403),
  data.capitol.hawaii.gov copy (404).
- Maui County FAQ and Ordinance 2404 (403). Hawaii County Tax Sale FAQ (403).

## Watch

- Whether Hawaii counties changed surplus-proceeds rules after Tyler v. Hennepin County (2023). Not checked: sources blocked.

## Claims

| id | shown | statute | link | status |
|---|---|---|---|---|
| type | Redeemable deed | HRS § 246-60 (as cited by County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | supported |
| rate | Kauai County: redemption interest of 12% per year | HRS § 246-60 (as cited by County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | corrected |
| rateNote | Kauai County: owner may redeem within 1 year of the sale | HRS § 246-60 (as cited by County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | corrected |
| redemption | Kauai County: 1 year from the sale (1 year from recording if the deed is recorded more than 60 days after the sale) | HRS § 246-60 (as cited by County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | corrected |
| bidMethod | Highest bidder | none: administrative practice (County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | supported |
| statute | HRS § 246-60 (cited by Kauai County) | HRS § 246-60 |  | unreachable |
| auctionPlatform | Each county runs its own tax sale | none: administrative practice (County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | corrected |
| auctionTiming | Varies by county | none: administrative practice (County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | supported |
| summary.1 | Each Hawaii county runs its own tax sale. | none: administrative practice (County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | corrected |
| summary.2 | (removed) | none: administrative practice (County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | corrected |
| summary.3 | (removed) | none: administrative practice (County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | corrected |
| summary.4 | Statute: HRS § 246-60 (cited by Kauai County). | HRS § 246-60 |  | unreachable |
| typeWhy.1 | In Kauai County, property is sold at auction and the owner may redeem within one year of the sale. | HRS § 246-60 (as cited by County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | corrected |
| typeWhy.2 | (removed) | none: administrative practice (County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | corrected |
| typeWhy.3 | HRS § 246-60. | HRS § 246-60 |  | unreachable |
| rateWhy.1 | Kauai County's sale instructions set redemption interest at 12% per year, paid to the buyer. | HRS § 246-60 (as cited by County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | corrected |
| rateWhy.2 | (removed) | HRS § 246-60 (as cited by County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | corrected |
| rateWhy.3 | HRS § 246-60. | HRS § 246-60 |  | unreachable |
| keyNotes.1 | Redeemable deed: in Kauai County the owner may redeem within 1 year of the sale | HRS § 246-60 (as cited by County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | corrected |
| keyNotes.2 | (removed) | none: administrative practice (County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | corrected |
| keyNotes.3 | Kauai County: bids must be at least the upset price (taxes, penalty, interest and costs) | none: administrative practice (County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | corrected |
| keyNotes.4 | Kauai County: to redeem, the owner pays the buyer the purchase price, costs, the recording fee and 12% interest per year | HRS § 246-60 (as cited by County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | corrected |
| notBeginnerReason.1 | The owner can redeem within one year of the sale, and each county runs its own sale. | HRS § 246-60 (as cited by County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | corrected |
| beginnerTip.1 | (removed) | none: administrative practice (County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | corrected |
| beginnerTip.2 | (removed) | none: administrative practice (County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | corrected |
| risks.1 | (removed) | none: administrative practice (County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | corrected |
| risks.2 | (removed) | none: administrative practice (County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | corrected |
| risks.3 | Kauai County: the full bid must be paid in cash or cashier's check | none: administrative practice (County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | corrected |
| risks.4 | (removed) | none: administrative practice (County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | corrected |
| ddExtra.1 | (removed) | none: administrative practice (County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | corrected |
| ddExtra.2 | (removed) | none: administrative practice (County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | corrected |
| ddExtra.3 | (removed) | none: administrative practice (County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | corrected |
| signup.platform | County-specific | none: administrative practice (County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | supported |
| signup.steps.1 | Contact the county's real property tax office; each county runs its own tax sale | none: administrative practice (County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | corrected |
| signup.steps.2 | Kauai County makes its foreclosure list available when the first ad runs, usually 4 weeks before the sale | none: administrative practice (County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | corrected |
| signup.steps.3 | (removed) | none: administrative practice (County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | corrected |
| signup.steps.4 | Follow county instructions; in Kauai, agents bidding for others need notarized authorization | none: administrative practice (County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | corrected |
| signup.deposit.1 | Kauai County: full bid paid in cash or cashier's check | none: administrative practice (County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | corrected |
| otc.available | Not generally available | none: administrative practice (County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | flagged |
| otc.note.1 | (removed) | none: administrative practice (County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | corrected |
| platforms.1 | County tax offices | none: administrative practice (County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | supported |
| surplus.1 | Kauai County: the former owner and others with an interest in the property must file a claim to any surplus funds. | none: administrative practice (County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | corrected |
| es.rate | Condado de Kauai: interés de redención de 12% anual | HRS § 246-60 (as cited by County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | corrected |
| es.redemption | Condado de Kauai: 1 año desde la venta (1 año desde el registro si la escritura se registra más de 60 días después de la venta) | HRS § 246-60 (as cited by County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | corrected |
| es.summary.1 | Cada condado de Hawái realiza su propia venta fiscal. | none: administrative practice (County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | corrected |
| es.summary.2 | (removed) | none: administrative practice (County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | corrected |
| es.summary.3 | (removed) | none: administrative practice (County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | corrected |
| es.summary.4 | Estatuto: HRS § 246-60 (citado por el condado de Kauai). | HRS § 246-60 |  | unreachable |
| es.typeWhy.1 | En el condado de Kauai, la propiedad se vende en subasta y el propietario puede redimirla dentro de un año desde la venta. | HRS § 246-60 (as cited by County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | corrected |
| es.rateWhy.1 | Las instrucciones de venta del condado de Kauai fijan el interés de redención en 12% anual, pagado al comprador. | HRS § 246-60 (as cited by County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | corrected |
| es.rateWhy.2 | (removed) | HRS § 246-60 (as cited by County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | corrected |
| es.notBeginnerReason.1 | El propietario puede redimir dentro de un año desde la venta, y cada condado realiza su propia venta. | HRS § 246-60 (as cited by County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | corrected |
| es.beginnerTip.1 | (removed) | none: administrative practice (County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | corrected |
| es.beginnerTip.2 | (removed) | none: administrative practice (County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | corrected |
| es.risks.1 | (removed) | none: administrative practice (County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | corrected |
| es.risks.2 | (removed) | none: administrative practice (County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | corrected |
| es.risks.3 | Condado de Kauai: la puja completa debe pagarse en efectivo o cheque de caja | none: administrative practice (County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | corrected |
| es.risks.4 | (removed) | none: administrative practice (County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | corrected |
| es.ddExtra.1 | (removed) | none: administrative practice (County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | corrected |
| es.ddExtra.2 | (removed) | none: administrative practice (County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | corrected |
| es.ddExtra.3 | (removed) | none: administrative practice (County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | corrected |
| es.signup.platform | Específico por condado | none: administrative practice (County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | supported |
| es.signup.steps.1 | Contacte la oficina de impuesto a la propiedad del condado; cada condado realiza su propia venta fiscal | none: administrative practice (County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | corrected |
| es.signup.steps.2 | El condado de Kauai publica su lista de ejecuciones cuando sale el primer anuncio, normalmente 4 semanas antes de la venta | none: administrative practice (County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | corrected |
| es.signup.steps.3 | (removed) | none: administrative practice (County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | corrected |
| es.signup.steps.4 | Siga las instrucciones del condado; en Kauai, los agentes que pujan por otros necesitan autorización notariada | none: administrative practice (County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | corrected |
| es.signup.deposit.1 | Condado de Kauai: puja completa pagada en efectivo o cheque de caja | none: administrative practice (County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | corrected |
| es.otc.note.1 | (removed) | none: administrative practice (County of Kauai) | [link](https://www.kauai.gov/files/assets/public/finance/documents/tax-sale-inst_rev-27sept2018.pdf) | corrected |

## Corrections (before → after)

- `rate`: “Varies” → “Kauai County: redemption interest of 12% per year”
- `rateNote`: “Annual rate — 1-year post-sale redemption window” → “Kauai County: owner may redeem within 1 year of the sale”
- `redemption`: “1 year” → “Kauai County: 1 year from the sale (1 year from recording if the deed is recorded more than 60 days after the sale)”
- `auctionPlatform`: “County tax collector — in-person” → “Each county runs its own tax sale”
- `summary.1`: “Hawaii has 4 counties.” → “Each Hawaii county runs its own tax sale.”
- `summary.2`: “Many parcels are leasehold (not fee simple).” → “(removed)”
- `summary.3`: “Hawaiian Home Lands and other restricted designations eliminate large portions of the market.” → “(removed)”
- `typeWhy.1`: “Hawaii sells tax-delinquent properties at auction but grants the former owner a 1-year right of redemption, making it a redeemable deed state.” → “In Kauai County, property is sold at auction and the owner may redeem within one year of the sale.”
- `typeWhy.2`: “Many parcels are leasehold rather than fee simple.” → “(removed)”
- `rateWhy.1`: “Hawaii has no fixed statutory interest rate for tax sales.” → “Kauai County's sale instructions set redemption interest at 12% per year, paid to the buyer.”
- `rateWhy.2`: “Auction prices are market-driven, and returns depend on the bid price relative to property value.” → “(removed)”
- `keyNotes.1`: “Redeemable deed state — deed conveyed at sale but owner has 1 year to redeem” → “Redeemable deed: in Kauai County the owner may redeem within 1 year of the sale”
- `keyNotes.2`: “4 counties only (Honolulu, Maui, Hawaii, Kauai) — very limited inventory” → “(removed)”
- `keyNotes.3`: “High property values mean high minimum bids — capital intensive” → “Kauai County: bids must be at least the upset price (taxes, penalty, interest and costs)”
- `keyNotes.4`: “12% on purchase price during redemption period” → “Kauai County: to redeem, the owner pays the buyer the purchase price, costs, the recording fee and 12% interest per year”
- `notBeginnerReason.1`: “Extremely limited inventory, leasehold land complexity, and Hawaiian Home Lands restrictions make this impractical.” → “The owner can redeem within one year of the sale, and each county runs its own sale.”
- `beginnerTip.1`: “Hawaii is not a viable tax lien strategy for most investors.” → “(removed)”
- `beginnerTip.2`: “The leasehold complexity alone makes most parcels impractical.” → “(removed)”
- `risks.1`: “Many parcels are leasehold — you'd own the improvements but not the land” → “(removed)”
- `risks.2`: “Hawaiian Home Lands parcels are completely restricted” → “(removed)”
- `risks.3`: “Extremely high property values require significant capital” → “Kauai County: the full bid must be paid in cash or cashier's check”
- `risks.4`: “Very low inventory” → “(removed)”
- `ddExtra.1`: “Confirm fee simple vs. leasehold status before any due diligence” → “(removed)”
- `ddExtra.2`: “Verify parcel is not in Hawaiian Home Lands designation (DHHL)” → “(removed)”
- `ddExtra.3`: “Check DLNR for any state land or conservation restrictions” → “(removed)”
- `signup.steps.1`: “Contact the County of Hawaii Real Property Tax Division, Maui County, Honolulu DPP, or Kauai Finance Division” → “Contact the county's real property tax office; each county runs its own tax sale”
- `signup.steps.2`: “Request the delinquent property list — availability is sporadic” → “Kauai County makes its foreclosure list available when the first ad runs, usually 4 weeks before the sale”
- `signup.steps.3`: “Confirm whether the parcel is fee simple or leasehold before proceeding” → “(removed)”
- `signup.steps.4`: “Register per county instructions” → “Follow county instructions; in Kauai, agents bidding for others need notarized authorization”
- `signup.deposit.1`: “Varies by county.” → “Kauai County: full bid paid in cash or cashier's check”
- `otc.note.1`: “No OTC program.” → “(removed)”
- `surplus.1`: “Status pending — monitoring for legislative action.” → “Kauai County: the former owner and others with an interest in the property must file a claim to any surplus funds.”

## Pass 2 trims, removals and notes

- `rate`: was "Varies"; Kauai only, from 2018 county instructions
- `rateNote`: trimmed: "annual rate" wording replaced with the redemption window the quote states
- `statute`: unreachable: capitol.hawaii.gov returned HTTP 403 (and data.capitol.hawaii.gov 404) for HRS § 246-60
- `auctionPlatform`: trimmed: removed "in-person" (not in quote)
- `summary.1`: was "Hawaii has 4 counties"
- `summary.2`: removed: no official source fetched (opinion or detail without an official quote)
- `summary.3`: removed: no official source fetched (opinion or detail without an official quote)
- `summary.4`: unreachable: capitol.hawaii.gov returned HTTP 403 (and data.capitol.hawaii.gov 404) for HRS § 246-60
- `typeWhy.1`: trimmed: statewide claim narrowed to Kauai (county source)
- `typeWhy.2`: removed: no official source fetched (opinion or detail without an official quote)
- `typeWhy.3`: unreachable: capitol.hawaii.gov returned HTTP 403 (and data.capitol.hawaii.gov 404) for HRS § 246-60
- `rateWhy.1`: was "no fixed statutory interest rate" (contradicted by Kauai instructions)
- `rateWhy.2`: removed: banned money word ("returns") and no source
- `rateWhy.3`: unreachable: capitol.hawaii.gov returned HTTP 403 (and data.capitol.hawaii.gov 404) for HRS § 246-60
- `keyNotes.1`: trimmed: narrowed to Kauai
- `keyNotes.2`: removed: "very limited inventory" has no source; county list duplicates summary.1
- `keyNotes.3`: was "high minimum bids — capital intensive"
- `keyNotes.4`: trimmed: "on purchase price" replaced with the full list the quote gives
- `notBeginnerReason.1`: trimmed: removed inventory, leasehold and Home Lands claims (no source)
- `beginnerTip.1`: removed: no official source fetched (opinion or detail without an official quote)
- `beginnerTip.2`: removed: no official source fetched (opinion or detail without an official quote)
- `risks.1`: removed: no official source fetched (opinion or detail without an official quote)
- `risks.2`: removed: no official source fetched (opinion or detail without an official quote)
- `risks.3`: was "extremely high property values require significant capital"
- `risks.4`: removed: no official source fetched (opinion or detail without an official quote)
- `ddExtra.1`: removed: no official source fetched (opinion or detail without an official quote)
- `ddExtra.2`: removed: no official source fetched (opinion or detail without an official quote)
- `ddExtra.3`: removed: no official source fetched (opinion or detail without an official quote)
- `signup.steps.1`: removed office names not in quote
- `signup.steps.2`: was "availability is sporadic"
- `signup.steps.3`: removed: no official source fetched (opinion or detail without an official quote)
- `signup.deposit.1`: was "Varies by county"
- `otc.available`: flagged: no official text on over-the-counter sales
- `otc.note.1`: removed: "No OTC program" has no source (see flag on otc.available)
- `surplus.1`: was "Status pending"

## Conflicts (flagged)

- `otc.available`: No official source fetched on over-the-counter sales in any Hawaii county
