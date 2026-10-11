/**
 * The backup file itself (src/schemas/backup.ts, D3 amendment): one JSON file, every table by
 * name, photos embedded as base64 or omitted, and a SHA-256 checksum over the tables.
 * Pure apart from hashing: no database here. backup.ts writes and shares; backupImport.ts reads
 * back into the database.
 */
import {
  BACKUP_FORMAT_VERSION,
  BACKUP_KIND,
  BackupFile,
  checksumInput,
  parseBackupFile,
  type BackupFileValue,
  type DeviceRoleName,
  type PriceItemItem,
} from '../schemas';
import { sha256Hex } from './crypto';
import { summarizeCounters, type CounterSummary } from './counters';
import { RecordInvalid } from './errors';

export type BackupTablesValue = BackupFileValue['tables'];
export type PhotoMode = BackupFileValue['photos'];

/** Refuse anything bigger before reading it into memory. A year of jobs with photos stays far below. */
export const MAX_BACKUP_BYTES = 300 * 1024 * 1024;

export interface BackupSummary extends CounterSummary {
  createdAt: string;
  appVersion: string;
  deviceRole: DeviceRoleName;
  photos: PhotoMode;
  photoCount: number;
  hasPin: boolean;
  bytes: number;
}

/** A backup that parsed with the schema and whose checksum matched. Only this can be imported. */
export interface VerifiedBackup {
  readonly verified: true;
  readonly backup: BackupFileValue;
  readonly summary: BackupSummary;
}

export type ReadBackupFailure = {
  ok: false;
  reason: 'tooLarge' | 'notJson' | 'notThisKind' | 'unknownVersion' | 'invalid' | 'damaged' | 'unreadable';
  message: string;
  issues: string[];
};

export type ReadBackupResult = ({ ok: true } & VerifiedBackup) | ReadBackupFailure;

export function summarizeBackup(backup: BackupFileValue, bytes: number, priceItems: readonly PriceItemItem[]): BackupSummary {
  const settings = backup.tables.settings[0];
  return {
    ...summarizeCounters(backup.tables.jobs, priceItems, settings?.carsLoggedBefore ?? 0),
    createdAt: backup.createdAt,
    appVersion: backup.appVersion,
    deviceRole: backup.deviceRole,
    photos: backup.photos,
    photoCount: backup.tables.jobPhotos.length,
    hasPin: settings?.ownerPin != null,
    bytes,
  };
}

/**
 * Assemble and validate a backup file. The checksum covers JSON.stringify(tables) exactly as
 * written into the file, so a reader recomputes it from the parsed JSON (checksumInput).
 * Throws RecordInvalid if any row breaks its schema, so a bad backup is never handed out.
 */
export async function buildBackupFile(input: {
  tables: BackupTablesValue;
  createdAt: string;
  appVersion: string;
  deviceRole: DeviceRoleName;
  photos: PhotoMode;
}): Promise<{ file: BackupFileValue; json: string }> {
  const tablesJson = JSON.stringify(input.tables);
  const draft = {
    kind: BACKUP_KIND,
    version: BACKUP_FORMAT_VERSION,
    createdAt: input.createdAt,
    appVersion: input.appVersion,
    deviceRole: input.deviceRole,
    photos: input.photos,
    tables: input.tables,
    checksum: { algorithm: 'SHA-256' as const, value: await sha256Hex(tablesJson) },
  };
  const parsed = BackupFile.safeParse(draft);
  if (!parsed.success) {
    throw new RecordInvalid(
      'backup',
      parsed.error.issues.slice(0, 20).map((i) => `${i.path.map(String).join('.')}: ${i.message}`),
    );
  }
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
  const parsed = parseBackupFile(raw);
  if (!parsed.ok) return { ok: false, reason: parsed.reason, message: parsed.message, issues: parsed.issues };
  const expected = parsed.backup.checksum.value;
  const actual = await sha256Hex(checksumInput(raw));
  if (actual !== expected) {
    return {
      ok: false,
      reason: 'damaged',
      message: 'This backup is damaged (its checksum does not match). Nothing was imported. Use another copy.',
      issues: [],
    };
  }
  return { ok: true, verified: true, backup: parsed.backup, summary: summarizeBackup(parsed.backup, text.length, priceItems) };
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
