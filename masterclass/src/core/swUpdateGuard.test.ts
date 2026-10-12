// @vitest-environment node
/**
 * The build guard on the generated service worker (scripts/pwa/swGuard.ts; D1 and its 2026-10-12
 * amendment, QA DEF-27): a new version waits for "Update now", and the first install serves the
 * page already open. The sources below are Workbox's template as vite-plugin-pwa 2.0.0 writes it,
 * minified (the shape of dist/sw.js today) and as written; the build runs the same check on the
 * real dist/sw.js after every build and fails on a problem.
 */
import { describe, expect, it } from 'vitest';
import { serviceWorkerUpdateProblems } from '../../scripts/pwa/swGuard';

const LISTENER = 'self.addEventListener("message",s=>{s.data&&"SKIP_WAITING"===s.data.type&&self.skipWaiting()})';
const ROUTES = 's.precacheAndRoute([{url:"index.html",revision:"abc"}],{}),s.cleanupOutdatedCaches(),s.registerRoute(new s.NavigationRoute(s.createHandlerBoundToURL("index.html")))';
const minified = (body: string) => `define(["./workbox-2fbc6a65"],function(s){"use strict";${body}});`;

/** Prompt mode, clientsClaim true, skipWaiting false: the build today. */
const PROMPT_CLAIM = minified(`${LISTENER},s.clientsClaim(),${ROUTES}`);

const AS_WRITTEN = `
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
workbox.clientsClaim();
`;

describe('serviceWorkerUpdateProblems', () => {
  it('passes the build today: the SKIP_WAITING listener only, and clientsClaim', () => {
    expect(serviceWorkerUpdateProblems(PROMPT_CLAIM)).toEqual([]);
    expect(serviceWorkerUpdateProblems(AS_WRITTEN)).toEqual([]);
  });

  it('fails autoUpdate or skipWaiting true: a bare skipWaiting() would swap a new version in without "Update now"', () => {
    const problems = serviceWorkerUpdateProblems(minified(`self.skipWaiting(),s.clientsClaim(),${ROUTES}`));
    expect(problems).toHaveLength(2);
    expect(problems[0]).toMatch(/outside the SKIP_WAITING message listener \(1 of 1\)/);
    expect(problems[1]).toMatch(/no SKIP_WAITING message listener/);
  });

  it('fails a bare skipWaiting() placed after the listener, even right next to it', () => {
    const problems = serviceWorkerUpdateProblems(minified(`${LISTENER},self.skipWaiting(),s.clientsClaim(),${ROUTES}`));
    expect(problems).toEqual([expect.stringMatching(/outside the SKIP_WAITING message listener \(1 of 2\)/)]);
  });

  it('fails without the listener: "Update now" could never install a new version', () => {
    expect(serviceWorkerUpdateProblems(minified(`s.clientsClaim(),${ROUTES}`))).toEqual([expect.stringMatching(/no SKIP_WAITING message listener/)]);
  });

  it('fails clientsClaim false (QA DEF-27): the first install would not serve the open page', () => {
    expect(serviceWorkerUpdateProblems(minified(`${LISTENER},${ROUTES}`))).toEqual([expect.stringMatching(/never calls clientsClaim\(\).*DEF-27/)]);
  });

  it('never counts the library definition of clientsClaim as a call', () => {
    const definitionOnly = minified(`${LISTENER},function clientsClaim(){self.addEventListener("activate",()=>self.clients.claim())},${ROUTES}`);
    expect(serviceWorkerUpdateProblems(definitionOnly)).toEqual([expect.stringMatching(/never calls clientsClaim\(\)/)]);
  });

  it('fails an empty or unrelated file on both counts', () => {
    expect(serviceWorkerUpdateProblems('')).toHaveLength(2);
  });
});
