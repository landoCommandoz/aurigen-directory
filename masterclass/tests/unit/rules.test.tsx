/**
 * Every state table and pure rule behind the Phase 1 screens, exhaustively: the device role
 * screen, the setup flow, the restore flow (every event not in a row is refused and changes
 * nothing), the banner rules (nothing at all in Customer View), the developer tools rule, the
 * Pages deep link guard, and two shell defects reproduced at unit level.
 */
import 'fake-indexeddb/auto';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { pickBanners, type BannerInput } from '../../src/app/banners/bannerRules';
import { deepLinkTarget } from '../../src/app/deepLink';
import { AppRoutes } from '../../src/app/routes';
import { ToastProvider } from '../../src/components/ui';
import { CustomerViewProvider, turnCustomerViewOn } from '../../src/core/customerView';
import { __resetDbForTests } from '../../src/core/db';
import { startFresh } from '../../src/core/deviceRole';
import { __resetPinStateForTests } from '../../src/core/pin';
import { __resetSettingsStoreForTests } from '../../src/core/settingsStore';
import { developerToolsAllowed } from '../../src/features/settings/devTools';
import { restoreBlocker, restoreTransitions, nextRestoreView, type RestoreEvent, type RestoreView } from '../../src/features/settings/restoreFlow';
import { WORKING_VIEWS, nextRoleView, roleTransitions, shopTapAllowed, typedWordMatches, START_FRESH_WORD, RESTORE_WORD, type RoleEvent, type RoleView } from '../../src/features/settings/roleFlow';
import { nextSetupView, setupTransitions, type SetupEvent, type SetupView } from '../../src/features/settings/setupFlow';

const ROLE_EVENTS: RoleEvent[] = ['SHOP_TAP', 'PIN_OK', 'CHOOSE_IMPORT', 'CHOOSE_FRESH', 'FILE_OK', 'CONFIRM', 'CONFIRM_NEEDS_PIN', 'WORD_OK', 'WORD_OK_NEW_PIN', 'WORD_OK_NEEDS_PIN', 'NEW_PIN', 'STUDY_TAP', 'DONE', 'FAILED', 'CANCEL', 'BACK'];
const SETUP_EVENTS: SetupEvent[] = ['CREATE_PIN', 'CHANGE_PIN', 'CURRENT_OK', 'PIN_CONFIRMED', 'SAVED', 'SAVE_FAILED', 'BACKUP_NOW', 'BACKUP_DONE', 'NOT_NOW', 'CANCEL', 'BACK'];
const RESTORE_EVENTS: RestoreEvent[] = ['START', 'FILE_OK', 'APPLY', 'APPLY_NEEDS_PIN', 'PIN_OK', 'DONE', 'FAILED', 'CANCEL', 'CLOSE'];

