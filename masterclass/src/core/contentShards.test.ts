// @vitest-environment node
/**
 * The shard cut (QA DEF-17). The Vite plugin (scripts/content/viteShards.ts) cuts content.json at
 * build time without the schemas; the app cuts a swapped-in bundle with shardOf(). The two must give
 * the same shards, or a phone would see different content than the tests. Also: ids name their
 * type, and a module that is not the shard asked for is refused.
 */
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { cutShard, generatedRequest, jsonModule } from '../../scripts/content/viteShards';
import { fixtureBundle } from '../features/shared/__tests__/fixture';
import { CONTENT_TYPES, ContentItem, ID_PREFIX, isCustomerRenderable, type ContentItemValue } from '../schemas';
import { CONTENT_BUNDLE_VERSION, type ContentBundle } from './contentBundle';
import { isShard, isShardName, LOADABLE_SHARDS, shardOf, typeOfId, type ShardName } from './contentShards';

const ALL_SHARDS: ShardName[] = [...LOADABLE_SHARDS, 'summary'];
const GENERATED = fileURLToPath(new URL('../generated/content.json', import.meta.url));

const safeCard = ContentItem.parse({
  id: 'card-safe-test',
  type: 'quickcard',
  title: 'A card a customer may see',
  audience: ['customer'],
  visibility: 'customer-safe',
  status: 'house',
  kind: 'list',
  rows: [{ label: 'Rule', value: 'Ask before you touch the car.' }],
});

/** A bundle as the content build writes it: customerSafeIds from the one rule. */
function asBuilt(items: ContentItemValue[], rest: Partial<ContentBundle> = {}): ContentBundle {
  const sorted = [...items].sort((a, b) => a.id.localeCompare(b.id));
  return {
    version: CONTENT_BUNDLE_VERSION,
    items: sorted,
    signOffs: [],
    synonyms: [],
    ...rest,
    customerSafeIds: sorted.filter((item) => isCustomerRenderable(item)).map((item) => item.id),
  };
}

function bundles(): Array<[string, ContentBundle]> {
  const fixture = fixtureBundle();
  const out: Array<[string, ContentBundle]> = [['fixture plus a customer-safe card', asBuilt([...fixture.items, safeCard], { signOffs: fixture.signOffs, synonyms: fixture.synonyms })]];
  if (existsSync(GENERATED)) out.push(['src/generated/content.json', JSON.parse(readFileSync(GENERATED, 'utf8')) as ContentBundle]);
  return out;
}

describe('the build-time cut equals the app cut', () => {
  it('the test card is one a customer may see, so the catalog flag is exercised both ways', () => {
    expect(isCustomerRenderable(safeCard)).toBe(true);
  });

  for (const [label, bundle] of bundles()) {
    it(`${label}: every shard, field for field`, () => {
      for (const name of ALL_SHARDS) {
        expect({ name, shard: cutShard(bundle, name) }).toEqual({ name, shard: JSON.parse(JSON.stringify(shardOf(bundle, name))) });
      }
    });

    it(`${label}: the type shards hold every item once, and the catalog lists them all`, () => {
      const fromTypes = CONTENT_TYPES.flatMap((type) => (shardOf(bundle, type) as { items: ContentItemValue[] }).items.map((item) => item.id));
      expect([...fromTypes].sort()).toEqual(bundle.items.map((item) => item.id).sort());
      const catalog = shardOf(bundle, 'catalog') as { entries: Array<{ id: string; customerSafe: boolean }> };
      expect(catalog.entries.map((entry) => entry.id)).toEqual(bundle.items.map((item) => item.id));
      expect(catalog.entries.filter((entry) => entry.customerSafe).map((entry) => entry.id)).toEqual(bundle.items.filter((item) => isCustomerRenderable(item)).map((item) => item.id));
    });
  }

  it('the content build records exactly the customer-safe ids (generated bundle, when built)', () => {
    if (!existsSync(GENERATED)) return;
    const bundle = JSON.parse(readFileSync(GENERATED, 'utf8')) as ContentBundle;
    expect(bundle.customerSafeIds).toEqual(bundle.items.filter((item) => isCustomerRenderable(item)).map((item) => item.id));
  });

  it('a bundle without the list marks nothing safe (fail closed)', () => {
    const { customerSafeIds: _dropped, ...old } = asBuilt([safeCard]);
    const catalog = cutShard(old as ContentBundle, 'catalog') as { entries: Array<{ customerSafe: boolean }> };
    expect(catalog.entries.map((entry) => entry.customerSafe)).toEqual([false]);
  });

  it('the summary counts each type and leaves out types with none', () => {
    const summary = shardOf(asBuilt([safeCard]), 'summary');
    expect(summary).toEqual({ version: CONTENT_BUNDLE_VERSION, shard: 'summary', counts: { quickcard: 1 }, items: 1, signOffs: 0 });
  });
});

