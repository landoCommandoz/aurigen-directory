// @vitest-environment node
/**
 * Device role transitions (D12, BLUEPRINT 3.8 and 3.9) against the real core on fake IndexedDB:
 * the mistaken "This is the shop phone" tap with and without a PIN, Start fresh with and without
 * the warning, import to become the shop phone, and the backup round trip with its counters
 * (24 and 25 cars, 4 and 5 founder jobs).
 */
import 'fake-indexeddb/auto';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { exportBackup } from '../../src/core/backup';
import { importBackup, readBackup } from '../../src/core/backupImport';
import type { VerifiedBackup } from '../../src/core/backupFile';
import { __setContentBundleForTests } from '../../src/core/content';
import { emptyBundle } from '../../src/core/contentBundle';
import { summarizeCounters } from '../../src/core/counters';
import { __resetDbForTests, getSettings, withDb } from '../../src/core/db';
import { becomeShop, chooseStudy, demoteToStudy, getRole, startFresh } from '../../src/core/deviceRole';
import { __resetPinStateForTests, clearOwnerPass, ownerPassActive, setPin, verifyPin } from '../../src/core/pin';
import { canBecomeShop, canBecomeStudy } from '../../src/schemas';
import { carsLog, founderLog, qaPriceItems } from '../fixtures/jobs';

const PIN = '482915';

async function everything(): Promise<Record<string, unknown[]>> {
  return withDb(async (db) => {
    const out: Record<string, unknown[]> = {};
    for (const table of db.tables) out[table.name] = await table.toArray();
    return out;
  });
}

async function auditTypes(): Promise<string[]> {
  return (await withDb((db) => db.auditLog.toArray())).map((a) => a.type).sort();
}

async function verified(text: string): Promise<VerifiedBackup> {
  const r = await readBackup(text);
  if (!r.ok) throw new Error(`backup refused: ${r.message}`);
  return { verified: true, backup: r.backup, summary: r.summary };
}

/** Wipe the phone and its memory: a different phone. */
async function anotherPhone(): Promise<void> {
  __resetPinStateForTests();
  await __resetDbForTests();
  await getSettings();
}

beforeEach(async () => {
  __setContentBundleForTests({ ...emptyBundle(), items: qaPriceItems() });
  await anotherPhone();
});

afterAll(() => {
  __setContentBundleForTests(null);
});

describe('pure role rules', () => {
  it('canBecomeShop refuses a bare tap, a study backup, an unaccepted warning, and a missing PIN, in that order', () => {
    expect(canBecomeShop({ pinExists: true })).toMatchObject({ allowed: false, code: 'choosePath' });
    expect(canBecomeShop({ path: null, pinExists: true })).toMatchObject({ allowed: false, code: 'choosePath' });
    expect(canBecomeShop({ path: 'importBackup', pinExists: true, backupDeviceRole: 'study' })).toMatchObject({ allowed: false, code: 'notShopBackup' });
    expect(canBecomeShop({ path: 'importBackup', pinExists: true })).toMatchObject({ allowed: false, code: 'notShopBackup' });
    expect(canBecomeShop({ path: 'startFresh', pinExists: true })).toMatchObject({ allowed: false, code: 'warningNotAccepted' });
    expect(canBecomeShop({ path: 'startFresh', pinExists: false, startFreshWarningAccepted: true })).toMatchObject({ allowed: false, code: 'noPin' });
    expect(canBecomeShop({ path: 'importBackup', pinExists: false, backupDeviceRole: 'shop' })).toMatchObject({ allowed: false, code: 'noPin' });
    expect(canBecomeShop({ path: 'startFresh', pinExists: true, startFreshWarningAccepted: true })).toEqual({ allowed: true });
    expect(canBecomeShop({ path: 'importBackup', pinExists: true, backupDeviceRole: 'shop' })).toEqual({ allowed: true });
  });

  it('canBecomeStudy needs the owner pass on a shop phone only', () => {
    expect(canBecomeStudy({ currentRole: 'shop', ownerPassValid: false })).toMatchObject({ allowed: false, code: 'noOwnerPass' });
    expect(canBecomeStudy({ currentRole: 'shop', ownerPassValid: true })).toEqual({ allowed: true });
    expect(canBecomeStudy({ currentRole: 'study', ownerPassValid: false })).toEqual({ allowed: true });
  });
});

