/**
 * Typed errors and refusal results shared by every core module.
 *
 * StorageUnavailable: IndexedDB could not be opened or written (private mode, storage
 * blocked, phone full, another tab holding a newer version). The UI shows `message`.
 * RecordInvalid: a row failed its zod schema. On a write, nothing was saved. On a read
 * (reading: true), the stored row could not be used; `message` is then plain words for a person
 * and the schema detail stays in `issues` for the developer panel (DEF-08).
 * Refusal: a guard said no (no PIN, no owner pass, wrong role). Never thrown to the UI;
 * core functions return it as { ok: false, code, message }.
 */

export type StorageProblem = 'unavailable' | 'full' | 'blocked' | 'unknown';

const STORAGE_MESSAGES: Record<StorageProblem, string> = {
  unavailable:
    'This phone is not letting the app save data (private browsing or storage turned off). Fix It, Search, and Quick Cards still work. Open the app from the Home Screen icon to save.',
  full: 'The phone is out of space for app data. Nothing was half-saved. Save a backup, then free some space.',
  blocked: 'Another copy of the app is open with a newer version. Close the other tab or app window, then reload.',
  unknown: 'The app could not save just now. Nothing was half-saved. Try again; if it keeps happening, save a backup.',
};

export class StorageUnavailable extends Error {
  override readonly name = 'StorageUnavailable';
  readonly problem: StorageProblem;
  constructor(problem: StorageProblem, options?: { cause?: unknown }) {
    super(STORAGE_MESSAGES[problem], options);
    this.problem = problem;
  }
}

/** What a person reads when the stored settings row cannot be used (DEF-08). No schema text, no wrong advice. */
export const SETTINGS_UNREADABLE_MESSAGE =
  "This phone's saved settings could not be read, so nothing was changed. They may come from a newer version of the app. Your jobs are still on this phone: open Settings, Backup to save a backup or restore one.";

/*
 * The words for the Backup, Restore, and Hand over screens when settings cannot be read (DEF-13,
 * architect's exact text, 2026-10-11). The Backup screen uses these and never
 * SETTINGS_UNREADABLE_MESSAGE, which points at Backup (the Home notice keeps that one).
 */

/** A. The Backup screen, when this phone's role or PIN record cannot be read. */
export const BACKUP_SETTINGS_UNREADABLE_MESSAGE =
  "This phone's role and owner PIN could not be read, so the shop tools stay locked. Your jobs are still here: tap Save backup below to keep a copy of them now.";

/** B. The Backup screen, when making the backup fails for any other reason. Shown with a Try again button. */
export const BACKUP_NOT_MADE_MESSAGE =
  "The backup could not be made, and nothing on this phone was changed. Tap Try again; if it fails again, do not clear the app's data, because your jobs are still on this phone.";

/** C. The restore confirm, on a phone whose own settings are unreadable. */
export const RESTORE_HERE_UNREADABLE_MESSAGE =
  "This phone's role and owner PIN could not be read, so the PIN cannot be checked here. Save a backup of this phone first, then type replace to restore.";

/** D. The restore confirm, for a file made while its phone's settings were unreadable. */
export const RESTORE_FILE_UNREADABLE_MESSAGE =
  "This backup has every job, but its role and owner PIN could not be read. This phone keeps its own role and PIN, and its sign-offs come back marked needs re-check.";

/** D, when this phone's own settings are unreadable too (restorePlan 'fresh'): this phone has no role or PIN to keep. */
export const RESTORE_BOTH_UNREADABLE_MESSAGE =
  'This backup has every job, but its role and owner PIN could not be read. After the restore this phone is a study phone with no PIN, and its sign-offs come back marked needs re-check.';

/**
 * E. The Hand over result. The architect's text said "tap This is the shop phone"; on a new phone
 * with no PIN that button is off, and the way in is "Make this the shop phone from a backup" on
 * the Device role screen (the lead's brief), so the words name that.
 */
export const HAND_OVER_DONE_MESSAGE =
  'This phone is now a study phone. On the new phone, open Settings, Device role, and use Make this the shop phone from a backup with the file you just saved.';

/** A write refused by its schema, in plain words (the detail is a bug for the builders, not for the person). */
export const RECORD_NOT_SAVED_MESSAGE = 'The app could not save this, so nothing was saved. Try again; if it keeps happening, save a backup and tell Lando.';

