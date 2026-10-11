// @vitest-environment node
/**
 * DEF-13 over a real (fake) IndexedDB (D12 amendment, BLUEPRINT 3.8 "Unreadable settings"):
 * a backup is never refused because this phone's role or PIN record cannot be read, the file never
 * carries a guessed role or PIN, and Restore follows restorePlan: what lands, what this phone
 * keeps, when the owner pass or a backup of this phone first is needed, and how sign-offs land.
 */
import 'fake-indexeddb/auto';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { SETTINGS_ID, SETTINGS_UNREADABLE_SHOP_PATH_MESSAGE, parseAnyBackupFile, type SettingsValue } from '../schemas';
import { POLISH_SEDAN, T0, fixtureId, makeJob, priceItems } from './__tests__/fixtures';
import { exportBackup, markLastBackup } from './backup';
import type { VerifiedBackup } from './backupFile';
import { importBackup, readBackup } from './backupImport';
import { __setContentBundleForTests } from './content';
import { emptyBundle } from './contentBundle';
import { __resetDbForTests, getSettings, validRow, withDb } from './db';
import { startFresh } from './deviceRole';
import { __resetPinStateForTests, clearOwnerPass, ownerPassActive, verifyPin } from './pin';
import { previewRestore } from './restorePreview';

const PIN_A = '482915';
const PIN_B = '135790';

async function patchRow(patch: Record<string, unknown>): Promise<void> {
  await withDb(async (db) => {
    const row = await db.settings.get(SETTINGS_ID);
    await db.settings.put({ ...row, ...patch } as unknown as SettingsValue);
  });
}

async function rawRow(): Promise<Record<string, unknown>> {
  return withDb(async (db) => (await db.settings.get(SETTINGS_ID)) as unknown as Record<string, unknown>);
}

async function count(table: 'jobs' | 'signOffs' | 'auditLog'): Promise<number> {
  return withDb((db) => db.table(table).count());
}

/** A shop phone with `jobs` delivered polish jobs and one sign-off. */
async function shopPhone(pin: string, jobs: number): Promise<void> {
  const made = await startFresh({ warningAccepted: true, newPin: pin });
  if (!made.ok) throw new Error(made.message);
  await withDb(async (db) => {
    for (let i = 0; i < jobs; i += 1) await db.jobs.add(makeJob('delivered', { packageId: POLISH_SEDAN }));
    await db.signOffs.add(
      validRow('signOffs', { id: fixtureId(), createdAt: T0, updatedAt: T0, crewId: fixtureId(), skillId: 'skill-polish', action: 'signoff', ownerVerifiedAt: T0, at: T0 }),
    );
  });
}

async function verified(json: string): Promise<VerifiedBackup> {
  const read = await readBackup(json);
  if (!read.ok) throw new Error(read.message);
  return { verified: true, backup: read.backup, summary: read.summary };
}

/** The backup phone A makes after a newer version changed its role: unreadable settings, 3 jobs, 1 sign-off. */
async function unreadableFile(): Promise<VerifiedBackup> {
  await shopPhone(PIN_A, 3);
  await patchRow({ deviceRole: 'crewTablet', carsLoggedBefore: 7 });
  const prepared = await exportBackup({ photos: 'omitted' });
  await __resetDbForTests();
  __resetPinStateForTests();
  return verified(prepared.json);
}

beforeEach(async () => {
  __setContentBundleForTests({ ...emptyBundle(), items: priceItems() });
  __resetPinStateForTests();
  await __resetDbForTests();
});

afterEach(() => {
  __setContentBundleForTests(null);
});

