/**
 * Owner PIN and owner pass timing (D4): the pass lives 5 minutes on the monotonic clock, ends when
 * the page is hidden or reloaded; three wrong PINs lock entry for 30 seconds; the lock survives a
 * reload. Clocks are injected (core/clock), so no test waits in real time.
 */
import 'fake-indexeddb/auto';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { __setClockForTests } from '../../src/core/clock';
import { __resetDbForTests, getSettings, withDb } from '../../src/core/db';
import {
  OWNER_PASS_MS,
  PIN_LOCK_MS,
  __resetPinStateForTests,
  clearOwnerPass,
  ownerPassActive,
  ownerPassIssuedAt,
  ownerPassRemainingMs,
  setPin,
  verifyPin,
} from '../../src/core/pin';

const PIN = '482915';
const WRONG = '000000';
let mono = 0;
let wall = 0;

beforeEach(async () => {
  mono = 10_000;
  wall = Date.parse('2026-10-10T12:00:00.000Z');
  __setClockForTests({ wall: () => wall, monotonic: () => mono });
  __resetPinStateForTests();
  await __resetDbForTests();
  await setPin(PIN);
  clearOwnerPass();
});

afterEach(() => {
  __setClockForTests();
});

/** A reload: memory is gone (the pass, the fail count, the in-memory lock); the database stays. */
function reload(): void {
  __resetPinStateForTests();
}

async function audit(): Promise<Array<{ type: string; detail: string }>> {
  return withDb((db) => db.auditLog.toArray());
}

describe('the owner pass (5 minutes, memory only)', () => {
  it('opens on a correct PIN and ends exactly at 5:00 on the monotonic clock', async () => {
    expect(await verifyPin(PIN)).toEqual({ ok: true });
    expect(ownerPassActive()).toBe(true);
    mono += OWNER_PASS_MS - 1;
    expect(ownerPassActive()).toBe(true);
    expect(ownerPassRemainingMs()).toBe(1);
    mono += 1;
    expect(ownerPassActive()).toBe(false);
    expect(ownerPassIssuedAt()).toBeNull();
    expect(ownerPassRemainingMs()).toBe(0);
  });

  it('a phone clock moved forward an hour or back a day does not end or stretch the pass', async () => {
    await verifyPin(PIN);
    wall += 60 * 60 * 1000;
    expect(ownerPassActive()).toBe(true);
    wall -= 25 * 60 * 60 * 1000;
    expect(ownerPassActive()).toBe(true);
    mono += OWNER_PASS_MS;
    expect(ownerPassActive()).toBe(false);
  });

  it('ends when the page is hidden (phone locked, app switched)', async () => {
    await verifyPin(PIN);
    expect(ownerPassActive()).toBe(true);
    Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    expect(ownerPassActive()).toBe(false);
    Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true });
  });

  it('ends on pagehide and on a reload', async () => {
    await verifyPin(PIN);
    window.dispatchEvent(new Event('pagehide'));
    expect(ownerPassActive()).toBe(false);
    await verifyPin(PIN);
    reload();
    expect(ownerPassActive()).toBe(false);
  });

  it('a wrong PIN never opens the pass, and a wrong PIN after a right one does not close it early', async () => {
    expect(await verifyPin(WRONG)).toMatchObject({ ok: false, code: 'wrong', triesLeft: 2 });
    expect(ownerPassActive()).toBe(false);
    await verifyPin(PIN);
    expect(await verifyPin(WRONG)).toMatchObject({ ok: false, code: 'wrong' });
    expect(ownerPassActive()).toBe(true);
  });

  it('changing the PIN needs the pass; with it, the new PIN works and the old one does not', async () => {
    expect(await setPin('111111')).toMatchObject({ ok: false, code: 'noOwnerPass' });
    await verifyPin(PIN);
    expect(await setPin('111111')).toEqual({ ok: true, firstPin: false });
    clearOwnerPass();
    expect(await verifyPin(PIN)).toMatchObject({ ok: false, code: 'wrong' });
    expect(await verifyPin('111111')).toEqual({ ok: true });
  });
});

