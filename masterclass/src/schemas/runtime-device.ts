/**
 * Device records and rules: Settings (one row per device), the owner PIN hash, the audit log,
 * and the device role rules Lando set on 2026-10-10 (D12, BLUEPRINT 3.9). Owner: architect.
 * The rule functions are pure; the app-engineer calls them inside the transaction that writes.
 */
import * as z from 'zod';
import { At, RecordId, recordShape, type TableName } from './records';

/* ---------- Device role ---------- */

export const DEVICE_ROLES = ['study', 'shop'] as const;
export const DeviceRole = z.enum(DEVICE_ROLES);
export type DeviceRoleName = z.infer<typeof DeviceRole>;
/** Every install starts as a study phone (D12). */
export const DEFAULT_DEVICE_ROLE: DeviceRoleName = 'study';

/** What each role may do. A study phone holds one person's Academy progress, plus Fix It, Search, Quick Cards. */
export const ROLE_CAN = {
  study: { createJobs: false, businessRoom: false, signOff: false, counters: false, customerView: false, profiles: 'one' },
  shop: { createJobs: true, businessRoom: true, signOff: true, counters: true, customerView: true, profiles: 'many' },
} as const satisfies Record<DeviceRoleName, Record<string, boolean | 'one' | 'many'>>;

/** The only two ways a phone becomes the shop phone (D12). */
export const SHOP_PATHS = ['importBackup', 'startFresh'] as const;
export type ShopPath = (typeof SHOP_PATHS)[number];

/** The Start fresh warning. It names the cost plainly: the counts start at zero. */
export const START_FRESH_WARNING =
  "Start fresh: this phone starts with no jobs, so cars logged and founder's slots reset to zero. If another phone has your jobs, cancel and import its newest backup instead.";

/** Start fresh empties these tables in the same transaction that makes the phone the shop phone. Academy progress stays. */
export const START_FRESH_CLEARS = [
  'jobs',
  'stageTimings',
  'panelReadings',
  'jobPhotos',
  'issues',
  'debriefs',
] as const satisfies readonly TableName[];

export type RoleDecision =
  | { allowed: true }
  | { allowed: false; code: 'choosePath' | 'noPin' | 'notShopBackup' | 'warningNotAccepted' | 'noOwnerPass'; message: string };

export interface BecomeShopInput {
  /** null or missing: only "This is the shop phone" was tapped. That tap alone changes nothing. */
  path?: ShopPath | null;
  /**
   * A PIN hash is on this phone, or is written in the same transaction as the role: Start fresh
   * sets the PIN before the role; an imported shop backup carries its PIN hash.
   */
  pinExists: boolean;
  /** Start fresh only: the warning that the counts reset to zero was shown and accepted. */
  startFreshWarningAccepted?: boolean;
  /** Import only: the deviceRole written in the backup file. */
  backupDeviceRole?: DeviceRoleName;
}

/**
 * Lando, 2026-10-10 [HOUSE]: "A mistaken 'This is the shop phone' tap changes nothing until an
 * owner PIN exists, and the screen has a clear Cancel. One shop phone at a time: a second phone
 * can only become the shop phone by importing the latest backup. 'Start fresh' is a separate
 * choice with a warning that the counts reset to zero."
 */
export function canBecomeShop(input: BecomeShopInput): RoleDecision {
  // The owner pass (D4) is checked separately, like every guarded write: a phone that already has
  // a PIN asks for it before any role change; a new PIN created in this flow counts as the pass.
  const path = input.path ?? null;
  if (path === null) {
    return { allowed: false, code: 'choosePath', message: 'Nothing changed. Import the newest backup from the shop phone, start fresh, or cancel.' };
  }
  if (path === 'importBackup' && input.backupDeviceRole !== 'shop') {
    return { allowed: false, code: 'notShopBackup', message: 'This backup is not from the shop phone. Import the newest backup from the shop phone.' };
  }
  if (path === 'startFresh' && input.startFreshWarningAccepted !== true) {
    return { allowed: false, code: 'warningNotAccepted', message: START_FRESH_WARNING };
  }
  if (!input.pinExists) {
    return { allowed: false, code: 'noPin', message: 'Nothing changes until the owner PIN is set.' };
  }
  return { allowed: true };
}

/** Shop to study needs the owner pass and is logged (roleChange). A study phone is already study. */
export function canBecomeStudy(input: { currentRole: DeviceRoleName; ownerPassValid: boolean }): RoleDecision {
  if (input.currentRole === 'shop' && !input.ownerPassValid) {
    return { allowed: false, code: 'noOwnerPass', message: 'Enter the owner PIN to change this phone to a study phone.' };
  }
  return { allowed: true };
}

/* ---------- Owner PIN (D4) ---------- */

/** What a person types. Never stored, never logged. */
export const PIN_LENGTH = 6;
export const PinEntry = z.string().regex(/^\d{6}$/, { error: 'The PIN is 6 digits' });

/** The stored PIN: a salted hash only. PBKDF2 through Web Crypto; plain salted SHA-256 is the fallback (D4). */
export const OwnerPin = z.strictObject({
  algorithm: z.enum(['PBKDF2-SHA-256', 'SHA-256']),
  iterations: z.number().int().min(1),
  salt: z.base64().min(1),
  hash: z.base64().min(1),
  setAt: At,
});
export type OwnerPinValue = z.infer<typeof OwnerPin>;

