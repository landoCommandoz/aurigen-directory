/**
 * Backup out of the phone (D3, D12): build the file from every table, hand it to the share
 * sheet, and record "last backup". Import lives in backupImport.ts.
 *
 * A backup is never refused because this phone's settings row cannot be read (DEF-13, D12
 * amendment). If the role or the PIN record cannot be read, the file carries every other table
 * and a settingsUnreadable section instead of the settings row; it never guesses a role or a PIN
 * (phoneSettings.ts, src/schemas/backup-recovery.ts).
 *
 * The share sheet needs a fresh tap (MDN; WebKit consumes the activation, which lasts 5 seconds).
 * So the screen calls exportBackup() when it opens, and shareBackup(prepared) from the button tap
 * with nothing awaited before navigator.share. A download link is the desktop fallback only: on
 * an installed iPhone app a download traps the user on a sheet (D3), so there it is refused.
 */
import { config } from '../app/config';
import { backupReminderDue, type SettingsUnreadableReasonName, type SettingsValue } from '../schemas';
import { bytesToBase64 } from './base64';
import { buildBackupFile, type BackupSettingsInput, type BackupSummary, type BackupTablesValue, type PhotoMode, summarizeBackup } from './backupFile';
import { localDateStamp, nowIso, nowMs } from './clock';
import { loadPriceItems } from './content';
import { auditEntry, readSettingsIn, withDb, writeSettingsIn } from './db';
import { RecordInvalid, refuse, type Refusal } from './errors';
import { readThisPhoneSettingsIn } from './phoneSettings';
import { canShareFiles, errorNameOf, isIos, isStandalone } from './platform';

export interface PreparedBackup {
  filename: string;
  /** The whole file as text: what is shared, downloaded, or copied. */
  json: string;
  file: File;
  photos: PhotoMode;
  createdAt: string;
  summary: BackupSummary;
  /**
   * Settings fields that were damaged on this phone and are written at their defaults in this
   * file (DEF-08). Empty almost always. The role and the PIN are never among them.
   */
  settingsRepaired: string[];
  /** 'unreadable': the role or PIN record could not be read, so the file holds no settings row (DEF-13). */
  settings: 'readable' | 'unreadable';
  /** Why, as codes for the developer panel. Empty when readable. */
  unreadableReasons: SettingsUnreadableReasonName[];
}

export function backupFilename(ms: number = nowMs()): string {
  return `masterclass-backup-${localDateStamp(ms)}.json`;
}

/**
 * Build a backup of every table. photos 'included' embeds each photo as base64; 'omitted' is the
 * small JSON-only baseline (for "Copy backup text"). Reads one consistent snapshot.
 * The settings row is classified first (DEF-13): readable, it comes through the recovery read
 * (DEF-08: a field a newer version added is left out, a damaged field is written at its default);
 * unreadable, the file holds no settings row and a settingsUnreadable section. Either way the
 * jobs leave the phone. Throws only for storage failures or a broken row in another table.
 */
export async function exportBackup(opts: { photos?: PhotoMode } = {}): Promise<PreparedBackup> {
  const photos = opts.photos ?? 'included';
  const snapshot = await withDb((db) =>
    db.transaction('r', db.tables, async () => ({
      jobs: await db.jobs.toArray(),
      stageTimings: await db.stageTimings.toArray(),
      panelReadings: await db.panelReadings.toArray(),
      jobPhotos: photos === 'included' ? await db.jobPhotos.toArray() : [],
      issues: await db.issues.toArray(),
      debriefs: await db.debriefs.toArray(),
      fieldNotes: await db.fieldNotes.toArray(),
      crewMembers: await db.crewMembers.toArray(),
      skillStates: await db.skillStates.toArray(),
      signOffs: await db.signOffs.toArray(),
      quizAttempts: await db.quizAttempts.toArray(),
      drillLogs: await db.drillLogs.toArray(),
      flashcardStates: await db.flashcardStates.toArray(),
      phone: await readThisPhoneSettingsIn(db),
      auditLog: await db.auditLog.toArray(),
    })),
  );

  // Blob reads are not IndexedDB work, so they happen after the read transaction closes.
  const jobPhotos: BackupTablesValue['jobPhotos'] = [];
  for (const row of snapshot.jobPhotos) {
    const { blob, ...meta } = row;
    jobPhotos.push({ ...meta, data: bytesToBase64(new Uint8Array(await blob.arrayBuffer())) });
  }
  const { phone, ...rows } = snapshot;
  const readable = phone.state === 'readable';
  const tables: BackupTablesValue = { ...rows, jobPhotos, settings: readable ? [phone.salvaged.settings] : [] };
  const settingsInput: BackupSettingsInput = readable
    ? { state: 'readable', deviceRole: phone.salvaged.settings.deviceRole }
    : { state: 'unreadable', section: phone.guard.section };
  const createdAt = nowIso();
  const { file: backup, json } = await buildBackupFile({ tables, createdAt, appVersion: config.version, settings: settingsInput, photos });
  const filename = backupFilename();
  return {
    filename,
    json,
    file: new File([json], filename, { type: 'application/json' }),
    photos,
    createdAt,
    summary: summarizeBackup(backup, json.length, await loadPriceItems()),
    settingsRepaired: readable ? phone.salvaged.repaired : [],
    settings: phone.state,
    unreadableReasons: readable ? [] : [...phone.guard.section.reasons],
  };
}

