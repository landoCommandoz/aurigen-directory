/**
 * /settings/backup: Backup and restore (D3, D12).
 * Make a backup: the share sheet (a download only where that is safe, never inside the installed
 *   iPhone app), with Copy backup text as the fallback.
 * Restore from a file: pick or paste, check, show what the file holds (jobs, cars toward 25,
 *   founder's slots, its device role), then Apply after a typed word; the owner PIN first when
 *   this phone has one. Cancel changes nothing.
 * The "Backup due" banner is the shell's, from useSetupState().backupDue.
 */
import { useRef, useState } from 'react';
import { Button, Row, RowList } from '../../components/ui';
import type { VerifiedBackup } from '../../core/backupFile';
import { importBackup } from '../../core/backupImport';
import { ownerPassActive } from '../../core/pin';
import { BACKUP_REMINDER_DAYS } from '../../schemas';
import { useSetupState } from './hooks';
import { nextRestoreView, restoreBlocker, restoreRoleNote, type RestoreEvent, type RestoreView } from './restoreFlow';
import { RESTORE_WORD } from './roleFlow';
import { BackupFileReader } from './ui/BackupFileReader';
import { BackupNow } from './ui/BackupNow';
import { BackupSummary } from './ui/BackupSummary';
import { formatWhen, roleWords } from './ui/format';
import { PinGate } from './ui/PinGate';
import { Actions, Screen, Section, StatusLine } from './ui/Screen';
import { TypedConfirm } from './ui/TypedConfirm';

export const INSTALLED_APP_NOTE =
  'On iPhone, make backups from the installed Home Screen app: the share sheet works there. A download link inside the installed app can leave you on a screen with no way back, so the app never uses one there.';

const DAY_MS = 24 * 60 * 60 * 1000;

function nextDue(lastBackupAt: string | null): string {
  if (lastBackupAt === null) return 'Due now';
  const last = Date.parse(lastBackupAt);
  if (Number.isNaN(last)) return 'Due now';
  return `Next due ${formatWhen(new Date(last + BACKUP_REMINDER_DAYS * DAY_MS).toISOString())}`;
}

export function BackupScreen() {
  const setup = useSetupState();
  const [view, setView] = useState<RestoreView>('idle');
  const viewRef = useRef<RestoreView>('idle');
  const [backup, setBackup] = useState<VerifiedBackup | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  function send(event: RestoreEvent): boolean {
    const next = nextRestoreView(viewRef.current, event);
    if (next === null) return false;
    if (next === 'idle') {
      setBackup(null);
      setError(null);
    }
    viewRef.current = next;
    setView(next);
    return true;
  }

  async function restore(verified: VerifiedBackup) {
    const outcome = await importBackup(verified, { path: 'restore', confirmed: true });
    if (outcome.ok) {
      const c = outcome.counters;
      setResult(
        `Restored. This phone now has ${c.jobs} jobs, ${c.carsLogged} cars toward 25, and ${c.founderSlotsUsed} founder's slots used. Device role: ${roleWords(outcome.deviceRole)}.`,
      );
      send('DONE');
      return;
    }
    setError(outcome.message);
    send('FAILED');
  }

  function apply() {
    if (backup === null) return;
    if (setup.pinExists && !ownerPassActive()) {
      send('APPLY_NEEDS_PIN');
      return;
    }
    if (send('APPLY')) void restore(backup);
  }

  const blocker = backup === null ? null : restoreBlocker({ phoneRole: setup.deviceRole, fileRole: backup.summary.deviceRole });
  const roleNote = backup === null ? null : restoreRoleNote({ phoneRole: setup.deviceRole, fileRole: backup.summary.deviceRole });

  return (
    <Screen title="Backup and restore" eyebrow="Settings" back={{ to: '/settings', label: 'Back to Settings' }}>
      {setup.storageProblem ? <StatusLine tone="warning">{setup.storageProblem}</StatusLine> : null}

      <Section title="Make a backup" index={1} intro={<p>Everything on this phone in one file: jobs, photos, crew progress, and settings. Save it to Files (iCloud Drive) or Mail it to yourself.</p>}>
        <BackupNow buttonLabel="Save backup" />
        <p className="ui-muted">{INSTALLED_APP_NOTE}</p>
      </Section>

      <Section title="Last backup" index={2}>
        <RowList label="Backup status">
          <Row as="li" title="Last backup" detail={formatWhen(setup.lastBackupAt)} />
          <Row
            as="li"
            title={`Weekly reminder: ${setup.reminderOn ? 'on' : 'off'}`}
            detail={setup.reminderOn ? nextDue(setup.lastBackupAt) : 'Turns on when the owner PIN is created.'}
          />
        </RowList>
      </Section>

      <Section title="Restore from a file" index={3} intro={<p>Replaces everything on this phone with a backup. You see what the file holds before anything changes.</p>}>
        {view === 'idle' ? (
          <Actions>
            <Button onClick={() => send('START')}>Restore from a file</Button>
          </Actions>
        ) : null}

        {view === 'pick' ? (
          <BackupFileReader
            onVerified={(verified) => {
              setBackup(verified);
              setError(null);
              send('FILE_OK');
            }}
            onCancel={() => send('CANCEL')}
          />
        ) : null}

        {(view === 'confirm' || view === 'pin' || view === 'restoring') && backup !== null ? (
          <div className="mc-section">
            <BackupSummary summary={backup.summary} />
            {error !== null ? <StatusLine tone="warning">{error} Nothing changed.</StatusLine> : null}
            {blocker !== null ? <StatusLine tone="warning">{blocker}</StatusLine> : null}
            {roleNote !== null ? <StatusLine>{roleNote}</StatusLine> : null}
            {view === 'pin' ? (
              <PinGate
                label="This phone has an owner PIN. Enter it to replace its data."
                onSuccess={() => {
                  if (send('PIN_OK')) void restore(backup);
                }}
                onCancel={() => send('CANCEL')}
              />
            ) : blocker !== null ? (
              <Actions>
                <Button variant="ghost" onClick={() => send('CANCEL')}>
                  Cancel
                </Button>
              </Actions>
            ) : (
              <>
                <p>Apply replaces everything on this phone with this backup.</p>
                <TypedConfirm word={RESTORE_WORD} actionLabel="Apply" busy={view === 'restoring'} onConfirm={apply} onCancel={() => send('CANCEL')} />
              </>
            )}
          </div>
        ) : null}

        {view === 'done' ? (
          <div className="mc-section">
            <StatusLine tone="success">{result ?? 'Restored.'}</StatusLine>
            <Actions>
              <Button onClick={() => send('CLOSE')}>Done</Button>
            </Actions>
          </div>
        ) : null}
      </Section>
    </Screen>
  );
}
