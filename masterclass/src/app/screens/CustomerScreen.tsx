/**
 * What every route shows while Customer View is on, in Phase 1 (there are no customer screens
 * until Phase 4). Customer-safe by construction: only public values from src/app/config.ts, the
 * Focus reminder (D10, once per switch-on, persisted so a refresh never repeats it), and one line
 * about Phase 4. No accent: the page has no primary action (Lando: keep the accent sparse).
 * Leaving is the one control in the bottom row.
 */
import { Button } from '../../components/ui';
import { useCustomerView } from '../../core/customerView';
import { config } from '../config';
import { Block, Page } from './Page';

function listWords(items: readonly string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0] ?? '';
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1] ?? ''}`;
}

export function CustomerScreen() {
  const customerView = useCustomerView();
  const area = listWords(config.serviceArea);

  return (
    <Page title={config.brandName} className="app-page--customer" lede={area !== '' ? `Serving ${area}.` : undefined}>
      {customerView.focusReminderDue ? (
        <Block index={1} label="Focus reminder" className="app-focus">
          <p className="app-focus__text">Turn on your Customer Focus: Control Center, Focus.</p>
          <Button onClick={() => void customerView.markFocusReminderShown()}>Done</Button>
        </Block>
      ) : null}
      <Block index={2} label="Contact">
        <p>Call or text {config.phone}.</p>
      </Block>
      <Block index={3} label="About this screen">
        <p className="ui-muted app-measure">Customer pages (check-in, paint report, menu) arrive in Phase 4. Until then this is a preview, and leaving it is one tap below.</p>
      </Block>
    </Page>
  );
}
