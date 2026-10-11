/**
 * The body of the item sheet: one content item shown by its type. Quick Cards, products,
 * equipment, glossary terms, and Fix It entries (Phase 2 content) render in full; other types show
 * their title and say which phase brings their screen. Superseded rows and lines never render.
 */
import { StopBand } from '../../components/ui';
import { lineText, visibleLines, type ContentItemValue } from '../../schemas';
import { Internal } from '../../core/customerView';
import { LinesList, RowsList, UnverifiedBadge } from './contentViews';

const LATER_PHASE: Partial<Record<ContentItemValue['type'], string>> = {
  sop: 'Procedures open in the Job Runner, Phase 3.',
  lesson: 'Lessons open in the Academy, Phase 5.',
  drill: 'Drills open in the Academy, Phase 5.',
  quizquestion: 'Quizzes open in the Academy, Phase 5.',
  flashcard: 'Flashcards open in the Academy, Phase 5.',
  priceitem: 'Prices open in the Business room, Phase 4.',
  policy: 'Policies open in the Business room, Phase 4.',
  script: 'Scripts open in Customer View, Phase 4.',
};

function Heading({ children }: { children: string }) {
  return <h3 className="sr-detail__heading">{children}</h3>;
}

export function ItemDetail({ item }: { item: ContentItemValue }) {
  const badge = <UnverifiedBadge show={item.status === 'verify'} />;
  switch (item.type) {
    case 'quickcard':
      return (
        <div className="sr-detail">
          {badge}
          <RowsList rows={item.rows} label={item.title} />
        </div>
      );
    case 'product':
      return (
        <div className="sr-detail">
          <p className="ui-muted">
            {item.brand}
            {badge}
          </p>
          {item.neverOnPaint ? <p className="sr-detail__flag">Never on customer paint.</p> : null}
          <Heading>What it is for</Heading>
          <LinesList lines={item.jobs} itemStatus={item.status} />
          {item.dilutions.filter((d) => d.status !== 'superseded').length > 0 ? (
            <>
              <Heading>Dilutions</Heading>
              <RowsList rows={item.dilutions.map((d) => ({ label: d.use, value: d.ratio, status: d.status }))} />
            </>
          ) : null}
          {item.neverFor.length > 0 ? (
            <>
              <Heading>Never for</Heading>
              <LinesList lines={item.neverFor} itemStatus={item.status} />
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
          <RowsList rows={item.specs} label="Specs" />
          {visibleLines(item.checks, item.status).length > 0 ? (
            <>
              <Heading>Checks</Heading>
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
    case 'fixnode':
      return (
        <div className="sr-detail">
          {badge}
          {visibleLines(item.stopIf, item.status).map((line, index) => (
            <StopBand key={`${lineText(line)}-${index}`}>{lineText(line)}</StopBand>
          ))}
          {item.checks.length > 0 ? <Heading>30-second checks</Heading> : null}
          <LinesList lines={item.checks} itemStatus={item.status} />
          <Heading>Likely causes</Heading>
          <LinesList lines={item.causes} itemStatus={item.status} />
          <Heading>Do this</Heading>
          <LinesList lines={item.steps} itemStatus={item.status} ordered />
          {item.stillHappening.length > 0 ? <Heading>Still happening?</Heading> : null}
          <LinesList lines={item.stillHappening} itemStatus={item.status} />
          <LinesList lines={item.notes} itemStatus={item.status} />
        </div>
      );
    default:
      return (
        <div className="sr-detail">
          {badge}
          <p>{LATER_PHASE[item.type] ?? 'This item opens in a later phase.'}</p>
          {item.kbRef ? (
            <Internal>
              <p className="ui-muted">Knowledge base {item.kbRef}</p>
            </Internal>
          ) : null}
        </div>
      );
  }
}
