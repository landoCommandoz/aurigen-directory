/**
 * Backup into the phone (D3, D12, BLUEPRINT 3.9). Two steps, so the screen can ask before
 * anything changes:
 *   1. readBackup(fileOrText): JSON, schema, format version, checksum. Writes nothing. Returns the
 *      summary the confirm screen shows (date, jobs, cars logged, founder's slots, role).
 *   2. importBackup(verified, { path, confirmed }): one transaction replaces every table. Customer
 *      View is off afterwards, the audit log records the import and any role change, and the
 *      counters are recomputed from the imported job log.
 *
 * Rules: a shop backup may land on any phone (that is how a second phone becomes the shop phone).
 * A study backup is refused on the shop path and on a shop phone (it would replace the jobs).
 * A phone that already has an owner PIN asks for it (the owner pass) before being replaced.
 * The phone's own settings row is read with the recovery read (DEF-08), so a row a newer version
 * wrote, or one with a damaged field, can still be replaced; its role and PIN are never guessed.
 */
import { canBecomeShop, type DeviceRoleName, type JobPhotoValue, type TableName } from '../schemas';
import { base64ToBytes } from './base64';
import { verifyBackupBlob, verifyBackupText, type ReadBackupResult, type VerifiedBackup } from './backupFile';
import { getPriceItems } from './content';
import { summarizeCounters, type CounterSummary } from './counters';
import { ALL_TABLES, readSettingsForRecoveryIn, storageRefusal, validRow, withDb, writeSettingsIn } from './db';
import { markShopViaImport } from './importRules';
import { RefusedError, refuse, type Refusal } from './errors';
import { clearOwnerPass, ownerPassActive } from './pin';

/** Step 1: check a picked file or pasted text. Nothing is written. */
export async function readBackup(source: Blob | string): Promise<ReadBackupResult> {
  return typeof source === 'string' ? verifyBackupText(source, getPriceItems()) : verifyBackupBlob(source, getPriceItems());
}

export interface ImportOptions {
  /** 'importBackup': the "This is the shop phone" path (shop backups only). 'restore': Settings, Restore. */
  path: 'importBackup' | 'restore';
  /** The person answered yes to "Is this the newest backup from the shop phone?" (or "Replace everything on this phone?"). */
  confirmed: boolean;
}

export type ImportCode = 'notConfirmed' | 'notShopBackup' | 'noOwnerPass' | 'shopNeedsShopBackup' | 'noPin' | 'choosePath' | 'warningNotAccepted' | 'storage';

export type ImportResult =
  | { ok: true; deviceRole: DeviceRoleName; roleChanged: boolean; counters: CounterSummary }
  | Refusal<ImportCode>;

function photoRows(backup: VerifiedBackup): JobPhotoValue[] {
  return backup.backup.tables.jobPhotos.map(({ data, ...meta }) =>
    validRow('jobPhotos', { ...meta, blob: new Blob([base64ToBytes(data)], { type: meta.mime }) }),
  );
}

/** Step 2: replace every table with the backup's rows, in one transaction. */
export async function importBackup(backup: VerifiedBackup, opts: ImportOptions): Promise<ImportResult> {
  if (backup.verified !== true) return refuse('notConfirmed', 'Check the backup file first.');
  if (!opts.confirmed) {
    return refuse('notConfirmed', 'Nothing changed. Confirm that this is the newest backup from the shop phone.');
  }
  const incomingRole = backup.backup.deviceRole;
  if (opts.path === 'importBackup') {
    const decision = canBecomeShop({
      path: 'importBackup',
      pinExists: backup.backup.tables.settings[0]?.ownerPin != null,
      backupDeviceRole: incomingRole,
    });
    if (!decision.allowed) return refuse(decision.code, decision.message);
  }

  const tables = backup.backup.tables;
  const rowsByTable: Record<Exclude<TableName, 'settings' | 'jobPhotos'>, readonly unknown[]> = {
    jobs: tables.jobs,
    stageTimings: tables.stageTimings,
    panelReadings: tables.panelReadings,
    issues: tables.issues,
    debriefs: tables.debriefs,
    fieldNotes: tables.fieldNotes,
    crewMembers: tables.crewMembers,
    skillStates: tables.skillStates,
    signOffs: tables.signOffs,
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
        const current = (await readSettingsForRecoveryIn(db)).settings;
        if (current.ownerPin !== null && !ownerPassActive()) {
          throw new RefusedError(refuse('noOwnerPass', 'This phone has an owner PIN. Enter it before replacing its data.'));
        }
        if (incomingRole === 'study' && current.deviceRole === 'shop') {
          throw new RefusedError(
            refuse('shopNeedsShopBackup', 'This is the shop phone. A study backup would replace its jobs. Switch it to a study phone first.'),
          );
        }
        const { settings, audit } = markShopViaImport(current, backup);
        for (const name of ALL_TABLES) await db.table(name).clear();
        for (const [name, rows] of Object.entries(rowsByTable)) {
          if (rows.length > 0) await db.table(name).bulkAdd([...rows]);
        }
        if (photos.length > 0) await db.jobPhotos.bulkAdd(photos);
        await writeSettingsIn(db, settings);
        await db.auditLog.bulkAdd(audit);
        return { roleChanged: current.deviceRole !== settings.deviceRole, deviceRole: settings.deviceRole, seed: settings.carsLoggedBefore };
      }),
    );
    // The PIN may have changed with the backup; the old pass does not carry over.
    clearOwnerPass();
    const jobs = await withDb((db) => db.jobs.toArray());
    return {
      ok: true,
      deviceRole: outcome.deviceRole,
      roleChanged: outcome.roleChanged,
      counters: summarizeCounters(jobs, getPriceItems(), outcome.seed),
    };
  } catch (error) {
    if (error instanceof RefusedError) return error.refusal as Refusal<ImportCode>;
    return storageRefusal(error);
  }
}
