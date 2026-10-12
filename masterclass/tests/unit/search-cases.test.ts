// @vitest-environment node
/**
 * Search, Phase 2 (BUILD_PROMPT 9 item 3; knowledge base section 24). Owner: qa-adversary.
 *
 * The cases are the troubleshooter's file, tests/search-cases.yaml (read here, never written). The
 * index is built exactly as the app ships it: scripts/content/pipeline.ts, serialized, then loaded
 * back the way src/core/search.ts loads the generated chunk. A case passes when the top result is
 * one of its `expect` ids AND the first row the search box shows (the one Enter opens) is that same
 * result. Every query, and the slowest one, under 100 ms.
 *
 * Phase 1 held a hand-written list of 16 seed cases here; it was retired in Phase 2 because the
 * section 24 rows now name the Fix It entries that exist (fix-22, fix-23, fix-30).
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { performance } from 'node:perf_hooks';
import { parse } from 'yaml';
import { describe, expect, it } from 'vitest';
import { buildContent } from '../../scripts/content/pipeline';
import { buildSearchIndex, loadSearchIndex, runSearch, SEARCH_TYPES } from '../../src/core/searchEngine';
import { firstShown } from '../../src/features/search/searchModel';
import { MIN_SEARCH_CASES, SearchCaseFile } from '../../src/schemas';

const ROOT = resolve(__dirname, '..', '..');
const built = buildContent({ root: ROOT, write: false });
const json = JSON.parse(JSON.stringify(buildSearchIndex(built.bundle.items, built.bundle.synonyms))) as Parameters<typeof loadSearchIndex>[0];
const loadStarted = performance.now();
const index = loadSearchIndex(json);
const loadMs = performance.now() - loadStarted;
const byId = new Map(built.bundle.items.map((i) => [i.id, i]));
const cases = SearchCaseFile.parse(parse(readFileSync(resolve(ROOT, 'tests/search-cases.yaml'), 'utf8'))).cases;

/** Knowledge base section 24, verbatim: query, then the expected column. */
const KB24: ReadonlyArray<readonly [string, string]> = [
  ['jerking', 'FIX-01'], ['polisher hopping', 'FIX-01'], ['pad not spinning', 'FIX-02'], ['vibrating bad', 'FIX-03'],
  ['polish drying', 'FIX-04'], ['how much polish', '8.2'], ['wet the pad', '8.2 / FIX-04'], ['slinging', 'FIX-06'],
  ['pad falling off', 'FIX-07'], ['paint on pad', 'FIX-09'], ['still swirls', 'FIX-10'], ['haze', 'FIX-11'],
  ['dirt after wash', 'FIX-14'], ['water spots', 'FIX-15'], ['dropped clay', 'FIX-17'], ['wax streaks', 'FIX-18'],
  ['glass streaks', 'FIX-19'], ['backing plate', 'FIX-23 / 14'], ['bucket mix', '4'], ['ipa mix', '4'], ['clay lube', '4'],
  ['gauge 85', '7.3 / FIX-22'], ['zero gauge', '7.2'], ['car wash mode', '11'], ['tesla roof', '11'], ['bike tire shine', '12.1'],
  ['chain', '12.1'], ['matte paint', '7.4 / 12.1'], ['towel wash', '13'], ['pad wash', '13.1'], ['price suv full detail', '15.1'],
  ['mobile fee', '15.1'], ['travel fee', '15.1'], ['deposit', '15.2'], ['cancellation', '15.2'], ['store it clean', '12.2'],
  ['what kills the buff', '7.4'], ['scratch customer', 'FIX-27'], ['broke something', 'FIX-28'], ['setup slow', 'FIX-24'],
  ['out of time', 'FIX-25'], ['headlights', '9.4'], ['pet hair', 'FIX-31'],
];

/**
 * Parked by the troubleshooter until price items have a page and are searchable (Phase 4,
 * business-customer): both answers live only in knowledge base 15.1 and 12.2 prices.
 */
const PARKED = ['price suv full detail', 'store it clean'];

/** Section 24 rows whose top result is a Fix It entry from section 21 that carries the section's fact. */
const TOP_FROM_FIX_SEED: Record<string, { id: string; holds: RegExp }> = {
  'bike tire shine': { id: 'fix-30', holds: /no tire shine/i },
  'travel fee': { id: 'fix-88', holds: /\$1\.50 per mile/ },
};

function itemText(id: string): string {
  return JSON.stringify(byId.get(id) ?? {});
}

/** True when the item is from the section ("13" holds 13, 13.1, 13.2) or is the named fix. */
function fromSection(id: string, expected: string): boolean {
  const kbRef = byId.get(id)?.kbRef ?? '';
  return expected.split('/').some((part) => {
    const want = part.trim();
    const fix = /^FIX-(\d+)$/.exec(want);
    if (fix?.[1] !== undefined) return id === `fix-${fix[1].padStart(2, '0')}`;
    return kbRef === want || kbRef.startsWith(`${want}.`);
  });
}

