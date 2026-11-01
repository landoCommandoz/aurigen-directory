import { build, snapOf } from './lib.mjs';
const N = (sec) => ({ ...snapOf('wy', 'wy39-13-108'), sourceKind: 'code', statute: 'W.S. ' + sec });
const Q = {
  qi: { ...N('39-13-108(b)(ii)'), quote: 'shall bear interest at eighteen percent (18%) per annum until paid or collected' },
  qh: { ...N('39-13-108(d)(ii)'), quote: 'Any person, county, municipality or political subdivision holding a certificate of purchase or tax deed issued for delinquent taxes has a lien against the real property which is subject to the certificate of purchase or tax deed' },
  qd: { ...N('39-13-108(d)(ii)'), quote: 'The decree may contain an order of sale directing the sheriff to advertise and sell the real property without appraisal and make a return of the proceedings within sixty (60) days' },
  qs: { ...N('39-13-108(d)(iii)'), quote: 'the sheriff shall advertise the property for sale, and sell the property at public auction, without appraisal, to the highest bidder for cash.' },
  qr: { ...N('39-13-108(d)(iii)'), quote: 'Any person having an interest in the real property may redeem the property prior to confirmation by the court by paying into court a sum of money sufficient to pay all sums owing to the lienholder' },
  qp: { ...N('39-13-108(d)(iv)(C)'), quote: 'The balance to be paid to persons holding prior interests in the real property as their interests may appear. The payment may be claimed within two (2) years from the date of confirmation of the sale' },
};
const OK = 'ok';
const RM = 'removed: no official source (opinion, advice, inventory or market claim not in the statute)';
const W = { correctionKind: 'wording' };
const S = { correctionKind: 'substantive' };
const CC = 'Confirm with the county.';
const IN = 'Delinquent taxes bear interest at eighteen percent (18%) per annum until paid or collected (W.S. §39-13-108(b)(ii)).';
const RD = 'A person with an interest in the real property may redeem it before the court confirms a sale by paying all sums owing to the lienholder (W.S. §39-13-108(d)(iii)).';
const D = {
  'type': ['corrected', 'Lien held under a certificate of purchase or tax deed for delinquent taxes (W.S. §39-13-108(d)(ii))', 'qh', 'was "Tax lien"', W],
  'rate': ['corrected', 'Maximum rate set by law: 18% per year interest on delinquent taxes (W.S. §39-13-108(b)(ii)). Rate on a certificate of purchase: ' + CC, 'qi', 'was "15%"; the section read sets 18% on delinquent taxes and no 15% figure', S],
  'rateNote': ['corrected', 'Interest runs on unpaid taxes after they become delinquent, until paid or collected (W.S. §39-13-108(b)(ii))', 'qi', 'was "Fixed rate — no bidding"'],
  'redemption': ['corrected', 'Before the court confirms a sale, by paying all sums owing to the lienholder (W.S. §39-13-108(d)(iii)). Other redemption periods: ' + CC, 'qr', 'was "4 years"; no 4-year period appears in the section read', S],
  'bidMethod': ['corrected', 'In a court-ordered sale, the sheriff sells at public auction without appraisal to the highest bidder for cash (W.S. §39-13-108(d)(iii))', 'qs', 'was "Highest bidder (premium bid)"'],
  'statute': ['supported', 'WY Statute §39-13-108', 'qh', OK],
  'auctionPlatform': ['corrected', 'Sheriff, under a court order of sale (W.S. §39-13-108(d)(iii)). County treasurer details: ' + CC, 'qs', 'was "County treasurer — in-person"'],
  'auctionTiming': ['corrected', 'The decree may direct the sheriff to sell the property and report the proceedings within sixty days (W.S. §39-13-108(d)(ii)). Dates: ' + CC, 'qd', 'was "September–November (varies by county)"'],
  'summary.1': ['corrected', 'In Wyoming, a holder of a certificate of purchase or tax deed for delinquent taxes has a lien against the real property (W.S. §39-13-108(d)(ii)).', 'qh', 'was "Wyoming holds annual tax lien sales in November. 4-year redemption."; neither November nor 4 years appears in the section read', S],
  'summary.2': ['corrected', '', 'qh', RM],
  'summary.3': ['supported', 'Statute: WS §39-13-108.', 'qh', OK],
  'typeWhy.1': ['corrected', 'Wyoming law refers to certificates of purchase and tax deeds issued for delinquent taxes (W.S. §39-13-108(d)(ii)). Sale dates and process: ' + CC, 'qh', 'was "Wyoming sells tax lien certificates at annual November sales."'],
  'typeWhy.2': ['corrected', RD, 'qr', 'was "The investor holds the lien while the owner retains title during the 4-year redemption period — one of the longest in the country."', S],
  'typeWhy.3': ['supported', 'WS §39-13-108.', 'qh', OK],
  'rateWhy.1': ['corrected', IN, 'qi', 'was "Wyoming sets a fixed statutory rate of 15% per annum on tax lien certificates."', S],
  'rateWhy.2': ['corrected', '', 'qi', RM],
  'rateWhy.3': ['supported', 'WS §39-13-108.', 'qi', OK],
  'keyNotes.1': ['corrected', '', 'qr', RM],
  'keyNotes.2': ['corrected', '', 'qi', RM],
  'keyNotes.3': ['corrected', '', 'qh', RM],
  'notBeginnerReason.1': ['corrected', '', 'qh', RM],
  'beginnerTip.1': ['corrected', '', 'qh', RM],
  'beginnerTip.2': ['corrected', '', 'qh', RM],
  'risks.1': ['corrected', '', 'qr', RM],
  'risks.2': ['corrected', '', 'qh', RM],
  'risks.3': ['corrected', '', 'qs', RM],
  'ddExtra.1': ['corrected', '', 'qh', RM],
  'ddExtra.2': ['corrected', '', 'qh', RM],
  'ddExtra.3': ['corrected', 'Confirm the sale date with the county.', 'qs', 'was "Confirm the November sale date with the county treasurer by October"; "November" not in the section read', W],
  'signup.platform': ['corrected', 'Sheriff sale under a court order (W.S. §39-13-108(d)(iii)). Treasurer details: ' + CC, 'qs', 'was "County treasurer (in-person, November)"'],
  'signup.steps.1': ['corrected', 'Contact the county treasurer. ' + CC, 'qs', 'was "Find your target county treasurer at wyoming.gov/government/counties"', W],
  'signup.steps.2': ['corrected', 'Ask when a sale is scheduled. ' + CC, 'qs', 'was "Contact the treasurer in September to confirm the November sale schedule"'],
  'signup.steps.3': ['corrected', 'Property list: ' + CC, 'qs', 'was "Request the property list"', W],
  'signup.steps.4': ['corrected', 'In person or online: ' + CC, 'qs', 'was "Register in person — most WY counties do not have online bidding"'],
  'signup.deposit.1': ['corrected', 'The highest bidder pays cash (W.S. §39-13-108(d)(iii)).', 'qs', 'was "Varies by county."'],
  'otc.available': ['corrected', 'Not set by the section read. ' + CC, 'qs', 'was "Not generally available"'],
  'otc.note.1': ['corrected', 'Not set by the section read. ' + CC, 'qs', 'was "No OTC program."'],
  'platforms.1': ['corrected', 'County sheriff offices', 'qs', 'was "County treasurer offices"', W],
  'surplus.1': ['corrected', 'After a confirmed sale, the balance goes to persons holding prior interests, who may claim it within two years from the date of confirmation (W.S. §39-13-108(d)(iv)(C)).', 'qp', 'was "Status pending — monitoring for legislative action."'],
};
const ES = {
  'es.rate': ['rate', 'Tasa máxima fijada por la ley: 18% anual de interés sobre impuestos morosos (W.S. §39-13-108(b)(ii)). Tasa sobre un certificado de compra: Confirme con el condado.'],
  'es.redemption': ['redemption', 'Antes de que el tribunal confirme la venta, pagando todas las sumas adeudadas al titular del gravamen (W.S. §39-13-108(d)(iii)). Otros plazos de redención: Confirme con el condado.'],
  'es.summary.1': ['summary.1', 'En Wyoming, el titular de un certificado de compra o escritura fiscal por impuestos morosos tiene un gravamen sobre los bienes raíces (W.S. §39-13-108(d)(ii)).'],
  'es.summary.2': ['summary.1', ''],
  'es.summary.3': ['summary.2', ''],
  'es.summary.4': ['summary.3', 'Estatuto: WS §39-13-108.'],
  'es.typeWhy.1': ['typeWhy.1', 'La ley de Wyoming se refiere a certificados de compra y escrituras fiscales emitidos por impuestos morosos (W.S. §39-13-108(d)(ii)). Fechas y proceso de venta: Confirme con el condado.'],
  'es.rateWhy.1': ['rateWhy.1', 'Los impuestos morosos devengan interés del dieciocho por ciento (18%) anual hasta que se paguen o cobren (W.S. §39-13-108(b)(ii)).'],
  'es.notBeginnerReason.1': ['notBeginnerReason.1', ''],
  'es.beginnerTip.1': ['beginnerTip.1', ''],
  'es.beginnerTip.2': ['beginnerTip.2', ''],
  'es.risks.1': ['risks.1', ''],
  'es.risks.2': ['risks.2', ''],
  'es.risks.3': ['risks.3', ''],
  'es.ddExtra.1': ['ddExtra.1', ''],
  'es.ddExtra.2': ['ddExtra.2', ''],
  'es.ddExtra.3': ['ddExtra.3', 'Confirme la fecha de la venta con el condado.'],
  'es.signup.platform': ['signup.platform', 'Venta del alguacil por orden judicial (W.S. §39-13-108(d)(iii)). Detalles del tesorero: Confirme con el condado.'],
  'es.signup.steps.1': ['signup.steps.1', 'Contacte al tesorero del condado. Confirme con el condado.'],
  'es.signup.steps.2': ['signup.steps.2', 'Pregunte cuándo hay una venta programada. Confirme con el condado.'],
  'es.signup.steps.3': ['signup.steps.3', 'Lista de propiedades: Confirme con el condado.'],
  'es.signup.steps.4': ['signup.steps.4', 'En persona o en línea: Confirme con el condado.'],
  'es.signup.deposit.1': ['signup.deposit.1', 'El mejor postor paga en efectivo (W.S. §39-13-108(d)(iii)).'],
  'es.otc.note.1': ['otc.note.1', 'No lo fija la sección consultada. Confirme con el condado.'],
};
build('wy', Q, D, ES, [], {
  codeAccess: 'Wyoming Statutes Title 39 (full title PDF, including 39-13-108 (b) interest and (d) liens) from wyoleg.gov (Wyoming Legislature). The sections that set the county treasurer tax sale and certificate of purchase were not located in the text read (gap WY-1).',
  countySources: {},
});
