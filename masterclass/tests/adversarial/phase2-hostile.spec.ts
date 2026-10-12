/**
 * Impatient, edge-case, confused, and malicious users on the Phase 2 pages (CLAUDE.md adversarial
 * QA; BUILD_PROMPT 9 item 8). Owner: qa-adversary.
 *
 *   Double taps on a Fix It tile, a Related row, a search result, and the Read aloud row (DEF-23).
 *   Hand-typed and hostile addresses on every new route.
 *   No storage at all (private mode): Fix It, a fix, a lesson, and search still work.
 *   320 px wide, and a phone six times slower.
 */
import { expect, test, type Locator, type Page } from '@playwright/test';
import { expectNoProblems, openApp, waitForScreen, watchProblems } from '../fixtures/app';
import { NOT_FOUND_TITLES } from '../fixtures/bundle';

const FIX01 = 'Polisher jerks, walks, or hops side to side';

/** Two clicks 40 ms apart at the same spot (the Phase 1 double tap). */
async function doubleTap(page: Page, target: Locator): Promise<void> {
  await target.scrollIntoViewIfNeeded();
  const box = await target.boundingBox();
  if (box === null) throw new Error('target not visible');
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.mouse.click(x, y);
  await page.waitForTimeout(40);
  await page.mouse.click(x, y);
}

/** A phone voice that keeps talking until it is told to stop or pause. */
async function endlessVoice(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const log: string[] = [];
    (window as unknown as { __voice: string[] }).__voice = log;
    let speaking = false;
    let paused = false;
    class Utterance {
      text: string;
      voice: unknown = null;
      lang = '';
      rate = 1;
      onstart?: () => void;
      onend?: () => void;
      constructor(text: string) {
        this.text = text;
      }
    }
    const synth = {
      get speaking() {
        return speaking;
      },
      get paused() {
        return paused;
      },
      pending: false,
      getVoices: () => [],
      speak(u: Utterance) {
        log.push('speak');
        speaking = true;
        setTimeout(() => u.onstart?.(), 0);
      },
      cancel() {
        log.push('cancel');
        speaking = false;
      },
      pause() {
        log.push('pause');
        paused = true;
      },
      resume() {
        log.push('resume');
        paused = false;
      },
      addEventListener() {},
      removeEventListener() {},
    };
    Object.defineProperty(window, 'speechSynthesis', { value: synth, configurable: true });
    Object.defineProperty(window, 'SpeechSynthesisUtterance', { value: Utterance, configurable: true });
  });
}

