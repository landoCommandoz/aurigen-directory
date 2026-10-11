import 'fake-indexeddb/auto';
import '@testing-library/jest-dom/vitest';
import { act, cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { BIKE_DETAIL, INTERIOR_SEDAN, POLISH_SEDAN, WASH_WAX_SEDAN, makeJob, priceItems } from '../../core/__tests__/fixtures';
import { exportBackup } from '../../core/backup';
import { __setContentBundleForTests } from '../../core/content';
import { emptyBundle } from '../../core/contentBundle';
import { getSettings, withDb } from '../../core/db';
import { startFresh } from '../../core/deviceRole';
import { clearOwnerPass } from '../../core/pin';
import { afterAllReset, installShare, removeShare, renderScreen, resetAll, tapPin } from './__tests__/harness';
import { BackupScreen } from './BackupScreen';
import { DeviceRoleScreen } from './DeviceRoleScreen';
import { nextRestoreView, restoreBlocker, restoreTransitions, type RestoreEvent, type RestoreView } from './restoreFlow';
import { RESTORE_WORD } from './roleFlow';

const ROUTES = { '/settings/backup': <BackupScreen />, '/settings/device': <DeviceRoleScreen />, '/settings': <p>Settings home</p> };

/** A shop phone with six jobs: 2 count toward 25, 2 hold founder's slots. Returns its backup text. */
async function shopBackupText(): Promise<string> {
  await startFresh({ warningAccepted: true, newPin: '482915' });
  await withDb((db) =>
    db.jobs.bulkAdd([
      makeJob('delivered', { packageId: POLISH_SEDAN }),
      makeJob('debriefed', { packageId: WASH_WAX_SEDAN }),
      makeJob('delivered', { packageId: INTERIOR_SEDAN }),
      makeJob('delivered', { packageId: BIKE_DETAIL, vehicleType: 'bike' }),
      makeJob('booked', { packageId: POLISH_SEDAN }),
      makeJob('canceled', { packageId: POLISH_SEDAN }),
    ]),
  );
  const prepared = await exportBackup({ photos: 'omitted' });
  return prepared.json;
}

async function studyBackupText(): Promise<string> {
  return (await exportBackup({ photos: 'omitted' })).json;
}

function pickFile(container: HTMLElement, text: string, name = 'masterclass-backup-2026-10-10.json') {
  const input = container.querySelector<HTMLInputElement>('input[type="file"]');
  if (input === null) throw new Error('no file input');
  fireEvent.change(input, { target: { files: [new File([text], name, { type: 'application/json' })] } });
}

beforeEach(async () => {
  await resetAll();
  __setContentBundleForTests({ ...emptyBundle(), items: priceItems() });
});

afterEach(() => {
  cleanup();
  removeShare();
  afterAllReset();
});

describe('restore table', () => {
  it('moves only along its rows', () => {
    const events: RestoreEvent[] = ['START', 'FILE_OK', 'APPLY', 'APPLY_NEEDS_PIN', 'PIN_OK', 'DONE', 'FAILED', 'CANCEL', 'CLOSE'];
    for (const view of Object.keys(restoreTransitions) as RestoreView[]) {
      const row: Partial<Record<RestoreEvent, string>> = restoreTransitions[view];
      for (const event of events) expect(nextRestoreView(view, event)).toBe(row[event] ?? null);
    }
  });

  it('refuses a study backup on the shop phone before anything is typed', () => {
    expect(restoreBlocker({ phoneRole: 'shop', fileRole: 'study' })).toMatch(/study backup would replace its jobs/);
    expect(restoreBlocker({ phoneRole: 'study', fileRole: 'shop' })).toBeNull();
  });
});

describe('BackupScreen', () => {
  it('makes a backup through the share sheet and records the date', async () => {
    const share = installShare('ok');
    renderScreen('/settings/backup', ROUTES);
    const button = await screen.findByRole('button', { name: 'Save backup' });
    expect(screen.getByText(/never uses one there/)).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(button);
    });
    expect(share.calls).toHaveLength(1);
    expect(await screen.findByText(/Path: share sheet/)).toBeInTheDocument();
    await waitFor(async () => expect((await getSettings()).lastBackupAt).not.toBeNull());
  });

  it('shows what the file holds before Apply, and Cancel changes nothing', async () => {
    const text = await shopBackupText();
    await resetAll();
    __setContentBundleForTests({ ...emptyBundle(), items: priceItems() });
    const before = await getSettings();

    const { container } = renderScreen('/settings/backup', ROUTES);
    fireEvent.click(await screen.findByRole('button', { name: 'Restore from a file' }));
    pickFile(container, text);

    expect(await screen.findByText('Cars toward 25')).toBeInTheDocument();
    const row = (label: string) => screen.getByText(label).closest('div')?.querySelector('dd')?.textContent;
    expect(row('Jobs')).toBe('6');
    expect(row('Cars toward 25')).toBe('2');
    expect(row("Founder's slots used")).toBe('2');
    expect(row('Device role in the file')).toBe('Shop phone');
    expect(screen.getByText(/Restoring it makes this phone the shop phone/)).toBeInTheDocument();

    const apply = screen.getByRole('button', { name: 'Apply' });
    expect(apply).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(await screen.findByRole('button', { name: 'Restore from a file' })).toBeInTheDocument();
    const after = await getSettings();
    expect(after).toEqual(before);
    expect(await withDb((db) => db.jobs.count())).toBe(0);
  });

  it('Apply after the typed word replaces this phone with the backup', async () => {
    const text = await shopBackupText();
    await resetAll();
    __setContentBundleForTests({ ...emptyBundle(), items: priceItems() });

    const { container } = renderScreen('/settings/backup', ROUTES);
    fireEvent.click(await screen.findByRole('button', { name: 'Restore from a file' }));
    pickFile(container, text);
    fireEvent.change(await screen.findByLabelText(`Type ${RESTORE_WORD} to confirm`), { target: { value: RESTORE_WORD } });
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));

    expect(await screen.findByText(/Restored. This phone now has 6 jobs, 2 cars toward 25, and 2 founder's slots used. Device role: Shop phone./)).toBeInTheDocument();
    expect((await getSettings()).deviceRole).toBe('shop');
    expect(await withDb((db) => db.jobs.count())).toBe(6);
  });

  it('on a phone with a PIN, Apply asks for the owner PIN first', async () => {
    const text = await studyBackupText();
    await startFresh({ warningAccepted: true, newPin: '482915' });
    await withDb(async (db) => {
      const s = await db.settings.get('device');
      if (s) await db.settings.put({ ...s, deviceRole: 'study' });
    });
    clearOwnerPass();

    const { container } = renderScreen('/settings/backup', ROUTES);
    fireEvent.click(await screen.findByRole('button', { name: 'Restore from a file' }));
    pickFile(container, text);
    fireEvent.change(await screen.findByLabelText(`Type ${RESTORE_WORD} to confirm`), { target: { value: RESTORE_WORD } });
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));
    expect(await screen.findByRole('group', { name: /Enter it to replace its data/ })).toBeInTheDocument();
    tapPin('482915');
    expect(await screen.findByText(/Restored. This phone now has 0 jobs/)).toBeInTheDocument();
  });

  it('a study backup on the shop phone is refused with no Apply button', async () => {
    const text = await studyBackupText();
    await startFresh({ warningAccepted: true, newPin: '482915' });
    const { container } = renderScreen('/settings/backup', ROUTES);
    fireEvent.click(await screen.findByRole('button', { name: 'Restore from a file' }));
    pickFile(container, text);
    expect(await screen.findByText(/A study backup would replace its jobs/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Apply' })).toBeNull();
  });

  it('a damaged file is refused in plain words and nothing changes', async () => {
    const text = await shopBackupText();
    await resetAll();
    const { container } = renderScreen('/settings/backup', ROUTES);
    fireEvent.click(await screen.findByRole('button', { name: 'Restore from a file' }));
    pickFile(container, text.replace('"carsLoggedBefore":0', '"carsLoggedBefore":9'));
    expect(await screen.findByText(/This backup is damaged/)).toBeInTheDocument();
    expect(screen.getByText(/Nothing on this phone changed/)).toBeInTheDocument();
    expect((await getSettings()).deviceRole).toBe('study');
  });
});

