/**
 * /items/:id: the page for a product, a tool, or a glossary term (Phase 2). Read-only: what it is,
 * its rows with their badges, related items one tap away, and where it comes from. An id that
 * belongs to a type with its own page (a fix, a card, a lesson, a procedure) is sent there, so an
 * old or hand-typed address still lands on the right page. An unknown id says so and offers Search
 * and Home. Internal: in Customer View the screen shows a plain notice instead.
 */
import { Navigate, useNavigate, useParams } from 'react-router';
import { Button } from '../../components/ui';
import { getItem, useContent, type LoadableShard } from '../../core/content';
import { typeOfId } from '../../core/contentShards';
import { useCustomerView } from '../../core/customerView';
import { pageRoute, PAGE_BASE } from '../shared/contentRoutes';
import { ContentWait } from '../shared/ContentWait';
import { RelatedList } from '../shared/RelatedList';
import { SourcesList } from '../shared/SourcesList';
import { Actions, Screen, Section, StatusLine } from '../settings/ui/Screen';
import { ItemDetail } from './ItemDetail';
import { TYPE_SINGULAR } from './searchModel';
import '../shared/shared.css';
import './search.css';

const BACK = { to: '/search', label: 'Search' };

function Missing() {
  const navigate = useNavigate();
  return (
    <Screen title="Not found" back={BACK}>
      <StatusLine>There is nothing here. It may have been renamed or left out of this build.</StatusLine>
      <Actions>
        <Button size="shop" onClick={() => navigate('/search')}>
          Search
        </Button>
        <Button size="shop" onClick={() => navigate('/')}>
          Home
        </Button>
      </Actions>
    </Screen>
  );
}

export function ItemPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const cv = useCustomerView();
  // The id names its type (every id starts with its type's prefix), so only that shard loads,
  // plus the catalog for the Related list. An id with no known prefix is simply not found.
  const type = typeOfId(id);
  const needs: readonly LoadableShard[] = type === undefined ? [] : [type, 'catalog'];
  const content = useContent(needs, cv.ready);

  if (!cv.ready) return <ContentWait title="Opening" back={BACK} />;
  if (!content.ready) return <ContentWait title="Opening" back={BACK} content={content} />;
  const item = getItem(id, { customerView: cv.on });
  if (item === undefined) return <Missing />;

  // A fix, a card, a lesson, or a procedure has its own page.
  const own = pageRoute(item);
  if (own !== null && PAGE_BASE[item.type] !== '/items') {
    // The frame stays on screen for the one render before the move, so no frame is ever blank.
    return (
      <>
        <Navigate to={own} replace />
        <Screen title={item.title} back={BACK}>
          <StatusLine>Opening</StatusLine>
        </Screen>
      </>
    );
  }

  return (
    <Screen title={item.title} eyebrow={TYPE_SINGULAR[item.type]} back={BACK} className="sh-reading">
      <Section index={1}>
        <ItemDetail item={item} />
      </Section>
      <RelatedList ids={item.related} selfId={item.id} index={2} />
      <SourcesList kbRef={item.kbRef} sources={item.sources} index={3} />
      <Section index={4}>
        <Actions>
          <Button size="shop" onClick={() => navigate('/search')}>
            Back to Search
          </Button>
          <Button size="shop" onClick={() => navigate('/')}>
            Home
          </Button>
        </Actions>
      </Section>
    </Screen>
  );
}