describe('search cases (tests/search-cases.yaml, knowledge base 24)', () => {
  it('the content builds clean and the index holds every searchable item and nothing else', () => {
    expect(built.problems).toEqual([]);
    expect(built.ok).toBe(true);
    const searchable = built.bundle.items.filter((i) => SEARCH_TYPES.includes(i.type));
    expect(index.documentCount).toBe(searchable.length);
    const leaked = built.bundle.items.filter((item) => !SEARCH_TYPES.includes(item.type) && index.has(item.id)).map((i) => i.id);
    expect(leaked).toEqual([]);
  });

  it(`holds at least ${MIN_SEARCH_CASES} cases (the Phase 2 bar is 45)`, () => {
    expect(MIN_SEARCH_CASES).toBeGreaterThanOrEqual(45);
    expect(cases.length).toBeGreaterThanOrEqual(45);
    expect(new Set(cases.map((c) => c.query.trim().toLowerCase())).size, 'duplicate queries').toBe(cases.length);
  });

  it('every knowledge base 24 row is a case, except the two parked until Phase 4', () => {
    const queries = new Set(cases.map((c) => c.query.trim().toLowerCase()));
    const missing = KB24.filter(([q]) => !queries.has(q)).map(([q]) => q);
    expect(missing).toEqual(PARKED);
  });

  for (const [query, expected] of KB24.filter(([q]) => !PARKED.includes(q))) {
    it(`knowledge base 24 "${query}": the top result is from ${expected}`, () => {
      const top = runSearch(index, query, { limit: 20 })[0];
      expect(top, `no result for "${query}"`).toBeDefined();
      const id = top?.id ?? '';
      const seed = TOP_FROM_FIX_SEED[query];
      // A section 21 fix that carries the section's own fact counts as the section (two rows, named above).
      const fromSeed = seed !== undefined && id === seed.id && seed.holds.test(itemText(id));
      expect(fromSeed || fromSection(id, expected), `"${query}" top ${id} has kbRef ${byId.get(id)?.kbRef}`).toBe(true);
    });
  }

  for (const c of cases) {
    it(`"${c.query}" puts ${c.expect.join(' or ')} on top and on the first row, in under 100 ms`, () => {
      const started = performance.now();
      const hits = runSearch(index, c.query, { limit: 20 });
      const ms = performance.now() - started;
      const top = hits[0];
      expect(c.expect, `"${c.query}" top was ${top?.id}; next ${hits.slice(1, 3).map((h) => h.id).join(', ')}`).toContain(top?.id);
      // The search box groups results by type; the first row on screen is what Enter opens.
      expect(firstShown(hits)?.id).toBe(top?.id);
      expect(ms).toBeLessThan(100);
    });
  }

  it('the slowest of all cases, run three times each, is under 100 ms; loading the index is under 500 ms', () => {
    let slowest = 0;
    let slowestQuery = '';
    for (let round = 0; round < 3; round += 1) {
      for (const c of cases) {
        const started = performance.now();
        runSearch(index, c.query, { limit: 20 });
        const ms = performance.now() - started;
        if (ms > slowest) {
          slowest = ms;
          slowestQuery = c.query;
        }
      }
    }
    console.info(`search: ${cases.length} cases, slowest ${slowest.toFixed(2)} ms ("${slowestQuery}"), index load ${loadMs.toFixed(1)} ms, ${index.documentCount} documents`);
    expect(slowest).toBeLessThan(100);
    expect(loadMs).toBeLessThan(500);
  });

  it('the v1 line: "jerking", typed any way a gloved thumb types it, puts fix-01 on top', () => {
    for (const q of ['jerking', 'JERKING', 'Jerking', '  jerking  ', 'jerking.', 'jerkin', 'jerkng', 'my polisher is jerking', 'polisher keeps jerking around']) {
      expect(runSearch(index, q)[0]?.id, `${q}`).toBe('fix-01');
    }
  });

  it('typos and case still land on the mix cards: "BUCKET MIX", "bucket mx", "clay  lube "', () => {
    expect(runSearch(index, 'BUCKET MIX')[0]?.id).toBe('card-bucket-mix');
    expect(runSearch(index, 'bucket mx')[0]?.id).toBe('card-bucket-mix');
    expect(runSearch(index, 'clay  lube ')[0]?.id).toBe('card-clay-tub');
  });

  it('empty, blank, symbol-only, and very long queries return a list (maybe empty) without throwing', () => {
    for (const q of ['', '   ', '???', '%%%', '\u0000', 'x'.repeat(5000), '🚗', '<script>alert(1)</script>', 'fix-999', 'fix-', '-1']) {
      expect(() => runSearch(index, q)).not.toThrow();
      expect(Array.isArray(runSearch(index, q))).toBe(true);
    }
    const started = performance.now();
    runSearch(index, 'polish '.repeat(400));
    expect(performance.now() - started, 'a 2,800 character query').toBeLessThan(500);
  });

  it('a superseded item, a drill, a quiz question, or a flashcard is never a result', () => {
    expect(built.bundle.items.some((i) => i.status === 'superseded')).toBe(false);
    for (const q of ['quiz', 'drill', 'flashcard', 'how much polish', 'pressure', 'gauge 85', 'speed']) {
      for (const hit of runSearch(index, q, { limit: 50 })) {
        expect(['drill', 'quizquestion', 'flashcard'], `${q} -> ${hit.id}`).not.toContain(hit.type);
      }
    }
  });
});
