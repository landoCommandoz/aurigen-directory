/**
 * Button: every button has words. No icon-only buttons.
 *
 *   <Button variant="primary" size="hero" block onClick={next}>Done, next</Button>
 *   <Button onClick={save} loading={saving} loadingLabel="Saving">Save</Button>
 *   <Button variant="stop" onClick={stopJob}>Stop the job</Button>
 *
 * Variants: primary (the accent; one per screen, and at most one per page in
 * Customer View), secondary (the default), ghost (text only), stop (STOP
 * actions only; draws the octagon). Sizes: default (44 px, 64 px in Shop
 * density), shop (64 px anywhere), hero (56 px, 96 px in Shop: "Done, next").
 * loading keeps the button focusable and ignores taps; disabled removes it
 * from the tab order and draws a dashed edge, so the state never rests on
 * color alone.
 */
import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from 'react';
import { OctagonGlyph, SpinnerGlyph } from './glyphs';
import { cx } from './util';
import './Button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'stop';
export type ButtonSize = 'default' | 'shop' | 'hero';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'> {
  /** The words on the button. */
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Full width of its container. */
  block?: boolean;
  /** Busy: shows a spinner, sets aria-busy, ignores taps, stays focusable. */
  loading?: boolean;
  /** Words to show while loading, such as "Saving". Defaults to the children. */
  loadingLabel?: string;
  /** Optional leading glyph. Decorative; the words carry the meaning. */
  icon?: ReactNode;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({
  children,
  variant = 'secondary',
  size = 'default',
  block = false,
  loading = false,
  loadingLabel,
  icon,
  disabled = false,
  type = 'button',
  className,
  onClick,
  ...rest
}: ButtonProps) {
  const leading = loading ? (
    <SpinnerGlyph className="ui-glyph ui-btn__spinner" />
  ) : (
    (icon ?? (variant === 'stop' ? <OctagonGlyph /> : null))
  );

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (loading) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  }

  return (
    <button
      {...rest}
      type={type}
      className={cx('ui-btn', 'ui-press', className)}
      data-variant={variant}
      data-size={size}
      data-block={block ? 'true' : undefined}
      data-loading={loading ? 'true' : undefined}
      disabled={disabled}
      aria-disabled={loading ? true : undefined}
      aria-busy={loading ? true : undefined}
      onClick={handleClick}
    >
      {leading !== null ? (
        <span className="ui-btn__icon" aria-hidden="true">
          {leading}
        </span>
      ) : null}
      <span className="ui-btn__label">{loading && loadingLabel ? loadingLabel : children}</span>
    </button>
  );
}