export class RecordInvalid extends Error {
  override readonly name = 'RecordInvalid';
  readonly table: string;
  readonly issues: string[];
  /** True when a stored row failed on the way out of the database, not a new row on the way in. */
  readonly reading: boolean;
  constructor(table: string, issues: string[], options: { reading?: boolean } = {}) {
    const reading = options.reading === true;
    super(
      reading
        ? table === 'settings'
          ? SETTINGS_UNREADABLE_MESSAGE
          : `Some saved ${table} data could not be read, so nothing was changed. Save a backup, then tell Lando.`
        : `A ${table} record did not pass its checks, so nothing was saved: ${issues.slice(0, 3).join('; ')}`,
    );
    this.table = table;
    this.issues = issues;
    this.reading = reading;
  }
}

/** Plain words for any storage-side failure, for a refusal or a banner. Never schema text. */
export function plainStorageMessage(error: StorageUnavailable | RecordInvalid): string {
  if (error instanceof RecordInvalid) return error.reading ? error.message : RECORD_NOT_SAVED_MESSAGE;
  return error.message;
}

/** A guard refusal. Plain words in `message`; `code` for tests and branching. */
export interface Refusal<C extends string = string> {
  ok: false;
  code: C;
  message: string;
}

export function refuse<C extends string>(code: C, message: string): Refusal<C> {
  return { ok: false, code, message };
}

/**
 * Thrown inside a Dexie transaction to abort it with a refusal (so nothing is written),
 * then caught at the public function and returned as a Refusal.
 */
export class RefusedError<C extends string = string> extends Error {
  override readonly name = 'RefusedError';
  readonly refusal: Refusal<C>;
  constructor(refusal: Refusal<C>) {
    super(refusal.message);
    this.refusal = refusal;
  }
}

/** Error names IndexedDB and Dexie use for storage failures (DOMException names and Dexie error names). */
const QUOTA_NAMES = new Set(['QuotaExceededError']);
const BLOCKED_NAMES = new Set(['VersionError', 'VersionChangeError', 'BlockedError']);
const UNAVAILABLE_NAMES = new Set([
  'MissingAPIError',
  'OpenFailedError',
  'InvalidStateError',
  'DatabaseClosedError',
  'SecurityError',
  'NotFoundError',
]);
const OTHER_STORAGE_NAMES = new Set([
  'UnknownError',
  'AbortError',
  'TransactionInactiveError',
  'ReadOnlyError',
  'DataCloneError',
  'DataError',
  'ConstraintError',
  'InvalidAccessError',
  'NotReadableError',
  'TimeoutError',
  'PrematureCommitError',
  'BulkError',
  'ModifyError',
  'InternalError',
  'DexieError',
]);

function errorName(error: unknown): string {
  if (error !== null && typeof error === 'object' && 'name' in error && typeof error.name === 'string') return error.name;
  return '';
}

function innerError(error: unknown): unknown {
  if (error !== null && typeof error === 'object' && 'inner' in error) return error.inner;
  return undefined;
}

/** True when the error came from IndexedDB or Dexie rather than from app code. */
export function isStorageError(error: unknown): boolean {
  const name = errorName(error);
  return (
    QUOTA_NAMES.has(name) ||
    BLOCKED_NAMES.has(name) ||
    UNAVAILABLE_NAMES.has(name) ||
    OTHER_STORAGE_NAMES.has(name)
  );
}

/** Map an IndexedDB or Dexie failure to one StorageUnavailable. Other errors pass through unchanged. */
export function toStorageError(error: unknown): unknown {
  if (error instanceof StorageUnavailable || error instanceof RecordInvalid || error instanceof RefusedError) return error;
  if (!isStorageError(error)) return error;
  const names = [errorName(error), errorName(innerError(error))];
  if (names.some((n) => QUOTA_NAMES.has(n))) return new StorageUnavailable('full', { cause: error });
  if (names.some((n) => BLOCKED_NAMES.has(n))) return new StorageUnavailable('blocked', { cause: error });
  if (names.some((n) => UNAVAILABLE_NAMES.has(n))) return new StorageUnavailable('unavailable', { cause: error });
  return new StorageUnavailable('unknown', { cause: error });
}

/** A short "Name: message" for status readouts. Never includes stack traces or values. */
export function describeError(error: unknown): string {
  if (error instanceof Error) return `${error.name}: ${error.message}`.slice(0, 200);
  try {
    return String(error).slice(0, 200);
  } catch {
    return 'Unknown error';
  }
}
