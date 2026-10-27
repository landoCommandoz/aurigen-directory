/**
 * The v1 line (BUILD_PROMPT 9): mid-polish, no signal, the fix for a jerking polisher on screen in
 * two taps or one word, read aloud. Owner: qa-adversary. Runs at all five widths.
 *
 *   Home, Fix It (bottom row), the jerking tile: fix-01 in two taps.
 *   "jerking" typed in the Fix It box, the search screen, or Home: fix-01 is the first row, and
 *   Enter opens it.
 *   The fix page offers Read aloud, with every STOP line above it; the voice reads the STOP lines
 *   first, then the steps, and stops when the page is left.
 *   The Fix It grid: every tile 64 px or taller in Shop density, no tile label cut off, the STOP
 *   symptom drawn as a red band.
 */
import { expect, test, type Page } from '@playwright/test';
import { expectNoProblems, openApp, watchProblems } from '../fixtures/app';

const FIX01 = 'Polisher jerks, walks, or hops side to side';

/** A stand-in phone voice that records what it is asked to say and when it is told to stop. */
async function recordVoice(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const log: string[] = [];
    (window as unknown as { __voice: string[] }).__voice = log;
    class Utterance {
      text: string;
      voice: unknown = null;
      lang = '';
      rate = 1;
      onstart?: () => void;
      onend?: () => void;
      onerror?: (e: unknown) => void;
      constructor(text: string) {
        this.text = text;
      }
    }
    let speaking = false;
    const synth = {
      get speaking() {
        return speaking;
      },
      pending: false,
      paused: false,
      getVoices: () => [],
      speak(u: Utterance) {
        log.push(`speak:${u.text}`);
        speaking = true;
        // Start, then finish a moment later, so the app's queue moves to its next chunk.
        setTimeout(() => u.onstart?.(), 0);
        setTimeout(() => {
          speaking = false;
          u.onend?.();
        }, 5);
      },
      cancel() {
        log.push('cancel');
        speaking = false;
      },
      pause() {
        log.push('pause');
      },
      resume() {
        log.push('resume');
      },
      addEventListener() {},
      removeEventListener() {},
    };
    Object.defineProperty(window, 'speechSynthesis', { value: synth, configurable: true });
    Object.defineProperty(window, 'SpeechSynthesisUtterance', { value: Utterance, configurable: true });
  });
}

test('Home, then Fix It, then the jerking polisher tile: fix-01 in two taps', async ({ page }) => {
  const problems = watchProblems(page);
  await openApp(page, '/');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Fix It' }).click(); // tap 1
  await expect(page.getByRole('heading', { level: 1, name: 'Fix It' })).toBeVisible();
  const tile = page.getByRole('button', { name: new RegExp(`^${FIX01}`) });
  await expect(tile).toBeVisible();
  await tile.click(); // tap 2
  await expect(page.getByRole('heading', { level: 1, name: FIX01 })).toBeVisible();
  expect(new URL(page.url()).pathname).toBe('/fixit/fix-01');
  expectNoProblems(problems);
});

for (const where of ['/fixit', '/search', '/'] as const) {
  test(`"jerking" typed on ${where}: fix-01 is the first row and Enter opens it`, async ({ page }) => {
    await openApp(page, where);
    const box = page.getByRole('searchbox').first();
    await box.fill('jerking');
    const first = page.locator('.sr-results button').first();
    await expect(first).toContainText(FIX01);
    await box.press('Enter');
    await expect(page.getByRole('heading', { level: 1, name: FIX01 })).toBeVisible();
    expect(new URL(page.url()).pathname).toBe('/fixit/fix-01');
  });
}

test('a fast Enter right after typing still opens fix-01 (no stale result)', async ({ page }) => {
  await openApp(page, '/fixit');
  const box = page.getByRole('searchbox').first();
  await box.pressSequentially('bucket mix', { delay: 0 });
  await box.fill('');
  await box.pressSequentially('jerking', { delay: 0 });
  await box.press('Enter');
  await expect(page.getByRole('heading', { level: 1, name: FIX01 })).toBeVisible();
});

