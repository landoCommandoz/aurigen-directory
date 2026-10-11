/**
 * The owner PIN (D4). Six digits, stored only as a salted PBKDF2-HMAC-SHA-256 hash
 * (100,000 iterations, 16 random bytes of salt, base64 in settings.ownerPin). The plain PIN is
 * never stored, never logged, and never kept after the hash is made.
 *
 * The owner pass: a correct PIN opens a 5 minute pass held in memory only. It ends early when
 * the page is hidden (phone locked, app switched) and on every reload. Guarded writes call
 * ownerPassActive() inside their own transaction.
 *
 * Three wrong PINs in a row lock PIN entry for 30 seconds and write one audit entry. The count
 * and the lock survive a reload (DEF-05): both are saved per PIN in pinGuard.ts, and the lock is
 * also read back from its audit entry.
 *
 * Honest limit (D4): this keeps honest people honest. Anyone with developer tools can read the
 * database. Real access control is accounts and a server, Phase 8.
 */
import { OwnerPin, PinEntry, settingsOnPinCreated, type OwnerPinValue } from '../schemas';
import { base64ToBytes, bytesEqual, bytesToBase64 } from './base64';
import { monotonicMs, nowIso, nowMs } from './clock';
import { pbkdf2Sha256, randomBytes, sha256 } from './crypto';
import { auditEntry, readSettingsForRecoveryIn, readSettingsIn, storageRefusal, withDb, writeSettingsIn } from './db';
import { RefusedError, refuse, type Refusal } from './errors';
import { readPinGuard, writePinGuard, type PinGuardState } from './pinGuard';
import { createStore, useStore } from './store';

export const PIN_ITERATIONS = 100_000;
export const PIN_SALT_BYTES = 16;
export const OWNER_PASS_MS = 5 * 60 * 1000;
export const PIN_MAX_TRIES = 3;
export const PIN_LOCK_MS = 30 * 1000;
const LOCK_DETAIL = 'Three wrong PINs: PIN entry locked for 30 seconds';

/* ---------- Hashing ---------- */

/** Hash a PIN with a fresh salt (or the given one, to verify). Never returns or logs the PIN. */
export async function hashPin(pin: string, saltB64?: string, iterations: number = PIN_ITERATIONS): Promise<OwnerPinValue> {
  const salt = saltB64 === undefined ? randomBytes(PIN_SALT_BYTES) : base64ToBytes(saltB64);
  const hash = await pbkdf2Sha256(new TextEncoder().encode(pin), salt, iterations);
  return OwnerPin.parse({
    algorithm: 'PBKDF2-SHA-256',
    iterations,
    salt: bytesToBase64(salt),
    hash: bytesToBase64(hash),
    setAt: nowIso(),
  });
}

/** True when the PIN matches the stored hash. Supports the D4 fallback format (iterated salted SHA-256) for reading. */
export async function pinMatches(pin: string, stored: OwnerPinValue): Promise<boolean> {
  const salt = base64ToBytes(stored.salt);
  const expected = base64ToBytes(stored.hash);
  let actual: Uint8Array;
  if (stored.algorithm === 'PBKDF2-SHA-256') {
    actual = await pbkdf2Sha256(new TextEncoder().encode(pin), salt, stored.iterations);
  } else {
    const pinBytes = new TextEncoder().encode(pin);
    const first = new Uint8Array(salt.length + pinBytes.length);
    first.set(salt);
    first.set(pinBytes, salt.length);
    let h = await sha256(first);
    for (let i = 1; i < stored.iterations; i += 1) {
      const next = new Uint8Array(h.length + salt.length);
      next.set(h);
      next.set(salt, h.length);
      h = await sha256(next);
    }
    actual = h;
  }
  return bytesEqual(actual, expected);
}

/* ---------- Owner pass (memory only) ---------- */

export interface PinStatus {
  passActiveUntilMono: number | null;
  passIssuedAtIso: string | null;
  consecutiveFails: number;
  lockedUntilWall: number | null;
}

/** Live pass and lock state for the developer panel and PIN screens. */
export const pinStatus = createStore<PinStatus>({
  passActiveUntilMono: null,
  passIssuedAtIso: null,
  consecutiveFails: 0,
  lockedUntilWall: null,
});

export function usePinStatus(): PinStatus {
  return useStore(pinStatus);
}

let guardsInstalled = false;

function installPassGuards(): void {
  if (guardsInstalled || typeof document === 'undefined' || typeof window === 'undefined') return;
  guardsInstalled = true;
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') clearOwnerPass();
  });
  window.addEventListener('pagehide', () => clearOwnerPass());
}

function issueOwnerPass(): void {
  installPassGuards();
  pinStatus.update({ passActiveUntilMono: monotonicMs() + OWNER_PASS_MS, passIssuedAtIso: nowIso(), consecutiveFails: 0, lockedUntilWall: null });
}

/**
 * Core only: open the pass right after a transaction that wrote a PIN hash the person just
 * typed (Start fresh creates the PIN and the shop role in one write). Never call it elsewhere.
 */
