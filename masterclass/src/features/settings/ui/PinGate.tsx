/**
 * PIN screens built on the PinPad (6 digits, masked, no text field, so nothing can autofill it).
 *
 * PinGate: "Enter owner PIN". A correct PIN opens core's 5 minute owner pass, then onSuccess runs.
 *   With the pass already open it calls onSuccess at once (D4: the pass lives 5 minutes).
 *   Wrong PINs show the tries left; the third locks entry for 30 seconds with a countdown in
 *   seconds. A lock still running after a reload shows as soon as the pad opens (DEF-05).
 * NewPinEntry: a new PIN entered twice. A mismatch starts again. The digits live in memory only,
 *   are never logged, and are dropped as soon as onComplete has them.
 */
import { useEffect, useRef, useState } from 'react';
import { PinPad } from '../../../components/ui';
import { PIN_LOCK_MS, ownerPassActive, verifyPin } from '../../../core/pin';
import { usePinLock } from '../../../core/usePinLock';

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
  const lock = usePinLock();
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
      lock.lockFor(result.lockedForMs ?? PIN_LOCK_MS);
      setError(undefined);
      return;
    }
    setError(result.message);
  }

  const status = lock.words ?? (checking ? 'Checking' : undefined);

  return (
    <PinPad
      label={label}
      onComplete={(pin) => void check(pin)}
      onCancel={onCancel}
      error={lock.words !== undefined ? undefined : error}
      status={status}
      disabled={checking || lock.locked}
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
