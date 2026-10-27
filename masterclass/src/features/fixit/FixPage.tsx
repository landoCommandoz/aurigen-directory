/**
 * /fixit/:id: one fix (BLUEPRINT 2.2), in the order a person needs it mid-job:
 *
 *   1. STOP: every stop condition as a red band, first, before anything else
 *   2. Read aloud: STOP lines first, then the steps (core/speech; the tap unlocks the voice)
 *   3. 30-second checks
 *   4. Most likely causes, ranked
 *   5. Do this: numbered steps
 *   6. Still happening?
 *   7. Notes (the maker's lines and the pending decisions)
 *   8. More (the Markdown body, when there is one)
 *   9. Related: lesson, cards, procedures, other fixes, products, tools, words
 *  10. Where this comes from (internal)
 *
 * Unverified lines carry the internal "unverified" badge; a pending decision carries "pending".
 * Fix It is internal: in Customer View the screen shows a plain notice instead (Screen). An
 * unknown id says so and offers the grid and Search.
 */
import { useNavigate, useParams } from 'react-router';
import { Button, StopBand } from '../../components/ui';
import { getItem, useContent, type LoadableShard } from '../../core/content';
import { useCustomerView } from '../../core/customerView';
import { lineStatus, lineText, visibleLines, type FixNodeItem } from '../../schemas';
import { badgeFor, LineBadge, LinesList, UnverifiedBadge } from '../search/contentViews';
import { ContentWait } from '../shared/ContentWait';
import { Markdown } from '../shared/Markdown';
import { ReadAloud } from '../shared/ReadAloud';
import { RelatedList } from '../shared/RelatedList';
import { SourcesList } from '../shared/SourcesList';
import { Actions, Screen, Section, StatusLine } from '../settings/ui/Screen';
import { fixRelatedIds, fixSpeechText, GROUP_LABELS } from './fixModel';
import './fixit.css';

const BACK = { to: '/fixit', label: 'All symptoms' };
/** The fixes, and the catalog for the Related list. */
export const FIX_PAGE_CONTENT: readonly LoadableShard[] = ['fixnode', 'catalog'];

function StopLines({ fix }: { fix: FixNodeItem }) {
  const lines = visibleLines(fix.stopIf, fix.status);
  if (lines.length === 0) return null;
  return (
    <div className="fx-stops">
      {lines.map((line, index) => {
        const text = lineText(line);
        return (
          <StopBand key={`${text}-${index}`}>
            {text}
            <LineBadge kind={badgeFor(text, lineStatus(line, fix.status), fix.status)} />
          </StopBand>
        );
      })}
    </div>
  );
}

/** A titled list section, left out when every line is superseded or the list is empty. */
function LinesSection({ title, lines, fix, ordered = false, index }: { title: string; lines: FixNodeItem['steps']; fix: FixNodeItem; ordered?: boolean; index: number }) {
  if (visibleLines(lines, fix.status).length === 0) return null;
  return (
    <Section title={title} index={index} className="fx-part">
      <LinesList lines={lines} itemStatus={fix.status} ordered={ordered} label={title} />
    </Section>
  );
}

function FixBody({ fix }: { fix: FixNodeItem }) {
  const navigate = useNavigate();
  return (
    <>
      <Section index={1} className="fx-top">
        <StopLines fix={fix} />
        {fix.status === 'verify' ? (
          <p className="ui-muted">
            <UnverifiedBadge show /> Check this fix against the label before relying on it.
          </p>
        ) : null}
        <ReadAloud text={() => fixSpeechText(fix)} />
      </Section>
      <LinesSection title="30-second checks" lines={fix.checks} fix={fix} index={2} />
      <LinesSection title="Most likely causes" lines={fix.causes} fix={fix} ordered index={3} />
      <LinesSection title="Do this" lines={fix.steps} fix={fix} ordered index={4} />
      <LinesSection title="Still happening?" lines={fix.stillHappening} fix={fix} index={5} />
      <LinesSection title="Notes" lines={fix.notes} fix={fix} index={6} />
      {fix.body.trim() !== '' ? (
        <Section title="More" index={6}>
          <Markdown text={fix.body} headingOffset={1} />
        </Section>
      ) : null}
      <RelatedList ids={fixRelatedIds(fix)} selfId={fix.id} index={6} />
      <SourcesList kbRef={fix.kbRef} sources={fix.sources} index={6} />
      <Section index={6}>
        <Actions>
          <Button size="shop" onClick={() => navigate('/fixit')}>
            Back to Fix It
          </Button>
          <Button size="shop" onClick={() => navigate('/search')}>
            Search
          </Button>
        </Actions>
      </Section>
    </>
  );
}

export function FixPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const cv = useCustomerView();
  const content = useContent(FIX_PAGE_CONTENT, cv.ready);

  if (!cv.ready) return <ContentWait title="Fix It" back={BACK} />;
  if (!content.ready) return <ContentWait title="Fix It" back={BACK} content={content} />;
  const found = getItem(id, { customerView: cv.on });
  const fix = found?.type === 'fixnode' ? found : undefined;
  if (fix === undefined) {
    return (
      <Screen title="Fix not found" back={BACK}>
        <StatusLine>There is no fix here. It may have been renamed or left out of this build.</StatusLine>
        <Actions>
          <Button size="shop" onClick={() => navigate('/fixit')}>
            Back to Fix It
          </Button>
          <Button size="shop" onClick={() => navigate('/search')}>
            Search
          </Button>
        </Actions>
      </Screen>
    );
  }
  return (
    <Screen title={fix.title} eyebrow={`Fix It, ${GROUP_LABELS[fix.group]}`} back={BACK} className="fx-page sh-reading">
      <FixBody fix={fix} />
    </Screen>
  );
}
