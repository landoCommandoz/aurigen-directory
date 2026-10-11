/**
 * The two files that leave the device (BLUEPRINT section 6, D3, D12):
 * 1. The backup: every table, photos embedded as base64 (or omitted), through the share sheet.
 *    Importing the newest shop backup is the only way a second phone becomes the shop phone.
 * 2. The crew progress file: one person's drill logs and quiz attempts, from a study phone.
 *    Sign-off records and skill states found in it are refused and reported, never imported.
 * Both are JSON. Owner: architect. Writing, sharing, and importing them: app-engineer.
 *
 * Checksum: SHA-256, lowercase hex, of the UTF-8 bytes of checksumInput(raw), where raw is the
 * file as JSON.parse returned it (before zod, so key order is the file's own). The app computes
 * and checks it with crypto.subtle.digest; a mismatch is refused as "damaged".
 *
 * Unreadable settings (DEF-13, 2026-10-11): a backup is never refused because the phone's own
 * settings row cannot be read. Format version 1 gains one optional top-level key,
 * `settingsUnreadable`. When it is present the file carries no `deviceRole` and no settings row
 * (tables.settings is empty), only the raw row as opaque text for diagnosis; every other table is
 * whole. When it is absent the file is exactly the version 1 file written before 2026-10-11, so
 * every older file still parses. parseAnyBackupFile reads both; parseBackupFile reads only files
 * with readable settings (the "This is the shop phone" import path). Restore rules:
 * backup-recovery.ts.
 */
import * as z from 'zod';
import { At, RecordId } from './records';
import { AnyJob, Debrief, FieldNote, Issue, StageTiming, jobPhotoShape } from './runtime-job';
import { CrewMember, DrillLog, FlashcardState, QuizAttempt, SignOff, SkillState } from './runtime-crew';
import { AuditLog, DeviceRole, Settings } from './runtime-device';
import { PanelReading } from './readings';

export const BACKUP_KIND = 'masterclass-backup' as const;
export const CREW_PROGRESS_KIND = 'masterclass-crew-progress' as const;
/** The backup format this app writes. Bump it, and keep reading the old one, when the shape changes. */
export const BACKUP_FORMAT_VERSION = 1 as const;
export const SUPPORTED_BACKUP_VERSIONS: readonly number[] = [1];
export const CREW_PROGRESS_FORMAT_VERSION = 1 as const;

const SemVer = z.string().regex(/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/);
export const Checksum = z.strictObject({
  algorithm: z.literal('SHA-256'),
  value: z.string().regex(/^[0-9a-f]{64}$/, { error: 'checksum is 64 lowercase hex characters' }),
});

/** A photo in a backup: the database row with the image as base64 instead of a Blob. */
export const JobPhotoBackup = z.strictObject({ ...jobPhotoShape, data: z.base64().min(1) });

/** Every table, by name, as arrays of records. settings holds exactly one row. */
export const BackupTables = z.strictObject({
  jobs: z.array(AnyJob),
  stageTimings: z.array(StageTiming),
  panelReadings: z.array(PanelReading),
  jobPhotos: z.array(JobPhotoBackup),
  issues: z.array(Issue),
  debriefs: z.array(Debrief),
  fieldNotes: z.array(FieldNote),
  crewMembers: z.array(CrewMember),
  skillStates: z.array(SkillState),
  signOffs: z.array(SignOff),
  quizAttempts: z.array(QuizAttempt),
  drillLogs: z.array(DrillLog),
  flashcardStates: z.array(FlashcardState),
  settings: z.array(Settings).length(1, { error: 'A backup holds exactly one settings row' }),
  auditLog: z.array(AuditLog),
});

/** "omitted": the JSON-without-photos baseline (D3); jobPhotos is then empty. */
const PhotoMode = z.enum(['included', 'omitted']);

function photoRule(b: { photos: z.infer<typeof PhotoMode>; tables: { jobPhotos: readonly unknown[] } }, ctx: z.RefinementCtx): void {
  if (b.photos === 'omitted' && b.tables.jobPhotos.length > 0) {
    ctx.addIssue({ code: 'custom', path: ['tables', 'jobPhotos'], message: 'A backup without photos holds no photo rows' });
  }
}

/** A backup whose settings row was readable: the version 1 file as it has always been. */
export const BackupFile = z
  .strictObject({
    kind: z.literal(BACKUP_KIND),
    version: z.literal(BACKUP_FORMAT_VERSION),
    createdAt: At,
    appVersion: SemVer,
    deviceRole: DeviceRole,
    photos: PhotoMode,
    tables: BackupTables,
    checksum: Checksum,
  })
  .superRefine((b, ctx) => {
    const settings = b.tables.settings[0];
    if (settings !== undefined && settings.deviceRole !== b.deviceRole) {
      ctx.addIssue({ code: 'custom', path: ['deviceRole'], message: 'deviceRole must match the settings row' });
    }
    photoRule(b, ctx);
  });
