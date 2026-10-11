/**
 * "Hand over to another phone" in the browser (D12 amendment, 2026-10-11 [HOUSE default]; BLUEPRINT
 * 3.8 "Hand over" and the refresh rule in 3.8). Chromium on Linux has no share sheet, so an init
 * script stands one in: sessionStorage "qa-share" picks what it does (resolve, abort, pending, or
 * off, which is no share sheet at all), and every file it is handed is kept as text for the test.
 *
 * What must hold: the owner PIN comes first; Cancel changes nothing; the phone stays the shop phone
 * until the share resolves; then it is a study phone with its jobs and PIN, one roleChange entry,
 * and no job screens; the shared file makes the next phone the shop phone with the same counts.
 */
import { expect, test, type Page } from '@playwright/test';
import { PIN, expectNoProblems, horizontalOverflow, makeShopPhone, measureTargets, openApp, readSettings, readStore, tapPin, watchProblems } from '../fixtures/app';
import { carsLog, founderLog } from '../fixtures/jobs';

type ShareMode = 'resolve' | 'abort' | 'pending' | 'full' | 'off';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const mode = () => window.sessionStorage.getItem('qa-share') ?? 'off';
    const w = window as unknown as { __qaShare: { calls: number; files: string[] } };
    w.__qaShare = { calls: 0, files: [] };
    Object.defineProperty(navigator, 'canShare', { configurable: true, value: () => mode() !== 'off' });
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: async (data: ShareData) => {
        if (mode() === 'off') throw new DOMException('no share sheet', 'NotAllowedError');
        w.__qaShare.calls += 1;
        for (const file of data.files ?? []) w.__qaShare.files.push(await file.text());
        if (mode() === 'abort') throw new DOMException('closed', 'AbortError');
        if (mode() === 'pending') return new Promise<void>(() => undefined);
        // 'full': the share goes through, then the phone runs out of space before the switch is written.
        if (mode() === 'full') {
          const quota = () => {
            throw new DOMException('The quota has been exceeded.', 'QuotaExceededError');
          };
          IDBObjectStore.prototype.put = quota;
          IDBObjectStore.prototype.add = quota;
        }
        // A real share sheet stays up while the person picks a target; it never resolves at once.
        await new Promise((resolve) => setTimeout(resolve, 300));
      },
    });
  });
});

async function setShare(page: Page, mode: ShareMode): Promise<void> {
  await page.evaluate((m) => window.sessionStorage.setItem('qa-share', m), mode);
}

async function shareLog(page: Page): Promise<{ calls: number; files: string[] }> {
  return page.evaluate(() => (window as unknown as { __qaShare: { calls: number; files: string[] } }).__qaShare);
}

/** Add rows to one store behind the app's back (raw IndexedDB), as a shop phone with history would have. */
async function seed(page: Page, store: string, rows: unknown[]): Promise<void> {
  await page.evaluate(
    ({ name, items }) =>
      new Promise<void>((resolve, reject) => {
        const request = indexedDB.open('masterclass');
        request.onsuccess = () => {
          const tx = request.result.transaction(name, 'readwrite');
          for (const item of items) tx.objectStore(name).put(item);
          tx.oncomplete = () => {
            request.result.close();
            resolve();
          };
          tx.onerror = () => reject(tx.error);
        };
        request.onerror = () => reject(request.error);
      }),
    { name: store, items: rows },
  );
}

async function audit(page: Page, type: string): Promise<string[]> {
  return (await readStore<{ type: string; detail: string }>(page, 'auditLog')).filter((a) => a.type === type).map((a) => a.detail);
}

/** A shop phone with 25 paint cars and 4 founder jobs, reloaded so the owner pass from creating the PIN is gone. */
async function shopPhoneWithJobs(page: Page, mode: ShareMode): Promise<number> {
  await makeShopPhone(page, { backup: false });
  const rows = [...carsLog(25), ...founderLog(4)];
  await seed(page, 'jobs', rows);
  await setShare(page, mode);
  await openApp(page, '/settings/device');
  return rows.length;
}

async function smallTargets(page: Page, where: string): Promise<string[]> {
  const found = [...(await measureTargets(page, 44, 44)), ...(await measureTargets(page, 0, 64))];
  const overflow = await horizontalOverflow(page);
  const out = found.map((t) => `${where}: ${t.what} ${t.width}x${t.height}`);
  if (overflow.scrollWidth > overflow.width) out.push(`${where}: horizontal scroll ${overflow.scrollWidth} > ${overflow.width}`);
  return out;
}

