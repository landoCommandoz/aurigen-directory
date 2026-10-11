/**
 * FROZEN SHAPES (DEF-13, 2026-10-11). Read this before you touch this file or the schemas it checks.
 *
 * DeviceRole, OwnerPin, and the PIN a person types are frozen. D5 allows rolling the site back to an
 * older version, and an older copy that cannot read the role or the PIN record locks the owner out
 * of his own shop phone (docs/QA-REPORT.md DEF-13). So these shapes never change:
 *
 * - A new kind of device (a crew tablet, a kiosk)? Add a NEW optional field to Settings, for example
 *   `deviceKind`. Older copies drop unknown top-level settings fields on read and keep working.
 * - A new PIN hash or more iterations? Add a NEW optional field next to `ownerPin`, for example
 *   `ownerPinV2`, and keep writing `ownerPin` for the same PIN so a rolled-back copy still checks it.
 * - A longer PIN? Not without a plan for every phone in the shop: an older copy's pad takes 6 digits.
 *
 * If this test fails, undo the change to the schema. Do not edit the expected values below to make
 * it pass; that is the one change this file exists to stop. Changing this file needs the architect,
 * the lead, and Lando's written approval, plus a migration for every phone (docs/DECISIONS.md D12).
 */
import { describe, expect, it } from 'vitest';
import { DEFAULT_DEVICE_ROLE, DEVICE_ROLES, DeviceRole, OwnerPin, PIN_LENGTH, PinEntry, Settings } from './index';

const SET_AT = '2026-10-11T12:00:00.000Z';
const REFERENCE_PIN = {
  algorithm: 'PBKDF2-SHA-256',
  iterations: 100_000,
  salt: 'c2FsdHNhbHRzYWx0c2FsdA==',
  hash: 'aGFzaGhhc2hoYXNoaGFzaGhhc2hoYXNoaGFzaGg=',
  setAt: SET_AT,
} as const;

describe('frozen: DeviceRole', () => {
  it('accepts exactly study and shop, in that order, with study the default', () => {
    expect(DEVICE_ROLES).toEqual(['study', 'shop']);
    expect(DeviceRole.options).toEqual(['study', 'shop']);
    expect(DEFAULT_DEVICE_ROLE).toBe('study');
  });

  it('refuses every other value', () => {
    for (const value of ['crewTablet', 'Shop', 'SHOP', 'Study', '', ' study', 'shop ', null, undefined, 0, true, {}]) {
      expect(DeviceRole.safeParse(value).success).toBe(false);
    }
  });

  it('is stored in Settings as deviceRole, and a missing value reads as study', () => {
    expect(Object.hasOwn(Settings.shape, 'deviceRole')).toBe(true);
    expect(Settings.shape.deviceRole.parse(undefined)).toBe('study');
    expect(Settings.shape.deviceRole.safeParse('crewTablet').success).toBe(false);
  });
});

describe('frozen: OwnerPin', () => {
  it('has exactly these five fields, in this order', () => {
    expect(Object.keys(OwnerPin.shape)).toEqual(['algorithm', 'iterations', 'salt', 'hash', 'setAt']);
  });

  it('names exactly these two algorithms', () => {
    expect(OwnerPin.shape.algorithm.options).toEqual(['PBKDF2-SHA-256', 'SHA-256']);
  });

  it('reads the reference record back unchanged, and accepts the edges it always has', () => {
    expect(OwnerPin.parse(REFERENCE_PIN)).toEqual(REFERENCE_PIN);
    expect(OwnerPin.safeParse({ ...REFERENCE_PIN, algorithm: 'SHA-256', iterations: 1 }).success).toBe(true);
    expect(OwnerPin.safeParse({ ...REFERENCE_PIN, setAt: '2026-10-11T06:00:00-06:00' }).success).toBe(true);
  });

  it('refuses an extra field, a missing field, and every value outside its checks', () => {
    const refused: unknown[] = [
      { ...REFERENCE_PIN, pepper: 'x' },
      { ...REFERENCE_PIN, algorithm: 'Argon2id' },
      { ...REFERENCE_PIN, algorithm: 'pbkdf2-sha-256' },
      { ...REFERENCE_PIN, iterations: 0 },
      { ...REFERENCE_PIN, iterations: -1 },
      { ...REFERENCE_PIN, iterations: 1.5 },
      { ...REFERENCE_PIN, iterations: '100000' },
      { ...REFERENCE_PIN, salt: '' },
      { ...REFERENCE_PIN, salt: 'not base64!' },
      { ...REFERENCE_PIN, hash: '' },
      { ...REFERENCE_PIN, hash: 'not base64!' },
      { ...REFERENCE_PIN, setAt: 'yesterday' },
      { ...REFERENCE_PIN, setAt: '2026-10-11' },
      { ...REFERENCE_PIN, setAt: '2026-10-11T12:00:00' },
    ];
    for (const key of Object.keys(REFERENCE_PIN)) {
      const missing: Record<string, unknown> = { ...REFERENCE_PIN };
      delete missing[key];
      refused.push(missing);
    }
    for (const value of refused) expect(OwnerPin.safeParse(value).success).toBe(false);
  });

  it('is stored in Settings as ownerPin, and a missing value reads as no PIN', () => {
    expect(Object.hasOwn(Settings.shape, 'ownerPin')).toBe(true);
    expect(Settings.shape.ownerPin.parse(undefined)).toBeNull();
    expect(Settings.shape.ownerPin.parse(null)).toBeNull();
    expect(Settings.shape.ownerPin.parse(REFERENCE_PIN)).toEqual(REFERENCE_PIN);
  });
});

describe('frozen: the PIN a person types', () => {
  it('is exactly 6 digits', () => {
    expect(PIN_LENGTH).toBe(6);
    expect(PinEntry.safeParse('482915').success).toBe(true);
    for (const value of ['48291', '4829150', '48291a', ' 482915', '', '４８２９１５']) {
      expect(PinEntry.safeParse(value).success).toBe(false);
    }
  });
});
