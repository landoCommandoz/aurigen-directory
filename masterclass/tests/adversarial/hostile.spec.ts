/**
 * Edge-case and malicious users (CLAUDE.md adversarial QA, BLUEPRINT 3.8): storage denied, slow,
 * or full; malformed and tampered backups; URL tricks; Customer View flipped while a card is open;
 * a tiny screen and a slow phone.
 */
import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import {
  PIN,
  customerViewLeaks,
  expectNoProblems,
  makeShopPhone,
  openApp,
  readSettings,
  readStore,
  setUpStudyPhone,
  waitForScreen,
  watchProblems,
} from '../fixtures/app';

test.describe('storage', () => {
  test('IndexedDB missing (private mode, blocked): a plain message, never a blank page; Fix It and cards still work', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, 'indexedDB', { value: undefined, configurable: true });
    });
    const problems = watchProblems(page);
    await page.goto('/');
    await expect(page.getByText('This phone is not saving')).toBeVisible();
    await expect(page.getByText(/not letting the app save data/)).toBeVisible();
    await expect(page.locator('h1').first()).toBeVisible();
    await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Quick cards' }).click();
    await page.getByRole('button', { name: /^Pre-polish wash bucket mix/ }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Pre-polish wash bucket mix' })).toBeVisible();
    // Trying to create a PIN says why it cannot, in words.
    await page.goto('/settings/setup');
    await waitForScreen(page);
    await expect(page.locator('main')).toContainText(/not letting the app save data|not saving/);
    test.info().annotations.push({ type: 'console-errors-with-storage-blocked', description: problems.console.join(' | ').slice(0, 400) });
    expect(problems.page).toEqual([]);
  });

  test('IndexedDB that never answers (a slow or stuck phone): after 4 s the app offers Reload instead of "Opening" forever', async ({ page }) => {
    await page.addInitScript(() => {
      const idb = window.indexedDB;
      // open() returns a request that never fires success or error.
      idb.open = (() => ({}) as IDBOpenDBRequest) as typeof idb.open;
    });
    await page.goto('/');
    await expect(page.getByText('This phone is slow to answer. Reload, or close the app fully and open it again.')).toBeVisible({ timeout: 8000 });
    await expect(page.getByRole('button', { name: 'Reload' })).toBeVisible();
    // Even stuck, the frame is not blank: the app title is drawn.
    await expect(page.locator('.app-top__title')).toHaveText('Masterclass 101');
  });

  test('storage full on a write: a plain message, nothing half-written', async ({ page }) => {
    await page.addInitScript(() => {
      const flag = () => (window as unknown as { __full?: boolean }).__full === true;
      const quota = () => new DOMException('The quota has been exceeded.', 'QuotaExceededError');
      for (const method of ['put', 'add'] as const) {
        const real = IDBObjectStore.prototype[method];
        IDBObjectStore.prototype[method] = function patched(this: IDBObjectStore, ...args: Parameters<typeof real>) {
          if (flag()) throw quota();
          return real.apply(this, args);
        } as typeof real;
      }
    });
    await openApp(page, '/settings/setup');
    await page.evaluate(() => {
      (window as unknown as { __full: boolean }).__full = true;
    });
    await page.getByRole('button', { name: 'Create the owner PIN' }).click();
    for (let i = 0; i < 2; i += 1) {
      for (const d of PIN) await page.locator('fieldset.ui-pinpad').getByRole('button', { name: d, exact: true }).click();
    }
    await expect(page.getByText(/out of space for app data/)).toBeVisible();
    await page.evaluate(() => {
      (window as unknown as { __full: boolean }).__full = false;
    });
    const s = await readSettings(page);
    expect(s.ownerPin).toBeNull();
    expect(s.backupReminderWeekly).toBe(false);
    expect(await readStore(page, 'auditLog')).toEqual([]);
    // The PIN pad is still there with Cancel, so it is not a dead end.
    await expect(page.locator('fieldset.ui-pinpad').getByRole('button', { name: 'Cancel' })).toBeVisible();
  });
});

