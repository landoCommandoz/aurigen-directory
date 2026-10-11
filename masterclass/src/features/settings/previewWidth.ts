/**
 * The device preview width (developer tool). Core has no settings field for it, so it lives here as
 * a small per-viewer convenience, remembered in localStorage when the phone allows it (wrapped:
 * private mode or blocked storage simply forgets it). The shell reads usePreviewWidth() to size the
 * wrapper around the app frame; DevicePreviewBar writes it.
 */
import { createStore, useStore } from '../../core/store';

export const PREVIEW_WIDTHS = [375, 768] as const;
/** null: desktop, full width. */
export type PreviewWidth = (typeof PREVIEW_WIDTHS)[number] | null;

const STORAGE_KEY = 'mc-device-preview-width';

function readSaved(): PreviewWidth {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === '375') return 375;
    if (raw === '768') return 768;
    return null;
  } catch {
    return null;
  }
}

function save(width: PreviewWidth): void {
  try {
    if (width === null) window.localStorage.removeItem(STORAGE_KEY);
    else window.localStorage.setItem(STORAGE_KEY, String(width));
  } catch {
    // Storage blocked: the choice lasts until the page reloads.
  }
}

const previewStore = createStore<{ width: PreviewWidth }>({ width: typeof window === 'undefined' ? null : readSaved() });

/** The width the shell gives the app frame: 375, 768, or null for full width. */
export function usePreviewWidth(): PreviewWidth {
  return useStore(previewStore).width;
}

export function getPreviewWidth(): PreviewWidth {
  return previewStore.get().width;
}

export function setPreviewWidth(width: PreviewWidth): void {
  previewStore.set({ width });
  save(width);
}
