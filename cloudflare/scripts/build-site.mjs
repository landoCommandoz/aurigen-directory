// Platbook site build: turns data/*.json into static pages in public/.
// Maps are pre-rendered SVG from the Census-based us-atlas TopoJSON (build-time only).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { geoPath, geoAlbersUsa, geoMercator, geoCentroid } from 'd3-geo';
import { feature } from 'topojson-client';
import { FIELD_ORDER, loadLedger, claimNote } from './law-pieces.mjs';
import { countyTextProblems } from './county-text.mjs';
// The five beginner lessons. PARKED: LESSONS_APPROVED is false, so nothing below writes them,
// links them or puts them in the sitemap. See the note at the top of lessons.mjs.
import { LESSONS_APPROVED, lessons, lessonsIndexBody, LESSONS_BASE } from './lessons.mjs';

const require = createRequire(import.meta.url);
const here = path.dirname(fileURLToPath(import.meta.url));
const BASE = path.resolve(here, '..');
const DATA = path.join(BASE, 'data');
const PUB = path.join(BASE, 'public');
// The canonical address, the sitemap and the link previews are all built from this.
// Both workers.dev addresses are permanent 301s to theplatbook.com now, so neither can ever be
// the canonical one: a canonical link pointing at a redirect tells search engines the page does
// not exist where it is served. UPDATED 2026-11-17: the deploy workflow now
// passes https://theplatbook.com, because the permission to edit those files was turned on today
// and the stale address was corrected at its source. This guard STAYS anyway, deliberately: it
// costs nothing and it is the only thing between a reverted or mistyped SITE_URL and a canonical
// link pointing at a redirect. One dead workflow, domain-attach.yml, still names the old address
// on purpose, because it was written for the retired holding-page world and is not used.
// Any other SITE_URL is obeyed, so a staging address or a future domain needs no change here.
const RETIRED = /^https?:\/\/(aurigen|platbook)\.landonbrewington12\.workers\.dev\/?$/i;
const PASSED = (process.env.SITE_URL || '').trim().replace(/\/+$/, '');
if (PASSED && RETIRED.test(PASSED)) console.warn(`build-site: ignoring SITE_URL=${PASSED} (that address redirects here); using https://theplatbook.com.`);
const SITE_URL = PASSED && !RETIRED.test(PASSED) ? PASSED : 'https://theplatbook.com';
// Cloudflare Web Analytics. Lando switched the site to "JS snippet" installation on
// 2026-11-08, which turns Cloudflare's automatic injection OFF - and automatic injection does
// not reach pages served by a Worker anyway. So the beacon is put in here, on every page.
//
// Exactly the snippet the dashboard gives, type="module" and all, so the two can be compared
// by looking rather than by reasoning. A module script defers by default, so it cannot hold
// up the page.
//
// data/beacon.json holds the site token. It is public by design: it sits in the source of
// every page, where anyone can read it. The only thing it permits is sending made-up visits
// to our own analytics, which is true of every site using the snippet. While it is empty the
// site loads no third-party script at all, which is where to return if it is ever withdrawn.
// Nothing in this site sets a Content-Security-Policy, so nothing blocks it.
//
// If Cloudflare's automatic injection is ever switched back on, remove the token from
// beacon.json in the same change: two beacons on one page counts every visit twice.
const BEACON = (() => {
  try {
    const t = String(JSON.parse(fs.readFileSync(path.join(DATA, 'beacon.json'), 'utf8')).token || '').trim();
    return /^[A-Za-z0-9]{8,64}$/.test(t)
      ? `<!-- Cloudflare Web Analytics --><script type="module" src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "${t}"}'></script><!-- End Cloudflare Web Analytics -->\n`
      : '';
  } catch { return ''; }
})();

const DISCLAIMER = 'Not legal or financial advice. Rules change. Confirm with the county before you bid.';

// States Platbook has not been able to read from an official source. A pending state
// asserts nothing: see cloudflare/data/law/pending.json. Nothing below may state its law.
const PENDING = (() => {
  const p = path.join(DATA, 'law', 'pending.json');
  if (!fs.existsSync(p)) return {};
  return JSON.parse(fs.readFileSync(p, 'utf8')).states || {};
})();
const pendingOf = (code) => PENDING[String(code || '').toUpperCase()] || null;
const isPending = (code) => !!pendingOf(code);
const PENDING_LABEL = 'Verification pending';
const UNVERIFIED = '<em class="unverified">Not yet verified</em>';

const FIPS = { AL: '01', AK: '02', AZ: '04', AR: '05', CA: '06', CO: '08', CT: '09', DE: '10', DC: '11', FL: '12', GA: '13', HI: '15', ID: '16', IL: '17', IN: '18', IA: '19', KS: '20', KY: '21', LA: '22', ME: '23', MD: '24', MA: '25', MI: '26', MN: '27', MS: '28', MO: '29', MT: '30', NE: '31', NV: '32', NH: '33', NJ: '34', NM: '35', NY: '36', NC: '37', ND: '38', OH: '39', OK: '40', OR: '41', PA: '42', RI: '44', SC: '45', SD: '46', TN: '47', TX: '48', UT: '49', VT: '50', VA: '51', WA: '53', WV: '54', WI: '55', WY: '56' };
const TYPES = [
  ['lien', 'Tax lien'], ['deed', 'Tax deed'], ['hybrid', 'Hybrid'], ['redeemable', 'Redeemable deed'], ['other', 'Other'],
];

// ---------- helpers ----------
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const isUrl = (s) => typeof s === 'string' && /^https?:\/\/[^\s"'<>]+$/.test(s.trim());
const link = (u, text) => isUrl(u) ? `<a href="${esc(u.trim())}" rel="noopener nofollow" target="_blank">${esc(text || u.replace(/^https?:\/\//, '').replace(/\/$/, ''))}</a>` : esc(text || u);
const human = (k) => String(k).replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase());
// First sentence, ending in a single full stop: for meta descriptions, where a long
// explanatory field would otherwise crowd out everything after it.
const firstSentence = (v) => { const t = String(v ?? '').trim(); if (!t) return ''; const m = t.match(/^[^.!?]*[.!?]/); return (m ? m[0] : t + '.').trim(); };
const slug = (s) => String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const write = (rel, html) => { const p = path.join(PUB, rel); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, html); };
const typeName = (t) => (TYPES.find(([k]) => k === t) || [t, 'Other'])[1];

function renderValue(v, depth = 0) {
  if (v == null || v === '' || (Array.isArray(v) && !v.length)) return '';
  if (typeof v === 'boolean') return v ? 'Yes' : 'No';
  if (typeof v !== 'object') return isUrl(String(v)) ? link(String(v)) : esc(v);
  if (Array.isArray(v)) {
    const items = v.map((x) => renderValue(x, depth + 1)).filter(Boolean);
    return items.length ? `<ul>${items.map((x) => `<li>${x}</li>`).join('')}</ul>` : '';
  }
  const rows = Object.entries(v).map(([k, x]) => [k, renderValue(x, depth + 1)]).filter(([, x]) => x);
  if (!rows.length) return '';
  return `<dl class="kv${depth ? ' kv-nested' : ''}">${rows.map(([k, x]) => `<div><dt>${esc(human(k))}</dt><dd>${x}</dd></div>`).join('')}</dl>`;
}

// ---------- data ----------
const index = JSON.parse(fs.readFileSync(path.join(DATA, 'index.json'), 'utf8'));
const states = index.map((s) => JSON.parse(fs.readFileSync(path.join(DATA, 'states', `${s.code.toLowerCase()}.json`), 'utf8')));
let fresh = {};
try { fresh = JSON.parse(fs.readFileSync(path.join(DATA, 'freshness.json'), 'utf8')); } catch { /* none yet */ }

// Apply official-source changes from the freshness check (old value kept in the note).
for (const s of states) {
  const f = fresh[s.code];
  s.fresh = f && f.status ? f : { status: 'unconfirmed' };
  if (f?.status === 'changed') {
    for (const c of f.changes || []) {
      if (!['rate', 'redemption', 'type', 'bidMethod'].includes(c.field) || !c.new) continue;
      s[c.field] = c.new;
      if (c.field === 'type') s.typeLabel = typeName(c.new);
      for (const k of s.counties) if (c.field === 'redemption' || c.field === 'rate') {
        // Only counties that inherited the old state value are updated.
        if (k[c.field] === c.old) k[c.field] = c.new;
      }
    }
  }
}

// Audited states render only ledger text (cloudflare/data/law/<st>.json, see check-law.mjs).
for (const s of states) {
  const L = loadLedger(s.code);
  if (!L) continue;
  s.ledger = L;
  s.fresh = { status: 'audited', lastChecked: L.auditedAt || '' };
  const one = (id) => { const c = L.claims.find((x) => x.id === id); return c ? c.shown : null; };
  if (one('rate') != null) s.rate = one('rate');
  if (one('redemption') != null) s.redemption = one('redemption');
  if (one('type') != null) s.typeLabel = one('type');
}

