/**
 * Drawer: a bottom sheet. One tap, one panel, everything about it.
 *
 *   <Drawer open={open} onClose={() => setOpen(false)} eyebrow="Hood" title="Readings"
 *     footer={<Button variant="primary" block onClick={save}>Save</Button>}>
 *     ...content; it scrolls inside the sheet...
 *   </Drawer>
 *
 * Closes on Escape, on a tap on the dimmed backdrop, and on its Close button
 * (words, never an X alone). Focus is trapped inside while open and returns
 * to the opener after. The sheet grows with its content up to the space
 * under the top safe area and then its body scrolls: no max-height and no
 * overflow: hidden anywhere. Scroll is held on the backdrop layer
 * (overscroll-behavior and touch-action), never by locking the body.
 * There is no swipe to close: Shop Mode has no gestures.
 * Rendered into document.body, so set data-density on <html>.
 *
 * The sheet opens over the button that opened it. For TAP_GUARD_MS (350 ms)
 * after each opening, nothing in the layer takes a tap: the backdrop, Close,
 * and every button in the body and footer. So the second tap of a double tap
 * neither closes the sheet at once nor presses a button that just opened
 * under the thumb (QA DEF-04). Escape, Tab, and Enter or Space on a focused control work as
 * always (see useTapGuard).
 */
import { useEffect, useId, useRef, useState, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './Button';
import { useFocusTrap } from './useFocusTrap';
import { useTapGuard } from './useTapGuard';
import { exitDelay } from './util';
import './Drawer.css';

export interface DrawerProps {
  open: boolean;
  /** Called on Escape, a backdrop tap, or the Close button. The parent sets open to false. */
  onClose: () => void;
  /** The sheet's heading; also its accessible name. */
  title: string;
  /** A short line above the title, such as the panel name. */
  eyebrow?: string;
  children?: ReactNode;
  /** Action buttons pinned to the bottom of the sheet. */
  footer?: ReactNode;
  closeLabel?: string;
  /** Focus this on open instead of the sheet itself. */
  initialFocusRef?: RefObject<HTMLElement | null>;
}

type Phase = 'closed' | 'open' | 'closing';

export function Drawer({
  open,
  onClose,
  title,
  eyebrow,
  children,
  footer,
  closeLabel = 'Close',
  initialFocusRef,
}: DrawerProps) {
  const [phase, setPhase] = useState<Phase>(open ? 'open' : 'closed');
  const sheetRef = useRef<HTMLDialogElement>(null);
  const onCloseRef = useRef(onClose);
  const titleId = useId();

  // Follow the open prop during render (no extra paint): open, or start closing.
  if (open && phase !== 'open') setPhase('open');
  if (!open && phase === 'open') setPhase('closing');

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Closing plays the exit (200 ms, or none with reduced motion), then unmounts.
  useEffect(() => {
    if (phase !== 'closing') return undefined;
    const timer = window.setTimeout(() => setPhase('closed'), exitDelay());
    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'open') return undefined;
    function onKeyDown(event: KeyboardEvent) {
      // A PinPad inside the sheet handles Escape first (its Cancel).
      if (event.key === 'Escape' && !event.defaultPrevented) {
        event.preventDefault();
        onCloseRef.current();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [phase]);

  useFocusTrap(sheetRef, phase === 'open', initialFocusRef);
  const guard = useTapGuard(phase === 'open');

  if (phase === 'closed' || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="ui-drawer-layer"
      data-state={phase}
      data-tap-guard={guard.holding ? 'on' : undefined}
      {...guard.captureHandlers}
    >
      <div className="ui-drawer-backdrop" aria-hidden="true" onClick={() => onCloseRef.current()} />
      {/* A non-modal <dialog open>: showModal() would put the sheet in the top
          layer and make toasts ("Undo last") unreachable. The focus trap,
          Escape, and aria-modal give the modal behavior instead. */}
      <dialog ref={sheetRef} open className="ui-drawer" aria-modal="true" aria-labelledby={titleId} tabIndex={-1}>
        <div className="ui-drawer__handle" aria-hidden="true" />
        <header className="ui-drawer__header">
          <div className="ui-drawer__heading">
            {eyebrow ? <p className="ui-drawer__eyebrow">{eyebrow}</p> : null}
            <h2 id={titleId} className="ui-drawer__title">
              {title}
            </h2>
          </div>
          <Button variant="ghost" className="ui-drawer__close" onClick={() => onCloseRef.current()}>
            {closeLabel}
          </Button>
        </header>
        <div className="ui-drawer__body">{children}</div>
        {footer !== undefined && footer !== null ? <footer className="ui-drawer__footer">{footer}</footer> : null}
      </dialog>
    </div>,
    document.body,
  );
}
