# Pennsylvania (PA) law audit

Checked 2026-10-27. Status: done. Ledger: `cloudflare/data/law/pa.json`.

Official code access: Real Estate Tax Sale Law (Act 542 of 1947) fetched as the official unconsolidated-statute PDF from palegis.us (Pennsylvania General Assembly), current through Act 27 of 2026.

## Finding

Act 542 (Real Estate Tax Sale Law) governs county tax claim bureau sales outside first- and second-class cities, so
Philadelphia and Pittsburgh (and their Bid4Assets sheriff sales) are outside it; those claims were removed. Upset sales
are scheduled from the second Monday of September to before October 1 (§ 601); there is no redemption after the sale
(§ 501(c)); upset sale title passes subject to liens not in the upset price (§ 609); judicial sales are freed of
mortgages and liens except separately taxed ground rents (§ 612); unsold property may go to private sale (§ 613) and,
after judicial sale, to the repository (§§ 626-627). Sale proceeds go last to the owner (§ 205(d)). Cost estimates,
deposit amounts, IRS lien and "clean title" claims were removed as unsupported.

## 2023 to 2026 enacted-law search

Searched the amendment notes in the official Act 542 PDF (palegis.us, current through 2026) for acts from 2023 to 2026:
- Act of July 8, 2024, P.L. 533, No. 48: added § 631 (county demolition and rehabilitation fund). No change to site claims.
- Act of July 12, 2026, P.L. 391, No. 27: added § 619.2 (owner-designated individual for delinquency notices) and
  Article VII-A (unseated lands: title, redemption claims, five-year limitation). No change to site claims.
Bill numbers were not identified from the PDF. No 2023 acts appear in the notes.

## Unreachable sources

None.

## Watch

- Post-Tyler surplus handling: § 205(d) already pays the remainder to the owner; watch for further bills.

## Claims

