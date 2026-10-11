/**
 * Read-aloud with the phone's own voices (D1 browser facts, BLUEPRINT risk 2). No download.
 *
 * iOS rules this follows:
 * - The first speak() must run inside a tap. Call unlock() from the "Start voice" tap; it speaks
 *   a short real sentence. A speak() before that is refused with "Tap Start voice" instead of
 *   failing silently (navigator.userActivation is used where the browser has it).
 * - Every utterance stays referenced until its end or error event, or the engine may drop it.
 * - Never cancel() and speak() in the same tick: a new text over a running one cancels, then
 *   starts on a short timer.
 * - "Done" is taken from either the end or the error event.
 * - Voices vary per phone and load late; never hard-code a voice name.
 * Whether speech continues after the screen locks is [VERIFY] on Lando's phone (Phase 1 checklist 3).
 */
import { describeError } from './errors';
import { createStore, useStore } from './store';

export interface SpeechStatus {
  supported: boolean;
  unlocked: boolean;
  speaking: boolean;
  paused: boolean;
  voiceCount: number;
  voiceURI: string | null;
  /** The chunk being read, for the developer panel. */
  current: string | null;
  chunkIndex: number;
  chunkCount: number;
  lastError: string | null;
}

export interface VoiceInfo {
  name: string;
  lang: string;
  voiceURI: string;
  isDefault: boolean;
  localService: boolean;
}

export type SpeakResult = { ok: true } | { ok: false; code: 'unsupported' | 'needsTap' | 'empty'; message: string };

const RESTART_DELAY_MS = 80;
const START_WATCHDOG_MS = 2500;
const MAX_CHUNK = 220;

function synth(): SpeechSynthesis | null {
  try {
    return typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance === 'function'
      ? window.speechSynthesis
      : null;
  } catch {
    return null;
  }
}

export const speechStatus = createStore<SpeechStatus>({
  supported: synth() !== null,
  unlocked: false,
  speaking: false,
  paused: false,
  voiceCount: 0,
  voiceURI: null,
  current: null,
  chunkIndex: 0,
  chunkCount: 0,
  lastError: null,
});

export function useSpeechStatus(): SpeechStatus {
  return useStore(speechStatus);
}

export function speechSupported(): boolean {
  return synth() !== null;
}

/* ---------- Voices ---------- */

let preferred: { voiceURI: string | null; lang: string | null } = { voiceURI: null, lang: null };

export function voices(): VoiceInfo[] {
  const s = synth();
  if (s === null) return [];
  try {
    return s.getVoices().map((v) => ({ name: v.name, lang: v.lang, voiceURI: v.voiceURI, isDefault: v.default, localService: v.localService }));
  } catch {
    return [];
  }
}

/** Voices load late on iOS and Chrome: listen, and refresh the count for the panel. */
export function onVoicesChanged(callback: (list: VoiceInfo[]) => void): () => void {
  const s = synth();
  if (s === null) return () => undefined;
  const handler = () => {
    const list = voices();
    speechStatus.update({ voiceCount: list.length });
    callback(list);
  };
  s.addEventListener('voiceschanged', handler);
  handler();
  return () => s.removeEventListener('voiceschanged', handler);
}

/** The voice chosen in Settings (settings.voiceURI and voiceLang). Null means the best English default. */
export function setPreferredVoice(voiceURI: string | null, lang: string | null = null): void {
  preferred = { voiceURI, lang };
  speechStatus.update({ voiceURI });
}

function pickVoice(s: SpeechSynthesis): SpeechSynthesisVoice | null {
  let list: SpeechSynthesisVoice[] = [];
  try {
    list = s.getVoices();
  } catch {
    return null;
  }
  if (preferred.voiceURI !== null) {
    const chosen = list.find((v) => v.voiceURI === preferred.voiceURI);
    if (chosen !== undefined) return chosen;
  }
  const lang = (preferred.lang ?? 'en').toLowerCase();
  return (
    list.find((v) => v.default && v.lang.toLowerCase().startsWith(lang)) ??
    list.find((v) => v.lang.toLowerCase().startsWith(lang)) ??
    null
  );
}

/* ---------- Chunking ---------- */

/** Sentence-sized pieces, so a lock or an interruption loses little and Repeat replays one step. */
export function chunkText(text: string): string[] {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean === '') return [];
  const sentences = clean.match(/[^.!?;:]+[.!?;:]*\s*/g) ?? [clean];
  const chunks: string[] = [];
  for (const raw of sentences) {
    let sentence = raw.trim();
    while (sentence.length > MAX_CHUNK) {
      const cut = Math.max(sentence.lastIndexOf(', ', MAX_CHUNK), sentence.lastIndexOf(' ', MAX_CHUNK));
      const at = cut > 40 ? cut + 1 : MAX_CHUNK;
      chunks.push(sentence.slice(0, at).trim());
      sentence = sentence.slice(at).trim();
    }
    if (sentence !== '') chunks.push(sentence);
  }
  return chunks;
}

/* ---------- Queue ---------- */

/** Utterances kept referenced until end or error (an unreferenced one can be dropped mid-sentence). */
const alive = new Set<SpeechSynthesisUtterance>();
let queue: string[] = [];
let index = 0;
let generation = 0;
let restartTimer: ReturnType<typeof setTimeout> | null = null;
/** unlock() ran inside a tap; speech counts as unlocked once an utterance actually starts. */
let unlockAttempted = false;
let watchdog: ReturnType<typeof setTimeout> | null = null;

function clearTimers(): void {
  if (restartTimer !== null) clearTimeout(restartTimer);
  if (watchdog !== null) clearTimeout(watchdog);
  restartTimer = null;
  watchdog = null;
}

