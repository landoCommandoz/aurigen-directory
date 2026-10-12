/**
 * "Related": the items a page points to, each one tap from here, in a fixed order (the lesson
 * first, then cards, procedures, other fixes, products, tools, words). Every row opens a real page
 * (contentRoutes.ts). Ids that name nothing in this build, or a type with no page yet, are left
 * out, so no row is a dead end. With nothing to show, nothing renders.
 */
import { useNavigate } from 'react-router';
import { Row, RowList } from '../../components/ui';
import { getItem } from '../../core/content';
import { useCustomerView } from '../../core/customerView';
import type { ContentItemValue } from '../../schemas';
import { UnverifiedBadge } from '../search/contentViews';
import { TYPE_SINGULAR } from '../search/searchModel';
import { Section } from '../settings/ui/Screen';
import { pageRoute, RELATED_TYPE_ORDER, uniqueIds } from './contentRoutes';

/** The related items that can open: found, not the page itself, with a page, in RELATED_TYPE_ORDER. */
export function relatedItems(ids: ReadonlyArray<string | undefined>, selfId: string, customerView: boolean): ContentItemValue[] {
  const found = uniqueIds(ids, selfId)
    .map((id) => getItem(id, { customerView }))
    .filter((item): item is ContentItemValue => item !== undefined && pageRoute(item) !== null);
  const rank = (item: ContentItemValue) => {
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
  const items = relatedItems(ids, selfId, cv.on || !cv.ready);
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
