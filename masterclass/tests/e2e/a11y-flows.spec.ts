/**
 * Accessibility basics (BUILD_PROMPT 9 item 9) and tap targets on the flow screens the route sweep
 * cannot reach without taps: the PIN pad, the Start fresh warning, the result screen, the restore
 * picker, the developer panel, and the Customer View screen.
 */
import { expect, test, type Page } from '@playwright/test';
import { ROUTES, makeShopPhone, measureTargets, openApp, setUpStudyPhone, turnCustomerViewOn, turnDeveloperToolsOn } from '../fixtures/app';

async function targetsAt(page: Page, label: string, minH: number): Promise<string[]> {
  const small = await measureTargets(page, 44, minH);
  return small.map((s) => `${label}: ${s.what} ${s.width}x${s.height}`);
}

test('flow screens keep every target at 44 x 44, and 64 px tall in Shop density', async ({ page }) => {
  const problems: string[] = [];
  await openApp(page, '/settings/device');
  await page.getByRole('button', { name: 'Start fresh', exact: true }).click();
  problems.push(...(await targetsAt(page, 'Start fresh warning', 64)));
  await page.getByLabel('Type zero to confirm').fill('zero');
  await page.getByRole('button', { name: 'Start fresh', exact: true }).click();
  await expect(page.locator('fieldset.ui-pinpad')).toBeVisible();
  problems.push(...(await targetsAt(page, 'PIN pad', 64)));
  await page.locator('fieldset.ui-pinpad').getByRole('button', { name: 'Cancel' }).click();

  await makeShopPhone(page, { backup: false });
  problems.push(...(await targetsAt(page, 'Start fresh result', 64)));
  await openApp(page, '/settings/backup');
  await page.getByRole('button', { name: 'Restore from a file' }).click();
  await page.getByRole('button', { name: 'Paste backup text instead' }).click();
  problems.push(...(await targetsAt(page, 'Restore picker', 64)));

  await turnDeveloperToolsOn(page);
  await page.getByRole('button', { name: 'Open the developer panel' }).click();
  // The device preview strip is checked on its own below (DEF-07); here only the panel itself.
  problems.push(...(await targetsAt(page, 'Developer panel', 64)).filter((p) => !/Mobile 375|Tablet 768|Desktop full/.test(p)));

  await turnCustomerViewOn(page);
  problems.push(...(await targetsAt(page, 'Customer View', 44)));
  expect(problems).toEqual([]);
});

test('every route: one h1, a main landmark, lang set, every control has a name, every field a label', async ({ page }) => {
  const problems: string[] = [];
  for (const path of ROUTES) {
    await openApp(page, path);
    const report = await page.evaluate(() => {
      const out: string[] = [];
      if (document.documentElement.lang === '') out.push('no lang on <html>');
      if (document.querySelectorAll('h1').length !== 1) out.push(`${document.querySelectorAll('h1').length} h1 elements`);
      if (document.querySelector('main') === null) out.push('no <main>');
      for (const el of Array.from(document.querySelectorAll<HTMLElement>('button, a[href]'))) {
        if (el.closest('[aria-hidden="true"]')) continue;
        const name = (el.getAttribute('aria-label') ?? el.textContent ?? '').trim();
        if (name === '' && el.getAttribute('aria-labelledby') === null) out.push(`unnamed ${el.tagName.toLowerCase()}`);
      }
      for (const input of Array.from(document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input:not([type="hidden"]), textarea, select'))) {
        if (input.closest('[aria-hidden="true"]')) continue;
        const labelled = (input.labels?.length ?? 0) > 0 || input.getAttribute('aria-label') !== null || input.getAttribute('aria-labelledby') !== null;
        if (!labelled) out.push(`unlabelled ${input.tagName.toLowerCase()}[type=${input.getAttribute('type') ?? ''}]`);
      }
      return out;
    });
    problems.push(...report.map((r) => `${path}: ${r}`));
  }
  expect(problems).toEqual([]);
});

test('keyboard focus is visible on every control reached with Tab on Home', async ({ page }) => {
  await openApp(page, '/');
  const invisible: string[] = [];
  for (let i = 0; i < 25; i += 1) {
    await page.keyboard.press('Tab');
    const info = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (el === null || el === document.body) return null;
      const target = el.matches('input[type="radio"]') ? (el.closest('label') ?? el) : el;
      const s = getComputedStyle(target);
      const ring = (s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0) || (s.boxShadow !== 'none' && s.boxShadow !== '');
      return { what: `${el.tagName.toLowerCase()} "${(el.getAttribute('aria-label') ?? el.textContent ?? '').trim().slice(0, 40)}"`, ring };
    });
    if (info === null) continue;
    if (!info.ring) invisible.push(info.what);
  }
  expect(invisible).toEqual([]);
});

test('reduced motion: with prefers-reduced-motion, nothing animates or transitions longer than 10 ms', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const moving: string[] = [];
  for (const path of ['/', '/cards', '/settings']) {
    await openApp(page, path);
    const found = await page.evaluate(() => {
      const seconds = (v: string) => Math.max(...v.split(',').map((x) => (x.trim().endsWith('ms') ? parseFloat(x) / 1000 : parseFloat(x))));
      const out: string[] = [];
      for (const el of Array.from(document.querySelectorAll<HTMLElement>('body *'))) {
        const s = getComputedStyle(el);
        const anim = s.animationName !== 'none' ? seconds(s.animationDuration) * Math.max(1, Number.parseFloat(s.animationIterationCount) || 1) : 0;
        const trans = seconds(s.transitionDuration);
        if (anim > 0.01 || trans > 0.01) out.push(`${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]} anim ${anim}s trans ${trans}s`);
      }
      return out.slice(0, 10);
    });
    moving.push(...found.map((f) => `${path}: ${f}`));
  }
  expect(moving).toEqual([]);
});

test('the study phone setup also leaves no small target on the setup and backup screens', async ({ page }) => {
  await setUpStudyPhone(page);
  const problems = await targetsAt(page, 'Setup done', 64);
  await openApp(page, '/settings/backup');
  problems.push(...(await targetsAt(page, 'Backup', 64)));
  expect(problems).toEqual([]);
});

// DEF-07 (fixed in the fix wave): the device preview buttons follow --target-min, 64 px in Shop.
test('the device preview buttons are 64 px tall in Shop density', async ({ page }) => {
  await setUpStudyPhone(page);
  await turnDeveloperToolsOn(page);
  await openApp(page, '/');
  await expect(page.getByRole('toolbar', { name: 'Device preview' })).toBeVisible();
  const small = (await measureTargets(page, 44, 64)).filter((s) => /Mobile 375|Tablet 768|Desktop full/.test(s.what));
  expect(small).toEqual([]);
});
