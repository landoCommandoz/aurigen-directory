/**
 * What kind of browser surface the app is running in. Every check is wrapped: a missing API
 * reads as "no", never as a crash.
 */

/** True when running as the installed Home Screen app (D3: exempt from Safari's 7-day wipe). */
export function isStandalone(): boolean {
  try {
    const nav = navigator as Navigator & { standalone?: boolean };
    if (nav.standalone === true) return true;
    return typeof window.matchMedia === 'function' && window.matchMedia('(display-mode: standalone)').matches;
  } catch {
    return false;
  }
}

/** iPhone, iPod, or iPad (iPadOS reports a Mac with touch). */
export function isIos(): boolean {
  try {
    const ua = navigator.userAgent;
    if (/iPad|iPhone|iPod/.test(ua)) return true;
    return /Macintosh/.test(ua) && navigator.maxTouchPoints > 1;
  } catch {
    return false;
  }
}

/** True when the share sheet can take these files (D3: check canShare first). */
export function canShareFiles(files: File[]): boolean {
  try {
    const nav = navigator as Navigator & { canShare?: (data: ShareData) => boolean };
    return typeof nav.share === 'function' && typeof nav.canShare === 'function' && nav.canShare({ files });
  } catch {
    return false;
  }
}

/** The DOMException name of an error, or "". */
export function errorNameOf(error: unknown): string {
  return error !== null && typeof error === 'object' && 'name' in error && typeof error.name === 'string' ? error.name : '';
}
