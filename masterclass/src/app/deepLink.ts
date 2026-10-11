/**
 * The address bar before the router starts (BLUEPRINT 10.3, D9).
 *
 * 1. GitHub Pages deep links: public/404.html sends a path Pages has no file for to
 *    <base>?p=<path>&q=<query>#hash. restoreDeepLink() puts the real address back with
 *    history.replaceState, so a refresh on <base>cards/x lands on that card.
 * 2. The base keeps its trailing slash (DEF-09). The service worker's scope is the base WITH its
 *    slash ("/aurigen-directory/"), so "/aurigen-directory" is outside it: a reload there with no
 *    signal shows the browser's offline error page, which in the installed iPhone app has no back
 *    button. The router's basename keeps the slash (basenameFor), so every in-app link to "/"
 *    points at "/aurigen-directory/"; keepBaseSlash() fixes an address typed or followed without
 *    it, at boot and on every back or forward step.
 *
 * Malicious-user guard: only a same-origin path under the base is ever restored. Anything else
 * (an absolute URL, "//host", a backslash, a control character, raw or percent-encoded) is dropped
 * and the app opens at the base path.
 */

export interface DeepLinkResult {
  /** The address now in the bar, or null when nothing was restored. */
  restored: string | null;
  /** True when ?p= was present but refused. */
  refused: boolean;
}

// eslint-disable-next-line no-control-regex
const CONTROL = /[\\\u0000-\u001f\u007f]/;

/** True when the text, or its percent-decoded form, holds a backslash or a control character. */
function hasControlOrBackslash(text: string): boolean {
  if (CONTROL.test(text)) return true;
  try {
    return CONTROL.test(decodeURIComponent(text));
  } catch {
    // A malformed escape such as "%E0%A4%A" is not a path the app wrote.
    return true;
  }
}

/** Pure: the address to restore for a given location, or null. Exported for tests. */
export function deepLinkTarget(loc: { pathname: string; search: string; hash: string; origin: string }, base: string): string | null | 'refused' {
  if (loc.pathname !== base && loc.pathname !== base.replace(/\/$/, '')) return null;
  const params = new URLSearchParams(loc.search);
  const path = params.get('p');
  if (path === null) return null;
  // A path that starts with one slash and holds no backslash, no control characters (also once
  // decoded: "%0d%0a" would become a line break the router cannot match), and no second leading
  // slash (which a browser reads as another host).
  if (!path.startsWith('/') || path.startsWith('//') || hasControlOrBackslash(path)) return 'refused';
  const query = params.get('q');
  const target = `${base}${path.slice(1)}${query !== null && query !== '' ? `?${query}` : ''}${loc.hash}`;
  try {
    const url = new URL(target, loc.origin);
    if (url.origin !== loc.origin || !url.pathname.startsWith(base)) return 'refused';
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return 'refused';
  }
}

/**
 * Run once at boot, before the router renders (main.tsx). Puts a Pages deep link back, then keeps
 * the base's trailing slash from now on (watchBaseSlash, DEF-09). Never throws.
 */
export function restoreDeepLink(base: string = import.meta.env.BASE_URL): DeepLinkResult {
  const result = restorePagesLink(base);
  watchBaseSlash(base);
  return result;
}

function restorePagesLink(base: string): DeepLinkResult {
  try {
    const loc = window.location;
    const target = deepLinkTarget(loc, base);
    if (target === null) return { restored: null, refused: false };
    if (target === 'refused') {
      window.history.replaceState(null, '', base);
      return { restored: null, refused: true };
    }
    window.history.replaceState(null, '', target);
    return { restored: target, refused: false };
  } catch {
    return { restored: null, refused: false };
  }
}

/** Pure: the base with its slash when the pathname is the base without it, else null. Exported for tests. */
export function slashedBaseFor(pathname: string, base: string): string | null {
  if (base === '/' || !base.endsWith('/')) return null;
  return pathname === base.slice(0, -1) ? base : null;
}

/**
 * Put the trailing slash back when the address is the base without it ("/aurigen-directory"),
 * keeping the query, the hash, and the history entry's state. Returns true when it changed the
 * address. Never throws.
 */
export function keepBaseSlash(base: string = import.meta.env.BASE_URL): boolean {
  try {
    const loc = window.location;
    const fixed = slashedBaseFor(loc.pathname, base);
    if (fixed === null) return false;
    window.history.replaceState(window.history.state, '', `${fixed}${loc.search}${loc.hash}`);
    return true;
  } catch {
    return false;
  }
}

let watching = false;

/**
 * Fix the address now and on every back or forward step. Call at boot, before the router starts:
 * this listener is then added before the router's own, so the router reads the fixed address.
 */
export function watchBaseSlash(base: string = import.meta.env.BASE_URL): void {
  keepBaseSlash(base);
  if (watching || base === '/') return;
  try {
    window.addEventListener('popstate', () => {
      keepBaseSlash(base);
    });
    watching = true;
  } catch {
    // No window (tests without a DOM): nothing to watch.
  }
}

/**
 * The router basename for a Vite base. It keeps the trailing slash ("/aurigen-directory/"), so a
 * link to "/" points inside the service worker's scope (DEF-09); "/" stays "/". A doubled slash
 * collapses to one.
 */
export function basenameFor(base: string): string {
  const trimmed = base.trim().replace(/\/+$/, '').replace(/^\/*/, '/');
  return trimmed === '/' ? '/' : `${trimmed}/`;
}
