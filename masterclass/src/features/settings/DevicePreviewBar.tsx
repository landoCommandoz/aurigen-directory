/**
 * Device preview (CLAUDE.md engineering rules): a strip at the top of the screen with Mobile 375,
 * Tablet 768, and Desktop full. It only sets the width; the shell sizes its wrapper from
 * usePreviewWidth() (or passes width and onChange to control it). Same visibility rule as the
 * developer panel; never rendered in Customer View.
 *
 * The labels are always true (DEF-12): on a window too narrow for a width, the preview frame fits
 * the window, and the button says the width it will really show ("Tablet 768, shown at 396 here").
 */
import { useEffect, useState } from 'react';
import { Button, CheckGlyph } from '../../components/ui';
import { Internal } from '../../core/customerView';
import { useDeveloperToolsEnabled } from './devTools';
import { setPreviewWidth, usePreviewWidth, type PreviewWidth } from './previewWidth';
import './dev/dev.css';

export const PREVIEW_LABEL = 'Device preview. Remove before deploy.';

const CHOICES: ReadonlyArray<{ width: PreviewWidth; label: string }> = [
  { width: 375, label: 'Mobile 375' },
  { width: 768, label: 'Tablet 768' },
  { width: null, label: 'Desktop full' },
];

/** The preview stage's 16 px padding on each side plus the frame's two 1 px borders (shell.css, PreviewHost). */
export const PREVIEW_CHROME_PX = 34;

/** The label for one choice on a window this wide: the width it names, or the width it will really show. */
export function previewLabel(choice: { width: PreviewWidth; label: string }, windowWidth: number): string {
  if (choice.width === null || windowWidth <= 0) return choice.label;
  const fits = Math.max(0, Math.floor(windowWidth - PREVIEW_CHROME_PX));
  return choice.width <= fits ? choice.label : `${choice.label}, shown at ${fits} here`;
}

function viewportWidth(): number {
  try {
    return document.documentElement.clientWidth || window.innerWidth;
  } catch {
    return 0;
  }
}

/** The window's width, kept current through resizes and rotation. */
export function useViewportWidth(): number {
  const [width, setWidth] = useState(viewportWidth);
  useEffect(() => {
    const update = () => setWidth(viewportWidth());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return width;
}

export interface DevicePreviewBarProps {
  /** Controlled width; defaults to the shared preview width. */
  width?: PreviewWidth;
  onChange?: (width: PreviewWidth) => void;
}

export function DevicePreviewBar({ width, onChange }: DevicePreviewBarProps) {
  const enabled = useDeveloperToolsEnabled();
  const shared = usePreviewWidth();
  const windowWidth = useViewportWidth();
  if (!enabled) return null;
  const current = width === undefined ? shared : width;
  const choose = onChange ?? setPreviewWidth;

  return (
    <Internal>
      <div className="mc-preview" role="toolbar" aria-label="Device preview" data-print="hide">
        <p className="mc-preview__label">{PREVIEW_LABEL}</p>
        <div className="mc-preview__buttons">
          {CHOICES.map((choice) => (
            <Button
              key={choice.label}
              aria-pressed={current === choice.width}
              icon={current === choice.width ? <CheckGlyph /> : undefined}
              onClick={() => choose(choice.width)}
              className="mc-preview__button"
            >
              {previewLabel(choice, windowWidth)}
            </Button>
          ))}
        </div>
      </div>
    </Internal>
  );
}