test('the PIN comes first, Cancel changes nothing, and only the resolved share makes this a study phone', async ({ page, browser }) => {
  const problems = watchProblems(page);
  const jobs = await shopPhoneWithJobs(page, 'resolve');
  const before = await readSettings(page);
  const auditBefore = await readStore(page, 'auditLog');
  const layout: string[] = [];

  // 1. The PIN pad, then Cancel: nothing changed.
  await page.getByRole('button', { name: 'Hand over to another phone' }).click();
  await expect(page.locator('fieldset.ui-pinpad legend')).toHaveText('Enter the owner PIN to hand over this phone');
  layout.push(...(await smallTargets(page, 'hand over PIN')));
  await page.locator('fieldset.ui-pinpad').getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Device role' })).toBeVisible();
  expect(await readSettings(page)).toEqual(before);
  expect(await readStore(page, 'auditLog')).toEqual(auditBefore);
  expect((await shareLog(page)).calls).toBe(0);

  // 2. The PIN, then the one button. Still the shop phone until the share resolves.
  await page.getByRole('button', { name: 'Hand over to another phone' }).click();
  await tapPin(page, PIN);
  const go = page.getByRole('button', { name: 'Save backup and hand over' });
  await expect(go).toBeEnabled();
  await expect(go).not.toHaveAttribute('aria-busy', 'true');
  await expect(page.getByText(`The backup holds ${jobs} jobs`)).toBeVisible();
  layout.push(...(await smallTargets(page, 'hand over ready')));
  expect((await readSettings(page)).deviceRole).toBe('shop');
  await go.click();

  // 3. Done: a study phone with its PIN and jobs, one roleChange, one more export.
  await expect(page.getByText(/This phone is now a study phone\. On the new phone/)).toBeVisible();
  layout.push(...(await smallTargets(page, 'hand over result')));
  const after = await readSettings(page);
  expect(after).toMatchObject({ deviceRole: 'study', customerViewOn: false });
  expect(after.ownerPin).toEqual(before.ownerPin);
  expect(await audit(page, 'roleChange')).toContain('Shop phone to study phone (hand over)');
  expect((await audit(page, 'roleChange')).filter((d) => d.includes('(hand over)'))).toHaveLength(1);
  expect(await audit(page, 'export')).toHaveLength(1);
  expect(await readStore(page, 'jobs')).toHaveLength(jobs);
  expect(layout).toEqual([]);
  // The file the share sheet carried (read before any navigation clears the stub's memory).
  const { files } = await shareLog(page);

  // 4. The old phone runs no shop tools: no jobs, no Business room, no Customer View, no Hand over.
  await openApp(page, '/job');
  await expect(page.getByText('Jobs run on the shop phone only. This phone is a study phone.')).toBeVisible();
  await openApp(page, '/business');
  await expect(page.getByText('The Business room opens on the shop phone only. This phone is a study phone.')).toBeVisible();
  await openApp(page, '/');
  await page.getByRole('group', { name: 'Mode' }).getByText('Customer', { exact: true }).click();
  await page.waitForTimeout(300);
  await expect(page.locator('html')).not.toHaveAttribute('data-density', 'customer');
  expect((await readSettings(page)).customerViewOn).toBe(false);
  await openApp(page, '/settings/device');
  await expect(page.getByText('This is a study phone.', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Hand over to another phone' })).toHaveCount(0);
  expectNoProblems(problems);

  // 5. The shared file makes a new phone the shop phone with the same jobs (the D12 import).
  expect(files).toHaveLength(1);
  const file = JSON.parse(files[0] ?? '{}') as { deviceRole: string; tables: { jobs: unknown[] } };
  expect(file.deviceRole).toBe('shop');
  expect(file.tables.jobs).toHaveLength(jobs);
  const next = await browser.newPage({ viewport: page.viewportSize() ?? undefined });
  await openApp(next, '/settings/device');
  await next.getByRole('button', { name: 'Import the newest backup' }).click();
  await next.locator('input[type="file"]').setInputFiles({ name: 'masterclass-backup.json', mimeType: 'application/json', buffer: Buffer.from(files[0] ?? '') });
  await next.getByRole('button', { name: 'Yes, this is the newest backup' }).click();
  await expect(next.getByText(new RegExp(`This is now the shop phone, with ${jobs} jobs`))).toBeVisible();
  expect((await readSettings(next)).deviceRole).toBe('shop');
  await next.close();
});

test('a closed share sheet: still the shop phone, nothing written, and the screen says so with Try again and Cancel', async ({ page }) => {
  await shopPhoneWithJobs(page, 'abort');
  const before = await readSettings(page);
  await page.getByRole('button', { name: 'Hand over to another phone' }).click();
  await tapPin(page, PIN);
  const go = page.getByRole('button', { name: 'Save backup and hand over' });
  await expect(go).not.toHaveAttribute('aria-busy', 'true');
  await go.click();
  await expect(page.getByText('Nothing changed. This phone stays the shop phone until the backup is saved through the share sheet.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Try again' })).toBeVisible();
  expect(await readSettings(page)).toEqual(before);
  expect(await audit(page, 'export')).toEqual([]);
  expect((await audit(page, 'roleChange')).filter((d) => d.includes('(hand over)'))).toEqual([]);
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Device role' })).toBeVisible();
  await expect(page.getByText('This is the shop phone.', { exact: true })).toBeVisible();
});

test('the share sheet left open, then a reload: nothing was written and the app reopens as the shop phone', async ({ page }) => {
  await shopPhoneWithJobs(page, 'pending');
  await page.getByRole('button', { name: 'Hand over to another phone' }).click();
  await tapPin(page, PIN);
  const go = page.getByRole('button', { name: 'Save backup and hand over' });
  await expect(go).not.toHaveAttribute('aria-busy', 'true');
  await go.click();
  await expect(page.getByRole('button', { name: /Opening the share sheet/ })).toBeVisible();
  // While the share is open there is no Cancel inside the panel (one transaction follows).
  await expect(page.locator('main').getByRole('button', { name: 'Cancel', exact: true })).toHaveCount(0);
  expect((await readSettings(page)).deviceRole).toBe('shop');
  await page.reload();
  await expect(page.getByRole('heading', { level: 1, name: 'Device role' })).toBeVisible();
  await expect(page.getByText('This is the shop phone.', { exact: true })).toBeVisible();
  expect((await audit(page, 'roleChange')).filter((d) => d.includes('(hand over)'))).toEqual([]);
});

test('the phone locks on the ready screen: the owner pass ends, the tap goes back to the PIN, and nothing is shared', async ({ page }) => {
  await shopPhoneWithJobs(page, 'resolve');
  await page.getByRole('button', { name: 'Hand over to another phone' }).click();
  await tapPin(page, PIN);
  const go = page.getByRole('button', { name: 'Save backup and hand over' });
  await expect(go).not.toHaveAttribute('aria-busy', 'true');
  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' });
    document.dispatchEvent(new Event('visibilitychange'));
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'visible' });
  });
  await go.click();
  await expect(page.locator('fieldset.ui-pinpad legend')).toHaveText('Enter the owner PIN to hand over this phone');
  expect((await shareLog(page)).calls).toBe(0);
  expect((await readSettings(page)).deviceRole).toBe('shop');
});