export function grantPassForNewPin(): void {
  issueOwnerPass();
}

/** True while a correct PIN was entered in the last 5 minutes and the page has stayed visible. */
export function ownerPassActive(): boolean {
  const until = pinStatus.get().passActiveUntilMono;
  return until !== null && monotonicMs() < until;
}

/** When the current pass was issued, for SignOff.ownerVerifiedAt. Null when no pass is active. */
export function ownerPassIssuedAt(): string | null {
  return ownerPassActive() ? pinStatus.get().passIssuedAtIso : null;
}

/** Milliseconds left on the pass, 0 when none. */
export function ownerPassRemainingMs(): number {
  const until = pinStatus.get().passActiveUntilMono;
  return until === null ? 0 : Math.max(0, until - monotonicMs());
}

export function clearOwnerPass(): void {
  pinStatus.update({ passActiveUntilMono: null, passIssuedAtIso: null });
}

/* ---------- Lockout ---------- */

/** "27 seconds" or "1 second". */
function secondsWords(ms: number): string {
  const seconds = Math.max(1, Math.ceil(ms / 1000));
  return `${seconds} ${seconds === 1 ? 'second' : 'seconds'}`;
}

/** The countdown line on a locked PIN pad, in plain words. */
export function lockCountdownWords(ms: number): string {
  return `Locked after three wrong PINs. Try again in ${secondsWords(ms)}.`;
}

/**
 * Locked until this wall-clock time: from memory, from the saved lock for this PIN (pinGuard.ts),
 * or from the last lock audit entry. All three survive what they can: memory a screen change, the
 * saved lock and the audit entry a reload. A clock moved back past the lock start does not extend it.
 */
async function lockedUntil(saved: PinGuardState): Promise<number | null> {
  const now = nowMs();
  const memory = pinStatus.get().lockedUntilWall;
  if (memory !== null && now < memory) return memory;
  if (memory !== null) pinStatus.update({ lockedUntilWall: null });
  if (saved.lockedAt !== null && now >= saved.lockedAt && now < saved.lockedAt + PIN_LOCK_MS) {
    const until = saved.lockedAt + PIN_LOCK_MS;
    pinStatus.update({ lockedUntilWall: until });
    return until;
  }
  try {
    const last = await withDb((db) => db.auditLog.where('type').equals('pinFail').reverse().sortBy('at'));
    const lock = last.find((entry) => entry.detail === LOCK_DETAIL);
    if (lock === undefined) return null;
    const at = Date.parse(lock.at);
    const until = at + PIN_LOCK_MS;
    // A clock moved back past the lock stamp does not extend it.
    if (Number.isNaN(at) || nowMs() < at || nowMs() >= until) return null;
    pinStatus.update({ lockedUntilWall: until });
    return until;
  } catch {
    return null;
  }
}

/* ---------- Public API ---------- */

export type VerifyResult =
  | { ok: true }
  | Refusal<'invalid' | 'noPin' | 'locked' | 'wrong' | 'storage'> & { triesLeft?: number; lockedForMs?: number };

/**
 * True when this phone has an owner PIN. False when storage is unavailable. Reads through the
 * recovery read (DEF-08): a damaged settings field elsewhere never hides the PIN.
 */
export async function hasPin(): Promise<boolean> {
  try {
    return await withDb(async (db) => (await readSettingsForRecoveryIn(db)).settings.ownerPin !== null);
  } catch {
    return false;
  }
}

/**
 * Check a typed PIN. A correct PIN opens the 5 minute owner pass. Each wrong PIN returns a
 * different message (tries left), so the PIN pad shakes every time; the third locks entry.
 */
export async function verifyPin(pin: string): Promise<VerifyResult> {
  if (!PinEntry.safeParse(pin).success) return refuse('invalid', 'The PIN is 6 digits.');
  // The recovery read (DEF-08): the PIN can be checked, and the owner pass opened for a Restore,
  // even when another settings field is damaged. The PIN field itself is never guessed.
  let settings;
  try {
    settings = (await withDb((db) => db.transaction('r', db.settings, () => readSettingsForRecoveryIn(db)))).settings;
  } catch (error) {
    return storageRefusal(error);
  }
  if (settings.ownerPin === null) return refuse('noPin', 'No owner PIN is set on this phone yet. Set it from the setup banner.');
  const salt = settings.ownerPin.salt;
  const saved = readPinGuard(salt);
  const until = await lockedUntil(saved);
  if (until !== null) {
    return { ...refuse('locked', `Too many wrong PINs. Try again in ${secondsWords(until - nowMs())}.`), lockedForMs: until - nowMs() };
  }
  if (await pinMatches(pin, settings.ownerPin)) {
    issueOwnerPass();
    writePinGuard(salt, { fails: 0, lockedAt: null });
    return { ok: true };
  }
  // The count survives a reload (DEF-05): the saved count for this PIN, or this session's if storage is blocked.
  const fails = Math.max(saved.fails, pinStatus.get().consecutiveFails) + 1;
  if (fails >= PIN_MAX_TRIES) {
    const lockedAt = nowMs();
    pinStatus.update({ consecutiveFails: 0, lockedUntilWall: lockedAt + PIN_LOCK_MS });
    writePinGuard(salt, { fails: 0, lockedAt });
    clearOwnerPass();
    await withDb((db) => db.auditLog.add(auditEntry('pinFail', LOCK_DETAIL))).catch(() => undefined);
    return { ...refuse('locked', 'Three wrong PINs. PIN entry is locked for 30 seconds.'), lockedForMs: PIN_LOCK_MS };
  }
  pinStatus.update({ consecutiveFails: fails });
  writePinGuard(salt, { fails, lockedAt: null });
  const left = PIN_MAX_TRIES - fails;
  return { ...refuse('wrong', `Wrong PIN. ${left} ${left === 1 ? 'try' : 'tries'} left.`), triesLeft: left };
}

