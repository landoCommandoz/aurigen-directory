// Asserts on the built site. Run after build.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..', '..');
const pub = path.join(here, 'public');
const law = path.join(root, 'cloudflare/data/law');
const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const index = readJson(path.join(root, 'cloudflare/data/index.json'));
const domains = Object.keys(readJson(path.join(law, 'official-domains.json')).domains);
const gaps = readJson(path.join(law, 'gaps.json'));
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
const htmlFiles = walk(pub).filter((f) => f.endsWith('.html'));
let n = 0;
const ok = (c, m) => { assert.ok(c, m); n++; };

// 51 state pages
const statePages = index.map((s) => path.join(pub, 'state', s.code.toLowerCase(), 'index.html'));
ok(index.length === 51, 'index has 51');
for (const p of statePages) ok(fs.existsSync(p), 'missing ' + p);

// status counts add up
const home = fs.readFileSync(path.join(pub, 'index.html'), 'utf8');
const label = (p) => {
  const h = fs.readFileSync(p, 'utf8');
  const m = h.match(/<h1>[^<]*<\/h1><p><span class="badge [^"]*">.*?<span>([^<]*)<\/span><\/span><\/p>/);
  return m && m[1];
};
const tally = {};
for (const p of statePages) { const l = label(p); ok(l, 'no status on ' + p); tally[l] = (tally[l] || 0) + 1; }
const stats = readJson(path.join(here, 'stats.json'));
const audited = (tally['Checked'] || 0) + (tally['Checked with gaps'] || 0) + (tally["Couldn't reach source"] || 0);
ok(audited === stats.audited, 'audited total ' + audited + ' vs ' + stats.audited);
ok(audited + (tally['Not audited yet'] || 0) === 51, 'all 51 counted');
ok(stats.totals.checked === (tally['Checked'] || 0) && stats.totals.gaps === (tally['Checked with gaps'] || 0) && stats.totals.unreachable === (tally["Couldn't reach source"] || 0), 'counts match pages');
const prog = readJson(path.join(root, 'foundry/out/law-audit/PROGRESS.json'));
const done = Object.values(prog.states).filter((s) => s.checkStatus).length;
ok(done === audited, `PROGRESS has ${done} with a result, pages ${audited}`);
for (const [k, v] of Object.entries(gaps.definitions)) ok(home.includes(v.replace(/"/g, '&quot;').replace(/\s*—\s*/g, ', ')), 'definition on home: ' + k);

// every linked URL is on an official domain
let links = 0;
for (const f of htmlFiles) {
  for (const m of fs.readFileSync(f, 'utf8').matchAll(/href="(https?:[^"]+)"/g)) {
    const u = new URL(m[1].replace(/&amp;/g, '&'));
    ok(domains.some((d) => u.hostname === d || u.hostname.endsWith('.' + d)), 'off-list domain ' + u.hostname + ' in ' + f);
    links++;
  }
}

// held text never appears
const allText = walk(pub).map((f) => fs.readFileSync(f, 'utf8')).join('\n').toLowerCase();
let heldN = 0;
for (const f of fs.readdirSync(law)) {
  if (!/^[a-z]{2}\.json$/.test(f)) continue;
  for (const c of readJson(path.join(law, f)).claims) if (c.hold) { heldN++; if (c.heldText) ok(!allText.includes(c.heldText.toLowerCase()), 'held text leaked: ' + c.heldText); }
}

// wording, em dashes, footer, legend, noindex
const banned = /\b(earn\w*|guarantee\w*|profit\w*|returns?|ganar\w*|ganancia\w*|garantizad\w*|rendimiento\w*|retorno\w*)\b/i;
const FOOTER = 'Not legal or financial advice. Rules change. Confirm with the county before you bid.';
for (const f of htmlFiles) {
  const h = fs.readFileSync(f, 'utf8');
  const text = h.replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ');
  ok(!banned.test(text), 'banned word in ' + f + ': ' + (text.match(banned) || [])[0]);
  ok(!/[—–]|&mdash;|&ndash;/.test(h), 'dash in ' + f);
  ok(h.includes(FOOTER), 'footer missing in ' + f);
  ok(h.includes('class="legend"') && h.includes("Couldn't reach source"), 'legend missing in ' + f);
  ok(h.includes('<meta name="robots" content="noindex">'), 'noindex meta missing in ' + f);
  ok(!/<script/i.test(h), 'script in ' + f);
  ok(!/(src|href)="https?:\/\/(fonts|cdn)/.test(h), 'external asset in ' + f);
}
ok(fs.readFileSync(path.join(pub, '_headers'), 'utf8').includes('X-Robots-Tag: noindex'), 'noindex header file');
console.log(`PASS: ${n} assertions; ${statePages.length} state pages; ${htmlFiles.length} html files; ${links} official links; ${heldN} held claims excluded; status tally ${JSON.stringify(tally)}`);
