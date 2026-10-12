/**
 * How the content bundle is cut into shards, so a screen loads only the content it draws and the
 * first screen never waits for content at all (QA DEF-17). Pure: no React, no DOM, no Vite.
 *
 * The content build still writes one file, src/generated/content.json. At build time the Vite
 * plugin in scripts/content/viteShards.ts serves each shard from it as its own module
 * (content.json?mc-shard=<name>, src/core/contentLoaders.ts), so each shard is its own lazy chunk
 * in the offline copy. A bundle a test swaps in is cut here, by shardOf(). The plugin's cutShard()
 * must give the same shards; contentShards.test.ts compares the two on the real bundle.
 *
 *   one shard per type   that type's items, in id order (fixnode, quickcard, lesson, ...)
 *   catalog              every item's id, type, title, status, and whether Customer View may show
 *                        it: related links and look-ups by id, about 11 KB gzip for 573 items
 *   extras               the sign-off criteria and the synonym groups
 *   summary              how many items of each type: the Home tiles, drawn before any shard loads
 */
import { CONTENT_TYPES, ID_PREFIX, isCustomerRenderable, type ContentItemValue, type ContentTypeName, type SignOffCriteriaItem, type StatusName } from '../schemas';
import { CONTENT_BUNDLE_VERSION, type ContentBundle } from './contentBundle';

/** Shards a screen can ask for. The summary is not among them: it is in the app code from the start. */
export type LoadableShard = ContentTypeName | 'catalog' | 'extras';
export type ShardName = LoadableShard | 'summary';

export const LOADABLE_SHARDS: readonly LoadableShard[] = [...CONTENT_TYPES, 'catalog', 'extras'];

export interface CatalogEntry {
  id: string;
  type: ContentTypeName;
  title: string;
  status: StatusName;
  /** isCustomerRenderable(item): the one Customer View rule, decided on the whole item. */
  customerSafe: boolean;
}

export interface TypeShard {
  version: typeof CONTENT_BUNDLE_VERSION;
  shard: ContentTypeName;
  items: ContentItemValue[];
}

export interface CatalogShard {
  version: typeof CONTENT_BUNDLE_VERSION;
  shard: 'catalog';
  entries: CatalogEntry[];
}

export interface ExtrasShard {
  version: typeof CONTENT_BUNDLE_VERSION;
  shard: 'extras';
  signOffs: SignOffCriteriaItem[];
  synonyms: ContentBundle['synonyms'];
}

export interface SummaryShard {
  version: typeof CONTENT_BUNDLE_VERSION;
  shard: 'summary';
  /** Items of each type; a type with none is left out. */
  counts: Partial<Record<ContentTypeName, number>>;
  items: number;
  signOffs: number;
}

export type AnyShard = TypeShard | CatalogShard | ExtrasShard | SummaryShard;

export function isShardName(value: string): value is ShardName {
  return value === 'summary' || (LOADABLE_SHARDS as readonly string[]).includes(value);
}

export function catalogEntry(item: ContentItemValue): CatalogEntry {
  return { id: item.id, type: item.type, title: item.title, status: item.status, customerSafe: isCustomerRenderable(item) };
}

export function summaryOf(bundle: ContentBundle): SummaryShard {
  const counts: Partial<Record<ContentTypeName, number>> = {};
  for (const item of bundle.items) counts[item.type] = (counts[item.type] ?? 0) + 1;
  return { version: CONTENT_BUNDLE_VERSION, shard: 'summary', counts, items: bundle.items.length, signOffs: bundle.signOffs.length };
}

/** One shard of a bundle. Items keep the bundle's order (the build sorts by id). */
export function shardOf(bundle: ContentBundle, name: ShardName): AnyShard {
  switch (name) {
    case 'summary':
      return summaryOf(bundle);
    case 'catalog':
      return { version: CONTENT_BUNDLE_VERSION, shard: 'catalog', entries: bundle.items.map(catalogEntry) };
    case 'extras':
      return { version: CONTENT_BUNDLE_VERSION, shard: 'extras', signOffs: bundle.signOffs, synonyms: bundle.synonyms };
    default:
      return { version: CONTENT_BUNDLE_VERSION, shard: name, items: bundle.items.filter((item) => item.type === name) };
  }
}

const TYPE_BY_PREFIX = new Map<string, ContentTypeName>(
  (Object.entries(ID_PREFIX) as Array<[ContentTypeName, string]>).map(([type, prefix]) => [prefix, type]),
);

/**
 * The type an id belongs to, from its prefix (src/schemas README section 2: every id starts with
 * its type's prefix, and the build refuses one that does not). Undefined for anything else.
 */
export function typeOfId(id: string): ContentTypeName | undefined {
  const at = id.indexOf('-');
  return at <= 0 ? undefined : TYPE_BY_PREFIX.get(id.slice(0, at));
}

/** True when a loaded module is the shard it was asked for, from this app version, with its lists in place. */
export function isShard(value: unknown, name: ShardName): value is AnyShard {
  if (typeof value !== 'object' || value === null) return false;
  const shard = value as Record<string, unknown>;
  if (shard.version !== CONTENT_BUNDLE_VERSION || shard.shard !== name) return false;
  switch (name) {
    case 'summary':
      return typeof shard.counts === 'object' && shard.counts !== null && typeof shard.items === 'number';
    case 'catalog':
      return Array.isArray(shard.entries);
    case 'extras':
      return Array.isArray(shard.signOffs) && Array.isArray(shard.synonyms);
    default:
      return Array.isArray(shard.items);
  }
}
