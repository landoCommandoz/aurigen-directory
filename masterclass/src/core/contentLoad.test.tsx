/**
 * Content in shards, as the app loads it (QA DEF-17): nothing is in memory at boot except the
 * counts; a screen's shards load once, however many ask; a test bundle loads everything at once;
 * useContent waits for its start signal and for the frame to paint. Real shards, served through the
 * Vite plugin from src/generated/content.json (skipped when the content build has not run).
 */
import '@testing-library/jest-dom/vitest';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { fixtureBundle } from '../features/shared/__tests__/fixture';
import {
  afterNextPaint,
  contentCount,
  contentLoaded,
  contentStatus,
  contentStore,
  ensureContent,
  getCatalogEntry,
  getContentBundle,
  getItem,
  getItemsByType,
  loadAllContent,
  loadPriceItems,
  useContent,
  usingGeneratedBundle,
  __setContentBundleForTests,
  type LoadableShard,
} from './content';

// Vitest runs from masterclass/ (jsdom gives import.meta.url no file scheme).
const BUILT = existsSync(join(process.cwd(), 'src/generated/content.json'));

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  __setContentBundleForTests(null);
});

describe.skipIf(!BUILT)('the generated content, in shards', () => {
  it('at boot only the counts are in memory', () => {
    __setContentBundleForTests(null);
    const status = contentStatus();
    expect(status).toMatchObject({ built: true, problem: null, loaded: 0 });
    expect(status.items).toBeGreaterThan(0);
    expect(contentCount('fixnode')).toBeGreaterThan(0);
    expect(contentCount('priceitem')).toBe(0);
    expect(getItem('fix-01')).toBeUndefined();
    expect(getItemsByType('fixnode')).toEqual([]);
    expect(usingGeneratedBundle()).toBe(true);
  });

  it('a screen gets its shards and nothing more', async () => {
    expect(await ensureContent(['fixnode', 'catalog'])).toBe(true);
    expect(getItem('fix-01')?.type).toBe('fixnode');
    expect(getItemsByType('fixnode')).toHaveLength(contentCount('fixnode'));
    // The catalog names a lesson whose shard is not loaded (the fixes link lessons).
    const lessonId = getItemsByType('fixnode').flatMap((fix) => fix.related).find((id) => id.startsWith('lesson-')) ?? 'none';
    expect(getCatalogEntry(lessonId)?.type).toBe('lesson');
    expect(getItem(lessonId)).toBeUndefined();
    expect(getItemsByType('lesson')).toEqual([]);
    expect(contentLoaded(['lesson'])).toBe(false);
  });

  it('asking twice at once loads each shard once', async () => {
    const both = await Promise.all([ensureContent(['quickcard']), ensureContent(['quickcard', 'glossaryterm'])]);
    expect(both).toEqual([true, true]);
    const loaded = contentStore.get().loaded;
    expect(loaded.filter((name) => name === 'quickcard')).toHaveLength(1);
    expect(contentStore.get().loading).toEqual([]);
  });

  it('everything, for the in-memory index and backups, matches the counts', async () => {
    expect(await loadAllContent()).toBe(true);
    const bundle = getContentBundle();
    expect(bundle.items).toHaveLength(contentStatus().items);
    expect(bundle.signOffs).toHaveLength(contentStatus().signOffs);
    expect(await loadPriceItems()).toEqual(getItemsByType('priceitem'));
  });

  it('Customer View reads only customer-safe catalog lines', async () => {
    await ensureContent(['catalog', 'fixnode']);
    expect(getCatalogEntry('fix-01')).toBeDefined();
    expect(getCatalogEntry('fix-01', { customerView: true })).toBeUndefined();
    expect(getItem('fix-01', { customerView: true })).toBeUndefined();
  });
});

describe('a bundle a test swaps in', () => {
  it('is in memory at once, every shard, and the null swap puts the generated content back unloaded', () => {
    const bundle = fixtureBundle();
    __setContentBundleForTests(bundle);
    expect(contentLoaded(['fixnode', 'lesson', 'catalog', 'extras', 'drill'])).toBe(true);
    expect(getItemsByType('fixnode').length).toBeGreaterThan(0);
    expect(contentCount('fixnode')).toBe(bundle.items.filter((item) => item.type === 'fixnode').length);
    expect(usingGeneratedBundle()).toBe(false);
    __setContentBundleForTests(null);
    expect(contentLoaded(['fixnode'])).toBe(BUILT ? false : true);
  });

  it('a load from before a swap changes nothing after it', async () => {
    if (!BUILT) return;
    __setContentBundleForTests(null);
    const pending = ensureContent(['fixnode']);
    const bundle = fixtureBundle();
    __setContentBundleForTests(bundle);
    await pending;
    expect(getItemsByType('fixnode').map((item) => item.id)).toEqual(bundle.items.filter((item) => item.type === 'fixnode').map((item) => item.id));
  });
});

function Probe({ names, start }: { names: readonly LoadableShard[]; start: boolean }) {
  const content = useContent(names, start);
  return <p>{content.ready ? 'ready' : content.problem ?? 'waiting'}</p>;
}

describe.skipIf(!BUILT)('useContent', () => {
  it('waits for its start signal', async () => {
    __setContentBundleForTests(null);
    const view = render(<Probe names={['sop']} start={false} />);
    await new Promise((resolve) => setTimeout(resolve, 250));
    expect(screen.getByText('waiting')).toBeInTheDocument();
    expect(contentLoaded(['sop'])).toBe(false);
    view.rerender(<Probe names={['sop']} start />);
    await waitFor(() => expect(screen.getByText('ready')).toBeInTheDocument());
  });

  it('starts the load after the frame is painted, not during the render', async () => {
    __setContentBundleForTests(null);
    render(<Probe names={['equipment']} start />);
    // The effect has run, but the load waits for the next paint.
    expect(contentStore.get().loading).toEqual([]);
    await waitFor(() => expect(screen.getByText('ready')).toBeInTheDocument());
  });

  it('a shard already in memory is ready on the first render', async () => {
    await ensureContent(['product']);
    render(<Probe names={['product']} start={false} />);
    expect(screen.getByText('ready')).toBeInTheDocument();
  });
});

describe('afterNextPaint', () => {
  it('runs once, after a frame and a task; cancel stops it', async () => {
    vi.useFakeTimers();
    const run = vi.fn<() => void>();
    afterNextPaint(run);
    expect(run).not.toHaveBeenCalled();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(200);
    });
    expect(run).toHaveBeenCalledTimes(1);
    const never = vi.fn<() => void>();
    const cancel = afterNextPaint(never);
    cancel();
    await vi.advanceTimersByTimeAsync(500);
    expect(never).not.toHaveBeenCalled();
  });

  it('still runs on a page with no animation frames (a hidden tab)', async () => {
    vi.useFakeTimers();
    vi.stubGlobal('requestAnimationFrame', undefined);
    const run = vi.fn<() => void>();
    afterNextPaint(run);
    await vi.advanceTimersByTimeAsync(200);
    expect(run).toHaveBeenCalledTimes(1);
    vi.unstubAllGlobals();
  });
});
