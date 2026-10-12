/**
 * The content, as the app reads it. The content build writes src/generated/content.json
 * (gitignored); the build cuts it into shards (contentShards.ts, scripts/content/viteShards.ts),
 * each its own chunk in the offline copy. Nothing here is on the first screen's path (QA DEF-17):
 * the shell and Home draw with only the summary (item counts), and a screen loads the shards it
 * draws when it opens. A shard that is loaded stays in memory, so going back is instant.
 *
 *   const content = useContent(['fixnode', 'catalog'], cv.ready);
 *   if (!content.ready) return <ContentGate content={content} ... />;   // loading, or the problem
 *   const fix = getItem(id);                                             // sync once loaded
 *
 * The getters are synchronous and read only what is loaded: an unloaded type reads as empty, so a
 * screen waits on useContent() before it says "not found". import.meta.glob (contentLoaders.ts)
 * means a fresh checkout without the content build still typechecks and boots, with a status.
 *
 * A shard that failed to download (QA DEF-26) says so in plain words, with the error kept for the
 * developer panel only. Its next load asks for a fresh copy (freshImport.ts), because the browser
 * keeps a failed import. Try again (retryContent) does the same, and when that fails too while the
 * app's own address answers, it reloads the page (freshPage.ts): that heals a tab left open across
 * a deploy. With no signal it says so and stays put.
 */
import { useCallback, useEffect } from 'react';
import type { ContentItemValue, ContentTypeName, PriceItemItem, SignOffCriteriaItem } from '../schemas';
import { CONTENT_BUNDLE_VERSION, emptyBundle, type ContentBundle } from './contentBundle';
import { LOADER_BASE, SHARD_LOADERS, summaryModules } from './contentLoaders';
import {
  isShard,
  LOADABLE_SHARDS,
  shardOf,
  summaryOf,
  type CatalogEntry,
  type CatalogShard,
  type ExtrasShard,
  type LoadableShard,
  type SummaryShard,
  type TypeShard,
} from './contentShards';
import { customerSafe } from './customerSafe';
import { describeError } from './errors';
import { importAgain } from './freshImport';
import { reloadForFreshCopy } from './freshPage';
import { createStore, useStore } from './store';

export type { CatalogEntry, LoadableShard };

const NOT_BUILT = 'The content bundle was not built. Run npm run content.';
const OTHER_VERSION = 'The content bundle is from another app version. Run npm run content.';
/** What a page says when its content did not download. Plain words: the error is for the developer panel. */
export const CONTENT_NOT_LOADED = 'This page did not load. Check the signal, then tap Try again.';
/** After Try again, when the app's own address does not answer either. */
export const CONTENT_NO_SIGNAL = 'This page still did not load. There is no signal right now. Check the signal, then tap Try again.';

export interface ContentState {
  /** False when there is no content build in this app (or it is from another version). */
  built: boolean;
  /** Where the content comes from: the build, or a bundle a test swapped in. */
  source: 'generated' | 'test';
  /** Shards in memory, in load order. */
  loaded: readonly LoadableShard[];
  /** Shards being fetched now. */
  loading: readonly LoadableShard[];
  /** Shards whose last load failed, with the words the page shows (cleared by a retry). */
  failed: Readonly<Partial<Record<LoadableShard, string>>>;
  /** The error behind each failure, for the developer panel only (never on a page). */
  failedDetail: Readonly<Partial<Record<LoadableShard, string>>>;
  /** Failed downloads per shard on this page; the next load of such a shard asks for a fresh copy. */
  attempts: Readonly<Partial<Record<LoadableShard, number>>>;
  /** Bumped when a test swaps the bundle, so a load from before the swap is dropped. */
  generation: number;
}

/** Live content state, for screens (useContent) and the developer panel. */
export const contentStore = createStore<ContentState>({ built: false, source: 'generated', loaded: [], loading: [], failed: {}, failedDetail: {}, attempts: {}, generation: 0 });

/** The parts of the state a fresh start or a test swap clears. */
const NO_FAILURES = { failed: {}, failedDetail: {}, attempts: {} } as const;

