/**
 * Developer panel: live state readouts (BLUEPRINT 2.1 and 3, Phase 1 device checklist).
 * Every value comes from a core store or the live settings snapshot, so it updates as it changes.
 */
import { useEffect, useState } from 'react';
import { config } from '../../../app/config';
import { connectivityLabel, useConnectivity } from '../../../core/connectivity';
import { contentStatus } from '../../../core/content';
import { useCustomerView } from '../../../core/customerView';
import { useDbStatus, type DbStatus } from '../../../core/db';
import { RecordInvalid } from '../../../core/errors';
import { ownerPassRemainingMs, usePinStatus } from '../../../core/pin';
import { isStandalone } from '../../../core/platform';
import { usePwaStatus } from '../../../core/pwa';
import { useSearchStatus } from '../../../core/search';
import { useSettings } from '../../../core/settingsStore';
import { SETUP_STEP_WORDS, useSetupState } from '../hooks';
import { formatRemaining, formatWhen, roleWords, yesNo } from '../ui/format';
import { Readouts } from '../ui/Readouts';
import { Section } from '../ui/Screen';
import { parseIosVersion } from './devReadouts';

export const STATE_LABELS = {
  role: 'Device role',
  pin: 'Owner PIN set',
  pass: 'Owner pass active',
  setup: 'Setup step',
  lastBackup: 'Last backup',
  reminder: 'Weekly backup reminder',
  standalone: 'Running as the Home Screen app',
  ios: 'iOS version (user agent)',
  network: 'Online or offline',
  sw: 'Service worker',
  offlineReady: 'Ready offline',
  update: 'Update available',
  reload: 'Reload waiting for a quiet moment',
  swCheck: 'Last update check',
  swError: 'Offline helper error',
  db: 'Database',
  customerView: 'Customer View',
  customerViewHint: 'Customer View at launch (first frame)',
  settingsRecord: 'Settings record',
  focus: 'Focus reminder shown',
  hand: 'Thumb side',
  base: 'Base path',
  version: 'App version',
  build: 'Build',
  content: 'Content bundle',
  search: 'Search index',
  job: 'Job state',
} as const;

const HINT_WORDS = { on: 'On (top bar held)', off: 'Off', unknown: 'Not known (top bar held until settings are read)' } as const;

/** The settings row as this version read it (DEF-08): read, read with newer fields ignored, or unreadable. */
function settingsRecordWords(snapshot: ReturnType<typeof useSettings>, db: DbStatus): string {
  if (snapshot.status === 'loading') return 'Loading';
  if (snapshot.status === 'unavailable') {
    return snapshot.error instanceof RecordInvalid ? `Cannot be read as is: ${snapshot.error.issues.slice(0, 3).join('; ')}` : 'Storage unavailable';
  }
  return db.ignoredSettingsFields.length > 0 ? `Read. Fields from a newer version, ignored: ${db.ignoredSettingsFields.join(', ')}` : 'Read';
}

function useSecondTick(active: boolean): void {
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!active) return undefined;
    const timer = window.setInterval(() => setTick((n) => n + 1), 1000);
    return () => window.clearInterval(timer);
  }, [active]);
}

function userAgent(): { ua: string; touch: number } {
  try {
    return { ua: navigator.userAgent, touch: navigator.maxTouchPoints ?? 0 };
  } catch {
    return { ua: '', touch: 0 };
  }
}

