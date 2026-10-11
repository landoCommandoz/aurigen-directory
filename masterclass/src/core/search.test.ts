// @vitest-environment node
import { afterEach, describe, expect, it } from 'vitest';
import { ContentItem, type ContentItemValue } from '../schemas';
import { getContentBundle, __setContentBundleForTests } from './content';
import { emptyBundle } from './contentBundle';
import { __resetSearchForTests, search, searchStatus } from './search';
import { buildSearchIndex, loadSearchIndex, runSearch, type SynonymGroups } from './searchEngine';

const fix = (id: string, title: string, extra: Record<string, unknown> = {}): ContentItemValue =>
  ContentItem.parse({
    id,
    type: 'fixnode',
    title,
    audience: ['owner', 'crew'],
    visibility: 'internal',
    status: 'house',
    group: 'machine',
    sayIt: ['placeholder'],
    causes: ['A cause'],
    steps: ['A step'],
    ...extra,
  });

const card = (id: string, title: string, extra: Record<string, unknown> = {}): ContentItemValue =>
  ContentItem.parse({ id, type: 'quickcard', title, audience: ['owner'], visibility: 'internal', status: 'house', kind: 'mix', rows: [{ label: 'Water', value: '4 gal' }], ...extra });

/** A bundle about the size v1 will reach (33+ fixes, cards, lessons, products), built from words that recur. */
function syntheticItems(count: number): ContentItemValue[] {
  const words = ['polisher', 'pad', 'swirl', 'haze', 'compound', 'clay', 'wash', 'bucket', 'glass', 'interior', 'tire', 'wheel', 'wax', 'ceramic', 'gauge', 'micron', 'tape', 'tesla', 'bike', 'chrome'];
  return Array.from({ length: count }, (_, i) => {
    const w = (k: number) => words[(i * 7 + k) % words.length] ?? 'pad';
    const steps = Array.from({ length: 8 }, (_v, k) => `Step ${k + 1}: check the ${w(k)} and the ${w(k + 3)} before the ${w(k + 5)} goes back on`);
    return fix(`fix-${String(i + 100)}`, `${w(0)} ${w(1)} problem ${i}`, { sayIt: [w(2), `${w(3)} ${w(4)}`], steps, causes: steps.slice(0, 3) });
  });
}

afterEach(() => {
  __setContentBundleForTests(null);
  __resetSearchForTests();
});

describe('search engine', () => {
  const items = [
    fix('fix-01', 'Polisher jerks, walks, or hops side to side', { sayIt: ['jerking', 'hopping', 'walking', 'fighting me'] }),
    fix('fix-04', 'Pad is dry and skipping', { sayIt: ['wet the pad', 'dry pad'] }),
    card('card-bucket-mix', 'Pre-polish wash bucket mix', { synonyms: ['bucket mix'] }),
    card('card-ipa-mix', 'IPA wipe mix', { synonyms: ['ipa'] }),
    fix('fix-99', 'Old polisher entry', { status: 'superseded' }),
  ];
  const groups: SynonymGroups = [{ words: ['ipa', 'alcohol', 'panel wipe'] }];
  const index = buildSearchIndex(items, groups);

  it('finds by say-it words, exact and prefix', () => {
    expect(runSearch(index, 'jerking')[0]?.id).toBe('fix-01');
    expect(runSearch(index, 'jerk')[0]?.id).toBe('fix-01');
    expect(runSearch(index, 'wet the pad')[0]?.id).toBe('fix-04');
  });

  it('tolerates a typo (fuzzy 0.2)', () => {
    expect(runSearch(index, 'jerkng')[0]?.id).toBe('fix-01');
    expect(runSearch(index, 'polsher')[0]?.id).toBe('fix-01');
  });

  it('expands synonyms at index time, including phrases', () => {
    expect(runSearch(index, 'alcohol')[0]?.id).toBe('card-ipa-mix');
    expect(runSearch(index, 'panel wipe')[0]?.id).toBe('card-ipa-mix');
  });

  it('an exact say-it phrase wins over a scattered match', () => {
    expect(runSearch(index, 'bucket mix')[0]?.id).toBe('card-bucket-mix');
  });

  it('never returns a superseded item', () => {
    expect(runSearch(index, 'old polisher entry').map((h) => h.id)).not.toContain('fix-99');
  });

  it('names an item by its knowledge base id: "FIX-01", "fix 1"', () => {
    expect(runSearch(index, 'FIX-01')[0]?.id).toBe('fix-01');
    expect(runSearch(index, 'fix 4')[0]?.id).toBe('fix-04');
  });

  it('returns nothing for an empty or stop-word-only query', () => {
    expect(runSearch(index, '')).toEqual([]);
    expect(runSearch(index, '   ')).toEqual([]);
    expect(runSearch(index, 'the and of')).toEqual([]);
  });

  it('filters by type', () => {
    expect(runSearch(index, 'mix', { types: ['fixnode'] })).toEqual([]);
  });

  it('a saved index loads back with the same results (the build writes it, the phone reads it)', () => {
    const reloaded = loadSearchIndex(JSON.parse(JSON.stringify(index)));
    expect(runSearch(reloaded, 'alcohol')).toEqual(runSearch(index, 'alcohol'));
  });
});

describe('search speed: under 100 ms', () => {
  const queries = ['jerking', 'swirl haze', 'polsher pad', 'tesla tape', 'micron gauge', 'bucket', 'ceramic wax', 'chrome', 'clay bar wash', 'glass'];

  it('on a 600-item synthetic bundle, every query', () => {
    const index = buildSearchIndex(syntheticItems(600), []);
    runSearch(index, 'warm up');
    for (const q of queries) {
      const t0 = performance.now();
      runSearch(index, q);
      expect(performance.now() - t0).toBeLessThan(100);
    }
  });

  it('on the seed bundle from npm run content (if built), through the app search()', async () => {
    const bundle = getContentBundle();
    __setContentBundleForTests(bundle.items.length > 0 ? bundle : { ...emptyBundle(), items: syntheticItems(200) });
    await search('warm up');
    expect(searchStatus.get().state).toBe('ready');
    for (const q of [...queries, 'pad ladder', 'never on paint', 'ipa']) {
      const t0 = performance.now();
      await search(q);
      expect(performance.now() - t0).toBeLessThan(100);
    }
  });
});
