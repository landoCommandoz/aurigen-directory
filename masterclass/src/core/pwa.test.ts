import 'fake-indexeddb/auto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { RegisterSWOptions } from 'vite-plugin-pwa/types';
import { makeJob } from './__tests__/fixtures';
import { connectivityLabel, nextConnectivityState } from './connectivity';
import { __resetDbForTests, getSettings, withDb } from './db';
import { startFresh } from './deviceRole';
import { __resetPinStateForTests } from './pin';
import {
  UPDATE_CHECK_MS,
  __resetPwaForTests,
  applyUpdateWhenIdle,
  checkUpdatedOnBoot,
  dismissWhatsNew,
  initPwa,
  nextAppVersionState,
  pwaStatus,
  reloadIfPending,
  setJobRunnerOpen,
  updateBannerVisible,
} from './pwa';

let captured: RegisterSWOptions = {};
const updateSW = vi.fn<(reloadPage?: boolean) => Promise<void>>(async () => undefined);
const reload = vi.fn<() => void>();
const fakeRegister = (options: RegisterSWOptions) => {
  captured = options;
  return updateSW;
};

beforeEach(async () => {
  __resetPwaForTests();
  __resetPinStateForTests();
  await __resetDbForTests();
  captured = {};
  updateSW.mockClear();
  reload.mockClear();
  Object.defineProperty(navigator, 'serviceWorker', { configurable: true, value: { controller: null } });
});

afterEach(() => {
  vi.useRealTimers();
});

describe('App version state table (BLUEPRINT 3.5)', () => {
  it('moves only along the table; anything else is refused', () => {
    expect(nextAppVersionState('current', 'NEED_REFRESH')).toBe('updateAvailable');
    expect(nextAppVersionState('updateAvailable', 'UPDATE_NOW')).toBe('updating');
    expect(nextAppVersionState('current', 'BOOTED_NEW_VERSION')).toBe('updated');
    expect(nextAppVersionState('updated', 'WHATS_NEW_DISMISSED')).toBe('current');
    expect(nextAppVersionState('current', 'UPDATE_NOW')).toBeNull();
    expect(nextAppVersionState('updating', 'NEED_REFRESH')).toBeNull();
    expect(nextAppVersionState('updating', 'UPDATE_NOW')).toBeNull();
  });

  it('the banner is suppressed in the Job Runner, while a stage runs, and in Customer View', () => {
    const base = { state: 'updateAvailable' as const, customerViewOn: false, jobRunnerOpen: false, jobRunning: false };
    expect(updateBannerVisible(base)).toBe(true);
    expect(updateBannerVisible({ ...base, customerViewOn: true })).toBe(false);
    expect(updateBannerVisible({ ...base, jobRunnerOpen: true })).toBe(false);
    expect(updateBannerVisible({ ...base, jobRunning: true })).toBe(false);
    expect(updateBannerVisible({ ...base, state: 'current' })).toBe(false);
  });
});

describe('prompt-mode registration', () => {
  it('reports Ready offline, then Update available, and applies only on "Update now"', async () => {
    await initPwa({ register: fakeRegister, reload });
    expect(pwaStatus.get().offlineReady).toBe(false);
    captured.onOfflineReady?.();
    expect(pwaStatus.get().offlineReady).toBe(true);
    captured.onNeedRefresh?.();
    expect(pwaStatus.get().state).toBe('updateAvailable');
    expect(updateSW).not.toHaveBeenCalled();
    expect(await applyUpdateWhenIdle()).toEqual({ ok: true });
    expect(pwaStatus.get().state).toBe('updating');
    expect(updateSW).toHaveBeenCalledTimes(1);
    captured.onNeedReload?.();
    await vi.waitFor(() => expect(reload).toHaveBeenCalledTimes(1));
  });

  it('refuses "Update now" while a stage is running, and defers a takeover reload until the job pauses', async () => {
    await startFresh({ warningAccepted: true, newPin: '482915' });
    const running = makeJob('inProgress');
    await withDb((db) => db.jobs.add(running));
    await initPwa({ register: fakeRegister, reload });
    captured.onNeedRefresh?.();
    expect(await applyUpdateWhenIdle()).toMatchObject({ ok: false, code: 'jobRunning' });
    expect(updateSW).not.toHaveBeenCalled();
    // Another tab applied the update: the new worker took control here too.
    captured.onNeedReload?.();
    await new Promise((r) => setTimeout(r, 20));
    expect(reload).not.toHaveBeenCalled();
    expect(pwaStatus.get().reloadPending).toBe(true);
    await withDb((db) => db.jobs.put({ ...running, pausedAt: '2026-10-10T12:30:00.000Z' } as typeof running));
    expect(await reloadIfPending()).toBe(true);
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('refuses while the Job Runner is open and in Customer View', async () => {
    await initPwa({ register: fakeRegister, reload });
    captured.onNeedRefresh?.();
    setJobRunnerOpen(true);
    expect(await applyUpdateWhenIdle()).toMatchObject({ ok: false, code: 'jobRunnerOpen' });
    setJobRunnerOpen(false);
    await startFresh({ warningAccepted: true, newPin: '482915' });
    await withDb(async (db) => {
      const s = await db.settings.get('device');
      if (s) await db.settings.put({ ...s, customerViewOn: true });
    });
    expect(await applyUpdateWhenIdle()).toMatchObject({ ok: false, code: 'customerView' });
  });

  it('checks for an update every hour once registered', async () => {
    vi.useFakeTimers();
    const update = vi.fn<() => Promise<void>>(async () => undefined);
    vi.stubGlobal('fetch', vi.fn<() => Promise<{ status: number }>>(async () => ({ status: 200 })));
    await initPwa({ register: fakeRegister, reload });
    captured.onRegisteredSW?.('/sw.js', { installing: null, active: {}, update } as unknown as ServiceWorkerRegistration);
    expect(pwaStatus.get().registered).toBe(true);
    await vi.advanceTimersByTimeAsync(UPDATE_CHECK_MS);
    expect(update).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(UPDATE_CHECK_MS);
    expect(update).toHaveBeenCalledTimes(2);
    vi.unstubAllGlobals();
  });
});

describe('Updated and "What changed"', () => {
  it('a first install records the version silently; a new version shows What changed once', async () => {
    expect(await checkUpdatedOnBoot('0.1.0')).toBe('current');
    expect((await getSettings()).appVersionSeen).toBe('0.1.0');
    __resetPwaForTests();
    expect(await checkUpdatedOnBoot('0.2.0')).toBe('updated');
    await dismissWhatsNew('0.2.0');
    expect(pwaStatus.get().state).toBe('current');
    __resetPwaForTests();
    expect(await checkUpdatedOnBoot('0.2.0')).toBe('current');
  });
});

describe('connectivity (BLUEPRINT 3.6)', () => {
  it('two states, and the indicator words', () => {
    expect(nextConnectivityState('online', 'WENT_OFFLINE')).toBe('offline');
    expect(nextConnectivityState('offline', 'WENT_ONLINE')).toBe('online');
    expect(nextConnectivityState('online', 'WENT_ONLINE')).toBeNull();
    expect(connectivityLabel('online', false)).toBe('Online');
    expect(connectivityLabel('offline', true)).toBe('Offline, ready');
    expect(connectivityLabel('offline', false)).toBe('Offline');
  });
});
