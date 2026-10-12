/**
 * Shared helpers for the Playwright suites (qa-adversary). Not imported by app code.
 *
 * Everything here drives the app the way a person does: real taps on real buttons. The only
 * shortcut is readStore(), which reads IndexedDB directly so a test can prove that a refused or
 * doubled tap wrote nothing.
 */
import { expect, type Download, type Page, type Request } from '@playwright/test';

/** The owner PIN every test uses. Six digits (D4). */
export const PIN = '482915';

/**
 * Every address the shell mounts (src/app/routes.tsx ROUTE_PATHS), with a real item for each
 * :id route. Phase 2 added the fix, lesson, procedure, and item pages: the longest fix title, a
 * STOP fix, a Tesla fix, the longest lesson, a Tesla procedure, a tool, and a glossary term.
 */
export const ROUTES = [
  '/',
  '/fixit',
  '/fixit/fix-01',
  '/fixit/fix-09',
  '/fixit/fix-78',
  '/cards',
  '/cards/card-bucket-mix',
  '/cards/card-machine-settings',
  '/search',
  '/items/equipment-bauer-56367',
  '/items/term-long-throw',
  '/settings',
  '/settings/setup',
  '/settings/device',
  '/settings/backup',
  '/settings/developer',
  '/academy',
  '/academy/lesson-l4-07-full-square',
  '/sops',
  '/sops/sop-wheels-tesla',
  '/job',
  '/business',
  '/no-such-route',
] as const;

export interface PageProblems {
  console: string[];
  page: string[];
  failed: string[];
  http: string[];
  /** net::ERR_ABORTED failures, each with the main-frame document it began on; sorted out by settleAborted(). */
  aborted: { line: string; document: number }[];
  /** Main-frame documents committed so far: a goto or reload counts, an in-app step (pushState) does not. */
  documents: number;
  /** Not a problem, kept for the record: requests the browser cancelled because the test loaded a new page. */
  superseded: string[];
}

/** Collect console errors, page errors, failed requests, and responses of 400 or above. */
export function watchProblems(page: Page): PageProblems {
  const problems: PageProblems = { console: [], page: [], failed: [], http: [], aborted: [], documents: 0, superseded: [] };
  const documentAtStart = new WeakMap<Request, number>();
  // A main-frame load is a navigation request followed by a commit (framenavigated). The old document
  // keeps drawing, and can still ask for a font, until that commit, so the count moves at the commit.
  let loadPending = false;
  page.on('request', (request) => {
    documentAtStart.set(request, problems.documents);
    try {
      if (request.isNavigationRequest() && request.frame() === page.mainFrame()) loadPending = true;
    } catch {
      // A request with no frame (a service worker's own fetch) never loads a page.
    }
  });
  page.on('framenavigated', (frame) => {
    if (frame !== page.mainFrame() || !loadPending) return; // a same-document step is not a new page
    loadPending = false;
    problems.documents += 1;
  });
  page.on('console', (message) => {
    if (message.type() === 'error') problems.console.push(message.text());
  });
  page.on('pageerror', (error) => problems.page.push(`${error.name}: ${error.message}`));
  page.on('requestfailed', (request) => {
    const failure = request.failure()?.errorText ?? 'failed';
    // A download handed to the browser reports net::ERR_ABORTED on the blob URL; that is the download, not a failure.
    if (request.url().startsWith('blob:')) return;
    const line = `${request.method()} ${request.url()} ${failure}`;
    if (failure === 'net::ERR_ABORTED' && !request.isNavigationRequest()) {
      problems.aborted.push({ line, document: documentAtStart.get(request) ?? problems.documents });
      return;
    }
    problems.failed.push(line);
  });
  page.on('response', (response) => {
    if (response.status() >= 400) problems.http.push(`${response.status()} ${response.url()}`);
  });
  return problems;
}

/**
 * A full page load from the test (goto, reload) cancels whatever the last page still had in flight,
 * such as the idle search preload or a font (pass 4: run 2 caught this once on pages375). That is the
 * browser leaving the page, not a failure; the next page loads the file again. So net::ERR_ABORTED on
 * a request that began on an earlier document than the last one loaded is set aside (kept in
 * superseded for the record). Every other abort, and every other failure, still counts.
 */
export function settleAborted(problems: PageProblems): void {
  for (const { line, document } of problems.aborted.splice(0)) {
    if (document < problems.documents) problems.superseded.push(line);
    else problems.failed.push(line);
  }
}

export function expectNoProblems(problems: PageProblems): void {
  settleAborted(problems);
  expect(problems.page, 'page errors').toEqual([]);
  expect(problems.console, 'console errors').toEqual([]);
  expect(problems.failed, 'failed requests').toEqual([]);
  expect(problems.http, 'HTTP 400+ responses').toEqual([]);
}

