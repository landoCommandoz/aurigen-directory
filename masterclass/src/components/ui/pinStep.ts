/**
 * The step between two PIN entries (QA DEF-15). A new PIN is typed twice, and a PIN that did not
 * match is typed again, on a pad that stays where it was: the next pad replaces the last one in
 * place, so its keys sit exactly where the thumb has been working all along. Nothing new appeared
 * under the thumb, so a stepped pad does not hold for TAP_GUARD_MS the way a pad that has just
 * opened does (that hold cut into a steady typing rhythm and dropped the first confirmation digits).
 *
 * The one stray tap that can reach a stepped pad is the second tap of a double tap on the key that
 * finished the entry. That tap is dropped: on the same key, or on whatever key now covers the spot
 * where it landed, for a moment sized to the person's own pace (stepHoldFor). Every other tap, and
 * every hardware key, counts at once, at any pace. A pad that stays mounted between entries
 * (PinGate after a wrong PIN) is not a step and has no such rule: it is disabled while the PIN is
 * checked, and a fast retry counts from its first digit.
 *
 * Which pad is a step: one that mounts in the same task as the finish. NewPinEntry swaps its pad
 * with key={phase} inside onComplete, and React commits a tap's update before the next task starts.
 * A pad that mounts later, after a PIN check or on a new screen, is a new arrival and holds for the
 * full TAP_GUARD_MS as before.
 *
 * Tap times are the events' own timestamps (when the finger landed), not when the handler ran, so a
 * busy phone that handles two taps late and close together never makes a real gap look short.
 */
import { TAP_GUARD_MS } from './useTapGuard';

/** The longest the doubled last key is dropped: well past a 40 ms double tap. */
export const STEP_GUARD_MS = 150;
/** The shortest: a double tap is always quicker than this, whatever the pace. */
export const STEP_GUARD_MIN_MS = 80;
/** A same-key tap quicker than this share of the person's usual gap is a double tap, not typing. */
const PACE_SHARE = 0.6;

/**
 * How long a stepped pad drops a tap on the finishing key, from the gaps between the taps of the
 * entry just finished: 60% of the middle gap, between STEP_GUARD_MIN_MS and STEP_GUARD_MS. At a
 * steady 250 ms or slower it is 150 ms; at 200 ms it is 120 ms; at 130 ms or faster it is 80 ms. So a
 * PIN that starts with its own last digit confirms at any steady pace, and a double tap never counts.
 */
export function stepHoldFor(gaps: readonly number[]): number {
  const clean = gaps.filter((gap) => Number.isFinite(gap) && gap >= 0).sort((a, b) => a - b);
  if (clean.length === 0) return STEP_GUARD_MS;
  const middle = Math.floor(clean.length / 2);
  const median = clean.length % 2 === 1 ? (clean[middle] ?? 0) : ((clean[middle - 1] ?? 0) + (clean[middle] ?? 0)) / 2;
  return Math.min(STEP_GUARD_MS, Math.max(STEP_GUARD_MIN_MS, Math.round(median * PACE_SHARE)));
}

/** A pointer tap: where it landed (client coordinates) and when (the event's timeStamp). */
export interface PinTap {
  x: number;
  y: number;
  time: number;
}

export interface PinFinish {
  /** The key whose tap finished the entry, or null when a hardware key, Enter, or Space finished it. */
  key: string | null;
  /** The finishing tap, or null with key. */
  tap: PinTap | null;
  /** How long a tap on the finishing key (or that spot) is dropped, from stepHoldFor. */
  holdMs: number;
  /** performance.now() at the finish, for the hand-off to a pad that steps in. */
  at: number;
}

let handOff: PinFinish | null = null;

/** Called by a pad as its entry finishes, before onComplete runs. */
export function noteFinish(key: string, tap: PinTap | null, holdMs: number): PinFinish {
  const finish: PinFinish = { key: tap === null ? null : key, tap, holdMs, at: performance.now() };
  handOff = finish;
  // A pad that steps in place has mounted before this runs; a later pad is a new arrival.
  window.setTimeout(() => {
    if (handOff === finish) handOff = null;
  }, 0);
  return finish;
}

/** The finish a pad mounting now steps on from, or null when it is a new arrival. */
export function finishToStepFrom(): PinFinish | null {
  if (handOff === null) return null;
  const elapsed = performance.now() - handOff.at;
  return elapsed >= 0 && elapsed < TAP_GUARD_MS ? handOff : null;
}

/**
 * True when a tap is the second half of a double tap on the key that finished the entry: a pointer
 * tap within finish.holdMs of the finishing tap, on the same key or on the key that now covers the
 * spot where the finishing tap landed. Keyboard activation (detail 0) is never dropped.
 */
export function isEchoOfFinish(finish: PinFinish | null, key: string, target: Element, detail: number, time: number): boolean {
  if (finish === null || finish.key === null || finish.tap === null || detail === 0) return false;
  const gap = time - finish.tap.time;
  if (!Number.isFinite(gap) || gap < 0 || gap >= finish.holdMs) return false;
  if (key === finish.key) return true;
  const box = target.getBoundingClientRect();
  if (box.width <= 0 || box.height <= 0) return false;
  const { x, y } = finish.tap;
  return x >= box.left && x <= box.right && y >= box.top && y <= box.bottom;
}
