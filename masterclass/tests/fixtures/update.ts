/**
 * Helpers for the update tests (qa-adversary). Not imported by app code. Moved out of
 * tests/persistence/phase2-update.spec.ts in Phase 2 pass 5 so the first-session update suite
 * (tests/persistence/phase2-update-first-session.spec.ts) uses the same measures.
 *
 * "Taken over" is measured three ways: a controller change on the page, a reload (the page's own
 * mark is gone), and the app code the page runs (its index chunk). The job hooks are the app's own:
 * the jobs table (a job in progress with no pausedAt is a running stage, src/app/useJobRunning.ts
 * and updateBlocker in src/core/pwa.ts) and the settings row's customerViewOn. There is no Job
 * Runner until Phase 3, so a test writes the row the way an imported backup would.
 */
import { expect, type Page } from '@playwright/test';
import { waitForScreen } from './app';
import { SECOND_VERSION, type Site } from './site';

export interface SwState {
  controlled: boolean;
  waiting: boolean;
  active: string | null;
  sameDocument: boolean;
  controllerChanges: number;
  appScript: string | null;
}

type QaWindow = { __qaFirstDocument?: boolean; __qaControllerChanges?: number };

export async function swState(page: Page): Promise<SwState> {
  return page.evaluate(async () => {
    const r = await navigator.serviceWorker.getRegistration();
    const w = window as unknown as QaWindow;
    return {
      controlled: navigator.serviceWorker.controller !== null,
      waiting: r?.waiting != null,
      active: r?.active?.state ?? null,
      sameDocument: w.__qaFirstDocument === true,
      controllerChanges: w.__qaControllerChanges ?? -1,
      appScript: document.querySelector('script[type="module"][src*="assets/index-"]')?.getAttribute('src') ?? null,
    };
  });
}

/** Mark this document: a reload clears the mark, and a takeover counts a controller change. */
export async function markDocument(page: Page): Promise<void> {
  await page.evaluate(() => {
    const w = window as unknown as QaWindow;
    w.__qaFirstDocument = true;
    w.__qaControllerChanges = 0;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      w.__qaControllerChanges = (w.__qaControllerChanges ?? 0) + 1;
    });
  });
}

/** Count every page load from now on (a reload, or a navigation that loads a document). */
export function countLoads(page: Page): () => number {
  let loads = 0;
  page.on('load', () => {
    loads += 1;
  });
  return () => loads;
}

/** Open the first version and wait until its saved copy serves the page. Returns the app code it runs. */
export async function openFirstVersion(page: Page, site: Site): Promise<string> {
  await page.goto(site.url);
  await waitForScreen(page);
  await expect(page.locator('.app-status')).toContainText('Ready offline', { timeout: 20_000 });
  await markDocument(page);
  const state = await swState(page);
  expect(state).toMatchObject({ controlled: true, waiting: false, active: 'activated' });
  expect(state.appScript).not.toBeNull();
  return state.appScript ?? '';
}

/** The person comes back to the app: the app's own update check (visibilitychange, src/core/pwa.ts). */
export async function personReturns(page: Page): Promise<void> {
  await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
}

export async function waitForWaitingUpdate(page: Page): Promise<void> {
  await expect.poll(async () => (await swState(page)).waiting, { timeout: 20_000, message: 'the second version is downloaded and waiting' }).toBe(true);
}

export const updateBanner = (page: Page) => page.locator('.ui-banner').filter({ hasText: 'Update ready' });
export const installingBanner = (page: Page) => page.locator('.ui-banner').filter({ hasText: 'Installing the update' });

export async function notTakenOver(page: Page, firstScript: string, where: string): Promise<void> {
  expect(await swState(page), where).toMatchObject({ controlled: true, waiting: true, active: 'activated', sameDocument: true, controllerChanges: 0, appScript: firstScript });
}

/** Keep working on the first version: a fix, its procedure (a lazy piece), and a lesson. */
export async function keepWorking(page: Page): Promise<void> {
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Fix It' }).click();
  await page.getByRole('button', { name: /^Polisher jerks, walks, or hops side to side/ }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Polisher jerks, walks, or hops side to side' })).toBeVisible();
  await page.getByRole('list', { name: 'Related' }).getByRole('button', { name: /^Machine polishing, one-step/ }).click();
  await expect(page.getByRole('list', { name: 'The steps' })).toBeVisible();
  await expect(page.getByText(/did not load/)).toHaveCount(0);
}

export async function putJob(page: Page, row: object): Promise<void> {
  await page.evaluate(
    (job) =>
      new Promise<void>((resolve, reject) => {
        const request = indexedDB.open('masterclass');
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const db = request.result;
          const tx = db.transaction('jobs', 'readwrite');
          tx.objectStore('jobs').put(job);
          tx.oncomplete = () => {
            db.close();
            resolve();
          };
          tx.onerror = () => {
            db.close();
            reject(tx.error);
          };
        };
      }),
    row,
  );
}

export async function setCustomerView(page: Page, on: boolean): Promise<void> {
  await page.evaluate(
    (value) =>
      new Promise<void>((resolve, reject) => {
        const request = indexedDB.open('masterclass');
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const db = request.result;
          const tx = db.transaction('settings', 'readwrite');
          const store = tx.objectStore('settings');
          const get = store.get('device');
          get.onsuccess = () => store.put({ ...get.result, customerViewOn: value });
          tx.oncomplete = () => {
            db.close();
            resolve();
          };
          tx.onerror = () => {
            db.close();
            reject(tx.error);
          };
        };
      }),
    on,
  );
}

/**
 * Hand the waiting version the page from outside this screen's Update now: what another tab's
 * Update now (or a browser's own "skip waiting") does. The app's guard must still decide when this
 * page reloads.
 */
export async function skipWaitingFromOutside(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const r = await navigator.serviceWorker.getRegistration();
    r?.waiting?.postMessage({ type: 'SKIP_WAITING' });
  });
}

/** The new version reached this page: the second version runs, it is served by the saved copy, and the app says so. */
export async function expectSecondVersion(page: Page, firstScript: string): Promise<void> {
  await waitForScreen(page);
  await page.waitForTimeout(1_500);
  const state = await swState(page);
  expect(state.appScript).not.toBe(firstScript);
  expect(state).toMatchObject({ controlled: true, waiting: false, active: 'activated', sameDocument: false });
  await expect(page.locator('.ui-banner').filter({ hasText: 'Updated' })).toContainText(`This phone now runs version ${SECOND_VERSION}.`);
  await expect(page.locator('.app-status')).toContainText('Ready offline');
  await expect(installingBanner(page)).toHaveCount(0);
}

/** Tap Update now and wait for the one reload into the second version. Returns how many page loads followed. */
export async function tapUpdateNow(page: Page, firstScript: string, opts: { double?: boolean } = {}): Promise<number> {
  const loads = countLoads(page);
  const button = updateBanner(page).getByRole('button', { name: 'Update now' });
  if (opts.double === true) await button.dblclick();
  else await button.click();
  await expect.poll(loads, { timeout: 20_000, message: 'the page reloads into the new version' }).toBeGreaterThanOrEqual(1);
  await expectSecondVersion(page, firstScript);
  return loads();
}
