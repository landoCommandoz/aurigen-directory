/**
 * The bottom row (BLUEPRINT 2.1, wireframe 6.2): on every internal screen it holds Fix It, one
 * tap away, plus Quick cards and Search. Every button is 64 px. Fix It sits on the thumb side
 * (left by default; data-hand="right" on <html> mirrors the row, Lando 2026-10-10).
 *
 * In Customer View the row holds one control only: leaving Customer View. Phase 1 has no
 * customer session, so that is one tap. If a session is active (Phase 4 customer screens), core
 * refuses with needsOwnerPass and the row asks for the owner PIN here, then tries again.
 */
import { useState } from 'react';
import { Button, Drawer, PinPad } from '../components/ui';
import { useCustomerView } from '../core/customerView';
import { PIN_LOCK_MS, verifyPin } from '../core/pin';
import { usePinLock } from '../core/usePinLock';
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
  const [checking, setChecking] = useState(false);
  const lock = usePinLock();

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
      if (verdict.code === 'locked') {
        lock.lockFor(verdict.lockedForMs ?? PIN_LOCK_MS);
        setPinError(undefined);
        return;
      }
      setPinError(verdict.message);
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
            error={lock.words !== undefined ? undefined : pinError}
            disabled={checking || lock.locked}
            status={lock.words ?? (checking ? 'Checking' : undefined)}
          />
        ) : null}
      </Drawer>
    </>
  );
}