// ---------- ledger rendering ----------
const shownClaims = (L, field, lang) => L.claims.filter((c) => c.field === field && c.lang === lang && c.shown !== '');
function claimHtml(c) {
  const note = claimNote(c);
  if (!note) return esc(c.shown);
  if (c.effective && c.status !== 'flagged' && c.status !== 'unreachable') return `<b>${esc(note)}</b> ${esc(c.shown)}`;
  return `${esc(c.shown)} <em class="claim-flag">(${esc(note)})</em>`;
}
const joinClaims = (cs) => cs.map(claimHtml).join(' ');
// Every claim's own words from the statute, with the official link it was read from.
// Free to read: no public fact sits behind a paywall, so the Rules Sheet sells the
// compilation, never the law. Same shape the sheet uses, so the two can be compared.
function claimQuotes(cs) {
  const seen = new Map();
  for (const c of cs) {
    const q = String(c.quote || '').trim();
    if (!q) continue;
    const st = String(c.statute || '');
    const key = `${st}|${c.url || ''}|${q}`;
    if (seen.has(key)) continue;
    const label = st && !st.startsWith('none:') ? st : String(c.url || '').replace(/^https?:\/\//, '');
    const cite = isUrl(c.url) ? link(c.url, label) : esc(label);
    const checked = c.checked ? ` — checked ${esc(String(c.checked).slice(0, 10))}` : '';
    // This state serves its code only to a browser, so a person opened the official page and
    // pasted the text. Never hide that: say who, and when, right under the words it supports.
    const byHand = c.readBy
      ? `<br><span class="byhand">Read by hand from the official page by ${esc(c.readBy)}${c.readAt ? ` on ${esc(String(c.readAt).slice(0, 10))}` : ''}, because this state serves its code only to a browser. A screenshot of the page is kept on file.</span>`
      : '';
    seen.set(key, `<details class="quote"><summary>Statute text</summary><blockquote><p>${esc(q)}</p><footer>${cite}${checked}${byHand}</footer></blockquote></details>`);
  }
  return [...seen.values()].join('');
}
// List fields: items are numbered field.N or field.N.M; sentences of one item share a bullet.
function listClaims(cs) {
  const items = new Map();
  for (const c of cs) {
    const key = c.id.replace(/^es\./, '').split('.').slice(0, c.field.split('.').length + 1).join('.');
    if (!items.has(key)) items.set(key, []);
    items.get(key).push(c);
  }
  return items.size ? `<ul>${[...items.values()].map((g) => `<li>${joinClaims(g)}${claimQuotes(g)}</li>`).join('')}</ul>` : '';
}
function auditedFacts(st, L) {
  const f = (field) => joinClaims(shownClaims(L, field, 'en'));
  const q = (field) => claimQuotes(shownClaims(L, field, 'en'));
  const statuteUrl = (L.claims.find((c) => c.field === 'statute' && c.lang === 'en') || {}).url;
  const cell = (field, html) => (f(field) ? html + q(field) : UNVERIFIED);
  return [
    ['Sale type', cell('type', `<span class="pill t-${st.type}">${f('type')}</span>`)],
    ['Interest / penalty', f('rate') ? f('rate') + (f('rateNote') ? `<small>${f('rateNote')}</small>` : '') + q('rate') + q('rateNote') : UNVERIFIED],
    ['Redemption', cell('redemption', f('redemption'))],
    ['Bid method', cell('bidMethod', f('bidMethod'))],
    ['Statute', cell('statute', statuteUrl ? `<a href="${esc(statuteUrl)}" rel="noopener nofollow" target="_blank">${f('statute')}</a>` : f('statute'))],
    ['Auction platform', cell('auctionPlatform', f('auctionPlatform'))],
    ['Auction timing', cell('auctionTiming', f('auctionTiming'))],
  ];
}
function auditedProse(st, L) {
  const hasEs = L.claims.some((c) => c.lang === 'es');
  const bi = (fn) => hasEs ? `<div data-lang="en">${fn('en')}</div><div data-lang="es" lang="es">${fn('es')}</div>` : fn('en');
  const para = (field, lang, label = '') => { const cs = shownClaims(L, field, lang); const h = joinClaims(cs); return h ? `<p>${label}${h}</p>${claimQuotes(cs)}` : ''; };
  const list = (field, lang) => listClaims(shownClaims(L, field, lang));
  const sec = (title, fields, renderer) => {
    const any = fields.some((fl) => shownClaims(L, fl, 'en').length || shownClaims(L, fl, 'es').length);
    return any ? `<h3>${title}</h3>${bi(renderer)}` : '';
  };
  return `<section class="prose">
  <h2>Summary</h2>
  ${bi((l) => para('summary', l) + para('typeWhy', l) + para('rateWhy', l))}
  ${sec('Key points', ['keyNotes'], (l) => list('keyNotes', l))}
  ${sec('For beginners', ['notBeginnerReason', 'beginnerTip'], (l) => para('notBeginnerReason', l, l === 'es' ? '<b>Más difícil para principiantes:</b> ' : '<b>Harder for beginners:</b> ') + para('beginnerTip', l))}
  ${sec('Risks', ['risks'], (l) => list('risks', l))}
  ${sec('Extra due diligence', ['ddExtra'], (l) => list('ddExtra', l))}
  ${sec('How to sign up for the auction', ['signup.platform', 'signup.steps', 'signup.deposit'], (l) => para('signup.platform', l, '<b>Platform:</b> ') + list('signup.steps', l) + para('signup.deposit', l, l === 'es' ? '<b>Depósito:</b> ' : '<b>Deposit:</b> '))}
  ${sec('Over the counter (OTC)', ['otc.available', 'otc.note'], (l) => para('otc.available', l) + para('otc.note', l))}
  ${sec('Platforms', ['platforms'], (l) => list('platforms', l))}
  ${sec('Surplus proceeds', ['surplus'], (l) => para('surplus', l))}
  ${hasEs ? '<p class="muted" data-lang="es" lang="es">La lista de condados y las fuentes están en inglés.</p>' : ''}
</section>`;
}
function ledgerSources(L) {
  const seen = new Map();
  for (const c of L.claims) {
    if (c.lang !== 'en' || !c.url || !c.statute) continue;
    const key = `${c.statute}|${c.url}`;
    if (!seen.has(key)) seen.set(key, `${link(c.url, c.statute.startsWith('none:') ? c.url.replace(/^https?:\/\//, '') : c.statute)} — checked ${esc(String(c.checked).slice(0, 10))}`);
  }
  for (const c of L.claims) if (c.lang === 'en' && c.status === 'unreachable') seen.set(`u|${c.id}`, `${esc(c.statute || c.field)}: Couldn't reach source on ${esc(String(c.checked || c.attemptedAt || '').slice(0, 10))}. Confirm with the county.`);
  return [...seen.values()];
}
// County details carry a source only when the ledger cites the county's own official page.
// A county's "extra" block is free-form research and goes straight to the page, so it is
// cleaned on the way out. Two things never reach a visitor:
//
//   * a placeholder left in the data. 21 Maryland counties carried rate:"VERIFY", which the
//     drawer printed as "Interest / penalty: VERIFY" - a note to ourselves, published.
//   * on a state whose source Platbook has not read yet, anything that states the law. New
//     York's 62 counties each carried method:"In-rem deed foreclosure" (and Bronx: "NYC Lien
//     Sale - NOT public"), so 63 claims about New York law were printed on the one page that
//     promises in bold that nothing on it states New York law.
//
// Removing a value is always allowed here; nothing in this function can change one.
const PLACEHOLDER = /^(verify|tbd|todo|fixme|n[/]?a|null|unknown|[?]+|x{2,})$/i;
// A marker we wrote for ourselves, as opposed to prose that happens to say a date is not set
// yet. Six Illinois counties published notes reading "[VERIFY] domain" and "[VERIFY] - Yahoo
// email on record"; "fall 2026 (date TBD)" is a real answer and stays.
const INTERNAL_NOTE = /(^|\s)[[(](verify|tbd|todo|fixme|check|needs? \w+)[\])]|(^|\s)(todo|fixme|xxx)\s*:/i;
const cleanNotes = (notes) => (Array.isArray(notes) ? notes : [])
  .filter((n) => typeof n === 'string' && n.trim() && !INTERNAL_NOTE.test(n));
const LEGAL_KEY = /^(rate|redemption|period|premium|statute|method|bidMethod|minBid|fee|assignmentFee|transferTax|taxCodeAuth)$/;
function cleanExtra(v, pend) {
  if (v == null) return undefined;
  if (typeof v === 'string') {
    const t = v.trim();
    return !t || PLACEHOLDER.test(t) ? undefined : v;
  }
  if (typeof v !== 'object') return v;
  if (Array.isArray(v)) {
    const a = v.map((x) => cleanExtra(x, pend)).filter((x) => x !== undefined);
    return a.length ? a : undefined;
  }
  const o = {};
  for (const [k, val] of Object.entries(v)) {
    if (pend && LEGAL_KEY.test(k)) continue;
    const c = cleanExtra(val, pend);
    if (c !== undefined) o[k] = c;
  }
  return Object.keys(o).length ? o : undefined;
}

function countySource(st, c) {
  const s = st.ledger?.countySources?.[c.name];
  return s && isUrl(s.url) ? { u: s.url, t: s.title || '', d: String(s.checked).slice(0, 10) } : null;
}

// ---------- geography ----------
const usStates = require('us-atlas/states-10m.json');
const usCounties = require('us-atlas/counties-10m.json');
const stateFeatures = feature(usStates, usStates.objects.states).features;
const countyFeatures = feature(usCounties, usCounties.objects.counties).features;

const norm = (n) => String(n).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/\([^)]*\)/g, '')
  .replace(/\b(city and borough|census area|borough|municipality|parish|county|city|town|of|and)\b/g, '')
  .replace(/\bsaint\b/g, 'st').replace(/[^a-z]/g, '').replace(/^shannon$/, 'oglalalakota'); // SD county renamed 2015

function matchCounties(st) {
  const fips = FIPS[st.code];
  const feats = countyFeatures.filter((f) => f.id.startsWith(fips));
  const used = new Map();
  const unmatched = [];
  if (st.code === 'CT') return { feats, byFeat: used, unmatched: [] }; // sold by town; shapes are counties
  st.counties.forEach((c, i) => {
    const isCity = /\bcity\b/i.test(c.name) && !/city and borough/i.test(c.name);
    const n = norm(c.name);
    let cands = feats.filter((f) => norm(f.properties.name) === n);
    if (cands.length > 1 && cands.some((f) => Number(f.id.slice(2)) >= 500)) cands = cands.filter((f) => (Number(f.id.slice(2)) >= 500) === isCity);
    else if (cands.length > 1) cands = cands.filter((f) => /city/i.test(f.properties.name) === isCity);
    const f = cands.find((x) => !used.has(x.id));
    if (f) used.set(f.id, i); else unmatched.push(c.name);
  });
  return { feats, byFeat: used, unmatched };
}

