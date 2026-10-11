/**
 * The device database (BLUEPRINT section 6): Dexie over IndexedDB, name "masterclass", version 1.
 * Every table comes from TABLE_NAMES in src/schemas; every write is validated with TABLE_SCHEMAS
 * first, so a half-formed row never lands. Every open and every call goes through withDb(),
 * which turns any IndexedDB failure (private mode, storage denied, phone full, a newer version
 * open elsewhere) into one StorageUnavailable the UI can show. Nothing here throws an unhandled
 * rejection: callers await withDb() and catch.
 */
import Dexie, { type EntityTable } from 'dexie';
import {
  SETTINGS_ID,
  Settings,
  TABLE_NAMES,
  TABLE_SCHEMAS,
  defaultSettings,
  type AnyJobValue,
  type AuditLogValue,
  type CrewMemberValue,
  type DrillLogValue,
  type FlashcardStateValue,
  type JobPhotoValue,
  type PanelReadingValue,
  type QuizAttemptValue,
  type SettingsValue,
  type SignOffValue,
  type SkillStateValue,
  type StageTimingValue,
  type TableName,
} from '../schemas';
import type * as z from 'zod';
import { newId, nowIso } from './clock';
import { RecordInvalid, StorageUnavailable, describeError, plainStorageMessage, refuse, toStorageError, type Refusal } from './errors';
import { parseStoredSettings, salvageStoredSettings, type SalvagedSettings } from './settingsRead';
import { createStore, useStore } from './store';

export const DB_NAME = 'masterclass';
export const DB_VERSION = 1;

/** The row type each table holds, straight from the schemas. */
export type RowOf<T extends TableName> = z.output<(typeof TABLE_SCHEMAS)[T]>;

type IssueValue = RowOf<'issues'>;
type DebriefValue = RowOf<'debriefs'>;
type FieldNoteValue = RowOf<'fieldNotes'>;

export type MasterclassDb = Dexie & {
  jobs: EntityTable<AnyJobValue, 'id'>;
  stageTimings: EntityTable<StageTimingValue, 'id'>;
  panelReadings: EntityTable<PanelReadingValue, 'id'>;
  jobPhotos: EntityTable<JobPhotoValue, 'id'>;
  issues: EntityTable<IssueValue, 'id'>;
  debriefs: EntityTable<DebriefValue, 'id'>;
  fieldNotes: EntityTable<FieldNoteValue, 'id'>;
  crewMembers: EntityTable<CrewMemberValue, 'id'>;
  skillStates: EntityTable<SkillStateValue, 'id'>;
  signOffs: EntityTable<SignOffValue, 'id'>;
  quizAttempts: EntityTable<QuizAttemptValue, 'id'>;
  drillLogs: EntityTable<DrillLogValue, 'id'>;
  flashcardStates: EntityTable<FlashcardStateValue, 'id'>;
  settings: EntityTable<SettingsValue, 'id'>;
  auditLog: EntityTable<AuditLogValue, 'id'>;
};

/**
 * Primary key first ("id" everywhere; skillStates and flashcardStates use the
 * "<crewId>:<itemId>" compound string as their id), then the fields the blueprint queries.
 * Booleans and nulls are not valid IndexedDB keys, so flags such as `active` are filtered,
 * never indexed. Changing this object needs DB_VERSION + 1 and a Dexie upgrade.
 */
export const TABLE_INDEXES = {
  jobs: 'id, state, createdAt, updatedAt',
  stageTimings: 'id, jobId, [jobId+stageId], stageId, runByCrewId',
  panelReadings: 'id, jobId, [jobId+panelId]',
  jobPhotos: 'id, jobId, [jobId+kind]',
  issues: 'id, jobId, fixNodeId, at',
  debriefs: 'id, jobId, at',
  fieldNotes: 'id, status, jobId, at',
  crewMembers: 'id, role, name',
  skillStates: 'id, crewId, skillId, state',
  signOffs: 'id, crewId, skillId, [crewId+skillId], at',
  quizAttempts: 'id, crewId, quizId, [crewId+quizId], at',
  drillLogs: 'id, crewId, drillId, [crewId+drillId], at',
  flashcardStates: 'id, crewId, cardId, due, [crewId+due]',
  settings: 'id',
  auditLog: 'id, type, at, jobId, crewId',
} as const satisfies Record<TableName, string>;

/* ---------- Status for the developer panel and the storage banner ---------- */

export interface DbStatus {
  state: 'idle' | 'open' | 'unavailable';
  problem: StorageUnavailable['problem'] | null;
  message: string | null;
  /** Set when another tab opened a newer version and this connection closed itself. */
  versionChangedElsewhere: boolean;
  /** Top-level fields in the stored settings row this version does not know (a newer version wrote them; DEF-08). */
  ignoredSettingsFields: string[];
}

