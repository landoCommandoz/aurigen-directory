/**
 * Reading the stored settings row (DEF-08). Pure: no database here; db.ts and settingsStore.ts
 * call these on the row IndexedDB returns.
 *
 * Read leniently, write strictly. D5 allows a rollback to an older version, and a newer version
 * may have added a field to the row. Strict reads made one such field block every settings read,
 * and with it the backup, Restore, and the setup steps. So:
 *
 * 1. parseStoredSettings(row), every ordinary read: top-level keys this version does not know are
 *    dropped and reported, then the full strict schema runs (types, ranges, and both cross-field
 *    rules). Writes stay strict (db.ts writeSettingsIn), so a dropped key is not written back.
 *    The newer version reads its own field's default if the phone goes forward again.
 * 2. salvageStoredSettings(row, now), the recovery paths only (making a backup, the guard read
 *    inside Restore, the PIN check): a field that fails its check is reset to its default and
 *    named in `repaired`, so the jobs can always leave the phone and a damaged row can always be
 *    replaced. The two guard fields are never guessed: if deviceRole or ownerPin cannot be read,
 *    the salvage refuses (RecordInvalid), because a guessed role or a dropped PIN would open a gate.
 *
 * Nested objects are not loosened: an ownerPin with an unknown key is refused, never trimmed.
 */
import { SETTINGS_ID, Settings, type SettingsValue } from '../schemas';
import { RecordInvalid } from './errors';

type FieldSchema = { safeParse: (value: unknown) => { success: boolean } };

const FIELDS = Settings.shape as unknown as Record<string, FieldSchema>;

/** Every top-level settings field this version knows. */
export const SETTINGS_FIELDS: readonly string[] = Object.keys(FIELDS);

/** Never reset to a default by the salvage: a guess here would change who may do what. */
export const GUARD_FIELDS: readonly string[] = ['deviceRole', 'ownerPin'];

export interface StoredSettings {
  settings: SettingsValue;
  /** Top-level keys in the stored row that this version does not know (dropped, not an error). */
  ignored: string[];
}

export interface SalvagedSettings extends StoredSettings {
  /** Fields that failed their check and were reset to their defaults for this read. */
  repaired: string[];
}

function asRecord(row: unknown): Record<string, unknown> {
  if (row === null || typeof row !== 'object' || Array.isArray(row)) {
    throw new RecordInvalid('settings', ['(row): not a settings record'], { reading: true });
  }
  return row as Record<string, unknown>;
}

function issuesOf(error: { issues: ReadonlyArray<{ path: ReadonlyArray<PropertyKey>; message: string }> }): string[] {
  return error.issues.map((i) => `${i.path.map(String).join('.') || '(row)'}: ${i.message}`);
}

/** Split a stored row into the fields this version knows and the keys it does not. */
function splitKnown(raw: Record<string, unknown>): { known: Record<string, unknown>; ignored: string[] } {
  const known: Record<string, unknown> = {};
  const ignored: string[] = [];
  for (const key of Object.keys(raw)) {
    if (Object.hasOwn(FIELDS, key)) known[key] = raw[key];
    else ignored.push(key);
  }
  return { known, ignored };
}

/** Ordinary read: unknown top-level keys dropped and reported, everything else checked strictly. */
export function parseStoredSettings(row: unknown): StoredSettings {
  const { known, ignored } = splitKnown(asRecord(row));
  const parsed = Settings.safeParse(known);
  if (!parsed.success) throw new RecordInvalid('settings', issuesOf(parsed.error), { reading: true });
  return { settings: parsed.data, ignored };
}

/**
 * Recovery read. Same as parseStoredSettings when the row passes; otherwise each failing field is
 * reset to its default (named in `repaired`), except the guard fields, which refuse.
 */
export function salvageStoredSettings(row: unknown, nowIso: string): SalvagedSettings {
  const raw = asRecord(row);
  const { known, ignored } = splitKnown(raw);
  const strict = Settings.safeParse(known);
  if (strict.success) return { settings: strict.data, ignored, repaired: [] };

  const next: Record<string, unknown> = {};
  const repaired: string[] = [];
  const unreadableGuards: string[] = [];
  for (const key of SETTINGS_FIELDS) {
    const schema = FIELDS[key];
    const value = known[key];
    if (schema === undefined || schema.safeParse(value).success) {
      if (value !== undefined) next[key] = value;
      continue;
    }
    if (GUARD_FIELDS.includes(key)) {
      unreadableGuards.push(key);
      continue;
    }
    repaired.push(key);
    // Fields with no default get a fixed value; the rest are left out so their default applies.
    if (key === 'id') next[key] = SETTINGS_ID;
    else if (key === 'createdAt' || key === 'updatedAt') next[key] = nowIso;
  }
  if (unreadableGuards.length > 0) {
    throw new RecordInvalid('settings', unreadableGuards.map((key) => `${key}: cannot be read, and is never guessed`), { reading: true });
  }
  // The Focus reminder mark only exists while Customer View is on (the schema's own rule).
  if (next.customerViewOn !== true && next.focusReminderShown === true) {
    delete next.focusReminderShown;
    repaired.push('focusReminderShown');
  }
  const salvaged = Settings.safeParse(next);
  if (!salvaged.success) throw new RecordInvalid('settings', issuesOf(salvaged.error), { reading: true });
  return { settings: salvaged.data, ignored, repaired };
}
