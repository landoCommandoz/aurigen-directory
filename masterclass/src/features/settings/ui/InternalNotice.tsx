/**
 * Wraps a whole internal screen. Customer View on: the internal content is not on the page at all
 * (core <Internal>), and one neutral line stands in its place, so the screen is never blank and
 * says nothing internal. While the saved flag is still loading, a plain "Loading" line shows
 * (fail closed: nothing internal flashes after a refresh in Customer View).
 */
import type { ReactNode } from 'react';
import { Internal, useCustomerView } from '../../../core/customerView';

export const CUSTOMER_VIEW_NOTICE = 'Customer View is on.';

export function InternalNotice({ children }: { children: ReactNode }) {
  const { ready, on } = useCustomerView();
  if (!ready) {
    return (
      <p className="mc-status" aria-live="polite">
        Loading
      </p>
    );
  }
  if (on) {
    return (
      <p className="mc-status" aria-live="polite">
        {CUSTOMER_VIEW_NOTICE}
      </p>
    );
  }
  return <Internal>{children}</Internal>;
}
