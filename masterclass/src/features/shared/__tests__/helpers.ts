/**
 * Test helpers for the Phase 2 pages: load the fixture bundle into core content and search, and a
 * fake phone voice that records every chunk it is asked to speak, in order. Not imported by app code.
 */
import { vi } from 'vitest';
import { __setContentBundleForTests } from '../../../core/content';
import { __resetSearchForTests } from '../../../core/search';
import { __resetSpeechForTests } from '../../../core/speech';
import type { ContentItemValue } from '../../../schemas';
import { fixtureBundle } from './fixture';

export function loadFixtureBundle(): ContentItemValue[] {
  const bundle = fixtureBundle();
  __setContentBundleForTests(bundle);
  __resetSearchForTests();
  return bundle.items;
}

interface FakeUtterance {
  text: string;
  onstart?: () => void;
  onend?: () => void;
  onerror?: (event: { error: string }) => void;
}

/** A voice that starts and finishes each chunk at once, so a whole text is spoken in order. */
export function installVoice(): string[] {
  const spoken: string[] = [];
  class Utterance implements FakeUtterance {
    text: string;
    voice: unknown = null;
    lang = '';
    onstart?: () => void;
    onend?: () => void;
    constructor(text: string) {
      this.text = text;
    }
  }
  const synth = {
    speaking: false,
    pending: false,
    getVoices: () => [],
    speak: (u: FakeUtterance) => {
      spoken.push(u.text);
      u.onstart?.();
      u.onend?.();
    },
    cancel: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  };
  vi.stubGlobal('SpeechSynthesisUtterance', Utterance);
  vi.stubGlobal('speechSynthesis', synth);
  __resetSpeechForTests();
  return spoken;
}
