/**
 * The body of the item page (/items/:id) and the fallback sheet: products, tools, and glossary
 * terms render in full. Fix It entries, Quick Cards, lessons, and procedures have pages of their
 * own (shared/contentRoutes.ts), so they never land here; any other type says which phase brings
 * its screen. Superseded rows and lines never render.
 * A product's notes (DEF-20) are lines with their own status: a house line, a maker's line beside
 * it, and a decision Lando has not made, each with its own badge. The label paragraph stays last.
 */
import { visibleLines, type ContentItemValue } from '../../schemas';
import { Internal } from '../../core/customerView';
import { LinesList, RowsList, UnverifiedBadge } from './contentViews';

const LATER_PHASE: Partial<Record<ContentItemValue['type'], string>> = {
  drill: 'Drills open in the Academy, Phase 5.',
  quizquestion: 'Quizzes open in the Academy, Phase 5.',
  flashcard: 'Flashcards open in the Academy, Phase 5.',
  priceitem: 'Prices open in the Business room, Phase 4.',
  policy: 'Policies open in the Business room, Phase 4.',
  script: 'Scripts open in Customer View, Phase 4.',
};

/** 2 on the item page (under its h1), 3 in the sheet (under the drawer's h2), so no level is skipped. */
export type DetailHeadingLevel = 2 | 3;

function Heading({ children, level }: { children: string; level: DetailHeadingLevel }) {
  const Tag = level === 2 ? 'h2' : 'h3';
  return <Tag className="sr-detail__heading">{children}</Tag>;
}

export function ItemDetail({ item, headingLevel = 2 }: { item: ContentItemValue; headingLevel?: DetailHeadingLevel }) {
  const badge = <UnverifiedBadge show={item.status === 'verify'} />;
  switch (item.type) {
    case 'product':
      return (
        <div className="sr-detail">
          <p className="ui-muted">
            {item.brand}
            {badge}
          </p>
          {item.neverOnPaint ? <p className="sr-detail__flag">Never on customer paint.</p> : null}
          <Heading level={headingLevel}>What it is for</Heading>
          <LinesList lines={item.jobs} itemStatus={item.status} />
          {item.dilutions.filter((d) => d.status !== 'superseded').length > 0 ? (
            <>
              <Heading level={headingLevel}>Dilutions</Heading>
              <RowsList rows={item.dilutions.map((d) => ({ label: d.use, value: d.ratio, status: d.status }))} />
            </>
          ) : null}
          {item.neverFor.length > 0 ? (
            <>
              <Heading level={headingLevel}>Never for</Heading>
              <LinesList lines={item.neverFor} itemStatus={item.status} />
            </>
          ) : null}
          {visibleLines(item.notes, item.status).length > 0 ? (
            <>
              <Heading level={headingLevel}>Notes</Heading>
              <LinesList lines={item.notes} itemStatus={item.status} label="Notes" />
            </>
          ) : null}
          {item.labelNotes ? <p>{item.labelNotes}</p> : null}
        </div>
      );
    case 'equipment':
      return (
        <div className="sr-detail">
          {item.model ? (
            <p className="ui-muted">
              {item.model}
              {badge}
            </p>
          ) : (
            badge
          )}
          {item.neverOnPaint ? <p className="sr-detail__flag">Never on customer paint.</p> : null}
          <RowsList rows={item.specs} label="Specs" itemStatus={item.status} />
          {visibleLines(item.checks, item.status).length > 0 ? (
            <>
              <Heading level={headingLevel}>Checks</Heading>
              <LinesList lines={item.checks} itemStatus={item.status} />
            </>
          ) : null}
        </div>
      );
    case 'glossaryterm':
      return (
        <div className="sr-detail">
          <p className="sr-detail__term">
            {item.term}
            {badge}
          </p>
          <p>{item.definition}</p>
          {item.alsoCalled.length > 0 ? <p className="ui-muted">Also called: {item.alsoCalled.join(', ')}</p> : null}
        </div>
      );
    default:
      return (
        <div className="sr-detail">
          {badge}
          <p>{LATER_PHASE[item.type] ?? 'This item has a page of its own. Search for it by name.'}</p>
          {item.kbRef ? (
            <Internal>
              <p className="ui-muted">Knowledge base {item.kbRef}</p>
            </Internal>
          ) : null}
        </div>
      );
  }
}
