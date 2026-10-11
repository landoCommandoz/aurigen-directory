import { useSyncExternalStore } from 'react';

/**
 * A tiny observable value for device-side services (storage probe, speech, wake lock,
 * PWA, connectivity). The developer panel and screens read it through useStore(), so
 * every readout is live without a global state library.
 */
export interface Store<T> {
  get: () => T;
  set: (next: T) => void;
  update: (patch: Partial<T>) => void;
  subscribe: (listener: () => void) => () => void;
}

export function createStore<T extends object>(initial: T): Store<T> {
  let value = initial;
  const listeners = new Set<() => void>();
  const emit = () => {
    for (const listener of Array.from(listeners)) {
      try {
        listener();
      } catch (error) {
        // A broken listener must not stop the others or the write that triggered it.
        console.error('[store] a listener failed', error);
      }
    }
  };
  return {
    get: () => value,
    set: (next) => {
      if (Object.is(next, value)) return;
      value = next;
      emit();
    },
    update: (patch) => {
      const keys = Object.keys(patch) as Array<keyof T>;
      if (keys.every((k) => Object.is(patch[k], value[k]))) return;
      value = { ...value, ...patch };
      emit();
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

/** React hook: the current value of a store, re-rendering on change. */
export function useStore<T extends object>(store: Store<T>): T {
  return useSyncExternalStore(store.subscribe, store.get, store.get);
}
