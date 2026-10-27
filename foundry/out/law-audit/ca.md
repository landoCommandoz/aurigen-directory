# California (CA) law audit

Checked 2026-10-27. Status: done. Ledger: `cloudflare/data/law/ca.json`.

Official code access: California codes on leginfo.legislature.ca.gov returned HTTP 403 to the runner. Claims cite the California State Controller's County Tax Collectors' Reference Manual, Chapter 8000 (01/2026), and the SCO Excess Proceeds Guide (2025), which quote the Revenue and Taxation Code section by section.

Main finding: California sells tax-defaulted property (tax deed) after five years of default, or three years for
nonresidential commercial property (§ 3691). The owner's right to redeem ends at close of business on the last business
day before the sale (§ 3707). The minimum bid is at least the amount needed to redeem (§ 3698.5), not "near assessed value"
or "market value". If the IRS holds a lien, the United States can redeem for 120 days after the sale (§ 3712(g); 26 U.S.C.
§ 7425(d)). Parties of interest can claim excess proceeds during a one-year period (§ 4675). The surplus statement was added
from that text. Vendor names (GovEase, Bid4Assets), LA County dates, deposit ranges and competition claims were removed,
because they are county details with no county source in this audit.

## Unreachable sources

- leginfo.legislature.ca.gov (official California codes) returned HTTP 403 for RTC §§ 3691, 3693, 3698.5, 3707, 3712, 3725
  and 4675 (\`attempts/ca.jsonl\`). The SCO manual and guide quote these sections and were used instead, so no claim is
  shown as unreachable. A first SCO URL (ctcrm_chapter8000.pdf) returned only a site page; the current file is ctcrm_chapter8.pdf.
- The one-year limit to challenge a sale (§ 3725) is not quoted in the fetched SCO text, so that statement was removed.

## 2023–2026 enacted law search

- leginfo.legislature.ca.gov (bill search and chaptered bills) returned HTTP 403, so the official bill search could not be used.
- Lead search (web) for 2023–2026 changes to excess proceeds and tax-defaulted sales found AB 2705 (2026), on agreements with
  third parties who file excess proceeds claims (Assembly Revenue and Taxation Committee analysis, April 27, 2026). Its final
  status was not confirmed, so it is not a claim.
- The SCO manual is dated 01/2026 and the Excess Proceeds Guide 2025, so they reflect the code as of those dates.
- Result: no enacted 2023–2026 change found that alters what the site says; the official search should be repeated when leginfo is reachable.

## Watch

- AB 2705 (2026): excess proceeds claim agreements with third parties. Status unconfirmed.

## Claims

| id | shown | statute | link | status |
|---|---|---|---|---|
| type | Tax deed | Cal. Rev. & Tax. Code § 4675 | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/SCO_ExcessProceedsGuide.pdf) | supported |
| rate | No interest rate: property is sold to the highest bidder | Cal. Rev. & Tax. Code §§ 3692, 3706 | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/ctcrm_chapter8.pdf) | corrected |
| rateNote | Minimum bid is at least the amount needed to redeem | Cal. Rev. & Tax. Code § 3698.5 | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/SCO_ExcessProceedsGuide.pdf) | corrected |
| redemption | Ends at close of business on the last business day before the sale | Cal. Rev. & Tax. Code § 3707 | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/ctcrm_chapter8.pdf) | corrected |
| bidMethod | Highest bidder | Cal. Rev. & Tax. Code §§ 3692, 3706 | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/ctcrm_chapter8.pdf) | supported |
| statute | Cal. Rev. & Tax. Code § 3691 et seq. | Cal. Rev. & Tax. Code § 3691 et seq. | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/SCO_ExcessProceedsGuide.pdf) | corrected |
| auctionPlatform | Public auction (in person or internet) or sealed bid | Cal. Rev. & Tax. Code § 3692 | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/ctcrm_chapter8.pdf) | corrected |
| auctionTiming | (removed) | Cal. Rev. & Tax. Code § 3692 | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/ctcrm_chapter8.pdf) | corrected |
| summary.1 | California property can be sold after five years of tax default (three years for nonresidential commercial property). | Cal. Rev. & Tax. Code § 3691 | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/ctcrm_chapter8.pdf) | corrected |
| summary.2 | The minimum bid is at least the amount needed to redeem the property. | Cal. Rev. & Tax. Code § 3698.5 | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/SCO_ExcessProceedsGuide.pdf) | corrected |
| summary.3 | Conducted by county tax collectors. | Cal. Rev. & Tax. Code § 3691 et seq. | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/SCO_ExcessProceedsGuide.pdf) | supported |
| summary.4 | Statute: CA Rev & Tax Code §3691. | Cal. Rev. & Tax. Code § 3691 et seq. | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/SCO_ExcessProceedsGuide.pdf) | supported |
| typeWhy.1 | The county sells the property and records a tax deed to the purchaser. | Cal. Rev. & Tax. Code § 4675 | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/SCO_ExcessProceedsGuide.pdf) | corrected |
| typeWhy.2 | The owner's right to redeem ends at close of business on the last business day before the sale. | Cal. Rev. & Tax. Code § 3707 | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/ctcrm_chapter8.pdf) | corrected |
| typeWhy.3 | CA Rev & Tax Code §3691. | Cal. Rev. & Tax. Code § 3691 et seq. | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/SCO_ExcessProceedsGuide.pdf) | supported |
| rateWhy.1 | Buyers pay a bid price; the minimum bid is at least the amount needed to redeem. | Cal. Rev. & Tax. Code § 3698.5 | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/SCO_ExcessProceedsGuide.pdf) | corrected |
| rateWhy.2 | There is no interest rate because the county sells the property, not a lien. | Cal. Rev. & Tax. Code § 3691 et seq. | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/SCO_ExcessProceedsGuide.pdf) | corrected |
| rateWhy.3 | CA Rev & Tax Code §3691. | Cal. Rev. & Tax. Code § 3691 et seq. | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/SCO_ExcessProceedsGuide.pdf) | supported |
| keyNotes.1 | (removed) | Cal. Rev. & Tax. Code § 3691 et seq. | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/SCO_ExcessProceedsGuide.pdf) | corrected |
| keyNotes.2 | If the IRS holds a lien, the United States can redeem for 120 days after the sale | Cal. Rev. & Tax. Code § 3712(g); 26 U.S.C. § 7425(d) | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/ctcrm_chapter8.pdf) | corrected |
| keyNotes.3 | (removed) | Cal. Rev. & Tax. Code § 3691 et seq. | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/SCO_ExcessProceedsGuide.pdf) | corrected |
| keyNotes.4 | (removed) | Cal. Rev. & Tax. Code § 3691 et seq. | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/SCO_ExcessProceedsGuide.pdf) | corrected |
| notBeginnerReason.1 | Property must be tax-defaulted for five years (three for nonresidential commercial) before it can be sold. | Cal. Rev. & Tax. Code § 3691 | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/ctcrm_chapter8.pdf) | corrected |
| beginnerTip.1 | (removed) | Cal. Rev. & Tax. Code § 3691 et seq. | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/SCO_ExcessProceedsGuide.pdf) | corrected |
| beginnerTip.2 | (removed) | Cal. Rev. & Tax. Code § 3691 et seq. | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/SCO_ExcessProceedsGuide.pdf) | corrected |
| risks.1 | Minimum bids are at least the full amount needed to redeem | Cal. Rev. & Tax. Code § 3698.5 | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/SCO_ExcessProceedsGuide.pdf) | corrected |
| risks.2 | (removed) | Cal. Rev. & Tax. Code § 3691 et seq. | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/SCO_ExcessProceedsGuide.pdf) | corrected |
| risks.3 | (removed) | Cal. Rev. & Tax. Code § 3691 et seq. | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/SCO_ExcessProceedsGuide.pdf) | corrected |
| risks.4 | (removed) | Cal. Rev. & Tax. Code § 3691 et seq. | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/SCO_ExcessProceedsGuide.pdf) | corrected |
| ddExtra.1 | Check that the property has been tax-defaulted long enough to be sold (five years, or three for nonresidential commercial) | Cal. Rev. & Tax. Code § 3691 | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/ctcrm_chapter8.pdf) | corrected |
| ddExtra.2 | (removed) | Cal. Rev. & Tax. Code § 3691 et seq. | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/SCO_ExcessProceedsGuide.pdf) | corrected |
| ddExtra.3 | Check for IRS liens: the United States may redeem for 120 days after the sale | Cal. Rev. & Tax. Code § 3712(g); 26 U.S.C. § 7425(d) | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/ctcrm_chapter8.pdf) | corrected |
| signup.platform | County tax collector: public auction (in person or internet) or sealed bid | Cal. Rev. & Tax. Code § 3692 | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/ctcrm_chapter8.pdf) | corrected |
| signup.steps.1 | Find your target county's tax sale through the county tax collector | Cal. Rev. & Tax. Code § 3691 et seq. | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/SCO_ExcessProceedsGuide.pdf) | corrected |
| signup.steps.2 | Register for the county's auction (in person or internet) | Cal. Rev. & Tax. Code § 3692 | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/ctcrm_chapter8.pdf) | corrected |
| signup.steps.3 | (removed) | Cal. Rev. & Tax. Code § 3691 et seq. | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/SCO_ExcessProceedsGuide.pdf) | corrected |
| signup.steps.4 | Bid online or in person per county instructions | Cal. Rev. & Tax. Code § 3692 | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/ctcrm_chapter8.pdf) | corrected |
| signup.deposit.1 | (removed) | Cal. Rev. & Tax. Code § 3691 et seq. | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/SCO_ExcessProceedsGuide.pdf) | corrected |
| signup.deposit.2 | (removed) | Cal. Rev. & Tax. Code § 3691 et seq. | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/SCO_ExcessProceedsGuide.pdf) | corrected |
| otc.available | Not generally available | Cal. Rev. & Tax. Code § 3698.5(c) | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/ctcrm_chapter8.pdf) | flagged |
| otc.note.1 | Unsold property may be re-offered at the same or a later sale with a reduced minimum bid. | Cal. Rev. & Tax. Code § 3698.5(c) | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/ctcrm_chapter8.pdf) | corrected |
| platforms.1 | (removed) | Cal. Rev. & Tax. Code § 3691 et seq. | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/SCO_ExcessProceedsGuide.pdf) | corrected |
| platforms.2 | County tax collector auctions (in person, internet or sealed bid) | Cal. Rev. & Tax. Code § 3692 | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/ctcrm_chapter8.pdf) | corrected |
| surplus.1 | Any party of interest at the time of the sale may claim excess proceeds during a one-year period (Rev. & Tax. Code § 4675). | Cal. Rev. & Tax. Code § 4675 | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/SCO_ExcessProceedsGuide.pdf) | corrected |
| es.rate | Sin tasa de interés: la propiedad se vende al mejor postor | Cal. Rev. & Tax. Code §§ 3692, 3706 | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/ctcrm_chapter8.pdf) | corrected |
| es.redemption | Termina al cierre del último día hábil antes de la venta | Cal. Rev. & Tax. Code § 3707 | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/ctcrm_chapter8.pdf) | corrected |
| es.summary.1 | En California la propiedad puede venderse tras cinco años de morosidad fiscal (tres años para propiedad comercial no residencial). | Cal. Rev. & Tax. Code § 3691 | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/ctcrm_chapter8.pdf) | corrected |
| es.summary.2 | La puja mínima es al menos el monto necesario para redimir la propiedad. | Cal. Rev. & Tax. Code § 3698.5 | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/SCO_ExcessProceedsGuide.pdf) | corrected |
| es.summary.3 | Estatuto: CA Rev & Tax Code §3691. | Cal. Rev. & Tax. Code § 3691 et seq. | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/SCO_ExcessProceedsGuide.pdf) | supported |
| es.typeWhy.1 | El condado vende la propiedad y registra una escritura fiscal a favor del comprador. | Cal. Rev. & Tax. Code § 4675 | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/SCO_ExcessProceedsGuide.pdf) | corrected |
| es.rateWhy.1 | Los compradores pagan un precio de puja; la puja mínima es al menos el monto necesario para redimir. | Cal. Rev. & Tax. Code § 3698.5 | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/SCO_ExcessProceedsGuide.pdf) | corrected |
| es.rateWhy.2 | No hay tasa de interés porque el condado vende la propiedad, no un gravamen. | Cal. Rev. & Tax. Code § 3691 et seq. | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/SCO_ExcessProceedsGuide.pdf) | corrected |
| es.notBeginnerReason.1 | La propiedad debe tener cinco años de morosidad fiscal (tres para comercial no residencial) antes de poder venderse. | Cal. Rev. & Tax. Code § 3691 | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/ctcrm_chapter8.pdf) | corrected |
| es.beginnerTip.1 | (removed) | Cal. Rev. & Tax. Code § 3691 et seq. | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/SCO_ExcessProceedsGuide.pdf) | corrected |
| es.beginnerTip.2 | (removed) | Cal. Rev. & Tax. Code § 3691 et seq. | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/SCO_ExcessProceedsGuide.pdf) | corrected |
| es.risks.1 | Las pujas mínimas son al menos el monto total necesario para redimir | Cal. Rev. & Tax. Code § 3698.5 | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/SCO_ExcessProceedsGuide.pdf) | corrected |
| es.risks.2 | (removed) | Cal. Rev. & Tax. Code § 3691 et seq. | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/SCO_ExcessProceedsGuide.pdf) | corrected |
| es.risks.3 | (removed) | Cal. Rev. & Tax. Code § 3691 et seq. | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/SCO_ExcessProceedsGuide.pdf) | corrected |
| es.risks.4 | (removed) | Cal. Rev. & Tax. Code § 3691 et seq. | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/SCO_ExcessProceedsGuide.pdf) | corrected |
| es.ddExtra.1 | Verifique que la propiedad lleve suficiente tiempo en morosidad para venderse (cinco años, o tres para comercial no residencial) | Cal. Rev. & Tax. Code § 3691 | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/ctcrm_chapter8.pdf) | corrected |
| es.ddExtra.2 | (removed) | Cal. Rev. & Tax. Code § 3691 et seq. | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/SCO_ExcessProceedsGuide.pdf) | corrected |
| es.ddExtra.3 | Revise gravámenes del IRS: Estados Unidos puede redimir durante 120 días después de la venta | Cal. Rev. & Tax. Code § 3712(g); 26 U.S.C. § 7425(d) | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/ctcrm_chapter8.pdf) | corrected |
| es.signup.platform | Recaudador de impuestos del condado: subasta pública (en persona o por internet) o oferta sellada | Cal. Rev. & Tax. Code § 3692 | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/ctcrm_chapter8.pdf) | corrected |
| es.signup.steps.1 | Encuentre la venta fiscal de su condado a través del recaudador de impuestos del condado | Cal. Rev. & Tax. Code § 3691 et seq. | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/SCO_ExcessProceedsGuide.pdf) | corrected |
| es.signup.steps.2 | Regístrese en la subasta del condado (en persona o por internet) | Cal. Rev. & Tax. Code § 3692 | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/ctcrm_chapter8.pdf) | corrected |
| es.signup.steps.3 | (removed) | Cal. Rev. & Tax. Code § 3691 et seq. | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/SCO_ExcessProceedsGuide.pdf) | corrected |
| es.signup.steps.4 | Puje en línea o en persona según las instrucciones del condado | Cal. Rev. & Tax. Code § 3692 | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/ctcrm_chapter8.pdf) | corrected |
| es.signup.deposit.1 | (removed) | Cal. Rev. & Tax. Code § 3691 et seq. | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/SCO_ExcessProceedsGuide.pdf) | corrected |
| es.signup.deposit.2 | (removed) | Cal. Rev. & Tax. Code § 3691 et seq. | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/SCO_ExcessProceedsGuide.pdf) | corrected |
| es.otc.note.1 | La propiedad no vendida puede ofrecerse de nuevo en la misma venta o en una posterior con una puja mínima reducida. | Cal. Rev. & Tax. Code § 3698.5(c) | [link](https://sco.ca.gov/Files-ARD-Tax-Info/Tax-Collector-Ref-Man/ctcrm_chapter8.pdf) | corrected |

## Corrections (before → after)

- `rate`: “Varies (market value bids)” → “No interest rate: property is sold to the highest bidder”
- `rateNote`: “County auctions property — 1-year challenge period after sale” → “Minimum bid is at least the amount needed to redeem”
- `redemption`: “None post-sale” → “Ends at close of business on the last business day before the sale”
- `statute`: “CA Revenue & Tax Code §3712” → “Cal. Rev. & Tax. Code § 3691 et seq.”
- `auctionPlatform`: “GovEase (LA County and most major counties)” → “Public auction (in person or internet) or sealed bid”
- `auctionTiming`: “Year-round — LA County 2026 confirmed April and June via GovEase” → “(removed)”
- `summary.1`: “California requires minimum 5 years of tax delinquency before county auctions.” → “California property can be sold after five years of tax default (three years for nonresidential commercial property).”
- `summary.2`: “Opening bids are set near assessed value.” → “The minimum bid is at least the amount needed to redeem the property.”
- `typeWhy.1`: “California sells the property deed outright at auction after 5 years of tax delinquency.” → “The county sells the property and records a tax deed to the purchaser.”
- `typeWhy.2`: “There is no post-sale redemption period — the buyer receives full title.” → “The owner's right to redeem ends at close of business on the last business day before the sale.”
- `rateWhy.1`: “California uses market-value bidding at auction with opening bids set near assessed value.” → “Buyers pay a bid price; the minimum bid is at least the amount needed to redeem.”
- `rateWhy.2`: “There is no statutory interest rate because the state sells the deed outright.” → “There is no interest rate because the county sells the property, not a lien.”
- `keyNotes.1`: “1-year challenge period after sale — title companies will not insure during this window” → “(removed)”
- `keyNotes.2`: “IRS liens survive tax deed sale — always check federal liens before bidding” → “If the IRS holds a lien, the United States can redeem for 120 days after the sale”
- `keyNotes.3`: “LA County 2026 auctions: April and June confirmed on GovEase” → “(removed)”
- `keyNotes.4`: “High competition in coastal counties — best value in Central Valley and inland” → “(removed)”
- `notBeginnerReason.1`: “Minimum 5 years delinquency, bids open at market value, intense institutional competition, no direct purchase.” → “Property must be tax-defaulted for five years (three for nonresidential commercial) before it can be sold.”
- `beginnerTip.1`: “California is not a beginner state.” → “(removed)”
- `beginnerTip.2`: “If you're set on California, look at rural counties (Lassen, Modoc, Siskiyou) where competition is lower and opening bids are lower.” → “(removed)”
- `risks.1`: “Opening bids near market value — little to no discount” → “Minimum bids are at least the full amount needed to redeem”
- `risks.2`: “Institutional competition is among the highest in the country” → “(removed)”
- `risks.3`: “5-year delinquency requirement creates very limited inventory” → “(removed)”
- `risks.4`: “Tenants have strong protections — factor eviction costs into any occupied property” → “(removed)”
- `ddExtra.1`: “Verify 5-year delinquency is fully met before bidding” → “Check that the property has been tax-defaulted long enough to be sold (five years, or three for nonresidential commercial)”
- `ddExtra.2`: “Check for active tenants — California eviction process can take 12–18 months” → “(removed)”
- `ddExtra.3`: “Run title search for IRS liens, HOA super-liens, and Mello-Roos assessments” → “Check for IRS liens: the United States may redeem for 120 days after the sale”
- `signup.platform`: “Bid4Assets.com (most counties) or county-specific portals” → “County tax collector: public auction (in person or internet) or sealed bid”
- `signup.steps.1`: “Find your target county's tax sale schedule at the county tax collector's website” → “Find your target county's tax sale through the county tax collector”
- `signup.steps.2`: “Register on Bid4Assets.com or the county's auction platform” → “Register for the county's auction (in person or internet)”
- `signup.steps.3`: “Submit a deposit (typically $500–$5,000 depending on county) to qualify for bidding” → “(removed)”
- `signup.steps.4`: “Bid online or in person per county instructions — opening bids are near market value” → “Bid online or in person per county instructions”
- `signup.deposit.1`: “Deposit required.” → “(removed)”
- `signup.deposit.2`: “Varies by county — typically $500–$5,000.” → “(removed)”
- `otc.note.1`: “No direct purchase option in California.” → “Unsold property may be re-offered at the same or a later sale with a reduced minimum bid.”
- `platforms.1`: “Bid4Assets.com” → “(removed)”
- `platforms.2`: “County tax collector portals” → “County tax collector auctions (in person, internet or sealed bid)”
- `surplus.1`: “Status pending — monitoring for legislative action.” → “Any party of interest at the time of the sale may claim excess proceeds during a one-year period (Rev. & Tax. Code § 4675).”

## Pass 2 trims, removals and notes

- `rateNote`: was "1-year challenge period after sale" (not in any fetched source)
- `auctionPlatform`: removed vendor names (GovEase): county detail without a county source
- `auctionTiming`: removed: no official source (county or vendor detail without a county source, or opinion)
- `summary.2`: was "near assessed value"
- `typeWhy.2`: trimmed: removed "buyer receives full title" (IRS can still redeem; deed effects in § 3712 not read)
- `keyNotes.1`: removed: one-year challenge period (§ 3725) and title insurance claims not in any fetched source
- `keyNotes.2`: trimmed: "IRS liens survive" replaced with the redemption right the quote states
- `keyNotes.3`: removed: no official source (county or vendor detail without a county source, or opinion)
- `keyNotes.4`: removed: no official source (county or vendor detail without a county source, or opinion)
- `notBeginnerReason.1`: trimmed: removed market value, competition and "no direct purchase" claims
- `beginnerTip.1`: removed: no official source (county or vendor detail without a county source, or opinion)
- `beginnerTip.2`: removed: no official source (county or vendor detail without a county source, or opinion)
- `risks.1`: was "near market value"
- `risks.2`: removed: no official source (county or vendor detail without a county source, or opinion)
- `risks.3`: removed: no official source (county or vendor detail without a county source, or opinion)
- `risks.4`: removed: no official source (county or vendor detail without a county source, or opinion)
- `ddExtra.2`: removed: no official source (county or vendor detail without a county source, or opinion)
- `ddExtra.3`: trimmed: removed HOA and Mello-Roos (not in quote)
- `signup.platform`: removed vendor name (Bid4Assets)
- `signup.steps.2`: removed vendor name
- `signup.steps.3`: removed: "$500–$5,000" deposit has no source
- `signup.steps.4`: trimmed: removed "opening bids are near market value"
- `signup.deposit.1`: removed: deposits not in fetched sources
- `signup.deposit.2`: removed: "$500–$5,000" has no source
- `otc.available`: flagged: no source on over-the-counter sales; unsold property may be re-offered
- `otc.note.1`: was "No direct purchase option"
- `platforms.1`: removed vendor name (Bid4Assets) without a county source
- `surplus.1`: was "Status pending"

## Conflicts (flagged)

- `otc.available`: No official text fetched on OTC; SCO manual says unsold property may be re-offered at a reduced minimum bid
