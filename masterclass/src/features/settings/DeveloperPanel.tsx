/**
 * The developer panel (CLAUDE.md Tier 5, BLUEPRINT 9): live state plus the tests that answer the
 * Phase 1 device checklist. On in dev builds; in production only after the owner turned on
 * Developer tools with the PIN; never rendered while Customer View is on.
 *
 * Two ways to show it:
 *   <DeveloperPanel />                          the /settings/developer page
 *   <DeveloperPanel open={open} onClose={...} />  a slide-over (bottom sheet) the shell controls
 */
import { Drawer } from '../../components/ui';
import { Internal } from '../../core/customerView';
import { useDeveloperToolsEnabled } from './devTools';
import { SpeechShareTests } from './dev/SpeechShareTests';
import { StateReadouts } from './dev/StateReadouts';
import { StorageWakeTests } from './dev/StorageWakeTests';
import { Screen, StatusLine } from './ui/Screen';
import './dev/dev.css';

export const DEV_PANEL_LABEL = 'Developer panel. Removable before the final deploy.';
export const DEV_TOOLS_OFF = 'Developer tools are off. Turn them on in Settings, Developer tools, with the owner PIN.';

function PanelBody() {
  return (
    <div className="mc-dev">
      <p className="mc-dev__label">{DEV_PANEL_LABEL}</p>
      <StateReadouts />
      <StorageWakeTests />
      <SpeechShareTests />
    </div>
  );
}

export interface DeveloperPanelProps {
  /** Slide-over mode: whether the sheet is open (default true when onClose is given). */
  open?: boolean;
  /** Slide-over mode: called on Close, Escape, or a backdrop tap. */
  onClose?: () => void;
}

export function DeveloperPanel({ open = true, onClose }: DeveloperPanelProps) {
  const enabled = useDeveloperToolsEnabled();

  if (onClose !== undefined) {
    if (!enabled) return null;
    return (
      <Drawer open={open} onClose={onClose} title="Developer panel" eyebrow="Removable before the final deploy">
        <Internal>
          <PanelBody />
        </Internal>
      </Drawer>
    );
  }

  return (
    <Screen title="Developer panel" eyebrow="Settings" back={{ to: '/settings', label: 'Back to Settings' }}>
      {enabled ? <PanelBody /> : <StatusLine>{DEV_TOOLS_OFF}</StatusLine>}
    </Screen>
  );
}
