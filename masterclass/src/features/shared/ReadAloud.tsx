/**
 * The read-aloud controls for a page (BLUEPRINT 2.1, risk 2): "Read aloud" with the phone's own
 * voice, then Pause or Resume, Repeat, and Stop reading. The first tap is the gesture iOS needs:
 * speak() runs inside it (src/core/speech.ts). The text is built at the tap, so it is always the
 * page on screen. Leaving the page stops what it started, so the voice never reads a page that is
 * gone. Used by Quick Cards, Fix It, and the procedure pages.
 *
 * A tap that swaps the first button (Read aloud to Pause, Pause to Resume, Resume to Pause, Stop
 * reading back to Read aloud) puts a new control under the thumb, so the row takes no taps for
 * TAP_GUARD_MS after it (useTapHold, QA DEF-23): the second tap of a gloved double tap on "Read
 * aloud" lands on the row and does nothing, instead of pausing the voice it just started. Keyboard
 * activation is never held, and the first "Read aloud" after the page opens is never held.
 *
 *   <ReadAloud text={() => fixSpeechText(fix)} />
 */
import { useEffect, useRef, useState } from 'react';
import { Button } from '../../components/ui';
import { pause, repeat, resume, speak, stop, useSpeechStatus } from '../../core/speech';
import { Actions, StatusLine } from '../settings/ui/Screen';
import { useTapHold } from './useTapHold';
import './shared.css';

export interface ReadAloudProps {
  /** The words to read, built when the button is tapped. */
  text: () => string;
}

export function ReadAloud({ text }: ReadAloudProps) {
  const speech = useSpeechStatus();
  const [note, setNote] = useState<string | null>(null);
  const [mine, setMine] = useState(false);
  const mineRef = useRef(false);

  useEffect(
    () => () => {
      if (mineRef.current) stop();
    },
    [],
  );

  function claim(on: boolean) {
    mineRef.current = on;
    setMine(on);
  }

  const { holding, hold, captureHandlers } = useTapHold();

  function read() {
    const result = speak(text());
    claim(result.ok);
    setNote(result.ok ? null : result.message);
    if (result.ok) hold();
  }

  const active = mine && (speech.speaking || speech.paused);
  return (
    <div className="sh-voice">
      <div className="sh-voice__controls" data-tap-guard={holding ? 'on' : undefined} {...captureHandlers}>
        <Actions>
          {!active ? (
            <Button variant="primary" size="shop" onClick={read} disabled={!speech.supported}>
              Read aloud
            </Button>
          ) : speech.paused ? (
            <Button
              variant="primary"
              size="shop"
              onClick={() => {
                if (resume().ok) hold();
              }}
            >
              Resume
            </Button>
          ) : (
            <Button
              variant="primary"
              size="shop"
              onClick={() => {
                pause();
                hold();
              }}
            >
              Pause
            </Button>
          )}
          {active ? (
            <>
              <Button size="shop" onClick={() => repeat()}>
                Repeat
              </Button>
              <Button
                size="shop"
                onClick={() => {
                  stop();
                  claim(false);
                  hold();
                }}
              >
                Stop reading
              </Button>
            </>
          ) : null}
        </Actions>
      </div>
      {!speech.supported ? <p className="ui-muted">This phone has no built-in voice for web apps. The page still reads on screen.</p> : null}
      {note !== null ? <StatusLine tone="warning">{note}</StatusLine> : null}
      {speech.lastError !== null && active ? <p className="ui-muted">{speech.lastError}</p> : null}
    </div>
  );
}