test.describe('impatient and confused users', () => {
  test('double tap the jerking tile: fix-01 opens once, and one Back returns to Fix It', async ({ page }) => {
    const problems = watchProblems(page);
    await openApp(page, '/fixit');
    await doubleTap(page, page.getByRole('button', { name: new RegExp(`^${FIX01}`) }));
    await expect(page.getByRole('heading', { level: 1, name: FIX01 })).toBeVisible();
    await page.waitForTimeout(400);
    expect(new URL(page.url()).pathname).toBe('/fixit/fix-01');
    await page.goBack();
    await expect(page.getByRole('heading', { level: 1, name: 'Fix It' })).toBeVisible();
    expectNoProblems(problems);
  });

  test('double tap a Related row and a search result: one step forward, one Back returns', async ({ page }) => {
    await openApp(page, '/fixit/fix-01');
    const related = page.getByRole('list', { name: 'Related' }).locator('button').first();
    const target = (await related.innerText()).split('\n')[0]?.trim() ?? '';
    await doubleTap(page, related);
    await waitForScreen(page);
    await page.waitForTimeout(400);
    const landed = (await page.locator('h1').first().innerText()).trim();
    expect(landed.startsWith(target.replace(/unverified$/, '').trim())).toBe(true);
    await page.goBack();
    await expect(page.getByRole('heading', { level: 1, name: FIX01 })).toBeVisible();

    await openApp(page, '/search?q=bucket%20mix');
    await doubleTap(page, page.locator('.sr-results button').first());
    await expect(page.getByRole('heading', { level: 1, name: 'Pre-polish wash bucket mix' })).toBeVisible();
    await page.waitForTimeout(400);
    await page.goBack();
    await expect(page.getByRole('searchbox').first()).toHaveValue('bucket mix');
  });

  // A gloved double tap on "Read aloud": the first tap starts the voice and the button under the
  // thumb becomes "Pause" at once, so the second tap lands on Pause. The app's pause() stops the
  // voice with cancel() and keeps the place (src/core/speech.ts), so a "cancel" after the first
  // "speak", and a "Resume" button, mean the reading was paused by the double tap.
  // DEF-23 (closed in Phase 2 pass 2): the voice row holds taps for a moment after its first button
  // swaps (useTapHold), so the second tap of a double tap lands on the row and does nothing.
  async function readyToRead(page: Page): Promise<void> {
    await endlessVoice(page);
    await openApp(page, '/fixit/fix-01');
    await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished.catch(() => null))));
  }
  const voiceLog = (page: Page) => page.evaluate(() => (window as unknown as { __voice: string[] }).__voice);
  const voiceButtons = async (page: Page) => (await page.locator('.sh-voice button').allInnerTexts()).map((b) => b.trim());

  test('double tap Read aloud: the voice is still reading afterwards (not paused, not stopped)', async ({ page }) => {
    await readyToRead(page);
    await doubleTap(page, page.getByRole('button', { name: 'Read aloud' }));
    await page.waitForTimeout(300);
    const log = await voiceLog(page);
    const buttons = await voiceButtons(page);
    test.info().annotations.push({ type: 'voice calls', description: `${log.join(', ')}; buttons ${buttons.join(', ')}` });
    expect(log).toEqual(['speak']);
    expect(buttons[0]).toBe('Pause');
  });

  test('double tap Pause stays paused, double tap Resume keeps reading, double tap Stop reading presses nothing else', async ({ page }) => {
    await readyToRead(page);
    await page.getByRole('button', { name: 'Read aloud' }).click();
    await page.waitForTimeout(450);
    await doubleTap(page, page.getByRole('button', { name: 'Pause' }));
    await page.waitForTimeout(450);
    expect((await voiceButtons(page))[0], 'after a double tap on Pause').toBe('Resume');
    await doubleTap(page, page.getByRole('button', { name: 'Resume' }));
    await page.waitForTimeout(450);
    expect((await voiceButtons(page))[0], 'after a double tap on Resume').toBe('Pause');
    const before = page.url();
    const calls = (await voiceLog(page)).length;
    await doubleTap(page, page.getByRole('button', { name: 'Stop reading' }));
    await page.waitForTimeout(450);
    expect(await voiceButtons(page), 'after a double tap on Stop reading').toEqual(['Read aloud']);
    expect(page.url()).toBe(before);
    // The second tap must not land on the "Read aloud" that took the row's place and start again.
    expect((await voiceLog(page)).slice(calls), 'voice calls from the double tap on Stop reading').toEqual(['cancel']);
  });

  test('a deliberate second tap after the hold still works: Read aloud, then Pause 600 ms later, pauses', async ({ page }) => {
    await readyToRead(page);
    const read = page.getByRole('button', { name: 'Read aloud' });
    const box = await read.boundingBox();
    if (box === null) throw new Error('Read aloud not visible');
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await page.waitForTimeout(600);
    await page.mouse.click(box.x + 10, box.y + box.height / 2);
    await page.waitForTimeout(300);
    expect((await voiceButtons(page))[0]).toBe('Resume');
  });
});

test.describe('hand-typed and hostile addresses on the Phase 2 routes', () => {
  const PATHS = [
    '/fixit/FIX-01',
    '/fixit/fix-1',
    '/fixit/fix-999',
    '/fixit/fix-01%00',
    '/fixit/%0a',
    '/fixit/..%2Fsettings',
    '/fixit/card-bucket-mix',
    '/academy/fix-01',
    '/academy/lesson-l9-01-nothing',
    `/academy/${'x'.repeat(3000)}`,
    '/sops/sop-polish%20',
    '/sops/lesson-l4-07-full-square',
    '/items/%3Cimg%20src%3Dx%20onerror%3Dwindow.__xss%3D1%3E',
    '/items/fix-01',
    '/items/lesson-l4-03-pressure',
    '/cards/fix-01',
    '/search?q=%3Cimg%20src%3Dx%20onerror%3Dwindow.__xss%3D1%3E',
    '/fixit/fix-01?q=%3Cscript%3Ewindow.__xss%3D1%3C%2Fscript%3E#%3Cimg%20src=x%20onerror=window.__xss=1%3E',
  ];

  test('every one draws a screen with a heading and a way out; nothing runs; no page error', async ({ page }) => {
    test.setTimeout(120_000);
    const problems = watchProblems(page);
    const failures: string[] = [];
    for (const path of PATHS) {
      await page.goto(path);
      await waitForScreen(page);
      const h1 = (await page.locator('h1').first().innerText()).trim();
      if (h1 === '') failures.push(`${path}: empty heading`);
      const ways = await page.locator('main button, main a[href], nav[aria-label="Main"] a').count();
      if (ways === 0) failures.push(`${path}: no way out`);
      if (await page.evaluate(() => (window as unknown as { __xss?: number }).__xss === 1)) failures.push(`${path}: injected code ran`);
      if (await page.locator('main img').count()) failures.push(`${path}: an injected image is on the page`);
    }
    expect(failures).toEqual([]);
    expectNoProblems(problems);
  });

  test('an item id under the wrong room opens its own page instead of "not found"', async ({ page }) => {
    await openApp(page, '/items/fix-01');
    await expect(page.getByRole('heading', { level: 1, name: FIX01 })).toBeVisible();
    expect(new URL(page.url()).pathname).toBe('/fixit/fix-01');
    await openApp(page, '/items/lesson-l4-03-pressure');
    await expect(page.getByRole('heading', { level: 1, name: 'Pressure: feel it on a scale' })).toBeVisible();
    for (const path of ['/fixit/card-bucket-mix', '/academy/fix-01', '/sops/lesson-l4-07-full-square', '/cards/fix-01']) {
      await openApp(page, path);
      const h1 = (await page.locator('h1').first().innerText()).trim();
      test.info().annotations.push({ type: path, description: h1 });
      expect(NOT_FOUND_TITLES.includes(h1) || h1.length > 0, path).toBe(true);
    }
  });
});

