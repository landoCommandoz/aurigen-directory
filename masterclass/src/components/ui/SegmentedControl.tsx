/**
 * SegmentedControl: the mode switch (Shop, Academy, Customer), and any other
 * one-of-a-few choice. Built on native radio buttons in a fieldset, so the
 * browser handles the arrow keys and screen readers hear "radio, 1 of 3".
 * Only the chosen segment is in the tab order. Segments are 64 px tall in
 * Shop density. The chosen segment slides to its place in 320 ms. In
 * Customer density it is off-white, never the accent.
 *
 *   <SegmentedControl label="Mode" value={mode} onChange={setMode}
 *     options={[{ value: 'shop', label: 'Shop' }, { value: 'academy', label: 'Academy' }]} />
 */
import { useId, type CSSProperties } from 'react';
import { cx } from './util';
import './SegmentedControl.css';

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

export interface SegmentedControlProps<T extends string> {
  /** The group's name ("Mode"). Read by screen readers; hidden on screen. */
  label: string;
  options: ReadonlyArray<SegmentedOption<T>>;
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
  className?: string;
}

export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
  disabled = false,
  className,
}: SegmentedControlProps<T>) {
  const name = useId();
  if (options.length === 0) return null;

  const selectedIndex = options.findIndex((option) => option.value === value);
  const thumbStyle = {
    '--seg-index': String(Math.max(0, selectedIndex)),
    '--seg-count': String(options.length),
  } as CSSProperties;

  return (
    <fieldset className={cx('ui-segmented', className)} disabled={disabled}>
      <legend className="ui-visually-hidden">{label}</legend>
      <div className="ui-segmented__track">
        {selectedIndex >= 0 ? <span className="ui-segmented__thumb" aria-hidden="true" style={thumbStyle} /> : null}
        {options.map((option) => {
          const checked = option.value === value;
          return (
            <label
              key={option.value}
              className="ui-segmented__option ui-press"
              data-checked={checked ? 'true' : undefined}
            >
              <input
                type="radio"
                className="ui-segmented__input ui-visually-hidden"
                name={name}
                value={option.value}
                checked={checked}
                onChange={() => {
                  if (!checked) onChange(option.value);
                }}
              />
              <span className="ui-segmented__text">{option.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
