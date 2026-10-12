/**
 * Try again, from a button, when a fresh import did not help either (QA DEF-26): reload the page
 * for a fresh copy of the app. A reload heals a tab left open across a deploy, whose old chunk
 * names are gone, and a browser that holds on to a failed download.
 *
 * It reloads only when the reload has somewhere to land, so no signal never ends on the browser's
 * "you are offline" page, a dead end in the Home Screen app, which has no reload button:
 *
 *   1. The saved copy (QA DEF-27): a service worker registration with an active worker serves every
 *      navigation in its scope, also with no signal, even when this page is not served by it yet
 *      (the first session, before the takeover). Checked first: it needs no network.
 *   2. Otherwise the app's own address answers right now (a 5 s check).
 *
 * The address check is the one network request the content screens make, and only after a failure
 * and a tap. A reload never activates a waiting update: the worker that serves the page stays in
 * charge through a reload, and only "Update now" tells a waiting one to take over (src/core/pwa.ts).
 * Everything that must survive a reload is already saved (BLUEPRINT 3.5).
 */

export interface PageReloader {
  /** True when a reload would be served by the saved copy: an active service worker for this page's scope. */
  savedCopy: () => Promise<boolean>;
  /** True when the app's own address answers right now. */
  answers: () => Promise<boolean>;
  reload: () => void;
  /** How long to wait for the page to go away before saying the reload did not happen. */
  graceMs: number;
}

const PROBE_TIMEOUT_MS = 5000;
/** The registration lookup is local; a browser that never answers it counts as no saved copy. */
const REGISTRATION_TIMEOUT_MS = 2000;

/** True when an active service worker is registered for this page's address (its saved copy serves a reload). */
export async function savedCopyInstalled(): Promise<boolean> {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const registration = await Promise.race([
      navigator.serviceWorker.getRegistration(),
      new Promise<undefined>((resolve) => {
        timer = setTimeout(() => resolve(undefined), REGISTRATION_TIMEOUT_MS);
      }),
    ]);
    return registration?.active != null;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

async function appAnswers(): Promise<boolean> {
  if (typeof fetch !== 'function' || typeof AbortController !== 'function') return false;
  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), PROBE_TIMEOUT_MS);
  try {
    const response = await fetch(import.meta.env.BASE_URL, { cache: 'no-store', signal: abort.signal });
    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

function reloadWindow(): void {
  try {
    window.location.reload();
  } catch (error) {
    console.error('[fresh page] the page could not reload', error);
  }
}

const BROWSER: PageReloader = { savedCopy: savedCopyInstalled, answers: appAnswers, reload: reloadWindow, graceMs: 8000 };

let reloader: PageReloader = BROWSER;
let running: Promise<boolean> | null = null;

/** The saved copy first (no network), then the address; a check that throws counts as no. */
async function reloadLands(): Promise<boolean> {
  if (await reloader.savedCopy().catch(() => false)) return true;
  return reloader.answers().catch(() => false);
}

/**
 * Reload the page when the saved copy or the app's address can serve it. Resolves false at once
 * when neither can (no signal and nothing saved), and true only if the page is still here after the
 * grace period (the reload did not happen); while the page reloads it stays pending, so the screen
 * keeps saying "Opening". Never rejects. Two taps share one check and one reload.
 */
export function reloadForFreshCopy(): Promise<boolean> {
  running ??= (async () => {
    try {
      if (typeof window === 'undefined' || !(await reloadLands())) return false;
      reloader.reload();
      await new Promise((resolve) => setTimeout(resolve, reloader.graceMs));
      return true;
    } finally {
      running = null;
    }
  })();
  return running;
}

/** Tests only: a stand-in for the checks and the reload (null restores the browser's). */
export function __setPageReloaderForTests(next: PageReloader | null): void {
  reloader = next ?? BROWSER;
  running = null;
}
