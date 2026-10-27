// Aurigen site build: turns data/*.json into static pages in public/.
// Maps are pre-rendered SVG from the Census-based us-atlas TopoJSON (build-time only).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { geoPath, geoAlbersUsa, geoMercator, geoCentroid } from 'd3-geo';
import { feature } from 'topojson-client';

const require = createRequire(import.meta.url);
const here = path.dirname(fileURLToPath(import.meta.url));
const BASE = path.resolve(here, '..');
const DATA = path.join(BASE, 'data');
const PUB = path.join(BASE, 'public');
const SITE_URL = process.env.SITE_URL || 'https://aurigen.landonbrewington12.workers.dev';
const DISCLAIMER = 'Not legal or financial advice. Rules change. Confirm with the county before you bid.';

const FIPS = { AL: '01', AK: '02', AZ: '04', AR: '05', CA: '06', CO: '08', CT: '09', DE: '10', DC: '11', FL: '12', GA: '13', HI: '15', ID: '16', IL: '17', IN: '18', IA: '19', KS: '20', KY: '21', LA: '22', ME: '23', MD: '24', MA: '25', MI: '26', MN: '27', MS: '28', MO: '29', MT: '30', NE: '31', NV: '32', NH: '33', NJ: '34', NM: '35', NY: '36', NC: '37', ND: '38', OH: '39', OK: '40', OR: '41', PA: '42', RI: '44', SC: '45', SD: '46', TN: '47', TX: '48', UT: '49', VT: '50', VA: '51', WA: '53', WV: '54', WI: '55', WY: '56' };
const TYPES = [
  ['lien', 'Tax lien'], ['deed', 'Tax deed'], ['hybrid', 'Hybrid'], ['redeemable', 'Redeemable deed'], ['other', 'Other'],
];

// ---------- helpers ----------
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const isUrl = (s) => typeof s === 'string' && /^https?:\/\/[^\s"'<>]+$/.test(s.trim());
const link = (u, text) => isUrl(u) ? `<a href="${esc(u.trim())}" rel="noopener nofollow" target="_blank">${esc(text || u.replace(/^https?:\/\//, '').replace(/\/$/, ''))}</a>` : esc(text || u);
const human = (k) => String(k).replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase());
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
    return `<a href="/state/${code.toLowerCase()}/" data-type="${s.type}" aria-label="${esc(s.name)}: ${esc(s.typeLabel)}"><path class="t-${s.type}" d="${d}"><title>${esc(s.name)} — ${esc(s.typeLabel)}</title></path></a>`;
  }).join('');
  return `<svg class="map" viewBox="0 0 960 600" role="img" aria-label="United States map shaded by tax sale type">${paths}</svg>`;
}

function countyMap(st, m) {
  if (!m.feats.length) return '';
  const fc = { type: 'FeatureCollection', features: m.feats };
  const [lon] = geoCentroid(fc);
  const proj = geoMercator().rotate([-lon, 0]).fitSize([600, 460], fc);
  const p = geoPath(proj).digits(1);
  const paths = m.feats.map((f) => {
    const d = p(f); if (!d) return '';
    const i = m.byFeat.get(f.id);
    if (st.code === 'CT') return `<path class="t-${st.type} ct" d="${d}" data-ct="1"><title>${esc(f.properties.name)} County (towns listed below)</title></path>`;
    if (i == null) return `<path class="t-none" d="${d}"><title>${esc(f.properties.name)} (no record)</title></path>`;
    const c = st.counties[i];
    return `<path class="t-${c.saleType}" d="${d}" data-i="${i}" tabindex="0" role="button" aria-label="${esc(c.name)}"><title>${esc(c.name)}</title></path>`;
  }).join('');
  return `<svg class="map county-map" viewBox="0 0 600 460" role="img" aria-label="${esc(st.name)} county map shaded by sale type">${paths}</svg>`;
}

// ---------- layout ----------
const css = fs.readFileSync(path.join(BASE, 'src', 'site.css'), 'utf8');
const js = fs.readFileSync(path.join(BASE, 'src', 'app.js'), 'utf8');
const ver = (s) => { let h = 0; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) | 0; return (h >>> 0).toString(36); };
const CSS_HREF = `/assets/site.css?v=${ver(css)}`;
const JS_SRC = `/assets/app.js?v=${ver(js)}`;

