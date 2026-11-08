// Does the county text on a built state page read like English?
//
// Written on 2026-11-08 after the Florida page shipped a county drawer that said
// "Redemption: 2 years from April 1 of issuance year" - the exact wording the Florida audit
// had found wrong - directly under the audited answer, plus "Interest / penalty: VERIFY" on
// 21 Maryland counties, "Sale Date2026" as a label, and two different auction platforms on
// one card. None of it was caught, because the layout checks measured overlap and sideways
// scroll and never read the words.
//
// This reads the words. It takes the built HTML of a state page, pulls the county JSON out of
// it, and walks every key and every value. It is used twice: by scripts/build-site.mjs, where
// a problem stops the build and so stops the deploy, and by the standing tests in
// under-review/test/county-text.test.mjs.
//
// It only ever reports. Nothing here edits a page or a value.

// The label rule in src/app.js, kept in step with it. A key with no entry falls through to the
// generic rule, and checkLabels() below proves the result of that rule is readable.
export const LABEL = {
  url: 'Website', saleUrl: 'Website', otcUrl: 'Website', registryUrl: 'Registry',
  platform: 'Platform', note: 'Note', otcNote: 'Note', delinquencyNote: 'Note',
  statute: 'Statute', name: 'Name', fee: 'Fee', assignmentFee: 'Assignment fee',
  rate: 'Interest / penalty', period: 'Redemption period', premium: 'Premium',
  available: 'Available', availableWhen: 'Available', process: 'How it works',
  method: 'Bidding method', bidMethod: 'Bidding method', minBid: 'Minimum bid',
  frequency: 'How often', saleFrequency: 'How often', trigger: 'Applies when',
  saleMonth: 'Sale month', saleWindow: 'Sale window', saleDate: 'Sale date',
  saleDate2026: '2026 sale date', taxSaleDate2026: '2026 tax sale',
  resaleDate2026: '2026 resale', certIssuanceDate: 'Certificate issued',
  auction: 'Auction', deedAuction: 'Tax deed sale', otc: 'Over the counter',
  municipalities: 'Municipalities', saleAdministrator: 'Run by',
  countyClerk: 'County clerk', taxCodeAuth: 'Tax code',
  titleRecording: 'Title recording', transferTax: 'Transfer tax',
  surplusMCC: 'Surplus funds', subTax: 'Subsequent taxes',
  scavenger: 'Scavenger sale', payment: 'Payment', redemption: 'Redemption',
};
const ACRO = { otc: 'OTC', mcc: 'MCC', url: 'URL', llc: 'LLC' };

