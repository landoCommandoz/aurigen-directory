/**
 * Small renderers for content shapes shared by Quick Cards, search results, and the item sheet:
 * labeled rows, plain lines, and the internal "unverified" badge. A superseded row or line never
 * renders; a verify row or line carries the badge, which sits inside <Internal> so it never
 * reaches Customer View (BLUEPRINT 7).
 */
import { lineStatus, lineText, visibleLines, type LineValue, type RowValue, type StatusName } from '../../schemas';
import { Internal } from '../../core/customerView';

export const UNVERIFIED = 'unverified';

/** The internal badge. Renders nothing in Customer View. */
export function UnverifiedBadge({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <Internal as="span">
      <span className="mc-badge">{UNVERIFIED}</span>
    </Internal>
  );
}

/** Rows that may render at all: superseded rows are left out. */
export function visibleRows<T extends { status?: StatusName | undefined }>(rows: readonly T[]): T[] {
  return rows.filter((row) => row.status !== 'superseded');
}

export function RowsList({ rows, label }: { rows: readonly RowValue[]; label?: string }) {
  const shown = visibleRows(rows);
  if (shown.length === 0) return null;
  return (
    <dl className="sr-rows" aria-label={label}>
      {shown.map((row, index) => (
        <div key={`${row.label}-${index}`} className="sr-rows__row">
          <dt className="sr-rows__label">
            {row.label}
            <UnverifiedBadge show={row.status === 'verify'} />
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
      {shown.map((line, index) => (
        <li key={`${lineText(line)}-${index}`}>
          {lineText(line)}
          <UnverifiedBadge show={lineStatus(line, itemStatus) === 'verify' && itemStatus !== 'verify'} />
        </li>
      ))}
    </Tag>
  );
}
