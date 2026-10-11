/**
 * The PIN lock countdown for PIN screens (D4, DEF-05): reads any lock still running when the screen
 * opens (after a reload too), counts down in whole seconds, and lets go on its own at zero.
 *
 *   const lock = usePinLock();
 *   <PinPad disabled={checking || lock.locked} status={lock.words} ... />
 *   if (result.code === 'locked') lock.lockFor(result.lockedForMs ?? PIN_LOCK_MS);
 *
 * Two ways a lock shows. After an attempt answered "locked" (lockFor), the keys are off until it
 * ends. A lock found when the screen opens shows its countdown at once with the keys still live:
 * a PIN typed then is refused by core with the seconds left (it never counts as a try), and the
 * keys go off for the rest of the lock. core verifyPin enforces the lock either way.
 */
import { useCallback, useEffect, useState } from 'react';
import { nowMs } from './clock';
import { PIN_LOCK_MS, lockCountdownWords, pinLockRemainingMs } from './pin';

export interface PinLock {
  /** The keys are off: an attempt was answered "locked". */
  locked: boolean;
  /** "Locked after three wrong PINs. Try again in 27 seconds." while any lock runs. */
  words: string | undefined;
  /** Start (or extend) the countdown after verifyPin answered "locked". */
  lockFor: (ms: number) => void;
}

type Lock = { until: number; keysOff: boolean } | null;

export function usePinLock(): PinLock {
  const [lock, setLock] = useState<Lock>(null);
  const [now, setNow] = useState(() => nowMs());

  // A lock still running from before (a reload, another screen) shows at once.
  useEffect(() => {
    let live = true;
    void pinLockRemainingMs().then((ms) => {
      if (!live || ms <= 0) return;
      const t = nowMs();
      setNow(t);
      setLock((current) => current ?? { until: t + ms, keysOff: false });
    });
    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    if (lock === null) return undefined;
    const timer = window.setInterval(() => {
      const t = nowMs();
      setNow(t);
      if (t >= lock.until) setLock(null);
    }, 500);
    return () => window.clearInterval(timer);
  }, [lock]);

  const lockFor = useCallback((ms: number) => {
    const wait = Number.isFinite(ms) && ms > 0 ? Math.min(ms, PIN_LOCK_MS) : PIN_LOCK_MS;
    const t = nowMs();
    setNow(t);
    setLock({ until: t + wait, keysOff: true });
  }, []);

  const running = lock !== null && now < lock.until;
  return { locked: running && lock.keysOff, words: running ? lockCountdownWords(lock.until - now) : undefined, lockFor };
}
