/**
 * When content does not arrive (QA DEF-17): no build at all, a build from another app version, a
 * chunk that fails to load, and the retry that follows. The loaders are replaced, so each case is
 * exact; the module is loaded fresh per case.
 *
 * QA DEF-26: the page shows plain words (the error stays in the developer panel); a failed chunk is
 * asked for again under a fresh address, because the browser keeps a failed import; Try again that
 * still fails reloads the page only when the app's own address answers, and says "no signal" when
 * it does not; a load that is not Try again never reloads.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ContentBundle } from './contentBundle';
import type { LoadableShard } from './contentShards';

const card = {
  id: 'card-test',
  type: 'quickcard',
  title: 'Test card',
  tags: [],
  synonyms: [],
  audience: ['owner'],
  visibility: 'internal',
  status: 'house',
  sources: [],
  version: 1,
  related: [],
  kind: 'list',
  rows: [{ label: 'Rule', value: 'One.' }],
};
const bundle = { version: 1, items: [card], signOffs: [], synonyms: [], customerSafeIds: [] } as unknown as ContentBundle;

type Loader = () => Promise<unknown>;
type ImportAgain = (loader: Loader, base: string, attempt: number) => Promise<unknown>;

async function loadWith(summary: unknown, loaders: Partial<Record<LoadableShard, Loader>>, importAgain?: ImportAgain) {
  vi.resetModules();
  const shards = await import('./contentShards');
  vi.doMock('./contentLoaders', () => ({
    LOADER_BASE: 'https://example.test/assets/index-Test.js',
    summaryModules: summary === undefined ? {} : { '../generated/content.json': summary },
    SHARD_LOADERS: Object.fromEntries(shards.LOADABLE_SHARDS.map((name) => [name, loaders[name] === undefined ? {} : { '../generated/content.json': loaders[name] }])),
  }));
  if (importAgain !== undefined) vi.doMock('./freshImport', () => ({ importAgain }));
  return import('./content');
}

/** The reload seam of the module instance content.ts uses (same registry after loadWith). */
async function pageReloader(answers: boolean, savedCopy = false) {
  const page = await import('./freshPage');
  const reload = vi.fn<() => void>();
  page.__setPageReloaderForTests({ savedCopy: () => Promise.resolve(savedCopy), answers: () => Promise.resolve(answers), reload, graceMs: 0 });
  return reload;
}

afterEach(() => {
  vi.doUnmock('./contentLoaders');
  vi.doUnmock('./freshImport');
  vi.resetModules();
});

