// @vitest-environment node
import 'fake-indexeddb/auto';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { BACKUP_REMINDER_DAYS, setupStep } from '../schemas';
import { BIKE_DETAIL, INTERIOR_SEDAN, POLISH_SEDAN, T0, WASH_WAX_SEDAN, fixtureId, makeJob, priceItems } from './__tests__/fixtures';
import { backupFilename, exportBackup, isBackupDue, markLastBackup } from './backup';
import { verifyBackupText } from './backupFile';
import { importBackup, readBackup } from './backupImport';
import { __setClockForTests } from './clock';
import { __setContentBundleForTests } from './content';
import { emptyBundle } from './contentBundle';
import { __resetDbForTests, getSettings, validRow, withDb } from './db';
import { becomeShop, startFresh } from './deviceRole';
import { __resetPinStateForTests, setPin, verifyPin } from './pin';

const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2, 3, 250, 251, 252]);

async function seedShopPhone() {
  await startFresh({ warningAccepted: true, newPin: '482915' });
  const jobs = [
    makeJob('delivered', { packageId: POLISH_SEDAN }),
    makeJob('debriefed', { packageId: WASH_WAX_SEDAN }),
    makeJob('delivered', { packageId: INTERIOR_SEDAN }),
    makeJob('delivered', { packageId: BIKE_DETAIL, vehicleType: 'bike' }),
    makeJob('booked', { packageId: POLISH_SEDAN }),
    makeJob('canceled', { packageId: POLISH_SEDAN }),
  ];
  const photoJob = jobs[0]?.id ?? fixtureId();
  await withDb(async (db) => {
    await db.jobs.bulkAdd(jobs);
    await db.jobPhotos.add(
      validRow('jobPhotos', {
        id: fixtureId(),
        createdAt: T0,
        updatedAt: T0,
        jobId: photoJob,
        kind: 'before',
        mime: 'image/png',
        width: 2,
        height: 2,
        bytes: PNG.length,
        takenAt: T0,
        blob: new Blob([PNG], { type: 'image/png' }),
      }),
    );
  });
}

beforeEach(async () => {
  __setContentBundleForTests({ ...emptyBundle(), items: priceItems() });
  __resetPinStateForTests();
  await __resetDbForTests();
});

afterEach(() => {
  __setClockForTests();
  __setContentBundleForTests(null);
});

describe('export', () => {
  it('builds a valid file of every table with photos embedded, and names it by date', async () => {
    await seedShopPhone();
    const prepared = await exportBackup();
    expect(prepared.filename).toMatch(/^masterclass-backup-\d{4}-\d{2}-\d{2}\.json$/);
    expect(prepared.file.type).toBe('application/json');
    expect(prepared.summary).toMatchObject({ deviceRole: 'shop', photos: 'included', photoCount: 1, jobs: 6, hasPin: true });
    // Counted: the delivered polish sedan and the debriefed wash & wax. Not: interior only, the bike, booked, canceled.
    expect(prepared.summary.carsLogged).toBe(2);
    // Holding a founder slot: the delivered polish and the booked polish (the canceled one released it).
    expect(prepared.summary.founderSlotsUsed).toBe(2);
    expect(prepared.json).not.toContain('482915');
    const verified = await verifyBackupText(prepared.json, priceItems());
    expect(verified.ok).toBe(true);
  });

  it('works on a brand-new phone whose settings row was never read (a study backup with defaults)', async () => {
    const prepared = await exportBackup();
    expect(prepared.summary).toMatchObject({ deviceRole: 'study', jobs: 0, hasPin: false, photoCount: 0 });
    expect((await verifyBackupText(prepared.json, priceItems())).ok).toBe(true);
  });

  it('without photos holds no photo rows', async () => {
    await seedShopPhone();
    const prepared = await exportBackup({ photos: 'omitted' });
    expect(prepared.summary.photoCount).toBe(0);
    expect(JSON.parse(prepared.json).tables.jobPhotos).toEqual([]);
  });

  it('file name uses the local date', () => {
    expect(backupFilename(new Date(2026, 9, 10, 23, 30).getTime())).toBe('masterclass-backup-2026-10-10.json');
  });
});