describe('the shard module', () => {
  it('is JSON.parse of one string, and gives back the same value', () => {
    const value = { version: 1, text: 'Quote "this", a back\\slash, and a line\nbreak. ${not a template}' };
    const code = jsonModule(value);
    expect(code.startsWith('export default JSON.parse("')).toBe(true);
    const literal = code.slice('export default JSON.parse('.length, code.lastIndexOf(');'));
    expect(JSON.parse(JSON.parse(literal) as string)).toEqual(value);
  });

  it('answers only the queries it owns', () => {
    expect(generatedRequest('../generated/content.json?mc-shard=fixnode')).toEqual({ path: '../generated/content.json', shard: 'fixnode', json: false });
    expect(generatedRequest('../generated/search-index.json?mc-json=1')).toEqual({ path: '../generated/search-index.json', shard: null, json: true });
    expect(generatedRequest('../generated/content.json')).toBeNull();
    expect(generatedRequest('../generated/content.json?raw')).toBeNull();
    expect(generatedRequest('./thing.ts?mc-shard=fixnode')).toBeNull();
  });
});

describe('ids and shard names', () => {
  it('every id prefix maps back to its type', () => {
    for (const [type, prefix] of Object.entries(ID_PREFIX)) expect(typeOfId(`${prefix}-something-1`)).toBe(type);
    expect(typeOfId('fix-01')).toBe('fixnode');
    expect(typeOfId('quiz-l4-machine-01')).toBe('quizquestion');
    expect(typeOfId('card-bucket-mix')).toBe('quickcard');
  });

  it('anything else names no type', () => {
    for (const id of ['', '-', '-fix', 'fix', 'skill-l4-machine', 'nope-1', 'FIX-01', '../settings', '%0a']) expect({ id, type: typeOfId(id) }).toEqual({ id, type: undefined });
  });

  it('knows every shard name and no other', () => {
    for (const name of ALL_SHARDS) expect(isShardName(name)).toBe(true);
    for (const name of ['', 'all', 'Fixnode', 'content', 'catalogue']) expect(isShardName(name)).toBe(false);
    expect(LOADABLE_SHARDS).toEqual([...CONTENT_TYPES, 'catalog', 'extras']);
  });

  it('refuses a module that is not the shard asked for', () => {
    const bundle = asBuilt([safeCard]);
    expect(isShard(shardOf(bundle, 'quickcard'), 'quickcard')).toBe(true);
    expect(isShard(shardOf(bundle, 'quickcard'), 'fixnode')).toBe(false);
    expect(isShard({ ...shardOf(bundle, 'catalog'), version: 99 }, 'catalog')).toBe(false);
    expect(isShard({ version: CONTENT_BUNDLE_VERSION, shard: 'catalog' }, 'catalog')).toBe(false);
    expect(isShard({ version: CONTENT_BUNDLE_VERSION, shard: 'extras', signOffs: [] }, 'extras')).toBe(false);
    expect(isShard({ version: CONTENT_BUNDLE_VERSION, shard: 'summary', counts: {} }, 'summary')).toBe(false);
    expect(isShard(null, 'catalog')).toBe(false);
    expect(isShard('catalog', 'catalog')).toBe(false);
  });
});
