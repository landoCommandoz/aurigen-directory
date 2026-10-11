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

export const BackupFile = z
  .strictObject({
    kind: z.literal(BACKUP_KIND),
    version: z.literal(BACKUP_FORMAT_VERSION),
    createdAt: At,
    appVersion: SemVer,
    deviceRole: DeviceRole,
    /** "omitted": the JSON-without-photos baseline (D3); jobPhotos is then empty. */
    photos: z.enum(['included', 'omitted']),
    tables: BackupTables,
    checksum: Checksum,
  })
  .superRefine((b, ctx) => {
    const settings = b.tables.settings[0];
    if (settings !== undefined && settings.deviceRole !== b.deviceRole) {
      ctx.addIssue({ code: 'custom', path: ['deviceRole'], message: 'deviceRole must match the settings row' });
    }
    if (b.photos === 'omitted' && b.tables.jobPhotos.length > 0) {
      ctx.addIssue({ code: 'custom', path: ['tables', 'jobPhotos'], message: 'A backup without photos holds no photo rows' });
    }
  });
export type BackupFileValue = z.infer<typeof BackupFile>;

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

/**
 * Validate a backup before anything is written. Rejects another kind of file, an unknown format
 * version (with a plain message), and any record that breaks its table's schema.
 */
export function parseBackupFile(input: unknown): { ok: true; backup: BackupFileValue } | FileParseFailure {
  const raw = asRecord(input);
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
  const parsed = BackupFile.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, reason: 'invalid', message: 'This backup is damaged or incomplete. Nothing was imported.', issues: issuesOf(parsed.error) };
  }
  return { ok: true, backup: parsed.data };
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
