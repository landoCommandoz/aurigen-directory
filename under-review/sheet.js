// "Platbook Rules Sheet": a free, source-by-source reading of the audited tax sale rules, served by the live Worker.
// Free in exchange for an email address: the Polar checkout is $0, takes the email and sends the key.
// /rules-sheet/            the page: what it is, a free sample, the key form (no JavaScript needed)
// /rules-sheet/unlock      POST key=...  checks the key with Polar, then shows every state
// /rules-sheet/sheet.csv   POST key=...  the same rows as a CSV file
// Data comes from sheet.json (built by foundry/tools/build-sheet.mjs from claims that passed the audit gate;
// held, flagged and unreachable claims are never in it). Keys are checked with Polar's public validate endpoint
// and a benefit id, so no secret is stored here and nothing is kept: the key is not saved or logged.
import SHEET from './sheet.json' with { type: 'json' };
import CONFIG from './sheet-config.json' with { type: 'json' };
import LISTING from './sheet-listing.json' with { type: 'json' };

export const PATH = '/rules-sheet/';
const POLAR_VALIDATE = 'https://api.polar.sh/v1/customer-portal/license-keys/validate';
const SAMPLE_CODES = ['PA', 'TX'];

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const safeUrl = (u) => (/^https?:\/\/[^\s"'<>]+$/.test(String(u)) ? String(u) : '#');
const STATUS_LABEL = { 'checked': 'Checked', 'checked with gaps': 'Checked with gaps' };

const CSS = `
/* ============================================================================
   THE RULES SHEET KEY PAGE IN DIRECTION 1. PREVIEW ONLY. NOTHING HERE IS LIVE.
   The live page is served by the Worker from under-review/sheet.js with its stylesheet inline,
   and it uses its own class names rather than the site's: .price .plain .permission .chip
   .gaps .flags details.state .body .row .lab .val .src .note. Every one of them is styled here
   with exactly the meaning it has live.
   The unlock form is untouched. In this static preview nothing serves /rules-sheet/unlock, so
   no key can open anything, and the preview holds no key and no CSV. The real gate in the
   Worker was not changed.
   Fonts and stand-ins: see the comment at the top of platbook.css. Same files, same measured
   numbers, same licences shipped beside them.
   ============================================================================ */
@font-face {
  font-family: 'Vollkorn'; font-style: normal; font-weight: 400 700; font-display: optional;
  src: url('/assets/fonts/vollkorn-latin.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
@font-face {
  font-family: 'Vollkorn'; font-style: normal; font-weight: 400 700; font-display: optional;
  src: url('/assets/fonts/vollkorn-latin-ext.woff2') format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
@font-face {
  font-family: 'Archivo Narrow'; font-style: normal; font-weight: 600; font-display: optional;
  src: url('/assets/fonts/archivo-narrow-600-latin.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
@font-face {
  font-family: 'Archivo Narrow'; font-style: normal; font-weight: 600; font-display: optional;
  src: url('/assets/fonts/archivo-narrow-600-latin-ext.woff2') format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
@font-face { font-family: 'VK400 w Georgia'; src: local('Georgia'); size-adjust: 97.9%; ascent-override: 95.2%; descent-override: 44.1%; line-gap-override: 0%; }
@font-face { font-family: 'VK400 w Times'; src: local('Times New Roman'), local('Times'); size-adjust: 107.0%; ascent-override: 95.2%; descent-override: 44.1%; line-gap-override: 0%; }
@font-face { font-family: 'VK600 w Georgia'; src: local('Georgia'); size-adjust: 88.3%; ascent-override: 95.2%; descent-override: 44.1%; line-gap-override: 0%; }
@font-face { font-family: 'VK600 w Times'; src: local('Times New Roman'), local('Times'); size-adjust: 104.4%; ascent-override: 95.2%; descent-override: 44.1%; line-gap-override: 0%; }
@font-face { font-family: 'VK700 w Georgia'; src: local('Georgia'); size-adjust: 90.7%; ascent-override: 95.2%; descent-override: 44.1%; line-gap-override: 0%; }
@font-face { font-family: 'VK700 w Times'; src: local('Times New Roman'), local('Times'); size-adjust: 107.2%; ascent-override: 95.2%; descent-override: 44.1%; line-gap-override: 0%; }
@font-face { font-family: 'AN600 w Arial'; src: local('Arial'); size-adjust: 81.7%; ascent-override: 103.5%; descent-override: 31.2%; line-gap-override: 0%; }

:root {
  --linen: #eceee9; --linen-2: #e2e5de; --linen-3: #d7dbd3;
  --ink: #1f2420; --ink-soft: #4b534c;
  --survey: #2d4a63; --oxide: #8c3a2a; --hair: #b9bfb6; --rule: #8e968c;
  --body: 'Vollkorn', 'VK400 w Georgia', 'VK400 w Times', Georgia, 'Times New Roman', serif;
  --h1f: 'Vollkorn', 'VK700 w Georgia', 'VK700 w Times', Georgia, 'Times New Roman', serif;
  --h2f: 'Vollkorn', 'VK600 w Georgia', 'VK600 w Times', Georgia, 'Times New Roman', serif;
  --label: 'Archivo Narrow', 'AN600 w Arial', Arial, sans-serif;
  --measure: 66ch;
}

* { box-sizing: border-box; }
html, body { margin: 0; background: var(--linen); color: var(--ink); }
body { font: 400 17px/1.6 var(--body); -webkit-text-size-adjust: 100%; }
main { max-width: 44rem; margin: 0 auto; padding: 2rem 16px 2rem; }
h1 { font: 700 1.875rem/1.15 var(--h1f); margin: 0 0 .6rem; }
/* A plate heading: ruled above, in the section face. Same shape as the rest of the book. */
h2 { font: 600 1.125rem/1.2 var(--h2f); margin: 2.4rem 0 .6rem; border-top: 1px solid var(--ink); padding-top: 1rem; }
h3 { font: 600 1.0625rem/1.25 var(--h2f); margin: 1.4rem 0 .3rem; color: var(--ink); }
p, li { color: var(--ink-soft); max-width: var(--measure); }
ul { padding-left: 1.1rem; }
a { color: var(--survey); text-underline-offset: .15em; }
a:hover { color: var(--ink); }
:focus-visible { outline: 2px solid var(--oxide); outline-offset: 2px; }

.price { font: 700 1.25rem/1.3 var(--h1f); color: var(--ink); }
/* The two plain lines. A note in the margin of the plate, not a tinted banner. */
.plain { border-left: 3px solid var(--ink); padding: .4rem .8rem; margin: 1rem 0; background: var(--linen-2); color: var(--ink); }
.permission { font-size: .9375rem; }
.note { font-size: .875rem; }

/* The stamp. Square, hard-ruled, no fill, no radius. */
.btn {
  display: inline-flex; align-items: center; justify-content: center;
  min-height: 48px; padding: 0 1.2rem;
  border: 2px solid var(--ink); border-radius: 0;
  background: var(--ink); color: var(--linen); text-decoration: none; cursor: pointer;
  font: 600 .8125rem/1 var(--label); letter-spacing: .1em; text-transform: uppercase;
}
.btn:hover { background: var(--survey); border-color: var(--survey); color: var(--linen); }
.btn.off { background: transparent; color: var(--ink-soft); border-style: dashed; cursor: default; }
input[type=text] {
  width: 100%; min-height: 48px; padding: .6rem .75rem; font: inherit;
  border: 1px solid var(--rule); border-radius: 0; background: #f7f8f5; color: var(--ink);
}
input[type=text]:focus { outline: 2px solid var(--oxide); outline-offset: -2px; }
label { display: block; margin: .7rem 0 .25rem; color: var(--ink); font: 600 .6875rem/1.4 var(--label); letter-spacing: .12em; text-transform: uppercase; }

/* The audit flag. "Checked" is a recorder's mark in ink; "checked with gaps" is the same mark
   with a dashed rule, which is how a plat book shows a line that is drawn but not confirmed.
   The distinction is carried by the rule, not by colour alone. */
.chip {
  display: inline-flex; align-items: center; gap: .3rem;
  padding: .1rem .5rem;
  border: 1px solid var(--ink); border-radius: 0;
  background: transparent; color: var(--ink);
  font: 600 .625rem/1.5 var(--label); letter-spacing: .1em; text-transform: uppercase;
}
.chip.gaps { border-style: dashed; color: var(--oxide); border-color: var(--oxide); }
.chip svg { width: .85rem; height: .85rem; }

/* Each state is a plate in the schedule: a hairline above, nothing boxed. */
details.state { border: 0; border-top: 1px solid var(--hair); background: transparent; margin: 0; }
details.state:last-of-type { border-bottom: 1px solid var(--hair); }
details.state > summary {
  cursor: pointer; padding: .8rem 0; min-height: 44px; color: var(--ink);
  list-style-position: inside; font: 600 1.0625rem/1.4 var(--h2f);
}
details.state > summary:hover { background: var(--linen-2); }
details.state > summary .note { display: block; font: 400 .8125rem/1.5 var(--body); color: var(--ink-soft); }
details.state[open] > summary { border-bottom: 1px solid var(--hair); }
.body { padding: .4rem 0 1rem; }
.flags { border-left: 3px solid var(--ink); padding: .3rem .8rem; margin: .7rem 0; background: var(--linen-2); }
.flags.gaps { border-left-style: dashed; border-left-color: var(--oxide); }

/* A row of the schedule: the label in narrow caps, the value below it, one hairline between. */
.row { padding: .55rem 0; border-bottom: 1px solid var(--hair); }
.row .lab { display: block; font: 600 .6875rem/1.4 var(--label); letter-spacing: .12em; text-transform: uppercase; color: var(--ink-soft); }
.row .val { color: var(--ink); font-variant-numeric: tabular-nums; }
@media (min-width: 700px) {
  .row { display: grid; grid-template-columns: 11rem minmax(0, 1fr); gap: .9rem; align-items: baseline; }
}
/* The authority for the line. The quote is set as text, indented and ruled, not in a monospace
   box: in a plat book a recital of the statute is still writing. */
.src { font-size: .875rem; margin: .2rem 0 0; color: var(--ink-soft); }
.src details { display: inline; }
/* The statute link is the whole of its row, so it is a tap target. It measured 19px at 375px
   on the live page: the live stylesheet gives the quote toggle a 44px box but not the link. */
.src > a { display: inline-flex; align-items: center; min-height: 44px; }
.src summary { display: inline-block; min-height: 44px; line-height: 44px; padding: 0 .5rem 0 0; cursor: pointer; color: var(--survey); text-decoration: underline; text-underline-offset: .15em; }
.src summary:hover { color: var(--oxide); }
.src q { display: block; margin: .3rem 0 0; padding: .5rem 0 .5rem .9rem; font-size: .9375rem; line-height: 1.65; font-style: normal; background: transparent; border-left: 2px solid var(--survey); max-width: var(--measure); }

table { border-collapse: collapse; width: 100%; font-size: .9375rem; }
td, th { border-bottom: 1px solid var(--hair); padding: .45rem .6rem .45rem 0; text-align: left; vertical-align: top; }
th { font: 600 .6875rem/1.4 var(--label); letter-spacing: .12em; text-transform: uppercase; border-bottom-color: var(--ink); }

/* The Status link is a paragraph of its own in the footer, so it is a tap target too. The two
   links in the paragraph above it are inside sentences and stay at their text height. */
footer p > a:only-child { display: inline-flex; align-items: center; min-height: 44px; }
footer { max-width: 44rem; margin: 0 auto; padding: 1.2rem 16px 3rem; font-size: .875rem; color: var(--ink-soft); border-top: 3px double var(--ink); }
@media (max-width: 480px) { main { padding-top: 1.25rem; } }
`;

function chip(status) {
  const gaps = status !== 'checked';
  const icon = gaps
    ? '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="1" y="1" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"/><path d="M1 1h7v14H1z" fill="currentColor"/></svg>'
    : '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="1" y="1" width="14" height="14" fill="currentColor"/><path d="M4 8l3 3 5-6" fill="none" stroke="#fbf9f4" stroke-width="2"/></svg>';
  return `<span class="chip${gaps ? ' gaps' : ''}">${icon}${esc(STATUS_LABEL[status] || status)}</span>`;
}

function rowHtml(r) {
  const s = r.src;
  return `<div class="row">${r.label ? `<span class="lab">${esc(r.label)}</span>` : ''}<span class="val">${esc(r.text)}</span>
<div class="src">Source: <a href="${esc(safeUrl(s.url))}" rel="noopener noreferrer">${esc(s.statute)}</a> (${esc(s.kind)}, checked ${esc(s.checked)}) <details><summary>quote</summary><q>${esc(s.quote)}</q></details></div></div>`;
}

export function stateHtml(st, open = false) {
  const flags = st.status === 'checked'
    ? '<div class="flags"><b>Audit flag: checked.</b> Every row below was checked against the official text, and the 2023 to 2026 enacted-law search was run. Rules change; confirm with the county before you bid.</div>'
    : `<div class="flags gaps"><b>Audit flag: checked with gaps.</b> The rows below were checked, but this is not finished:<ul>${st.gaps.map((g) => `<li>${esc(g)}</li>`).join('')}</ul>${st.notShown ? `<p class="note">${esc(st.notShown)} statement${st.notShown === 1 ? ' was' : 's were'} not confirmed and left out. Ask the county about anything you do not see here.</p>` : ''}</div>`;
  return `<details class="state" id="s-${esc(st.code)}"${open ? ' open' : ''}><summary>${esc(st.name)} ${chip(st.status)} <span class="note">${st.rows} sourced rows, last checked ${esc(st.lastChecked)}</span></summary><div class="body">${flags}${st.groups.map((g) => `<h3>${esc(g.label)}</h3>${g.rows.map(rowHtml).join('')}`).join('')}</div></details>`;
}

const DISCLAIMER = 'Not legal or financial advice. Rules change. Confirm with the county before you bid.';
// Two plain lines, shown near the top of the landing page and the full sheet (Lando's wording).
const PLAIN = '<p class="plain"><b>This is information about state rules, not legal advice.</b><br><b>Confirm dates and rules with the county before you bid.</b></p>';

// The one address this page is indexed under, added 2026-11-14 when the sheet was listed.
//
// Hardcoded, not built from the request: this module also answers on www and on the old
// workers.dev name, and canonicalRedirect() in cloudflare/src/worker.js 301s both of those to
// the apex. A canonical link that echoed whichever hostname it was asked on would therefore
// point search engines at a redirect, which tells them the page does not exist where it is
// served. Keep in step with CANONICAL_HOST in that file.
//
// It also drops the ?from= tag on purpose. Every link to this page carries one, and without a
// canonical, /rules-sheet/?from=nav and ?from=home and ?from=about would be three pages as far
// as indexing is concerned, splitting one page three ways.
const CANONICAL = 'https://theplatbook.com' + PATH;

function shell(title, inner, { noindex }) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
${noindex ? '<meta name="robots" content="noindex">' : ''}<title>${esc(title)}</title><link rel="canonical" href="${CANONICAL}"><meta name="theme-color" content="#1f2420">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23eceee9'/%3E%3Crect x='1.5' y='1.5' width='29' height='29' fill='none' stroke='%231f2420' stroke-width='1.5'/%3E%3Ctext x='16' y='23' font-size='17' text-anchor='middle' fill='%231f2420' font-family='Georgia,serif' font-weight='700'%3EP%3C/text%3E%3C/svg%3E">
<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/vollkorn-latin.woff2" crossorigin><link rel="preload" as="font" type="font/woff2" href="/assets/fonts/archivo-narrow-600-latin.woff2" crossorigin>
<style>${CSS}</style></head><body><main>${inner}</main>
<footer><p>${esc(DISCLAIMER)}</p><p>The sheet is free. Polar runs the $0 checkout that takes your email address and sends your key; nothing is charged, so there is nothing to refund. Questions: email <a href="mailto:landonbrewington12+smallhours@gmail.com">landonbrewington12+smallhours@gmail.com</a> or open an issue at <a href="https://github.com/landoCommandoz/aurigen-directory/issues" rel="noopener">github.com/landoCommandoz/aurigen-directory</a>.</p><p><a href="/status.json">Status</a></p></footer></body></html>`;
}

function intro() {
  const n = SHEET.stateCount;
  return `<h1>Platbook Rules Sheet</h1>
<p>How tax sales work in ${n} states, side by side, and for every line, the statute, the official link, the date it was checked and the exact words it rests on.</p>`;
}

function landing(state, cfg = CONFIG, listing = LISTING) {
  // Two clean states as the free sample: the preferred ones if they are in the sheet, else any two "checked" states.
  const clean = SHEET.states.filter((s) => s.status === 'checked');
  const sample = [...clean.filter((s) => SAMPLE_CODES.includes(s.code)), ...clean.filter((s) => !SAMPLE_CODES.includes(s.code))].slice(0, 2);
  const buy = cfg.checkoutUrl && /^https:\/\//.test(cfg.checkoutUrl)
    ? `<a class="btn" href="${esc(cfg.checkoutUrl)}" rel="noopener">Get the sheet free: give an email address</a>`
    : '<span class="btn off" role="note">The free checkout is not connected yet</span>';
  const inner = `${intro()}
${PLAIN}
<p class="price">Free, in exchange for an email address.</p>
<p>Polar takes the email address and sends your key; nothing is charged. The key works for 12 months, and states are added to the sheet as they finish the audit, with no dates promised.</p>
<p class="permission">Your address is used to send your key and to tell you when states are added to the sheet, nothing else, it is never sold or shared, and every update email has a one-click unsubscribe link.</p>
<p>${buy}</p>
<h2>What is in it</h2>
<ul>
<li>${SHEET.stateCount} states: sale type, rate or penalty as set by law, redemption, bid method, where and when the sale is held, how to register and pay, buying after the sale, money left after the sale, and what to check before you bid.</li>
<li>${SHEET.rows} rows, each with its source: the statute, a link to the official page, the date checked, and the quote it rests on.</li>
<li>An audit flag on every state: ${SHEET.checked} are <b>checked</b>; ${SHEET.withGaps} are <b>checked with gaps</b>, and the gaps are listed in plain words.</li>
<li>A CSV download of every row for your own spreadsheet.</li>
</ul>
<h2>What it is not</h2>
<ul>
<li>Not legal or financial advice, and no promise about what any sale will cost or what a property is worth.</li>
<li>Not a list of properties, and not county by county. Counties can add their own rules, so confirm with the county.</li>
<li>Not finished. Some states still have gaps, and the rules change. Statements we could not confirm are left out, not guessed.</li>
</ul>
<h2>Free sample</h2>
<p>Two full states, exactly as a buyer sees them.</p>
${sample.map((s) => stateHtml(s)).join('')}
${state && state.thanks ? '<p role="status"><b>Thank you.</b> Polar emails your license key. Paste it below to open the full sheet.</p>' : ''}
<h2>Already have a key?</h2>
<form method="post" action="${PATH}unlock"><label for="key">License key from your Polar email</label>
<input type="text" id="key" name="key" autocomplete="off" spellcheck="false" maxlength="120" required><p><button class="btn" type="submit">Open the full sheet</button></p></form>
${state && state.error ? `<p role="alert"><b>${esc(state.error)}</b></p>` : ''}
<h2>The ${SHEET.stateCount} states</h2>
<table><tr><th>State</th><th>Audit flag</th><th>Rows</th></tr>${SHEET.states.map((s) => `<tr><td>${esc(s.name)}</td><td>${chip(s.status)}</td><td>${s.rows}</td></tr>`).join('')}</table>
<p class="note">Sheet built ${esc(SHEET.built)}. States not listed are not in this sheet yet.</p>`;
  return shell('Platbook Rules Sheet', inner, { noindex: !listing.listed });
}

function full(key) {
  const inner = `${intro()}${PLAIN}<p><b>Key accepted.</b> Every state is below. Open a state to read its rows.</p>
<form method="post" action="${PATH}sheet.csv"><input type="hidden" name="key" value="${esc(key)}"><button class="btn" type="submit">Download the CSV</button></form>
<h2>The ${SHEET.stateCount} states</h2>
${SHEET.states.map((s) => stateHtml(s)).join('')}`;
  return shell('Platbook Rules Sheet (full)', inner, { noindex: true });
}

export const csvCell = (v) => {
  let s = String(v ?? '');
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
};
export function csv() {
  const out = [['state', 'audit_flag', 'group', 'field', 'text', 'statute', 'source_type', 'official_url', 'date_checked', 'quote'].join(',')];
  for (const s of SHEET.states) for (const g of s.groups) for (const r of g.rows) {
    out.push([s.name, s.status, g.label, r.label || '', r.text, r.src.statute, r.src.kind, r.src.url, r.src.checked, r.src.quote].map(csvCell).join(','));
  }
  return out.join('\r\n') + '\r\n';
}

// Returns 'ok', 'invalid', 'unavailable' or 'not_configured'. The key is sent to Polar and never stored.
export async function checkKey(key, env = {}, fetchFn = fetch, cfg = CONFIG) {
  if (!cfg.benefitId || !cfg.orgId) return 'not_configured';
  key = String(key || '').trim();
  if (!/^[A-Za-z0-9_-]{8,120}$/.test(key)) return 'invalid';
  let res;
  try {
    res = await fetchFn(env.POLAR_VALIDATE_URL || POLAR_VALIDATE, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'user-agent': 'PlatbookRulesSheet/1.0' },
      body: JSON.stringify({ key, organization_id: cfg.orgId, benefit_id: cfg.benefitId }),
    });
  } catch { return 'unavailable'; }
  if (res.status >= 500) return 'unavailable';
  if (!res.ok) return 'invalid';
  let d;
  try { d = await res.json(); } catch { return 'unavailable'; }
  const expired = d.expires_at && Date.parse(d.expires_at) < Date.now();
  return d.status === 'granted' && !expired && (!d.benefit_id || d.benefit_id === cfg.benefitId) ? 'ok' : 'invalid';
}

// This is the page people type a licence key into, so the policy starts at "nothing is
// allowed" and only names what this page itself uses. Written out one line at a time because
// the shape of it is the point.
//
// What it does NOT name is as deliberate as what it does: there is no script-src and no
// connect-src, so both fall back to default-src 'none' and every script - ours, Cloudflare's
// analytics beacon, or anything injected - is refused by the browser. Lando's decision,
// 2026-11-08: the visitor counter stays off this page.
//
// Until 2026-11-08 the policy was "default-src 'none'; style-src 'unsafe-inline'; ..." which
// also blocked the page's own icon and its font files, so the sheet had been rendering in
// fallback fonts with no icon. Tightened again 2026-11-19 when the site stopped using Google
// Fonts: both webfonts are served from this site, so the two Google origins are gone and
// font-src is 'self'. If a font ever stops rendering on this page, look here first: a font
// blocked by the policy fails exactly like a font that is not there, and the measured stand-in
// faces then render the page correctly, which is precisely what hides the problem.
const CSP = [
  "default-src 'none'",                                   // the floor: scripts included
  "style-src 'unsafe-inline'",                            // the inline <style>, nothing third party
  "font-src 'self'",                                      // the two webfonts, served from this site
  'img-src data:',                                        // the icon, which is inline in the page
  "form-action 'self'",                                   // the key form may only post back here
  "base-uri 'none'",
  "frame-ancestors 'none'",
].join('; ');

const headers = (extra = {}, noindex = true) => ({
  'cache-control': 'no-store',
  'content-security-policy': CSP,
  'referrer-policy': 'no-referrer',
  'x-content-type-options': 'nosniff',
  ...(noindex ? { 'x-robots-tag': 'noindex' } : {}),
  ...extra,
});
const html = (body, status = 200, noindex = true) => new Response(body, { status, headers: headers({ 'content-type': 'text/html; charset=utf-8' }, noindex) });

async function formKey(request) {
  try { return String((await request.formData()).get('key') || ''); } catch { return ''; }
}

// Returns a Response for the sheet routes, or null when the path is not one of them.
export async function handleSheet(request, env = {}, fetchFn = fetch, cfg = CONFIG, listing = LISTING) {
  const url = new URL(request.url);
  const p = url.pathname;
  if (p !== PATH.slice(0, -1) && !p.startsWith(PATH)) return null;
  if (p === PATH.slice(0, -1)) return Response.redirect(url.origin + PATH, 301);
  const sub = p.slice(PATH.length);
  if (sub === '' && request.method === 'GET') return html(landing({ thanks: url.searchParams.get('thanks') === '1' }, cfg, listing), 200, !listing.listed);
  if ((sub === 'unlock' || sub === 'sheet.csv') && request.method === 'POST') {
    const key = await formKey(request);
    const r = await checkKey(key, env, fetchFn, cfg);
    if (r === 'ok') {
      return sub === 'unlock' ? html(full(key.trim())) : new Response(csv(), { headers: headers({ 'content-type': 'text/csv; charset=utf-8', 'content-disposition': 'attachment; filename="aurigen-rules-sheet.csv"' }) });
    }
    const msg = { invalid: 'That key was not accepted. Check it and try again.', unavailable: 'The license service did not answer. Try again in a minute.', not_configured: 'Checkout and keys are not connected yet.' }[r];
    return html(landing({ error: msg }, cfg, listing), r === 'invalid' ? 403 : 503);
  }
  return new Response('Not found', { status: 404, headers: headers({ 'content-type': 'text/plain; charset=utf-8' }) });
}

export const listed = (listing = LISTING) => !!listing.listed;
// The link added to the under-review page footer, only once the sheet is published.
export const homeFooterLink = (listing = LISTING) => (listing.listed ? ' &middot; <a href="/rules-sheet/">Rules Sheet</a>' : '');
