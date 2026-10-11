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
  // DEF-04 (fixed in the fix wave): at 375 px the second tap used to type one stray digit.
  expect(filled).toBe(0);
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

// DEF-03 (fixed in the fix wave): after a save the button holds, reading "Saved", until OK and
// BACKUP_HOLD_MS (2 s) have both passed, so a second tap never makes a second file.
test('double tap "Save your first backup": one file, one export entry', async ({ page }) => {
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

// DEF-04 (fixed in the fix wave): the PIN pad takes no taps for its first 350 ms (useTapGuard), so
// the second tap no longer lands on its Cancel key at 430 px.
test('double tap the Start fresh action after typing the word: the PIN screen stays, then one shop phone', async ({ page }) => {
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

test('DEF-03 recheck: the Backup screen "Save backup" at four double-tap gaps saves one file each time, and a later deliberate tap still works', async ({ page }) => {
  await setUpStudyPhone(page);
  await openApp(page, '/settings/backup');
  const downloads: string[] = [];
  page.on('download', (d) => downloads.push(d.suggestedFilename()));
  const save = page.getByRole('button', { name: 'Save backup', exact: true });
  for (const gap of [40, 120, 400, 1000]) {
    const before = downloads.length;
    await expect(save).toBeEnabled();
    await expect(save).not.toHaveAttribute('aria-busy', 'true');
    const box = await save.boundingBox();
    if (box === null) throw new Error('Save backup not visible');
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await page.waitForTimeout(gap);
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await page.waitForTimeout(300);
    expect(downloads.length - before, `gap ${gap} ms`).toBe(1);
    // No dead end: OK lets go once the 2 s hold has passed, and the button reads Save backup again.
    await page.getByRole('button', { name: 'OK', exact: true }).click();
    await expect(save).toBeVisible({ timeout: 4_000 });
  }
  // The setup backup plus one per gap.
  expect((await auditTypes(page)).filter((t) => t === 'export')).toHaveLength(5);
});

// DEF-15 (found in pass 3, fixed in pass 4 by src/components/ui/pinStep.ts): the confirmation pad is
// a new PinPad (NewPinEntry key={phase}), and its 350 ms tap guard used to start again in the middle
// of the person's rhythm, dropping the first one or two confirmation digits. A pad that steps in
// place now has no arrival hold. More paces and edges: tests/adversarial/pin-step.spec.ts.
for (const mode of ['taps', 'hardware keys'] as const) {
  test(`DEF-15: a new PIN and its confirmation typed at a steady 250 ms pace (${mode}) save the PIN`, async ({ page }) => {
    await openApp(page, '/settings/setup');
    await page.getByRole('button', { name: 'Create the owner PIN' }).click();
    const pad = page.locator('fieldset.ui-pinpad');
    await expect(pad).toBeVisible();
    await page.waitForTimeout(500);
    const centers: Record<string, { x: number; y: number }> = {};
    for (const digit of new Set(PIN)) {
      const box = await pad.getByRole('button', { name: digit, exact: true }).boundingBox();
      if (box === null) throw new Error('key not visible');
      centers[digit] = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
    }
    for (const digit of PIN + PIN) {
      const c = centers[digit];
      if (mode === 'taps' && c !== undefined) await page.mouse.click(c.x, c.y);
      else await page.keyboard.press(digit);
      await page.waitForTimeout(250);
    }
    const dots = await page.locator('.ui-pinpad__dot[data-filled="true"]').count();
    test.info().annotations.push({ type: 'dots-left-on-the-confirmation-pad', description: String(dots) });
    await expect(page.getByRole('heading', { level: 1, name: 'Save your first backup' })).toBeVisible({ timeout: 3_000 });
  });
}

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
