import 'fake-indexeddb/auto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { RegisterSWOptions } from 'vite-plugin-pwa/types';
import { makeJob } from './__tests__/fixtures';
import { connectivityLabel, nextConnectivityState } from './connectivity';
import { __resetDbForTests, getSettings, withDb } from './db';
import { startFresh } from './deviceRole';
import { __setPageReloaderForTests, reloadForFreshCopy } from './freshPage';
import { __resetPinStateForTests } from './pin';
import {
  UPDATE_CHECK_MS,
  __resetPwaForTests,
  applyUpdateWhenIdle,
  checkForUpdate,
  checkUpdatedOnBoot,
  dismissWhatsNew,
  initPwa,
  nextAppVersionState,
  nextOfflineCopyState,
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

/** navigator.serviceWorker as the app reads it: the controller and its controllerchange event. */
class FakeContainer extends EventTarget {
  controller: object | null = null;
}
let container = new FakeContainer();

/** The worker takes this page (clientsClaim on the first install, or Update now). */
function takeControl(): void {
  container.controller = {};
  container.dispatchEvent(new Event('controllerchange'));
}

beforeEach(async () => {
  __resetPwaForTests();
  __resetPinStateForTests();
  await __resetDbForTests();
  captured = {};
  updateSW.mockClear();
  reload.mockClear();
  container = new FakeContainer();
  Object.defineProperty(navigator, 'serviceWorker', { configurable: true, value: container });
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  __setPageReloaderForTests(null);
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
  it('reports Ready offline once the saved copy serves the page, then Update available, and applies only on "Update now"', async () => {
    await initPwa({ register: fakeRegister, reload });
    expect(pwaStatus.get().offlineReady).toBe(false);
    captured.onOfflineReady?.();
    expect(pwaStatus.get()).toMatchObject({ offlineCopy: 'savedNotServing', offlineReady: false });
    takeControl();
    expect(pwaStatus.get()).toMatchObject({ offlineCopy: 'ready', offlineReady: true });
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

describe('the first install and the offline copy (QA DEF-27, D1 amendment 2026-10-12)', () => {
  const registration = (active: object | null) => ({ installing: active === null ? {} : null, active, update: vi.fn<() => Promise<void>>(async () => undefined) }) as unknown as ServiceWorkerRegistration;

  it('the offline copy table: only a page the saved copy serves is ready', () => {
    expect(nextOfflineCopyState('notSaved', 'COPY_SAVED')).toBe('savedNotServing');
    expect(nextOfflineCopyState('savedNotServing', 'PAGE_CONTROLLED')).toBe('ready');
    // A controlling worker only activated once its full copy was saved.
    expect(nextOfflineCopyState('notSaved', 'PAGE_CONTROLLED')).toBe('ready');
    expect(nextOfflineCopyState('savedNotServing', 'COPY_SAVED')).toBeNull();
    expect(nextOfflineCopyState('ready', 'COPY_SAVED')).toBeNull();
    expect(nextOfflineCopyState('ready', 'PAGE_CONTROLLED')).toBeNull();
  });

  it('first visit: saving, saved, then the takeover; Ready offline only after it, and nothing reloads or installs', async () => {
    await initPwa({ register: fakeRegister, reload });
    captured.onRegisteredSW?.('/sw.js', registration(null));
    expect(pwaStatus.get()).toMatchObject({ registered: true, offlineCopy: 'notSaved', offlineReady: false });
    captured.onOfflineReady?.();
    expect(pwaStatus.get()).toMatchObject({ offlineCopy: 'savedNotServing', offlineReady: false });
    takeControl();
    expect(pwaStatus.get()).toMatchObject({ offlineCopy: 'ready', offlineReady: true, state: 'current', reloadPending: false });
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(reload).not.toHaveBeenCalled();
    expect(updateSW).not.toHaveBeenCalled();
  });

  it('a page served at launch is Ready offline at once', async () => {
    container.controller = {};
    await initPwa({ register: fakeRegister, reload });
    expect(pwaStatus.get()).toMatchObject({ offlineCopy: 'ready', offlineReady: true });
  });

  it('a page the saved copy does not serve (opened with a hard reload) is saved but never says Ready offline', async () => {
    await initPwa({ register: fakeRegister, reload });
    captured.onRegisteredSW?.('/sw.js', registration({}));
    captured.onOfflineReady?.();
    container.dispatchEvent(new Event('controllerchange'));
    expect(pwaStatus.get()).toMatchObject({ offlineCopy: 'savedNotServing', offlineReady: false });
  });

  it('a waiting update is installed only by "Update now": no takeover event, update check, quiet moment, or Try again reload sends it', async () => {
    vi.stubGlobal('fetch', vi.fn<() => Promise<{ status: number }>>(async () => ({ status: 200 })));
    await initPwa({ register: fakeRegister, reload });
    captured.onRegisteredSW?.('/sw.js', registration({}));
    captured.onOfflineReady?.();
    takeControl();
    captured.onNeedRefresh?.();
    expect(pwaStatus.get().state).toBe('updateAvailable');

    container.dispatchEvent(new Event('controllerchange'));
    await checkForUpdate();
    expect(await reloadIfPending()).toBe(false);
    setJobRunnerOpen(true);
    setJobRunnerOpen(false);
    const pageReload = vi.fn<() => void>();
    __setPageReloaderForTests({ savedCopy: () => Promise.resolve(true), answers: () => Promise.resolve(false), reload: pageReload, graceMs: 0 });
    expect(await reloadForFreshCopy()).toBe(true);
    expect(pageReload).toHaveBeenCalledTimes(1);
    expect(updateSW).not.toHaveBeenCalled();
    expect(reload).not.toHaveBeenCalled();
    expect(pwaStatus.get()).toMatchObject({ state: 'updateAvailable', reloadPending: false, offlineReady: true });

    expect(await applyUpdateWhenIdle()).toEqual({ ok: true });
    expect(updateSW).toHaveBeenCalledTimes(1);
    expect(pwaStatus.get().state).toBe('updating');
  });
});

describe('an update in the first session (QA DEF-30): one worker replacing another reloads at the next quiet moment', () => {
  const settle = () => new Promise((resolve) => setTimeout(resolve, 30));

  it('the first claim never reloads; after Update now, the new worker taking the page reloads once with no onNeedReload', async () => {
    await initPwa({ register: fakeRegister, reload });
    captured.onOfflineReady?.();
    takeControl();
    await settle();
    expect(reload).not.toHaveBeenCalled();
    expect(pwaStatus.get()).toMatchObject({ offlineCopy: 'ready', reloadPending: false });

    captured.onNeedRefresh?.();
    expect(await applyUpdateWhenIdle()).toEqual({ ok: true });
    expect(pwaStatus.get().state).toBe('updating');
    // workbox-window says isUpdate false for this whole session, so the plugin never calls onNeedReload.
    takeControl();
    await vi.waitFor(() => expect(reload).toHaveBeenCalledTimes(1));
    expect(pwaStatus.get()).toMatchObject({ reloadPending: false, offlineCopy: 'ready' });
  });

  it('another tab applies the update while a stage runs here: nothing reloads until the job pauses', async () => {
    await startFresh({ warningAccepted: true, newPin: '482915' });
    const running = makeJob('inProgress');
    await withDb((db) => db.jobs.add(running));
    await initPwa({ register: fakeRegister, reload });
    takeControl();
    takeControl();
    await settle();
    expect(reload).not.toHaveBeenCalled();
    expect(pwaStatus.get().reloadPending).toBe(true);
    setJobRunnerOpen(false);
    await settle();
    expect(reload).not.toHaveBeenCalled();
    await withDb((db) => db.jobs.put({ ...running, pausedAt: '2026-10-10T12:30:00.000Z' } as typeof running));
    expect(await reloadIfPending()).toBe(true);
    expect(reload).toHaveBeenCalledTimes(1);
    expect(await reloadIfPending()).toBe(false);
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('a later launch gets both signals in the same moment and reloads exactly once', async () => {
    container.controller = {};
    await initPwa({ register: fakeRegister, reload });
    captured.onNeedRefresh?.();
    expect(await applyUpdateWhenIdle()).toEqual({ ok: true });
    takeControl();
    captured.onNeedReload?.();
    await settle();
    expect(reload).toHaveBeenCalledTimes(1);
    expect(pwaStatus.get().reloadPending).toBe(false);
  });

  it('a controllerchange that leaves the same worker in charge, or no worker, never reloads', async () => {
    container.controller = {};
    await initPwa({ register: fakeRegister, reload });
    container.dispatchEvent(new Event('controllerchange'));
    await settle();
    expect(pwaStatus.get().reloadPending).toBe(false);
    __resetPwaForTests();
    container = new FakeContainer();
    Object.defineProperty(navigator, 'serviceWorker', { configurable: true, value: container });
    await initPwa({ register: fakeRegister, reload });
    container.dispatchEvent(new Event('controllerchange'));
    await settle();
    expect(reload).not.toHaveBeenCalled();
    expect(pwaStatus.get()).toMatchObject({ reloadPending: false, offlineCopy: 'notSaved' });
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
