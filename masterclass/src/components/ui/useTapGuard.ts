/**
 * useTapGuard: a control that appears where the last tap landed ignores taps
 * for a moment, so the second tap of a double tap never presses it. QA
 * DEF-04: a double tap on Start fresh landed on the PIN pad's Cancel, and a
 * double tap on "Create the owner PIN" typed a stray digit.
 *
 *   const guard = useTapGuard();            // from mount (PinPad, a toast)
 *   const guard = useTapGuard(open);        // each time open turns true (Drawer)
 *   <div data-tap-guard={guard.holding ? 'on' : undefined} {...guard.captureHandlers}>
 *
 * For TAP_GUARD_MS after it starts:
 * - Pointer taps do nothing. The component's CSS sets pointer-events: none on
 *   its controls while data-tap-guard="on", so a real tap lands on the
 *   container, which has no action. The capture handlers drop the tap too,
 *   for engines that skip hit testing, and drop a press that began inside
 *   the window and was released after it.
 * - Keyboard activation is never held. Enter or Space on a focused control
 *   gives a click with no pointer behind it (detail 0). A control that has
 *   just appeared never has focus (focus stays on the page, or the Drawer
 *   takes it on the sheet itself), so reaching one takes a deliberate Tab,
 *   which cannot be carried over from the screen before.
 * - Hardware keys are never held either. A key press cannot be the second
 *   tap of a double tap, so the PIN pad takes its digits, Backspace, and
 *   Escape at once (QA DEF-15). isHolding() stays for any listener outside
 *   React's events that has a real reason to ask.
 *
 * A PIN pad that steps in place to its next entry (the confirmation of a new
 * PIN) is not a new arrival and does not start this guard: see pinStep.ts.
 *
 * The DOM side holds from the first render that shows the control, and the
 * handler side from the layout effect of that same commit, so no frame is
 * painted, and no tap handled, before the guard takes hold. With reduced
 * motion the guard still holds: it is about thumbs, not animation.
 */
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent } from 'react';

/**
 * How long a newly shown control ignores taps: longer than the gap inside a
 * double tap (the QA run uses 40 ms; DEF-04 suggested about 300 ms), short
 * enough that a deliberate look-then-tap never meets it. It also covers the
 * Drawer's 320 ms entrance. The PIN pad keys, a Drawer, and a toast's action
 * share it.
 */
export const TAP_GUARD_MS = 350;

export interface TapGuardHandlers {
  onPointerDownCapture: (event: ReactPointerEvent<HTMLElement>) => void;
  onClickCapture: (event: ReactMouseEvent<HTMLElement>) => void;
}

export interface TapGuard {
  /** True while the guard holds. Drives data-tap-guard="on" for the CSS. */
  holding: boolean;
  /** The same answer, read at the moment of an event, for a listener outside React's events. */
  isHolding: () => boolean;
  /** Spread on the element that wraps the guarded controls. */
  captureHandlers: TapGuardHandlers;
}

export function useTapGuard(active = true): TapGuard {
  const [holding, setHolding] = useState(active);
  const [wasActive, setWasActive] = useState(active);
  const holdingRef = useRef(active);
  const pressBeganInside = useRef(false);

  // Turning active holds in the same render (no extra paint), like the
  // Drawer's own open and close.
  if (active !== wasActive) {
    setWasActive(active);
    if (active) setHolding(true);
  }

  useLayoutEffect(() => {
    if (!active) return undefined;
    holdingRef.current = true;
    const timer = window.setTimeout(() => {
      // The ref lets go first, then the DOM. A tap between the two lands on
      // the container (pointer-events still none) and does nothing, never the reverse.
      holdingRef.current = false;
      setHolding(false);
    }, TAP_GUARD_MS);
    return () => window.clearTimeout(timer);
  }, [active]);

  const isHolding = useCallback(() => holdingRef.current, []);

  const captureHandlers = useMemo<TapGuardHandlers>(
    () => ({
      onPointerDownCapture: () => {
        pressBeganInside.current = holdingRef.current;
      },
      onClickCapture: (event) => {
        const beganInside = pressBeganInside.current;
        pressBeganInside.current = false;
        if (event.detail === 0) return; // keyboard activation or code: never carried over
        if (!holdingRef.current && !beganInside) return;
        event.preventDefault();
        event.stopPropagation();
      },
    }),
    [],
  );

  return { holding, isHolding, captureHandlers };
}