function nationalMap() {
  const proj = geoAlbersUsa().fitSize([960, 600], { type: 'FeatureCollection', features: stateFeatures });
  const p = geoPath(proj).digits(1);
  const byFips = Object.fromEntries(Object.entries(FIPS).map(([c, f]) => [f, c]));
  const typeOf = Object.fromEntries(states.map((s) => [s.code, s]));
  const paths = stateFeatures.map((f) => {
    const code = byFips[f.id]; const s = typeOf[code];
    const d = p(f); if (!d || !s) return '';
    // A sale-type colour is itself a claim about the law, so a pending state takes the neutral tone.
    const pend = isPending(code);
    const ty = pend ? 'none' : s.type;
    const lab = pend ? PENDING_LABEL : s.typeLabel;
    return `<a href="/state/${code.toLowerCase()}/" data-type="${ty}" aria-label="${esc(s.name)}: ${esc(lab)}"><path class="t-${ty}" d="${d}"><title>${esc(s.name)} — ${esc(lab)}</title></path></a>`;
  }).join('');
  return `<svg class="map" viewBox="0 0 960 600" role="img" aria-label="United States map shaded by tax sale type">${paths}</svg>`;
}

function countyMap(st, m) {
  if (!m.feats.length) return '';
  const fc = { type: 'FeatureCollection', features: m.feats };
  const [lon] = geoCentroid(fc);
  const proj = geoMercator().rotate([-lon, 0]).fitSize([600, 460], fc);
  const p = geoPath(proj).digits(1);
  // Shading a county by sale type is a claim about the law, so a pending state is drawn flat.
  const pend = isPending(st.code);
  const paths = m.feats.map((f) => {
    const d = p(f); if (!d) return '';
    const i = m.byFeat.get(f.id);
    if (st.code === 'CT') return `<path class="t-${pend ? 'none' : st.type} ct" d="${d}" data-ct="1"><title>${esc(f.properties.name)} County (towns listed below)</title></path>`;
    if (i == null) return `<path class="t-none" d="${d}"><title>${esc(f.properties.name)} (no record)</title></path>`;
    const c = st.counties[i];
    return `<path class="t-${pend ? 'none' : c.saleType}" d="${d}" data-i="${i}" tabindex="0" role="button" aria-label="${esc(c.name)}"><title>${esc(c.name)}</title></path>`;
  }).join('');
  return `<svg class="map county-map" viewBox="0 0 600 460" role="img" aria-label="${esc(st.name)} county map${pend ? '' : ' shaded by sale type'}">${paths}</svg>`;
}

// ---------- the free Rules Sheet ----------
// The sheet's own page is drawn by the Worker (under-review/sheet.js), not by this build, so the
// only two things this file needs are its counts, for the home page block, and whether it is
// listed yet.
//
// EVERY LINK BELOW IS GATED ON `listed`. While the sheet is unlisted it carries noindex and a
// link from here would point search engines at a page that tells them to go away, which is worse
// than no link at all. `node launch/publish.mjs --undo` has to genuinely undo the publish, so the
// nav link, the home block, the about link and the sitemap entry all go when it flips back.
//
// THE COUNTS ARE READ, NEVER TYPED. Lando, 2026-11-14: "Use the real counts from the data and
// don't type a number by hand." sheet.json is built by foundry/tools/build-sheet.mjs out of
// claims that passed the audit gate, so these numbers change on their own and the page follows.
const SHEET = JSON.parse(fs.readFileSync(path.join(BASE, '..', 'under-review', 'sheet.json'), 'utf8'));
const SHEET_LISTED = !!JSON.parse(fs.readFileSync(path.join(BASE, '..', 'under-review', 'sheet-listing.json'), 'utf8')).listed;
const SHEET_PATH = '/rules-sheet/';
// Each place the sheet is linked from carries its own tag, so the counter that already exists in
// src/worker.js records them apart. Lando asked for exactly these three names.
const sheetHref = (from) => `${SHEET_PATH}?from=${from}`;
const num = (n) => Number(n).toLocaleString('en-US');

// ---------- layout ----------
const css = fs.readFileSync(path.join(BASE, 'src', 'site.css'), 'utf8');
const js = fs.readFileSync(path.join(BASE, 'src', 'app.js'), 'utf8');
const ver = (s) => { let h = 0; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) | 0; return (h >>> 0).toString(36); };
const CSS_HREF = `/assets/site.css?v=${ver(css)}`;
const JS_SRC = `/assets/app.js?v=${ver(js)}`;

/* The stylesheet below is linked, NOT inlined, on purpose. Inlining its 8.7KB would save one
   same-origin round trip on first paint. Tried on 2026-11-17 and reverted: the pending-state
   guard further down this file reads the built HTML as a plain string, and the stylesheet
   defines .pill.t-lien and its three siblings, so every inlined page looked like a pending
   state shading itself and the build failed with 16 problems. That guard is what keeps GA, IN,
   NY and TN from stating law, so it was left untouched and the round trip was left on the
   table. Anyone revisiting this strips the style element before those checks, never relaxes
   them. The font stylesheet beside it IS off the critical path, which was the bigger half. */
