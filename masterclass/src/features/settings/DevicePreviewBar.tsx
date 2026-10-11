/**
 * Device preview (CLAUDE.md engineering rules): a strip at the top of the screen with Mobile 375,
 * Tablet 768, and Desktop full. It only sets the width; the shell sizes its wrapper from
 * usePreviewWidth() (or passes width and onChange to control it). Same visibility rule as the
 * developer panel; never rendered in Customer View.
 */
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

export interface DevicePreviewBarProps {
  /** Controlled width; defaults to the shared preview width. */
  width?: PreviewWidth;
  onChange?: (width: PreviewWidth) => void;
}

export function DevicePreviewBar({ width, onChange }: DevicePreviewBarProps) {
  const enabled = useDeveloperToolsEnabled();
  const shared = usePreviewWidth();
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
              {choice.label}
            </Button>
          ))}
        </div>
      </div>
    </Internal>
  );
}