let summary: SummaryShard = summaryOf(emptyBundle());
let buildProblem: string | null = null;
const types = new Map<ContentTypeName, ContentItemValue[]>();
let catalog: Map<string, CatalogEntry> | null = null;
let extras: ExtrasShard | null = null;
const byId = new Map<string, ContentItemValue>();
const inflight = new Map<LoadableShard, Promise<void>>();

function accept(shard: TypeShard | CatalogShard | ExtrasShard): void {
  if (shard.shard === 'catalog') catalog = new Map(shard.entries.map((entry) => [entry.id, entry]));
  else if (shard.shard === 'extras') extras = shard;
  else {
    types.set(shard.shard, shard.items);
    for (const item of shard.items) byId.set(item.id, item);
  }
}

function clearLoaded(): void {
  types.clear();
  byId.clear();
  catalog = null;
  extras = null;
  inflight.clear();
}

/** Every shard of a bundle, at once: a swapped-in test bundle, or the empty one when nothing was built. */
function acceptWhole(bundle: ContentBundle): void {
  for (const name of LOADABLE_SHARDS) accept(shardOf(bundle, name) as TypeShard | CatalogShard | ExtrasShard);
}

function startGenerated(): void {
  clearLoaded();
  const found = Object.values(summaryModules)[0];
  const generation = contentStore.get().generation + 1;
  if (found !== undefined && isShard(found, 'summary')) {
    summary = found as SummaryShard;
    buildProblem = null;
    contentStore.set({ built: true, source: 'generated', loaded: [], loading: [], ...NO_FAILURES, generation });
    return;
  }
  // No build, or one from another version: every shard reads as empty, and the status says why.
  summary = summaryOf(emptyBundle());
  buildProblem = found === undefined ? NOT_BUILT : OTHER_VERSION;
  acceptWhole(emptyBundle());
  contentStore.set({ built: false, source: 'generated', loaded: [...LOADABLE_SHARDS], loading: [], ...NO_FAILURES, generation });
}

startGenerated();

/** 'retry' is a tap on Try again: a failure then may reload the page for a fresh copy. */
type LoadMode = 'load' | 'retry';

function loadShard(name: LoadableShard, mode: LoadMode = 'load'): Promise<void> {
  const running = inflight.get(name);
  if (running !== undefined) return running;
  const loader = Object.values(SHARD_LOADERS[name])[0];
  const start = contentStore.get();
  const generation = start.generation;
  const attempt = start.attempts[name] ?? 0;
  contentStore.update({ loading: [...start.loading, name], failed: { ...start.failed, [name]: undefined } });
  let promise: Promise<void> | null = null;
  const done = (failure: { words: string; detail: string; importFailed: boolean } | null) => {
    // A test may have swapped the bundle meanwhile; then this load is stale and changes nothing.
    if (inflight.get(name) === promise) inflight.delete(name);
    const now = contentStore.get();
    if (now.generation !== generation) return;
    const loading = now.loading.filter((n) => n !== name);
    if (failure === null) {
      contentStore.update({ loading, loaded: [...now.loaded, name] });
      return;
    }
    contentStore.update({
      loading,
      failed: { ...now.failed, [name]: failure.words },
      failedDetail: { ...now.failedDetail, [name]: failure.detail },
      attempts: failure.importFailed ? { ...now.attempts, [name]: attempt + 1 } : now.attempts,
    });
  };
  promise = (async () => {
    try {
      if (loader === undefined) {
        done({ words: CONTENT_NOT_LOADED, detail: NOT_BUILT, importFailed: false });
        return;
      }
      let module: unknown;
      try {
        // The browser keeps a failed import, so after a failure the same address is never asked again.
        module = attempt === 0 ? await loader() : await importAgain(loader, LOADER_BASE, attempt);
      } catch (error) {
        const detail = `Attempt ${attempt + 1}: ${describeError(error)}`;
        if (mode === 'retry' && contentStore.get().generation === generation) {
          // Pending while the page reloads, so the screen keeps saying Opening.
          const stillHere = await reloadForFreshCopy();
          done({ words: stillHere ? CONTENT_NOT_LOADED : CONTENT_NO_SIGNAL, detail, importFailed: true });
          return;
        }
        done({ words: CONTENT_NOT_LOADED, detail, importFailed: true });
        return;
      }
      if (contentStore.get().generation !== generation) {
        done(null);
        return;
      }
      if (!isShard(module, name)) {
        done({ words: OTHER_VERSION, detail: OTHER_VERSION, importFailed: false });
        return;
      }
      accept(module as TypeShard | CatalogShard | ExtrasShard);
      done(null);
    } catch (error) {
      // A shard that arrived but could not be read: never left on Opening.
      done({ words: CONTENT_NOT_LOADED, detail: `Unreadable: ${describeError(error)}`, importFailed: false });
    }
  })();
  inflight.set(name, promise);
  return promise;
}

