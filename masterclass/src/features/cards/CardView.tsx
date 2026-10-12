/**
 * /cards/:id: one Quick Card, read-aloud friendly (BLUEPRINT 2.3, 5). Each row is a label and a
 * value in big type. "Read aloud" uses the phone's own voice; the first tap unlocks it (iOS).
 * Verify rows carry the internal "unverified" badge, pending rows the "pending" badge. Related
 * items sit at the bottom, each opening its own page. Internal cards never render in Customer View.
 */
import { useNavigate, useParams } from 'react-router';
import { Button } from '../../components/ui';
import { getItem } from '../../core/content';
import { Internal, showUnverifiedBadge, useCustomerView } from '../../core/customerView';
import type { QuickCardItem } from '../../schemas';
import { RowsList, UnverifiedBadge } from '../search/contentViews';
import { ReadAloud } from '../shared/ReadAloud';
import { RelatedList } from '../shared/RelatedList';
import { Actions, Screen, Section, StatusLine } from '../settings/ui/Screen';
import { cardSpeechText, KIND_LABELS } from './cardModel';
import './cards.css';

const BACK = { to: '/cards', label: 'All Quick Cards' };

function CardBody({ card, customerView }: { card: QuickCardItem; customerView: boolean }) {
  return (
    <>
      <Section index={1}>
        {showUnverifiedBadge(card, customerView) ? (
          <p className="ui-muted">
            <UnverifiedBadge show /> Check this card against the label before relying on it.
          </p>
        ) : null}
        <ReadAloud text={() => cardSpeechText(card)} />
      </Section>
      <Section index={2} className="qc-card">
        <RowsList rows={card.rows} label={card.title} itemStatus={card.status} />
        {customerView ? null : (
          <Internal>
            <p className="ui-muted qc-source">
              {[card.kbRef ? `Knowledge base ${card.kbRef}` : null, ...card.sources.map((s) => `${s.label}, ${s.date}`)].filter(Boolean).join('. ')}
            </p>
          </Internal>
        )}
      </Section>
      <RelatedList ids={card.related} selfId={card.id} index={3} />
    </>
  );
}

export function CardView() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const cv = useCustomerView();

  if (!cv.ready) {
    return <Screen title="Quick Card" back={BACK} />;
  }

  const found = getItem(id, { customerView: cv.on });
  const card = found?.type === 'quickcard' ? found : undefined;
  if (card === undefined) {
    return (
      <Screen title="Card not found" back={BACK} internal={false}>
        <StatusLine>There is no Quick Card here. It may have been renamed or left out of this build.</StatusLine>
        <Actions>
          <Button onClick={() => navigate('/cards')}>See all Quick Cards</Button>
        </Actions>
      </Screen>
    );
  }

  const internalCard = card.visibility === 'internal';
  return (
    <Screen title={card.title} eyebrow={`Quick Card, ${KIND_LABELS[card.kind].toLowerCase()}`} back={BACK} internal={internalCard}>
      <CardBody card={card} customerView={cv.on} />
    </Screen>
  );
}
