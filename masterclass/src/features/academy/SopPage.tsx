/**
 * /sops/:id: one procedure, read-only (Phase 2; the Job Runner runs it with timers in Phase 3).
 *
 *   title, stage, branch, planned time; the Markdown body when there is one
 *   Read aloud: each step, its STOP line, its notes
 *   The steps, numbered; under each: its STOP band, its timer and route in words, its notes
 *     (the maker's lines and pending decisions, with their badges), and its Quick Card one tap away
 *   Related, Where this comes from
 *
 * An unknown id says so and offers the list. Internal: Customer View shows a plain notice instead.
 */
import { useNavigate, useParams } from 'react-router';
import { Button, Row, StopBand } from '../../components/ui';
import { getItem, useContent, type LoadableShard } from '../../core/content';
import { useCustomerView } from '../../core/customerView';
import type { SopItem, SopStepValue } from '../../schemas';
import { badgeFor, LineBadge, LinesList, UnverifiedBadge } from '../search/contentViews';
import { ContentWait } from '../shared/ContentWait';
import { Markdown } from '../shared/Markdown';
import { ReadAloud } from '../shared/ReadAloud';
import { RelatedList } from '../shared/RelatedList';
import { SourcesList } from '../shared/SourcesList';
import { Actions, Screen, Section, StatusLine } from '../settings/ui/Screen';
import { BRANCH_LABELS, sopSpeechText, STAGE_LABELS, timerWords, visibleSteps } from './academyModel';
import './academy.css';

const BACK = { to: '/sops', label: 'All procedures' };
/** The procedures, the Quick Cards their steps open, and the catalog for the Related list. */
const SOP_CONTENT: readonly LoadableShard[] = ['sop', 'quickcard', 'catalog'];

function StepCard({ step, sop }: { step: SopStepValue; sop: SopItem }) {
  const navigate = useNavigate();
  const own = step.status ?? sop.status;
  const card = step.quickCardId === undefined ? undefined : getItem(step.quickCardId);
  const meta = [timerWords(step.timer), step.panelRoute !== undefined ? `Panel route: ${step.panelRoute}` : null].filter((w): w is string => w !== null);
  return (
    <li className="ac-step">
      <p className="ac-step__text">
        {step.text}
        <LineBadge kind={badgeFor(step.text, own, sop.status)} />
      </p>
      {step.stopIf !== undefined ? <StopBand>{step.stopIf}</StopBand> : null}
      {meta.length > 0 ? <p className="ac-step__meta ui-muted">{meta.join('. ')}.</p> : null}
      <LinesList lines={step.notes} itemStatus={own} label="Notes" />
      {card !== undefined ? (
        <Row title="Open the card" detail={card.title} trailing="Open" onClick={() => navigate(`/cards/${encodeURIComponent(card.id)}`)} />
      ) : null}
    </li>
  );
}

function SopBody({ sop }: { sop: SopItem }) {
  const navigate = useNavigate();
  const steps = visibleSteps(sop);
  return (
    <>
      <Section index={1}>
        {sop.status === 'verify' ? (
          <p className="ui-muted">
            <UnverifiedBadge show /> Check this procedure against the label before relying on it.
          </p>
        ) : null}
        {sop.body.trim() !== '' ? <Markdown text={sop.body} headingOffset={1} /> : null}
        <ReadAloud text={() => sopSpeechText(sop)} />
      </Section>
      <Section title="The steps" index={2}>
        {steps.length === 0 ? (
          <StatusLine>No steps to show.</StatusLine>
        ) : (
          <ol className="ac-steps" aria-label="The steps">
            {steps.map((step, index) => (
              <StepCard key={`${step.text}-${index}`} step={step} sop={sop} />
            ))}
          </ol>
        )}
      </Section>
      <RelatedList ids={sop.related} selfId={sop.id} index={3} />
      <SourcesList kbRef={sop.kbRef} sources={sop.sources} index={4} />
      <Section index={5}>
        <Actions>
          <Button size="shop" onClick={() => navigate('/sops')}>
            All procedures
          </Button>
          <Button size="shop" onClick={() => navigate('/fixit')}>
            Fix It
          </Button>
        </Actions>
      </Section>
    </>
  );
}

export function SopPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const cv = useCustomerView();
  const content = useContent(SOP_CONTENT, cv.ready);

  if (!cv.ready) return <ContentWait title="Procedure" back={BACK} />;
  if (!content.ready) return <ContentWait title="Procedure" back={BACK} content={content} />;
  const found = getItem(id, { customerView: cv.on });
  const sop = found?.type === 'sop' ? found : undefined;
  if (sop === undefined) {
    return (
      <Screen title="Procedure not found" back={BACK}>
        <StatusLine>There is no procedure here. It may have been renamed or left out of this build.</StatusLine>
        <Actions>
          <Button size="shop" onClick={() => navigate('/sops')}>
            All procedures
          </Button>
          <Button size="shop" onClick={() => navigate('/search')}>
            Search
          </Button>
        </Actions>
      </Screen>
    );
  }
  const lede = [BRANCH_LABELS[sop.vehicleBranch], sop.plannedMinutes !== undefined ? `planned ${sop.plannedMinutes} min` : null].filter(Boolean).join(', ');
  return (
    <Screen title={sop.title} eyebrow={`Procedure, ${STAGE_LABELS[sop.stage]}`} back={BACK} lede={`${lede}.`} className="ac-screen ac-sop sh-reading">
      <SopBody sop={sop} />
    </Screen>
  );
}
