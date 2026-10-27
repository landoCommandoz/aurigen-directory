// Law gate: every statement the site shows must be tied to an official source.
//   node scripts/check-law.mjs              check all 51 states (fails until every state is audited)
//   node scripts/check-law.mjs --state ak   check one state
// Fails (exit 1) on any missing claim, missing citation field, bad snapshot, quote not found, URL or date
// mismatch, unofficial domain, banned money word, or an unreachable claim without logged failed attempts.
import fs from 'node:fs';
import path from 'node:path';
import { loadSnapshot, quoteFound } from '../../foundry/tools/law-text.mjs';
import { BASE, ROOT, LAW, statePieces, loadLedger, bannedWord, claimText, LABEL_FLAGGED, LABEL_FLAGGED_ES } from './law-pieces.mjs';

const args = process.argv.slice(2);
const only = args.includes('--state') ? String(args[args.indexOf('--state') + 1] || '').toLowerCase() : null;
const index = JSON.parse(fs.readFileSync(path.join(BASE, 'data', 'index.json'), 'utf8'));
const codes = index.map((s) => s.code.toLowerCase()).filter((c) => !only || c === only);
if (only && !codes.length) { console.error(`unknown state: ${only}`); process.exit(1); }

const domains = JSON.parse(fs.readFileSync(path.join(LAW, 'official-domains.json'), 'utf8'));
const officialHost = (u) => {
  let h; try { h = new URL(u).hostname.toLowerCase(); } catch { return false; }
  return Object.keys(domains.domains).some((d) => h === d || h.endsWith('.' + d));
};
const CITE = ['statute', 'url', 'snapshot', 'quote', 'checked'];
const STATUSES = ['supported', 'corrected', 'flagged', 'unreachable'];
const day = (s) => String(s || '').slice(0, 10);

function readAttempts(st) {
  const p = path.join(ROOT, 'foundry', 'out', 'law-audit', 'attempts', `${st}.jsonl`);
  if (!fs.existsSync(p)) return [];
  return fs.readFileSync(p, 'utf8').split('\n').filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
}

const rows = [];
const errors = [];
for (const code of codes) {
  const err = (m) => errors.push(`${code.toUpperCase()}: ${m}`);
  const st = JSON.parse(fs.readFileSync(path.join(BASE, 'data', 'states', `${code}.json`), 'utf8'));
  const pieces = statePieces(st);
  const ledger = loadLedger(code);
  const row = { st: code.toUpperCase(), claims: 0, supported: 0, corrected: 0, flagged: 0, unreachable: 0, missing: 0 };
  rows.push(row);
  if (!ledger) { row.missing = pieces.length; err(`no ledger (cloudflare/data/law/${code}.json); ${pieces.length} shown pieces unaudited`); continue; }
  const claims = ledger.claims || [];
  row.claims = claims.length;
  const byId = new Map();
  for (const c of claims) {
    if (byId.has(c.id)) err(`duplicate claim id ${c.id}`);
    byId.set(c.id, c);
  }
  // 1. Every shown piece of the source data has a claim recording it as `original`.
  for (const p of pieces) {
    const c = byId.get(p.id);
    if (!c || c.original !== p.text || c.lang !== p.lang || c.field !== p.field) { row.missing++; err(`shown text has no matching claim: ${p.id} "${p.text.slice(0, 70)}"`); }
  }
  const attempts = readAttempts(code);
  for (const c of claims) {
    const where = `claim ${c.id}`;
    if (!STATUSES.includes(c.status)) { err(`${where}: status "${c.status}" is not one of ${STATUSES.join(', ')}`); continue; }
    row[c.status]++;
    if (!['en', 'es'].includes(c.lang)) err(`${where}: lang must be en or es`);
    if (c.lang === 'es' && !byId.has(c.enId)) err(`${where}: Spanish claim needs enId of an English claim`);
    if (typeof c.shown !== 'string') err(`${where}: shown must be a string ("" removes the statement)`);
    if (!c.pass2) err(`${where}: pass 2 not recorded`);
    const bw = bannedWord(c.shown, c.lang) || bannedWord(claimText(c), c.lang);
    if (bw) err(`${where}: banned money word "${bw}" in shown text`);
    if (c.status === 'unreachable') {
      if (!Array.isArray(c.attempts) || !c.attempts.length) { err(`${where}: unreachable claim lists no attempts`); continue; }
      for (const u of c.attempts) {
        if (!attempts.some((a) => a.url === u && a.result !== 'saved')) err(`${where}: attempt ${u} is not logged as a failed attempt in attempts/${code}.jsonl`);
        if (!officialHost(u)) err(`${where}: attempted URL is not on an official domain: ${u}`);
      }
      if (c.shown && !/Couldn't reach source on|No se pudo consultar la fuente/.test(claimText(c))) err(`${where}: unreachable label does not render`);
      continue;
    }
    for (const k of CITE) if (!c[k]) err(`${where}: missing ${k}`);
    if (!c.sourceKind || !['code', 'session_law', 'agency', 'county'].includes(c.sourceKind)) err(`${where}: sourceKind must be code, session_law, agency or county`);
    if (c.status === 'corrected' && c.original == null && !c.added) err(`${where}: corrected claim must keep original`);
    if (c.status === 'flagged' && c.shown && !claimText(c).includes(c.lang === 'es' ? LABEL_FLAGGED_ES : LABEL_FLAGGED)) err(`${where}: flagged label does not render`);
    if (c.quote && c.quote.split(/\s+/).length > 60) err(`${where}: quote longer than 60 words`);
    if (c.url && !officialHost(c.url)) err(`${where}: URL is not on an official domain in official-domains.json: ${c.url}`);
    if (!c.snapshot) continue;
    const snap = loadSnapshot(path.join(ROOT, c.snapshot));
    if (!snap.ok) { err(`${where}: snapshot ${c.snapshot}: ${snap.reason}`); continue; }
    if (c.url !== snap.meta.url && c.url !== snap.meta.final_url) err(`${where}: url differs from snapshot url/final_url`);
    if (day(c.checked) !== day(snap.meta.fetched_at)) err(`${where}: checked ${c.checked} differs from snapshot date ${day(snap.meta.fetched_at)}`);
    if (c.quote && !quoteFound(c.quote, snap.text)) err(`${where}: quote not found in snapshot ${c.snapshot}`);
  }
}

const cols = ['st', 'claims', 'supported', 'corrected', 'flagged', 'unreachable', 'missing'];
console.log(cols.map((c) => c.padStart(c === 'st' ? 3 : 11)).join(' '));
for (const r of rows) console.log(cols.map((c) => String(r[c]).padStart(c === 'st' ? 3 : 11)).join(' '));
if (errors.length) {
  const shown = errors.slice(0, 200);
  console.error(`\ncheck-law: FAIL (${errors.length} problems)\n` + shown.map((e) => '  - ' + e).join('\n') + (errors.length > shown.length ? `\n  ... ${errors.length - shown.length} more` : ''));
  process.exit(1);
}
console.log(`\ncheck-law: PASS (${rows.length} state${rows.length === 1 ? '' : 's'})`);
