/**
 * PIN screens built on the PinPad (6 digits, masked, no text field, so nothing can autofill it).
 *
 * PinGate: "Enter owner PIN". A correct PIN opens core's 5 minute owner pass, then onSuccess runs.
 *   With the pass already open it calls onSuccess at once (D4: the pass lives 5 minutes).
 *   Wrong PINs show the tries left; the third locks entry for 30 seconds with a countdown.
 * NewPinEntry: a new PIN entered twice. A mismatch starts again. The digits live in memory only,
 *   are never logged, and are dropped as soon as onComplete has them.
 */
import { useEffect, useRef, useState } from 'react';
import { PinPad } from '../../../components/ui';
import { nowMs } from '../../../core/clock';
import { ownerPassActive, verifyPin } from '../../../core/pin';

export interface PinGateProps {
  label?: string;
  onSuccess: () => void;
  onCancel: () => void;
  /** Skip the pad when the owner pass is already open. Default true. */
  skipIfPassActive?: boolean;
}

export function PinGate({ label = 'Enter owner PIN', onSuccess, onCancel, skipIfPassActive = true }: PinGateProps) {
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [now, setNow] = useState(() => nowMs());
  const mounted = useRef(true);
  const done = useRef(false);
  const latest = useRef(onSuccess);

  useEffect(() => {
    latest.current = onSuccess;
  }, [onSuccess]);

  useEffect(() => {
    mounted.current = true;
    if (skipIfPassActive && ownerPassActive() && !done.current) {
      done.current = true;
      latest.current();
    }
    return () => {
      mounted.current = false;
    };
  }, [skipIfPassActive]);

  useEffect(() => {
    if (lockedUntil === null) return undefined;
    const timer = window.setInterval(() => {
      const t = nowMs();
      setNow(t);
      if (t >= lockedUntil) {
        setLockedUntil(null);
        setError(undefined);
      }
    }, 500);
    return () => window.clearInterval(timer);
  }, [lockedUntil]);

  async function check(pin: string) {
    if (checking || done.current) return;
    setChecking(true);
    const result = await verifyPin(pin);
    if (!mounted.current) return;
    setChecking(false);
    if (result.ok) {
      done.current = true;
      setError(undefined);
      latest.current();
      return;
    }
    if (result.code === 'locked') {
      setLockedUntil(nowMs() + (result.lockedForMs ?? 30_000));
      setNow(nowMs());
    }
    setError(result.message);
  }

  const locked = lockedUntil !== null && now < lockedUntil;
  const status = locked ? `Locked. Try again in ${Math.max(1, Math.ceil((lockedUntil - now) / 1000))} seconds.` : checking ? 'Checking' : undefined;

  return (
    <PinPad
      label={label}
      onComplete={(pin) => void check(pin)}
      onCancel={onCancel}
      error={locked ? undefined : error}
      status={status}
      disabled={checking || locked}
    />
  );
}

export interface NewPinEntryProps {
  onComplete: (pin: string) => void;
  onCancel: () => void;
  /** Saving: ignore keys, Cancel still works. */
  busy?: boolean;
  /** An error from saving, in words. */
  error?: string;
  firstLabel?: string;
}

export const PIN_MISMATCH = 'The two PINs did not match. Enter a new PIN again.';

export function NewPinEntry({ onComplete, onCancel, busy = false, error, firstLabel = 'Create a 6 digit owner PIN' }: NewPinEntryProps) {
  const [phase, setPhase] = useState<'first' | 'confirm'>('first');
  const [mismatch, setMismatch] = useState(false);
  const first = useRef<string | null>(null);

  function enter(pin: string) {
    if (busy) return;
    if (phase === 'first') {
      first.current = pin;
      setMismatch(false);
      setPhase('confirm');
      return;
    }
    const matches = first.current === pin;
    first.current = null;
    if (!matches) {
      setMismatch(true);
      setPhase('first');
      return;
    }
    setPhase('first');
    onComplete(pin);
  }

  function cancel() {
    first.current = null;
    onCancel();
  }

  const shownError = mismatch ? PIN_MISMATCH : error;
  return (
    <PinPad
      key={phase}
      label={phase === 'first' ? firstLabel : 'Enter the same PIN again'}
      onComplete={enter}
      onCancel={cancel}
      error={shownError}
      status={busy ? 'Saving' : phase === 'confirm' ? 'Once more, to be sure.' : undefined}
      disabled={busy}
    />
  );
}
