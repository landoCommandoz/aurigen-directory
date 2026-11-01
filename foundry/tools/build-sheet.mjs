#!/usr/bin/env node
// Builds the data for the "Rules Sheet" product from the audited law ledgers.
//   node foundry/tools/build-sheet.mjs [--out under-review/sheet.json]
// Reads (from the branch it runs on): cloudflare/data/law/<st>.json, gaps.json, official-domains.json,
// foundry/out/law-audit/PROGRESS.json and the saved source copies named by each claim.
//
// Only a claim that passes ALL of these is included, everything else is left out and counted as "not shown":
//   status supported or corrected; not held; shown text not empty; has statute, official URL, check date and quote;
//   URL on an official domain; the quote is found word for word in the saved copy; the copy's date matches.
// Only states marked done in PROGRESS.json are included. Held claims never appear, not even as a count.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadSnapshot, quoteFound } from './law-text.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const LAW = path.join(ROOT, 'cloudflare', 'data', 'law');
const args = process.argv.slice(2);
const outPath = path.resolve(args.includes('--out') ? args[args.indexOf('--out') + 1] : path.join(ROOT, 'under-review', 'sheet.json'));

// Field groups in reading order. A claim id is the field name, or field.N for list and sentence pieces.
const GROUPS = [
  { key: 'basics', label: 'The basics', fields: [['type', 'Sale type'], ['rate', 'Interest or penalty'], ['rateNote', 'Rate note'], ['redemption', 'Redemption'], ['bidMethod', 'Bid method'], ['auctionPlatform', 'Where the sale is held'], ['auctionTiming', 'When'], ['statute', 'Main statute']] },
  { key: 'summary', label: 'In short', fields: [['summary', null]], list: true },
  { key: 'register', label: 'Registering and paying', fields: [['signup.platform', 'Registration'], ['signup.steps', null], ['signup.deposit', null]] },
  { key: 'otc', label: 'Buying after the sale (over the counter)', fields: [['otc.available', 'Available'], ['otc.note', null]] },
  { key: 'surplus', label: 'Money left after the sale', fields: [['surplus', null]] },
  { key: 'watch', label: 'Check before you bid', fields: [['keyNotes', null], ['risks', null], ['ddExtra', null]] },
];
const BANNED = /\b(earn\w*|guarantee\w*|profit\w*|returns?|returned|returning)\b/i;

const read = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const domains = Object.keys(read(path.join(LAW, 'official-domains.json')).domains);
const officialHost = (u) => { try { const h = new URL(u).hostname.toLowerCase(); return domains.some((d) => h === d || h.endsWith('.' + d)); } catch { return false; } };
const gaps = read(path.join(LAW, 'gaps.json'));
const progress = read(path.join(ROOT, 'foundry', 'out', 'law-audit', 'PROGRESS.json'));
const day = (s) => String(s || '').slice(0, 10);
const cleanText = (s) => String(s).replace(/[—–]/g, '-').replace(/\s+/g, ' ').trim();

function claimOk(c, why) {
  if (c.lang !== 'en') return false;
  if (!['supported', 'corrected'].includes(c.status) || c.hold) return false;
  if (!c.shown || !String(c.shown).trim()) return false;
  if (!c.statute || !c.url || !c.checked || !c.quote || !c.snapshot) { why.push(`${c.id}: missing citation field`); return false; }
  if (!officialHost(c.url)) { why.push(`${c.id}: URL not on an official domain`); return false; }
  if (BANNED.test(c.shown)) { why.push(`${c.id}: banned money word`); return false; }
  const snap = loadSnapshot(path.join(ROOT, c.snapshot));
  if (!snap.ok) { why.push(`${c.id}: snapshot ${snap.reason}`); return false; }
  if (day(c.checked) !== day(snap.meta.fetched_at)) { why.push(`${c.id}: check date differs from the saved copy`); return false; }
  if (!quoteFound(c.quote, snap.text)) { why.push(`${c.id}: quote not found in the saved copy`); return false; }
  return true;
}

