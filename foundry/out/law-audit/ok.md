# Oklahoma (OK) law audit

Checked 2026-10-27. Status: done. Ledger: `cloudflare/data/law/ok.json`.

Official code access: The official Oklahoma Statutes are published on OSCN (oscn.net, Oklahoma Supreme Court), which the Legislature links to; OSCN served a Cloudflare Turnstile CAPTCHA to the runner, so it was not used (spec rule 7). Enacted-bill PDFs on oklegislature.gov/cf_pdf are disallowed by robots.txt; sai.ok.gov forms are too. Claims cite the Delaware County Treasurer (oktaxrolls.com, the county treasurer's site hosted by TM Consulting) and the Oklahoma County Treasurer for county details; statute claims are unreachable.

## Finding

The site describes an October tax lien certificate sale, an over-the-counter purchase on the first Monday of October and
an 8% certificate rate. The Delaware County Treasurer's official page says an amendment to 68 O.S. § 3105 ended the
October certificate sale: the county now holds all liens, and property delinquent 3 years or more goes to the June
tax resale (second Monday of June, highest bidder, bids start at taxes, penalties, fees and costs). Certificates issued
before the change stay under the old law. The statute and the amending act could not be read (see below), so every
October-sale, OTC and type claim is **flagged**, and the rate, redemption and statute-citation claims are
**unreachable**. Opinion and inventory claims were removed.

## 2023 to 2026 enacted-law search

- Lead: Delaware County Treasurer (oktaxrolls.com/county/Delaware) says "New legislation has been passed amending
  68 O.S. Section 3105" ending the October certificate sale. Act number, bill number and effective date not identified.
- Web search (leads only) for oklegislature.gov enrolled bills amending §§ 3105, 3125, 3131 in 2023-2026 found HB 1205
  (2025, repeals § 2357.32B, unrelated), HB 2742 (2023 introduced, § 3105 notice), HB 1663 (2025-26 floor version,
  resale online sales / redemption timing; enactment unconfirmed). None could be downloaded: oklegislature.gov/cf_pdf
  is disallowed by robots.txt.
- The Legislature's bill search itself was not run (CAPTCHA/robots limits). Recheck in a later run.

## Unreachable sources

- OSCN (www.oscn.net), the official Oklahoma Statutes host: returns a Cloudflare Turnstile CAPTCHA page (HTTP 201).
  Not fetched, per spec rule 7 (no CAPTCHAs).
- https://www.oklegislature.gov/cf_pdf/2021-22%20ENR/SB/SB181%20ENR.PDF: robots.txt disallows (logged).
- sai.ok.gov forms 0178, 0233, 0234, 0296: robots.txt disallows (logged).

## Watch

- Identify the act amending 68 O.S. § 3105 (certificate sale ended) and its effective date.
- HB 1663 (2025-26): resale online sale / redemption timing.
- Surplus-proceeds rule after Tyler v. Hennepin (not read).

## Claims

| id | shown | statute | link | status |
|---|---|---|---|---|
| type | Tax resale (deed) after county-held lien | 68 O.S. § 3105 (as described by Delaware County Treasurer) | [link](https://oktaxrolls.com/county/Delaware) | flagged |
| rate | 8% | 68 O.S. §§ 3101-3135 |  | unreachable |
| rateNote | Certificates issued before the amendment stay under the old law | 68 O.S. § 3105 (as described by Delaware County Treasurer) | [link](https://oktaxrolls.com/county/Delaware) | flagged |
| redemption | 2 years | 68 O.S. §§ 3101-3135 |  | unreachable |
| bidMethod | Highest bidder at the June resale | 68 O.S. §§ 3125-3131 (as described by Delaware County Treasurer) | [link](https://oktaxrolls.com/county/Delaware) | flagged |
| statute | 68 O.S. §3101 | 68 O.S. §§ 3101-3135 |  | unreachable |
| auctionPlatform | County treasurer's office | 68 O.S. §§ 3125-3131 (as described by Delaware County Treasurer) | [link](https://oktaxrolls.com/county/Delaware) | flagged |
| auctionTiming | Second Monday of June (resale) | 68 O.S. §§ 3125-3131 (as described by Delaware County Treasurer) | [link](https://oktaxrolls.com/county/Delaware) | flagged |
| summary.1 | Delaware County reports that an amendment to 68 O.S. § 3105 ended the October certificate sale; the county now holds the liens. | 68 O.S. § 3105 (as described by Delaware County Treasurer) | [link](https://oktaxrolls.com/county/Delaware) | flagged |
| summary.2 | (removed) | 68 O.S. § 3105 (as described by Delaware County Treasurer) | [link](https://oktaxrolls.com/county/Delaware) | flagged |
| summary.3 | (removed) | 68 O.S. §§ 3125-3131 (as described by Delaware County Treasurer) | [link](https://oktaxrolls.com/county/Delaware) | corrected |
| summary.4 | Statute: OS Title 68 §3101. | 68 O.S. §§ 3101-3135 |  | unreachable |
| typeWhy.1 | Property delinquent 3 years or more now goes to the June tax resale, per the Delaware County Treasurer. | 68 O.S. § 3105 (as described by Delaware County Treasurer) | [link](https://oktaxrolls.com/county/Delaware) | flagged |
| typeWhy.2 | The owner retains title during the 2-year redemption period. | 68 O.S. §§ 3101-3135 |  | unreachable |
| typeWhy.3 | OS Title 68 §3101. | 68 O.S. §§ 3101-3135 |  | unreachable |
| rateWhy.1 | Oklahoma law set a rate of 8% per year on tax sale certificates. | 68 O.S. §§ 3101-3135 |  | unreachable |
| rateWhy.2 | OS Title 68 §3101. | 68 O.S. §§ 3101-3135 |  | unreachable |
| keyNotes.1 | (removed) | 68 O.S. §§ 3125-3131 (as described by Delaware County Treasurer) | [link](https://oktaxrolls.com/county/Delaware) | corrected |
| keyNotes.2 | Annual tax resale on the second Monday of June | 68 O.S. §§ 3125-3131 (as described by Delaware County Treasurer) | [link](https://oktaxrolls.com/county/Delaware) | corrected |
| keyNotes.3 | (removed) | 68 O.S. §§ 3125-3131 (as described by Delaware County Treasurer) | [link](https://oktaxrolls.com/county/Delaware) | corrected |
| beginnerTip.1 | (removed) | 68 O.S. §§ 3125-3131 (as described by Delaware County Treasurer) | [link](https://oktaxrolls.com/county/Delaware) | corrected |
| beginnerTip.2 | (removed) | 68 O.S. § 3105 (as described by Delaware County Treasurer) | [link](https://oktaxrolls.com/county/Delaware) | flagged |
| risks.1 | (removed) | 68 O.S. §§ 3125-3131 (as described by Delaware County Treasurer) | [link](https://oktaxrolls.com/county/Delaware) | corrected |
| risks.2 | 2-year redemption before deed proceedings | 68 O.S. §§ 3101-3135 |  | unreachable |
| risks.3 | (removed) | 68 O.S. §§ 3125-3131 (as described by Delaware County Treasurer) | [link](https://oktaxrolls.com/county/Delaware) | corrected |
| ddExtra.1 | (removed) | 68 O.S. §§ 3125-3131 (as described by Delaware County Treasurer) | [link](https://oktaxrolls.com/county/Delaware) | corrected |
| ddExtra.2 | (removed) | 68 O.S. §§ 3125-3131 (as described by Delaware County Treasurer) | [link](https://oktaxrolls.com/county/Delaware) | corrected |
| ddExtra.3 | Confirm with the county treasurer whether any certificate sale is still held | 68 O.S. § 3105 (as described by Delaware County Treasurer) | [link](https://oktaxrolls.com/county/Delaware) | flagged |
| signup.platform | County treasurer | 68 O.S. §§ 3125-3131 (as described by Delaware County Treasurer) | [link](https://oktaxrolls.com/county/Delaware) | corrected |
| signup.steps.1 | Contact your target county treasurer | 68 O.S. §§ 3125-3131 (as described by Delaware County Treasurer) | [link](https://oktaxrolls.com/county/Delaware) | corrected |
| signup.steps.2 | Oklahoma County lists its tax resale on the second Monday in June | none: administrative practice (Oklahoma County Treasurer calendar) | [link](https://docs.oklahomacounty.org/treasurer/ImportantDates.asp) | corrected |
| signup.steps.3 | (removed) | 68 O.S. § 3105 (as described by Delaware County Treasurer) | [link](https://oktaxrolls.com/county/Delaware) | flagged |
| signup.steps.4 | (removed) | 68 O.S. § 3105 (as described by Delaware County Treasurer) | [link](https://oktaxrolls.com/county/Delaware) | flagged |
| signup.deposit.1 | Varies by county. | 68 O.S. §§ 3125-3131 (as described by Delaware County Treasurer) | [link](https://oktaxrolls.com/county/Delaware) | supported |
| otc.available | Unconfirmed | 68 O.S. § 3105 (as described by Delaware County Treasurer) | [link](https://oktaxrolls.com/county/Delaware) | flagged |
| otc.note.1 | After a resale, the treasurer may sell county-deeded property on a bid, subject to the county commissioners' approval (Delaware County). | 68 O.S. § 3135 (as described by Delaware County Treasurer) | [link](https://oktaxrolls.com/county/Delaware) | flagged |
| platforms.1 | County treasurer offices | 68 O.S. §§ 3125-3131 (as described by Delaware County Treasurer) | [link](https://oktaxrolls.com/county/Delaware) | supported |
| surplus.1 | Status pending — monitoring for legislative action. | 68 O.S. §§ 3101-3135 |  | unreachable |
| es.rate | 8% | 68 O.S. §§ 3101-3135 |  | unreachable |
| es.redemption | 2 años | 68 O.S. §§ 3101-3135 |  | unreachable |
| es.summary.1 | El condado de Delaware informa que una enmienda a 68 O.S. § 3105 eliminó la venta de certificados de octubre; el condado ahora conserva los gravámenes. | 68 O.S. § 3105 (as described by Delaware County Treasurer) | [link](https://oktaxrolls.com/county/Delaware) | flagged |
| es.summary.2 | (removed) | 68 O.S. § 3105 (as described by Delaware County Treasurer) | [link](https://oktaxrolls.com/county/Delaware) | flagged |
| es.summary.3 | (removed) | 68 O.S. §§ 3125-3131 (as described by Delaware County Treasurer) | [link](https://oktaxrolls.com/county/Delaware) | corrected |
| es.summary.4 | Estatuto: OS Título 68 §3101. | 68 O.S. §§ 3101-3135 |  | unreachable |
| es.typeWhy.1 | La propiedad con 3 años o más de mora ahora va a la reventa fiscal de junio, según el Tesorero del condado de Delaware. | 68 O.S. § 3105 (as described by Delaware County Treasurer) | [link](https://oktaxrolls.com/county/Delaware) | flagged |
| es.rateWhy.1 | La ley de Oklahoma fijó una tasa del 8% anual en los certificados de venta fiscal. | 68 O.S. §§ 3101-3135 |  | unreachable |
| es.beginnerTip.1 | (removed) | 68 O.S. §§ 3125-3131 (as described by Delaware County Treasurer) | [link](https://oktaxrolls.com/county/Delaware) | corrected |
| es.beginnerTip.2 | (removed) | 68 O.S. § 3105 (as described by Delaware County Treasurer) | [link](https://oktaxrolls.com/county/Delaware) | flagged |
| es.risks.1 | (removed) | 68 O.S. §§ 3125-3131 (as described by Delaware County Treasurer) | [link](https://oktaxrolls.com/county/Delaware) | corrected |
| es.risks.2 | Redención de 2 años antes de los procedimientos de escritura | 68 O.S. §§ 3101-3135 |  | unreachable |
| es.risks.3 | (removed) | 68 O.S. §§ 3125-3131 (as described by Delaware County Treasurer) | [link](https://oktaxrolls.com/county/Delaware) | corrected |
| es.ddExtra.1 | (removed) | 68 O.S. §§ 3125-3131 (as described by Delaware County Treasurer) | [link](https://oktaxrolls.com/county/Delaware) | corrected |
| es.ddExtra.2 | (removed) | 68 O.S. §§ 3125-3131 (as described by Delaware County Treasurer) | [link](https://oktaxrolls.com/county/Delaware) | corrected |
| es.ddExtra.3 | Confirme con el tesorero del condado si aún se realiza alguna venta de certificados | 68 O.S. § 3105 (as described by Delaware County Treasurer) | [link](https://oktaxrolls.com/county/Delaware) | flagged |
| es.signup.platform | Tesorero del condado | 68 O.S. §§ 3125-3131 (as described by Delaware County Treasurer) | [link](https://oktaxrolls.com/county/Delaware) | corrected |
| es.signup.steps.1 | Contacte al tesorero de su condado objetivo | 68 O.S. §§ 3125-3131 (as described by Delaware County Treasurer) | [link](https://oktaxrolls.com/county/Delaware) | corrected |
| es.signup.steps.2 | El Condado Oklahoma fija su reventa fiscal el segundo lunes de junio | none: administrative practice (Oklahoma County Treasurer calendar) | [link](https://docs.oklahomacounty.org/treasurer/ImportantDates.asp) | corrected |
| es.signup.steps.3 | (removed) | 68 O.S. § 3105 (as described by Delaware County Treasurer) | [link](https://oktaxrolls.com/county/Delaware) | flagged |
| es.signup.steps.4 | (removed) | 68 O.S. § 3105 (as described by Delaware County Treasurer) | [link](https://oktaxrolls.com/county/Delaware) | flagged |
| es.signup.deposit.1 | Varía por condado. | 68 O.S. §§ 3125-3131 (as described by Delaware County Treasurer) | [link](https://oktaxrolls.com/county/Delaware) | supported |
| es.otc.note.1 | Tras una reventa, el tesorero puede vender propiedad escriturada al condado ante una oferta, sujeto a aprobación de los comisionados del condado (condado de Delaware). | 68 O.S. § 3135 (as described by Delaware County Treasurer) | [link](https://oktaxrolls.com/county/Delaware) | flagged |

## Corrections (before → after)

- `summary.3`: “Rate is only 8%.” → “(removed)”
- `keyNotes.1`: “No post-sale redemption — buyer takes immediate title” → “(removed)”
- `keyNotes.2`: “June auction annual timing” → “Annual tax resale on the second Monday of June”
- `keyNotes.3`: “Rural land opportunities in eastern Oklahoma” → “(removed)”
- `beginnerTip.1`: “Oklahoma County (OKC) and Tulsa County have the best inventory.” → “(removed)”
- `risks.1`: “8% is among the lowest lien rates in the country — make sure the return justifies the capital” → “(removed)”
- `risks.3`: “Limited online infrastructure in rural counties” → “(removed)”
- `ddExtra.1`: “Calculate whether 8% justifies your capital commitment vs. other states” → “(removed)”
- `ddExtra.2`: “Verify road access on rural parcels” → “(removed)”
- `signup.platform`: “County treasurer (Oklahoma County uses online system)” → “County treasurer”
- `signup.steps.1`: “Find your target county treasurer at ok.gov/treasurer” → “Contact your target county treasurer”
- `signup.steps.2`: “Oklahoma County (OKC): check oklahomacounty.org/treasurer for online registration” → “Oklahoma County lists its tax resale on the second Monday in June”

## Pass 2 trims, removals and notes

- `type`: flagged: was "Hybrid (lien then deed)"; county page says liens are now held by the county
- `rate`: unreachable: OSCN (official Oklahoma Statutes) serves a Cloudflare Turnstile CAPTCHA; oklegislature.gov bill PDFs are disallowed by robots.txt; statute text not read; rate applies to certificates sold before the amendment (county page)
- `rateNote`: flagged: was "County auctions property — no post-sale redemption"
- `redemption`: unreachable: OSCN (official Oklahoma Statutes) serves a Cloudflare Turnstile CAPTCHA; oklegislature.gov bill PDFs are disallowed by robots.txt; statute text not read
- `bidMethod`: flagged: trimmed to resale
- `statute`: unreachable: OSCN (official Oklahoma Statutes) serves a Cloudflare Turnstile CAPTCHA; oklegislature.gov bill PDFs are disallowed by robots.txt; statute text not read
- `auctionPlatform`: flagged: was "County-run — in-person"
- `auctionTiming`: flagged: was "June (most counties)"
- `summary.1`: flagged: was "Oklahoma holds October tax lien auction followed by June resale and Commissioner's sale."
- `summary.2`: flagged: removed: OTC on the first Monday of October conflicts with the reported end of the certificate sale
- `summary.3`: removed: no official source (opinion, inventory or money wording)
- `summary.4`: unreachable: OSCN (official Oklahoma Statutes) serves a Cloudflare Turnstile CAPTCHA; oklegislature.gov bill PDFs are disallowed by robots.txt; statute text not read
- `typeWhy.1`: flagged: was October certificate auction
- `typeWhy.2`: unreachable: OSCN (official Oklahoma Statutes) serves a Cloudflare Turnstile CAPTCHA; oklegislature.gov bill PDFs are disallowed by robots.txt; statute text not read
- `typeWhy.3`: unreachable: OSCN (official Oklahoma Statutes) serves a Cloudflare Turnstile CAPTCHA; oklegislature.gov bill PDFs are disallowed by robots.txt; statute text not read
- `rateWhy.1`: unreachable: OSCN (official Oklahoma Statutes) serves a Cloudflare Turnstile CAPTCHA; oklegislature.gov bill PDFs are disallowed by robots.txt; statute text not read; removed comparison "one of the lowest"
- `rateWhy.2`: unreachable: OSCN (official Oklahoma Statutes) serves a Cloudflare Turnstile CAPTCHA; oklegislature.gov bill PDFs are disallowed by robots.txt; statute text not read
- `keyNotes.1`: removed: "no post-sale redemption, immediate title" not in any fetched source
- `keyNotes.3`: removed: no official source (opinion, inventory or money wording)
- `beginnerTip.1`: removed: no official source (opinion, inventory or money wording)
- `beginnerTip.2`: flagged: removed: OTC October purchase conflicts with reported end of the certificate sale; money opinion
- `risks.1`: removed: no official source (opinion, inventory or money wording) ("return")
- `risks.2`: unreachable: OSCN (official Oklahoma Statutes) serves a Cloudflare Turnstile CAPTCHA; oklegislature.gov bill PDFs are disallowed by robots.txt; statute text not read
- `risks.3`: removed: no official source (opinion, inventory or money wording)
- `ddExtra.1`: removed: no official source (opinion, inventory or money wording)
- `ddExtra.2`: removed: no official source (opinion, inventory or money wording)
- `ddExtra.3`: flagged: was "it's the first Monday of October"
- `signup.platform`: removed "Oklahoma County uses online system" (not in source)
- `signup.steps.1`: removed ok.gov/treasurer link
- `signup.steps.2`: was online registration claim
- `signup.steps.3`: flagged: removed: October auction registration
- `signup.steps.4`: flagged: removed: October OTC purchase
- `otc.available`: flagged: was "Available"
- `otc.note.1`: flagged: was October OTC at 8%
- `surplus.1`: unreachable: OSCN (official Oklahoma Statutes) serves a Cloudflare Turnstile CAPTCHA; oklegislature.gov bill PDFs are disallowed by robots.txt; statute text not read; surplus rule not read

## Conflicts (flagged)

- `type`: Delaware County Treasurer says an amendment to 68 O.S. § 3105 ended the October certificate sale; the statute text and act could not be reached (OSCN CAPTCHA, oklegislature.gov robots.txt), so statewide scope and start date are unconfirmed
- `rateNote`: Delaware County Treasurer says an amendment to 68 O.S. § 3105 ended the October certificate sale; the statute text and act could not be reached (OSCN CAPTCHA, oklegislature.gov robots.txt), so statewide scope and start date are unconfirmed
- `bidMethod`: Delaware County Treasurer says an amendment to 68 O.S. § 3105 ended the October certificate sale; the statute text and act could not be reached (OSCN CAPTCHA, oklegislature.gov robots.txt), so statewide scope and start date are unconfirmed
- `auctionPlatform`: Delaware County Treasurer says an amendment to 68 O.S. § 3105 ended the October certificate sale; the statute text and act could not be reached (OSCN CAPTCHA, oklegislature.gov robots.txt), so statewide scope and start date are unconfirmed
- `auctionTiming`: Delaware County Treasurer says an amendment to 68 O.S. § 3105 ended the October certificate sale; the statute text and act could not be reached (OSCN CAPTCHA, oklegislature.gov robots.txt), so statewide scope and start date are unconfirmed
- `summary.1`: Delaware County Treasurer says an amendment to 68 O.S. § 3105 ended the October certificate sale; the statute text and act could not be reached (OSCN CAPTCHA, oklegislature.gov robots.txt), so statewide scope and start date are unconfirmed
- `summary.2`: Delaware County Treasurer says an amendment to 68 O.S. § 3105 ended the October certificate sale; the statute text and act could not be reached (OSCN CAPTCHA, oklegislature.gov robots.txt), so statewide scope and start date are unconfirmed
- `typeWhy.1`: Delaware County Treasurer says an amendment to 68 O.S. § 3105 ended the October certificate sale; the statute text and act could not be reached (OSCN CAPTCHA, oklegislature.gov robots.txt), so statewide scope and start date are unconfirmed
- `beginnerTip.2`: Delaware County Treasurer says an amendment to 68 O.S. § 3105 ended the October certificate sale; the statute text and act could not be reached (OSCN CAPTCHA, oklegislature.gov robots.txt), so statewide scope and start date are unconfirmed
- `ddExtra.3`: Delaware County Treasurer says an amendment to 68 O.S. § 3105 ended the October certificate sale; the statute text and act could not be reached (OSCN CAPTCHA, oklegislature.gov robots.txt), so statewide scope and start date are unconfirmed
- `signup.steps.3`: Delaware County Treasurer says an amendment to 68 O.S. § 3105 ended the October certificate sale; the statute text and act could not be reached (OSCN CAPTCHA, oklegislature.gov robots.txt), so statewide scope and start date are unconfirmed
- `signup.steps.4`: Delaware County Treasurer says an amendment to 68 O.S. § 3105 ended the October certificate sale; the statute text and act could not be reached (OSCN CAPTCHA, oklegislature.gov robots.txt), so statewide scope and start date are unconfirmed
- `otc.available`: Delaware County Treasurer says an amendment to 68 O.S. § 3105 ended the October certificate sale; the statute text and act could not be reached (OSCN CAPTCHA, oklegislature.gov robots.txt), so statewide scope and start date are unconfirmed
- `otc.note.1`: Delaware County Treasurer says an amendment to 68 O.S. § 3105 ended the October certificate sale; the statute text and act could not be reached (OSCN CAPTCHA, oklegislature.gov robots.txt), so statewide scope and start date are unconfirmed
