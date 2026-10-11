/**
 * "Save a backup" in one place, used by the setup flow (the first backup, right after the PIN), the
 * Backup screen, and the Start fresh result (D3, D12).
 *
 * The share sheet needs a fresh tap, and WebKit spends that tap on the first share call. So the
 * backup is prepared when this mounts, and the button's tap hands it to the share sheet with
 * nothing awaited first. A second copy without photos is prepared too, for "Copy backup text".
 * A closed sheet saves nothing and says so; the screen then offers Try again, Share as a text
 * file, Copy backup text, and Not now, so it never dead-ends.
 *
 * One tap is one file and one audit entry (DEF-03): a second tap while a save is in flight does
 * nothing (a ref, so even two taps in one frame), and after a save the button holds, reading
 * "Saved", until the person taps OK and at least BACKUP_HOLD_MS has passed, whichever is later.
 * When the parent passes onDone it owns that acknowledgment (the setup flow's Done moves on), so
 * the button holds until the parent moves away.
 *
 * When this phone's role or PIN record cannot be read, the backup is still made (DEF-13) and the
 * line above the button says so in the architect's words; it never tells the person to open
 * Backup. If making it fails for any other reason, the line says nothing changed and offers Try again.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, CheckGlyph } from '../../../components/ui';
import { copyBackupText, exportBackup, shareBackup, type PreparedBackup, type ShareOutcome } from '../../../core/backup';
import { BACKUP_NOT_MADE_MESSAGE, BACKUP_SETTINGS_UNREADABLE_MESSAGE } from '../../../core/errors';
import { formatBytes, formatWhen } from './format';
import { Actions, StatusLine } from './Screen';

/** After a save, the button holds at least this long, so a second tap never makes a second file. */
export const BACKUP_HOLD_MS = 2000;

export interface BackupNowProps {
  buttonLabel?: string;
  /** After a backup left the phone (share, download, or copied text). The parent then owns the acknowledgment. */
  onDone?: (outcome: Extract<ShareOutcome, { ok: true }>) => void;
  /** Shows a "Not now" button. */
  onNotNow?: () => void;
  /** Show text A when this phone's settings are unreadable. Off where the screen already says so (the restore confirm). */
  showSettingsNotice?: boolean;
}

type Prep = { state: 'preparing' } | { state: 'ready'; full: PreparedBackup; text: PreparedBackup } | { state: 'failed' };

/** What happened, in words, and what to do with the file. */
export function outcomeWords(outcome: ShareOutcome, filename: string): string {
  if (!outcome.ok) return outcome.message;
  switch (outcome.path) {
    case 'share':
      return 'Path: share sheet. The backup went to the app you picked. Keep it off this phone: Save to Files (iCloud Drive), or Mail it to yourself.';
    case 'download':
      return `Path: download. The file ${filename} was saved by the browser. Move it to Files (iCloud Drive), or email it to yourself.${outcome.note ? ` ${outcome.note}` : ''}`;
    case 'clipboard':
      return `Path: copied text. ${outcome.note ?? 'Paste it into Notes or Files now.'}`;
    default:
      return 'The backup left the phone.';
  }
}

async function prepareBoth(): Promise<Prep> {
  try {
    const full = await exportBackup({ photos: 'included' });
    const text = await exportBackup({ photos: 'omitted' });
    return { state: 'ready', full, text };
  } catch {
    // Plain words only (text B): the detail could be schema text or point back at this screen.
    return { state: 'failed' };
  }
}

