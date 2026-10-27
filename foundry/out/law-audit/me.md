# Maine (ME) law audit

Checked 2026-10-27. Status: done. Ledger: `cloudflare/data/law/me.json`.

Official code access: Maine Revised Statutes fetched from legislature.maine.gov (Office of the Revisor of Statutes). § 505 could not be fetched (connection reset, HTML and PDF).

## Finding

Maine does not sell tax liens to investors. The municipality records a tax lien certificate (36 M.R.S. § 942); if unpaid
18 months after recording, the tax lien mortgage is deemed foreclosed (§ 943). Since PL 2023, c. 640, a town selling
tax-acquired property to anyone but the former owner must list it with a licensed real estate broker, convey by quitclaim
deed at the highest price obtained within 12 months, and pay the former owner the proceeds above taxes, interest, fees and
costs (§ 943-C). After 3 failed attempts to contract or sell, the town may sell in any manner its legislative body allows.
The 8% interest rate could not be checked: § 505 returned connection resets (HTML and PDF), so rate claims are marked
"Couldn't reach source".

## 2023 to 2026 enacted-law search

From the section histories on legislature.maine.gov (§§ 942, 943, 943-C):
- PL 2023, c. 579, §1: homestead abatement notice in § 942.
- PL 2023, c. 358 and PL 2023, c. 640, §§2-3: rewrote § 943-C (broker sale, excess proceeds to former owner); in effect.
- PL 2023, c. 523, Pt. A, §7; PL 2025, c. 351, §1; PL 2025, c. 662, Pt. C, §2: amended § 943 (current text quoted).
Effective dates and LD numbers were not looked up this run (legislature's LD search not run for time).

## Unreachable sources

- 36 M.R.S. § 505 (interest rate): https://legislature.maine.gov/statutes/36/title36sec505.html and .pdf (connection reset).

## Watch

- Recheck § 505 and the State Treasurer's annual maximum rate in a later run.

## Claims

| id | shown | statute | link | status |
|---|---|---|---|---|
| type | Tax lien | 36 M.R.S. § 942 | [link](https://legislature.maine.gov/statutes/36/title36sec942.html) | supported |
| rate | Interest rate set under 36 M.R.S. § 505 | 36 M.R.S. § 505(4) |  | unreachable |
| rateNote | Redemption ends 18 months after the tax lien certificate is recorded | 36 M.R.S. § 943 | [link](https://legislature.maine.gov/statutes/36/title36sec943.html) | corrected |
| redemption | 18 months from recording of the tax lien certificate | 36 M.R.S. § 943 | [link](https://legislature.maine.gov/statutes/36/title36sec943.html) | corrected |
| bidMethod | Town lists tax-acquired property with a licensed real estate broker | 36 M.R.S. § 943-C | [link](https://legislature.maine.gov/statutes/36/title36sec943-C.pdf) | corrected |
| statute | Me. Rev. Stat. tit. 36 §943 | 36 M.R.S. § 943 | [link](https://legislature.maine.gov/statutes/36/title36sec943.html) | supported |
| auctionPlatform | Licensed real estate broker listing (municipal sale) | 36 M.R.S. § 943-C | [link](https://legislature.maine.gov/statutes/36/title36sec943-C.pdf) | corrected |
| auctionTiming | Listed at least 90 days after notice to the former owner | 36 M.R.S. § 943-C | [link](https://legislature.maine.gov/statutes/36/title36sec943-C.pdf) | corrected |
| summary.1 | Maine municipalities enforce tax liens by recording a tax lien certificate. | 36 M.R.S. § 942 | [link](https://legislature.maine.gov/statutes/36/title36sec942.html) | corrected |
| summary.2 | If unpaid 18 months after the certificate is recorded, the lien mortgage is foreclosed and redemption ends. | 36 M.R.S. § 943 | [link](https://legislature.maine.gov/statutes/36/title36sec943.html) | corrected |
| summary.3 | A town selling foreclosed property to someone other than the former owner must follow the state sale process. | 36 M.R.S. § 943-C | [link](https://legislature.maine.gov/statutes/36/title36sec943-C.pdf) | corrected |
| summary.4 | Statute: MRSA Title 36 §942. | 36 M.R.S. § 942 | [link](https://legislature.maine.gov/statutes/36/title36sec942.html) | supported |
| typeWhy.1 | The municipality records a tax lien certificate; if not paid within 18 months, the lien mortgage is foreclosed. | 36 M.R.S. § 943 | [link](https://legislature.maine.gov/statutes/36/title36sec943.html) | corrected |
| typeWhy.2 | MRSA Title 36 §942. | 36 M.R.S. § 942 | [link](https://legislature.maine.gov/statutes/36/title36sec942.html) | supported |
| rateWhy.1 | Interest is set under 36 M.R.S. § 505. | 36 M.R.S. § 505(4) |  | unreachable |
| rateWhy.2 | (removed) | 36 M.R.S. § 942 | [link](https://legislature.maine.gov/statutes/36/title36sec942.html) | corrected |
| rateWhy.3 | 36 M.R.S. § 505. | 36 M.R.S. § 505(4) |  | unreachable |
| keyNotes.1 | The municipality holds the tax lien mortgage and records the certificate | 36 M.R.S. § 942 | [link](https://legislature.maine.gov/statutes/36/title36sec942.html) | corrected |
| keyNotes.2 | After 18 months unpaid, the tax lien mortgage is deemed foreclosed | 36 M.R.S. § 943 | [link](https://legislature.maine.gov/statutes/36/title36sec943.html) | corrected |
| keyNotes.3 | 36 M.R.S. § 943 was amended by PL 2025, c. 351 | 36 M.R.S. § 943 | [link](https://legislature.maine.gov/statutes/36/title36sec943.html) | corrected |
| keyNotes.4 | Buyer receives a quitclaim deed at the highest price obtained within 12 months of listing | 36 M.R.S. § 943-C | [link](https://legislature.maine.gov/statutes/36/title36sec943-C.pdf) | corrected |
| notBeginnerReason.1 | Towns sell foreclosed property through licensed real estate brokers. | 36 M.R.S. § 943-C | [link](https://legislature.maine.gov/statutes/36/title36sec943-C.pdf) | corrected |
| notBeginnerReason.2 | (removed) | 36 M.R.S. § 942 | [link](https://legislature.maine.gov/statutes/36/title36sec942.html) | corrected |
| beginnerTip.1 | (removed) | 36 M.R.S. § 942 | [link](https://legislature.maine.gov/statutes/36/title36sec942.html) | corrected |
| beginnerTip.2 | (removed) | 36 M.R.S. § 942 | [link](https://legislature.maine.gov/statutes/36/title36sec942.html) | corrected |
| risks.1 | (removed) | 36 M.R.S. § 942 | [link](https://legislature.maine.gov/statutes/36/title36sec942.html) | corrected |
| risks.2 | (removed) | 36 M.R.S. § 942 | [link](https://legislature.maine.gov/statutes/36/title36sec942.html) | corrected |
| risks.3 | (removed) | 36 M.R.S. § 942 | [link](https://legislature.maine.gov/statutes/36/title36sec942.html) | corrected |
| ddExtra.1 | (removed) | 36 M.R.S. § 942 | [link](https://legislature.maine.gov/statutes/36/title36sec942.html) | corrected |
| ddExtra.2 | The town may sell the property back to the former owner instead of listing it | 36 M.R.S. § 943-C | [link](https://legislature.maine.gov/statutes/36/title36sec943-C.pdf) | corrected |
| ddExtra.3 | (removed) | 36 M.R.S. § 942 | [link](https://legislature.maine.gov/statutes/36/title36sec942.html) | corrected |
| signup.platform | Municipality, through a licensed real estate broker | 36 M.R.S. § 943-C | [link](https://legislature.maine.gov/statutes/36/title36sec943-C.pdf) | corrected |
| signup.steps.1 | Watch real estate broker listings of tax-acquired property in your target town | 36 M.R.S. § 943-C | [link](https://legislature.maine.gov/statutes/36/title36sec943-C.pdf) | corrected |
| signup.steps.2 | (removed) | 36 M.R.S. § 942 | [link](https://legislature.maine.gov/statutes/36/title36sec942.html) | corrected |
| signup.steps.3 | (removed) | 36 M.R.S. § 942 | [link](https://legislature.maine.gov/statutes/36/title36sec942.html) | corrected |
| signup.steps.4 | (removed) | 36 M.R.S. § 942 | [link](https://legislature.maine.gov/statutes/36/title36sec942.html) | corrected |
| signup.deposit.1 | (removed) | 36 M.R.S. § 942 | [link](https://legislature.maine.gov/statutes/36/title36sec942.html) | corrected |
| otc.available | Not generally available | 36 M.R.S. § 943-C | [link](https://legislature.maine.gov/statutes/36/title36sec943-C.pdf) | flagged |
| otc.note.1 | Tax-acquired property is listed for sale with a licensed real estate broker. | 36 M.R.S. § 943-C | [link](https://legislature.maine.gov/statutes/36/title36sec943-C.pdf) | corrected |
| platforms.1 | Licensed real estate brokers listing municipal tax-acquired property | 36 M.R.S. § 943-C | [link](https://legislature.maine.gov/statutes/36/title36sec943-C.pdf) | corrected |
| surplus.1 | When a town sells tax-acquired property, it must pay the former owner proceeds above taxes, interest, fees and other listed costs (36 M.R.S. § 943-C). | 36 M.R.S. § 943-C | [link](https://legislature.maine.gov/statutes/36/title36sec943-C.pdf) | corrected |
| es.rate | Tasa de interés fijada según 36 M.R.S. § 505 | 36 M.R.S. § 505(4) |  | unreachable |
| es.redemption | 18 meses desde el registro del certificado de gravamen | 36 M.R.S. § 943 | [link](https://legislature.maine.gov/statutes/36/title36sec943.html) | corrected |
| es.summary.1 | Los municipios de Maine ejecutan gravámenes fiscales registrando un certificado de gravamen. | 36 M.R.S. § 942 | [link](https://legislature.maine.gov/statutes/36/title36sec942.html) | corrected |
| es.summary.2 | Si no se paga 18 meses después del registro, la hipoteca por gravamen se ejecuta y termina la redención. | 36 M.R.S. § 943 | [link](https://legislature.maine.gov/statutes/36/title36sec943.html) | corrected |
| es.summary.3 | Un municipio que vende una propiedad ejecutada a alguien distinto del antiguo dueño debe seguir el proceso estatal de venta. | 36 M.R.S. § 943-C | [link](https://legislature.maine.gov/statutes/36/title36sec943-C.pdf) | corrected |
| es.summary.4 | Estatuto: MRSA Título 36 §942. | 36 M.R.S. § 942 | [link](https://legislature.maine.gov/statutes/36/title36sec942.html) | supported |
| es.typeWhy.1 | El municipio registra un certificado de gravamen; si no se paga en 18 meses, la hipoteca por gravamen se ejecuta. | 36 M.R.S. § 943 | [link](https://legislature.maine.gov/statutes/36/title36sec943.html) | corrected |
| es.typeWhy.2 | MRSA Título 36 §942. | 36 M.R.S. § 942 | [link](https://legislature.maine.gov/statutes/36/title36sec942.html) | corrected |
| es.rateWhy.1 | El interés se fija según 36 M.R.S. § 505. | 36 M.R.S. § 505(4) |  | unreachable |
| es.rateWhy.2 | (removed) | 36 M.R.S. § 942 | [link](https://legislature.maine.gov/statutes/36/title36sec942.html) | corrected |
| es.notBeginnerReason.1 | Los municipios venden propiedades ejecutadas por medio de corredores inmobiliarios con licencia. | 36 M.R.S. § 943-C | [link](https://legislature.maine.gov/statutes/36/title36sec943-C.pdf) | corrected |
| es.notBeginnerReason.2 | (removed) | 36 M.R.S. § 942 | [link](https://legislature.maine.gov/statutes/36/title36sec942.html) | corrected |
| es.beginnerTip.1 | (removed) | 36 M.R.S. § 942 | [link](https://legislature.maine.gov/statutes/36/title36sec942.html) | corrected |
| es.beginnerTip.2 | (removed) | 36 M.R.S. § 942 | [link](https://legislature.maine.gov/statutes/36/title36sec942.html) | corrected |
| es.risks.1 | (removed) | 36 M.R.S. § 942 | [link](https://legislature.maine.gov/statutes/36/title36sec942.html) | corrected |
| es.risks.2 | (removed) | 36 M.R.S. § 942 | [link](https://legislature.maine.gov/statutes/36/title36sec942.html) | corrected |
| es.risks.3 | (removed) | 36 M.R.S. § 942 | [link](https://legislature.maine.gov/statutes/36/title36sec942.html) | corrected |
| es.ddExtra.1 | (removed) | 36 M.R.S. § 942 | [link](https://legislature.maine.gov/statutes/36/title36sec942.html) | corrected |
| es.ddExtra.2 | El municipio puede revender la propiedad al antiguo dueño en lugar de ponerla en venta | 36 M.R.S. § 943-C | [link](https://legislature.maine.gov/statutes/36/title36sec943-C.pdf) | corrected |
| es.ddExtra.3 | (removed) | 36 M.R.S. § 942 | [link](https://legislature.maine.gov/statutes/36/title36sec942.html) | corrected |
| es.signup.platform | Municipio, por medio de un corredor inmobiliario con licencia | 36 M.R.S. § 943-C | [link](https://legislature.maine.gov/statutes/36/title36sec943-C.pdf) | corrected |
| es.signup.steps.1 | Siga los anuncios de corredores de propiedades adquiridas por impuestos en su municipio objetivo | 36 M.R.S. § 943-C | [link](https://legislature.maine.gov/statutes/36/title36sec943-C.pdf) | corrected |
| es.signup.steps.2 | (removed) | 36 M.R.S. § 942 | [link](https://legislature.maine.gov/statutes/36/title36sec942.html) | corrected |
| es.signup.steps.3 | (removed) | 36 M.R.S. § 942 | [link](https://legislature.maine.gov/statutes/36/title36sec942.html) | corrected |
| es.signup.steps.4 | (removed) | 36 M.R.S. § 942 | [link](https://legislature.maine.gov/statutes/36/title36sec942.html) | corrected |
| es.signup.deposit.1 | (removed) | 36 M.R.S. § 942 | [link](https://legislature.maine.gov/statutes/36/title36sec942.html) | corrected |
| es.otc.note.1 | La propiedad adquirida por impuestos se pone en venta con un corredor inmobiliario con licencia. | 36 M.R.S. § 943-C | [link](https://legislature.maine.gov/statutes/36/title36sec943-C.pdf) | corrected |

## Corrections (before → after)

- `rateNote`: “18-month redemption via tax lien mortgage — municipal process” → “Redemption ends 18 months after the tax lien certificate is recorded”
- `redemption`: “18 months” → “18 months from recording of the tax lien certificate”
- `bidMethod`: “Municipal-controlled” → “Town lists tax-acquired property with a licensed real estate broker”
- `auctionPlatform`: “Municipal — varies by town” → “Licensed real estate broker listing (municipal sale)”
- `auctionTiming`: “Year-round” → “Listed at least 90 days after notice to the former owner”
- `summary.1`: “Maine municipalities hold tax liens.” → “Maine municipalities enforce tax liens by recording a tax lien certificate.”
- `summary.2`: “After 18 months, municipality takes title and can auction.” → “If unpaid 18 months after the certificate is recorded, the lien mortgage is foreclosed and redemption ends.”
- `summary.3`: “No centralized state system.” → “A town selling foreclosed property to someone other than the former owner must follow the state sale process.”
- `typeWhy.1`: “Maine municipalities hold tax liens — the municipality itself purchases the lien, and after 18 months of non-redemption, the municipality takes title and can auction the property.” → “The municipality records a tax lien certificate; if not paid within 18 months, the lien mortgage is foreclosed.”
- `rateWhy.2`: “This is a fixed rate applied uniformly.” → “(removed)”
- `keyNotes.1`: “Tax lien mortgage system — municipality holds lien, not sold directly to investors in most cases” → “The municipality holds the tax lien mortgage and records the certificate”
- `keyNotes.2`: “After 18 months unredeemed, municipality forecloses and may sell property” → “After 18 months unpaid, the tax lien mortgage is deemed foreclosed”
- `keyNotes.3`: “PL 2025, c. 351 update — verify current municipal procedures” → “36 M.R.S. § 943 was amended by PL 2025, c. 351”
- `keyNotes.4`: “Retail investor access is limited — primarily municipal sales of foreclosed properties” → “Buyer receives a quitclaim deed at the highest price obtained within 12 months of listing”
- `notBeginnerReason.1`: “Municipal-level only, sporadic auctions, very low volume.” → “Towns sell foreclosed property through licensed real estate brokers.”
- `notBeginnerReason.2`: “Not a viable primary market.” → “(removed)”
- `beginnerTip.1`: “Portland and Bangor have the most consistent municipal auction activity.” → “(removed)”
- `beginnerTip.2`: “For rural towns, call the town office directly — many don't advertise sales publicly.” → “(removed)”
- `risks.1`: “Municipalities conduct sales infrequently and irregularly” → “(removed)”
- `risks.2`: “No centralized platform — requires monitoring individual town tax collectors” → “(removed)”
- `risks.3`: “Very low volume” → “(removed)”
- `ddExtra.1`: “Contact the municipal tax collector at least 6 months before any expected sale” → “(removed)”
- `ddExtra.2`: “Confirm the municipality plans to auction rather than negotiate or hold the property” → “The town may sell the property back to the former owner instead of listing it”
- `ddExtra.3`: “Check for conservation easements or deed restrictions before bidding” → “(removed)”
- `signup.platform`: “Municipal tax collector (varies)” → “Municipality, through a licensed real estate broker”
- `signup.steps.1`: “Identify your target municipality at maine.gov/revenue/propertytax” → “Watch real estate broker listings of tax-acquired property in your target town”
- `signup.steps.2`: “Contact the municipal tax collector at least 6 months before any expected auction” → “(removed)”
- `signup.steps.3`: “Request the delinquent property list and auction schedule” → “(removed)”
- `signup.steps.4`: “Register per municipality instructions — most are in-person” → “(removed)”
- `signup.deposit.1`: “Varies by municipality.” → “(removed)”
- `otc.note.1`: “No OTC program.” → “Tax-acquired property is listed for sale with a licensed real estate broker.”
- `platforms.1`: “Municipal tax collector offices” → “Licensed real estate brokers listing municipal tax-acquired property”
- `surplus.1`: “Status pending — monitoring for legislative action.” → “When a town sells tax-acquired property, it must pay the former owner proceeds above taxes, interest, fees and other listed costs (36 M.R.S. § 943-C).”

## Pass 2 trims, removals and notes

- `rate`: unreachable: legislature.maine.gov reset the connection for § 505 (HTML and PDF); 8% not verified
- `bidMethod`: was "Municipal-controlled"
- `auctionPlatform`: was "Municipal — varies by town"
- `auctionTiming`: was "Year-round"
- `summary.2`: removed "can auction" (sale is by broker listing, § 943-C)
- `summary.3`: was "No centralized state system"
- `typeWhy.1`: trimmed: removed "municipality purchases the lien" and "can auction"
- `rateWhy.1`: unreachable: legislature.maine.gov reset the connection for § 505 (HTML and PDF); 8% not verified
- `rateWhy.2`: removed: no official source (opinion, town detail or volume claim)
- `rateWhy.3`: unreachable: legislature.maine.gov reset the connection for § 505 (HTML and PDF); 8% not verified
- `keyNotes.1`: trimmed: removed "not sold directly to investors in most cases"
- `keyNotes.2`: removed "may sell property" (moved to sale claims)
- `keyNotes.3`: was "verify current municipal procedures"
- `keyNotes.4`: was "Retail investor access is limited"
- `notBeginnerReason.1`: was "sporadic auctions, very low volume"
- `notBeginnerReason.2`: removed: no official source (opinion, town detail or volume claim)
- `beginnerTip.1`: removed: no official source (opinion, town detail or volume claim)
- `beginnerTip.2`: removed: no official source (opinion, town detail or volume claim)
- `risks.1`: removed: no official source (opinion, town detail or volume claim)
- `risks.2`: removed: no official source (opinion, town detail or volume claim)
- `risks.3`: removed: no official source (opinion, town detail or volume claim)
- `ddExtra.1`: removed: no official source (opinion, town detail or volume claim)
- `ddExtra.3`: removed: no official source (opinion, town detail or volume claim)
- `signup.steps.1`: removed maine.gov link
- `signup.steps.2`: removed: no official source (opinion, town detail or volume claim)
- `signup.steps.3`: removed: no official source (opinion, town detail or volume claim)
- `signup.steps.4`: removed: in-person registration not in the statutes read
- `signup.deposit.1`: removed: no official source (opinion, town detail or volume claim)
- `otc.available`: flagged: statutes describe broker listings, not an OTC program
- `otc.note.1`: was "No OTC program"
- `surplus.1`: was "Status pending"

## Conflicts (flagged)

- `otc.available`: No official text on over-the-counter sales; § 943-C requires broker listing of tax-acquired property
