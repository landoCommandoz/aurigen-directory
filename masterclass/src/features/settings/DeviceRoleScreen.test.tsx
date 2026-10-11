import 'fake-indexeddb/auto';
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { getSettings, withDb } from '../../core/db';
import { startFresh } from '../../core/deviceRole';
import { clearOwnerPass, setPin } from '../../core/pin';
import { afterAllReset, renderScreen, resetAll, tapPin } from './__tests__/harness';
import { DeviceRoleScreen } from './DeviceRoleScreen';
import { nextRoleView, roleTransitions, shopTapAllowed, START_FRESH_WORD, typedWordMatches, type RoleEvent, type RoleView } from './roleFlow';

const ROUTES = { '/settings/device': <DeviceRoleScreen />, '/settings': <p>Settings home</p>, '/settings/setup': <p>Setup</p> };

beforeEach(async () => {
  await resetAll();
});

afterEach(() => {
  cleanup();
  afterAllReset();
});

async function openRole() {
  renderScreen('/settings/device', ROUTES);
  await screen.findByRole('heading', { name: 'Device role' });
}

async function snapshot() {
  const settings = await getSettings();
  const audit = await withDb((db) => db.auditLog.toArray());
  return { settings, audit };
}

describe('device role table', () => {
  const EVENTS: RoleEvent[] = [
    'SHOP_TAP', 'PIN_OK', 'CHOOSE_IMPORT', 'CHOOSE_FRESH', 'FILE_OK', 'CONFIRM', 'CONFIRM_NEEDS_PIN',
    'WORD_OK', 'WORD_OK_NEW_PIN', 'WORD_OK_NEEDS_PIN', 'NEW_PIN', 'STUDY_TAP', 'DONE', 'FAILED', 'CANCEL', 'BACK',
  ];

  it('moves only along the rows of the table and refuses every other event', () => {
    for (const view of Object.keys(roleTransitions) as RoleView[]) {
      const row: Partial<Record<RoleEvent, string>> = roleTransitions[view];
      for (const event of EVENTS) expect(nextRoleView(view, event)).toBe(row[event] ?? null);
    }
  });

  it('offers Cancel back to the overview from every step that has not started writing', () => {
    for (const view of ['shopPin', 'shopChoice', 'importPick', 'importConfirm', 'importPin', 'freshWarning', 'freshPinNew', 'freshPinVerify', 'studyPin'] as RoleView[]) {
      expect(nextRoleView(view, 'CANCEL')).toBe('overview');
    }
    for (const view of ['importing', 'freshing', 'studying'] as RoleView[]) expect(nextRoleView(view, 'CANCEL')).toBeNull();
  });

  it('allows the shop tap only with a PIN, on a study phone', () => {
    expect(shopTapAllowed({ pinExists: false, role: 'study' })).toEqual({ allowed: false, reason: 'Create the owner PIN first.' });
    expect(shopTapAllowed({ pinExists: true, role: 'study' }).allowed).toBe(true);
    expect(shopTapAllowed({ pinExists: true, role: 'shop' }).allowed).toBe(false);
  });

  it('matches the typed word ignoring case and spaces, and nothing else', () => {
    expect(typedWordMatches(' Zero ', START_FRESH_WORD)).toBe(true);
    expect(typedWordMatches('zer', START_FRESH_WORD)).toBe(false);
    expect(typedWordMatches('', START_FRESH_WORD)).toBe(false);
    expect(typedWordMatches('zero zero', START_FRESH_WORD)).toBe(false);
  });
});

