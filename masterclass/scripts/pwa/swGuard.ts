/**
 * Build guard for the service worker's update rules (D1 and its 2026-10-12 amendment, BLUEPRINT
 * 3.5, QA DEF-27). The sw.js that vite-plugin-pwa writes must:
 *
 *   1. call skipWaiting() only inside the SKIP_WAITING message listener. A new version then waits
 *      until "Update now" is tapped (applyUpdateWhenIdle in src/core/pwa.ts sends that message), so
 *      it never swaps code under a running job. workbox.skipWaiting true writes a bare
 *      self.skipWaiting() and fails here (so would autoUpdate with the plugin's own register script;
 *      with injectRegister false, as here, plugin 2.0.0 leaves skipWaiting as configured).
 *   2. keep that listener, or "Update now" could never install a new version.
 *   3. call clientsClaim(), so the first install serves the page already open and "Ready offline"
 *      can show in the first session (DEF-27).
 *
 * swUpdateGuardPlugin() runs the check on the real build output after the PWA plugin writes sw.js
 * and fails the build with these lines. Only sw.js is read: the Workbox runtime stays in its own
 * file (workbox-*.js), so its library code never counts as a call.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import type { Plugin } from 'vite';

const ANY_SKIP_WAITING = /\bskipWaiting\s*\(\s*\)/g;
/**
 * The message listener with its SKIP_WAITING test and the call, never crossing a closing brace, so
 * a bare call placed after the listener is not counted as guarded. Matches Workbox's template both
 * as written and minified: self.addEventListener("message",s=>{s.data&&"SKIP_WAITING"===s.data.type&&self.skipWaiting()}).
 */
const GUARDED_SKIP_WAITING = /addEventListener\(\s*['"]message['"][^}]*?['"]SKIP_WAITING['"][^}]*?skipWaiting\s*\(\s*\)/g;
/** A call (s.clientsClaim(), workbox.clientsClaim()), never the library's own definition. */
const CLIENTS_CLAIM = /(?<!function\s*)\bclientsClaim\s*\(\s*\)/;

/** What is wrong with the generated service worker's update rules; empty when it is right. */
export function serviceWorkerUpdateProblems(source: string): string[] {
  const problems: string[] = [];
  const calls = [...source.matchAll(ANY_SKIP_WAITING)].length;
  const guarded = [...source.matchAll(GUARDED_SKIP_WAITING)].length;
  if (calls > guarded) {
    problems.push(
      `sw.js calls skipWaiting() outside the SKIP_WAITING message listener (${calls - guarded} of ${calls}): a new version would take over without "Update now". Keep registerType "prompt" and workbox.skipWaiting false (D1).`,
    );
  }
  if (guarded === 0) {
    problems.push('sw.js has no SKIP_WAITING message listener: "Update now" could never install a new version. Keep workbox.skipWaiting false (D1).');
  }
  if (!CLIENTS_CLAIM.test(source)) {
    problems.push(
      'sw.js never calls clientsClaim(): the first install would not serve the page already open, so lessons fail offline in the first session (DEF-27). Keep workbox.clientsClaim true (D1 amendment, 2026-10-12).',
    );
  }
  return problems;
}

/** Fails the build when the generated sw.js breaks the update rules above. List it after VitePWA. */
export function swUpdateGuardPlugin(): Plugin {
  let outDir = '';
  return {
    name: 'masterclass:sw-update-guard',
    apply: 'build',
    configResolved(resolved) {
      outDir = resolve(resolved.root, resolved.build.outDir);
    },
    // vite-plugin-pwa writes sw.js in its own (sequential) closeBundle; 'post' runs after it.
    closeBundle: {
      order: 'post',
      sequential: true,
      handler() {
        const file = join(outDir, 'sw.js');
        if (!existsSync(file)) throw new Error(`${file} is missing: vite-plugin-pwa did not write the service worker.`);
        const problems = serviceWorkerUpdateProblems(readFileSync(file, 'utf8'));
        if (problems.length > 0) throw new Error(`Service worker update check failed:\n- ${problems.join('\n- ')}`);
      },
    },
  };
}
