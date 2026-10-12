/**
 * Try again's last step (QA DEF-26, DEF-27): reload only when the reload has somewhere to land, the
 * saved copy (an active service worker) or the app's own address, so no signal never lands on the
 * browser's offline page. jsdom: a window exists.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { __setPageReloaderForTests, reloadForFreshCopy, savedCopyInstalled } from './freshPage';

const no = () => Promise.resolve(false);
const yes = () => Promise.resolve(true);

afterEach(() => {
  __setPageReloaderForTests(null);
  Reflect.deleteProperty(navigator, 'serviceWorker');
  vi.useRealTimers();
});

describe('reloadForFreshCopy', () => {
  it('no signal and nothing saved: says so at once and never reloads', async () => {
    const reload = vi.fn<() => void>();
    __setPageReloaderForTests({ savedCopy: no, answers: no, reload, graceMs: 0 });
    await expect(reloadForFreshCopy()).resolves.toBe(false);
    expect(reload).not.toHaveBeenCalled();
  });

  it('the address answers: reloads once, and resolves true only if the page is still here after the grace period', async () => {
    const reload = vi.fn<() => void>();
    __setPageReloaderForTests({ savedCopy: no, answers: yes, reload, graceMs: 20 });
    let settled = false;
    const result = reloadForFreshCopy().then((value) => {
      settled = true;
      return value;
    });
    await new Promise((resolve) => setTimeout(resolve, 5));
    expect(reload).toHaveBeenCalledTimes(1);
    expect(settled).toBe(false);
    await expect(result).resolves.toBe(true);
  });

  it('DEF-27: no signal, but the saved copy is installed: reloads into it without asking the network', async () => {
    const reload = vi.fn<() => void>();
    const answers = vi.fn<() => Promise<boolean>>(no);
    __setPageReloaderForTests({ savedCopy: yes, answers, reload, graceMs: 0 });
    await expect(reloadForFreshCopy()).resolves.toBe(true);
    expect(reload).toHaveBeenCalledTimes(1);
    expect(answers).not.toHaveBeenCalled();
  });

  it('a saved-copy check that throws counts as none, and the address is still asked', async () => {
    const reload = vi.fn<() => void>();
    const answers = vi.fn<() => Promise<boolean>>(yes);
    __setPageReloaderForTests({ savedCopy: () => Promise.reject(new Error('blocked')), answers, reload, graceMs: 0 });
    await expect(reloadForFreshCopy()).resolves.toBe(true);
    expect(answers).toHaveBeenCalledTimes(1);
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('two taps share one check and one reload', async () => {
    const reload = vi.fn<() => void>();
    const savedCopy = vi.fn<() => Promise<boolean>>(yes);
    __setPageReloaderForTests({ savedCopy, answers: yes, reload, graceMs: 0 });
    await Promise.all([reloadForFreshCopy(), reloadForFreshCopy()]);
    expect(savedCopy).toHaveBeenCalledTimes(1);
    expect(reload).toHaveBeenCalledTimes(1);
    // A later tap is a new check.
    await reloadForFreshCopy();
    expect(savedCopy).toHaveBeenCalledTimes(2);
  });

  it('checks that throw count as no answer', async () => {
    const reload = vi.fn<() => void>();
    const blocked = () => Promise.reject(new Error('blocked'));
    __setPageReloaderForTests({ savedCopy: blocked, answers: blocked, reload, graceMs: 0 });
    await expect(reloadForFreshCopy()).resolves.toBe(false);
    expect(reload).not.toHaveBeenCalled();
  });
});

describe('savedCopyInstalled (the browser check)', () => {
  const withContainer = (getRegistration: () => Promise<unknown>) =>
    Object.defineProperty(navigator, 'serviceWorker', { configurable: true, value: { getRegistration } });

  it('true only for a registration with an active worker', async () => {
    withContainer(() => Promise.resolve({ active: {}, waiting: null, installing: null }));
    await expect(savedCopyInstalled()).resolves.toBe(true);
    // Still installing on the first visit: nothing saved to reload into yet.
    withContainer(() => Promise.resolve({ active: null, waiting: null, installing: {} }));
    await expect(savedCopyInstalled()).resolves.toBe(false);
    withContainer(() => Promise.resolve(undefined));
    await expect(savedCopyInstalled()).resolves.toBe(false);
  });

  it('false with no service worker support, a lookup that throws, or one that never answers', async () => {
    await expect(savedCopyInstalled()).resolves.toBe(false);
    withContainer(() => Promise.reject(new Error('SecurityError')));
    await expect(savedCopyInstalled()).resolves.toBe(false);
    vi.useFakeTimers();
    withContainer(() => new Promise<never>(() => undefined));
    const pending = savedCopyInstalled();
    await vi.advanceTimersByTimeAsync(2000);
    await expect(pending).resolves.toBe(false);
  });
});
