// @vitest-environment node
/**
 * The second try at a lazy chunk (QA DEF-26): the address is read from the loader the bundler
 * wrote, and asked for under ?mc-retry=N, because the browser keeps a failed import. The shapes
 * below are the ones the build writes today (the build guard in scripts/content/viteShards.ts
 * fails if that changes).
 */
import { describe, expect, it, vi } from 'vitest';
import { importAgain, importedAddress, RETRY_PARAM, retryAddress } from './freshImport';

const BASE = 'https://example.test/aurigen-directory/assets/index-Abc123.js';

/**
 * A loader made from source text, so its text is exactly what a browser sees: the test runner
 * rewrites import() inside a test file's own functions. Never called, only read.
 */
function loaderFrom(source: string): () => Promise<unknown> {
  return new Function('T', `return ${source};`)((load: () => Promise<unknown>) => load()) as () => Promise<unknown>;
}

describe('importedAddress', () => {
  it('reads the address of a production loader, resolved against the app chunk', () => {
    // Copied from dist/assets/index-*.js: the preload helper around import(`./file.js`), then .default.
    const loader = loaderFrom('()=>T(()=>import(`./content-lesson-BGNcr8Lu.js`).then(e=>e.default),[])');
    expect(importedAddress(loader, BASE)).toBe('https://example.test/aurigen-directory/assets/content-lesson-BGNcr8Lu.js');
  });

  it('reads double and single quotes, and an absolute dev path', () => {
    expect(importedAddress(loaderFrom('() => import("./search-index-B8wEEo4M.js")'), BASE)).toBe('https://example.test/aurigen-directory/assets/search-index-B8wEEo4M.js');
    expect(importedAddress(loaderFrom("() => import('/src/generated/content.json?mc-shard=lesson').then((m) => m['default'])"), BASE)).toBe(
      'https://example.test/src/generated/content.json?mc-shard=lesson',
    );
  });

  it('gives null for a loader with no import of a fixed address, so it is simply called again', () => {
    expect(importedAddress(() => Promise.resolve({}), BASE)).toBeNull();
    expect(importedAddress(loaderFrom('() => import(`./${name}.js`)'), BASE)).toBeNull();
    expect(importedAddress(loaderFrom('() => import(name)'), BASE)).toBeNull();
    expect(importedAddress(loaderFrom('() => import("./a.js")'), 'not a url')).toBeNull();
  });
});

describe('retryAddress', () => {
  it('adds ?mc-retry=N, keeps the other query words, and replaces an earlier attempt', () => {
    expect(retryAddress('https://example.test/assets/content-fixnode-6Cy5uU8s.js', 1)).toBe(`https://example.test/assets/content-fixnode-6Cy5uU8s.js?${RETRY_PARAM}=1`);
    const again = retryAddress(retryAddress('https://example.test/src/generated/content.json?mc-shard=fixnode', 1), 2);
    const params = new URL(again).searchParams;
    expect(params.get('mc-shard')).toBe('fixnode');
    expect(params.getAll(RETRY_PARAM)).toEqual(['2']);
  });
});

describe('importAgain', () => {
  it('calls a loader whose address cannot be read again, and passes its answer and its failure through', async () => {
    const loader = vi.fn<() => Promise<unknown>>().mockRejectedValueOnce(new Error('still offline')).mockResolvedValueOnce('the shard');
    await expect(importAgain(loader, BASE, 1)).rejects.toThrow('still offline');
    await expect(importAgain(loader, BASE, 2)).resolves.toBe('the shard');
    expect(loader).toHaveBeenCalledTimes(2);
  });
});