describe('three wrong PINs lock entry for 30 seconds', () => {
  it('the third wrong PIN locks; the right PIN is refused during the lock and accepted at 30 s', async () => {
    expect(await verifyPin(WRONG)).toMatchObject({ code: 'wrong', triesLeft: 2, message: 'Wrong PIN. 2 tries left.' });
    expect(await verifyPin(WRONG)).toMatchObject({ code: 'wrong', triesLeft: 1, message: 'Wrong PIN. 1 try left.' });
    expect(await verifyPin(WRONG)).toMatchObject({ code: 'locked', lockedForMs: PIN_LOCK_MS });
    expect(await verifyPin(PIN)).toMatchObject({ ok: false, code: 'locked' });
    wall += PIN_LOCK_MS - 1;
    expect(await verifyPin(PIN)).toMatchObject({ ok: false, code: 'locked' });
    wall += 1;
    expect(await verifyPin(PIN)).toEqual({ ok: true });
    expect(ownerPassActive()).toBe(true);
  });

  it('writes one pinFail audit entry per lock, and never the PIN', async () => {
    for (let i = 0; i < 3; i += 1) await verifyPin(WRONG);
    const entries = await audit();
    expect(entries.filter((e) => e.type === 'pinFail')).toHaveLength(1);
    expect(JSON.stringify(entries)).not.toContain(PIN);
    expect(JSON.stringify(entries)).not.toContain(WRONG);
    expect(JSON.stringify(await getSettings())).not.toContain(PIN);
  });

  it('the lock survives a reload', async () => {
    for (let i = 0; i < 3; i += 1) await verifyPin(WRONG);
    reload();
    wall += 10_000;
    expect(await verifyPin(PIN)).toMatchObject({ ok: false, code: 'locked' });
    wall += PIN_LOCK_MS;
    expect(await verifyPin(PIN)).toEqual({ ok: true });
  });

  it('malformed entries (5 or 7 digits, letters, spaces) are refused and do not count toward the lock', async () => {
    for (const bad of ['12345', '1234567', 'abcdef', '12 456', '', '１２３４５６']) {
      expect(await verifyPin(bad)).toMatchObject({ ok: false, code: 'invalid' });
    }
    expect(await verifyPin(WRONG)).toMatchObject({ code: 'wrong', triesLeft: 2 });
  });

  // DEF-05 (fixed in the fix wave): the count is saved per PIN (src/core/pinGuard.ts), so a reload
  // between tries no longer resets it. D4: three wrong attempts in a row lock.
  it('two wrong PINs, a reload, and one more wrong PIN still lock entry (the count survives a reload)', async () => {
    await verifyPin(WRONG);
    await verifyPin(WRONG);
    reload();
    expect(await verifyPin(WRONG)).toMatchObject({ ok: false, code: 'locked' });
  });
});

describe('DEF-05 recheck: the saved wrong-PIN count at its edges', () => {
  const KEY = 'masterclass.pinGuard';

  it('one wrong PIN per reload, three reloads: the third still locks', async () => {
    expect(await verifyPin(WRONG)).toMatchObject({ code: 'wrong', triesLeft: 2 });
    reload();
    expect(await verifyPin(WRONG)).toMatchObject({ code: 'wrong', triesLeft: 1 });
    reload();
    expect(await verifyPin(WRONG)).toMatchObject({ code: 'locked' });
    expect((await audit()).filter((e) => e.type === 'pinFail')).toHaveLength(1);
  });

  it('a correct PIN resets the saved count: two wrong, right, reload, one wrong leaves two tries', async () => {
    await verifyPin(WRONG);
    await verifyPin(WRONG);
    expect(await verifyPin(PIN)).toEqual({ ok: true });
    reload();
    expect(await verifyPin(WRONG)).toMatchObject({ code: 'wrong', triesLeft: 2 });
  });

  it('a new PIN starts the count again: two wrong on the old PIN never carry to the new one', async () => {
    await verifyPin(WRONG);
    await verifyPin(WRONG);
    expect(await verifyPin(PIN)).toEqual({ ok: true });
    expect((await setPin('135790')).ok).toBe(true);
    clearOwnerPass();
    reload();
    expect(await verifyPin(WRONG)).toMatchObject({ code: 'wrong', triesLeft: 2 });
  });

  it('a tampered or damaged saved value reads as zero and never crashes or unlocks a running lock early', async () => {
    const salt = (await getSettings()).ownerPin?.salt ?? '';
    const damaged = [
      'not json',
      '[]',
      'null',
      '{"salt":1,"fails":2}',
      JSON.stringify({ salt: 'another PIN', fails: 2 }),
      JSON.stringify({ salt, fails: -1 }),
      JSON.stringify({ salt, fails: 'two' }),
      JSON.stringify({ salt, fails: 1e9 }),
      JSON.stringify({ salt, fails: 1.5 }),
      JSON.stringify({ salt, fails: 0, lockedAt: 'soon' }),
    ];
    for (const raw of damaged) {
      window.localStorage.setItem(KEY, raw);
      reload();
      expect(await verifyPin(WRONG)).toMatchObject({ code: 'wrong' });
      expect(await verifyPin(PIN)).toEqual({ ok: true });
    }
    // A lock in progress, then the saved value is wiped: the lock still holds from its audit entry.
    for (let i = 0; i < 3; i += 1) await verifyPin(WRONG);
    window.localStorage.removeItem(KEY);
    reload();
    wall += 5_000;
    expect(await verifyPin(PIN)).toMatchObject({ code: 'locked' });
  });

  it('with storage blocked the count still holds for the session (three in a row lock) and nothing throws', async () => {
    const real = Object.getOwnPropertyDescriptor(window, 'localStorage');
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get() {
        throw new DOMException('blocked', 'SecurityError');
      },
    });
    try {
      expect(await verifyPin(WRONG)).toMatchObject({ code: 'wrong', triesLeft: 2 });
      expect(await verifyPin(WRONG)).toMatchObject({ code: 'wrong', triesLeft: 1 });
      expect(await verifyPin(WRONG)).toMatchObject({ code: 'locked' });
      reload();
      wall += 1_000;
      expect(await verifyPin(PIN)).toMatchObject({ code: 'locked' });
    } finally {
      if (real !== undefined) Object.defineProperty(window, 'localStorage', real);
    }
  });

  it('the saved value holds no PIN, wrong or right', async () => {
    await verifyPin(WRONG);
    const saved = window.localStorage.getItem(KEY) ?? '';
    expect(saved).not.toContain(WRONG);
    expect(saved).not.toContain(PIN);
  });
});
