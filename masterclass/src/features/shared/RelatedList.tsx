/**
 * "Related": the items a page points to, each one tap from here, in a fixed order (the lesson
 * first, then cards, procedures, other fixes, products, tools, words). Every row opens a real page
 * (contentRoutes.ts). Ids that name nothing in this build, or a type with no page yet, are left
 * out, so no row is a dead end. With nothing to show, nothing renders.
 * Each row needs only a title, a type, and a status, so the list reads the content catalog (one
 * small shard) instead of loading every type it names (QA DEF-17). Customer View sees only lines
 * the catalog marks customer-safe, decided by the same rule as customerSafe() on the whole item.
 */
import { useNavigate } from 'react-router';
import { Row, RowList } from '../../components/ui';
import { getCatalogEntry, useContent, type CatalogEntry, type LoadableShard } from '../../core/content';
import { useCustomerView } from '../../core/customerView';
import { UnverifiedBadge } from '../search/contentViews';
import { TYPE_SINGULAR } from '../search/searchModel';
import { Section } from '../settings/ui/Screen';
import { pageRoute, RELATED_TYPE_ORDER, uniqueIds } from './contentRoutes';

const RELATED_CONTENT: readonly LoadableShard[] = ['catalog'];

/** The related items that can open: found, not the page itself, with a page, in RELATED_TYPE_ORDER. */
export function relatedItems(ids: ReadonlyArray<string | undefined>, selfId: string, customerView: boolean): CatalogEntry[] {
  const found = uniqueIds(ids, selfId)
    .map((id) => getCatalogEntry(id, { customerView }))
    .filter((item): item is CatalogEntry => item !== undefined && pageRoute(item) !== null);
  const rank = (item: CatalogEntry) => {
    const at = RELATED_TYPE_ORDER.indexOf(item.type);
    return at < 0 ? RELATED_TYPE_ORDER.length : at;
  };
  // A stable sort keeps the writer's order inside each type.
  return found.map((item, index) => ({ item, index })).sort((a, b) => rank(a.item) - rank(b.item) || a.index - b.index).map((x) => x.item);
}

export interface RelatedListProps {
  ids: ReadonlyArray<string | undefined>;
  selfId: string;
  /** Position in the load moment. */
  index?: number;
  title?: string;
}

export function RelatedList({ ids, selfId, index = 6, title = 'Related' }: RelatedListProps) {
  const navigate = useNavigate();
  const cv = useCustomerView();
  // Pages load the catalog with their own content; this keeps the list right on any page that does not.
  const content = useContent(RELATED_CONTENT, cv.ready);
  const items = content.ready ? relatedItems(ids, selfId, cv.on || !cv.ready) : [];
  if (items.length === 0) return null;
  return (
    <Section title={title} index={index}>
      <RowList label={title}>
        {items.map((item) => (
          <Row
            key={item.id}
            as="li"
            title={
              <>
                {item.title}
                <UnverifiedBadge show={item.status === 'verify'} />
              </>
            }
            detail={TYPE_SINGULAR[item.type]}
            trailing="Open"
            onClick={() => {
              const route = pageRoute(item);
              if (route !== null) navigate(route);
            }}
          />
        ))}
      </RowList>
    </Section>
  );
}
