/**
 * What every route shows while Customer View is on, until a route has its own customer page
 * (business-customer adds them later). A clean branded screen, customer-safe by construction:
 * the brand name and service area from src/app/config.ts, one plain line, the phone number, and
 * the Focus reminder (D10, once per switch-on, persisted so a refresh never repeats it). Nothing
 * internal and no build words: no phases, no previews (DEF-11). No accent: the page has no
 * primary action (Lando: keep the accent sparse). Leaving is the one control in the bottom row.
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

/** The one plain line a customer reads (the lead's words, DEF-11). */
export const CUSTOMER_LINE = "Ask Lando about today's work.";

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
      <Block index={2} label="Today">
        <p className="app-measure">{CUSTOMER_LINE}</p>
      </Block>
      <Block index={3} label="Contact">
        <p>Call or text {config.phone}.</p>
      </Block>
    </Page>
  );
}
