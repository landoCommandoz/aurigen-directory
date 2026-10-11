/**
 * Offline copy and updates (BLUEPRINT 3.5 and 5, D1): vite-plugin-pwa in prompt mode, so a new
 * version waits until Lando taps "Update now", and never takes over while a job is running.
 *
 * App version states: current -> updateAvailable -> updating -> (reload) -> updated -> current.
 * "Ready offline": the service worker has saved the full copy (onOfflineReady on first install,
 * or a controlling worker on any later launch; a worker only activates after its precache is done).
 * The page reload after an update waits for a quiet moment: no running stage, no Job Runner
 * screen, Customer View off. Another tab that applies the update triggers the same deferral here.
 */
import type { RegisterSWOptions } from 'vite-plugin-pwa/types';
import { nowMs } from './clock';
import { readSettingsIn, updateSettings, withDb } from './db';
import { describeError, refuse, type Refusal } from './errors';
import { createStore, useStore } from './store';

export type AppVersionState = 'current' | 'updateAvailable' | 'updating' | 'updated';
export type AppVersionEvent = 'NEED_REFRESH' | 'UPDATE_NOW' | 'BOOTED_NEW_VERSION' | 'WHATS_NEW_DISMISSED';

/** The 3.5 table. Updating leaves by a page reload, which boots as Updated. */
export const appVersionTransitions = {
  current: { NEED_REFRESH: 'updateAvailable', BOOTED_NEW_VERSION: 'updated' },
  updateAvailable: { UPDATE_NOW: 'updating' },
  updating: {},
  updated: { WHATS_NEW_DISMISSED: 'current', NEED_REFRESH: 'updateAvailable' },
} as const satisfies Record<AppVersionState, Partial<Record<AppVersionEvent, AppVersionState>>>;

export function nextAppVersionState(state: AppVersionState, event: AppVersionEvent): AppVersionState | null {
  const row: Partial<Record<AppVersionEvent, AppVersionState>> = appVersionTransitions[state];
  return row[event] ?? null;
}

export interface PwaStatus {
  supported: boolean;
  registered: boolean;
  state: AppVersionState;
  offlineReady: boolean;
  /** The new worker took control; the page reloads at the next quiet moment. */
  reloadPending: boolean;
  lastCheckAt: string | null;
  lastError: string | null;
}

export const pwaStatus = createStore<PwaStatus>({
  supported: typeof navigator !== 'undefined' && 'serviceWorker' in navigator,
  registered: false,
  state: 'current',
  offlineReady: false,
  reloadPending: false,
  lastCheckAt: null,
  lastError: null,
});

export function usePwaStatus(): PwaStatus {
  return useStore(pwaStatus);
}

function apply(event: AppVersionEvent): boolean {
  const next = nextAppVersionState(pwaStatus.get().state, event);
  if (next === null) return false;
  pwaStatus.update({ state: next });
  return true;
}

/* ---------- Quiet moments ---------- */

let jobRunnerOpen = false;

/** The Job Runner screen reports when it is open (Phase 3). Closing it lets a pending reload run. */
export function setJobRunnerOpen(open: boolean): void {
  jobRunnerOpen = open;
  if (!open) void reloadIfPending();
}

async function quietState(): Promise<{ jobRunning: boolean; customerViewOn: boolean }> {
  try {
    return await withDb(async (db) => {
      const running = await db.jobs
        .where('state')
        .equals('inProgress')
        .filter((job) => job.state === 'inProgress' && job.pausedAt === null)
        .count();
      const settings = await db.transaction('rw', db.settings, () => readSettingsIn(db));
      return { jobRunning: running > 0, customerViewOn: settings.customerViewOn };
    });
  } catch {
    // No storage means no jobs and no Customer View flag to protect.
    return { jobRunning: false, customerViewOn: false };
  }
}

export type UpdateCode = 'noUpdate' | 'jobRunning' | 'jobRunnerOpen' | 'customerView' | 'notRegistered';

/** Why an update or reload must wait right now, or null when it may go ahead. */
export async function updateBlocker(): Promise<Refusal<UpdateCode> | null> {
  if (jobRunnerOpen) return refuse('jobRunnerOpen', 'The update waits until you leave the Job Runner.');
  const quiet = await quietState();
  if (quiet.jobRunning) return refuse('jobRunning', 'A stage is running. The update waits until the job is paused or done.');
  if (quiet.customerViewOn) return refuse('customerView', 'The update waits until Customer View is off.');
  return null;
}

/** Whether to show the update banner (3.5): suppressed in the Job Runner, while a stage runs, and in Customer View. */
export function updateBannerVisible(input: { state: AppVersionState; customerViewOn: boolean; jobRunnerOpen: boolean; jobRunning: boolean }): boolean {
  return input.state === 'updateAvailable' && !input.customerViewOn && !input.jobRunnerOpen && !input.jobRunning;
}

/* ---------- Registration ---------- */

type RegisterFn = (options: RegisterSWOptions) => (reloadPage?: boolean) => Promise<void>;

export const UPDATE_CHECK_MS = 60 * 60 * 1000;

let updateServiceWorker: ((reloadPage?: boolean) => Promise<void>) | null = null;
let registration: ServiceWorkerRegistration | null = null;
let swScriptUrl: string | null = null;
let checkTimer: ReturnType<typeof setInterval> | null = null;
let initialized = false;
let reloadPage: () => void = () => window.location.reload();

