/**
 * Backup and Restore when a settings row cannot be read (DEF-13, 2026-10-11; DECISIONS D12
 * amendment; BLUEPRINT 3.8 and 3.9). Owner: architect. Pure: no database, no clock, no browser.
 * backup.ts and backupImport.ts (app-engineer) call these around their transactions.
 *
 * The rules, in one place:
 * 1. A backup is never refused because the settings row is unreadable. backupSettingsState(row)
 *    says whether the two guard fields (deviceRole, ownerPin) can be read. When they cannot, the
 *    file carries every other table plus a settingsUnreadable section (reason codes and the raw
 *    row as opaque text), never a guessed role or PIN (backup.ts, BackupFileSettingsUnreadable).
 * 2. Restoring such a file is data without a role: it never grants shop or an owner PIN. This
 *    phone keeps its own settings row (role, PIN, everything else). If this phone's row is
 *    unreadable too, it gets a new study row with no PIN, and the owner sets it up through the
 *    normal D12 paths (create the PIN, then This is the shop phone).
 * 3. A phone whose own settings are unreadable cannot check the owner pass, so Restore there asks
 *    for a backup of this phone first and the typed word instead, after showing the counts.
 * 4. A sign-off travels only with the PIN that made it. Restored sign-offs keep their state only
 *    when the restore brings that PIN with it (a file with readable settings and a PIN). In every
 *    other case each restored sign-off comes back marked needs re-check, and the polish stage
 *    guard treats it as not signed off until the owner confirms it with this phone's PIN (D4, D11).
 */
import { SETTINGS_UNREADABLE_SHOP_PATH_MESSAGE, SETTINGS_RAW_ROW_MAX, type ParsedBackup, type SettingsUnreadableReasonName, type SettingsUnreadableValue } from './backup';
import { TABLE_NAMES, type TableName } from './records';
import type { SignOffValue } from './runtime-crew';
import {
  DEFAULT_DEVICE_ROLE,
  Settings,
  canBecomeShop,
  defaultSettings,
  type DeviceRoleName,
  type OwnerPinValue,
  type SettingsValue,
} from './runtime-device';

/** The two settings fields that decide who may do what. Never reset, never guessed (DEF-08, DEF-13). */
export const SETTINGS_GUARD_FIELDS = ['deviceRole', 'ownerPin'] as const satisfies readonly (keyof SettingsValue)[];
export type SettingsGuardField = (typeof SETTINGS_GUARD_FIELDS)[number];

/* ---------- Making the backup ---------- */

export type BackupSettingsState =
  | { state: 'readable'; deviceRole: DeviceRoleName; ownerPin: OwnerPinValue | null }
  | { state: 'unreadable'; section: SettingsUnreadableValue };

type Reasons = readonly [SettingsUnreadableReasonName, ...SettingsUnreadableReasonName[]];

function rawRowText(row: unknown): { rawRow: string; rawRowComplete: boolean } {
  let text: string | undefined;
  try {
    text = JSON.stringify(row);
  } catch {
    return { rawRow: '', rawRowComplete: false };
  }
  if (typeof text !== 'string') return { rawRow: '', rawRowComplete: false };
  if (text.length > SETTINGS_RAW_ROW_MAX) return { rawRow: text.slice(0, SETTINGS_RAW_ROW_MAX), rawRowComplete: false };
  return { rawRow: text, rawRowComplete: true };
}

/**
 * The settingsUnreadable section for a stored row. Used by backupSettingsState, and by the app
 * when the ordinary-field salvage (settingsRead.ts) still fails on a row whose guard fields read
 * fine: pass ['otherFieldUnreadable'] then. Never throws.
 */
export function settingsUnreadableSection(row: unknown, reasons: Reasons): SettingsUnreadableValue {
  return { reasons: [...new Set(reasons)], ...rawRowText(row) };
}

/**
 * Can the guard fields of a stored settings row be read? `row` is what IndexedDB returned for
 * the id "device": undefined means no row yet (a new install, read as the defaults). Only the
 * guard fields and the shop-needs-a-PIN rule are checked here; the ordinary fields are the
 * salvage's job (settingsRead.ts), which resets a damaged one to its default.
 */
