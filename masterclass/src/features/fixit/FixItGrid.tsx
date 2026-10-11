/**
 * /fixit: the Fix It entry (BLUEPRINT 2.2, wireframe 6.1). The symptom tiles are Phase 2 content.
 * Until they land, the screen still does the real job: the search box at the top (typed or said),
 * and every Quick Card as a big tile. When Fix It entries exist in the bundle, they show as tiles
 * grouped by symptom group and open in a sheet. Home is always in reach. Internal: in Customer
 * View the screen shows a plain notice instead.
 */
import { useNavigate } from 'react-router';
import { Button, Tile, TileGrid } from '../../components/ui';
import { getItemsByType } from '../../core/content';
import { FIX_GROUPS, type FixNodeItem } from '../../schemas';
import { KIND_LABELS, groupCards } from '../cards/cardModel';
import { useItemOpener } from '../search/ItemSheet';
import { SearchBox } from '../search/SearchBox';
import { Actions, Screen, Section } from '../settings/ui/Screen';
import './fixit.css';

export const PHASE_2_LINE = 'Fix It symptom tiles arrive in Phase 2. Until then, search or open a Quick Card.';

const GROUP_LABELS: Record<FixNodeItem['group'], string> = {
  machine: 'Machine',
  paint: 'Paint',
  'wash-dry': 'Wash and dry',
  clay: 'Clay',
  protect: 'Protect',
  glass: 'Glass',
  interior: 'Interior',
  gauge: 'Gauge',
  'setup-time': 'Setup and time',
  customer: 'Customer',
  bike: 'Bike',
  tesla: 'Tesla',
};

export function FixItGrid() {
  const navigate = useNavigate();
  const opener = useItemOpener();
  const fixes = getItemsByType('fixnode');
  const cards = groupCards(getItemsByType('quickcard')).flatMap((group) => group.cards);

  return (
    <Screen title="Fix It" back={{ to: '/', label: 'Home' }} className="fx-screen">
      <Section index={1}>
        <SearchBox label="What is happening?" />
      </Section>

      {fixes.length === 0 ? (
        <Section index={2}>
          <p className="fx-phase">{PHASE_2_LINE}</p>
        </Section>
      ) : (
        FIX_GROUPS.map((group, index) => {
          const inGroup = fixes.filter((fix) => fix.group === group);
          if (inGroup.length === 0) return null;
          return (
            <Section key={group} title={GROUP_LABELS[group]} index={index + 2}>
              <TileGrid label={GROUP_LABELS[group]}>
                {inGroup.map((fix) => (
                  <Tile key={fix.id} label={fix.title} onClick={() => opener.open(fix)} />
                ))}
              </TileGrid>
            </Section>
          );
        })
      )}

      <Section title="Quick Cards" index={3}>
        {cards.length === 0 ? (
          <p className="ui-muted">No Quick Cards in this build yet.</p>
        ) : (
          <TileGrid label="Quick Cards">
            {cards.map((card) => (
              <Tile key={card.id} label={card.title} detail={KIND_LABELS[card.kind]} onClick={() => navigate(`/cards/${encodeURIComponent(card.id)}`)} />
            ))}
          </TileGrid>
        )}
      </Section>

      <Section index={4}>
        <Actions>
          <Button size="shop" onClick={() => navigate('/')}>
            Home
          </Button>
          <Button size="shop" onClick={() => navigate('/cards')}>
            All Quick Cards
          </Button>
        </Actions>
      </Section>
      {opener.sheet}
    </Screen>
  );
}
