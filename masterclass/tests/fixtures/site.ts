/**
 * A small static host for the update tests (qa-adversary). Not imported by app code.
 *
 * Each test starts its own server on a free port, so each test has its own origin, its own service
 * worker, and its own storage, and the tests run in parallel. serve(dir) swaps the files the host
 * hands out, the way a deploy does: after it, the first version's files are gone. Like `vite preview`
 * it sends Cache-Control: no-cache, so the browser's own cache never answers for the service worker,
 * and an unknown address that asks for a page gets index.html (the app's router takes it from there).
 */
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import { extname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export const MASTERCLASS = fileURLToPath(new URL('../..', import.meta.url));

/** The first version (built by Playwright's web servers) and the second (tests/fixtures/second-version-build.ts), per base path. */
export const VERSIONS = {
  root: { base: '/', v1: join(MASTERCLASS, 'dist'), v2: join(MASTERCLASS, '.cache/qa-v2-root') },
  pages: { base: '/aurigen-directory/', v1: join(MASTERCLASS, '.cache/pages-dist'), v2: join(MASTERCLASS, '.cache/qa-v2-pages') },
} as const;

export type SiteName = keyof typeof VERSIONS;

/** The version the second build reports (tests/fixtures/second-version.config.ts). Valid for the backup's SemVer rule; never a real release. */
export const SECOND_VERSION = '0.1.0-qa-second-build';

const TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

export interface Site {
  /** The app's address, ending in the base path. */
  url: string;
  /** Hand out this directory's files from now on (a deploy). */
  serve: (dir: string) => void;
  /** Every path asked for, in order. */
  requests: string[];
  close: () => Promise<void>;
}

export async function startSite(base: string, dir: string): Promise<Site> {
  let root = resolve(dir);
  const requests: string[] = [];
  const server = createServer((req, res) => {
    const path = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname);
    requests.push(path);
    if (!path.startsWith(base)) {
      res.writeHead(404).end();
      return;
    }
    let file = resolve(root, `.${sep}${path.slice(base.length)}`);
    if (file !== root && !file.startsWith(root + sep)) {
      res.writeHead(403).end();
      return;
    }
    if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
    if (!existsSync(file)) {
      const wantsPage = (req.headers.accept ?? '').includes('text/html');
      if (!wantsPage) {
        res.writeHead(404, { 'Cache-Control': 'no-cache' }).end();
        return;
      }
      file = join(root, 'index.html');
    }
    res.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream', 'Cache-Control': 'no-cache' });
    createReadStream(file).pipe(res);
  });
  await new Promise<void>((done) => server.listen(0, '127.0.0.1', done));
  const { port } = server.address() as AddressInfo;
  return {
    url: `http://127.0.0.1:${port}${base}`,
    serve: (next) => {
      root = resolve(next);
    },
    requests,
    close: () =>
      new Promise<void>((done) => {
        server.closeAllConnections();
        server.close(() => done());
      }),
  };
}
