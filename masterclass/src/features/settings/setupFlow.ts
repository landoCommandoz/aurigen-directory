/**
 * The setup flow screen's states, as an explicit table (BLUEPRINT 2.1 and 3.9, D12). Pure: the
 * stored state (role, PIN, last backup) lives in core; this only says which screen shows next.
 *
 *   overview      -> the three steps and what is done
 *   verifyCurrent -> Change PIN: the current PIN first
 *   pinNew        -> the new PIN, entered twice (the PinPad screen)
 *   pinSaving     -> the one write: PIN hash plus the weekly reminder (core setPin)
 *   backup        -> "Save your first backup" (or "Make a backup now"), one tap to the share sheet
 *   exit          -> back to Settings
 *
 * Cancel at every step before the save returns to Settings with nothing changed. After the PIN is
 * saved, the backup step's way out is "Not now": the setup banner then stays on "Save your first
 * backup" and the reminder is due at once (core backupReminderDue).
 */
export type SetupView = 'overview' | 'verifyCurrent' | 'pinNew' | 'pinSaving' | 'backup';
export type SetupTarget = SetupView | 'exit';

export type SetupEvent =
  | 'CREATE_PIN'
  | 'CHANGE_PIN'
  | 'CURRENT_OK'
  | 'PIN_CONFIRMED'
  | 'SAVED'
  | 'SAVE_FAILED'
  | 'BACKUP_NOW'
  | 'BACKUP_DONE'
  | 'NOT_NOW'
  | 'CANCEL'
  | 'BACK';

export const setupTransitions = {
  overview: { CREATE_PIN: 'pinNew', CHANGE_PIN: 'verifyCurrent', BACKUP_NOW: 'backup', BACK: 'exit' },
  verifyCurrent: { CURRENT_OK: 'pinNew', CANCEL: 'exit' },
  pinNew: { PIN_CONFIRMED: 'pinSaving', CANCEL: 'exit' },
  pinSaving: { SAVED: 'backup', SAVE_FAILED: 'pinNew' },
  backup: { BACKUP_DONE: 'overview', NOT_NOW: 'exit', CANCEL: 'exit' },
} as const satisfies Record<SetupView, Partial<Record<SetupEvent, SetupTarget>>>;

/** The next screen, or null when the event does not apply here (a stale or doubled tap). */
export function nextSetupView(view: SetupView, event: SetupEvent): SetupTarget | null {
  const row: Partial<Record<SetupEvent, SetupTarget>> = setupTransitions[view];
  return row[event] ?? null;
}