const KIND = { code: 'state law', session_law: 'enacted act', agency: 'state agency page', county: 'county page' };
const states = [];
const problems = [];
const excluded = [];
let notShownTotal = 0;
for (const code of progress.order) {
  const ps = progress.states[code];
  const g = gaps.states[code];
  if (!ps || ps.status !== 'done' || !g || !['checked', 'checked with gaps'].includes(g.checkStatus)) continue;
  const L = read(path.join(LAW, `${code.toLowerCase()}.json`));
  const why = [];
  const ok = new Map();
  let notShown = 0;
  for (const c of L.claims) {
    if (c.lang !== 'en') continue;
    if (claimOk(c, why)) ok.set(c.id, c); else if (!c.hold && c.status !== 'unreachable' && c.status !== 'flagged' && c.shown) notShown++; else if (c.status === 'flagged' || c.status === 'unreachable') notShown++;
  }
  if (why.length) problems.push(...why.map((w) => `${code} ${w}`));
  const pick = (field) => [...ok.values()].filter((c) => c.field === field || c.id === field);
  const groups = [];
  for (const grp of GROUPS) {
    const rows = [];
    for (const [field, label] of grp.fields) {
      const cs = pick(field);
      for (const c of cs) {
        rows.push({ label: label || null, text: cleanText(c.shown), src: { statute: c.statute, url: c.url, checked: day(c.checked), kind: KIND[c.sourceKind] || c.sourceKind, quote: cleanText(c.quote) } });
      }
    }
    if (rows.length) groups.push({ key: grp.key, label: grp.label, rows });
  }
  const rowCount = groups.reduce((n, x) => n + x.rows.length, 0);
  // A state needs its sale type and its redemption rule confirmed, or buyers would pay for a near-empty entry.
  const basics = (groups.find((x) => x.key === 'basics') || { rows: [] }).rows.map((r) => r.label);
  if (!basics.includes('Sale type') || !basics.includes('Redemption')) { excluded.push(code); continue; }
  const checkedDates = groups.flatMap((x) => x.rows.map((r) => r.src.checked)).sort();
  states.push({
    code,
    name: L.stateName || null,
    status: g.checkStatus,
    gaps: (g.gaps || []).filter((x) => !x.closed).map((x) => cleanText(x.text).replace(/\breturned\b/gi, 'answered with')),
    notShown,
    rows: rowCount,
    firstChecked: checkedDates[0],
    lastChecked: checkedDates[checkedDates.length - 1],
    groups,
  });
  notShownTotal += notShown;
}
// State names from the site data when the ledger has none.
const idx = (() => { try { return read(path.join(ROOT, 'cloudflare', 'data', 'index.json')); } catch { return []; } })();
for (const s of states) if (!s.name) s.name = (idx.find((x) => x.code === s.code) || {}).name || s.code;
states.sort((a, b) => a.name.localeCompare(b.name));

const doc = {
  built: new Date().toISOString().slice(0, 10),
  title: 'Aurigen Rules Sheet',
  stateCount: states.length,
  checked: states.filter((s) => s.status === 'checked').length,
  withGaps: states.filter((s) => s.status === 'checked with gaps').length,
  rows: states.reduce((n, s) => n + s.rows, 0),
  notShown: notShownTotal,
  excluded,
  sample: states.filter((s) => s.status === 'checked').map((s) => s.code),
  states,
};
const text = JSON.stringify(doc);
// Our own words must not use the banned money words; verbatim statute quotes may contain them, so they are skipped.
const own = [];
(function walk(v, key) { if (typeof v === 'string') { if (key !== 'quote') own.push(v); } else if (Array.isArray(v)) v.forEach((x) => walk(x, key)); else if (v && typeof v === 'object') for (const k of Object.keys(v)) walk(v[k], k); })(doc);
const hit = (own.join('\n').match(BANNED) || [])[0];
if (hit) { const bad = own.find((x) => BANNED.test(x)); console.error('banned money word in the sheet text: ' + hit + ' in: ' + bad.slice(0, 200)); process.exit(1); }
if (/heldText|holdReason/.test(text)) { console.error('held text leaked into the sheet'); process.exit(1); }
if (!states.length) { console.error('no states to include; refusing to write an empty sheet'); process.exit(1); }
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(doc, null, 1) + '\n');
console.log(`${excluded.length ? 'not enough confirmed rows, left out: ' + excluded.join(', ') + '\n' : ''}sheet: ${states.length} states (${doc.checked} checked, ${doc.withGaps} with gaps), ${doc.rows} sourced rows, ${doc.notShown} statements left out, ${(Buffer.byteLength(text) / 1024).toFixed(0)} KB`);
if (problems.length) console.log(`left out because they failed verification (${problems.length}):\n  ` + problems.slice(0, 20).join('\n  '));
