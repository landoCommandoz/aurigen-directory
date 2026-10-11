import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SegmentedControl } from '../SegmentedControl';

afterEach(cleanup);

type Mode = 'shop' | 'academy' | 'customer';

const OPTIONS = [
  { value: 'shop', label: 'Shop' },
  { value: 'academy', label: 'Academy' },
  { value: 'customer', label: 'Customer' },
] as const;

describe('SegmentedControl', () => {
  it('is a named group of radio buttons with the current value checked', () => {
    render(<SegmentedControl<Mode> label="Mode" options={OPTIONS} value="academy" onChange={vi.fn<(value: string) => void>()} />);
    const group = screen.getByRole('group', { name: 'Mode' });
    const radios = within(group).getAllByRole('radio');
    expect(radios).toHaveLength(3);
    expect(screen.getByRole('radio', { name: 'Academy' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Shop' })).not.toBeChecked();
  });

  it('reports a new choice when a segment is tapped', () => {
    const onChange = vi.fn<(value: string) => void>();
    render(<SegmentedControl<Mode> label="Mode" options={OPTIONS} value="shop" onChange={onChange} />);
    fireEvent.click(screen.getByText('Customer'));
    expect(onChange).toHaveBeenCalledWith('customer');
  });

  it('does not report a tap on the segment that is already chosen', () => {
    const onChange = vi.fn<(value: string) => void>();
    render(<SegmentedControl<Mode> label="Mode" options={OPTIONS} value="shop" onChange={onChange} />);
    fireEvent.click(screen.getByText('Shop'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('places the thumb by index for the slide', () => {
    const { container } = render(
      <SegmentedControl<Mode> label="Mode" options={OPTIONS} value="customer" onChange={vi.fn<(value: string) => void>()} />,
    );
    const thumb = container.querySelector<HTMLElement>('.ui-segmented__thumb');
    expect(thumb?.style.getPropertyValue('--seg-index')).toBe('2');
    expect(thumb?.style.getPropertyValue('--seg-count')).toBe('3');
  });

  it('disables every segment when disabled', () => {
    render(<SegmentedControl<Mode> label="Mode" options={OPTIONS} value="shop" onChange={vi.fn<(value: string) => void>()} disabled />);
    for (const radio of screen.getAllByRole('radio')) expect(radio).toBeDisabled();
  });

  it('renders nothing for an empty list and no thumb for an unknown value', () => {
    const { container, rerender } = render(
      <SegmentedControl<Mode> label="Mode" options={[]} value="shop" onChange={vi.fn<(value: string) => void>()} />,
    );
    expect(container).toBeEmptyDOMElement();
    rerender(
      <SegmentedControl<string> label="Mode" options={OPTIONS} value="nothing" onChange={vi.fn<(value: string) => void>()} />,
    );
    expect(container.querySelector('.ui-segmented__thumb')).toBeNull();
    for (const radio of screen.getAllByRole('radio')) expect(radio).not.toBeChecked();
  });
});
