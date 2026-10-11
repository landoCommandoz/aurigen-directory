/**
 * Fix-wave probes of "Hand over to another phone" (D12 amendment, 2026-10-11 [HOUSE default];
 * BLUEPRINT 3.8 "Hand over", 3.9). The owner's own tests cover the happy path; these go at the
 * order of events: no pass, a share that never ends, a pass that runs out mid-share, a role that
 * changed in another tab, two calls at once, a phone that cannot read its own role, and the file
 * the share carried landing on the next phone.
 */
import 'fake-indexeddb/auto';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { exportBackup } from '../../src/core/backup';
import { importBackup, readBackup } from '../../src/core/backupImport';
import { __setClockForTests } from '../../src/core/clock';
import { __setContentBundleForTests } from '../../src/core/content';
import { emptyBundle } from '../../src/core/contentBundle';
import { turnCustomerViewOn } from '../../src/core/customerView';
import { __resetDbForTests, getSettings, withDb } from '../../src/core/db';
import { demoteToStudy, handOver, startFresh } from '../../src/core/deviceRole';
import { OWNER_PASS_MS, __resetPinStateForTests, clearOwnerPass, ownerPassActive, verifyPin } from '../../src/core/pin';
import { __resetSettingsStoreForTests } from '../../src/core/settingsStore';
import { HAND_OVER_SHARE_OUTCOMES, ROLE_CAN, SETTINGS_ID, canHandOver, settingsOnHandOver, type DeviceRoleName, type SettingsValue } from '../../src/schemas';
import { carsLog, founderLog, qaPriceItems } from '../fixtures/jobs';

const PIN = '482915';
let mono = 0;
let shared: File[] = [];
let shareCalls = 0;

function installShare(behaviour: () => Promise<void>): void {
  shareCalls = 0;
  shared = [];
  const share = (data: ShareData) => {
    shareCalls += 1;
    shared.push(...(data.files ?? []));
    return behaviour();
  };
  Object.defineProperty(navigator, 'share', { configurable: true, writable: true, value: share });
  Object.defineProperty(navigator, 'canShare', { configurable: true, writable: true, value: () => true });
}

function removeShare(): void {
  Reflect.deleteProperty(navigator, 'share');
  Reflect.deleteProperty(navigator, 'canShare');
}

async function shopPhone(): Promise<number> {
  const made = await startFresh({ warningAccepted: true, newPin: PIN });
  if (!made.ok) throw new Error(made.message);
  const rows = [...carsLog(25), ...founderLog(4)];
  await withDb((db) => db.jobs.bulkAdd(rows));
  return rows.length;
}

async function audit(type: string): Promise<string[]> {
  return (await withDb((db) => db.auditLog.where('type').equals(type).toArray())).map((a) => a.detail);
}

beforeEach(async () => {
  mono = 50_000;
  __setClockForTests({ monotonic: () => mono });
  __setContentBundleForTests({ ...emptyBundle(), items: qaPriceItems() });
  __resetSettingsStoreForTests();
  __resetPinStateForTests();
  await __resetDbForTests();
});

afterEach(() => {
  removeShare();
  __setClockForTests();
  __setContentBundleForTests(null);
});