describe('device role screen table (BLUEPRINT 3.9)', () => {
  const views = Object.keys(roleTransitions) as RoleView[];

  it('every event not in a row is refused (null), for every view', () => {
    for (const view of views) {
      const row: Partial<Record<RoleEvent, RoleView>> = roleTransitions[view];
      expect(ROLE_EVENTS.map((event) => nextRoleView(view, event))).toEqual(ROLE_EVENTS.map((event) => row[event] ?? null));
    }
  });

  it('every non-working view has a Cancel back to the overview (or Back from the result); working views have none', () => {
    const outcome: Record<string, string | null> = {};
    const expected: Record<string, string | null> = {};
    for (const view of views) {
      if (view === 'overview') continue;
      const working = WORKING_VIEWS.includes(view);
      outcome[view] = working ? `${String(nextRoleView(view, 'CANCEL'))}|${nextRoleView(view, 'FAILED') === null ? 'stuck' : 'recovers'}` : nextRoleView(view, view === 'result' ? 'BACK' : 'CANCEL');
      expected[view] = working ? 'null|recovers' : 'overview';
    }
    expect(outcome).toEqual(expected);
  });

  it('the only ways into a working (writing) view pass through a PIN or a confirmation', () => {
    const into: Array<[RoleView, RoleEvent]> = [];
    for (const view of views) {
      for (const [event, to] of Object.entries(roleTransitions[view]) as Array<[RoleEvent, RoleView]>) if (WORKING_VIEWS.includes(to)) into.push([view, event]);
    }
    expect(into.filter(([, event]) => !['PIN_OK', 'CONFIRM', 'WORD_OK', 'NEW_PIN'].includes(event))).toEqual([]);
    expect(into.length).toBeGreaterThan(0);
  });

  it('"This is the shop phone" is off with no PIN and on a shop phone', () => {
    expect(shopTapAllowed({ pinExists: false, role: 'study' })).toEqual({ allowed: false, reason: 'Create the owner PIN first.' });
    expect(shopTapAllowed({ pinExists: true, role: 'shop' }).allowed).toBe(false);
    expect(shopTapAllowed({ pinExists: true, role: 'study' })).toEqual({ allowed: true, reason: null });
  });

  it('the typed words: exact word, any case, spaces around; nothing else', () => {
    expect(['zero', 'ZERO', ' Zero ', 'zero\n'].filter((ok) => !typedWordMatches(ok, START_FRESH_WORD))).toEqual([]);
    expect(['', 'zer0', 'zero zero', 'z ero', 'yes', 'replace'].filter((bad) => typedWordMatches(bad, START_FRESH_WORD))).toEqual([]);
    expect(typedWordMatches('Replace', RESTORE_WORD)).toBe(true);
  });
});

describe('setup flow table (D12)', () => {
  const views = Object.keys(setupTransitions) as SetupView[];
  it('every event not in a row is refused, for every view', () => {
    for (const view of views) {
      const row: Partial<Record<SetupEvent, string>> = setupTransitions[view];
      expect(SETUP_EVENTS.map((event) => nextSetupView(view, event))).toEqual(SETUP_EVENTS.map((event) => row[event] ?? null));
    }
  });
  it('the PIN save leads straight to the first backup; the backup step always has a way out', () => {
    expect(nextSetupView('pinSaving', 'SAVED')).toBe('backup');
    expect(nextSetupView('pinSaving', 'CANCEL')).toBeNull();
    expect(nextSetupView('backup', 'NOT_NOW')).toBe('exit');
    expect(nextSetupView('backup', 'CANCEL')).toBe('exit');
  });
  it('a doubled PIN_CONFIRMED is refused the second time', () => {
    const first = nextSetupView('pinNew', 'PIN_CONFIRMED');
    expect(first).toBe('pinSaving');
    expect(nextSetupView('pinSaving', 'PIN_CONFIRMED')).toBeNull();
  });
});

describe('restore flow table (D3)', () => {
  const views = Object.keys(restoreTransitions) as RestoreView[];
  it('every event not in a row is refused, for every view', () => {
    for (const view of views) {
      const row: Partial<Record<RestoreEvent, RestoreView>> = restoreTransitions[view];
      expect(RESTORE_EVENTS.map((event) => nextRestoreView(view, event))).toEqual(RESTORE_EVENTS.map((event) => row[event] ?? null));
    }
  });
  it('a study backup is blocked on a shop phone before anything is typed', () => {
    expect(restoreBlocker({ phoneRole: 'shop', fileRole: 'study' })).not.toBeNull();
    expect(restoreBlocker({ phoneRole: 'study', fileRole: 'shop' })).toBeNull();
  });
});

