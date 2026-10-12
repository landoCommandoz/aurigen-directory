/**
 * Playwright: the browser suites (qa-adversary). Owner: qa-adversary.
 *
 *   tests/e2e          every route at five widths: errors, scroll, tap targets, clipping, shell rules
 *   tests/privacy      Customer View leak test (BLUEPRINT 3.4 and 3.8)
 *   tests/persistence  refresh, offline, and updates (quality bar items 5 and 7)
 *   tests/adversarial  impatient, edge-case, confused, malicious users (CLAUDE.md)
 *
 * Unit suites live in tests/unit and run under Vitest (npm test). Playwright only picks up *.spec.ts.
 *
 * The suites run against the production build served by `vite preview` (import.meta.env.DEV is
 * false there, so the developer panel follows the production rule). The web server builds first
 * unless PW_SKIP_BUILD=1 says dist/ is already fresh.
 *
 * Browsers: the VM ships Chromium build 1194 under /opt/pw-browsers, the build Playwright 1.56
 * expects (D1 amendment). Never run "playwright install". If the bundled revision ever stops
 * matching, set PW_CHROMIUM to the chrome binary and it is used as executablePath.
 * WebKit is not in the VM; iPhone behavior is checked on Lando's phone (BLUEPRINT 9).
 */
import { existsSync } from 'node:fs';
import { defineConfig, devices, type Project } from '@playwright/test';

const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}`;
/** The GitHub Pages build (D9): base /aurigen-directory/, built into .cache/ (gitignored), served on 4174. */
const PAGES_PORT = 4174;
const PAGES_BASE = '/aurigen-directory/';
export const PAGES_URL = `http://localhost:${PAGES_PORT}${PAGES_BASE}`;
const PAGES_DIST = '.cache/pages-dist';

const FALLBACK_CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const chromiumPath = process.env.PW_CHROMIUM ?? (process.env.PW_USE_FALLBACK === '1' && existsSync(FALLBACK_CHROME) ? FALLBACK_CHROME : undefined);

/** The five widths from CLAUDE.md (mobile rules) and BUILD_PROMPT section 9 item 4. */
export const WIDTHS = [
  { name: 'w375', width: 375, height: 812, mobile: true },
  { name: 'w430', width: 430, height: 932, mobile: true },
  { name: 'w768', width: 768, height: 1024, mobile: true },
  { name: 'w1024', width: 1024, height: 768, mobile: false },
  { name: 'w1440', width: 1440, height: 900, mobile: false },
] as const;

const projects: Project[] = WIDTHS.map((w) => ({
  name: w.name,
  testIgnore: ['e2e/pages-base.spec.ts'],
  use: {
    ...devices['Desktop Chrome'],
    viewport: { width: w.width, height: w.height },
    hasTouch: w.mobile,
    isMobile: w.mobile,
    deviceScaleFactor: w.mobile ? 2 : 1,
    ...(chromiumPath === undefined ? {} : { launchOptions: { executablePath: chromiumPath } }),
  },
}));

/** The same app at the GitHub Pages base path, at the phone width (BLUEPRINT 10.3; OWNERSHIP: both base paths). */
projects.push({
  name: 'pages375',
  testMatch: ['e2e/pages-base.spec.ts'],
  use: {
    ...devices['Desktop Chrome'],
    baseURL: PAGES_URL,
    viewport: { width: 375, height: 812 },
    hasTouch: true,
    isMobile: true,
    deviceScaleFactor: 2,
    ...(chromiumPath === undefined ? {} : { launchOptions: { executablePath: chromiumPath } }),
  },
});

export default defineConfig({
  testDir: './tests',
  // After the web servers have built the first version: build the second version for the update
  // tests (tests/persistence/phase2-update.spec.ts), at both base paths, into .cache/ (Phase 2 pass 4).
  globalSetup: './tests/fixtures/second-version-build.ts',
  testMatch: ['e2e/**/*.spec.ts', 'privacy/**/*.spec.ts', 'persistence/**/*.spec.ts', 'adversarial/**/*.spec.ts'],
  outputDir: './test-results',
  fullyParallel: true,
  forbidOnly: true,
  retries: 0,
  workers: process.env.PW_WORKERS === undefined ? 3 : Number(process.env.PW_WORKERS),
  timeout: 45_000,
  expect: { timeout: 8_000 },
  reporter: [['list'], ['json', { outputFile: './playwright-report/results.json' }]],
  use: {
    baseURL: BASE_URL,
    trace: 'off',
    screenshot: 'only-on-failure',
    // Each test starts with no service worker unless it opts in (the offline tests do).
    serviceWorkers: 'block',
    acceptDownloads: true,
    colorScheme: 'dark',
    locale: 'en-US',
    timezoneId: 'America/Denver',
  },
  projects,
  webServer: [
    {
      command: process.env.PW_SKIP_BUILD === '1' ? 'npm run preview' : 'npm run build && npm run preview',
      url: BASE_URL,
      reuseExistingServer: process.env.PW_REUSE_SERVER === '1',
      timeout: 180_000,
      stdout: 'ignore',
      stderr: 'pipe',
    },
    {
      // Built after the root build (Playwright starts the servers in order), from the same generated content.
      command:
        process.env.PW_SKIP_BUILD === '1'
          ? `npx vite preview --outDir ${PAGES_DIST} --port ${PAGES_PORT} --strictPort`
          : `npx vite build --outDir ${PAGES_DIST} --emptyOutDir && npx vite preview --outDir ${PAGES_DIST} --port ${PAGES_PORT} --strictPort`,
      env: { VITE_BASE: PAGES_BASE },
      url: PAGES_URL,
      reuseExistingServer: process.env.PW_REUSE_SERVER === '1',
      timeout: 180_000,
      stdout: 'ignore',
      stderr: 'pipe',
    },
  ],
});