export function human(k) {
  if (LABEL[k]) return LABEL[k];
  return String(k)
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Za-z])([0-9])/g, '$1 $2')
    .split(' ')
    .map((w, i) => ACRO[w.toLowerCase()] || (i ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ');
}

// Each test gets a plain-words name, because the failure is read by whoever broke the build.
const VALUE_TESTS = [
  ['a character the browser could not decode', /�/],
  ['UTF-8 read as Latin-1 (mojibake)', /Ã[\u0080-¿]|Â[ -¿]|â\u0080[\u0098-\u009D]/],
  ['an HTML entity shown as text instead of the character', /&(amp|lt|gt|quot|apos|nbsp|#\d{2,};|#x[0-9a-f]{2,};)/i],
  ['an HTML tag shown as text', /<\/?(br|p|div|span|b|i|a|li|ul|script)\b|<\/\w/i],
  ['the two characters backslash-n (or -t, -r, -u) instead of a line break', /\\[ntru]/],
  // A bracketed or colon-tagged marker is a note to ourselves. Prose that says a date is not
  // set yet ("fall 2026 (date TBD)") is a real answer to a visitor's question, so the test
  // looks for the marker form, not the word.
  ['a note to ourselves left in the data', /(^|\s)[[(](VERIFY|TBD|TODO|FIXME|CHECK|NEEDS? \w+)[\])]|(^|\s)(TODO|FIXME|XXX)\s*:/i],
  ['a value that is only a placeholder', /^\s*(VERIFY|TBD|TODO|FIXME|N\/?A|NULL|UNKNOWN|\?+|X{2,})\s*$/i],
  ['a programming mistake printed as text', /\b(undefined|NaN|\[object Object\])\b/],
  ['an invisible character that splits a word', /[­​‌‍﻿]/],
  ['a run of blank space inside a sentence', /\S {2,}\S/],
  ['space at the start or end', /^\s|\s$/],
  ['a word broken by a stray hyphen', /[a-z]- [a-z]/],
];

function flatten(value, path, out) {
  if (value == null) return;
  if (typeof value === 'string') { out.push([path, value]); return; }
  if (Array.isArray(value)) { value.forEach((v, i) => flatten(v, `${path}[${i}]`, out)); return; }
  if (typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) flatten(v, path ? `${path}.${k}` : k, out);
  }
}

function keysOf(value, out) {
  if (!value || typeof value !== 'object') return;
  if (Array.isArray(value)) { value.forEach((v) => keysOf(v, out)); return; }
  for (const [k, v] of Object.entries(value)) { out.add(k); keysOf(v, out); }
}

/** Pull the county JSON out of a built state page. Returns null when the page has none. */
export function countyDataOf(html) {
  const m = String(html).match(/<script type="application\/json" id="countyData">([\s\S]*?)<\/script>/);
  if (!m) return null;
  // build-site.mjs writes "<" as < so the JSON cannot close the script tag early.
  return JSON.parse(m[1]);
}

/**
 * Every problem the county text on one page would show a visitor.
 * @param {string} html  the built state page
 * @param {string} where how to name the page in a message, e.g. "/state/fl/"
 * @param {{pending?: boolean}} [opts] pending: Platbook has not read this state's source yet
 * @returns {string[]} one plain-words line per problem, empty when the page is clean
 */
export function countyTextProblems(html, where, opts = {}) {
  const problems = [];
  const data = countyDataOf(html);
  if (data == null) return problems;
  if (!Array.isArray(data)) return [`${where}: the county data is not a list`];

  // 1. No county states a redemption period or an interest rate. Those are state rules, and a
  //    county copy of them went stale the moment the audit corrected the state's own answer.
  for (const key of ['"r":', '"x":']) {
    if (JSON.stringify(data).includes(key)) {
      problems.push(`${where}: the county data still carries ${key} - a redemption period or interest rate on a county, which contradicts the audited state rule on the same page`);
    }
  }

  const LEGAL_KEY = /^(rate|redemption|period|premium|statute|method|bidMethod|minBid|fee|assignmentFee|transferTax|taxCodeAuth)$/;

  for (const c of data) {
    const name = c && c.n ? String(c.n) : '(unnamed)';

    // 2. A pending state's page says in bold that nothing on it states that state's law.
    if (opts.pending) {
      const keys = new Set();
      keysOf(c.e, keys);
      for (const k of keys) {
        if (LEGAL_KEY.test(k)) problems.push(`${where}: ${name} states the law through "${k}", on a page that promises it states none`);
      }
    }

    // 3. Every label a visitor will see has to be a readable phrase.
    const keys = new Set();
    keysOf(c.e, keys);
    for (const k of keys) {
      const label = human(k);
      if (/[a-z][A-Z]|[A-Z]{2,}[a-z]/.test(label)) problems.push(`${where}: ${name} would show the label "${label}" with two words run together (key "${k}")`);
      if (/[A-Za-z][0-9]/.test(label)) problems.push(`${where}: ${name} would show the label "${label}" with a number run into a word (key "${k}")`);
      if (/[^A-Za-z0-9 /()'.-]/.test(label)) problems.push(`${where}: ${name} would show the label "${label}", which is not a phrase (key "${k}")`);
    }

    // 4. Every value a visitor will read.
    const vals = [];
    flatten({ name: c.n, kind: c.k, saleType: c.tl, platform: c.p, notes: c.no, researchDated: c.v, countySource: c.cs, extra: c.e }, '', vals);
    for (const [path, v] of vals) {
      if (path === 'countySource.u' || path.endsWith('url') || path.endsWith('Url') || /^https?:\/\//.test(v)) continue;
      for (const [label, re] of VALUE_TESTS) {
        if (re.test(v)) problems.push(`${where}: ${name} - ${label} - ${path} reads "${v.slice(0, 70)}"`);
      }
    }
  }
  return problems;
}