function speakChunk(gen: number): void {
  const s = synth();
  const text = queue[index];
  if (s === null || gen !== generation) return;
  if (text === undefined) {
    speechStatus.update({ speaking: false, current: null, chunkIndex: index });
    return;
  }
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = pickVoice(s);
  if (voice !== null) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  } else if (preferred.lang !== null) {
    utterance.lang = preferred.lang;
  }
  let finished = false;
  const done = (error: string | null) => {
    if (finished) return;
    finished = true;
    alive.delete(utterance);
    if (gen !== generation) return;
    // "interrupted" and "canceled" come from our own stop(); they are not failures.
    if (error !== null && error !== 'interrupted' && error !== 'canceled') speechStatus.update({ lastError: `Speech error: ${error}` });
    index += 1;
    speakChunk(gen);
  };
  utterance.onstart = () => {
    if (watchdog !== null) clearTimeout(watchdog);
    watchdog = null;
    speechStatus.update({ unlocked: true, speaking: true, lastError: null });
  };
  utterance.onend = () => done(null);
  utterance.onerror = (event) => done(typeof event.error === 'string' ? event.error : 'unknown');
  alive.add(utterance);
  speechStatus.update({ speaking: true, paused: false, current: text, chunkIndex: index, chunkCount: queue.length });
  try {
    s.speak(utterance);
  } catch (error) {
    alive.delete(utterance);
    speechStatus.update({ speaking: false, lastError: describeError(error) });
    return;
  }
  if (!speechStatus.get().unlocked) {
    // iOS drops a speak() that did not come from a tap without any event; say so instead.
    watchdog = setTimeout(() => {
      if (gen === generation && !speechStatus.get().unlocked) {
        generation += 1;
        alive.clear();
        unlockAttempted = false;
        speechStatus.update({ speaking: false, current: null, lastError: 'The voice did not start. Tap Start voice.' });
      }
    }, START_WATCHDOG_MS);
  }
}

function startQueue(chunks: string[], from = 0): void {
  const s = synth();
  if (s === null) return;
  const busy = s.speaking || s.pending || alive.size > 0 || restartTimer !== null;
  clearTimers();
  generation += 1;
  const gen = generation;
  queue = chunks;
  index = from;
  if (busy) {
    try {
      s.cancel();
    } catch {
      // Nothing was speaking after all.
    }
    alive.clear();
    // Never cancel then speak in the same tick (Safari event bugs, D1 browser facts).
    restartTimer = setTimeout(() => {
      restartTimer = null;
      speakChunk(gen);
    }, RESTART_DELAY_MS);
  } else {
    speakChunk(gen);
  }
}

function hasActivation(): boolean | null {
  const nav = navigator as Navigator & { userActivation?: { isActive: boolean } };
  return nav.userActivation === undefined ? null : nav.userActivation.isActive;
}

/* ---------- Public API ---------- */

/** Call from the "Start voice" tap: speaks a short real sentence and unlocks later speech (iOS). */
export function unlock(sentence = 'Voice on.'): SpeakResult {
  if (synth() === null) return { ok: false, code: 'unsupported', message: 'This phone has no built-in voice for web apps.' };
  unlockAttempted = true;
  startQueue(chunkText(sentence));
  return { ok: true };
}

/** Read text aloud, replacing anything being read. Refused with a plain message before the first tap on iOS. */
export function speak(text: string): SpeakResult {
  if (synth() === null) return { ok: false, code: 'unsupported', message: 'This phone has no built-in voice for web apps.' };
  const chunks = chunkText(text);
  if (chunks.length === 0) return { ok: false, code: 'empty', message: 'Nothing to read.' };
  if (!speechStatus.get().unlocked && !unlockAttempted) {
    if (hasActivation() === false) return { ok: false, code: 'needsTap', message: 'Tap Start voice first.' };
    // Inside a tap (or a browser that cannot tell): this call is the unlock attempt.
    unlockAttempted = true;
  }
  startQueue(chunks);
  return { ok: true };
}

/** Stop reading and forget the queue. */
export function stop(): void {
  clearTimers();
  generation += 1;
  queue = [];
  index = 0;
  alive.clear();
  try {
    synth()?.cancel();
  } catch {
    // Already quiet.
  }
  speechStatus.update({ speaking: false, paused: false, current: null, chunkIndex: 0, chunkCount: 0 });
}

/** Pause: stop the voice but keep the place, so Resume starts the same sentence again (iOS pause() is unreliable). */
export function pause(): void {
  if (queue.length === 0) return;
  const keep = { queue, index };
  stop();
  queue = keep.queue;
  index = keep.index;
  speechStatus.update({ paused: true, chunkIndex: index, chunkCount: queue.length, current: queue[index] ?? null });
}

export function resume(): SpeakResult {
  if (!speechStatus.get().paused || queue.length === 0) return { ok: false, code: 'empty', message: 'Nothing is paused.' };
  startQueue(queue, index);
  return { ok: true };
}

/** Read the current sentence again (also used when the app comes back to the foreground). */
export function repeat(): SpeakResult {
  if (queue.length === 0) return { ok: false, code: 'empty', message: 'Nothing to repeat.' };
  startQueue(queue, Math.min(index, queue.length - 1));
  return { ok: true };
}

/** Developer panel "Test voice" (Phase 1 checklist items 3 and 5). Call it from a tap. */
export function testVoice(): SpeakResult {
  const first = !speechStatus.get().unlocked;
  return first ? unlock('This is the test voice. One, two, three.') : speak('This is the test voice. One, two, three.');
}

/** Tests only. */
export function __resetSpeechForTests(): void {
  stop();
  unlockAttempted = false;
  preferred = { voiceURI: null, lang: null };
  speechStatus.set({ ...speechStatus.get(), supported: synth() !== null, unlocked: false, voiceCount: 0, voiceURI: null, lastError: null });
}
