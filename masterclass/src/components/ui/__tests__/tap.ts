/**
 * Test helpers for the tap guard (useTapGuard). Not imported by app code.
 *
 * fireEvent.click alone sends a click with detail 0, which is what a browser
 * sends for Enter or Space on a focused control. A finger or mouse tap is a
 * pointer down, a pointer up, and then a click with detail 1.
 */
import { act, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

/** A finger tap on the element, as a phone reports it, optionally at a screen point. */
export function fingerTap(target: Element, point?: { x: number; y: number }): void {
  const at = point === undefined ? {} : { clientX: point.x, clientY: point.y };
  fireEvent.pointerDown(target, at);
  fireEvent.pointerUp(target, at);
  fireEvent.click(target, { detail: 1, ...at });
}

/** Move the fake clock on, letting React apply what the timers set. */
export function advance(ms: number): void {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}
