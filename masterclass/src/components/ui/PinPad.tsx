/**
 * PinPad: owner PIN entry (D4: 6 digits). Large keys, masked dots, Cancel
 * and Delete. There is no text field at all, so no keyboard pops up and no
 * password manager or autofill can offer to save or fill the PIN.
 *
 *   <PinPad label="Enter owner PIN" onComplete={check} onCancel={close}
 *     error={wrong ? 'Wrong PIN. 2 tries left.' : undefined}
 *     disabled={lockedOrChecking} status={locked ? 'Locked for 30 seconds.' : undefined} />
 *
 * When the last digit goes in, onComplete gets the PIN and the dots clear
 * right away, so a wrong PIN leaves an empty row and the error text, and the
 * dots shake once each time a new error message arrives (D4's three tries
 * give three different messages, such as the tries left). The pad never
 * stores or logs the PIN. Hardware keys work while it is on screen: digits,
 * Backspace, Escape (Cancel). disabled keeps the keys focusable (so keyboard
 * focus is never lost during a lockout) and ignores them; Cancel always
 * works. Keys are 64 px in Shop density.
 *
 * Double taps, three cases:
 * - A pad that appears where the button that opened it was takes no taps for
 *   its first TAP_GUARD_MS (350 ms), Cancel included, so the second tap of a
 *   double tap lands on the pad and does nothing (QA DEF-04). The keys fade
 *   in over the same moment.
 * - A pad that steps in place to its next entry (a new PIN's confirmation,
 *   or a fresh try after the two did not match) does not hold: its keys never
 *   moved. Only the second tap of a double tap on the key that finished the
 *   entry is dropped, for 80 to 150 ms sized to the person's own pace, so a
 *   steady typing rhythm carries straight on into the confirmation (QA
 *   DEF-15; see pinStep.ts).
 * - A pad that stays mounted between entries (PinGate after a wrong PIN)
 *   has no step rule: it is disabled while the PIN is checked, as before,
 *   and a fast retry counts from its first digit.
 * Hardware keys are never held: a key press cannot be the second tap of a
 * double tap. The pad takes no focus when it appears, and Tab, Enter, and
 * Space on a key work as always (see useTapGuard).
 */
import { useEffect, useId, useRef, useState } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { WarningGlyph } from './glyphs';
import { finishToStepFrom, isEchoOfFinish, noteFinish, stepHoldFor, type PinTap } from './pinStep';
import { useTapGuard } from './useTapGuard';
import { cx } from './util';
import './PinPad.css';

export interface PinPadProps {
  /** What the PIN is for, such as "Enter owner PIN". Shown and read aloud. */
  label: string;
  /** Number of digits. D4 sets 6. */
  length?: number;
  onComplete: (pin: string) => void;
  onCancel: () => void;
  /** Error from the last attempt, in words. */
  error?: string;
  /** A neutral line under the dots, such as a lockout countdown. */
  status?: string;
  /** Ignore input, for a lockout or while checking. Cancel still works. */
  disabled?: boolean;
  cancelLabel?: string;
  deleteLabel?: string;
  className?: string;
}

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;

/** Where and when a pointer tap landed; null for a click from Enter or Space (detail 0). */
function tapOf(event: ReactMouseEvent<HTMLElement>): PinTap | null {
  return event.detail === 0 ? null : { x: event.clientX, y: event.clientY, time: event.timeStamp };
}

/** The gaps between consecutive tap times. */
function gapsOf(times: readonly number[]): number[] {
  return times.slice(1).map((time, index) => time - (times[index] ?? time));
}

