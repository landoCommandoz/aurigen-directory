import { build, snapOf } from './lib.mjs';
const A = (slug) => ({ ...snapOf('ar', slug), sourceKind: 'agency' });
const home = A('cosl-tax-sales'), faq = A('cosl-faq'), rules = A('cosl-rules'), guide = A('cosl-purchasing');
const ADM = 'none: administrative practice (Commissioner of State Lands)';
const RUL = 'Commissioner of State Lands Rules (2023 ed.)';
const Q = {
  noRed: { ...home, statute: ADM + ', notice for bidders', quote: 'Effective July 1, 2023, parcels sold through the Commissioner of State Lands office cannot be redeemed. All sales are final, both at live auctions and through the online auction of unsold properties.' },
  deadline: { ...faq, statute: ADM + ', FAQ', quote: 'Anyone may redeem the parcel at any time after it is certified to the Commissioner of State Lands, until 4 p.m. the last business day prior to the sale date. Sales are final.' },
  yearly: { ...faq, statute: ADM + ', FAQ', quote: 'They are held once a year in the county where the property is located or in a contiguous county.' },
  lwd: { ...faq, statute: ADM + ', FAQ', quote: 'The state executes a Limited Warranty Deed, which conveys whatever interest the state has in the property to the purchaser.' },
  improve: { ...faq, statute: ADM + ', FAQ', quote: 'It is recommended that no significant improvements be made to the property prior to the expiration of the 90 day litigation period.' },
  unsold: { ...faq, statute: ADM + ', FAQ', quote: 'These parcels will be available after 30 days through the Post Auction Sales list. Prospective buyers may bid on these parcels through the online auction available on this website auction.cosl.org' },
  research: { ...faq, statute: ADM + ', FAQ', quote: 'All potential purchasers should research the property records maintained by the county tax assessor, tax collector and circuit clerk in order to determine if additional fees are owed on the property.' },
  assessor: { ...faq, statute: ADM + ', FAQ', quote: 'How can I get more information on a particular piece of property (e.g. location, structures, etc.)? A: You should contact the county assessor.' },
  catalog: { ...faq, statute: ADM + ', FAQ', quote: 'Parcel information for upcoming the auctions is also available on the COSL website, www.cosl.org, under Public Auction Catalog.' },
  payForms: { ...home, statute: ADM + ', notice for bidders', quote: 'Buyers may pay by personal or business check, credit or debit card, or cashier\'s check or money order. Full payment is due at the time of sale' },
  certify: { ...rules, statute: RUL + ', Title 1', quote: 'The counties in Arkansas certify tax-delinquent parcels to the Commissioner of State Lands' },
  lit90: { ...rules, statute: RUL + ', Subtitle K (Ark. Code Ann. § 26-37-203)', quote: 'must be filed within ninety (90) calendar days after the date of conveyance' },
  quiet: { ...rules, statute: RUL + ', Definitions', quote: 'In most instances a Limited Warranty Deed is used by a purchaser to quiet title to the parcel' },
  minbid: { ...rules, statute: RUL + ', Title 2', quote: 'The minimum Bid amount is equal to the delinquent taxes, penalties, interest, fees, and costs as calculated by the Commissioner and based upon Certification by the county.' },
  highest: { ...rules, statute: RUL + ', Title 2', quote: 'Each sale will be made to the highest bidder for not less than the minimum Bid amount.' },
  pay: { ...rules, statute: RUL + ', Title 2', quote: 'Successful bidders at a Tax Delinquent Property Auction must tender the full purchase price at the time of the sale.' },
  unsoldHi: { ...rules, statute: RUL + ', Definitions', quote: 'An Unsold-Property Auction is initiated solely by an online offer being made on the unsold parcel and is sold to the highest bidder.' },
  code: { ...rules, statute: 'Ark. Code Ann. §§ 26-37-101 to -105 (as cited in ' + RUL + ')', quote: 'the Commissioner is authorized to continue sales of state lands as provided for in §§ 26-37- 101 -- 26-37-105' },
  excess: { ...rules, statute: RUL + ', Title 4', quote: 'Such Excess Proceeds shall be distributed upon application according to statute, and any remainder shall be held in trust by the Commissioner for the former Owner.' },
  register: { ...guide, statute: ADM + ', buyer\'s guide', quote: 'Registration begins 1 hour before each auction at' },
  noGuar: { ...guide, statute: ADM + ', buyer\'s guide', quote: 'does not guarantee usability, accessibility or existence' },
};
const OK = 'ok';
const RM = 'removed: no official source (opinion, land-quality or access claim)';
const D = {
  'type': ['supported', 'Tax deed', 'lwd', OK],
  'rate': ['corrected', 'N/A (no redemption after the sale)', 'noRed', 'was "Penalty only"'],
  'rateNote': ['corrected', 'No redemption after the sale; owners may redeem until 4 p.m. the last business day before the sale', 'deadline', 'was "30-day redemption only — fastest deed resolution in the US"'],
  'redemption': ['corrected', 'None after the sale (redeem until 4 p.m. the last business day before the sale)', 'deadline', 'was "2 years"; first run had changed it to "None post-sale"; re-verified'],
  'bidMethod': ['supported', 'Highest bidder', 'highest', OK],
  'statute': ['supported', 'Ark. Code §26-37-101', 'code', 'pass 2: section number confirmed only through the Commissioner\'s rules; Arkansas Code text itself not fetched (vendor-hosted, JavaScript only)'],
  'auctionPlatform': ['corrected', 'Commissioner of State Lands — live auction in the county or a neighboring county', 'yearly', 'was "County-run — in-person"'],
  'auctionTiming': ['corrected', 'Once a year per county; unsold parcels go online after 30 days', 'yearly', 'was "Year-round". pass 2: online part rests on the FAQ unsold quote'],
  'summary.1': ['corrected', 'Arkansas counties certify tax-delinquent parcels to the Commissioner of State Lands, which sells them.', 'certify', 'was "manages all tax-delinquent properties statewide"'],
  'summary.2': ['corrected', 'Unsold parcels can be bought through the Commissioner\'s online auction.', 'unsold', 'was "Online purchasing available."'],
  'summary.3': ['corrected', 'The buyer gets a Limited Warranty Deed, conveying whatever interest the state has.', 'lwd', 'was "quitclaim-equivalent with a 90-day litigation risk window"; 90-day part kept in risks.1'],
  'summary.4': ['supported', 'Statute: ACA §26-37-101.', 'code', OK],
  'typeWhy.1': ['corrected', 'Arkansas sells tax-delinquent land by deed; since July 1, 2023, parcels sold by the Commissioner cannot be redeemed.', 'noRed', 'was "grants the original owner a 2-year right of redemption, making it a redeemable deed state"'],
  'typeWhy.2': ['corrected', 'The state\'s Limited Warranty Deed conveys whatever interest the state has in the property.', 'lwd', 'was "quitclaim-equivalent"'],
  'typeWhy.3': ['supported', 'ACA §26-37-101.', 'code', OK],
  'rateWhy.1': ['corrected', 'There is no interest rate: the minimum bid is the delinquent taxes, penalties, interest, fees and costs.', 'minbid', 'was "penalty-only structure ... flat penalty on the original tax amount owed"'],
  'rateWhy.2': ['supported', 'ACA §26-37-101.', 'code', OK],
  'keyNotes.1': ['corrected', 'No redemption after the sale since July 1, 2023', 'noRed', 'was "30-day redemption is one of the shortest in the US"'],
  'keyNotes.2': ['corrected', '', 'noRed', RM],
  'keyNotes.3': ['corrected', 'The Commissioner makes no promise that the property is usable, accessible or exists', 'noGuar', 'was "Clean title conveyed after 30-day window closes"'],
  'beginnerTip.1': ['corrected', 'Unsold parcels can be bid on online at auction.cosl.org, starting 30 days after the live auction.', 'unsold', 'was "buy properties from your computer without attending any auction"'],
  'beginnerTip.2': ['corrected', '', 'unsold', RM],
  'beginnerTip.3': ['corrected', 'Research the property with the county assessor before you bid.', 'assessor', 'removed "raw land quality varies wildly"'],
  'risks.1': ['corrected', 'The Commissioner recommends no significant improvements before the 90-day litigation period ends', 'improve', 'was "90-day litigation window — make no improvements during this period"'],
  'risks.2': ['corrected', '', 'improve', RM],
  'risks.3': ['corrected', 'Buyers usually use the Limited Warranty Deed to bring a quiet title action', 'quiet', 'was "Quitclaim-equivalent deed makes title insurance difficult without quiet title action"'],
  'risks.4': ['corrected', '', 'improve', RM],
  'ddExtra.1': ['corrected', 'Check county assessor, tax collector and circuit clerk records for other fees owed', 'research', 'was "Request COSL deed history to confirm no prior failed redemptions"'],
  'ddExtra.2': ['corrected', 'Ask the county assessor about the property\'s location and structures', 'assessor', 'was "Check land use classification in county records before committing"'],
  'ddExtra.3': ['corrected', 'Expect to use the Limited Warranty Deed in a quiet title action', 'quiet', 'was "Budget for quiet title action if you intend to resell with title insurance"'],
  'signup.platform': ['supported', 'cosl.org (Commissioner of State Lands)', 'catalog', OK],
  'signup.steps.1': ['corrected', 'Find upcoming sales in the Public Auction Catalog on cosl.org', 'catalog', 'was "Go to cosl.org and create a free account"'],
  'signup.steps.2': ['corrected', 'Live auctions: register at the sale site, starting 1 hour before the auction', 'register', 'was "Browse available properties — updated regularly"'],
  'signup.steps.3': ['corrected', 'Unsold parcels: bid online at auction.cosl.org', 'unsold', 'was "Submit an online offer for any available property"'],
  'signup.steps.4': ['corrected', 'Pay the full price at the sale by check, card, cashier\'s check or money order', 'payForms', 'was "pay via credit card or ACH and receive your deed electronically"'],
  'signup.deposit.1': ['supported', 'Payment required at time of purchase.', 'pay', OK],
  'signup.deposit.2': ['corrected', '', 'pay', 'removed: no official source'],
  'otc.available': ['corrected', 'Yes: online auction of unsold parcels', 'unsold', 'was "Available"'],
  'otc.note.1': ['corrected', 'Parcels unsold at the live auction go to the online post-auction list after 30 days.', 'unsold', 'was "COSL sells directly year-round at cosl.org."'],
  'otc.note.2': ['corrected', 'Online sales of unsold parcels go to the highest bidder.', 'unsoldHi', 'was "No auction required."'],
  'platforms.1': ['supported', 'cosl.org', 'catalog', OK],
  'surplus.1': ['corrected', 'Sale money above taxes, fees and costs is held by the Commissioner for the former owner, who may apply for it (Commissioner of State Lands Rules, Title 4).', 'excess', 'was "Status pending — monitoring for legislative action."'],
};
const ES = {};
import fs from 'node:fs';
const { statePieces } = await import('/home/runner/work/aurigen-directory/aurigen-directory/cloudflare/scripts/law-pieces.mjs');
const st = JSON.parse(fs.readFileSync('/home/runner/work/aurigen-directory/aurigen-directory/cloudflare/data/states/ar.json', 'utf8'));
const ESX = {
  'rate': 'N/A (sin redención después de la venta)',
  'redemption': 'Ninguna después de la venta (redima antes de las 4 p.m. del último día hábil previo a la venta)',
  'summary.1': 'Los condados de Arkansas certifican las parcelas con impuestos morosos al Comisionado de Tierras del Estado, que las vende.',
  'summary.2': 'Las parcelas no vendidas pueden comprarse en la subasta en línea del Comisionado.',
  'summary.3': 'El comprador recibe una Escritura de Garantía Limitada, que transmite el interés que tenga el estado.',
  'summary.4': 'Estatuto: ACA §26-37-101.',
  'typeWhy.1': 'Arkansas vende tierras con impuestos morosos por escritura; desde el 1 de julio de 2023, las parcelas vendidas por el Comisionado no pueden redimirse (ACA §26-37-101).',
  'typeWhy.2': 'La Escritura de Garantía Limitada del estado transmite el interés que tenga el estado en la propiedad.',
  'rateWhy.1': 'No hay tasa de interés: la oferta mínima es el total de impuestos morosos, multas, intereses, cargos y costos.',
  'rateWhy.2': 'ACA §26-37-101.',
  'beginnerTip.1': 'Las parcelas no vendidas pueden ofertarse en línea en auction.cosl.org, a partir de 30 días después de la subasta presencial.',
  'beginnerTip.2': '',
  'beginnerTip.3': 'Investigue la propiedad con el tasador del condado antes de ofertar.',
  'risks.1': 'El Comisionado recomienda no hacer mejoras importantes antes de que termine el período de litigio de 90 días',
  'risks.2': '',
  'risks.3': 'Los compradores suelen usar la Escritura de Garantía Limitada para una acción de saneamiento de título',
  'risks.4': '',
  'ddExtra.1': 'Revise los registros del tasador, el recaudador y el secretario del tribunal del condado por otros cargos adeudados',
  'ddExtra.2': 'Pregunte al tasador del condado por la ubicación y las construcciones de la propiedad',
  'ddExtra.3': 'Prevea usar la Escritura de Garantía Limitada en una acción de saneamiento de título',
  'signup.platform': 'cosl.org (Comisionado de Tierras del Estado)',
  'signup.steps.1': 'Encuentre las próximas ventas en el Catálogo de Subastas Públicas en cosl.org',
  'signup.steps.2': 'Subastas presenciales: regístrese en el lugar de la venta, desde 1 hora antes de la subasta',
  'signup.steps.3': 'Parcelas no vendidas: oferte en línea en auction.cosl.org',
  'signup.steps.4': 'Pague el precio total en la venta con cheque, tarjeta, cheque de caja o giro postal',
  'signup.deposit.1': 'Pago requerido al momento de la compra.',
  'signup.deposit.2': '',
  'otc.note.1': 'Las parcelas no vendidas en la subasta presencial pasan a la lista en línea posterior a la subasta después de 30 días.',
  'otc.note.2': 'Las ventas en línea de parcelas no vendidas son para el mejor postor.',
  'keyNotes.1': 'Sin redención después de la venta desde el 1 de julio de 2023',
  'keyNotes.3': 'El Comisionado no asegura que la propiedad sea utilizable, accesible o exista',
  'rateNote': 'Sin redención después de la venta; los propietarios pueden redimir hasta las 4 p.m. del último día hábil previo a la venta',
  'auctionTiming': 'Una vez al año por condado; las parcelas no vendidas pasan a línea después de 30 días',
};
for (const p of statePieces(st)) if (p.lang === 'es') {
  const en = p.id.replace(/^es\./, '');
  if (!(en in ESX)) throw new Error('no ES text for ' + p.id + ' :: ' + p.text);
  ES[p.id] = [en, ESX[en]];
}
build('ar', Q, D, ES, [], {
  codeAccess: 'The Arkansas Code is published free through a LexisNexis-hosted site that needs JavaScript and was not fetched. Claims rest on the Arkansas Commissioner of State Lands (state agency) pages at cosl.org and its Rules (2023 ed.) and buyer\'s guide PDFs, which cosl.org links from its tax-sale page (stored at coslstorage.blob.core.windows.net).',
  countySources: {},
});
