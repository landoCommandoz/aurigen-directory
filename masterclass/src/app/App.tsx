/**
 * The app root: Customer View (the one mechanism, src/core/customerView.tsx), toasts held while
 * Customer View is on or still loading (D10), and the router under the base path (D9).
 */
import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router';
import { ToastProvider } from '../components/ui';
import { CustomerViewProvider, useCustomerView } from '../core/customerView';
import { basenameFor } from './deepLink';
import { AppRoutes } from './routes';

function HeldToasts({ children }: { children: ReactNode }) {
  const { held } = useCustomerView();
  return <ToastProvider held={held}>{children}</ToastProvider>;
}

export function App() {
  return (
    <CustomerViewProvider>
      <HeldToasts>
        <BrowserRouter basename={basenameFor(import.meta.env.BASE_URL)}>
          <AppRoutes />
        </BrowserRouter>
      </HeldToasts>
    </CustomerViewProvider>
  );
}
