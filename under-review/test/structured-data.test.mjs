// Standing test: the structured data on every built page claims nothing the page does not say.
//
// Added 2026-11-19 with the markup itself. Structured data is the one thing on this site a reader
// never sees, so it is the one thing that could sit there wrong for months without anybody
// noticing. That is the whole reason this test exists, and the reason it has two halves:
//   1. the real built pages are clean
//   2. the checker still refuses markup that is wrong - a check that cannot fail is not a check
//
// Run with: node --test under-review/test/
// cloudflare/scripts/build-site.mjs runs the same checker on every built page, so a failure here
// is also a failure that stops a deploy.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { structuredDataProblems } from '../../cloudflare/scripts/structured-data.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const PUB = path.join(here, '..', '..', 'cloudflare', 'public');
const SITE = 'https://theplatbook.com';

const read = (rel) => fs.readFileSync(path.join(PUB, rel), 'utf8');
const exists = (rel) => fs.existsSync(path.join(PUB, rel));

// Every built page, by the address it is served at.
function builtPages() {
  const pages = new Map();
  if (!fs.existsSync(PUB)) return pages;
  if (exists('index.html')) pages.set('/', read('index.html'));
  for (const rel of ['about', 'legal', 'start-here']) {
    if (exists(`${rel}/index.html`)) pages.set(`/${rel}/`, read(`${rel}/index.html`));
  }
  if (exists('404.html')) pages.set('/404', read('404.html'));
  const stateDir = path.join(PUB, 'state');
  if (fs.existsSync(stateDir)) {
    for (const d of fs.readdirSync(stateDir)) {
      if (exists(`state/${d}/index.html`)) pages.set(`/state/${d}/`, read(`state/${d}/index.html`));
    }
  }
  const lessons = path.join(PUB, 'start-here', 'lessons');
  if (fs.existsSync(lessons)) {
    if (exists('start-here/lessons/index.html')) pages.set('/start-here/lessons/', read('start-here/lessons/index.html'));
    for (const d of fs.readdirSync(lessons)) {
      if (exists(`start-here/lessons/${d}/index.html`)) pages.set(`/start-here/lessons/${d}/`, read(`start-here/lessons/${d}/index.html`));
    }
  }
  return pages;
}

const PAGES = builtPages();

// ---------- 1. the real pages ----------

test('the site has been built, so there is something to check', () => {
  assert.ok(PAGES.size > 50, `expected the whole site; found ${PAGES.size} pages. Run: cd cloudflare && node scripts/build-site.mjs`);
});

test('every built page has clean structured data', () => {
  const problems = structuredDataProblems(PAGES, { site: SITE });
  assert.deepEqual(problems, [], `structured-data problems:\n${problems.join('\n')}`);
});

test('every state page carries a breadcrumb trail, and the home page carries the organisation', () => {
  const states = [...PAGES.keys()].filter((k) => k.startsWith('/state/'));
  assert.equal(states.length, 51, `expected 51 state pages, got ${states.length}`);
  for (const k of states) {
    assert.match(PAGES.get(k), /"@type":"BreadcrumbList"/, `${k} has no breadcrumb markup`);
  }
  const home = PAGES.get('/');
  assert.match(home, /"@type":"Organization"/, 'the home page has no organisation markup');
  assert.match(home, /"@type":"WebSite"/, 'the home page has no website markup');
  assert.match(PAGES.get('/start-here/'), /"@type":"FAQPage"/, 'Start Here has no question-and-answer markup');
});

test('the pages that are meant to carry no markup carry none', () => {
  for (const k of ['/about/', '/legal/', '/404']) {
    if (!PAGES.has(k)) continue;
    assert.doesNotMatch(PAGES.get(k), /application\/ld\+json/, `${k} is carrying structured data it was not given any`);
  }
});

test('nothing anywhere on the site claims a rating, a review or a credential', () => {
  for (const [k, html] of PAGES) {
    for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      assert.doesNotMatch(m[1], /aggregateRating|reviewCount|ratingValue|"@type":"Review"|hasCredential/i, `${k} claims a rating, review or credential`);
    }
  }
});

// ---------- 2. the checker still refuses markup that is wrong ----------

