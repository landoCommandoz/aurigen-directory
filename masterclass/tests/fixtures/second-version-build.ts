/**
 * Playwright global setup (qa-adversary): build the second version of the app for the update tests,
 * at both base paths, from the same generated content as the first. Playwright runs this after its
 * web servers have built dist/ and .cache/pages-dist/ (the first version). Each second build takes
 * about 4 s and is skipped when it was already made from the same first build (its sw.js hash).
 */
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { MASTERCLASS, VERSIONS } from './site';

function swHash(dir: string): string {
  const file = join(dir, 'sw.js');
  if (!existsSync(file)) throw new Error(`${file} is missing: build the first version before the update tests (npm run build, and the Pages build into .cache/pages-dist)`);
  return createHash('sha1').update(readFileSync(file)).digest('hex');
}

export default function buildSecondVersions(): void {
  for (const site of Object.values(VERSIONS)) {
    const from = swHash(site.v1);
    const stamp = join(site.v2, '.qa-built-from');
    if (existsSync(stamp) && readFileSync(stamp, 'utf8') === from && existsSync(join(site.v2, 'sw.js'))) continue;
    execFileSync('npx', ['vite', 'build', '--config', 'tests/fixtures/second-version.config.ts', '--outDir', site.v2, '--emptyOutDir', '--logLevel', 'warn'], {
      cwd: MASTERCLASS,
      env: { ...process.env, VITE_BASE: site.base },
      stdio: ['ignore', 'ignore', 'inherit'],
    });
    if (swHash(site.v2) === from) throw new Error(`the second version at ${site.base} has the same sw.js as the first: the update tests would test nothing`);
    writeFileSync(stamp, from);
  }
}