describe('export then import, round trip', () => {
  it('a second phone becomes the shop phone with every table equal, the PIN hash, Customer View off, counters equal', async () => {
    await seedShopPhone();
    await withDb(async (db) => {
      const s = await db.settings.get('device');
      if (s) await db.settings.put({ ...s, customerViewOn: true });
    });
    const prepared = await exportBackup();
    const before = await withDb(async (db) => ({
      jobs: await db.jobs.orderBy('id').toArray(),
      settings: await db.settings.get('device'),
      photos: await db.jobPhotos.toArray(),
    }));

    // The second phone: a fresh install.
    await __resetDbForTests();
    __resetPinStateForTests();
    const read = await readBackup(new File([prepared.json], prepared.filename, { type: 'application/json' }));
    if (!read.ok) throw new Error(read.message);
    expect(read.summary).toMatchObject({ jobs: 6, carsLogged: 2, founderSlotsUsed: 2, deviceRole: 'shop' });
    expect(await getSettings().then((s) => s.deviceRole)).toBe('study');

    const r = await becomeShop({ path: 'importBackup', backup: read, confirmedNewest: true });
    expect(r).toEqual({ ok: true, role: 'shop' });

    const after = await withDb(async (db) => ({
      jobs: await db.jobs.orderBy('id').toArray(),
      settings: await db.settings.get('device'),
      photos: await db.jobPhotos.toArray(),
      audit: await db.auditLog.toArray(),
    }));
    expect(after.jobs).toEqual(before.jobs);
    expect(after.settings?.ownerPin).toEqual(before.settings?.ownerPin);
    expect(after.settings?.customerViewOn).toBe(false);
    expect(after.photos).toHaveLength(1);
    const blob = after.photos[0]?.blob;
    expect(blob).toBeInstanceOf(Blob);
    if (blob === undefined) throw new Error('photo missing after import');
    expect(Array.from(new Uint8Array(await blob.arrayBuffer()))).toEqual(Array.from(PNG));
    const types = after.audit.map((a) => a.type);
    expect(types).toEqual(expect.arrayContaining(['import', 'roleChange']));
    // The imported PIN works on the new phone.
    expect((await verifyPin('482915')).ok).toBe(true);
  });

  it('the plain import result carries the counters to confirm', async () => {
    await seedShopPhone();
    const prepared = await exportBackup();
    await __resetDbForTests();
    __resetPinStateForTests();
    const read = await readBackup(prepared.json);
    if (!read.ok) throw new Error(read.message);
    const result = await importBackup(read, { path: 'restore', confirmed: true });
    expect(result).toMatchObject({ ok: true, deviceRole: 'shop', roleChanged: true, counters: { jobs: 6, carsLogged: 2, founderSlotsUsed: 2 } });
  });
});

describe('import refusals change nothing', () => {
  async function studyBackupText() {
    await setPin('482915');
    const prepared = await exportBackup();
    return prepared.json;
  }

  it('a study backup is refused on the shop path', async () => {
    const text = await studyBackupText();
    await __resetDbForTests();
    __resetPinStateForTests();
    const read = await readBackup(text);
    if (!read.ok) throw new Error(read.message);
    expect(await importBackup(read, { path: 'importBackup', confirmed: true })).toMatchObject({ ok: false, code: 'notShopBackup' });
    expect((await getSettings()).ownerPin).toBeNull();
  });

  it('nothing happens until the person confirms', async () => {
    await seedShopPhone();
    const text = (await exportBackup()).json;
    await __resetDbForTests();
    const read = await readBackup(text);
    if (!read.ok) throw new Error(read.message);
    expect(await importBackup(read, { path: 'importBackup', confirmed: false })).toMatchObject({ ok: false, code: 'notConfirmed' });
    expect(await withDb((db) => db.jobs.count())).toBe(0);
  });

  it('a phone that has a PIN asks for it before being replaced', async () => {
    await seedShopPhone();
    const text = (await exportBackup()).json;
    __resetPinStateForTests();
    const read = await readBackup(text);
    if (!read.ok) throw new Error(read.message);
    expect(await importBackup(read, { path: 'importBackup', confirmed: true })).toMatchObject({ ok: false, code: 'noOwnerPass' });
  });

  it('a damaged file (one byte of a table changed) is refused by the checksum', async () => {
    await seedShopPhone();
    const raw = JSON.parse((await exportBackup()).json);
    raw.tables.settings[0].carsLoggedBefore = 24;
    const read = await readBackup(JSON.stringify(raw));
    expect(read).toMatchObject({ ok: false, reason: 'damaged' });
  });

  it('an unknown format version, a newer one, another kind of file, and non-JSON are refused with plain messages', async () => {
    await seedShopPhone();
    const raw = JSON.parse((await exportBackup()).json);
    expect(await readBackup(JSON.stringify({ ...raw, version: 99 }))).toMatchObject({ ok: false, reason: 'unknownVersion' });
    expect(await readBackup(JSON.stringify({ ...raw, version: 0 }))).toMatchObject({ ok: false, reason: 'unknownVersion' });
    expect(await readBackup(JSON.stringify({ ...raw, kind: 'masterclass-crew-progress' }))).toMatchObject({ ok: false, reason: 'notThisKind' });
    expect(await readBackup('not json at all')).toMatchObject({ ok: false, reason: 'notJson' });
  });

  it('a shop backup whose settings lost the PIN hash fails its schema', async () => {
    await seedShopPhone();
    const raw = JSON.parse((await exportBackup()).json);
    raw.tables.settings[0].ownerPin = null;
    expect(await readBackup(JSON.stringify(raw))).toMatchObject({ ok: false, reason: 'invalid' });
  });
});

describe('last backup and the weekly reminder', () => {
  it('first backup clears the banner step; the reminder is due 7 days later, not at 6', async () => {
    let wall = Date.parse('2026-10-10T12:00:00.000Z');
    __setClockForTests({ wall: () => wall });
    await setPin('482915');
    expect(setupStep(await getSettings())).toBe('chooseRole');
    expect(await isBackupDue()).toBe(true);
    await markLastBackup();
    const s = await getSettings();
    expect(s.lastBackupAt).toBe('2026-10-10T12:00:00.000Z');
    expect(s.backupReminderWeekly).toBe(true);
    expect(await isBackupDue()).toBe(false);
    wall += 6 * 24 * 60 * 60 * 1000;
    expect(await isBackupDue()).toBe(false);
    wall += (BACKUP_REMINDER_DAYS - 6) * 24 * 60 * 60 * 1000;
    expect(await isBackupDue()).toBe(true);
    const audit = await withDb((db) => db.auditLog.where('type').equals('export').count());
    expect(audit).toBe(1);
  });
});
