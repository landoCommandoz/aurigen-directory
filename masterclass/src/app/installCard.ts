/**
 * The install card (D3 risk 1, BLUEPRINT 5): shown whenever the app is not running as the
 * installed Home Screen app, because data in a Safari tab is separate and can be wiped after
 * 7 days of Safari use without a visit. "Not now" hides it for 24 hours; it comes back until the
 * app is installed. Never shown in Customer View (3.4).
 *
 * iOS has no install prompt, so the card gives Safari's steps in words. Browsers that fire
 * beforeinstallprompt (Chrome, Edge) get an Install button instead.
 */
import { createStore, useStore } from '../core/store';

export const INSTALL_SNOOZE_MS = 24 * 60 * 60 * 1000;
export const INSTALL_SNOOZE_KEY = 'masterclass.installCardHiddenUntil';

/** In-memory fallback when localStorage is blocked: the snooze then lasts for this launch. */
let memoryHiddenUntil = 0;

export function readInstallSnooze(): number {
  try {
    const raw = window.localStorage.getItem(INSTALL_SNOOZE_KEY);
    const value = raw === null ? 0 : Number(raw);
    return Number.isFinite(value) ? Math.max(value, memoryHiddenUntil) : memoryHiddenUntil;
  } catch {
    return memoryHiddenUntil;
  }
}

export function snoozeInstallCard(nowMs: number): number {
  const until = nowMs + INSTALL_SNOOZE_MS;
  memoryHiddenUntil = until;
  try {
    window.localStorage.setItem(INSTALL_SNOOZE_KEY, String(until));
  } catch {
    // Blocked storage: the in-memory snooze still hides it for this launch.
  }
  installState.update({ hiddenUntil: until });
  return until;
}

export interface InstallCardInput {
  standalone: boolean;
  customerViewOn: boolean;
  hiddenUntil: number;
  nowMs: number;
}

/** Pure rule. A snooze set in the future by a moved clock still ends within 24 hours of now. */
export function shouldShowInstallCard(input: InstallCardInput): boolean {
  if (input.standalone || input.customerViewOn) return false;
  if (input.hiddenUntil - input.nowMs > INSTALL_SNOOZE_MS) return true;
  return input.nowMs >= input.hiddenUntil;
}

/* ---------- beforeinstallprompt (Chrome, Edge, Android) ---------- */

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let deferred: InstallPromptEvent | null = null;

export const installState = createStore<{ canPrompt: boolean; hiddenUntil: number }>({ canPrompt: false, hiddenUntil: 0 });

export function useInstallState(): { canPrompt: boolean; hiddenUntil: number } {
  return useStore(installState);
}

let listening = false;

/** Call once at boot so the event is caught before the first screen draws. */
export function initInstallPrompt(): void {
  installState.update({ hiddenUntil: readInstallSnooze() });
  if (listening || typeof window === 'undefined') return;
  listening = true;
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferred = event as InstallPromptEvent;
    installState.update({ canPrompt: true });
  });
  window.addEventListener('appinstalled', () => {
    deferred = null;
    installState.update({ canPrompt: false });
  });
}

/** Opens the browser's own install prompt (inside a tap). Returns the outcome, or null if none is available. */
export async function promptInstall(): Promise<'accepted' | 'dismissed' | null> {
  const event = deferred;
  if (event === null) return null;
  deferred = null;
  installState.update({ canPrompt: false });
  try {
    await event.prompt();
    const choice = await event.userChoice;
    return choice.outcome;
  } catch {
    return null;
  }
}
