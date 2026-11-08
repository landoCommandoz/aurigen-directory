// Run with: node --test under-review/test
// Uses the real sheet.json and the real worker code. Polar's answer is replaced by a stand-in function only where a
// real purchased key would be needed (there is none yet); the invalid-key check against Polar is in live.test.mjs.
import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../worker.js';
import SHEET from '../sheet.json' with { type: 'json' };
import CONFIG from '../sheet-config.json' with { type: 'json' };
import LISTING from '../sheet-listing.json' with { type: 'json' };
import { checkKey, csv, csvCell, stateHtml, handleSheet, homeFooterLink } from '../sheet.js';

const ORIGIN = 'https://aurigen.example';
const get = (p) => worker.fetch(new Request(ORIGIN + p), {});
const post = (p, key, fetchFn) => handleSheet(new Request(ORIGIN + p, { method: 'POST', body: new URLSearchParams({ key }) }), {}, fetchFn, CFG);
const BANNED = /\b(earn\w*|guarantee\w*|profit\w*|returns?|returned|returning)\b/i;

// A Polar stand-in used only for the paths that need a paid key. It records what the worker sent.
const sent = [];
const polarOk = async (url, init) => { sent.push(JSON.parse(init.body)); return new Response(JSON.stringify({ status: 'granted', benefit_id: CFG.benefitId, expires_at: null }), { status: 200 }); };
const polarNo = async () => new Response(JSON.stringify({ error: 'ResourceNotFound' }), { status: 404 });
const polarDown = async () => new Response('bad gateway', { status: 502 });
// Test configuration with made-up ids, so the paid paths are exercised before the real Polar product exists.
const CFG = { ...CONFIG, orgId: CONFIG.orgId, benefitId: '11111111-2222-4333-8444-555555555555' };
const configured = true;

