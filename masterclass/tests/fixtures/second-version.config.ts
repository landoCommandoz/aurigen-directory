/**
 * A second version of the app, for the update tests (tests/persistence/phase2-update.spec.ts).
 * Owner: qa-adversary. Not used by the app or by any deploy.
 *
 * It is the real vite.config.ts, the same content, the same PWA plugin and guards, with one change:
 * the app reads a different version from package.json. That changes the app code, so the new build
 * has a new index chunk, a new index.html, and a new sw.js, exactly as a real deploy does, and after
 * the update the app's "Updated" notice names this version. Built into .cache/ (gitignored) by
 * tests/fixtures/second-version-build.ts before the browser suites run.
 */
import { mergeConfig, type Plugin } from 'vite';
import appConfig from '../../vite.config.ts';
import { SECOND_VERSION } from './site';

function secondVersion(): Plugin {
  return {
    name: 'qa:second-version',
    enforce: 'pre',
    transform(code, id) {
      if (!id.replace(/\?.*$/, '').endsWith('/package.json')) return null;
      const next = code.replace(/"version"\s*:\s*"[^"]+"/, `"version": "${SECOND_VERSION}"`);
      if (next === code) throw new Error('second-version.config.ts: package.json has no "version" field to change');
      return { code: next, map: null };
    },
  };
}

export default mergeConfig(appConfig, { plugins: [secondVersion()] });