/** Ask the server for a newer service worker (hourly, on return to the app, or from the panel). */
export async function checkForUpdate(): Promise<void> {
  const r = registration;
  if (r === null || r.installing !== null) return;
  try {
    if (typeof navigator !== 'undefined' && navigator.onLine === false) return;
    if (swScriptUrl !== null) {
      // Skip the check when the worker script cannot be reached (offline in the garage, server down).
      const response = await fetch(swScriptUrl, { cache: 'no-store', headers: { 'cache-control': 'no-cache' } });
      if (response.status !== 200) return;
    }
    await r.update();
    pwaStatus.update({ lastCheckAt: new Date(nowMs()).toISOString(), lastError: null });
  } catch (error) {
    pwaStatus.update({ lastError: describeError(error) });
  }
}

/** Reload into the new version if one took control and the moment is quiet. Call on navigation. */
export async function reloadIfPending(): Promise<boolean> {
  if (!pwaStatus.get().reloadPending) return false;
  if ((await updateBlocker()) !== null) return false;
  pwaStatus.update({ reloadPending: false });
  reloadPage();
  return true;
}

export interface InitPwaOptions {
  /** Tests inject a fake; the app uses virtual:pwa-register. */
  register?: RegisterFn;
  /** Tests inject a fake reload. */
  reload?: () => void;
}

/** Register the service worker once, at boot. Never throws; failures land in pwaStatus.lastError. */
export async function initPwa(opts: InitPwaOptions = {}): Promise<void> {
  if (initialized) return;
  initialized = true;
  if (opts.reload !== undefined) reloadPage = opts.reload;
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
    pwaStatus.update({ supported: false });
    return;
  }
  pwaStatus.update({ supported: true, offlineReady: navigator.serviceWorker.controller !== null });
  try {
    const register = opts.register ?? (await import('./pwaRegister')).registerSW;
    updateServiceWorker = register({
      immediate: true,
      onNeedRefresh: () => {
        apply('NEED_REFRESH');
      },
      onOfflineReady: () => pwaStatus.update({ offlineReady: true }),
      onNeedReload: () => {
        // The new worker took control (here or in another tab). Never reload mid-job.
        pwaStatus.update({ reloadPending: true });
        void reloadIfPending();
      },
      onRegisteredSW: (url, r) => {
        swScriptUrl = url;
        registration = r ?? null;
        pwaStatus.update({ registered: true, offlineReady: pwaStatus.get().offlineReady || r?.active != null });
        if (r !== undefined && checkTimer === null) {
          checkTimer = setInterval(() => void checkForUpdate(), UPDATE_CHECK_MS);
          if (typeof document !== 'undefined') {
            document.addEventListener('visibilitychange', () => {
              const last = pwaStatus.get().lastCheckAt;
              const stale = last === null || nowMs() - Date.parse(last) >= UPDATE_CHECK_MS;
              if (document.visibilityState === 'visible' && stale) void checkForUpdate();
            });
          }
        }
      },
      onRegisterError: (error: unknown) => pwaStatus.update({ lastError: describeError(error) }),
    });
  } catch (error) {
    pwaStatus.update({ lastError: describeError(error) });
  }
}

/**
 * "Update now" (3.5). Refused while a stage runs, in the Job Runner, or in Customer View. Otherwise
 * tells the waiting worker to take over; the page reloads at the next quiet moment.
 */
export async function applyUpdateWhenIdle(): Promise<{ ok: true } | Refusal<UpdateCode>> {
  if (pwaStatus.get().state !== 'updateAvailable') return refuse('noUpdate', 'No new version is waiting.');
  if (updateServiceWorker === null) return refuse('notRegistered', 'The offline helper is not running, so there is nothing to update.');
  const blocker = await updateBlocker();
  if (blocker !== null) return blocker;
  apply('UPDATE_NOW');
  try {
    await updateServiceWorker(true);
  } catch (error) {
    pwaStatus.update({ lastError: describeError(error) });
  }
  return { ok: true };
}

/**
 * At boot: compare this build's version with the one last seen on the phone. A first install
 * records it silently; a different version means the update landed, so "What changed" shows once.
 */
export async function checkUpdatedOnBoot(version: string): Promise<AppVersionState> {
  try {
    const seen = await withDb(async (db) => (await db.transaction('rw', db.settings, () => readSettingsIn(db))).appVersionSeen);
    if (seen === null) await updateSettings({ appVersionSeen: version });
    else if (seen !== version) apply('BOOTED_NEW_VERSION');
  } catch (error) {
    pwaStatus.update({ lastError: describeError(error) });
  }
  return pwaStatus.get().state;
}

/** "What changed" was read: record this version as seen. */
export async function dismissWhatsNew(version: string): Promise<void> {
  try {
    await updateSettings({ appVersionSeen: version });
  } catch (error) {
    pwaStatus.update({ lastError: describeError(error) });
  }
  apply('WHATS_NEW_DISMISSED');
}

/** Tests only. */
export function __resetPwaForTests(): void {
  if (checkTimer !== null) clearInterval(checkTimer);
  checkTimer = null;
  initialized = false;
  updateServiceWorker = null;
  registration = null;
  swScriptUrl = null;
  jobRunnerOpen = false;
  reloadPage = () => window.location.reload();
  pwaStatus.set({ supported: true, registered: false, state: 'current', offlineReady: false, reloadPending: false, lastCheckAt: null, lastError: null });
}
