/**
 * Pick a backup file, or paste backup text, and check it with core readBackup (JSON, schema,
 * format version, checksum). Nothing is written here; a verified backup goes to onVerified and the
 * caller shows what is inside before anything is replaced.
 * Accepts .json and .txt (the "Share as a text file" and "Copy backup text" paths, D12).
 */
import { useId, useRef, useState, type ChangeEvent } from 'react';
import { Button } from '../../../components/ui';
import type { VerifiedBackup } from '../../../core/backupFile';
import { readBackup } from '../../../core/backupImport';
import { describeError } from '../../../core/errors';
import { Actions, StatusLine } from './Screen';

export interface BackupFileReaderProps {
  onVerified: (backup: VerifiedBackup) => void;
  onCancel: () => void;
  pickLabel?: string;
}

export function BackupFileReader({ onVerified, onCancel, pickLabel = 'Pick the backup file' }: BackupFileReaderProps) {
  const input = useRef<HTMLInputElement>(null);
  const textId = useId();
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const [pasting, setPasting] = useState(false);
  const [text, setText] = useState('');

  async function check(source: Blob | string) {
    setBusy(true);
    setProblem(null);
    try {
      const result = await readBackup(source);
      if (result.ok) {
        onVerified({ verified: true, backup: result.backup, summary: result.summary });
        return;
      }
      setProblem(result.message);
    } catch (error) {
      setProblem(`The file could not be checked. ${describeError(error)}`);
    } finally {
      setBusy(false);
    }
  }

  function picked(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    // Clear the input so picking the same file again still fires a change.
    event.target.value = '';
    if (file === undefined) return;
    void check(file);
  }

  return (
    <div className="mc-section">
      <input
        ref={input}
        type="file"
        accept=".json,.txt,application/json,text/plain"
        className="ui-visually-hidden"
        tabIndex={-1}
        aria-hidden="true"
        onChange={picked}
      />
      <Actions>
        <Button variant="primary" onClick={() => input.current?.click()} loading={busy} loadingLabel="Checking">
          {pickLabel}
        </Button>
        <Button onClick={() => setPasting((on) => !on)} aria-expanded={pasting}>
          {pasting ? 'Hide the text box' : 'Paste backup text instead'}
        </Button>
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </Actions>
      {pasting ? (
        <div className="mc-section">
          <label htmlFor={textId}>Backup text</label>
          <textarea
            id={textId}
            className="mc-textarea"
            value={text}
            onChange={(event) => setText(event.target.value)}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          <Actions>
            <Button onClick={() => void check(text)} disabled={text.trim() === '' || busy}>
              Check this text
            </Button>
          </Actions>
        </div>
      ) : null}
      {problem !== null ? <StatusLine tone="warning">{problem} Nothing on this phone changed.</StatusLine> : null}
    </div>
  );
}