function page({ title, desc, canonical, body, extraHead = '' }) {
  // THE HEADING FONT IS PRELOADED ON EVERY PAGE, AND IT COSTS FIRST PAINT. Measured 2026-11-17 on
  // the Lighthouse mobile profile (412x823, 4x CPU, 1.6Mbps, 150ms RTT), medians of five runs with
  // the cache off and text served compressed:
  //     home page    996ms -> 1,148ms at 360px, 960ms -> 1,140ms at 390px
  //     /state/fl/   724ms ->   804ms,  /state/ga/  648ms -> 736ms
  // What it buys is every heading and paragraph standing still. The home hero headline needs 3
  // lines in Fraunces where the fallback needs 2 at 360px, a line break boundary no size-adjust
  // value can close (swept 86 to 100 percent), so without the font in hand before paint it jumps
  // 36px. Preloading on the home page alone was tried and rejected: the 35KB same-origin fetch
  // delays the third-party body font just enough that a paragraph on a state page re-wraps and
  // moves content 26px, which showed up on 1 run in 10 at 360px where the old build showed 0 in
  // 20. Preloading everywhere put it back to 0 in 14.
  // So the trade is roughly 80 to 150ms of first paint against every shift on the site. If Lando
  // would rather have the milliseconds, change true to canonical === '/' and re-run the state page
  // shift check before believing it is safe.
  const preloadHead = true
    ? '\n<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/fraunces-600-latin.woff2" crossorigin>'
    : '';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${SITE_URL}${canonical}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:type" content="website">
<meta name="theme-color" content="#0b3550">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='4' fill='%230b3550'/%3E%3Ctext x='16' y='23' font-size='19' text-anchor='middle' fill='%23f6f1e6' font-family='monospace' font-weight='700'%3EP%3C/text%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" media="print" onload="this.media='all'" href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;700&family=Space+Mono:wght@400;700&display=swap">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;700&family=Space+Mono:wght@400;700&display=swap"></noscript>
<link rel="stylesheet" href="${CSS_HREF}">${preloadHead}
${extraHead}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="top">
  <a class="brand" href="/"><span class="brand-mark">P</span><span>Platbook <em>County Resource Directory</em></span></a>
  <nav><a href="/start-here/">Start here</a><a href="/">States</a><a href="/about/">About</a><a href="/legal/">Legal</a>${SHEET_LISTED ? `<a class="nav-sheet" href="${sheetHref('nav')}"><em>Free&nbsp;</em>Rules Sheet</a>` : ''}</nav>
</header>
<main id="main">
${body}
</main>
<footer class="foot">
  <p class="disclaimer">${DISCLAIMER}</p>
  <p>Free for everyone. Data from state statutes and county offices; see each state page for sources. <a href="/about/#report">Report an error</a>.</p>
  <p class="muted">Map shapes: U.S. Census Bureau cartographic boundaries (via us-atlas).</p>
</footer>
<script src="${JS_SRC}" defer></script>
${BEACON}</body>
</html>`;
}

const legend = `<ul class="legend">${TYPES.slice(0, 4).map(([k, l]) => `<li><span class="sw t-${k}"></span>${l}</li>`).join('')}</ul>`;

// ---------- home ----------
function homePage() {
  const counts = Object.fromEntries(TYPES.map(([k]) => [k, states.filter((s) => s.type === k).length]));
  const total = states.reduce((n, s) => n + s.counties.length, 0);
  const chips = [['all', 'All'], ...TYPES.filter(([k]) => counts[k])].map(([k, l]) => `<button class="chip${k === 'all' ? ' on' : ''}" data-filter="${k}" aria-pressed="${k === 'all'}">${esc(l)}${k !== 'all' ? ` <span>${counts[k]}</span>` : ''}</button>`).join('');
  const cards = states.map((s) => isPending(s.code) ? `<li class="card" data-type="none" data-name="${esc(s.name.toLowerCase())} ${s.code.toLowerCase()}">
  <a href="/state/${s.code.toLowerCase()}/">
    <span class="card-top"><span class="code">${s.code}</span><span class="pill t-none">${PENDING_LABEL}</span></span>
    <span class="card-name">${esc(s.name)}</span>
    <span class="card-facts"><span>${PENDING_LABEL}</span></span>
    <span class="card-foot">${s.counties.length} ${s.code === 'CT' ? 'towns' : s.code === 'LA' ? 'parishes' : 'records'}</span>
  </a></li>` : `<li class="card" data-type="${s.type}" data-name="${esc(s.name.toLowerCase())} ${s.code.toLowerCase()}">
  <a href="/state/${s.code.toLowerCase()}/">
    <span class="card-top"><span class="code">${s.code}</span><span class="pill t-${s.type}" title="${esc(s.typeLabel)}">${esc(typeName(s.type))}</span></span>
    <span class="card-name">${esc(s.name)}</span>
    <span class="card-facts"><span><b>Rate</b> ${esc(s.rate)}</span><span><b>Redemption</b> ${esc(s.redemption)}</span></span>
    <span class="card-foot">${s.counties.length} ${s.code === 'CT' ? 'towns' : s.code === 'LA' ? 'parishes' : 'records'}${s.fresh.status !== 'unconfirmed' ? ' · checked ' + esc(s.fresh.lastChecked || '') : ''}</span>
  </a></li>`).join('');
  const body = `
<section class="hero">
  <p class="eyebrow">Free · 50 states + DC · ${total.toLocaleString('en-US')} county and town records</p>
  <h1>Tax lien &amp; tax deed rules, county by county</h1>
  <p class="lede">Sale type, redemption window, interest or penalty rules and the official auction platform for every state. No sign-up, no paywall.</p>
  <div class="search" role="search">
    <label for="q" class="sr">Search states and counties</label>
    <input id="q" type="search" placeholder="Search a state or county…" autocomplete="off" enterkeyhint="search">
    <ul id="results" class="results" hidden></ul>
  </div>
</section>${SHEET_LISTED ? `
<section class="sheet-band callout" aria-labelledby="sheet-band-h">
  <p class="eyebrow">Free &middot; nothing is charged</p>
  <h2 id="sheet-band-h">The audited state rules, in one sheet</h2>
  <p>${SHEET.stateCount} states side by side, ${num(SHEET.rows)} rows, and every row carries its statute, a link to the official page, the date it was checked and the exact words it rests on. ${SHEET.checked} ${SHEET.checked === 1 ? 'state is' : 'states are'} checked; ${SHEET.withGaps} ${SHEET.withGaps === 1 ? 'is' : 'are'} checked with gaps, and the gaps are named in plain words.</p>
  <p><a class="btn" href="${sheetHref('home')}">Get the Rules Sheet free</a></p>
  <p class="muted">Free in exchange for an email address. Everything on this site stays free to read either way.</p>
</section>` : ''}
<section class="home-grid">
  <div class="map-wrap">${nationalMap()}${legend}</div>
  <div>
    <div class="chips" role="group" aria-label="Filter by sale type">${chips}</div>
    <ul class="cards" id="cards">${cards}</ul>
  </div>
</section>`;
  return page({ title: 'Platbook — free tax lien & deed rules for all 50 states, county by county', desc: 'Free directory of tax lien and tax deed rules for every U.S. state and county: sale type, redemption period, interest rates and auction platforms.', canonical: '/', body });
}

// ---------- state ----------
const unmatchedAll = {};
const builtStatePages = new Map();
function statePage(st) {
  const m = matchCounties(st);
  if (m.unmatched.length) unmatchedAll[st.code] = m.unmatched;
  const f = st.fresh;
  const PEND = pendingOf(st.code);
  const PENDING_PANEL = (p) => `<div class="pending" role="note">
  <p><b>${PENDING_LABEL}.</b> Platbook has not been able to read ${esc(st.name)}'s official source yet, so <b>nothing on this page states ${esc(st.name)} law</b>. The county offices, platforms and links below are still accurate; the legal detail is deliberately blank rather than guessed.</p>
  <p class="muted">Statute: ${p.url ? link(p.url, p.statute || 'Statute') : esc(p.statute || '—')}${p.govUrl && p.govUrl !== p.url ? ` · ${link(p.govUrl, 'state page designating it')}` : ''} · last attempt ${esc(String(p.lastAttempt || '').slice(0, 10))}</p>
</div>`;
  const freshLine = PEND ? PENDING_PANEL(PEND) : f.status === 'audited'
    ? `<p class="fresh ok">Checked against official sources on ${esc(f.lastChecked)}. Each statement is tied to the statute or agency page listed under Sources.</p>`
    : f.status === 'unconfirmed'
    ? `<p class="fresh flag" role="note">⚠ Not re-checked yet. Confirm with the county.</p>`
    : `<p class="fresh ok">Last checked: ${esc(f.lastChecked)} against ${link(f.sourceUrl, f.sourceTitle || f.sourceUrl)}${f.status === 'changed' ? ' — <strong>updated</strong> from the official source' : ''}.</p>`;
  const changes = f.status === 'changed' && f.changes?.length
    ? `<div class="callout"><strong>Updated this check:</strong><ul>${f.changes.map((c) => `<li>${esc(human(c.field))}: was “${esc(c.old)}”, now “${esc(c.new)}”${c.note ? ` — ${esc(c.note)}` : ''}</li>`).join('')}</ul></div>` : '';
  const es = st.es;
  const bi = (enHtml, esHtml) => esHtml ? `<div data-lang="en">${enHtml}</div><div data-lang="es" lang="es">${esHtml}</div>` : enHtml;
  const list = (a) => a?.length ? `<ul>${a.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : '';
  const signup = (a) => a ? `<p><b>Platform:</b> ${esc(a.platform)}</p>${a.steps?.length ? `<ol>${a.steps.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>` : ''}${a.depositInfo ? `<p><b>Deposit:</b> ${esc(a.depositInfo)}</p>` : ''}${a.directLink ? `<p>${link(a.directLink, 'Official / platform link')}</p>` : ''}` : '';
  const otc = (o) => o ? `<p><b>${o.available ? 'Available' : 'Not generally available'}.</b> ${esc(o.note || '')}</p>` : '';

  const L = st.ledger;
  const facts = (PEND ? [
    ['Sale type', PENDING_LABEL],
    ['Interest / penalty', PENDING_LABEL],
    ['Redemption', PENDING_LABEL],
    ['Bid method', PENDING_LABEL],
    ['Statute', PEND.url ? link(PEND.url, PEND.statute || 'Statute') : esc(PEND.statute || '—')],
    ['Auction timing', PENDING_LABEL],
  ] : L ? auditedFacts(st, L) : [
    ['Sale type', `<span class="pill t-${st.type}">${esc(st.typeLabel)}</span>`],
    ['Interest / penalty', esc(st.rate) + (st.rateNote ? `<small>${esc(st.rateNote)}</small>` : '')],
    ['Redemption', esc(st.redemption)],
    ['Bid method', esc(st.bidMethod || '—')],
    ['Statute', st.officialLink ? link(st.officialLink, st.statute || 'Statute') : esc(st.statute || '—')],
    ['Auction timing', esc(st.auctionTiming || '—')],
  ]).map(([k, v]) => `<div class="fact"><dt>${k}</dt><dd>${v}</dd></div>`).join('');

  const countyLabel = st.code === 'CT' ? 'Towns' : st.code === 'LA' ? 'Parishes' : st.code === 'AK' ? 'Boroughs' : 'Counties';
  // Per-county sale type, redemption and interest are claims about the law, so a pending
  // state ships the office, the platform, the link and the date only.
  const rows = st.counties.map((c, i) => PEND
    ? `<li class="county" id="c-${slug(c.name)}" data-i="${i}" data-type="none" data-name="${esc(c.name.toLowerCase())}">
  <button type="button" data-i="${i}"><span class="cn">${esc(c.name)}</span><span class="cp">${esc(c.platform || '—')}</span></button></li>`
    : `<li class="county" id="c-${slug(c.name)}" data-i="${i}" data-type="${c.saleType}" data-name="${esc(c.name.toLowerCase())}">
  <button type="button" data-i="${i}"><span class="cn">${esc(c.name)}</span><span class="cp">${esc(c.platform || '—')}</span><span class="pill t-${c.saleType}">${esc(typeName(c.saleType))}</span></button></li>`).join('');
  // No county ships a redemption period or an interest rate, in any state.
  //
  // Those were never county facts. Every state's county rows carried one single value copied
  // onto all of them from the pre-audit data files - the law audit corrects the ledger, which
  // is what the fact rows above are built from, and never touched these. The result on a live
  // page was two different answers to the same question: Florida's fact row read "Until a tax
  // deed is issued" (Fla. Stat. 197.472(1), audited) while all 67 county drawers still read
  // "2 years from April 1 of issuance year", the wording the audit had specifically found
  // wrong. Pending states were already protected from this; audited ones were not.
  //
  // Only Delaware (2 values) and Maryland (4 rates) held anything genuinely county-specific
  // here, and that text is unaudited too, so it goes the same way rather than being the one
  // unverified legal claim left on the site.
  const countyJson = JSON.stringify(st.counties.map((c) => PEND
    ? { n: c.name, k: c.kind, p: c.platform, u: isUrl(c.url) ? c.url : '', no: cleanNotes(c.notes), v: c.verifiedDate, e: cleanExtra(c.extra, true), cs: countySource(st, c) }
    : { n: c.name, k: c.kind, t: c.saleType, tl: typeName(c.saleType), p: c.platform, u: isUrl(c.url) ? c.url : '', no: cleanNotes(c.notes), v: c.verifiedDate, e: cleanExtra(c.extra, false), cs: countySource(st, c) }))
    .replace(/</g, '\\u003c');

  const sources = [];
  if (PEND) {
    if (PEND.url) sources.push(link(PEND.url, `${PEND.statute || 'Statute'} — ${PEND.urlTitle || 'official'}`) + ` (not yet read by Platbook)`);
    if (PEND.govUrl && PEND.govUrl !== PEND.url) sources.push(link(PEND.govUrl, 'State page designating that copy as official'));
  } else if (L) sources.push(...ledgerSources(L));
  else if (st.officialLink) sources.push(link(st.officialLink, `${st.statute || 'State statute'} (official)`));
  if (!PEND && !L && f.sourceUrl) sources.push(link(f.sourceUrl, f.sourceTitle || f.sourceUrl) + ` — checked ${esc(f.lastChecked)}`);
  if (!PEND && !L && st.auctionSignup?.directLink) sources.push(link(st.auctionSignup.directLink, 'Auction platform'));
  if (!PEND && !L) for (const fc of st.featuredCounties) if (isUrl(fc.link)) sources.push(link(fc.link, `${fc.name} County office`));

  const body = `
<nav class="crumbs" aria-label="Breadcrumb"><a href="/">All states</a> / ${esc(st.name)}</nav>
<section class="state-head">
  <div class="title-row"><h1>${esc(st.name)}</h1>${es ? `<div class="lang" role="group" aria-label="Language"><button type="button" data-setlang="en" aria-pressed="true">EN</button><button type="button" data-setlang="es" aria-pressed="false">ES</button></div>` : ''}</div>
  ${freshLine}
  <p class="disclaimer-line">${DISCLAIMER}</p>
  <dl class="facts">${facts}</dl>
  ${changes}
  ${!PEND && !L && st.investorAlert ? `<div class="callout">${renderValue(st.investorAlert)}</div>` : ''}
</section>

<section class="counties-sec" id="counties">
  <div class="sec-head"><h2>${countyLabel} <span class="count">${st.counties.length}</span></h2>${PEND ? '' : legend}</div>
  ${st.code === 'CT' ? '<p class="muted">Connecticut sells tax liens town by town. The map shows its eight counties for orientation; pick a town from the list.</p>' : ''}
  <div class="split">
    <div class="map-pane" id="mapPane">${countyMap(st, m)}</div>
    <div class="list-pane">
      <label class="sr" for="cq">Filter ${countyLabel.toLowerCase()}</label>
      <input id="cq" class="filter" type="search" placeholder="Filter ${countyLabel.toLowerCase()}…" autocomplete="off">
      <ul class="county-list" id="countyList">${rows}</ul>
    </div>
  </div>
  <button type="button" class="map-pill" id="mapPill" aria-controls="mapPane" aria-pressed="false">Map</button>
</section>

${PEND ? '' : L ? auditedProse(st, L) : `<section class="prose">
  <h2>Summary</h2>
  ${bi(`<p>${esc(st.summary)}</p>${st.typeWhy ? `<p>${esc(st.typeWhy)}</p>` : ''}${st.rateWhy ? `<p>${esc(st.rateWhy)}</p>` : ''}`,
    es && `<p>${esc(es.summary)}</p>${es.typeWhy ? `<p>${esc(es.typeWhy)}</p>` : ''}${es.rateWhy ? `<p>${esc(es.rateWhy)}</p>` : ''}`)}
  ${st.keyNotes?.length ? `<h3>Key points</h3>${list(st.keyNotes)}` : ''}
  <h3>For beginners</h3>
  ${bi(`${st.beginnerFriendly === false && st.notBeginnerReason ? `<p><b>Harder for beginners:</b> ${esc(st.notBeginnerReason)}</p>` : ''}${st.beginnerTip ? `<p>${esc(st.beginnerTip)}</p>` : ''}`,
    es && `${st.beginnerFriendly === false && es.notBeginnerReason ? `<p><b>Más difícil para principiantes:</b> ${esc(es.notBeginnerReason)}</p>` : ''}${es.beginnerTip ? `<p>${esc(es.beginnerTip)}</p>` : ''}`)}
  <h3>Risks</h3>${bi(list(st.risks), es && list(es.risks))}
  <h3>Extra due diligence</h3>${bi(list(st.ddExtra), es && list(es.ddExtra))}
  <h3>How to sign up for the auction</h3>${bi(signup(st.auctionSignup), es && signup(es.auctionSignup))}
  <h3>Over the counter (OTC)</h3>${bi(otc(st.otc), es && otc(es.otc))}
  ${st.platforms?.length ? `<h3>Platforms</h3>${list(st.platforms)}` : ''}
  ${st.tylerCompliance ? `<h3>Surplus proceeds (Tyler v. Hennepin)</h3>${renderValue({ status: st.tylerCompliance.status, summary: st.tylerCompliance.summary, details: st.tylerCompliance.details, legislation: st.tylerCompliance.legislationRef })}` : ''}
  ${st.pendingLegislation ? `<h3>Pending legislation</h3>${renderValue(st.pendingLegislation)}` : ''}
  ${es ? '<p class="muted" data-lang="es" lang="es">Las reglas detalladas y la lista de condados están en inglés.</p>' : ''}
</section>

${st.rules ? `<section class="prose rules"><h2>Detailed state rules</h2>${renderValue(Object.fromEntries(Object.entries(st.rules).filter(([k]) => k !== 'type')))}</section>` : ''}`}

<section class="prose">
  <h2>Sources</h2>
  <ul>${sources.map((s) => `<li>${s}</li>`).join('')}</ul>
  ${freshLine}
  <p class="muted">County records come from the directory's research files (dated where shown). Always confirm dates, deposits and rules with the county office before you bid. <a href="/about/#report">Report an error</a>.</p>
</section>

<div class="drawer" id="drawer" role="dialog" aria-modal="false" aria-labelledby="dTitle" hidden>
  <div class="drawer-inner">
    <button type="button" class="drawer-close" id="dClose" aria-label="Close">×</button>
    <div id="dBody"></div>
    <p class="disclaimer-line">${DISCLAIMER}</p>
  </div>
</div>
<script type="application/json" id="countyData">${countyJson}</script>`;
  const title = PEND
    ? `${st.name} tax sale rules by county — verification pending — Platbook`
    : `${st.name} tax ${st.type === 'lien' ? 'lien' : st.type === 'hybrid' ? 'lien & deed' : 'deed'} rules by county — Platbook`;
  const desc = PEND
    ? `${st.name}: Platbook has not yet read the official source, so no legal detail is stated. ${st.counties.length} ${countyLabel.toLowerCase()} with offices, platforms and official links.`
    : `${st.name}: ${st.typeLabel}. Interest/penalty ${firstSentence(st.rate)} Redemption ${firstSentence(st.redemption)} ${st.counties.length} ${countyLabel.toLowerCase()} with auction platforms.`;
  return page({ title, desc, canonical: `/state/${st.code.toLowerCase()}/`, body });
}

// ---------- simple pages ----------
const aboutPage = () => page({ title: 'About — Platbook', desc: 'What Platbook is, where the data comes from, and how to report an error.', canonical: '/about/', body: `
<section class="prose narrow">
  <h1>About this directory</h1>
  <p>Platbook is a free reference for people researching tax lien and tax deed sales in the United States. It covers all 50 states and Washington, DC, with ${states.reduce((n, s) => n + s.counties.length, 0).toLocaleString('en-US')} county, parish, borough and town records.</p>
  <p>Everything here is free. There is no sign-up and nothing is locked.</p>${SHEET_LISTED ? `
  <p>There is also the <a href="${sheetHref('about')}">Rules Sheet</a>: the ${SHEET.stateCount} audited states on one page, ${num(SHEET.rows)} rows, each with its statute, the official link, the date checked and the quote it rests on. It is free in exchange for an email address. Nothing on the pages above moves behind it.</p>` : ''}
  <h2>Where the data comes from</h2>
  <ul>
    <li>State statutes and official state revenue or treasurer pages, linked on each state page.</li>
    <li>County tax collector and treasurer sites, and the official auction platforms counties use.</li>
    <li>Map shapes from U.S. Census Bureau cartographic boundary files (via the open <code>us-atlas</code> project).</li>
  </ul>
  <p>Each state page shows when its core rules were last checked against an official source. If a state has not been re-checked, the page says so plainly.</p>
  <h2>What this is not</h2>
  <p>This is not legal, tax or financial advice. We do not list individual properties or owners. Rules, dates and deposits change. Always confirm with the county before you bid.</p>
  <h2 id="report">Report an error</h2>
  <p>Spotted something wrong or out of date? Open an issue at <a href="https://github.com/landoCommandoz/aurigen-directory/issues" rel="noopener">github.com/landoCommandoz/aurigen-directory/issues</a> with the state, county, what is wrong, and a link to the official source.</p>
</section>` });

const legalPage = () => page({ title: 'Legal disclaimer — Platbook', desc: 'Disclaimer for Platbook, the county resource directory.', canonical: '/legal/', body: `
<section class="prose narrow">
  <h1>Legal disclaimer</h1>
  <p class="disclaimer-line">${DISCLAIMER}</p>
  <p>Platbook is provided for general information only. It is not legal, tax, investment or financial advice, and using it does not create any professional relationship.</p>
  <p>Tax sale laws, interest rates, redemption periods, auction dates, deposits and platforms change, and they vary by county and by property type. Information here may be incomplete, out of date or wrong. Always read the current statute and confirm every detail with the county office that runs the sale before you register, bid or pay.</p>
  <p>Links to government sites and auction platforms are provided for convenience. We do not control those sites and are not responsible for their content or availability.</p>
  <p>We do not collect or publish personal information about property owners.</p>
  <p>When a link to this site carries a tag, such as <code>?from=reddit</code>, we add one to a count of visits for that tag. We store only the date, the tag and the number. No cookies, no accounts, no IP addresses, no personal information of any kind.</p>
  <p>Tax sale investing carries real risk, including loss of your money. No result is promised or implied.</p>
  <p>Questions or corrections: see <a href="/about/#report">Report an error</a>.</p>
  <p>Operated by Small Hours (Landon Brewington).</p>
</section>` });

const notFound = () => page({ title: 'Page not found — Platbook', desc: 'Page not found.', canonical: '/404', body: `
<section class="prose narrow center">
  <p class="eyebrow">404</p>
  <h1>Page not found</h1>
  <p>That page doesn’t exist. Try a state below or go back to the <a href="/">home page</a>.</p>
  <ul class="mini-states">${states.map((s) => `<li><a href="/state/${s.code.toLowerCase()}/">${s.code}</a></li>`).join('')}</ul>
</section>` });

// ---------- Start Here ----------
// Built 2026-11-17 on Lando's instruction: what a tax lien is, what a tax deed is, the
// difference, a glossary of the terms the state pages use, and a short FAQ.
//
// THE RULE THIS PAGE IS BUILT TO OBEY. Every sentence on this page that states what the law
// says is rendered from an audited claim in cloudflare/data/law/<st>.json, with its statute,
// the official link it was read from, and the day it was checked, exactly as a state page does
// it. Nothing about the law is written from memory or from a summary. The explaining sentences
// around those claims describe how a tax sale works as a process and assert no law of their own,
// which is why they carry no citation: they are not making a legal claim to carry one.
//
// Florida and Texas are used as the two worked examples because they are audited and clean, and
// because they are the clearest contrast in the whole country: Florida sells a certificate and
// the deed comes later, Texas hands over a deed at the sale with the owner's right to buy it
// back still attached. If either ledger ever loses one of the claims used here, this page throws
// at build time rather than quietly printing a sentence with no source behind it.
const sheetLawLedger = (code) => {
  const L = loadLedger(code);
  if (!L) throw new Error(`start-here: no law ledger for ${code}`);
  return L;
};
const FL_LAW = sheetLawLedger('fl');
const TX_LAW = sheetLawLedger('tx');

// One audited claim, by id, as a sentence with its source. Throws if the claim is gone, so a
// ledger edit can never leave this page asserting law with nothing behind it.
function lawLine(L, id) {
  const c = L.claims.find((x) => x.id === id && x.lang === 'en');
  if (!c) throw new Error(`start-here: ${L.state} has no English claim "${id}"`);
  if (!c.statute || !c.url) throw new Error(`start-here: ${L.state} claim "${id}" has no statute or url`);
  const when = String(c.checked || '').slice(0, 10);
  return `<li>${claimHtml(c)} <span class="src"><a href="${esc(c.url)}" rel="noopener">${esc(c.statute)}</a>${when ? ` <span class="muted">checked ${esc(when)}</span>` : ''}</span></li>`;
}
const lawList = (L, ids) => `<ul class="law-list">${ids.map((id) => lawLine(L, id)).join('')}</ul>`;

// The glossary. These are the terms the state pages actually print, taken from the field labels
// in cloudflare/src/app.js, so the glossary explains the words a reader will really meet rather
// than a generic word list. Definitions describe what a field means on this site. Where a term
// only has meaning because a statute defines it, the statute is cited from the ledger instead.
const GLOSSARY = [
  ['Tax lien certificate', 'A paper the county sells when the tax bill is not paid. It does not make the buyer the owner of the property. It makes the buyer the person the unpaid tax is owed to, with interest set by law.'],
  ['Tax deed', 'A deed to the property itself, sold by the county rather than by the owner. In some states it arrives at the end of the lien road; in others the county sells deeds directly.'],
  ['Redeemable deed', 'A deed handed over at the sale while the former owner still has a set window to pay everything back and undo it. Texas is the clearest example.'],
  ['Redemption period', 'The window in which the owner, or someone with an interest in the property, can pay what is owed and keep or recover the property. It is counted from a date the statute names, not from the day of the sale, and the two are often different.'],
  ['Interest / penalty', 'What the law adds to the amount owed while it stays unpaid. An interest rate accrues over time. A penalty is a flat percentage added once, so a penalty paid back quickly costs the person redeeming far more per month than the same number as a rate.'],
  ['Bidding method', 'How the winner is picked. Bidding down the interest rate, bidding a premium above the taxes owed, or a rotation that assigns liens in turn are all in use, and which one a state uses changes what a bid is worth.'],
  ['Premium', 'Money bid above the taxes and costs owed. Whether a premium is paid back, and whether it carries interest, is a matter of state law and is one of the easiest ways to lose money without noticing.'],
  ['Over the counter', 'Buying a lien or a deed from the county after an auction has ended, from what nobody bought, rather than at the sale.'],
  ['Struck to the county', 'What happens to a lien or property nobody bids on. The county keeps it, often at the maximum rate the law allows, and may sell it later.'],
  ['Subsequent taxes', 'The next year of tax on a property a lien is already held against. Who may pay it, and what rate it carries, decides whether a lien holder keeps their position.'],
  ['Surplus funds', 'Money left over when a property sells for more than the taxes and costs owed. Who may claim it, and how long they have, is set by statute.'],
  ['Quiet title', 'A court case to settle who owns a property, used after some tax deed sales because the deed alone may not be enough to sell or insure the title.'],
  ['Assignment', 'Transferring a lien the county or another holder owns to a new holder, usually for a fee the county sets.'],
  ['Adjudged value', 'A value set in the court judgment that leads to a Texas tax sale. It matters because the minimum bid can be set by it.'],
  ['Delinquency', 'The point at which an unpaid tax bill becomes officially late. Statutes count most deadlines from this date rather than from the billing date.'],
];

const startHerePage = () => page({
  title: 'Start here: tax liens and tax deeds explained',
  desc: 'What a tax lien is, what a tax deed is, how they differ, and the words every state page uses. Each legal statement carries its statute, the official link and the date it was checked.',
  canonical: '/start-here/',
  body: `
<section class="prose narrow">
  <h1>Start here</h1>
  <p class="lede">If you have never bought a tax lien or a tax deed, this page is the whole idea in a few minutes. It says what each one is, how they differ, what the words on every state page mean, and where the law behind each statement comes from.</p>
  <p class="disclaimer-line">${DISCLAIMER}</p>

  <h2 id="unpaid">What happens when a property tax goes unpaid</h2>
  <p>A county runs on property tax. When a bill is not paid, the county still needs the money on time, so the law gives it a way to raise that money from somebody else and hand the problem to them. That is what a tax sale is. The county is not selling a house to make money. It is collecting a tax bill.</p>
  <p>From there, states split into two roads. Some sell the debt. Some sell the property. Which road a state takes decides almost everything else, including what you own after you pay, what can go wrong, and how long you wait.</p>

  <h2 id="lien">What a tax lien is</h2>
  <p>A tax lien sale sells the <strong>debt</strong>, not the property. You pay the county the unpaid tax. In exchange you get a certificate saying that amount is now owed to you, with interest set by statute. You are not the owner. You cannot enter the property, rent it out, or sell it. You are waiting to be paid back.</p>
  <p>Most of the time you are paid back and that is the end of it. If nobody pays, the statute gives the certificate holder a path to the property itself, and that path has its own deadlines and its own costs.</p>
  <p>Florida is a lien state, and these are its own rules, each read from the Florida Senate's published statutes:</p>
  ${lawList(FL_LAW, ['type', 'rate', 'bidMethod', 'redemption', 'summary.1'])}
  <p>Read the Florida bidding rule again, because it surprises people: the winner is the bidder who will accept the <em>lowest</em> interest rate. Bidding is a race downward, not upward. A crowded Florida sale is won by whoever will take the least.</p>

  <h2 id="deed">What a tax deed is</h2>
  <p>A tax deed sale sells the <strong>property</strong>. The county conveys the real estate, and if you win you hold a deed. There is no waiting to be paid back, because you were not lending anything. What you take on instead is everything that comes with owning a property you have usually never been inside.</p>
  <p>Texas shows the version that catches people out, because a Texas deed arrives with a string attached: the former owner can still buy the property back for a set period, and the amount they pay back is a flat percentage on top of what you spent, not a rate that builds up over time.</p>
  ${lawList(TX_LAW, ['type', 'typeWhy.1', 'redemption', 'rate', 'rateNote', 'bidMethod', 'auctionTiming'])}
  <p>That flat percentage is worth sitting with. If a Texas homestead is redeemed the week after the sale, the person redeeming pays the same 25 percent they would pay eleven months later. Read as an annual rate that is enormous, and it is also the outcome in which you own the property for eight days. A deed state pays you in one of two very different ways and you do not get to choose which.</p>

  <h2 id="difference">The difference, in one place</h2>
  <table class="compare">
    <thead><tr><th>Question</th><th>Tax lien</th><th>Tax deed</th></tr></thead>
    <tbody>
      <tr><td>What you buy</td><td>The unpaid debt</td><td>The property</td></tr>
      <tr><td>Do you own the property</td><td>No</td><td>Yes, subject to whatever the statute leaves attached</td></tr>
      <tr><td>Normal outcome</td><td>You are paid back with interest</td><td>You keep the property</td></tr>
      <tr><td>What you are paid</td><td>Interest or a penalty set by statute</td><td>Nothing; the property is the outcome</td></tr>
      <tr><td>Main risk</td><td>Being paid back sooner than you planned, and the costs of the deed path if nobody pays</td><td>The property itself: condition, access, what survived the sale, and anything you could not inspect</td></tr>
      <tr><td>Who holds the waiting</td><td>You wait for the owner</td><td>The former owner may have a window to undo it</td></tr>
      <tr><td>Worked example above</td><td>Florida</td><td>Texas</td></tr>
    </tbody>
  </table>
  <p>Some states do both, and a few do something in between. Each state page on this site says which it is, and why, with the statute it rests on.</p>

  <h2 id="care">Three things that cost people real money</h2>
  <p><strong>A redemption period is not counted from the sale.</strong> Every state names the date the clock starts, and it is often the date a deed was recorded or a certificate was issued, not the day of the auction. Florida's own words above measure the deed application from April 1 of the year the certificate was issued.</p>
  <p><strong>A penalty and a rate are not the same number.</strong> A flat 25 percent is not comparable to 25 percent a year, and comparing states by their headline percentage alone tells you very little.</p>
  <p><strong>Not everything is wiped by a tax sale.</strong> Some claims against a property survive it, and which ones depends on the state and the kind of claim. Before bidding anywhere, ask the county what the sale does and does not clear, and get the answer in writing.</p>
  <p>Counties also vary inside a single state. A state page here is the baseline the statute sets. The county running the sale is the authority on how that sale actually works, and it is worth one phone call before any money moves.</p>

  <h2 id="glossary">The words every state page uses</h2>
  <dl class="glossary">
    ${GLOSSARY.map(([term, def]) => `<dt>${esc(term)}</dt><dd>${esc(def)}</dd>`).join('\n    ')}
  </dl>

  <h2 id="faq">Short FAQ</h2>
  <dl class="faq">
    <dt>Can I lose money doing this?</dt>
    <dd>Yes. On a deed you can buy a property worth less than you paid, or one you cannot easily sell. On a lien you can spend money chasing a deed that never arrives. Nothing on this site promises any outcome.</dd>

    <dt>Which is better, liens or deeds?</dt>
    <dd>They are different jobs. A lien is lending with a legal claim behind it and a known rate. A deed is buying property with limited information. Most people should decide which of those two things they actually want before they look at any state.</dd>

    <dt>Do I need to live in the state?</dt>
    <dd>Usually no, but registration, deposits and identification requirements are set by the county and some are stricter than others. Check the county page for the sale you want.</dd>

    <dt>Do I have to pay cash?</dt>
    <dd>Nearly always, and quickly. Deposits are commonly required before bidding and the balance is due within days. Counties do not arrange financing.</dd>

    <dt>Can I see the property first?</dt>
    <dd>Normally not inside. You can look at it from the street and read the public records. Buying without an inspection is the ordinary condition of this market, not a special case.</dd>

    <dt>What happens if the owner pays after I buy a lien?</dt>
    <dd>You are paid back with whatever the statute provides, and your involvement ends. That is the usual ending and it is a normal one.</dd>

    <dt>Where do the rules on this site come from?</dt>
    <dd>State statutes and official state and county pages. Every legal statement carries its statute, a link to the official source, and the date it was checked. If we could not read a source, the page says so rather than filling the gap.</dd>

    <dt>Is any of this legal advice?</dt>
    <dd>No. ${DISCLAIMER}</dd>
  </dl>

  ${LESSONS_APPROVED ? `<h2 id="lessons">The five lessons, in order</h2>
  <p>This page is the whole idea in one sitting. The five lessons below go slower, one idea at a time, for somebody meeting these words for the first time.</p>
  <ol class="cards">
    ${LESSONS.map((l) => `<li class="card"><a href="${LESSONS_BASE}${l.slug}/"><span class="card-name">${esc(l.title)}</span><span class="card-facts"><span>${esc(l.desc)}</span></span></a></li>`).join('')}
  </ol>
  <p class="muted">They sit under this page, and each one links to the next and back. <a href="${LESSONS_BASE}">Open the five together</a>.</p>

  ` : ''}<h2 id="next">Where to go next</h2>
  <p>Pick your state from the <a href="/">state list</a>. Each page gives the type of sale, the rate or penalty, the redemption period, the bidding method and the statutes behind them, plus the counties and the offices that run the sales.</p>
</section>` });

// ---------- question-and-answer markup, built only from text visible on the page ----------
// Lando's rule for this markup, and the only rule it obeys: nothing in it may be text a reader
// cannot see on the page. So none of it is written by hand. visibleText() strips the tags out of
// the built body; qaPairs() walks the page's own <h2> sections and takes the heading as the
// question and the visible text beneath it as the answer, character for character; and
// faqJsonLd() refuses to emit a pair whose question or answer cannot be found in the page's own
// visible text, which fails the build. A later hand-edit that invents a question therefore cannot
// ship. The pending notice and the closing "Now read your own state" block are left out: the
// first is a warning that belongs to the whole page rather than to one section, and the second is
// navigation. "The short version" is left out because it summarises the page rather than
// answering its own heading.
const decodeEntities = (t) => String(t)
  .replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
const visibleText = (html) => decodeEntities(String(html)
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
const QA_SKIP = ['short', 'your-state'];
function qaPairs(body) {
  const re = /<h2 id="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/g;
  const marks = [];
  for (let m = re.exec(body); m; m = re.exec(body)) marks.push({ id: m[1], heading: m[2], start: m.index, end: re.lastIndex });
  const out = [];
  marks.forEach((h, i) => {
    if (QA_SKIP.includes(h.id)) return;
    const raw = body.slice(h.end, i + 1 < marks.length ? marks[i + 1].start : body.length);
    const q = visibleText(h.heading);
    const a = visibleText(raw.split('<div class="pending"')[0]);
    if (q && a) out.push([q, a]);
  });
  return out;
}
function faqJsonLd(body, where) {
  const pairs = qaPairs(body);
  if (!pairs.length) throw new Error(`${where}: no question-and-answer pairs on the page, so no markup can be built from it`);
  const seen = visibleText(body);
  for (const [q, a] of pairs) {
    if (!seen.includes(q)) throw new Error(`${where}: question is not visible on the page: ${q}`);
    if (!seen.includes(a)) throw new Error(`${where}: answer is not visible on the page, under: ${q}`);
  }
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: pairs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  };
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\u003c')}</script>`;
}

// ---------- the five beginner lessons, PARKED ----------
// Built out of the Start Here page: same page shell, same prose classes, same lawList() so every
// state-specific sentence carries its statute, its official link and the date it was checked.
// The four pending states are named from the live pending list, not typed, so the warning on each
// lesson cannot go stale. Nothing here is written, linked or listed while LESSONS_APPROVED is
// false, which is its current value: the pages do not exist on the live site at any address.
const PENDING_STATES = states.filter((s) => isPending(s.code)).map((s) => ({ code: s.code, name: s.name }));
const LESSONS = lessons({ esc, lawList, FL_LAW, TX_LAW, DISCLAIMER, pendingStates: PENDING_STATES });
const lessonPage = (l) => page({
  title: `${l.title} - Platbook`,
  desc: l.desc,
  canonical: `${LESSONS_BASE}${l.slug}/`,
  body: l.body,
  extraHead: (LESSONS_APPROVED ? '' : '<meta name="robots" content="noindex, nofollow">') + faqJsonLd(l.body, `lesson ${l.slug} q-and-a`),
});
const lessonsIndexPage = () => page({
  title: 'The five lessons - Platbook',
  desc: 'Five short plain-English lessons: what a tax lien is, what a tax deed is, how a tax sale works, what redemption means, and how title gets cleared after a sale.',
  canonical: LESSONS_BASE,
  body: lessonsIndexBody({ esc, items: LESSONS, DISCLAIMER }),
  extraHead: LESSONS_APPROVED ? '' : '<meta name="robots" content="noindex, nofollow">',
});

// ---------- write ----------
fs.rmSync(PUB, { recursive: true, force: true });
write('assets/site.css', css);
write('assets/app.js', js);
// The heading font and its licence, copied byte for byte. Binary, so not write().
for (const f of ['fraunces-600-latin.woff2', 'fraunces-600-latin-ext.woff2', 'OFL.txt']) {
  const dst = path.join(PUB, 'assets', 'fonts', f);
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.copyFileSync(path.join(BASE, 'src', 'fonts', f), dst);
}
write('index.html', homePage());
for (const st of states) { const _sp = statePage(st); builtStatePages.set(st.code, _sp); write(`state/${st.code.toLowerCase()}/index.html`, _sp); }
write('about/index.html', aboutPage());
write('start-here/index.html', startHerePage());
// PARKED. These two lines are the whole of what putting the lessons live does.
if (LESSONS_APPROVED) {
  write(`${LESSONS_BASE.replace(/^\/|\/$/g, '')}/index.html`, lessonsIndexPage());
  for (const l of LESSONS) write(`${LESSONS_BASE.replace(/^\/|\/$/g, '')}/${l.slug}/index.html`, lessonPage(l));
}
write('legal/index.html', legalPage());
write('404.html', notFound());
write('robots.txt', `User-agent: *\nAllow: /\nDisallow: /extras/\nSitemap: ${SITE_URL}/sitemap.xml\n`);
// The sheet is in the sitemap only once it is listed, because until then it answers with
// noindex and a sitemap entry would be asking to be indexed and refusing in the same breath.
// It carries no ?from= tag here: a sitemap is for search engines, not a visitor arriving from
// somewhere, and a tagged address in a sitemap would also split the page in two as far as
// indexing is concerned.
// The lessons join the sitemap only when they are approved, for the same reason as the sheet:
// while they are parked they are noindex, and a sitemap entry would be asking to be indexed and
// refusing in the same breath.
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['/', '/start-here/', '/about/', '/legal/', ...(SHEET_LISTED ? [SHEET_PATH] : []), ...(LESSONS_APPROVED ? [LESSONS_BASE, ...LESSONS.map((l) => `${LESSONS_BASE}${l.slug}/`)] : []), ...states.map((s) => `/state/${s.code.toLowerCase()}/`)].map((u) => `<url><loc>${SITE_URL}${u}</loc></url>`).join('')}</urlset>\n`);
// ---------- the parked lessons, as files Lando can open ----------
// Run with LESSONS_PREVIEW=1 and the five lessons plus their index are written OUTSIDE public/,
// into preview/lessons-<date>/, as self-contained files: the stylesheet inlined so they need no
// server, every site link pointed at the live address so they still work, and the lesson links
// pointed at each other as plain files. They are not part of the site, not in the sitemap and not
// reachable from it. A normal build writes nothing here.
if (process.env.LESSONS_PREVIEW) {
  const dir = path.join(BASE, '..', 'preview', 'lessons-2026-11-17');
  fs.mkdirSync(dir, { recursive: true });
  const standalone = (html) => {
    let s = html;
    // the stylesheet, inlined, so the file opens straight off the disk
    s = s.replace(/<link rel="stylesheet" href="\/assets\/site\.css[^"]*">/, `<style>\n${css}\n</style>`);
    // lesson links become plain files beside this one
    s = s.replace(new RegExp(`href="${LESSONS_BASE}(\\d)/"`, 'g'), 'href="$1.html"');
    s = s.replace(new RegExp(`href="${LESSONS_BASE}"`, 'g'), 'href="index.html"');
    // every other site link points at the live site, so nothing is a dead end
    s = s.replace(/href="\/([^"]*)"/g, (m, p) => `href="${SITE_URL}/${p}"`);
    s = s.replace(/<script src="[^"]*app\.js[^"]*"[^>]*><\/script>/, '');
    // A preview file is not served at any address, so it claims none. A canonical link pointing
    // at a page that does not exist yet would be a small lie left lying around.
    s = s.replace(/<link rel="canonical"[^>]*>\n?/, '');
    return s.replace('</head>', '<meta name="robots" content="noindex, nofollow">\n</head>');
  };
  fs.writeFileSync(path.join(dir, 'index.html'), standalone(lessonsIndexPage()));
  for (const l of LESSONS) fs.writeFileSync(path.join(dir, `${l.slug}.html`), standalone(lessonPage(l)));
  console.log(`Lesson preview: ${LESSONS.length + 1} files written to preview/lessons-2026-11-17/ (NOT on the site)`);
}

// Search index: states + counties (name, state, type, slug).
write('assets/search.json', JSON.stringify({
  s: states.map((s) => [s.code, s.name, s.type]),
  c: states.flatMap((s) => s.counties.map((c) => [c.name, s.code, c.saleType, slug(c.name)])),
}));
// Extras page (served only through the Worker gate; see src/worker.js).
const extrasPath = path.join(BASE, 'src', 'extras.html');
if (fs.existsSync(extrasPath)) {
  const inner = fs.readFileSync(extrasPath, 'utf8');
  write('extras/index.html', page({ title: 'Extras — Platbook', desc: 'Optional paid extras for the Platbook directory.', canonical: '/extras/', body: inner, extraHead: '<meta name="robots" content="noindex">' }));
}
fs.writeFileSync(path.join(DATA, 'unmatched.json'), JSON.stringify(unmatchedAll, null, 1));
const nUn = Object.values(unmatchedAll).reduce((n, a) => n + a.length, 0);
console.log(`Built ${states.length} state pages. Unmatched county records: ${nUn}`);
for (const [k, v] of Object.entries(unmatchedAll)) console.log(`  ${k}: ${v.join(', ')}`);

// ---------- paid extras files (served only through the Worker license gate) ----------
// Sale dates: explicit future dates plus "nth weekday" patterns found in the directory text,
// expanded over the next 12 months. Anything vaguer ("Typically Spring") is not guessed.
const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
const WD = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };
const NTH = { '1st': 1, first: 1, '2nd': 2, second: 2, '3rd': 3, third: 3, '4th': 4, fourth: 4, last: -1 };
const today = new Date(); today.setUTCHours(0, 0, 0, 0);
const horizon = new Date(today.getTime() + 366 * 86400000);
const iso = (d) => d.toISOString().slice(0, 10);
function nthWeekday(y, m, nth, wd) {
  if (nth === -1) { const d = new Date(Date.UTC(y, m + 1, 0)); while (d.getUTCDay() !== wd) d.setUTCDate(d.getUTCDate() - 1); return d; }
  const d = new Date(Date.UTC(y, m, 1)); while (d.getUTCDay() !== wd) d.setUTCDate(d.getUTCDate() + 1);
  d.setUTCDate(d.getUTCDate() + 7 * (nth - 1)); return d.getUTCMonth() === m ? d : null;
}
function datesFrom(text) {
  const t = String(text).toLowerCase(); const out = new Set();
  for (const m of t.matchAll(/\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2}),?\s+(20\d\d)\b/g)) {
    const d = new Date(Date.UTC(+m[3], MONTHS.indexOf(m[1]), +m[2])); if (d >= today && d <= horizon) out.add(iso(d));
  }
  const pat = t.match(/\b(1st|first|2nd|second|3rd|third|4th|fourth|last)\s+(mon|tue|wed|thu|fri)[a-z]*\b(?:\s+(?:of\s+)?(?:(every|each)\s+month|month|(january|february|march|april|may|june|july|august|september|october|november|december)))?/);
  if (pat && (pat[3] || pat[4] || /monthly/.test(t))) {
    const nth = NTH[pat[1]]; const wd = WD[pat[2]];
    for (let i = 0; i < 13; i++) {
      const y = today.getUTCFullYear() + Math.floor((today.getUTCMonth() + i) / 12); const mo = (today.getUTCMonth() + i) % 12;
      if (pat[4] && MONTHS.indexOf(pat[4]) !== mo) continue;
      const d = nthWeekday(y, mo, nth, wd); if (d && d >= today && d <= horizon) out.add(iso(d));
    }
  }
  return [...out];
}
const sales = [];
for (const st of states) {
  const stateText = [st.rules?.auction?.frequency, st.rules?.auction?.saleDate, st.rules?.auction?.date].filter((x) => typeof x === 'string');
  for (const c of st.counties) {
    const own = Object.entries(c.extra).filter(([k, v]) => /date|sale(month|window|frequency)|frequency/i.test(k) && typeof v === 'string').map(([, v]) => v);
    const texts = own.length ? own : stateText;
    for (const t of texts) for (const d of datesFrom(t)) sales.push({ s: st.code, c: slug(c.name), n: c.name, d, t, u: isUrl(c.url) ? c.url : '' });
  }
}
sales.sort((a, b) => a.d.localeCompare(b.d) || a.s.localeCompare(b.s));
write('extras/files/sales.json', JSON.stringify(sales));
const csvCell = (v) => { const s = Array.isArray(v) ? v.join(' | ') : String(v ?? ''); return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
const csv = (rows) => '﻿' + rows.map((r) => r.map(csvCell).join(',')).join('\r\n') + '\r\n';
write('extras/files/platbook-counties.csv', csv([
  ['state', 'state_name', 'county_or_town', 'kind', 'sale_type', 'redemption', 'interest_or_penalty', 'auction_platform', 'official_link', 'sale_timing', 'notes', 'research_dated'],
  ...states.flatMap((st) => st.counties.map((c) => [st.code, st.name, c.name, c.kind,
    ...(isPending(st.code) ? [PENDING_LABEL, PENDING_LABEL, PENDING_LABEL] : [typeName(c.saleType), c.redemption, c.rate]), c.platform, isUrl(c.url) ? c.url : '',
    Object.entries(c.extra).filter(([k, v]) => /date|sale(month|window|frequency)/i.test(k) && typeof v === 'string').map(([, v]) => v).join(' | '), c.notes, c.verifiedDate])),
]));
write('extras/files/platbook-states.csv', csv([
  ['state', 'state_name', 'sale_type', 'interest_or_penalty', 'redemption', 'bid_method', 'statute', 'statute_link', 'auction_timing', 'otc_available', 'last_checked', 'check_status', 'check_source'],
  ...states.map((s) => {
    const p = pendingOf(s.code);
    if (p) return [s.code, s.name, PENDING_LABEL, PENDING_LABEL, PENDING_LABEL, PENDING_LABEL, p.statute || '', p.url || '', PENDING_LABEL, '', '', 'verification pending', p.govUrl || p.url || ''];
    return [s.code, s.name, s.typeLabel, s.rate, s.redemption, s.bidMethod, s.statute, s.officialLink, s.auctionTiming, s.otc ? (s.otc.available ? 'yes' : 'no') : '', s.fresh.lastChecked || '', s.fresh.status, s.fresh.sourceUrl || ''];
  }),
]));
console.log(`Extras: ${sales.length} upcoming sale dates in the next 12 months across ${new Set(sales.map((x) => x.s + x.c)).size} counties`);

// ---------- pending states assert nothing ----------
// check-law.mjs proves the ledgers are sound. This proves the other half: that a state
// declared pending in data/law/pending.json states no law on its own page. It reads the
// real built HTML, so a renderer that merely looks right cannot satisfy it. Any failure
// stops the build, which is what the restore workflow runs, so nothing can be deployed.
{
  const problems = [];
  const pend = [...builtStatePages.keys()].filter((c) => isPending(c));
  for (const code of pend) {
    const html = builtStatePages.get(code);
    const st = states.find((x) => x.code === code) || {};
    const where = `/state/${code.toLowerCase()}/`;
    if (!html.includes('class="pending"')) problems.push(`${where}: the verification-pending panel is missing`);
    for (const key of ['"t":', '"tl":', '"r":', '"x":']) {
      if (html.includes(key)) problems.push(`${where}: countyData still ships the legal key ${key}`);
    }
    for (const [label, value] of [['sale type', st.typeLabel], ['interest or penalty', st.rate], ['redemption', st.redemption], ['bid method', st.bidMethod]]) {
      const v = String(value || '').trim();
      if (v.length > 3 && html.includes(esc(v))) problems.push(`${where}: unaudited ${label} "${v}" is still on the page`);
    }
    for (const cls of ['t-lien', 't-deed', 't-hybrid', 't-redeemable']) {
      if (html.includes(cls)) problems.push(`${where}: sale-type styling ${cls} still shades this state`);
    }
    for (const row of html.match(/<div class="fact"><dt>[^<]*<\/dt><dd>[\s\S]*?<\/dd><\/div>/g) || []) {
      const mm = row.match(/<dt>([^<]*)<\/dt><dd>([\s\S]*?)<\/dd>/);
      if (!mm) continue;
      if (['Sale type', 'Interest / penalty', 'Redemption', 'Bid method', 'Auction timing'].includes(mm[1]) && mm[2] !== PENDING_LABEL) {
        problems.push(`${where}: the "${mm[1]}" row reads "${mm[2].slice(0, 40)}" instead of ${PENDING_LABEL}`);
      }
    }
  }
  // Every claim read by hand must print its line on the page it supports. The ledger carries
  // readBy, check-law.mjs refuses a hand snapshot without it, and this is the last check: that the
  // words actually reached the HTML.
  let handCount = 0;
  for (const st of states) {
    const hand = ((st.ledger && st.ledger.claims) || []).filter((c) => c.readBy && c.shown !== '' && c.lang === 'en');
    if (!hand.length) continue;
    const page = builtStatePages.get(st.code) || '';
    for (const c of hand) {
      handCount++;
      if (!page.includes(`Read by hand from the official page by ${esc(c.readBy)}`)) {
        problems.push(`/state/${st.code.toLowerCase()}/: claim ${c.id} was read by hand by ${c.readBy}, and the page does not say so`);
      }
    }
  }
  const missing = Object.keys(PENDING).filter((c) => !builtStatePages.has(c));
  for (const c of missing) problems.push(`pending.json lists ${c}, which is not a state this site builds`);
  if (problems.length) {
    console.error('\nbuild-site: FAIL - a pending state is stating law (' + problems.length + ' problems)\n' + problems.map((x) => '  - ' + x).join('\n') + '\n');
    process.exit(1);
  }
  console.log(`Pending states asserting nothing: ${pend.length}${pend.length ? ' (' + pend.join(', ') + ')' : ''}`);
  console.log(`Claims read by hand, each saying so on its page: ${handCount}`);
}

// ---------- the county text reads like English ----------
// scripts/county-text.mjs walks every county label and every county value on every built
// state page. The note at the top of that file records what went live before it existed.
// A problem here stops the build, and the build is what the restore workflow runs, so a page
// with broken county text cannot be deployed.
{
  const problems = [];
  for (const [code, html] of builtStatePages) {
    problems.push(...countyTextProblems(html, `/state/${code.toLowerCase()}/`, { pending: isPending(code) }));
  }
  if (problems.length) {
    const shown = problems.slice(0, 40).map((x) => '  - ' + x).join('\n');
    const rest = problems.length > 40 ? `\n  ... and ${problems.length - 40} more` : '';
    console.error(`\nbuild-site: FAIL - county text a visitor would call broken (${problems.length} problems)\n${shown}${rest}\n`);
    process.exit(1);
  }
  console.log(`County text read on ${builtStatePages.size} state pages: clean`);
}