export function backupSettingsState(row: unknown): BackupSettingsState {
  if (row === undefined) return { state: 'readable', deviceRole: DEFAULT_DEVICE_ROLE, ownerPin: null };
  if (row === null || typeof row !== 'object' || Array.isArray(row)) {
    return { state: 'unreadable', section: settingsUnreadableSection(row, ['rowNotARecord']) };
  }
  const record = row as Record<string, unknown>;
  // Own properties only: a value inherited through a prototype is never read as a role or a PIN.
  const role = Settings.shape.deviceRole.safeParse(Object.hasOwn(record, 'deviceRole') ? record.deviceRole : undefined);
  const pin = Settings.shape.ownerPin.safeParse(Object.hasOwn(record, 'ownerPin') ? record.ownerPin : undefined);
  const reasons: SettingsUnreadableReasonName[] = [];
  if (!role.success) reasons.push('deviceRoleUnreadable');
  if (!pin.success) reasons.push('ownerPinUnreadable');
  if (role.success && pin.success) {
    if (role.data !== 'shop' || pin.data !== null) return { state: 'readable', deviceRole: role.data, ownerPin: pin.data };
    reasons.push('shopRoleWithoutPin');
  }
  const [first = 'otherFieldUnreadable', ...rest] = reasons;
  return { state: 'unreadable', section: settingsUnreadableSection(row, [first, ...rest]) };
}

/* ---------- Restoring ---------- */

/** 'restore': Settings, Backup and restore. 'importBackup': This is the shop phone, Import (D12). */
export type RestorePath = 'restore' | 'importBackup';

export interface RestoreDestination {
  /** backupSettingsState of this phone's stored settings row. */
  settings: BackupSettingsState;
  /** Rows in this phone's jobs table now, drafts included: the "this phone now" count shown first. */
  jobs: number;
}

/** Where the settings row the restore writes comes from. */
export type RestoreSettingsSource = 'file' | 'thisPhone' | 'fresh';

export type RestoreRefusalCode = 'notShopBackup' | 'noPin' | 'shopNeedsShopBackup';

export interface RestorePlanOk {
  ok: true;
  settingsFrom: RestoreSettingsSource;
  /** Every table except settings is emptied and refilled from the file, in one transaction. */
  replaces: readonly TableName[];
  /** What this phone keeps from its own settings row. Empty unless settingsFrom is 'thisPhone'. */
  keeps: readonly ('deviceRole' | 'ownerPin' | 'otherSettings')[];
  /** The role and PIN this phone has after the restore. */
  result: { deviceRole: DeviceRoleName; hasPin: boolean };
  /** Null when the role stays the same. A change is written to the audit log as roleChange. */
  roleChange: { from: DeviceRoleName | 'unreadable'; to: DeviceRoleName } | null;
  /** How the file's sign-off rows land (rule 4). Apply with signOffsAfterRestore. */
  signOffs: { rows: number; comeBack: 'asInFile' | 'needsRecheck' };
  flags: {
    /** The file was made while its phone could not read its role or PIN: data without a role. */
    fileSettingsUnreadable: boolean;
    /** This phone's own role or PIN cannot be read. */
    thisPhoneSettingsUnreadable: boolean;
    /** The file's "cars logged before this app" number is not applied, because its settings could not be read. */
    carsSeedNotRestored: boolean;
    /** The file holds fewer job rows than this phone has now. */
    fewerJobsThanThisPhone: boolean;
    /** The file has no photos, so the restore leaves this phone with none. */
    photosNotInFile: boolean;
  };
  needs: {
    /** This phone has a readable owner PIN: the owner pass is required before anything changes (D4). */
    ownerPass: boolean;
    /** Every restore asks for the typed word. Where the owner pass cannot be checked, it stands in for it. */
    typedWord: true;
    /** This phone's settings are unreadable: offer Save backup of this phone first, because the restore replaces its jobs. */
    backupFirst: boolean;
    /** The confirm screen shows the counts (this phone now, then the file) before the typed word. */
    countsFirst: true;
  };
}

export type RestorePlan = RestorePlanOk | { ok: false; code: RestoreRefusalCode; message: string };

const REPLACED_TABLES: readonly TableName[] = TABLE_NAMES.filter((name) => name !== 'settings');

/**
 * What a restore will apply, keep, and flag, before anything is written. The screen shows it;
 * importBackup follows it inside its transaction (re-reading this phone's row there, so the plan
 * and the write see the same row). Refusals carry plain words.
 */
