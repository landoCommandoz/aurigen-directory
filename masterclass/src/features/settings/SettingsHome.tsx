/**
 * /settings: the Settings home. Setup, device role, backup and restore, the thumb side (left by
 * default, Lando 2026-10-10), read-aloud and keep-screen-on preferences, the owner PIN line with
 * the honesty sentence (D4), and Developer tools (dev builds: always on; production: behind the
 * owner PIN, logged).
 */
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, Drawer, Row, RowList, SegmentedControl } from '../../components/ui';
import { updateSettings } from '../../core/db';
import { testVoice } from '../../core/speech';
import { useSettings } from '../../core/settingsStore';
import { isDevBuild, setDeveloperToggle } from './devTools';
import { SETUP_STEP_WORDS, setHandedness, useSetupState, type Handedness } from './hooks';
import { PIN_HONESTY } from './SetupFlow';
import { formatWhen, roleWords } from './ui/format';
import { PinGate } from './ui/PinGate';
import { Actions, Screen, Section, StatusLine } from './ui/Screen';

type OnOff = 'on' | 'off';
const ON_OFF = [
  { value: 'off', label: 'Off' },
  { value: 'on', label: 'On' },
] as const;

export function SettingsHome() {
  const navigate = useNavigate();
  const setup = useSetupState();
  const snapshot = useSettings();
  const settings = snapshot.settings;
  const [problem, setProblem] = useState<string | null>(null);
  const [voiceNote, setVoiceNote] = useState<string | null>(null);
  const [devPinFor, setDevPinFor] = useState<boolean | null>(null);
  const dev = isDevBuild();

  async function save(patch: Parameters<typeof updateSettings>[0]) {
    setProblem(null);
    try {
      await updateSettings(patch);
    } catch (error) {
      setProblem(error instanceof Error ? error.message : 'The setting could not be saved.');
    }
  }

  async function changeHand(next: Handedness) {
    setProblem(await setHandedness(next));
  }

  async function writeDevToggle(on: boolean) {
    const result = await setDeveloperToggle(on);
    setDevPinFor(null);
    setProblem(result.ok ? null : result.message);
  }

  function voice() {
    const result = testVoice();
    setVoiceNote(result.ok ? 'Speaking a test sentence. Turn the ringer and volume up if you hear nothing.' : result.message);
  }

  return (
    <Screen title="Settings" back={{ to: '/', label: 'Home' }}>
      {setup.storageProblem ? <StatusLine tone="warning">{setup.storageProblem}</StatusLine> : null}
      {problem !== null ? <StatusLine tone="warning">{problem}</StatusLine> : null}

      <Section title="This phone" index={1}>
        <RowList label="Setup and data">
          <Row as="li" title="Setup" detail={setup.ready ? SETUP_STEP_WORDS[setup.step] : 'Loading'} trailing="Open" onClick={() => navigate('/settings/setup')} />
          <Row as="li" title="Device role" detail={roleWords(setup.deviceRole)} trailing="Open" onClick={() => navigate('/settings/device')} />
          <Row as="li" title="Backup and restore" detail={`Last backup: ${formatWhen(setup.lastBackupAt)}`} trailing="Open" onClick={() => navigate('/settings/backup')} />
        </RowList>
      </Section>

      <Section title="Thumb side" index={2} intro={<p>Where the one action area sits while you work. Left is the default: polisher in the right hand, left thumb taps.</p>}>
        <SegmentedControl
          label="Thumb side"
          value={settings?.handedness ?? 'left'}
          disabled={settings === null}
          onChange={(next) => void changeHand(next)}
          options={[
            { value: 'left', label: 'Left' },
            { value: 'right', label: 'Right' },
          ]}
        />
      </Section>

      <Section title="Read aloud" index={3} intro={<p>Reads each step out loud in Shop Mode (Phase 3). Uses the phone's own voice; no download.</p>}>
        <SegmentedControl<OnOff>
          label="Read steps aloud"
          value={settings?.readAloud === true ? 'on' : 'off'}
          disabled={settings === null}
          onChange={(next) => void save({ readAloud: next === 'on' })}
          options={ON_OFF}
        />
        <Actions>
          <Button onClick={voice}>Test voice</Button>
        </Actions>
        {voiceNote !== null ? <p className="ui-muted" aria-live="polite">{voiceNote}</p> : null}
      </Section>

      <Section title="Keep the screen on" index={4} intro={<p>While a stage runs, the app asks the phone to stay awake (iOS 18.4 or newer in the Home Screen app).</p>}>
        <SegmentedControl<OnOff>
          label="Keep the screen on during a stage"
          value={settings?.wakeLock === false ? 'off' : 'on'}
          disabled={settings === null}
          onChange={(next) => void save({ wakeLock: next === 'on' })}
          options={ON_OFF}
        />
      </Section>

      <Section title="Owner PIN" index={5} intro={<p>{PIN_HONESTY}</p>}>
        <RowList label="Owner PIN">
          <Row as="li" title={setup.pinExists ? 'Owner PIN is set' : 'No owner PIN yet'} detail={setup.pinExists ? `Set ${formatWhen(setup.pinSetAt)}` : 'Set it from Setup.'} />
        </RowList>
        <Actions>
          <Button onClick={() => navigate('/settings/setup')}>{setup.pinExists ? 'Change PIN' : 'Set the owner PIN'}</Button>
        </Actions>
      </Section>

      <Section title="Developer tools" index={6} intro={<p>The developer panel and the device preview. Removable before the final deploy.</p>}>
        {dev ? (
          <p className="ui-muted">On in this test build.</p>
        ) : (
          <SegmentedControl<OnOff>
            label="Developer tools"
            value={settings?.developerPanel === true ? 'on' : 'off'}
            disabled={settings === null || !setup.pinExists}
            onChange={(next) => setDevPinFor(next === 'on')}
            options={ON_OFF}
          />
        )}
        {!dev && !setup.pinExists ? <p className="ui-muted">Set the owner PIN first. The toggle needs it.</p> : null}
        {dev || settings?.developerPanel === true ? (
          <Actions>
            <Button onClick={() => navigate('/settings/developer')}>Open the developer panel</Button>
          </Actions>
        ) : null}
      </Section>

      <Drawer open={devPinFor !== null} onClose={() => setDevPinFor(null)} title="Developer tools" eyebrow="Owner PIN">
        {devPinFor !== null ? (
          <PinGate
            label={devPinFor ? 'Enter the owner PIN to turn Developer tools on' : 'Enter the owner PIN to turn Developer tools off'}
            onSuccess={() => void writeDevToggle(devPinFor)}
            onCancel={() => setDevPinFor(null)}
          />
        ) : null}
      </Drawer>
    </Screen>
  );
}