/** True when every named shard is in memory. */
export function contentLoaded(names: readonly LoadableShard[]): boolean {
  const loaded = contentStore.get().loaded;
  return names.every((name) => loaded.includes(name));
}

/** Load the named shards (each once, however many screens ask). Resolves true when all are in memory. */
export async function ensureContent(names: readonly LoadableShard[]): Promise<boolean> {
  await Promise.all(names.filter((name) => !contentLoaded([name])).map((name) => loadShard(name)));
  return contentLoaded(names);
}

/**
 * Try again, from a button: load the named shards again, each failed one under a fresh address.
 * If one still fails while the app's own address answers, the page reloads for a fresh copy;
 * with no signal it says so. Resolves true when all are in memory.
 */
export async function retryContent(names: readonly LoadableShard[]): Promise<boolean> {
  await Promise.all(names.filter((name) => !contentLoaded([name])).map((name) => loadShard(name, 'retry')));
  return contentLoaded(names);
}

/** Every shard: the in-memory search index and a backup summary need the whole set. */
export function loadAllContent(): Promise<boolean> {
  return ensureContent(LOADABLE_SHARDS);
}

export interface ContentReadiness {
  ready: boolean;
  /** Why a shard this screen needs did not load, or null. */
  problem: string | null;
  retry: () => void;
}

/** How long a hidden page (no animation frames) waits before loading anyway. */
const PAINT_FALLBACK_MS = 120;

/**
 * Run once the browser has painted the frame now being drawn: a frame callback, then a task (or
 * the fallback timer, for a page with no frames, such as a tab in the background). Returns a
 * cancel. React may run an effect before that paint; this puts a shard load after it.
 */
export function afterNextPaint(run: () => void): () => void {
  let done = false;
  let frame: number | null = null;
  let task: ReturnType<typeof setTimeout> | null = null;
  const once = () => {
    if (done) return;
    done = true;
    run();
  };
  const fallback = setTimeout(once, PAINT_FALLBACK_MS);
  if (typeof requestAnimationFrame === 'function') {
    frame = requestAnimationFrame(() => {
      frame = null;
      task = setTimeout(once, 0);
    });
  }
  return () => {
    done = true;
    clearTimeout(fallback);
    if (task !== null) clearTimeout(task);
    if (frame !== null && typeof cancelAnimationFrame === 'function') cancelAnimationFrame(frame);
  };
}

/**
 * React: load the shards a screen draws, re-rendering when they arrive. Shards already in memory
 * are ready on the first render. `start` holds the load until the screen can draw (pages pass the
 * Customer View flag's ready state), and the load begins after that frame is painted, so the
 * shell's first paint never waits behind a shard (QA DEF-17).
 */
export function useContent(names: readonly LoadableShard[], start = true): ContentReadiness {
  const state = useStore(contentStore);
  const key = [...names].sort().join(',');
  const failedHere = names.map((name) => state.failed[name]).find((reason) => reason !== undefined) ?? null;
  const ready = names.every((name) => state.loaded.includes(name));
  useEffect(() => {
    if (!start || ready || failedHere !== null) return undefined;
    return afterNextPaint(() => void ensureContent(key === '' ? [] : (key.split(',') as LoadableShard[])));
  }, [key, start, ready, state.generation, failedHere]);
  const retry = useCallback(() => {
    void retryContent(key === '' ? [] : (key.split(',') as LoadableShard[]));
  }, [key]);
  return { ready, problem: failedHere, retry };
}

