/**
 * StopBand: the red STOP band. Red has one job in this app, and this is it.
 * STOP is never color alone: a full-width band, the octagon, the word STOP,
 * and the condition in words. The app reads it aloud too.
 *
 *   <StopBand>Paint color on the pad</StopBand>
 *   <StopBand announce>Reading under 75 µm. No machine on this panel.</StopBand>
 *   <StopBand onClick={openFix09}>Paint color on the pad</StopBand>   (Fix It tile)
 *
 * announce makes it a live alert for screen readers; use it when the band
 * appears during a running step, not for a band that is part of a page.
 */
import type { ReactNode } from 'react';
import { OctagonGlyph } from './glyphs';
import { cx } from './util';
import './StopBand.css';

export interface StopBandProps {
  /** The STOP condition, in plain words. */
  children: ReactNode;
  /** The one word set in capitals. Defaults to STOP. */
  word?: string;
  /** Makes the band a full-width button (the STOP tile in Fix It). */
  onClick?: () => void;
  /** Announce it as an alert when it appears. */
  announce?: boolean;
  id?: string;
  className?: string;
}

export function StopBand({ children, word = 'STOP', onClick, announce = false, id, className }: StopBandProps) {
  const content = (
    <>
      <span className="ui-stopband__mark" aria-hidden="true">
        <OctagonGlyph />
      </span>
      <strong className="ui-stopband__word">{word}</strong>{' '}
      <span className="ui-stopband__text">{children}</span>
    </>
  );

  if (onClick !== undefined) {
    return (
      <button type="button" id={id} className={cx('ui-stopband', 'ui-press', className)} onClick={onClick}>
        {content}
      </button>
    );
  }

  return (
    <div id={id} className={cx('ui-stopband', className)} role={announce ? 'alert' : undefined}>
      {content}
    </div>
  );
}