/** The audit words for a backup that left the phone. Never the PIN or a setting value. */
function backupDetail(prepared: PreparedBackup, how: string): string {
  const unreadable = prepared.settings === 'unreadable' ? "; this phone's role and owner PIN could not be read, so the file holds no settings row" : '';
  return `${how} (photos ${prepared.photos}, ${prepared.summary.jobs} jobs${unreadable})`;
}

export type ShareOutcome =
  | { ok: true; path: 'share' | 'download' | 'clipboard'; note: string | null }
  | (Refusal<'canceled' | 'needsTap' | 'failed' | 'noShare' | 'needsTextBackup'> & { path: 'share' | 'download' | 'clipboard' });

/**
 * Hand the prepared backup to the share sheet. Call it directly from the button's tap handler.
 * asText shares the same JSON as a text/plain file (D12: if iOS offers no useful target for a
 * .json file); the import accepts both. On success "last backup" is recorded.
 */
export async function shareBackup(prepared: PreparedBackup, opts: { asText?: boolean } = {}): Promise<ShareOutcome> {
  const file =
    opts.asText === true
      ? new File([prepared.json], prepared.filename.replace(/\.json$/, '.txt'), { type: 'text/plain' })
      : prepared.file;

  if (canShareFiles([file])) {
    try {
      await navigator.share({ files: [file] });
    } catch (error) {
      const name = errorNameOf(error);
      if (name === 'AbortError') {
        return { ...refuse('canceled', 'The share sheet was closed, so no backup was saved. Try again, or copy the backup text.'), path: 'share' };
      }
      if (name === 'NotAllowedError') {
        return { ...refuse('needsTap', 'The phone wants a fresh tap. Tap Save backup again.'), path: 'share' };
      }
      return { ...refuse('failed', 'The share sheet did not open. Try again, or copy the backup text.'), path: 'share' };
    }
    await recordBackup(backupDetail(prepared, 'Backup shared through the share sheet'));
    return { ok: true, path: 'share', note: null };
  }

  if (isIos() && isStandalone()) {
    // A download from an installed iPhone app opens a sheet with no way back (D3).
    return {
      ...refuse('noShare', 'This phone cannot open the share sheet here. Use Copy backup text, then paste it into Notes or Files.'),
      path: 'download',
    };
  }

  try {
    const url = URL.createObjectURL(file);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = file.name;
    anchor.rel = 'noopener';
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  } catch {
    return { ...refuse('failed', 'The backup file could not be saved here. Copy the backup text instead.'), path: 'download' };
  }
  await recordBackup(backupDetail(prepared, 'Backup saved as a download'));
  return {
    ok: true,
    path: 'download',
    note: isIos()
      ? 'On iPhone, save backups from the installed Home Screen app: there the share sheet is the way, and a download link is broken.'
      : null,
  };
}

/**
 * "Copy backup text": the JSON without photos onto the clipboard (D12). Call from the tap with a
 * backup prepared with photos 'omitted'. Records "last backup" on success.
 */
export async function copyBackupText(prepared: PreparedBackup): Promise<ShareOutcome> {
  if (prepared.photos !== 'omitted') {
    return { ...refuse('needsTextBackup', 'Prepare the backup without photos for the text copy.'), path: 'clipboard' };
  }
  let copied = false;
  try {
    if (typeof navigator.clipboard?.writeText === 'function') {
      await navigator.clipboard.writeText(prepared.json);
      copied = true;
    }
  } catch {
    copied = false;
  }
  if (!copied) {
    return { ...refuse('failed', 'The phone did not allow copying. Tap Copy backup text again.'), path: 'clipboard' };
  }
  await recordBackup(backupDetail(prepared, 'Backup text copied'));
  return { ok: true, path: 'clipboard', note: 'Paste it into Notes or Files now. Photos are not in the text copy.' };
}

async function recordBackup(detail: string): Promise<void> {
  try {
    await markLastBackup(detail);
  } catch (error) {
    // The file already left the phone; failing to note it must not undo that. The reminder stays due.
    console.error('[backup] could not record the backup time', error);
  }
}

/**
 * Record a backup: lastBackupAt now and the weekly reminder on (Lando: the reminder turns on with
 * the PIN, and stays on). Writes an export audit entry in the same transaction, always: when this
 * phone's settings row cannot be read or written (DEF-08, DEF-13), the entry still lands and says
 * the time was not saved, and the result is null.
 */
export async function markLastBackup(detail = 'Backup saved'): Promise<SettingsValue | null> {
  return withDb((db) =>
    db.transaction('rw', db.settings, db.auditLog, async () => {
      let next: SettingsValue | null = null;
      try {
        const current = await readSettingsIn(db);
        next = await writeSettingsIn(db, { ...current, lastBackupAt: nowIso(), backupReminderWeekly: true });
      } catch (error) {
        if (!(error instanceof RecordInvalid)) throw error;
      }
      const words = next === null ? `${detail}. Last backup time not saved: this phone's settings could not be read.` : detail;
      await db.auditLog.add(auditEntry('export', words));
      return next;
    }),
  );
}

/** True when the weekly reminder should show: 7 days after the last backup, never in Customer View (D10, D12). */
export async function isBackupDue(): Promise<boolean> {
  try {
    const settings = await withDb((db) => db.transaction('rw', db.settings, () => readSettingsIn(db)));
    return backupReminderDue(settings, nowMs());
  } catch {
    return false;
  }
}
