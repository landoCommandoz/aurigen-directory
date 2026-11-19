// THE STANDING CHECK ON EVERY PIECE OF STRUCTURED DATA THE SITE SHIPS.
//
// Lando, 2026-11-19: structured data on all the older pages, "no ratings, reviews or credentials",
// and nothing on the Rules Sheet key page. This file is what makes those three hold. build-site.mjs
// runs it over every built page and FAILS the build; under-review/test/structured-data.test.mjs
// runs it on hand-made bad pages and proves it still refuses them.
//
// WHY A CHECKER AND NOT JUST CAREFUL WRITING. Structured data is the one thing on the site a
// reader never sees. Every other claim here is checked by somebody's eyes eventually; a sentence
// buried in a script tag is not, so a stale or invented one could sit there for months. The rule
// this file enforces is the same rule the rest of the site already obeys, moved to the one place
// where nobody would notice it breaking: a block may not say anything the page does not say.
//
// WHAT IT REFUSES, AND WHY EACH ONE:
//
//   * A RATING, A REVIEW, OR A CREDENTIAL, anywhere, at any depth. Platbook has no customers to
//     quote and no qualification to assert. Marking up either would be the single worst thing
//     this markup could do, because a search engine would repeat it as our own claim about
//     ourselves, and nobody reading the page could see it to object.
//   * A BLOCK ON THE RULES SHEET KEY PAGE. That page is served by under-review/sheet.js behind the
//     Worker's licence gate. It is not built here, so this check is a tripwire: if a block ever
//     starts appearing at that address, something has moved the page into this build.
//   * A BREADCRUMB NAME THAT IS NOT THE LINK TEXT THE READER SEES in that page's own breadcrumb
//     trail, or a step pointing at an address the page does not link to.
//   * A QUESTION OR AN ANSWER THAT IS NOT IN THE PAGE'S VISIBLE TEXT. Same rule as faqJsonLd(),
//     checked again here on the finished HTML, because the emitter and the output can drift.
//   * AN ORGANISATION OR WEBSITE NAME THAT IS NOT THE BRAND IN THE PAGE HEADER, or a description
//     that is not the page's own description.
//   * A RELATIVE URL, OR ONE OFF THIS SITE. Every address a block names must be an absolute
//     address on the canonical host.
//   * MALFORMED JSON, a missing @context, or a missing @type.
//
// It makes no judgment about whether a block SHOULD be on a page. That decision lives in
// build-site.mjs, where it is visible beside the page it belongs to.

const BANNED = /^(aggregaterating|reviewrating|rating|review|ratingvalue|reviewcount|ratingcount|bestrating|worstrating|hascredential|credential|educationalcredentialawarded|award|awards|testimonial)$/i;
const BANNED_TYPES = /^(Review|AggregateRating|Rating|EducationalOccupationalCredential|UserReview|CriticReview)$/i;

const decodeEntities = (t) => String(t)
  .replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');

export const visibleText = (html) => decodeEntities(String(html)
  .replace(/<head>[\s\S]*?<\/head>/i, ' ')
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();

const blocksIn = (html) => [...String(html).matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);

// Every anchor on the page, as href -> the set of link texts used for it.
function anchors(html) {
  const out = new Map();
  for (const m of String(html).matchAll(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)) {
    const href = decodeEntities(m[1]);
    if (!out.has(href)) out.set(href, new Set());
    out.get(href).add(visibleText(m[2]));
  }
  return out;
}

// Walk every value in a parsed block, so a banned key cannot hide inside a nested object.
function walk(node, fn, trail = '') {
  if (Array.isArray(node)) { node.forEach((v, i) => walk(v, fn, `${trail}[${i}]`)); return; }
  if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) { fn(k, v, trail); walk(v, fn, trail ? `${trail}.${k}` : k); }
  }
}

// The brand in the site header, read off the page rather than assumed.
function brandOnPage(html) {
  const m = String(html).match(/<a class="brand"[^>]*>([\s\S]*?)<\/a>/);
  return m ? visibleText(m[1]) : '';
}

function metaDesc(html) {
  const m = String(html).match(/<meta name="description" content="([^"]*)">/);
  return m ? decodeEntities(m[1]) : '';
}

/**
 * @param pages  Map of page address ("/", "/state/fl/") -> that page's built HTML.
 * @param opts.site  The canonical origin every address in a block must sit on.
 * @param opts.sheetPath  The Rules Sheet key page, which must carry no markup at all.
 * @returns array of plain-English problems; empty means clean.
 */
