/**
 * The frame every feature screen in this wave uses (settings, Quick Cards, search, Fix It entry):
 * one scroll container, a back link in words, a heading, and the load moment on the main blocks.
 *
 *   <Screen title="Backup and restore" back={{ to: '/settings', label: 'Back to Settings' }}>
 *     <Section title="Make a backup">...</Section>
 *   </Screen>
 *
 * The root is `flex: 1 1 auto; min-height: 0; overflow-y: auto`, so it scrolls whether the shell's
 * outlet is a flex column or a block scroller. No max-height, no overflow hidden.
 */
import type { CSSProperties, ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../../../components/ui';
import { InternalNotice } from './InternalNotice';
import './screen.css';

export interface ScreenProps {
  title: string;
  /** A short line above the title, such as "Settings". */
  eyebrow?: string;
  /** The way back. Every screen has one. */
  back: { to: string; label: string };
  /** One line under the title in the dim color. */
  lede?: ReactNode;
  children?: ReactNode;
  /** Internal screens render a plain notice instead of their content in Customer View. */
  internal?: boolean;
  className?: string;
  /** Still loading what it draws (aria-busy on the main region, as the shell's Opening frame does). */
  busy?: boolean;
}

/** The load moment: pass the block's position (0, 1, 2 ...). Capped by the motion tokens. */
export function rise(index: number): CSSProperties {
  return { '--i': String(index) } as CSSProperties;
}

export function Screen({ title, eyebrow, back, lede, children, internal = true, className, busy = false }: ScreenProps) {
  const navigate = useNavigate();
  const body = (
    <>
      <header className="mc-screen__header ui-rise" style={rise(0)}>
        <Button variant="ghost" className="mc-screen__back" onClick={() => navigate(back.to)}>
          {back.label}
        </Button>
        {eyebrow ? <p className="mc-screen__eyebrow">{eyebrow}</p> : null}
        <h1 className="mc-screen__title">{title}</h1>
        {lede ? <p className="mc-screen__lede ui-muted">{lede}</p> : null}
      </header>
      {children}
    </>
  );
  return (
    <main className={['mc-screen', className].filter(Boolean).join(' ')} aria-busy={busy ? true : undefined}>
      {internal ? <InternalNotice>{body}</InternalNotice> : body}
    </main>
  );
}

export interface SectionProps {
  title?: string;
  /** Position in the load moment. */
  index?: number;
  children?: ReactNode;
  className?: string;
  /** Plain words under the heading. */
  intro?: ReactNode;
}

export function Section({ title, index = 1, children, className, intro }: SectionProps) {
  return (
    <section className={['mc-section', 'ui-rise', className].filter(Boolean).join(' ')} style={rise(index)}>
      {title ? <h2 className="mc-section__title">{title}</h2> : null}
      {intro ? <div className="mc-section__intro ui-muted">{intro}</div> : null}
      {children}
    </section>
  );
}

/** A plain line of status or result text, announced politely. */
export function StatusLine({ children, tone = 'info' }: { children: ReactNode; tone?: 'info' | 'warning' | 'success' }) {
  return (
    <p className="mc-status" data-tone={tone} aria-live="polite">
      {children}
    </p>
  );
}

/** A row of buttons that wraps on a phone. */
export function Actions({ children }: { children: ReactNode }) {
  return <div className="mc-actions">{children}</div>;
}