| id | shown | statute | link | status |
|---|---|---|---|---|
| type | Tax deed | 72 P.S. § 5860.501(c) (Act 542 § 501) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | supported |
| rate | N/A | 72 P.S. § 5860.501(c) (Act 542 § 501) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | supported |
| rateNote | Upset sale: sold subject to liens not in the upset price. Judicial sale: freed of most liens | 72 P.S. § 5860.609 (Act 542 § 609) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | corrected |
| redemption | None post-sale | 72 P.S. § 5860.501(c) (Act 542 § 501) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | supported |
| bidMethod | Highest bidder | 72 P.S. § 5860.612 (Act 542 § 612) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | supported |
| statute | 72 P.S. §5860.601 | 72 P.S. § 5860.601 (Act 542 § 601) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | supported |
| auctionPlatform | County tax claim bureau | 72 P.S. § 5860.601 (Act 542 § 601) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | corrected |
| auctionTiming | Upset sale scheduled from the second Monday of September, before October 1 | 72 P.S. § 5860.601 (Act 542 § 601) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | corrected |
| summary.1 | Pennsylvania's Real Estate Tax Sale Law provides an upset sale (scheduled from the second Monday of September), private sale of unsold property, and judicial sale freed of most liens. | 72 P.S. § 5860.601 (Act 542 § 601) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | corrected |
| summary.2 | Upset sale buyers take title subject to recorded liens not included in the upset price. | 72 P.S. § 5860.609 (Act 542 § 609) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | corrected |
| summary.3 | Statute: PA Act 542 (72 PS §5860.101). | Real Estate Tax Sale Law, Act of July 7, 1947, P.L. 1368, No. 542 (title) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | supported |
| typeWhy.1 | Pennsylvania sells the property deed outright through multiple pathways (Upset Sale, Private Sale, Judicial Sale) with no post-sale redemption. | 72 P.S. § 5860.501(c) (Act 542 § 501) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | supported |
| typeWhy.2 | PA Act 542 (72 PS §5860.101). | 72 P.S. § 5860.501(c) (Act 542 § 501) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | supported |
| rateWhy.1 | Pennsylvania is a deed state with no statutory interest rate. | 72 P.S. § 5860.501(c) (Act 542 § 501) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | supported |
| rateWhy.2 | The upset price includes Commonwealth tax liens and the tax claim with interest; a judicial sale is freed of most liens. | 72 P.S. § 5860.605 (Act 542 § 605) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | corrected |
| rateWhy.3 | PA Act 542 (72 PS §5860.101). | 72 P.S. § 5860.605 (Act 542 § 605) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | supported |
| keyNotes.1 | Upset sale: title passes subject to recorded liens and mortgages not included in the upset price | 72 P.S. § 5860.609 (Act 542 § 609) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | corrected |
| keyNotes.2 | Judicial sale: property sold freed of tax claims, mortgages and liens, except separately taxed ground rents | 72 P.S. § 5860.612 (Act 542 § 612) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | corrected |
| keyNotes.3 | Confirm whether a property is offered at upset sale or judicial sale before bidding | 72 P.S. § 5860.609 (Act 542 § 609) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | corrected |
| keyNotes.4 | Philadelphia and Pittsburgh (first- and second-class cities) are outside this Act | Real Estate Tax Sale Law, Act of July 7, 1947, P.L. 1368, No. 542 (title) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | corrected |
| beginnerTip.1 | Property not sold at the upset sale may be sold by the tax claim bureau at private sale, at a price the bureau approves. | 72 P.S. § 5860.613 (Act 542 § 613) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | corrected |
| beginnerTip.2 | (removed) | 72 P.S. § 5860.613 (Act 542 § 613) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | corrected |
| beginnerTip.3 | Ask the county tax claim bureau for its repository list of unsold properties. | 72 P.S. § 5860.626 (Act 542 § 626) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | corrected |
| risks.1 | Upset sale title may remain subject to liens not included in the upset price | 72 P.S. § 5860.609 (Act 542 § 609) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | corrected |
| risks.2 | Mortgages not included in the upset price survive an upset sale; a judicial sale is freed of them | 72 P.S. § 5860.609 (Act 542 § 609) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | corrected |
| risks.3 | (removed) | 72 P.S. § 5860.609 (Act 542 § 609) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | corrected |
| ddExtra.1 | Verify which sale applies: upset, private or judicial | 72 P.S. § 5860.609 (Act 542 § 609) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | corrected |
| ddExtra.2 | Check the tax claim bureau repository list of properties unsold after judicial sale | 72 P.S. § 5860.626 (Act 542 § 626) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | corrected |
| ddExtra.3 | (removed) | 72 P.S. § 5860.609 (Act 542 § 609) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | corrected |
| signup.platform | County tax claim bureau | 72 P.S. § 5860.601 (Act 542 § 601) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | corrected |
| signup.steps.1 | Find your target county tax claim bureau | 72 P.S. § 5860.601 (Act 542 § 601) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | corrected |
| signup.steps.2 | Request the upset sale list ahead of the September sale | 72 P.S. § 5860.601 (Act 542 § 601) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | corrected |
| signup.steps.3 | Ask the tax claim bureau how to register | 72 P.S. § 5860.601 (Act 542 § 601) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | corrected |
| signup.steps.4 | (removed) | Real Estate Tax Sale Law, Act of July 7, 1947, P.L. 1368, No. 542 (title) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | corrected |
| signup.deposit.1 | (removed) | 72 P.S. § 5860.601 (Act 542 § 601) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | corrected |
| signup.deposit.2 | Confirm with county. | 72 P.S. § 5860.601 (Act 542 § 601) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | supported |
| otc.available | Yes: private sale and repository sale | 72 P.S. § 5860.627 (Act 542 § 627) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | corrected |
| otc.note.1 | Property unsold at the upset sale may be sold at private sale; property unsold after judicial sale goes to a repository list with a minimum price. | 72 P.S. § 5860.627 (Act 542 § 627) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | corrected |
| otc.note.2 | Call the county tax claim bureau directly. | 72 P.S. § 5860.626 (Act 542 § 626) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | corrected |
| platforms.1 | (removed) | Real Estate Tax Sale Law, Act of July 7, 1947, P.L. 1368, No. 542 (title) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | corrected |
| platforms.2 | County tax claim bureaus | 72 P.S. § 5860.601 (Act 542 § 601) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | corrected |
| surplus.1 | After tax sale costs, Commonwealth liens, taxes, municipal claims and lien holders, remaining proceeds go to the owner (72 P.S. § 5860.205(d)). | 72 P.S. § 5860.205(d) (Act 542 § 205) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | corrected |
| es.rate | N/A | 72 P.S. § 5860.501(c) (Act 542 § 501) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | supported |
| es.redemption | Ninguna post-venta | 72 P.S. § 5860.501(c) (Act 542 § 501) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | supported |
| es.summary.1 | La Ley de Venta de Bienes Raíces por Impuestos de Pensilvania prevé una venta de protesta (programada desde el segundo lunes de septiembre), venta privada de propiedad no vendida y venta judicial libre de la mayoría de los gravámenes. | 72 P.S. § 5860.601 (Act 542 § 601) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | corrected |
| es.summary.2 | Los compradores en venta de protesta reciben el título sujeto a gravámenes registrados no incluidos en el precio mínimo. | 72 P.S. § 5860.609 (Act 542 § 609) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | corrected |
| es.summary.3 | Estatuto: PA Act 542 (72 PS §5860.101). | Real Estate Tax Sale Law, Act of July 7, 1947, P.L. 1368, No. 542 (title) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | supported |
| es.typeWhy.1 | Pensilvania vende la escritura directamente por varias vías (Venta de Protesta, Venta Privada, Venta Judicial) sin redención posterior a la venta (PA Act 542, 72 PS §5860.101). | 72 P.S. § 5860.501(c) (Act 542 § 501) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | corrected |
| es.rateWhy.1 | No se aplica tasa de interés. | 72 P.S. § 5860.501(c) (Act 542 § 501) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | supported |
| es.rateWhy.2 | El precio mínimo incluye los gravámenes fiscales del Estado y el reclamo fiscal con intereses; la venta judicial queda libre de la mayoría de los gravámenes. | 72 P.S. § 5860.605 (Act 542 § 605) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | corrected |
| es.beginnerTip.1 | La propiedad no vendida en la venta de protesta puede venderse en venta privada por la oficina de reclamación fiscal, al precio que esta apruebe. | 72 P.S. § 5860.613 (Act 542 § 613) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | corrected |
| es.beginnerTip.2 | (removed) | 72 P.S. § 5860.613 (Act 542 § 613) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | corrected |
| es.beginnerTip.3 | Pida a la oficina de reclamación fiscal del condado su lista de depósito de propiedades no vendidas. | 72 P.S. § 5860.626 (Act 542 § 626) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | corrected |
| es.risks.1 | El título de una venta de protesta puede seguir sujeto a gravámenes no incluidos en el precio mínimo | 72 P.S. § 5860.609 (Act 542 § 609) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | corrected |
| es.risks.2 | Las hipotecas no incluidas en el precio mínimo sobreviven a la venta de protesta; la venta judicial queda libre de ellas | 72 P.S. § 5860.609 (Act 542 § 609) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | corrected |
| es.risks.3 | (removed) | 72 P.S. § 5860.609 (Act 542 § 609) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | corrected |
| es.ddExtra.1 | Verifique qué venta aplica: de protesta, privada o judicial | 72 P.S. § 5860.609 (Act 542 § 609) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | corrected |
| es.ddExtra.2 | Revise la lista de depósito de la oficina de reclamación fiscal con propiedades no vendidas tras la venta judicial | 72 P.S. § 5860.626 (Act 542 § 626) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | corrected |
| es.ddExtra.3 | (removed) | 72 P.S. § 5860.609 (Act 542 § 609) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | corrected |
| es.signup.platform | Oficina de reclamación fiscal del condado | 72 P.S. § 5860.601 (Act 542 § 601) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | corrected |
| es.signup.steps.1 | Encuentre la oficina de reclamación fiscal de su condado | 72 P.S. § 5860.601 (Act 542 § 601) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | corrected |
| es.signup.steps.2 | Solicite la lista de la venta de protesta antes de la venta de septiembre | 72 P.S. § 5860.601 (Act 542 § 601) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | corrected |
| es.signup.steps.3 | Pregunte a la oficina de reclamación fiscal cómo registrarse | 72 P.S. § 5860.601 (Act 542 § 601) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | corrected |
| es.signup.steps.4 | (removed) | Real Estate Tax Sale Law, Act of July 7, 1947, P.L. 1368, No. 542 (title) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | corrected |
| es.signup.deposit.1 | (removed) | 72 P.S. § 5860.601 (Act 542 § 601) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | corrected |
| es.signup.deposit.2 | Confirme con el condado. | 72 P.S. § 5860.601 (Act 542 § 601) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | supported |
| es.otc.note.1 | La propiedad no vendida en la venta de protesta puede venderse en venta privada; la no vendida tras la venta judicial pasa a una lista de depósito con precio mínimo. | 72 P.S. § 5860.627 (Act 542 § 627) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | corrected |
| es.otc.note.2 | Llame directamente a la oficina de reclamación fiscal del condado. | 72 P.S. § 5860.626 (Act 542 § 626) | [link](https://www.palegis.us/statutes/unconsolidated/law-information/view-statute?txtType=PDF&SessYr=1947&ActNum=0542.&SessInd=0) | corrected |

## Corrections (before → after)

- `rateNote`: “TWO-SALE SYSTEM: Upset sale (dangerous) vs Judicial/Repository sale (clean title)” → “Upset sale: sold subject to liens not in the upset price. Judicial sale: freed of most liens”
- `auctionPlatform`: “County-run — in-person” → “County tax claim bureau”
- `auctionTiming`: “Year-round” → “Upset sale scheduled from the second Monday of September, before October 1”
- `summary.1`: “Pennsylvania's Real Estate Tax Sale Law creates multiple pathways: Upset Sale (September, min = all back taxes), Private Sale (unsold properties), and Judicial Sale (lower minimums, wipes most liens).” → “Pennsylvania's Real Estate Tax Sale Law provides an upset sale (scheduled from the second Monday of September), private sale of unsold property, and judicial sale freed of most liens.”
- `summary.2`: “Title clearance frequently required for insurable deed.” → “Upset sale buyers take title subject to recorded liens not included in the upset price.”
- `rateWhy.2`: “Upset Sale minimums equal all back taxes; Judicial Sale minimums are lower and wipe most liens.” → “The upset price includes Commonwealth tax liens and the tax claim with interest; a judicial sale is freed of most liens.”
- `keyNotes.1`: “CRITICAL: Upset sale = surviving liens (mortgages may remain) — dangerous for investors” → “Upset sale: title passes subject to recorded liens and mortgages not included in the upset price”
- `keyNotes.2`: “Judicial sale and Repository sale = clean title, all liens wiped” → “Judicial sale: property sold freed of tax claims, mortgages and liens, except separately taxed ground rents”
- `keyNotes.3`: “Always confirm which type of sale before bidding — upset vs judicial is the difference between clean and clouded title” → “Confirm whether a property is offered at upset sale or judicial sale before bidding”
- `keyNotes.4`: “Philadelphia and Pittsburgh have high volume — mostly judicial sales” → “Philadelphia and Pittsburgh (first- and second-class cities) are outside this Act”
- `beginnerTip.1`: “Start with the private sale list — properties that didn't sell at Upset Sale are available for direct purchase from the county tax claim office at reduced prices.” → “Property not sold at the upset sale may be sold by the tax claim bureau at private sale, at a price the bureau approves.”
- `beginnerTip.2`: “No auction competition.” → “(removed)”
- `beginnerTip.3`: “Call the county tax claim office and ask for their private sale inventory.” → “Ask the county tax claim bureau for its repository list of unsold properties.”
- `risks.1`: “Title clearance required for insurable deed — budget $2,500–$7,500” → “Upset sale title may remain subject to liens not included in the upset price”
- `risks.2`: “Mortgage liens may survive Upset Sale (but not Judicial Sale) — know which type you're buying” → “Mortgages not included in the upset price survive an upset sale; a judicial sale is freed of them”
- `risks.3`: “Some liens survive both sale types — IRS liens are the primary concern” → “(removed)”
- `ddExtra.1`: “Verify which sale type applies — Upset vs. Private vs. Judicial have different lien survivability” → “Verify which sale applies: upset, private or judicial”
- `ddExtra.2`: “Check the county tax claim office private sale list for underutilized buying opportunities” → “Check the tax claim bureau repository list of properties unsold after judicial sale”
- `ddExtra.3`: “Budget for title clearance before planning any resale” → “(removed)”
- `signup.platform`: “County tax claim office (in-person) + Bid4Assets (Philadelphia, some others)” → “County tax claim bureau”
- `signup.steps.1`: “Find your target county tax claim office — pa.gov/guides/pa-courts for county directory” → “Find your target county tax claim bureau”
- `signup.steps.2`: “Request the September Upset Sale property list (usually available August)” → “Request the upset sale list ahead of the September sale”
- `signup.steps.3`: “Register with the county tax claim office — in-person registration required in most counties” → “Ask the tax claim bureau how to register”
- `signup.steps.4`: “For Philadelphia: go to bid4assets.com and register for the Sheriff's Sale” → “(removed)”
- `signup.deposit.1`: “Typically $500–$1,000 deposit.” → “(removed)”
- `otc.available`: “Available” → “Yes: private sale and repository sale”
- `otc.note.1`: “Private sale list available from county tax claim offices for properties unsold at Upset Sale.” → “Property unsold at the upset sale may be sold at private sale; property unsold after judicial sale goes to a repository list with a minimum price.”
- `otc.note.2`: “Call the county directly.” → “Call the county tax claim bureau directly.”
- `platforms.1`: “Bid4Assets.com” → “(removed)”
- `platforms.2`: “County tax claim offices” → “County tax claim bureaus”
- `surplus.1`: “Status pending — monitoring for legislative action.” → “After tax sale costs, Commonwealth liens, taxes, municipal claims and lien holders, remaining proceeds go to the owner (72 P.S. § 5860.205(d)).”

## Pass 2 trims, removals and notes

- `rateNote`: was "TWO-SALE SYSTEM: Upset sale (dangerous) vs Judicial/Repository sale (clean title)"; removed opinion and repository claim
- `bidMethod`: pass 2: dropped "at or above the upset price" (not in this quote); highest bidder quoted for judicial sale
- `auctionPlatform`: was "County-run — in-person"
- `auctionTiming`: was "Year-round"
- `summary.1`: removed "lower minimums"; added September window from § 601. pass 2: quote covers the date; private and judicial parts rest on §§ 613 and 612 quotes (beginnerTip.1, keyNotes.2)
- `summary.2`: was "Title clearance frequently required for insurable deed."
- `rateWhy.2`: was "Upset Sale minimums equal all back taxes; Judicial Sale minimums are lower and wipe most liens."
- `keyNotes.1`: removed "CRITICAL" and "dangerous for investors"
- `keyNotes.2`: removed repository sale and "clean title"
- `keyNotes.3`: trimmed opinion
- `keyNotes.4`: was "high volume — mostly judicial sales"
- `beginnerTip.1`: removed "reduced prices" and "direct purchase" framing
- `beginnerTip.2`: removed: no official source (opinion, cost estimate, volume or vendor claim)
- `beginnerTip.3`: was "private sale inventory"
- `risks.1`: removed cost estimate "$2,500–$7,500"
- `risks.3`: removed: IRS lien survival is federal law, not in Act 542
- `ddExtra.1`: trimmed
- `ddExtra.2`: removed "underutilized buying opportunities"
- `ddExtra.3`: removed: no official source (opinion, cost estimate, volume or vendor claim)
- `signup.platform`: removed Bid4Assets/Philadelphia (Philadelphia is outside Act 542)
- `signup.steps.1`: removed pa.gov link
- `signup.steps.2`: removed "usually available August"
- `signup.steps.3`: removed "in-person registration required in most counties"
- `signup.steps.4`: removed: Philadelphia sheriff sales are outside Act 542
- `signup.deposit.1`: removed "$500–$1,000" (not in statute)
- `otc.available`: was "Available"
- `platforms.1`: removed: Bid4Assets is a vendor, not in statute
- `surplus.1`: was "Status pending"

## Conflicts (flagged)

None.
