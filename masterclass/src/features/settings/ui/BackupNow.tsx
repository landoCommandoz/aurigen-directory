/**
 * "Save a backup" in one place, used by the setup flow (the first backup, right after the PIN), the
 * Backup screen, and the Start fresh result (D3, D12).
 *
 * The share sheet needs a fresh tap, and WebKit spends that tap on the first share call. So the
 * backup is prepared when this mounts, and the button's tap hands it to the share sheet with
 * nothing awaited first. A second copy without photos is prepared too, for "Copy backup text".
 * A closed sheet saves nothing and says so; the screen then offers Try again, Share as a text
 * file, Copy backup text, and Not now, so it never dead-ends.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '../../../components/ui';
import { copyBackupText, exportBackup, shareBackup, type PreparedBackup, type ShareOutcome } from '../../../core/backup';
import { describeError } from '../../../core/errors';
import { formatBytes, formatWhen } from './format';
import { Actions, StatusLine } from './Screen';

export interface BackupNowProps {
  buttonLabel?: string;
  /** After a backup left the phone (share, download, or copied text). */
  onDone?: (outcome: Extract<ShareOutcome, { ok: true }>) => void;
  /** Shows a "Not now" button. */
  onNotNow?: () => void;
}

type Prep = { state: 'preparing' } | { state: 'ready'; full: PreparedBackup; text: PreparedBackup } | { state: 'failed'; message: string };

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
  } catch (error) {
    return { state: 'failed', message: error instanceof Error ? error.message : describeError(error) };
  }
}

export function BackupNow({ buttonLabel = 'Save backup', onDone, onNotNow }: BackupNowProps) {
  const [prep, setPrep] = useState<Prep>({ state: 'preparing' });
  const [busy, setBusy] = useState(false);
  const [outcome, setOutcome] = useState<ShareOutcome | null>(null);
  const mounted = useRef(true);

  /** Build a fresh copy (from a tap, or after a backup left the phone). */
  const prepare = useCallback(() => {
    setPrep({ state: 'preparing' });
    void prepareBoth().then((next) => {
      if (mounted.current) setPrep(next);
    });
  }, []);

  // The first copy is built as the screen opens, so the tap can go straight to the share sheet.
  useEffect(() => {
    mounted.current = true;
    void prepareBoth().then((next) => {
      if (mounted.current) setPrep(next);
    });
    return () => {
      mounted.current = false;
    };
  }, []);

  async function finish(result: ShareOutcome) {
    if (!mounted.current) return;
    setOutcome(result);
    setBusy(false);
    if (result.ok) {
      onDone?.(result);
      // A fresh copy for the next tap, so "last backup" inside it is current.
      prepare();
    }
  }

  // Each handler calls the share or clipboard API first, with nothing awaited before it.
  function save() {
    if (prep.state !== 'ready' || busy) return;
    setBusy(true);
    void shareBackup(prep.full).then(finish);
  }

  function saveAsText() {
    if (prep.state !== 'ready' || busy) return;
    setBusy(true);
    void shareBackup(prep.full, { asText: true }).then(finish);
  }

  function copyText() {
    if (prep.state !== 'ready' || busy) return;
    setBusy(true);
    void copyBackupText(prep.text).then(finish);
  }

  if (prep.state === 'failed') {
    return (
      <div className="mc-section">
        <StatusLine tone="warning">The backup could not be prepared. {prep.message}</StatusLine>
        <Actions>
          <Button onClick={prepare}>Prepare again</Button>
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
  return (
    <div className="mc-section">
      {ready ? (
        <p className="ui-muted">
          {prep.full.summary.jobs} jobs, {prep.full.summary.photoCount} photos, {formatBytes(prep.full.summary.bytes)}. Made{' '}
          {formatWhen(prep.full.createdAt)}.
        </p>
      ) : (
        <p className="ui-muted" aria-live="polite">
          Preparing the backup
        </p>
      )}
      {ready && prep.full.settingsRepaired.length > 0 ? (
        <StatusLine tone="warning">
          Some settings on this phone were damaged, so this backup holds them at their starting values: {prep.full.settingsRepaired.join(', ')}. The
          jobs, the device role, and the owner PIN are in it as they are.
        </StatusLine>
      ) : null}
      <Actions>
        <Button variant="primary" size="shop" onClick={save} loading={busy || !ready} loadingLabel={ready ? 'Opening' : 'Preparing'}>
          {failed ? 'Try again' : buttonLabel}
        </Button>
        {onNotNow ? (
          <Button variant="ghost" onClick={onNotNow}>
            Not now
          </Button>
        ) : null}
      </Actions>
      {outcome !== null ? (
        <StatusLine tone={outcome.ok ? 'success' : 'warning'}>{outcomeWords(outcome, ready ? prep.full.filename : 'the backup')}</StatusLine>
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