describe('the backup is never refused for an unreadable settings row', () => {
  const cases: Array<[string, (pin: Record<string, unknown>) => Record<string, unknown>, string]> = [
    ['a role this version does not know', () => ({ deviceRole: 'crewTablet' }), 'deviceRoleUnreadable'],
    ['a PIN record from a newer hash', (pin) => ({ ownerPin: { ...pin, algorithm: 'Argon2id' } }), 'ownerPinUnreadable'],
    ['a shop role with its PIN removed', () => ({ ownerPin: null }), 'shopRoleWithoutPin'],
  ];
  for (const [label, patch, reason] of cases) {
    it(`${label}: every table leaves, with the reason and the raw row as text, never a role or a PIN`, async () => {
      await shopPhone(PIN_A, 25);
      await patchRow(patch((await rawRow()).ownerPin as Record<string, unknown>));
      const audit = await count('auditLog');
      __resetPinStateForTests();
      const prepared = await exportBackup({ photos: 'omitted' });
      expect(prepared.settings).toBe('unreadable');
      expect(prepared.unreadableReasons).toContain(reason);
      const file = JSON.parse(prepared.json) as { tables: Record<string, unknown[]>; settingsUnreadable: { rawRow: string; rawRowComplete: boolean } };
      expect(file).not.toHaveProperty('deviceRole');
      expect(file.tables.settings).toEqual([]);
      expect(file.tables.jobs).toHaveLength(25);
      expect(file.tables.signOffs).toHaveLength(1);
      expect(file.tables.auditLog).toHaveLength(audit);
      expect(file.settingsUnreadable.rawRowComplete).toBe(true);
      expect(JSON.parse(file.settingsUnreadable.rawRow)).toMatchObject({ id: SETTINGS_ID });
      expect(parseAnyBackupFile(JSON.parse(prepared.json))).toMatchObject({ ok: true, parsed: { settings: 'unreadable' } });
      const read = await readBackup(prepared.json);
      expect(read).toMatchObject({ ok: true, summary: { deviceRole: 'unknown', hasPin: false, settings: 'unreadable', jobs: 25 } });
      // No gate opens.
      expect(await verifyPin(PIN_A)).toMatchObject({ ok: false });
      expect(ownerPassActive()).toBe(false);
      expect(await rawRow()).toMatchObject({ id: SETTINGS_ID });
    });
  }

  it('recording the backup still writes its audit entry when the row cannot be written; the row is untouched', async () => {
    await shopPhone(PIN_A, 1);
    await patchRow({ deviceRole: 'crewTablet' });
    const before = await rawRow();
    expect(await markLastBackup('Backup shared through the share sheet')).toBeNull();
    const entries = await withDb((db) => db.auditLog.where('type').equals('export').toArray());
    expect(entries.map((e) => e.detail)).toEqual(["Backup shared through the share sheet. Last backup time not saved: this phone's settings could not be read."]);
    expect(await rawRow()).toEqual(before);
  });
});

