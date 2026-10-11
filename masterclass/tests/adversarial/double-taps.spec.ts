/**
 * Impatient and confused users (CLAUDE.md adversarial QA): double taps on every button that
 * writes or moves the flow, taps that land on the next screen, and walking away mid-flow.
 * A double tap is two clicks 40 ms apart at the same spot, so the second can land on whatever the
 * first one drew there, which is what a real thumb does.
 */
import { expect, test, type Locator, type Page } from '@playwright/test';
import { PIN, expectNoProblems, makeShopPhone, openApp, readSettings, readStore, setUpStudyPhone, tapPin, watchProblems } from '../fixtures/app';

async function doubleTap(page: Page, target: Locator): Promise<void> {
  await expect(target).toBeEnabled();
  await target.scrollIntoViewIfNeeded();
  const box = await target.boundingBox();
  if (box === null) throw new Error('target not visible');
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.mouse.click(x, y);
  await page.waitForTimeout(40);
  await page.mouse.click(x, y);
}

async function auditTypes(page: Page): Promise<string[]> {
  return (await readStore<{ type: string }>(page, 'auditLog')).map((a) => a.type).sort();
}

test('double tap "This is a study phone": one write, one audit entry', async ({ page }) => {
  const problems = watchProblems(page);
  await openApp(page, '/settings/setup');
  await doubleTap(page, page.getByRole('button', { name: 'This is a study phone' }));
  await expect(page.getByText('Saved: this is a study phone. Next, set the owner PIN.')).toBeVisible();
  await page.waitForTimeout(300);
  expect(await auditTypes(page)).toEqual(['roleChange']);
  expectNoProblems(problems);
});

test('double tap "Create the owner PIN": one PIN pad, and the second tap does not count as a digit', async ({ page }) => {
  await openApp(page, '/settings/setup');
  await doubleTap(page, page.getByRole('button', { name: 'Create the owner PIN' }));
  await expect(page.locator('fieldset.ui-pinpad')).toHaveCount(1);
  // If the second tap had landed on a key, one dot would be filled.
  const filled = await page.locator('.ui-pinpad__dot[data-filled="true"]').count();
  test.info().annotations.push({ type: 'dots-after-double-tap', description: String(filled) });
  expect(await readSettings(page).then((s) => s.ownerPin)).toBeNull();
});

test('double tap on the last digit of the PIN confirmation: one PIN saved, one audit entry, no error', async ({ page }) => {
  const problems = watchProblems(page);
  await openApp(page, '/settings/setup');
  await page.getByRole('button', { name: 'Create the owner PIN' }).click();
  await tapPin(page, PIN);
  await tapPin(page, PIN.slice(0, 5));
  await doubleTap(page, page.locator('fieldset.ui-pinpad').getByRole('button', { name: PIN.slice(5), exact: true }));
  await expect(page.getByRole('heading', { level: 1, name: 'Save your first backup' })).toBeVisible();
  await page.waitForTimeout(300);
  expect(await auditTypes(page)).toEqual(['pinSet']);
  expectNoProblems(problems);
});

