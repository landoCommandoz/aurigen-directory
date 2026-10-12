/**
 * Where each content shard comes from (QA DEF-17). Every shard is content.json?mc-shard=<name>,
 * cut at build time by scripts/content/viteShards.ts. import.meta.glob needs literal arguments, so
 * each shard has its own line. A glob on a file that is not there gives an empty object, so a fresh
 * checkout that has not run the content build still typechecks and boots, with a status saying so.
 *
 * The summary is eager (a few hundred bytes in the app code, so Home draws its tile lines at once).
 * Every other shard is lazy: its own chunk, loaded when a screen asks for it, always in the
 * offline copy (vite.config.ts precaches every js file). The prebuilt search index is lazy too.
 *
 * Every loader is made with import: 'default'. A chunk that failed to download is asked for again
 * under a fresh address read from its loader (freshImport.ts, QA DEF-26), resolved against
 * LOADER_BASE: this module's own address, which is the chunk the loaders' import() calls sit in.
 */
import type { AsPlainObject } from 'minisearch';
import type { LoadableShard } from './contentShards';

type Loaders = Record<string, () => Promise<unknown>>;

/** Where the loaders' relative addresses start from (the app chunk in a build, this file in dev). */
export const LOADER_BASE: string = import.meta.url;

export const summaryModules: Record<string, unknown> = import.meta.glob('../generated/content.json', {
  eager: true,
  import: 'default',
  query: { 'mc-shard': 'summary' },
});

export const SHARD_LOADERS: Record<LoadableShard, Loaders> = {
  catalog: import.meta.glob('../generated/content.json', { import: 'default', query: { 'mc-shard': 'catalog' } }),
  extras: import.meta.glob('../generated/content.json', { import: 'default', query: { 'mc-shard': 'extras' } }),
  lesson: import.meta.glob('../generated/content.json', { import: 'default', query: { 'mc-shard': 'lesson' } }),
  sop: import.meta.glob('../generated/content.json', { import: 'default', query: { 'mc-shard': 'sop' } }),
  quickcard: import.meta.glob('../generated/content.json', { import: 'default', query: { 'mc-shard': 'quickcard' } }),
  fixnode: import.meta.glob('../generated/content.json', { import: 'default', query: { 'mc-shard': 'fixnode' } }),
  product: import.meta.glob('../generated/content.json', { import: 'default', query: { 'mc-shard': 'product' } }),
  equipment: import.meta.glob('../generated/content.json', { import: 'default', query: { 'mc-shard': 'equipment' } }),
  priceitem: import.meta.glob('../generated/content.json', { import: 'default', query: { 'mc-shard': 'priceitem' } }),
  policy: import.meta.glob('../generated/content.json', { import: 'default', query: { 'mc-shard': 'policy' } }),
  script: import.meta.glob('../generated/content.json', { import: 'default', query: { 'mc-shard': 'script' } }),
  drill: import.meta.glob('../generated/content.json', { import: 'default', query: { 'mc-shard': 'drill' } }),
  quizquestion: import.meta.glob('../generated/content.json', { import: 'default', query: { 'mc-shard': 'quizquestion' } }),
  flashcard: import.meta.glob('../generated/content.json', { import: 'default', query: { 'mc-shard': 'flashcard' } }),
  glossaryterm: import.meta.glob('../generated/content.json', { import: 'default', query: { 'mc-shard': 'glossaryterm' } }),
};

// ?mc-json: the build serves it as JSON.parse of one string (scripts/content/viteShards.ts), which the
// phone parses far faster than an object literal; it stays its own lazy chunk in the offline copy.
export const INDEX_LOADERS: Record<string, () => Promise<AsPlainObject>> = import.meta.glob<AsPlainObject>('../generated/search-index.json', {
  import: 'default',
  query: { 'mc-json': '1' },
});
