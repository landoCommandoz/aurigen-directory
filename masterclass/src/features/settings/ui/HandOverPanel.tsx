/**
 * "Save backup and hand over" (D12 amendment, 2026-10-11 [HOUSE default]; BLUEPRINT 3.9).
 *
 * The backup is prepared as this opens, so the one button's tap hands it to the share sheet with
 * nothing awaited first (core handOver). Only a share that resolved switches this phone to study;
 * a closed or failed share changes nothing and says so, with Try again and Cancel. The owner pass
 * is read at the tap: if it ran out since the PIN, the screen goes back to the PIN and nothing is
 * shared. The button row ignores taps for a moment after it appears (it sits where the last PIN
 * digit was), so the second tap of a double tap never opens the share sheet.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '../../../components/ui';
import { exportBackup, type PreparedBackup } from '../../../core/backup';
import { handOver } from '../../../core/deviceRole';
import { BACKUP_NOT_MADE_MESSAGE } from '../../../core/errors';
import { ownerPassActive } from '../../../core/pin';
import { formatBytes } from './format';
import { Actions, StatusLine } from './Screen';
import { TapGuarded } from './TapGuarded';

export interface HandOverPanelProps {
  /** handingOver: the share sheet is open; Cancel is not offered (one transaction follows). */
  working: boolean;
  /** The screen moves to handingOver. False when the table refuses (a stale tap): nothing is shared. */
  onStart: () => boolean;
  /** The owner pass ran out before the tap: back to the PIN. */
  onPassExpired: () => void;
  /** The share resolved and this phone is now a study phone. */
  onDone: () => void;
  /** Nothing changed; the panel shows why and offers Try again. */
  onNotDone: () => void;
  onCancel: () => void;
}

type Prep = { state: 'preparing' } | { state: 'ready'; full: PreparedBackup } | { state: 'failed' };

export function HandOverPanel({ working, onStart, onPassExpired, onDone, onNotDone, onCancel }: HandOverPanelProps) {
  const [prep, setPrep] = useState<Prep>({ state: 'preparing' });
  const [message, setMessage] = useState<string | null>(null);
  const mounted = useRef(true);
  const inFlight = useRef(false);

  /** Build the backup; the answer lands when it is ready (never a state change inside the effect itself). */
  const build = useCallback(() => {
    exportBackup({ photos: 'included' }).then(
      (full) => {
        if (mounted.current) setPrep({ state: 'ready', full });
      },
      () => {
        if (mounted.current) setPrep({ state: 'failed' });
      },
    );
  }, []);

  /** Try again, from a tap. */
  function prepare() {
    setPrep({ state: 'preparing' });
    build();
  }

  useEffect(() => {
    mounted.current = true;
    build();
    return () => {
      mounted.current = false;
    };
  }, [build]);

  // The share sheet opens first, from this tap, with nothing awaited before it.
  function tap() {
    if (prep.state !== 'ready' || inFlight.current) return;
    const passAtStart = ownerPassActive();
    if (!passAtStart) {
      onPassExpired();
      return;
    }
    if (!onStart()) return;
    inFlight.current = true;
    setMessage(null);
    void handOver(prep.full, { ownerPassAtStart: passAtStart }).then((result) => {
      inFlight.current = false;
      if (!mounted.current) return;
      if (result.ok) {
        onDone();
        return;
      }
      const left = result.share !== null && result.share.ok;
      setMessage(left ? `The backup was saved, but this phone could not switch itself to a study phone. ${result.message}` : result.message);
      onNotDone();
    }, () => {
      // Never left hanging on "Opening": core answers in words, and anything else is said plainly.
      inFlight.current = false;
      if (!mounted.current) return;
      setMessage('Something went wrong before this phone could switch, so it is still the shop phone. Try again.');
      onNotDone();
    });
  }

  if (prep.state === 'failed') {
    return (
      <div className="mc-section">
        <StatusLine tone="warning">{BACKUP_NOT_MADE_MESSAGE}</StatusLine>
        <Actions>
          <Button variant="primary" size="shop" onClick={prepare}>
            Try again
          </Button>
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </Actions>
      </div>
    );
  }

  const ready = prep.state === 'ready';
  return (
    <div className="mc-section">
      {prep.state === 'ready' ? (
        <p className="ui-muted">
          The backup holds {prep.full.summary.jobs} jobs and {prep.full.summary.photoCount} photos ({formatBytes(prep.full.summary.bytes)}).
        </p>
      ) : (
        <p className="ui-muted" aria-live="polite">
          Preparing the backup
        </p>
      )}
      {message !== null ? <StatusLine tone="warning">{message}</StatusLine> : null}
      <TapGuarded>
        <Actions>
          <Button variant="primary" size="shop" onClick={tap} loading={working || !ready} loadingLabel={ready ? 'Opening the share sheet' : 'Preparing'}>
            {message !== null ? 'Try again' : 'Save backup and hand over'}
          </Button>
          {working ? null : (
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </Actions>
      </TapGuarded>
    </div>
  );
}
