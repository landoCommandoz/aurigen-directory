/**
 * Try again, from a button, when a fresh import did not help either (QA DEF-26): reload the page
 * for a fresh copy of the app. A reload heals a tab left open across a deploy, whose old chunk
 * names are gone, and a browser that holds on to a failed download.
 *
 * It reloads only when the app's own address answers, so no signal never ends on the browser's
 * "you are offline" page, a dead end in the Home Screen app, which has no reload button. With the
 * offline copy in place the service worker answers, and the reload is served from that copy.
 * This check is the one network request the content screens make, and only after a failure and a
 * tap. Everything that must survive a reload is already saved (BLUEPRINT 3.5).
 */

export interface PageReloader {
  /** True when the app's own address answers right now. */
  answers: () => Promise<boolean>;
  reload: () => void;
  /** How long to wait for the page to go away before saying the reload did not happen. */
  graceMs: number;
}

const PROBE_TIMEOUT_MS = 5000;

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

const BROWSER: PageReloader = { answers: appAnswers, reload: reloadWindow, graceMs: 8000 };

let reloader: PageReloader = BROWSER;
let running: Promise<boolean> | null = null;

/**
 * Reload the page when the app's address answers. Resolves false at once when it does not (no
 * signal, or the check itself failed), and true only if the page is still here after the grace
 * period (the reload did not happen); while the page reloads it stays pending, so the screen keeps
 * saying "Opening". Never rejects. Two taps share one check and one reload.
 */
export function reloadForFreshCopy(): Promise<boolean> {
  running ??= (async () => {
    try {
      if (typeof window === 'undefined' || !(await reloader.answers().catch(() => false))) return false;
      reloader.reload();
      await new Promise((resolve) => setTimeout(resolve, reloader.graceMs));
      return true;
    } finally {
      running = null;
    }
  })();
  return running;
}

/** Tests only: a stand-in for the address check and the reload (null restores the browser's). */
export function __setPageReloaderForTests(next: PageReloader | null): void {
  reloader = next ?? BROWSER;
  running = null;
}
