/**
 * Offline copy and updates (BLUEPRINT 3.5 and 5, D1): vite-plugin-pwa in prompt mode, so a new
 * version waits until Lando taps "Update now", and never takes over while a job is running.
 *
 * App version states: current -> updateAvailable -> updating -> (reload) -> updated -> current.
 * "Ready offline" (offline copy states, QA DEF-27): the full copy is saved AND it serves this page
 * (navigator.serviceWorker.controller is set). onOfflineReady fires when the copy is saved, a moment
 * before the first install takes over the open page (clientsClaim, D1 amendment 2026-10-12); until
 * then the marker says "Saving for offline". A controlling worker always has its full copy (it only
 * activates once its precache is done), so a page served at launch is ready at once.
 * The page reload after an update waits for a quiet moment: no running stage, no Job Runner
 * screen, Customer View off. Another tab that applies the update triggers the same deferral here.
 * Two signals mark the reload pending: the plugin's onNeedReload (only for a page a worker served
 * at load), and a controllerchange from one worker to another (QA DEF-30: the first session, where
 * workbox-window reports isUpdate false for good, so onNeedReload never comes). The first claim
 * (no worker before it) only marks the copy ready and never reloads.
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

/**
 * The offline copy, for this page (QA DEF-27). notSaved: no finished copy yet. savedNotServing: the
 * copy is saved but this page is not served by it yet (the first install, until it takes the page;
 * or a page opened with a hard reload, which the saved copy never serves). ready: a worker serves
 * this page. Ready has no way out while the page lives: a page keeps its controller until it
 * unloads, and the next launch starts from the table again.
 */
export type OfflineCopyState = 'notSaved' | 'savedNotServing' | 'ready';
export type OfflineCopyEvent = 'COPY_SAVED' | 'PAGE_CONTROLLED';

export const offlineCopyTransitions = {
  notSaved: { COPY_SAVED: 'savedNotServing', PAGE_CONTROLLED: 'ready' },
  savedNotServing: { PAGE_CONTROLLED: 'ready' },
  ready: {},
} as const satisfies Record<OfflineCopyState, Partial<Record<OfflineCopyEvent, OfflineCopyState>>>;

export function nextOfflineCopyState(state: OfflineCopyState, event: OfflineCopyEvent): OfflineCopyState | null {
  const row: Partial<Record<OfflineCopyEvent, OfflineCopyState>> = offlineCopyTransitions[state];
  return row[event] ?? null;
}

export interface PwaStatus {
  supported: boolean;
  registered: boolean;
  state: AppVersionState;
  /** The offline copy table above. */
  offlineCopy: OfflineCopyState;
  /** "Ready offline": offlineCopy is ready (saved and serving this page). */
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
  offlineCopy: 'notSaved',
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

function applyOfflineCopy(event: OfflineCopyEvent): void {
  const next = nextOfflineCopyState(pwaStatus.get().offlineCopy, event);
  if (next !== null) pwaStatus.update({ offlineCopy: next, offlineReady: next === 'ready' });
}

/** The worker serving this page, or null; a container that cannot be read counts as none. */
function readController(container: ServiceWorkerContainer): ServiceWorker | null {
  try {
    return container.controller ?? null;
  } catch {
    return null;
  }
}

/** PAGE_CONTROLLED once a service worker serves this page (read at boot and on every controllerchange). */
function noteController(container: ServiceWorkerContainer): void {
  // A container that cannot be read leaves the marker where it is, never on a false "Ready offline".
  if (readController(container) !== null) applyOfflineCopy('PAGE_CONTROLLED');
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
let stopWatchingController: (() => void) | null = null;
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
  // Both takeover signals can arrive in the same moment; only the first caller past the guard reloads.
  if (!pwaStatus.get().reloadPending) return false;
  pwaStatus.update({ reloadPending: false });
  reloadPage();
  return true;
}

/** A new worker took this page. Never reload mid-job: the quiet-moment guard decides when. */
function newVersionTookOver(): void {
  pwaStatus.update({ reloadPending: true });
  void reloadIfPending();
}

/** The worker that served this page at the last look (boot, then every controllerchange). */
let knownController: ServiceWorker | null = null;

/**
 * controllerchange. One worker replacing another is a new version taking this page (Update now,
 * here or in another tab): reload at the next quiet moment (DEF-30). A first claim (no worker
 * before) or an event with no new worker only updates the offline copy table.
 */
function onControllerChange(container: ServiceWorkerContainer): void {
  const before = knownController;
  const after = readController(container);
  knownController = after;
  noteController(container);
  if (before !== null && after !== null && after !== before) newVersionTookOver();
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
  const container = navigator.serviceWorker;
  pwaStatus.update({ supported: true });
  knownController = readController(container);
  noteController(container);
  try {
    // The first install takes the open page a moment after onOfflineReady (clientsClaim, DEF-27):
    // that claim only changes the marker. A later change from one worker to another is an update
    // taking the page, and reloads at the next quiet moment (DEF-30), as onNeedReload does below.
    const listener = () => onControllerChange(container);
    container.addEventListener('controllerchange', listener);
    stopWatchingController = () => container.removeEventListener('controllerchange', listener);
  } catch (error) {
    pwaStatus.update({ lastError: describeError(error) });
  }
  try {
    const register = opts.register ?? (await import('./pwaRegister')).registerSW;
    updateServiceWorker = register({
      immediate: true,
      onNeedRefresh: () => {
        apply('NEED_REFRESH');
      },
      onOfflineReady: () => {
        applyOfflineCopy('COPY_SAVED');
        noteController(container);
      },
      onNeedReload: () => {
        // The new worker took control (here or in another tab), on a page a worker served at load.
        newVersionTookOver();
      },
      onRegisteredSW: (url, r) => {
        swScriptUrl = url;
        registration = r ?? null;
        pwaStatus.update({ registered: true });
        // An active worker has its full copy; whether it serves this page is the controller's say.
        if (r?.active != null) applyOfflineCopy('COPY_SAVED');
        noteController(container);
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
  stopWatchingController?.();
  stopWatchingController = null;
  knownController = null;
  initialized = false;
  updateServiceWorker = null;
  registration = null;
  swScriptUrl = null;
  jobRunnerOpen = false;
  reloadPage = () => window.location.reload();
  pwaStatus.set({ supported: true, registered: false, state: 'current', offlineCopy: 'notSaved', offlineReady: false, reloadPending: false, lastCheckAt: null, lastError: null });
}
