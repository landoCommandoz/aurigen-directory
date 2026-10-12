/**
 * The content in shards (QA DEF-17's fix, Phase 2 pass 2). Owner: qa-adversary.
 *
 * The content bundle is cut into one lazy chunk per type, a catalog, and extras; Home draws from a
 * summary in the app code, and a warm-up loads the search index and the Fix It content after the
 * page's load event. These tests hold the fix to its promise and attack the new seams:
 *
 *   The first screen never waits for content: no shard or index request starts before the load event.
 *   The warm-up brings Fix It, the Quick Cards, and the index in after that; the lessons wait for the Academy.
 *   On a slow network a deep link says "Opening", never "not found", then draws the right page.
 *   An unknown id still ends at its "not found" screen, never stuck on "Opening".
 *   Enter typed before the index arrives opens the jerking fix.
 *   Customer View stays the customer screen after every shard has arrived.
 *   DEF-26 (closed in pass 3): a chunk that failed once recovers with Try again (a fresh address, or a
 *   reload when a deploy took the old one away); no signal says so and never reloads into the browser's
 *   offline page; search never answers "Nothing found" because it did not load.
 */
import { expect, test, type Page } from '@playwright/test';
import { expectNoProblems, makeShopPhone, openApp, readSettings, turnCustomerViewOn, waitForScreen, watchProblems } from '../fixtures/app';
import { NOT_FOUND_TITLES } from '../fixtures/bundle';

const FIX01 = 'Polisher jerks, walks, or hops side to side';
const LAZY = /\/assets\/(content-[a-z]+|search-index)-[^/]+\.js$/;

/** Every content shard and the index answer after `ms`, as on a slow first visit. */
async function slowContent(page: Page, ms: number): Promise<void> {
  await page.route(LAZY, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, ms));
    await route.continue();
  });
}

/** Record every level-1 heading and status line the page ever draws, from the first frame. */
async function recordHeadings(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const seen = new Set<string>();
    (window as unknown as { __seen: Set<string> }).__seen = seen;
    const look = () => {
      for (const el of document.querySelectorAll('h1, .mc-status')) seen.add((el.textContent ?? '').trim());
    };
    new MutationObserver(look).observe(document, { subtree: true, childList: true, characterData: true });
  });
}

const seenTexts = (page: Page) => page.evaluate(() => [...(window as unknown as { __seen: Set<string> }).__seen]);

test.describe('the first screen and the warm-up', () => {
  test('Home paints before any content shard or the search index is even requested', async ({ page }) => {
    await page.goto('/');
    await waitForScreen(page);
    const timing = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const fcp = performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? null;
      const lazy = performance
        .getEntriesByType('resource')
        .filter((e) => /\/assets\/(content-[a-z]+|search-index)-/.test(e.name))
        .map((e) => ({ name: e.name.split('/').pop() ?? '', start: e.startTime }));
      return { load: nav.loadEventStart, fcp, lazy };
    });
    const early = timing.lazy.filter((e) => e.start < timing.load || (timing.fcp !== null && e.start < timing.fcp));
    test.info().annotations.push({ type: 'timing', description: `load ${Math.round(timing.load)} ms, FCP ${Math.round(timing.fcp ?? -1)} ms, lazy before load: ${early.length}` });
    expect(early, 'lazy content requested before the load event or the first paint').toEqual([]);
    const html = await (await page.request.get('/')).text();
    expect(html, 'index.html preloads no content shard').not.toMatch(/modulepreload[^>]+(content-|search-index)/);
  });

  test('the warm-up brings in the index, the fixes, the cards, and the catalog; the lessons wait for the Academy', async ({ page }) => {
    const problems = watchProblems(page);
    await openApp(page, '/');
    const fetched = () => page.evaluate(() => performance.getEntriesByType('resource').map((e) => e.name.split('/').pop() ?? ''));
    await expect.poll(async () => (await fetched()).filter((n) => /^(search-index|content-(fixnode|quickcard|catalog))-/.test(n)).length, { timeout: 10_000 }).toBe(4);
    expect((await fetched()).some((n) => n.startsWith('content-lesson-')), 'lesson shard before the Academy opens').toBe(false);
    // Fix It now draws its tiles at once: no "Opening" line, no new request for the fixes.
    const before = (await fetched()).length;
    await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Fix It' }).click();
    await expect(page.getByRole('button', { name: new RegExp(`^${FIX01}`) })).toBeVisible();
    expect((await fetched()).slice(before).filter((n) => /^content-(fixnode|quickcard)-/.test(n))).toEqual([]);
    await page.goBack();
    await waitForScreen(page);
    await page.getByRole('button', { name: /^Academy/ }).click();
    await waitForScreen(page);
    await expect.poll(async () => (await fetched()).some((n) => n.startsWith('content-lesson-'))).toBe(true);
    expectNoProblems(problems);
  });
});

