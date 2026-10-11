/**
 * Toast: a short, non-blocking notice that leaves on its own. The undo
 * pattern lives here: do the thing, then offer "Undo last" for 5 seconds,
 * instead of asking "Are you sure?" first.
 *
 *   <ToastProvider held={customerViewOn}> ...app... </ToastProvider>
 *
 *   const toast = useToast();
 *   toast.show('Step done', { action: { label: 'Undo last', onAction: undoLast } });
 *   toast.show('Backup saved', { tone: 'success' });
 *
 * held: while true nothing is shown and no timer runs (Customer View, D10).
 * Each toast says what happens to it meanwhile: whenHeld 'queue' (default)
 * shows it, with its full time, once held turns false; 'drop' discards it.
 * A toast on screen when held turns on leaves the screen at once.
 * The timer pauses while the mouse is over the toast or keyboard focus is
 * on its action. Escape on the action dismisses the toast. At most `max` show at a time;
 * the rest wait their turn. The action button and the toast sit on the thumb
 * side (data-hand on <html>; left by default). Toasts float above the bottom
 * row (--toast-offset, from --bottom-row-height in tokens.css).
 *
 * "Undo last" appears in the thumb zone right after a tap. For TAP_GUARD_MS
 * (350 ms) after a toast appears its action takes no tap, so the second tap
 * of a double tap never undoes what the first one did (the DEF-04 family;
 * see useTapGuard). Keyboard focus and Enter on the action work as always.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './Button';
import { CheckGlyph, InfoGlyph, WarningGlyph } from './glyphs';
import { useTapGuard } from './useTapGuard';
import { exitDelay } from './util';
import './Toast.css';

export type ToastTone = 'info' | 'success' | 'warning';

export interface ToastOptions {
  tone?: ToastTone;
  /** One action, such as Undo last. Tapping it runs onAction and closes the toast. */
  action?: { label: string; onAction: () => void };
  /** Milliseconds on screen. Default 5000; never less than 2000. */
  duration?: number;
  /** What to do with this toast while toasts are held. Default 'queue'. */
  whenHeld?: 'queue' | 'drop';
}

export interface ToastApi {
  /** Shows a toast and returns its id, or null if it was dropped because toasts are held. */
  show: (message: string, options?: ToastOptions) => number | null;
  dismiss: (id: number) => void;
}

interface ToastItem extends ToastOptions {
  id: number;
  message: string;
  leaving: boolean;
}

const ToastContext = createContext<ToastApi | null>(null);

const DEFAULT_DURATION = 5000;
const MIN_DURATION = 2000;

/** The toast API. Must be used inside a ToastProvider. */
export function useToast(): ToastApi {
  const api = useContext(ToastContext);
  if (api === null) throw new Error('useToast must be used inside <ToastProvider>');
  return api;
}

export interface ToastProviderProps {
  children: ReactNode;
  /** Hold every toast (Customer View). */
  held?: boolean;
  /** How many toasts may show at once. */
  max?: number;
}

export function ToastProvider({ children, held = false, max = 3 }: ToastProviderProps) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const [wasHeld, setWasHeld] = useState(held);
  const nextId = useRef(1);
  const heldRef = useRef(held);
  const timers = useRef(new Map<number, number>());

  // Held just turned on: drop the toasts that asked to be dropped (during render, no extra paint).
  if (held !== wasHeld) {
    setWasHeld(held);
    if (held) setItems((previous) => previous.filter((item) => item.whenHeld !== 'drop'));
  }

  useEffect(() => {
    heldRef.current = held;
  }, [held]);

  useEffect(() => {
    const pending = timers.current;
    return () => {
      for (const timer of pending.values()) window.clearTimeout(timer);
      pending.clear();
    };
  }, []);

  const remove = useCallback((id: number) => {
    timers.current.delete(id);
    setItems((previous) => previous.filter((item) => item.id !== id));
  }, []);

  const dismiss = useCallback(
    (id: number) => {
      if (timers.current.has(id)) return;
      setItems((previous) => previous.map((item) => (item.id === id ? { ...item, leaving: true } : item)));
      timers.current.set(
        id,
        window.setTimeout(() => remove(id), exitDelay()),
      );
    },
    [remove],
  );

  const show = useCallback((message: string, options: ToastOptions = {}) => {
    if (heldRef.current && options.whenHeld === 'drop') return null;
    const id = nextId.current;
    nextId.current += 1;
    setItems((previous) => [...previous, { ...options, id, message, leaving: false }]);
    return id;
  }, []);

  const api = useMemo<ToastApi>(() => ({ show, dismiss }), [show, dismiss]);
  const visible = held ? [] : items.slice(0, Math.max(1, max));

  return (
    <ToastContext.Provider value={api}>
      {children}
      {typeof document === 'undefined'
        ? null
        : createPortal(
            <section className="ui-toast-viewport" aria-label="Notices" aria-live="polite" aria-relevant="additions">
              {visible.map((item) => (
                <ToastCard key={item.id} item={item} onDismiss={dismiss} />
              ))}
            </section>,
            document.body,
          )}
    </ToastContext.Provider>
  );
}

const TONE_GLYPH: Record<ToastTone, ReactNode> = {
  info: <InfoGlyph />,
  success: <CheckGlyph />,
  warning: <WarningGlyph />,
};

interface ToastCardProps {
  item: ToastItem;
  onDismiss: (id: number) => void;
}

function ToastCard({ item, onDismiss }: ToastCardProps) {
  const [paused, setPaused] = useState(false);
  const remaining = useRef(Math.max(MIN_DURATION, item.duration ?? DEFAULT_DURATION));
  const tone = item.tone ?? 'info';
  const { id, leaving } = item;
  const guard = useTapGuard();

  useEffect(() => {
    if (paused || leaving) return undefined;
    const started = Date.now();
    const timer = window.setTimeout(() => onDismiss(id), remaining.current);
    return () => {
      window.clearTimeout(timer);
      remaining.current = Math.max(0, remaining.current - (Date.now() - started));
    };
  }, [paused, leaving, id, onDismiss]);

  return (
    <div
      className="ui-toast"
      data-tone={tone}
      data-state={leaving ? 'leaving' : 'shown'}
      data-tap-guard={guard.holding ? 'on' : undefined}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      {...guard.captureHandlers}
    >
      <span className="ui-toast__glyph" aria-hidden="true">
        {TONE_GLYPH[tone]}
      </span>
      <p className="ui-toast__message">{item.message}</p>
      {item.action ? (
        <Button
          className="ui-toast__action"
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') onDismiss(id);
          }}
          onClick={() => {
            item.action?.onAction();
            onDismiss(id);
          }}
        >
          {item.action.label}
        </Button>
      ) : null}
    </div>
  );
}