export function restorePlan(file: ParsedBackup, destination: RestoreDestination, path: RestorePath = 'restore'): RestorePlan {
  const fileSettings = file.settings === 'readable' ? file.backup.tables.settings[0] : undefined;
  const fileRole = file.settings === 'readable' ? file.backup.deviceRole : null;
  const here = destination.settings;

  if (path === 'importBackup') {
    if (fileRole === null) return { ok: false, code: 'notShopBackup', message: SETTINGS_UNREADABLE_SHOP_PATH_MESSAGE };
    const decision = canBecomeShop({ path: 'importBackup', pinExists: fileSettings?.ownerPin != null, backupDeviceRole: fileRole });
    if (!decision.allowed) return { ok: false, code: decision.code === 'noPin' ? 'noPin' : 'notShopBackup', message: decision.message };
  }
  if (fileRole === 'study' && here.state === 'readable' && here.deviceRole === 'shop') {
    return {
      ok: false,
      code: 'shopNeedsShopBackup',
      message: 'This is the shop phone. A study backup would replace its jobs. Switch it to a study phone first.',
    };
  }

  let settingsFrom: RestoreSettingsSource;
  let result: RestorePlanOk['result'];
  if (fileRole !== null) {
    settingsFrom = 'file';
    result = { deviceRole: fileRole, hasPin: fileSettings?.ownerPin != null };
  } else if (here.state === 'readable') {
    settingsFrom = 'thisPhone';
    result = { deviceRole: here.deviceRole, hasPin: here.ownerPin !== null };
  } else {
    settingsFrom = 'fresh';
    result = { deviceRole: DEFAULT_DEVICE_ROLE, hasPin: false };
  }

  const from = here.state === 'readable' ? here.deviceRole : 'unreadable';
  return {
    ok: true,
    settingsFrom,
    replaces: REPLACED_TABLES,
    keeps: settingsFrom === 'thisPhone' ? ['deviceRole', 'ownerPin', 'otherSettings'] : [],
    result,
    roleChange: from === result.deviceRole ? null : { from, to: result.deviceRole },
    signOffs: {
      rows: file.backup.tables.signOffs.length,
      comeBack: settingsFrom === 'file' && result.hasPin ? 'asInFile' : 'needsRecheck',
    },
    flags: {
      fileSettingsUnreadable: fileRole === null,
      thisPhoneSettingsUnreadable: here.state === 'unreadable',
      carsSeedNotRestored: fileRole === null,
      fewerJobsThanThisPhone: file.backup.tables.jobs.length < destination.jobs,
      photosNotInFile: file.backup.photos === 'omitted',
    },
    needs: {
      ownerPass: here.state === 'readable' && here.ownerPin !== null,
      typedWord: true,
      backupFirst: here.state === 'unreadable',
      countsFirst: true,
    },
  };
}

/**
 * The settings row the restore writes. 'file': the file's row; 'thisPhone': this phone's row as
 * the salvage read it; 'fresh': a new study row with no PIN. Customer View is always off after a
 * restore. Throws only on a caller mistake (the row the plan names was not passed).
 */
export function settingsAfterRestore(
  plan: Pick<RestorePlanOk, 'settingsFrom'>,
  input: { file?: SettingsValue | undefined; thisPhone?: SettingsValue | undefined; nowIso: string },
): SettingsValue {
  switch (plan.settingsFrom) {
    case 'file': {
      if (input.file === undefined) throw new Error('settingsAfterRestore: the plan needs the file settings row');
      return { ...input.file, customerViewOn: false, focusReminderShown: false, roleChosenAt: input.file.roleChosenAt ?? input.nowIso };
    }
    case 'thisPhone': {
      if (input.thisPhone === undefined) throw new Error("settingsAfterRestore: the plan needs this phone's settings row");
      return { ...input.thisPhone, customerViewOn: false, focusReminderShown: false };
    }
    case 'fresh':
      return defaultSettings(input.nowIso);
    default: {
      const unknownSource: never = plan.settingsFrom;
      throw new Error(`settingsAfterRestore: unknown source ${String(unknownSource)}`);
    }
  }
}

/** The file's sign-off rows as the restore writes them (rule 4). */
export function signOffsAfterRestore(rows: readonly SignOffValue[], comeBack: RestorePlanOk['signOffs']['comeBack']): SignOffValue[] {
  return comeBack === 'needsRecheck' ? rows.map((row) => ({ ...row, needsRecheck: true })) : [...rows];
}