test.describe('slow content: never a false "not found"', () => {
  const DEEP = [
    { path: '/fixit/fix-01', h1: FIX01 },
    { path: '/academy/lesson-l4-07-full-square', h1: /One full square/ },
    { path: '/academy/lesson-l6-01-tesla', h1: 'Tesla Model Y, what changes' },
    { path: '/sops/sop-polish', h1: /./ },
    { path: '/cards/card-machine-settings', h1: /./ },
    { path: '/items/product-meguiars-m210', h1: /M210/ },
    { path: '/items/equipment-bauer-56367', h1: /BAUER/ },
  ];

  test('a cold deep link on a slow network says Opening, never a not-found title, then draws the page', async ({ page }) => {
    test.setTimeout(90_000);
    const problems = watchProblems(page);
    await recordHeadings(page);
    await slowContent(page, 900);
    const flashes: Record<string, string[]> = {};
    for (const { path, h1 } of DEEP) {
      await page.goto(path);
      await expect(page.locator('main[aria-busy="true"]'), `${path} waits busy`).toHaveCount(1);
      await waitForScreen(page);
      await expect(page.locator('h1').first(), path).toHaveText(h1);
      const bad = (await seenTexts(page)).filter((t) => NOT_FOUND_TITLES.includes(t) || /not in the content on this phone/i.test(t));
      if (bad.length > 0) flashes[path] = bad;
    }
    expect(flashes).toEqual({});
    expectNoProblems(problems);
  });

  test('an unknown id still ends at its not-found screen with a way out, never stuck on Opening', async ({ page }) => {
    await slowContent(page, 400);
    for (const path of ['/fixit/fix-999', '/academy/lesson-l9-99-nope', '/sops/sop-nope', '/cards/card-nope', '/items/product-nope', '/items/zzz-1']) {
      await page.goto(path);
      await waitForScreen(page);
      const title = (await page.locator('h1').first().innerText()).trim();
      expect(NOT_FOUND_TITLES, `${path} shows "${title}"`).toContain(title);
      expect(await page.locator('main').getByRole('button').count(), `${path} way out`).toBeGreaterThan(0);
    }
  });

  test('Enter typed before the search index arrives opens the jerking fix', async ({ page }) => {
    await slowContent(page, 1500);
    await page.goto('/search');
    await waitForScreen(page);
    const box = page.getByRole('searchbox').first();
    await box.fill('jerking');
    await box.press('Enter');
    await expect(page).toHaveURL(/\/fixit\/fix-01$/, { timeout: 10_000 });
    await expect(page.getByRole('heading', { level: 1, name: FIX01 })).toBeVisible();
  });

  test('Customer View: after every shard and the index have arrived, still the customer screen only', async ({ page }) => {
    await makeShopPhone(page);
    await turnCustomerViewOn(page);
    await page.getByRole('button', { name: 'Done', exact: true }).click();
    await expect.poll(async () => (await readSettings(page)).focusReminderShown).toBe(true);
    for (const path of ['/fixit/fix-01', '/academy/lesson-l6-01-tesla', '/search?q=jerking']) {
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1, name: "Lando's Detailing" })).toBeVisible();
      // Past the warm-up (load event + 1.2 s + idle): whatever loaded, nothing internal drew.
      await page.waitForTimeout(2500);
      expect(await page.locator('[data-internal], .mc-badge, .ui-stopband, .sr-results, .sr-box, nav[aria-label="Main"] a').count(), path).toBe(0);
      expect((await page.getByRole('button').allInnerTexts()).map((b) => b.trim()), path).toEqual(['Exit Customer View']);
    }
  });
});

