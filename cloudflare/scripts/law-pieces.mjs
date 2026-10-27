// Shared by build-site.mjs and check-law.mjs, so the law gate splits state text exactly the way the
// site renders it. A "piece" is one shown statement: a short field value, one list item sentence, or
// one summary sentence, in English or Spanish.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const BASE = path.resolve(here, '..');
export const ROOT = path.resolve(BASE, '..');
export const LAW = path.join(BASE, 'data', 'law');

// Words that end in a period but do not end a sentence.
const ABBR = new Set(['stat', 'u.s', 'ann', 'no', 'nos', 'sec', 'secs', 'rev', 'gen', 'comp', 'art', 'ch', 'st', 'inc', 'co',
  'corp', 'dept', 'mr', 'ms', 'mrs', 'dr', 'vs', 'v', 'e.g', 'i.e', 'approx', 'jan', 'feb', 'mar', 'apr', 'jun', 'jul', 'aug',
  'sept', 'sep', 'oct', 'nov', 'dec', 'r.s', 'a.r.s', 'c.r.s', 'n.j.s.a', 'w.s', 'm.c.a', 'o.c.g.a', 'la', 'ala', 'ark', 'cal',
  'fla', 'ga', 'ill', 'ind', 'kan', 'ky', 'md', 'mass', 'mich', 'minn', 'miss', 'mo', 'mont', 'neb', 'nev', 'okla', 'pa', 'tenn',
  'tex', 'va', 'vt', 'wash', 'wis', 'wyo', 'del', 'conn', 'colo', 'ariz', 'haw', 'n.h', 'n.m', 'n.y', 'n.c', 'n.d', 's.c', 's.d',
  'r.i', 'w.va', 'd.c', 'pub', 'p.l', 'sess', 'reg', 'admin', 'supp', 'ord', 'twp', 'ft', 'mt', 'stats', 'cód', 'art', 'núm']);

