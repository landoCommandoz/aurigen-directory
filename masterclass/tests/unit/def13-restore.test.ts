// @vitest-environment node
/**
 * Fix-wave recheck of DEF-13, the restore side (D12 amendment, BLUEPRINT 3.8 "Unreadable settings").
 * A backup made while the phone could not read its role or PIN carries every job and no role. These
 * tests restore such a file, and its readable cousins, onto every kind of phone, through core only
 * (previewRestore, importBackup, becomeShop), and then try to break it with tampered files.
 *
 * The questions: does restoring it ever grant the shop role or a PIN that was not already there? Do
 * sign-offs come back flagged when the PIN that made them does not come along? Does a phone that
 * cannot check its own PIN refuse until a backup of itself was offered? Is the plan the screen saw
 * re-checked inside the write?
 */
import 'fake-indexeddb/auto';
import { createHash } from 'node:crypto';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { exportBackup } from '../../src/core/backup';
import type { VerifiedBackup } from '../../src/core/backupFile';
import { importBackup, readBackup } from '../../src/core/backupImport';
import { __setContentBundleForTests } from '../../src/core/content';
import { emptyBundle } from '../../src/core/contentBundle';
import { turnCustomerViewOn } from '../../src/core/customerView';
import { __resetDbForTests, validRow, withDb } from '../../src/core/db';
import { becomeShop, chooseStudy, startFresh } from '../../src/core/deviceRole';
import { __resetPinStateForTests, clearOwnerPass, setPin, verifyPin } from '../../src/core/pin';
import { previewRestore } from '../../src/core/restorePreview';
import { __resetSettingsStoreForTests } from '../../src/core/settingsStore';
import { SETTINGS_ID, SETTINGS_UNREADABLE_SHOP_PATH_MESSAGE, checksumInput, parseBackupFile, setupStep, type SettingsValue } from '../../src/schemas';
import { T0, carsLog, qaId, qaPriceItems } from '../fixtures/jobs';

const FILE_PIN = '482915';
const HERE_PIN = '135790';

type Row = Record<string, unknown>;

async function patchRow(patch: Row): Promise<void> {
  await withDb(async (db) => {
    const row = (await db.settings.get(SETTINGS_ID)) as unknown as Row;
    await db.settings.put({ ...row, ...patch } as unknown as SettingsValue);
  });
}

async function rawRow(): Promise<Row> {
  return withDb(async (db) => (await db.settings.get(SETTINGS_ID)) as unknown as Row);
}

function reload(): void {
  __resetSettingsStoreForTests();
  __resetPinStateForTests();
}

async function wipe(): Promise<void> {
  reload();
  await __resetDbForTests();
}

function signOffRow(): unknown {
  return validRow('signOffs', { id: qaId(), createdAt: T0, updatedAt: T0, crewId: qaId(), skillId: 'skill-polish', action: 'signoff', ownerVerifiedAt: T0, at: T0 });
}

/** The source phone: a shop phone with 25 paint cars (30 job rows), 2 clean sign-offs, a cars seed of 40. */
async function shopSource(): Promise<void> {
  const made = await startFresh({ warningAccepted: true, newPin: FILE_PIN });
  if (!made.ok) throw new Error(made.message);
  await withDb(async (db) => {
    await db.jobs.bulkAdd(carsLog(25));
    await db.signOffs.bulkAdd([signOffRow(), signOffRow()] as never[]);
  });
  await patchRow({ carsLoggedBefore: 40 });
}

/** Backup text from the source phone. 'unreadable': the role is from a newer version. */
async function backupText(kind: 'unreadable' | 'readable'): Promise<string> {
  await wipe();
  await shopSource();
  if (kind === 'unreadable') await patchRow({ deviceRole: 'crewTablet' });
  reload();
  const prepared = await exportBackup({ photos: 'omitted' });
  expect(prepared.settings).toBe(kind);
  return prepared.json;
}

async function verified(text: string): Promise<VerifiedBackup> {
  const read = await readBackup(text);
  if (!read.ok) throw new Error(`readBackup refused: ${read.message}`);
  return { verified: true, backup: read.backup, summary: read.summary };
}

