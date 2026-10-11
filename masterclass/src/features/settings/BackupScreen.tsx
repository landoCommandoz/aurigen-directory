/**
 * /settings/backup: Backup and restore (D3, D12).
 * Make a backup: the share sheet (a download only where that is safe, never inside the installed
 *   iPhone app), with Copy backup text as the fallback. Never refused because this phone's
 *   settings cannot be read (DEF-13); this screen then says so in the architect's words and never
 *   tells the person to open Backup.
 * Restore from a file: pick or paste, check, then core's restore plan (previewRestore): this
 *   phone's counts first, then what the file holds, the plan's words and flags, then Apply after a
 *   typed word; the owner PIN first when this phone has a readable one; a backup of this phone
 *   offered first when its own settings are unreadable. Cancel changes nothing.
 * The "Backup due" banner is the shell's, from useSetupState().backupDue.
 */
import { useRef, useState } from 'react';
import { Button, Row, RowList } from '../../components/ui';
import type { VerifiedBackup } from '../../core/backupFile';
import { importBackup } from '../../core/backupImport';
import { ownerPassActive } from '../../core/pin';
import { previewRestore, type RestorePreview } from '../../core/restorePreview';
import { BACKUP_REMINDER_DAYS } from '../../schemas';
import { useSetupState } from './hooks';
import { nextRestoreView, type RestoreEvent, type RestoreView } from './restoreFlow';
import { BackupFileReader } from './ui/BackupFileReader';
import { BackupNow } from './ui/BackupNow';
import { formatWhen, roleWords } from './ui/format';
import { RestoreConfirm } from './ui/RestoreConfirm';
import { Actions, Screen, Section, StatusLine } from './ui/Screen';

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
  /** The file on the confirm now; a plan that arrives for another file is dropped. */
  const current = useRef<VerifiedBackup | null>(null);
  const [preview, setPreview] = useState<RestorePreview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  function send(event: RestoreEvent): boolean {
    const next = nextRestoreView(viewRef.current, event);
    if (next === null) return false;
    if (next === 'idle') {
      current.current = null;
      setBackup(null);
      setPreview(null);
      setError(null);
    }
    viewRef.current = next;
    setView(next);
    return true;
  }

  async function plan(verified: VerifiedBackup) {
    const next = await previewRestore(verified, 'restore');
    // Only if the person is still on this file's confirm (not Cancel, and not another file since).
    if (current.current === verified) setPreview(next);
  }

  function picked(verified: VerifiedBackup) {
    if (!send('FILE_OK')) return;
    current.current = verified;
    setBackup(verified);
    setError(null);
    setPreview(null);
    void plan(verified);
  }

  async function restore(verified: VerifiedBackup, backupOffered: boolean) {
    const outcome = await importBackup(verified, { path: 'restore', confirmed: true, backupOffered });
    if (outcome.ok) {
      const c = outcome.counters;
      const recheck = outcome.plan.signOffs.comeBack === 'needsRecheck' && outcome.plan.signOffs.rows > 0 ? ` ${outcome.plan.signOffs.rows} sign-offs are marked needs re-check.` : '';
      const setupAgain = outcome.plan.settingsFrom === 'fresh' ? ' Set this phone up again from the setup banner.' : '';
      setResult(
        `Restored. This phone now has ${c.jobs} jobs, ${c.carsLogged} cars toward 25, and ${c.founderSlotsUsed} founder's slots used. Device role: ${roleWords(outcome.deviceRole)}.${recheck}${setupAgain}`,
      );
      send('DONE');
      return;
    }
    setError(outcome.message);
    send('FAILED');
    // The phone may have changed under the screen: plan again from what it holds now.
    void plan(verified);
  }

  function apply() {
    if (backup === null || preview === null || !preview.ok || !preview.plan.ok) return;
    const backupOffered = preview.plan.needs.backupFirst;
    if (preview.plan.needs.ownerPass && !ownerPassActive()) {
      send('APPLY_NEEDS_PIN');
      return;
    }
    if (send('APPLY')) void restore(backup, backupOffered);
  }

  function pinOk() {
    if (backup === null || preview === null || !preview.ok || !preview.plan.ok) return;
    if (send('PIN_OK')) void restore(backup, preview.plan.needs.backupFirst);
  }

  // A settings row this screen cannot read is said by BackupNow in its own words (text A); the
  // shared message points at this very screen, so it never shows here.
  const topProblem = setup.storageProblem !== null && !setup.settingsUnreadable ? setup.storageProblem : null;
  const confirming = view === 'confirm' || view === 'pin' || view === 'restoring';

  return (
    <Screen title="Backup and restore" eyebrow="Settings" back={{ to: '/settings', label: 'Back to Settings' }}>
      {topProblem !== null ? <StatusLine tone="warning">{topProblem}</StatusLine> : null}

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

        {view === 'pick' ? <BackupFileReader onVerified={picked} onCancel={() => send('CANCEL')} /> : null}

        {confirming && backup !== null && preview === null ? (
          <div className="mc-section">
            <p className="ui-muted" aria-live="polite">
              Checking this phone
            </p>
            <Actions>
              <Button variant="ghost" onClick={() => send('CANCEL')}>
                Cancel
              </Button>
            </Actions>
          </div>
        ) : null}

        {confirming && preview !== null && !preview.ok ? (
          <div className="mc-section">
            <StatusLine tone="warning">{preview.message} Nothing changed.</StatusLine>
            <Actions>
              <Button variant="ghost" onClick={() => send('CANCEL')}>
                Cancel
              </Button>
            </Actions>
          </div>
        ) : null}

        {confirming && preview !== null && preview.ok ? (
          <RestoreConfirm preview={preview} view={view} error={error} onApply={apply} onPinOk={pinOk} onCancel={() => send('CANCEL')} />
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
