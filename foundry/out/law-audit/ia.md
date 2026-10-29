# Iowa (IA) law audit

Checked 2026-10-29. Status: done. Ledger: `cloudflare/data/law/ia.json`.

Official code access: Iowa Code 2026 chapters 446 (tax sales), 447 (redemption) and 448 (deeds) fetched as PDFs from legis.iowa.gov (Iowa Legislature), generated December 9, 2025.

## Finding

Re-verified the first run's changes against Iowa Code 2026 chapters 446-448 (legis.iowa.gov). The regular sale is the
third Monday in June (§ 446.7). Bidding is on the smallest percentage of the parcel for the total amount due, minimum
1% (§ 446.16(1)); the site's bidMethod "Premium bid (highest dollar wins)" and "Overbid earns no interest" contradicted
this and were corrected. Redemption interest is 2% per month on the amount the parcel sold for (§ 447.1). The holder
may serve the notice of expiration 1 year 9 months after the sale, by regular and certified mail, and redemption ends
90 days after completed service (§ 447.9); if no affidavit of service is filed within 3 years, the treasurer cancels the
sale (§ 446.37). The site said the holder "MUST" serve notice at 21 months; the statute says "may". Parcels unsold for a
year go to the public bidder sale, where the county bids if no full bid is received (§§ 446.18, 446.19). Removed:
"highest fixed rate in the U.S.", vendor names and fees, "certified funds only", agricultural and drainage claims, and
the surplus claim citing "SF 569": no surplus-proceeds provision was found in chapters 446, 447 or 448 (2026), so the
claim was removed rather than kept unverified.

## 2023 to 2026 enacted-law search

Searched the history notes in Iowa Code 2026 chapters 446, 447 and 448 for "2023 Acts" to "2026 Acts": none found.
Searched the same chapters for "surplus", "excess", "proceeds" and "fair market": no surplus rule found. Not searched:
the Iowa Legislature bill search for 2025-2026 acts outside these chapters, and the 2026 session (the code PDFs are
dated December 9, 2025).

## Unreachable sources

None.

## Watch

- Post-Tyler: Iowa's tax-deed process (ch. 448) has no surplus-proceeds rule in the 2026 code; watch 2026-2027 bills.
- "SF 569" named on the old site was not verified; check the bill on legis.iowa.gov next time.

## Claims

