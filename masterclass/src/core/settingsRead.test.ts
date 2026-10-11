// @vitest-environment node
/**
 * DEF-08: the settings row is read leniently and written strictly. Pure rules from settingsRead.ts.
 */
import { describe, expect, it } from 'vitest';
import { defaultSettings } from '../schemas';
import { RecordInvalid, SETTINGS_UNREADABLE_MESSAGE } from './errors';
import { GUARD_FIELDS, SETTINGS_FIELDS, parseStoredSettings, salvageStoredSettings } from './settingsRead';

const T0 = '2026-10-10T12:00:00.000Z';
const NOW = '2026-10-11T08:00:00.000Z';
const PIN = { algorithm: 'PBKDF2-SHA-256', iterations: 100000, salt: 'c2FsdA==', hash: 'aGFzaA==', setAt: T0 } as const;
const shopRow = () => ({ ...defaultSettings(T0), deviceRole: 'shop', ownerPin: PIN, roleChosenAt: T0, customerViewOn: true, focusReminderShown: true });

function refusal(run: () => unknown): RecordInvalid {
  try {
    run();
  } catch (error) {
    if (error instanceof RecordInvalid) return error;
    throw error;
  }
  throw new Error('expected a RecordInvalid');
}

describe('parseStoredSettings (every ordinary read)', () => {
  it('drops a field a newer version added, reports it, and keeps every known value', () => {
    const read = parseStoredSettings({ ...shopRow(), fieldFromANewerVersion: true, anotherOne: { nested: 1 } });
    expect(read.ignored).toEqual(['fieldFromANewerVersion', 'anotherOne']);
    expect(read.settings).toEqual(shopRow());
    expect(Object.keys(read.settings)).not.toContain('fieldFromANewerVersion');
  });

  it('a "__proto__" key in the stored row is ignored, never applied', () => {
    const raw = JSON.parse(`{"__proto__": {"deviceRole": "shop"}, ${JSON.stringify(defaultSettings(T0)).slice(1)}`) as Record<string, unknown>;
    const read = parseStoredSettings(raw);
    expect(read.ignored).toEqual(['__proto__']);
    expect(read.settings.deviceRole).toBe('study');
    expect(Object.getPrototypeOf(read.settings)).toBe(Object.prototype);
  });

  it('still checks every known field strictly: a wrong type is refused in plain words, the detail kept for the panel', () => {
    const error = refusal(() => parseStoredSettings({ ...shopRow(), handedness: 'both' }));
    expect(error.reading).toBe(true);
    expect(error.message).toBe(SETTINGS_UNREADABLE_MESSAGE);
    expect(error.message).not.toMatch(/Unrecognized|Invalid|private|space/i);
    expect(error.issues.join(' ')).toContain('handedness');
  });

  it('keeps both cross-field rules', () => {
    expect(refusal(() => parseStoredSettings({ ...shopRow(), ownerPin: null })).issues.join(' ')).toContain('ownerPin');
    expect(refusal(() => parseStoredSettings({ ...shopRow(), customerViewOn: false })).issues.join(' ')).toContain('focusReminderShown');
  });

  it.each([null, undefined, 'device', 7, [], true])('refuses a stored value that is not a row: %j', (value) => {
    expect(refusal(() => parseStoredSettings(value)).reading).toBe(true);
  });

  it('a nested object is not loosened: an owner PIN with an unknown key is refused', () => {
    expect(refusal(() => parseStoredSettings({ ...shopRow(), ownerPin: { ...PIN, pepper: 'x' } })).issues.join(' ')).toContain('ownerPin');
  });
});

describe('salvageStoredSettings (backup, the guard read in Restore, the PIN check)', () => {
  it('passes a good row through untouched', () => {
    expect(salvageStoredSettings(shopRow(), NOW)).toEqual({ settings: shopRow(), ignored: [], repaired: [] });
  });

  it('resets damaged ordinary fields to their defaults and names them; the role, the PIN, and Customer View stay', () => {
    const out = salvageStoredSettings({ ...shopRow(), handedness: 'both', photoCapPerJob: -3, futureField: 1 }, NOW);
    expect(out.repaired).toEqual(['handedness', 'photoCapPerJob']);
    expect(out.ignored).toEqual(['futureField']);
    expect(out.settings).toMatchObject({ deviceRole: 'shop', ownerPin: PIN, customerViewOn: true, handedness: 'left', photoCapPerJob: 24 });
  });

  it('repairs the id and the stamps with fixed values', () => {
    const out = salvageStoredSettings({ ...shopRow(), id: 'other', createdAt: 'yesterday', updatedAt: 5 }, NOW);
    expect(out.repaired).toEqual(['id', 'createdAt', 'updatedAt']);
    expect(out.settings).toMatchObject({ id: 'device', createdAt: NOW, updatedAt: NOW });
  });

  it('clears the Focus mark when the Customer View flag itself was damaged (the schema rule)', () => {
    const out = salvageStoredSettings({ ...shopRow(), customerViewOn: 'yes' }, NOW);
    expect(out.repaired).toEqual(['customerViewOn', 'focusReminderShown']);
    expect(out.settings).toMatchObject({ customerViewOn: false, focusReminderShown: false });
  });

  it('never guesses the role or the PIN', () => {
    expect(GUARD_FIELDS).toEqual(['deviceRole', 'ownerPin']);
    for (const field of GUARD_FIELDS) {
      const error = refusal(() => salvageStoredSettings({ ...shopRow(), [field]: { broken: true } }, NOW));
      expect(error.reading).toBe(true);
      expect(error.issues).toEqual([`${field}: cannot be read, and is never guessed`]);
    }
  });

  it('refuses a shop row with no PIN rather than inventing one', () => {
    expect(() => salvageStoredSettings({ ...shopRow(), ownerPin: null, handedness: 'both' }, NOW)).toThrow(RecordInvalid);
  });

  it('knows every field of the schema', () => {
    expect(SETTINGS_FIELDS).toEqual(Object.keys(defaultSettings(T0)));
  });
});
