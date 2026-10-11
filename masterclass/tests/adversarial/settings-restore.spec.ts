/**
 * Fix-wave recheck of DEF-13 in the browser, the restore side (D12 amendment; BLUEPRINT 3.8
 * "Unreadable settings"). A shop phone holding 25 cars and 2 sign-offs is rolled back so its role
 * reads "crewTablet". Its backup is saved through the real Backup screen, then restored through the
 * real Restore screen onto: the same broken phone, a shop phone with its own PIN, a study phone with
 * no PIN, and the shop path ("Import the newest backup"), which must refuse it.
 *
 * What must never happen: the file grants the shop role or a PIN; a sign-off comes back clean
 * without the PIN that made it; a screen sends the person back to the screen that just failed.
 */
import { readFileSync } from 'node:fs';
import { expect, test, type Page } from '@playwright/test';
import { PIN, clickAndDownload, horizontalOverflow, makeShopPhone, measureTargets, openApp, readSettings, readStore, setUpStudyPhone, tapPin, waitForScreen, watchProblems } from '../fixtures/app';
import { T0, carsLog, qaId } from '../fixtures/jobs';

const HERE_PIN = '135790';
const JOBS = 30; // carsLog(25): 25 paint cars and 5 jobs that never count

async function idb(page: Page, store: string, op: 'put' | 'patch', rows: unknown[]): Promise<void> {
  await page.evaluate(
    ({ name, mode, items }) =>
      new Promise<void>((resolve, reject) => {
        const request = indexedDB.open('masterclass');
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const tx = request.result.transaction(name, 'readwrite');
          const os = tx.objectStore(name);
          if (mode === 'put') for (const item of items) os.put(item);
          else {
            const get = os.get('device');
            get.onsuccess = () => os.put({ ...(get.result as object), ...(items[0] as object) });
          }
          tx.oncomplete = () => {
            request.result.close();
            resolve();
          };
          tx.onerror = () => reject(tx.error);
        };
      }),
    { name: store, mode: op, items: rows },
  );
}

function signOff(): Record<string, unknown> {
  return { id: qaId(), createdAt: T0, updatedAt: T0, crewId: qaId(), skillId: 'skill-polish', action: 'signoff', reason: null, ownerVerifiedAt: T0, needsRecheck: false, at: T0 };
}

/** The broken phone: a shop phone with history whose stored role a newer version changed. */
async function brokenShopPhone(page: Page): Promise<void> {
  await makeShopPhone(page, { backup: false });
  await idb(page, 'jobs', 'put', carsLog(25));
  await idb(page, 'signOffs', 'put', [signOff(), signOff()]);
  await idb(page, 'settings', 'patch', [{ deviceRole: 'crewTablet', carsLoggedBefore: 40 }]);
}

