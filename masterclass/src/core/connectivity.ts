/**
 * Connectivity (BLUEPRINT 3.6): Online or Offline, from the phone's own reports. In v1 it changes
 * only the small indicator; Shop Mode, Fix It, Search, Quick Cards, and Academy make no network
 * requests either way.
 */
import { createStore, useStore } from './store';

export type ConnectivityState = 'online' | 'offline';
export type ConnectivityEvent = 'WENT_ONLINE' | 'WENT_OFFLINE';

export const connectivityTransitions = {
  online: { WENT_OFFLINE: 'offline' },
  offline: { WENT_ONLINE: 'online' },
} as const satisfies Record<ConnectivityState, Partial<Record<ConnectivityEvent, ConnectivityState>>>;

export function nextConnectivityState(state: ConnectivityState, event: ConnectivityEvent): ConnectivityState | null {
  const row: Partial<Record<ConnectivityEvent, ConnectivityState>> = connectivityTransitions[state];
  return row[event] ?? null;
}

function readOnline(): ConnectivityState {
  try {
    return typeof navigator !== 'undefined' && navigator.onLine === false ? 'offline' : 'online';
  } catch {
    return 'online';
  }
}

export const connectivity = createStore<{ state: ConnectivityState }>({ state: readOnline() });

export function useConnectivity(): ConnectivityState {
  return useStore(connectivity).state;
}

let installed = false;

/** Start listening (boot). Re-reads the phone's state, so a refresh always starts right. */
export function initConnectivity(): void {
  connectivity.set({ state: readOnline() });
  if (installed || typeof window === 'undefined') return;
  installed = true;
  const apply = (event: ConnectivityEvent) => {
    const next = nextConnectivityState(connectivity.get().state, event);
    if (next !== null) connectivity.set({ state: next });
  };
  window.addEventListener('online', () => apply('WENT_ONLINE'));
  window.addEventListener('offline', () => apply('WENT_OFFLINE'));
}

/** The indicator words (BLUEPRINT 3.6): "Online", "Offline, ready", or "Offline" while the copy is not saved yet. */
export function connectivityLabel(state: ConnectivityState, offlineReady: boolean): string {
  if (state === 'online') return 'Online';
  return offlineReady ? 'Offline, ready' : 'Offline';
}
