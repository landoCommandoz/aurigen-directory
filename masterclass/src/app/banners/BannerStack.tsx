/**
 * The notices at the top of every internal screen: storage, offline, update, setup, backup
 * reminder, install card. pickBanners() decides which; this file only draws them with the
 * designer's Banner. Nothing renders in Customer View (D10): the notices wait until it is off.
 */
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Banner } from '../../components/ui';
import { nowMs } from '../../core/clock';
import { useConnectivity } from '../../core/connectivity';
import { RecordInvalid } from '../../core/errors';
import { useCustomerView } from '../../core/customerView';
import { isIos } from '../../core/platform';
import { applyUpdateWhenIdle, dismissWhatsNew, updateBannerVisible, usePwaStatus } from '../../core/pwa';
import { useSettings } from '../../core/settingsStore';
import { backupReminderDue, setupStep } from '../../schemas';
import { config } from '../config';
import { useStandalone } from '../env';
import { promptInstall, shouldShowInstallCard, snoozeInstallCard, useInstallState } from '../installCard';
import { useJobRunning } from '../useJobRunning';
import { describeDate, pickBanners, type BannerKey } from './bannerRules';
import { closeNotice, useSessionNotices } from './sessionNotices';

const SETUP_COPY = {
  chooseRole: {
    title: 'Set up this phone',
    text: 'Is this the shop phone? Answer once and the app remembers. Fix It, Quick Cards, and Search work either way.',
    action: 'Set up',
  },
  setPin: {
    title: 'Set the owner PIN',
    text: 'The PIN guards sign-offs, pricing, and the developer tools. The first backup is saved right after.',
    action: 'Set the PIN',
  },
  firstBackup: {
    title: 'Save your first backup',
    text: 'One tap opens the share sheet. Save the file to Files or send it to yourself.',
    action: 'Back up now',
  },
} as const;

