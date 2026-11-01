// Builds the static law-audit showcase into ./public from the ledgers. Reads data, never changes it.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..', '..');
const lawDir = path.join(root, 'cloudflare/data/law');
const out = path.join(here, 'public');
const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));

const gaps = readJson(path.join(lawDir, 'gaps.json'));
const domains = Object.keys(readJson(path.join(lawDir, 'official-domains.json')).domains);
const progress = readJson(path.join(root, 'foundry/out/law-audit/PROGRESS.json'));
const index = readJson(path.join(root, 'cloudflare/data/index.json'));

const STATUS = {
  checked: { key: 'checked', label: 'Checked', cls: 'st-ok' },
  gaps: { key: 'checked with gaps', label: 'Checked with gaps', cls: 'st-gap' },
  unreachable: { key: "Couldn't reach source", label: "Couldn't reach source", cls: 'st-no' },
  none: { key: 'none', label: 'Not audited yet', cls: 'st-none' },
};
const byKey = (k) => Object.values(STATUS).find((s) => s.key === k) || STATUS.none;
const FOOTER = 'Not legal or financial advice. Rules change. Confirm with the county before you bid.';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// Plain-words pass over data text: no em dashes, no banned money words.
const plain = (s) => esc(String(s)
  .replace(/\s*[—–]\s*/g, ', ')
  .replace(/\breturned\b/g, 'gave')
  .replace(/\breturns\b/g, 'gives'));
const officialUrl = (u) => {
  try {
    const h = new URL(u).hostname.toLowerCase();
    return u.startsWith('https://') && domains.some((d) => h === d || h.endsWith('.' + d)) ? u : null;
  } catch { return null; }
};
const fmtDate = (d) => d || 'Not recorded';

// ---- Collect per-state facts
const held = [];
const states = index.map((s) => {
  const code = s.code, lc = code.toLowerCase();
  const gp = gaps.states[code] || {};
  const prog = progress.states[code] || {};
  const file = path.join(lawDir, lc + '.json');
  const ledger = fs.existsSync(file) ? readJson(file) : null;
  const all = ledger ? ledger.claims : [];
  for (const c of all) if (c.hold && c.heldText) held.push(c.heldText);
  const claims = all.filter((c) => !c.hold);
  const hasHeld = all.some((c) => c.hold);
  const n = (st) => claims.filter((c) => c.status === st).length;
  const status = byKey(gp.checkStatus || (ledger && ledger.checkStatus) || prog.checkStatus);
  const dates = claims.map((c) => c.checked).filter(Boolean).sort();
  const last = dates.length ? dates[dates.length - 1] : (ledger && ledger.auditedAt) || prog.date || '';
  const cited = new Map();
  for (const c of claims) {
    if (!c.statute) continue;
    const url = c.url ? officialUrl(c.url) : null;
    const k = c.statute + '|' + (url || '');
    if (!cited.has(k)) cited.set(k, { statute: c.statute, url });
  }
  const af = path.join(root, 'foundry/out/law-audit/attempts', lc + '.jsonl');
  const attempts = fs.existsSync(af) ? fs.readFileSync(af, 'utf8').split('\n').filter(Boolean).length : 0;
  const kinds = { substantive: 0, wording: 0, 'removed-opinion': 0 };
  for (const c of claims) if (c.status === 'corrected' && c.correctionKind in kinds) kinds[c.correctionKind]++;
  return {
    code, lc, name: s.name, status, hasHeld, total: claims.length,
    supported: n('supported'), corrected: n('corrected'), flagged: n('flagged'), unreachable: n('unreachable'),
    gaps: (gp.gaps || []), last, cited: [...cited.values()].sort((a, b) => a.statute.localeCompare(b.statute)),
    attempts, kinds,
  };
});

