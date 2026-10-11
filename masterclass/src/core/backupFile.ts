/**
 * The backup file itself (src/schemas/backup.ts, D3 amendment): one JSON file, every table by
 * name, photos embedded as base64 or omitted, and a SHA-256 checksum over the tables.
 * Pure apart from hashing: no database here. backup.ts writes and shares; backupImport.ts reads
 * back into the database.
 *
 * Two kinds of version 1 file (DEF-13, D12 amendment): the usual one, with the phone's role and
 * settings row, and one made while the phone could not read its role or PIN record. The second
 * has no deviceRole and no settings row, only a settingsUnreadable section, and never a guessed
 * role or PIN. parsedBackupOf() tells them apart for the restore rules in backup-recovery.ts.
 */
import {
  BACKUP_FORMAT_VERSION,
  BACKUP_KIND,
  BackupFile,
  BackupFileSettingsUnreadable,
  checksumInput,
  parseAnyBackupFile,
  type BackupFileSettingsUnreadableValue,
  type BackupFileValue,
  type DeviceRoleName,
  type ParsedBackup,
  type PriceItemItem,
  type SettingsUnreadableValue,
} from '../schemas';
import { sha256Hex } from './crypto';
import { summarizeCounters, type CounterSummary } from './counters';
import { RecordInvalid } from './errors';

/** Either kind of version 1 backup. */
export type AnyBackupFileValue = BackupFileValue | BackupFileSettingsUnreadableValue;
/** Every table by name. In a file with unreadable settings, settings is empty. */
export type BackupTablesValue = BackupFileValue['tables'];
export type PhotoMode = BackupFileValue['photos'];

/** Refuse anything bigger before reading it into memory. A year of jobs with photos stays far below. */
export const MAX_BACKUP_BYTES = 300 * 1024 * 1024;

export interface BackupSummary extends CounterSummary {
  createdAt: string;
  appVersion: string;
  /** 'unknown' when the file was made while its phone could not read its role or PIN. */
  deviceRole: DeviceRoleName | 'unknown';
  settings: 'readable' | 'unreadable';
  photos: PhotoMode;
  photoCount: number;
  hasPin: boolean;
  bytes: number;
}

/**
 * A backup that parsed with the schema and whose checksum matched. Only this can be imported.
 * `backup` is either kind; parsedBackupOf(backup) gives the tagged form the restore rules take.
 */
export interface VerifiedBackup {
  readonly verified: true;
  readonly backup: AnyBackupFileValue;
  readonly summary: BackupSummary;
}

export type ReadBackupFailure = {
  ok: false;
  reason: 'tooLarge' | 'notJson' | 'notThisKind' | 'unknownVersion' | 'invalid' | 'damaged' | 'unreadable';
  message: string;
  issues: string[];
};

export type ReadBackupResult = ({ ok: true } & VerifiedBackup) | ReadBackupFailure;

/** The tagged form of a verified file: which kind it is, for restorePlan. */
export function parsedBackupOf(backup: AnyBackupFileValue): ParsedBackup {
  return 'settingsUnreadable' in backup ? { settings: 'unreadable', backup } : { settings: 'readable', backup };
}

/**
 * What the confirm screen shows. A file with unreadable settings carries no "cars logged before
 * this app" number: carsSeed is this phone's own when the restore keeps this phone's settings,
 * else 0 (restorePlan settingsFrom).
 */
export function summarizeBackup(
  backup: AnyBackupFileValue,
  bytes: number,
  priceItems: readonly PriceItemItem[],
  opts: { carsSeed?: number } = {},
): BackupSummary {
  const parsed = parsedBackupOf(backup);
  const settings = parsed.settings === 'readable' ? parsed.backup.tables.settings[0] : undefined;
  const seed = parsed.settings === 'readable' ? (settings?.carsLoggedBefore ?? 0) : (opts.carsSeed ?? 0);
  return {
    ...summarizeCounters(backup.tables.jobs, priceItems, seed),
    createdAt: backup.createdAt,
    appVersion: backup.appVersion,
    deviceRole: parsed.settings === 'readable' ? parsed.backup.deviceRole : 'unknown',
    settings: parsed.settings,
    photos: backup.photos,
    photoCount: backup.tables.jobPhotos.length,
    hasPin: settings?.ownerPin != null,
    bytes,
  };
}

