import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Field } from '../Field';

afterEach(cleanup);

describe('Field', () => {
  it('ties the visible label to the input', () => {
    render(<Field label="Vehicle" />);
    expect(screen.getByLabelText('Vehicle')).toHaveClass('ui-field__input');
  });

  it('describes the input with its hint', () => {
    render(<Field label="Vehicle" hint="Year, make, model." />);
    expect(screen.getByLabelText('Vehicle')).toHaveAccessibleDescription('Year, make, model.');
    expect(screen.getByLabelText('Vehicle')).not.toHaveAttribute('aria-invalid');
  });

  it('marks an error in words and links it to the input', () => {
    render(<Field label="Vehicle" hint="Year, make, model." error="Add the year." />);
    const input = screen.getByLabelText('Vehicle');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Year, make, model. Add the year.');
    expect(screen.getByRole('alert')).toHaveTextContent('Add the year.');
  });

  it('treats an empty error as no error', () => {
    render(<Field label="Vehicle" error="" />);
    expect(screen.getByLabelText('Vehicle')).not.toHaveAttribute('aria-invalid');
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('passes input attributes, events, and the ref through', () => {
    const onChange = vi.fn<() => void>();
    const ref = createRef<HTMLInputElement>();
    render(<Field label="Reading" inputMode="numeric" autoComplete="off" onChange={onChange} ref={ref} id="reading" />);
    const input = screen.getByLabelText('Reading');
    expect(input).toHaveAttribute('inputmode', 'numeric');
    expect(input).toHaveAttribute('autocomplete', 'off');
    expect(input).toHaveAttribute('id', 'reading');
    expect(ref.current).toBe(input);
    fireEvent.change(input, { target: { value: '112' } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
