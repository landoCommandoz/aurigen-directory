/**
 * /academy: the Masterclass outline (Phase 2). Levels 0 to 8 with plain names, each listing its
 * real lessons from the content bundle in order, each lesson one tap to its page. A level with no
 * lessons in this build says so. The procedures are one tap away. Drills, quizzes, and sign-off
 * arrive in Phase 5, and the page says so once. Internal: Customer View shows a plain notice.
 */
import { useNavigate } from 'react-router';
import { Button, Row, RowList } from '../../components/ui';
import { contentStatus, getItemsByType } from '../../core/content';
import { UnverifiedBadge } from '../search/contentViews';
import { Actions, Screen, Section, StatusLine } from '../settings/ui/Screen';
import { LEVELS, lessonsOfLevel, PHASE_5_LINE, splitGoal } from './academyModel';
import './academy.css';

export function AcademyOutline() {
  const navigate = useNavigate();
  const lessons = getItemsByType('lesson');
  const sops = getItemsByType('sop');
  const status = contentStatus();

  return (
    <Screen
      title="Academy"
      eyebrow="Masterclass 101"
      back={{ to: '/', label: 'Home' }}
      lede={`Read the lessons in order, one level at a time. ${PHASE_5_LINE}`}
      className="ac-screen"
    >
      {!status.built ? <StatusLine tone="warning">{status.problem ?? 'The content is missing from this build.'}</StatusLine> : null}

      {LEVELS.map((info, index) => {
        const inLevel = lessonsOfLevel(lessons, info.level);
        return (
          <Section key={info.level} title={info.title} intro={info.topics} index={index + 1}>
            {inLevel.length === 0 ? (
              <p className="ui-muted">No lessons in this build yet.</p>
            ) : (
              <RowList label={info.title}>
                {inLevel.map((lesson) => (
                  <Row
                    key={lesson.id}
                    as="li"
                    title={
                      <>
                        {`${lesson.order}. ${lesson.title}`}
                        <UnverifiedBadge show={lesson.status === 'verify'} />
                      </>
                    }
                    detail={lesson.outline ? 'Outline' : (splitGoal(lesson.why).goal ?? undefined)}
                    trailing="Read"
                    onClick={() => navigate(`/academy/${encodeURIComponent(lesson.id)}`)}
                  />
                ))}
              </RowList>
            )}
          </Section>
        );
      })}

      <Section title="Procedures" index={LEVELS.length + 1} intro="Every stage of a job, step by step, for any car, a Tesla, or a bike.">
        <RowList label="Procedures">
          <Row
            as="li"
            title="All procedures"
            detail={sops.length === 0 ? 'None in this build yet.' : `${sops.length} ${sops.length === 1 ? 'procedure' : 'procedures'}`}
            trailing="Open"
            onClick={() => navigate('/sops')}
          />
        </RowList>
      </Section>

      <Section index={LEVELS.length + 2}>
        <Actions>
          <Button size="shop" onClick={() => navigate('/cards')}>
            Quick cards
          </Button>
          <Button size="shop" onClick={() => navigate('/search')}>
            Search
          </Button>
        </Actions>
      </Section>
    </Screen>
  );
}