type Destination = 'shopOwnPin' | 'studyNoPin' | 'studyWithPin' | 'unreadableRole' | 'unreadablePin';

/** A fresh phone of each kind, holding 3 job rows of its own (Start fresh empties jobs, so they are added after). */
async function destination(kind: Destination): Promise<void> {
  await wipe();
  const made: Array<{ ok: boolean }> = [];
  if (kind === 'studyNoPin') {
    made.push(await chooseStudy());
  } else if (kind === 'studyWithPin') {
    made.push(await chooseStudy(), await setPin(HERE_PIN));
  } else {
    made.push(await startFresh({ warningAccepted: true, newPin: HERE_PIN }));
    await patchRow({ carsLoggedBefore: 7 });
  }
  if (made.some((m) => !m.ok)) throw new Error(`could not set up the ${kind} phone`);
  await withDb((db) => db.jobs.bulkAdd(carsLog(0).slice(0, 3)));
  if (kind === 'unreadableRole') await patchRow({ deviceRole: 'crewTablet' });
  if (kind === 'unreadablePin') await patchRow({ ownerPin: { ...((await rawRow()).ownerPin as Row), algorithm: 'Argon2id' } });
  clearOwnerPass();
  reload();
}

async function counts(): Promise<{ jobs: number; signOffs: boolean[]; roleChanges: string[]; imports: string[] }> {
  return withDb(async (db) => ({
    jobs: await db.jobs.count(),
    signOffs: (await db.signOffs.toArray()).map((s) => s.needsRecheck),
    // Sorted by time: the type index alone orders by the random ids.
    roleChanges: (await db.auditLog.where('type').equals('roleChange').sortBy('at')).map((a) => a.detail),
    imports: (await db.auditLog.where('type').equals('import').sortBy('at')).map((a) => a.detail),
  }));
}

beforeEach(() => {
  __setContentBundleForTests({ ...emptyBundle(), items: qaPriceItems() });
});

afterAll(() => {
  __setContentBundleForTests(null);
});

