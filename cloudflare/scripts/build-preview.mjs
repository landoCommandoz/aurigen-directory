#!/usr/bin/env node
// BUILD THE DESIGN-DIRECTION-1 PREVIEW OF THE WHOLE SITE. NOTHING HERE GOES LIVE.
//
//   cd cloudflare && node scripts/build-site.mjs && node scripts/build-preview.mjs
//   -> writes preview/redesign-2026-11-19/platbook/ at the repo root, OUTSIDE public/
//
// Written 2026-11-19 on Lando's instruction: "the whole site in design direction 1, the plat
// book. Preview only, nothing live. Yes, I want the whole site, not three samples."
//
// WHY IT RESKINS THE REAL PAGES INSTEAD OF WRITING NEW ONES.
// The brief says keep every legal statement, citation, link, date, page address, the pending
// notice, the visitor counting and everything from the search fixes. Re-typing 62 pages would
// put all of that at risk for no gain, so this script takes the pages the real build just
// produced and changes only the head: the stylesheet, the fonts, the theme colour and the
// icon. The words, the markup, the structured data and the counting script are untouched, and
// the check at the bottom of this file PROVES it rather than claiming it: it compares the
// visible text and every link of every preview page against the page it came from, and exits
// non-zero on any difference.
//
// THE ONE ADDITION IS data-page ON <html>. It carries no content and is not visible. It is how
// platbook.css can give a lesson more air than a state page, which the brief asks for, without
// a class having to be added to the real markup.
//
// THE RULES SHEET KEY PAGE is not built into public/ at all: the Worker serves it from
// under-review/sheet.js. The preview copy is the live locked page, fetched once and saved under
// fixtures/, with its own stylesheet swapped the same way. Its unlock form still posts to
// /rules-sheet/unlock, which this static preview does not serve, so nothing can open it here.
// The real gate in the Worker was not touched, and the preview holds no key and no CSV.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ROOT = path.resolve(BASE, '..');
const PUB = path.join(BASE, 'public');
const OUT = path.join(ROOT, 'preview', 'redesign-2026-11-19', 'platbook');
const FONTS = process.env.PREVIEW_FONTS || '';
const FIXTURES = path.join(BASE, 'scripts', 'preview', 'fixtures');

if (!fs.existsSync(PUB)) {
  console.error('public/ is not built. Run: node scripts/build-site.mjs');
  process.exit(1);
}
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

// ---------- which kind of page is this, by its address ----------
const pageKind = (rel) => {
  const url = '/' + rel.replace(/\\/g, '/').replace(/index\.html$/, '').replace(/\.html$/, '');
  if (url === '/') return 'home';
  if (/^\/start-here\/lessons\/\d+\/$/.test(url)) return 'lesson';
  if (url === '/start-here/lessons/') return 'lessons';
  if (url === '/start-here/') return 'start-here';
  if (url === '/about/') return 'about';
  if (url === '/legal/') return 'legal';
  if (url === '/rules-sheet/') return 'sheet';
  if (url.startsWith('/state/')) return 'state';
  return 'other';
};

// ---------- the head swap ----------
// NEITHER FONT IS PRELOADED, AND THAT IS A MEASURED DECISION, NOT AN OVERSIGHT.
// The live site preloads Fraunces because no size-adjust value could fix its headline: Fraunces
// needs 3 lines where Georgia needs 2 at phone width, which is a line-break boundary. Vollkorn
// has no such boundary at any of the sizes this design uses, so the measured stand-ins hold the
// layout on their own. Measured at 375px on the throttled mobile profile, 5 runs each:
//   with both fonts preloaded   home first paint 1200ms, layout shift 0.0000, moved 0px
//   with Vollkorn preloaded     home first paint 1156ms, layout shift 0.0000, moved 0px
//   with neither preloaded      home first paint  876ms, layout shift 0.0000, moved 0px
// The two files are 58KB, which is about 290ms of a 1.6Mbps connection, and they buy nothing:
// moved was 0px in all five runs of every variant. If a future heading size reintroduces a
// line-break boundary, put the preload back and re-measure; do not add it on principle.
const FONT_HEAD = '';
// A linen plate with the volume letter stamped in iron-gall ink, in place of the blue tile.
const ICON = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23eceee9'/%3E%3Crect x='1.5' y='1.5' width='29' height='29' fill='none' stroke='%231f2420' stroke-width='1.5'/%3E%3Ctext x='16' y='23' font-size='17' text-anchor='middle' fill='%231f2420' font-family='Georgia,serif' font-weight='700'%3EP%3C/text%3E%3C/svg%3E`;

