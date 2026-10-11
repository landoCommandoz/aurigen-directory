/**
 * Build and launch facts the developer panel shows (BLUEPRINT 9, the Phase 1 device checklist):
 * the base path, the app version, the build mode, and whether the app runs as the installed
 * Home Screen app. Read-only. The panel imports getAppEnv() or useAppEnv() from here.
 */
import { useSyncExternalStore } from 'react';
import { isIos, isStandalone } from '../core/platform';
import { config } from './config';

export interface AppEnv {
  /** "/" on Netlify, "/aurigen-directory/" on GitHub Pages (D9). */
  basePath: string;
  /** From package.json at build time. */
  appVersion: string;
  /** "development" or "production". */
  mode: string;
  /** True in `vite dev`: the developer panel and device preview are always on. */
  isDev: boolean;
  /** True when opened from the Home Screen icon (exempt from Safari's 7-day wipe, D3). */
  standalone: boolean;
  /** iPhone or iPad: the install card shows Safari's Share steps. */
  ios: boolean;
}

export function getAppEnv(): AppEnv {
  return {
    basePath: import.meta.env.BASE_URL,
    appVersion: config.version,
    mode: import.meta.env.MODE,
    isDev: import.meta.env.DEV,
    standalone: isStandalone(),
    ios: isIos(),
  };
}

/* ---------- Live standalone flag (the display mode can change while the page is open) ---------- */

function subscribeStandalone(listener: () => void): () => void {
  try {
    if (typeof window.matchMedia !== 'function') return () => undefined;
    const query = window.matchMedia('(display-mode: standalone)');
    query.addEventListener('change', listener);
    return () => query.removeEventListener('change', listener);
  } catch {
    return () => undefined;
  }
}

/** React hook: true while running as the installed app. */
export function useStandalone(): boolean {
  return useSyncExternalStore(subscribeStandalone, isStandalone, () => false);
}

/** React hook: the full env with a live standalone flag. */
export function useAppEnv(): AppEnv {
  const standalone = useStandalone();
  return { ...getAppEnv(), standalone };
}
