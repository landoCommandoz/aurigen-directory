// @vitest-environment node
/**
 * Search on the Phase 1 seed content (BUILD_PROMPT 9 item 3; knowledge base section 24). Only the
 * section 24 cases whose expected section already has a seed item are run here; the full 43 (45+)
 * cases arrive as tests/search-cases.yaml with the troubleshooter in Phase 2. A case passes when the
 * top result is an item from the knowledge base section the case names. Results under 100 ms.
 *
 * The index is built exactly as the app ships it: scripts/content/pipeline.ts, then serialized and
 * loaded back the way src/core/search.ts loads the generated chunk.
 */
import { resolve } from 'node:path';
import { performance } from 'node:perf_hooks';
import { describe, expect, it } from 'vitest';
import { buildContent } from '../../scripts/content/pipeline';
import { buildSearchIndex, loadSearchIndex, runSearch } from '../../src/core/searchEngine';

const ROOT = resolve(__dirname, '..', '..');
const built = buildContent({ root: ROOT, write: false });
const index = loadSearchIndex(JSON.parse(JSON.stringify(buildSearchIndex(built.bundle.items, built.bundle.synonyms))));
const kbOf = new Map(built.bundle.items.map((i) => [i.id, i.kbRef ?? '']));

/** Knowledge base section 24 rows that the seed content can answer, plus the brief's "pad ladder". */
const CASES: Array<{ query: string; kb: string[]; note?: string }> = [
  { query: 'bucket mix', kb: ['4'] },
  { query: 'ipa mix', kb: ['4'] },
  { query: 'clay lube', kb: ['4'] },
  { query: 'zero gauge', kb: ['7.2'] },
  { query: 'gauge 85', kb: ['7.3'], note: 'KB 24: 7.3 / FIX-22 (FIX-22 arrives in Phase 2)' },
  { query: 'what kills the buff', kb: ['7.4'] },
  { query: 'matte paint', kb: ['7.4', '12.1'] },
  { query: 'how much polish', kb: ['8.2'] },
  { query: 'wet the pad', kb: ['8.2'], note: 'KB 24: 8.2 / FIX-04 (FIX-04 arrives in Phase 2)' },
  { query: 'pad ladder', kb: ['8.5'], note: 'from the QA brief; not a KB 24 row' },
  { query: 'headlights', kb: ['9.4'] },
  { query: 'car wash mode', kb: ['11'] },
  { query: 'tesla roof', kb: ['11'] },
  { query: 'bike tire shine', kb: ['12.1'] },
  { query: 'chain', kb: ['12.1'] },
  { query: 'backing plate', kb: ['14'], note: 'KB 24: FIX-23 / 14 (FIX-23 arrives in Phase 2)' },
];

describe('search cases on the seed content (knowledge base 24)', () => {
  it('the content builds and the index holds every renderable item', () => {
    expect(built.ok).toBe(true);
    expect(index.documentCount).toBe(built.bundle.items.length);
  });

  for (const c of CASES) {
    it(`"${c.query}" puts a section ${c.kb.join(' or ')} item on top in under 100 ms`, () => {
      const t0 = performance.now();
      const hits = runSearch(index, c.query, { limit: 5 });
      const ms = performance.now() - t0;
      const top = hits[0];
      expect(top, `no result for "${c.query}"`).toBeDefined();
      const kb = kbOf.get(top?.id ?? '') ?? '';
      expect(c.kb, `"${c.query}" top was ${top?.id} (kb ${kb}); next: ${hits.slice(1, 3).map((h) => h.id).join(', ')}`).toContain(kb);
      expect(ms).toBeLessThan(100);
    });
  }

  it('typos and case still land: "BUCKET MIX", "bucket mx", "clay  lube "', () => {
    expect(kbOf.get(runSearch(index, 'BUCKET MIX')[0]?.id ?? '')).toBe('4');
    expect(kbOf.get(runSearch(index, 'bucket mx')[0]?.id ?? '')).toBe('4');
    expect(kbOf.get(runSearch(index, 'clay  lube ')[0]?.id ?? '')).toBe('4');
  });

  it('empty, blank, symbol-only, and very long queries return a list (maybe empty) without throwing', () => {
    for (const q of ['', '   ', '???', '%%%', '\u0000', 'x'.repeat(5000), '🚗', '<script>alert(1)</script>']) {
      expect(() => runSearch(index, q)).not.toThrow();
      expect(Array.isArray(runSearch(index, q))).toBe(true);
    }
  });

  it('a superseded item is never a result', () => {
    expect(built.bundle.items.some((i) => i.status === 'superseded')).toBe(false);
  });
});