describe('DEF-13 restore: a file whose role and PIN could not be read never grants shop or a PIN', () => {
  it('onto a shop phone with its own PIN: the owner pass first, then it stays the shop phone with its own PIN and seed; sign-offs flagged', async () => {
    const file = await verified(await backupText('unreadable'));
    expect(file.summary).toMatchObject({ deviceRole: 'unknown', hasPin: false, jobs: 30 });
    await destination('shopOwnPin');
    const preview = await previewRestore(file, 'restore');
    if (!preview.ok || !preview.plan.ok) throw new Error('plan refused');
    expect(preview.plan).toMatchObject({ settingsFrom: 'thisPhone', result: { deviceRole: 'shop', hasPin: true }, roleChange: null });
    expect(preview.plan.needs).toMatchObject({ ownerPass: true, backupFirst: false, typedWord: true, countsFirst: true });
    expect(preview.plan.signOffs).toEqual({ rows: 2, comeBack: 'needsRecheck' });
    expect(preview.thisPhone).toMatchObject({ jobs: 3, carsSeed: 7 });

    // Without the owner pass: refused, nothing changed.
    expect(await importBackup(file, { path: 'restore', confirmed: true })).toMatchObject({ ok: false, code: 'noOwnerPass' });
    expect((await counts()).jobs).toBe(3);
    // The file's PIN does not open this phone's pass.
    expect(await verifyPin(FILE_PIN)).toMatchObject({ ok: false, code: 'wrong' });
    expect(await verifyPin(HERE_PIN)).toEqual({ ok: true });
    const done = await importBackup(file, { path: 'restore', confirmed: true });
    expect(done).toMatchObject({ ok: true, deviceRole: 'shop', roleChanged: false, plan: { settingsFrom: 'thisPhone' } });
    if (!done.ok) throw new Error('restore refused');
    // The counts follow the file's jobs; the seed stays this phone's (7), not the file's (40).
    expect(done.counters).toMatchObject({ jobs: 30, carsLogged: 25 + 7 });
    const after = await counts();
    expect(after.jobs).toBe(30);
    expect(after.signOffs).toEqual([true, true]);
    expect(after.roleChanges.filter((d) => d.includes('(restore)'))).toEqual([]);
    const restoreEntry = after.imports.find((d) => d.includes('this phone kept its own settings')) ?? '';
    expect(restoreEntry).toContain('2 sign-off records marked needs re-check');
    expect(await rawRow()).toMatchObject({ deviceRole: 'shop', carsLoggedBefore: 7, customerViewOn: false });
    reload();
    expect(await verifyPin(HERE_PIN)).toEqual({ ok: true });
    reload();
    expect(await verifyPin(FILE_PIN)).toMatchObject({ ok: false, code: 'wrong' });
  });

  it('onto a study phone with no PIN: the typed word only, it stays a study phone with no PIN; sign-offs flagged', async () => {
    const file = await verified(await backupText('unreadable'));
    await destination('studyNoPin');
    const preview = await previewRestore(file, 'restore');
    if (!preview.ok || !preview.plan.ok) throw new Error('plan refused');
    expect(preview.plan.needs).toMatchObject({ ownerPass: false, backupFirst: false });
    const done = await importBackup(file, { path: 'restore', confirmed: true });
    expect(done).toMatchObject({ ok: true, deviceRole: 'study', roleChanged: false });
    expect(await rawRow()).toMatchObject({ deviceRole: 'study', ownerPin: null });
    expect((await counts()).signOffs).toEqual([true, true]);
    expect(await verifyPin(FILE_PIN)).toMatchObject({ ok: false, code: 'noPin' });
    expect(await turnCustomerViewOn()).toMatchObject({ ok: false });
  });

  it('onto a study phone with its own PIN: the owner pass of THIS phone, and its PIN stays; the file PIN never lands', async () => {
    const file = await verified(await backupText('unreadable'));
    await destination('studyWithPin');
    expect(await importBackup(file, { path: 'restore', confirmed: true })).toMatchObject({ ok: false, code: 'noOwnerPass' });
    expect(await verifyPin(HERE_PIN)).toEqual({ ok: true });
    expect(await importBackup(file, { path: 'restore', confirmed: true })).toMatchObject({ ok: true, deviceRole: 'study' });
    reload();
    expect(await verifyPin(FILE_PIN)).toMatchObject({ ok: false, code: 'wrong' });
    expect((await counts()).signOffs).toEqual([true, true]);
  });

  for (const kind of ['unreadableRole', 'unreadablePin'] as const) {
    it(`onto a phone whose own settings are unreadable (${kind}): refused until a backup of this phone was offered, then a new study phone with no PIN`, async () => {
      const file = await verified(await backupText('unreadable'));
      await destination(kind);
      const before = await rawRow();
      const preview = await previewRestore(file, 'restore');
      if (!preview.ok || !preview.plan.ok) throw new Error('plan refused');
      expect(preview.plan).toMatchObject({ settingsFrom: 'fresh', result: { deviceRole: 'study', hasPin: false } });
      expect(preview.plan.needs).toMatchObject({ ownerPass: false, backupFirst: true });
      expect(preview.thisPhone).toMatchObject({ settings: 'unreadable', jobs: 3 });

      expect(await importBackup(file, { path: 'restore', confirmed: true })).toMatchObject({ ok: false, code: 'backupNotOffered' });
      expect(await importBackup(file, { path: 'restore', confirmed: true, backupOffered: false })).toMatchObject({ ok: false, code: 'backupNotOffered' });
      expect(await rawRow()).toEqual(before);
      expect((await counts()).jobs).toBe(3);

      const done = await importBackup(file, { path: 'restore', confirmed: true, backupOffered: true });
      expect(done).toMatchObject({ ok: true, deviceRole: 'study', roleChanged: true, plan: { settingsFrom: 'fresh' } });
      const row = await rawRow();
      expect(row).toMatchObject({ deviceRole: 'study', ownerPin: null, roleChosenAt: null, carsLoggedBefore: 0, customerViewOn: false });
      expect(setupStep(row as unknown as SettingsValue)).toBe('chooseRole');
      const after = await counts();
      expect(after.jobs).toBe(30);
      expect(after.signOffs).toEqual([true, true]);
      expect(after.roleChanges).toContain('Unreadable phone to study phone (restore)');
      expect(after.roleChanges.filter((d) => d.endsWith('to shop phone (restore)'))).toEqual([]);
      expect(await verifyPin(FILE_PIN)).toMatchObject({ ok: false, code: 'noPin' });
      expect(await verifyPin(HERE_PIN)).toMatchObject({ ok: false, code: 'noPin' });
      expect(await turnCustomerViewOn()).toMatchObject({ ok: false });
      // The restored phone makes an ordinary, readable backup again, with every job.
      const again = await exportBackup({ photos: 'omitted' });
      expect(again).toMatchObject({ settings: 'readable', summary: { deviceRole: 'study', hasPin: false, jobs: 30 } });
    });
  }

  it('the shop path (This is the shop phone, Import) refuses it in words that name the way through, and writes nothing', async () => {
    const file = await verified(await backupText('unreadable'));
    await destination('studyWithPin');
    expect(await verifyPin(HERE_PIN)).toEqual({ ok: true });
    const before = await rawRow();
    const result = await becomeShop({ path: 'importBackup', backup: file, confirmedNewest: true, backupOffered: true });
    expect(result).toMatchObject({ ok: false, message: SETTINGS_UNREADABLE_SHOP_PATH_MESSAGE });
    expect(SETTINGS_UNREADABLE_SHOP_PATH_MESSAGE).toMatch(/Start fresh/);
    expect(SETTINGS_UNREADABLE_SHOP_PATH_MESSAGE).toMatch(/restore/);
    expect(await rawRow()).toEqual(before);
    expect((await counts()).jobs).toBe(3);
    expect(parseBackupFile(JSON.parse(await backupText('unreadable')))).toMatchObject({ ok: false, message: SETTINGS_UNREADABLE_SHOP_PATH_MESSAGE });
  });
});