describe('the mistaken "This is the shop phone" tap', () => {
  it('with no PIN: refused, every table unchanged, still a study phone', async () => {
    const before = await everything();
    expect(await becomeShop()).toMatchObject({ ok: false, code: 'choosePath' });
    expect(await becomeShop({ path: null })).toMatchObject({ ok: false, code: 'choosePath' });
    expect(await everything()).toEqual(before);
    expect(await getRole()).toBe('study');
  });

  it('with a PIN and the owner pass open: still refused, nothing written', async () => {
    await setPin(PIN);
    expect(ownerPassActive()).toBe(true);
    const before = await everything();
    expect(await becomeShop({})).toMatchObject({ ok: false, code: 'choosePath' });
    expect(await everything()).toEqual(before);
    expect(await getRole()).toBe('study');
  });
});

describe('Start fresh', () => {
  it('is refused until the warning is accepted, and refused without a PIN; nothing is written either time', async () => {
    const before = await everything();
    expect(await startFresh({ warningAccepted: false, newPin: PIN })).toMatchObject({ ok: false, code: 'warningNotAccepted' });
    expect(await startFresh({ warningAccepted: true })).toMatchObject({ ok: false, code: 'noPin' });
    expect(await startFresh({ warningAccepted: true, newPin: '12345' })).toMatchObject({ ok: false, code: 'invalidPin' });
    expect(await everything()).toEqual(before);
  });

  it('with the warning and a new PIN: shop phone, job tables empty, counts zero, reminder on, Academy kept, audited', async () => {
    await withDb(async (db) => {
      await db.jobs.bulkAdd(carsLog(3));
    });
    const r = await startFresh({ warningAccepted: true, newPin: PIN });
    expect(r).toEqual({ ok: true, role: 'shop' });
    const s = await getSettings();
    expect(s).toMatchObject({ deviceRole: 'shop', carsLoggedBefore: 0, backupReminderWeekly: true, customerViewOn: false });
    expect(s.ownerPin).not.toBeNull();
    expect(await withDb((db) => db.jobs.count())).toBe(0);
    const crew = await withDb((db) => db.crewMembers.toArray());
    expect(crew.filter((c) => c.role === 'owner')).toHaveLength(1);
    expect(s.activeCrewId).toBe(crew.find((c) => c.role === 'owner')?.id);
    expect(await auditTypes()).toEqual(['pinSet', 'roleChange', 'startFresh']);
    expect(ownerPassActive()).toBe(true);
  });

  it('on a phone that already has a PIN: needs the owner pass (the existing PIN), not a new one', async () => {
    await setPin(PIN);
    clearOwnerPass();
    expect(await startFresh({ warningAccepted: true })).toMatchObject({ ok: false, code: 'noOwnerPass' });
    expect(await getRole()).toBe('study');
    await verifyPin(PIN);
    expect(await startFresh({ warningAccepted: true })).toEqual({ ok: true, role: 'shop' });
  });

  it('twice is refused the second time (already the shop phone), with nothing more written', async () => {
    await startFresh({ warningAccepted: true, newPin: PIN });
    const before = await everything();
    expect(await startFresh({ warningAccepted: true, newPin: '111111' })).toMatchObject({ ok: false, code: 'alreadyShop' });
    expect(await everything()).toEqual(before);
  });
});

describe('"This is a study phone" and back', () => {
  it('records the choice once; a second tap writes nothing more', async () => {
    expect(await chooseStudy()).toEqual({ ok: true, role: 'study' });
    expect(await chooseStudy()).toEqual({ ok: true, role: 'study' });
    expect(await auditTypes()).toEqual(['roleChange']);
  });

  it('a shop phone becomes a study phone only with the owner pass', async () => {
    await startFresh({ warningAccepted: true, newPin: PIN });
    clearOwnerPass();
    expect(await demoteToStudy()).toMatchObject({ ok: false, code: 'noOwnerPass' });
    expect(await chooseStudy()).toMatchObject({ ok: false, code: 'useSwitchToStudy' });
    expect(await getRole()).toBe('shop');
    await verifyPin(PIN);
    expect(await demoteToStudy()).toEqual({ ok: true, role: 'study' });
  });
});

