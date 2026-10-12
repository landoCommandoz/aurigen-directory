/**
 * The warm-up (QA DEF-17): nothing before the page's load event plus WARM_DELAY_MS, then the
 * search index, then the Fix It and Quick Card shards; a search index that fails does not stop the
 * shards.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const calls: string[] = [];
const preloadSearch = vi.fn<() => Promise<void>>(() => {
  calls.push('search');
  return Promise.resolve();
});
const ensureContent = vi.fn<(names: readonly string[]) => Promise<boolean>>((names) => {
  calls.push(`content ${names.join(',')}`);
  return Promise.resolve(true);
});

vi.mock('../../core/search', () => ({ preloadSearch: () => preloadSearch() }));
vi.mock('../../core/content', () => ({ ensureContent: (names: readonly string[]) => ensureContent(names) }));

const { scheduleWarmUp, WARM_CONTENT, WARM_DELAY_MS } = await import('../warmUp');

beforeEach(() => {
  vi.useFakeTimers();
  calls.length = 0;
  preloadSearch.mockClear();
  ensureContent.mockClear();
  // No idle callback in this window: the warm-up falls back to a short timer.
  vi.stubGlobal('requestIdleCallback', undefined);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('scheduleWarmUp', () => {
  it('waits for the page to finish loading and the delay, then loads the search index, then the Fix It content', async () => {
    Object.defineProperty(document, 'readyState', { configurable: true, get: () => 'loading' });
    scheduleWarmUp();
    await vi.advanceTimersByTimeAsync(WARM_DELAY_MS * 3);
    expect(calls).toEqual([]);
    window.dispatchEvent(new Event('load'));
    await vi.advanceTimersByTimeAsync(WARM_DELAY_MS - 10);
    expect(calls).toEqual([]);
    await vi.advanceTimersByTimeAsync(400);
    expect(calls).toEqual(['search', `content ${WARM_CONTENT.join(',')}`]);
    expect(WARM_CONTENT).toEqual(['fixnode', 'quickcard', 'catalog']);
    Reflect.deleteProperty(document, 'readyState');
  });

  it('after the load event already fired, it counts the delay from now', async () => {
    Object.defineProperty(document, 'readyState', { configurable: true, get: () => 'complete' });
    scheduleWarmUp();
    await vi.advanceTimersByTimeAsync(WARM_DELAY_MS + 400);
    expect(calls).toHaveLength(2);
    Reflect.deleteProperty(document, 'readyState');
  });

  it('a search index that does not load still lets the content warm up', async () => {
    Object.defineProperty(document, 'readyState', { configurable: true, get: () => 'complete' });
    const quiet = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    preloadSearch.mockImplementationOnce(() => Promise.reject(new Error('broken index')));
    scheduleWarmUp();
    await vi.advanceTimersByTimeAsync(WARM_DELAY_MS + 400);
    expect(ensureContent).toHaveBeenCalledTimes(1);
    expect(quiet).toHaveBeenCalledTimes(1);
    quiet.mockRestore();
    Reflect.deleteProperty(document, 'readyState');
  });
});
