/**
 * Backup into the phone (D3, D12, BLUEPRINT 3.9). The screen asks before anything changes:
 *   1. readBackup(fileOrText): JSON, schema, format version, checksum. Writes nothing. Reads both
 *      kinds of version 1 file (DEF-13: one may have unreadable settings).
 *   2. previewRestore(verified, path) in restorePreview.ts: the plan and both sets of counts (this
 *      phone now, then the file), for the confirm screen. Writes nothing.
 *   3. importBackup(verified, { path, confirmed, backupOffered }): one transaction that follows
 *      restorePlan (src/schemas/backup-recovery.ts) on this phone's row as it reads inside that
 *      transaction, so the plan and the write see the same row. Customer View is off afterwards,
 *      the audit log records the import and any role change, and the counters are recomputed.
 *
 * The rules live in restorePlan and are not restated here: which settings row lands (the file's,
 * this phone's, or a fresh study row), when the owner pass is needed (this phone has a readable
 * PIN), when a backup of this phone must have been offered first (its own settings are
 * unreadable), and how restored sign-offs land (needs re-check unless the PIN that made them
 * comes with the file).
 */
import { restorePlan, settingsAfterRestore, signOffsAfterRestore, type DeviceRoleName, type JobPhotoValue, type RestorePath, type RestorePlanOk, type SettingsValue, type TableName } from '../schemas';
import { base64ToBytes } from './base64';
import { parsedBackupOf, verifyBackupBlob, verifyBackupText, type ReadBackupResult, type VerifiedBackup } from './backupFile';
import { nowIso } from './clock';
import { getPriceItems } from './content';
import { summarizeCounters, type CounterSummary } from './counters';
import { storageRefusal, validRow, withDb, writeSettingsIn } from './db';
import { restoreAudit } from './importRules';
import { RefusedError, refuse, type Refusal } from './errors';
import { readThisPhoneSettingsIn } from './phoneSettings';
import { clearOwnerPass, ownerPassActive } from './pin';

/** Step 1: check a picked file or pasted text. Nothing is written. */
export async function readBackup(source: Blob | string): Promise<ReadBackupResult> {
  return typeof source === 'string' ? verifyBackupText(source, getPriceItems()) : verifyBackupBlob(source, getPriceItems());
}

export interface ImportOptions {
  /** 'importBackup': the "This is the shop phone" path (readable shop backups only). 'restore': Settings, Restore. */
  path: RestorePath;
  /** The person answered yes to "Is this the newest backup from the shop phone?" (or typed the word for Restore). */
  confirmed: boolean;
  /** The screen offered a backup of this phone first. Required when this phone's own settings are unreadable (DEF-13). */
  backupOffered?: boolean;
}

export type ImportCode =
  | 'notConfirmed'
  | 'notShopBackup'
  | 'noOwnerPass'
  | 'shopNeedsShopBackup'
  | 'noPin'
  | 'choosePath'
  | 'warningNotAccepted'
  | 'backupNotOffered'
  | 'storage';

export type ImportResult =
  | { ok: true; deviceRole: DeviceRoleName; roleChanged: boolean; counters: CounterSummary; plan: RestorePlanOk }
  | Refusal<ImportCode>;

export const BACKUP_NOT_OFFERED_MESSAGE = "This phone's role and owner PIN could not be read. Save a backup of this phone first, then restore.";

function photoRows(backup: VerifiedBackup): JobPhotoValue[] {
  return backup.backup.tables.jobPhotos.map(({ data, ...meta }) =>
    validRow('jobPhotos', { ...meta, blob: new Blob([base64ToBytes(data)], { type: meta.mime }) }),
  );
}

/** Step 3: replace every table with the backup's rows, in one transaction, as restorePlan says. */
export async function importBackup(backup: VerifiedBackup, opts: ImportOptions): Promise<ImportResult> {
  if (backup.verified !== true) return refuse('notConfirmed', 'Check the backup file first.');
  if (!opts.confirmed) {
    return refuse('notConfirmed', 'Nothing changed. Confirm that this is the newest backup from the shop phone.');
  }
  const parsed = parsedBackupOf(backup.backup);
  const tables = backup.backup.tables;
  const fileSettings: SettingsValue | undefined = parsed.settings === 'readable' ? parsed.backup.tables.settings[0] : undefined;
  const rowsByTable: Record<Exclude<TableName, 'settings' | 'jobPhotos' | 'signOffs'>, readonly unknown[]> = {
    jobs: tables.jobs,
    stageTimings: tables.stageTimings,
    panelReadings: tables.panelReadings,
    issues: tables.issues,
    debriefs: tables.debriefs,
    fieldNotes: tables.fieldNotes,
    crewMembers: tables.crewMembers,
    skillStates: tables.skillStates,
    quizAttempts: tables.quizAttempts,
    drillLogs: tables.drillLogs,
    flashcardStates: tables.flashcardStates,
    auditLog: tables.auditLog,
  };

  try {
    // Decode photos before the transaction: Blob work is not IndexedDB work.
    const photos = photoRows(backup);
    const outcome = await withDb((db) =>
      db.transaction('rw', db.tables, async () => {
        // This phone's row as it reads now (never the throwing guard read): the plan decides.
        const here = await readThisPhoneSettingsIn(db);
        const plan = restorePlan(parsed, { settings: here.guard, jobs: await db.jobs.count() }, opts.path);
        if (!plan.ok) throw new RefusedError(refuse(plan.code, plan.message));
        if (plan.needs.ownerPass && !ownerPassActive()) {
          throw new RefusedError(refuse('noOwnerPass', 'This phone has an owner PIN. Enter it before replacing its data.'));
        }
        if (plan.needs.backupFirst && opts.backupOffered !== true) {
          throw new RefusedError(refuse('backupNotOffered', BACKUP_NOT_OFFERED_MESSAGE));
        }
        const settings = settingsAfterRestore(plan, {
          file: fileSettings,
          thisPhone: here.state === 'readable' ? here.salvaged.settings : undefined,
          nowIso: nowIso(),
        });
        for (const name of plan.replaces) await db.table(name).clear();
        await db.settings.clear();
        for (const [name, rows] of Object.entries(rowsByTable)) {
          if (rows.length > 0) await db.table(name).bulkAdd([...rows]);
        }
        const signOffs = signOffsAfterRestore(tables.signOffs, plan.signOffs.comeBack);
        if (signOffs.length > 0) await db.signOffs.bulkAdd(signOffs);
        if (photos.length > 0) await db.jobPhotos.bulkAdd(photos);
        const written = await writeSettingsIn(db, settings);
        await db.auditLog.bulkAdd(restoreAudit(plan, backup, opts.path));
        return { plan, settings: written };
      }),
    );
    // The PIN may have changed with the backup; the old pass does not carry over.
    clearOwnerPass();
    const jobs = await withDb((db) => db.jobs.toArray());
    return {
      ok: true,
      deviceRole: outcome.settings.deviceRole,
      roleChanged: outcome.plan.roleChange !== null,
      counters: summarizeCounters(jobs, getPriceItems(), outcome.settings.carsLoggedBefore),
      plan: outcome.plan,
    };
  } catch (error) {
    if (error instanceof RefusedError) return error.refusal as Refusal<ImportCode>;
    return storageRefusal(error);
  }
}