export type BackupFileValue = z.infer<typeof BackupFile>;

/* ---------- Unreadable settings (DEF-13) ---------- */

/** Why the phone that made the backup could not use its settings row. Codes for the developer panel, never shown as words. */
export const SETTINGS_UNREADABLE_REASONS = [
  'rowNotARecord',
  'deviceRoleUnreadable',
  'ownerPinUnreadable',
  'shopRoleWithoutPin',
  'otherFieldUnreadable',
] as const;
export const SettingsUnreadableReason = z.enum(SETTINGS_UNREADABLE_REASONS);
export type SettingsUnreadableReasonName = z.infer<typeof SettingsUnreadableReason>;

/** The raw row is cut at this many characters. A real settings row is under 2,000. */
export const SETTINGS_RAW_ROW_MAX = 16_384;

/**
 * The settings section of a backup made while the role or the PIN record could not be read.
 * rawRow is the stored row as JSON text, for diagnosis only: nothing ever parses it back into
 * settings, renders it as markup, or reads a role or a PIN from it.
 */
export const SettingsUnreadable = z.strictObject({
  reasons: z.array(SettingsUnreadableReason).min(1),
  rawRow: z.string().max(SETTINGS_RAW_ROW_MAX),
  /** False when rawRow was cut at SETTINGS_RAW_ROW_MAX, or the row could not be written as text at all. */
  rawRowComplete: z.boolean(),
});
export type SettingsUnreadableValue = z.infer<typeof SettingsUnreadable>;

/** The same tables, with no settings row: the role and the PIN are never guessed into a file. */
export const BackupTablesSettingsUnreadable = BackupTables.extend({
  settings: z.array(Settings).max(0, { error: 'A backup with unreadable settings holds no settings row' }),
});

/** A version 1 backup made while the phone's settings row could not be read. */
export const BackupFileSettingsUnreadable = z
  .strictObject({
    kind: z.literal(BACKUP_KIND),
    version: z.literal(BACKUP_FORMAT_VERSION),
    createdAt: At,
    appVersion: SemVer,
    settingsUnreadable: SettingsUnreadable,
    photos: PhotoMode,
    tables: BackupTablesSettingsUnreadable,
    checksum: Checksum,
  })
  .superRefine(photoRule);
export type BackupFileSettingsUnreadableValue = z.infer<typeof BackupFileSettingsUnreadable>;

/** Either kind of version 1 backup, told apart by `settings`. */
export type ParsedBackup =
  | { settings: 'readable'; backup: BackupFileValue }
  | { settings: 'unreadable'; backup: BackupFileSettingsUnreadableValue };

/** One person's progress from a study phone. Nothing else travels in it. */
export const CrewProgressFile = z.strictObject({
  kind: z.literal(CREW_PROGRESS_KIND),
  version: z.literal(CREW_PROGRESS_FORMAT_VERSION),
  createdAt: At,
  appVersion: SemVer,
  progress: z.strictObject({
    crew: z.strictObject({ id: RecordId, name: z.string().trim().min(1).max(40) }),
    drillLogs: z.array(DrillLog),
    quizAttempts: z.array(QuizAttempt),
  }),
  checksum: Checksum,
});
export type CrewProgressFileValue = z.infer<typeof CrewProgressFile>;

/** The exact string the checksum covers: tables for a backup, progress for a crew progress file. */
export function checksumInput(raw: unknown): string {
  if (raw === null || typeof raw !== 'object') return '';
  const r = raw as Record<string, unknown>;
  return JSON.stringify(r.kind === CREW_PROGRESS_KIND ? r.progress : r.tables) ?? '';
}

export type FileParseFailure = {
  ok: false;
  reason: 'notThisKind' | 'unknownVersion' | 'invalid';
  message: string;
  issues: string[];
};

function issuesOf(error: z.ZodError): string[] {
  return error.issues.slice(0, 50).map((i) => `${i.path.map(String).join('.') || '(file)'}: ${i.message}`);
}

function asRecord(input: unknown): Record<string, unknown> | null {
  return input !== null && typeof input === 'object' && !Array.isArray(input) ? (input as Record<string, unknown>) : null;
}

const DAMAGED_BACKUP_MESSAGE = 'This backup is damaged or incomplete. Nothing was imported.';

/** Plain words for a backup with unreadable settings offered on the shop path, which needs a readable shop role and PIN. */
export const SETTINGS_UNREADABLE_SHOP_PATH_MESSAGE =
  "This backup's role and owner PIN could not be read, so it cannot make this phone the shop phone. Use Start fresh with your PIN, then restore this backup to bring every job back.";