describe('DEF-13 restore: readable files on the same phones (the D12 import, unchanged)', () => {
  it('a readable shop backup onto a phone whose settings are unreadable: the typed word, then the shop phone with the file PIN; sign-offs as in the file', async () => {
    const file = await verified(await backupText('readable'));
    await destination('unreadableRole');
    expect(await importBackup(file, { path: 'restore', confirmed: true })).toMatchObject({ ok: false, code: 'backupNotOffered' });
    const done = await importBackup(file, { path: 'restore', confirmed: true, backupOffered: true });
    expect(done).toMatchObject({ ok: true, deviceRole: 'shop', plan: { settingsFrom: 'file', signOffs: { comeBack: 'asInFile' } } });
    expect((await counts()).signOffs).toEqual([false, false]);
    expect(await verifyPin(FILE_PIN)).toEqual({ ok: true });
    expect(await rawRow()).toMatchObject({ carsLoggedBefore: 40 });
  });

  it('a readable study backup with no PIN that holds sign-offs: they come back flagged, never clean', async () => {
    await wipe();
    expect((await chooseStudy()).ok).toBe(true);
    await withDb((db) => db.signOffs.bulkAdd([signOffRow()] as never[]));
    const file = await verified((await exportBackup({ photos: 'omitted' })).json);
    await destination('studyNoPin');
    expect(await importBackup(file, { path: 'restore', confirmed: true })).toMatchObject({ ok: true, plan: { signOffs: { comeBack: 'needsRecheck' } } });
    expect((await counts()).signOffs).toEqual([true]);
  });

  it('a flagged sign-off stays flagged through a later backup and restore that brings its PIN', async () => {
    const file = await verified(await backupText('unreadable'));
    await destination('shopOwnPin');
    expect(await verifyPin(HERE_PIN)).toEqual({ ok: true });
    expect((await importBackup(file, { path: 'restore', confirmed: true })).ok).toBe(true);
    const second = await verified((await exportBackup({ photos: 'omitted' })).json);
    await wipe();
    expect(await importBackup(second, { path: 'importBackup', confirmed: true })).toMatchObject({ ok: true, plan: { signOffs: { comeBack: 'asInFile' } } });
    expect((await counts()).signOffs).toEqual([true, true]);
  });

  it('the plan the screen saw is checked again in the write: the row turns unreadable after the preview, so the restore refuses', async () => {
    const file = await verified(await backupText('readable'));
    await destination('studyNoPin');
    const preview = await previewRestore(file, 'restore');
    expect(preview.ok && preview.plan.ok && preview.plan.needs.backupFirst).toBe(false);
    await patchRow({ deviceRole: 'crewTablet' });
    expect(await importBackup(file, { path: 'restore', confirmed: true, backupOffered: false })).toMatchObject({ ok: false, code: 'backupNotOffered' });
    expect(await rawRow()).toMatchObject({ deviceRole: 'crewTablet' });
  });
});