describe('restoring a file whose settings were unreadable (restorePlan)', () => {
  it('on a shop phone with a readable PIN: the owner pass and the typed word; it stays the shop phone with its own PIN and cars seed', async () => {
    const file = await unreadableFile();
    await shopPhone(PIN_B, 2);
    await patchRow({ carsLoggedBefore: 4 });
    clearOwnerPass();
    expect(await importBackup(file, { path: 'restore', confirmed: true })).toMatchObject({ ok: false, code: 'noOwnerPass' });
    expect(await count('jobs')).toBe(2);
    expect((await verifyPin(PIN_B)).ok).toBe(true);
    const done = await importBackup(file, { path: 'restore', confirmed: true });
    expect(done).toMatchObject({ ok: true, deviceRole: 'shop', roleChanged: false, plan: { settingsFrom: 'thisPhone' } });
    expect(await count('jobs')).toBe(3);
    const s = await getSettings();
    expect(s).toMatchObject({ deviceRole: 'shop', carsLoggedBefore: 4, customerViewOn: false });
    clearOwnerPass();
    expect((await verifyPin(PIN_A)).ok).toBe(false);
    expect((await verifyPin(PIN_B)).ok).toBe(true);
    const signOffs = await withDb((db) => db.signOffs.toArray());
    expect(signOffs.map((r) => r.needsRecheck)).toEqual([true]);
    const imports = await withDb((db) => db.auditLog.where('type').equals('import').toArray());
    expect(imports).toHaveLength(1);
    expect(imports[0]?.detail).toMatch(/kept its own settings\. 1 sign-off record marked needs re-check\./);
  });

  it('on a study phone with no PIN: no owner pass asked; it stays a study phone with no PIN; sign-offs need re-check', async () => {
    const file = await unreadableFile();
    const done = await importBackup(file, { path: 'restore', confirmed: true });
    expect(done).toMatchObject({ ok: true, deviceRole: 'study', plan: { settingsFrom: 'thisPhone', needs: { ownerPass: false, backupFirst: false } } });
    const s = await getSettings();
    expect(s).toMatchObject({ deviceRole: 'study', ownerPin: null, carsLoggedBefore: 0 });
    expect((await withDb((db) => db.signOffs.toArray())).every((r) => r.needsRecheck)).toBe(true);
  });

  it('on a phone whose own settings are unreadable: refused until a backup of this phone was offered, then a new study phone with no PIN', async () => {
    const file = await unreadableFile();
    await shopPhone(PIN_B, 5);
    await patchRow({ ownerPin: { broken: true } });
    clearOwnerPass();
    const refused = await importBackup(file, { path: 'restore', confirmed: true });
    expect(refused).toMatchObject({ ok: false, code: 'backupNotOffered' });
    expect(await count('jobs')).toBe(5);
    expect(await rawRow()).toMatchObject({ ownerPin: { broken: true } });
    const done = await importBackup(file, { path: 'restore', confirmed: true, backupOffered: true });
    expect(done).toMatchObject({ ok: true, deviceRole: 'study', roleChanged: true, plan: { settingsFrom: 'fresh', needs: { ownerPass: false } } });
    expect(await getSettings()).toMatchObject({ deviceRole: 'study', ownerPin: null, roleChosenAt: null });
    const roleChanges = await withDb((db) => db.auditLog.where('type').equals('roleChange').toArray());
    expect(roleChanges.map((r) => r.detail).filter((d) => d === 'Unreadable phone to study phone (restore)')).toHaveLength(1);
  });

  it('the shop path refuses it with words that name the way through, and changes nothing', async () => {
    const file = await unreadableFile();
    const before = await getSettings();
    expect(await importBackup(file, { path: 'importBackup', confirmed: true })).toEqual({
      ok: false,
      code: 'notShopBackup',
      message: SETTINGS_UNREADABLE_SHOP_PATH_MESSAGE,
    });
    expect(await getSettings()).toEqual(before);
    expect(await count('jobs')).toBe(0);
  });

  it('the preview shows this phone first, then the file with this phone\'s cars seed, and the flags', async () => {
    const file = await unreadableFile();
    await shopPhone(PIN_B, 2);
    await patchRow({ carsLoggedBefore: 4 });
    const preview = await previewRestore(file, 'restore');
    if (!preview.ok || !preview.plan.ok) throw new Error('expected a plan');
    expect(preview.thisPhone).toMatchObject({ jobs: 2, carsLogged: 6, settings: 'readable', carsSeed: 4 });
    expect(preview.file).toMatchObject({ jobs: 3, carsLogged: 7, deviceRole: 'unknown' });
    expect(preview.plan.flags).toMatchObject({ fileSettingsUnreadable: true, carsSeedNotRestored: true, fewerJobsThanThisPhone: false, photosNotInFile: true });
    expect(preview.plan.signOffs).toEqual({ rows: 1, comeBack: 'needsRecheck' });
    expect(await count('jobs')).toBe(2);
  });
});

describe('a readable backup restored where the settings are unreadable', () => {
  it('a shop backup makes this phone the shop phone with the file PIN after the backup offer, no owner pass asked; sign-offs as in the file', async () => {
    await shopPhone(PIN_A, 3);
    const file = await verified((await exportBackup({ photos: 'omitted' })).json);
    await __resetDbForTests();
    __resetPinStateForTests();
    await shopPhone(PIN_B, 1);
    await patchRow({ deviceRole: 'crewTablet' });
    clearOwnerPass();
    expect(await importBackup(file, { path: 'restore', confirmed: true })).toMatchObject({ ok: false, code: 'backupNotOffered' });
    const done = await importBackup(file, { path: 'restore', confirmed: true, backupOffered: true });
    expect(done).toMatchObject({ ok: true, deviceRole: 'shop', plan: { settingsFrom: 'file', signOffs: { comeBack: 'asInFile' } } });
    expect((await withDb((db) => db.signOffs.toArray())).map((r) => r.needsRecheck)).toEqual([false]);
    clearOwnerPass();
    expect((await verifyPin(PIN_A)).ok).toBe(true);
  });

  it('a study backup with no PIN on a study phone: sign-offs come back needing re-check (only the PIN that made them keeps them)', async () => {
    await withDb(async (db) => {
      await db.signOffs.add(
        validRow('signOffs', { id: fixtureId(), createdAt: T0, updatedAt: T0, crewId: fixtureId(), skillId: 'skill-polish', action: 'signoff', ownerVerifiedAt: T0, at: T0 }),
      );
    });
    const file = await verified((await exportBackup({ photos: 'omitted' })).json);
    const done = await importBackup(file, { path: 'restore', confirmed: true });
    expect(done).toMatchObject({ ok: true, plan: { settingsFrom: 'file', signOffs: { rows: 1, comeBack: 'needsRecheck' } } });
    expect((await withDb((db) => db.signOffs.toArray())).map((r) => r.needsRecheck)).toEqual([true]);
  });
});
