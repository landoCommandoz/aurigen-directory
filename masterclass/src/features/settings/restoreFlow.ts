/**
 * Settings, Restore from a file: the screen's states as an explicit table (D3, BLUEPRINT 3.9).
 * Pure. Nothing is written until "restoring" calls core importBackup, which replaces every table
 * in one transaction. Cancel from any step before that changes nothing.
 *
 * The words around the confirm come from core's restore plan (restorePlan, DEF-13): what lands,
 * what this phone keeps, and the flags. restoreNotices turns them into plain lines; it restates
 * no rule.
 */
import type { RestorePlanOk } from '../../schemas';
import {
  RESTORE_BOTH_UNREADABLE_MESSAGE,
  RESTORE_FILE_UNREADABLE_MESSAGE,
  RESTORE_HERE_UNREADABLE_MESSAGE,
} from '../../core/errors';
import type { ThisPhoneNow } from '../../core/restorePreview';
export type RestoreView = 'idle' | 'pick' | 'confirm' | 'pin' | 'restoring' | 'done';
export type RestoreEvent = 'START' | 'FILE_OK' | 'APPLY' | 'APPLY_NEEDS_PIN' | 'PIN_OK' | 'DONE' | 'FAILED' | 'CANCEL' | 'CLOSE';

export const restoreTransitions = {
  idle: { START: 'pick' },
  pick: { FILE_OK: 'confirm', CANCEL: 'idle' },
  confirm: { APPLY: 'restoring', APPLY_NEEDS_PIN: 'pin', CANCEL: 'idle' },
  pin: { PIN_OK: 'restoring', CANCEL: 'idle' },
  restoring: { DONE: 'done', FAILED: 'confirm' },
  done: { CLOSE: 'idle' },
} as const satisfies Record<RestoreView, Partial<Record<RestoreEvent, RestoreView>>>;

export function nextRestoreView(view: RestoreView, event: RestoreEvent): RestoreView | null {
  const row: Partial<Record<RestoreEvent, RestoreView>> = restoreTransitions[view];
  return row[event] ?? null;
}

/** A restore that core would refuse, said before the person types anything. */
export function restoreBlocker(input: { phoneRole: 'study' | 'shop'; fileRole: 'study' | 'shop' }): string | null {
  if (input.phoneRole === 'shop' && input.fileRole === 'study') {
    return 'This is the shop phone. A study backup would replace its jobs, so it cannot be restored here. Switch this phone to a study phone first.';
  }
  return null;
}

/** A plain heads-up when the restore makes this phone the shop phone (the plan's role change). */
export function restoreRoleNote(roleChange: RestorePlanOk['roleChange']): string | null {
  if (roleChange !== null && roleChange.to === 'shop') {
    return 'This backup is from the shop phone. Restoring it makes this phone the shop phone. One shop phone at a time: switch the other one to a study phone afterwards.';
  }
  return null;
}

/** The counts shown first: this phone as it is now. */
export function thisPhoneLine(now: ThisPhoneNow): string {
  return `This phone now: ${now.jobs} ${now.jobs === 1 ? 'job' : 'jobs'}, ${now.carsLogged} cars toward 25, ${now.founderSlotsUsed} founder's slots used. The backup holds:`;
}

/**
 * The plan's flags in plain words, in the order the person needs them: what cannot be read (texts
 * C and D), then what changes on this phone. Empty when there is nothing to say.
 */
export function restoreNotices(plan: RestorePlanOk, counts: { thisPhone: ThisPhoneNow; fileJobs: number }): string[] {
  const lines: string[] = [];
  if (plan.flags.thisPhoneSettingsUnreadable) lines.push(RESTORE_HERE_UNREADABLE_MESSAGE);
  if (plan.flags.fileSettingsUnreadable) {
    lines.push(plan.settingsFrom === 'thisPhone' ? RESTORE_FILE_UNREADABLE_MESSAGE : RESTORE_BOTH_UNREADABLE_MESSAGE);
  }
  if (plan.flags.carsSeedNotRestored) {
    lines.push(
      plan.settingsFrom === 'thisPhone'
        ? `This backup cannot say how many cars were logged before this app, so this phone keeps its own number (${counts.thisPhone.carsSeed}).`
        : 'This backup cannot say how many cars were logged before this app, so that number starts at 0.',
    );
  }
  if (plan.flags.fewerJobsThanThisPhone) {
    lines.push(`This backup holds fewer jobs (${counts.fileJobs}) than this phone has now (${counts.thisPhone.jobs}). Restoring it removes the others from this phone.`);
  }
  if (plan.flags.photosNotInFile) lines.push('This backup has no photos, so this phone will have no job photos after the restore.');
  if (plan.signOffs.comeBack === 'needsRecheck' && plan.signOffs.rows > 0) {
    const n = plan.signOffs.rows;
    lines.push(`${n} ${n === 1 ? 'sign-off comes' : 'sign-offs come'} back marked needs re-check. Confirm each one with the owner PIN.`);
  }
  return lines;
}