describe('DEF-13 restore: tampered files', () => {
  /** Re-sign a file after editing its tables (the checksum is integrity, not a secret). */
  function resign(file: Row): string {
    const value = createHash('sha256').update(checksumInput(file), 'utf8').digest('hex');
    return JSON.stringify({ ...file, checksum: { algorithm: 'SHA-256', value } });
  }

  it('a role added back at the top, a settings row slipped into the tables, an empty reason list, or an over-long raw row: each refused, nothing written', async () => {
    const base = JSON.parse(await backupText('unreadable')) as Row;
    const source = (JSON.parse(await backupText('readable')) as { tables: { settings: unknown[] } }).tables.settings;
    const tables = base.tables as Row;
    const section = base.settingsUnreadable as Row;
    const tampered: Array<[string, string]> = [
      ['a top-level deviceRole', JSON.stringify({ ...base, deviceRole: 'shop' })],
      ['a shop settings row with a PIN in the tables', resign({ ...base, tables: { ...tables, settings: source } })],
      ['no reasons', JSON.stringify({ ...base, settingsUnreadable: { ...section, reasons: [] } })],
      ['an unknown reason', JSON.stringify({ ...base, settingsUnreadable: { ...section, reasons: ['ownerSaysSo'] } })],
      ['a raw row over 16,384 characters', JSON.stringify({ ...base, settingsUnreadable: { ...section, rawRow: 'x'.repeat(16_385) } })],
      ['an extra key in the section', JSON.stringify({ ...base, settingsUnreadable: { ...section, deviceRole: 'shop' } })],
      ['the section as a string', JSON.stringify({ ...base, settingsUnreadable: 'unreadable' })],
    ];
    await destination('studyNoPin');
    const before = await rawRow();
    const accepted: string[] = [];
    for (const [label, text] of tampered) {
      if ((await readBackup(text)).ok) accepted.push(label);
    }
    expect(accepted).toEqual([]);
    expect(await rawRow()).toEqual(before);
  });

  it('a raw row edited to claim the shop role and a known PIN is never read: the restore leaves a study phone with no PIN', async () => {
    const base = JSON.parse(await backupText('unreadable')) as Row;
    const shopRow = (JSON.parse(await backupText('readable')) as { tables: { settings: Row[] } }).tables.settings[0];
    const text = JSON.stringify({ ...base, settingsUnreadable: { reasons: ['deviceRoleUnreadable'], rawRow: JSON.stringify(shopRow), rawRowComplete: true } });
    const file = await verified(text);
    await destination('unreadableRole');
    expect(await importBackup(file, { path: 'restore', confirmed: true, backupOffered: true })).toMatchObject({ ok: true, deviceRole: 'study' });
    expect(await rawRow()).toMatchObject({ deviceRole: 'study', ownerPin: null });
    expect(await verifyPin(FILE_PIN)).toMatchObject({ ok: false, code: 'noPin' });
  });

  it('a readable file written before the fix (no settingsUnreadable key) still parses on the shop path and restores', async () => {
    const text = await backupText('readable');
    const raw = JSON.parse(text) as Row;
    expect(raw).not.toHaveProperty('settingsUnreadable');
    expect(parseBackupFile(raw)).toMatchObject({ ok: true });
    await wipe();
    expect(await importBackup(await verified(text), { path: 'importBackup', confirmed: true })).toMatchObject({ ok: true, deviceRole: 'shop' });
  });
});
