/**
 * The shell's mode: which density the internal screens use (DESIGN-DIRECTIONS Direction A,
 * src/design/README.md). Customer is not stored here: it follows the persisted Customer View
 * flag in settings (src/core/customerView.tsx), so a refresh in Customer View stays there.
 *
 * Shop or Academy is a per-phone convenience, kept in localStorage behind try/catch. With
 * storage blocked it still works for the session and starts at Shop next launch.
 * Shop is the default: Fix It and Quick Cards are the rooms live in Phase 1, and Shop's 64 px
 * targets work at arm's length on the cart (Lando, 2026-10-10).
 */
import { createStore, useStore } from '../core/store';

export type ShellMode = 'shop' | 'academy';
export type Density = 'shop' | 'academy' | 'customer';

export const MODE_STORAGE_KEY = 'masterclass.mode';
export const DEFAULT_MODE: ShellMode = 'shop';

export function isShellMode(value: unknown): value is ShellMode {
  return value === 'shop' || value === 'academy';
}

function readStoredMode(): ShellMode {
  try {
    const stored = window.localStorage.getItem(MODE_STORAGE_KEY);
    return isShellMode(stored) ? stored : DEFAULT_MODE;
  } catch {
    return DEFAULT_MODE;
  }
}

export const modeStore = createStore<{ mode: ShellMode; saved: boolean }>({ mode: readStoredMode(), saved: true });

/** Switch between Shop and Academy. Returns false when the choice could not be saved for next launch. */
export function setMode(mode: ShellMode): boolean {
  let saved = true;
  try {
    window.localStorage.setItem(MODE_STORAGE_KEY, mode);
  } catch {
    saved = false;
  }
  modeStore.set({ mode, saved });
  return saved;
}

export function useMode(): ShellMode {
  return useStore(modeStore).mode;
}

/** The density the frame shows. Customer View wins over the stored mode. */
export function densityFor(mode: ShellMode, customerViewOn: boolean): Density {
  return customerViewOn ? 'customer' : mode;
}

/**
 * Writes the density and the thumb side on <html>, where the drawer and the toasts (rendered
 * into document.body) can read them (src/design/README.md). Left is the default and has no
 * attribute.
 */
export function applyDocumentAttributes(density: Density, handedness: 'left' | 'right'): void {
  try {
    const root = document.documentElement;
    if (root.dataset.density !== density) root.dataset.density = density;
    if (handedness === 'right') root.dataset.hand = 'right';
    else delete root.dataset.hand;
  } catch {
    // No document (tests without a DOM): nothing to style.
  }
}