test.describe('DEF-26: a chunk that failed once (closed in pass 3)', () => {
  // DEF-26 (fix-before-deploy, app-engineer, closed in pass 3): a failed lazy chunk is asked for again
  // under a fresh address (?mc-retry=N); Try again reloads the page only when the app's own address
  // answers; the words are plain; search says "did not load", never "Nothing found".
  const LESSON_CHUNK = /\/assets\/content-lesson-[^/?]+\.js(\?.*)?$/;
  const ALL_LAZY = /\/assets\/(content-[a-z]+|search-index)-[^/?]+\.js(\?.*)?$/;
  const NOT_LOADED = 'This page did not load. Check the signal, then tap Try again.';

  /** Main-frame document loads (a goto or a reload), and uncaught page errors. */
  function watchLoads(page: Page): { loads: () => number; errors: string[] } {
    let loads = 0;
    const errors: string[] = [];
    page.on('request', (request) => {
      try {
        if (request.isNavigationRequest() && request.frame() === page.mainFrame()) loads += 1;
      } catch {
        // A service worker's own request has no frame.
      }
    });
    page.on('pageerror', (error) => errors.push(`${error.name}: ${error.message}`));
    return { loads: () => loads, errors };
  }

  /** Wait until the warm-up has brought in the index, the fixes, the cards, and the catalog. */
  async function warmedUp(page: Page): Promise<void> {
    await expect
      .poll(async () => page.evaluate(() => performance.getEntriesByType('resource').filter((e) => /\/assets\/(search-index|content-(fixnode|quickcard|catalog))-/.test(e.name)).length), { timeout: 10_000 })
      .toBeGreaterThanOrEqual(4);
    await page.waitForTimeout(300);
  }

  test('a lesson whose shard failed opens with Try again once the signal is back, under a fresh address, with no reload', async ({ page }) => {
    const watch = watchLoads(page);
    const asked: string[] = [];
    let block = true;
    await page.route(LESSON_CHUNK, (route) => {
      asked.push(new URL(route.request().url()).search);
      return block ? route.abort('internetdisconnected') : route.continue();
    });
    await page.goto('/academy/lesson-l4-07-full-square');
    await expect(page.getByRole('button', { name: 'Try again' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Home' })).toBeVisible();
    block = false;
    await page.getByRole('button', { name: 'Try again' }).click();
    await expect(page.getByRole('heading', { level: 1, name: /One full square/ })).toBeVisible({ timeout: 5_000 });
    expect(asked, 'the second ask is a fresh address').toEqual(['', '?mc-retry=1']);
    expect(watch.loads(), 'no reload was needed').toBe(1);
    expect(watch.errors).toEqual([]);
  });

  test('the failure line is plain words, with no error class or file address', async ({ page }) => {
    await page.route(/\/assets\/content-fixnode-[^/?]+\.js(\?.*)?$/, (route) => route.abort('internetdisconnected'));
    await page.goto('/fixit/fix-01');
    await expect(page.getByRole('button', { name: 'Try again' })).toBeVisible();
    await expect(page.locator('main .mc-status')).toHaveText(NOT_LOADED);
    const line = (await page.locator('main').innerText()).replace(/\s+/g, ' ');
    expect(line).not.toMatch(/TypeError|Error:|https?:\/\/|\.js\b|dynamically imported/);
  });

  test('Try again with no signal at all says so and stays on the page; with the signal back it opens', async ({ page, context }) => {
    const watch = watchLoads(page);
    await openApp(page, '/');
    await warmedUp(page);
    await context.setOffline(true);
    await page.getByRole('button', { name: /^Academy/ }).click();
    await expect(page.locator('main .mc-status')).toHaveText(NOT_LOADED);
    await page.getByRole('button', { name: 'Try again' }).click();
    await expect(page.locator('main .mc-status')).toHaveText(/still did not load\. There is no signal right now\./);
    expect(watch.loads(), 'no reload into the browser offline page').toBe(1);
    await context.setOffline(false);
    await page.getByRole('button', { name: 'Try again' }).click();
    await expect(page.getByRole('button', { name: /One full square, start to finish/ })).toBeVisible({ timeout: 8_000 });
    expect(watch.loads()).toBe(1);
    expect(watch.errors).toEqual([]);
  });

  test('a tab left open across a deploy: the old chunk is gone until a reload; a double tap on Try again reloads once and the lesson opens', async ({ page }) => {
    const watch = watchLoads(page);
    // Pages answers a missing file with its 404 page; after the reload the new build is served.
    await page.route(LESSON_CHUNK, (route) => (watch.loads() > 1 ? route.continue() : route.fulfill({ status: 404, contentType: 'text/html', body: '<!doctype html><title>404</title>' })));
    await page.goto('/academy/lesson-l4-07-full-square');
    const again = page.getByRole('button', { name: 'Try again' });
    await expect(again).toBeVisible();
    const box = await again.boundingBox();
    if (box === null) throw new Error('no Try again box');
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await page.waitForTimeout(60);
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await expect(page.getByRole('heading', { level: 1, name: /One full square/ })).toBeVisible({ timeout: 12_000 });
    await expect(page).toHaveURL(/\/academy\/lesson-l4-07-full-square$/);
    expect(watch.loads(), 'one reload for two taps').toBe(2);
    expect(watch.errors).toEqual([]);
  });

  test('search after the index and the shards failed: "did not load" with Try again, never "Nothing found"; then "jerking" finds the fix', async ({ page }) => {
    let block = true;
    await page.route(ALL_LAZY, (route) => (block ? route.abort('internetdisconnected') : route.continue()));
    await page.goto('/search');
    await waitForScreen(page);
    const box = page.getByRole('searchbox').first();
    await box.fill('jerking');
    await expect(page.locator('.sr-results__problem .mc-status')).toHaveText(/^Search did not load\./);
    await expect(page.locator('.sr-results__problem').getByRole('button', { name: 'Try again' })).toBeVisible();
    await expect(page.getByText(/Nothing found/)).toHaveCount(0);
    // Enter while it did not load opens nothing and changes nothing.
    await box.press('Enter');
    await expect(page).toHaveURL(/\/search/);
    // Let the warm-up (load event + 1.2 s + idle) fail too, so the tap below is what brings search back.
    await page.waitForTimeout(2_500);
    await expect(page.locator('.sr-results__problem .mc-status')).toHaveText(/^Search did not load\./);
    block = false;
    await page.locator('.sr-results__problem').getByRole('button', { name: 'Try again' }).click();
    await expect(page.locator('.sr-results button').first()).toContainText('Polisher jerks', { timeout: 8_000 });
    await expect(page.getByText(/Search did not load/)).toHaveCount(0);
  });

  test('search that did not load answers the next word once the signal is back, with no Try again', async ({ page }) => {
    let block = true;
    await page.route(ALL_LAZY, (route) => (block ? route.abort('internetdisconnected') : route.continue()));
    await page.goto('/search');
    await waitForScreen(page);
    const box = page.getByRole('searchbox').first();
    await box.fill('jerk');
    await expect(page.locator('.sr-results__problem .mc-status')).toHaveText(/^Search did not load\./);
    block = false;
    await box.press('i');
    await box.press('n');
    await box.press('g');
    await expect(page.locator('.sr-results button').first()).toContainText('Polisher jerks', { timeout: 8_000 });
  });

  test('search Try again with no signal at all says so; with the signal back it finds the fix', async ({ page, context }) => {
    const watch = watchLoads(page);
    // The search screen focuses its box on open, which starts the index load at once: block the lazy
    // pieces from the start, then take the whole signal away before Try again.
    let block = true;
    await page.route(ALL_LAZY, (route) => (block ? route.abort('internetdisconnected') : route.continue()));
    await page.goto('/search');
    await waitForScreen(page);
    const box = page.getByRole('searchbox').first();
    await box.fill('jerking');
    const problem = page.locator('.sr-results__problem');
    await expect(problem.locator('.mc-status')).toHaveText(/^Search did not load\./);
    await page.waitForTimeout(2_500); // the warm-up has run and failed too
    await context.setOffline(true);
    await problem.getByRole('button', { name: 'Try again' }).click();
    await expect(problem.locator('.mc-status')).toHaveText(/^Search still did not load\. There is no signal right now\./);
    expect(watch.loads(), 'no reload into the browser offline page').toBe(1);
    await context.setOffline(false);
    block = false;
    await problem.getByRole('button', { name: 'Try again' }).click();
    await expect(page.locator('.sr-results button').first()).toContainText('Polisher jerks', { timeout: 8_000 });
    expect(watch.errors).toEqual([]);
  });
});

test('the Academy opened from Home keeps working when Back and Forward cross a shard load', async ({ page }) => {
  const problems = watchProblems(page);
  await slowContent(page, 600);
  await openApp(page, '/');
  await page.getByRole('button', { name: /^Academy/ }).click();
  await page.goBack();
  await page.goForward();
  await waitForScreen(page);
  await expect(page.getByRole('heading', { level: 1, name: 'Academy' })).toBeVisible();
  await expect(page.getByRole('button', { name: /One full square/ })).toBeVisible();
  expectNoProblems(problems);
});