/* ---------- Settings: one row, id "device" ---------- */

export const Handedness = z.enum(['left', 'right']);
export const SETTINGS_ID = 'device' as const;

export const Settings = z
  .strictObject({
    id: z.literal(SETTINGS_ID),
    createdAt: At,
    updatedAt: At,
    deviceRole: DeviceRole.default(DEFAULT_DEVICE_ROLE),
    /** null until the person answers the setup banner. The phone works as a study phone meanwhile. */
    roleChosenAt: At.nullable().default(null),
    ownerPin: OwnerPin.nullable().default(null),
    /** The active profile on the shop phone; the owner by default. */
    activeCrewId: RecordId.nullable().default(null),
    customerViewOn: z.boolean().default(false),
    /** The Focus reminder was shown for the current switch-on (D10). Cleared when Customer View goes off. */
    focusReminderShown: z.boolean().default(false),
    readAloud: z.boolean().default(false),
    /** The chosen system voice. Never hard-code a voice name (D1 browser facts). */
    voiceURI: z.string().min(1).nullable().default(null),
    voiceLang: z.string().min(2).nullable().default(null),
    wakeLock: z.boolean().default(true),
    /** Left thumb taps by default (Lando, 2026-10-10). Flipping mirrors the bottom row and Undo only. */
    handedness: Handedness.default('left'),
    /** Cars logged before this app, set behind the PIN. Start fresh resets it to 0. */
    carsLoggedBefore: z.number().int().min(0).default(0),
    /** Turns on when the owner PIN is created (D12). */
    backupReminderWeekly: z.boolean().default(false),
    lastBackupAt: At.nullable().default(null),
    appVersionSeen: z.string().min(1).nullable().default(null),
    /** Production developer toggle, behind the PIN. Dev builds show the panel regardless. */
    developerPanel: z.boolean().default(false),
    /** The logged "I understand" for using the app in a Safari tab (D3). */
    tabWarningAcceptedAt: At.nullable().default(null),
    photoCapPerJob: z.number().int().min(1).default(24),
  })
  .superRefine((s, ctx) => {
    if (s.deviceRole === 'shop' && s.ownerPin === null) {
      ctx.addIssue({ code: 'custom', path: ['ownerPin'], message: 'A shop phone always has an owner PIN (D12)' });
    }
    if (s.focusReminderShown && !s.customerViewOn) {
      ctx.addIssue({ code: 'custom', path: ['focusReminderShown'], message: 'The Focus reminder mark is cleared when Customer View is off' });
    }
  });
export type SettingsValue = z.infer<typeof Settings>;

/** The settings row a brand-new install writes: a study phone, no PIN, left-handed. */
export function defaultSettings(nowIso: string): SettingsValue {
  return Settings.parse({ id: SETTINGS_ID, createdAt: nowIso, updatedAt: nowIso });
}

/** The settings fields written in the PIN-creation transaction. The first backup screen opens next (D12). */
export function settingsOnPinCreated(pin: OwnerPinValue): Pick<SettingsValue, 'ownerPin' | 'backupReminderWeekly'> {
  return { ownerPin: pin, backupReminderWeekly: true };
}

/* ---------- Setup banner and backup reminder (D12) ---------- */

export type SetupStep = 'chooseRole' | 'setPin' | 'firstBackup' | 'done';

/** First run goes straight into the rooms; the banner shows the next unfinished step. */
export function setupStep(s: Pick<SettingsValue, 'roleChosenAt' | 'ownerPin' | 'lastBackupAt'>): SetupStep {
  if (s.roleChosenAt === null) return 'chooseRole';
  if (s.ownerPin === null) return 'setPin';
  if (s.lastBackupAt === null) return 'firstBackup';
  return 'done';
}

export const BACKUP_REMINDER_DAYS = 7;
const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * True when the weekly backup reminder should show now. Never while Customer View is on (held
 * until it is off, D10). A clock that reads earlier than the last backup shows nothing.
 */
export function backupReminderDue(
  s: Pick<SettingsValue, 'backupReminderWeekly' | 'lastBackupAt' | 'customerViewOn'>,
  nowMs: number,
): boolean {
  if (!s.backupReminderWeekly || s.customerViewOn) return false;
  if (s.lastBackupAt === null) return true;
  const last = Date.parse(s.lastBackupAt);
  if (Number.isNaN(last)) return true;
  return nowMs - last >= BACKUP_REMINDER_DAYS * DAY_MS;
}

/* ---------- Audit log ---------- */

export const AUDIT_TYPES = [
  'override',
  'signoff',
  'revoke',
  'stop',
  'customerViewOff',
  'pinFail',
  'pinSet',
  'pinReset',
  'roleChange',
  'startFresh',
  'export',
  'import',
  'cutoffMoved',
  'level8Unlock',
  'carsSeedChanged',
  'tabWarningAccepted',
  'developerToggle',
] as const;
export const AuditType = z.enum(AUDIT_TYPES);

export const AuditLog = z.strictObject({
  ...recordShape,
  type: AuditType,
  /** Plain words. Never the PIN, never a customer's phone number. */
  detail: z.string().default(''),
  crewId: RecordId.nullable().default(null),
  jobId: RecordId.nullable().default(null),
  at: At,
});
export type AuditLogValue = z.infer<typeof AuditLog>;