/**
 * Milliseconds left on the PIN lock, 0 when entry is open. Read the same way verifyPin reads it,
 * so a PIN screen opened after a reload shows the countdown at once. Never throws.
 */
export async function pinLockRemainingMs(): Promise<number> {
  try {
    const settings = (await withDb((db) => db.transaction('r', db.settings, () => readSettingsForRecoveryIn(db)))).settings;
    const saved: PinGuardState = settings.ownerPin === null ? { fails: 0, lockedAt: null } : readPinGuard(settings.ownerPin.salt);
    const until = await lockedUntil(saved);
    return until === null ? 0 : Math.max(0, until - nowMs());
  } catch {
    return 0;
  }
}

export type SetPinResult = { ok: true; firstPin: boolean } | Refusal<'invalid' | 'noOwnerPass' | 'storage'>;

/**
 * Create the owner PIN, or change it (changing needs the owner pass). Creating it turns on the
 * weekly backup reminder in the same write (D12, settingsOnPinCreated); the caller opens the
 * "Save your first backup" screen next. A new PIN opens the owner pass.
 */
export async function setPin(pin: string): Promise<SetPinResult> {
  if (!PinEntry.safeParse(pin).success) return refuse('invalid', 'The PIN is 6 digits.');
  // Hash before the transaction: an IndexedDB transaction closes while awaiting crypto.
  const hashed = await hashPin(pin);
  try {
    const firstPin = await withDb((db) =>
      db.transaction('rw', db.settings, db.auditLog, async () => {
        const current = await readSettingsIn(db);
        const first = current.ownerPin === null;
        if (!first && !ownerPassActive()) {
          throw new RefusedError(refuse('noOwnerPass', 'Enter the current owner PIN before setting a new one.'));
        }
        await writeSettingsIn(db, { ...current, ...settingsOnPinCreated(hashed) });
        await db.auditLog.add(auditEntry('pinSet', first ? 'Owner PIN created; weekly backup reminder on' : 'Owner PIN changed'));
        return first;
      }),
    );
    issueOwnerPass();
    return { ok: true, firstPin };
  } catch (error) {
    if (error instanceof RefusedError) return error.refusal as Refusal<'noOwnerPass'>;
    return storageRefusal(error);
  }
}

export type ResetPinResult = { ok: true; signOffsMarked: number } | Refusal<'invalid' | 'backupNotOffered' | 'storage'>;

/**
 * "Forgot PIN" (D4): the screen first offers a backup export (backupOffered: true), then this
 * sets a new PIN, writes a pinReset audit entry, and marks every sign-off on this phone
 * "needs re-check" until the owner confirms each one with the new PIN.
 */
export async function resetPin(newPin: string, opts: { backupOffered: boolean }): Promise<ResetPinResult> {
  if (!opts.backupOffered) return refuse('backupNotOffered', 'Save a backup first, then reset the PIN.');
  if (!PinEntry.safeParse(newPin).success) return refuse('invalid', 'The PIN is 6 digits.');
  const hashed = await hashPin(newPin);
  let marked: number;
  try {
    marked = await withDb((db) =>
    db.transaction('rw', db.settings, db.auditLog, db.signOffs, async () => {
      const current = await readSettingsIn(db);
      await writeSettingsIn(db, { ...current, ...settingsOnPinCreated(hashed) });
      const count = await db.signOffs.toCollection().modify({ needsRecheck: true });
      await db.auditLog.add(auditEntry('pinReset', `PIN reset; ${count} sign-off records marked needs re-check`));
      return count;
    }),
    );
  } catch (error) {
    return storageRefusal(error);
  }
  issueOwnerPass();
  return { ok: true, signOffsMarked: marked };
}

/** Tests only: forget the pass, the fail count, and the lock. */
export function __resetPinStateForTests(): void {
  pinStatus.set({ passActiveUntilMono: null, passIssuedAtIso: null, consecutiveFails: 0, lockedUntilWall: null });
}
