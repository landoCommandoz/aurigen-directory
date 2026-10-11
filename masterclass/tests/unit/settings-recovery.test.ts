// @vitest-environment node
/**
 * Pass 2 recheck of DEF-08 (one settings field the app does not know blocked backup and restore),
 * aimed at the edges of the fix rather than its happy path (the owner's own tests cover that):
 *
 * - a newer version's row while Customer View is on: the flag survives, the way out works;
 * - the salvage never opens a gate: a shop row with no PIN never reads as a shop phone, never
 *   turns Customer View on, never opens the owner pass;
 * - DEF-13 (new in pass 2): when the role or the PIN field itself is from a newer version, no
 *   backup can be made at all, so the jobs cannot leave the phone. Marked it.fails until fixed.
 */
import 'fake-indexeddb/auto';
import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import { exportBackup } from '../../src/core/backup';
import { importBackup, readBackup } from '../../src/core/backupImport';
import { __setContentBundleForTests } from '../../src/core/content';
import { emptyBundle } from '../../src/core/contentBundle';
import { turnCustomerViewOff, turnCustomerViewOn } from '../../src/core/customerView';
import { __resetDbForTests, getSettings, withDb } from '../../src/core/db';
import { becomeShop, startFresh } from '../../src/core/deviceRole';
import { SETTINGS_UNREADABLE_MESSAGE } from '../../src/core/errors';
import { __resetPinStateForTests, clearOwnerPass, ownerPassActive, verifyPin } from '../../src/core/pin';
import { __resetSettingsStoreForTests, settingsSettled } from '../../src/core/settingsStore';
import { SETTINGS_ID, type SettingsValue } from '../../src/schemas';
import { carsLog, qaPriceItems } from '../fixtures/jobs';

const PIN = '482915';

async function patchRow(patch: Record<string, unknown>): Promise<void> {
  await withDb(async (db) => {
    const row = await db.settings.get(SETTINGS_ID);
    await db.settings.put({ ...row, ...patch } as unknown as SettingsValue);
  });
}

async function rawRow(): Promise<Record<string, unknown>> {
  return withDb(async (db) => (await db.settings.get(SETTINGS_ID)) as unknown as Record<string, unknown>);
}

/** A shop phone holding carsLog(cars): the paint cars plus the jobs that never count. Returns the job row count. */
async function shopPhoneWithJobs(cars = 3): Promise<number> {
  const made = await startFresh({ warningAccepted: true, newPin: PIN });
  if (!made.ok) throw new Error(`startFresh refused: ${made.message}`);
  const rows = carsLog(cars);
  await withDb((db) => db.jobs.bulkAdd(rows));
  return rows.length;
}

/** A reload: memory gone (pass, live snapshot), the database kept. */
function reload(): void {
  __resetSettingsStoreForTests();
  __resetPinStateForTests();
}

beforeEach(async () => {
  __setContentBundleForTests({ ...emptyBundle(), items: qaPriceItems() });
  __resetSettingsStoreForTests();
  __resetPinStateForTests();
  await __resetDbForTests();
});

afterEach(() => {
  __resetSettingsStoreForTests();
});

afterAll(() => {
  __setContentBundleForTests(null);
});

describe('DEF-08 recheck: a newer version wrote the row while Customer View was on', () => {
  it('after a reload Customer View is still on (fail closed), and Exit Customer View works and drops the unknown field', async () => {
    await shopPhoneWithJobs();
    expect((await turnCustomerViewOn()).ok).toBe(true);
    await patchRow({ fieldFromANewerVersion: { nested: [1, 2, 3] } });
    reload();
    const snap = await settingsSettled();
    expect(snap.status).toBe('ready');
    expect(snap.settings?.customerViewOn).toBe(true);
    expect(await turnCustomerViewOff()).toEqual({ ok: true, on: false });
    expect(await rawRow()).not.toHaveProperty('fieldFromANewerVersion');
    expect((await getSettings()).ownerPin).not.toBeNull();
  });

  it('the backup made from that row restores on a wiped phone with the jobs and the PIN intact', async () => {
    const jobs = await shopPhoneWithJobs(25);
    await patchRow({ fieldFromANewerVersion: 'x', anotherOne: 2 });
    const prepared = await exportBackup({ photos: 'omitted' });
    expect(prepared.summary.jobs).toBe(jobs);
    expect(prepared.summary.carsLogged).toBe(25);
    expect(prepared.json).not.toContain('fieldFromANewerVersion');
    reload();
    await __resetDbForTests();
    const read = await readBackup(prepared.json);
    if (!read.ok) throw new Error(read.message);
    const imported = await importBackup({ verified: true, backup: read.backup, summary: read.summary }, { path: 'importBackup', confirmed: true });
    expect(imported).toMatchObject({ ok: true, deviceRole: 'shop' });
    expect(await withDb((db) => db.jobs.count())).toBe(jobs);
    expect((await verifyPin(PIN)).ok).toBe(true);
  });
});

