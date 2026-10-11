/**
 * /cards: the Quick Cards (BLUEPRINT 2.3). The search box at the top, then every card grouped by
 * kind. Internal cards sit inside <Internal>, so Customer View lists only customer-safe ones.
 */
import { useNavigate } from 'react-router';
import { Row, RowList } from '../../components/ui';
import { contentStatus, getItemsByType } from '../../core/content';
import { Internal, useCustomerView } from '../../core/customerView';
import type { QuickCardItem } from '../../schemas';
import { UnverifiedBadge } from '../search/contentViews';
import { SearchBox } from '../search/SearchBox';
import { Screen, Section, StatusLine } from '../settings/ui/Screen';
import { groupCards } from './cardModel';
import './cards.css';

function CardGroups({ cards, customerView }: { cards: readonly QuickCardItem[]; customerView: boolean }) {
  const navigate = useNavigate();
  return (
    <>
      {groupCards(cards).map((group, index) => (
        <Section key={group.kind} title={group.label} index={index + 2}>
          <RowList label={group.label}>
            {group.cards.map((card) => (
              <Row
                key={card.id}
                as="li"
                title={
                  <>
                    {card.title}
                    {customerView ? null : <UnverifiedBadge show={card.status === 'verify'} />}
                  </>
                }
                detail={customerView ? undefined : card.tags.slice(0, 4).join(', ')}
                trailing="Open"
                onClick={() => navigate(`/cards/${encodeURIComponent(card.id)}`)}
              />
            ))}
          </RowList>
        </Section>
      ))}
    </>
  );
}

export function CardsList() {
  const cv = useCustomerView();
  const status = contentStatus();
  const all = getItemsByType('quickcard');
  const safe = getItemsByType('quickcard', { customerView: true });

  let body;
  if (!cv.ready) {
    body = <StatusLine>Loading</StatusLine>;
  } else if (cv.on) {
    body = safe.length > 0 ? <CardGroups cards={safe} customerView /> : <StatusLine>No cards to show here yet.</StatusLine>;
  } else {
    body = (
      <Internal>
        <Section index={1}>
          <SearchBox label="Search the cards and more" />
        </Section>
        {!status.built ? <StatusLine tone="warning">{status.problem ?? 'The content is missing from this build.'}</StatusLine> : null}
        {all.length === 0 && status.built ? <StatusLine>No Quick Cards in this build yet.</StatusLine> : null}
        <CardGroups cards={all} customerView={false} />
      </Internal>
    );
  }

  return (
    <Screen title="Quick Cards" back={{ to: '/', label: 'Home' }} internal={false} lede={cv.ready && !cv.on ? 'Mixes, settings, and rules, one tap from the cart.' : undefined}>
      {body}
    </Screen>
  );
}
