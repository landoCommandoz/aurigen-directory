/**
 * QA DEF-15: the confirmation of a new PIN is a new pad in the same place (NewPinEntry swaps it
 * with key={phase}). It used to start the full 350 ms tap guard again, which dropped the first one
 * or two confirmation digits typed at a steady 120 to 300 ms pace. A pad that steps in place now
 * drops only the second tap of a double tap on the key that finished the entry, for a moment sized
 * to the person's own pace (pinStep.ts).
 */
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen, type RenderResult } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PinPad } from '../PinPad';
import { STEP_GUARD_MIN_MS, STEP_GUARD_MS, stepHoldFor } from '../pinStep';
import { TAP_GUARD_MS } from '../useTapGuard';
import { advance, fingerTap } from './tap';

const PIN = '482915';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  // Lets a finished entry's hand-off clear, so it never reaches the next test.
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

function key(name: string): HTMLElement {
  return screen.getByRole('button', { name });
}

function pad(container: HTMLElement): Element | null {
  return container.querySelector('fieldset.ui-pinpad');
}

function filledDots(container: HTMLElement): number {
  return container.querySelectorAll('.ui-pinpad__dot[data-filled="true"]').length;
}

type OnComplete = (pin: string) => void;

/** The first pad of a new PIN, typed by taps after its arrival guard, `gap` ms per digit. */
function typeFirst(digits: string, onComplete: OnComplete, gap = 0): RenderResult {
  const view = render(<PinPad key="first" label="Create a 6 digit owner PIN" onComplete={onComplete} onCancel={vi.fn<() => void>()} />);
  advance(TAP_GUARD_MS);
  for (const digit of digits) {
    if (gap > 0) advance(gap);
    fingerTap(key(digit));
  }
  return view;
}

/** NewPinEntry's step: the confirmation pad replaces the first one in the same commit. */
function stepToConfirm(view: RenderResult, onComplete: OnComplete, onCancel = vi.fn<() => void>()): void {
  view.rerender(<PinPad key="confirm" label="Enter the same PIN again" onComplete={onComplete} onCancel={onCancel} />);
}