const ld = (data) => `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
// A page shaped like a real one: a brand in the header, a description, and a breadcrumb trail.
const fakePage = (blocks, { body = 'All states / Florida A visible answer.' } = {}) => `<!doctype html><html><head>
<meta name="description" content="A page description.">
</head><body>
<header class="top"><a class="brand" href="/"><span class="brand-mark">P</span><span>Platbook <em>County Resource Directory</em></span></a></header>
<nav class="crumbs"><a href="/">All states</a> / Florida</nav>
<p>${body}</p>
${blocks.join('\n')}
</body></html>`;

const one = (blocks, opts) => structuredDataProblems(new Map([['/state/fl/', fakePage(blocks, opts)]]), { site: SITE });

test('refuses a star rating', () => {
  const p = one([ld({ '@context': 'https://schema.org', '@type': 'Organization', name: 'Platbook', aggregateRating: { '@type': 'AggregateRating', ratingValue: 4.9, reviewCount: 120 } })]);
  assert.ok(p.some((x) => /rating, review or credential/.test(x)), p.join('\n'));
});

test('refuses a review, however deeply it is buried', () => {
  const p = one([ld({ '@context': 'https://schema.org', '@type': 'Organization', name: 'Platbook', subOrganization: { '@type': 'Organization', name: 'Platbook', makesOffer: { review: { '@type': 'Review', reviewRating: { ratingValue: 5 } } } } })]);
  assert.ok(p.some((x) => /rating, review or credential/.test(x)), p.join('\n'));
});

test('refuses a credential', () => {
  const p = one([ld({ '@context': 'https://schema.org', '@type': 'Organization', name: 'Platbook', hasCredential: 'Licensed' })]);
  assert.ok(p.some((x) => /rating, review or credential/.test(x)), p.join('\n'));
});

test('refuses a breadcrumb name the reader never sees', () => {
  const p = one([ld({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Best Tax Lien Deals', item: `${SITE}/` },
  ] })]);
  assert.ok(p.some((x) => /not the link text the reader sees/.test(x)), p.join('\n'));
});

test('accepts a breadcrumb name that is the link text on the page', () => {
  const p = one([ld({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'All states', item: `${SITE}/` },
    { '@type': 'ListItem', position: 2, name: 'Florida', item: `${SITE}/state/fl/` },
  ] })]);
  assert.deepEqual(p, []);
});

test('refuses breadcrumb steps numbered out of order', () => {
  const p = one([ld({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 2, name: 'All states', item: `${SITE}/` },
  ] })]);
  assert.ok(p.some((x) => /says it is position 2/.test(x)), p.join('\n'));
});

test('refuses a question the page does not ask', () => {
  const p = one([ld({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
    { '@type': 'Question', name: 'Is Platbook the best site for tax liens?', acceptedAnswer: { '@type': 'Answer', text: 'A visible answer.' } },
  ] })]);
  assert.ok(p.some((x) => /is not visible on the page/.test(x)), p.join('\n'));
});

test('refuses an answer the page does not give', () => {
  const p = one([ld({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
    { '@type': 'Question', name: 'A visible answer.', acceptedAnswer: { '@type': 'Answer', text: 'Returns of 18 percent are guaranteed.' } },
  ] })]);
  assert.ok(p.some((x) => /answer under .* is not visible/.test(x)), p.join('\n'));
});

test('refuses an address that is relative, and one that is off this site', () => {
  const rel = one([ld({ '@context': 'https://schema.org', '@type': 'Organization', name: 'Platbook', url: '/' })]);
  assert.ok(rel.some((x) => /not an absolute address/.test(x)), rel.join('\n'));
  const off = one([ld({ '@context': 'https://schema.org', '@type': 'Organization', name: 'Platbook', url: 'https://example.com/' })]);
  assert.ok(off.some((x) => /points off this site/.test(x)), off.join('\n'));
});

test('refuses a brand name that is not the one in the page header', () => {
  const p = one([ld({ '@context': 'https://schema.org', '@type': 'Organization', name: 'Aurigen County Resource Directory', url: `${SITE}/` })]);
  assert.ok(p.some((x) => /not the brand in the page header/.test(x)), p.join('\n'));
});

test('refuses a description that is not the page\'s own', () => {
  const p = one([ld({ '@context': 'https://schema.org', '@type': 'Organization', name: 'Platbook', url: `${SITE}/`, description: 'The number one tax lien resource in America.' })]);
  assert.ok(p.some((x) => /description is not the page's own description/.test(x)), p.join('\n'));
});

test('refuses broken JSON, a missing @context and a missing @type', () => {
  const bad = one(['<script type="application/ld+json">{"@type":</script>']);
  assert.ok(bad.some((x) => /not valid JSON/.test(x)), bad.join('\n'));
  const noCtx = one([ld({ '@type': 'Organization', name: 'Platbook' })]);
  assert.ok(noCtx.some((x) => /has no @context/.test(x)), noCtx.join('\n'));
  const noType = one([ld({ '@context': 'https://schema.org', name: 'Platbook' })]);
  assert.ok(noType.some((x) => /has no @type/.test(x)), noType.join('\n'));
});

test('refuses any structured data at all on the Rules Sheet key page', () => {
  const p = structuredDataProblems(new Map([
    ['/rules-sheet/', fakePage([ld({ '@context': 'https://schema.org', '@type': 'Organization', name: 'Platbook' })])],
  ]), { site: SITE });
  assert.ok(p.some((x) => /Rules Sheet key page carries/.test(x)), p.join('\n'));
});
