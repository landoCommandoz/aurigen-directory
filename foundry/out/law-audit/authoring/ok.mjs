import { build, snapOf } from './lib.mjs';
const DEL = { ...snapOf('ok', 'oktaxrolls-delaware'), sourceKind: 'county' };
const OKC = { ...snapOf('ok', 'okcounty-important-dates'), sourceKind: 'county', statute: 'none: administrative practice (Oklahoma County Treasurer calendar)' };
const Q = {
  cert: { ...DEL, statute: '68 O.S. § 3105 (as described by Delaware County Treasurer)', quote: 'New legislation has been passed amending 68 O.S. Section 3105. The amendment eliminated the October Certificate Lien Sale (Certificate Sale). All liens for delinquent properties will be held by the county.' },
  old: { ...DEL, statute: '68 O.S. § 3105 (as described by Delaware County Treasurer)', quote: 'Tax certificates issued prior to this legislation will remain active and are subject to the law that was in effect at the time the certificate was purchased.' },
  resale: { ...DEL, statute: '68 O.S. §§ 3125-3131 (as described by Delaware County Treasurer)', quote: 'The tax resale is held each year on the second Monday of June in the County Treasurer\'s office between 9 a.m. and 4 p.m. This property is auctioned off to the highest bidder. Bid begins with the amount of all delinquent taxes, penalties, fees and costs.' },
  three: { ...DEL, statute: '68 O.S. § 3105 (as described by Delaware County Treasurer)', quote: 'Properties which remain delinquent and unpaid for 3 years or more will now be governed by resale statutes.' },
  comm: { ...DEL, statute: '68 O.S. § 3135 (as described by Delaware County Treasurer)', quote: 'The County Treasurer may sell property deeded to the county after a Tax Resale upon receiving a bid on that property. The sale is subject to approval by the Board of County Commissioners' },
  okc: { ...OKC, quote: 'Second Monday in June Tax Resale' },
};
const U = { attempts: ['https://www.oklegislature.gov/cf_pdf/2021-22%20ENR/SB/SB181%20ENR.PDF'], statute: '68 O.S. §§ 3101-3135', attemptedAt: '2026-10-27' };
const UR = 'unreachable: OSCN (official Oklahoma Statutes) serves a Cloudflare Turnstile CAPTCHA; oklegislature.gov bill PDFs are disallowed by robots.txt; statute text not read';
const OK = 'ok';
const RM = 'removed: no official source (opinion, inventory or money wording)';
const FR = 'Delaware County Treasurer says an amendment to 68 O.S. § 3105 ended the October certificate sale; the statute text and act could not be reached (OSCN CAPTCHA, oklegislature.gov robots.txt), so statewide scope and start date are unconfirmed';
const F = (shown, cite, note) => ['flagged', shown, cite, 'flagged: ' + note, { flagReason: FR }];
const D = {
  'type': F('Tax resale (deed) after county-held lien', 'three', 'was "Hybrid (lien then deed)"; county page says liens are now held by the county'),
  'rate': ['unreachable', '8%', null, UR + '; rate applies to certificates sold before the amendment (county page)', U],
  'rateNote': F('Certificates issued before the amendment stay under the old law', 'old', 'was "County auctions property — no post-sale redemption"'),
  'redemption': ['unreachable', '2 years', null, UR, U],
  'bidMethod': F('Highest bidder at the June resale', 'resale', 'trimmed to resale'),
  'statute': ['unreachable', '68 O.S. §3101', null, UR, U],
  'auctionPlatform': F("County treasurer's office", 'resale', 'was "County-run — in-person"'),
  'auctionTiming': F('Second Monday of June (resale)', 'resale', 'was "June (most counties)"'),
  'summary.1': F('Delaware County reports that an amendment to 68 O.S. § 3105 ended the October certificate sale; the county now holds the liens.', 'cert', 'was "Oklahoma holds October tax lien auction followed by June resale and Commissioner\'s sale."'),
  'summary.2': F('', 'cert', 'removed: OTC on the first Monday of October conflicts with the reported end of the certificate sale'),
  'summary.3': ['corrected', '', 'resale', RM],
  'summary.4': ['unreachable', 'Statute: OS Title 68 §3101.', null, UR, U],
  'typeWhy.1': F('Property delinquent 3 years or more now goes to the June tax resale, per the Delaware County Treasurer.', 'three', 'was October certificate auction'),
  'typeWhy.2': ['unreachable', 'The owner retains title during the 2-year redemption period.', null, UR, U],
  'typeWhy.3': ['unreachable', 'OS Title 68 §3101.', null, UR, U],
  'rateWhy.1': ['unreachable', 'Oklahoma law set a rate of 8% per year on tax sale certificates.', null, UR + '; removed comparison "one of the lowest"', U],
  'rateWhy.2': ['unreachable', 'OS Title 68 §3101.', null, UR, U],
  'keyNotes.1': ['corrected', '', 'resale', 'removed: "no post-sale redemption, immediate title" not in any fetched source'],
  'keyNotes.2': ['corrected', 'Annual tax resale on the second Monday of June', 'resale', OK],
  'keyNotes.3': ['corrected', '', 'resale', RM],
  'beginnerTip.1': ['corrected', '', 'resale', RM],
  'beginnerTip.2': F('', 'cert', 'removed: OTC October purchase conflicts with reported end of the certificate sale; money opinion'),
  'risks.1': ['corrected', '', 'resale', RM + ' ("return")'],
  'risks.2': ['unreachable', '2-year redemption before deed proceedings', null, UR, U],
  'risks.3': ['corrected', '', 'resale', RM],
  'ddExtra.1': ['corrected', '', 'resale', RM],
  'ddExtra.2': ['corrected', '', 'resale', RM],
  'ddExtra.3': F('Confirm with the county treasurer whether any certificate sale is still held', 'cert', 'was "it\'s the first Monday of October"'),
  'signup.platform': ['corrected', 'County treasurer', 'resale', 'removed "Oklahoma County uses online system" (not in source)'],
  'signup.steps.1': ['corrected', 'Contact your target county treasurer', 'resale', 'removed ok.gov/treasurer link'],
  'signup.steps.2': ['corrected', 'Oklahoma County lists its tax resale on the second Monday in June', 'okc', 'was online registration claim'],
  'signup.steps.3': F('', 'cert', 'removed: October auction registration'),
  'signup.steps.4': F('', 'cert', 'removed: October OTC purchase'),
  'signup.deposit.1': ['supported', 'Varies by county.', 'resale', OK],
  'otc.available': F('Unconfirmed', 'cert', 'was "Available"'),
  'otc.note.1': F("After a resale, the treasurer may sell county-deeded property on a bid, subject to the county commissioners' approval (Delaware County).", 'comm', 'was October OTC at 8%'),
  'platforms.1': ['supported', 'County treasurer offices', 'resale', OK],
  'surplus.1': ['unreachable', 'Status pending — monitoring for legislative action.', null, UR + '; surplus rule not read', U],
};
const ES = {
  'es.rate': ['rate', '8%'],
  'es.redemption': ['redemption', '2 años'],
  'es.summary.1': ['summary.1', 'El condado de Delaware informa que una enmienda a 68 O.S. § 3105 eliminó la venta de certificados de octubre; el condado ahora conserva los gravámenes.'],
  'es.summary.2': ['summary.2', ''],
  'es.summary.3': ['summary.3', ''],
  'es.summary.4': ['summary.4', 'Estatuto: OS Título 68 §3101.'],
  'es.typeWhy.1': ['typeWhy.1', 'La propiedad con 3 años o más de mora ahora va a la reventa fiscal de junio, según el Tesorero del condado de Delaware.'],
  'es.rateWhy.1': ['rateWhy.1', 'La ley de Oklahoma fijó una tasa del 8% anual en los certificados de venta fiscal.'],
  'es.beginnerTip.1': ['beginnerTip.1', ''],
  'es.beginnerTip.2': ['beginnerTip.2', ''],
  'es.risks.1': ['risks.1', ''],
  'es.risks.2': ['risks.2', 'Redención de 2 años antes de los procedimientos de escritura'],
  'es.risks.3': ['risks.3', ''],
  'es.ddExtra.1': ['ddExtra.1', ''],
  'es.ddExtra.2': ['ddExtra.2', ''],
  'es.ddExtra.3': ['ddExtra.3', 'Confirme con el tesorero del condado si aún se realiza alguna venta de certificados'],
  'es.signup.platform': ['signup.platform', 'Tesorero del condado'],
  'es.signup.steps.1': ['signup.steps.1', 'Contacte al tesorero de su condado objetivo'],
  'es.signup.steps.2': ['signup.steps.2', 'El Condado Oklahoma fija su reventa fiscal el segundo lunes de junio'],
  'es.signup.steps.3': ['signup.steps.3', ''],
  'es.signup.steps.4': ['signup.steps.4', ''],
  'es.signup.deposit.1': ['signup.deposit.1', 'Varía por condado.'],
  'es.otc.note.1': ['otc.note.1', 'Tras una reventa, el tesorero puede vender propiedad escriturada al condado ante una oferta, sujeto a aprobación de los comisionados del condado (condado de Delaware).'],
};
build('ok', Q, D, ES, [], {
  codeAccess: 'The official Oklahoma Statutes are published on OSCN (oscn.net, Oklahoma Supreme Court), which the Legislature links to; OSCN served a Cloudflare Turnstile CAPTCHA to the runner, so it was not used (spec rule 7). Enacted-bill PDFs on oklegislature.gov/cf_pdf are disallowed by robots.txt; sai.ok.gov forms are too. Claims cite the Delaware County Treasurer (oktaxrolls.com, the county treasurer\'s site hosted by TM Consulting) and the Oklahoma County Treasurer for county details; statute claims are unreachable.',
  countySources: {
    'Delaware': { url: 'https://oktaxrolls.com/county/Delaware', title: 'Delaware County Treasurer: resale, commissioner\'s sale and certificate sale notes', checked: '2026-10-27' },
    'Oklahoma': { url: 'https://docs.oklahomacounty.org/treasurer/ImportantDates.asp', title: "Oklahoma County Treasurer's Important Dates", checked: '2026-10-27' },
  },
});