describe('PinPad step in place (QA DEF-15)', () => {
  it('sizes the hold on the doubled last key to the pace: 80 to 150 ms, always above a 40 ms double tap', () => {
    expect(STEP_GUARD_MIN_MS).toBeGreaterThan(40);
    expect(STEP_GUARD_MIN_MS).toBeLessThan(STEP_GUARD_MS);
    expect(STEP_GUARD_MS).toBeLessThanOrEqual(150);
    expect(STEP_GUARD_MS).toBeLessThan(TAP_GUARD_MS);
    expect(stepHoldFor([])).toBe(STEP_GUARD_MS);
    expect(stepHoldFor([500, 500, 500, 500, 500])).toBe(150);
    expect(stepHoldFor([250, 250, 250, 250, 250])).toBe(150);
    expect(stepHoldFor([200, 200, 200, 200, 200])).toBe(120);
    expect(stepHoldFor([120, 120, 120, 120, 120])).toBe(80);
    expect(stepHoldFor([0, 0, 0, 0, 0])).toBe(80);
    // A pause in the middle (looking up) does not stretch it: the middle gap counts.
    expect(stepHoldFor([200, 200, 3000, 200, 200])).toBe(120);
    expect(stepHoldFor([200, 220])).toBe(126);
    expect(stepHoldFor([Number.NaN, -5])).toBe(STEP_GUARD_MS);
  });

  it('the confirmation pad has no arrival hold: its keys never moved, and a different key counts at once', () => {
    const onComplete = vi.fn<OnComplete>();
    const view = typeFirst(PIN, onComplete);
    expect(onComplete).toHaveBeenCalledWith(PIN);
    stepToConfirm(view, onComplete);
    expect(pad(view.container)).not.toHaveAttribute('data-tap-guard');
    expect(pad(view.container)).toHaveAttribute('data-step', 'true');
    fingerTap(key('4'));
    expect(filledDots(view.container)).toBe(1);
  });

  for (const gap of [120, 200, 250, 300, 400]) {
    it(`a steady ${gap} ms per digit, taps, saves the new PIN and its confirmation`, () => {
      const onComplete = vi.fn<OnComplete>();
      const view = typeFirst(PIN, onComplete, gap);
      stepToConfirm(view, onComplete);
      for (const digit of PIN) {
        advance(gap);
        fingerTap(key(digit));
      }
      expect(onComplete.mock.calls).toEqual([[PIN], [PIN]]);
    });
  }

  it('a steady pace on hardware keys saves both entries from the first moment, with no wait at all', () => {
    const onComplete = vi.fn<OnComplete>();
    const view = render(<PinPad key="first" label="Create a 6 digit owner PIN" onComplete={onComplete} onCancel={vi.fn<() => void>()} />);
    for (const digit of PIN) fireEvent.keyDown(document, { key: digit });
    stepToConfirm(view, onComplete);
    expect(pad(view.container)).not.toHaveAttribute('data-tap-guard');
    for (const digit of PIN) fireEvent.keyDown(document, { key: digit });
    expect(onComplete.mock.calls).toEqual([[PIN], [PIN]]);
  });

  it('drops the second tap of a double tap on the last key (40 ms), and only that tap', () => {
    const onComplete = vi.fn<OnComplete>();
    const view = typeFirst(PIN, onComplete);
    stepToConfirm(view, onComplete);
    advance(40);
    fingerTap(key('5'));
    expect(filledDots(view.container)).toBe(0);
    expect(screen.getByText('0 of 6 digits entered')).toBeInTheDocument();
    fingerTap(key('4'));
    expect(filledDots(view.container)).toBe(1);
  });

  for (const [pace, hold] of [[300, 150], [200, 120], [120, 80]] as const) {
    it(`typed at ${pace} ms per digit, a tap on the last key is dropped for ${hold} ms, then it is a digit`, () => {
      const onComplete = vi.fn<OnComplete>();
      const view = typeFirst(PIN, onComplete, pace);
      stepToConfirm(view, onComplete);
      advance(hold - 1);
      fingerTap(key('5'));
      expect(filledDots(view.container)).toBe(0);
      advance(1);
      fingerTap(key('5'));
      expect(filledDots(view.container)).toBe(1);
    });
  }

  for (const pace of [120, 200, 250]) {
    it(`a PIN that starts with its own last digit confirms at a steady ${pace} ms pace`, () => {
      const same = '582915';
      const onComplete = vi.fn<OnComplete>();
      const view = typeFirst(same, onComplete, pace);
      stepToConfirm(view, onComplete);
      for (const digit of same) {
        advance(pace);
        fingerTap(key(digit));
      }
      expect(onComplete.mock.calls).toEqual([[same], [same]]);
    });
  }

  it('drops the double tap on whatever key now covers the spot, Cancel included, if the pad moved', () => {
    const onComplete = vi.fn<OnComplete>();
    const onCancel = vi.fn<() => void>();
    const view = render(<PinPad key="first" label="Create a 6 digit owner PIN" onComplete={onComplete} onCancel={vi.fn<() => void>()} />);
    advance(TAP_GUARD_MS);
    for (const digit of PIN.slice(0, 5)) fingerTap(key(digit));
    const spot = { x: 120, y: 400 };
    fingerTap(key('5'), spot);
    stepToConfirm(view, onComplete, onCancel);
    const box = { left: 90, top: 370, right: 150, bottom: 430, width: 60, height: 60, x: 90, y: 370 };
    vi.spyOn(key('Cancel'), 'getBoundingClientRect').mockReturnValue({ ...box, toJSON: () => box } as DOMRect);
    advance(40);
    fingerTap(key('Cancel'), spot);
    expect(onCancel).not.toHaveBeenCalled();
    advance(STEP_GUARD_MS);
    fingerTap(key('Cancel'), spot);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('a pad that stays mounted between entries (PinGate after a wrong PIN) takes a fast retry from its first digit', () => {
    const onComplete = vi.fn<OnComplete>();
    const view = typeFirst('000000', onComplete);
    expect(onComplete).toHaveBeenCalledWith('000000');
    advance(40);
    fingerTap(key('0'));
    expect(filledDots(view.container)).toBe(1);
    for (const digit of '00000') fingerTap(key(digit));
    expect(onComplete.mock.calls).toEqual([['000000'], ['000000']]);
  });

  it('a finish by Enter or Space on a key (no pointer) leaves no tap to drop', () => {
    const onComplete = vi.fn<OnComplete>();
    const view = render(<PinPad key="first" label="Create a 6 digit owner PIN" onComplete={onComplete} onCancel={vi.fn<() => void>()} />);
    for (const digit of PIN) fireEvent.click(key(digit)); // detail 0: keyboard activation
    stepToConfirm(view, onComplete);
    fingerTap(key('5'));
    expect(filledDots(view.container)).toBe(1);
  });

  it('a pad that arrives after a pause (a PIN check, a new screen) is a new arrival and holds the full window', () => {
    const onComplete = vi.fn<OnComplete>();
    const view = typeFirst(PIN, onComplete);
    view.rerender(<p>Checking</p>);
    advance(1);
    view.rerender(<PinPad key="later" label="Create a 6 digit owner PIN" onComplete={onComplete} onCancel={vi.fn<() => void>()} />);
    expect(pad(view.container)).toHaveAttribute('data-tap-guard', 'on');
    expect(pad(view.container)).not.toHaveAttribute('data-step');
    fingerTap(key('4'));
    expect(filledDots(view.container)).toBe(0);
    advance(TAP_GUARD_MS);
    fingerTap(key('4'));
    expect(filledDots(view.container)).toBe(1);
  });

  it('a pad opened by a button (no entry finished) still holds the full window (DEF-04 unchanged)', () => {
    const { container } = render(<PinPad label="Create a 6 digit owner PIN" onComplete={vi.fn<OnComplete>()} onCancel={vi.fn<() => void>()} />);
    expect(pad(container)).toHaveAttribute('data-tap-guard', 'on');
    advance(40);
    fingerTap(key('1'));
    expect(filledDots(container)).toBe(0);
  });
});
