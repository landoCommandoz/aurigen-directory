/**
 * Field: a labeled text input with an optional hint and error text.
 * The label is always visible (never a placeholder standing in for it).
 * The error is words with a warning glyph and a heavier edge, never red.
 * Text is 16 px or more, so iPhone does not zoom into the field.
 *
 *   <Field label="Customer first name" value={name} onChange={(e) => setName(e.target.value)}
 *     hint="First name only." error={nameError} autoComplete="off" />
 *
 * Every other input attribute passes through (type, inputMode, ref, ...).
 */
import { useId, type ComponentPropsWithRef } from 'react';
import { WarningGlyph } from './glyphs';
import { cx } from './util';
import './Field.css';

export interface FieldProps extends Omit<ComponentPropsWithRef<'input'>, 'children'> {
  label: string;
  hint?: string;
  error?: string;
}

export function Field({ label, hint, error, id, className, ...input }: FieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const hasError = error !== undefined && error !== '';
  const describedBy = [hint ? hintId : '', hasError ? errorId : ''].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cx('ui-field', className)} data-invalid={hasError ? 'true' : undefined}>
      <label className="ui-field__label" htmlFor={inputId}>
        {label}
      </label>
      {hint ? (
        <p id={hintId} className="ui-field__hint">
          {hint}
        </p>
      ) : null}
      <input
        {...input}
        id={inputId}
        className="ui-field__input"
        aria-invalid={hasError ? true : undefined}
        aria-describedby={describedBy}
      />
      {hasError ? (
        <p id={errorId} className="ui-field__error" role="alert">
          <WarningGlyph className="ui-glyph ui-field__error-glyph" />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}
