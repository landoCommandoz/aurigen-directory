import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TAP_GUARD_MS } from '../../../components/ui';
import { advance, fingerTap } from '../../../components/ui/__tests__/tap';
import { __resetSpeechForTests } from '../../../core/speech';
import { ReadAloud } from '../ReadAloud';

/** A phone voice that keeps talking until it is cancelled, and logs what the app asked of it. */
function installVoice(): string[] {
  const log: string[] = [];
  let speaking = false;
  class Utterance {
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
    get speaking() {
      return speaking;
    },
    pending: false,
    getVoices: () => [],
    speak: (u: Utterance) => {
      log.push('speak');
      speaking = true;
      u.onstart?.();
    },
    cancel: () => {
      log.push('cancel');
      speaking = false;
    },
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  };
  vi.stubGlobal('SpeechSynthesisUtterance', Utterance);
  vi.stubGlobal('speechSynthesis', synth);
  __resetSpeechForTests();
  // The reset itself cancels; start the log clean.
  log.length = 0;
  return log;
}

function firstButton(): HTMLElement {
  const button = document.querySelector<HTMLElement>('.sh-voice__controls button');
  if (button === null) throw new Error('no voice button');
  return button;
}

let log: string[] = [];

beforeEach(() => {
  vi.useFakeTimers();
  log = installVoice();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  __resetSpeechForTests();
});

describe('ReadAloud and the double tap (DEF-23)', () => {
  it('the first tap after the page opens is never held', () => {
    render(<ReadAloud text={() => 'Step one. Step two.'} />);
    expect(document.querySelector('.sh-voice__controls')).not.toHaveAttribute('data-tap-guard');
    fingerTap(screen.getByRole('button', { name: 'Read aloud' }));
    expect(log).toEqual(['speak']);
    expect(firstButton()).toHaveTextContent('Pause');
  });

  it('a double tap on Read aloud keeps reading: the second tap lands on the held Pause and does nothing', () => {
    render(<ReadAloud text={() => 'Step one. Step two.'} />);
    fingerTap(screen.getByRole('button', { name: 'Read aloud' }));
    expect(document.querySelector('.sh-voice__controls')).toHaveAttribute('data-tap-guard', 'on');
    advance(40);
    fingerTap(firstButton());
    expect(log).toEqual(['speak']);
    expect(firstButton()).toHaveTextContent('Pause');
    expect(screen.getByRole('button', { name: 'Stop reading' })).toBeInTheDocument();
  });

  it('after the hold, Pause works, and a double tap on Pause does not resume', () => {
    render(<ReadAloud text={() => 'Step one. Step two.'} />);
    fingerTap(screen.getByRole('button', { name: 'Read aloud' }));
    advance(TAP_GUARD_MS + 10);
    expect(document.querySelector('.sh-voice__controls')).not.toHaveAttribute('data-tap-guard');
    fingerTap(screen.getByRole('button', { name: 'Pause' }));
    expect(log).toEqual(['speak', 'cancel']);
    expect(firstButton()).toHaveTextContent('Resume');
    advance(40);
    fingerTap(firstButton());
    expect(firstButton()).toHaveTextContent('Resume');
    expect(log).toEqual(['speak', 'cancel']);
    advance(TAP_GUARD_MS);
    fingerTap(screen.getByRole('button', { name: 'Resume' }));
    expect(log).toEqual(['speak', 'cancel', 'speak']);
    expect(firstButton()).toHaveTextContent('Pause');
  });

  it('a keyboard press on the new button is never held', () => {
    render(<ReadAloud text={() => 'Step one. Step two.'} />);
    fingerTap(screen.getByRole('button', { name: 'Read aloud' }));
    // Enter or Space on a focused button: a click with detail 0.
    fireEvent.click(screen.getByRole('button', { name: 'Pause' }));
    expect(log).toEqual(['speak', 'cancel']);
    expect(firstButton()).toHaveTextContent('Resume');
  });

  it('Stop reading after the hold brings Read aloud back, and the next swap holds again', () => {
    render(<ReadAloud text={() => 'Step one. Step two.'} />);
    fingerTap(screen.getByRole('button', { name: 'Read aloud' }));
    advance(TAP_GUARD_MS + 10);
    fingerTap(screen.getByRole('button', { name: 'Stop reading' }));
    expect(screen.getByRole('button', { name: 'Read aloud' })).toBeInTheDocument();
    advance(TAP_GUARD_MS + 10);
    fingerTap(screen.getByRole('button', { name: 'Read aloud' }));
    advance(40);
    fingerTap(firstButton());
    expect(firstButton()).toHaveTextContent('Pause');
    expect(log.filter((call) => call === 'speak')).toHaveLength(2);
    expect(log.at(-1)).toBe('speak');
  });
});
