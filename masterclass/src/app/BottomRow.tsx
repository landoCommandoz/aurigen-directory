/**
 * The bottom row (BLUEPRINT 2.1, wireframe 6.2): on every internal screen it holds Fix It, one
 * tap away, plus Quick cards and Search. Every button is 64 px. Fix It sits on the thumb side
 * (left by default; data-hand="right" on <html> mirrors the row, Lando 2026-10-10).
 *
 * In Customer View the row holds one control only: leaving Customer View. Phase 1 has no
 * customer session, so that is one tap. If a session is active (Phase 4 customer screens), core
 * refuses with needsOwnerPass and the row asks for the owner PIN here, then tries again.
 */
import { useEffect, useRef, useState } from 'react';
import { Button, Drawer, PinPad } from '../components/ui';
import { useCustomerView } from '../core/customerView';
import { verifyPin } from '../core/pin';
import { ButtonLink } from './ButtonLink';

export function BottomRow() {
  const { ready, on } = useCustomerView();
  if (!ready) return <nav className="app-bottom" aria-label="Main" data-print="hide" />;
  if (on) {
    return (
      <nav className="app-bottom" aria-label="Customer View" data-print="hide">
        <ExitCustomerView />
      </nav>
    );
  }
  return (
    <nav className="app-bottom" aria-label="Main" data-print="hide">
      <ButtonLink to="/fixit" size="shop" className="app-bottom__fixit">
        Fix It
      </ButtonLink>
      <ButtonLink to="/cards" size="shop" end={false} className="app-bottom__item">
        Quick cards
      </ButtonLink>
      <ButtonLink to="/search" size="shop" className="app-bottom__item">
        Search
      </ButtonLink>
    </nav>
  );
}

function ExitCustomerView() {
  const customerView = useCustomerView();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [pinOpen, setPinOpen] = useState(false);
  const [pinError, setPinError] = useState<string | undefined>(undefined);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [checking, setChecking] = useState(false);
  const unlockTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (unlockTimer.current !== null) window.clearTimeout(unlockTimer.current);
    },
    [],
  );

  async function exit() {
    if (busy) return;
    setBusy(true);
    setMessage(null);
    const result = await customerView.turnOff();
    setBusy(false);
    if (result.ok) return;
    if (result.code === 'needsOwnerPass') {
      setPinError(undefined);
      setPinOpen(true);
      return;
    }
    setMessage(result.message);
  }

  async function checkPin(pin: string) {
    if (checking) return;
    setChecking(true);
    const verdict = await verifyPin(pin);
    if (!verdict.ok) {
      setChecking(false);
      setPinError(verdict.message);
      if (verdict.code === 'locked' && typeof verdict.lockedForMs === 'number') {
        const wait = Math.max(0, verdict.lockedForMs);
        setLockedUntil(Date.now() + wait);
        unlockTimer.current = window.setTimeout(() => setLockedUntil(null), wait);
      }
      return;
    }
    const result = await customerView.turnOff();
    setChecking(false);
    if (result.ok) {
      setPinOpen(false);
      return;
    }
    setPinError(result.message);
  }

  const label = customerView.sessionActive ? 'End customer session' : 'Exit Customer View';
  return (
    <>
      <Button size="shop" className="app-bottom__exit" onClick={() => void exit()} loading={busy} loadingLabel="Leaving">
        {label}
      </Button>
      {message !== null ? (
        <p className="app-bottom__message" role="alert">
          {message}
        </p>
      ) : null}
      <Drawer open={pinOpen} onClose={() => setPinOpen(false)} title="Owner PIN" closeLabel="Cancel">
        {pinOpen ? (
          <PinPad
            label="Enter the owner PIN to end the customer session"
            onComplete={(pin) => void checkPin(pin)}
            onCancel={() => setPinOpen(false)}
            error={pinError}
            disabled={checking || lockedUntil !== null}
            status={lockedUntil !== null ? 'Locked for 30 seconds after three wrong PINs.' : checking ? 'Checking' : undefined}
          />
        ) : null}
      </Drawer>
    </>
  );
}
