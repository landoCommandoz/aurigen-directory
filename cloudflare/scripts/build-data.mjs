// Aurigen data build: loads the legacy static data files (repo root) in the old
// load order and writes one JSON file per jurisdiction plus an index.
// Usage: node scripts/build-data.mjs   (run from cloudflare/)
import vm from 'node:vm';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, '..', '..');
const OUT = path.resolve(here, '..', 'data');

// Same order as warroom-billion.html (later files override earlier ones).
const FILES = [
  'states-data-v2.js', 'states-en.js', 'states-es.js', 'counties-data.js',
  'fl-counties-verified-v2.js', 'il-counties-verified-v2.js', 'az-counties-verified-v2.js',
  'nj-counties-verified-v1.js', 'ia-counties-verified-v1.js', 'oh-tx-ga-al-mi-verified-v1.js',
  'in-co-md-sc-wa-verified-v1.js', 'pa-nc-ny-mn-or-verified-v1.js', 'va-ct-tn-ky-nv-verified-v1.js',
  'ms-la-wv-ar-de-verified-v1.js', 'hi-id-mt-nd-sd-verified-v1.js', 'ks-me-ma-ne-nh-verified-v1.js',
  'nm-ok-ri-ut-vt-verified-v1.js', 'wi-wy-ak-mo-dc-verified-v1.js', 'ca-verified-v1.js',
];

const ctx = { console: { log() {}, warn() {}, error() {} } };
ctx.window = ctx;
vm.createContext(ctx);
for (const f of FILES) vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });
const G = vm.runInContext('({V2: STATES_V2, EN: STATES_EN, ES: STATES_ES})', ctx);
const CD = ctx.COUNTY_DATA;
const plain = (o) => JSON.parse(JSON.stringify(o ?? null));

const V2 = Array.isArray(G.V2) ? G.V2 : Object.values(G.V2);
const byCode = (arr, k) => Object.fromEntries(plain(arr).map((s) => [s[k], s]));
const EN = byCode(G.EN, 'id');
const ES = byCode(G.ES, 'id');
const V2M = byCode(V2, 'code');

// Fields removed from the free site (scores, sales funnel, empty result stubs).
const DROP = new Set(['score', 'scoreWhy', 'clarityCallCTA', 'results', 'counties', 'llcFriendly']);
const strip = (o) => Object.fromEntries(Object.entries(o || {}).filter(([k]) => !DROP.has(k)));

const TYPE_LABEL = {
  lien: 'Tax lien', deed: 'Tax deed', hybrid: 'Hybrid (lien then deed)',
  redeemable: 'Redeemable deed', 'redeemable deed': 'Redeemable deed', other: 'Other',
};
function normType(t) {
  const s = String(t || '').toLowerCase();
  if (s.includes('redeem')) return 'redeemable';
  if (s.includes('hybrid') || (s.includes('lien') && s.includes('deed'))) return 'hybrid';
  if (s.includes('lien')) return 'lien';
  if (s.includes('deed')) return 'deed';
  return s ? 'other' : '';
}

// Find a short text summary inside a nested rules object (e.g. redemption.period).
function findText(o, keys) {
  if (o == null) return '';
  if (typeof o === 'string') return o;
  if (typeof o !== 'object') return String(o);
  for (const k of keys) if (typeof o[k] === 'string' && o[k]) return o[k];
  for (const v of Object.values(o)) {
    if (v && typeof v === 'object') { const t = findText(v, keys); if (t && typeof v !== 'string') return t; }
  }
  return '';
}

const COUNTY_KEYS = ['county', 'municipality', 'parish', 'name'];
const codes = Object.keys(EN).sort();
fs.mkdirSync(path.join(OUT, 'states'), { recursive: true });

