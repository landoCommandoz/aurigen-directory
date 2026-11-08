// Standing test: the county text on every built state page reads like English.
//
// Added 2026-11-08, after the live Florida page showed, in every one of its 67 county cards,
// a redemption period and an interest rate the Florida audit had already found wrong, sitting
// directly under the corrected answer. Twenty-one Maryland counties showed "VERIFY" as their
// interest rate. Labels read "Sale Date2026" and "Url". The layout checks passed throughout,
// because they measured overlap and sideways scroll and never read the words.
//
// Two halves, and both matter:
//   1. the real pages, built from the real data, are clean
//   2. the checker still fails on text that is broken - a check that cannot fail is not a check
//
// Run with: node --test under-review/test/
// scripts/build-site.mjs runs the same checker, so a failure also stops a deploy.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { countyTextProblems, countyDataOf, human } from '../../cloudflare/scripts/county-text.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(here, '..', '..', 'cloudflare', 'public', 'state');

const pages = fs.existsSync(PUBLIC)
  ? fs.readdirSync(PUBLIC).filter((d) => fs.existsSync(path.join(PUBLIC, d, 'index.html')))
  : [];

// ---------- 1. the real pages ----------

test('the site has been built, so there is something to check', () => {
  assert.ok(pages.length >= 51, `expected 51 state pages in cloudflare/public/state, found ${pages.length}. Run: node cloudflare/scripts/build-site.mjs`);
});

for (const code of pages) {
  test(`/state/${code}/ county text reads like English`, () => {
    const html = fs.readFileSync(path.join(PUBLIC, code, 'index.html'), 'utf8');
    const problems = countyTextProblems(html, `/state/${code}/`);
    assert.deepEqual(problems, [], `\n${problems.map((p) => '  - ' + p).join('\n')}\n`);
  });
}

test('no county anywhere states a redemption period or an interest rate', () => {
  // Those are state rules. A county copy of one goes stale the moment the audit corrects the
  // state's answer, and then the page gives two answers to the same question.
  const offenders = [];
  for (const code of pages) {
    const data = countyDataOf(fs.readFileSync(path.join(PUBLIC, code, 'index.html'), 'utf8'));
    for (const c of data || []) if (c.r != null || c.x != null) offenders.push(`${code}/${c.n}`);
  }
  assert.deepEqual(offenders, []);
});

// ---------- 2. the checker can still fail ----------

const page = (counties) => `<html><body><script type="application/json" id="countyData">${JSON.stringify(counties).replace(/</g, '\\u003c')}</script></body></html>`;
const clean = { n: 'Martin', k: 'county', t: 'hybrid', tl: 'Hybrid', p: 'LienHub', u: 'https://lienhub.com/county/martin', no: [], v: '', e: { auction: { platform: 'LienHub', url: 'https://lienhub.com/county/martin' } }, cs: null };

test('a clean county raises nothing', () => {
  assert.deepEqual(countyTextProblems(page([clean]), '/state/fl/'), []);
});

const broken = [
  ['a county-level redemption period', { ...clean, r: '2 years from April 1 of issuance year' }, /redemption period or interest rate/],
  ['a county-level interest rate', { ...clean, x: '18% per year' }, /redemption period or interest rate/],
  ['a placeholder as a value', { ...clean, e: { rate: 'VERIFY' } }, /only a placeholder/],
  ['a marker left in a note', { ...clean, no: ['[VERIFY] domain'] }, /note to ourselves/],
  ['an undecodable character', { ...clean, no: ['Fla. Stat. \uFFFD197.472'] }, /could not decode/],
  ['UTF-8 read as Latin-1', { ...clean, no: ['Fla. Stat. \u00C2\u00A7197.472'] }, /mojibake/],
  ['an HTML entity shown as text', { ...clean, no: ['Taxes &amp; fees'] }, /entity shown as text/],
  ['an HTML tag shown as text', { ...clean, no: ['First line<br>second line'] }, /tag shown as text/],
  ['backslash-n instead of a line break', { ...clean, no: ['First line\\nsecond line'] }, /backslash-n/],
  ['an invisible character inside a word', { ...clean, no: ['coun\u200Bty'] }, /splits a word/],
  ['two spaces mid-sentence', { ...clean, no: ['Sale is  in June'] }, /run of blank space/],
  ['space on the end', { ...clean, no: ['Sale is in June '] }, /start or end/],
  ['undefined printed as text', { ...clean, no: ['Platform: undefined'] }, /programming mistake/],
  ['a label with an initialism glued to a word', { ...clean, e: { URLName: 'x' } }, /run together/],
  ['a label that is not a phrase at all', { ...clean, e: { sale_date_2026: 'June' } }, /not a phrase/],
];

for (const [what, county, expect] of broken) {
  test(`the checker still catches: ${what}`, () => {
    const problems = countyTextProblems(page([county]), '/state/fl/');
    assert.ok(problems.length > 0, `expected a problem for ${what}, got none`);
    assert.ok(problems.some((p) => expect.test(p)), `expected ${expect} in:\n${problems.join('\n')}`);
  });
}

test('a pending state may not state the law through a county', () => {
  const nassau = { n: 'Nassau', k: 'county', p: 'None', u: '', no: [], v: '', e: { method: 'In-rem deed foreclosure' }, cs: null };
  assert.deepEqual(countyTextProblems(page([nassau]), '/state/ny/', { pending: false }), []);
  const problems = countyTextProblems(page([nassau]), '/state/ny/', { pending: true });
  assert.ok(problems.some((p) => /promises it states none/.test(p)), problems.join('\n'));
});

// ---------- 3. labels ----------

test('labels a visitor reads are phrases, not data keys', () => {
  assert.equal(human('url'), 'Website');
  assert.equal(human('deedAuction'), 'Tax deed sale');
  assert.equal(human('saleDate2026'), '2026 sale date');
  assert.equal(human('otc'), 'Over the counter');
  // and an unlisted key still comes out readable
  assert.equal(human('taxSaleDate2027'), 'Tax Sale Date 2027');
  assert.equal(human('someOtcThing'), 'Some OTC Thing');
});
