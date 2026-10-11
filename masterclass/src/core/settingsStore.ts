/**
 * Live settings for screens: one Dexie liveQuery on the settings row, shared by every reader.
 * Status starts at "loading" so anything that must fail closed (the <Internal> wrapper in
 * Customer View) can render nothing until the persisted flag is known. When storage is
 * unavailable the snapshot carries the defaults with status "unavailable" and the error,
 * instead of throwing during render.
 *
 * Every row from the live query goes through the same lenient read as the rest of the app
 * (settingsRead.ts, DEF-08). A row this version cannot use gives status "unavailable" with the
 * plain RecordInvalid message and, where possible, the salvaged values (so the role, the PIN, and
 * the Customer View flag stay what the phone saved); the live query keeps running, so a Restore
 * that replaces the row brings the snapshot back to "ready" without a reload.
 */
import { liveQuery, type Subscription } from 'dexie';
import { useSyncExternalStore } from 'react';
import { SETTINGS_ID, defaultSettings, type SettingsValue } from '../schemas';
import { nowIso } from './clock';
import { getSettings, getDb, parseSettingsRow } from './db';
import { RecordInvalid, StorageUnavailable, toStorageError } from './errors';
import { salvageStoredSettings } from './settingsRead';

export type SettingsSnapshot =
  | { status: 'loading'; settings: null; error: null }
  | { status: 'ready'; settings: SettingsValue; error: null }
  | { status: 'unavailable'; settings: SettingsValue; error: StorageUnavailable | RecordInvalid };

const LOADING: SettingsSnapshot = { status: 'loading', settings: null, error: null };

let snapshot: SettingsSnapshot = LOADING;
const listeners = new Set<() => void>();
let subscription: Subscription | null = null;
let starting = false;

function emit(next: SettingsSnapshot): void {
  snapshot = next;
  for (const listener of Array.from(listeners)) listener();
}

function fail(error: unknown): void {
  const mapped = toStorageError(error);
  const known = mapped instanceof StorageUnavailable || mapped instanceof RecordInvalid ? mapped : new StorageUnavailable('unknown', { cause: error });
  emit({ status: 'unavailable', settings: snapshot.settings ?? defaultSettings(nowIso()), error: known });
}

/** The snapshot for one stored row: ready, or unavailable with what could be salvaged (pure apart from the clock). */
export function snapshotForRow(row: unknown, previous: SettingsValue | null): SettingsSnapshot {
  try {
    return { status: 'ready', settings: parseSettingsRow(row), error: null };
  } catch (error) {
    if (!(error instanceof RecordInvalid)) throw error;
    let settings: SettingsValue;
    try {
      settings = salvageStoredSettings(row, nowIso()).settings;
    } catch {
      settings = previous ?? defaultSettings(nowIso());
    }
    return { status: 'unavailable', settings, error };
  }
}

function emitRow(row: unknown): void {
  try {
    emit(snapshotForRow(row, snapshot.settings));
  } catch (error) {
    fail(error);
  }
}

async function start(): Promise<void> {
  if (subscription !== null || starting) return;
  starting = true;
  try {
    try {
      // Creates the default row on first run, and surfaces an open failure as a status.
      const first = await getSettings();
      emit({ status: 'ready', settings: first, error: null });
    } catch (error) {
      // A row this version cannot use: say nothing yet; the live query's first answer carries
      // the salvaged values, so no frame shows defaults in place of what the phone saved.
      if (!(toStorageError(error) instanceof RecordInvalid)) throw error;
    }
    const db = getDb();
    subscription = liveQuery(() => db.settings.get(SETTINGS_ID)).subscribe({
      next: (row) => {
        if (row !== undefined) emitRow(row);
      },
      error: fail,
    });
  } catch (error) {
    fail(error);
  } finally {
    starting = false;
  }
}

export function subscribeSettings(listener: () => void): () => void {
  listeners.add(listener);
  void start();
  return () => {
    listeners.delete(listener);
  };
}

export function getSettingsSnapshot(): SettingsSnapshot {
  return snapshot;
}

/** React hook: the live settings snapshot. */
export function useSettings(): SettingsSnapshot {
  return useSyncExternalStore(subscribeSettings, getSettingsSnapshot, getSettingsSnapshot);
}

/** Wait until the snapshot is ready or unavailable (boot and tests). */
export function settingsSettled(): Promise<SettingsSnapshot> {
  if (snapshot.status !== 'loading') return Promise.resolve(snapshot);
  return new Promise((resolve) => {
    const off = subscribeSettings(() => {
      if (snapshot.status !== 'loading') {
        off();
        resolve(snapshot);
      }
    });
  });
}

/** Tests only: drop the live query and return to "loading". */
export function __resetSettingsStoreForTests(): void {
  subscription?.unsubscribe();
  subscription = null;
  starting = false;
  snapshot = LOADING;
  listeners.clear();
}
