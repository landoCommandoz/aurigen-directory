/**
 * Notices closed for this launch only (D12: the setup banner "can be closed for the session and
 * returns on the next launch"; 3.5: "Later" on the update banner). Kept in memory on purpose: a
 * reload of the Home Screen app is a new launch, so they come back.
 */
import { createStore, useStore } from '../../core/store';

export interface SessionNotices {
  setupClosed: boolean;
  backupLater: boolean;
  updateLater: boolean;
}

export const sessionNotices = createStore<SessionNotices>({ setupClosed: false, backupLater: false, updateLater: false });

export function useSessionNotices(): SessionNotices {
  return useStore(sessionNotices);
}

export function closeNotice(key: keyof SessionNotices): void {
  sessionNotices.update({ [key]: true });
}
