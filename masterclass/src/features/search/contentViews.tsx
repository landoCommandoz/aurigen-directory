/**
 * Small renderers for content shapes shared by Quick Cards, Fix It, lessons, procedures, and the
 * item page: labeled rows, plain lines, and the internal badges. A superseded row or line never
 * renders; a verify row or line carries the "unverified" badge; a line that waits on a decision
 * Lando has not made (its text says "(pending)") carries the "pending" badge instead, so it reads
 * as pending, not as a fact to check. Both badges sit inside <Internal>, so they never reach
 * Customer View (BLUEPRINT 7).
 */
import { lineStatus, lineText, visibleLines, type LineValue, type RowValue, type StatusName } from '../../schemas';
import { Internal } from '../../core/customerView';
import { isPendingText } from '../shared/speechText';
import '../shared/shared.css';

export const UNVERIFIED = 'unverified';
export const PENDING = 'pending';

/** The internal "unverified" badge. Renders nothing in Customer View. */
export function UnverifiedBadge({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <Internal as="span">
      <span className="mc-badge">{UNVERIFIED}</span>
    </Internal>
  );
}

/** The internal "pending" badge: a decision Lando has not made yet. Renders nothing in Customer View. */
export function PendingBadge({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <Internal as="span">
      <span className="mc-badge mc-badge--pending">{PENDING}</span>
    </Internal>
  );
}

/** Which badge a line or row carries: pending wins over unverified, and none when it is settled. */
export function badgeFor(text: string, ownStatus: StatusName, itemStatus: StatusName): 'pending' | 'unverified' | null {
  if (isPendingText(text)) return 'pending';
  if (ownStatus === 'verify' && itemStatus !== 'verify') return 'unverified';
  return null;
}

export function LineBadge({ kind }: { kind: 'pending' | 'unverified' | null }) {
  if (kind === 'pending') return <PendingBadge show />;
  if (kind === 'unverified') return <UnverifiedBadge show />;
  return null;
}

/** Rows that may render at all: superseded rows are left out. */
export function visibleRows<T extends { status?: StatusName | undefined }>(rows: readonly T[]): T[] {
  return rows.filter((row) => row.status !== 'superseded');
}

export function RowsList({ rows, label, itemStatus = 'house' }: { rows: readonly RowValue[]; label?: string; itemStatus?: StatusName }) {
  const shown = visibleRows(rows);
  if (shown.length === 0) return null;
  return (
    <dl className="sr-rows" aria-label={label}>
      {shown.map((row, index) => (
        <div key={`${row.label}-${index}`} className="sr-rows__row" data-pending={isPendingText(`${row.label} ${row.value}`) ? 'true' : undefined}>
          <dt className="sr-rows__label">
            {row.label}
            <LineBadge kind={badgeFor(`${row.label} ${row.value}`, row.status ?? itemStatus, itemStatus)} />
          </dt>
          <dd className="sr-rows__value">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function LinesList({
  lines,
  itemStatus,
  ordered = false,
  label,
}: {
  lines: readonly LineValue[];
  itemStatus: StatusName;
  ordered?: boolean;
  label?: string;
}) {
  const shown = visibleLines(lines, itemStatus);
  if (shown.length === 0) return null;
  const Tag = ordered ? 'ol' : 'ul';
  return (
    <Tag className="sr-lines" aria-label={label}>
      {shown.map((line, index) => {
        const text = lineText(line);
        const kind = badgeFor(text, lineStatus(line, itemStatus), itemStatus);
        return (
          <li key={`${text}-${index}`} data-pending={kind === 'pending' ? 'true' : undefined}>
            {text}
            <LineBadge kind={kind} />
          </li>
        );
      })}
    </Tag>
  );
}
