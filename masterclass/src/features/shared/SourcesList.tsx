/**
 * "Where this comes from": the knowledge base section and every source an item carries, with the
 * date it was checked, the fact-checker's confirmation, the note, and the address written out (not
 * a link: the garage has no signal, and the words are what Lando checks against the label).
 * Internal only: it sits inside <Internal>, so Customer View never shows it.
 */
import { Internal } from '../../core/customerView';
import type { SourceRecord } from '../../schemas';
import { Section } from '../settings/ui/Screen';
import { plainDate } from './format';

export function SourcesList({ kbRef, sources, index = 7 }: { kbRef?: string | undefined; sources: readonly SourceRecord[]; index?: number }) {
  if (kbRef === undefined && sources.length === 0) return null;
  return (
    <Internal>
      <Section title="Where this comes from" index={index} className="sh-sources">
        <ul className="sh-sources__list">
          {kbRef !== undefined ? <li>Knowledge base section {kbRef}.</li> : null}
          {sources.map((source, i) => (
            <li key={`${source.label}-${i}`}>
              <span className="sh-sources__label">{source.label}</span>
              <span className="ui-muted">
                {`, checked ${plainDate(source.date)}`}
                {source.confirmedOn !== undefined ? `, confirmed by the fact-checker ${plainDate(source.confirmedOn)}` : ''}.
              </span>
              {source.note !== undefined ? <span className="sh-sources__note">{source.note}</span> : null}
              {source.url !== undefined ? <span className="sh-sources__url">{source.url}</span> : null}
            </li>
          ))}
        </ul>
      </Section>
    </Internal>
  );
}
