/**
 * The PIN step after the DEF-15 fix (pass 4). A new PIN is typed twice on a pad that steps in place
 * (src/components/ui/pinStep.ts): the confirmation pad has no 350 ms arrival hold, and only the
 * second tap of a double tap on the key that finished the entry is dropped. These tests go after
 * that rule from the person's side: steady paces, a PIN that starts with its own last digit, a
 * doubled last digit, the mismatch step, the keys never moving, and the pads that must still hold
 * (a new screen after a PIN check) or must never hold (a pad that stays put after a wrong PIN), plus
 * the stepped pads' targets and reduced motion.
 */
import { expect, test, type Locator, type Page } from '@playwright/test';
import { PIN, expectNoProblems, horizontalOverflow, measureTargets, openApp, readSettings, readStore, setUpStudyPhone, tapNewPin, tapPin, watchProblems } from '../fixtures/app';

type Box = { x: number; y: number; width: number; height: number };
const KEY_NAMES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Cancel', 'Delete'] as const;

function pad(page: Page): Locator {
  return page.locator('fieldset.ui-pinpad').last();
}

async function filledDots(page: Page): Promise<number> {
  return page.locator('.ui-pinpad__dot[data-filled="true"]').count();
}

async function keyBoxes(page: Page): Promise<Record<string, Box>> {
  const out: Record<string, Box> = {};
  for (const name of KEY_NAMES) {
    const box = await pad(page).getByRole('button', { name, exact: true }).boundingBox();
    if (box === null) throw new Error(`key ${name} not visible`);
    out[name] = { x: Math.round(box.x), y: Math.round(box.y), width: Math.round(box.width), height: Math.round(box.height) };
  }
  return out;
}

/** Type digits at a steady pace: real pointer taps at each key's centre, or hardware digit keys. */
async function typeAtPace(page: Page, digits: string, gap: number, mode: 'taps' | 'keys' = 'taps'): Promise<void> {
  const boxes = mode === 'taps' ? await keyBoxes(page) : {};
  for (const digit of digits) {
    const box = boxes[digit];
    if (mode === 'taps' && box !== undefined) await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    else await page.keyboard.press(digit);
    await page.waitForTimeout(gap);
  }
}

/** Two clicks 40 ms apart at the centre of one key, as a thumb double tap. */
async function doubleTapKey(page: Page, name: string): Promise<void> {
  const box = await pad(page).getByRole('button', { name, exact: true }).boundingBox();
  if (box === null) throw new Error(`key ${name} not visible`);
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await page.waitForTimeout(40);
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
}

/** Open the new PIN pad on the setup flow and wait out its arrival hold. */
async function openNewPinPad(page: Page): Promise<void> {
  await openApp(page, '/settings/setup');
  await page.getByRole('button', { name: 'Create the owner PIN' }).click();
  await expect(pad(page)).toBeVisible();
  await page.waitForTimeout(500);
}

async function auditTypes(page: Page): Promise<string[]> {
  return (await readStore<{ type: string }>(page, 'auditLog')).map((a) => a.type).sort();
}

const savedHeading = (page: Page) => page.getByRole('heading', { level: 1, name: 'Save your first backup' });

for (const gap of [120, 300]) {
  test(`DEF-15 recheck: a new PIN and its confirmation tapped at a steady ${gap} ms per digit save the PIN`, async ({ page }) => {
    const problems = watchProblems(page);
    await openNewPinPad(page);
    await typeAtPace(page, PIN + PIN, gap);
    await expect(savedHeading(page)).toBeVisible({ timeout: 3_000 });
    expect(await auditTypes(page)).toEqual(['pinSet']);
    expectNoProblems(problems);
  });
}

test('DEF-15 recheck: hardware digit keys at 60 ms per digit save the PIN (keys are never held)', async ({ page }) => {
  await openNewPinPad(page);
  await typeAtPace(page, PIN + PIN, 60, 'keys');
  await expect(savedHeading(page)).toBeVisible({ timeout: 3_000 });
});

test('DEF-15 recheck: a PIN that starts with its own last digit confirms at a steady 120 ms pace', async ({ page }) => {
  const same = '582915';
  await openNewPinPad(page);
  await typeAtPace(page, same + same, 120);
  await expect(savedHeading(page)).toBeVisible({ timeout: 3_000 });
  expect((await readSettings(page)).ownerPin).not.toBeNull();
});

test('DEF-15 recheck: a double tap on the last digit of the first entry leaves the confirmation pad empty, then the PIN saves', async ({ page }) => {
  await openNewPinPad(page);
  await typeAtPace(page, PIN.slice(0, 5), 250);
  await doubleTapKey(page, PIN.slice(5));
  await expect(pad(page).locator('legend')).toHaveText('Enter the same PIN again');
  await page.waitForTimeout(100);
  expect(await filledDots(page)).toBe(0);
  await typeAtPace(page, PIN, 250);
  await expect(savedHeading(page)).toBeVisible({ timeout: 3_000 });
  expect(await auditTypes(page)).toEqual(['pinSet']);
});

test('DEF-15 recheck: the keys never move across the confirmation and the mismatch step, and a steady retry saves the PIN', async ({ page }) => {
  await openNewPinPad(page);
  const first = await keyBoxes(page);
  await typeAtPace(page, PIN, 250);
  await expect(pad(page).locator('legend')).toHaveText('Enter the same PIN again');
  expect(await keyBoxes(page)).toEqual(first);
  await typeAtPace(page, '111111', 250);
  await expect(page.getByText('The two PINs did not match. Enter a new PIN again.')).toBeVisible();
  await expect(pad(page).locator('legend')).toHaveText('Create a 6 digit owner PIN');
  expect(await keyBoxes(page)).toEqual(first);
  expect(await readSettings(page).then((s) => s.ownerPin)).toBeNull();
  await typeAtPace(page, PIN + PIN, 250);
  await expect(savedHeading(page)).toBeVisible({ timeout: 3_000 });
  expect(await auditTypes(page)).toEqual(['pinSet']);
});

