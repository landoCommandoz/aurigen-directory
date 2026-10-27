import fs from 'node:fs';
const R='/home/runner/work/aurigen-directory/aurigen-directory';
const { statePieces } = await import(R+'/cloudflare/scripts/law-pieces.mjs');
const st = JSON.parse(fs.readFileSync(R+'/cloudflare/data/states/ak.json','utf8'));
const snap = (slug) => { const m = JSON.parse(fs.readFileSync(`${R}/foundry/out/law-audit/sources/ak/${slug}.json`,'utf8')); return { url: m.url, snapshot: `foundry/out/law-audit/sources/ak/${slug}.json`, checked: m.fetched_at.slice(0,10) }; };
const S = { ...snap('as-29-45-290-500'), sourceKind: 'code' };
const A = { ...snap('muni-anchorage-foreclosed'), sourceKind: 'county', statute: 'none: administrative practice (Municipality of Anchorage)' };
const c = (sec, quote) => ({ ...S, statute: `AS ${sec}`, quote });
const Q = {
  q320: c('29.45.320', 'The municipality shall enforce delinquent real property tax liens by annual foreclosure, unless otherwise provided by ordinance.'),
  q330l: c('29.45.330', "a statement that the list is available for public inspection at the clerk's office"),
  q360: c('29.45.360', 'A municipality shall bring one general foreclosure proceeding in rem against the properties included in the foreclosure list.'),
  q390: c('29.45.390', 'Foreclosed properties are transferred to the municipality for the lien amount.'),
  q400: c('29.45.400', 'Properties transferred to the municipality are held by the municipality for at least one year.'),
  q400r: c('29.45.400', 'Properties transferred to the municipality are held by the municipality for at least one year. During the redemption period a party having an interest in the property may redeem it'),
  q440: c('29.45.440', 'all properties ordered sold under the judgment, unless redeemed, shall be deeded to the municipality immediately on expiration of the period of redemption'),
  q450a: c('29.45.450', 'Unredeemed property in the area of the borough outside all cities is deeded to the borough by the clerk of the court. Unredeemed property in a city is deeded to the city'),
  q450b: c('29.45.450', 'Conveyance gives the municipality clear title, except for prior recorded tax liens of the United States and the state.'),
  q460a: c('29.45.460', 'The municipality shall determine by ordinance whether foreclosed property deeded to the municipality shall be retained for a public purpose.'),
  q460b: c('29.45.460', 'Tax-foreclosed property conveyed to a municipality by tax foreclosure and not required for a public purpose may be sold.'),
  q480b: c('29.45.480', 'If tax-foreclosed real property that has been held by a municipality for less than 10 years after the close of the redemption period and never designated for a public purpose is sold at a tax-foreclosure sale, the former record owner is entitled to the portion of the proceeds of the sale that exceeds the amount of unpaid taxes'),
  q480c: c('29.45.480', 'On presentation of a proper claim, the municipality shall remit the excess to the former record owner. A claim for the excess filed after six months of the date of sale is forever barred.'),
  aSale: { ...A, quote: 'A Second 2026 Tax-Foreclosed Property Sale took place September 16, 2026' },
  aSealed: { ...A, quote: 'The properties that are available for the second sealed bid sale' },
  aAsIs: { ...A, quote: 'All properties are offered for sale on a "where is" and "as is" basis without any representation or warranty, expressed or implied.' },
  aResearch: { ...A, quote: 'It is the responsibility of the purchaser to do their own research as to whether the property may be subject to liens, encumbrances, or restrictions' },
  aInfo: { ...A, quote: 'All information regarding the tax foreclosure auction can be found on this webpage.' },
  aDept: { ...A, quote: 'The Real Estate Department makes no guarantee or warrantee' },
};
const DCRA = ['https://www.commerce.alaska.gov/web/dcra/', 'https://www.commerce.alaska.gov/web/dcra/OfficeoftheStateAssessor.aspx'];
// id: [status, shown, cite, pass2, extra]
const OK = 'ok';
const D = {
  'type': ['supported', 'Tax deed', 'q460b', 'ok: buyers buy property from the municipality, not a lien'],
  'rate': ['corrected', 'No interest to buyers: the municipality takes the property', 'q390', 'ok (pass 2): no lien is sold to buyers; foreclosed property goes to the municipality, so no buyer rate exists'],
  'rateNote': ['corrected', 'Unredeemed property is deeded to the borough or city', 'q450a', OK],
  'redemption': ['corrected', 'At least 1 year after transfer to the municipality', 'q400', OK],
  'bidMethod': ['flagged', 'Set by each borough or city', 'q460b', 'flagged: AS 29.45 says unneeded property "may be sold" but sets no bid method; local ordinances not audited', { flagReason: 'AS 29.45.460 sets no bid method; method comes from municipal ordinances not yet audited' }],
  'statute': ['corrected', 'AS 29.45.290–29.45.500', 'q320', OK],
  'auctionPlatform': ['corrected', 'Run by the borough or city that took the property', 'q460b', OK],
  'auctionTiming': ['corrected', 'Set locally, after unredeemed property is deeded to the municipality', 'q440', OK],
  'summary.1': ['corrected', 'In Alaska, the borough or city (the municipality) forecloses on delinquent real property taxes.', 'q320', OK],
  'summary.2': ['corrected', 'For example, the Municipality of Anchorage held a tax-foreclosed property sale on September 16, 2026.', 'aSale', OK],
  'summary.3': ['corrected', 'Statute: AS 29.45.290–29.45.500.', 'q320', OK],
  'typeWhy.1': ['corrected', 'Property not redeemed is deeded to the municipality, which may sell it if it is not needed for a public purpose.', 'q460b', 'trimmed: dropped "auctions" and "buyer receives a deed" (no quote on sale method or buyer deed)'],
  'typeWhy.2': ['corrected', 'A party with an interest in the property can redeem it for at least one year after transfer to the municipality.', 'q400r', OK],
  'typeWhy.3': ['corrected', 'AS 29.45.400.', 'q400', OK],
  'rateWhy.1': ['corrected', 'Buyers do not receive interest: foreclosed property goes to the municipality for the lien amount.', 'q390', OK],
  'rateWhy.2': ['corrected', '', 'q460b', 'removed: no official source says bidding is competitive or market-driven'],
  'rateWhy.3': ['corrected', 'AS 29.45.390.', 'q390', OK],
  'keyNotes.1': ['corrected', 'Boroughs and cities take and sell tax-foreclosed property', 'q450a', 'trimmed: removed "19 organized boroughs plus unorganized areas" (DCRA source blocked, HTTP 403)'],
  'keyNotes.2': ['corrected', '', 'q360', 'removed: inventory and parcel-type claims have no official source'],
  'keyNotes.3': ['corrected', 'Each municipality decides by ordinance whether to keep foreclosed property; contact the borough or city before bidding', 'q460a', OK],
  'notBeginnerReason.1': ['corrected', 'Each borough or city forecloses under its own ordinances.', 'q320', 'trimmed: removed "limited inventory" and "federal land restricts most parcels" (no official source)'],
  'notBeginnerReason.2': ['corrected', '', 'q320', 'removed: opinion, no source'],
  'beginnerTip.1': ['corrected', '', 'q320', 'removed: opinion, no source'],
  'beginnerTip.2': ['corrected', 'Anchorage posts its tax-foreclosed property sale lists and results online.', 'aInfo', 'replaced Mat-Su claim ("most consistent auction activity") which has no official source'],
  'risks.1': ['corrected', 'Anchorage sells "as is", without warranty', 'aAsIs', 'replaced federal-land percentage claim (no official source)'],
  'risks.2': ['corrected', '', 'q360', 'removed: no source'],
  'risks.3': ['corrected', '', 'q360', 'removed: no source'],
  'risks.4': ['corrected', 'Rules vary because each municipality acts by ordinance', 'q460a', OK],
  'ddExtra.1': ['corrected', 'Check for prior recorded federal and state tax liens, which survive the transfer to the municipality', 'q450b', 'replaced federal/Native land check (no official source)'],
  'ddExtra.2': ['corrected', '', 'q360', 'removed: BLM atlas tip has no official Alaska source fetched'],
  'ddExtra.3': ['corrected', 'Research liens, encumbrances and restrictions yourself before bidding (Anchorage terms)', 'aResearch', 'replaced road-access claim (no source)'],
  'signup.platform': ['corrected', 'Borough or city specific', 'q450a', OK],
  'signup.steps.1': ['unreachable', 'Identify your target borough at commerce.alaska.gov', null, 'unreachable: DCRA site returned HTTP 403', { attempts: DCRA, statute: 'none: administrative practice (DCRA)', attemptedAt: '2026-10-27' }],
  'signup.steps.2': ['corrected', "Contact the borough or city clerk; the foreclosure list is open for public inspection at the clerk's office", 'q330l', OK],
  'signup.steps.3': ['corrected', 'Ask for the list of tax-foreclosed property the municipality has approved for sale', 'q460b', OK],
  'signup.steps.4': ['corrected', "Follow that municipality's bid instructions; Anchorage uses sealed bids", 'aSealed', 'trimmed: removed "most require in-person attendance" (no source)'],
  'signup.deposit.1': ['flagged', 'Varies by borough or city.', 'q460a', 'flagged: deposits are not in AS 29.45', { flagReason: 'Deposits are not set in AS 29.45; local rules not audited' }],
  'signup.deposit.2': ['corrected', '', 'q460a', 'removed: the flag note already says to confirm with the county'],
  'otc.available': ['flagged', 'Not generally available', 'q460b', 'flagged: AS 29.45 does not address over-the-counter sales', { flagReason: 'No state OTC rule in AS 29.45; municipalities may sell unsold property by ordinance' }],
  'otc.note.1': ['flagged', 'No statewide OTC program.', 'q460b', 'flagged: see otc.available', { flagReason: 'Same as otc.available' }],
  'platforms.1': ['corrected', 'Borough or city sale (Anchorage: Real Estate Department)', 'aDept', OK],
  'surplus.1': ['corrected', 'If the municipality held the property under 10 years after redemption ended and never designated it for public use, the former owner is entitled to the part of the sale proceeds that exceeds the unpaid taxes and the other amounts listed in AS 29.45.480(b).', 'q480b', 'pass 2 trim: was "...claim sale proceeds above taxes, interest and costs" (quote names unpaid taxes only)'],
};
const ES = {
  'es.rate': ['rate', 'Sin interés para compradores: la municipalidad se queda con la propiedad'],
  'es.redemption': ['redemption', 'Al menos 1 año después de pasar a la municipalidad'],
  'es.summary.1': ['summary.1', 'En Alaska, el borough o la ciudad (la municipalidad) ejecuta los impuestos atrasados sobre bienes inmuebles.'],
  'es.summary.2': ['summary.2', 'Por ejemplo, la Municipalidad de Anchorage realizó una venta de propiedades embargadas por impuestos el 16 de septiembre de 2026.'],
  'es.summary.3': ['summary.3', 'Estatuto: AS 29.45.290–29.45.500.'],
  'es.typeWhy.1': ['typeWhy.1', 'La propiedad no redimida pasa por escritura a la municipalidad, que puede venderla si no la necesita para un fin público.'],
  'es.rateWhy.1': ['rateWhy.1', 'Los compradores no reciben interés: la propiedad ejecutada pasa a la municipalidad por el monto del gravamen.'],
  'es.rateWhy.2': ['rateWhy.2', ''],
  'es.notBeginnerReason.1': ['notBeginnerReason.1', 'Cada borough o ciudad ejecuta según sus propias ordenanzas.'],
  'es.beginnerTip.1': ['beginnerTip.1', ''],
  'es.beginnerTip.2': ['beginnerTip.2', 'Anchorage publica en línea sus listas y resultados de ventas de propiedades embargadas por impuestos.'],
  'es.risks.1': ['risks.1', 'Anchorage vende "tal como está", sin respaldo ni declaraciones'],
  'es.risks.2': ['risks.2', ''],
  'es.risks.3': ['risks.3', ''],
  'es.risks.4': ['risks.4', 'Las reglas varían porque cada municipalidad actúa por ordenanza'],
  'es.ddExtra.1': ['ddExtra.1', 'Revise si hay gravámenes fiscales federales y estatales registrados antes, que subsisten tras pasar a la municipalidad'],
  'es.ddExtra.2': ['ddExtra.2', ''],
  'es.ddExtra.3': ['ddExtra.3', 'Investigue usted mismo gravámenes, cargas y restricciones antes de ofertar (condiciones de Anchorage)'],
  'es.signup.platform': ['signup.platform', 'Específico por borough o ciudad'],
  'es.signup.steps.1': ['signup.steps.1', 'Identifique su borough objetivo en commerce.alaska.gov'],
  'es.signup.steps.2': ['signup.steps.2', 'Contacte al secretario (clerk) del borough o la ciudad; la lista de ejecución está abierta a inspección pública en su oficina'],
  'es.signup.steps.3': ['signup.steps.3', 'Pida la lista de propiedades embargadas por impuestos que la municipalidad aprobó para la venta'],
  'es.signup.steps.4': ['signup.steps.4', 'Siga las instrucciones de oferta de esa municipalidad; Anchorage usa ofertas en sobre cerrado'],
  'es.signup.deposit.1': ['signup.deposit.1', 'Varía por borough o ciudad.'],
  'es.signup.deposit.2': ['signup.deposit.2', ''],
  'es.otc.note.1': ['otc.note.1', 'No hay programa OTC estatal.'],
};
const claims = [];
const byId = {};
for (const p of statePieces(st)) {
  let cl;
  if (p.lang === 'en') {
    const d = D[p.id]; if (!d) throw new Error('no decision for ' + p.id);
    const [status, shown, cite, pass2, extra = {}] = d;
    cl = { id: p.id, lang: 'en', field: p.field, shown, original: p.text };
    if (status !== 'unreachable') Object.assign(cl, Q[cite]);
    Object.assign(cl, { status, pass2 }, extra);
    if (status === 'unreachable') cl.checked = extra.attemptedAt;
    if (status === 'supported' && shown !== p.text) throw new Error('supported but changed ' + p.id);
  } else {
    const e = ES[p.id]; if (!e) throw new Error('no ES decision for ' + p.id);
    const en = byId[e[0]];
    cl = { id: p.id, lang: 'es', enId: e[0], field: p.field, shown: e[1], original: p.text };
    for (const k of ['statute', 'url', 'sourceKind', 'quote', 'snapshot', 'checked', 'status', 'attempts', 'attemptedAt', 'flagReason']) if (en[k] !== undefined) cl[k] = en[k];
    if (cl.status === 'supported' && cl.shown !== p.text) cl.status = 'corrected';
    cl.pass2 = cl.shown === '' ? 'removed with English claim' : (p.text === cl.shown ? 'ok: matches English claim' : 'ok: rewritten to match English claim, adds nothing');
  }
  byId[p.id] = cl; claims.push(cl);
}
// Added: surplus claim period (buyers need it; official quote in hand).
claims.splice(claims.findIndex((x) => x.id === 'surplus.1') + 1, 0, { id: 'surplus.2', lang: 'en', field: 'surplus', shown: 'The claim must be filed within six months of the sale.', original: null, added: true, ...Q.q480c, status: 'corrected', pass2: 'ok' });
const ledger = {
  state: 'AK', auditedAt: '2026-10-27', spec: 'foundry/aurigen-law-audit.md',
  codeAccess: 'Alaska Statutes from the Alaska State Legislature BASIS print view (akleg.gov), the legislature\'s own statutes site.',
  countySources: { 'Municipality of Anchorage': { url: A.url, title: 'Municipality of Anchorage, Real Estate Department: Foreclosed Properties', checked: A.checked } },
  claims,
};
fs.writeFileSync(R + '/cloudflare/data/law/ak.json', JSON.stringify(ledger, null, 1) + '\n');
console.log('claims', claims.length);
