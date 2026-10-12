/**
 * Try again's last step (QA DEF-26): reload for a fresh copy only when the app's own address
 * answers, so no signal never lands on the browser's offline page. jsdom: a window exists.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { __setPageReloaderForTests, reloadForFreshCopy } from './freshPage';

afterEach(() => {
  __setPageReloaderForTests(null);
});

describe('reloadForFreshCopy', () => {
  it('no signal: says so at once and never reloads', async () => {
    const reload = vi.fn<() => void>();
    __setPageReloaderForTests({ answers: () => Promise.resolve(false), reload, graceMs: 0 });
    await expect(reloadForFreshCopy()).resolves.toBe(false);
    expect(reload).not.toHaveBeenCalled();
  });

  it('the address answers: reloads once, and resolves true only if the page is still here after the grace period', async () => {
    const reload = vi.fn<() => void>();
    __setPageReloaderForTests({ answers: () => Promise.resolve(true), reload, graceMs: 20 });
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

  it('two taps share one check and one reload', async () => {
    const reload = vi.fn<() => void>();
    const answers = vi.fn<() => Promise<boolean>>(() => Promise.resolve(true));
    __setPageReloaderForTests({ answers, reload, graceMs: 0 });
    await Promise.all([reloadForFreshCopy(), reloadForFreshCopy()]);
    expect(answers).toHaveBeenCalledTimes(1);
    expect(reload).toHaveBeenCalledTimes(1);
    // A later tap is a new check.
    await reloadForFreshCopy();
    expect(answers).toHaveBeenCalledTimes(2);
  });

  it('a check that throws counts as no answer', async () => {
    const reload = vi.fn<() => void>();
    __setPageReloaderForTests({ answers: () => Promise.reject(new Error('blocked')), reload, graceMs: 0 });
    await expect(reloadForFreshCopy()).resolves.toBe(false);
    expect(reload).not.toHaveBeenCalled();
  });
});
