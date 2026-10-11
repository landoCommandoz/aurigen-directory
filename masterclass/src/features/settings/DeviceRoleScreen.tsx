/**
 * /settings/device: the device role screen (BLUEPRINT 3.9, D12). Shows the role in plain words and
 * runs the only ways to change it:
 *   "This is the shop phone": off until an owner PIN exists; then the PIN, then a choice screen with
 *     Import, Start fresh, and Cancel, then core becomeShop with that path.
 *   "Make this the shop phone from a backup": pick, check, show the counts, "Is this the newest
 *     backup from the shop phone?", then the import (the role and PIN come with the backup).
 *   "Start fresh": the warning, the typed word, the PIN (created or entered), then core startFresh.
 *   "Make this a study phone": the owner PIN, then core demoteToStudy.
 * Every write and its audit entries happen inside core, in one transaction.
 */
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../../components/ui';
import type { VerifiedBackup } from '../../core/backupFile';
import { becomeShop, chooseStudy, demoteToStudy, startFresh } from '../../core/deviceRole';
import { ownerPassActive } from '../../core/pin';
import { START_FRESH_WARNING } from '../../schemas';
import { useSetupState } from './hooks';
import { RoleOverview, START_FRESH_RESETS } from './RoleOverview';
import { nextRoleView, START_FRESH_WORD, type RoleEvent, type RoleView } from './roleFlow';
import { BackupFileReader } from './ui/BackupFileReader';
import { BackupNow } from './ui/BackupNow';
import { BackupSummary } from './ui/BackupSummary';
import { NewPinEntry, PinGate } from './ui/PinGate';
import { Actions, Screen, Section, StatusLine } from './ui/Screen';
import { TypedConfirm } from './ui/TypedConfirm';

interface Outcome {
  message: string;
  firstBackup: boolean;
}

