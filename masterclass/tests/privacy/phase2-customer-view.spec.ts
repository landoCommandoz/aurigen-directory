/**
 * Customer View with the Phase 2 content (BUILD_PROMPT 9 item 6; the Phase 2 brief, check 6).
 * Owner: qa-adversary. With Customer View on, no fix, lesson, procedure, Quick Card, item, search
 * result, or unverified or pending badge is on the page or in the accessibility tree, on any content
 * address, typed, refreshed, or reached with the browser's Back and Forward.
 *
 * Every content page is visited in the w375 project; the other widths visit one of each type.
 */
import { expect, test, type Page } from '@playwright/test';
import { contentPages } from '../fixtures/bundle';
import { customerViewLeaks, expectNoProblems, makeShopPhone, openApp, readSettings, turnCustomerViewOn, watchProblems } from '../fixtures/app';

const FORBIDDEN_IN_TREE = ['Fix It', 'Quick card', 'Quick Card', 'Search', 'Settings', 'Developer', 'unverified', 'pending', 'Read aloud', 'Related', 'Where this comes from', 'Procedure', 'Lesson', 'Academy', 'STOP', '[VERIFY', 'Knowledge base', 'Lando decides', 'Shop', 'Business'];

async function treeLeaks(page: Page): Promise<string[]> {
  const tree = await page.locator('body').ariaSnapshot();
  return FORBIDDEN_IN_TREE.filter((w) => tree.includes(w)).map((w) => `accessibility tree has "${w}"`);
}

async function inCustomerView(page: Page): Promise<void> {
  await makeShopPhone(page);
  await turnCustomerViewOn(page);
  await page.getByRole('button', { name: 'Done', exact: true }).click();
  await expect.poll(async () => (await readSettings(page)).focusReminderShown).toBe(true);
}

async function expectCustomerScreenOnly(page: Page, path: string): Promise<void> {
  await expect(page.locator('html'), path).toHaveAttribute('data-density', 'customer');
  await expect(page.getByRole('heading', { level: 1, name: "Lando's Detailing" }), path).toBeVisible();
  expect(await customerViewLeaks(page), `DOM leaks on ${path}`).toEqual([]);
  expect(await treeLeaks(page), `tree leaks on ${path}`).toEqual([]);
  expect(await page.locator('.mc-badge, .ui-stopband, .sr-results, [data-pending]').count(), path).toBe(0);
  const buttons = (await page.getByRole('button').allInnerTexts()).map((b) => b.trim());
  expect(buttons, `buttons on ${path}`).toEqual(['Exit Customer View']);
}

test('every content address typed by hand shows the customer screen only', async ({ page }, info) => {
  test.setTimeout(600_000);
  const problems = watchProblems(page);
  await inCustomerView(page);
  const all = contentPages();
  const oneOfEach = [...new Map(all.map((p) => [p.type, p])).values()];
  const visit = info.project.name === 'w375' ? all : oneOfEach;
  for (const { path } of [...visit, { path: '/sops' }, { path: '/search?q=jerking' }, { path: '/fixit?q=tesla' }]) {
    await page.goto(path);
    await expectCustomerScreenOnly(page, path);
  }
  test.info().annotations.push({ type: 'addresses checked', description: String(visit.length + 3) });
  expectNoProblems(problems);
});

test('a refresh on a fix, a lesson, a procedure, or an item in Customer View never draws an internal element, even for one frame', async ({ page }) => {
  await inCustomerView(page);
  await page.addInitScript(() => {
    const seen: string[] = [];
    (window as unknown as { __leaks: string[] }).__leaks = seen;
    const check = () => {
      if (document.querySelector('[data-internal]')) seen.push('data-internal');
      if (document.querySelector('nav[aria-label="Main"] a')) seen.push('internal bottom row');
      if (document.querySelector('.mc-badge')) seen.push('a badge');
      if (document.querySelector('.ui-stopband')) seen.push('a STOP band');
      if (document.querySelector('.sr-box')) seen.push('the search box');
      if (document.querySelector('main h2')) seen.push(`a section heading "${document.querySelector('main h2')?.textContent ?? ''}"`);
    };
    new MutationObserver(check).observe(document, { subtree: true, childList: true, attributes: true });
  });
  const flashes: Record<string, string[]> = {};
  for (const path of ['/fixit/fix-01', '/fixit/fix-09', '/academy/lesson-l4-07-full-square', '/sops/sop-wheels-tesla', '/items/product-armor-all-extreme-wheel-tire', '/cards/card-machine-settings']) {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1, name: "Lando's Detailing" })).toBeVisible();
    await page.waitForTimeout(300);
    const seen = await page.evaluate(() => (window as unknown as { __leaks: string[] }).__leaks);
    if (seen.length > 0) flashes[path] = [...new Set(seen)];
  }
  expect(flashes).toEqual({});
});

test('confused user: a fix is open, Customer View goes on from Home, then Back returns to the fix address: customer screen only', async ({ page }) => {
  await makeShopPhone(page);
  await openApp(page, '/fixit/fix-01');
  await expect(page.getByRole('heading', { level: 1, name: 'Polisher jerks, walks, or hops side to side' })).toBeVisible();
  await openApp(page, '/academy/lesson-l4-03-pressure');
  await turnCustomerViewOn(page);
  await page.getByRole('button', { name: 'Done', exact: true }).click();
  // The reminder's "shown" mark is saved a moment after Done (the Phase 1 helper waits the same way).
  await expect.poll(async () => (await readSettings(page)).focusReminderShown).toBe(true);
  for (let i = 0; i < 3; i += 1) {
    await page.goBack();
    await expectCustomerScreenOnly(page, page.url());
  }
  await page.goForward();
  await expectCustomerScreenOnly(page, page.url());
});
