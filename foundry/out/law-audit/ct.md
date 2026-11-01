# Connecticut (CT) law audit

Checked 2026-11-01. Status: done. Ledger: `cloudflare/data/law/ct.json`.

Official code access: Connecticut General Statutes chapters 204 (sections 12-157 and 12-159) and 205 (section 12-195h), current text fetched from cga.ct.gov (Connecticut General Assembly) after the workflow-installed intermediate certificate chained to a system root (certs/log.jsonl).

Finding: Connecticut sells real property for unpaid taxes by the collector at public auction (§ 12-157) and issues a collector's deed; the site called it a tax lien state with a 1-year redemption. The statute says six months (60 days for abandoned property or as set by town ordinance), changed from one year by P.A. 99-283. Towns may also assign liens (§ 12-195h). Interest on redemption is 18% per year on the total purchase price. Excess proceeds go to an escrow account (§ 12-157(i)).

Certificate: cga.ct.gov was reachable this run once the workflow's cert-chain step had installed the intermediate certificate (see foundry/out/law-audit/certs/log.jsonl). Full certificate checking stayed on.

## 2023 to 2026 law search log

- Searched: current text of chapters 204 and 205 on cga.ct.gov (section histories). 12-157 history ends at P.A. 15-156; 12-195h history ends at P.A. 21-143. No act from 2023 to 2026 appears in either.
- Not searched: cga.ct.gov bill-status pages are disallowed by robots.txt (attempt logged in attempts/ct.jsonl). Gap CT-1.

## Unreachable

None this run. Earlier TLS failures (2026-10-29) are in attempts/ct.jsonl.

## Watch

None found.

## Claims

