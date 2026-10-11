import 'fake-indexeddb/auto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { __setClockForTests } from './clock';
import { __resetDbForTests, getSettings, withDb } from './db';
import {
  OWNER_PASS_MS,
  PIN_LOCK_MS,
  __resetPinStateForTests,
  hasPin,
  hashPin,
  lockCountdownWords,
  ownerPassActive,
  ownerPassIssuedAt,
  pinLockRemainingMs,
  pinMatches,
  resetPin,
  setPin,
  verifyPin,
} from './pin';
import { PIN_GUARD_KEY } from './pinGuard';

let mono = 0;
let wall = Date.parse('2026-10-10T12:00:00.000Z');

beforeEach(async () => {
  mono = 1_000;
  wall = Date.parse('2026-10-10T12:00:00.000Z');
  __setClockForTests({ wall: () => wall, monotonic: () => mono });
  __resetPinStateForTests();
  await __resetDbForTests();
});

afterEach(() => {
  __setClockForTests();
});

describe('owner PIN hashing (D4)', () => {
  it('stores a salted PBKDF2 hash, never the PIN, and verifies it', async () => {
    const stored = await hashPin('482915');
    expect(stored.algorithm).toBe('PBKDF2-SHA-256');
    expect(stored.iterations).toBe(100_000);
    expect(JSON.stringify(stored)).not.toContain('482915');
    expect(await pinMatches('482915', stored)).toBe(true);
    expect(await pinMatches('482916', stored)).toBe(false);
  });

  it('uses a fresh salt each time, so the same PIN hashes differently', async () => {
    const a = await hashPin('111111');
    const b = await hashPin('111111');
    expect(a.salt).not.toBe(b.salt);
    expect(a.hash).not.toBe(b.hash);
  });
});

describe('setPin and verifyPin', () => {
  it('a new phone has no PIN; verify says so', async () => {
    expect(await hasPin()).toBe(false);
    const r = await verifyPin('123456');
    expect(r).toMatchObject({ ok: false, code: 'noPin' });
  });

  it('refuses anything but 6 digits', async () => {
    for (const bad of ['', '12345', '1234567', 'abcdef', '12 456']) {
      expect(await setPin(bad)).toMatchObject({ ok: false, code: 'invalid' });
    }
    expect(await hasPin()).toBe(false);
  });

  it('creating the PIN turns on the weekly reminder in the same write, logs pinSet, and opens the pass', async () => {
    const r = await setPin('482915');
    expect(r).toEqual({ ok: true, firstPin: true });
    const s = await getSettings();
    expect(s.ownerPin).not.toBeNull();
    expect(s.backupReminderWeekly).toBe(true);
    expect(s.lastBackupAt).toBeNull();
    expect(JSON.stringify(s)).not.toContain('482915');
    const audit = await withDb((db) => db.auditLog.toArray());
    expect(audit.map((a) => a.type)).toEqual(['pinSet']);
    expect(audit.some((a) => a.detail.includes('482915'))).toBe(false);
    expect(ownerPassActive()).toBe(true);
  });

  it('changing the PIN needs the owner pass', async () => {
    await setPin('482915');
    __resetPinStateForTests();
    expect(await setPin('999999')).toMatchObject({ ok: false, code: 'noOwnerPass' });
    expect(await verifyPin('482915')).toEqual({ ok: true });
    expect(await setPin('999999')).toEqual({ ok: true, firstPin: false });
    expect((await verifyPin('482915')).ok).toBe(false);
  });
});

describe('the 5 minute owner pass', () => {
  it('lasts 5 minutes from a correct PIN, then ends', async () => {
    await setPin('482915');
    __resetPinStateForTests();
    expect(ownerPassActive()).toBe(false);
    expect(await verifyPin('482915')).toEqual({ ok: true });
    expect(ownerPassActive()).toBe(true);
    expect(ownerPassIssuedAt()).toBe('2026-10-10T12:00:00.000Z');
    mono += OWNER_PASS_MS - 1;
    expect(ownerPassActive()).toBe(true);
    mono += 1;
    expect(ownerPassActive()).toBe(false);
    expect(ownerPassIssuedAt()).toBeNull();
  });

  it('a phone clock moved forward does not end it early, and moved back does not stretch it (monotonic)', async () => {
    await setPin('482915');
    wall -= 60 * 60 * 1000;
    expect(ownerPassActive()).toBe(true);
    wall += 10 * 60 * 60 * 1000;
    expect(ownerPassActive()).toBe(true);
    mono += OWNER_PASS_MS;
    expect(ownerPassActive()).toBe(false);
  });

  it('ends when the page is hidden (phone locked or app switched)', async () => {
    await setPin('482915');
    expect(ownerPassActive()).toBe(true);
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' });
    document.dispatchEvent(new Event('visibilitychange'));
    expect(ownerPassActive()).toBe(false);
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'visible' });
  });
});