const count = (k) => states.filter((s) => s.status === STATUS[k]).length;
const totals = { checked: count('checked'), gaps: count('gaps'), unreachable: count('unreachable'), none: count('none') };
const audited = totals.checked + totals.gaps + totals.unreachable;
const kindTotals = { substantive: 0, wording: 0, 'removed-opinion': 0 };
for (const s of states) for (const k in kindTotals) kindTotals[k] += s.kinds[k];

// ---- Shared markup
const icon = {
  'st-ok': '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M7 12.5l3.5 3.5L17 9" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  'st-gap': '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 2.5L22 20.5H2z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/><path d="M12 9v5.5M12 17.2v.6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>',
  'st-no': '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M8 8l8 8M16 8l-8 8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>',
  'st-none': '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>',
};
const badge = (st) => `<span class="badge ${st.cls}">${icon[st.cls]}<span>${esc(st.label)}</span></span>`;
const legend = () => `<aside class="legend" aria-label="Status legend"><h2>Legend</h2><ul>${
  [STATUS.checked, STATUS.gaps, STATUS.unreachable].map((s) => `<li>${badge(s)}</li>`).join('')
}</ul><p class="small">Each status has its own word, shape and border style. Color is only a bonus.</p></aside>`;

const css = `
:root{--bg:#fbfaf7;--fg:#1d2327;--mut:#4a545b;--line:#7b868c;--card:#fff;--link:#0b4f8a;--ok:#14532d;--gap:#7a3e00;--no:#7f1d1d}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--fg);font:17px/1.6 system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;overflow-wrap:anywhere}
h1,h2,h3{font-family:Georgia,"Times New Roman",serif;line-height:1.25;margin:1.4em 0 .5em}
h1{font-size:2rem;margin-top:.6em}h2{font-size:1.4rem}h3{font-size:1.1rem}
a{color:var(--link);text-underline-offset:3px}
a:focus-visible,summary:focus-visible{outline:3px solid #000;outline-offset:2px}
.wrap{max-width:60rem;margin:0 auto;padding:0 1rem}
header.site{border-bottom:2px solid var(--fg);background:var(--card)}
header.site .wrap{display:flex;flex-wrap:wrap;gap:.25rem 1.25rem;align-items:center}
header.site a{display:inline-flex;align-items:center;min-height:44px;font-weight:600;color:var(--fg)}
.skip{position:absolute;left:-999px;top:0;background:#fff;padding:.75rem;z-index:9}.skip:focus{left:0}
.badge{display:inline-flex;align-items:center;gap:.4rem;padding:.2rem .6rem;background:var(--card);font-weight:700;border-radius:4px}
.ico{width:1.3em;height:1.3em;flex:none}
.st-ok{color:var(--ok);border:3px solid var(--ok)}
.st-gap{color:var(--gap);border:3px dashed var(--gap)}
.st-no{color:var(--no);border:3px double var(--no);border-width:5px}
.st-none{color:var(--mut);border:2px dotted var(--mut)}
.legend{border:1px solid var(--line);background:var(--card);padding:.5rem 1rem 1rem;margin:1.5rem 0}
.legend h2{margin:.3em 0;font-size:1.1rem}
.legend ul{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:.6rem}
.small{font-size:.9rem;color:var(--mut);margin:.6rem 0 0}
.bar{display:flex;height:2.2rem;border:2px solid var(--fg);margin:1rem 0 .5rem}
.bar>span{display:block;min-width:4px}
.bar .seg-ok{background:#14532d}
.bar .seg-gap{background:repeating-linear-gradient(45deg,#fff 0 6px,#7a3e00 6px 12px)}
.bar .seg-no{background:repeating-linear-gradient(90deg,#fff 0 4px,#7f1d1d 4px 5px)}
.bar .seg-none{background:#ddd}
.counts{list-style:none;padding:0;margin:0;display:grid;gap:.6rem;grid-template-columns:repeat(auto-fit,minmax(14rem,1fr))}
.counts li{border:1px solid var(--line);background:var(--card);padding:.6rem .8rem}
.counts strong{font-size:1.8rem;display:block;font-family:Georgia,serif}
dl.defs dt{font-weight:700;margin-top:1rem}dl.defs dd{margin:.3rem 0 0}
table{width:100%;border-collapse:collapse;background:var(--card)}
th,td{text-align:left;padding:.5rem .6rem;border-bottom:1px solid var(--line);vertical-align:middle}
thead th{border-bottom:2px solid var(--fg)}
td a.btn,a.btn{display:inline-flex;align-items:center;min-height:44px;min-width:44px;padding:0 .5rem}
.facts{display:grid;gap:.6rem;grid-template-columns:repeat(auto-fit,minmax(9rem,1fr));margin:1rem 0;padding:0;list-style:none}
.facts li{border:1px solid var(--line);background:var(--card);padding:.5rem .7rem}
.facts strong{display:block;font-size:1.5rem;font-family:Georgia,serif}
ul.cites{padding-left:1.2rem}ul.cites li{margin:0}ul.cites a,p.small a{display:inline-flex;align-items:center;min-height:44px}
.gap{border-left:5px solid var(--gap);background:var(--card);padding:.5rem 1rem;margin:.8rem 0}
footer.site{margin-top:3rem;border-top:2px solid var(--fg);background:var(--card);padding:1rem 0 2rem}
p.crumb{margin:.5rem 0 0}
@media(max-width:700px){
 table,thead,tbody,tr,th,td{display:block}
 thead{position:absolute;left:-9999px}
 tr{border:1px solid var(--line);margin:.7rem 0;padding:.3rem .2rem}
 td{border:0;display:flex;gap:.6rem;justify-content:space-between;align-items:center;padding:.25rem .6rem}
 td::before{content:attr(data-label);font-weight:700;color:var(--mut);flex:none}
 td:first-child{font-weight:700;font-size:1.1rem}
}
body .sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
@media(prefers-reduced-motion:no-preference){html{scroll-behavior:smooth}}
`;

