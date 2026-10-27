// Monthly statute watch. Re-downloads every URL cited in the law ledgers (curl, pdftotext for PDFs, the
// same way foundry/tools/fetch-source.mjs does) into a temporary folder and reports:
//   QUOTE MISSING (strong): a cited quote no longer appears in the page
//   TEXT CHANGED  (weak):   the text hash differs from data/law/sources.json, but every quote is still there
//   UNREACHABLE:            the URL could not be fetched
// It never edits the ledger. Writes a Markdown report to the path given by --out (default: stdout only).
// Exit code 0 = nothing changed, 10 = something changed or failed.
//   node scripts/watch-statutes.mjs [--out report.md]
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { sha256, htmlToText, normalizeText, quoteFound } from '../../foundry/tools/law-text.mjs';
import { LAW } from './law-pieces.mjs';

const UA = 'AurigenLawAudit/1.0 (+https://aurigen.landonbrewington12.workers.dev)';
const args = process.argv.slice(2);
const outPath = args.includes('--out') ? args[args.indexOf('--out') + 1] : null;
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'statute-watch-'));
const sleep = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);

let known = {};
try { known = JSON.parse(fs.readFileSync(path.join(LAW, 'sources.json'), 'utf8')).sources || {}; } catch { /* none yet */ }

// url -> { states:Set, statutes:Set, quotes:[{state,id,quote}] }
const cited = new Map();
for (const f of fs.readdirSync(LAW).filter((n) => /^[a-z]{2}\.json$/.test(n))) {
  const L = JSON.parse(fs.readFileSync(path.join(LAW, f), 'utf8'));
  for (const c of L.claims || []) {
    if (!c.url || !c.quote || c.lang !== 'en') continue;
    if (!cited.has(c.url)) cited.set(c.url, { states: new Set(), statutes: new Set(), quotes: [] });
    const e = cited.get(c.url);
    e.states.add(f.slice(0, 2).toUpperCase());
    e.statutes.add(c.statute);
    if (!e.quotes.some((q) => q.quote === c.quote)) e.quotes.push({ id: c.id, quote: c.quote });
  }
}

function fetchText(url, i) {
  const raw = path.join(tmp, `${i}.raw`);
  sleep(2000);
  const w = execFileSync('curl', ['-sS', '-L', '--max-redirs', '8', '--retry', '2', '--retry-delay', '3', '--connect-timeout', '20',
    '--max-time', '90', '--max-filesize', '40000000', '-A', UA, '-o', raw, '-w', '%{http_code}\t%{content_type}', url], { encoding: 'utf8' });
  const [status, ctype] = w.split('\t');
  if (!/^2/.test(status)) throw new Error(`HTTP ${status}`);
  const buf = fs.readFileSync(raw);
  if (/application\/pdf/i.test(ctype) || buf.subarray(0, 5).toString('latin1') === '%PDF-') {
    execFileSync('pdftotext', ['-layout', '-enc', 'UTF-8', raw, raw + '.txt']);
    return normalizeText(fs.readFileSync(raw + '.txt', 'utf8')) + '\n';
  }
  const m = (ctype.match(/charset=([^\s;]+)/i) || buf.subarray(0, 4096).toString('latin1').match(/<meta[^>]+charset=["']?([^"'\s/>;]+)/i) || [])[1];
  let decoded;
  try { decoded = new TextDecoder((m || 'utf-8').toLowerCase()).decode(buf); } catch { decoded = new TextDecoder('utf-8').decode(buf); }
  const isHtml = /html|xml/i.test(ctype) || /^\s*<(!doctype|html|\?xml)/i.test(decoded.slice(0, 512));
  return normalizeText(isHtml ? htmlToText(decoded) : decoded) + '\n';
}

const missing = [], changed = [], failed = [];
let i = 0;
for (const [url, e] of cited) {
  const who = `${[...e.states].join(', ')} — ${[...e.statutes].join('; ')}`;
  let text;
  try { text = fetchText(url, i++); } catch (err) { failed.push(`- ${who}\n  ${url}\n  could not fetch: ${String(err.message).split('\n')[0].slice(0, 200)}`); continue; }
  const gone = e.quotes.filter((q) => !quoteFound(q.quote, text));
  if (gone.length) { missing.push(`- ${who}\n  ${url}\n` + gone.map((q) => `  quote no longer found (${q.id}): "${q.quote}"`).join('\n')); continue; }
  const prev = known[url]?.text_sha256;
  if (prev && prev !== sha256(text)) changed.push(`- ${who}\n  ${url}\n  page text changed since ${known[url].fetched_at?.slice(0, 10) || 'last check'}; all cited quotes still present`);
}

const n = missing.length + changed.length + failed.length;
const report = [
  `Statute watch: ${cited.size} cited sources checked, ${n} changed or failed.`, '',
  `## Quote missing (strong): ${missing.length}`, ...missing, '',
  `## Page text changed (weak): ${changed.length}`, ...changed, '',
  `## Could not fetch: ${failed.length}`, ...failed, '',
  'The ledger was not edited. Re-check each listed statement against the official text before changing the site.',
].join('\n');
console.log(report);
if (outPath) fs.writeFileSync(outPath, report + '\n');
fs.writeFileSync(path.join(tmp, 'count'), String(n));
process.exit(n ? 10 : 0);