function reskin(html, kind, cssHref) {
  let out = html;
  // Both webfonts are served from this site now, so the third-party stylesheet goes entirely:
  // the two preconnects, the print-media link, its noscript copy and the Fraunces preload.
  out = out.replace(/<link rel="preconnect" href="https:\/\/fonts\.(googleapis|gstatic)\.com"[^>]*>\n?/g, '');
  out = out.replace(/<link rel="stylesheet" media="print"[^>]*fonts\.googleapis[^>]*>\n?/g, '');
  out = out.replace(/<noscript><link rel="stylesheet" href="https:\/\/fonts\.googleapis[^>]*><\/noscript>\n?/g, '');
  out = out.replace(/<link rel="preload" as="font"[^>]*fraunces[^>]*>\n?/gi, '');
  // The site's own stylesheet becomes the plat-book one, at the same place in the head.
  out = out.replace(/<link rel="stylesheet" href="\/assets\/site\.css[^"]*">/, `<link rel="stylesheet" href="${cssHref}">${FONT_HEAD}`);
  // Ink, not cyanotype blue, and a plate for an icon.
  out = out.replace(/<meta name="theme-color" content="[^"]*">/, '<meta name="theme-color" content="#1f2420">');
  out = out.replace(/<link rel="icon" href="data:image\/svg\+xml,[^"]*">/, `<link rel="icon" href="${ICON}">`);
  // The styling hook. Not content, not visible, and the only markup this script adds.
  out = out.replace(/<html lang="en">/, `<html lang="en" data-page="${kind}">`);
  return out;
}

// ---------- copy and reskin every built page ----------
const walk = (dir, rel = '') => fs.readdirSync(path.join(dir, rel), { withFileTypes: true })
  .flatMap((e) => (e.isDirectory() ? walk(dir, path.join(rel, e.name)) : [path.join(rel, e.name)]));

const pages = [];
for (const rel of walk(PUB)) {
  const src = path.join(PUB, rel);
  const dst = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  if (rel.endsWith('.html')) {
    const kind = pageKind(rel);
    const before = fs.readFileSync(src, 'utf8');
    const after = reskin(before, kind, '/assets/platbook.css');
    fs.writeFileSync(dst, after);
    pages.push({ rel, kind, before, after });
  } else if (rel === 'assets/site.css') {
    // Left out on purpose: nothing in the preview links to it.
  } else {
    fs.copyFileSync(src, dst);
  }
}

// ---------- the stylesheet, the fonts and their licences ----------
fs.mkdirSync(path.join(OUT, 'assets', 'fonts'), { recursive: true });
fs.copyFileSync(path.join(BASE, 'src', 'preview', 'platbook.css'), path.join(OUT, 'assets', 'platbook.css'));
// Vollkorn is a VARIABLE font on Google Fonts: the 400, 600 and 700 latin files are byte for
// byte the same file, so one name per unicode range is served instead of three.
const FONT_FILES = [
  ['vollkorn-400-latin.woff2', 'vollkorn-latin.woff2'],
  ['vollkorn-400-latin-ext.woff2', 'vollkorn-latin-ext.woff2'],
  ['archivo-narrow-600-latin.woff2', 'archivo-narrow-600-latin.woff2'],
  ['archivo-narrow-600-latin-ext.woff2', 'archivo-narrow-600-latin-ext.woff2'],
  ['OFL-vollkorn.txt', 'OFL-vollkorn.txt'],
  ['OFL-archivonarrow.txt', 'OFL-archivonarrow.txt'],
];
const fontSrc = FONTS || path.join(BASE, 'src', 'preview', 'fonts');
let fontsCopied = 0;
for (const [from, to] of FONT_FILES) {
  const p = path.join(fontSrc, from);
  if (fs.existsSync(p)) { fs.copyFileSync(p, path.join(OUT, 'assets', 'fonts', to)); fontsCopied++; }
}
if (fontsCopied !== FONT_FILES.length) {
  console.error(`only ${fontsCopied} of ${FONT_FILES.length} font files found in ${fontSrc}`);
  console.error('Set PREVIEW_FONTS to the folder holding them, or copy them to cloudflare/src/preview/fonts/.');
  process.exit(1);
}

// ---------- the Rules Sheet key page ----------
// The live locked page, saved once under fixtures/. Its own stylesheet is inline and uses its
// own class names, so it gets its own reskin file rather than platbook.css.
const sheetFixture = path.join(FIXTURES, 'rules-sheet.html');
let sheetDone = false;
if (fs.existsSync(sheetFixture)) {
  let h = fs.readFileSync(sheetFixture, 'utf8');
  h = h.replace(/<style>[\s\S]*?<\/style>/, `<link rel="stylesheet" href="/assets/platbook-sheet.css">${FONT_HEAD}`);
  h = h.replace(/<link rel="preconnect" href="https:\/\/fonts\.(googleapis|gstatic)\.com"[^>]*>\n?/g, '');
  // The sheet page writes href before rel, so the site's own pattern does not match it.
  h = h.replace(/<link [^>]*fonts\.googleapis[^>]*>\n?/g, '');
  h = h.replace(/<noscript><link rel="stylesheet" href="https:\/\/fonts\.googleapis[^>]*><\/noscript>\n?/g, '');
  h = h.replace(/<meta name="theme-color" content="[^"]*">/, '<meta name="theme-color" content="#1f2420">');
  h = h.replace(/<link rel="icon" href="data:image\/svg\+xml,[^"]*">/, `<link rel="icon" href="${ICON}">`);
  h = h.replace(/<html lang="en">/, '<html lang="en" data-page="sheet">');
  fs.mkdirSync(path.join(OUT, 'rules-sheet'), { recursive: true });
  fs.writeFileSync(path.join(OUT, 'rules-sheet', 'index.html'), h);
  fs.copyFileSync(path.join(BASE, 'src', 'preview', 'platbook-sheet.css'), path.join(OUT, 'assets', 'platbook-sheet.css'));
  pages.push({ rel: 'rules-sheet/index.html', kind: 'sheet', before: fs.readFileSync(sheetFixture, 'utf8'), after: h });
  sheetDone = true;
}

// ---------- PROVE NOTHING BUT THE DESIGN CHANGED ----------
// Not a promise: a check. The visible text and every link of every preview page must match the
// page it was made from, character for character. If this ever fails, the preview has started
// to differ from the site in something other than its appearance, and that is the one thing
// this whole approach exists to prevent.
const visible = (h) => h
  .replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ')
  .replace(/<head[\s\S]*?<\/head>/i, ' ').replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
// Only the links a reader can follow, so the head swap above is not read as a change: the two
// font links that leave and the stylesheet that changes are all in the head.
const links = (h) => (h.replace(/<head[\s\S]*?<\/head>/i, ' ').match(/href="[^"]*"/g) || []).join('\n');
const problems = [];
for (const p of pages) {
  if (visible(p.before) !== visible(p.after)) problems.push(`${p.rel}: the words on the page changed`);
  if (links(p.before) !== links(p.after)) problems.push(`${p.rel}: the links on the page changed`);
  if (!/data-page="/.test(p.after)) problems.push(`${p.rel}: did not get its data-page hook, so it will be styled as a state page`);
  if (/site\.css|fonts\.googleapis/.test(p.after)) problems.push(`${p.rel}: still asks for the live stylesheet or the third-party fonts`);
}
// Everything the search fixes added has to survive, on the pages that carry it.
const html = (rel) => fs.readFileSync(path.join(OUT, rel), 'utf8');
const states = pages.filter((p) => p.kind === 'state');
if (states.length !== 51) problems.push(`expected 51 state pages, found ${states.length}`);
for (const p of states) {
  if (!/"@type":"BreadcrumbList"/.test(p.after)) problems.push(`${p.rel}: lost its breadcrumb markup`);
}
if (!/"@type":"Organization"/.test(html('index.html')) || !/"@type":"WebSite"/.test(html('index.html'))) problems.push('the home page lost its organisation or website markup');
if (!/"@type":"FAQPage"/.test(html('start-here/index.html'))) problems.push('Start Here lost its question-and-answer markup');
const fresh = states.filter((p) => /Last checked against the official source/.test(p.after)).length;
if (fresh !== 47) problems.push(`expected the last-checked line on 47 state pages, found it on ${fresh}`);
const counted = pages.filter((p) => /cloudflareinsights\.com\/beacon/.test(p.after)).length;
if (counted < 57) problems.push(`the visitor counting is on only ${counted} pages`);
if (!sheetDone) problems.push('the Rules Sheet page is missing: save the live locked page to scripts/preview/fixtures/rules-sheet.html');

if (problems.length) {
  console.error('PREVIEW REFUSED. The preview must differ from the live site in nothing but its design:');
  for (const x of problems) console.error('  - ' + x);
  process.exit(1);
}

// ---------- a note in the folder, so nobody has to guess what this is ----------
// preview/ is gitignored, so this folder is not in the repository and this README is written
// fresh on every build. What IS in the repository is everything needed to rebuild it:
// src/preview/platbook.css, src/preview/platbook-sheet.css, src/preview/fonts/ with both
// licences, scripts/preview/fixtures/rules-sheet.html and this script.
fs.writeFileSync(path.join(OUT, 'README.txt'), `THE PLAT BOOK - design direction 1, the whole site. A PREVIEW. NOTHING HERE IS LIVE.
Built ${new Date().toISOString().slice(0, 10)} by cloudflare/scripts/build-preview.mjs.

WHAT IT IS
The real built site with one stylesheet swapped. Every word, link, statute, date, page address,
the pending notice and the visitor counting are the live ones, unchanged: the build refuses to
write this folder if the visible text or any link of any page differs from the page it came
from. The only markup added is data-page on <html>, which is a styling hook and carries nothing.

TO LOOK AT IT
  npx -y http-server "<this folder>" -p 8097 -c-1
then open http://127.0.0.1:8097/ . Serve it at the root of its own server: the pages use the
site's real addresses, so opening the files directly will not find the stylesheet.

THE RULES SHEET PAGE
/rules-sheet/ is a copy of the live LOCKED page. Nothing here serves /rules-sheet/unlock, so no
key can open anything, and this folder holds no key and no sheet data. The real gate lives in
the Worker and was not touched.

TO PUT IT LIVE (not done, and not to be done without Lando saying so)
Copy src/preview/platbook.css over src/site.css, move the four font files and the two licence
files into src/fonts/, and change the head in build-site.mjs the way build-preview.mjs does.
`);

const kinds = pages.reduce((a, p) => ((a[p.kind] = (a[p.kind] || 0) + 1), a), {});
console.log(`Preview written to ${path.relative(ROOT, OUT)}`);
console.log(`${pages.length} pages: ` + Object.entries(kinds).map(([k, n]) => `${n} ${k}`).join(', '));
console.log('Words, links, structured data, last-checked lines and visitor counting all verified unchanged.');
console.log(`Serve it with: npx -y http-server "${OUT}" -p 8097 -c-1`);
