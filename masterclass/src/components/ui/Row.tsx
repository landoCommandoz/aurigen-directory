/**
 * Row: a list row with a hairline between rows, and leading and trailing
 * slots. Rows, not cards, are how lists look in this app.
 *
 *   <RowList label="Backups">
 *     <Row as="li" title="Last backup" detail="Oct 10, 2026" trailing="Share" onClick={share} />
 *   </RowList>
 *
 * With onClick the whole row is one button (64 px tall in Shop density), so
 * the slots must hold words or glyphs, never their own buttons or inputs.
 * Without onClick the row is plain content and a trailing slot may hold a
 * control such as a Button.
 */
import { Children, type ReactNode } from 'react';
import { cx } from './util';
import './Row.css';

export interface RowProps {
  /** 'li' inside a RowList; 'div' anywhere else. */
  as?: 'div' | 'li';
  leading?: ReactNode;
  title: ReactNode;
  detail?: ReactNode;
  trailing?: ReactNode;
  /** Makes the whole row one tap target. */
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function Row({ as = 'div', leading, title, detail, trailing, onClick, disabled = false, className }: RowProps) {
  const Tag = as;
  const content = (
    <>
      {leading !== undefined && leading !== null ? (
        <span className="ui-row__leading" aria-hidden="true">
          {leading}
        </span>
      ) : null}
      <span className="ui-row__main">
        <span className="ui-row__title">{title}</span>
        {detail !== undefined && detail !== null && detail !== '' ? (
          <span className="ui-row__detail">{detail}</span>
        ) : null}
      </span>
      {trailing !== undefined && trailing !== null ? <span className="ui-row__trailing">{trailing}</span> : null}
    </>
  );

  if (onClick !== undefined) {
    return (
      <Tag className={cx('ui-row', className)} data-interactive="true">
        <button type="button" className="ui-row__body ui-row__hit ui-press" onClick={onClick} disabled={disabled}>
          {content}
        </button>
      </Tag>
    );
  }

  return (
    <Tag className={cx('ui-row', className)}>
      <div className="ui-row__body">{content}</div>
    </Tag>
  );
}

export interface RowListProps {
  children?: ReactNode;
  /** Optional name for the list, read by screen readers. */
  label?: string;
  /** Shown instead of the list when it has no rows, such as "No backups yet." */
  empty?: ReactNode;
  className?: string;
}

/**
 * A plain list of Rows. Put <Row as="li"> inside it. It never caps its height.
 * With no rows it shows the empty message in words instead of a blank gap.
 */
export function RowList({ children, label, empty, className }: RowListProps) {
  if (Children.toArray(children).length === 0) {
    return empty !== undefined && empty !== null ? (
      <p className={cx('ui-row-list__empty', className)}>{empty}</p>
    ) : null;
  }

  return (
    // role="list" keeps list semantics in Safari (VoiceOver) once list-style is removed.
    // eslint-disable-next-line jsx-a11y/no-redundant-roles
    <ul className={cx('ui-row-list', className)} role="list" aria-label={label}>
      {children}
    </ul>
  );
}