const IDLE_STATUS: DbStatus = { state: 'idle', problem: null, message: null, versionChangedElsewhere: false, ignoredSettingsFields: [] };

export const dbStatus = createStore<DbStatus>({ ...IDLE_STATUS });

export function useDbStatus(): DbStatus {
  return useStore(dbStatus);
}

/* ---------- The singleton ---------- */

let instance: MasterclassDb | null = null;

function createDb(): MasterclassDb {
  const db = new Dexie(DB_NAME) as MasterclassDb;
  db.version(DB_VERSION).stores(TABLE_INDEXES);
  db.on('versionchange', () => {
    // A newer version of the app wants to upgrade the database in another tab. Close so it is
    // not blocked; this tab says so and reloads at the next quiet moment (pwa.ts).
    db.close();
    dbStatus.update({ versionChangedElsewhere: true });
    return false;
  });
  return db;
}

/** The database object. Creating it never throws; opening happens inside withDb(). */
export function getDb(): MasterclassDb {
  instance ??= createDb();
  return instance;
}

/**
 * Run database work. Opens on first use; maps every IndexedDB or Dexie failure to one
 * StorageUnavailable and records it for the developer panel. RecordInvalid and refusals pass through.
 */
export async function withDb<T>(work: (db: MasterclassDb) => Promise<T>): Promise<T> {
  const db = getDb();
  try {
    if (!db.isOpen()) await db.open();
    const result = await work(db);
    if (dbStatus.get().state !== 'open') dbStatus.update({ state: 'open', problem: null, message: null });
    return result;
  } catch (error) {
    const mapped = toStorageError(error);
    if (mapped instanceof StorageUnavailable) {
      dbStatus.update({ state: 'unavailable', problem: mapped.problem, message: mapped.message });
    }
    throw mapped;
  }
}

/** Open the database at boot and report the result instead of throwing. */
export async function openDb(): Promise<{ ok: true } | { ok: false; error: StorageUnavailable | Error }> {
  try {
    await withDb(async () => undefined);
    return { ok: true };
  } catch (error) {
    if (error instanceof StorageUnavailable) return { ok: false, error };
    return { ok: false, error: error instanceof Error ? error : new Error(describeError(error)) };
  }
}

/* ---------- Validation ---------- */

/** Parse a row with its table's schema. Throws RecordInvalid naming every issue. */
export function validRow<T extends TableName>(table: T, row: unknown): RowOf<T> {
  const schema = TABLE_SCHEMAS[table] as unknown as z.ZodType<RowOf<T>>;
  const parsed = schema.safeParse(row);
  if (!parsed.success) {
    throw new RecordInvalid(
      table,
      parsed.error.issues.map((i) => `${i.path.map(String).join('.') || '(row)'}: ${i.message}`),
    );
  }
  return parsed.data;
}

/** A new audit entry, validated. Write it in the same transaction as the change it records. */
export function auditEntry(
  type: AuditLogValue['type'],
  detail: string,
  refs: { crewId?: string | null; jobId?: string | null } = {},
): AuditLogValue {
  const at = nowIso();
  return validRow('auditLog', {
    id: newId(),
    createdAt: at,
    updatedAt: at,
    type,
    detail,
    crewId: refs.crewId ?? null,
    jobId: refs.jobId ?? null,
    at,
  });
}

/* ---------- Settings: one row, id "device" ---------- */

function noteIgnoredSettingsFields(ignored: string[]): void {
  const current = dbStatus.get().ignoredSettingsFields;
  if (current.length === ignored.length && current.every((key, i) => key === ignored[i])) return;
  dbStatus.update({ ignoredSettingsFields: ignored });
}

/**
 * Every settings read: keys this version does not know are dropped (and shown in the developer
 * panel), the rest is checked strictly (settingsRead.ts, DEF-08). Throws RecordInvalid (reading).
 */
export function parseSettingsRow(row: unknown): SettingsValue {
  const { settings, ignored } = parseStoredSettings(row);
  noteIgnoredSettingsFields(ignored);
  return settings;
}

/** Writes stay strict: a row that breaks the schema never lands. */
function strictSettingsRow(row: unknown): SettingsValue {
  const parsed = Settings.safeParse(row);
  if (!parsed.success) {
    throw new RecordInvalid('settings', parsed.error.issues.map((i) => `${i.path.map(String).join('.')}: ${i.message}`));
  }
  return parsed.data;
}