describe('backup round trip and import to become the shop phone', () => {
  it.each([
    [24, 24],
    [25, 25],
  ])('a shop log of %i paint-touching cars (plus jobs that never count) exports and imports with carsLogged %i', async (paint, expected) => {
    await startFresh({ warningAccepted: true, newPin: PIN });
    const log = carsLog(paint);
    await withDb(async (db) => {
      await db.jobs.bulkAdd(log);
    });
    expect(summarizeCounters(log, qaPriceItems(), 0).carsLogged).toBe(expected);
    const out = await exportBackup({ photos: 'omitted' });
    expect(out.summary).toMatchObject({ jobs: log.length, carsLogged: expected, deviceRole: 'shop', hasPin: true });
    const shopPin = (await getSettings()).ownerPin;

    await anotherPhone();
    const backup = await verified(out.json);
    expect(await importBackup(backup, { path: 'importBackup', confirmed: false })).toMatchObject({ ok: false, code: 'notConfirmed' });
    expect(await getRole()).toBe('study');
    const result = await importBackup(backup, { path: 'importBackup', confirmed: true });
    expect(result).toMatchObject({ ok: true, deviceRole: 'shop', roleChanged: true, counters: { jobs: log.length, carsLogged: expected } });
    const s = await getSettings();
    expect(s.ownerPin).toEqual(shopPin);
    expect(s.customerViewOn).toBe(false);
    expect(await withDb((db) => db.jobs.count())).toBe(log.length);
    expect(await auditTypes()).toEqual(expect.arrayContaining(['import', 'roleChange']));
    // The old phone's pass does not carry over.
    expect(ownerPassActive()).toBe(false);
  });

  it.each([
    [4, 4],
    [5, 5],
  ])('%i founder jobs survive the round trip as %i founder slots used', async (count, expected) => {
    await startFresh({ warningAccepted: true, newPin: PIN });
    await withDb(async (db) => {
      await db.jobs.bulkAdd(founderLog(count));
    });
    const out = await exportBackup({ photos: 'included' });
    expect(out.summary.founderSlotsUsed).toBe(expected);
    await anotherPhone();
    const result = await importBackup(await verified(out.json), { path: 'importBackup', confirmed: true });
    expect(result).toMatchObject({ ok: true, counters: { founderSlotsUsed: expected, machinePolishJobsSold: expected } });
  });

  it('a study backup cannot make a phone the shop phone; nothing changes', async () => {
    await chooseStudy();
    await setPin(PIN);
    const out = await exportBackup();
    await anotherPhone();
    const before = await everything();
    expect(await becomeShop({ path: 'importBackup', backup: await verified(out.json), confirmedNewest: true })).toMatchObject({ ok: false, code: 'notShopBackup' });
    expect(await everything()).toEqual(before);
  });

  it('a phone that has its own PIN asks for it before its data is replaced', async () => {
    await startFresh({ warningAccepted: true, newPin: PIN });
    const out = await exportBackup();
    await anotherPhone();
    await setPin('111111');
    clearOwnerPass();
    const backup = await verified(out.json);
    expect(await importBackup(backup, { path: 'importBackup', confirmed: true })).toMatchObject({ ok: false, code: 'noOwnerPass' });
    expect(await getRole()).toBe('study');
    await verifyPin('111111');
    expect(await importBackup(backup, { path: 'importBackup', confirmed: true })).toMatchObject({ ok: true, deviceRole: 'shop' });
  });

  it('a tampered, truncated, unknown-version, or PIN-less shop backup is refused before anything is written', async () => {
    await startFresh({ warningAccepted: true, newPin: PIN });
    await withDb(async (db) => {
      await db.jobs.bulkAdd(carsLog(2));
    });
    const { json } = await exportBackup({ photos: 'omitted' });
    const raw = JSON.parse(json) as Record<string, unknown> & { tables: { settings: Array<Record<string, unknown>>; jobs: unknown[] } };

    const tampered = JSON.parse(json) as typeof raw;
    tampered.tables.jobs = tampered.tables.jobs.slice(1);
    const future = { ...raw, version: 2 };
    const noPin = JSON.parse(json) as typeof raw;
    if (noPin.tables.settings[0]) noPin.tables.settings[0].ownerPin = null;

    const results = {
      tampered: await readBackup(JSON.stringify(tampered)),
      truncated: await readBackup(json.slice(0, Math.floor(json.length / 2))),
      future: await readBackup(JSON.stringify(future)),
      noPin: await readBackup(JSON.stringify(noPin)),
      notJson: await readBackup('hello'),
      wrongKind: await readBackup(JSON.stringify({ ...raw, kind: 'something-else' })),
    };
    expect(results.tampered).toMatchObject({ ok: false, reason: 'damaged' });
    expect(results.truncated).toMatchObject({ ok: false, reason: 'notJson' });
    expect(results.future).toMatchObject({ ok: false, reason: 'unknownVersion' });
    expect(results.noPin.ok).toBe(false);
    expect(results.notJson).toMatchObject({ ok: false, reason: 'notJson' });
    expect(results.wrongKind).toMatchObject({ ok: false, reason: 'notThisKind' });
    const shortMessages = Object.entries(results).filter(([, r]) => r.ok || r.message.length < 10);
    expect(shortMessages).toEqual([]);
  });

  it('the backup never holds the plain PIN', async () => {
    await startFresh({ warningAccepted: true, newPin: PIN });
    const { json } = await exportBackup();
    expect(json).not.toContain(PIN);
  });
});