export function StateReadouts() {
  const setup = useSetupState();
  const snapshot = useSettings();
  const pin = usePinStatus();
  const pwa = usePwaStatus();
  const db = useDbStatus();
  const network = useConnectivity();
  const cv = useCustomerView();
  const search = useSearchStatus();
  const passLeft = ownerPassRemainingMs();
  useSecondTick(passLeft > 0);
  const { ua, touch } = userAgent();
  const content = contentStatus();
  const s = snapshot.settings;

  return (
    <>
      <Section title="This phone" index={1}>
        <Readouts
          label="Device state"
          items={[
            { label: STATE_LABELS.role, value: `${roleWords(setup.deviceRole)}${setup.roleChosen ? '' : ' (not chosen yet)'}` },
            { label: STATE_LABELS.pin, value: setup.pinExists ? `Yes, set ${formatWhen(setup.pinSetAt)}` : 'No' },
            { label: STATE_LABELS.pass, value: passLeft > 0 ? `Yes, ${formatRemaining(passLeft)} left` : pin.lockedUntilWall !== null ? 'No (PIN entry locked)' : 'No' },
            { label: STATE_LABELS.setup, value: setup.ready ? SETUP_STEP_WORDS[setup.step] : 'Loading' },
            { label: STATE_LABELS.lastBackup, value: formatWhen(setup.lastBackupAt) },
            { label: STATE_LABELS.reminder, value: `${setup.reminderOn ? 'On' : 'Off'}${setup.backupDue ? ', due now' : ''}` },
            { label: STATE_LABELS.standalone, value: yesNo(isStandalone()) },
            { label: STATE_LABELS.ios, value: `${parseIosVersion(ua, touch)}. Confirm in Settings, General, About.` },
            { label: STATE_LABELS.customerView, value: cv.ready ? (cv.on ? 'On' : 'Off') : 'Loading' },
            { label: STATE_LABELS.customerViewHint, value: HINT_WORDS[cv.hint] },
            { label: STATE_LABELS.settingsRecord, value: settingsRecordWords(snapshot, db) },
            { label: STATE_LABELS.focus, value: s === null ? 'Loading' : s.focusReminderShown ? 'Yes, for this switch-on' : 'No' },
            { label: STATE_LABELS.hand, value: s?.handedness === 'right' ? 'Right' : 'Left' },
            { label: STATE_LABELS.job, value: 'No job engine yet. The Job Runner arrives in Phase 3.' },
          ]}
        />
      </Section>
      <Section title="Offline copy and updates" index={2}>
        <Readouts
          label="Offline state"
          items={[
            { label: STATE_LABELS.network, value: connectivityLabel(network, pwa.offlineReady) },
            { label: STATE_LABELS.sw, value: pwa.supported ? `${pwa.registered ? 'Registered' : 'Not registered'}, state ${pwa.state}` : 'Not supported here' },
            { label: STATE_LABELS.offlineReady, value: yesNo(pwa.offlineReady) },
            { label: STATE_LABELS.update, value: yesNo(pwa.state === 'updateAvailable') },
            { label: STATE_LABELS.reload, value: yesNo(pwa.reloadPending) },
            { label: STATE_LABELS.swCheck, value: formatWhen(pwa.lastCheckAt) },
            { label: STATE_LABELS.swError, value: pwa.lastError ?? 'None' },
            { label: STATE_LABELS.db, value: db.state === 'unavailable' ? `Unavailable: ${db.message ?? db.problem ?? 'unknown'}` : db.state === 'open' ? 'Open' : 'Not opened yet' },
          ]}
        />
      </Section>
      <Section title="Build and content" index={3}>
        <Readouts
          label="Build"
          items={[
            { label: STATE_LABELS.base, value: import.meta.env.BASE_URL },
            { label: STATE_LABELS.version, value: config.version },
            { label: STATE_LABELS.build, value: import.meta.env.DEV ? 'Development' : 'Production' },
            { label: STATE_LABELS.content, value: content.built ? `${content.items} items, ${content.signOffs} sign-off files` : (content.problem ?? 'Not built') },
            {
              label: STATE_LABELS.search,
              value:
                search.state === 'ready'
                  ? `${search.docs} documents (${search.source}), loaded in ${Math.round(search.loadMs ?? 0)} ms${search.lastQueryMs !== null ? `, last query ${search.lastQueryMs.toFixed(1)} ms` : ''}`
                  : search.state === 'loading'
                    ? 'Loading'
                    : 'Not loaded yet (loads on first search)',
            },
          ]}
        />
      </Section>
    </>
  );
}
