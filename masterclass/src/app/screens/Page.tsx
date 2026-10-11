/**
 * The page frame for the shell's own screens (Home, the placeholders, Not found, the customer
 * preview). It is a block inside the shell's one scroll container, with the same gutters and the
 * same load moment as the feature screens: the header rises first, each block after it 40 ms later.
 */
import type { CSSProperties, ReactNode } from 'react';
import './screens.css';

/** The load moment index for a block (0, 1, 2 ...); motion.css caps the stagger. */
export function rise(index: number): CSSProperties {
  return { '--i': String(index) } as CSSProperties;
}

export interface PageProps {
  title: string;
  eyebrow?: string;
  lede?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function Page({ title, eyebrow, lede, children, className }: PageProps) {
  return (
    <main className={['app-page', className].filter(Boolean).join(' ')} aria-label={title}>
      <header className="app-page__header ui-rise" style={rise(0)}>
        {eyebrow ? <p className="app-page__eyebrow">{eyebrow}</p> : null}
        <h1 className="app-page__title">{title}</h1>
        {lede ? <p className="app-page__lede ui-muted">{lede}</p> : null}
      </header>
      {children}
    </main>
  );
}

/** A block of the page that takes part in the load moment. */
export function Block({ index, label, children, className }: { index: number; label?: string; children: ReactNode; className?: string }) {
  return (
    <section className={['app-block', 'ui-rise', className].filter(Boolean).join(' ')} style={rise(index)} aria-label={label}>
      {children}
    </section>
  );
}