describe('three wrong PINs lock entry for 30 seconds', () => {
  it('gives a different message each time, then locks, logs once, and unlocks after 30 s', async () => {
    await setPin('482915');
    __resetPinStateForTests();
    const first = await verifyPin('000000');
    const second = await verifyPin('000001');
    expect(first).toMatchObject({ ok: false, code: 'wrong', triesLeft: 2 });
    expect(second).toMatchObject({ ok: false, code: 'wrong', triesLeft: 1 });
    expect(first.ok === false && second.ok === false && first.message !== second.message).toBe(true);
    expect(await verifyPin('000002')).toMatchObject({ ok: false, code: 'locked' });
    // Even the right PIN is refused while locked.
    expect(await verifyPin('482915')).toMatchObject({ ok: false, code: 'locked' });
    const fails = await withDb((db) => db.auditLog.where('type').equals('pinFail').count());
    expect(fails).toBe(1);
    wall += PIN_LOCK_MS;
    expect(await verifyPin('482915')).toEqual({ ok: true });
  });

  it('the lock survives a reload (memory cleared), because it is read back from the audit log', async () => {
    await setPin('482915');
    __resetPinStateForTests();
    await verifyPin('000000');
    await verifyPin('000000');
    await verifyPin('000000');
    __resetPinStateForTests();
    expect(await verifyPin('482915')).toMatchObject({ ok: false, code: 'locked' });
  });
});

describe('Forgot PIN (D4)', () => {
  it('needs the backup offered first, then sets the new PIN and logs pinReset', async () => {
    await setPin('482915');
    __resetPinStateForTests();
    expect(await resetPin('222222', { backupOffered: false })).toMatchObject({ ok: false, code: 'backupNotOffered' });
    expect(await resetPin('222222', { backupOffered: true })).toEqual({ ok: true, signOffsMarked: 0 });
    expect((await verifyPin('222222')).ok).toBe(true);
    const types = (await withDb((db) => db.auditLog.toArray())).map((a) => a.type);
    expect(types).toContain('pinReset');
  });
});

describe('the wrong-PIN count and the lock survive a reload (DEF-05)', () => {
  /** A reload: memory gone (the pass, the count, the lock); the database and local storage stay. */
  const reload = () => __resetPinStateForTests();

  it('two wrong PINs, a reload, one more: locked, with one pinFail entry', async () => {
    await setPin('482915');
    reload();
    await verifyPin('000000');
    await verifyPin('000000');
    reload();
    expect(await verifyPin('000000')).toMatchObject({ ok: false, code: 'locked', lockedForMs: PIN_LOCK_MS });
    expect(await withDb((db) => db.auditLog.where('type').equals('pinFail').count())).toBe(1);
  });

  it('a correct PIN clears the count: after it and a reload, a wrong PIN leaves two tries', async () => {
    await setPin('482915');
    reload();
    await verifyPin('000000');
    await verifyPin('000000');
    expect(await verifyPin('482915')).toEqual({ ok: true });
    reload();
    expect(await verifyPin('000000')).toMatchObject({ code: 'wrong', triesLeft: 2 });
  });

  it('a new PIN starts the count again (the saved count belongs to the PIN it was made against)', async () => {
    await setPin('482915');
    reload();
    await verifyPin('000000');
    await verifyPin('000000');
    expect(await resetPin('222222', { backupOffered: true })).toMatchObject({ ok: true });
    reload();
    expect(await verifyPin('000000')).toMatchObject({ code: 'wrong', triesLeft: 2 });
  });

  it('the lock outlives a reload even with its audit entry gone, and a PIN screen can read the seconds left at once', async () => {
    await setPin('482915');
    reload();
    for (let i = 0; i < 3; i += 1) await verifyPin('000000');
    await withDb((db) => db.auditLog.where('type').equals('pinFail').delete());
    reload();
    wall += 10_000;
    expect(await pinLockRemainingMs()).toBe(PIN_LOCK_MS - 10_000);
    expect(await verifyPin('482915')).toMatchObject({ ok: false, code: 'locked', message: 'Too many wrong PINs. Try again in 20 seconds.' });
    wall += PIN_LOCK_MS;
    expect(await pinLockRemainingMs()).toBe(0);
    expect(await verifyPin('482915')).toEqual({ ok: true });
  });

  it('a damaged saved record reads as zero, never as a lock', async () => {
    await setPin('482915');
    reload();
    window.localStorage.setItem(PIN_GUARD_KEY, '{not json');
    expect(await verifyPin('000000')).toMatchObject({ code: 'wrong', triesLeft: 2 });
    window.localStorage.setItem(PIN_GUARD_KEY, JSON.stringify({ salt: 'someone-else', fails: 2, lockedAt: wall }));
    expect(await pinLockRemainingMs()).toBe(0);
  });

  it('with local storage blocked, the count still holds for the session', async () => {
    await setPin('482915');
    reload();
    const get = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('blocked', 'SecurityError');
    });
    const set = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('blocked', 'SecurityError');
    });
    try {
      await verifyPin('000000');
      await verifyPin('000000');
      expect(await verifyPin('000000')).toMatchObject({ code: 'locked' });
    } finally {
      get.mockRestore();
      set.mockRestore();
    }
  });

  it('the countdown words are plain and count whole seconds', () => {
    expect(lockCountdownWords(27_400)).toBe('Locked after three wrong PINs. Try again in 28 seconds.');
    expect(lockCountdownWords(400)).toBe('Locked after three wrong PINs. Try again in 1 second.');
  });
});

