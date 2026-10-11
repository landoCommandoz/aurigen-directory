/**
 * Settings hooks the shell reads (export contract):
 *   useSetupState(): { pinExists, deviceRole, lastBackupAt, backupDue, ... } for the setup banner
 *     and the "Backup due" banner.
 *   useHandedness(): 'left' | 'right' for the thumb side of the one action area (left by default,
 *     Lando 2026-10-10).
 * Both read the one live settings snapshot from src/core/settingsStore; nothing is stored here.
 */
import { useEffect, useState } from 'react';
import { backupReminderDue, setupStep, type DeviceRoleName, type SettingsValue, type SetupStep } from '../../schemas';
import { nowMs } from '../../core/clock';
import { updateSettings } from '../../core/db';
import { describeError } from '../../core/errors';
import { useSettings } from '../../core/settingsStore';

export interface SetupState {
  /** The saved settings have been read (false while loading: show no banner yet). */
  ready: boolean;
  /** Storage is unavailable: the values below are the in-memory defaults. */
  storageProblem: string | null;
  pinExists: boolean;
  /** When the PIN was set, for the honesty line in Settings. */
  pinSetAt: string | null;
  deviceRole: DeviceRoleName;
  roleChosen: boolean;
  lastBackupAt: string | null;
  /** The weekly reminder is on (it turns on with the PIN). */
  reminderOn: boolean;
  /** Show the "Backup due" banner: 7 days after the last backup, at once after the PIN if none yet, never in Customer View. */
  backupDue: boolean;
  /** The next unfinished setup step for the setup banner. */
  step: SetupStep;
}

/** The setup step in words, for Settings and the developer panel. */
export const SETUP_STEP_WORDS: Record<SetupStep, string> = {
  chooseRole: 'Next: is this the shop phone?',
  setPin: 'Next: set the owner PIN',
  firstBackup: 'Next: save your first backup',
  done: 'Done',
};

const MINUTE_MS = 60_000;

/** Re-render once a minute so "backup due" turns true on time while the app stays open. */
function useMinuteTick(): number {
  const [tick, setTick] = useState(() => nowMs());
  useEffect(() => {
    const timer = window.setInterval(() => setTick(nowMs()), MINUTE_MS);
    return () => window.clearInterval(timer);
  }, []);
  return tick;
}

export function setupStateFrom(settings: SettingsValue | null, now: number, storageProblem: string | null): SetupState {
  if (settings === null) {
    return {
      ready: false,
      storageProblem,
      pinExists: false,
      pinSetAt: null,
      deviceRole: 'study',
      roleChosen: false,
      lastBackupAt: null,
      reminderOn: false,
      backupDue: false,
      step: 'chooseRole',
    };
  }
  return {
    ready: true,
    storageProblem,
    pinExists: settings.ownerPin !== null,
    pinSetAt: settings.ownerPin?.setAt ?? null,
    deviceRole: settings.deviceRole,
    roleChosen: settings.roleChosenAt !== null,
    lastBackupAt: settings.lastBackupAt,
    reminderOn: settings.backupReminderWeekly,
    backupDue: storageProblem === null && backupReminderDue(settings, now),
    step: setupStep(settings),
  };
}

export function useSetupState(): SetupState {
  const snapshot = useSettings();
  const now = useMinuteTick();
  const problem = snapshot.status === 'unavailable' ? snapshot.error.message : null;
  return setupStateFrom(snapshot.settings, now, problem);
}

export type Handedness = SettingsValue['handedness'];

export function useHandedness(): Handedness {
  const snapshot = useSettings();
  return snapshot.settings?.handedness ?? 'left';
}

/** Save the thumb side. Resolves to null on success or a plain message on failure. */
export async function setHandedness(handedness: Handedness): Promise<string | null> {
  try {
    await updateSettings({ handedness });
    return null;
  } catch (error) {
    return error instanceof Error ? error.message : describeError(error);
  }
}