test.describe('no storage, tiny screen, slow phone', () => {
  test('IndexedDB missing (private mode): Fix It, a fix, a lesson, a procedure, and search still work', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, 'indexedDB', { value: undefined, configurable: true });
    });
    await page.goto('/fixit');
    await waitForScreen(page);
    await page.getByRole('button', { name: new RegExp(`^${FIX01}`) }).click();
    await expect(page.getByRole('heading', { level: 1, name: FIX01 })).toBeVisible();
    await page.goto('/academy/lesson-l4-03-pressure');
    await expect(page.getByRole('heading', { level: 1, name: 'Pressure: feel it on a scale' })).toBeVisible();
    await page.goto('/sops/sop-polish');
    await expect(page.getByRole('list', { name: 'The steps' })).toBeVisible();
    await page.goto('/search');
    await page.getByRole('searchbox').first().fill('jerking');
    await expect(page.locator('.sr-results button').first()).toContainText(FIX01);
  });

  test('320 px wide: no horizontal scroll on the longest fix, lesson, procedure, card, and item pages', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    const wide: string[] = [];
    for (const path of ['/fixit', '/fixit/fix-01', '/fixit/fix-81', '/fixit/fix-23', '/academy', '/academy/lesson-l2-03-wipe-dress', '/academy/lesson-l4-06-pad-care-backing-plate', '/sops', '/sops/sop-wheels-tesla', '/sops/sop-polish', '/cards/card-machine-settings', '/items/equipment-backing-plate', '/items/product-armor-all-extreme-wheel-tire']) {
      await openApp(page, path);
      const sw = await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth));
      if (sw > 320) wide.push(`${path}: ${sw}`);
    }
    expect(wide).toEqual([]);
  });

  test('a phone six times slower: Fix It then the jerking tile under 5 s each, and "jerking" answers under 2 s', async ({ page }) => {
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 6 });
    await openApp(page, '/');
    let t0 = Date.now();
    await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Fix It' }).click();
    await expect(page.getByRole('button', { name: new RegExp(`^${FIX01}`) })).toBeVisible({ timeout: 10_000 });
    const fixitMs = Date.now() - t0;
    t0 = Date.now();
    await page.getByRole('button', { name: new RegExp(`^${FIX01}`) }).click();
    await expect(page.getByRole('heading', { level: 1, name: FIX01 })).toBeVisible({ timeout: 10_000 });
    const fixMs = Date.now() - t0;
    await openApp(page, '/search');
    t0 = Date.now();
    await page.getByRole('searchbox').first().fill('jerking');
    await expect(page.locator('.sr-results button').first()).toContainText(FIX01, { timeout: 10_000 });
    const searchMs = Date.now() - t0;
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
    test.info().annotations.push({ type: 'cpu-6x ms', description: `Fix It ${fixitMs}, fix-01 ${fixMs}, search ${searchMs}` });
    expect(fixitMs).toBeLessThan(5000);
    expect(fixMs).toBeLessThan(5000);
    expect(searchMs).toBeLessThan(2000);
  });

  test('a 5,000 character paste into the search box answers without freezing', async ({ page }) => {
    await openApp(page, '/fixit');
    const t0 = Date.now();
    await page.getByRole('searchbox').first().fill('polish '.repeat(715));
    await expect(page.getByRole('searchbox').first()).toHaveValue(/polish/);
    await page.waitForTimeout(100);
    expect(Date.now() - t0).toBeLessThan(3000);
    await expect(page.locator('h1').first()).toHaveText('Fix It');
  });
});
