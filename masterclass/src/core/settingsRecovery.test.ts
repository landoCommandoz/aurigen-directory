// @vitest-environment node
/**
 * DEF-08 over a real (fake) IndexedDB: a settings row a newer version wrote, then a row with a
 * damaged field, then one whose PIN cannot be read. The phone can still back up, restore, set
 * its role, and check the PIN where that is safe; every refusal is plain words, never a throw.
 */
import 'fake-indexeddb/auto';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { SETTINGS_ID, type SettingsValue } from '../schemas';
import { priceItems } from './__tests__/fixtures';
import { exportBackup } from './backup';
import { importBackup, readBackup } from './backupImport';
import { __setContentBundleForTests } from './content';
import { emptyBundle } from './contentBundle';
import { __resetDbForTests, dbStatus, getSettings, withDb } from './db';
import { turnCustomerViewOff, turnCustomerViewOn } from './customerView';
import { chooseStudy, startFresh } from './deviceRole';
import { RecordInvalid, SETTINGS_UNREADABLE_MESSAGE } from './errors';
import { __resetPinStateForTests, clearOwnerPass, hasPin, setPin, verifyPin } from './pin';
import { __resetSettingsStoreForTests, getSettingsSnapshot, settingsSettled, subscribeSettings } from './settingsStore';

const PIN = '482915';

/** Change the stored row behind the app's back, the way a newer version or a damaged write would. */
async function patchStoredRow(patch: Record<string, unknown>): Promise<void> {
  await withDb(async (db) => {
    const row = await db.settings.get(SETTINGS_ID);
    await db.settings.put({ ...row, ...patch } as unknown as SettingsValue);
  });
}

async function storedRow(): Promise<Record<string, unknown>> {
  return withDb(async (db) => (await db.settings.get(SETTINGS_ID)) as unknown as Record<string, unknown>);
}

async function shopPhone(): Promise<void> {
  const result = await startFresh({ warningAccepted: true, newPin: PIN });
  if (!result.ok) throw new Error(`startFresh refused: ${result.message}`);
}

async function verified(json: string) {
  const read = await readBackup(json);
  if (!read.ok) throw new Error(`backup refused: ${read.message}`);
  return read;
}

beforeEach(async () => {
  __setContentBundleForTests({ ...emptyBundle(), items: priceItems() });
  __resetSettingsStoreForTests();
  __resetPinStateForTests();
  await __resetDbForTests();
});

afterEach(() => {
  __resetSettingsStoreForTests();
  __setContentBundleForTests(null);
});

describe('a field a newer version added (the D5 rollback case QA reproduced)', () => {
  it('every read works, the field is named for the developer panel, and the next write drops it', async () => {
    await getSettings();
    await patchStoredRow({ fieldFromANewerVersion: true });
    expect((await getSettings()).deviceRole).toBe('study');
    expect(dbStatus.get().ignoredSettingsFields).toEqual(['fieldFromANewerVersion']);
    expect(await chooseStudy()).toEqual({ ok: true, role: 'study' });
    expect(await storedRow()).not.toHaveProperty('fieldFromANewerVersion');
  });

  it('the backup can be prepared and holds a clean settings row', async () => {
    expect((await startFresh({ warningAccepted: true, newPin: PIN })).ok).toBe(true);
    await patchStoredRow({ fieldFromANewerVersion: true });
    const prepared = await exportBackup({ photos: 'omitted' });
    expect(prepared.settingsRepaired).toEqual([]);
    expect(prepared.summary).toMatchObject({ deviceRole: 'shop', hasPin: true });
    expect(prepared.json).not.toContain('fieldFromANewerVersion');
    expect((await readBackup(prepared.json)).ok).toBe(true);
  });

  it('Restore replaces the row (with the owner pass, as always)', async () => {
    expect((await startFresh({ warningAccepted: true, newPin: PIN })).ok).toBe(true);
    const backup = await verified((await exportBackup({ photos: 'omitted' })).json);
    await patchStoredRow({ fieldFromANewerVersion: true });
    clearOwnerPass();
    expect(await importBackup(backup, { path: 'restore', confirmed: true })).toMatchObject({ ok: false, code: 'noOwnerPass' });
    expect((await verifyPin(PIN)).ok).toBe(true);
    expect(await importBackup(backup, { path: 'restore', confirmed: true })).toMatchObject({ ok: true, deviceRole: 'shop' });
    expect(await storedRow()).not.toHaveProperty('fieldFromANewerVersion');
  });

  it('the live snapshot is ready (no banner), not unavailable', async () => {
    await getSettings();
    await patchStoredRow({ fieldFromANewerVersion: true });
    const off = subscribeSettings(() => undefined);
    const snap = await settingsSettled();
    off();
    expect(snap.status).toBe('ready');
  });
});