export function BackupNow({ buttonLabel = 'Save backup', onDone, onNotNow, showSettingsNotice = true }: BackupNowProps) {
  const [prep, setPrep] = useState<Prep>({ state: 'preparing' });
  const [busy, setBusy] = useState(false);
  const [outcome, setOutcome] = useState<ShareOutcome | null>(null);
  /** After a save: held until acknowledged and BACKUP_HOLD_MS passed. */
  const [held, setHeld] = useState(false);
  const [acked, setAcked] = useState(false);
  const mounted = useRef(true);
  /** The two conditions for letting go, read at the moment of the tap or the timer. */
  const ackedRef = useRef(false);
  const holdOverRef = useRef(false);
  /** Synchronous guards: true from the tap until the hold lets go. */
  const inFlight = useRef(false);
  const holding = useRef(false);
  /** The last copy that was ready, for the words above the button. */
  const [lastFull, setLastFull] = useState<PreparedBackup | null>(null);
  const ownsAck = onDone === undefined;

  const applyPrep = useCallback((next: Prep) => {
    if (!mounted.current) return;
    setPrep(next);
    if (next.state === 'ready') setLastFull(next.full);
  }, []);

  /** Build a fresh copy (from a tap, or after a backup left the phone). */
  const prepare = useCallback(() => {
    setPrep({ state: 'preparing' });
    void prepareBoth().then(applyPrep);
  }, [applyPrep]);

  // The first copy is built as the screen opens, so the tap can go straight to the share sheet.
  useEffect(() => {
    mounted.current = true;
    void prepareBoth().then(applyPrep);
    return () => {
      mounted.current = false;
    };
  }, [applyPrep]);

  /** Let go of the hold: the button reads its label again and takes the next tap. */
  const release = useCallback(() => {
    holding.current = false;
    ackedRef.current = false;
    holdOverRef.current = false;
    setHeld(false);
    setAcked(false);
    setOutcome(null);
  }, []);

  // The minimum hold after a save; it lets go here if the person already tapped OK.
  useEffect(() => {
    if (!held) return undefined;
    const timer = window.setTimeout(() => {
      holdOverRef.current = true;
      if (ackedRef.current && mounted.current) release();
    }, BACKUP_HOLD_MS);
    return () => window.clearTimeout(timer);
  }, [held, release]);

  /** OK: lets go now if the minimum hold has passed, else when it does (whichever is later). */
  function acknowledge() {
    ackedRef.current = true;
    setAcked(true);
    if (holdOverRef.current) release();
  }

  function finish(result: ShareOutcome) {
    inFlight.current = false;
    if (!mounted.current) return;
    setOutcome(result);
    setBusy(false);
    if (result.ok) {
      holding.current = true;
      ackedRef.current = false;
      holdOverRef.current = false;
      setHeld(true);
      setAcked(false);
      onDone?.(result);
      // A fresh copy for the next tap, so "last backup" inside it is current.
      prepare();
    }
  }

  /** True when a tap may start a save now; takes the guard in the same moment. */
  function takeTap(): boolean {
    if (prep.state !== 'ready' || inFlight.current || holding.current) return false;
    inFlight.current = true;
    setBusy(true);
    return true;
  }

  // Each handler calls the share or clipboard API first, with nothing awaited before it.
  function save() {
    if (prep.state !== 'ready' || !takeTap()) return;
    void shareBackup(prep.full).then(finish);
  }

  function saveAsText() {
    if (prep.state !== 'ready' || !takeTap()) return;
    void shareBackup(prep.full, { asText: true }).then(finish);
  }

  function copyText() {
    if (prep.state !== 'ready' || !takeTap()) return;
    void copyBackupText(prep.text).then(finish);
  }

  if (prep.state === 'failed' && !held) {
    return (
      <div className="mc-section">
        <StatusLine tone="warning">{BACKUP_NOT_MADE_MESSAGE}</StatusLine>
        <Actions>
          <Button variant="primary" size="shop" onClick={prepare}>
            Try again
          </Button>
          {onNotNow ? (
            <Button variant="ghost" onClick={onNotNow}>
              Not now
            </Button>
          ) : null}
        </Actions>
      </div>
    );
  }

  const ready = prep.state === 'ready';
  const failed = outcome !== null && !outcome.ok;
  // While the next copy is prepared after a save, the lines above the button keep the last
  // copy's words, so the held button never moves under a second tap.
  const shown = prep.state === 'ready' ? prep.full : lastFull;
  const filename = shown?.filename ?? 'the backup';
  return (
    <div className="mc-section">
      {shown !== null ? (
        <p className="ui-muted">
          {shown.summary.jobs} jobs, {shown.summary.photoCount} photos, {formatBytes(shown.summary.bytes)}. Made {formatWhen(shown.createdAt)}.
        </p>
      ) : (
        <p className="ui-muted" aria-live="polite">
          Preparing the backup
        </p>
      )}
      {showSettingsNotice && shown?.settings === 'unreadable' ? <StatusLine tone="warning">{BACKUP_SETTINGS_UNREADABLE_MESSAGE}</StatusLine> : null}
      {shown !== null && shown.settingsRepaired.length > 0 ? (
        <StatusLine tone="warning">
          Some settings on this phone were damaged, so this backup holds them at their starting values: {shown.settingsRepaired.join(', ')}. The jobs,
          the device role, and the owner PIN are in it as they are.
        </StatusLine>
      ) : null}
      <Actions>
        {held ? (
          <Button variant="primary" size="shop" disabled icon={<CheckGlyph />}>
            Saved
          </Button>
        ) : (
          <Button variant="primary" size="shop" onClick={save} loading={busy || !ready} loadingLabel={ready ? 'Opening' : 'Preparing'}>
            {failed ? 'Try again' : buttonLabel}
          </Button>
        )}
        {onNotNow && !held ? (
          <Button variant="ghost" onClick={onNotNow}>
            Not now
          </Button>
        ) : null}
      </Actions>
      {outcome !== null ? <StatusLine tone={outcome.ok ? 'success' : 'warning'}>{outcomeWords(outcome, filename)}</StatusLine> : null}
      {held && ownsAck && !acked ? (
        <Actions>
          <Button onClick={acknowledge}>OK</Button>
        </Actions>
      ) : null}
      {failed ? (
        <Actions>
          <Button onClick={saveAsText} disabled={!ready || busy}>
            Share as a text file
          </Button>
          <Button onClick={copyText} disabled={!ready || busy}>
            Copy backup text
          </Button>
        </Actions>
      ) : null}
    </div>
  );
}
