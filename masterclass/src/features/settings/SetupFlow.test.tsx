import 'fake-indexeddb/auto';
import '@testing-library/jest-dom/vitest';
import { act, cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { getSettings, withDb } from '../../core/db';
import { clearOwnerPass, hasPin, setPin } from '../../core/pin';
import { afterAllReset, currentPath, installShare, removeShare, renderScreen, resetAll, tapPin } from './__tests__/harness';
import { nextSetupView, setupTransitions, type SetupEvent, type SetupView } from './setupFlow';
import { SetupFlow } from './SetupFlow';

const ROUTES = { '/settings/setup': <SetupFlow />, '/settings': <p>Settings home</p>, '/settings/device': <p>Device role</p> };

beforeEach(async () => {
  await resetAll();
});

afterEach(() => {
  cleanup();
  removeShare();
  afterAllReset();
});

async function openSetup() {
  renderScreen('/settings/setup', ROUTES);
  await screen.findByRole('heading', { name: 'Setup' });
}

describe('setup flow table', () => {
  const EVENTS: SetupEvent[] = ['CREATE_PIN', 'CHANGE_PIN', 'CURRENT_OK', 'PIN_CONFIRMED', 'SAVED', 'SAVE_FAILED', 'BACKUP_NOW', 'BACKUP_DONE', 'NOT_NOW', 'CANCEL', 'BACK'];

  it('moves only along the rows of the table and refuses every other event', () => {
    for (const view of Object.keys(setupTransitions) as SetupView[]) {
      const row: Partial<Record<SetupEvent, string>> = setupTransitions[view];
      for (const event of EVENTS) {
        expect(nextSetupView(view, event)).toBe(row[event] ?? null);
      }
    }
  });

  it('never reaches the backup step from the PIN screen without the save', () => {
    expect(nextSetupView('pinNew', 'BACKUP_DONE')).toBeNull();
    expect(nextSetupView('pinNew', 'PIN_CONFIRMED')).toBe('pinSaving');
    expect(nextSetupView('pinSaving', 'SAVED')).toBe('backup');
    expect(nextSetupView('pinSaving', 'CANCEL')).toBeNull();
  });
});

describe('SetupFlow screen', () => {
  it('cannot finish without a PIN: the first backup waits for the PIN', async () => {
    await openSetup();
    expect(screen.getByText('No owner PIN yet')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save your first backup' })).toBeDisabled();
    expect(screen.getByText(/Set the owner PIN first/)).toBeInTheDocument();
    expect((await getSettings()).lastBackupAt).toBeNull();
  });

  it('creates the PIN, then goes straight to the first backup, and the tap opens the share sheet', async () => {
    const share = installShare('ok');
    await openSetup();
    fireEvent.click(screen.getByRole('button', { name: 'Create the owner PIN' }));
    tapPin('482915');
    expect(screen.getByRole('group', { name: 'Enter the same PIN again' })).toBeInTheDocument();
    tapPin('482915');

    // Right after the PIN: the first backup screen, with the reminder on in the same write.
    expect(await screen.findByRole('heading', { name: 'Save your first backup' })).toBeInTheDocument();
    expect(screen.getByText('Owner PIN saved. The weekly backup reminder is on.')).toBeInTheDocument();
    const saved = await getSettings();
    expect(saved.ownerPin).not.toBeNull();
    expect(saved.backupReminderWeekly).toBe(true);
    expect(saved.lastBackupAt).toBeNull();

    // The backup is prepared as the screen opens; the button reads "Preparing" until then.
    const button = await screen.findByRole('button', { name: 'Save your first backup' });
    expect(button).not.toHaveAttribute('aria-busy');
    await act(async () => {
      fireEvent.click(button);
    });
    expect(share.calls).toHaveLength(1);
    const file = share.calls[0]?.files?.[0];
    expect(file?.name).toMatch(/^masterclass-backup-\d{4}-\d{2}-\d{2}\.json$/);
    await waitFor(async () => expect((await getSettings()).lastBackupAt).not.toBeNull());
    // Which path ran and what to do with the file, then Done.
    expect(await screen.findByText(/Path: share sheet. .*Save to Files \(iCloud Drive\), or Mail it to yourself/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Not now' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Done' }));
    // Back on the overview: the backup step shows the date. (The role is still open in this test.)
    expect(await screen.findByText('Backup saved. The weekly reminder counts from now.')).toBeInTheDocument();
    expect(screen.getByText('Last backup')).toBeInTheDocument();
  });

  it('a closed share sheet saves nothing and offers Try again and Copy backup text', async () => {
    installShare('AbortError');
    await openSetup();
    fireEvent.click(screen.getByRole('button', { name: 'Create the owner PIN' }));
    tapPin('482915');
    tapPin('482915');
    const button = await screen.findByRole('button', { name: 'Save your first backup' });
    await act(async () => {
      fireEvent.click(button);
    });
    expect(await screen.findByText(/The share sheet was closed, so no backup was saved/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Copy backup text' })).toBeInTheDocument();
    expect((await getSettings()).lastBackupAt).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Not now' }));
    expect(currentPath()).toBe('/settings');
  });

  it('two different PINs save nothing and start again', async () => {
    await openSetup();
    fireEvent.click(screen.getByRole('button', { name: 'Create the owner PIN' }));
    tapPin('482915');
    tapPin('111111');
    expect(await screen.findByText('The two PINs did not match. Enter a new PIN again.')).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Create a 6 digit owner PIN' })).toBeInTheDocument();
    expect(await hasPin()).toBe(false);
  });

  it('Cancel on the PIN screen returns to Settings with nothing changed', async () => {
    await openSetup();
    const before = await getSettings();
    const auditBefore = await withDb((db) => db.auditLog.count());
    fireEvent.click(screen.getByRole('button', { name: 'Create the owner PIN' }));
    tapPin('48');
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(currentPath()).toBe('/settings');
    const after = await getSettings();
    expect(after.ownerPin).toBeNull();
    expect(after.updatedAt).toBe(before.updatedAt);
    expect(await withDb((db) => db.auditLog.count())).toBe(auditBefore);
  });

  it('with a PIN present it offers Change PIN, which needs the current PIN', async () => {
    await setPin('482915');
    clearOwnerPass();
    await openSetup();
    expect(await screen.findByRole('button', { name: 'Change PIN' })).toBeInTheDocument();
    // A PIN and no backup yet: the first backup is the next step and is open.
    expect(screen.getByRole('button', { name: 'Save your first backup' })).not.toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Change PIN' }));
    expect(screen.getByRole('group', { name: 'Enter the current owner PIN' })).toBeInTheDocument();
    tapPin('000000');
    expect(await screen.findByText(/Wrong PIN/)).toBeInTheDocument();
    tapPin('482915');
    expect(await screen.findByRole('group', { name: 'Create a 6 digit owner PIN' })).toBeInTheDocument();
  });

  it('"This is a study phone" records the choice', async () => {
    await openSetup();
    fireEvent.click(screen.getByRole('button', { name: 'This is a study phone' }));
    expect(await screen.findByText('Saved: this is a study phone. Next, set the owner PIN.')).toBeInTheDocument();
    const s = await getSettings();
    expect(s.deviceRole).toBe('study');
    expect(s.roleChosenAt).not.toBeNull();
  });
});
