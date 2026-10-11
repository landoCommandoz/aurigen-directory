/**
 * Settings, Restore from a file: the screen's states as an explicit table (D3, BLUEPRINT 3.9).
 * Pure. Nothing is written until "restoring" calls core importBackup, which replaces every table
 * in one transaction. Cancel from any step before that changes nothing.
 */
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

/** A plain heads-up when the restore changes the device role. */
export function restoreRoleNote(input: { phoneRole: 'study' | 'shop'; fileRole: 'study' | 'shop' }): string | null {
  if (input.phoneRole === 'study' && input.fileRole === 'shop') {
    return 'This backup is from the shop phone. Restoring it makes this phone the shop phone. One shop phone at a time: switch the other one to a study phone afterwards.';
  }
  return null;
}
