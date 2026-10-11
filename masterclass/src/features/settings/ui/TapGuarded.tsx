/**
 * A row of controls that appears where the last tap landed (a screen that replaced the one just
 * tapped) takes no taps for TAP_GUARD_MS, using the designer's useTapGuard (DEF-04). Keyboard
 * activation is never held. The CSS (screen.css) sets pointer-events none while it holds, so a
 * real tap lands on the row and does nothing.
 */
import type { ReactNode } from 'react';
import { useTapGuard } from '../../../components/ui';

export function TapGuarded({ children }: { children: ReactNode }) {
  const guard = useTapGuard();
  return (
    <div className="mc-tap-guard" data-tap-guard={guard.holding ? 'on' : undefined} {...guard.captureHandlers}>
      {children}
    </div>
  );
}
