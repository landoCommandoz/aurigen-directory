/**
 * Keep the screen on while a stage runs (BLUEPRINT risk 2, D1 browser facts).
 * Works in Safari from iOS 16.4 and inside Home Screen apps from iOS 18.4. The phone releases the
 * lock whenever the app is hidden, so it is asked for again when the app comes back and, if that
 * is refused, on the next tap. Where it is not supported the status carries the manual fallback.
 * No hidden-video hack.
 */
import { describeError } from './errors';
import { createStore, useStore } from './store';

export const WAKE_LOCK_FALLBACK = 'To keep the screen on: Settings, Display & Brightness, Auto-Lock, Never.';

export interface WakeLockStatus {
  supported: boolean;
  active: boolean;
  /** A stage is running, so the lock is wanted. */
  shouldHold: boolean;
  /** Waiting for the next tap to ask again. */
  waitingForTap: boolean;
  lastError: string | null;
  /** Shown when the lock is not available. */
  hint: string | null;
}

interface Sentinel {
  released: boolean;
  release: () => Promise<void>;
  addEventListener: (type: 'release', listener: () => void) => void;
}

interface WakeLockApi {
  request: (type: 'screen') => Promise<Sentinel>;
}

function api(): WakeLockApi | null {
  try {
    const nav = navigator as Navigator & { wakeLock?: WakeLockApi };
    return nav.wakeLock !== undefined && typeof nav.wakeLock.request === 'function' ? nav.wakeLock : null;
  } catch {
    return null;
  }
}

export const wakeLockStatus = createStore<WakeLockStatus>({
  supported: api() !== null,
  active: false,
  shouldHold: false,
  waitingForTap: false,
  lastError: null,
  hint: api() === null ? WAKE_LOCK_FALLBACK : null,
});

export function useWakeLockStatus(): WakeLockStatus {
  return useStore(wakeLockStatus);
}

export function wakeLockSupported(): boolean {
  return api() !== null;
}

let sentinel: Sentinel | null = null;
let tapArmed = false;
let visibilityInstalled = false;

function visible(): boolean {
  return typeof document === 'undefined' || document.visibilityState === 'visible';
}

function armNextTap(): void {
  if (tapArmed || typeof document === 'undefined') return;
  tapArmed = true;
  wakeLockStatus.update({ waitingForTap: true });
  const retry = () => {
    tapArmed = false;
    wakeLockStatus.update({ waitingForTap: false });
    if (wakeLockStatus.get().shouldHold && sentinel === null) void requestWakeLock();
  };
  document.addEventListener('pointerup', retry, { once: true, capture: true });
}

/** Ask for the lock. Call it inside the tap that starts a stage. */
export async function requestWakeLock(): Promise<{ ok: true } | { ok: false; message: string }> {
  const wl = api();
  if (wl === null) {
    wakeLockStatus.update({ supported: false, hint: WAKE_LOCK_FALLBACK });
    return { ok: false, message: WAKE_LOCK_FALLBACK };
  }
  if (sentinel !== null && !sentinel.released) return { ok: true };
  try {
    const lock = await wl.request('screen');
    sentinel = lock;
    lock.addEventListener('release', () => {
      if (sentinel === lock) sentinel = null;
      wakeLockStatus.update({ active: false });
      // Released by the phone while still wanted (hidden, low power): ask again on return or next tap.
      if (wakeLockStatus.get().shouldHold && visible()) armNextTap();
    });
    wakeLockStatus.update({ active: true, lastError: null, hint: null });
    return { ok: true };
  } catch (error) {
    wakeLockStatus.update({ active: false, lastError: describeError(error), hint: WAKE_LOCK_FALLBACK });
    if (wakeLockStatus.get().shouldHold) armNextTap();
    return { ok: false, message: WAKE_LOCK_FALLBACK };
  }
}

export async function releaseWakeLock(): Promise<void> {
  const lock = sentinel;
  sentinel = null;
  wakeLockStatus.update({ active: false });
  try {
    await lock?.release();
  } catch {
    // Already released by the phone.
  }
}

function installVisibility(): void {
  if (visibilityInstalled || typeof document === 'undefined') return;
  visibilityInstalled = true;
  document.addEventListener('visibilitychange', () => {
    if (visible() && wakeLockStatus.get().shouldHold && sentinel === null) void requestWakeLock();
  });
}

/**
 * The Job Runner says whether a stage is running. true: ask now (best inside the tap) and again
 * whenever the app returns. false: release (Pause, Stop, stage done).
 */
export function setShouldHold(hold: boolean): void {
  installVisibility();
  wakeLockStatus.update({ shouldHold: hold });
  if (hold) {
    if (visible() && sentinel === null) void requestWakeLock();
  } else {
    void releaseWakeLock();
  }
}

/** Tests only. */
export function __resetWakeLockForTests(): void {
  sentinel = null;
  tapArmed = false;
  wakeLockStatus.set({ supported: api() !== null, active: false, shouldHold: false, waitingForTap: false, lastError: null, hint: api() === null ? WAKE_LOCK_FALLBACK : null });
}
