/**
 * DEF-13 contract: a backup is never refused because the settings row is unreadable, and Restore
 * of such a file never grants shop or an owner PIN (backup.ts, backup-recovery.ts, D12 amendment).
 */
import { describe, expect, it } from 'vitest';
import {
  SETTINGS_RAW_ROW_MAX,
  SETTINGS_UNREADABLE_SHOP_PATH_MESSAGE,
  Settings,
  SettingsUnreadable,
  TABLE_NAMES,
  backupSettingsState,
  checksumInput,
  defaultSettings,
  parseAnyBackupFile,
  parseBackupFile,
  restorePlan,
  settingsAfterRestore,
  settingsUnreadableSection,
  setupStep,
  signOffsAfterRestore,
  type BackupSettingsState,
  type ParsedBackup,
  type RestoreDestination,
  type RestorePlanOk,
  type SettingsValue,
  type SignOffValue,
} from './index';

const NOW = '2026-10-11T12:00:00.000Z';
const LATER = '2026-10-12T08:00:00.000Z';
const CREW = '3f2b8c1e-5d4a-4b6f-9a7e-1c2d3e4f5a6b';
const PIN = {
  algorithm: 'PBKDF2-SHA-256',
  iterations: 100_000,
  salt: 'c2FsdHNhbHRzYWx0c2FsdA==',
  hash: 'aGFzaGhhc2hoYXNoaGFzaGhhc2hoYXNoaGFzaGg=',
  setAt: NOW,
} as const;

const uuid = (n: number) => `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`;
const draft = (n: number) => ({ id: uuid(n), createdAt: NOW, updatedAt: NOW, state: 'draft', vehicle: {}, packageId: null });
const signOff = (n: number) => ({
  id: uuid(100 + n),
  createdAt: NOW,
  updatedAt: NOW,
  crewId: CREW,
  skillId: 'skill-l4-machine-polishing',
  action: 'signoff',
  ownerVerifiedAt: NOW,
  at: NOW,
});

const shopRow = (): SettingsValue => ({ ...defaultSettings(NOW), deviceRole: 'shop', roleChosenAt: NOW, ownerPin: { ...PIN }, carsLoggedBefore: 7 });
const studyRow = (): SettingsValue => defaultSettings(NOW);

function tables(settings: unknown[], jobs = 3, signOffs = 2): Record<string, unknown[]> {
  const t: Record<string, unknown[]> = Object.fromEntries(TABLE_NAMES.map((n) => [n, []]));
  t.settings = settings;
  t.jobs = Array.from({ length: jobs }, (_, i) => draft(i + 1));
  t.signOffs = Array.from({ length: signOffs }, (_, i) => signOff(i + 1));
  return t;
}

const head = { kind: 'masterclass-backup', version: 1, createdAt: NOW, appVersion: '0.1.0', checksum: { algorithm: 'SHA-256', value: 'a'.repeat(64) } };

function readableFile(row: SettingsValue, opts: { jobs?: number; photos?: 'included' | 'omitted' } = {}) {
  return { ...head, deviceRole: row.deviceRole, photos: opts.photos ?? 'included', tables: tables([row], opts.jobs) };
}

function unreadableFile(opts: { jobs?: number } = {}) {
  const section = settingsUnreadableSection({ ...shopRow(), deviceRole: 'crewTablet' }, ['deviceRoleUnreadable']);
  return { ...head, settingsUnreadable: section, photos: 'omitted', tables: tables([], opts.jobs) };
}

function parsed(input: unknown): ParsedBackup {
  const result = parseAnyBackupFile(input);
  if (!result.ok) throw new Error(`fixture did not parse: ${result.issues.join('; ')}`);
  return result.parsed;
}

function planOk(file: unknown, here: RestoreDestination, path: 'restore' | 'importBackup' = 'restore'): RestorePlanOk {
  const plan = restorePlan(parsed(file), here, path);
  if (!plan.ok) throw new Error(`refused: ${plan.message}`);
  return plan;
}

const readableHere = (row: SettingsValue, jobs = 3): RestoreDestination => ({ settings: backupSettingsState(row), jobs });
const unreadableHere = (jobs = 3): RestoreDestination => ({ settings: backupSettingsState({ ...shopRow(), ownerPin: { ...PIN, algorithm: 'Argon2id' } }), jobs });