/** Read the settings row inside an open transaction or plain call; creates the default row on first run. */
export async function readSettingsIn(db: MasterclassDb): Promise<SettingsValue> {
  const row = await db.settings.get(SETTINGS_ID);
  if (row !== undefined) return parseSettingsRow(row);
  const fresh = defaultSettings(nowIso());
  await db.settings.put(fresh);
  return fresh;
}

/** Read the settings row without writing (safe inside a read-only transaction); defaults in memory if absent. */
export async function readSettingsRowIn(db: MasterclassDb): Promise<SettingsValue> {
  const row = await db.settings.get(SETTINGS_ID);
  return row === undefined ? defaultSettings(nowIso()) : parseSettingsRow(row);
}

/**
 * The recovery read, for making a backup, the guard read inside Restore, and the PIN check only
 * (DEF-08): a damaged field is reset to its default and named in `repaired`; the role and the PIN
 * are never guessed (RecordInvalid). Writes nothing; defaults in memory if the row is absent.
 */
export async function readSettingsForRecoveryIn(db: MasterclassDb): Promise<SalvagedSettings> {
  const row: unknown = await db.settings.get(SETTINGS_ID);
  if (row === undefined) return { settings: defaultSettings(nowIso()), ignored: [], repaired: [] };
  const salvaged = salvageStoredSettings(row, nowIso());
  noteIgnoredSettingsFields(salvaged.ignored);
  return salvaged;
}

/** Validate and write the whole settings row, stamping updatedAt. Use inside a transaction. */
export async function writeSettingsIn(db: MasterclassDb, next: SettingsValue): Promise<SettingsValue> {
  const row = strictSettingsRow({ ...next, updatedAt: nowIso() });
  await db.settings.put(row);
  return row;
}

/**
 * The single settings row. A brand-new install gets defaultSettings: study phone, role not
 * chosen, no PIN, left-handed, weekly reminder off (D12). Throws StorageUnavailable when the
 * phone will not let the app use storage; use readSettingsOrDefault() at boot.
 */
export async function getSettings(): Promise<SettingsValue> {
  return withDb((db) => db.transaction('rw', db.settings, () => readSettingsIn(db)));
}

/** Settings for boot: the stored row, or the defaults in memory (saved: false) when storage is unavailable. */
export async function readSettingsOrDefault(): Promise<
  { saved: true; settings: SettingsValue } | { saved: false; settings: SettingsValue; error: StorageUnavailable | RecordInvalid }
> {
  try {
    return { saved: true, settings: await getSettings() };
  } catch (error) {
    if (error instanceof StorageUnavailable || error instanceof RecordInvalid) {
      return { saved: false, settings: defaultSettings(nowIso()), error };
    }
    throw error;
  }
}

/**
 * Plain preferences anyone on the phone may change. Guarded fields (PIN, role, cars seed,
 * developer toggle, photo cap, Customer View, backup dates) have their own functions.
 */
export const OPEN_SETTINGS = ['readAloud', 'voiceURI', 'voiceLang', 'wakeLock', 'handedness', 'activeCrewId', 'appVersionSeen'] as const;
export type OpenSettingsPatch = Partial<Pick<SettingsValue, (typeof OPEN_SETTINGS)[number]>>;

export async function updateSettings(patch: OpenSettingsPatch): Promise<SettingsValue> {
  const keys = Object.keys(patch);
  const guarded = keys.filter((k) => !(OPEN_SETTINGS as readonly string[]).includes(k));
  if (guarded.length > 0) {
    throw new RecordInvalid('settings', [`${guarded.join(', ')}: changed only through its own guarded function`]);
  }
  return withDb((db) =>
    db.transaction('rw', db.settings, async () => {
      const current = await readSettingsIn(db);
      return writeSettingsIn(db, { ...current, ...patch });
    }),
  );
}

/**
 * For action functions (PIN, role, import): a storage failure, or a settings row that cannot be
 * read or written (RecordInvalid), becomes a plain refusal the screen shows, so a tap never ends
 * in an unhandled rejection (DEF-08). Anything else is a bug and is rethrown.
 */
export function storageRefusal(error: unknown): Refusal<'storage'> {
  const mapped = toStorageError(error);
  if (mapped instanceof StorageUnavailable || mapped instanceof RecordInvalid) return refuse('storage', plainStorageMessage(mapped));
  throw mapped;
}

/** Every table name, for whole-database reads and writes (backup, restore, tests). */
export const ALL_TABLES: readonly TableName[] = TABLE_NAMES;

/** Tests only: close and delete the database so each test starts empty. */
export async function __resetDbForTests(): Promise<void> {
  if (instance !== null) {
    instance.close();
    await Dexie.delete(DB_NAME);
    instance = null;
  } else {
    await Dexie.delete(DB_NAME);
  }
  dbStatus.set({ ...IDLE_STATUS });
}
