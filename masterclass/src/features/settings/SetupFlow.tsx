/**
 * /settings/setup: the setup flow (D12). Straight in, never blocking: it shows the three steps
 * (role, owner PIN, first backup) and runs the next one. Creating the PIN saves the hash and turns
 * the weekly reminder on in one write (core setPin), and the next screen is "Save your first
 * backup" right then: one tap opens the share sheet. Cancel at every step before the save returns
 * to Settings with nothing changed. A second visit with a PIN offers Change PIN (needs the current
 * PIN) and Make a backup now.
 */
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, Row, RowList } from '../../components/ui';
import { chooseStudy } from '../../core/deviceRole';
import { setPin } from '../../core/pin';
import { useSetupState } from './hooks';
import { nextSetupView, type SetupEvent, type SetupView } from './setupFlow';
import { BackupNow } from './ui/BackupNow';
import { formatWhen, roleWords } from './ui/format';
import { NewPinEntry, PinGate } from './ui/PinGate';
import { Actions, Screen, Section, StatusLine } from './ui/Screen';

export const PIN_HONESTY = 'This PIN keeps honest people honest. It is not real security.';

export function SetupFlow() {
  const navigate = useNavigate();
  const setup = useSetupState();
  const [view, setView] = useState<SetupView>('overview');
  const viewRef = useRef<SetupView>('overview');
  const [saveError, setSaveError] = useState<string | undefined>(undefined);
  const [notice, setNotice] = useState<string | null>(null);
  const [roleBusy, setRoleBusy] = useState(false);
  const [firstBackup, setFirstBackup] = useState(false);
  const [backedUp, setBackedUp] = useState(false);

  /** Apply one event from the table. A tap that does not apply here (doubled, stale) does nothing. */
  function send(event: SetupEvent): boolean {
    const next = nextSetupView(viewRef.current, event);
    if (next === null) return false;
    if (next === 'exit') {
      navigate('/settings');
      return true;
    }
    viewRef.current = next;
    setView(next);
    return true;
  }

  async function savePin(pin: string) {
    if (!send('PIN_CONFIRMED')) return;
    setSaveError(undefined);
    const result = await setPin(pin);
    if (result.ok) {
      setFirstBackup(result.firstPin || setup.lastBackupAt === null);
      setNotice(result.firstPin ? 'Owner PIN saved. The weekly backup reminder is on.' : 'Owner PIN changed.');
      send('SAVED');
      return;
    }
    setSaveError(result.message);
    send('SAVE_FAILED');
  }

  async function study() {
    if (roleBusy) return;
    setRoleBusy(true);
    const result = await chooseStudy();
    setRoleBusy(false);
    setNotice(result.ok ? 'Saved: this is a study phone. Next, set the owner PIN.' : result.message);
  }

  const back = { to: '/settings', label: 'Back to Settings' };

  if (view === 'verifyCurrent') {
    return (
      <Screen title="Change the owner PIN" eyebrow="Setup" back={back}>
        <Section index={1}>
          <PinGate label="Enter the current owner PIN" skipIfPassActive={false} onSuccess={() => send('CURRENT_OK')} onCancel={() => send('CANCEL')} />
        </Section>
      </Screen>
    );
  }

  if (view === 'pinNew' || view === 'pinSaving') {
    return (
      <Screen title={setup.pinExists ? 'New owner PIN' : 'Create the owner PIN'} eyebrow="Setup" back={back} lede="6 digits. You will enter it twice. It is stored scrambled and never shown again.">
        <Section index={1}>
          <NewPinEntry busy={view === 'pinSaving'} error={saveError} onComplete={(pin) => void savePin(pin)} onCancel={() => send('CANCEL')} />
          <p className="ui-muted">{PIN_HONESTY}</p>
        </Section>
      </Screen>
    );
  }

  if (view === 'backup') {
    return (
      <Screen title={firstBackup ? 'Save your first backup' : 'Make a backup now'} eyebrow="Setup" back={back}>
        {notice ? <StatusLine tone="success">{notice}</StatusLine> : null}
        <Section index={1} intro={<p>One tap opens the share sheet. Pick Save to Files (iCloud Drive) or Mail it to yourself, so a copy lives off this phone.</p>}>
          <BackupNow
            buttonLabel={firstBackup ? 'Save your first backup' : 'Save backup'}
            onDone={() => setBackedUp(true)}
            {...(backedUp ? {} : { onNotNow: () => send('NOT_NOW') })}
          />
          {backedUp ? (
            <Actions>
              <Button
                size="shop"
                onClick={() => {
                  setNotice('Backup saved. The weekly reminder counts from now.');
                  setBackedUp(false);
                  send('BACKUP_DONE');
                }}
              >
                Done
              </Button>
            </Actions>
          ) : (
            <p className="ui-muted">If the share sheet closes without saving, the setup banner stays on this step and the backup reminder is due now.</p>
          )}
        </Section>
      </Screen>
    );
  }

  const done = setup.step === 'done';
  return (
    <Screen title="Setup" eyebrow="Settings" back={back} lede={done ? 'Setup is done. The weekly backup reminder keeps you honest.' : 'Three steps. Nothing here blocks the rest of the app.'}>
      {setup.storageProblem ? <StatusLine tone="warning">{setup.storageProblem}</StatusLine> : null}
      {notice ? <StatusLine>{notice}</StatusLine> : null}
      <Section title="1. Is this the shop phone?" index={1} intro={<p>The shop phone holds the jobs and the counts. Every other phone is a study phone.</p>}>
        <RowList label="Device role">
          <Row as="li" title={roleWords(setup.deviceRole)} detail={setup.roleChosen ? 'Chosen' : 'Not chosen yet. Every phone starts as a study phone.'} />
        </RowList>
        {!setup.roleChosen ? (
          <Actions>
            <Button onClick={() => void study()} loading={roleBusy} loadingLabel="Saving">
              This is a study phone
            </Button>
            <Button onClick={() => navigate('/settings/device')}>This is the shop phone</Button>
          </Actions>
        ) : null}
      </Section>
      <Section title="2. Set the owner PIN" index={2} intro={<p>{PIN_HONESTY}</p>}>
        <RowList label="Owner PIN">
          <Row as="li" title={setup.pinExists ? 'Owner PIN is set' : 'No owner PIN yet'} detail={setup.pinExists ? `Set ${formatWhen(setup.pinSetAt)}` : 'Creating it turns on the weekly backup reminder.'} />
        </RowList>
        <Actions>
          {setup.pinExists ? (
            <Button onClick={() => send('CHANGE_PIN')}>Change PIN</Button>
          ) : (
            <Button variant="primary" onClick={() => send('CREATE_PIN')} disabled={!setup.ready}>
              Create the owner PIN
            </Button>
          )}
        </Actions>
      </Section>
      <Section title="3. Save your first backup" index={3}>
        <RowList label="Backups">
          <Row
            as="li"
            title={setup.lastBackupAt ? 'Last backup' : 'No backup yet'}
            detail={setup.lastBackupAt ? formatWhen(setup.lastBackupAt) : setup.pinExists ? 'Due now.' : 'Set the owner PIN first. The first backup happens right after it.'}
          />
        </RowList>
        <Actions>
          <Button
            variant={setup.pinExists && !setup.lastBackupAt ? 'primary' : 'secondary'}
            disabled={!setup.pinExists}
            onClick={() => {
              setFirstBackup(setup.lastBackupAt === null);
              send('BACKUP_NOW');
            }}
          >
            {setup.lastBackupAt ? 'Make a backup now' : 'Save your first backup'}
          </Button>
        </Actions>
      </Section>
    </Screen>
  );
}
