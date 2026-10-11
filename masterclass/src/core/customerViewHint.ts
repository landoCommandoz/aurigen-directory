/**
 * The Customer View hint (DEF-01, BLUEPRINT 3.4 "a refresh never reveals internals").
 *
 * The real Customer View flag lives in the settings row in IndexedDB, which answers a few
 * milliseconds after the first frame. This hint is a copy in localStorage that can be read
 * synchronously before anything draws, so the shell knows whether to hold the internal top bar
 * and draw the customer density on a refresh. It is never the source of truth: once the settings
 * row is read, the row wins and the hint is brought in line with it.
 *
 * Fail closed: the hint is written "on" BEFORE the row is changed, and "off" only AFTER the row
 * says off. If the "on" write fails, the hint is removed, so it reads "unknown" and the shell
 * holds the top bar until the row answers. Storage access is wrapped in try/catch everywhere.
 */

export const CUSTOMER_VIEW_HINT_KEY = 'masterclass.customerView';

export type CustomerViewHint = 'on' | 'off' | 'unknown';

/** What the last session left: 'on', 'off', or 'unknown' (never written, or storage blocked). */
export function readCustomerViewHint(): CustomerViewHint {
  try {
    const value = window.localStorage.getItem(CUSTOMER_VIEW_HINT_KEY);
    if (value === '1') return 'on';
    if (value === '0') return 'off';
    return 'unknown';
  } catch {
    return 'unknown';
  }
}

/**
 * Keep the hint in line with the flag. Never throws. A failed "on" write removes the hint so it
 * reads "unknown" (held), never "off" (shown).
 */
export function writeCustomerViewHint(on: boolean): void {
  try {
    window.localStorage.setItem(CUSTOMER_VIEW_HINT_KEY, on ? '1' : '0');
  } catch {
    if (!on) return;
    try {
      window.localStorage.removeItem(CUSTOMER_VIEW_HINT_KEY);
    } catch {
      // Storage is fully blocked: reads return "unknown" too, which holds the top bar.
    }
  }
}
