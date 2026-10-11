/**
 * One place for time and ids, so tests can move the clock and every record gets a valid id.
 * nowMs: wall clock (for stored ISO stamps). monotonicMs: never goes backward within a page
 * (for the 5 minute owner pass and lockouts, which must not stretch if the phone clock moves).
 */

let wallClock: () => number = () => Date.now();
let monotonicClock: () => number = () =>
  typeof performance !== 'undefined' && typeof performance.now === 'function' ? performance.now() : Date.now();

export function nowMs(): number {
  return wallClock();
}

export function nowIso(): string {
  return new Date(wallClock()).toISOString();
}

export function monotonicMs(): number {
  return monotonicClock();
}

/** Tests only: replace the clocks. Call with no argument to restore the real ones. */
export function __setClockForTests(clock?: { wall?: () => number; monotonic?: () => number }): void {
  wallClock = clock?.wall ?? (() => Date.now());
  monotonicClock =
    clock?.monotonic ??
    (() => (typeof performance !== 'undefined' && typeof performance.now === 'function' ? performance.now() : Date.now()));
}

/** A random RFC 4122 version 4 UUID. crypto.randomUUID needs a secure context; the fallback builds one from random bytes. */
export function newId(): string {
  const c = globalThis.crypto;
  if (typeof c?.randomUUID === 'function') return c.randomUUID();
  const bytes = new Uint8Array(16);
  if (typeof c?.getRandomValues === 'function') c.getRandomValues(bytes);
  else for (let i = 0; i < 16; i += 1) bytes[i] = Math.floor(Math.random() * 256);
  bytes[6] = ((bytes[6] ?? 0) & 0x0f) | 0x40;
  bytes[8] = ((bytes[8] ?? 0) & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/** Local calendar date YYYY-MM-DD, for file names a person reads. */
export function localDateStamp(ms: number = wallClock()): string {
  const d = new Date(ms);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
