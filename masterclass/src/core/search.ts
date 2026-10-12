/**
 * Search in the app (BLUEPRINT 2.1): one box, typed or dictated words, results from the content
 * bundle on the device in well under 100 ms. The index is prebuilt by the content build
 * (src/generated/search-index.json) and loaded once; if it is missing or unreadable, or the bundle
 * in use is not the one that build wrote (tests), it is built in memory from the bundle instead, so
 * search always works offline and always matches the content on screen.
 * Search is an internal tool: it is not offered in Customer View (3.4).
 * The prebuilt index needs no content shard: each result carries its own title, type, and status.
 * Only the in-memory fallback loads every shard first (core/content.ts, QA DEF-17).
 *
 * A load that did not finish is never kept (QA DEF-26). When the index did not download and the
 * content could not be loaded either, search says "Search did not load" (state 'failed'), never
 * "Nothing found"; the next word or Try again starts a fresh load, asking for a fresh copy of what
 * failed. An index built from part of the content is never made: it would answer "Nothing found"
 * for a fix that is there. A test reset bumps a generation number, so a load from before the reset
 * writes nothing (QA DEF-24).
 */
import type MiniSearch from 'minisearch';
import type { AsPlainObject } from 'minisearch';
import { useSyncExternalStore } from 'react';
import { getContentBundle, loadAllContent, usingGeneratedBundle } from './content';
import { INDEX_LOADERS, LOADER_BASE } from './contentLoaders';
import { describeError } from './errors';
import { importAgain } from './freshImport';
import { reloadForFreshCopy } from './freshPage';
import { buildSearchIndex, loadSearchIndexAsync, runSearch, type RunSearchOptions, type SearchDoc, type SearchHit } from './searchEngine';
import { createStore, useStore } from './store';

export type { SearchHit };

/** What the search box says when the index did not load. Plain words: the error is for the developer panel. */
export const SEARCH_NOT_LOADED = 'Search did not load. Check the signal, then tap Try again.';
/** After Try again, when the app's own address does not answer either. */
export const SEARCH_NO_SIGNAL = 'Search still did not load. There is no signal right now. Check the signal, then tap Try again.';

/** Search could not load its index. `message` is plain words for the screen. */
export class SearchNotLoaded extends Error {
  override readonly name = 'SearchNotLoaded';
}

export interface SearchStatus {
  state: 'idle' | 'loading' | 'ready' | 'failed';
  source: 'prebuilt' | 'built-in-memory' | null;
  docs: number;
  loadMs: number | null;
  lastQueryMs: number | null;
  /** For the developer panel: why the last load fell back or failed. Never shown on a page. */
  lastError: string | null;
  /** Failed loads of the prebuilt index on this page; the next one asks for a fresh copy. */
  indexFailures: number;
}

const IDLE: SearchStatus = { state: 'idle', source: null, docs: 0, loadMs: null, lastQueryMs: null, lastError: null, indexFailures: 0 };

export const searchStatus = createStore<SearchStatus>({ ...IDLE });

export function useSearchStatus(): SearchStatus {
  return useStore(searchStatus);
}

/** Only the load state, so a search box does not re-render on every query's timing. */
export function useSearchLoadState(): SearchStatus['state'] {
  const read = () => searchStatus.get().state;
  return useSyncExternalStore(searchStatus.subscribe, read, read);
}

let index: MiniSearch<SearchDoc> | null = null;
let loading: Promise<MiniSearch<SearchDoc>> | null = null;
/** Bumped by __resetSearchForTests: a load from before the reset changes nothing (QA DEF-24). */
let generation = 0;

function now(): number {
  return typeof performance !== 'undefined' ? performance.now() : Date.now();
}

async function load(gen: number): Promise<MiniSearch<SearchDoc>> {
  const live = () => gen === generation;
  const write = (patch: Partial<SearchStatus>) => {
    if (live()) searchStatus.update(patch);
  };
  const started = now();
  write({ state: 'loading' });
  // The prebuilt index matches only the bundle the same content build wrote.
  const loader = usingGeneratedBundle() ? Object.values(INDEX_LOADERS)[0] : undefined;
  let problem: string | null = null;
  if (loader !== undefined) {
    const attempt = searchStatus.get().indexFailures;
    try {
      // The browser keeps a failed import, so after a failure the same address is never asked again.
      const plain = attempt === 0 ? await loader() : ((await importAgain(loader, LOADER_BASE, attempt)) as AsPlainObject);
      const loaded = await loadSearchIndexAsync(plain);
      write({ state: 'ready', source: 'prebuilt', docs: loaded.documentCount, loadMs: now() - started, lastError: null });
      return loaded;
    } catch (error) {
      problem = `Prebuilt index, attempt ${attempt + 1}: ${describeError(error)}`;
      write({ lastError: `${problem}. Building it on the phone.`, indexFailures: attempt + 1 });
    }
  }
  // Building on the phone needs every item and the synonyms. When any shard did not load, no
  // index is made: part of the content would answer "Nothing found" for a fix that is there.
  const complete = await loadAllContent();
  if (!complete) {
    write({ state: 'failed', lastError: `${problem ?? 'No prebuilt index'}; and some content did not load, so no index was built.` });
    throw new SearchNotLoaded(SEARCH_NOT_LOADED);
  }
  const bundle = getContentBundle();
  const built = buildSearchIndex(bundle.items, bundle.synonyms);
  write({ state: 'ready', source: 'built-in-memory', docs: built.documentCount, loadMs: now() - started });
  return built;
}

/**
 * Load the index now (the warm-up, or a box being focused), so the first search is instant. Two
 * callers share one load. A load that fails is dropped, so the next call starts a fresh one.
 */
export function preloadSearch(): Promise<void> {
  if (index !== null) return Promise.resolve();
  if (loading === null) {
    const gen = generation;
    const attempt = load(gen).then((loaded) => {
      if (gen === generation) index = loaded;
      return loaded;
    });
    loading = attempt;
    attempt.catch(() => {
      if (loading === attempt) loading = null;
    });
  }
  return loading.then(() => undefined);
}

/**
 * Try again, from a button: a fresh load. If it fails while the app's own address answers, the
 * page reloads for a fresh copy (a deploy may have replaced the index); with no signal it rejects
 * with words that say so. While the page reloads it stays pending, so the box keeps "Searching".
 */
export async function retrySearch(): Promise<void> {
  try {
    await preloadSearch();
  } catch (error) {
    if (!(error instanceof SearchNotLoaded)) throw error;
    const stillHere = await reloadForFreshCopy();
    throw new SearchNotLoaded(stillHere ? SEARCH_NOT_LOADED : SEARCH_NO_SIGNAL);
  }
}

/** Search the content. Loads the index on first use (or after a failed load). An empty or stop-word-only query returns []. */
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

/** Tests only: forget the loaded index (the next search loads again); a load already running is dropped. */
export function __resetSearchForTests(): void {
  generation += 1;
  index = null;
  loading = null;
  searchStatus.set({ ...IDLE });
}
