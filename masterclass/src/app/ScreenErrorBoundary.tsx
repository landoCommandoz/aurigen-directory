/**
 * Keeps one broken screen from taking the whole app down: the shell, the bottom row, and Fix It
 * stay on screen, the error shows in words, and there is always a way out (Home, Fix It, Reload).
 * The shell keys it by route, so moving to another screen clears it.
 */
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '../components/ui';
import { ButtonLink } from './ButtonLink';
import './screens/screens.css';

interface State {
  error: Error | null;
}

function summary(error: Error): string {
  return `${error.name}: ${error.message}`.slice(0, 200);
}

export class ScreenErrorBoundary extends Component<{ children: ReactNode }, State> {
  override state: State = { error: null };

  static getDerivedStateFromError(error: unknown): State {
    return { error: error instanceof Error ? error : new Error(String(error)) };
  }

  override componentDidCatch(error: unknown, info: ErrorInfo): void {
    console.error('[screen] a screen stopped with an error', error, info.componentStack);
  }

  override render(): ReactNode {
    const { error } = this.state;
    if (error === null) return this.props.children;
    return (
      <main className="app-page" aria-label="Screen error">
        <div className="app-page__header">
          <h1 className="app-page__title">This screen hit a problem</h1>
          <p className="app-page__lede ui-muted">Nothing you saved was lost. Go back to Home, open Fix It, or reload.</p>
        </div>
        <p className="app-measure ui-muted app-path" role="alert">
          {summary(error)}
        </p>
        <div className="app-actions">
          <ButtonLink to="/">Home</ButtonLink>
          <ButtonLink to="/fixit">Fix It</ButtonLink>
          <Button variant="ghost" onClick={() => window.location.reload()}>
            Reload
          </Button>
        </div>
      </main>
    );
  }
}
