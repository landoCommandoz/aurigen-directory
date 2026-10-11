/** Small helpers shared by the base components. No state, no side effects. */

/** Joins class names, skipping empty, false, null, and undefined. */
export function cx(...parts: ReadonlyArray<string | false | null | undefined>): string {
  return parts.filter((part): part is string => typeof part === 'string' && part !== '').join(' ');
}

/**
 * True when the phone asks for reduced motion. Guarded: some engines and the
 * test DOM have no matchMedia, and the answer then is false.
 */
export function prefersReducedMotion(): boolean {
  try {
    return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

/** How long exit animations run (the --dur-fast token), or 0 with reduced motion. */
export function exitDelay(): number {
  return prefersReducedMotion() ? 0 : 200;
}

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(',');

/** Keyboard-reachable elements inside a container, in DOM order. */
export function focusableWithin(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (element) => element.closest('[hidden], [inert]') === null,
  );
}