test('sheet data: states, rows and flags add up', () => {
  assert.equal(SHEET.stateCount, SHEET.states.length);
  assert.equal(SHEET.checked + SHEET.withGaps, SHEET.stateCount);
  assert.equal(SHEET.rows, SHEET.states.reduce((n, s) => n + s.groups.reduce((m, g) => m + g.rows.length, 0), 0));
  for (const s of SHEET.states) {
    assert.ok(['checked', 'checked with gaps'].includes(s.status), s.code);
    if (s.status === 'checked with gaps') assert.ok(s.gaps.length, `${s.code} has no listed gap`);
    for (const g of s.groups) for (const r of g.rows) {
      assert.match(r.src.url, /^https?:\/\//);
      assert.ok(r.src.statute && r.src.checked && r.src.quote, `${s.code} row missing a source line`);
    }
  }
});

test('no held text, no banned money words, no em dashes in the sheet text', () => {
  const own = [];
  (function walk(v, key) { if (typeof v === 'string') { if (key !== 'quote') own.push(v); } else if (Array.isArray(v)) v.forEach((x) => walk(x, key)); else if (v && typeof v === 'object') for (const k of Object.keys(v)) walk(v[k], k); })(SHEET);
  assert.doesNotMatch(own.join('\n'), BANNED);
  assert.doesNotMatch(JSON.stringify(SHEET), /heldText|holdReason|"hold"/);
  assert.doesNotMatch(own.join('\n'), /[—–]/);
  assert.ok(!SHEET.states.some((s) => s.code === 'OK'), 'Oklahoma (withheld claims) must not be sold');
});

test('landing page: unlisted means noindex and no link, and only the free sample is on it', async () => {
  const r = await get('/rules-sheet/');
  const body = await r.text();
  assert.equal(r.status, 200);
  assert.equal(LISTING.listed, false);
  assert.match(r.headers.get('x-robots-tag'), /noindex/);
  assert.match(body, /<meta name="robots" content="noindex">/);
  const home = await (await get('/')).text();
  assert.doesNotMatch(home, /rules-sheet/i, 'the under-review page must not link to the sheet while unlisted');
  const sample = SHEET.states.filter((s) => s.status === 'checked').slice(0, 2).map((s) => s.name);
  const other = SHEET.states.find((s) => s.status === 'checked with gaps');
  const otherRow = other.groups[0].rows[0].text;
  assert.ok(sample.every((n) => body.includes(n)));
  assert.ok(!body.includes(`id="s-${other.code}"`), 'a paid state is in the free page');
  assert.ok(!body.includes(esc(otherRow)) || sample.some((n) => SHEET.states.find((s) => s.name === n).groups.some((g) => g.rows.some((x) => x.text === otherRow))));
  assert.match(body, /Not legal or financial advice\. Rules change\. Confirm with the county before you bid\./);
  assert.doesNotMatch(body.replace(/<q>[^<]*<\/q>/g, ''), BANNED);
  assert.doesNotMatch(body, /[—–]/);
  assert.match(r.headers.get('content-security-policy'), /default-src 'none'/);
});
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

test('the under-review page and status.json still work', async () => {
  const home = await get('/');
  assert.equal(home.status, 503);
  assert.match(await home.text(), /re-checked against current law/);
  const st = await get('/status.json');
  assert.equal(st.status, 200);
  assert.ok(Array.isArray((await st.json()).lines));
  assert.equal((await get('/anything-else')).status, 503);
});

test('keys: bad format never reaches Polar; wrong key, Polar down and no config are handled', async () => {
  let calls = 0;
  const spy = async () => { calls++; return polarNo(); };
  assert.equal(await checkKey('short', {}, spy, CFG), configured ? 'invalid' : 'not_configured');
  assert.equal(calls, 0);
  assert.equal(await checkKey('AURSHEET-' + 'x'.repeat(200), {}, spy, CFG), configured ? 'invalid' : 'not_configured');
  assert.equal(calls, 0);
  if (!configured) return;
  assert.equal(await checkKey('AURSHEET-1234-5678', {}, polarNo, CFG), 'invalid');
  assert.equal(await checkKey('AURSHEET-1234-5678', {}, polarDown, CFG), 'unavailable');
  assert.equal(await checkKey('AURSHEET-1234-5678', {}, async () => { throw new Error('network'); }, CFG), 'unavailable');
  const expired = async () => new Response(JSON.stringify({ status: 'granted', benefit_id: CFG.benefitId, expires_at: '2020-01-01T00:00:00Z' }), { status: 200 });
  assert.equal(await checkKey('AURSHEET-1234-5678', {}, expired, CFG), 'invalid');
  const revoked = async () => new Response(JSON.stringify({ status: 'revoked', benefit_id: CFG.benefitId }), { status: 200 });
  assert.equal(await checkKey('AURSHEET-1234-5678', {}, revoked, CFG), 'invalid');
  const otherBenefit = async () => new Response(JSON.stringify({ status: 'granted', benefit_id: '00000000-0000-4000-8000-000000000000' }), { status: 200 });
  assert.equal(await checkKey('AURSHEET-1234-5678', {}, otherBenefit, CFG), 'invalid');
});

test('unlock and CSV: a bad key gets no data; a good key gets every state and the CSV', async () => {
  if (!configured) {
    const r = await post('/rules-sheet/unlock', 'AURSHEET-1234-5678', polarOk);
    assert.equal(r.status, 503);
    assert.doesNotMatch(await r.text(), /Key accepted/);
    return;
  }
  const bad = await post('/rules-sheet/unlock', 'AURSHEET-1234-5678', polarNo);
  const badBody = await bad.text();
  assert.equal(bad.status, 403);
  assert.doesNotMatch(badBody, /Key accepted/);
  const badCsv = await post('/rules-sheet/sheet.csv', 'AURSHEET-1234-5678', polarNo);
  assert.equal(badCsv.status, 403);
  assert.doesNotMatch(await badCsv.text(), /official_url/);
  const down = await post('/rules-sheet/unlock', 'AURSHEET-1234-5678', polarDown);
  assert.equal(down.status, 503);
  const ok = await post('/rules-sheet/unlock', 'AURSHEET-1234-5678', polarOk);
  const body = await ok.text();
  assert.equal(ok.status, 200);
  assert.match(body, /Key accepted/);
  for (const s of SHEET.states) assert.ok(body.includes(`id="s-${s.code}"`), `${s.code} missing from the full sheet`);
  assert.deepEqual(sent.at(-1), { key: 'AURSHEET-1234-5678', organization_id: CFG.orgId, benefit_id: CFG.benefitId });
  const c = await post('/rules-sheet/sheet.csv', 'AURSHEET-1234-5678', polarOk);
  assert.equal(c.status, 200);
  assert.match(c.headers.get('content-disposition'), /attachment/);
  assert.equal((await c.text()).split('\r\n').length - 1, SHEET.rows + 1);
});

test('csv escapes quotes and blocks spreadsheet formulas', () => {
  assert.equal(csvCell('=SUM(A1)'), "'=SUM(A1)");
  assert.equal(csvCell('+1'), "'+1");
  assert.equal(csvCell('@x'), "'@x");
  assert.equal(csvCell('-5'), "'-5");
  assert.equal(csvCell('say "hi", ok'), '"say ""hi"", ok"');
  assert.equal(csvCell('plain'), 'plain');
  assert.match(csv().split('\r\n')[0], /^state,audit_flag,group/);
});

test('output is HTML-escaped', () => {
  const evil = { code: 'ZZ', name: '<script>alert(1)</script>', status: 'checked with gaps', gaps: ['<img src=x onerror=alert(1)>'], notShown: 2, rows: 1, lastChecked: '2026-01-01', groups: [{ key: 'b', label: '<em>L</em>', rows: [{ label: '"><i>', text: '<u>x</u>', src: { statute: '<s>', url: 'javascript:alert(1)', checked: '2026-01-01', kind: 'k', quote: '</q><script>' } }] }] };
  const h = stateHtml(evil);
  for (const bad of ['<script', '<img', '<u>', '<i>', '<s>', '<em>', '</q><script']) assert.ok(!h.includes(bad), 'unescaped: ' + bad);
  assert.doesNotMatch(h, /href="javascript:/);
  assert.ok(h.includes('&lt;script&gt;'));
});

test('only GET on the page and POST on the actions; other paths 404; redirect keeps the slash', async () => {
  assert.equal((await handleSheet(new Request(ORIGIN + '/rules-sheet/unlock'), {}, polarNo, CFG)).status, 404);
  assert.equal((await handleSheet(new Request(ORIGIN + '/rules-sheet/nope'), {}, polarNo, CFG)).status, 404);
  const r = await handleSheet(new Request(ORIGIN + '/rules-sheet'), {}, polarNo, CFG);
  assert.equal(r.status, 301);
  assert.equal(await handleSheet(new Request(ORIGIN + '/other'), {}, polarNo, CFG), null);
});

test('with no Polar product configured, nobody can unlock anything', async () => {
  const none = { ...CONFIG, benefitId: null };
  const r = await handleSheet(new Request(ORIGIN + '/rules-sheet/unlock', { method: 'POST', body: new URLSearchParams({ key: 'AURSHEET-1234-5678' }) }), {}, polarOk, none);
  assert.equal(r.status, 503);
  assert.doesNotMatch(await r.text(), /Key accepted/);
});

test('the checkout button points at Polar when configured, and the thank-you note shows after checkout', async () => {
  const withLink = { ...CFG, checkoutUrl: 'https://buy.polar.sh/polar_cl_TEST' };
  const r = await handleSheet(new Request(ORIGIN + '/rules-sheet/?thanks=1'), {}, polarNo, withLink);
  const body = await r.text();
  assert.match(body, /href="https:\/\/buy\.polar\.sh\/polar_cl_TEST"/);
  assert.match(body, /Polar emails your license key/);
  const off = await (await handleSheet(new Request(ORIGIN + '/rules-sheet/'), {}, polarNo, { ...CFG, checkoutUrl: null })).text();
  assert.match(off, /The free checkout is not connected yet/);
  assert.doesNotMatch(off, /Polar emails your license key/);
  const bad = await (await handleSheet(new Request(ORIGIN + '/rules-sheet/'), {}, polarNo, { ...CFG, checkoutUrl: 'http://evil.example/x' })).text();
  assert.doesNotMatch(bad, /evil\.example/);
});

test('the two plain lines are on the landing page and the full sheet, and nothing promises a refund', async () => {
  const lines = ['This is information about state rules, not legal advice.', 'Confirm dates and rules with the county before you bid.'];
  const landing = await (await get('/rules-sheet/')).text();
  for (const l of lines) assert.ok(landing.includes(l), 'landing: ' + l);
  assert.match(landing, /Free, in exchange for an email address/);
  assert.match(landing, /nothing is charged, so there is nothing to refund/);
  assert.doesNotMatch(landing, /Refunds are given|paid once|$19/);
  const fullPage = await (await post('/rules-sheet/unlock', 'AURSHEET-1234-5678', polarOk)).text();
  for (const l of lines) assert.ok(fullPage.includes(l), 'full sheet: ' + l);
  assert.match(fullPage, /nothing is charged, so there is nothing to refund/);
  assert.doesNotMatch(fullPage, /Refunds are given|paid once|$19/);
});

test('publish: listing the sheet removes noindex and adds the home page link; unlisting puts both back', async () => {
  const on = { ...LISTING, listed: true };
  const off = { ...LISTING, listed: false };
  const pub = await handleSheet(new Request(ORIGIN + '/rules-sheet/'), {}, polarNo, CFG, on);
  assert.equal(pub.headers.get('x-robots-tag'), null);
  assert.doesNotMatch(await pub.text(), /name="robots"/);
  const hid = await handleSheet(new Request(ORIGIN + '/rules-sheet/'), {}, polarNo, CFG, off);
  assert.match(hid.headers.get('x-robots-tag'), /noindex/);
  assert.match(await hid.text(), /name="robots" content="noindex"/);
  assert.match(homeFooterLink(on), /href="\/rules-sheet\/"/);
  assert.equal(homeFooterLink(off), '');
  // the full sheet and the CSV stay noindex either way
  const full = await handleSheet(new Request(ORIGIN + '/rules-sheet/unlock', { method: 'POST', body: new URLSearchParams({ key: 'AURSHEET-1234-5678' }) }), {}, polarOk, CFG, on);
  assert.match(full.headers.get('x-robots-tag'), /noindex/);
});

// ---------- the security policy on the key page ----------
// Lando, 2026-11-08: leave the visitor counter off this page and keep every outside script
// blocked there. These tests are what stops that decision being undone by accident: the policy
// is one string in one place, and a careless edit to it is completely silent at runtime.
//
// Before that day the policy also blocked the page's own icon and its Google Fonts stylesheet,
// so the sheet rendered in fallback fonts with no icon. The fix allows exactly the two origins
// the rest of the site already uses, and data: for the inline icon.

const cspOf = async (path = '/rules-sheet/') =>
  (await handleSheet(new Request(ORIGIN + path), {}, polarNo, CFG)).headers.get('content-security-policy');

test('the key page refuses every outside script', async () => {
  const csp = await cspOf();
  assert.match(csp, /default-src 'none'/, 'the floor must be none');
  // No script-src and no connect-src, so both fall back to default-src 'none'. If either is
  // ever added, this test is the place to stop and think about what it lets in.
  assert.ok(!/script-src/.test(csp), "script-src must not be set: default-src 'none' is what blocks scripts");
  assert.ok(!/connect-src/.test(csp), 'connect-src must not be set');
  assert.ok(!/cloudflareinsights/.test(csp), 'the analytics beacon is deliberately not allowed on this page');
});

test('the key page is allowed its own fonts and its own icon, and nothing else', async () => {
  const csp = await cspOf();
  assert.match(csp, /style-src 'unsafe-inline' https:\/\/fonts\.googleapis\.com/);
  assert.match(csp, /font-src https:\/\/fonts\.gstatic\.com/);
  assert.match(csp, /img-src data:/);
  // No third origin crept in - the same two the rest of the site already uses, and no more.
  const origins = [...new Set([...csp.matchAll(/https:\/\/([a-z0-9.-]+)/g)].map((m) => m[1]))].sort();
  assert.deepEqual(origins, ['fonts.googleapis.com', 'fonts.gstatic.com']);
});

test('the page really asks for what the policy allows', async () => {
  // A policy that permits something the page never loads is a hole, not a fix.
  const body = await (await handleSheet(new Request(ORIGIN + '/rules-sheet/'), {}, polarNo, CFG)).text();
  assert.ok(body.includes('https://fonts.googleapis.com/css2'), 'the page should load the font stylesheet');
  assert.ok(body.includes('rel="icon" href="data:image/svg+xml'), 'the icon should be an inline data: image');
  assert.ok(!body.includes('<script'), 'this page carries no script of its own either');
});

test('the key form may only post back to this site', async () => {
  const csp = await cspOf();
  assert.match(csp, /form-action 'self'/);
  assert.match(csp, /frame-ancestors 'none'/);
  assert.match(csp, /base-uri 'none'/);
});

test('the policy is on the unlocked sheet too, not only the landing page', async () => {
  const res = await post('/rules-sheet/unlock', 'TEST-KEY', polarOk);
  assert.equal(res.status, 200);
  const csp = res.headers.get('content-security-policy');
  assert.match(csp, /default-src 'none'/);
  assert.ok(!/script-src/.test(csp));
  assert.match(csp, /font-src https:\/\/fonts\.gstatic\.com/);
});
