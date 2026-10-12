/**
 * Opens a content item. From Phase 2 every type search returns has its own page
 * (shared/contentRoutes.ts), so open() navigates there. The bottom sheet is the fallback for a type
 * with no page yet (drills, quizzes, flashcards, prices, policies, scripts: Phase 4 and 5), so a
 * stray id still shows its title and a way out instead of nothing.
 *
 *   const opener = useItemOpener();
 *   opener.open(hit);           // a page navigates; a type with no page opens the sheet
 *   return <>{...}{opener.sheet}</>;
 */
import { useCallback, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { Button, Drawer } from '../../components/ui';
import { getItem } from '../../core/content';
import { useCustomerView } from '../../core/customerView';
import type { ContentTypeName } from '../../schemas';
import { ItemDetail } from './ItemDetail';
import { hitRoute, TYPE_SINGULAR } from './searchModel';

export function ItemSheet({ id, onClose }: { id: string | null; onClose: () => void }) {
  const navigate = useNavigate();
  const cv = useCustomerView();
  const item = id === null ? undefined : getItem(id, { customerView: cv.on || !cv.ready });
  const route = item === undefined ? null : hitRoute(item);
  return (
    <Drawer
      open={id !== null}
      onClose={onClose}
      title={item?.title ?? 'Not found'}
      eyebrow={item === undefined ? undefined : TYPE_SINGULAR[item.type]}
      footer={
        route !== null ? (
          <Button
            block
            onClick={() => {
              onClose();
              navigate(route);
            }}
          >
            Open its page
          </Button>
        ) : undefined
      }
    >
      {item === undefined ? <p>This item is not in the content on this phone.</p> : <ItemDetail item={item} />}
    </Drawer>
  );
}

export interface ItemOpener {
  open: (target: { id: string; type: ContentTypeName }) => void;
  sheet: ReactNode;
}

export function useItemOpener(): ItemOpener {
  const navigate = useNavigate();
  const [sheetId, setSheetId] = useState<string | null>(null);
  const open = useCallback(
    (target: { id: string; type: ContentTypeName }) => {
      const route = hitRoute(target);
      if (route !== null) navigate(route);
      else setSheetId(target.id);
    },
    [navigate],
  );
  return { open, sheet: <ItemSheet id={sheetId} onClose={() => setSheetId(null)} /> };
}
