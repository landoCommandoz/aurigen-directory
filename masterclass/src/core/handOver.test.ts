/**
 * Hand over to another phone (D12 amendment, 2026-10-11 [HOUSE default]; BLUEPRINT 3.8 "Hand
 * over"): only a share that resolved switches the shop phone to study, in one transaction with one
 * roleChange entry. A closed or failed share, a download, a text copy, a study phone, or no owner
 * pass at the tap changes nothing.
 */
import 'fake-indexeddb/auto';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { POLISH_SEDAN, makeJob, priceItems } from './__tests__/fixtures';
import { exportBackup, type ShareOutcome } from './backup';
import { __setContentBundleForTests } from './content';
import { emptyBundle } from './contentBundle';
import { __resetDbForTests, getSettings, withDb } from './db';
import { handOver, handOverShareOutcome, startFresh } from './deviceRole';
import { __resetPinStateForTests, clearOwnerPass, ownerPassActive, verifyPin } from './pin';

const PIN = '482915';
let shareCalls = 0;

function installShare(behaviour: () => Promise<void>): void {
  shareCalls = 0;
  const share = () => {
    shareCalls += 1;
    return behaviour();
  };
  Object.defineProperty(navigator, 'share', { configurable: true, writable: true, value: share });
  Object.defineProperty(navigator, 'canShare', { configurable: true, writable: true, value: () => true });
}

function removeShare(): void {
  Reflect.deleteProperty(navigator, 'share');
  Reflect.deleteProperty(navigator, 'canShare');
}

async function shopPhone(): Promise<void> {
  const made = await startFresh({ warningAccepted: true, newPin: PIN });
  if (!made.ok) throw new Error(made.message);
  await withDb(async (db) => {
    await db.jobs.add(makeJob('delivered', { packageId: POLISH_SEDAN }));
    await db.jobs.add(makeJob('booked', { packageId: POLISH_SEDAN }));
  });
}

async function audit(type: string): Promise<string[]> {
  return (await withDb((db) => db.auditLog.where('type').equals(type).toArray())).map((a) => a.detail);
}

beforeEach(async () => {
  __setContentBundleForTests({ ...emptyBundle(), items: priceItems() });
  __resetPinStateForTests();
  await __resetDbForTests();
});

afterEach(() => {
  removeShare();
  __setContentBundleForTests(null);
});

describe('handOver', () => {
  it('the share resolved: study, with the PIN, the jobs, and Customer View off; one roleChange entry', async () => {
    await shopPhone();
    installShare(() => Promise.resolve());
    const prepared = await exportBackup();
    const before = await getSettings();
    const roleChanges = (await audit('roleChange')).length;
    const result = await handOver(prepared, { ownerPassAtStart: ownerPassActive() });
    expect(result).toMatchObject({ ok: true, role: 'study', share: { ok: true, path: 'share' } });
    expect(shareCalls).toBe(1);
    const after = await getSettings();
    expect(after).toMatchObject({ deviceRole: 'study', customerViewOn: false, ownerPin: before.ownerPin });
    expect(await withDb((db) => db.jobs.count())).toBe(2);
    const changes = await audit('roleChange');
    expect(changes).toHaveLength(roleChanges + 1);
    expect(changes.filter((d) => d === 'Shop phone to study phone (hand over)')).toHaveLength(1);
    expect(await audit('export')).toHaveLength(1);
  });

  it('a closed share sheet changes nothing and writes no audit entry', async () => {
    await shopPhone();
    installShare(() => Promise.reject(new DOMException('closed', 'AbortError')));
    const prepared = await exportBackup();
    const before = await getSettings();
    const auditBefore = await withDb((db) => db.auditLog.count());
    const result = await handOver(prepared, { ownerPassAtStart: true });
    expect(result).toMatchObject({ ok: false, code: 'shareNotDone' });
    expect(await getSettings()).toEqual(before);
    expect(await withDb((db) => db.auditLog.count())).toBe(auditBefore);
  });

  it('no owner pass at the tap: nothing is shared and nothing written', async () => {
    await shopPhone();
    installShare(() => Promise.resolve());
    const prepared = await exportBackup();
    clearOwnerPass();
    const before = await getSettings();
    expect(await handOver(prepared, { ownerPassAtStart: ownerPassActive() })).toMatchObject({ ok: false, code: 'noOwnerPass', share: null });
    expect(shareCalls).toBe(0);
    expect(await getSettings()).toEqual(before);
  });

  it('a study phone is refused before the share sheet opens', async () => {
    installShare(() => Promise.resolve());
    const prepared = await exportBackup();
    expect(await handOver(prepared, { ownerPassAtStart: true })).toMatchObject({ ok: false, code: 'notShop', share: null });
    expect(shareCalls).toBe(0);
    expect((await getSettings()).deviceRole).toBe('study');
  });

  it('a pass that lapses while the share sheet is open does not undo the switch once the share resolved', async () => {
    await shopPhone();
    installShare(() => {
      clearOwnerPass();
      return Promise.resolve();
    });
    const prepared = await exportBackup();
    const result = await handOver(prepared, { ownerPassAtStart: ownerPassActive() });
    expect(result).toMatchObject({ ok: true, role: 'study' });
    expect(ownerPassActive()).toBe(false);
    // The PIN stays on the phone and still works.
    expect((await verifyPin(PIN)).ok).toBe(true);
  });

  it('a damaged ordinary settings field does not strand a backup that left: the switch still lands, the field at its default', async () => {
    await shopPhone();
    await withDb(async (db) => {
      const row = await db.settings.get('device');
      await db.settings.put({ ...row, handedness: 'both' } as never);
    });
    installShare(() => Promise.resolve());
    const prepared = await exportBackup();
    expect(prepared.settingsRepaired).toEqual(['handedness']);
    expect(await handOver(prepared, { ownerPassAtStart: true })).toMatchObject({ ok: true, role: 'study' });
    expect(await getSettings()).toMatchObject({ deviceRole: 'study', handedness: 'left' });
  });

  it('only a resolved share counts: a download, a text copy, a closed sheet, or a refused tap never does', () => {
    const cases: Array<[ShareOutcome, string]> = [
      [{ ok: true, path: 'share', note: null }, 'shared'],
      [{ ok: true, path: 'download', note: null }, 'failed'],
      [{ ok: true, path: 'clipboard', note: null }, 'failed'],
      [{ ok: false, code: 'canceled', message: 'x', path: 'share' }, 'canceled'],
      [{ ok: false, code: 'needsTap', message: 'x', path: 'share' }, 'failed'],
      [{ ok: false, code: 'noShare', message: 'x', path: 'download' }, 'failed'],
    ];
    for (const [outcome, expected] of cases) expect(handOverShareOutcome(outcome)).toBe(expected);
  });
});
