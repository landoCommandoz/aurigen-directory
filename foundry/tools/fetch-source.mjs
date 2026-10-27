#!/usr/bin/env node
// Downloads one official source for the Aurigen law audit and saves a verifiable text copy.
//
//   node foundry/tools/fetch-source.mjs <state> <slug> <url>
//   example: node foundry/tools/fetch-source.mjs az ars-42-18053 https://www.azleg.gov/ars/42/18053.htm
//
// Uses curl to download and pdftotext for PDFs. Never paste text from a fetch tool instead:
// that text can be a summary, and the quote check would then prove nothing.
//
// Writes (paths from the repo root):
//   foundry/out/law-audit/sources/<st>/<slug>.txt    normalized text of the whole downloaded page
//   foundry/out/law-audit/sources/<st>/<slug>.json   url, final url, date, HTTP status, type, hashes
//   foundry/out/law-audit/attempts/<st>.jsonl        one line per attempt, success or failure
//   foundry/out/law-audit/raw/<st>/<slug>.<ext>      the raw download (not committed; its hash is kept)
// Exit codes: 0 saved, 2 download failed, 3 robots.txt disallows, 4 unsupported file type, 1 bad usage.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { sha256, htmlToText, normalizeText } from './law-text.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const OUT = path.join(ROOT, 'foundry', 'out', 'law-audit');
const UA = 'AurigenLawAudit/1.0 (+https://aurigen.landonbrewington12.workers.dev)';
const TOOL = 'foundry/tools/fetch-source.mjs';

const [st, slug, url] = process.argv.slice(2);
if (!/^[a-z]{2}$/.test(st || '') || !/^[a-z0-9][a-z0-9-]{0,80}$/.test(slug || '') || !/^https?:\/\/[^\s]+$/.test(url || '')) {
  console.error('usage: node foundry/tools/fetch-source.mjs <state:2 lowercase letters> <slug:a-z0-9-> <http(s) url>');
  process.exit(1);
}

const now = new Date().toISOString();
const attemptsFile = path.join(OUT, 'attempts', `${st}.jsonl`);
fs.mkdirSync(path.dirname(attemptsFile), { recursive: true });
function logAttempt(result, extra = {}) {
  fs.appendFileSync(attemptsFile, JSON.stringify({ at: now, slug, url, result, ...extra }) + '\n');
}
const sleep = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);

function curl(args) {
  return execFileSync('curl', ['-sS', '-L', '--max-redirs', '8', '--retry', '2', '--retry-delay', '3',
    '--connect-timeout', '20', '--max-time', '90', '--max-filesize', '40000000', '-A', UA, ...args],
    { encoding: 'utf8', maxBuffer: 1 << 20 });
}

// Minimal robots.txt check: honours Disallow/Allow for "User-agent: *" and our agent, longest match wins.
function robotsAllows(target) {
  const u = new URL(target);
  let body = '';
  try {
    const tmp = path.join(OUT, 'raw', '.robots.tmp');
    fs.mkdirSync(path.dirname(tmp), { recursive: true });
    const code = curl(['-o', tmp, '-w', '%{http_code}', `${u.origin}/robots.txt`]).trim();
    if (!/^2/.test(code)) return true;           // no robots.txt: allowed
    body = fs.readFileSync(tmp, 'utf8');
  } catch { return true; }                        // unreachable robots.txt: the page fetch decides
  const groups = [];
  let cur = null, lastWasAgent = false;
  for (const raw of body.split(/\r?\n/)) {
    const line = raw.replace(/#.*/, '').trim();
    const m = line.match(/^([A-Za-z-]+)\s*:\s*(.*)$/);
    if (!m) continue;
    const key = m[1].toLowerCase(), val = m[2].trim();
    if (key === 'user-agent') {
      if (!lastWasAgent) { cur = { agents: [], rules: [] }; groups.push(cur); }
      cur.agents.push(val.toLowerCase()); lastWasAgent = true;
    } else if (cur && (key === 'disallow' || key === 'allow')) {
      cur.rules.push({ allow: key === 'allow', path: val }); lastWasAgent = false;
    } else { lastWasAgent = false; }
  }
  const mine = groups.filter((g) => g.agents.some((a) => a !== '*' && 'aurigenlawaudit'.startsWith(a)));
  const use = mine.length ? mine : groups.filter((g) => g.agents.includes('*'));
  const p = u.pathname + u.search;
  let best = null;
  for (const g of use) for (const r of g.rules) {
    if (!r.path) continue;
    const rx = new RegExp('^' + r.path.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\\\$$/, '$'));
    if (rx.test(p) && (!best || r.path.length > best.path.length || (r.path.length === best.path.length && r.allow))) best = r;
  }
  return !best || best.allow;
}

