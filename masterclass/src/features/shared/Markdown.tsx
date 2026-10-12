/**
 * Renders a content body written in Markdown (markdown.ts) as React elements. No HTML string is
 * injected, so nothing in a content file can run as code.
 *
 *   <Markdown text={lesson.why} headingOffset={1} />
 *
 * headingOffset moves the body's headings under the page's own: a "##" in a body that sits under
 * an h2 section renders as an h3 with offset 1. Tables render as one description list per row
 * (each cell under its column name), which reads at 375 px with no sideways scroll.
 */
import type { ReactNode } from 'react';
import { inlineText, parseMarkdown, type Inline } from './markdown';

function Inlines({ parts }: { parts: readonly Inline[] }) {
  return (
    <>
      {parts.map((part, index) => {
        const key = `${index}-${part.text.slice(0, 12)}`;
        if (part.strong === true) return <strong key={key}>{part.text}</strong>;
        if (part.em === true) return <em key={key}>{part.text}</em>;
        if (part.code === true) return <code key={key}>{part.text}</code>;
        return <span key={key}>{part.text}</span>;
      })}
    </>
  );
}

function Heading({ depth, children }: { depth: number; children: ReactNode }) {
  const level = Math.min(Math.max(depth, 2), 6);
  switch (level) {
    case 2:
      return <h2 className="md-heading">{children}</h2>;
    case 3:
      return <h3 className="md-heading">{children}</h3>;
    case 4:
      return <h4 className="md-heading">{children}</h4>;
    case 5:
      return <h5 className="md-heading">{children}</h5>;
    default:
      return <h6 className="md-heading">{children}</h6>;
  }
}

export interface MarkdownProps {
  text: string;
  /** Added to each heading's depth ("##" is depth 2). */
  headingOffset?: number;
  className?: string;
}

export function Markdown({ text, headingOffset = 0, className }: MarkdownProps) {
  const blocks = parseMarkdown(text);
  if (blocks.length === 0) return null;
  return (
    <div className={['md', className].filter(Boolean).join(' ')}>
      {blocks.map((block, index) => {
        const key = `${block.kind}-${index}`;
        switch (block.kind) {
          case 'heading':
            return (
              <Heading key={key} depth={block.depth + headingOffset}>
                <Inlines parts={block.inlines} />
              </Heading>
            );
          case 'paragraph':
            return (
              <p key={key}>
                <Inlines parts={block.inlines} />
              </p>
            );
          case 'quote':
            return (
              <blockquote key={key} className="md-quote">
                <Inlines parts={block.inlines} />
              </blockquote>
            );
          case 'list': {
            const items = block.items.map((item, i) => (
              <li key={`${i}-${inlineText(item).slice(0, 12)}`}>
                <Inlines parts={item} />
              </li>
            ));
            return block.ordered ? (
              <ol key={key} className="md-list" start={block.start}>
                {items}
              </ol>
            ) : (
              <ul key={key} className="md-list">
                {items}
              </ul>
            );
          }
          case 'table':
            return (
              <div key={key} className="md-table">
                {block.rows.map((row, r) => (
                  <dl key={`row-${r}`} className="md-table__row">
                    {row.map((cell, c) => (
                      <div key={`cell-${c}`} className="md-table__cell">
                        <dt>{inlineText(block.header[c] ?? [])}</dt>
                        <dd>
                          <Inlines parts={cell} />
                        </dd>
                      </div>
                    ))}
                  </dl>
                ))}
              </div>
            );
          default: {
            const unreachable: never = block;
            return <p key={key}>{String(unreachable)}</p>;
          }
        }
      })}
    </div>
  );
}