/** What the phone knew about its own settings when the backup was made. */
export type BackupSettingsInput =
  | { state: 'readable'; deviceRole: DeviceRoleName }
  | { state: 'unreadable'; section: SettingsUnreadableValue };

function issuesOf(error: { issues: ReadonlyArray<{ path: ReadonlyArray<PropertyKey>; message: string }> }): string[] {
  return error.issues.slice(0, 20).map((i) => `${i.path.map(String).join('.')}: ${i.message}`);
}

/**
 * Assemble and validate a backup file. The checksum covers JSON.stringify(tables) exactly as
 * written into the file, so a reader recomputes it from the parsed JSON (checksumInput).
 * Unreadable settings: no deviceRole key, an empty settings table, and the settingsUnreadable
 * section (BackupFileSettingsUnreadable). Throws RecordInvalid if any row breaks its schema, so a
 * bad backup is never handed out.
 */
export async function buildBackupFile(input: {
  tables: BackupTablesValue;
  createdAt: string;
  appVersion: string;
  settings: BackupSettingsInput;
  photos: PhotoMode;
}): Promise<{ file: AnyBackupFileValue; json: string }> {
  const tables = input.settings.state === 'readable' ? input.tables : { ...input.tables, settings: [] };
  const checksum = { algorithm: 'SHA-256' as const, value: await sha256Hex(JSON.stringify(tables)) };
  const head = { kind: BACKUP_KIND, version: BACKUP_FORMAT_VERSION, createdAt: input.createdAt, appVersion: input.appVersion };
  if (input.settings.state === 'readable') {
    const draft = { ...head, deviceRole: input.settings.deviceRole, photos: input.photos, tables, checksum };
    const parsed = BackupFile.safeParse(draft);
    if (!parsed.success) throw new RecordInvalid('backup', issuesOf(parsed.error));
    return { file: parsed.data, json: JSON.stringify(draft) };
  }
  const draft = { ...head, settingsUnreadable: input.settings.section, photos: input.photos, tables, checksum };
  const parsed = BackupFileSettingsUnreadable.safeParse(draft);
  if (!parsed.success) throw new RecordInvalid('backup', issuesOf(parsed.error));
  return { file: parsed.data, json: JSON.stringify(draft) };
}

/** Check a backup's text: JSON, the schema (kind, format version, every row), then the checksum. Writes nothing. */
export async function verifyBackupText(text: string, priceItems: readonly PriceItemItem[]): Promise<ReadBackupResult> {
  if (text.length > MAX_BACKUP_BYTES) {
    return { ok: false, reason: 'tooLarge', message: 'This file is too large to be a Masterclass backup.', issues: [] };
  }
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, reason: 'notJson', message: 'This file is not a Masterclass backup (it is not JSON).', issues: [] };
  }
  const parsed = parseAnyBackupFile(raw);
  if (!parsed.ok) return { ok: false, reason: parsed.reason, message: parsed.message, issues: parsed.issues };
  const backup = parsed.parsed.backup;
  const actual = await sha256Hex(checksumInput(raw));
  if (actual !== backup.checksum.value) {
    return {
      ok: false,
      reason: 'damaged',
      message: 'This backup is damaged (its checksum does not match). Nothing was imported. Use another copy.',
      issues: [],
    };
  }
  return { ok: true, verified: true, backup, summary: summarizeBackup(backup, text.length, priceItems) };
}

/** Read a picked file (Blob or File) and verify it. */
export async function verifyBackupBlob(file: Blob, priceItems: readonly PriceItemItem[]): Promise<ReadBackupResult> {
  if (file.size > MAX_BACKUP_BYTES) {
    return { ok: false, reason: 'tooLarge', message: 'This file is too large to be a Masterclass backup.', issues: [] };
  }
  let text: string;
  try {
    text = await file.text();
  } catch {
    return { ok: false, reason: 'unreadable', message: 'The phone could not read this file. Pick it again.', issues: [] };
  }
  return verifyBackupText(text, priceItems);
}
