/**
 * A link that looks like the designer's Button (same classes and data attributes, so the same
 * CSS, press feedback, and 44 or 64 px height). Navigation is a link, not a button, so a screen
 * reader hears "link" and the current page gets aria-current from NavLink.
 */
import type { ReactNode } from 'react';
import { NavLink } from 'react-router';
import type { ButtonSize, ButtonVariant } from '../components/ui';

export interface ButtonLinkProps {
  to: string;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  /** Match only this exact path for aria-current (default true). */
  end?: boolean;
  className?: string;
  onClick?: () => void;
}

export function ButtonLink({ to, children, variant = 'secondary', size = 'default', block = false, end = true, className, onClick }: ButtonLinkProps) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={['ui-btn', 'ui-press', 'app-btn-link', className].filter(Boolean).join(' ')}
      data-variant={variant}
      data-size={size}
      data-block={block ? 'true' : undefined}
    >
      <span className="ui-btn__label">{children}</span>
    </NavLink>
  );
}