describe('canHandOver: every combination', () => {
  const roles: DeviceRoleName[] = ['study', 'shop'];
  for (const role of roles) {
    for (const pass of [true, false]) {
      for (const share of HAND_OVER_SHARE_OUTCOMES) {
        const allowed = role === 'shop' && pass && share === 'shared';
        it(`${role}, pass ${pass ? 'open' : 'closed'}, share ${share}: ${allowed ? 'switches' : 'changes nothing'}`, () => {
          const decision = canHandOver({ currentRole: role, ownerPassAtStart: pass, share });
          expect(decision.allowed).toBe(allowed);
          const words = decision.allowed ? '' : decision.message;
          expect(words).not.toMatch(/undefined|null|\[object/);
        });
      }
    }
  }

  it('settingsOnHandOver keeps the PIN and every other setting; only the role, the time, and Customer View change', () => {
    const before = { deviceRole: 'shop', ownerPin: { algorithm: 'SHA-256' }, customerViewOn: true, focusReminderShown: true, carsLoggedBefore: 12, lastBackupAt: 'x' } as unknown as SettingsValue;
    const after = settingsOnHandOver(before, '2026-10-11T00:00:00.000Z');
    expect(after).toEqual({ ...before, deviceRole: 'study', roleChosenAt: '2026-10-11T00:00:00.000Z', customerViewOn: false, focusReminderShown: false });
  });
});

describe('handOver: the order of events', () => {
  it('with no owner pass at the tap: the share sheet never opens and nothing is written', async () => {
    await shopPhone();
    installShare(() => Promise.resolve());
    const prepared = await exportBackup({ photos: 'omitted' });
    clearOwnerPass();
    const before = await getSettings();
    expect(await handOver(prepared, { ownerPassAtStart: ownerPassActive() })).toMatchObject({ ok: false, code: 'noOwnerPass', share: null });
    expect(shareCalls).toBe(0);
    expect(await getSettings()).toEqual(before);
    expect(await audit('export')).toEqual([]);
  });

  it('while the share sheet is open the phone is still the shop phone; it switches only when the share resolves', async () => {
    await shopPhone();
    let finish: () => void = () => undefined;
    installShare(() => new Promise<void>((resolve) => (finish = resolve)));
    const prepared = await exportBackup({ photos: 'omitted' });
    const pending = handOver(prepared, { ownerPassAtStart: ownerPassActive() });
    await new Promise((r) => setTimeout(r, 30));
    expect(shareCalls).toBe(1);
    expect((await getSettings()).deviceRole).toBe('shop');
    expect(await audit('roleChange')).not.toContain('Shop phone to study phone (hand over)');
    finish();
    expect(await pending).toMatchObject({ ok: true, role: 'study' });
    expect((await getSettings()).deviceRole).toBe('study');
  });

  it('the owner pass runs out while the share sheet is open: the backup left, so the switch still happens', async () => {
    await shopPhone();
    installShare(() => {
      mono += OWNER_PASS_MS + 1_000;
      return Promise.resolve();
    });
    const prepared = await exportBackup({ photos: 'omitted' });
    const result = await handOver(prepared, { ownerPassAtStart: ownerPassActive() });
    expect(ownerPassActive()).toBe(false);
    expect(result).toMatchObject({ ok: true, role: 'study' });
  });

  it('another tab made it a study phone before the share resolved: no second roleChange, still study', async () => {
    await shopPhone();
    installShare(async () => {
      expect((await demoteToStudy()).ok).toBe(true);
    });
    const prepared = await exportBackup({ photos: 'omitted' });
    const result = await handOver(prepared, { ownerPassAtStart: ownerPassActive() });
    expect(result).toMatchObject({ ok: false, code: 'notShop' });
    expect((await audit('roleChange')).filter((d) => d.startsWith('Shop phone to study phone'))).toHaveLength(1);
    expect((await getSettings()).deviceRole).toBe('study');
  });

  it('two calls at once (a double tap that got past the screen): one switch, one roleChange entry', async () => {
    await shopPhone();
    installShare(() => Promise.resolve());
    const prepared = await exportBackup({ photos: 'omitted' });
    const pass = ownerPassActive();
    const [a, b] = await Promise.all([handOver(prepared, { ownerPassAtStart: pass }), handOver(prepared, { ownerPassAtStart: pass })]);
    expect([a.ok, b.ok].filter(Boolean)).toHaveLength(1);
    expect((await audit('roleChange')).filter((d) => d === 'Shop phone to study phone (hand over)')).toHaveLength(1);
  });

  it('a phone that cannot read its own role cannot hand over: nothing is shared or written', async () => {
    await shopPhone();
    await withDb(async (db) => {
      const row = await db.settings.get(SETTINGS_ID);
      await db.settings.put({ ...row, deviceRole: 'crewTablet' } as unknown as SettingsValue);
    });
    installShare(() => Promise.resolve());
    const prepared = await exportBackup({ photos: 'omitted' });
    expect(prepared.settings).toBe('unreadable');
    expect(await handOver(prepared, { ownerPassAtStart: true })).toMatchObject({ ok: false, code: 'notShop', share: null });
    expect(shareCalls).toBe(0);
  });

  it('a download (no share sheet) never switches the phone, even though the file was saved', async () => {
    await shopPhone();
    removeShare();
    const created = URL.createObjectURL;
    URL.createObjectURL = () => 'blob:qa';
    try {
      const prepared = await exportBackup({ photos: 'omitted' });
      const result = await handOver(prepared, { ownerPassAtStart: ownerPassActive() });
      expect(result).toMatchObject({ ok: false, code: 'shareNotDone' });
      expect((await getSettings()).deviceRole).toBe('shop');
    } finally {
      URL.createObjectURL = created;
    }
  });
});

describe('handOver: afterwards', () => {
  it('the old phone keeps its jobs and PIN but runs no shop tools; the shared file makes the next phone the shop phone with equal counts', async () => {
    const jobs = await shopPhone();
    installShare(() => Promise.resolve());
    const prepared = await exportBackup({ photos: 'included' });
    expect(await handOver(prepared, { ownerPassAtStart: ownerPassActive() })).toMatchObject({ ok: true });
    const old = await getSettings();
    expect(old.deviceRole).toBe('study');
    expect(old.ownerPin).not.toBeNull();
    expect(ROLE_CAN[old.deviceRole]).toMatchObject({ createJobs: false, businessRoom: false, signOff: false, customerView: false });
    expect(await turnCustomerViewOn()).toMatchObject({ ok: false });
    expect(await withDb((db) => db.jobs.count())).toBe(jobs);
    expect(await audit('export')).toHaveLength(1);
    // The PIN still opens the pass on the old phone (it stays for the Academy and a later Start fresh).
    __resetPinStateForTests();
    expect(await verifyPin(PIN)).toEqual({ ok: true });

    // The file the share sheet carried, on a wiped phone.
    expect(shared).toHaveLength(1);
    const text = await (shared[0] as File).text();
    __resetPinStateForTests();
    await __resetDbForTests();
    const read = await readBackup(text);
    if (!read.ok) throw new Error(read.message);
    const imported = await importBackup({ verified: true, backup: read.backup, summary: read.summary }, { path: 'importBackup', confirmed: true });
    expect(imported).toMatchObject({ ok: true, deviceRole: 'shop' });
    if (!imported.ok) throw new Error('import refused');
    expect(imported.counters).toMatchObject({ jobs, carsLogged: prepared.summary.carsLogged, founderSlotsUsed: prepared.summary.founderSlotsUsed });
    expect(prepared.summary.founderSlotsUsed).toBe(4);
    expect(await verifyPin(PIN)).toEqual({ ok: true });
  });
});