describe('the backup file (format 1) with and without readable settings', () => {
  it('a file written before 2026-10-11 still parses with both parsers', () => {
    const file = readableFile(shopRow());
    expect(parseBackupFile(file).ok).toBe(true);
    expect(parsed(file).settings).toBe('readable');
  });

  it('a file with unreadable settings keeps every job and carries no role and no settings row', () => {
    const p = parsed(unreadableFile({ jobs: 25 }));
    expect(p.settings).toBe('unreadable');
    expect(p.backup.tables.jobs).toHaveLength(25);
    expect(p.backup.tables.settings).toEqual([]);
    expect(Object.hasOwn(p.backup, 'deviceRole')).toBe(false);
  });

  it('the shop path parser refuses it with words that never send the person to Backup', () => {
    const result = parseBackupFile(unreadableFile());
    expect(result).toMatchObject({ ok: false, reason: 'invalid', message: SETTINGS_UNREADABLE_SHOP_PATH_MESSAGE });
    expect(SETTINGS_UNREADABLE_SHOP_PATH_MESSAGE).not.toMatch(/backup screen|open (settings, )?backup/i);
  });

  it('refuses a mixed or broken unreadable-settings file', () => {
    const base = unreadableFile();
    const broken: unknown[] = [
      { ...base, deviceRole: 'shop' },
      { ...base, tables: tables([shopRow()]) },
      { ...base, settingsUnreadable: { ...base.settingsUnreadable, reasons: [] } },
      { ...base, settingsUnreadable: { ...base.settingsUnreadable, reasons: ['guessedShop'] } },
      { ...base, settingsUnreadable: { ...base.settingsUnreadable, rawRow: 'x'.repeat(SETTINGS_RAW_ROW_MAX + 1) } },
      { ...base, settingsUnreadable: { ...base.settingsUnreadable, role: 'shop' } },
      { ...base, photos: 'omitted', tables: { ...tables([]), jobPhotos: [{}] } },
    ];
    for (const file of broken) expect(parseAnyBackupFile(file).ok).toBe(false);
  });

  it('the checksum still covers the tables only, so old checksums stay valid', () => {
    const file = unreadableFile();
    expect(checksumInput(file)).toBe(JSON.stringify(file.tables));
  });
});

describe('backupSettingsState: can the role and the PIN be read?', () => {
  it('reads a new install, a study row, and a shop row with its PIN', () => {
    expect(backupSettingsState(undefined)).toEqual({ state: 'readable', deviceRole: 'study', ownerPin: null });
    expect(backupSettingsState(studyRow())).toEqual({ state: 'readable', deviceRole: 'study', ownerPin: null });
    expect(backupSettingsState(shopRow())).toEqual({ state: 'readable', deviceRole: 'shop', ownerPin: PIN });
  });

  it('leaves damaged ordinary fields and unknown fields to the salvage', () => {
    expect(backupSettingsState({ ...shopRow(), handedness: 'both', fieldFromANewerVersion: true }).state).toBe('readable');
  });

  it('names each unreadable guard, keeps the raw row as text, and never yields a role or a PIN', () => {
    const cases: [unknown, string[]][] = [
      [{ ...shopRow(), deviceRole: 'crewTablet' }, ['deviceRoleUnreadable']],
      [{ ...shopRow(), ownerPin: { ...PIN, algorithm: 'Argon2id' } }, ['ownerPinUnreadable']],
      [{ ...shopRow(), deviceRole: 'crewTablet', ownerPin: { ...PIN, extra: 1 } }, ['deviceRoleUnreadable', 'ownerPinUnreadable']],
      [{ ...shopRow(), ownerPin: null }, ['shopRoleWithoutPin']],
      [null, ['rowNotARecord']],
      ['device', ['rowNotARecord']],
      [[shopRow()], ['rowNotARecord']],
    ];
    for (const [row, reasons] of cases) {
      const state = backupSettingsState(row);
      expect(state.state).toBe('unreadable');
      if (state.state !== 'unreadable') continue;
      expect(state.section.reasons).toEqual(reasons);
      expect(SettingsUnreadable.safeParse(state.section).success).toBe(true);
      expect(Object.keys(state)).toEqual(['state', 'section']);
    }
  });

  it('never reads a role inherited through a prototype', () => {
    const sneaky = Object.create({ deviceRole: 'shop', ownerPin: PIN }) as Record<string, unknown>;
    expect(backupSettingsState(sneaky)).toEqual({ state: 'readable', deviceRole: 'study', ownerPin: null });
  });

  it('writes the raw row as text, cut at the limit, and survives a row JSON cannot hold', () => {
    const row = { ...shopRow(), deviceRole: 'crewTablet' };
    expect(settingsUnreadableSection(row, ['deviceRoleUnreadable'])).toEqual({
      reasons: ['deviceRoleUnreadable'],
      rawRow: JSON.stringify(row),
      rawRowComplete: true,
    });
    const huge = settingsUnreadableSection({ note: 'x'.repeat(SETTINGS_RAW_ROW_MAX * 2) }, ['otherFieldUnreadable']);
    expect([huge.rawRow.length, huge.rawRowComplete]).toEqual([SETTINGS_RAW_ROW_MAX, false]);
    const cyclic: Record<string, unknown> = { deviceRole: 'crewTablet' };
    cyclic.self = cyclic;
    expect(settingsUnreadableSection(cyclic, ['deviceRoleUnreadable', 'deviceRoleUnreadable'])).toEqual({
      reasons: ['deviceRoleUnreadable'],
      rawRow: '',
      rawRowComplete: false,
    });
  });
});

