/**
 * /fixit: the symptom grid (BLUEPRINT 2.2, wireframe 6.1). Fix It in the bottom row, then a tile,
 * is two taps to a fix; one word in the box at the top, then Enter, is the other way in.
 *
 *   search box (typed or said; results Fix It first)
 *   one section per Fix It group, in FIX_GROUPS order, with plain names:
 *     a big tile per symptom (group glyph plus the symptom words, 96 px tall, 64 px minimum in Shop)
 *     the STOP symptom as the one full-width red band
 *   the Quick Cards as tiles
 *   Home and All Quick Cards
 *
 * With zero Fix It entries in the bundle the screen still does the real job: search and the cards.
 * Internal: in Customer View the screen shows a plain notice instead (Screen, InternalNotice).
 */
import { useNavigate } from 'react-router';
import { Button, StopBand, Tile, TileGrid } from '../../components/ui';
import { getItemsByType } from '../../core/content';
import { KIND_LABELS, groupCards } from '../cards/cardModel';
import { SearchBox } from '../search/SearchBox';
import { pageRoute } from '../shared/contentRoutes';
import { Actions, Screen, Section } from '../settings/ui/Screen';
import { groupFixes, stopBandText } from './fixModel';
import { GroupGlyph } from './glyphs';
import './fixit.css';

export const EMPTY_FIXES_LINE = 'No Fix It entries in this build yet. Search, or open a Quick Card.';

export function FixItGrid() {
  const navigate = useNavigate();
  const groups = groupFixes(getItemsByType('fixnode'));
  const cards = groupCards(getItemsByType('quickcard')).flatMap((group) => group.cards);
  const open = (target: { id: string; type: 'fixnode' }) => {
    const route = pageRoute(target);
    if (route !== null) navigate(route);
  };

  return (
    <Screen title="Fix It" back={{ to: '/', label: 'Home' }} className="fx-screen">
      <Section index={1}>
        <SearchBox label="What is happening?" />
      </Section>

      {groups.length === 0 ? (
        <Section index={2}>
          <p className="fx-empty">{EMPTY_FIXES_LINE}</p>
        </Section>
      ) : (
        groups.map((group, index) => (
          <Section key={group.group} title={group.label} index={index + 2} className="fx-group">
            {group.tiles.length > 0 ? (
              <TileGrid label={group.label}>
                {group.tiles.map((fix) => (
                  <Tile
                    key={fix.id}
                    icon={<GroupGlyph group={group.group} />}
                    label={fix.title}
                    detail={fix.status === 'verify' ? 'Unverified' : undefined}
                    onClick={() => open(fix)}
                  />
                ))}
              </TileGrid>
            ) : null}
            {group.stops.map((fix) => (
              <StopBand key={fix.id} onClick={() => open(fix)}>
                {stopBandText(fix.title)}
              </StopBand>
            ))}
          </Section>
        ))
      )}

      <Section title="Quick Cards" index={groups.length + 2}>
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

      <Section index={groups.length + 3}>
        <Actions>
          <Button size="shop" onClick={() => navigate('/')}>
            Home
          </Button>
          <Button size="shop" onClick={() => navigate('/cards')}>
            All Quick Cards
          </Button>
        </Actions>
      </Section>
    </Screen>
  );
}
