/**
 * Warm-up after the first screen (QA DEF-17): load the search index, then the content the Fix It
 * grid, the fix pages, and the Quick Cards draw, while the phone is idle, so the first search and
 * the first fix open at once. It starts after the page's load event plus WARM_DELAY_MS, so none of
 * it competes with drawing the first screen (the bottom row waits on the saved Customer View flag).
 * Everything here is in the offline copy, so on an installed phone it is a local read.
 * A screen that needs content before the warm-up reaches it loads that content itself.
 */
import { ensureContent, type LoadableShard } from '../core/content';
import { preloadSearch } from '../core/search';

export const WARM_DELAY_MS = 1200;
/** What Fix It and the Quick Cards draw: the fixes, the cards, and the catalog for Related. */
export const WARM_CONTENT: readonly LoadableShard[] = ['fixnode', 'quickcard', 'catalog'];

type IdleWindow = Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number };

function whenIdle(run: () => void): void {
  const idle = (window as IdleWindow).requestIdleCallback;
  if (typeof idle === 'function') idle(run, { timeout: 3000 });
  else window.setTimeout(run, 200);
}

async function warm(): Promise<void> {
  try {
    await preloadSearch();
  } catch (error) {
    // Nothing is kept from a failed load: the next search, or its Try again, asks for a fresh copy (QA DEF-26).
    console.error('[warm-up] the search index did not load; the next search tries again', error);
  }
  // ensureContent never rejects: a shard that fails is recorded, and its screen offers Try again.
  await ensureContent(WARM_CONTENT);
}

/** Call once after the first render. */
export function scheduleWarmUp(): void {
  const start = () => window.setTimeout(() => whenIdle(() => void warm()), WARM_DELAY_MS);
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
}