test('Change PIN: a double tap on the last digit of the current PIN types nothing into the new PIN pad, then the new PIN saves', async ({ page }) => {
  await setUpStudyPhone(page);
  const before = await readSettings(page);
  await page.getByRole('button', { name: 'Change PIN' }).click();
  await expect(pad(page).locator('legend')).toHaveText('Enter the current owner PIN');
  await page.waitForTimeout(500);
  await typeAtPace(page, PIN.slice(0, 5), 200);
  await doubleTapKey(page, PIN.slice(5));
  await expect(page.getByRole('heading', { level: 1, name: 'New owner PIN' })).toBeVisible();
  await page.waitForTimeout(100);
  // The new PIN pad arrives on a new screen after the PIN check: it holds, so the doubled tap is lost.
  expect(await filledDots(page)).toBe(0);
  await page.waitForTimeout(400);
  await tapNewPin(page, '731246');
  await expect(page.getByText('Owner PIN changed.')).toBeVisible();
  const after = await readSettings(page);
  expect(after.ownerPin?.hash).not.toBe(before.ownerPin?.hash);
  expect((await auditTypes(page)).filter((t) => t === 'pinSet')).toHaveLength(2);
});

test('a PIN pad that stays put after a wrong PIN takes a quick retry from its first digit', async ({ page }) => {
  await setUpStudyPhone(page);
  // A reload closes the owner pass, so the Developer tools toggle asks for the PIN.
  await openApp(page, '/settings');
  await page.getByRole('group', { name: 'Developer tools' }).getByText('On', { exact: true }).click();
  await expect(pad(page)).toBeVisible();
  await page.waitForTimeout(500);
  await typeAtPace(page, '000000', 150);
  await expect(page.getByText('Wrong PIN. 2 tries left.')).toBeVisible();
  await expect(pad(page).getByText('Checking')).toHaveCount(0);
  await typeAtPace(page, PIN, 120);
  await expect(page.getByRole('button', { name: 'Open the developer panel' })).toBeVisible();
});

test('Start fresh: a double tap on the last digit of the confirmation makes one shop phone and saves no backup', async ({ page }) => {
  const problems = watchProblems(page);
  const downloads: string[] = [];
  page.on('download', (d) => downloads.push(d.suggestedFilename()));
  await openApp(page, '/settings/device');
  await page.getByRole('button', { name: 'Start fresh', exact: true }).click();
  await page.getByLabel('Type zero to confirm').fill('zero');
  await page.getByRole('button', { name: 'Start fresh', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Create the owner PIN' })).toBeVisible();
  await tapPin(page, PIN);
  await expect(pad(page).locator('legend')).toHaveText('Enter the same PIN again');
  await tapPin(page, PIN.slice(0, 5));
  await doubleTapKey(page, PIN.slice(5));
  await expect(page.getByText(/This is now the shop phone\./)).toBeVisible();
  await page.waitForTimeout(500);
  expect(downloads).toEqual([]);
  expect(await auditTypes(page)).toEqual(['pinSet', 'roleChange', 'startFresh']);
  expect((await readSettings(page)).deviceRole).toBe('shop');
  expectNoProblems(problems);
});

test('the stepped pads keep every key 44 px wide and 64 px tall in Shop density, with no sideways scroll', async ({ page }) => {
  await openNewPinPad(page);
  await typeAtPace(page, PIN, 200);
  await expect(pad(page).locator('legend')).toHaveText('Enter the same PIN again');
  const small = (await measureTargets(page, 44, 64)).map((s) => `confirmation: ${s.what} ${s.width}x${s.height}`);
  await typeAtPace(page, '111111', 200);
  await expect(page.getByText('The two PINs did not match. Enter a new PIN again.')).toBeVisible();
  small.push(...(await measureTargets(page, 44, 64)).map((s) => `mismatch: ${s.what} ${s.width}x${s.height}`));
  expect(small).toEqual([]);
  const { scrollWidth, width } = await horizontalOverflow(page);
  expect(scrollWidth).toBeLessThanOrEqual(width);
});

test('reduced motion: the PIN pad and its step in place animate nothing longer than 10 ms', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const moving = () =>
    page.evaluate(() => {
      const seconds = (v: string) => Math.max(...v.split(',').map((x) => (x.trim().endsWith('ms') ? parseFloat(x) / 1000 : parseFloat(x))));
      const out: string[] = [];
      const fieldset = document.querySelector('fieldset.ui-pinpad');
      if (fieldset === null) return ['no PIN pad'];
      for (const el of [fieldset, ...Array.from(fieldset.querySelectorAll<HTMLElement>('*'))]) {
        const s = getComputedStyle(el);
        const anim = s.animationName !== 'none' ? seconds(s.animationDuration) : 0;
        const trans = seconds(s.transitionDuration);
        if (anim > 0.01 || trans > 0.01) out.push(`${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]} anim ${anim}s trans ${trans}s`);
      }
      return out;
    });
  await openNewPinPad(page);
  expect(await moving()).toEqual([]);
  await typeAtPace(page, PIN, 150);
  await expect(pad(page).locator('legend')).toHaveText('Enter the same PIN again');
  expect(await moving()).toEqual([]);
});
