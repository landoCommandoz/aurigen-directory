/**
 * A second try at a lazy chunk that failed to download (QA DEF-26).
 *
 * The browser keeps a failed module import: import() of the same address fails again at once,
 * however good the signal is now, until the page reloads. So a second try imports the same file
 * under a new address (?mc-retry=N). The address is read from the loader's own text: the bundler
 * writes every lazy loader as import("./file.js"), and scripts/content/viteShards.ts fails the build
 * if a content or index chunk's loader stops reading that way. A loader whose address cannot be
 * read (a test's stand-in) is simply called again.
 *
 * Every loader here is made with import: 'default', so a fresh import returns the module's default.
 */

export const RETRY_PARAM = 'mc-retry';

type Loader = () => Promise<unknown>;

/** import("./x.js"), import('./x.js') or import(`./x.js`), with no expression inside. */
const IMPORT_CALL = /\bimport\(\s*(["'`])([^"'`$]+)\1\s*\)/;

/** The absolute address a loader imports, read from its text and resolved against `base`, or null. */
export function importedAddress(loader: Loader, base: string): string | null {
  let text: string;
  try {
    text = Function.prototype.toString.call(loader);
  } catch {
    return null;
  }
  const specifier = IMPORT_CALL.exec(text)?.[2];
  if (specifier === undefined || specifier === '') return null;
  try {
    return new URL(specifier, base).href;
  } catch {
    return null;
  }
}

/** The address with ?mc-retry=<attempt>, so the browser treats it as a module it has not tried. */
export function retryAddress(address: string, attempt: number): string {
  const fresh = new URL(address);
  fresh.searchParams.set(RETRY_PARAM, String(attempt));
  // The dev server serves a non-script file as a module only when the request says so.
  if (import.meta.env.DEV && !/\.[cm]?[jt]sx?$/.test(fresh.pathname)) fresh.searchParams.set('import', '');
  return fresh.href;
}

/** Load a chunk again after `attempt` failures: under a fresh address when its loader names one. */
export async function importAgain(loader: Loader, base: string, attempt: number): Promise<unknown> {
  const address = importedAddress(loader, base);
  if (address === null) return loader();
  const module: unknown = await import(/* @vite-ignore */ retryAddress(address, attempt));
  if (module !== null && typeof module === 'object' && 'default' in module) return module.default;
  return module;
}
