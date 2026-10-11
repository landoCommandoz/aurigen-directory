import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PinPad } from '../PinPad';

afterEach(cleanup);

function tap(...keys: string[]) {
  for (const key of keys) fireEvent.click(screen.getByRole('button', { name: key }));
}

function filledDots(container: HTMLElement): number {
  return container.querySelectorAll('.ui-pinpad__dot[data-filled="true"]').length;
}

describe('PinPad', () => {
  it('is a named group with six masked dots and no text field to autofill', () => {
    const { container } = render(<PinPad label="Enter owner PIN" onComplete={vi.fn<(pin: string) => void>()} onCancel={vi.fn<() => void>()} />);
    expect(screen.getByRole('group', { name: 'Enter owner PIN' })).toBeInTheDocument();
    expect(container.querySelectorAll('.ui-pinpad__dot')).toHaveLength(6);
    expect(container.querySelector('input')).toBeNull();
  });

  it('fills dots as keys are tapped, then hands over the PIN and clears', () => {
    const onComplete = vi.fn<(pin: string) => void>();
    const { container } = render(<PinPad label="Enter owner PIN" onComplete={onComplete} onCancel={vi.fn<() => void>()} />);
    tap('1', '2', '3');
    expect(filledDots(container)).toBe(3);
    expect(screen.getByText('3 of 6 digits entered')).toBeInTheDocument();
    tap('4', '5', '0');
    expect(onComplete).toHaveBeenCalledWith('123450');
    expect(filledDots(container)).toBe(0);
  });

  it('deletes the last digit, and Delete is marked off when empty', () => {
    const { container } = render(<PinPad label="Enter owner PIN" onComplete={vi.fn<(pin: string) => void>()} onCancel={vi.fn<() => void>()} />);
    const remove = screen.getByRole('button', { name: 'Delete' });
    expect(remove).toHaveAttribute('aria-disabled', 'true');
    tap('7', '8');
    expect(remove).not.toHaveAttribute('aria-disabled');
    tap('Delete');
    expect(filledDots(container)).toBe(1);
  });

  it('cancels from the Cancel key', () => {
    const onCancel = vi.fn<() => void>();
    render(<PinPad label="Enter owner PIN" onComplete={vi.fn<(pin: string) => void>()} onCancel={onCancel} />);
    tap('Cancel');
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('ignores digits while disabled but keeps keys focusable and Cancel working', () => {
    const onComplete = vi.fn<(pin: string) => void>();
    const onCancel = vi.fn<() => void>();
    const { container } = render(
      <PinPad
        label="Enter owner PIN"
        onComplete={onComplete}
        onCancel={onCancel}
        disabled
        status="Locked for 30 seconds."
      />,
    );
    const one = screen.getByRole('button', { name: '1' });
    expect(one).toHaveAttribute('aria-disabled', 'true');
    expect(one).not.toBeDisabled();
    tap('1', '1', '1', '1', '1', '1');
    expect(filledDots(container)).toBe(0);
    expect(onComplete).not.toHaveBeenCalled();
    expect(screen.getByText('Locked for 30 seconds.')).toBeInTheDocument();
    tap('Cancel');
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('takes digits, Backspace, and Escape from a hardware keyboard', () => {
    const onComplete = vi.fn<(pin: string) => void>();
    const onCancel = vi.fn<() => void>();
    const { container } = render(<PinPad label="Enter owner PIN" onComplete={onComplete} onCancel={onCancel} length={4} />);
    for (const key of ['9', '8', '7']) fireEvent.keyDown(document, { key });
    expect(filledDots(container)).toBe(3);
    fireEvent.keyDown(document, { key: 'Backspace' });
    expect(filledDots(container)).toBe(2);
    fireEvent.keyDown(document, { key: '1' });
    fireEvent.keyDown(document, { key: '2' });
    expect(onComplete).toHaveBeenCalledWith('9812');
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('leaves keys typed into a real text field alone', () => {
    const { container } = render(
      <>
        <input aria-label="Note" />
        <PinPad label="Enter owner PIN" onComplete={vi.fn<(pin: string) => void>()} onCancel={vi.fn<() => void>()} />
      </>,
    );
    fireEvent.keyDown(screen.getByRole('textbox', { name: 'Note' }), { key: '5' });
    expect(filledDots(container)).toBe(0);
  });

  it('shows an error in words with a glyph, and marks the dots for the shake', () => {
    const { container } = render(
      <PinPad label="Enter owner PIN" onComplete={vi.fn<(pin: string) => void>()} onCancel={vi.fn<() => void>()} error="Wrong PIN. 2 tries left." />,
    );
    expect(screen.getByText('Wrong PIN. 2 tries left.')).toBeInTheDocument();
    expect(container.querySelector('.ui-pinpad__dots')).toHaveAttribute('data-error', 'true');
    expect(container.querySelector('.ui-pinpad__message svg')).not.toBeNull();
  });

  it('survives a nonsense length', () => {
    const onComplete = vi.fn<(pin: string) => void>();
    const { container } = render(<PinPad label="PIN" onComplete={onComplete} onCancel={vi.fn<() => void>()} length={0} />);
    expect(container.querySelectorAll('.ui-pinpad__dot')).toHaveLength(1);
    tap('4');
    expect(onComplete).toHaveBeenCalledWith('4');
  });
});
