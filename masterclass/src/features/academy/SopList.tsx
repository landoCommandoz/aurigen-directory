/**
 * /sops: every procedure, by stage in the house stage list, any car first, then Tesla, then bike.
 * Read-only until the Job Runner runs them (Phase 3). Each row opens its page. With none in the
 * build, it says so and keeps the way back. Internal: Customer View shows a plain notice.
 */
import { useNavigate } from 'react-router';
import { Button, Row, RowList } from '../../components/ui';
import { getItemsByType, useContent, type LoadableShard } from '../../core/content';
import { useCustomerView } from '../../core/customerView';
import { UnverifiedBadge } from '../search/contentViews';
import { contentBusy, ContentWaitBody } from '../shared/ContentWait';
import { Actions, Screen, Section, StatusLine } from '../settings/ui/Screen';
import { BRANCH_LABELS, sopsByStage } from './academyModel';
import './academy.css';

const SOP_LIST_CONTENT: readonly LoadableShard[] = ['sop'];

export function SopList() {
  const navigate = useNavigate();
  const cv = useCustomerView();
  const content = useContent(SOP_LIST_CONTENT, cv.ready);
  const groups = content.ready ? sopsByStage(getItemsByType('sop')) : [];
  return (
    <Screen
      title="Procedures"
      eyebrow="Academy"
      back={{ to: '/academy', label: 'Academy' }}
      busy={contentBusy(content)}
      lede="Every stage of a job, step by step. The Job Runner runs them with timers in Phase 3."
    >
      {!content.ready ? <ContentWaitBody content={content} /> : null}
      {content.ready && groups.length === 0 ? <StatusLine>No procedures in this build yet.</StatusLine> : null}
      {groups.map((group, index) => (
        <Section key={group.stage} title={group.label} index={index + 1}>
          <RowList label={group.label}>
            {group.sops.map((sop) => (
              <Row
                key={sop.id}
                as="li"
                title={
                  <>
                    {sop.title}
                    <UnverifiedBadge show={sop.status === 'verify'} />
                  </>
                }
                detail={[BRANCH_LABELS[sop.vehicleBranch], sop.plannedMinutes !== undefined ? `planned ${sop.plannedMinutes} min` : null].filter(Boolean).join(', ')}
                trailing="Open"
                onClick={() => navigate(`/sops/${encodeURIComponent(sop.id)}`)}
              />
            ))}
          </RowList>
        </Section>
      ))}
      <Section index={groups.length + 1}>
        <Actions>
          <Button size="shop" onClick={() => navigate('/academy')}>
            Back to the Academy
          </Button>
        </Actions>
      </Section>
    </Screen>
  );
}
