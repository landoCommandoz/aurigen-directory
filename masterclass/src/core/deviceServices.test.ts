import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/* ---------- A fake speechSynthesis that behaves like WebKit's event order ---------- */

class FakeUtterance {
  text: string;
  voice: unknown = null;
  lang = '';
  onstart: (() => void) | null = null;
  onend: (() => void) | null = null;
  onerror: ((e: { error: string }) => void) | null = null;
  constructor(text: string) {
    this.text = text;
  }
}

function installSpeech() {
  const spoken: FakeUtterance[] = [];
  const log: string[] = [];
  const synthFake = {
    speaking: false,
    pending: false,
    current: null as FakeUtterance | null,
    speak(u: FakeUtterance) {
      log.push(`speak:${u.text}`);
      spoken.push(u);
      this.current = u;
      this.speaking = true;
      u.onstart?.();
    },
    cancel() {
      log.push('cancel');
      const u = this.current;
      this.current = null;
      this.speaking = false;
      u?.onerror?.({ error: 'canceled' });
    },
    getVoices: () => [
      { name: 'Samantha', lang: 'en-US', voiceURI: 'com.apple.voice.Samantha', default: true, localService: true },
      { name: 'Daniel', lang: 'en-GB', voiceURI: 'com.apple.voice.Daniel', default: false, localService: true },
    ],
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    finishCurrent() {
      const u = this.current;
      this.current = null;
      this.speaking = false;
      u?.onend?.();
    },
  };
  Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: synthFake });
  vi.stubGlobal('SpeechSynthesisUtterance', FakeUtterance);
  return { synthFake, spoken, log };
}