const page = (title, body) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>${plain(title)}</title>
<style>${css}</style></head><body>
<a class="skip" href="#main">Skip to content</a>
<header class="site"><div class="wrap"><a href="/">Law audit showcase</a><a href="/#states">All states</a><a href="/method/">Method</a></div></header>
<main id="main" class="wrap">${body}${legend()}</main>
<footer class="site"><div class="wrap"><p>${esc(FOOTER)}</p></div></footer>
</body></html>
`;

const write = (rel, html) => {
  const f = path.join(out, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, html);
};

// ---- Pages
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

const seg = (k, cls) => totals[k] ? `<span class="${cls}" style="flex:${totals[k]}" title="${esc(STATUS[k].label)}: ${totals[k]}"></span>` : '';
const rows = states.map((s) => `<tr><td data-label="State"><a class="btn" href="/state/${s.lc}/">${esc(s.name)}</a></td>`
  + `<td data-label="Status">${badge(s.status)}</td>`
  + (s.status === STATUS.none
    ? '<td data-label="Claims checked">0</td><td data-label="Corrected">0</td><td data-label="Still open">0</td><td data-label="Last checked">Not audited yet</td>'
    : `<td data-label="Claims checked">${s.total}</td><td data-label="Corrected">${s.corrected}</td><td data-label="Still open">${s.gaps.length} gap${s.gaps.length === 1 ? '' : 's'}</td><td data-label="Last checked">${esc(fmtDate(s.last))}</td>`)
  + `<td data-label="Page"><a class="btn" href="/state/${s.lc}/">Open ${esc(s.code)}<span class="sr"> page</span></a></td></tr>`).join('');

write('index.html', page('Law audit showcase', `
<h1>What the law audit checked</h1>
<p>We compared what this directory says about each state's tax sale rules with the official law and official pages. This site shows, state by state, what was checked and how far to trust it. It is a record of work done, not a promise that every rule is current.</p>
<h2>Status of all ${states.length} jurisdictions</h2>
<div class="bar" role="img" aria-label="${totals.checked} checked, ${totals.gaps} checked with gaps, ${totals.unreachable} couldn't reach source${totals.none ? ', ' + totals.none + ' not audited yet' : ''}">${seg('checked', 'seg-ok')}${seg('gaps', 'seg-gap')}${seg('unreachable', 'seg-no')}${seg('none', 'seg-none')}</div>
<ul class="counts">
<li>${badge(STATUS.checked)}<strong>${totals.checked}</strong>states</li>
<li>${badge(STATUS.gaps)}<strong>${totals.gaps}</strong>states</li>
<li>${badge(STATUS.unreachable)}<strong>${totals.unreachable}</strong>states</li>
${totals.none ? `<li>${badge(STATUS.none)}<strong>${totals.none}</strong>states</li>` : ''}
</ul>
<p class="small">${audited} of ${states.length} jurisdictions have a result.</p>
<h2>What the three statuses mean</h2>
<dl class="defs">
<dt>${badge(STATUS.checked)}</dt><dd>${plain(gaps.definitions.checked)}</dd>
<dt>${badge(STATUS.gaps)}</dt><dd>${plain(gaps.definitions['checked with gaps'])}</dd>
<dt>${badge(STATUS.unreachable)}</dt><dd>${plain(gaps.definitions["Couldn't reach source"])}</dd>
</dl>
<h2 id="states">All states</h2>
<table><caption class="sr">Audit result for each jurisdiction</caption><thead><tr><th scope="col">State</th><th scope="col">Status</th><th scope="col">Claims checked</th><th scope="col">Corrected</th><th scope="col">Still open</th><th scope="col">Last checked</th><th scope="col">Page</th></tr></thead><tbody>${rows}</tbody></table>
<p class="small">How the work was done is on the <a href="/method/">method page</a>.</p>`));

for (const s of states) {
  let body = `<p class="crumb"><a class="btn" href="/">All states</a></p><h1>${esc(s.name)}</h1><p>${badge(s.status)}</p>`;
  if (s.status === STATUS.none) {
    body += '<p>Not audited yet</p>';
  } else {
    const defKey = s.status.key;
    body += `<p>${plain(gaps.definitions[defKey])}</p>`;
    if (s.status !== STATUS.unreachable || s.total) {
      body += `<h2>Counts</h2><ul class="facts"><li><strong>${s.supported}</strong>supported</li><li><strong>${s.corrected}</strong>corrected</li><li><strong>${s.flagged}</strong>flagged</li><li><strong>${s.unreachable}</strong>unreachable</li></ul>`
        + `<p class="small">${s.total} claims counted. English and Spanish statements are counted separately.${s.hasHeld ? ' Some statements are withheld until their source is read.' : ''}</p>`;
    }
    body += `<p><strong>Last checked:</strong> ${esc(fmtDate(s.last))}</p>`;
    if (s.status === STATUS.unreachable) {
      body += `<h2>Why the source was not reached</h2><p><strong>Attempts logged:</strong> ${s.attempts}</p>`
        + s.gaps.map((g) => `<div class="gap"><p>${plain(g.text)}</p>${g.close ? `<p><strong>How it will be closed:</strong> ${plain(g.close)}</p>` : ''}</div>`).join('');
    } else {
      if (s.gaps.length) {
        body += `<h2>Gaps</h2>` + s.gaps.map((g) => `<div class="gap"><p>${plain(g.text)}</p>${g.close ? `<p><strong>How it will be closed:</strong> ${plain(g.close)}</p>` : ''}${g.closed ? `<p><strong>Closed:</strong> ${plain(g.closed)}</p>` : ''}</div>`).join('');
      }
      body += `<h2>Statutes cited</h2>` + (s.cited.length
        ? `<ul class="cites">${s.cited.map((c) => `<li>${c.url ? `<a href="${esc(c.url)}" rel="noopener noreferrer">${plain(c.statute)}</a>` : plain(c.statute)}</li>`).join('')}</ul>`
        : '<p>None listed.</p>');
    }
  }
  write(`state/${s.lc}/index.html`, page(`${s.name} law audit`, body));
}

const kt = kindTotals, allCorr = kt.substantive + kt.wording + kt['removed-opinion'];
write('method/index.html', page('Method', `
<h1>Method</h1>
<h2>How a claim gets checked</h2>
<ol>
<li><strong>Official source only.</strong> A claim is checked against law text or pages from a government body. Other sites are not used.</li>
<li><strong>Saved copy.</strong> A script saves the source page and records a hash of it, so the copy can be checked later.</li>
<li><strong>Verbatim quote.</strong> The claim must point to a quote copied word for word from the saved copy. A script checks that the quote is really in the file.</li>
<li><strong>Second pass.</strong> A second read rereads each statement against its quote. Anything the quote does not support is trimmed to what it does support, or flagged if trimming would mislead.</li>
</ol>
<h2>The three statuses</h2>
<dl class="defs">
<dt>${badge(STATUS.checked)}</dt><dd>${plain(gaps.definitions.checked)}</dd>
<dt>${badge(STATUS.gaps)}</dt><dd>${plain(gaps.definitions['checked with gaps'])}</dd>
<dt>${badge(STATUS.unreachable)}</dt><dd>${plain(gaps.definitions["Couldn't reach source"])}</dd>
</dl>
<h2>Words used</h2>
<ul>
<li><strong>Supported:</strong> the original statement matched the source.</li>
<li><strong>Corrected:</strong> the statement did not match the source, or was not stated by it, so it was changed or removed.</li>
<li><strong>Flagged:</strong> the official text is unclear or official sources disagree, so the statement is not settled. Confirm with the county.</li>
<li><strong>Unreachable:</strong> the source for that statement could not be read.</li>
<li><strong>Withheld:</strong> a statement is kept off the site until its official source is read. Withheld statements are not counted here.</li>
</ul>
<h2>Corrections by kind</h2>
<p>${allCorr} corrected claims across ${audited - totals.unreachable} audited states. English and Spanish are counted separately.</p>
<ul class="facts">
<li><strong>${kt.substantive}</strong>substantive</li>
<li><strong>${kt.wording}</strong>wording</li>
<li><strong>${kt['removed-opinion']}</strong>removed opinion</li>
</ul>
<ul>
<li><strong>Substantive:</strong> a rule, number, rate, date, deadline, process or availability changed, or a claim was removed because the official source does not support it.</li>
<li><strong>Wording:</strong> the same rule restated in plainer or more exact words, or the citation or link swapped.</li>
<li><strong>Removed opinion:</strong> a statement taken out because it was advice, a comparison or a prediction that no official source states.</li>
</ul>`));

write('404.html', page('Page not found', '<h1>Page not found</h1><p><a class="btn" href="/">Back to all states</a></p>'));
write('_headers', '/*\n  X-Robots-Tag: noindex\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: no-referrer\n');
write('robots.txt', 'User-agent: *\nDisallow: /\n');

// ---- Held claims must never appear in output
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
const outText = walk(out).map((f) => fs.readFileSync(f, 'utf8')).join('\n').toLowerCase();
for (const h of new Set(held)) {
  if (outText.includes(esc(h).toLowerCase()) || outText.includes(h.toLowerCase())) {
    console.error('FAIL: held text appears in output: ' + h);
    process.exit(1);
  }
}
fs.writeFileSync(path.join(here, 'stats.json'), JSON.stringify({ totals, audited, kindTotals, heldCount: held.length }, null, 1) + '\n');
console.log(`built ${states.length} state pages; checked ${totals.checked}, gaps ${totals.gaps}, unreachable ${totals.unreachable}, not audited ${totals.none}`);
