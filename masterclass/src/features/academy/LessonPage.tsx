/**
 * /academy/:lessonId: one lesson, read-only (Phase 2; the full Academy app is Phase 5).
 *
 *   title, level and place, the goal as the objective
 *   Why it matters (the Markdown "why", with the accent rule on its left)
 *   The steps (numbered), The numbers (rows), Common mistakes
 *   the Phase 5 line: drills, quizzes, and sign-off arrive then
 *   Related, the lesson before and after, Where this comes from
 *
 * Reading view: text holds the density's measure (68 characters a line in Academy, under 80).
 * Unverified lines carry the internal badge; pending rows carry "pending". An unknown id says so
 * and offers the outline. Internal: Customer View shows a plain notice instead.
 */
import { useNavigate, useParams } from 'react-router';
import { Button, Row, RowList } from '../../components/ui';
import { getItem, getItemsByType, useContent, type LoadableShard } from '../../core/content';
import { useCustomerView } from '../../core/customerView';
import { visibleLines, type LessonItem } from '../../schemas';
import { LinesList, RowsList, UnverifiedBadge } from '../search/contentViews';
import { ContentWait } from '../shared/ContentWait';
import { Markdown } from '../shared/Markdown';
import { RelatedList } from '../shared/RelatedList';
import { SourcesList } from '../shared/SourcesList';
import { Actions, Screen, Section, StatusLine } from '../settings/ui/Screen';
import { lessonNeighbours, PHASE_5_LINE, splitGoal } from './academyModel';
import './academy.css';

const BACK = { to: '/academy', label: 'Academy' };
/** The lessons (the page and its neighbours), and the catalog for the Related list. */
const LESSON_CONTENT: readonly LoadableShard[] = ['lesson', 'catalog'];

function Neighbours({ lesson }: { lesson: LessonItem }) {
  const navigate = useNavigate();
  const { prev, next } = lessonNeighbours(getItemsByType('lesson'), lesson.id);
  if (prev === null && next === null) return null;
  return (
    <Section title="Keep going" index={6}>
      <RowList label="Keep going">
        {next !== null ? (
          <Row as="li" title="Next lesson" detail={`Level ${next.level}, ${next.order}. ${next.title}`} trailing="Read" onClick={() => navigate(`/academy/${encodeURIComponent(next.id)}`)} />
        ) : null}
        {prev !== null ? (
          <Row as="li" title="Previous lesson" detail={`Level ${prev.level}, ${prev.order}. ${prev.title}`} trailing="Read" onClick={() => navigate(`/academy/${encodeURIComponent(prev.id)}`)} />
        ) : null}
      </RowList>
    </Section>
  );
}

function LessonBody({ lesson }: { lesson: LessonItem }) {
  const navigate = useNavigate();
  const { rest } = splitGoal(lesson.why);
  return (
    <>
      {lesson.status === 'verify' || lesson.outline ? (
        <Section index={1}>
          {lesson.status === 'verify' ? (
            <p className="ui-muted">
              <UnverifiedBadge show /> Check this lesson against the label before relying on it.
            </p>
          ) : null}
          {lesson.outline ? <StatusLine>An outline for now. The full lesson comes later.</StatusLine> : null}
        </Section>
      ) : null}
      {rest !== '' ? (
        <Section title="Why it matters" index={2} className="ac-why">
          <Markdown text={rest} headingOffset={1} />
        </Section>
      ) : null}
      {visibleLines(lesson.steps, lesson.status).length > 0 ? (
        <Section title="The steps" index={3} className="ac-part">
          <LinesList lines={lesson.steps} itemStatus={lesson.status} ordered label="The steps" />
        </Section>
      ) : null}
      {lesson.numbers.some((row) => row.status !== 'superseded') ? (
        <Section title="The numbers" index={4} className="ac-part">
          <RowsList rows={lesson.numbers} label="The numbers" itemStatus={lesson.status} />
        </Section>
      ) : null}
      {visibleLines(lesson.mistakes, lesson.status).length > 0 ? (
        <Section title="Common mistakes" index={5} className="ac-part">
          <LinesList lines={lesson.mistakes} itemStatus={lesson.status} label="Common mistakes" />
        </Section>
      ) : null}
      <Section index={5}>
        <p className="ac-phase">{PHASE_5_LINE}</p>
      </Section>
      <RelatedList ids={lesson.related} selfId={lesson.id} index={6} />
      <Neighbours lesson={lesson} />
      <SourcesList kbRef={lesson.kbRef} sources={lesson.sources} index={6} />
      <Section index={6}>
        <Actions>
          <Button size="shop" onClick={() => navigate('/academy')}>
            Back to the Academy
          </Button>
        </Actions>
      </Section>
    </>
  );
}

export function LessonPage() {
  const { lessonId = '' } = useParams();
  const navigate = useNavigate();
  const cv = useCustomerView();
  const content = useContent(LESSON_CONTENT, cv.ready);

  if (!cv.ready) return <ContentWait title="Lesson" back={BACK} />;
  if (!content.ready) return <ContentWait title="Lesson" back={BACK} content={content} />;
  const found = getItem(lessonId, { customerView: cv.on });
  const lesson = found?.type === 'lesson' ? found : undefined;
  if (lesson === undefined) {
    return (
      <Screen title="Lesson not found" back={BACK}>
        <StatusLine>There is no lesson here. It may have been renamed or left out of this build.</StatusLine>
        <Actions>
          <Button size="shop" onClick={() => navigate('/academy')}>
            All lessons
          </Button>
          <Button size="shop" onClick={() => navigate('/search')}>
            Search
          </Button>
        </Actions>
      </Screen>
    );
  }
  return (
    <Screen
      title={lesson.title}
      eyebrow={`Level ${lesson.level}, lesson ${lesson.order}`}
      back={BACK}
      lede={splitGoal(lesson.why).goal ?? undefined}
      className="ac-screen ac-lesson sh-reading"
    >
      <LessonBody lesson={lesson} />
    </Screen>
  );
}
