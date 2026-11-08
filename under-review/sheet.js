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
/* Platbook: the same cyanotype ink on warm paper as the site. One set of tokens. */
:root{--bg:#f3ebdc;--ink:#10222f;--muted:#4a5863;--line:#cbb99c;--card:#fbf6ec;--accent:#0b3550;--well:#ece1cd;--mono:'Space Mono','Consolas','Courier New',monospace}
*{box-sizing:border-box}html,body{margin:0;background:var(--bg);color:var(--ink)}
body{font:clamp(16px,2.4vw,18px)/1.6 'Public Sans','Segoe UI','Helvetica Neue',sans-serif}
main{max-width:46rem;margin:0 auto;padding:6vh 16px 2rem}
h1{font-family:'Fraunces','Hoefler Text',Georgia,serif;font-size:clamp(1.5rem,5vw,2rem);font-weight:600;line-height:1.15;margin:0 0 .75rem}
h2{font-family:'Fraunces','Hoefler Text',Georgia,serif;font-size:1.2rem;font-weight:600;margin:2.2rem 0 .6rem;border-top:1px solid var(--line);padding-top:1.2rem}
p,li{color:var(--muted)}ul{padding-left:1.2rem}a{color:var(--accent)}
.price{font-size:1.4rem;color:var(--ink)}.plain{border-left:3px solid var(--accent);padding:.3rem .8rem;margin:1rem 0;background:var(--well);color:var(--ink)}
.btn{display:inline-block;min-height:44px;padding:.65rem 1.1rem;border:1px solid var(--accent);background:var(--accent);color:#f6f1e6;text-decoration:none;font:inherit;cursor:pointer;border-radius:4px}
.btn.off{background:transparent;color:var(--muted);border-style:dashed;cursor:default}
input[type=text]{width:100%;min-height:44px;padding:.5rem;font:inherit;border:1px solid var(--accent);background:var(--card);color:var(--ink);border-radius:4px}
label{display:block;margin:.6rem 0 .25rem;color:var(--ink)}
.chip{display:inline-flex;align-items:center;gap:.35rem;padding:.1rem .55rem;font-family:var(--mono);font-size:.75rem;letter-spacing:.04em;text-transform:uppercase;border:2px solid var(--accent);color:var(--accent);background:var(--card)}
.chip.gaps{border-style:dashed}
.chip svg{width:.9rem;height:.9rem}
details.state{border:1px solid var(--line);background:var(--card);margin:.6rem 0}
details.state>summary .note{display:block}details.state>summary{cursor:pointer;padding:.7rem .8rem;min-height:44px;color:var(--ink);list-style-position:inside}
.body{padding:0 .8rem .8rem}
.flags{border-left:3px solid var(--accent);padding:.1rem .8rem;margin:.6rem 0;background:var(--well)}
.flags.gaps{border-left-style:dashed}
h3{font-size:1rem;margin:1.2rem 0 .3rem;color:var(--ink)}
.row{padding:.5rem 0;border-bottom:1px solid var(--line)}
.row .lab{font-family:var(--mono);font-size:.7rem;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);display:block}
.row .val{color:var(--ink)}
.src{font-size:.82rem;margin:.2rem 0 0;color:var(--muted)}
.src details{display:inline}.src summary{display:inline-block;min-height:44px;line-height:44px;padding:0 .5rem;cursor:pointer;color:var(--accent);text-decoration:underline}
.src q{display:block;margin:.3rem 0 0;font-family:var(--mono);font-size:.82rem;line-height:1.7;font-style:normal;background:var(--card);border-left:3px solid var(--accent);padding:.5rem .7rem}
table{border-collapse:collapse;width:100%;font-size:.95rem}td,th{border-bottom:1px solid var(--line);padding:.4rem .3rem;text-align:left;vertical-align:top}
.note{font-size:.85rem}footer{max-width:46rem;margin:0 auto;padding:1rem 16px 3rem;font-size:.85rem;color:var(--muted)}
@media(max-width:480px){main{padding-top:3vh}}
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

function shell(title, inner, { noindex }) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
${noindex ? '<meta name="robots" content="noindex">' : ''}<title>${esc(title)}</title><meta name="theme-color" content="#0b3550">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='4' fill='%230b3550'/%3E%3Ctext x='16' y='23' font-size='19' text-anchor='middle' fill='%23f6f1e6' font-family='monospace' font-weight='700'%3EP%3C/text%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=Public+Sans:wght@400;500;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
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
// also blocked the page's own icon and its Google Fonts stylesheet, so the sheet had been
// rendering in fallback fonts with no icon. The three lines that fix that allow exactly the
// two origins the rest of the site already uses, and data: for the inline icon. Nothing else.
const CSP = [
  "default-src 'none'",                                   // the floor: scripts included
  "style-src 'unsafe-inline' https://fonts.googleapis.com", // the inline <style> and the font stylesheet
  'font-src https://fonts.gstatic.com',                   // the font files that stylesheet asks for
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