/** Kind and format version, checked before the schema. Null when the file may be parsed. */
function precheckBackup(raw: Record<string, unknown> | null): FileParseFailure | null {
  if (raw === null || raw.kind !== BACKUP_KIND) {
    const message =
      raw?.kind === CREW_PROGRESS_KIND
        ? 'This is a crew progress file. Use Import crew progress.'
        : 'This file is not a Masterclass backup.';
    return { ok: false, reason: 'notThisKind', message, issues: [] };
  }
  if (typeof raw.version !== 'number' || !SUPPORTED_BACKUP_VERSIONS.includes(raw.version)) {
    const newer = typeof raw.version === 'number' && raw.version > BACKUP_FORMAT_VERSION;
    const message = newer
      ? `This backup was made by a newer version of the app (format ${raw.version}). Update the app, then import again.`
      : `This backup's format (${String(raw.version)}) is not one this app can read.`;
    return { ok: false, reason: 'unknownVersion', message, issues: [] };
  }
  return null;
}

function hasUnreadableSettings(raw: Record<string, unknown>): boolean {
  return Object.hasOwn(raw, 'settingsUnreadable');
}

/**
 * Validate a backup with readable settings before anything is written. Rejects another kind of
 * file, an unknown format version (with a plain message), a file whose settings were unreadable
 * (SETTINGS_UNREADABLE_SHOP_PATH_MESSAGE), and any record that breaks its table's schema.
 * Use parseAnyBackupFile for Restore.
 */
export function parseBackupFile(input: unknown): { ok: true; backup: BackupFileValue } | FileParseFailure {
  const raw = asRecord(input);
  const refused = precheckBackup(raw);
  if (refused !== null) return refused;
  if (raw !== null && hasUnreadableSettings(raw)) {
    return { ok: false, reason: 'invalid', message: SETTINGS_UNREADABLE_SHOP_PATH_MESSAGE, issues: ['settingsUnreadable: present'] };
  }
  const parsed = BackupFile.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, reason: 'invalid', message: DAMAGED_BACKUP_MESSAGE, issues: issuesOf(parsed.error) };
  }
  return { ok: true, backup: parsed.data };
}

/**
 * Validate either kind of version 1 backup before anything is written (DEF-13). A file with a
 * `settingsUnreadable` key must match BackupFileSettingsUnreadable; any other file must match
 * BackupFile. The same refusals as parseBackupFile otherwise.
 */
export function parseAnyBackupFile(input: unknown): { ok: true; parsed: ParsedBackup } | FileParseFailure {
  const raw = asRecord(input);
  const refused = precheckBackup(raw);
  if (refused !== null) return refused;
  if (raw !== null && hasUnreadableSettings(raw)) {
    const parsed = BackupFileSettingsUnreadable.safeParse(raw);
    if (!parsed.success) return { ok: false, reason: 'invalid', message: DAMAGED_BACKUP_MESSAGE, issues: issuesOf(parsed.error) };
    return { ok: true, parsed: { settings: 'unreadable', backup: parsed.data } };
  }
  const parsed = BackupFile.safeParse(raw);
  if (!parsed.success) return { ok: false, reason: 'invalid', message: DAMAGED_BACKUP_MESSAGE, issues: issuesOf(parsed.error) };
  return { ok: true, parsed: { settings: 'readable', backup: parsed.data } };
}

/** Keys a crew progress file may never carry. Found ones are removed, counted, and reported (BLUEPRINT 3.8). */
export const CREW_PROGRESS_REFUSED_KEYS = ['signOffs', 'skillStates'] as const;

/**
 * Validate a crew progress file. Sign-off records and skill states inside it are refused and
 * counted, never imported: a study phone's word unlocks nothing (D11).
 */
export function parseCrewProgressFile(
  input: unknown,
): { ok: true; file: CrewProgressFileValue; refused: Record<(typeof CREW_PROGRESS_REFUSED_KEYS)[number], number> } | FileParseFailure {
  const raw = asRecord(input);
  if (raw === null || raw.kind !== CREW_PROGRESS_KIND) {
    const message = raw?.kind === BACKUP_KIND ? 'This is a full backup. Use Import backup.' : 'This file is not a crew progress file.';
    return { ok: false, reason: 'notThisKind', message, issues: [] };
  }
  if (raw.version !== CREW_PROGRESS_FORMAT_VERSION) {
    return { ok: false, reason: 'unknownVersion', message: `This progress file's format (${String(raw.version)}) is not one this app can read.`, issues: [] };
  }
  const refused = { signOffs: 0, skillStates: 0 };
  const strip = (obj: Record<string, unknown>) => {
    const copy = { ...obj };
    for (const key of CREW_PROGRESS_REFUSED_KEYS) {
      if (key in copy) {
        const v = copy[key];
        refused[key] += Array.isArray(v) ? v.length : 1;
        delete copy[key];
      }
    }
    return copy;
  };
  const top = strip(raw);
  const progress = asRecord(top.progress);
  if (progress !== null) top.progress = strip(progress);
  const parsed = CrewProgressFile.safeParse(top);
  if (!parsed.success) {
    return { ok: false, reason: 'invalid', message: 'This progress file is damaged or incomplete. Nothing was imported.', issues: issuesOf(parsed.error) };
  }
  return { ok: true, file: parsed.data, refused };
}