| id | shown | statute | link | status |
|---|---|---|---|---|
| type | Tax lien | Iowa Code § 446.16(3) | [link](https://www.legis.iowa.gov/docs/code/446.pdf) | supported |
| rate | Maximum rate set by law: 2% per month (24% per year) | Iowa Code § 447.1(1) | [link](https://www.legis.iowa.gov/docs/code/447.pdf) | corrected |
| rateNote | Fixed by law, not bid; interest on the amount the parcel sold for | Iowa Code § 447.1(1) | [link](https://www.legis.iowa.gov/docs/code/447.pdf) | corrected |
| redemption | Until 90 days after notice, which may be served 1 year 9 months after the sale | Iowa Code § 447.9(1) | [link](https://www.legis.iowa.gov/docs/code/447.pdf) | corrected |
| bidMethod | Smallest percentage of the parcel for the total amount due | Iowa Code § 446.16(1) | [link](https://www.legis.iowa.gov/docs/code/446.pdf) | corrected |
| statute | Iowa Code §447.9 | Iowa Code § 447.9(1) | [link](https://www.legis.iowa.gov/docs/code/447.pdf) | supported |
| auctionPlatform | County treasurer | Iowa Code § 446.7(1) | [link](https://www.legis.iowa.gov/docs/code/446.pdf) | corrected |
| auctionTiming | Third Monday in June | Iowa Code § 446.7(1) | [link](https://www.legis.iowa.gov/docs/code/446.pdf) | supported |
| summary.1 | Iowa holds its annual tax lien sale on the third Monday of June statewide. | Iowa Code § 446.7(1) | [link](https://www.legis.iowa.gov/docs/code/446.pdf) | supported |
| summary.2 | Rate is 2% per month (24% per year), set by law and not bid down. | Iowa Code § 447.1(1) | [link](https://www.legis.iowa.gov/docs/code/447.pdf) | corrected |
| summary.3 | Bidding is on the percentage of the parcel, not on rate or price. | Iowa Code § 446.16(1) | [link](https://www.legis.iowa.gov/docs/code/446.pdf) | corrected |
| summary.4 | Lowest percentage interest wins. | Iowa Code § 446.16(1) | [link](https://www.legis.iowa.gov/docs/code/446.pdf) | supported |
| summary.5 | After 1 year 9 months, the holder may serve a 90-day notice of expiration of the right of redemption (§447.9). | Iowa Code § 447.9(1) | [link](https://www.legis.iowa.gov/docs/code/447.pdf) | corrected |
| summary.6 | The holder then files an affidavit of service with the treasurer (§447.12). | Iowa Code § 446.37 | [link](https://www.legis.iowa.gov/docs/code/446.pdf) | corrected |
| summary.7 | If no affidavit is filed within 3 years of the sale, the treasurer cancels the sale (§446.37). | Iowa Code § 446.37 | [link](https://www.legis.iowa.gov/docs/code/446.pdf) | corrected |
| summary.8 | Statute: Iowa Code §446 (sales), §447 (redemption), §447.9 (90-day notice), §447.12 (affidavit), §446.37 (cancellation). | Iowa Code § 446.37 | [link](https://www.legis.iowa.gov/docs/code/446.pdf) | supported |
| typeWhy.1 | Iowa sells tax lien certificates at its annual June sale. | Iowa Code § 446.7(1) | [link](https://www.legis.iowa.gov/docs/code/446.pdf) | supported |
| typeWhy.2 | The holder may serve the 90-day notice 1 year 9 months after the sale. | Iowa Code § 447.9(1) | [link](https://www.legis.iowa.gov/docs/code/447.pdf) | corrected |
| typeWhy.3 | Iowa Code §446. | Iowa Code § 446.7(1) | [link](https://www.legis.iowa.gov/docs/code/446.pdf) | supported |
| rateWhy.1 | Iowa sets redemption interest at 2% per month (24% per year) on the amount the parcel sold for. | Iowa Code § 447.1(1) | [link](https://www.legis.iowa.gov/docs/code/447.pdf) | corrected |
| rateWhy.2 | The rate is not bid down; bidders compete on the percentage of the parcel. | Iowa Code § 446.16(1) | [link](https://www.legis.iowa.gov/docs/code/446.pdf) | corrected |
| rateWhy.3 | Iowa Code §446. | Iowa Code § 446.7(1) | [link](https://www.legis.iowa.gov/docs/code/446.pdf) | supported |
| keyNotes.1 | Rate is 2% per month, set by law | Iowa Code § 447.1(1) | [link](https://www.legis.iowa.gov/docs/code/447.pdf) | corrected |
| keyNotes.2 | If the affidavit of service is not filed within 3 years, the sale is cancelled | Iowa Code § 446.37 | [link](https://www.legis.iowa.gov/docs/code/446.pdf) | corrected |
| keyNotes.3 | Bids are percentages of the parcel; the minimum is 1% | Iowa Code § 446.16(1) | [link](https://www.legis.iowa.gov/docs/code/446.pdf) | corrected |
| beginnerTip.1 | (removed) | Iowa Code § 447.1(1) | [link](https://www.legis.iowa.gov/docs/code/447.pdf) | corrected |
| beginnerTip.2 | Two rules: (1) the 90-day notice may be served from 1 year 9 months after the sale (§447.9). | Iowa Code § 447.9(1) | [link](https://www.legis.iowa.gov/docs/code/447.pdf) | corrected |
| beginnerTip.3 | (2) File the affidavit with the treasurer within 3 years of the sale or the sale is cancelled (§446.37). | Iowa Code § 446.37 | [link](https://www.legis.iowa.gov/docs/code/446.pdf) | corrected |
| beginnerTip.4 | (removed) | Iowa Code § 446.37 | [link](https://www.legis.iowa.gov/docs/code/446.pdf) | corrected |
| beginnerTip.5 | (removed) | Iowa Code § 446.37 | [link](https://www.legis.iowa.gov/docs/code/446.pdf) | corrected |
| risks.1 | The 90-day notice may be served from 1 year 9 months after the sale (§447.9); no deed until redemption expires | Iowa Code § 447.9(1) | [link](https://www.legis.iowa.gov/docs/code/447.pdf) | corrected |
| risks.2 | If no affidavit is filed within 3 years of the sale, the treasurer cancels the sale (§446.37) | Iowa Code § 446.37 | [link](https://www.legis.iowa.gov/docs/code/446.pdf) | corrected |
| risks.3 | Bidding is on percentage of property ownership, not rate — unique mechanism | Iowa Code § 446.16(1) | [link](https://www.legis.iowa.gov/docs/code/446.pdf) | supported |
| risks.4 | (removed) | Iowa Code § 446.16(1) | [link](https://www.legis.iowa.gov/docs/code/446.pdf) | corrected |
| risks.5 | (removed) | Iowa Code § 446.16(1) | [link](https://www.legis.iowa.gov/docs/code/446.pdf) | corrected |
| ddExtra.1 | Track two dates: 1 year 9 months (notice may be served by regular and certified mail) and 3 years (affidavit deadline) | Iowa Code § 447.9(1) | [link](https://www.legis.iowa.gov/docs/code/447.pdf) | corrected |
| ddExtra.2 | Bidding is on the percentage of the parcel; the smallest percentage wins | Iowa Code § 446.16(1) | [link](https://www.legis.iowa.gov/docs/code/446.pdf) | corrected |
| ddExtra.3 | The regular sale is the third Monday in June; confirm details with the county treasurer | Iowa Code § 446.7(1) | [link](https://www.legis.iowa.gov/docs/code/446.pdf) | corrected |
| ddExtra.4 | (removed) | Iowa Code § 446.16(1) | [link](https://www.legis.iowa.gov/docs/code/446.pdf) | corrected |
| signup.platform | County treasurer | Iowa Code § 446.7(1) | [link](https://www.legis.iowa.gov/docs/code/446.pdf) | corrected |
| signup.steps.1 | Contact your target county treasurer about the June sale | Iowa Code § 446.7(1) | [link](https://www.legis.iowa.gov/docs/code/446.pdf) | corrected |
| signup.steps.2 | Register as a bidder; the treasurer may charge a reasonable registration fee | Iowa Code § 446.16(2) | [link](https://www.legis.iowa.gov/docs/code/446.pdf) | corrected |
| signup.steps.3 | Third Monday of June statewide — register in advance | Iowa Code § 446.7(1) | [link](https://www.legis.iowa.gov/docs/code/446.pdf) | supported |
| signup.steps.4.1 | Entities need a federal tax ID number to bid. | Iowa Code § 446.16(4) | [link](https://www.legis.iowa.gov/docs/code/446.pdf) | corrected |
| signup.steps.4.2 | (removed) | Iowa Code § 446.16(4) | [link](https://www.legis.iowa.gov/docs/code/446.pdf) | corrected |
| signup.deposit.1 | The treasurer may charge a reasonable registration fee. | Iowa Code § 446.16(2) | [link](https://www.legis.iowa.gov/docs/code/446.pdf) | corrected |
| signup.deposit.2 | Confirm payment terms with the county treasurer. | Iowa Code § 446.15 | [link](https://www.legis.iowa.gov/docs/code/446.pdf) | corrected |
| otc.available | Ask the treasurer: county-held certificates may be assigned | Iowa Code § 446.16(3) | [link](https://www.legis.iowa.gov/docs/code/446.pdf) | corrected |
| otc.note.1 | Parcels unsold for a year or more are offered at the public bidder sale; if no full bid, the county bids the total due. | Iowa Code § 446.18 | [link](https://www.legis.iowa.gov/docs/code/446.pdf) | corrected |
| platforms.1 | (removed) | Iowa Code § 446.7(1) | [link](https://www.legis.iowa.gov/docs/code/446.pdf) | corrected |
| platforms.2 | (removed) | Iowa Code § 446.7(1) | [link](https://www.legis.iowa.gov/docs/code/446.pdf) | corrected |
| platforms.3 | County treasurer offices | Iowa Code § 446.7(1) | [link](https://www.legis.iowa.gov/docs/code/446.pdf) | supported |
| surplus.1 | (removed) | Iowa Code § 446.37 | [link](https://www.legis.iowa.gov/docs/code/446.pdf) | corrected |
| es.rate | Tasa máxima fijada por la ley: 2% mensual (24% anual) | Iowa Code § 447.1(1) | [link](https://www.legis.iowa.gov/docs/code/447.pdf) | corrected |
| es.redemption | Hasta 90 días después del aviso, que puede enviarse 1 año y 9 meses después de la venta | Iowa Code § 447.9(1) | [link](https://www.legis.iowa.gov/docs/code/447.pdf) | corrected |
| es.summary.1 | Iowa realiza su venta anual el tercer lunes de junio. | Iowa Code § 446.7(1) | [link](https://www.legis.iowa.gov/docs/code/446.pdf) | corrected |
| es.summary.2 | La tasa es del 2% mensual (24% anual), fijada por la ley y no se puja a la baja. | Iowa Code § 447.1(1) | [link](https://www.legis.iowa.gov/docs/code/447.pdf) | corrected |
| es.summary.3 | Después de 1 año y 9 meses, el titular puede enviar un aviso de 90 días del vencimiento del derecho de redención. | Iowa Code § 447.9(1) | [link](https://www.legis.iowa.gov/docs/code/447.pdf) | corrected |
| es.summary.4 | Estatuto: Iowa Code §446. | Iowa Code § 446.7(1) | [link](https://www.legis.iowa.gov/docs/code/446.pdf) | supported |
| es.typeWhy.1 | Iowa vende certificados de gravamen fiscal en su venta anual de junio (Iowa Code §446). | Iowa Code § 446.7(1) | [link](https://www.legis.iowa.gov/docs/code/446.pdf) | corrected |
| es.rateWhy.1 | Iowa fija el interés de redención en 2% mensual (24% anual) sobre el monto por el que se vendió la parcela. | Iowa Code § 447.1(1) | [link](https://www.legis.iowa.gov/docs/code/447.pdf) | corrected |
| es.rateWhy.2 | La tasa no se puja a la baja; los postores compiten por el porcentaje de la parcela (Iowa Code §446). | Iowa Code § 446.16(1) | [link](https://www.legis.iowa.gov/docs/code/446.pdf) | corrected |
| es.beginnerTip.1 | (removed) | Iowa Code § 447.1(1) | [link](https://www.legis.iowa.gov/docs/code/447.pdf) | corrected |
| es.beginnerTip.2 | Dos reglas: (1) el aviso de 90 días puede enviarse desde 1 año y 9 meses después de la venta (§447.9). | Iowa Code § 447.9(1) | [link](https://www.legis.iowa.gov/docs/code/447.pdf) | corrected |
| es.beginnerTip.3 | (2) Presente la declaración jurada ante el tesorero dentro de 3 años de la venta o la venta se cancela (§446.37). | Iowa Code § 446.37 | [link](https://www.legis.iowa.gov/docs/code/446.pdf) | corrected |
| es.beginnerTip.4 | (removed) | Iowa Code § 446.37 | [link](https://www.legis.iowa.gov/docs/code/446.pdf) | corrected |
| es.risks.1 | El aviso de 90 días puede enviarse desde 1 año y 9 meses después de la venta (§447.9); no hay escritura hasta que vence la redención | Iowa Code § 447.9(1) | [link](https://www.legis.iowa.gov/docs/code/447.pdf) | corrected |
| es.risks.2 | (removed) | Iowa Code § 446.16(1) | [link](https://www.legis.iowa.gov/docs/code/446.pdf) | corrected |
| es.risks.3 | Las parcelas no vendidas por un año o más se ofrecen en la venta de postor público; si no hay oferta completa, el condado ofrece el total adeudado. | Iowa Code § 446.18 | [link](https://www.legis.iowa.gov/docs/code/446.pdf) | corrected |
| es.ddExtra.1 | Controle dos fechas: 1 año y 9 meses (el aviso puede enviarse por correo regular y certificado) y 3 años (plazo de la declaración jurada) | Iowa Code § 447.9(1) | [link](https://www.legis.iowa.gov/docs/code/447.pdf) | corrected |
| es.ddExtra.2 | La venta regular es el tercer lunes de junio; confirme los detalles con el tesorero del condado | Iowa Code § 446.7(1) | [link](https://www.legis.iowa.gov/docs/code/446.pdf) | corrected |
| es.ddExtra.3 | (removed) | Iowa Code § 446.16(1) | [link](https://www.legis.iowa.gov/docs/code/446.pdf) | corrected |
| es.signup.platform | Tesorero del condado | Iowa Code § 446.7(1) | [link](https://www.legis.iowa.gov/docs/code/446.pdf) | corrected |
| es.signup.steps.1 | Contacte al tesorero de su condado objetivo sobre la venta de junio | Iowa Code § 446.7(1) | [link](https://www.legis.iowa.gov/docs/code/446.pdf) | corrected |
| es.signup.steps.2 | Regístrese como postor; el tesorero puede cobrar una tarifa de registro razonable | Iowa Code § 446.16(2) | [link](https://www.legis.iowa.gov/docs/code/446.pdf) | corrected |
| es.signup.steps.3 | Tercer lunes de junio en todo el estado — regístrese con anticipación | Iowa Code § 446.7(1) | [link](https://www.legis.iowa.gov/docs/code/446.pdf) | corrected |
| es.signup.steps.4 | Confirme las condiciones de pago con el tesorero del condado. | Iowa Code § 446.15 | [link](https://www.legis.iowa.gov/docs/code/446.pdf) | corrected |
| es.signup.deposit.1 | El tesorero puede cobrar una tarifa de registro razonable. | Iowa Code § 446.16(2) | [link](https://www.legis.iowa.gov/docs/code/446.pdf) | corrected |
| es.otc.note.1 | Las parcelas no vendidas por un año o más se ofrecen en la venta de postor público; si no hay oferta completa, el condado ofrece el total adeudado. | Iowa Code § 446.18 | [link](https://www.legis.iowa.gov/docs/code/446.pdf) | corrected |

## Corrections (before → after)

- `rate`: “24% per year (2% per month) — highest fixed rate in the U.S.” → “Maximum rate set by law: 2% per month (24% per year)”
- `rateNote`: “Highest fixed rate in the US — flat rate, no bidding” → “Fixed by law, not bid; interest on the amount the parcel sold for”
- `redemption`: “1 year 9 months (21 months) + 90-day notice” → “Until 90 days after notice, which may be served 1 year 9 months after the sale”
- `bidMethod`: “Premium bid (highest dollar wins)” → “Smallest percentage of the parcel for the total amount due”
- `auctionPlatform`: “Varies by county” → “County treasurer”
- `summary.2`: “Rate is a flat 24%/year (2%/month) — highest fixed rate in the U.S. NOT bid down at auction.” → “Rate is 2% per month (24% per year), set by law and not bid down.”
- `summary.3`: “UNIQUE BID METHOD: Bidding is on percentage of property OWNERSHIP, not on rate or price.” → “Bidding is on the percentage of the parcel, not on rate or price.”
- `summary.5`: “CRITICAL DEADLINES: After 21 months, holder MUST serve 90-day notice on owner + all parties of record (§447.9).” → “After 1 year 9 months, the holder may serve a 90-day notice of expiration of the right of redemption (§447.9).”
- `summary.6`: “After 90 days, file affidavit with Treasurer (§447.12).” → “The holder then files an affidavit of service with the treasurer (§447.12).”
- `summary.7`: “If affidavit NOT filed within 3 YEARS of sale, certificate automatically CANCELLED — total loss (§446.37). 99 counties.” → “If no affidavit is filed within 3 years of the sale, the treasurer cancels the sale (§446.37).”
- `typeWhy.2`: “The investor holds the lien while the owner has 21 months before the 90-day notice period begins.” → “The holder may serve the 90-day notice 1 year 9 months after the sale.”
- `rateWhy.1`: “Iowa sets a statutory flat rate of 24% per annum (2% per month) on tax lien certificates — the highest fixed rate in the country.” → “Iowa sets redemption interest at 2% per month (24% per year) on the amount the parcel sold for.”
- `rateWhy.2`: “This rate is NOT auction-determined or bid-down; all certificates earn the same 24%.” → “The rate is not bid down; bidders compete on the percentage of the parcel.”
- `keyNotes.1`: “24% is the highest fixed lien rate in the US” → “Rate is 2% per month, set by law”
- `keyNotes.2`: “Affidavit of service deadline is strict — miss it and you lose the lien entirely” → “If the affidavit of service is not filed within 3 years, the sale is cancelled”
- `keyNotes.3`: “Overbid earns no interest” → “Bids are percentages of the parcel; the minimum is 1%”
- `beginnerTip.1`: “Iowa's 24% rate is the best in the country.” → “(removed)”
- `beginnerTip.2`: “TWO critical rules: (1) Set a calendar reminder to serve your 90-day notice at exactly 21 months (§447.9).” → “Two rules: (1) the 90-day notice may be served from 1 year 9 months after the sale (§447.9).”
- `beginnerTip.3`: “(2) File affidavit with Treasurer within 3 YEARS of sale or certificate auto-cancels (§446.37).” → “(2) File the affidavit with the treasurer within 3 years of the sale or the sale is cancelled (§446.37).”
- `beginnerTip.4`: “Missing either deadline = total loss.” → “(removed)”
- `beginnerTip.5`: “That's the #1 mistake Iowa investors make.” → “(removed)”
- `risks.1`: “CRITICAL: Must serve 90-day notice at 21 months (§447.9) — missing this blocks deed” → “The 90-day notice may be served from 1 year 9 months after the sale (§447.9); no deed until redemption expires”
- `risks.2`: “CRITICAL: Must file affidavit within 3 YEARS of sale or certificate auto-cancels — total loss (§446.37)” → “If no affidavit is filed within 3 years of the sale, the treasurer cancels the sale (§446.37)”
- `risks.4`: “Agricultural land dominates inventory in many counties — limited development potential” → “(removed)”
- `risks.5`: “Agricultural drainage district liens can be superior to your lien” → “(removed)”
- `ddExtra.1`: “Set TWO hard calendar reminders: month 21 (serve 90-day notice via certified mail) and year 3 (file affidavit deadline)” → “Track two dates: 1 year 9 months (notice may be served by regular and certified mail) and 3 years (affidavit deadline)”
- `ddExtra.2`: “Bidding is on ownership %, not rate — lowest percentage interest wins” → “Bidding is on the percentage of the parcel; the smallest percentage wins”
- `ddExtra.3`: “Subscribe to the county treasurer's mailing list for the June auction date” → “The regular sale is the third Monday in June; confirm details with the county treasurer”
- `ddExtra.4`: “Check for agricultural drainage district liens — these can be superior to your lien” → “(removed)”
- `signup.platform`: “Iowa Tax Auction / GovEase (split by county)” → “County treasurer”
- `signup.steps.1`: “Go to iowataxauction.com or govease.com and find your target county's June sale” → “Contact your target county treasurer about the June sale”
- `signup.steps.2`: “Create an account and register — ~$40 non-refundable registration fee + W-9 required” → “Register as a bidder; the treasurer may charge a reasonable registration fee”
- `signup.steps.4.1`: “Full payment required at sale.” → “Entities need a federal tax ID number to bid.”
- `signup.steps.4.2`: “Certified funds only.” → “(removed)”
- `signup.deposit.1`: “~$40 non-refundable registration + W-9.” → “The treasurer may charge a reasonable registration fee.”
- `signup.deposit.2`: “Full payment at sale.” → “Confirm payment terms with the county treasurer.”
- `otc.available`: “Not generally available” → “Ask the treasurer: county-held certificates may be assigned”
- `otc.note.1`: “Liens not sold at auction must be purchased directly from the county — contact treasurer after the June sale.” → “Parcels unsold for a year or more are offered at the public bidder sale; if no full bid, the county bids the total due.”
- `platforms.1`: “Iowa Tax Auction” → “(removed)”
- `platforms.2`: “GovEase” → “(removed)”
- `surplus.1`: “Iowa reformed its tax sale surplus process through SF 569.” → “(removed)”

## Pass 2 trims, removals and notes

- `rate`: was "24% per year (2% per month) — highest fixed rate in the U.S."; removed comparison
- `rateNote`: was "Highest fixed rate in the US — flat rate, no bidding"
- `redemption`: was "1 year 9 months (21 months) + 90-day notice". pass 2: 90-day part rests on § 447.9(1) ninety quote
- `bidMethod`: was "Premium bid (highest dollar wins)" (contradicted by § 446.16(1))
- `auctionPlatform`: was "Varies by county"
- `summary.1`: pass 2: "statewide" read as every county treasurer under § 446.7(1)
- `summary.2`: removed comparison and capitals
- `summary.3`: removed capitals
- `summary.5`: was "MUST serve ... on owner + all parties of record"; statute says "may cause to be served" on the person in possession and the taxpayer
- `summary.6`: was "After 90 days, file affidavit"
- `summary.7`: removed "total loss" and "99 counties"
- `typeWhy.2`: trimmed
- `rateWhy.1`: removed comparison
- `rateWhy.2`: removed "earn" (banned word)
- `keyNotes.1`: removed comparison
- `keyNotes.2`: trimmed
- `keyNotes.3`: was "Overbid earns no interest" (no premium bidding in Iowa)
- `beginnerTip.1`: removed: no official source (comparison, opinion, vendor, inventory or drainage claim)
- `beginnerTip.2`: removed "exactly 21 months" advice
- `beginnerTip.3`: trimmed
- `beginnerTip.4`: removed: no official source (comparison, opinion, vendor, inventory or drainage claim)
- `beginnerTip.5`: removed: no official source (comparison, opinion, vendor, inventory or drainage claim)
- `risks.1`: removed "CRITICAL" and "missing this blocks deed"
- `risks.2`: removed "CRITICAL" and "total loss"
- `risks.3`: pass 2: "unique" kept as description of Iowa's rule only
- `risks.4`: removed: no official source (comparison, opinion, vendor, inventory or drainage claim)
- `risks.5`: removed: no official source (comparison, opinion, vendor, inventory or drainage claim)
- `ddExtra.1`: trimmed. pass 2: dates rest on §§ 447.9 and 446.37 quotes
- `ddExtra.2`: trimmed
- `ddExtra.3`: removed mailing-list advice
- `ddExtra.4`: removed: no official source (comparison, opinion, vendor, inventory or drainage claim)
- `signup.platform`: removed Iowa Tax Auction and GovEase (vendors)
- `signup.steps.1`: removed vendor sites
- `signup.steps.2`: removed "~$40" and W-9
- `signup.steps.3`: pass 2: "register in advance" is advice, kept
- `signup.steps.4.1`: was "Full payment required at sale." (not in text read)
- `signup.steps.4.2`: removed: "Certified funds only" not in statute
- `signup.deposit.1`: removed "~$40" and W-9
- `signup.deposit.2`: was "Full payment at sale."
- `otc.available`: was "Not generally available"
- `otc.note.1`: was "Liens not sold at auction must be purchased directly from the county". pass 2: county bid rests on § 446.19(1)
- `platforms.1`: removed: vendor
- `platforms.2`: removed: vendor
- `surplus.1`: removed: "SF 569" surplus reform not found in Iowa Code chapters 446, 447 or 448 (2026); see report

## Conflicts (flagged)

None.