describe('banner rules (D10): nothing of the app\'s own in Customer View or while loading', () => {
  const states = ['current', 'updateAvailable', 'updating', 'updated'] as const;
  const steps = ['chooseRole', 'setPin', 'firstBackup', 'done'] as const;
  const bools = [true, false];

  function* inputs(): Generator<BannerInput> {
    for (const versionState of states)
      for (const setupStep of steps)
        for (const online of bools)
          for (const backupDue of bools)
            for (const installCard of bools)
              for (const storage of [null, 'blocked'])
                for (const path of ['/', '/settings', '/fixit'])
                  yield { ready: true, customerViewOn: false, storageProblem: storage, online, offlineReady: false, offlineCopyExpected: true, versionState, updateAllowedHere: true, updateLater: false, setupStep, setupClosed: false, backupDue, backupLater: false, installCard, path };
  }

  it('returns no banner at all for every combination once Customer View is on, or before the flag is read', () => {
    let checked = 0;
    for (const input of inputs()) {
      expect(pickBanners({ ...input, customerViewOn: true })).toEqual([]);
      expect(pickBanners({ ...input, ready: false })).toEqual([]);
      checked += 1;
    }
    expect(checked).toBe(4 * 4 * 2 * 2 * 2 * 2 * 3);
  });

  it('the setup, backup, and install notices stay off the working screens', () => {
    for (const input of inputs()) {
      if (input.path !== '/fixit') continue;
      const keys = pickBanners(input);
      expect(keys).not.toContain('setup');
      expect(keys).not.toContain('backupDue');
      expect(keys).not.toContain('install');
    }
  });
});

describe('developer tools rule', () => {
  it('on in dev builds or with the owner toggle; never in Customer View or before the flag is read', () => {
    for (const dev of [true, false])
      for (const toggle of [true, false]) {
        expect(developerToolsAllowed({ dev, toggle, customerViewReady: true, customerViewOn: true })).toBe(false);
        expect(developerToolsAllowed({ dev, toggle, customerViewReady: false, customerViewOn: false })).toBe(false);
        expect(developerToolsAllowed({ dev, toggle, customerViewReady: true, customerViewOn: false })).toBe(dev || toggle);
      }
  });
});

describe('GitHub Pages deep link guard', () => {
  const at = (search: string, base = '/aurigen-directory/') => deepLinkTarget({ pathname: base, search, hash: '', origin: 'https://landocommandoz.github.io' }, base);
  it('restores a path under the base and refuses everything else', () => {
    expect(at('?p=%2Fcards%2Fcard-bucket-mix')).toBe('/aurigen-directory/cards/card-bucket-mix');
    expect(at('?p=%2Fsearch&q=q%3Dclay')).toBe('/aurigen-directory/search?q=clay');
    const evil = ['//evil.example', '/\\evil', 'https://evil.example', 'javascript:alert(1)', '/\n', '/../../x'];
    expect(evil.filter((e) => at(`?p=${encodeURIComponent(e)}`) !== 'refused')).toEqual([]);
    expect(at('')).toBeNull();
    expect(deepLinkTarget({ pathname: '/aurigen-directory/cards', search: '?p=%2Fx', hash: '', origin: 'https://x' }, '/aurigen-directory/')).toBeNull();
  });
});

describe('shell defects reproduced at unit level', () => {
  beforeEach(async () => {
    __resetSettingsStoreForTests();
    __resetPinStateForTests();
    await __resetDbForTests();
  });
  afterEach(() => {
    cleanup();
    __resetSettingsStoreForTests();
  });

  function renderAt(path: string) {
    return render(
      <CustomerViewProvider>
        <ToastProvider>
          <MemoryRouter initialEntries={[path]}>
            <AppRoutes />
          </MemoryRouter>
        </ToastProvider>
      </CustomerViewProvider>,
    );
  }

  // DEF-02 (fixed in pass 2): react-router's "*" does not match a newline; routes.tsx now renders
  // the table for NO_SCREEN_PATH when nothing matches, so Not found shows inside the shell.
  it('an address with an encoded line break renders the Not found screen inside the shell', async () => {
    renderAt('/%0a');
    await waitFor(() => expect(screen.getByRole('heading', { level: 1, name: 'No screen here' })).toBeTruthy(), { timeout: 1500 });
  });

  // DEF-01 (fixed in pass 2): the synchronous hint holds the top bar while the saved flag is read.
  it('with Customer View saved on, the first frame after a reload draws no internal top bar', async () => {
    await startFresh({ warningAccepted: true, newPin: '482915' });
    await turnCustomerViewOn();
    __resetSettingsStoreForTests();
    const { container } = renderAt('/');
    expect(container.querySelector('header.app-top')).toBeNull();
  });
});