export function PinPad({
  label,
  length = 6,
  onComplete,
  onCancel,
  error,
  status,
  disabled = false,
  cancelLabel = 'Cancel',
  deleteLabel = 'Delete',
  className,
}: PinPadProps) {
  const size = Math.max(1, Math.floor(length));
  const [digits, setDigits] = useState('');
  const messageId = useId();
  // A pad that replaces one whose entry has just finished steps in place: no
  // hold on arrival. Any other pad is a new arrival and holds (useTapGuard).
  const [stepFrom] = useState(finishToStepFrom);
  const guard = useTapGuard(stepFrom === null);
  // When each digit of this entry was tapped: the person's pace, for the step.
  const entryTaps = useRef<number[]>([]);

  function press(digit: string, tap: PinTap | null) {
    if (disabled) return;
    if (tap !== null) entryTaps.current.push(tap.time);
    const next = `${digits}${digit}`.slice(0, size);
    if (next.length === size) {
      const holdMs = stepHoldFor(gapsOf(entryTaps.current));
      entryTaps.current = [];
      setDigits('');
      noteFinish(digit, tap, holdMs); // for a pad that steps in place of this one
      onComplete(next);
      return;
    }
    setDigits(next);
  }

  /** A key tap, unless it is the second tap of a double tap on the key that finished the last pad's entry. */
  function tapKey(event: ReactMouseEvent<HTMLButtonElement>, key: string, action: () => void) {
    if (isEchoOfFinish(stepFrom, key, event.currentTarget, event.detail, event.timeStamp)) return;
    action();
  }

  function removeLast() {
    if (disabled) return;
    setDigits((current) => current.slice(0, -1));
  }

  // Hardware keys work while the pad is on screen, from the first moment:
  // digits, Backspace, and Escape (Cancel). They are never held by the tap
  // guard, since a key press is never the second tap of a double tap (QA
  // DEF-15). Keys typed into a real text field elsewhere are left alone.
  const latest = useRef({ press, removeLast, onCancel });
  useEffect(() => {
    latest.current = { press, removeLast, onCancel };
  });

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target;
      if (target instanceof HTMLElement && (target.isContentEditable || target.closest('input, textarea, select'))) {
        return;
      }
      const isDigit = /^[0-9]$/.test(event.key);
      if (!isDigit && event.key !== 'Backspace' && event.key !== 'Escape') return;
      // Handled here, so a Drawer around the pad does not act on Escape as well.
      event.preventDefault();
      if (isDigit) latest.current.press(event.key, null);
      else if (event.key === 'Backspace') latest.current.removeLast();
      else latest.current.onCancel();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const message = error ?? status;

  return (
    <fieldset
      className={cx('ui-pinpad', className)}
      aria-describedby={message ? messageId : undefined}
      data-tap-guard={guard.holding ? 'on' : undefined}
      data-step={stepFrom === null ? undefined : 'true'}
      {...guard.captureHandlers}
    >
      <legend className="ui-pinpad__label">{label}</legend>

      <div
        key={error ?? ''}
        className="ui-pinpad__dots"
        data-error={error ? 'true' : undefined}
        aria-hidden="true"
      >
        {Array.from({ length: size }, (_, index) => (
          <span key={index} className="ui-pinpad__dot" data-filled={index < digits.length ? 'true' : undefined} />
        ))}
      </div>
      <p className="ui-visually-hidden" aria-live="polite">
        {`${digits.length} of ${size} digits entered`}
      </p>

      <p id={messageId} className="ui-pinpad__message" data-kind={error ? 'error' : 'status'} aria-live="polite">
        {error ? <WarningGlyph className="ui-glyph ui-pinpad__message-glyph" /> : null}
        <span>{message ?? ''}</span>
      </p>

      <div className="ui-pinpad__keys">
        {KEYS.map((key) => (
          <button
            key={key}
            type="button"
            className="ui-pinpad__key ui-press"
            aria-disabled={disabled ? true : undefined}
            onClick={(event) => tapKey(event, key, () => press(key, tapOf(event)))}
          >
            {key}
          </button>
        ))}
        <button
          type="button"
          className="ui-pinpad__key ui-pinpad__key--word ui-press"
          onClick={(event) => tapKey(event, 'cancel', onCancel)}
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          className="ui-pinpad__key ui-press"
          aria-disabled={disabled ? true : undefined}
          onClick={(event) => tapKey(event, '0', () => press('0', tapOf(event)))}
        >
          0
        </button>
        <button
          type="button"
          className="ui-pinpad__key ui-pinpad__key--word ui-press"
          aria-disabled={disabled || digits.length === 0 ? true : undefined}
          onClick={(event) => tapKey(event, 'delete', removeLast)}
        >
          {deleteLabel}
        </button>
      </div>
    </fieldset>
  );
}
