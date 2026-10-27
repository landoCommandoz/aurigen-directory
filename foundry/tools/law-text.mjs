// Shared text helpers for the Aurigen law audit.
// The only sanctioned way to turn a downloaded statute page into text, normalize it, and check
// that a quote appears in it word for word. check-law.mjs and watch-statutes.mjs must import these.
import fs from 'node:fs';
import crypto from 'node:crypto';

export const sha256 = (buf) => crypto.createHash('sha256').update(buf).digest('hex');

const NAMED = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ensp: ' ', emsp: ' ', thinsp: ' ',
  sect: '§', para: '¶', ndash: '-', mdash: '-', minus: '-', hyphen: '-', shy: '',
  lsquo: "'", rsquo: "'", sbquo: "'", ldquo: '"', rdquo: '"', bdquo: '"', prime: "'", Prime: '"',
  hellip: '...', middot: '·', bull: '•', copy: '©', reg: '®', trade: '™', deg: '°',
  frac12: '1/2', frac14: '1/4', frac34: '3/4', percnt: '%', dollar: '$', cent: '¢', times: '×',
  laquo: '"', raquo: '"', iexcl: '¡', iquest: '¿', aacute: 'á', eacute: 'é', iacute: 'í',
  oacute: 'ó', uacute: 'ú', ntilde: 'ñ', Aacute: 'Á', Eacute: 'É', Iacute: 'Í', Oacute: 'Ó',
  Uacute: 'Ú', Ntilde: 'Ñ', uuml: 'ü', Uuml: 'Ü', ccedil: 'ç', zwsp: '', zwnj: '', zwj: '',
};

export function decodeEntities(s) {
  return s.replace(/&(#x[0-9a-f]+|#[0-9]+|[a-z][a-z0-9]*);/gi, (m, e) => {
    if (e[0] === '#') {
      const cp = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      try { return String.fromCodePoint(cp); } catch { return m; }
    }
    return Object.prototype.hasOwnProperty.call(NAMED, e) ? NAMED[e] : m;
  });
}

// HTML to readable text, keeping block boundaries as line breaks.
export function htmlToText(html) {
  let s = html;
  s = s.replace(/<!--[\s\S]*?-->/g, ' ');
  s = s.replace(/<(script|style|noscript|template|svg|head|iframe|object)\b[\s\S]*?<\/\1\s*>/gi, ' ');
  s = s.replace(/<br\s*\/?>/gi, '\n');
  s = s.replace(/<\/?(p|div|section|article|header|footer|nav|aside|main|h[1-6]|li|ul|ol|dl|dt|dd|tr|table|tbody|thead|blockquote|pre|hr|form|fieldset|address|center)\b[^>]*>/gi, '\n');
  s = s.replace(/<\/?(td|th)\b[^>]*>/gi, ' ');
  s = s.replace(/<[^>]+>/g, '');
  return decodeEntities(s);
}

// One normalization for snapshots, quotes and the statute watch.
// Keeps line breaks (for reading), straightens quotes, unifies dashes and spaces.
export function normalizeText(s) {
  return String(s)
    .normalize('NFKC')
    .replace(/­/g, '')                        // soft hyphen
    .replace(/[​-‍﻿]/g, '')         // zero-width characters
    .replace(/[‘’‚‛′]/g, "'")
    .replace(/[“”„‟″]/g, '"')
    .replace(/[‐-―−]/g, '-')        // hyphens, en and em dashes, minus
    .replace(/\r\n?/g, '\n')
    .replace(/[^\S\n]+/g, ' ')                     // collapse spaces and tabs, keep newlines
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// For matching only: all whitespace becomes one space.
const flat = (s) => normalizeText(s).replace(/\s+/g, ' ');
// PDFs break words across lines with a hyphen ("re-\ndemption"); also try with those joined.
const dehyphen = (s) => normalizeText(s).replace(/([A-Za-z])-\n([a-z])/g, '$1$2').replace(/\s+/g, ' ');

// True when the quote appears word for word (after normalization) in the snapshot text.
export function quoteFound(quote, text) {
  const q = flat(quote);
  if (q.length < 12) return false;               // too short to prove anything
  return flat(text).includes(q) || dehyphen(text).includes(q);
}

// Confirms a snapshot is exactly what fetch-source.mjs wrote: the text file's hash must match its
// .json record. Returns { ok, reason, meta, text }.
export function loadSnapshot(jsonPath) {
  let meta;
  try { meta = JSON.parse(fs.readFileSync(jsonPath, 'utf8')); } catch (e) { return { ok: false, reason: `no snapshot record: ${e.message}` }; }
  const txtPath = jsonPath.replace(/\.json$/, '.txt');
  let text;
  try { text = fs.readFileSync(txtPath, 'utf8'); } catch { return { ok: false, reason: 'snapshot text file missing', meta }; }
  if (meta.tool !== 'foundry/tools/fetch-source.mjs') return { ok: false, reason: 'snapshot not written by fetch-source.mjs', meta };
  if (sha256(text) !== meta.text_sha256) return { ok: false, reason: 'snapshot text was changed after download (hash mismatch)', meta };
  return { ok: true, meta, text };
}