/** Whether a build was found, how many items it holds, why not if not, and the last load failure. */
export function contentStatus(): { built: boolean; items: number; signOffs: number; problem: string | null; loaded: number; shards: number } {
  const state = contentStore.get();
  const failure = Object.values(state.failed).find((reason) => reason !== undefined) ?? null;
  return { built: state.built, items: summary.items, signOffs: summary.signOffs, problem: buildProblem ?? failure, loaded: state.loaded.length, shards: LOADABLE_SHARDS.length };
}

/** How many items of a type this build holds, known before any shard loads (Home's tiles). */
export function contentCount(type: ContentTypeName): number {
  return summary.counts[type] ?? 0;
}

/** The loaded items as one bundle. Complete only after loadAllContent(). */
export function getContentBundle(): ContentBundle {
  const items = [...byId.values()].sort((a, b) => a.id.localeCompare(b.id));
  return { version: CONTENT_BUNDLE_VERSION, items, signOffs: extras?.signOffs ?? [], synonyms: extras?.synonyms ?? [] };
}

/** True when the content in use is the one the content build wrote, so its prebuilt search index matches. */
export function usingGeneratedBundle(): boolean {
  const state = contentStore.get();
  return state.source === 'generated' && state.built;
}

export type ItemOfType<T extends ContentTypeName> = Extract<ContentItemValue, { type: T }>;

export interface ContentQuery {
  /** True in Customer View: only items that pass customerSafe() come back. */
  customerView?: boolean;
}

/** One loaded item by id. In Customer View an item that may not render comes back undefined. */
export function getItem(id: string, query: ContentQuery = {}): ContentItemValue | undefined {
  const item = byId.get(id);
  if (item === undefined) return undefined;
  if (query.customerView === true) return customerSafe([item])[0];
  return item;
}

/** Every loaded item of one type, in id order (empty until its shard loads). */
export function getItemsByType<T extends ContentTypeName>(type: T, query: ContentQuery = {}): ItemOfType<T>[] {
  const items = (types.get(type) ?? []) as ItemOfType<T>[];
  return query.customerView === true ? customerSafe(items) : items;
}

/** Every loaded item, in id order. */
export function getAllItems(query: ContentQuery = {}): ContentItemValue[] {
  const items = getContentBundle().items;
  return query.customerView === true ? customerSafe(items) : items;
}

/** One item's catalog line (id, type, title, status) once the catalog shard is loaded. Customer View sees only safe ones. */
export function getCatalogEntry(id: string, query: ContentQuery = {}): CatalogEntry | undefined {
  const entry = catalog?.get(id);
  if (entry === undefined) return undefined;
  return query.customerView === true && !entry.customerSafe ? undefined : entry;
}

export function getPriceItems(): PriceItemItem[] {
  return getItemsByType('priceitem');
}

/** The price items, loading their shard first (backup counts). A shard that will not load reads as none, as before. */
export async function loadPriceItems(): Promise<PriceItemItem[]> {
  await ensureContent(['priceitem']);
  return getPriceItems();
}

export function getSignOffCriteria(skillId: string): SignOffCriteriaItem | undefined {
  return extras?.signOffs.find((c) => c.skillId === skillId);
}

/** The one skill whose sign-off opens the polish stage for crew (D11), once the extras shard is loaded. */
export function polishGateSkillId(): string | null {
  return extras?.signOffs.find((c) => c.gates.includes('polish-stage'))?.skillId ?? null;
}

/** Tests only: swap in a bundle, every shard loaded at once (null restores the generated content, unloaded). */
export function __setContentBundleForTests(bundle: ContentBundle | null): void {
  if (bundle === null) {
    startGenerated();
    return;
  }
  clearLoaded();
  acceptWhole(bundle);
  summary = summaryOf(bundle);
  buildProblem = null;
  contentStore.set({ built: true, source: 'test', loaded: [...LOADABLE_SHARDS], loading: [], ...NO_FAILURES, generation: contentStore.get().generation + 1 });
}
