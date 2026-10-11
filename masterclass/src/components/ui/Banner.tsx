/**
 * Banner: a full-width notice across the top of a view. One component for
 * the install card, the setup banner, the update banner, and the offline
 * indicator. Variants info, success, warning; each has its own glyph, so
 * the variant never rests on color. Never red: red is STOP only.
 *
 *   <Banner tone="info" title="Update ready" action={{ label: 'Update now', onAction: update }}
 *     onDismiss={later} dismissLabel="Later">A new version is saved on this phone.</Banner>
 *   <Banner tone="warning">Offline. Shop Mode, Fix It, and the Academy all still work.</Banner>
 *
 * Without onDismiss the banner has no dismiss button (for example the offline
 * indicator, which leaves when the signal comes back). The app removes
 * banners in Customer View (D10); this component does not decide that.
 */
import type { ReactNode } from 'react';
import { Button } from './Button';
import { CheckGlyph, InfoGlyph, WarningGlyph } from './glyphs';
import { cx } from './util';
import './Banner.css';

export type BannerTone = 'info' | 'success' | 'warning';

export interface BannerProps {
  tone?: BannerTone;
  title?: string;
  /** The notice, in plain words. */
  children: ReactNode;
  /** One action button. */
  action?: { label: string; onAction: () => void; loading?: boolean; loadingLabel?: string };
  /** Shows a dismiss button when given. */
  onDismiss?: () => void;
  dismissLabel?: string;
  className?: string;
}

const GLYPH: Record<BannerTone, ReactNode> = {
  info: <InfoGlyph />,
  success: <CheckGlyph />,
  warning: <WarningGlyph />,
};

export function Banner({
  tone = 'info',
  title,
  children,
  action,
  onDismiss,
  dismissLabel = 'Dismiss',
  className,
}: BannerProps) {
  return (
    <div className={cx('ui-banner', 'ui-fade', className)} data-tone={tone} aria-live="polite" aria-atomic="true">
      <span className="ui-banner__glyph" aria-hidden="true">
        {GLYPH[tone]}
      </span>
      <div className="ui-banner__body">
        {title ? <p className="ui-banner__title">{title}</p> : null}
        <div className="ui-banner__text">{children}</div>
      </div>
      {action || onDismiss ? (
        <div className="ui-banner__actions">
          {action ? (
            <Button onClick={action.onAction} loading={action.loading} loadingLabel={action.loadingLabel}>
              {action.label}
            </Button>
          ) : null}
          {onDismiss ? (
            <Button variant="ghost" onClick={onDismiss}>
              {dismissLabel}
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
