// @vitest-environment node
/**
 * When the search index does not arrive (QA DEF-26), and a test reset during a load (QA DEF-24).
 * The loaders are replaced, so each case is exact; the modules are loaded fresh per case.
 *
 *   A failed load is never kept: search says "Search did not load", never "Nothing found", and the
 *   next search starts a fresh load that finds the fix once the signal is back.
 *   The index is never built from part of the content.
 *   After a failure the prebuilt index is asked for under a fresh address.
 *   Try again: no signal says so; an answering address reloads the page.
 *   A reset bumps a generation: a load from before it writes nothing.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { fixtureBundle, FIX_JERK } from '../features/shared/__tests__/fixture';
import type { LoadableShard } from './contentShards';
import { buildSearchIndex } from './searchEngine';

type Loader = () => Promise<unknown>;
type ImportAgain = (loader: Loader, base: string, attempt: number) => Promise<unknown>;

const bundle = fixtureBundle();
const prebuilt: unknown = JSON.parse(JSON.stringify(buildSearchIndex(bundle.items, bundle.synonyms)));

/** A loader that fails `failures` times, then answers. */
function flaky(failures: number, answer: () => unknown): Loader & { calls: () => number } {
  let calls = 0;
  const loader = () => {
    calls += 1;
    return calls <= failures ? Promise.reject(new TypeError('Failed to fetch dynamically imported module')) : Promise.resolve(answer());
  };
  return Object.assign(loader, { calls: () => calls });
}

async function loadWith(opts: { index: Loader; shardFailures?: number; importAgain?: ImportAgain }) {
  vi.resetModules();
  const shards = await import('./contentShards');
  const shardLoader = (name: LoadableShard) => flaky(opts.shardFailures ?? 0, () => shards.shardOf(bundle, name));
  vi.doMock('./contentLoaders', () => ({
    LOADER_BASE: 'https://example.test/assets/index-Test.js',
    summaryModules: { '../generated/content.json': shards.shardOf(bundle, 'summary') },
    SHARD_LOADERS: Object.fromEntries(shards.LOADABLE_SHARDS.map((name) => [name, { '../generated/content.json': shardLoader(name) }])),
    INDEX_LOADERS: { '../generated/search-index.json': opts.index },
  }));
  if (opts.importAgain !== undefined) vi.doMock('./freshImport', () => ({ importAgain: opts.importAgain }));
  const search = await import('./search');
  const page = await import('./freshPage');
  return { search, page };
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.doUnmock('./contentLoaders');
  vi.doUnmock('./freshImport');
  vi.resetModules();
});

