/**
 * The storage probe for the developer panel (D3, BLUEPRINT risk 1): quota, usage, whether the
 * phone marked the app's storage as kept, and a once-per-launch persist() request.
 *
 * Safari note (D3): persist() cannot be trusted. Since WebKit's May 2023 change it answers yes
 * only for an installed Home Screen app and no, by design, in a Safari tab; it never shows a
 * prompt. So the answer is shown, logged, and never used to gate a feature. "No" inside the
 * installed app is the anomaly worth reporting (Phase 1 device checklist item 2).
 */
import { nowIso } from './clock';
import { describeError } from './errors';
import { createStore, useStore } from './store';

export interface StorageProbe {
  supported: boolean;
  quotaMB: number | null;
  usageMB: number | null;
  /** navigator.storage.persisted(): the phone says the storage is kept. */
  persisted: boolean | null;
  /** persist() was asked this launch. */
  persistRequested: boolean;
  /** What persist() answered this launch. */
  persistResult: boolean | null;
  error: string | null;
  checkedAt: string | null;
}

export const storageProbe = createStore<StorageProbe>({
  supported: false,
  quotaMB: null,
  usageMB: null,
  persisted: null,
  persistRequested: false,
  persistResult: null,
  error: null,
  checkedAt: null,
});

export function useStorageProbe(): StorageProbe {
  return useStore(storageProbe);
}

function manager(): StorageManager | null {
  try {
    return typeof navigator !== 'undefined' && navigator.storage !== undefined ? navigator.storage : null;
  } catch {
    return null;
  }
}

const toMB = (bytes: number | undefined): number | null =>
  typeof bytes === 'number' && Number.isFinite(bytes) ? Math.round((bytes / (1024 * 1024)) * 10) / 10 : null;

/** Read estimate() and persisted(). Never throws; failures land in `error`. */
export async function probeStorage(): Promise<StorageProbe> {
  const m = manager();
  if (m === null) {
    storageProbe.update({ supported: false, error: 'This browser has no storage manager.', checkedAt: nowIso() });
    return storageProbe.get();
  }
  const patch: Partial<StorageProbe> = { supported: true, error: null, checkedAt: nowIso() };
  const errors: string[] = [];
  try {
    if (typeof m.estimate === 'function') {
      const estimate = await m.estimate();
      patch.quotaMB = toMB(estimate.quota);
      patch.usageMB = toMB(estimate.usage);
    }
  } catch (error) {
    errors.push(`estimate: ${describeError(error)}`);
  }
  try {
    if (typeof m.persisted === 'function') patch.persisted = await m.persisted();
  } catch (error) {
    errors.push(`persisted: ${describeError(error)}`);
  }
  if (errors.length > 0) patch.error = errors.join('; ');
  storageProbe.update(patch);
  return storageProbe.get();
}

let persistAsked: Promise<boolean | null> | null = null;

/** Ask the phone to keep the app's storage, once per launch. Best called inside a tap. */
export function requestPersistOnce(): Promise<boolean | null> {
  persistAsked ??= (async () => {
    const m = manager();
    storageProbe.update({ persistRequested: true });
    if (m === null || typeof m.persist !== 'function') return null;
    try {
      const result = await m.persist();
      storageProbe.update({ persistResult: result, persisted: result || storageProbe.get().persisted });
      return result;
    } catch (error) {
      storageProbe.update({ error: `persist: ${describeError(error)}` });
      return null;
    }
  })();
  return persistAsked;
}

/** At boot: probe now, and ask persist() inside the first tap of this launch. */
export function initStorageProbe(): void {
  void probeStorage();
  if (typeof document === 'undefined') return;
  document.addEventListener(
    'pointerup',
    () => {
      void requestPersistOnce().then(() => probeStorage());
    },
    { once: true, capture: true },
  );
}

/** Tests only. */
export function __resetStorageProbeForTests(): void {
  persistAsked = null;
  storageProbe.set({ supported: false, quotaMB: null, usageMB: null, persisted: null, persistRequested: false, persistResult: null, error: null, checkedAt: null });
}