test('double taps: on the last PIN digit the button below never fires; on the button the share sheet opens once', async ({ page }) => {
  await shopPhoneWithJobs(page, 'resolve');
  await page.getByRole('button', { name: 'Hand over to another phone' }).click();
  const pad = page.locator('fieldset.ui-pinpad');
  await tapPin(page, PIN.slice(0, 5));
  const last = await pad.getByRole('button', { name: PIN.slice(5), exact: true }).boundingBox();
  if (last === null) throw new Error('key not visible');
  await page.mouse.click(last.x + last.width / 2, last.y + last.height / 2);
  await page.waitForTimeout(40);
  await page.mouse.click(last.x + last.width / 2, last.y + last.height / 2);
  const go = page.getByRole('button', { name: 'Save backup and hand over' });
  await expect(go).toBeVisible();
  await page.waitForTimeout(500);
  expect((await shareLog(page)).calls).toBe(0);
  expect((await readSettings(page)).deviceRole).toBe('shop');

  await expect(go).not.toHaveAttribute('aria-busy', 'true');
  const box = await go.boundingBox();
  if (box === null) throw new Error('button not visible');
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await page.waitForTimeout(40);
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await expect(page.getByText(/This phone is now a study phone\./)).toBeVisible();
  await page.waitForTimeout(300);
  expect((await shareLog(page)).calls).toBe(1);
  expect((await audit(page, 'roleChange')).filter((d) => d.includes('(hand over)'))).toHaveLength(1);
});

test('no file share sheet on this device: no Hand over button, and the two separate steps are named', async ({ page }) => {
  await shopPhoneWithJobs(page, 'off');
  await expect(page.getByRole('button', { name: 'Hand over to another phone' })).toHaveCount(0);
  await expect(page.getByText(/do it in two steps/)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Make this a study phone' })).toBeVisible();
});

test('storage full right after the share: the words say the backup left but the phone is still the shop phone, with a way on', async ({ page }) => {
  const problems = watchProblems(page);
  await shopPhoneWithJobs(page, 'full');
  await page.getByRole('button', { name: 'Hand over to another phone' }).click();
  await tapPin(page, PIN);
  const go = page.getByRole('button', { name: 'Save backup and hand over' });
  await expect(go).not.toHaveAttribute('aria-busy', 'true');
  await go.click();
  await expect(page.getByText(/The backup was saved, but this phone could not switch itself to a study phone\./)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Try again' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Cancel', exact: true })).toBeVisible();
  expect(problems.page).toEqual([]);
  // A reload (the person gives up): nothing half-written, still the shop phone.
  await setShare(page, 'resolve');
  await page.reload();
  await expect(page.getByRole('heading', { level: 1, name: 'Device role' })).toBeVisible();
  await expect(page.getByText('This is the shop phone.', { exact: true })).toBeVisible();
  expect((await audit(page, 'roleChange')).filter((d) => d.includes('(hand over)'))).toEqual([]);
});
