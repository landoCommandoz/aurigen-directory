/**
 * The offline indicator's words (BLUEPRINT 3.6 and 5). Pure, tested.
 * "Ready offline" appears once the full copy of the app is saved on the phone and serves this
 * page; "Offline" comes from the phone's own connection state. Shop Mode behaves the same either
 * way; only the words change.
 *
 * The three offline copy states (src/core/pwa.ts, QA DEF-27) each get their own words (QA DEF-29):
 * notSaved reads "Saving for offline" while the helper runs; savedNotServing (the copy is saved,
 * but this page opened without it: a hard reload, or a first launch not taken over) says the copy
 * is saved and how to use it, never that it is still saving or missing.
 */
import { connectivityLabel, type ConnectivityState } from '../core/connectivity';
import type { OfflineCopyState } from '../core/pwa';

export type StatusTone = 'ready' | 'neutral' | 'warning';

export interface StatusWords {
  label: string;
  tone: StatusTone;
}

/**
 * Online, saved but not serving this page: a reopen (or a normal reload) is served by the copy.
 * The marker sits beside Home and Settings: a label longer than about 18 characters wraps the top
 * bar at 375 px in Shop density, so the words stay short.
 */
export const SAVED_NOT_SERVING_LABEL = 'Saved, reopen app';
/** Offline, saved but not serving this page: Try again reloads into the copy (src/core/freshPage.ts). */
export const OFFLINE_SAVED_LABEL = 'Offline, saved';

export function statusWords(input: { connectivity: ConnectivityState; offlineCopy: OfflineCopyState; registered: boolean; supported: boolean }): StatusWords {
  const ready = input.offlineCopy === 'ready';
  if (input.connectivity === 'offline') {
    if (input.offlineCopy === 'savedNotServing') return { label: OFFLINE_SAVED_LABEL, tone: 'neutral' };
    return { label: connectivityLabel('offline', ready), tone: ready ? 'ready' : 'warning' };
  }
  if (ready) return { label: 'Ready offline', tone: 'ready' };
  if (input.offlineCopy === 'savedNotServing') return { label: SAVED_NOT_SERVING_LABEL, tone: 'neutral' };
  if (input.supported && input.registered) return { label: 'Saving for offline', tone: 'neutral' };
  return { label: 'Online', tone: 'neutral' };
}
