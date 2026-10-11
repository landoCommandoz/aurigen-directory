import { describe, expect, it } from 'vitest';
import { describeDate, pickBanners, type BannerInput } from '../banners/bannerRules';

const quiet: BannerInput = {
  ready: true,
  customerViewOn: false,
  storageProblem: null,
  online: true,
  offlineReady: true,
  offlineCopyExpected: true,
  versionState: 'current',
  updateAllowedHere: true,
  updateLater: false,
  setupStep: 'done',
  setupClosed: false,
  backupDue: false,
  backupLater: false,
  installCard: false,
  path: '/',
};

const pick = (patch: Partial<BannerInput>) => pickBanners({ ...quiet, ...patch });

describe('pickBanners', () => {
  it('shows nothing on a quiet, set-up, installed phone', () => {
    expect(pick({})).toEqual([]);
  });

  it('shows nothing at all in Customer View, whatever is pending (D10)', () => {
    expect(
      pick({
        customerViewOn: true,
        storageProblem: 'blocked',
        online: false,
        offlineReady: false,
        versionState: 'updateAvailable',
        setupStep: 'chooseRole',
        backupDue: true,
        installCard: true,
      }),
    ).toEqual([]);
  });

  it('shows nothing while the Customer View flag is still loading (fail closed)', () => {
    expect(pick({ ready: false, setupStep: 'chooseRole', installCard: true })).toEqual([]);
  });

  it('walks the setup steps and lets the banner close for the session (D12)', () => {
    expect(pick({ setupStep: 'chooseRole' })).toEqual(['setup']);
    expect(pick({ setupStep: 'setPin' })).toEqual(['setup']);
    expect(pick({ setupStep: 'firstBackup' })).toEqual(['setup']);
    expect(pick({ setupStep: 'firstBackup', setupClosed: true })).toEqual([]);
  });

  it('keeps setup, backup, and install notices to Home and Settings, so working screens stay clear', () => {
    expect(pick({ setupStep: 'setPin', path: '/settings' })).toEqual(['setup']);
    expect(pick({ setupStep: 'setPin', path: '/settings/' })).toEqual(['setup']);
    expect(pick({ setupStep: 'setPin', installCard: true, path: '/fixit' })).toEqual([]);
    expect(pick({ setupStep: 'setPin', path: '/settings/setup' })).toEqual([]);
    expect(pick({ backupDue: true, path: '/settings/backup' })).toEqual([]);
    expect(pick({ installCard: true, path: '/cards/card-bike-rules' })).toEqual([]);
  });

  it('shows the urgent notices on every screen', () => {
    expect(pick({ path: '/fixit', storageProblem: 'blocked' })).toEqual(['storage']);
    expect(pick({ path: '/search', online: false, offlineReady: false })).toEqual(['offlineNotSaved']);
    expect(pick({ path: '/cards', versionState: 'updateAvailable' })).toEqual(['update']);
  });

  it('shows the weekly backup reminder only after setup is done, and Later hides it', () => {
    expect(pick({ backupDue: true })).toEqual(['backupDue']);
    expect(pick({ backupDue: true, backupLater: true })).toEqual([]);
    expect(pick({ backupDue: true, setupStep: 'firstBackup' })).toEqual(['setup']);
  });

  it('follows the app version states (3.5)', () => {
    expect(pick({ versionState: 'updateAvailable' })).toEqual(['update']);
    expect(pick({ versionState: 'updateAvailable', updateLater: true })).toEqual([]);
    expect(pick({ versionState: 'updateAvailable', updateAllowedHere: false })).toEqual([]);
    expect(pick({ versionState: 'updating' })).toEqual(['updating']);
    expect(pick({ versionState: 'updated' })).toEqual(['updated']);
  });

  it('warns offline only when the phone has no saved copy and one is expected', () => {
    expect(pick({ online: false, offlineReady: false })).toEqual(['offlineNotSaved']);
    expect(pick({ online: false, offlineReady: true })).toEqual([]);
    expect(pick({ online: false, offlineReady: false, offlineCopyExpected: false })).toEqual([]);
  });

  it('puts storage first and drops the setup notice while nothing can be saved', () => {
    expect(pick({ storageProblem: 'Storage is blocked.', setupStep: 'chooseRole', installCard: true })).toEqual(['storage', 'install']);
  });

  it('orders several notices most urgent first', () => {
    expect(pick({ online: false, offlineReady: false, versionState: 'updated', setupStep: 'setPin', installCard: true })).toEqual([
      'offlineNotSaved',
      'updated',
      'setup',
      'install',
    ]);
  });
});

describe('describeDate', () => {
  it('says never, unknown, or the date in words', () => {
    expect(describeDate(null)).toBe('never');
    expect(describeDate('not a date')).toBe('unknown');
    expect(describeDate('2026-10-10T18:00:00.000Z')).toMatch(/Oct 1[01], 2026/);
  });
});
