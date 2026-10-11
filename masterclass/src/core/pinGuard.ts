/**
 * The wrong-PIN count and the lock time, kept across reloads (DEF-05; D4: three wrong PINs in a
 * row lock PIN entry for 30 seconds). The settings schema has no field for them, and the audit
 * log holds exactly one pinFail entry per lock (BLUEPRINT 3.8), so they live in localStorage,
 * tied to the current PIN's salt: a new or changed PIN starts again at zero. The salt is not a
 * secret (it sits next to the hash in the settings row); the PIN itself is never stored here.
 *
 * Every access is wrapped. With storage blocked (private browsing), the count lasts for the
 * session in memory (pin.ts) and the lock is still read back from its audit entry in IndexedDB.
 * Honest limit (D4): anyone who clears site data or edits storage can reset it.
 */
export const PIN_GUARD_KEY = 'masterclass.pinGuard';

export interface PinGuardState {
  /** Wrong PINs in a row since the last correct PIN, lock, or new PIN. */
  fails: number;
  /** Wall-clock milliseconds when the last lock started, or null. */
  lockedAt: number | null;
}

const EMPTY: PinGuardState = { fails: 0, lockedAt: null };

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/** The saved state for this PIN (by its salt). Anything missing, damaged, or for another PIN reads as zero. */
export function readPinGuard(salt: string): PinGuardState {
  try {
    const raw = window.localStorage.getItem(PIN_GUARD_KEY);
    if (raw === null) return EMPTY;
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || parsed.salt !== salt) return EMPTY;
    const fails = typeof parsed.fails === 'number' && Number.isInteger(parsed.fails) && parsed.fails >= 0 && parsed.fails < 1000 ? parsed.fails : 0;
    const lockedAt = typeof parsed.lockedAt === 'number' && Number.isFinite(parsed.lockedAt) ? parsed.lockedAt : null;
    return { fails, lockedAt };
  } catch {
    return EMPTY;
  }
}

/** Save the state for this PIN. A blocked write is ignored: memory carries the session. */
export function writePinGuard(salt: string, state: PinGuardState): void {
  try {
    window.localStorage.setItem(PIN_GUARD_KEY, JSON.stringify({ salt, fails: state.fails, lockedAt: state.lockedAt }));
  } catch {
    // Storage blocked: the count lasts until the page reloads.
  }
}