| id | shown | statute | link | status |
|---|---|---|---|---|
| type | Tax sale of the real property at public auction | Conn. Gen. Stat. § 12-157(c) | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | corrected |
| rate | Maximum rate set by law: 18% per year on the total purchase price, from the date of sale | Conn. Gen. Stat. § 12-157(f) | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | corrected |
| rateNote | Paid by the person who redeems, on the total purchase price paid by the purchaser, from the date of sale | Conn. Gen. Stat. § 12-157(f) | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | corrected |
| redemption | Six months from the date of sale (60 days if the property was abandoned or meets conditions set by town ordinance) | Conn. Gen. Stat. § 12-157(f) | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | corrected |
| bidMethod | Public auction to the highest bidder | Conn. Gen. Stat. § 12-157(c) | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | corrected |
| statute | CGS §12-157 | Conn. Gen. Stat. § 12-157 | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | corrected |
| auctionPlatform | Town tax collector, at a public auction | Conn. Gen. Stat. § 12-157(c) | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | corrected |
| auctionTiming | Notices are posted 9 to 12 weeks before the sale; confirm the date with the town tax collector | Conn. Gen. Stat. § 12-157(a) | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | corrected |
| summary.1 | In Connecticut, the town tax collector may sell real property for unpaid taxes at public auction to the highest bidder. | Conn. Gen. Stat. § 12-157(c) | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | corrected |
| summary.2 | Redemption period: six months from the sale, or 60 days for abandoned property or as set by town ordinance. | Conn. Gen. Stat. § 12-157(f) | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | corrected |
| summary.3 | Statute: CGS §12-157. | Conn. Gen. Stat. § 12-157 | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | supported |
| typeWhy.1 | Connecticut town tax collectors sell real property at public auction for unpaid taxes. | Conn. Gen. Stat. § 12-157(c) | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | corrected |
| typeWhy.2 | The collector's deed stays unrecorded with the town clerk for six months from the date of sale. | Conn. Gen. Stat. § 12-157(e) | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | corrected |
| typeWhy.3 | CGS §12-157. | Conn. Gen. Stat. § 12-157 | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | supported |
| rateWhy.1 | Connecticut sets the redemption interest at 18% per year on the total purchase price, from the date of sale. | Conn. Gen. Stat. § 12-157(f) | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | corrected |
| rateWhy.2 | CGS §12-157. | Conn. Gen. Stat. § 12-157 | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | supported |
| keyNotes.1 | A town may also assign its liens for unpaid real estate taxes, by resolution of its legislative body | Conn. Gen. Stat. § 12-195h(a) | [link](https://www.cga.ct.gov/current/pub/chap_205.htm) | corrected |
| keyNotes.2 | The deed is executed within two weeks of the sale and lodged unrecorded with the town clerk for six months from the sale | Conn. Gen. Stat. § 12-157(e) | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | corrected |
| keyNotes.3 | The sale notice must say that if no one redeems on time, the titles, mortgages and liens of those given notice are extinguished | Conn. Gen. Stat. § 12-157(f) | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | corrected |
| keyNotes.4 | (removed) | Conn. Gen. Stat. § 12-157(f) | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | corrected |
| keyNotes.5 | Abandoned property, or property meeting conditions in a town ordinance: 60 days to redeem | Conn. Gen. Stat. § 12-157(f) | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | corrected |
| notBeginnerReason.1 | The town tax collector conducts the sale. | Conn. Gen. Stat. § 12-157(c) | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | corrected |
| notBeginnerReason.2 | Each collector may publish its own rules for the auction and for payment by successful bidders. | Conn. Gen. Stat. § 12-157(d) | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | corrected |
| beginnerTip.1 | (removed) | Conn. Gen. Stat. § 12-157(c) | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | corrected |
| risks.1 | A town may assign its liens for unpaid taxes; confirm the sale format with the town tax collector. | Conn. Gen. Stat. § 12-195h(a) | [link](https://www.cga.ct.gov/current/pub/chap_205.htm) | corrected |
| risks.2 | Each collector may publish its own auction rules; Confirm with the town tax collector. | Conn. Gen. Stat. § 12-157(d) | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | corrected |
| risks.3 | (removed) | Conn. Gen. Stat. § 12-157(c) | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | corrected |
| ddExtra.1 | Confirm the sale format with the town tax collector | Conn. Gen. Stat. § 12-195h(a) | [link](https://www.cga.ct.gov/current/pub/chap_205.htm) | corrected |
| ddExtra.2 | Check what the collector's deed is subject to (§ 12-159): taxes not yet due when notice of levy was first made, easements and interests described in the deed | Conn. Gen. Stat. § 12-159 | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | corrected |
| ddExtra.3 | (removed) | Conn. Gen. Stat. § 12-157(c) | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | corrected |
| signup.platform | Town tax collector | Conn. Gen. Stat. § 12-157(c) | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | corrected |
| signup.steps.1 | Identify the town where the property is located; the collector posts the sale notice there | Conn. Gen. Stat. § 12-157(a) | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | corrected |
| signup.steps.2 | Ask the town tax collector when the sale is scheduled; notices are posted 9 to 12 weeks before it | Conn. Gen. Stat. § 12-157(a) | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | corrected |
| signup.steps.3 | Read the collector's sale notice, which names the taxpayer and describes the property | Conn. Gen. Stat. § 12-157(a) | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | corrected |
| signup.steps.4 | Follow the collector's published rules for the auction and for payment by successful bidders | Conn. Gen. Stat. § 12-157(d) | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | corrected |
| signup.deposit.1 | Not set by statute; the collector may publish rules for payment. Confirm with the town tax collector. | Conn. Gen. Stat. § 12-157(d) | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | corrected |
| otc.available | If there is no bidder or the bid is too low, the collector may sell to the town. Confirm with the town tax collector. | Conn. Gen. Stat. § 12-157(c)(2) | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | corrected |
| otc.note.1 | Not set by statute. Confirm with the town tax collector. | Conn. Gen. Stat. § 12-157(c)(2) | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | corrected |
| platforms.1 | Town tax collector | Conn. Gen. Stat. § 12-157(c) | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | corrected |
| surplus.1 | Excess sale proceeds are held in a separate interest-bearing escrow account (CGS § 12-157(i)). | Conn. Gen. Stat. § 12-157(i)(1) | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | corrected |
| surplus.2 | If the tax collector pays moneys to the court, the taxpayer, mortgagees and lienholders affected by the sale may apply to the court for payment of the proceeds within 90 days of that payment. | Conn. Gen. Stat. § 12-157(i)(2) | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | corrected |
| es.rate | Tasa máxima fijada por la ley: 18% anual sobre el precio total de compra, desde la fecha de venta | Conn. Gen. Stat. § 12-157(f) | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | corrected |
| es.redemption | Seis meses desde la fecha de venta (60 días si la propiedad estaba abandonada o cumple condiciones fijadas por ordenanza municipal) | Conn. Gen. Stat. § 12-157(f) | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | corrected |
| es.summary.1 | En Connecticut, el recaudador de impuestos del pueblo puede vender propiedades por impuestos impagos en subasta pública al mejor postor. | Conn. Gen. Stat. § 12-157(c) | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | corrected |
| es.summary.2 | (removed) | Conn. Gen. Stat. § 12-157(f) | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | corrected |
| es.summary.3 | Período de redención: seis meses desde la venta, o 60 días para propiedad abandonada o según la ordenanza municipal. | Conn. Gen. Stat. § 12-157(f) | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | corrected |
| es.summary.4 | Estatuto: CGS §12-157. | Conn. Gen. Stat. § 12-157 | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | supported |
| es.typeWhy.1 | En Connecticut, los recaudadores de impuestos de los pueblos venden propiedades en subasta pública por impuestos impagos (CGS §12-157). | Conn. Gen. Stat. § 12-157(c) | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | corrected |
| es.rateWhy.1 | Connecticut fija el interés de redención en 18% anual sobre el precio total de compra, desde la fecha de venta. | Conn. Gen. Stat. § 12-157(f) | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | corrected |
| es.rateWhy.2 | CGS §12-157. | Conn. Gen. Stat. § 12-157 | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | corrected |
| es.notBeginnerReason.1 | El recaudador de impuestos del pueblo realiza la venta. | Conn. Gen. Stat. § 12-157(c) | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | corrected |
| es.notBeginnerReason.2 | Cada recaudador puede publicar sus propias reglas para la subasta y para el pago de los postores ganadores. | Conn. Gen. Stat. § 12-157(d) | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | corrected |
| es.beginnerTip.1 | (removed) | Conn. Gen. Stat. § 12-157(c) | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | corrected |
| es.risks.1 | Un pueblo puede ceder sus gravámenes por impuestos impagos; confirme el formato de venta con el recaudador de impuestos del pueblo. | Conn. Gen. Stat. § 12-195h(a) | [link](https://www.cga.ct.gov/current/pub/chap_205.htm) | corrected |
| es.risks.2 | Cada recaudador puede publicar sus propias reglas de subasta; confirme con el recaudador de impuestos del pueblo. | Conn. Gen. Stat. § 12-157(d) | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | corrected |
| es.risks.3 | (removed) | Conn. Gen. Stat. § 12-157(c) | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | corrected |
| es.ddExtra.1 | Confirme el formato de venta con el recaudador de impuestos del pueblo | Conn. Gen. Stat. § 12-195h(a) | [link](https://www.cga.ct.gov/current/pub/chap_205.htm) | corrected |
| es.ddExtra.2 | Revise a qué está sujeta la escritura del recaudador (§ 12-159): impuestos aún no vencidos cuando se hizo el primer aviso de embargo, servidumbres e intereses descritos en la escritura | Conn. Gen. Stat. § 12-159 | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | corrected |
| es.ddExtra.3 | (removed) | Conn. Gen. Stat. § 12-157(c) | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | corrected |
| es.signup.platform | Recaudador de impuestos del pueblo | Conn. Gen. Stat. § 12-157(c) | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | corrected |
| es.signup.steps.1 | Identifique el pueblo donde está la propiedad; el recaudador publica allí el aviso de venta | Conn. Gen. Stat. § 12-157(a) | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | corrected |
| es.signup.steps.2 | Pregunte al recaudador de impuestos del pueblo cuándo es la venta; los avisos se publican de 9 a 12 semanas antes | Conn. Gen. Stat. § 12-157(a) | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | corrected |
| es.signup.steps.3 | Lea el aviso de venta del recaudador, que indica el nombre del contribuyente y describe la propiedad | Conn. Gen. Stat. § 12-157(a) | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | corrected |
| es.signup.steps.4 | Siga las reglas publicadas por el recaudador para la subasta y para el pago de los postores ganadores | Conn. Gen. Stat. § 12-157(d) | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | corrected |
| es.signup.deposit.1 | No lo fija la ley; el recaudador puede publicar reglas de pago. Confirme con el recaudador de impuestos del pueblo. | Conn. Gen. Stat. § 12-157(d) | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | corrected |
| es.otc.note.1 | No lo fija la ley. Confirme con el recaudador de impuestos del pueblo. | Conn. Gen. Stat. § 12-157(c)(2) | [link](https://www.cga.ct.gov/current/pub/chap_204.htm) | corrected |

## Corrections (before → after)

- `type`: “Tax lien” → “Tax sale of the real property at public auction”
- `rate`: “18% penalty” → “Maximum rate set by law: 18% per year on the total purchase price, from the date of sale”
- `rateNote`: “Annual rate on full purchase price — 6-month standard redemption window” → “Paid by the person who redeems, on the total purchase price paid by the purchaser, from the date of sale”
- `redemption`: “1 year” → “Six months from the date of sale (60 days if the property was abandoned or meets conditions set by town ordinance)”
- `bidMethod`: “Highest bidder” → “Public auction to the highest bidder”
- `statute`: “CGS §12-157 (2025)” → “CGS §12-157”
- `auctionPlatform`: “Township-run — 169 townships across 8 counties each run independent sales” → “Town tax collector, at a public auction”
- `auctionTiming`: “Year-round — varies by township” → “Notices are posted 9 to 12 weeks before the sale; confirm the date with the town tax collector”
- `summary.1`: “Connecticut municipalities independently elect to sell tax liens or redeemable deeds.” → “In Connecticut, the town tax collector may sell real property for unpaid taxes at public auction to the highest bidder.”
- `summary.2`: “No centralized state platform. 1-year redemption.” → “Redemption period: six months from the sale, or 60 days for abandoned property or as set by town ordinance.”
- `typeWhy.1`: “Connecticut municipalities sell tax lien certificates, giving investors the right to collect delinquent taxes with interest.” → “Connecticut town tax collectors sell real property at public auction for unpaid taxes.”
- `typeWhy.2`: “The property owner retains title during the 1-year redemption period.” → “The collector's deed stays unrecorded with the town clerk for six months from the date of sale.”
- `rateWhy.1`: “Connecticut imposes an 18% statutory penalty on redemption — this is a flat penalty structure rather than a compounding annual interest rate.” → “Connecticut sets the redemption interest at 18% per year on the total purchase price, from the date of sale.”
- `keyNotes.1`: “169 townships each run independent sales — no centralized system” → “A town may also assign its liens for unpaid real estate taxes, by resolution of its legislative body”
- `keyNotes.2`: “Deed executed within 2 weeks, held unrecorded at town clerk for 6-month window” → “The deed is executed within two weeks of the sale and lodged unrecorded with the town clerk for six months from the sale”
- `keyNotes.3`: “After redemption expires: deed records, title passes free and clear” → “The sale notice must say that if no one redeems on time, the titles, mortgages and liens of those given notice are extinguished”
- `keyNotes.4`: “18% annualized but effective return is ~9% if redeemed at 6-month mark” → “(removed)”
- `keyNotes.5`: “Abandoned property: redemption window shrinks to 60 days” → “Abandoned property, or property meeting conditions in a town ordinance: 60 days to redeem”
- `notBeginnerReason.1`: “Each municipality independently chooses between lien and redeemable deed format.” → “The town tax collector conducts the sale.”
- `notBeginnerReason.2`: “Requires individual research per town.” → “Each collector may publish its own rules for the auction and for payment by successful bidders.”
- `beginnerTip.1`: “Contact tax collectors in Waterbury, Bridgeport, and Hartford — these cities have higher delinquency rates and more consistent sale schedules than smaller towns.” → “(removed)”
- `risks.1`: “Format (lien vs. redeemable deed) varies by town — confirm before registering” → “A town may assign its liens for unpaid taxes; confirm the sale format with the town tax collector.”
- `risks.2`: “No centralized state system — requires individual municipality research” → “Each collector may publish its own auction rules; Confirm with the town tax collector.”
- `risks.3`: “Higher-value towns (Greenwich, Westport) rarely have delinquencies worth pursuing” → “(removed)”
- `ddExtra.1`: “Confirm the sale format with the town tax collector before any due diligence” → “Confirm the sale format with the town tax collector”
- `ddExtra.2`: “Verify lien priority — Connecticut has complex municipal lien priority rules” → “Check what the collector's deed is subject to (§ 12-159): taxes not yet due when notice of levy was first made, easements and interests described in the deed”
- `ddExtra.3`: “Check for any active municipal code violations on occupied structures” → “(removed)”
- `signup.platform`: “Town-specific — contact each municipality directly” → “Town tax collector”
- `signup.steps.1`: “Identify your target municipality at portal.ct.gov” → “Identify the town where the property is located; the collector posts the sale notice there”
- `signup.steps.2`: “Contact the Town Tax Collector directly — ask if they conduct lien or redeemable deed sales and when the next sale is scheduled” → “Ask the town tax collector when the sale is scheduled; notices are posted 9 to 12 weeks before it”
- `signup.steps.3`: “Request the delinquent property list” → “Read the collector's sale notice, which names the taxpayer and describes the property”
- `signup.steps.4`: “Register per the town's specific instructions — most require in-person registration” → “Follow the collector's published rules for the auction and for payment by successful bidders”
- `signup.deposit.1`: “Varies by municipality.” → “Not set by statute; the collector may publish rules for payment. Confirm with the town tax collector.”
- `otc.available`: “Not generally available” → “If there is no bidder or the bid is too low, the collector may sell to the town. Confirm with the town tax collector.”
- `otc.note.1`: “No statewide OTC program.” → “Not set by statute. Confirm with the town tax collector.”
- `platforms.1`: “Town-level (no centralized platform)” → “Town tax collector”
- `surplus.1`: “Status pending — monitoring for legislative action.” → “Excess sale proceeds are held in a separate interest-bearing escrow account (CGS § 12-157(i)).”
- `surplus.2`: “(new)” → “If the tax collector pays moneys to the court, the taxpayer, mortgagees and lienholders affected by the sale may apply to the court for payment of the proceeds within 90 days of that payment.”

## Pass 2 trims, removals and notes

- `type`: was "Tax lien". § 12-157 sells the real property. pass 2: removed collector's deed and lien assignment from the line, which the quote does not state
- `rate`: was "18% penalty"; § 12-157(f) calls it interest
- `rateNote`: removed "6-month standard redemption window" (now on the redemption line)
- `redemption`: was "1 year" (P.A. 99-283 changed one year to six months)
- `bidMethod`: was "Highest bidder"
- `statute`: removed "(2025)"
- `auctionPlatform`: was "Township-run — 169 townships across 8 counties"; count not in statute
- `auctionTiming`: was "Year-round — varies by township". pass 2: dropped "set by the collector in the notice"
- `summary.1`: was "municipalities independently elect to sell tax liens or redeemable deeds"
- `summary.2`: was "No centralized state platform. 1-year redemption."
- `typeWhy.1`: was "sell tax lien certificates, giving investors the right to collect delinquent taxes"
- `typeWhy.2`: was "owner retains title during the 1-year redemption period"
- `rateWhy.1`: was "18% statutory penalty ... flat penalty structure"; statute says interest at 18% per annum
- `keyNotes.1`: was "169 townships each run independent sales"
- `keyNotes.2`: wording and exactness
- `keyNotes.3`: was "deed records, title passes free and clear"; trimmed to what the statute says
- `keyNotes.4`: removed: no official source (opinion, comparison, advice or count not in the statute)
- `keyNotes.5`: was "redemption window shrinks to 60 days"
- `notBeginnerReason.1`: was "Each municipality independently chooses between lien and redeemable deed format"
- `notBeginnerReason.2`: was "Requires individual research per town"
- `beginnerTip.1`: removed: no official source (opinion, comparison, advice or count not in the statute)
- `risks.1`: was "Format (lien vs. redeemable deed) varies by town"
- `risks.2`: was "No centralized state system"
- `risks.3`: removed: no official source (opinion, comparison, advice or count not in the statute)
- `ddExtra.1`: trimmed "before any due diligence"
- `ddExtra.2`: was "complex municipal lien priority rules"
- `ddExtra.3`: removed: no official source (opinion, comparison, advice or count not in the statute)
- `signup.platform`: was "Town-specific — contact each municipality directly"
- `signup.steps.1`: removed portal.ct.gov link
- `signup.steps.2`: adds the 9 to 12 week window from § 12-157(a)
- `signup.steps.3`: was "Request the delinquent property list"
- `signup.steps.4`: was "Register per the town's specific instructions — most require in-person registration"
- `signup.deposit.1`: was "Varies by municipality."
- `otc.available`: was "Not generally available"
- `otc.note.1`: was "No statewide OTC program."
- `platforms.1`: was "Town-level (no centralized platform)"
- `surplus.1`: was "Status pending — monitoring for legislative action."

## Conflicts (flagged)

None.
