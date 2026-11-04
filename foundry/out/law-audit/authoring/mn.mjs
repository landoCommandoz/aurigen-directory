import { build, snapOf } from './lib.mjs';
const N = (slug, sec) => ({ ...snapOf('mn', slug), sourceKind: 'code', statute: 'Minn. Stat. § ' + sec });
const Q = {
  sale: { ...N('s28001', '280.01'), quote: 'On the second Monday in May, in each year, the county auditor shall sell all parcels of land against which judgment has been entered and remains unsatisfied for the taxes of the preceding year or years.' },
  bidin: { ...N('s28001', '280.01'), quote: 'The auditor shall bid in for the state for all such parcels of land the amount of all delinquent taxes, penalties, costs, and interest to date.' },
  appr: { ...N('s28201', '282.01'), quote: 'The sale must not be for less than the appraised value except as provided in subdivision 7a.' },
  repur: { ...N('s282241', '282.241 subd. 1'), quote: 'may repurchase any parcel of land claimed by the state to be forfeited to the state for taxes unless before the time repurchase is made the parcel is sold under installment payments, or otherwise, by the state as provided by law' },
  note: { ...N('s28208', '282.08 (Revisor\'s note)'), quote: 'The apportionment of sales proceeds under section 282.08, clause (4), in excess of the tax debt of the prior owner was found to be a taking in violation of the Takings Clause of the Fifth Amendment of the United States Constitution in Tyler v. Hennepin County, Minnesota, 598 U.S. 631 (2023).' },
};
const OK = 'ok';
const RM = 'removed: no official source (opinion, advice, county practice or figure not in the statute)';
const W = { correctionKind: 'wording' };
const CC = 'Confirm with the county.';
const NOTE = 'The Revisor\'s note to §282.08 states that apportioning sale proceeds under clause (4) in excess of the prior owner\'s tax debt was found to be a taking in Tyler v. Hennepin County (2023).';
const REP = 'The owner at the time of forfeiture, the owner\'s heirs or others with a right to pay taxes may repurchase forfeited land unless, before the repurchase, the state has sold the parcel, among other listed conditions (§282.241, subd. 1).';
const APP = 'Forfeited land must not be sold for less than the appraised value, except as provided in subdivision 7a (§282.01).';
const D = {
  'type': ['corrected', 'Sale of tax-delinquent parcels, with the state bidding in; then county sale of forfeited land', 'bidin', 'was "Tax deed"'],
  'rate': ['corrected', 'At the May sale the county auditor bids in for the state the delinquent taxes, penalties, costs and interest to date (§280.01)', 'bidin', 'was "N/A"'],
  'rateNote': ['corrected', APP, 'appr', 'was "State forfeiture system — not a retail lien purchase state"; opinion removed'],
  'redemption': ['corrected', REP, 'repur', 'was "None post-sale"; repurchase after forfeiture exists'],
  'bidMethod': ['corrected', APP, 'appr', 'was "N/A — forfeiture system, not public lien auction"'],
  'statute': ['corrected', 'MN Stat. §280.01; §282.01; §282.241', 'sale', 'was "MN Statutes Ch. 279–282"; sections actually cited', W],
  'auctionPlatform': ['corrected', 'County auditor (the May sale under §280.01). Forfeited-land sale method and platform: ' + CC, 'sale', 'was "County-run deed sales only after forfeiture"'],
  'auctionTiming': ['corrected', 'The second Monday in May each year (§280.01). Forfeited-land sale dates: ' + CC, 'sale', 'was "Varies by county"'],
  'summary.1': ['corrected', APP, 'appr', 'was "Minnesota sets minimum bids at assessed value — eliminating most discount opportunity."; "assessed value" corrected to "appraised value", opinion removed'],
  'summary.2': ['corrected', NOTE, 'note', 'was "Tyler v. Hennepin (2023) requires counties to return surplus bids to prior owners."; the statute says only what the Revisor\'s note says (see flagged surplus.1)'],
  'summary.3': ['corrected', '', 'sale', RM],
  'summary.4': ['corrected', 'Statute: MN Stat §280.01.', 'sale', 'unchanged text; kept', W],
  'typeWhy.1': ['corrected', REP, 'repur', 'was "Minnesota sells the property deed outright with no post-sale redemption."'],
  'typeWhy.2': ['corrected', NOTE, 'note', 'was "Per Tyler v. Hennepin (2023), surplus must be returned to former owners."'],
  'typeWhy.3': ['supported', 'MN Stat §280.01.', 'sale', OK],
  'rateWhy.1': ['corrected', '', 'sale', RM],
  'rateWhy.2': ['supported', 'MN Stat §280.01.', 'sale', OK],
  'keyNotes.1': ['corrected', 'At the May sale the county auditor bids in parcels for the state (§280.01).', 'bidin', 'was "Minnesota is a FORFEITURE state — the state takes title after 3 years, then counties sell deeds"; "3 years" not in the sections read'],
  'keyNotes.2': ['corrected', '', 'sale', RM],
  'keyNotes.3': ['corrected', '', 'sale', RM],
  'notBeginnerReason.1': ['corrected', '', 'sale', RM],
  'beginnerTip.1': ['corrected', '', 'sale', RM],
  'beginnerTip.2': ['corrected', '', 'sale', RM],
  'risks.1': ['corrected', '', 'appr', RM],
  'risks.2': ['corrected', '', 'note', RM],
  'risks.3': ['corrected', '', 'sale', RM],
  'ddExtra.1': ['corrected', '', 'sale', RM],
  'ddExtra.2': ['corrected', '', 'note', RM],
  'ddExtra.3': ['corrected', '', 'sale', RM],
  'signup.platform': ['corrected', 'County auditor. ' + CC, 'sale', 'was "County auditor (varies)"', W],
  'signup.steps.1': ['corrected', 'Contact the county auditor. ' + CC, 'sale', 'was "Contact your target county auditor — mn.gov/admin/government/counties"', W],
  'signup.steps.2': ['corrected', '', 'sale', RM],
  'signup.steps.3': ['corrected', 'Sale list and registration: ' + CC, 'sale', 'was "Request the upcoming sale list and registration instructions"', W],
  'signup.steps.4': ['corrected', '', 'sale', RM],
  'signup.deposit.1': ['corrected', CC, 'sale', 'was "Varies by county."', W],
  'otc.available': ['corrected', 'Not set by statute. ' + CC, 'sale', 'was "Not generally available"'],
  'otc.note.1': ['corrected', 'Not set by statute. ' + CC, 'sale', 'was "County land banks may offer direct purchase — contact county auditor."'],
  'platforms.1': ['corrected', 'County auditor', 'sale', 'was "County auditor offices"', W],
  'surplus.1': ['flagged', 'Whether a former owner can claim sale proceeds above the tax debt: ' + CC + ' The Revisor\'s note to §282.08 cites Tyler v. Hennepin County (2023).', 'note', 'flagged: Revisor note says §282.08(4) was found a taking, but the clause text is unchanged since 2012 and 2024 c 127 art 70 (which amended §282.241) was not read', { flagReason: 'The Revisor\'s note to §282.08 says the excess apportionment under clause (4) was found a taking (Tyler, 2023), yet the section text still reads as before (last history entry 2012). 2024 c 127 art 70 amended §282.241 and may have changed surplus handling; that act was not read, so the current rule is unconfirmed.' }],
};
const ES = {
  'es.rate': ['rate', 'En la venta de mayo, el auditor del condado adjudica al estado los impuestos morosos, multas, costos e intereses a la fecha (§280.01)'],
  'es.redemption': ['redemption', 'El dueño al momento de la pérdida del dominio, sus herederos u otros con derecho a pagar los impuestos pueden recomprar tierras confiscadas, salvo que antes de la recompra el estado haya vendido la parcela, entre otras condiciones enumeradas (§282.241, subd. 1).'],
  'es.summary.1': ['summary.1', 'Las tierras confiscadas no pueden venderse por menos del valor tasado, salvo lo dispuesto en la subdivisión 7a (§282.01).'],
  'es.summary.2': ['summary.2', 'La nota del Revisor al §282.08 indica que distribuir el producto de la venta bajo la cláusula (4) por encima de la deuda fiscal del dueño anterior fue considerado una expropiación en Tyler v. Hennepin County (2023).'],
  'es.summary.3': ['summary.3', ''],
  'es.summary.4': ['summary.4', 'Estatuto: MN Stat §280.01.'],
  'es.typeWhy.1': ['typeWhy.1', 'El dueño al momento de la pérdida del dominio, sus herederos u otros con derecho a pagar los impuestos pueden recomprar tierras confiscadas, salvo que antes de la recompra el estado haya vendido la parcela, entre otras condiciones enumeradas (§282.241, subd. 1).'],
  'es.typeWhy.2': ['typeWhy.2', 'La nota del Revisor al §282.08 indica que distribuir el producto de la venta bajo la cláusula (4) por encima de la deuda fiscal del dueño anterior fue considerado una expropiación en Tyler v. Hennepin County (2023).'],
  'es.rateWhy.1': ['rateWhy.1', ''],
  'es.notBeginnerReason.1': ['notBeginnerReason.1', ''],
  'es.beginnerTip.1': ['beginnerTip.1', ''],
  'es.beginnerTip.2': ['beginnerTip.2', ''],
  'es.risks.1': ['risks.1', ''],
  'es.risks.2': ['risks.2', ''],
  'es.risks.3': ['risks.3', ''],
  'es.ddExtra.1': ['ddExtra.1', ''],
  'es.ddExtra.2': ['ddExtra.2', ''],
  'es.ddExtra.3': ['ddExtra.3', ''],
  'es.signup.platform': ['signup.platform', 'Auditor del condado. Confirme con el condado.'],
  'es.signup.steps.1': ['signup.steps.1', 'Contacte al auditor del condado. Confirme con el condado.'],
  'es.signup.steps.2': ['signup.steps.2', ''],
  'es.signup.steps.3': ['signup.steps.3', 'Lista de venta y registro: Confirme con el condado.'],
  'es.signup.steps.4': ['signup.steps.4', ''],
  'es.signup.deposit.1': ['signup.deposit.1', 'Confirme con el condado.'],
  'es.otc.note.1': ['otc.note.1', 'No lo fija la ley. Confirme con el condado.'],
};
build('mn', Q, D, ES, [], {
  codeAccess: 'Minnesota Statutes sections 280.01, 282.01, 282.08 (with the Revisor\'s note) and 282.241 (2026 Statutes), from revisor.mn.gov (Office of the Revisor of Statutes). Sections 279.37, 281.17, 281.18, 281.23, 282.016 and 282.018 were also downloaded but are not cited.',
  countySources: {},
});
