/**
 * Every route at every width (BUILD_PROMPT 9 item 4; CLAUDE.md mobile rules). Each project in
 * playwright.config.ts runs this file at its own width: 375, 430, 768, 1024, 1440.
 *
 * Per route: renders with a real heading, no console or page errors, no failed requests, no
 * horizontal scroll, every button and link at least 44 x 44 px (64 px tall in Shop density), no
 * clipped heading, and Fix It in the bottom row.
 */
import { expect, test, type Page } from '@playwright/test';
import { ROUTES, expectNoProblems, horizontalOverflow, measureTargets, openApp, waitForScreen, watchProblems } from '../fixtures/app';

/** Headings and the app title whose text is wider than their box (clipped or cut off). */
async function clippedText(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const out: string[] = [];
    for (const el of Array.from(document.querySelectorAll<HTMLElement>('h1, h2, h3, .app-top__title, .ui-btn__label, .ui-tile__label'))) {
      const box = el.getBoundingClientRect();
      if (box.width === 0) continue;
      if (el.scrollWidth > el.clientWidth + 1) out.push(`${el.tagName.toLowerCase()} "${(el.textContent ?? '').trim().slice(0, 50)}" ${el.scrollWidth} > ${el.clientWidth}`);
    }
    return out;
  });
}

for (const path of ROUTES) {
  test.describe(`route ${path}`, () => {
    test('renders with a heading, no errors, no failed requests', async ({ page }) => {
      const problems = watchProblems(page);
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await waitForScreen(page);
      await expect(page.locator('h1').first()).not.toHaveText('');
      // Let idle work (search preload, storage probe) finish inside the watch.
      await page.waitForTimeout(400);
      expectNoProblems(problems);
    });

    test('no horizontal scroll', async ({ page }) => {
      await openApp(page, path);
      const { scrollWidth, width } = await horizontalOverflow(page);
      expect(scrollWidth, `scrollWidth ${scrollWidth} at width ${width}`).toBeLessThanOrEqual(width);
    });

    test('every button and link is at least 44 x 44 px, and 64 px tall in Shop density', async ({ page }) => {
      await openApp(page, path);
      const density = await page.locator('html').getAttribute('data-density');
      expect(density).toBe('shop');
      const under44 = await measureTargets(page, 44, 44);
      expect(under44, 'targets under 44 x 44').toEqual([]);
      const under64tall = await measureTargets(page, 0, 64);
      expect(under64tall, 'targets under 64 px tall in Shop density').toEqual([]);
    });

    test('Academy density keeps every target at 44 x 44 or more', async ({ page }) => {
      await openApp(page, '/');
      await page.getByRole('group', { name: 'Mode' }).getByText('Academy', { exact: true }).click();
      await expect(page.locator('html')).toHaveAttribute('data-density', 'academy');
      await openApp(page, path);
      await expect(page.locator('html')).toHaveAttribute('data-density', 'academy');
      expect(await measureTargets(page, 44, 44), 'targets under 44 x 44 in Academy density').toEqual([]);
    });

    test('no clipped heading or button text on the first screen', async ({ page }) => {
      await openApp(page, path);
      expect(await clippedText(page)).toEqual([]);
    });

    test('Fix It is in the bottom row, one tap away', async ({ page }) => {
      await openApp(page, path);
      const row = page.getByRole('navigation', { name: 'Main' });
      await expect(row.getByRole('link', { name: 'Fix It' })).toBeVisible();
      await expect(row.getByRole('link', { name: 'Quick cards' })).toBeVisible();
      await expect(row.getByRole('link', { name: 'Search' })).toBeVisible();
      const box = await row.getByRole('link', { name: 'Fix It' }).boundingBox();
      const viewport = page.viewportSize();
      expect(box).not.toBeNull();
      // Fully on screen without scrolling.
      expect((box?.y ?? 0) + (box?.height ?? 0)).toBeLessThanOrEqual(viewport?.height ?? 0);
    });
  });
}

test('the scroll container scrolls and the bottom row stays put on a long screen', async ({ page }) => {
  await openApp(page, '/cards');
  const scroller = page.locator('.app-scroll');
  const metrics = await scroller.evaluate((el) => ({ scrollHeight: el.scrollHeight, clientHeight: el.clientHeight, overflowY: getComputedStyle(el).overflowY }));
  expect(metrics.overflowY).toBe('auto');
  const fixit = page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Fix It' });
  const before = await fixit.boundingBox();
  if (metrics.scrollHeight > metrics.clientHeight) {
    await scroller.evaluate((el) => el.scrollTo(0, el.scrollHeight));
    await expect.poll(() => scroller.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
  }
  const after = await fixit.boundingBox();
  expect(after?.y).toBe(before?.y);
  // The document itself never scrolls (html, body, #root are 100dvh flex columns).
  expect(await page.evaluate(() => document.scrollingElement?.scrollTop ?? 0)).toBe(0);
});
