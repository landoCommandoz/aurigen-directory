/**
 * useTapHold: a row of controls that ignores pointer taps for TAP_GUARD_MS after hold() is called,
 * so the second tap of a double tap never presses the control that just appeared under the thumb
 * (QA DEF-23, the read-aloud row). The rules are useTapGuard's (src/components/ui/useTapGuard.ts):
 * pointer taps are dropped, keyboard activation (a click with detail 0) never is, and a press that
 * began inside the hold is dropped even if released after it. The difference: useTapGuard holds
 * when a control arrives (mount, or its active flag turning on); this one holds each time a tap
 * swaps the controls in place, which useTapGuard cannot be asked to do again on demand.
 *
 *   const tapHold = useTapHold();
 *   <div data-tap-guard={tapHold.holding ? 'on' : undefined} {...tapHold.captureHandlers}>
 *   onClick={() => { pause(); tapHold.hold(); }}
 *
 * The CSS sets pointer-events none on the controls while data-tap-guard="on", so a real tap lands
 * on the row and does nothing; the capture handlers drop it too, for engines that skip hit testing.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TAP_GUARD_MS, type TapGuardHandlers } from '../../components/ui';

export interface TapHold {
  holding: boolean;
  /** Start (or restart) the hold now. Call it from the tap that swaps the controls. */
  hold: () => void;
  isHolding: () => boolean;
  captureHandlers: TapGuardHandlers;
}

export function useTapHold(ms: number = TAP_GUARD_MS): TapHold {
  const [holding, setHolding] = useState(false);
  const holdingRef = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pressBeganInside = useRef(false);

  useEffect(
    () => () => {
      if (timer.current !== null) clearTimeout(timer.current);
    },
    [],
  );

  const hold = useCallback(() => {
    // The ref first: a tap that arrives before React draws the new row is already held.
    holdingRef.current = true;
    setHolding(true);
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      timer.current = null;
      // The ref lets go first, then the DOM, as in useTapGuard.
      holdingRef.current = false;
      setHolding(false);
    }, ms);
  }, [ms]);

  const isHolding = useCallback(() => holdingRef.current, []);

  const captureHandlers = useMemo<TapGuardHandlers>(
    () => ({
      onPointerDownCapture: () => {
        pressBeganInside.current = holdingRef.current;
      },
      onClickCapture: (event) => {
        const beganInside = pressBeganInside.current;
        pressBeganInside.current = false;
        if (event.detail === 0) return; // keyboard activation or code: never held
        if (!holdingRef.current && !beganInside) return;
        event.preventDefault();
        event.stopPropagation();
      },
    }),
    [],
  );

  return { holding, hold, isHolding, captureHandlers };
}
