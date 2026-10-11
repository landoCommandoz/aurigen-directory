/**
 * Developer panel: voice and share sheet tests (Phase 1 device checklist items 3, 4, and 5).
 * "Test voice" speaks inside the tap. Each share test builds its file synchronously and calls the
 * share sheet with nothing awaited first, then reports canShare and the outcome.
 */
import { useEffect, useState } from 'react';
import { Button } from '../../../components/ui';
import { nowIso } from '../../../core/clock';
import { canShareFiles, errorNameOf } from '../../../core/platform';
import { onVoicesChanged, testVoice, useSpeechStatus, voices, type VoiceInfo } from '../../../core/speech';
import { yesNo } from '../ui/format';
import { Readouts } from '../ui/Readouts';
import { Actions, Section } from '../ui/Screen';
import { SHARE_KINDS, shareErrorWords, shareTestFile, type ShareKind } from './devReadouts';

export const SPEECH_LABELS = {
  supported: 'Speech supported',
  count: 'Voices on this phone',
  english: 'Default English voice',
  unlocked: 'Voice unlocked by a tap',
  speaking: 'Speaking now',
  error: 'Last speech error',
} as const;

export const SHARE_LABELS: Record<ShareKind, string> = { png: 'Share PNG', pdf: 'Share PDF', json: 'Share JSON' };

function defaultEnglish(list: readonly VoiceInfo[]): string {
  const english = list.filter((v) => v.lang.toLowerCase().startsWith('en'));
  const chosen = english.find((v) => v.isDefault) ?? english[0];
  return chosen === undefined ? 'None found' : `${chosen.name} (${chosen.lang})`;
}

export function SpeechShareTests() {
  const speech = useSpeechStatus();
  const [list, setList] = useState<VoiceInfo[]>(() => voices());
  const [voiceNote, setVoiceNote] = useState<string>('Not run yet');
  const [showVoices, setShowVoices] = useState(false);
  const [shares, setShares] = useState<Record<ShareKind, string>>({ png: 'Not run yet', pdf: 'Not run yet', json: 'Not run yet' });

  useEffect(() => onVoicesChanged(setList), []);

  function voice() {
    const result = testVoice();
    setVoiceNote(result.ok ? 'Speaking. Lock the screen now: does the voice keep going?' : result.message);
  }

  function record(kind: ShareKind, text: string) {
    setShares((current) => ({ ...current, [kind]: text }));
  }

  function share(kind: ShareKind) {
    const file = shareTestFile(kind, nowIso());
    const can = canShareFiles([file]);
    if (!can) {
      record(kind, 'canShare: no. This phone cannot share this file type from here.');
      return;
    }
    try {
      navigator
        .share({ files: [file], title: 'Masterclass share test' })
        .then(() => record(kind, 'canShare: yes. Shared: an app was picked. Note which apps the sheet offered.'))
        .catch((error: unknown) => record(kind, `canShare: yes. ${shareErrorWords(errorNameOf(error))}`));
    } catch (error) {
      record(kind, `canShare: yes. ${shareErrorWords(errorNameOf(error))}`);
    }
  }

  return (
    <>
      <Section title="Voice" index={6} intro={<p>Checklist items 3 and 5: tap Test voice, then lock the screen right away. Does the voice keep going? Which voices are listed, and does the English one sound acceptable?</p>}>
        <Readouts
          label="Speech"
          items={[
            { label: SPEECH_LABELS.supported, value: yesNo(speech.supported) },
            { label: SPEECH_LABELS.count, value: String(list.length) },
            { label: SPEECH_LABELS.english, value: defaultEnglish(list) },
            { label: SPEECH_LABELS.unlocked, value: yesNo(speech.unlocked) },
            { label: SPEECH_LABELS.speaking, value: yesNo(speech.speaking) },
            { label: SPEECH_LABELS.error, value: speech.lastError ?? 'None' },
          ]}
        />
        <Actions>
          <Button onClick={voice}>Test voice</Button>
          <Button onClick={() => setShowVoices((on) => !on)} aria-expanded={showVoices} disabled={list.length === 0}>
            {showVoices ? 'Hide the voice list' : 'Show the voice list'}
          </Button>
        </Actions>
        <p className="ui-muted" aria-live="polite">
          {voiceNote}
        </p>
        <p>Lock the screen after tapping Test voice.</p>
        {showVoices ? (
          <ul className="mc-list">
            {list.map((v) => (
              <li key={v.voiceURI}>
                {v.name}, {v.lang}
                {v.isDefault ? ', default' : ''}
                {v.localService ? '' : ', network'}
              </li>
            ))}
          </ul>
        ) : null}
      </Section>
      <Section title="Share sheet" index={7} intro={<p>Checklist item 4: tap each test and note which apps the share sheet offers.</p>}>
        <Readouts label="Share tests" items={SHARE_KINDS.map((kind) => ({ label: SHARE_LABELS[kind], value: shares[kind] }))} />
        <Actions>
          <Button onClick={() => share('png')}>Test share PNG</Button>
          <Button onClick={() => share('pdf')}>Test share PDF</Button>
          <Button onClick={() => share('json')}>Test share JSON</Button>
        </Actions>
      </Section>
    </>
  );
}
