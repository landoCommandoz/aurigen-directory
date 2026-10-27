import { afterEach, describe, expect, it, vi } from 'vitest';
import { parseAppConfig } from '../../schemas';
import { config } from '../config';
import { basenameFor } from '../deepLink';
import { getAppEnv } from '../env';
import {
  INSTALL_SNOOZE_KEY,
  INSTALL_SNOOZE_MS,
  readInstallSnooze,
  shouldShowInstallCard,
  snoozeInstallCard,
} from '../installCard';
import { MODE_STORAGE_KEY, applyDocumentAttributes, densityFor, modeStore, setMode } from '../mode';
import { OFFLINE_SAVED_LABEL, SAVED_NOT_SERVING_LABEL, statusWords } from '../status';

afterEach(() => {
  vi.restoreAllMocks();
  window.localStorage.clear();
  delete document.documentElement.dataset.density;
  delete document.documentElement.dataset.hand;
});

describe('mode and density', () => {
  it('Customer View wins over the stored mode', () => {
    expect(densityFor('shop', false)).toBe('shop');
    expect(densityFor('academy', false)).toBe('academy');
    expect(densityFor('shop', true)).toBe('customer');
    expect(densityFor('academy', true)).toBe('customer');
  });

  it('saves the mode for next launch', () => {
    expect(setMode('academy')).toBe(true);
    expect(window.localStorage.getItem(MODE_STORAGE_KEY)).toBe('academy');
    expect(modeStore.get()).toEqual({ mode: 'academy', saved: true });
    setMode('shop');
  });

  it('still switches when storage is blocked, and says it was not saved', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('blocked', 'SecurityError');
    });
    expect(setMode('academy')).toBe(false);
    expect(modeStore.get()).toEqual({ mode: 'academy', saved: false });
    vi.restoreAllMocks();
    setMode('shop');
  });

  it('writes density and thumb side on <html>, left by default with no attribute', () => {
    applyDocumentAttributes('customer', 'right');
    expect(document.documentElement.dataset.density).toBe('customer');
    expect(document.documentElement.dataset.hand).toBe('right');
    applyDocumentAttributes('shop', 'left');
    expect(document.documentElement.dataset.density).toBe('shop');
    expect(document.documentElement.dataset.hand).toBeUndefined();
  });
});

describe('install card', () => {
  const now = Date.parse('2026-10-10T18:00:00.000Z');

  it('shows in a browser tab and never in the installed app or Customer View', () => {
    expect(shouldShowInstallCard({ standalone: false, customerViewOn: false, hiddenUntil: 0, nowMs: now })).toBe(true);
    expect(shouldShowInstallCard({ standalone: true, customerViewOn: false, hiddenUntil: 0, nowMs: now })).toBe(false);
    expect(shouldShowInstallCard({ standalone: false, customerViewOn: true, hiddenUntil: 0, nowMs: now })).toBe(false);
  });

  it('Not now hides it for 24 hours, then it comes back', () => {
    const until = snoozeInstallCard(now);
    expect(until).toBe(now + INSTALL_SNOOZE_MS);
    expect(window.localStorage.getItem(INSTALL_SNOOZE_KEY)).toBe(String(until));
    expect(readInstallSnooze()).toBe(until);
    expect(shouldShowInstallCard({ standalone: false, customerViewOn: false, hiddenUntil: until, nowMs: now + 1000 })).toBe(false);
    expect(shouldShowInstallCard({ standalone: false, customerViewOn: false, hiddenUntil: until, nowMs: until })).toBe(true);
  });

  it('a snooze stamped far in the future by a moved clock does not hide it for good', () => {
    const farFuture = now + 30 * INSTALL_SNOOZE_MS;
    expect(shouldShowInstallCard({ standalone: false, customerViewOn: false, hiddenUntil: farFuture, nowMs: now })).toBe(true);
  });

  it('with storage blocked the snooze still holds for this launch', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('blocked', 'SecurityError');
    });
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('blocked', 'SecurityError');
    });
    const until = snoozeInstallCard(now);
    expect(readInstallSnooze()).toBe(until);
  });

  it('ignores a garbage stored value', () => {
    window.localStorage.setItem(INSTALL_SNOOZE_KEY, 'not a number');
    expect(Number.isFinite(readInstallSnooze())).toBe(true);
  });
});

