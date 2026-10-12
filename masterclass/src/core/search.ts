/**
 * Search in the app (BLUEPRINT 2.1): one box, typed or dictated words, results from the content
 * bundle on the device in well under 100 ms. The index is prebuilt by the content build
 * (src/generated/search-index.json) and loaded once; if it is missing or unreadable, or the bundle
 * in use is not the one that build wrote (tests), it is built in memory from the bundle instead, so
 * search always works offline and always matches the content on screen.
 * Search is an internal tool: it is not offered in Customer View (3.4).
 */
import type MiniSearch from 'minisearch';
import type { AsPlainObject } from 'minisearch';
import { getContentBundle, usingGeneratedBundle } from './content';
import { describeError } from './errors';
import { buildSearchIndex, loadSearchIndex, runSearch, type RunSearchOptions, type SearchDoc, type SearchHit } from './searchEngine';
import { createStore, useStore } from './store';

export type { SearchHit };

const generatedIndex = import.meta.glob<AsPlainObject>('../generated/search-index.json', { import: 'default' });

export interface SearchStatus {
  state: 'idle' | 'loading' | 'ready';
  source: 'prebuilt' | 'built-in-memory' | null;
  docs: number;
  loadMs: number | null;
  lastQueryMs: number | null;
  lastError: string | null;
}

export const searchStatus = createStore<SearchStatus>({ state: 'idle', source: null, docs: 0, loadMs: null, lastQueryMs: null, lastError: null });

export function useSearchStatus(): SearchStatus {
  return useStore(searchStatus);
}

let index: MiniSearch<SearchDoc> | null = null;
let loading: Promise<MiniSearch<SearchDoc>> | null = null;

function now(): number {
  return typeof performance !== 'undefined' ? performance.now() : Date.now();
}

async function load(): Promise<MiniSearch<SearchDoc>> {
  const started = now();
  searchStatus.update({ state: 'loading' });
  // The prebuilt index matches only the bundle the same content build wrote.
  const loader = usingGeneratedBundle() ? Object.values(generatedIndex)[0] : undefined;
  if (loader !== undefined) {
    try {
      const loaded = loadSearchIndex(await loader());
      searchStatus.update({ state: 'ready', source: 'prebuilt', docs: loaded.documentCount, loadMs: now() - started, lastError: null });
      return loaded;
    } catch (error) {
      searchStatus.update({ lastError: `Prebuilt index unreadable, rebuilt on the phone: ${describeError(error)}` });
    }
  }
  const bundle = getContentBundle();
  const built = buildSearchIndex(bundle.items, bundle.synonyms);
  searchStatus.update({ state: 'ready', source: 'built-in-memory', docs: built.documentCount, loadMs: now() - started });
  return built;
}

/** Load the index now (call at boot, when the phone is idle), so the first search is instant. */
export function preloadSearch(): Promise<void> {
  loading ??= load().then((loaded) => {
    index = loaded;
    return loaded;
  });
  return loading.then(() => undefined);
}

/** Search the content. Loads the index on first use. An empty or stop-word-only query returns []. */
export async function search(query: string, opts: RunSearchOptions = {}): Promise<SearchHit[]> {
  if (index === null) await preloadSearch();
  return searchNow(query, opts) ?? [];
}

/** Synchronous search once the index is loaded; null before that. */
export function searchNow(query: string, opts: RunSearchOptions = {}): SearchHit[] | null {
  if (index === null) return null;
  const started = now();
  const hits = runSearch(index, query, opts);
  searchStatus.update({ lastQueryMs: now() - started });
  return hits;
}

/** Tests only: forget the loaded index (the next search loads again). */
export function __resetSearchForTests(): void {
  index = null;
  loading = null;
  searchStatus.set({ state: 'idle', source: null, docs: 0, loadMs: null, lastQueryMs: null, lastError: null });
}