describe('device role import path', () => {
  it('a second phone becomes the shop phone only by importing the newest shop backup', async () => {
    const text = await shopBackupText();
    await resetAll();
    __setContentBundleForTests({ ...emptyBundle(), items: priceItems() });

    const { container } = renderScreen('/settings/device', ROUTES);
    fireEvent.click(await screen.findByRole('button', { name: 'Import the newest backup' }));
    pickFile(container, text);
    expect(await screen.findByRole('heading', { name: 'Is this the newest backup from the shop phone?' })).toBeInTheDocument();
    expect((await getSettings()).deviceRole).toBe('study');
    fireEvent.click(screen.getByRole('button', { name: 'Yes, this is the newest backup' }));
    expect(await screen.findByText(/This is now the shop phone, with 6 jobs and 2 cars toward 25/)).toBeInTheDocument();
    const s = await getSettings();
    expect(s.deviceRole).toBe('shop');
    expect(s.ownerPin).not.toBeNull();
    const audit = await withDb((db) => db.auditLog.toArray());
    expect(audit.map((a) => a.type)).toEqual(expect.arrayContaining(['import', 'roleChange']));
  });

  it('a study backup cannot make this the shop phone', async () => {
    const text = await studyBackupText();
    const { container } = renderScreen('/settings/device', ROUTES);
    fireEvent.click(await screen.findByRole('button', { name: 'Import the newest backup' }));
    pickFile(container, text);
    expect(await screen.findByText(/This backup is from a study phone/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Yes, this is the newest backup' })).toBeDisabled();
  });
});
