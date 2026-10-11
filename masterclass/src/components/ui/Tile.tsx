/**
 * Tile: the Fix It grid tile. An icon slot plus words; the words carry the
 * meaning. Tiles are the only cards in Shop Mode. Lay them out in a TileGrid
 * (two columns on a phone, more as the screen widens).
 *
 *   <TileGrid label="Machine">
 *     <Tile icon={<JerkGlyph />} label="Polisher jerks, walks, or hops" onClick={open} />
 *   </TileGrid>
 *
 * The STOP symptom is not a Tile: use <StopBand onClick> so it is the one red
 * object on the screen, full width.
 */
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from './util';
import './Tile.css';

export interface TileProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'> {
  /** A simple line glyph. Decorative. */
  icon?: ReactNode;
  /** The words on the tile, such as "Pad stopped spinning". */
  label: string;
  /** An optional second line in the dim text color. */
  detail?: string;
}

export function Tile({ icon, label, detail, className, ...rest }: TileProps) {
  return (
    <button {...rest} type="button" className={cx('ui-tile', 'ui-press', className)}>
      {icon !== undefined && icon !== null ? (
        <span className="ui-tile__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span className="ui-tile__label">{label}</span>
      {detail ? <span className="ui-tile__detail">{detail}</span> : null}
    </button>
  );
}

export interface TileGridProps {
  children: ReactNode;
  /** Optional group name, read by screen readers ("Machine", "Paint"). */
  label?: string;
  className?: string;
}

export function TileGrid({ children, label, className }: TileGridProps) {
  return (
    <div className={cx('ui-tile-grid', className)} role={label ? 'group' : undefined} aria-label={label}>
      {children}
    </div>
  );
}