// Split on . ? ! followed by a space and a capital letter, ignoring abbreviations and "§".
export function sentences(text) {
  const s = String(text ?? '').trim();
  if (!s) return [];
  const out = [];
  let start = 0;
  const rx = /[.?!]\s+(?=[A-ZÁÉÍÓÚÑ¿¡"“(])/g;
  let m;
  while ((m = rx.exec(s))) {
    const before = s.slice(start, m.index + 1);
    const word = (before.match(/(\S+)$/) || [''])[1].replace(/^[("“]+/, '');
    const bare = word.replace(/[.?!]$/, '').toLowerCase();
    if (m[0][0] === '.' && (ABBR.has(bare) || word === '§.' || /^[A-Z]$/.test(word.replace(/\.$/, '')))) continue;
    out.push(s.slice(start, m.index + 1).trim());
    start = m.index + m[0].length;
  }
  out.push(s.slice(start).trim());
  return out.filter(Boolean);
}

// Field order on the state page. kind: 'one' = whole value, 'prose' = split into sentences, 'list' = each
// item split into sentences. get(st) reads the English record, getEs(es) the Spanish one.
export const FIELDS = [
  { field: 'type', kind: 'one', get: (s) => s.typeLabel },
  { field: 'rate', kind: 'one', get: (s) => s.rate, getEs: (e) => e.rate },
  { field: 'rateNote', kind: 'one', get: (s) => s.rateNote },
  { field: 'redemption', kind: 'one', get: (s) => s.redemption, getEs: (e) => e.redemption },
  { field: 'bidMethod', kind: 'one', get: (s) => s.bidMethod },
  { field: 'statute', kind: 'one', get: (s) => s.statute },
  { field: 'auctionPlatform', kind: 'one', get: (s) => s.auctionPlatform },
  { field: 'auctionTiming', kind: 'one', get: (s) => s.auctionTiming },
  { field: 'summary', kind: 'prose', get: (s) => s.summary, getEs: (e) => e.summary },
  { field: 'typeWhy', kind: 'prose', get: (s) => s.typeWhy, getEs: (e) => e.typeWhy },
  { field: 'rateWhy', kind: 'prose', get: (s) => s.rateWhy, getEs: (e) => e.rateWhy },
  { field: 'keyNotes', kind: 'list', get: (s) => s.keyNotes },
  { field: 'notBeginnerReason', kind: 'prose', get: (s) => s.beginnerFriendly === false ? s.notBeginnerReason : '', getEs: (e, s) => s.beginnerFriendly === false ? e.notBeginnerReason : '' },
  { field: 'beginnerTip', kind: 'prose', get: (s) => s.beginnerTip, getEs: (e) => e.beginnerTip },
  { field: 'risks', kind: 'list', get: (s) => s.risks, getEs: (e) => e.risks },
  { field: 'ddExtra', kind: 'list', get: (s) => s.ddExtra, getEs: (e) => e.ddExtra },
  { field: 'signup.platform', kind: 'one', get: (s) => s.auctionSignup?.platform, getEs: (e) => e.auctionSignup?.platform },
  { field: 'signup.steps', kind: 'list', get: (s) => s.auctionSignup?.steps, getEs: (e) => e.auctionSignup?.steps },
  { field: 'signup.deposit', kind: 'prose', get: (s) => s.auctionSignup?.depositInfo, getEs: (e) => e.auctionSignup?.depositInfo },
  { field: 'otc.available', kind: 'one', get: (s) => s.otc ? (s.otc.available ? 'Available' : 'Not generally available') : '' },
  { field: 'otc.note', kind: 'prose', get: (s) => s.otc?.note, getEs: (e) => e.otc?.note },
  { field: 'platforms', kind: 'list', get: (s) => s.platforms },
  { field: 'surplus', kind: 'prose', get: (s) => s.tylerCompliance?.summary },
];
export const FIELD_ORDER = FIELDS.map((f) => f.field);

function piecesOf(def, value, lang) {
  const pre = lang === 'es' ? 'es.' : '';
  if (value == null || value === '' || (Array.isArray(value) && !value.length)) return [];
  if (def.kind === 'one') return [{ id: pre + def.field, lang, field: def.field, text: String(value).trim() }];
  if (def.kind === 'prose') return sentences(value).map((t, i) => ({ id: `${pre}${def.field}.${i + 1}`, lang, field: def.field, text: t }));
  const out = [];
  (Array.isArray(value) ? value : [value]).forEach((item, i) => {
    const ss = sentences(item);
    ss.forEach((t, j) => out.push({ id: `${pre}${def.field}.${i + 1}${ss.length > 1 ? '.' + (j + 1) : ''}`, lang, field: def.field, text: t }));
  });
  return out;
}

// Every statement the site shows for a state record (data/states/<st>.json), English then Spanish.
export function statePieces(st) {
  const out = [];
  for (const d of FIELDS) out.push(...piecesOf(d, d.get(st), 'en'));
  if (st.es) for (const d of FIELDS) if (d.getEs) out.push(...piecesOf(d, d.getEs(st.es, st), 'es'));
  return out;
}

export function loadLedger(code) {
  const p = path.join(LAW, `${code.toLowerCase()}.json`);
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

// Banned money words in user-facing text (spec rule 5).
export const BANNED_EN = /\b(earn\w*|guarantee\w*|profit\w*|returns?|returned|returning)\b/i;
export const BANNED_ES = /(?<![\p{L}])(gan(ar|a|as|an|é|ó|amos|ado|ados|ada|adas|ando|ancia|ancias|e|es|en)|garantiz\p{L}*|rendimiento\p{L}*|retorno\p{L}*)(?![\p{L}])/iu;
export function bannedWord(text, lang) {
  const m = String(text || '').match(lang === 'es' ? BANNED_ES : BANNED_EN);
  return m ? m[0] : null;
}

const fmtDate = (iso) => String(iso || '').slice(0, 10);
export const LABEL_FLAGGED = 'Under review. Confirm with the county.';
export const LABEL_FLAGGED_ES = 'En revisión. Confirme con el condado.';
export const labelUnreachable = (date, lang) => lang === 'es'
  ? `No se pudo consultar la fuente el ${fmtDate(date)}. Confirme con el condado.`
  : `Couldn't reach source on ${fmtDate(date)}. Confirm with the county.`;

// The note shown next to a claim, by status. check-law.mjs uses this to prove the labels render.
export function claimNote(c) {
  const parts = [];
  if (c.effective) parts.push(c.lang === 'es' ? `Desde ${fmtDate(c.effective)}:` : `From ${fmtDate(c.effective)}:`);
  if (c.status === 'flagged') parts.push(c.lang === 'es' ? LABEL_FLAGGED_ES : LABEL_FLAGGED);
  if (c.status === 'unreachable') parts.push(labelUnreachable(c.checked || c.attemptedAt, c.lang));
  return parts.join(' ');
}

// Plain text of a claim as rendered (shown text plus any status note).
export function claimText(c) {
  const note = claimNote(c);
  if (c.effective) return `${note} ${c.shown}`.trim();
  return note ? `${c.shown} (${note})` : c.shown;
}
