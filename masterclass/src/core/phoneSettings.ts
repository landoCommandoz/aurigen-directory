/**
 * This phone's own settings row, read the DEF-13 way (src/schemas/backup-recovery.ts, D12
 * amendment). Used by the backup, the restore, and the restore preview, never by ordinary reads.
 *
 * 1. backupSettingsState(row): can the two guard fields (deviceRole, ownerPin) be read, and does
 *    a shop role carry a PIN? If not, the row is "unreadable" and its section (reason codes and
 *    the raw row as text) is what a backup carries instead of a settings row.
 * 2. If the guard fields read, the DEF-08 salvage (settingsRead.ts) gives the row with any damaged
 *    ordinary field at its default. If even that fails, the row counts as unreadable with the
 *    reason otherFieldUnreadable.
 *
 * Never throws for the row itself: an unreadable row is a state the caller acts on. A storage
 * failure still throws (StorageUnavailable), as everywhere else.
 */
import { SETTINGS_ID, backupSettingsState, settingsUnreadableSection, type BackupSettingsState } from '../schemas';
import { salvageSettingsRow, type MasterclassDb } from './db';
import { RecordInvalid } from './errors';
import type { SalvagedSettings } from './settingsRead';

export type ReadableGuard = Extract<BackupSettingsState, { state: 'readable' }>;
export type UnreadableGuard = Extract<BackupSettingsState, { state: 'unreadable' }>;

export type ThisPhoneSettings =
  | { state: 'readable'; guard: ReadableGuard; salvaged: SalvagedSettings }
  | { state: 'unreadable'; guard: UnreadableGuard };

/** Pure apart from the clock: classify one stored row (undefined means no row yet). */
export function thisPhoneSettingsFromRow(row: unknown): ThisPhoneSettings {
  const guard = backupSettingsState(row);
  if (guard.state === 'unreadable') return { state: 'unreadable', guard };
  try {
    return { state: 'readable', guard, salvaged: salvageSettingsRow(row) };
  } catch (error) {
    if (!(error instanceof RecordInvalid)) throw error;
    return { state: 'unreadable', guard: { state: 'unreadable', section: settingsUnreadableSection(row, ['otherFieldUnreadable']) } };
  }
}

/** Read and classify this phone's row inside an open transaction (read-only is enough). */
export async function readThisPhoneSettingsIn(db: MasterclassDb): Promise<ThisPhoneSettings> {
  const row: unknown = await db.settings.get(SETTINGS_ID);
  return thisPhoneSettingsFromRow(row);
}
