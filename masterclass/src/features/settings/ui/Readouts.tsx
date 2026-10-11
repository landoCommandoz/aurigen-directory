/**
 * A label and value list (a <dl>), used by the developer panel and the backup summary.
 * Every value is words; nothing rests on color.
 */
import type { ReactNode } from 'react';

export interface Readout {
  label: string;
  value: ReactNode;
}

export function Readouts({ items, label }: { items: readonly Readout[]; label?: string }) {
  if (items.length === 0) return null;
  return (
    <dl className="mc-readouts" aria-label={label}>
      {items.map((item) => (
        <div key={item.label} className="mc-readouts__row">
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
