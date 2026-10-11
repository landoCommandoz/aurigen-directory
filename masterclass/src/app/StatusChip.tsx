/**
 * The small offline marker under the app title: "Ready offline", "Saving for offline",
 * "Online", "Offline, ready", or "Offline". Held in Customer View (D10 lists the "Ready offline"
 * marker among the things that wait until Customer View is off).
 */
import { CheckGlyph, InfoGlyph, WarningGlyph } from '../components/ui';
import { useConnectivity } from '../core/connectivity';
import { useCustomerView } from '../core/customerView';
import { usePwaStatus } from '../core/pwa';
import { statusWords } from './status';

export function StatusChip() {
  const { ready, on } = useCustomerView();
  const connectivity = useConnectivity();
  const pwa = usePwaStatus();
  if (!ready || on) return null;
  const words = statusWords({ connectivity, offlineReady: pwa.offlineReady, registered: pwa.registered, supported: pwa.supported });
  const glyph = words.tone === 'ready' ? <CheckGlyph /> : words.tone === 'warning' ? <WarningGlyph /> : <InfoGlyph />;
  return (
    <output className="app-status" data-tone={words.tone} aria-live="polite">
      <span className="app-status__glyph" aria-hidden="true">
        {glyph}
      </span>
      <span>{words.label}</span>
    </output>
  );
}
