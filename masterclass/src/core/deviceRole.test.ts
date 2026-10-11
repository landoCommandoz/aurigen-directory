// @vitest-environment node
import 'fake-indexeddb/auto';
import { beforeEach, describe, expect, it } from 'vitest';
import { START_FRESH_WARNING, setupStep } from '../schemas';
import { fixtureId, makeJob, T0 } from './__tests__/fixtures';
import { __resetDbForTests, getSettings, validRow, withDb } from './db';
import { becomeShop, chooseStudy, demoteToStudy, getRole, startFresh } from './deviceRole';
import { __resetPinStateForTests, ownerPassActive, setPin, verifyPin } from './pin';

async function snapshotAll() {
  return withDb(async (db) => {
    const out: Record<string, unknown[]> = {};
    for (const table of db.tables) out[table.name] = await table.toArray();
    return out;
  });
}

async function seedJobsAndAcademy() {
  const crewId = fixtureId();
  await withDb(async (db) => {
    await db.jobs.bulkAdd([makeJob('delivered'), makeJob('inProgress')]);
    await db.crewMembers.add(validRow('crewMembers', { id: crewId, createdAt: T0, updatedAt: T0, name: 'DJ', role: 'crew' }));
    await db.drillLogs.add(validRow('drillLogs', { id: fixtureId(), createdAt: T0, updatedAt: T0, crewId, drillId: 'drill-scale-pressure', at: T0 }));
  });
  return crewId;
}

beforeEach(async () => {
  __resetPinStateForTests();
  await __resetDbForTests();
});

describe('a new install (D12)', () => {
  it('is a study phone, role not chosen, no PIN, left-handed, reminder off; the banner asks for the role', async () => {
    const s = await getSettings();
    expect(s.deviceRole).toBe('study');
    expect(s.roleChosenAt).toBeNull();
    expect(s.ownerPin).toBeNull();
    expect(s.handedness).toBe('left');
    expect(s.backupReminderWeekly).toBe(false);
    expect(setupStep(s)).toBe('chooseRole');
    expect(await getRole()).toBe('study');
  });
});

describe('the mistaken "This is the shop phone" tap', () => {
  it('alone is refused and writes nothing, with or without a PIN', async () => {
    await getSettings();
    const before = await snapshotAll();
    expect(await becomeShop()).toMatchObject({ ok: false, code: 'choosePath' });
    expect(await becomeShop({ path: null })).toMatchObject({ ok: false, code: 'choosePath' });
    expect(await snapshotAll()).toEqual(before);

    await setPin('482915');
    const withPin = await snapshotAll();
    expect(await becomeShop({})).toMatchObject({ ok: false, code: 'choosePath' });
    expect(await snapshotAll()).toEqual(withPin);
    expect(await getRole()).toBe('study');
  });
});

describe('becomeShop through Start fresh', () => {
  it('is refused without a PIN, and the role stays study', async () => {
    const r = await becomeShop({ path: 'startFresh', warningAccepted: true });
    expect(r).toMatchObject({ ok: false, code: 'noPin' });
    expect(await getRole()).toBe('study');
  });

  it('is allowed with a PIN created in the same step', async () => {
    const r = await becomeShop({ path: 'startFresh', warningAccepted: true, newPin: '482915' });
    expect(r).toEqual({ ok: true, role: 'shop' });
    expect(ownerPassActive()).toBe(true);
  });

  it('is allowed with an existing PIN once it is entered (owner pass), refused without the pass', async () => {
    await setPin('482915');
    __resetPinStateForTests();
    expect(await becomeShop({ path: 'startFresh', warningAccepted: true })).toMatchObject({ ok: false, code: 'noOwnerPass' });
    await verifyPin('482915');
    expect(await becomeShop({ path: 'startFresh', warningAccepted: true })).toEqual({ ok: true, role: 'shop' });
  });
});

describe('startFresh', () => {
  it('requires the confirmed warning flag; the refusal carries the warning text and writes nothing', async () => {
    await getSettings();
    const before = await snapshotAll();
    const r = await startFresh({ warningAccepted: false, newPin: '482915' });
    expect(r).toEqual({ ok: false, code: 'warningNotAccepted', message: START_FRESH_WARNING });
    expect(await snapshotAll()).toEqual(before);
  });

  it('empties the job tables, zeroes the cars seed, keeps Academy progress, turns the reminder on, logs it', async () => {
    const crewId = await seedJobsAndAcademy();
    const r = await startFresh({ warningAccepted: true, newPin: '482915' });
    expect(r).toEqual({ ok: true, role: 'shop' });
    const s = await getSettings();
    expect(s.deviceRole).toBe('shop');
    expect(s.ownerPin).not.toBeNull();
    expect(s.carsLoggedBefore).toBe(0);
    expect(s.backupReminderWeekly).toBe(true);
    expect(s.customerViewOn).toBe(false);
    expect(setupStep(s)).toBe('firstBackup');
    const all = await snapshotAll();
    expect(all.jobs).toEqual([]);
    expect(all.drillLogs).toHaveLength(1);
    const crew = all.crewMembers as Array<{ id: string; role: string }>;
    expect(crew.some((c) => c.id === crewId)).toBe(true);
    const owner = crew.find((c) => c.role === 'owner');
    expect(owner).toBeDefined();
    expect(s.activeCrewId).toBe(owner?.id);
    const types = (all.auditLog as Array<{ type: string }>).map((a) => a.type);
    expect(types).toEqual(expect.arrayContaining(['pinSet', 'startFresh', 'roleChange']));
  });

  it('refuses a malformed new PIN, and refuses on a phone that is already the shop phone', async () => {
    expect(await startFresh({ warningAccepted: true, newPin: '12' })).toMatchObject({ ok: false, code: 'invalidPin' });
    await startFresh({ warningAccepted: true, newPin: '482915' });
    expect(await startFresh({ warningAccepted: true })).toMatchObject({ ok: false, code: 'alreadyShop' });
  });
});

describe('study choice and demotion', () => {
  it('"This is a study phone" records the choice and moves the banner to the PIN', async () => {
    expect(await chooseStudy()).toEqual({ ok: true, role: 'study' });
    const s = await getSettings();
    expect(s.roleChosenAt).not.toBeNull();
    expect(setupStep(s)).toBe('setPin');
  });

  it('switching the shop phone to study needs the owner pass and keeps the jobs', async () => {
    await startFresh({ warningAccepted: true, newPin: '482915' });
    await withDb((db) => db.jobs.add(makeJob('delivered')));
    __resetPinStateForTests();
    expect(await demoteToStudy()).toMatchObject({ ok: false, code: 'noOwnerPass' });
    expect(await getRole()).toBe('shop');
    expect(await chooseStudy()).toMatchObject({ ok: false, code: 'useSwitchToStudy' });
    await verifyPin('482915');
    expect(await demoteToStudy()).toEqual({ ok: true, role: 'study' });
    expect(await withDb((db) => db.jobs.count())).toBe(1);
  });
});
