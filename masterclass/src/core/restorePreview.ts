/**
 * What a restore would do, before the typed word (DEF-13, D12 amendment item 4, BLUEPRINT 3.8):
 * the plan from restorePlan (src/schemas/backup-recovery.ts) and the counts the confirm screen
 * shows first, this phone now and then the file. Writes nothing. importBackup re-reads this
 * phone's row inside its own transaction, so a change between the preview and the write is
 * caught there, never applied on a stale plan.
 */
import { restorePlan, type RestorePath, type RestorePlan } from '../schemas';
import { parsedBackupOf, summarizeBackup, type BackupSummary, type VerifiedBackup } from './backupFile';
import { getPriceItems } from './content';
import { summarizeCounters } from './counters';
import { storageRefusal, withDb } from './db';
import type { Refusal } from './errors';
import { readThisPhoneSettingsIn } from './phoneSettings';

export interface ThisPhoneNow {
  jobs: number;
  carsLogged: number;
  founderSlotsUsed: number;
  /** Whether this phone's own role and PIN record can be read. */
  settings: 'readable' | 'unreadable';
  /** This phone's "cars logged before this app" number; 0 when its settings are unreadable. */
  carsSeed: number;
}

export type RestorePreview = { ok: true; plan: RestorePlan; thisPhone: ThisPhoneNow; file: BackupSummary } | Refusal<'storage'>;

/**
 * The plan and both sets of counts. The file's summary is re-made with the right "cars logged
 * before this app" seed: a file with unreadable settings carries none, so it is this phone's own
 * when the restore keeps this phone's settings, else 0.
 */
export async function previewRestore(backup: VerifiedBackup, path: RestorePath): Promise<RestorePreview> {
  try {
    const read = await withDb((db) =>
      db.transaction('r', db.settings, db.jobs, async () => ({ here: await readThisPhoneSettingsIn(db), jobs: await db.jobs.toArray() })),
    );
    const plan = restorePlan(parsedBackupOf(backup.backup), { settings: read.here.guard, jobs: read.jobs.length }, path);
    const carsSeed = read.here.state === 'readable' ? read.here.salvaged.settings.carsLoggedBefore : 0;
    const counts = summarizeCounters(read.jobs, getPriceItems(), carsSeed);
    const fileSeed = plan.ok && plan.settingsFrom === 'thisPhone' ? carsSeed : 0;
    return {
      ok: true,
      plan,
      thisPhone: { jobs: counts.jobs, carsLogged: counts.carsLogged, founderSlotsUsed: counts.founderSlotsUsed, settings: read.here.state, carsSeed },
      file: summarizeBackup(backup.backup, backup.summary.bytes, getPriceItems(), { carsSeed: fileSeed }),
    };
  } catch (error) {
    return storageRefusal(error);
  }
}
