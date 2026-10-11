// @vitest-environment node
// No fake-indexeddb here: this file runs with no IndexedDB at all, like a phone with storage blocked.
import { describe, expect, it } from 'vitest';
import { dbStatus, getSettings, openDb, readSettingsOrDefault, updateSettings } from './db';
import { chooseStudy, getRole, startFresh } from './deviceRole';
import { turnCustomerViewOn } from './customerView';
import { StorageUnavailable } from './errors';
import { hasPin, setPin, verifyPin } from './pin';

describe('storage unavailable (private mode, storage denied)', () => {
  it('raises one typed StorageUnavailable with a plain message, never an unhandled rejection', async () => {
    const error = await getSettings().catch((e: unknown) => e);
    expect(error).toBeInstanceOf(StorageUnavailable);
    expect((error as StorageUnavailable).problem).toBe('unavailable');
    expect((error as StorageUnavailable).message).toMatch(/not letting the app save/);
    await expect(updateSettings({ handedness: 'right' })).rejects.toBeInstanceOf(StorageUnavailable);
    expect(dbStatus.get().state).toBe('unavailable');
  });

  it('boot still gets usable defaults and a status to show', async () => {
    const r = await readSettingsOrDefault();
    expect(r.saved).toBe(false);
    expect(r.settings.deviceRole).toBe('study');
    expect(r.settings.handedness).toBe('left');
    const opened = await openDb();
    expect(opened.ok).toBe(false);
  });

  it('the phone works as a study phone with no PIN', async () => {
    expect(await getRole()).toBe('study');
    expect(await hasPin()).toBe(false);
  });

  it('every action returns a plain storage refusal instead of throwing', async () => {
    const storage = { ok: false, code: 'storage' };
    expect(await verifyPin('482915')).toMatchObject(storage);
    expect(await setPin('482915')).toMatchObject(storage);
    expect(await chooseStudy()).toMatchObject(storage);
    expect(await startFresh({ warningAccepted: true, newPin: '482915' })).toMatchObject(storage);
    expect(await turnCustomerViewOn()).toMatchObject(storage);
  });
});