test('double tap "This is the shop phone" with the owner pass open: nothing is written, whatever the second tap hits', async ({ page }) => {
  await setUpStudyPhone(page);
  // Move inside the app (no reload), so the pass from creating the PIN is still open: the PIN step
  // is skipped and the choice screen (Import, Start fresh, Cancel) appears under the second tap.
  await page.getByRole('banner').getByRole('link', { name: 'Settings' }).click();
  await page.getByRole('listitem').filter({ hasText: 'Device role' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Device role' })).toBeVisible();
  const before = await readSettings(page);
  const auditBefore = await auditTypes(page);
  await doubleTap(page, page.getByRole('button', { name: 'This is the shop phone' }));
  await page.waitForTimeout(400);
  const heading = await page.locator('h1').first().innerText();
  test.info().annotations.push({ type: 'screen-after-double-tap', description: heading });
  expect(await readSettings(page)).toEqual(before);
  expect(await auditTypes(page)).toEqual(auditBefore);
  // A clear Cancel exists on whatever screen it is, and Cancel changes nothing.
  const cancel = page.getByRole('button', { name: 'Cancel' }).first();
  await expect(cancel).toBeVisible();
  await cancel.click();
  await expect(page.getByRole('heading', { level: 1, name: 'Device role' })).toBeVisible();
  expect((await readSettings(page)).deviceRole).toBe('study');
});

// DEF-03: the guard holds only while the share or download is in flight. The Chromium download
// finishes and the next copy is prepared in under 40 ms, so a second tap saves a second file.
test('double tap "Save your first backup": one file, one export entry', async ({ page }) => {
  test.fail(true, 'DEF-03: a second tap 40 ms later saves a second file');
  await openApp(page, '/settings/setup');
  await page.getByRole('button', { name: 'This is a study phone' }).click();
  await page.getByRole('button', { name: 'Create the owner PIN' }).click();
  await tapPin(page, PIN);
  await tapPin(page, PIN);
  const button = page.getByRole('button', { name: 'Save your first backup', exact: true });
  await expect(button).toBeEnabled();
  const downloads: string[] = [];
  page.on('download', (d) => downloads.push(d.suggestedFilename()));
  await doubleTap(page, button);
  await expect(page.getByText(/Path: download\./)).toBeVisible();
  await page.waitForTimeout(500);
  expect(downloads).toHaveLength(1);
  expect((await auditTypes(page)).filter((t) => t === 'export')).toHaveLength(1);
});

// DEF-04: the second tap lands on the PIN pad's Cancel key, which sits where the action button was,
// and the flow drops back to the overview. Nothing is written (safe), but the tap is undone.
test('double tap the Start fresh action after typing the word: the PIN screen stays, then one shop phone', async ({ page }, testInfo) => {
  // At 430 px the PIN pad's Cancel key sits under the action button; at the other widths it does not.
  test.fail(testInfo.project.name === 'w430', 'DEF-04: the second tap lands on the PIN pad Cancel at 430 px');
  await openApp(page, '/settings/device');
  await page.getByRole('button', { name: 'Start fresh', exact: true }).click();
  await page.getByLabel('Type zero to confirm').fill('zero');
  await doubleTap(page, page.getByRole('button', { name: 'Start fresh', exact: true }));
  await page.waitForTimeout(300);
  expect((await readSettings(page)).deviceRole).toBe('study');
  expect(await auditTypes(page)).toEqual([]);
  await expect(page.getByRole('heading', { level: 1, name: 'Create the owner PIN' })).toBeVisible();
  await tapPin(page, PIN);
  await tapPin(page, PIN);
  await expect(page.getByText(/This is now the shop phone\./)).toBeVisible();
  expect(await auditTypes(page)).toEqual(['pinSet', 'roleChange', 'startFresh']);
});

test('double tap the Customer mode and then "Exit Customer View": on once, off once, no crash', async ({ page }) => {
  const problems = watchProblems(page);
  await makeShopPhone(page);
  await openApp(page, '/');
  await doubleTap(page, page.getByRole('group', { name: 'Mode' }).getByText('Customer', { exact: true }));
  await expect(page.locator('html')).toHaveAttribute('data-density', 'customer');
  await doubleTap(page, page.getByRole('button', { name: 'Exit Customer View' }));
  await expect(page.locator('html')).toHaveAttribute('data-density', 'shop');
  await page.waitForTimeout(300);
  // The second tap may land on the internal Home: whatever it hit, Customer View stays off or is on cleanly.
  const s = await readSettings(page);
  test.info().annotations.push({ type: 'customer-view-after-exit-double-tap', description: String(s.customerViewOn) });
  expect(s.customerViewOn).toBe(false);
  expectNoProblems(problems);
});

test('confused user: walks away from Start fresh after typing the word, comes back; nothing changed', async ({ page }) => {
  await openApp(page, '/settings/device');
  const before = await readSettings(page);
  await page.getByRole('button', { name: 'Start fresh', exact: true }).click();
  await page.getByLabel('Type zero to confirm').fill('zero');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Fix It' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Fix It' })).toBeVisible();
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1, name: 'Device role' })).toBeVisible();
  expect(await readSettings(page)).toEqual(before);
});

test('confused user: the browser Back button from the PIN pad leaves no half-made PIN', async ({ page }) => {
  await openApp(page, '/settings');
  await page.getByRole('button', { name: 'Set the owner PIN' }).click();
  await page.getByRole('button', { name: 'Create the owner PIN' }).click();
  await tapPin(page, PIN);
  await page.goBack();
  await expect(page.locator('h1').first()).toBeVisible();
  expect((await readSettings(page)).ownerPin).toBeNull();
});

test('impatient user: taps a Home tile while the app is still opening', async ({ page }) => {
  const problems = watchProblems(page);
  await page.goto('/', { waitUntil: 'commit' });
  // Tap the Quick cards tile as soon as it exists.
  await page.getByRole('button', { name: /^Quick cards/ }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Quick Cards' })).toBeVisible();
  expectNoProblems(problems);
});