/** Open a path and wait until the screen has drawn its level-1 heading (the "Opening" state is over). */
export async function openApp(page: Page, path: string): Promise<void> {
  await page.goto(path);
  await waitForScreen(page);
}

export async function waitForScreen(page: Page): Promise<void> {
  await expect(page.locator('main[aria-busy="true"]')).toHaveCount(0);
  await expect(page.locator('h1').first()).toBeVisible();
}

/** Tap the digits on the PIN pad that is on screen. */
export async function tapPin(page: Page, pin: string = PIN): Promise<void> {
  const pad = page.locator('fieldset.ui-pinpad').last();
  await expect(pad).toBeVisible();
  for (const digit of pin) {
    await pad.getByRole('button', { name: digit, exact: true }).click();
  }
}

/** Tap a new PIN twice (NewPinEntry: enter, then confirm). */
export async function tapNewPin(page: Page, pin: string = PIN): Promise<void> {
  await tapPin(page, pin);
  await expect(page.locator('fieldset.ui-pinpad legend')).toHaveText('Enter the same PIN again');
  await tapPin(page, pin);
}

/**
 * Click a button that hands the backup to the browser. In Chromium on Linux there is no share
 * sheet, so the app falls back to a download (src/core/backup.ts). Returns the download.
 */
export async function clickAndDownload(page: Page, name: string | RegExp): Promise<Download> {
  const button = page.getByRole('button', { name, exact: typeof name === 'string' });
  await expect(button).toBeEnabled();
  // The backup is prepared when the screen opens; wait until the button is no longer "Preparing".
  await expect(button).not.toHaveAttribute('aria-busy', 'true');
  const [download] = await Promise.all([page.waitForEvent('download'), button.click()]);
  return download;
}

/**
 * The setup flow through the UI (D12): "This is a study phone", create the PIN, save the first
 * backup (download in Chromium), Done. Ends on the Setup overview with every step done.
 */