export function DeviceRoleScreen() {
  const navigate = useNavigate();
  const setup = useSetupState();
  const [view, setView] = useState<RoleView>('overview');
  const viewRef = useRef<RoleView>('overview');
  const [backup, setBackup] = useState<VerifiedBackup | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [studyBusy, setStudyBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  /** Apply one event from the table; a tap that does not apply here changes nothing. */
  function send(event: RoleEvent): boolean {
    const next = nextRoleView(viewRef.current, event);
    if (next === null) return false;
    if (next === 'overview') {
      setBackup(null);
      setError(null);
    }
    viewRef.current = next;
    setView(next);
    return true;
  }

  async function runImport(verified: VerifiedBackup) {
    const result = await becomeShop({ path: 'importBackup', backup: verified, confirmedNewest: true });
    if (result.ok) {
      setOutcome({
        message: `This is now the shop phone, with ${verified.summary.jobs} jobs and ${verified.summary.carsLogged} cars toward 25 from the backup. The owner PIN came with it. Next: on the old phone, open Settings, Device role, and tap Make this a study phone.`,
        firstBackup: false,
      });
      send('DONE');
      return;
    }
    setError(result.message);
    send('FAILED');
  }

  async function runFresh(newPin?: string) {
    const result = await startFresh({ warningAccepted: true, ...(newPin === undefined ? {} : { newPin }) });
    if (result.ok) {
      setOutcome({
        message: 'This is now the shop phone. Jobs, cars toward 25, and founder\'s slots start at zero. The weekly backup reminder is on.',
        firstBackup: newPin !== undefined || setup.lastBackupAt === null,
      });
      send('DONE');
      return;
    }
    setError(result.message);
    send('FAILED');
  }

  async function runStudy() {
    const result = await demoteToStudy();
    if (result.ok) {
      setOutcome({ message: 'This is now a study phone. The jobs stay in storage, and no job screens show.', firstBackup: false });
      send('DONE');
      return;
    }
    setNotice(result.message);
    send('FAILED');
  }

  async function study() {
    if (studyBusy) return;
    setStudyBusy(true);
    const result = await chooseStudy();
    setStudyBusy(false);
    setNotice(result.ok ? 'Saved: this is a study phone.' : result.message);
  }

  function confirmNewest() {
    if (backup === null) return;
    const needsPin = setup.pinExists && !ownerPassActive();
    if (needsPin) {
      send('CONFIRM_NEEDS_PIN');
      return;
    }
    if (send('CONFIRM')) void runImport(backup);
  }

  function freshWordTyped() {
    if (!setup.pinExists) {
      send('WORD_OK_NEW_PIN');
    } else if (!ownerPassActive()) {
      send('WORD_OK_NEEDS_PIN');
    } else if (send('WORD_OK')) {
      void runFresh();
    }
  }

  const back = { to: '/settings', label: 'Back to Settings' };
  const cancel = () => send('CANCEL');
  const errorLine = error !== null ? <StatusLine tone="warning">{error} Nothing changed.</StatusLine> : null;

  switch (view) {
    case 'shopPin':
      return (
        <Screen title="This is the shop phone" eyebrow="Device role" back={back}>
          <Section index={1}>
            <PinGate onSuccess={() => send('PIN_OK')} onCancel={cancel} />
          </Section>
        </Screen>
      );
    case 'shopChoice':
      return (
        <Screen title="How does this phone become the shop phone?" eyebrow="Device role" back={back} lede="Nothing has changed yet.">
          <Section index={1}>
            <Actions>
              <Button onClick={() => send('CHOOSE_IMPORT')}>Import the newest backup from the shop phone</Button>
              <Button onClick={() => send('CHOOSE_FRESH')}>Start fresh</Button>
              <Button variant="ghost" onClick={cancel}>
                Cancel
              </Button>
            </Actions>
          </Section>
        </Screen>
      );
    case 'importPick':
      return (
        <Screen title="Import the newest backup" eyebrow="Device role" back={back} lede="Pick the backup file from the shop phone. It is checked before anything changes.">
          <Section index={1}>
            <BackupFileReader
              onVerified={(verified) => {
                setBackup(verified);
                setError(null);
                send('FILE_OK');
              }}
              onCancel={cancel}
            />
          </Section>
        </Screen>
      );
    case 'importConfirm':
    case 'importPin':
    case 'importing':
      return (
        <Screen title="Is this the newest backup from the shop phone?" eyebrow="Device role" back={back}>
          {errorLine}
          {backup !== null ? (
            <Section index={1}>
              <BackupSummary summary={backup.summary} />
              {backup.summary.deviceRole !== 'shop' ? (
                <StatusLine tone="warning">This backup is from a study phone. Only a backup from the shop phone can make this the shop phone.</StatusLine>
              ) : null}
              <p className="ui-muted">Yes replaces everything on this phone with the backup, in one step.</p>
            </Section>
          ) : null}
          <Section index={2}>
            {view === 'importPin' ? (
              <PinGate label="This phone has an owner PIN. Enter it to replace its data." onSuccess={() => {
                  if (send('PIN_OK') && backup !== null) void runImport(backup);
                }} onCancel={cancel} />
            ) : (
              <Actions>
                <Button variant="primary" onClick={confirmNewest} loading={view === 'importing'} loadingLabel="Importing" disabled={backup === null || backup.summary.deviceRole !== 'shop'}>
                  Yes, this is the newest backup
                </Button>
                <Button variant="ghost" onClick={cancel} disabled={view === 'importing'}>
                  Cancel
                </Button>
              </Actions>
            )}
          </Section>
        </Screen>
      );
    case 'freshWarning':
    case 'freshing':
      return (
        <Screen title="Start fresh" eyebrow="Device role" back={back} lede={START_FRESH_WARNING}>
          {errorLine}
          <Section index={1}>
            <ul className="mc-list">
              {START_FRESH_RESETS.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <TypedConfirm word={START_FRESH_WORD} actionLabel="Start fresh" busy={view === 'freshing'} onConfirm={freshWordTyped} onCancel={cancel} />
          </Section>
        </Screen>
      );
    case 'freshPinNew':
      return (
        <Screen title="Create the owner PIN" eyebrow="Start fresh" back={back} lede="A shop phone always has an owner PIN. The PIN and the shop role are saved together.">
          <Section index={1}>
            <NewPinEntry onComplete={(pin) => {
                if (send('NEW_PIN')) void runFresh(pin);
              }} onCancel={cancel} />
          </Section>
        </Screen>
      );
    case 'freshPinVerify':
      return (
        <Screen title="Enter the owner PIN" eyebrow="Start fresh" back={back}>
          <Section index={1}>
            <PinGate onSuccess={() => {
                if (send('PIN_OK')) void runFresh();
              }} onCancel={cancel} />
          </Section>
        </Screen>
      );
    case 'studyPin':
    case 'studying':
      return (
        <Screen title="Make this a study phone" eyebrow="Device role" back={back}>
          <Section index={1}>
            {view === 'studyPin' ? <PinGate onSuccess={() => {
                  if (send('PIN_OK')) void runStudy();
                }} onCancel={cancel} /> : <StatusLine>Saving</StatusLine>}
          </Section>
        </Screen>
      );
    case 'result':
      return (
        <Screen title="Done" eyebrow="Device role" back={back}>
          <StatusLine tone="success">{outcome?.message ?? 'Saved.'}</StatusLine>
          {outcome?.firstBackup ? (
            <Section title="Save your first backup" index={1} intro={<p>One tap opens the share sheet. Save to Files (iCloud Drive) or Mail it to yourself.</p>}>
              <BackupNow buttonLabel="Save your first backup" />
            </Section>
          ) : null}
          <Actions>
            <Button onClick={() => send('BACK')}>Back to device role</Button>
            <Button variant="ghost" onClick={() => navigate('/settings')}>
              Back to Settings
            </Button>
          </Actions>
        </Screen>
      );
    case 'overview':
    default:
      return (
        <Screen title="Device role" eyebrow="Settings" back={back}>
          {setup.storageProblem ? <StatusLine tone="warning">{setup.storageProblem}</StatusLine> : null}
          {notice !== null ? <StatusLine>{notice}</StatusLine> : null}
          <RoleOverview setup={setup} send={send} onChooseStudy={() => void study()} studyBusy={studyBusy} />
        </Screen>
      );
  }
}
