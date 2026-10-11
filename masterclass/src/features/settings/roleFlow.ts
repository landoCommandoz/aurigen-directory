/**
 * The device role screen's states, as an explicit table (BLUEPRINT 3.9, D12). Pure: the role, the
 * PIN, and every table live in core; this only says which screen shows next. Nothing is written
 * until a working state (importing, freshing, studying) calls core, and core writes in one
 * transaction with its audit entries.
 *
 * Lando, 2026-10-10 [HOUSE]: a mistaken "This is the shop phone" tap changes nothing until an owner
 * PIN exists, and the screen has a clear Cancel. One shop phone at a time: a second phone becomes
 * the shop phone only by importing the newest backup. Start fresh is a separate choice with a
 * warning that the counts reset to zero.
 *
 * Hand over to another phone (D12 amendment, 2026-10-11 [HOUSE default]): shop phone only. The
 * owner PIN, then one "Save backup and hand over" button (CONFIRM), then handingOver while the
 * share sheet is open; only a share that resolved switches the phone (core handOver). PIN_AGAIN
 * sends the person back to the PIN when the owner pass ran out before the tap.
 */
export type RoleView =
  | 'overview'
  | 'shopPin'
  | 'shopChoice'
  | 'importPick'
  | 'importConfirm'
  | 'importPin'
  | 'importing'
  | 'freshWarning'
  | 'freshPinNew'
  | 'freshPinVerify'
  | 'freshing'
  | 'studyPin'
  | 'studying'
  | 'handoverPin'
  | 'handoverReady'
  | 'handingOver'
  | 'result';

export type RoleEvent =
  | 'SHOP_TAP'
  | 'PIN_OK'
  | 'CHOOSE_IMPORT'
  | 'CHOOSE_FRESH'
  | 'FILE_OK'
  | 'CONFIRM'
  | 'CONFIRM_NEEDS_PIN'
  | 'WORD_OK'
  | 'WORD_OK_NEW_PIN'
  | 'WORD_OK_NEEDS_PIN'
  | 'NEW_PIN'
  | 'STUDY_TAP'
  | 'HANDOVER_TAP'
  | 'PIN_AGAIN'
  | 'DONE'
  | 'FAILED'
  | 'CANCEL'
  | 'BACK';

/** Working states: a core call is in flight, so Cancel is not offered (the write is one transaction). */
export const WORKING_VIEWS: readonly RoleView[] = ['importing', 'freshing', 'studying', 'handingOver'];

export const roleTransitions = {
  overview: { SHOP_TAP: 'shopPin', CHOOSE_IMPORT: 'importPick', CHOOSE_FRESH: 'freshWarning', STUDY_TAP: 'studyPin', HANDOVER_TAP: 'handoverPin' },
  shopPin: { PIN_OK: 'shopChoice', CANCEL: 'overview' },
  shopChoice: { CHOOSE_IMPORT: 'importPick', CHOOSE_FRESH: 'freshWarning', CANCEL: 'overview' },
  importPick: { FILE_OK: 'importConfirm', CANCEL: 'overview' },
  importConfirm: { CONFIRM: 'importing', CONFIRM_NEEDS_PIN: 'importPin', CANCEL: 'overview' },
  importPin: { PIN_OK: 'importing', CANCEL: 'overview' },
  importing: { DONE: 'result', FAILED: 'importConfirm' },
  freshWarning: { WORD_OK: 'freshing', WORD_OK_NEW_PIN: 'freshPinNew', WORD_OK_NEEDS_PIN: 'freshPinVerify', CANCEL: 'overview' },
  freshPinNew: { NEW_PIN: 'freshing', CANCEL: 'overview' },
  freshPinVerify: { PIN_OK: 'freshing', CANCEL: 'overview' },
  freshing: { DONE: 'result', FAILED: 'freshWarning' },
  studyPin: { PIN_OK: 'studying', CANCEL: 'overview' },
  studying: { DONE: 'result', FAILED: 'overview' },
  handoverPin: { PIN_OK: 'handoverReady', CANCEL: 'overview' },
  handoverReady: { CONFIRM: 'handingOver', PIN_AGAIN: 'handoverPin', CANCEL: 'overview' },
  handingOver: { DONE: 'result', FAILED: 'handoverReady' },
  result: { BACK: 'overview' },
} as const satisfies Record<RoleView, Partial<Record<RoleEvent, RoleView>>>;

/** The next screen, or null when the event does not apply (a doubled or stale tap changes nothing). */
export function nextRoleView(view: RoleView, event: RoleEvent): RoleView | null {
  const row: Partial<Record<RoleEvent, RoleView>> = roleTransitions[view];
  return row[event] ?? null;
}

/** The word typed to accept Start fresh. Lowercase: the only word in capitals in this app is STOP. */
export const START_FRESH_WORD = 'zero';
/** The word typed to replace this phone's data from a backup. */
export const RESTORE_WORD = 'replace';

/** True when the typed text is the word, ignoring case and spaces around it. */
export function typedWordMatches(typed: string, word: string): boolean {
  return typed.trim().toLowerCase() === word;
}

/** "This is the shop phone" is enabled only once an owner PIN exists (Lando's rule). */
export function shopTapAllowed(input: { pinExists: boolean; role: 'study' | 'shop' }): { allowed: boolean; reason: string | null } {
  if (input.role === 'shop') return { allowed: false, reason: 'This is already the shop phone.' };
  if (!input.pinExists) return { allowed: false, reason: 'Create the owner PIN first.' };
  return { allowed: true, reason: null };
}