describe('restorePlan: what is applied, kept, and flagged', () => {
  it('a readable shop backup on a study phone with no PIN: the D12 import, unchanged', () => {
    const plan = planOk(readableFile(shopRow()), readableHere(studyRow()));
    expect(plan).toMatchObject({
      settingsFrom: 'file',
      keeps: [],
      result: { deviceRole: 'shop', hasPin: true },
      roleChange: { from: 'study', to: 'shop' },
      signOffs: { rows: 2, comeBack: 'asInFile' },
      needs: { ownerPass: false, typedWord: true, backupFirst: false, countsFirst: true },
    });
  });

  it('a readable backup on a phone with a readable PIN needs the owner pass', () => {
    expect(planOk(readableFile(shopRow()), readableHere(shopRow())).needs.ownerPass).toBe(true);
  });

  it('a study backup on the shop phone is refused, as before', () => {
    expect(restorePlan(parsed(readableFile(studyRow())), readableHere(shopRow()))).toMatchObject({ ok: false, code: 'shopNeedsShopBackup' });
  });

  it('a backup with unreadable settings on the shop phone: this phone keeps its role and PIN, sign-offs need a re-check', () => {
    const plan = planOk(unreadableFile({ jobs: 25 }), readableHere(shopRow(), 2));
    expect(plan).toMatchObject({
      settingsFrom: 'thisPhone',
      keeps: ['deviceRole', 'ownerPin', 'otherSettings'],
      result: { deviceRole: 'shop', hasPin: true },
      roleChange: null,
      signOffs: { rows: 2, comeBack: 'needsRecheck' },
      flags: { fileSettingsUnreadable: true, thisPhoneSettingsUnreadable: false, carsSeedNotRestored: true, fewerJobsThanThisPhone: false },
      needs: { ownerPass: true, typedWord: true, backupFirst: false },
    });
  });

  it('a backup with unreadable settings on a study phone with no PIN: it stays a study phone with no PIN', () => {
    const plan = planOk(unreadableFile(), readableHere(studyRow(), 0));
    expect(plan).toMatchObject({ settingsFrom: 'thisPhone', result: { deviceRole: 'study', hasPin: false }, signOffs: { comeBack: 'needsRecheck' } });
    expect(plan.needs.ownerPass).toBe(false);
  });

  it('both unreadable: a new study row with no PIN, a backup of this phone first, and the typed word instead of the pass', () => {
    const plan = planOk(unreadableFile(), unreadableHere());
    expect(plan).toMatchObject({
      settingsFrom: 'fresh',
      result: { deviceRole: 'study', hasPin: false },
      roleChange: { from: 'unreadable', to: 'study' },
      signOffs: { comeBack: 'needsRecheck' },
      needs: { ownerPass: false, typedWord: true, backupFirst: true, countsFirst: true },
    });
  });

  it('a readable shop backup on a phone whose settings are unreadable: the file brings its role and PIN', () => {
    const plan = planOk(readableFile(shopRow()), unreadableHere());
    expect(plan).toMatchObject({ settingsFrom: 'file', result: { deviceRole: 'shop', hasPin: true }, roleChange: { from: 'unreadable', to: 'shop' } });
    expect(plan.signOffs.comeBack).toBe('asInFile');
    expect(plan.needs).toEqual({ ownerPass: false, typedWord: true, backupFirst: true, countsFirst: true });
  });

  it('a study backup on a phone whose settings are unreadable is allowed, with the job counts flagged', () => {
    const plan = planOk(readableFile(studyRow(), { jobs: 0 }), unreadableHere(12));
    expect(plan).toMatchObject({ settingsFrom: 'file', result: { deviceRole: 'study', hasPin: false }, flags: { fewerJobsThanThisPhone: true } });
    expect(plan.signOffs.comeBack).toBe('needsRecheck');
  });

  it('the shop path refuses a backup with unreadable settings and a study backup', () => {
    expect(restorePlan(parsed(unreadableFile()), readableHere(studyRow()), 'importBackup')).toEqual({
      ok: false,
      code: 'notShopBackup',
      message: SETTINGS_UNREADABLE_SHOP_PATH_MESSAGE,
    });
    expect(restorePlan(parsed(readableFile(studyRow())), readableHere(studyRow()), 'importBackup')).toMatchObject({ ok: false, code: 'notShopBackup' });
    expect(planOk(readableFile(shopRow()), readableHere(studyRow()), 'importBackup').result.deviceRole).toBe('shop');
  });

  it('a file with unreadable settings never grants shop or a PIN the phone did not already have', () => {
    const destinations: BackupSettingsState[] = [
      backupSettingsState(undefined),
      backupSettingsState(studyRow()),
      backupSettingsState({ ...studyRow(), ownerPin: { ...PIN } }),
      backupSettingsState(shopRow()),
      unreadableHere().settings,
    ];
    for (const settings of destinations) {
      const plan = planOk(unreadableFile(), { settings, jobs: 0 });
      const before = settings.state === 'readable' ? { deviceRole: settings.deviceRole, hasPin: settings.ownerPin !== null } : { deviceRole: 'study', hasPin: false };
      expect(plan.result).toEqual(before);
      expect(plan.signOffs.comeBack).toBe('needsRecheck');
      expect(plan.needs.typedWord).toBe(true);
    }
  });

  it('replaces every table except settings, and flags a file without photos', () => {
    const plan = planOk(readableFile(shopRow(), { photos: 'omitted' }), readableHere(studyRow()));
    expect([...plan.replaces].sort()).toEqual(TABLE_NAMES.filter((n) => n !== 'settings').sort());
    expect(plan.flags.photosNotInFile).toBe(true);
  });
});

