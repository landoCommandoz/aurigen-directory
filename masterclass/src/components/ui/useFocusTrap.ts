/**
 * Keeps keyboard focus inside a container while active (Drawer, and any
 * future dialog). On activate it focuses initialFocusRef, or the container
 * itself (give it tabIndex={-1}) so a screen reader reads the title first.
 * Tab and Shift+Tab wrap at the ends. On deactivate focus returns to the
 * element that had it before, if that element is still on the page.
 */
import { useEffect, type RefObject } from 'react';
import { focusableWithin } from './util';

export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  active: boolean,
  initialFocusRef?: RefObject<HTMLElement | null>,
): void {
  useEffect(() => {
    if (!active) return undefined;
    const container = containerRef.current;
    if (container === null) return undefined;

    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    (initialFocusRef?.current ?? container).focus({ preventScroll: true });

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Tab' || container === null) return;
      const items = focusableWithin(container);
      const first = items[0];
      const last = items[items.length - 1];
      if (first === undefined || last === undefined) {
        event.preventDefault();
        container.focus({ preventScroll: true });
        return;
      }
      const current = document.activeElement;
      const outside = current === null || !container.contains(current);
      if (event.shiftKey && (outside || current === first || current === container)) {
        event.preventDefault();
        last.focus({ preventScroll: true });
      } else if (!event.shiftKey && (outside || current === last)) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      if (previous !== null && previous.isConnected) previous.focus({ preventScroll: true });
    };
  }, [active, containerRef, initialFocusRef]);
}