const index = [];
const report = [];
for (const code of codes) {
  const en = strip(EN[code]);
  const es = ES[code] ? strip(ES[code]) : null;
  const v2 = V2M[code] ? strip(V2M[code]) : {};
  const rules = plain(CD[`${code}_STATE_RULES`]) || null;
  if (rules) delete rules.results;
  const type = normType(rules?.type || v2.type || en.type);

  const raw = plain(Array.isArray(CD[code]) ? CD[code] : []);
  const counties = raw.map((r) => {
    if (typeof r === 'string') r = { county: r };
    const nameKey = COUNTY_KEYS.find((k) => typeof r[k] === 'string');
    const name = r[nameKey] || '';
    // Keep only fields that differ from the state rules (county-specific facts).
    const own = {};
    for (const [k, v] of Object.entries(r)) {
      if (k === nameKey || k === 'results' || k === 'verified') continue;
      if (rules && k in rules && JSON.stringify(rules[k]) === JSON.stringify(v)) continue;
      own[k] = v;
    }
    const saleType = normType(r.saleType || r.type || type);
    const platform = r.platform || r.deedAuction?.platform || r.auction?.platform || '';
    const url = r.url || r.deedAuction?.url || r.link || '';
    const redemption = findText(r.redemption, ['period', 'standard', 'general', 'note']) || en.redemption || v2.redemption || '';
    const rate = (typeof r.rate === 'string' && r.rate) ||
      findText(r.auction, ['rate', 'interestRate', 'maxRate', 'penalty']) || en.rate || v2.rate || '';
    const notes = [r.note, r.notes, r.alert].filter((x) => typeof x === 'string' && x);
    for (const k of ['note', 'notes', 'alert', 'platform', 'url', 'type', 'saleType', 'verifiedDate']) delete own[k];
    return {
      name, kind: nameKey === 'municipality' ? 'town' : nameKey === 'parish' ? 'parish' : 'county',
      saleType, redemption, rate, platform, url, notes, extra: own,
      verifiedDate: r.verifiedDate || rules?.verifiedDate || '',
    };
  });

  const state = {
    code, name: en.name, type, typeLabel: TYPE_LABEL[type] || en.type,
    rate: en.rate || v2.rate || '', rateNote: v2.rateNote || '',
    redemption: en.redemption || v2.redemption || '',
    bidMethod: v2.bidMethod || rules?.auction?.bidMethod || rules?.auction?.method || '',
    statute: v2.statute || rules?.statute || rules?.auction?.statute || '',
    officialLink: v2.officialLink || '',
    auctionPlatform: v2.auctionPlatform || '', auctionTiming: v2.auctionTiming || '',
    keyNotes: v2.keyNotes || [], investorAlert: v2.investorAlert || null,
    pendingLegislation: v2.pendingLegislation || null,
    summary: en.note || '', typeWhy: en.typeWhy || '', rateWhy: en.rateWhy || '',
    beginnerFriendly: en.beginnerFriendly ?? null, notBeginnerReason: en.notBeginnerReason || '',
    beginnerTip: en.beginnerTip || '', risks: en.risks || [], ddExtra: en.ddExtra || [],
    auctionSignup: en.auctionSignup || null, otc: en.otc || null, platforms: en.platforms || [],
    tylerCompliance: en.tylerCompliance || null,
    featuredCounties: (EN[code].counties || []).map((c) => ({ name: c.name, link: c.link || '', notes: c.notes || '' })),
    rules,
    es: es ? {
      type: es.type, rate: es.rate, redemption: es.redemption, summary: es.note, typeWhy: es.typeWhy,
      rateWhy: es.rateWhy, notBeginnerReason: es.notBeginnerReason || '', beginnerTip: es.beginnerTip,
      risks: es.risks || [], ddExtra: es.ddExtra || [], auctionSignup: es.auctionSignup || null, otc: es.otc || null,
    } : null,
    counties,
  };
  fs.writeFileSync(path.join(OUT, 'states', `${code.toLowerCase()}.json`), JSON.stringify(state, null, 1));
  index.push({ code, name: state.name, type, typeLabel: state.typeLabel, rate: state.rate, redemption: state.redemption, counties: counties.length });

  const want = ['rate', 'redemption', 'bidMethod', 'statute', 'officialLink', 'summary', 'auctionSignup', 'otc', 'platforms', 'rules', 'es'];
  const missing = want.filter((k) => !state[k] || (Array.isArray(state[k]) && !state[k].length));
  const cMissing = ['platform', 'url'].map((k) => [k, counties.filter((c) => !c[k]).length]).filter(([, n]) => n);
  report.push({ code, counties: counties.length, missing, cMissing });
}
fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(index, null, 1));

console.log('Coverage report');
let total = 0;
for (const r of report) {
  total += r.counties;
  const cm = r.cMissing.map(([k, n]) => `${k}:${n}`).join(' ');
  console.log(`${r.code}  ${String(r.counties).padStart(4)} records  missing: ${r.missing.join(',') || '-'}  county gaps: ${cm || '-'}`);
}
console.log(`TOTAL ${report.length} jurisdictions, ${total} county/town records`);