describe('offline marker words (3.6)', () => {
  it('reads Ready offline, Saving for offline, Online, Offline ready, Offline', () => {
    expect(statusWords({ connectivity: 'online', offlineCopy: 'ready', registered: true, supported: true })).toEqual({ label: 'Ready offline', tone: 'ready' });
    expect(statusWords({ connectivity: 'online', offlineCopy: 'notSaved', registered: true, supported: true }).label).toBe('Saving for offline');
    expect(statusWords({ connectivity: 'online', offlineCopy: 'notSaved', registered: false, supported: true }).label).toBe('Online');
    expect(statusWords({ connectivity: 'offline', offlineCopy: 'ready', registered: true, supported: true })).toEqual({ label: 'Offline, ready', tone: 'ready' });
    expect(statusWords({ connectivity: 'offline', offlineCopy: 'notSaved', registered: false, supported: false })).toEqual({ label: 'Offline', tone: 'warning' });
    expect(statusWords({ connectivity: 'offline', offlineCopy: 'notSaved', registered: true, supported: true })).toEqual({ label: 'Offline', tone: 'warning' });
  });

  it('saved but not serving this page (QA DEF-29): says the copy is saved, never still saving, missing, or ready', () => {
    const online = statusWords({ connectivity: 'online', offlineCopy: 'savedNotServing', registered: true, supported: true });
    const offline = statusWords({ connectivity: 'offline', offlineCopy: 'savedNotServing', registered: true, supported: true });
    expect(online).toEqual({ label: SAVED_NOT_SERVING_LABEL, tone: 'neutral' });
    expect(offline).toEqual({ label: OFFLINE_SAVED_LABEL, tone: 'neutral' });
    for (const words of [online, offline]) {
      expect(words.label).toMatch(/saved/i);
      expect(words.label).not.toMatch(/Saving|Ready offline|Offline, ready/);
    }
    // The marker shares the top bar with Home and Settings: no longer than today's longest label,
    // or the bar wraps at 375 px in Shop density (measured in Chromium, Phase 2 DEF-29 fix).
    for (const words of [online, offline]) expect(words.label.length).toBeLessThanOrEqual('Saving for offline'.length);
    // Before registration is known, a saved copy still reads as saved.
    expect(statusWords({ connectivity: 'online', offlineCopy: 'savedNotServing', registered: false, supported: true }).label).toBe(SAVED_NOT_SERVING_LABEL);
  });

  it('every copy state and connection has words, and only a served page says ready', () => {
    for (const connectivity of ['online', 'offline'] as const)
      for (const offlineCopy of ['notSaved', 'savedNotServing', 'ready'] as const)
        for (const registered of [true, false]) {
          const words = statusWords({ connectivity, offlineCopy, registered, supported: true });
          expect(words.label.length).toBeGreaterThan(0);
          expect(words.tone === 'ready').toBe(offlineCopy === 'ready');
        }
  });
});

describe('router basename (DEF-09)', () => {
  it('keeps the trailing slash, so a link to "/" stays inside the service worker scope; the root stays "/"', () => {
    expect(basenameFor('/aurigen-directory/')).toBe('/aurigen-directory/');
    expect(basenameFor('/aurigen-directory')).toBe('/aurigen-directory/');
    expect(basenameFor('/aurigen-directory//')).toBe('/aurigen-directory/');
    expect(basenameFor('/')).toBe('/');
    expect(basenameFor('')).toBe('/');
  });
});

describe('brand config and build facts', () => {
  it('the public config parses with its schema (D7), the same check main.tsx runs at boot', () => {
    expect(() => parseAppConfig(config)).not.toThrow();
  });

  it('the developer panel gets the base path, the version, and the standalone flag', () => {
    const env = getAppEnv();
    expect(env.basePath).toBe(import.meta.env.BASE_URL);
    expect(env.appVersion).toBe(config.version);
    expect(typeof env.standalone).toBe('boolean');
  });
});