export function structuredDataProblems(pages, { site = 'https://theplatbook.com', sheetPath = '/rules-sheet/' } = {}) {
  const problems = [];
  for (const [where, html] of pages) {
    const raw = blocksIn(html);
    if (where === sheetPath || where.startsWith(sheetPath)) {
      if (raw.length) problems.push(`${where}: the Rules Sheet key page carries ${raw.length} structured-data block(s); it is meant to carry none`);
      continue;
    }
    const seen = visibleText(html);
    const links = anchors(html);
    const brand = brandOnPage(html);
    const desc = metaDesc(html);

    raw.forEach((text, n) => {
      const at = `${where} block ${n + 1}`;
      let data;
      try { data = JSON.parse(text); } catch (e) { problems.push(`${at}: is not valid JSON (${e.message})`); return; }
      const nodes = data['@graph'] ? data['@graph'] : [data];
      if (!data['@context']) problems.push(`${at}: has no @context`);

      // Banned keys and banned types, at any depth.
      walk(data, (k, v, trail) => {
        if (BANNED.test(k)) problems.push(`${at}: carries a rating, review or credential key "${trail ? trail + '.' : ''}${k}", which this site never claims`);
        if (k === '@type' && typeof v === 'string' && BANNED_TYPES.test(v)) problems.push(`${at}: declares the type ${v}, which this site never claims`);
      });

      // Every address must be absolute and on this site.
      walk(data, (k, v) => {
        if (!['url', 'item', 'publishingPrinciples', 'logo', 'sameAs', '@id'].includes(k)) return;
        for (const u of (Array.isArray(v) ? v : [v])) {
          if (typeof u !== 'string') continue;
          if (!/^https?:\/\//.test(u)) problems.push(`${at}: "${k}" is "${u}", which is not an absolute address`);
          else if (!u.startsWith(site)) problems.push(`${at}: "${k}" points off this site: ${u}`);
        }
      });

      for (const node of nodes) {
        const type = node && node['@type'];
        if (!type) { problems.push(`${at}: a node has no @type`); continue; }

        if (type === 'BreadcrumbList') {
          const steps = node.itemListElement || [];
          if (!steps.length) problems.push(`${at}: a breadcrumb trail with no steps`);
          steps.forEach((s, i) => {
            if (s.position !== i + 1) problems.push(`${at}: breadcrumb step ${i + 1} says it is position ${s.position}`);
            const href = String(s.item || '').slice(site.length) || '/';
            const texts = links.get(href);
            // The page's own trail is the authority on the name. The last step is the page itself,
            // which a page does not link to, so its name is checked against the visible text.
            if (texts) {
              if (!texts.has(s.name)) problems.push(`${at}: breadcrumb step "${s.name}" is not the link text the reader sees for ${href} (the page says ${[...texts].map((t) => `"${t}"`).join(', ')})`);
            } else if (!seen.includes(s.name)) {
              problems.push(`${at}: breadcrumb step "${s.name}" is neither a link on the page nor text a reader can see`);
            }
          });
        }

        if (type === 'FAQPage') {
          const qs = node.mainEntity || [];
          if (!qs.length) problems.push(`${at}: an FAQ block with no questions`);
          for (const q of qs) {
            const name = String(q.name || '');
            const ans = String((q.acceptedAnswer || {}).text || '');
            if (!name || !ans) { problems.push(`${at}: a question with no name or no answer`); continue; }
            if (!seen.includes(name)) problems.push(`${at}: the question "${name.slice(0, 60)}" is not visible on the page`);
            if (!seen.includes(ans)) problems.push(`${at}: the answer under "${name.slice(0, 60)}" is not visible on the page`);
          }
        }

        if (type === 'Organization' || type === 'WebSite') {
          const name = String(node.name || '');
          if (!name) problems.push(`${at}: the ${type} has no name`);
          else if (brand && !brand.includes(name)) problems.push(`${at}: the ${type} calls itself "${name}", which is not the brand in the page header ("${brand}")`);
          if (node.alternateName && brand && !brand.includes(String(node.alternateName).replace(/\s+/g, ' '))) {
            problems.push(`${at}: the ${type}'s other name "${node.alternateName}" is not in the page header ("${brand}")`);
          }
          if (node.description && desc && node.description !== desc) {
            problems.push(`${at}: the ${type} description is not the page's own description`);
          }
        }
      }
    });
  }
  return problems;
}