function page({ title, desc, canonical, body, extraHead = '' }) {
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
<meta name="theme-color" content="#0d0d0d">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%230d0d0d'/%3E%3Ctext x='16' y='23' font-size='20' text-anchor='middle' fill='%23d4af37' font-family='sans-serif' font-weight='700'%3EA%3C/text%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${CSS_HREF}">
${extraHead}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="top">
  <a class="brand" href="/"><span class="brand-mark">A</span><span>Aurigen <em>County Resource Directory</em></span></a>
  <nav><a href="/">States</a><a href="/about/">About</a><a href="/legal/">Legal</a></nav>
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
</body>
</html>`;
}

const legend = `<ul class="legend">${TYPES.slice(0, 4).map(([k, l]) => `<li><span class="sw t-${k}"></span>${l}</li>`).join('')}</ul>`;

// ---------- home ----------
function homePage() {
  const counts = Object.fromEntries(TYPES.map(([k]) => [k, states.filter((s) => s.type === k).length]));
  const total = states.reduce((n, s) => n + s.counties.length, 0);
  const chips = [['all', 'All'], ...TYPES.filter(([k]) => counts[k])].map(([k, l]) => `<button class="chip${k === 'all' ? ' on' : ''}" data-filter="${k}" aria-pressed="${k === 'all'}">${esc(l)}${k !== 'all' ? ` <span>${counts[k]}</span>` : ''}</button>`).join('');
  const cards = states.map((s) => `<li class="card" data-type="${s.type}" data-name="${esc(s.name.toLowerCase())} ${s.code.toLowerCase()}">
  <a href="/state/${s.code.toLowerCase()}/">
    <span class="card-top"><span class="code">${s.code}</span><span class="pill t-${s.type}">${esc(s.typeLabel)}</span></span>
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
</section>
<section class="home-grid">
  <div class="map-wrap">${nationalMap()}${legend}</div>
  <div>
    <div class="chips" role="group" aria-label="Filter by sale type">${chips}</div>
    <ul class="cards" id="cards">${cards}</ul>
  </div>
</section>`;
  return page({ title: 'Aurigen County Resource Directory — free tax lien & deed rules for all 50 states', desc: 'Free directory of tax lien and tax deed rules for every U.S. state and county: sale type, redemption period, interest rates and auction platforms.', canonical: '/', body });
}

// ---------- state ----------
const unmatchedAll = {};
function statePage(st) {
  const m = matchCounties(st);
  if (m.unmatched.length) unmatchedAll[st.code] = m.unmatched;
  const f = st.fresh;
  const freshLine = f.status === 'unconfirmed'
    ? `<p class="fresh flag" role="note">⚠ Not re-checked yet. Confirm with the county.</p>`
    : `<p class="fresh ok">Last checked: ${esc(f.lastChecked)} against ${link(f.sourceUrl, f.sourceTitle || f.sourceUrl)}${f.status === 'changed' ? ' — <strong>updated</strong> from the official source' : ''}.</p>`;
  const changes = f.status === 'changed' && f.changes?.length
    ? `<div class="callout"><strong>Updated this check:</strong><ul>${f.changes.map((c) => `<li>${esc(human(c.field))}: was “${esc(c.old)}”, now “${esc(c.new)}”${c.note ? ` — ${esc(c.note)}` : ''}</li>`).join('')}</ul></div>` : '';
  const es = st.es;
  const bi = (enHtml, esHtml) => esHtml ? `<div data-lang="en">${enHtml}</div><div data-lang="es" lang="es">${esHtml}</div>` : enHtml;
  const list = (a) => a?.length ? `<ul>${a.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : '';
  const signup = (a) => a ? `<p><b>Platform:</b> ${esc(a.platform)}</p>${a.steps?.length ? `<ol>${a.steps.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>` : ''}${a.depositInfo ? `<p><b>Deposit:</b> ${esc(a.depositInfo)}</p>` : ''}${a.directLink ? `<p>${link(a.directLink, 'Official / platform link')}</p>` : ''}` : '';
  const otc = (o) => o ? `<p><b>${o.available ? 'Available' : 'Not generally available'}.</b> ${esc(o.note || '')}</p>` : '';

  const facts = [
    ['Sale type', `<span class="pill t-${st.type}">${esc(st.typeLabel)}</span>`],
    ['Interest / penalty', esc(st.rate) + (st.rateNote ? `<small>${esc(st.rateNote)}</small>` : '')],
    ['Redemption', esc(st.redemption)],
    ['Bid method', esc(st.bidMethod || '—')],
    ['Statute', st.officialLink ? link(st.officialLink, st.statute || 'Statute') : esc(st.statute || '—')],
    ['Auction timing', esc(st.auctionTiming || '—')],
  ].map(([k, v]) => `<div class="fact"><dt>${k}</dt><dd>${v}</dd></div>`).join('');

  const countyLabel = st.code === 'CT' ? 'Towns' : st.code === 'LA' ? 'Parishes' : st.code === 'AK' ? 'Boroughs' : 'Counties';
  const rows = st.counties.map((c, i) => `<li class="county" id="c-${slug(c.name)}" data-i="${i}" data-type="${c.saleType}" data-name="${esc(c.name.toLowerCase())}">
  <button type="button" data-i="${i}"><span class="cn">${esc(c.name)}</span><span class="cp">${esc(c.platform || '—')}</span><span class="pill t-${c.saleType}">${esc(typeName(c.saleType))}</span></button></li>`).join('');
  const countyJson = JSON.stringify(st.counties.map((c) => ({ n: c.name, k: c.kind, t: c.saleType, tl: typeName(c.saleType), r: c.redemption, x: c.rate, p: c.platform, u: isUrl(c.url) ? c.url : '', no: c.notes, v: c.verifiedDate, e: c.extra })))
    .replace(/</g, '\\u003c');

  const sources = [];
  if (st.officialLink) sources.push(link(st.officialLink, `${st.statute || 'State statute'} (official)`));
  if (f.sourceUrl) sources.push(link(f.sourceUrl, f.sourceTitle || f.sourceUrl) + ` — checked ${esc(f.lastChecked)}`);
  if (st.auctionSignup?.directLink) sources.push(link(st.auctionSignup.directLink, 'Auction platform'));
  for (const fc of st.featuredCounties) if (isUrl(fc.link)) sources.push(link(fc.link, `${fc.name} County office`));

  const body = `
<nav class="crumbs" aria-label="Breadcrumb"><a href="/">All states</a> / ${esc(st.name)}</nav>
<section class="state-head">
  <div class="title-row"><h1>${esc(st.name)}</h1>${es ? `<div class="lang" role="group" aria-label="Language"><button type="button" data-setlang="en" aria-pressed="true">EN</button><button type="button" data-setlang="es" aria-pressed="false">ES</button></div>` : ''}</div>
  ${freshLine}
  <p class="disclaimer-line">${DISCLAIMER}</p>
  <dl class="facts">${facts}</dl>
  ${changes}
  ${st.investorAlert ? `<div class="callout">${renderValue(st.investorAlert)}</div>` : ''}
</section>

<section class="counties-sec" id="counties">
  <div class="sec-head"><h2>${countyLabel} <span class="count">${st.counties.length}</span></h2>${legend}</div>
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

<section class="prose">
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

${st.rules ? `<section class="prose rules"><h2>Detailed state rules</h2>${renderValue(Object.fromEntries(Object.entries(st.rules).filter(([k]) => k !== 'type')))}</section>` : ''}

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
  return page({ title: `${st.name} tax ${st.type === 'lien' ? 'lien' : st.type === 'hybrid' ? 'lien & deed' : 'deed'} rules by county — Aurigen`, desc: `${st.name}: ${st.typeLabel}. Interest/penalty ${st.rate}. Redemption ${st.redemption}. ${st.counties.length} ${countyLabel.toLowerCase()} with auction platforms.`, canonical: `/state/${st.code.toLowerCase()}/`, body });
}

// ---------- simple pages ----------
const aboutPage = () => page({ title: 'About — Aurigen County Resource Directory', desc: 'What the Aurigen directory is, where the data comes from, and how to report an error.', canonical: '/about/', body: `
<section class="prose narrow">
  <h1>About this directory</h1>
  <p>The Aurigen County Resource Directory is a free reference for people researching tax lien and tax deed sales in the United States. It covers all 50 states and Washington, DC, with ${states.reduce((n, s) => n + s.counties.length, 0).toLocaleString('en-US')} county, parish, borough and town records.</p>
  <p>Everything here is free. There is no sign-up and nothing is locked.</p>
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

const legalPage = () => page({ title: 'Legal disclaimer — Aurigen County Resource Directory', desc: 'Disclaimer for the Aurigen County Resource Directory.', canonical: '/legal/', body: `
<section class="prose narrow">
  <h1>Legal disclaimer</h1>
  <p class="disclaimer-line">${DISCLAIMER}</p>
  <p>The Aurigen County Resource Directory is provided for general information only. It is not legal, tax, investment or financial advice, and using it does not create any professional relationship.</p>
  <p>Tax sale laws, interest rates, redemption periods, auction dates, deposits and platforms change, and they vary by county and by property type. Information here may be incomplete, out of date or wrong. Always read the current statute and confirm every detail with the county office that runs the sale before you register, bid or pay.</p>
  <p>Links to government sites and auction platforms are provided for convenience. We do not control those sites and are not responsible for their content or availability.</p>
  <p>We do not collect or publish personal information about property owners.</p>
  <p>Tax sale investing carries real risk, including loss of your money. No result is promised or implied.</p>
  <p>Questions or corrections: see <a href="/about/#report">Report an error</a>.</p>
</section>` });

const notFound = () => page({ title: 'Page not found — Aurigen', desc: 'Page not found.', canonical: '/404', body: `
<section class="prose narrow center">
  <p class="eyebrow">404</p>
  <h1>Page not found</h1>
  <p>That page doesn’t exist. Try a state below or go back to the <a href="/">home page</a>.</p>
  <ul class="mini-states">${states.map((s) => `<li><a href="/state/${s.code.toLowerCase()}/">${s.code}</a></li>`).join('')}</ul>
</section>` });

// ---------- write ----------
fs.rmSync(PUB, { recursive: true, force: true });
write('assets/site.css', css);
write('assets/app.js', js);
write('index.html', homePage());
for (const st of states) write(`state/${st.code.toLowerCase()}/index.html`, statePage(st));
write('about/index.html', aboutPage());
write('legal/index.html', legalPage());
write('404.html', notFound());
write('robots.txt', `User-agent: *\nAllow: /\nDisallow: /extras/\nSitemap: ${SITE_URL}/sitemap.xml\n`);
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['/', '/about/', '/legal/', ...states.map((s) => `/state/${s.code.toLowerCase()}/`)].map((u) => `<url><loc>${SITE_URL}${u}</loc></url>`).join('')}</urlset>\n`);
// Search index: states + counties (name, state, type, slug).
write('assets/search.json', JSON.stringify({
  s: states.map((s) => [s.code, s.name, s.type]),
  c: states.flatMap((s) => s.counties.map((c) => [c.name, s.code, c.saleType, slug(c.name)])),
}));
// Extras page (served only through the Worker gate; see src/worker.js).
const extrasPath = path.join(BASE, 'src', 'extras.html');
if (fs.existsSync(extrasPath)) {
  const inner = fs.readFileSync(extrasPath, 'utf8');
  write('extras/index.html', page({ title: 'Extras — Aurigen', desc: 'Optional paid extras for the Aurigen directory.', canonical: '/extras/', body: inner, extraHead: '<meta name="robots" content="noindex">' }));
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
write('extras/files/aurigen-counties.csv', csv([
  ['state', 'state_name', 'county_or_town', 'kind', 'sale_type', 'redemption', 'interest_or_penalty', 'auction_platform', 'official_link', 'sale_timing', 'notes', 'research_dated'],
  ...states.flatMap((st) => st.counties.map((c) => [st.code, st.name, c.name, c.kind, typeName(c.saleType), c.redemption, c.rate, c.platform, isUrl(c.url) ? c.url : '',
    Object.entries(c.extra).filter(([k, v]) => /date|sale(month|window|frequency)/i.test(k) && typeof v === 'string').map(([, v]) => v).join(' | '), c.notes, c.verifiedDate])),
]));
write('extras/files/aurigen-states.csv', csv([
  ['state', 'state_name', 'sale_type', 'interest_or_penalty', 'redemption', 'bid_method', 'statute', 'statute_link', 'auction_timing', 'otc_available', 'last_checked', 'check_status', 'check_source'],
  ...states.map((s) => [s.code, s.name, s.typeLabel, s.rate, s.redemption, s.bidMethod, s.statute, s.officialLink, s.auctionTiming, s.otc ? (s.otc.available ? 'yes' : 'no') : '', s.fresh.lastChecked || '', s.fresh.status, s.fresh.sourceUrl || '']),
]));
console.log(`Extras: ${sales.length} upcoming sale dates in the next 12 months across ${new Set(sales.map((x) => x.s + x.c)).size} counties`);