describe('search when its index did not load', () => {
  it('says "Search did not load", keeps nothing, and the next search finds the fix once the signal is back', async () => {
    const index = flaky(1, () => prebuilt);
    const { search } = await loadWith({ index, shardFailures: 1 });
    const failure = await search.search('jerking').catch((error: unknown) => error);
    expect(failure).toBeInstanceOf(search.SearchNotLoaded);
    expect((failure as Error).message).toBe(search.SEARCH_NOT_LOADED);
    expect(search.SEARCH_NOT_LOADED).not.toMatch(/Nothing found|TypeError|https?:\/\//);
    expect(search.searchStatus.get()).toMatchObject({ state: 'failed', indexFailures: 1 });
    expect(search.searchStatus.get().lastError).toMatch(/attempt 1: TypeError/);
    // Nothing was kept: no index built from part of the content.
    expect(search.searchNow('jerking')).toBeNull();
    const hits = await search.search('jerking');
    expect(hits[0]?.id).toBe(FIX_JERK);
    expect(search.searchStatus.get()).toMatchObject({ state: 'ready', source: 'prebuilt' });
    expect(index.calls()).toBe(2);
  });

  it('the index did not load but every shard did: the index is built on the phone, as before', async () => {
    const { search } = await loadWith({ index: flaky(1, () => prebuilt) });
    const hits = await search.search('jerking');
    expect(hits[0]?.id).toBe(FIX_JERK);
    expect(search.searchStatus.get()).toMatchObject({ state: 'ready', source: 'built-in-memory', indexFailures: 1 });
  });

  it('after a failure the prebuilt index is asked for under a fresh address, never the same one', async () => {
    const index = flaky(1, () => prebuilt);
    const again = vi.fn<ImportAgain>(() => Promise.resolve(prebuilt));
    const { search } = await loadWith({ index, shardFailures: 1, importAgain: again });
    await expect(search.preloadSearch()).rejects.toBeInstanceOf(search.SearchNotLoaded);
    await search.preloadSearch();
    expect(index.calls()).toBe(1);
    expect(again.mock.calls.map(([loader, base, attempt]) => [loader === index, base, attempt])).toEqual([[true, 'https://example.test/assets/index-Test.js', 1]]);
    expect(search.searchNow('jerking')?.[0]?.id).toBe(FIX_JERK);
  });

  it('Try again with no signal says so and never reloads; with the address answering, or the saved copy installed (DEF-27), it reloads the page', async () => {
    const { search, page } = await loadWith({ index: flaky(99, () => prebuilt), shardFailures: 99 });
    // A page to reload (this file runs without a browser window).
    vi.stubGlobal('window', {});
    const reload = vi.fn<() => void>();
    page.__setPageReloaderForTests({ savedCopy: () => Promise.resolve(false), answers: () => Promise.resolve(false), reload, graceMs: 0 });
    await expect(search.retrySearch()).rejects.toThrow(search.SEARCH_NO_SIGNAL);
    expect(reload).not.toHaveBeenCalled();
    page.__setPageReloaderForTests({ savedCopy: () => Promise.resolve(false), answers: () => Promise.resolve(true), reload, graceMs: 0 });
    await expect(search.retrySearch()).rejects.toThrow(search.SEARCH_NOT_LOADED);
    expect(reload).toHaveBeenCalledTimes(1);
    // DEF-27: no signal, but the saved copy is installed: the reload goes into it, never "no signal".
    page.__setPageReloaderForTests({ savedCopy: () => Promise.resolve(true), answers: () => Promise.resolve(false), reload, graceMs: 0 });
    await expect(search.retrySearch()).rejects.toThrow(search.SEARCH_NOT_LOADED);
    expect(reload).toHaveBeenCalledTimes(2);
    // The next word still asks again: nothing failed is cached.
    expect(search.searchStatus.get().state).toBe('failed');
  });

  it('a plain search or the warm-up never reloads the page', async () => {
    const { search, page } = await loadWith({ index: flaky(99, () => prebuilt), shardFailures: 99 });
    vi.stubGlobal('window', {});
    const reload = vi.fn<() => void>();
    page.__setPageReloaderForTests({ savedCopy: () => Promise.resolve(true), answers: () => Promise.resolve(true), reload, graceMs: 0 });
    await expect(search.search('jerking')).rejects.toBeInstanceOf(search.SearchNotLoaded);
    await expect(search.preloadSearch()).rejects.toBeInstanceOf(search.SearchNotLoaded);
    expect(reload).not.toHaveBeenCalled();
  });
});

describe('a test reset while the index loads (QA DEF-24)', () => {
  it('the load from before the reset writes neither the status nor the index', async () => {
    let finish: (value: unknown) => void = () => undefined;
    const index = () => new Promise<unknown>((resolve) => (finish = resolve));
    const { search } = await loadWith({ index });
    const old = search.preloadSearch();
    expect(search.searchStatus.get().state).toBe('loading');
    search.__resetSearchForTests();
    expect(search.searchStatus.get().state).toBe('idle');
    finish(prebuilt);
    await old;
    expect(search.searchStatus.get()).toMatchObject({ state: 'idle', source: null, docs: 0 });
    expect(search.searchNow('jerking')).toBeNull();
  });

  it('a failure from before the reset does not drop a load started after it', async () => {
    let fail: (error: unknown) => void = () => undefined;
    let calls = 0;
    const index = () => {
      calls += 1;
      return calls === 1 ? new Promise<unknown>((_resolve, reject) => (fail = reject)) : Promise.resolve(prebuilt);
    };
    const { search } = await loadWith({ index, shardFailures: 99 });
    const old = search.preloadSearch().catch(() => 'old failed');
    search.__resetSearchForTests();
    const fresh = search.preloadSearch();
    fail(new TypeError('offline'));
    expect(await old).toBe('old failed');
    await fresh;
    expect(search.searchStatus.get()).toMatchObject({ state: 'ready', source: 'prebuilt' });
    expect(search.searchNow('jerking')?.[0]?.id).toBe(FIX_JERK);
  });
});