// DEF-08 (fix-before-deploy): one unknown field in the settings row (what a newer app version would
// write, then an older copy reads it after a rollback) makes every settings read throw RecordInvalid.
// The backup cannot be prepared, Restore cannot run, setup cannot save, and the banner's advice
// (Private Browsing, free space) does not apply. The only way out is wiping the site data, which is
// exactly what loses the jobs. Two unhandled promise rejections are logged on the way.
test.describe('a settings row the app does not recognise', () => {
  test('the phone can still make a backup and restore one', async ({ page }) => {
    await openApp(page, '/');
    await page.evaluate(
      () =>
        new Promise<void>((resolve, reject) => {
          const request = indexedDB.open('masterclass');
          request.onsuccess = () => {
            const tx = request.result.transaction('settings', 'readwrite');
            const store = tx.objectStore('settings');
            const get = store.get('device');
            get.onsuccess = () => store.put({ ...get.result, fieldFromANewerVersion: true });
            tx.oncomplete = () => {
              request.result.close();
              resolve();
            };
            tx.onerror = () => reject(tx.error);
          };
        }),
    );
    await openApp(page, '/settings/backup');
    await expect(page.getByText('The backup could not be prepared.', { exact: false })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Save backup', exact: true })).toBeEnabled();
  });
});

test.describe('backups: malformed, tampered, wrong phone', () => {
  async function openRestore(page: import('@playwright/test').Page) {
    await openApp(page, '/settings/backup');
    await page.getByRole('button', { name: 'Restore from a file' }).click();
    await expect(page.getByRole('button', { name: 'Pick the backup file' })).toBeVisible();
  }

  async function pick(page: import('@playwright/test').Page, name: string, text: string) {
    await page.locator('input[type="file"]').setInputFiles({ name, mimeType: 'application/json', buffer: Buffer.from(text) });
  }

  test('garbage, the wrong JSON, an unknown version, and a tampered file are each refused in words; nothing changes', async ({ page }) => {
    const download = await setUpStudyPhone(page);
    const good = readFileSync(await download.path(), 'utf8');
    const before = await readSettings(page);
    await openRestore(page);

    const cases: Array<{ name: string; text: string; expect: RegExp }> = [
      { name: 'garbage.json', text: 'not json at all {{{', expect: /not a Masterclass backup \(it is not JSON\)/ },
      { name: 'empty.json', text: '', expect: /not a Masterclass backup/ },
      { name: 'other.json', text: JSON.stringify({ hello: 'world' }), expect: /backup|Masterclass/i },
      { name: 'array.json', text: '[]', expect: /backup|Masterclass/i },
      { name: 'future.json', text: good.replace(/"version":\s*\d+/, '"version":999'), expect: /version|newer|backup/i },
      { name: 'tampered.json', text: good.replace('"study"', '"shop"'), expect: /damaged|checksum|backup/i },
    ];
    for (const c of cases) {
      await pick(page, c.name, c.text);
      const line = page.locator('.mc-section').getByText(/Nothing on this phone changed\./);
      await expect(line, c.name).toBeVisible();
      await expect(line, c.name).toContainText(c.expect);
      test.info().annotations.push({ type: `refusal ${c.name}`, description: (await line.innerText()).slice(0, 200) });
    }
    expect(await readSettings(page)).toEqual(before);
  });

  test('a study backup cannot make a phone the shop phone', async ({ page, browser }) => {
    const download = await setUpStudyPhone(page);
    const studyBackup = readFileSync(await download.path(), 'utf8');
    const fresh = await browser.newContext({ serviceWorkers: 'block' });
    const other = await fresh.newPage();
    await openApp(other, '/settings/device');
    await other.getByRole('button', { name: 'Import the newest backup' }).click();
    await other.locator('input[type="file"]').setInputFiles({ name: 'study.json', mimeType: 'application/json', buffer: Buffer.from(studyBackup) });
    await expect(other.getByText('This backup is from a study phone.', { exact: false })).toBeVisible();
    await expect(other.getByRole('button', { name: 'Yes, this is the newest backup' })).toBeDisabled();
    expect((await readSettings(other)).deviceRole).toBe('study');
    await fresh.close();
  });

  test('export on one phone, import on another: the shop role and the PIN hash come with it', async ({ page, browser }) => {
    const download = await makeShopPhone(page);
    if (download === null) throw new Error('no backup');
    const shopBackup = readFileSync(await download.path(), 'utf8');
    const original = await readSettings(page);

    const fresh = await browser.newContext({ serviceWorkers: 'block' });
    const other = await fresh.newPage();
    const problems = watchProblems(other);
    await openApp(other, '/settings/device');
    await other.getByRole('button', { name: 'Import the newest backup' }).click();
    await other.locator('input[type="file"]').setInputFiles({ name: 'shop.json', mimeType: 'application/json', buffer: Buffer.from(shopBackup) });
    await expect(other.getByRole('heading', { level: 1, name: 'Is this the newest backup from the shop phone?' })).toBeVisible();
    await other.getByRole('button', { name: 'Yes, this is the newest backup' }).click();
    await expect(other.getByText(/This is now the shop phone, with 0 jobs and 0 cars toward 25/)).toBeVisible();
    const imported = await readSettings(other);
    expect(imported.deviceRole).toBe('shop');
    expect(imported.ownerPin).toEqual(original.ownerPin);
    expect(imported.customerViewOn).toBe(false);
    const types = (await readStore<{ type: string }>(other, 'auditLog')).map((a) => a.type);
    expect(types).toContain('import');
    expect(types).toContain('roleChange');
    // The imported PIN works on the new phone.
    await openApp(other, '/settings');
    await other.getByRole('group', { name: 'Developer tools' }).getByText('On', { exact: true }).click();
    for (const d of PIN) await other.locator('fieldset.ui-pinpad').getByRole('button', { name: d, exact: true }).click();
    await expect(other.getByRole('button', { name: 'Open the developer panel' })).toBeVisible();
    expectNoProblems(problems);
    await fresh.close();
  });
});

test.describe('URL tricks', () => {
  test('the developer panel by URL in the production build shows "off" without the owner toggle, whatever the query or saved preview width', async ({ page }) => {
    await page.addInitScript(() => {
      try {
        window.localStorage.setItem('mc-device-preview-width', '375');
      } catch {
        // ignore
      }
    });
    for (const path of ['/settings/developer', '/settings/developer?dev=1', '/settings/developer#on', '/settings/developer/']) {
      await openApp(page, path);
      await expect(page.getByText('Developer tools are off.', { exact: false })).toBeVisible();
      await expect(page.locator('.mc-dev')).toHaveCount(0);
      await expect(page.getByRole('toolbar', { name: 'Device preview' })).toHaveCount(0);
      await expect(page.locator('iframe.app-preview__frame')).toHaveCount(0);
    }
  });

  test('a sign-off address typed by hand finds no sign-off screen (none exists before Phase 5)', async ({ page }) => {
    for (const path of ['/academy/signoff', '/signoff', '/settings/signoff', '/academy/skill-l4-machine-polishing/signoff']) {
      await openApp(page, path);
      await expect(page.getByRole('heading', { level: 1, name: 'No screen here' })).toBeVisible();
      await expect(page.locator('main').getByRole('link', { name: 'Home' })).toBeVisible();
    }
  });

  test('GitHub Pages deep link (?p=) restores a same-origin path and refuses anything else', async ({ page }) => {
    await page.goto('/?p=%2Fcards%2Fcard-bucket-mix');
    await expect(page.getByRole('heading', { level: 1, name: 'Pre-polish wash bucket mix' })).toBeVisible();
    for (const evil of ['//evil.example/x', '/\\evil.example', 'https://evil.example/', 'javascript:alert(1)']) {
      await page.goto(`/?p=${encodeURIComponent(evil)}`);
      await waitForScreen(page);
      const url = new URL(page.url());
      expect(url.origin, evil).toBe('http://localhost:4173');
      expect(url.pathname, evil).toBe('/');
      expect(url.search, evil).toBe('');
    }
    // Dot segments resolve inside the app and land on Not found, never outside the base.
    await page.goto(`/?p=${encodeURIComponent('/../../../etc')}`);
    await expect(page.getByRole('heading', { level: 1, name: 'No screen here' })).toBeVisible();
  });

  // DEF-02: the splat route "*" does not match a path whose first segment holds an encoded line
  // break (%0a, %0d), so <Routes> renders nothing: a blank page with no top bar, no bottom row, and no
  // boot fallback. Reachable from any link, and through the GitHub Pages 404 redirect (?p=).
  test('an address with an encoded line break still shows a screen with a way out', async ({ page }) => {
    const blank: string[] = [];
    for (const path of ['/%0a', '/abc%0d%0a', `/?p=${encodeURIComponent('/%0d%0aSet-Cookie')}`]) {
      await page.goto(path);
      await page.waitForTimeout(800);
      const rootLength = await page.evaluate(() => document.getElementById('root')?.innerHTML.length ?? 0);
      const hasExit = (await page.getByRole('link', { name: 'Home' }).count()) > 0;
      if (rootLength === 0 || !hasExit) blank.push(`${path} -> ${page.url()} (root ${rootLength} chars, Home link ${hasExit})`);
    }
    expect(blank, 'blank pages').toEqual([]);
  });

  test('the job and business placeholders open on a study phone and always have a way out', async ({ page }) => {
    for (const path of ['/job', '/business']) {
      await openApp(page, path);
      await expect(page.getByText(/shop phone only/)).toBeVisible();
      await expect(page.locator('main').getByRole('link', { name: 'Home' })).toBeVisible();
      await expect(page.locator('main').getByRole('link', { name: 'Quick cards' })).toBeVisible();
    }
  });
});

test.describe('Customer View flipped while something is open', () => {
  test('a card is open in one tab and Customer View turns on in another: the card is replaced at once, and comes back after', async ({ page, context }) => {
    await makeShopPhone(page);
    const card = await context.newPage();
    await openApp(card, '/cards/card-ipa-wipe');
    await expect(card.getByRole('heading', { level: 1, name: 'IPA panel wipe mix' })).toBeVisible();

    await openApp(page, '/');
    await page.getByRole('group', { name: 'Mode' }).getByText('Customer', { exact: true }).click();
    await expect(card.locator('html')).toHaveAttribute('data-density', 'customer');
    await expect(card.getByRole('heading', { level: 1, name: "Lando's Detailing" })).toBeVisible();
    const leaks = (await customerViewLeaks(card)).filter((l) => !l.includes('Focus'));
    expect(leaks).toEqual([]);

    await page.getByRole('button', { name: 'Exit Customer View' }).click();
    await expect(card.locator('html')).toHaveAttribute('data-density', 'shop');
    await expect(card.getByRole('heading', { level: 1, name: 'IPA panel wipe mix' })).toBeVisible();
  });

  test('a search result sheet is open and Customer View turns on: the sheet is gone, not left floating', async ({ page, context }) => {
    await makeShopPhone(page);
    const search = await context.newPage();
    await openApp(search, '/search');
    await search.getByRole('searchbox', { name: 'Search' }).fill('ipa');
    const first = search.getByRole('list').getByRole('button').first();
    await first.click();
    test.info().annotations.push({ type: 'after-result-tap', description: await search.locator('h1, h2').first().innerText() });

    await openApp(page, '/');
    await page.getByRole('group', { name: 'Mode' }).getByText('Customer', { exact: true }).click();
    await expect(search.locator('html')).toHaveAttribute('data-density', 'customer');
    await expect(search.getByRole('heading', { level: 1, name: "Lando's Detailing" })).toBeVisible();
    expect((await customerViewLeaks(search)).filter((l) => !l.includes('Focus'))).toEqual([]);
  });
});

test.describe('tiny screen and slow phone', () => {
  test('320 px wide (the smallest iPhone in use): no horizontal scroll on the main screens', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    const wide: string[] = [];
    for (const path of ['/', '/fixit', '/cards', '/cards/card-thickness-bands', '/search', '/settings', '/settings/device', '/settings/backup']) {
      await openApp(page, path);
      const sw = await page.evaluate(() => document.documentElement.scrollWidth);
      if (sw > 320) wide.push(`${path}: ${sw}`);
    }
    expect(wide).toEqual([]);
  });

  test('a phone six times slower still draws Home with the bottom row inside 5 s', async ({ page }) => {
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 6 });
    const t0 = Date.now();
    await page.goto('/');
    await expect(page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Fix It' })).toBeVisible({ timeout: 10_000 });
    const ms = Date.now() - t0;
    test.info().annotations.push({ type: 'cpu-6x-home-ms', description: String(ms) });
    expect(ms).toBeLessThan(5000);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  });
});