/** Save the backup through the Backup screen and return its text. */
async function saveUnreadableBackup(page: Page): Promise<string> {
  await openApp(page, '/');
  await expect(page.getByText('Settings could not be read', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Open Backup' }).click();
  await waitForScreen(page);
  await expect(page.getByText(/role and owner PIN could not be read, so the shop tools stay locked/)).toBeVisible();
  const words = await page.locator('main').innerText();
  expect(words).not.toMatch(/open Settings, Backup|backup could not be prepared|Unrecognized|Invalid option|expected/);
  const download = await clickAndDownload(page, 'Save backup');
  return readFileSync(await download.path(), 'utf8');
}

async function pickRestoreFile(page: Page, text: string): Promise<void> {
  await openApp(page, '/settings/backup');
  await page.getByRole('button', { name: 'Restore from a file' }).click();
  await page.locator('input[type="file"]').setInputFiles({ name: 'masterclass-backup.json', mimeType: 'application/json', buffer: Buffer.from(text) });
  await expect(page.getByLabel('What this backup holds').first()).toBeVisible();
}

async function apply(page: Page): Promise<void> {
  await page.getByLabel(/Type replace to confirm/).fill('replace');
  await page.getByRole('button', { name: 'Apply', exact: true }).click();
}

async function needsRecheck(page: Page): Promise<boolean[]> {
  return (await readStore<{ needsRecheck: boolean }>(page, 'signOffs')).map((s) => s.needsRecheck);
}

test('the broken phone saves every job, then restores its own file with the typed word only: a study phone with no PIN, sign-offs flagged', async ({ page }) => {
  const problems = watchProblems(page);
  await brokenShopPhone(page);
  const text = await saveUnreadableBackup(page);
  const file = JSON.parse(text) as Record<string, unknown> & { tables: { jobs: unknown[]; signOffs: unknown[]; settings: unknown[] } };
  expect(file).not.toHaveProperty('deviceRole');
  expect(file.settingsUnreadable).toMatchObject({ reasons: ['deviceRoleUnreadable'], rawRowComplete: true });
  expect(file.tables.settings).toEqual([]);
  expect(file.tables.jobs).toHaveLength(JOBS);
  expect(file.tables.signOffs).toHaveLength(2);

  await pickRestoreFile(page, text);
  // The counts first: this phone now, then the file. Then the words, the offer, and the typed word.
  const main = page.locator('main');
  await expect(main.getByText(`This phone now: ${JOBS} jobs`)).toBeVisible();
  await expect(main.getByText(/the PIN cannot be checked here\. Save a backup of this phone first/)).toBeVisible();
  await expect(main.getByText(/After the restore this phone is a study phone with no PIN/)).toBeVisible();
  await expect(main.getByText(/2 sign-offs come back marked needs re-check/)).toBeVisible();
  // The offered backup of this phone works from the confirm itself.
  const offered = await clickAndDownload(page, 'Save a backup of this phone');
  const offeredFile = JSON.parse(readFileSync(await offered.path(), 'utf8')) as { tables: { jobs: unknown[] }; settingsUnreadable?: unknown };
  expect(offeredFile.tables.jobs).toHaveLength(JOBS);
  expect(offeredFile.settingsUnreadable).toBeDefined();
  const order = await main.innerText();
  expect(order.indexOf('This phone now')).toBeLessThan(order.indexOf('What this backup holds') === -1 ? order.indexOf('Saved on') : order.indexOf('What this backup holds'));
  const small = [...(await measureTargets(page, 44, 44)), ...(await measureTargets(page, 0, 64))];
  expect(small).toEqual([]);
  const overflow = await horizontalOverflow(page);
  expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.width);

  await apply(page);
  // No PIN pad: this phone cannot check its own PIN.
  await expect(page.getByRole('button', { name: 'Done', exact: true })).toBeVisible();
  await expect(page.locator('fieldset.ui-pinpad')).toHaveCount(0);
  await expect(main.getByText(/Device role: study phone\. 2 sign-offs are marked needs re-check\. Set this phone up again/i)).toBeVisible();
  const row = await readSettings(page);
  expect(row).toMatchObject({ deviceRole: 'study', ownerPin: null, roleChosenAt: null, customerViewOn: false });
  expect(await readStore(page, 'jobs')).toHaveLength(JOBS);
  expect(await needsRecheck(page)).toEqual([true, true]);

  // No gate opened: no Customer View, no job screens, and the setup banner starts again.
  await openApp(page, '/');
  await expect(page.getByText('Settings could not be read', { exact: true })).toHaveCount(0);
  await expect(page.getByText(/Is this the shop phone\?/).first()).toBeVisible();
  await page.getByRole('group', { name: 'Mode' }).getByText('Customer', { exact: true }).click();
  await page.waitForTimeout(300);
  await expect(page.locator('html')).not.toHaveAttribute('data-density', 'customer');
  await openApp(page, '/job');
  await expect(page.getByText('Jobs run on the shop phone only. This phone is a study phone.')).toBeVisible();
  expect(problems.page).toEqual([]);
});

test('the same file on a shop phone with its own PIN: that PIN first, then it stays the shop phone with its own PIN; sign-offs flagged', async ({ page, browser }) => {
  await brokenShopPhone(page);
  const text = await saveUnreadableBackup(page);

  const next = await browser.newPage({ viewport: page.viewportSize() ?? undefined });
  await makeShopPhone(next, { pin: HERE_PIN, backup: false });
  const before = await readSettings(next);
  await pickRestoreFile(next, text);
  await expect(next.getByText(/This phone keeps its own role and PIN/)).toBeVisible();
  await expect(next.getByText(/cannot say how many cars were logged before this app, so this phone keeps its own number \(0\)/)).toBeVisible();
  await apply(next);
  // The owner pass from Start fresh may still be open in this page; a reload-free run skips the pad.
  const pad = next.locator('fieldset.ui-pinpad');
  if (await pad.isVisible().catch(() => false)) {
    await tapPin(next, PIN);
    await expect(next.getByText(/Wrong PIN/)).toBeVisible();
    await tapPin(next, HERE_PIN);
  }
  await expect(next.getByRole('button', { name: 'Done', exact: true })).toBeVisible();
  const after = await readSettings(next);
  expect(after.deviceRole).toBe('shop');
  expect(after.ownerPin).toEqual(before.ownerPin);
  expect(await readStore(next, 'jobs')).toHaveLength(JOBS);
  expect(await needsRecheck(next)).toEqual([true, true]);
  await next.close();
});

test('the same file with a fresh owner pass closed: the PIN pad asks for this phone PIN, and the file PIN is wrong', async ({ page, browser }) => {
  await brokenShopPhone(page);
  const text = await saveUnreadableBackup(page);
  const next = await browser.newPage({ viewport: page.viewportSize() ?? undefined });
  await makeShopPhone(next, { pin: HERE_PIN, backup: false });
  await next.reload(); // the owner pass lives in memory only
  await pickRestoreFile(next, text);
  await apply(next);
  await expect(next.locator('fieldset.ui-pinpad legend')).toHaveText('This phone has an owner PIN. Enter it to replace its data.');
  await tapPin(next, PIN);
  await expect(next.getByText(/Wrong PIN/)).toBeVisible();
  expect(await readStore(next, 'jobs')).toHaveLength(0);
  await tapPin(next, HERE_PIN);
  await expect(next.getByRole('button', { name: 'Done', exact: true })).toBeVisible();
  expect((await readSettings(next)).deviceRole).toBe('shop');
  await next.close();
});

test('the same file on a study phone with no PIN: the typed word only, still a study phone with no PIN', async ({ page, browser }) => {
  await brokenShopPhone(page);
  const text = await saveUnreadableBackup(page);
  const next = await browser.newPage({ viewport: page.viewportSize() ?? undefined });
  await openApp(next, '/settings/setup');
  await next.getByRole('button', { name: 'This is a study phone' }).click();
  await expect(next.getByText(/Saved: this is a study phone/)).toBeVisible();
  await pickRestoreFile(next, text);
  await apply(next);
  await expect(next.getByRole('button', { name: 'Done', exact: true })).toBeVisible();
  await expect(next.locator('fieldset.ui-pinpad')).toHaveCount(0);
  expect(await readSettings(next)).toMatchObject({ deviceRole: 'study', ownerPin: null });
  expect(await needsRecheck(next)).toEqual([true, true]);
  await next.close();
});

test('the shop path refuses the file in words that name Start fresh and restore, and Cancel changes nothing', async ({ page, browser }) => {
  await brokenShopPhone(page);
  const text = await saveUnreadableBackup(page);
  const next = await browser.newPage({ viewport: page.viewportSize() ?? undefined });
  await setUpStudyPhone(next);
  const before = await readSettings(next);
  await openApp(next, '/settings/device');
  await next.getByRole('button', { name: 'Import the newest backup' }).click();
  await next.locator('input[type="file"]').setInputFiles({ name: 'masterclass-backup.json', mimeType: 'application/json', buffer: Buffer.from(text) });
  await expect(next.getByText(/role and owner PIN could not be read, so it cannot make this phone the shop phone\. Use Start fresh with your PIN, then restore this backup/)).toBeVisible();
  await expect(next.getByRole('button', { name: 'Yes, this is the newest backup' })).toBeDisabled();
  await next.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(next.getByRole('heading', { level: 1, name: 'Device role' })).toBeVisible();
  expect(await readSettings(next)).toEqual(before);
  expect(await readStore(next, 'jobs')).toHaveLength(0);
  await next.close();
});

test('a refresh on the restore confirm of the broken phone, after typing the word but before Apply: nothing was written', async ({ page }) => {
  await brokenShopPhone(page);
  const text = await saveUnreadableBackup(page);
  await idb(page, 'jobs', 'put', carsLog(0).slice(0, 2)); // this phone now holds 2 more jobs than the file
  await pickRestoreFile(page, text);
  await expect(page.getByText(/This backup holds fewer jobs \(30\) than this phone has now \(32\)/)).toBeVisible();
  await page.getByLabel(/Type replace to confirm/).fill('replace');
  await page.reload();
  await waitForScreen(page);
  expect(await readStore(page, 'jobs')).toHaveLength(JOBS + 2);
  expect((await readSettings(page)).deviceRole as string).toBe('crewTablet');
  await expect(page.getByText('Settings could not be read', { exact: true })).toHaveCount(0); // the Backup screen says it in its own words
  await expect(page.getByText(/shop tools stay locked/)).toBeVisible();
});