if (!robotsAllows(url)) {
  logAttempt('robots_disallowed');
  console.error(`robots.txt disallows ${url}. Find another official copy.`);
  process.exit(3);
}

sleep(2000); // be polite: at least 2 seconds between requests
const rawDir = path.join(OUT, 'raw', st);
fs.mkdirSync(rawDir, { recursive: true });
const tmpRaw = path.join(rawDir, `${slug}.download`);
const hdr = path.join(rawDir, `${slug}.headers`);
let status = 0, ctype = '', finalUrl = url;
try {
  const w = curl(['-D', hdr, '-o', tmpRaw, '-w', '%{http_code}\t%{content_type}\t%{url_effective}', url]);
  [status, ctype, finalUrl] = w.split('\t');
  status = Number(status);
} catch (e) {
  logAttempt('download_error', { error: String(e.stderr || e.message).trim().slice(0, 300) });
  console.error(`download failed: ${String(e.stderr || e.message).trim()}`);
  process.exit(2);
}
if (status < 200 || status > 299) {
  logAttempt('http_error', { http_status: status, final_url: finalUrl });
  console.error(`HTTP ${status} from ${finalUrl}`);
  process.exit(2);
}

const raw = fs.readFileSync(tmpRaw);
const isPdf = /application\/pdf/i.test(ctype) || raw.subarray(0, 5).toString('latin1') === '%PDF-';
const isHtml = !isPdf && (/html|xml/i.test(ctype) || /^\s*<(!doctype|html|\?xml)/i.test(raw.subarray(0, 512).toString('latin1')));
const isPlain = !isPdf && !isHtml && /^text\//i.test(ctype);
if (!isPdf && !isHtml && !isPlain) {
  logAttempt('unsupported_type', { http_status: status, content_type: ctype, final_url: finalUrl });
  console.error(`unsupported file type "${ctype}". Find an HTML or PDF copy.`);
  process.exit(4);
}
const ext = isPdf ? 'pdf' : isHtml ? 'html' : 'txt';
const rawPath = path.join(rawDir, `${slug}.${ext}`);
fs.renameSync(tmpRaw, rawPath);

let text, extractor;
if (isPdf) {
  const v = spawnSync('pdftotext', ['-v'], { encoding: 'utf8' });
  const ver = `${v.stdout || ''}${v.stderr || ''}`;
  const txt = path.join(rawDir, `${slug}.pdftotext`);
  execFileSync('pdftotext', ['-layout', '-enc', 'UTF-8', rawPath, txt]);
  text = fs.readFileSync(txt, 'utf8');
  extractor = `pdftotext -layout (${(ver.match(/pdftotext version [^\s]+/) || ['pdftotext'])[0]})`;
} else {
  const m = (ctype.match(/charset=([^\s;]+)/i) || raw.subarray(0, 4096).toString('latin1').match(/<meta[^>]+charset=["']?([^"'\s/>;]+)/i) || [])[1];
  let decoded;
  try { decoded = new TextDecoder((m || 'utf-8').toLowerCase(), { fatal: false }).decode(raw); }
  catch { decoded = new TextDecoder('utf-8').decode(raw); }
  text = isHtml ? htmlToText(decoded) : decoded;
  extractor = isHtml ? 'foundry/tools/law-text.mjs htmlToText' : 'plain text';
}
text = normalizeText(text) + '\n';

const srcDir = path.join(OUT, 'sources', st);
fs.mkdirSync(srcDir, { recursive: true });
const meta = {
  tool: TOOL,
  state: st,
  slug,
  url,
  final_url: finalUrl,
  fetched_at: now,
  http_status: status,
  content_type: ctype,
  raw_sha256: sha256(raw),
  raw_bytes: raw.length,
  extractor,
  text_sha256: sha256(text),
  text_chars: text.length,
};
fs.writeFileSync(path.join(srcDir, `${slug}.txt`), text);
fs.writeFileSync(path.join(srcDir, `${slug}.json`), JSON.stringify(meta, null, 1) + '\n');
logAttempt('saved', { http_status: status, final_url: finalUrl, text_sha256: meta.text_sha256 });
const warn = text.length < 600 ? '  WARNING: very little text. The page may need JavaScript; look for a print, PDF or other official copy.' : '';
console.log(`saved foundry/out/law-audit/sources/${st}/${slug}.txt (${text.length} chars, ${extractor})${warn}`);
