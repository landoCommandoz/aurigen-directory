import '@testing-library/jest-dom/vitest';
import { cleanup, createEvent, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PinPad } from '../PinPad';
import { TAP_GUARD_MS } from '../useTapGuard';
import { advance, fingerTap } from './tap';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  // Lets a finished entry's hand-off (pinStep.ts) clear, so it never reaches the next test.
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

function tap(...keys: string[]) {
  for (const key of keys) fireEvent.click(screen.getByRole('button', { name: key }));
}

function filledDots(container: HTMLElement): number {
  return container.querySelectorAll('.ui-pinpad__dot[data-filled="true"]').length;
}

function key(name: string): HTMLElement {
  return screen.getByRole('button', { name });
}

/** Press a hardware key on the page and report whether the pad (or anyone) handled it. */
function pressKey(name: string): boolean {
  const event = createEvent.keyDown(document, { key: name });
  fireEvent(document, event);
  return event.defaultPrevented;
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
    advance(TAP_GUARD_MS);
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
    advance(TAP_GUARD_MS);
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

describe('PinPad tap guard (QA DEF-04: a double tap on the opener lands on the pad)', () => {
  function renderPad() {
    const onComplete = vi.fn<(pin: string) => void>();
    const onCancel = vi.fn<() => void>();
    const view = render(<PinPad label="Create a 6 digit owner PIN" onComplete={onComplete} onCancel={onCancel} />);
    return { ...view, onComplete, onCancel };
  }

  it('holds for a named window of about 350 ms from the moment it appears', () => {
    expect(TAP_GUARD_MS).toBeGreaterThanOrEqual(300);
    expect(TAP_GUARD_MS).toBeLessThanOrEqual(400);
    const { container } = renderPad();
    const pad = container.querySelector('fieldset.ui-pinpad');
    expect(pad).toHaveAttribute('data-tap-guard', 'on');
    advance(TAP_GUARD_MS - 1);
    expect(pad).toHaveAttribute('data-tap-guard', 'on');
    advance(1);
    expect(pad).not.toHaveAttribute('data-tap-guard');
  });

  it('a tap inside the window does nothing: no digit, no Delete, no Cancel', () => {
    const { container, onCancel } = renderPad();
    advance(40); // the second tap of the double tap that opened the pad
    fingerTap(key('1'));
    fingerTap(key('Cancel'));
    advance(TAP_GUARD_MS - 80);
    fingerTap(key('0'));
    fingerTap(key('Delete'));
    expect(filledDots(container)).toBe(0);
    expect(screen.getByText('0 of 6 digits entered')).toBeInTheDocument();
    expect(onCancel).not.toHaveBeenCalled();
  });

  it('a tap after the window works: digits fill and Cancel cancels', () => {
    const { container, onCancel, onComplete } = renderPad();
    advance(TAP_GUARD_MS);
    for (const digit of '48291') fingerTap(key(digit));
    expect(filledDots(container)).toBe(5);
    fingerTap(key('5'));
    expect(onComplete).toHaveBeenCalledWith('482915');
    fingerTap(key('Cancel'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('a press that begins inside the window and lifts after it does nothing; the next tap works', () => {
    const { container } = renderPad();
    advance(TAP_GUARD_MS - 50);
    fireEvent.pointerDown(key('7'));
    advance(100);
    fireEvent.pointerUp(key('7'));
    fireEvent.click(key('7'), { detail: 1 });
    expect(filledDots(container)).toBe(0);
    fingerTap(key('7'));
    expect(filledDots(container)).toBe(1);
  });

  it('takes hardware keys at once, even inside the window: a key press is never the second tap of a double tap (DEF-15)', () => {
    const { container, onCancel } = renderPad();
    expect(container.querySelector('fieldset.ui-pinpad')).toHaveAttribute('data-tap-guard', 'on');
    expect(pressKey('5')).toBe(true);
    expect(filledDots(container)).toBe(1);
    expect(pressKey('Backspace')).toBe(true);
    expect(filledDots(container)).toBe(0);
    expect(pressKey('Tab')).toBe(false); // keyboard focus moves as always
    // Handled by the pad (its Cancel), so a Drawer around it does not close a second time.
    expect(pressKey('Escape')).toBe(true);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('takes no focus when it appears, and Enter or Space on a key reached with Tab works at once', () => {
    const { container } = renderPad();
    expect(container.contains(document.activeElement)).toBe(false);
    const one = key('1');
    one.focus();
    expect(one).toHaveFocus();
    fireEvent.click(one); // the click a browser sends for Enter or Space: detail 0, no pointer
    expect(filledDots(container)).toBe(1);
  });
});