export function BannerStack({ path }: { path: string }) {
  const navigate = useNavigate();
  const location = useLocation();
  const customerView = useCustomerView();
  const snapshot = useSettings();
  const pwa = usePwaStatus();
  const online = useConnectivity() === 'online';
  const jobRunning = useJobRunning();
  const notices = useSessionNotices();
  const install = useInstallState();
  const standalone = useStandalone();
  const [applying, setApplying] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);

  const settings = snapshot.settings;
  const step = settings === null ? 'done' : setupStep(settings);
  const now = nowMs();
  const keys = pickBanners({
    ready: customerView.ready,
    customerViewOn: customerView.on,
    storageProblem: snapshot.status === 'unavailable' ? snapshot.error.message : null,
    online,
    offlineReady: pwa.offlineReady,
    offlineCopyExpected: pwa.supported && import.meta.env.PROD,
    versionState: pwa.state,
    updateAllowedHere: updateBannerVisible({ state: pwa.state, customerViewOn: customerView.on, jobRunnerOpen: false, jobRunning }),
    updateLater: notices.updateLater,
    setupStep: step,
    setupClosed: notices.setupClosed,
    backupDue: settings !== null && backupReminderDue(settings, now),
    backupLater: notices.backupLater,
    installCard: shouldShowInstallCard({ standalone, customerViewOn: customerView.on, hiddenUntil: install.hiddenUntil, nowMs: now }),
    path,
  });
  if (keys.length === 0) return null;

  const goSetup = () => navigate('/settings/setup', { state: { from: location.pathname } });

  async function updateNow() {
    if (applying) return;
    setApplying(true);
    setUpdateMessage(null);
    const result = await applyUpdateWhenIdle();
    setApplying(false);
    if (!result.ok) setUpdateMessage(result.message);
  }

  function render(key: BannerKey) {
    switch (key) {
      case 'storage':
        // A settings row this version cannot read (a newer version wrote it, DEF-08) is not a
        // Private Browsing or space problem: plain words and the way to Backup and Restore.
        if (snapshot.status === 'unavailable' && snapshot.error instanceof RecordInvalid) {
          return (
            <Banner
              key={key}
              tone="warning"
              title="Settings could not be read"
              action={{ label: 'Open Backup', onAction: () => navigate('/settings/backup') }}
            >
              {snapshot.error.message} Fix It, Quick Cards, and Search still work.
            </Banner>
          );
        }
        return (
          <Banner key={key} tone="warning" title="This phone is not saving">
            {snapshot.status === 'unavailable' ? snapshot.error.message : 'Storage is not available.'} Fix It, Quick Cards, and Search still work. Private Browsing
            off and some free space usually fix it.
          </Banner>
        );
      case 'offlineNotSaved':
        return (
          <Banner key={key} tone="warning" title="Offline, and not saved yet">
            This phone has no offline copy of the app yet. Open it once with a signal and wait for Ready offline at the top.
          </Banner>
        );
      case 'update':
        return (
          <Banner
            key={key}
            tone="info"
            title="Update ready"
            action={{ label: 'Update now', onAction: () => void updateNow(), loading: applying, loadingLabel: 'Updating' }}
            onDismiss={() => closeNotice('updateLater')}
            dismissLabel="Later"
          >
            {updateMessage ?? 'A new version is saved on this phone. It installs only when you tap Update now, never during a job.'}
          </Banner>
        );
      case 'updating':
        return (
          <Banner key={key} tone="info" title="Installing the update">
            {pwa.lastError !== null
              ? `The update did not finish: ${pwa.lastError} Close the app fully and open it again.`
              : 'The app reloads into the new version at the next quiet moment, never during a job.'}
          </Banner>
        );
      case 'updated':
        return (
          <Banner key={key} tone="success" title="Updated" onDismiss={() => void dismissWhatsNew(config.version)} dismissLabel="OK">
            This phone now runs version {config.version}. Your jobs, settings, and backups were not touched.
          </Banner>
        );
      case 'setup': {
        const copy = SETUP_COPY[step === 'done' ? 'chooseRole' : step];
        return (
          <Banner key={key} tone="info" title={copy.title} action={{ label: copy.action, onAction: goSetup }} onDismiss={() => closeNotice('setupClosed')} dismissLabel="Later">
            {copy.text}
          </Banner>
        );
      }
      case 'backupDue':
        return (
          <Banner
            key={key}
            tone="warning"
            title="Backup due"
            action={{ label: 'Back up now', onAction: () => navigate('/settings/backup') }}
            onDismiss={() => closeNotice('backupLater')}
            dismissLabel="Later"
          >
            Last backup: {describeDate(settings?.lastBackupAt ?? null)}. A backup is the only copy of your jobs if this phone is lost.
          </Banner>
        );
      case 'install':
        return <InstallBanner key={key} canPrompt={install.canPrompt} />;
      default: {
        const never: never = key;
        return never;
      }
    }
  }

  return (
    <div className="app-banners" data-print="hide">
      {keys.map(render)}
    </div>
  );
}

function InstallBanner({ canPrompt }: { canPrompt: boolean }) {
  const ios = isIos();
  const snooze = () => snoozeInstallCard(nowMs());
  const keepNote = 'Until then, what you save stays in this browser tab only, and Safari can erase it after 7 days of Safari use without a visit.';

  if (canPrompt) {
    return (
      <Banner
        tone="info"
        title="Install the app"
        action={{ label: 'Install', onAction: () => void promptInstall() }}
        onDismiss={snooze}
        dismissLabel="Not now"
      >
        Installed, it opens from your Home Screen with no signal. {keepNote}
      </Banner>
    );
  }
  return (
    <Banner tone="info" title="Install on this phone" onDismiss={snooze} dismissLabel="Not now">
      {ios
        ? 'In Safari, tap Share, then Add to Home Screen. Leave Open as Web App turned on. Then open the app from its icon. '
        : 'In your browser menu, choose Install app or Add to Home screen, then open the app from its icon. '}
      {keepNote}
    </Banner>
  );
}