export async function setUpStudyPhone(page: Page, pin: string = PIN): Promise<Download> {
  await openApp(page, '/settings/setup');
  await page.getByRole('button', { name: 'This is a study phone' }).click();
  await expect(page.getByText('Saved: this is a study phone. Next, set the owner PIN.')).toBeVisible();
  await page.getByRole('button', { name: 'Create the owner PIN' }).click();
  await tapNewPin(page, pin);
  await expect(page.getByRole('heading', { level: 1, name: 'Save your first backup' })).toBeVisible();
  const download = await clickAndDownload(page, 'Save your first backup');
  await page.getByRole('button', { name: 'Done', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Setup' })).toBeVisible();
  return download;
}

/**
 * Make this phone the shop phone through Start fresh (D12): the warning, the typed word "zero",
 * a new PIN twice, then the first backup on the result screen. Ends on the "Done" screen.
 */
export async function makeShopPhone(page: Page, opts: { pin?: string; backup?: boolean } = {}): Promise<Download | null> {
  const pin = opts.pin ?? PIN;
  await openApp(page, '/settings/device');
  await page.getByRole('button', { name: 'Start fresh', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Start fresh' })).toBeVisible();
  await page.getByLabel('Type zero to confirm').fill('zero');
  await page.getByRole('button', { name: 'Start fresh', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Create the owner PIN' })).toBeVisible();
  await tapNewPin(page, pin);
  await expect(page.getByText(/This is now the shop phone\./)).toBeVisible();
  if (opts.backup === false) return null;
  return clickAndDownload(page, 'Save your first backup');
}

/** Turn Customer View on from the Home mode switch (a shop phone only). */
export async function turnCustomerViewOn(page: Page): Promise<void> {
  await openApp(page, '/');
  await page.getByRole('group', { name: 'Mode' }).getByText('Customer', { exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-density', 'customer');
}

/** Read every row of one IndexedDB store of the app's database ("masterclass"). */
export async function readStore<T = Record<string, unknown>>(page: Page, store: string): Promise<T[]> {
  return page.evaluate(
    (name) =>
      new Promise<T[]>((resolve, reject) => {
        const request = indexedDB.open('masterclass');
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const db = request.result;
          try {
            const all = db.transaction(name, 'readonly').objectStore(name).getAll();
            all.onsuccess = () => {
              db.close();
              resolve(all.result as T[]);
            };
            all.onerror = () => {
              db.close();
              reject(all.error);
            };
          } catch (error) {
            db.close();
            reject(error);
          }
        };
      }),
    store,
  );
}

export interface SettingsRow {
  deviceRole: 'study' | 'shop';
  roleChosenAt: string | null;
  ownerPin: { hash: string; salt: string } | null;
  customerViewOn: boolean;
  focusReminderShown: boolean;
  backupReminderWeekly: boolean;
  lastBackupAt: string | null;
  developerPanel: boolean;
}

export async function readSettings(page: Page): Promise<SettingsRow> {
  const rows = await readStore<SettingsRow & { id: string }>(page, 'settings');
  const row = rows.find((r) => r.id === 'device');
  if (row === undefined) throw new Error('no settings row');
  return row;
}

/** Turn the production Developer tools toggle on (needs a PIN on the phone). */
export async function turnDeveloperToolsOn(page: Page, pin: string = PIN): Promise<void> {
  await openApp(page, '/settings');
  await page.getByRole('group', { name: 'Developer tools' }).getByText('On', { exact: true }).click();
  // The owner pass from creating the PIN may still be open; PinGate then skips the pad.
  const pad = page.locator('fieldset.ui-pinpad');
  if (await pad.isVisible().catch(() => false)) await tapPin(page, pin);
  await expect(page.getByRole('button', { name: 'Open the developer panel' })).toBeVisible();
}

/** Horizontal overflow of the page: scrollWidth beyond the viewport width. */
export async function horizontalOverflow(page: Page): Promise<{ scrollWidth: number; width: number }> {
  const width = page.viewportSize()?.width ?? 0;
  const scrollWidth = await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth));
  return { scrollWidth, width };
}

export interface SmallTarget {
  what: string;
  width: number;
  height: number;
}

/**
 * Every visible tap target on the page whose hit box is under minW x minH. A radio inside a
 * label (the segmented control) is measured by its label, which is what the finger hits.
 * Elements under aria-hidden (the visually hidden file input) are not targets.
 */
export async function measureTargets(page: Page, minW: number, minH: number): Promise<SmallTarget[]> {
  return page.evaluate(
    ({ minW: w, minH: h }) => {
      const out: { what: string; width: number; height: number }[] = [];
      const selector = 'button, a[href], [role="button"], [role="link"], input:not([type="hidden"]), select, textarea, summary';
      for (const el of Array.from(document.querySelectorAll<HTMLElement>(selector))) {
        if (el.closest('[aria-hidden="true"]') !== null) continue;
        let target: HTMLElement = el;
        if (el instanceof HTMLInputElement && (el.type === 'radio' || el.type === 'checkbox')) {
          const label = el.closest('label');
          if (label !== null) target = label;
        }
        const style = getComputedStyle(target);
        const box = target.getBoundingClientRect();
        if (style.display === 'none' || style.visibility === 'hidden' || box.width === 0 || box.height === 0) continue;
        if (target.offsetParent === null && style.position !== 'fixed') continue;
        if (box.width + 0.5 < w || box.height + 0.5 < h) {
          const name = (target.getAttribute('aria-label') ?? target.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 60);
          const cls = typeof target.className === 'string' && target.className !== '' ? `.${target.className.split(' ')[0]}` : '';
          out.push({ what: `${target.tagName.toLowerCase()}${cls} "${name}"`, width: Math.round(box.width), height: Math.round(box.height) });
        }
      }
      return out;
    },
    { minW, minH },
  );
}

/**
 * Anything internal on the page while Customer View is on (BLUEPRINT 3.4 and 3.8). Returns a list
 * of what leaked; empty means clean.
 */
export async function customerViewLeaks(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const out: string[] = [];
    const has = (selector: string) => document.querySelector(selector) !== null;
    if (has('[data-internal]')) out.push('an element inside <Internal>');
    if (has('nav[aria-label="Main"]')) out.push('the internal bottom row');
    if (has('header.app-top')) out.push('the internal top bar');
    if (has('.app-status')) out.push('the offline marker');
    if (has('.mc-dev')) out.push('the developer panel');
    if (has('.mc-preview, iframe.app-preview__frame')) out.push('the device preview');
    if (has('.ui-banner')) out.push(`a banner: ${(document.querySelector('.ui-banner')?.textContent ?? '').slice(0, 60)}`);
    if (has('.ui-toast')) out.push('a toast');
    if (has('.ui-drawer')) out.push('a drawer');
    if (has('fieldset.ui-pinpad')) out.push('a PIN pad');
    for (const a of Array.from(document.querySelectorAll('a[href]'))) {
      const href = a.getAttribute('href') ?? '';
      if (/\/(fixit|cards|search|settings|academy|job|business)(\/|$)/.test(href)) out.push(`an internal link to ${href}`);
    }
    const text = document.body.innerText;
    // Build words count as internal too (DEF-11): a customer never reads about phases or previews.
    for (const word of ['[VERIFY', '[SUPERSEDED', 'nverified', 'Fix It', 'Quick card', 'Quick Card', 'Developer', 'Install', 'owner PIN', 'Owner PIN', 'Set up this phone', 'Backup due', 'Update ready', 'Ready offline', 'founder', 'Phase', 'phase', 'preview', 'Preview', 'placeholder', 'reference/', 'Masterclass']) {
      if (text.includes(word)) out.push(`the text "${word}"`);
    }
    return out;
  });
}