describe('content that does not arrive', () => {
  it('no content build: every type reads empty, and the status says to run the build', async () => {
    const content = await loadWith(undefined, {});
    expect(content.contentStatus()).toMatchObject({ built: false, items: 0, problem: 'The content bundle was not built. Run npm run content.' });
    expect(content.contentLoaded(['fixnode', 'catalog', 'extras'])).toBe(true);
    expect(content.getItemsByType('fixnode')).toEqual([]);
    expect(await content.ensureContent(['quickcard'])).toBe(true);
  });

  it('a build from another app version: the same, with its own words', async () => {
    const shards = await import('./contentShards');
    const content = await loadWith({ ...shards.shardOf(bundle, 'summary'), version: 0 }, {});
    expect(content.contentStatus()).toMatchObject({ built: false, problem: 'The content bundle is from another app version. Run npm run content.' });
  });

  it('a shard that fails to load says so in plain words, keeps the error for the panel, and Try again loads it', async () => {
    const shards = await import('./contentShards');
    let calls = 0;
    const content = await loadWith(shards.shardOf(bundle, 'summary'), {
      quickcard: () => {
        calls += 1;
        return calls === 1 ? Promise.reject(new TypeError('Failed to fetch dynamically imported module: https://example.test/assets/content-quickcard-X1.js')) : Promise.resolve(shards.shardOf(bundle, 'quickcard'));
      },
    });
    expect(content.contentStatus()).toMatchObject({ built: true, items: 1, problem: null });
    expect(await content.ensureContent(['quickcard'])).toBe(false);
    const state = content.contentStore.get();
    expect(state.failed.quickcard).toBe(content.CONTENT_NOT_LOADED);
    expect(state.failed.quickcard).not.toMatch(/TypeError|https?:\/\/|\.js\b/);
    expect(state.failedDetail.quickcard).toMatch(/Attempt 1: TypeError: Failed to fetch dynamically imported module/);
    expect(state.attempts.quickcard).toBe(1);
    expect(content.contentStatus().problem).toBe(content.CONTENT_NOT_LOADED);
    expect(state.loading).toEqual([]);
    expect(await content.retryContent(['quickcard'])).toBe(true);
    expect(content.contentStore.get().failed.quickcard).toBeUndefined();
    expect(content.getItem('card-test')?.title).toBe('Test card');
    expect(calls).toBe(2);
  });

  it('after a failure the next load asks for a fresh copy, counting attempts, never the same address', async () => {
    const shards = await import('./contentShards');
    const first = vi.fn<Loader>(() => Promise.reject(new TypeError('offline')));
    const again = vi.fn<ImportAgain>((_loader, _base, attempt) => (attempt < 2 ? Promise.reject(new TypeError('still offline')) : Promise.resolve(shards.shardOf(bundle, 'quickcard'))));
    const content = await loadWith(shards.shardOf(bundle, 'summary'), { quickcard: first }, again);
    expect(await content.ensureContent(['quickcard'])).toBe(false);
    expect(await content.ensureContent(['quickcard'])).toBe(false);
    expect(content.contentStore.get().attempts.quickcard).toBe(2);
    expect(await content.ensureContent(['quickcard'])).toBe(true);
    expect(first).toHaveBeenCalledTimes(1);
    expect(again.mock.calls.map(([loader, base, attempt]) => [loader === first, base, attempt])).toEqual([
      [true, 'https://example.test/assets/index-Test.js', 1],
      [true, 'https://example.test/assets/index-Test.js', 2],
    ]);
  });

  it('Try again that still fails while the app address answers reloads the page, and the screen keeps Opening meanwhile', async () => {
    const shards = await import('./contentShards');
    const content = await loadWith(shards.shardOf(bundle, 'summary'), { quickcard: () => Promise.reject(new TypeError('gone after a deploy')) });
    const page = await import('./freshPage');
    const reload = vi.fn<() => void>();
    let answer: (value: boolean) => void = () => undefined;
    page.__setPageReloaderForTests({ savedCopy: () => Promise.resolve(false), answers: () => new Promise<boolean>((resolve) => (answer = resolve)), reload, graceMs: 0 });
    expect(await content.ensureContent(['quickcard'])).toBe(false);
    expect(reload).not.toHaveBeenCalled();
    const retry = content.retryContent(['quickcard']);
    await new Promise((resolve) => setTimeout(resolve, 0));
    // While the address is checked: loading, no failure line.
    expect(content.contentStore.get().loading).toEqual(['quickcard']);
    expect(content.contentStore.get().failed.quickcard).toBeUndefined();
    answer(true);
    expect(await retry).toBe(false);
    expect(reload).toHaveBeenCalledTimes(1);
    // The page did not go away within the grace period: the plain line comes back, with Try again.
    expect(content.contentStore.get().failed.quickcard).toBe(content.CONTENT_NOT_LOADED);
  });

  it('Try again with no signal says so and never reloads', async () => {
    const shards = await import('./contentShards');
    const content = await loadWith(shards.shardOf(bundle, 'summary'), { quickcard: () => Promise.reject(new TypeError('offline')) });
    const reload = await pageReloader(false);
    expect(await content.retryContent(['quickcard'])).toBe(false);
    expect(reload).not.toHaveBeenCalled();
    expect(content.contentStore.get().failed.quickcard).toBe(content.CONTENT_NO_SIGNAL);
    expect(content.CONTENT_NO_SIGNAL).not.toMatch(/TypeError|https?:\/\/|\.js\b/);
  });

  it('DEF-27: Try again with no signal while the saved copy is installed reloads into it, and the screen keeps Opening meanwhile', async () => {
    const shards = await import('./contentShards');
    const content = await loadWith(shards.shardOf(bundle, 'summary'), { quickcard: () => Promise.reject(new TypeError('offline, page not served by the saved copy yet')) });
    const reload = await pageReloader(false, true);
    expect(await content.ensureContent(['quickcard'])).toBe(false);
    expect(reload).not.toHaveBeenCalled();
    expect(await content.retryContent(['quickcard'])).toBe(false);
    expect(reload).toHaveBeenCalledTimes(1);
    // Never the "no signal" line when a reload into the saved copy was possible.
    expect(content.contentStore.get().failed.quickcard).toBe(content.CONTENT_NOT_LOADED);
  });

  it('a load that is not Try again (a screen, the warm-up, search) never reloads the page', async () => {
    const shards = await import('./contentShards');
    const content = await loadWith(shards.shardOf(bundle, 'summary'), { quickcard: () => Promise.reject(new TypeError('offline')) });
    const reload = await pageReloader(true, true);
    expect(await content.ensureContent(['quickcard'])).toBe(false);
    expect(await content.loadAllContent()).toBe(false);
    expect(reload).not.toHaveBeenCalled();
  });

  it('a shard that arrives but cannot be read fails plainly, never stuck on Opening', async () => {
    const shards = await import('./contentShards');
    const content = await loadWith(shards.shardOf(bundle, 'summary'), { quickcard: () => Promise.resolve({ ...shards.shardOf(bundle, 'quickcard'), items: [null] }) });
    expect(await content.ensureContent(['quickcard'])).toBe(false);
    expect(content.contentStore.get().loading).toEqual([]);
    expect(content.contentStore.get().failed.quickcard).toBe(content.CONTENT_NOT_LOADED);
    expect(content.contentStore.get().failedDetail.quickcard).toMatch(/^Unreadable: TypeError/);
  });

  it('a module that is not the shard asked for is refused as another version', async () => {
    const shards = await import('./contentShards');
    const content = await loadWith(shards.shardOf(bundle, 'summary'), {
      quickcard: () => Promise.resolve(shards.shardOf(bundle, 'catalog')),
    });
    expect(await content.ensureContent(['quickcard'])).toBe(false);
    expect(content.contentStore.get().failed.quickcard).toBe('The content bundle is from another app version. Run npm run content.');
    expect(content.getItem('card-test')).toBeUndefined();
  });

  it('a type with no loader (nothing of it in this build) fails plainly, never hangs', async () => {
    const shards = await import('./contentShards');
    const content = await loadWith(shards.shardOf(bundle, 'summary'), {});
    expect(await content.ensureContent(['drill'])).toBe(false);
    expect(content.contentStore.get().failed.drill).toMatch(/did not load/);
    expect(content.contentStore.get().failedDetail.drill).toBe('The content bundle was not built. Run npm run content.');
  });

  it('price items for a backup: a shard that will not load reads as none, as before', async () => {
    const shards = await import('./contentShards');
    const content = await loadWith(shards.shardOf(bundle, 'summary'), { priceitem: () => Promise.reject(new Error('gone')) });
    expect(await content.loadPriceItems()).toEqual([]);
  });
});