describe('settingsAfterRestore and signOffsAfterRestore', () => {
  it('file: the file row, Customer View off, the role choice dated', () => {
    const file = { ...shopRow(), roleChosenAt: null, customerViewOn: true, focusReminderShown: true };
    const next = settingsAfterRestore({ settingsFrom: 'file' }, { file, nowIso: LATER });
    expect(next).toMatchObject({ deviceRole: 'shop', ownerPin: PIN, customerViewOn: false, focusReminderShown: false, roleChosenAt: LATER });
    expect(Settings.safeParse(next).success).toBe(true);
  });

  it("thisPhone: this phone's role, PIN, and cars seed stay; Customer View off", () => {
    const thisPhone = { ...shopRow(), customerViewOn: true, focusReminderShown: true, handedness: 'right' as const };
    const next = settingsAfterRestore({ settingsFrom: 'thisPhone' }, { thisPhone, nowIso: LATER });
    expect(next).toMatchObject({ deviceRole: 'shop', ownerPin: PIN, carsLoggedBefore: 7, handedness: 'right', customerViewOn: false, focusReminderShown: false });
    expect(Settings.safeParse(next).success).toBe(true);
  });

  it('fresh: a study row with no PIN, and the setup banner back on its first step', () => {
    const next = settingsAfterRestore({ settingsFrom: 'fresh' }, { nowIso: LATER });
    expect(next).toMatchObject({ deviceRole: 'study', ownerPin: null, roleChosenAt: null });
    expect(setupStep(next)).toBe('chooseRole');
  });

  it('throws when the row the plan names is missing', () => {
    expect(() => settingsAfterRestore({ settingsFrom: 'file' }, { nowIso: LATER })).toThrow(/file settings row/);
    expect(() => settingsAfterRestore({ settingsFrom: 'thisPhone' }, { nowIso: LATER })).toThrow(/this phone's settings row/);
  });

  it('marks every restored sign-off needs re-check, or leaves them as they were, without changing the input', () => {
    const rows = parsed(readableFile(shopRow())).backup.tables.signOffs as SignOffValue[];
    const marked = signOffsAfterRestore(rows, 'needsRecheck');
    expect(marked.map((r) => r.needsRecheck)).toEqual([true, true]);
    expect(rows.map((r) => r.needsRecheck)).toEqual([false, false]);
    expect(signOffsAfterRestore(rows, 'asInFile')).toEqual(rows);
  });
});