describe('read-aloud (speech.ts)', () => {
  let speechMod: typeof import('./speech');
  let fake: ReturnType<typeof installSpeech>;

  beforeEach(async () => {
    vi.useFakeTimers();
    fake = installSpeech();
    vi.resetModules();
    speechMod = await import('./speech');
    speechMod.__resetSpeechForTests();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('splits text into sentence-sized chunks', () => {
    expect(speechMod.chunkText('Spread at speed 1. Work at 4!  Done?')).toEqual(['Spread at speed 1.', 'Work at 4!', 'Done?']);
    expect(speechMod.chunkText('   ')).toEqual([]);
    const long = speechMod.chunkText(`${'word '.repeat(100)}end.`);
    expect(long.every((c) => c.length <= 220)).toBe(true);
  });

  it('refuses before the first tap when the browser can tell there was no tap', () => {
    Object.defineProperty(navigator, 'userActivation', { configurable: true, value: { isActive: false } });
    expect(speechMod.speak('Hello.')).toMatchObject({ ok: false, code: 'needsTap' });
    expect(fake.spoken).toHaveLength(0);
    expect(speechMod.unlock()).toEqual({ ok: true });
    expect(fake.spoken[0]?.text).toBe('Voice on.');
    expect(speechMod.speechStatus.get().unlocked).toBe(true);
  });

  it('reads chunks in order, each one kept until its end event', () => {
    speechMod.unlock();
    fake.synthFake.finishCurrent();
    expect(speechMod.speak('One. Two.')).toEqual({ ok: true });
    expect(fake.spoken.at(-1)?.text).toBe('One.');
    fake.synthFake.finishCurrent();
    expect(fake.spoken.at(-1)?.text).toBe('Two.');
    fake.synthFake.finishCurrent();
    expect(speechMod.speechStatus.get().speaking).toBe(false);
  });

  it('never cancels and speaks in the same tick: a new text over a running one waits a moment', () => {
    speechMod.unlock();
    speechMod.speak('First text.');
    const before = fake.log.length;
    speechMod.speak('Second text.');
    expect(fake.log.slice(before)).toEqual(['cancel']);
    vi.advanceTimersByTime(100);
    expect(fake.log.at(-1)).toBe('speak:Second text.');
  });

  it('pause keeps the place; resume and repeat read the same sentence again', () => {
    speechMod.unlock();
    fake.synthFake.finishCurrent();
    speechMod.speak('One. Two. Three.');
    fake.synthFake.finishCurrent();
    speechMod.pause();
    expect(speechMod.speechStatus.get()).toMatchObject({ paused: true, current: 'Two.' });
    expect(speechMod.resume()).toEqual({ ok: true });
    vi.advanceTimersByTime(100);
    expect(fake.spoken.at(-1)?.text).toBe('Two.');
    expect(speechMod.repeat()).toEqual({ ok: true });
    vi.advanceTimersByTime(100);
    expect(fake.spoken.at(-1)?.text).toBe('Two.');
  });

  it('uses the chosen voice, else the default English voice; lists voices for the panel', () => {
    expect(speechMod.voices().map((v) => v.name)).toEqual(['Samantha', 'Daniel']);
    speechMod.setPreferredVoice('com.apple.voice.Daniel');
    speechMod.unlock();
    const voice = fake.spoken[0]?.voice as { name: string } | undefined;
    expect(voice?.name).toBe('Daniel');
  });

  it('testVoice unlocks on the first tap', () => {
    expect(speechMod.testVoice()).toEqual({ ok: true });
    expect(fake.spoken[0]?.text).toContain('test voice');
  });
});

describe('screen wake lock (wakeLock.ts)', () => {
  let wl: typeof import('./wakeLock');

  function installWakeLock(behavior: 'ok' | 'deny') {
    const sentinels: Array<{ released: boolean; release: () => Promise<void>; fire: () => void }> = [];
    const api = {
      request: vi.fn<() => Promise<unknown>>(async () => {
        if (behavior === 'deny') throw Object.assign(new Error('not allowed'), { name: 'NotAllowedError' });
        let listener: (() => void) | null = null;
        const s = {
          released: false,
          release: async () => {
            s.released = true;
            listener?.();
          },
          addEventListener: (_t: string, l: () => void) => {
            listener = l;
          },
          fire: () => {
            s.released = true;
            listener?.();
          },
        };
        sentinels.push(s);
        return s;
      }),
    };
    Object.defineProperty(navigator, 'wakeLock', { configurable: true, value: api });
    return { api, sentinels };
  }

  beforeEach(async () => {
    vi.resetModules();
  });

  it('holds while a stage runs, releases on pause, and asks again when the app comes back', async () => {
    const fake = installWakeLock('ok');
    wl = await import('./wakeLock');
    wl.__resetWakeLockForTests();
    wl.setShouldHold(true);
    await vi.waitFor(() => expect(wl.wakeLockStatus.get().active).toBe(true));
    // The phone releases it when the app is hidden.
    fake.sentinels[0]?.fire();
    expect(wl.wakeLockStatus.get().active).toBe(false);
    document.dispatchEvent(new Event('visibilitychange'));
    await vi.waitFor(() => expect(wl.wakeLockStatus.get().active).toBe(true));
    expect(fake.api.request).toHaveBeenCalledTimes(2);
    wl.setShouldHold(false);
    await vi.waitFor(() => expect(wl.wakeLockStatus.get().active).toBe(false));
  });

  it('when refused, shows the Auto-Lock fallback and asks again on the next tap', async () => {
    const fake = installWakeLock('deny');
    wl = await import('./wakeLock');
    wl.__resetWakeLockForTests();
    wl.setShouldHold(true);
    await vi.waitFor(() => expect(wl.wakeLockStatus.get().lastError).toContain('NotAllowedError'));
    expect(wl.wakeLockStatus.get()).toMatchObject({ hint: wl.WAKE_LOCK_FALLBACK, waitingForTap: true });
    document.dispatchEvent(new Event('pointerup'));
    await vi.waitFor(() => expect(fake.api.request).toHaveBeenCalledTimes(2));
  });

  it('degrades gracefully where unsupported', async () => {
    Object.defineProperty(navigator, 'wakeLock', { configurable: true, value: undefined });
    wl = await import('./wakeLock');
    wl.__resetWakeLockForTests();
    expect(wl.wakeLockSupported()).toBe(false);
    expect(await wl.requestWakeLock()).toEqual({ ok: false, message: wl.WAKE_LOCK_FALLBACK });
    expect(wl.wakeLockStatus.get().hint).toBe(wl.WAKE_LOCK_FALLBACK);
  });
});

describe('storage probe (storage.ts)', () => {
  it('reports quota, usage, persisted, and asks persist() once per launch', async () => {
    const persist = vi.fn<() => Promise<boolean>>(async () => false);
    Object.defineProperty(navigator, 'storage', {
      configurable: true,
      value: { estimate: async () => ({ quota: 1024 * 1024 * 1024, usage: 5 * 1024 * 1024 }), persisted: async () => false, persist },
    });
    vi.resetModules();
    const st = await import('./storage');
    st.__resetStorageProbeForTests();
    const probe = await st.probeStorage();
    expect(probe).toMatchObject({ supported: true, quotaMB: 1024, usageMB: 5, persisted: false, error: null });
    await st.requestPersistOnce();
    await st.requestPersistOnce();
    expect(persist).toHaveBeenCalledTimes(1);
    expect(st.storageProbe.get()).toMatchObject({ persistRequested: true, persistResult: false });
  });

  it('never throws when the API is missing or fails', async () => {
    Object.defineProperty(navigator, 'storage', { configurable: true, value: { estimate: async () => Promise.reject(new Error('denied')) } });
    vi.resetModules();
    const st = await import('./storage');
    st.__resetStorageProbeForTests();
    const probe = await st.probeStorage();
    expect(probe.supported).toBe(true);
    expect(probe.error).toContain('denied');
    Object.defineProperty(navigator, 'storage', { configurable: true, value: undefined });
    expect((await st.probeStorage()).supported).toBe(false);
    expect(await st.requestPersistOnce()).toBeNull();
  });
});
