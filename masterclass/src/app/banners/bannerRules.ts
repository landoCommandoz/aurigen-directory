/**
 * Which notices the shell shows at the top of a screen, in order (pure, tested).
 *
 * D10 and BLUEPRINT 3.4: in Customer View, or while the persisted flag is still loading, the
 * app renders no banner of its own at all; everything is held until Customer View is off.
 * Order, most urgent first: storage blocked, offline with no saved copy (or a saved copy this
 * page opened without, QA DEF-29), the app version notices (3.5), the setup step or the weekly
 * backup reminder (D12), the install card (D3).
 * The last three show on Home and Settings only (NOTICE_SCREENS).
 */
import type { AppVersionState, OfflineCopyState } from '../../core/pwa';
import type { SetupStep } from '../../schemas';

export type BannerKey = 'storage' | 'offlineNotSaved' | 'offlineSaved' | 'update' | 'updating' | 'updated' | 'setup' | 'backupDue' | 'install';

export interface BannerInput {
  /** The Customer View flag has been read. */
  ready: boolean;
  customerViewOn: boolean;
  storageProblem: string | null;
  online: boolean;
  offlineReady: boolean;
  /**
   * The offline copy table (src/core/pwa.ts). When given it decides, and savedNotServing gets its
   * own notice (QA DEF-29); when left out, offlineReady false reads as notSaved.
   */
  offlineCopy?: OfflineCopyState;
  /** A service worker is supported and this is a production build. */
  offlineCopyExpected: boolean;
  versionState: AppVersionState;
  /** updateBannerVisible() from src/core/pwa.ts: suppressed in the Job Runner and while a stage runs. */
  updateAllowedHere: boolean;
  updateLater: boolean;
  setupStep: SetupStep;
  setupClosed: boolean;
  backupDue: boolean;
  backupLater: boolean;
  installCard: boolean;
  /** The current path without the base, such as "/settings/setup". */
  path: string;
}

/**
 * The setup step, the weekly backup reminder, and the install card show on Home and Settings
 * only. Working screens (Fix It, Quick Cards, Search) stay clear at arm's length; Home is one tap
 * from everywhere and is where the app opens. Storage, offline, and update notices are urgent and
 * show on every screen.
 */
export const NOTICE_SCREENS = ['/', '/settings'];

export function pickBanners(input: BannerInput): BannerKey[] {
  if (!input.ready || input.customerViewOn) return [];
  const keys: BannerKey[] = [];
  if (input.storageProblem !== null) keys.push('storage');
  const copy = input.offlineCopy ?? (input.offlineReady ? 'ready' : 'notSaved');
  if (!input.online && input.offlineCopyExpected) {
    if (copy === 'notSaved') keys.push('offlineNotSaved');
    else if (copy === 'savedNotServing') keys.push('offlineSaved');
  }

  switch (input.versionState) {
    case 'updateAvailable':
      if (input.updateAllowedHere && !input.updateLater) keys.push('update');
      break;
    case 'updating':
      keys.push('updating');
      break;
    case 'updated':
      keys.push('updated');
      break;
    case 'current':
      break;
    default: {
      const never: never = input.versionState;
      void never;
    }
  }

  const noticeScreen = NOTICE_SCREENS.includes(input.path.length > 1 ? input.path.replace(/\/+$/, '') : input.path);
  if (noticeScreen && input.storageProblem === null) {
    if (input.setupStep !== 'done') {
      if (!input.setupClosed) keys.push('setup');
    } else if (input.backupDue && !input.backupLater) {
      keys.push('backupDue');
    }
  }

  if (noticeScreen && input.installCard) keys.push('install');
  return keys;
}

/** Plain words for a date stamp, such as "Oct 10, 2026", or "never". */
export function describeDate(iso: string | null): string {
  if (iso === null) return 'never';
  const ms = Date.parse(iso);
  if (Number.isNaN(ms)) return 'unknown';
  try {
    return new Date(ms).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return iso.slice(0, 10);
  }
}