describe('DEF-08 recheck: the salvage never opens a gate', () => {
  it('a shop row with no PIN (plus an unknown key) never reads as a shop phone, never turns Customer View on, never opens the pass', async () => {
    await getSettings();
    await patchRow({ deviceRole: 'shop', roleChosenAt: '2026-10-10T12:00:00.000Z', ownerPin: null, fieldFromANewerVersion: true });
    reload();
    const snap = await settingsSettled();
    expect(snap.status).toBe('unavailable');
    expect(snap.settings?.deviceRole).not.toBe('shop');
    expect(await turnCustomerViewOn()).toMatchObject({ ok: false });
    expect(await verifyPin(PIN)).toMatchObject({ ok: false });
    expect(ownerPassActive()).toBe(false);
    await expect(exportBackup({ photos: 'omitted' })).rejects.toThrow(SETTINGS_UNREADABLE_MESSAGE);
  });

  it('a damaged ordinary field never resets the role to a weaker or stronger one: role and PIN read as saved', async () => {
    const jobs = await shopPhoneWithJobs();
    await patchRow({ handedness: 'both', photoCapPerJob: -1, wakeLock: 'yes' });
    const prepared = await exportBackup({ photos: 'omitted' });
    expect(prepared.settingsRepaired.sort()).toEqual(['handedness', 'photoCapPerJob', 'wakeLock']);
    expect(prepared.summary).toMatchObject({ deviceRole: 'shop', hasPin: true, jobs });
    // The ordinary path still refuses in plain words (no schema text), and changes nothing.
    expect(await becomeShop({ path: 'startFresh', warningAccepted: true, newPin: '111111' })).toMatchObject({ ok: false, message: SETTINGS_UNREADABLE_MESSAGE });
    expect(await rawRow()).toMatchObject({ handedness: 'both', deviceRole: 'shop' });
  });
});

describe('DEF-13 (new in pass 2): the role or PIN field from a newer version traps the jobs', () => {
  // D5 allows a rollback. If a later version adds a role (for example a crew tablet) or moves the
  // PIN to a new hash, the older copy can no longer read that field. The fix for DEF-08 refuses to
  // guess those two fields, which is right for the gates, but it also refuses the backup, so the
  // jobs cannot leave the phone, and the words on screen send the person to Backup, which just failed.
  it.fails('a role this version does not know: a backup can still be made with every job in it', async () => {
    const jobs = await shopPhoneWithJobs(25);
    await patchRow({ deviceRole: 'crewTablet' });
    reload();
    const prepared = await exportBackup({ photos: 'omitted' });
    expect(prepared.summary.jobs).toBe(jobs);
  });

  it.fails('a PIN record from a newer hash: a backup can still be made with every job in it', async () => {
    const jobs = await shopPhoneWithJobs(25);
    const pin = (await rawRow()).ownerPin as Record<string, unknown>;
    await patchRow({ ownerPin: { ...pin, algorithm: 'Argon2id' } });
    reload();
    const prepared = await exportBackup({ photos: 'omitted' });
    expect(prepared.summary.jobs).toBe(jobs);
  });

  it('today: the refusal is plain words, writes nothing, and opens no gate', async () => {
    const jobs = await shopPhoneWithJobs(25);
    await patchRow({ deviceRole: 'crewTablet' });
    reload();
    await expect(exportBackup({ photos: 'omitted' })).rejects.toThrow(SETTINGS_UNREADABLE_MESSAGE);
    expect(await verifyPin(PIN)).toMatchObject({ ok: false, code: 'storage' });
    clearOwnerPass();
    expect(ownerPassActive()).toBe(false);
    expect(await turnCustomerViewOn()).toMatchObject({ ok: false });
    expect(await rawRow()).toMatchObject({ deviceRole: 'crewTablet' });
    expect(await withDb((db) => db.jobs.count())).toBe(jobs);
    expect((await settingsSettled()).status).toBe('unavailable');
  });
});