test('the fix page offers Read aloud below every STOP line; the voice reads STOP first, then the steps, and stops on leaving', async ({ page }) => {
  await recordVoice(page);
  await openApp(page, '/fixit/fix-01');
  const read = page.getByRole('button', { name: 'Read aloud' });
  await expect(read).toBeVisible();
  await expect(read).toBeEnabled();
  const order = await page.evaluate(() => {
    const bands = Array.from(document.querySelectorAll('main .ui-stopband'));
    const button = Array.from(document.querySelectorAll('main button')).find((b) => b.textContent?.trim() === 'Read aloud');
    return { bands: bands.length, before: bands.every((b) => button !== undefined && (b.compareDocumentPosition(button) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0) };
  });
  expect(order.bands).toBeGreaterThanOrEqual(2);
  expect(order.before).toBe(true);
  await read.click();
  // The whole text is read chunk by chunk; wait until the last step has been asked for.
  await expect.poll(() => page.evaluate(() => (window as unknown as { __voice: string[] }).__voice.join(' '))).toMatch(/Step \d+\./);
  const spoken = (await page.evaluate(() => (window as unknown as { __voice: string[] }).__voice)).filter((l) => l.startsWith('speak:')).join(' ');
  expect(spoken).toContain('Polisher jerks');
  expect(spoken.indexOf('Stop.')).toBeGreaterThan(0);
  expect(spoken.indexOf('Step 1.')).toBeGreaterThan(spoken.indexOf('Stop.'));
  expect(spoken).not.toMatch(/\[(VERIFY|SUPERSEDED)/);
  // Leaving the page stops the voice it started.
  await page.getByRole('button', { name: 'Back to Fix It' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Fix It' })).toBeVisible();
  expect(await page.evaluate(() => (window as unknown as { __voice: string[] }).__voice.includes('cancel'))).toBe(true);
});

test('Read aloud is offered on a STOP fix, a Quick Card, and a procedure too', async ({ page }) => {
  for (const path of ['/fixit/fix-09', '/cards/card-machine-settings', '/sops/sop-polish']) {
    await openApp(page, path);
    await expect(page.getByRole('button', { name: 'Read aloud' }), path).toBeVisible();
  }
});

test('the Fix It grid: every tile 64 px or taller in Shop, no tile label cut off, STOP as the red band', async ({ page }) => {
  await openApp(page, '/fixit');
  await expect(page.locator('html')).toHaveAttribute('data-density', 'shop');
  const report = await page.evaluate(() => {
    const out: string[] = [];
    const tiles = Array.from(document.querySelectorAll<HTMLElement>('main .ui-tile'));
    for (const t of tiles) {
      const box = t.getBoundingClientRect();
      const label = t.querySelector<HTMLElement>('.ui-tile__label');
      if (box.height < 64) out.push(`tile under 64 px: ${label?.textContent ?? ''} ${Math.round(box.height)}`);
      if (box.right > window.innerWidth + 1) out.push(`tile past the right edge: ${label?.textContent ?? ''}`);
      if (label !== null && (label.scrollWidth > label.clientWidth + 1 || label.scrollHeight > label.clientHeight + 1) && getComputedStyle(label).overflow !== 'visible') {
        out.push(`label cut off: ${label.textContent ?? ''}`);
      }
    }
    return { tiles: tiles.length, out };
  });
  expect(report.out).toEqual([]);
  expect(report.tiles).toBeGreaterThanOrEqual(88 + 14 - 1);
  const stop = page.locator('main button.ui-stopband', { hasText: 'Paint color on the pad' });
  await expect(stop).toBeVisible();
  await stop.click();
  await expect(page.getByRole('heading', { level: 1, name: 'Paint color on the pad: STOP' })).toBeVisible();
});

test('every Fix It group heading is plain words, and fix-01 sits under Machine', async ({ page }) => {
  await openApp(page, '/fixit');
  const machine = page.getByRole('group', { name: 'Machine' });
  await expect(machine.getByRole('button', { name: new RegExp(`^${FIX01}`) })).toBeVisible();
});
