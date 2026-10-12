/**
 * Developer panel: live state readouts (BLUEPRINT 2.1 and 3, Phase 1 device checklist).
 * Every value comes from a core store or the live settings snapshot, so it updates as it changes.
 */
import { useEffect, useState } from 'react';
import { config } from '../../../app/config';
import { connectivityLabel, useConnectivity } from '../../../core/connectivity';
import { contentStatus, contentStore, type ContentState } from '../../../core/content';
import { useCustomerView } from '../../../core/customerView';
import { useDbStatus, type DbStatus } from '../../../core/db';
import { RecordInvalid } from '../../../core/errors';
import { ownerPassRemainingMs, usePinStatus } from '../../../core/pin';
import { readPinGuard } from '../../../core/pinGuard';
import { isStandalone } from '../../../core/platform';
import { usePwaStatus, type OfflineCopyState } from '../../../core/pwa';
import { useSearchStatus, type SearchStatus } from '../../../core/search';
import { useSettings } from '../../../core/settingsStore';
import { useStore } from '../../../core/store';
import { SETUP_STEP_WORDS, useSetupState } from '../hooks';
import { formatRemaining, formatWhen, roleWords, yesNo } from '../ui/format';
import { Readouts } from '../ui/Readouts';
import { Section } from '../ui/Screen';
import { parseIosVersion } from './devReadouts';

export const STATE_LABELS = {
  role: 'Device role',
  pin: 'Owner PIN set',
  pass: 'Owner pass active',
  pinFails: 'Wrong PINs in a row (kept across reloads)',
  setup: 'Setup step',
  lastBackup: 'Last backup',
  reminder: 'Weekly backup reminder',
  standalone: 'Running as the Home Screen app',
  ios: 'iOS version (user agent)',
  network: 'Online or offline',
  sw: 'Service worker',
  offlineReady: 'Ready offline',
  offlineCopy: 'Offline copy for this page',
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
  contentShards: 'Content shards in memory',
  search: 'Search index',
  job: 'Job state',
} as const;

/** Which content shards are in memory, loading, or failed (DEF-17: loaded when a screen draws them). */
function shardWords(state: ContentState, total: number): string {
  if (!state.built) return 'None: no content build';
  const parts = [`${state.loaded.length} of ${total}${state.loaded.length > 0 ? ` (${state.loaded.join(', ')})` : ''}`];
  if (state.loading.length > 0) parts.push(`loading ${state.loading.join(', ')}`);
  const failed = Object.entries(state.failed)
    .filter(([, reason]) => reason !== undefined)
    .map(([name]) => `${name} (${state.failedDetail[name as keyof ContentState['failedDetail']] ?? 'no detail'})`);
  if (failed.length > 0) parts.push(`failed ${failed.join(', ')}`);
  const fresh = Object.entries(state.attempts).filter(([, n]) => (n ?? 0) > 0);
  if (fresh.length > 0) parts.push(`next load asks for a fresh copy: ${fresh.map(([name, n]) => `${name} after ${n ?? 0} failed`).join(', ')}`);
  return parts.join('; ');
}

/** The search index readout: loaded, loading, failed (with why), or not loaded yet. */
function searchWords(search: SearchStatus): string {
  switch (search.state) {
    case 'ready':
      return `${search.docs} documents (${search.source}), loaded in ${Math.round(search.loadMs ?? 0)} ms${search.lastQueryMs !== null ? `, last query ${search.lastQueryMs.toFixed(1)} ms` : ''}`;
    case 'loading':
      return search.indexFailures > 0 ? `Loading, a fresh copy after ${search.indexFailures} failed` : 'Loading';
    case 'failed':
      return `Did not load; the next search tries again. ${search.lastError ?? ''}`.trim();
    default:
      return 'Not loaded yet (loads on first search)';
  }
}

/** The offline copy table (src/core/pwa.ts, QA DEF-27): Ready offline only once the copy serves this page. */
function offlineCopyWords(state: OfflineCopyState): string {
  switch (state) {
    case 'ready':
      return 'Saved, and serving this page';
    case 'savedNotServing':
      return 'Saved, not serving this page yet (Try again reloads into it)';
    case 'notSaved':
      return 'Not saved yet';
    default: {
      const never: never = state;
      return String(never);
    }
  }
}

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
  const shards = useStore(contentStore);
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
            { label: STATE_LABELS.pinFails, value: s?.ownerPin ? `${Math.max(readPinGuard(s.ownerPin.salt).fails, pin.consecutiveFails)} of 3` : 'No PIN' },
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
            { label: STATE_LABELS.offlineCopy, value: offlineCopyWords(pwa.offlineCopy) },
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
            { label: STATE_LABELS.contentShards, value: shardWords(shards, content.shards) },
            { label: STATE_LABELS.search, value: searchWords(search) },
          ]}
        />
      </Section>
    </>
  );
}
