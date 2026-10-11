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
 */
import { useEffect, useId, useRef, useState } from 'react';
import { WarningGlyph } from './glyphs';
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

  function press(digit: string) {
    if (disabled) return;
    const next = `${digits}${digit}`.slice(0, size);
    if (next.length === size) {
      setDigits('');
      onComplete(next);
      return;
    }
    setDigits(next);
  }

  function removeLast() {
    if (disabled) return;
    setDigits((current) => current.slice(0, -1));
  }

  // Hardware keys work while the pad is on screen: digits, Backspace, and
  // Escape (Cancel). Keys typed into a real text field elsewhere are left alone.
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
      if (/^[0-9]$/.test(event.key)) {
        event.preventDefault();
        latest.current.press(event.key);
      } else if (event.key === 'Backspace') {
        event.preventDefault();
        latest.current.removeLast();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        latest.current.onCancel();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const message = error ?? status;

  return (
    <fieldset className={cx('ui-pinpad', className)} aria-describedby={message ? messageId : undefined}>
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
            onClick={() => press(key)}
          >
            {key}
          </button>
        ))}
        <button
          type="button"
          className="ui-pinpad__key ui-pinpad__key--word ui-press"
          onClick={onCancel}
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          className="ui-pinpad__key ui-press"
          aria-disabled={disabled ? true : undefined}
          onClick={() => press('0')}
        >
          0
        </button>
        <button
          type="button"
          className="ui-pinpad__key ui-pinpad__key--word ui-press"
          aria-disabled={disabled || digits.length === 0 ? true : undefined}
          onClick={removeLast}
        >
          {deleteLabel}
        </button>
      </div>
    </fieldset>
  );
}