describe('DeviceRoleScreen', () => {
  it('shows the study default in plain words and keeps "This is the shop phone" off until a PIN exists', async () => {
    await openRole();
    expect(screen.getByText('This is a study phone.')).toBeInTheDocument();
    expect(screen.getByText(/Every phone starts as a study phone/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'This is the shop phone' })).toBeDisabled();
    expect(screen.getByText('Create the owner PIN first.')).toBeInTheDocument();
  });

  it('with a PIN: asks for it, then a choice screen whose Cancel changes nothing', async () => {
    await setPin('482915');
    clearOwnerPass();
    const before = await snapshot();
    await openRole();
    const tap = await screen.findByRole('button', { name: 'This is the shop phone' });
    await waitFor(() => expect(tap).not.toBeDisabled());
    fireEvent.click(tap);
    expect(screen.getByRole('group', { name: 'Enter owner PIN' })).toBeInTheDocument();
    tapPin('482915');
    expect(await screen.findByRole('heading', { name: 'How does this phone become the shop phone?' })).toBeInTheDocument();
    expect(screen.getByText('Nothing has changed yet.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(await screen.findByRole('heading', { name: 'Device role' })).toBeInTheDocument();
    const after = await snapshot();
    expect(after.settings).toEqual(before.settings);
    expect(after.audit).toHaveLength(before.audit.length);
    expect(after.settings.deviceRole).toBe('study');
  });

  it('Cancel on the PIN step changes nothing either', async () => {
    await setPin('482915');
    clearOwnerPass();
    const before = await snapshot();
    await openRole();
    const tap = await screen.findByRole('button', { name: 'This is the shop phone' });
    await waitFor(() => expect(tap).not.toBeDisabled());
    fireEvent.click(tap);
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(await screen.findByRole('heading', { name: 'Device role' })).toBeInTheDocument();
    expect((await snapshot()).settings).toEqual(before.settings);
  });

  it('Start fresh needs the typed word, then a new PIN, then becomes the shop phone in one write', async () => {
    await openRole();
    fireEvent.click(screen.getByRole('button', { name: 'Start fresh' }));
    expect(await screen.findByRole('heading', { name: 'Start fresh' })).toBeInTheDocument();
    expect(screen.getByText(/Cars logged toward 25: back to 0/)).toBeInTheDocument();
    expect(screen.getByText(/Founder's slots used: back to 0/)).toBeInTheDocument();

    const go = screen.getByRole('button', { name: 'Start fresh' });
    expect(go).toBeDisabled();
    const field = screen.getByLabelText(`Type ${START_FRESH_WORD} to confirm`);
    fireEvent.change(field, { target: { value: 'fresh' } });
    expect(go).toBeDisabled();
    fireEvent.click(go);
    expect((await getSettings()).deviceRole).toBe('study');

    fireEvent.change(field, { target: { value: 'ZERO' } });
    expect(go).not.toBeDisabled();
    fireEvent.click(go);
    expect(await screen.findByRole('group', { name: 'Create a 6 digit owner PIN' })).toBeInTheDocument();
    expect((await getSettings()).deviceRole).toBe('study');
    tapPin('482915');
    tapPin('482915');

    expect(await screen.findByText(/This is now the shop phone/)).toBeInTheDocument();
    const { settings, audit } = await snapshot();
    expect(settings.deviceRole).toBe('shop');
    expect(settings.ownerPin).not.toBeNull();
    expect(settings.carsLoggedBefore).toBe(0);
    expect(audit.map((a) => a.type)).toEqual(expect.arrayContaining(['pinSet', 'startFresh', 'roleChange']));
    // The PIN was just created, so the first backup is offered right here.
    expect(screen.getByRole('heading', { name: 'Save your first backup' })).toBeInTheDocument();
  });

  it('Cancel on the Start fresh warning changes nothing', async () => {
    const before = await snapshot();
    await openRole();
    fireEvent.click(screen.getByRole('button', { name: 'Start fresh' }));
    fireEvent.change(await screen.findByLabelText(`Type ${START_FRESH_WORD} to confirm`), { target: { value: 'zero' } });
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(await screen.findByRole('heading', { name: 'Device role' })).toBeInTheDocument();
    expect((await snapshot()).settings).toEqual(before.settings);
  });

  it('a shop phone switches to study only with the owner PIN, and it is logged', async () => {
    await startFresh({ warningAccepted: true, newPin: '482915' });
    clearOwnerPass();
    await openRole();
    expect(await screen.findByText('This is the shop phone.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Make this a study phone' }));
    tapPin('482915');
    expect(await screen.findByText(/This is now a study phone/)).toBeInTheDocument();
    const { settings, audit } = await snapshot();
    expect(settings.deviceRole).toBe('study');
    expect(audit.filter((a) => a.type === 'roleChange').map((a) => a.detail)).toContain('Shop phone to study phone (owner PIN)');
  });
});