describe('a damaged ordinary field (a newer version changed its type)', () => {
  beforeEach(async () => {
    await shopPhone();
    await patchStoredRow({ handedness: 'both', customerViewOn: true });
    clearOwnerPass();
  });

  it('ordinary reads refuse in plain words; action functions return that refusal, never throw', async () => {
    await expect(getSettings()).rejects.toBeInstanceOf(RecordInvalid);
    await expect(getSettings()).rejects.toThrow(SETTINGS_UNREADABLE_MESSAGE);
    expect(await chooseStudy()).toEqual({ ok: false, code: 'storage', message: SETTINGS_UNREADABLE_MESSAGE });
    expect(await setPin('111111')).toEqual({ ok: false, code: 'storage', message: SETTINGS_UNREADABLE_MESSAGE });
  });

  it('the backup is still made: the jobs, the role, and the PIN as they are, the damaged field at its default and named', async () => {
    const prepared = await exportBackup({ photos: 'omitted' });
    expect(prepared.settingsRepaired).toEqual(['handedness']);
    expect(prepared.summary).toMatchObject({ deviceRole: 'shop', hasPin: true });
    expect(JSON.parse(prepared.json).tables.settings[0]).toMatchObject({ handedness: 'left', deviceRole: 'shop' });
  });

  it('the PIN still opens the owner pass, and Restore heals the row', async () => {
    const backup = await verified((await exportBackup({ photos: 'omitted' })).json);
    expect(await hasPin()).toBe(true);
    expect(await importBackup(backup, { path: 'restore', confirmed: true })).toMatchObject({ ok: false, code: 'noOwnerPass' });
    expect((await verifyPin(PIN)).ok).toBe(true);
    expect(await importBackup(backup, { path: 'restore', confirmed: true })).toMatchObject({ ok: true, deviceRole: 'shop' });
    expect((await getSettings()).handedness).toBe('left');
  });

  it('the live snapshot keeps the saved role, PIN, and Customer View flag, says why, and turns ready after Restore', async () => {
    const backup = await verified((await exportBackup({ photos: 'omitted' })).json);
    const off = subscribeSettings(() => undefined);
    await expect.poll(() => getSettingsSnapshot().status).toBe('unavailable');
    const snap = getSettingsSnapshot();
    if (snap.status !== 'unavailable') throw new Error('expected unavailable');
    expect(snap.error).toBeInstanceOf(RecordInvalid);
    expect(snap.error.message).toBe(SETTINGS_UNREADABLE_MESSAGE);
    expect(snap.settings).toMatchObject({ deviceRole: 'shop', customerViewOn: true });
    expect(snap.settings.ownerPin).not.toBeNull();
    expect((await verifyPin(PIN)).ok).toBe(true);
    expect((await importBackup(backup, { path: 'restore', confirmed: true })).ok).toBe(true);
    await expect.poll(() => getSettingsSnapshot().status).toBe('ready');
    off();
  });
});

describe('Customer View with a damaged settings row', () => {
  it('stays on after a reload (fail closed), and Exit Customer View still works: the way out never dead-ends', async () => {
    await shopPhone();
    expect((await turnCustomerViewOn()).ok).toBe(true);
    await patchStoredRow({ handedness: 'both' });
    const off = subscribeSettings(() => undefined);
    await expect.poll(() => getSettingsSnapshot().settings?.customerViewOn).toBe(true);
    expect(getSettingsSnapshot().status).toBe('unavailable');
    expect(await turnCustomerViewOff()).toEqual({ ok: true, on: false });
    const healed = await getSettings();
    expect(healed).toMatchObject({ customerViewOn: false, deviceRole: 'shop', handedness: 'left' });
    expect(healed.ownerPin).not.toBeNull();
    await expect.poll(() => getSettingsSnapshot().status).toBe('ready');
    off();
  });
});

describe('a PIN that cannot be read is never guessed', () => {
  beforeEach(async () => {
    await shopPhone();
    await patchStoredRow({ ownerPin: { broken: true } });
    clearOwnerPass();
  });

  it('no backup, no PIN check, no Restore: each says so in plain words and nothing changes', async () => {
    await expect(exportBackup({ photos: 'omitted' })).rejects.toThrow(SETTINGS_UNREADABLE_MESSAGE);
    expect(await verifyPin(PIN)).toEqual({ ok: false, code: 'storage', message: SETTINGS_UNREADABLE_MESSAGE });
    expect(await hasPin()).toBe(false);
    expect(await storedRow()).toMatchObject({ ownerPin: { broken: true }, deviceRole: 'shop' });
  });
});
