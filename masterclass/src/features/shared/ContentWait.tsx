/**
 * What a content page shows while the content it draws is loading (QA DEF-17), or when it did not
 * load: never a blank page, never a dead end. Loading is one plain line; a failure says why, with
 * Try again and Home. The shards come from the offline copy, so on a phone this is a blink.
 *
 *   const content = useContent(['fixnode', 'catalog'], cv.ready);
 *   if (!cv.ready || !content.ready) return <ContentWait title="Fix It" back={BACK} content={content} />;
 */
import { useNavigate } from 'react-router';
import { Button } from '../../components/ui';
import type { ContentReadiness } from '../../core/content';
import { Actions, Screen, StatusLine } from '../settings/ui/Screen';

export const OPENING_LINE = 'Opening';

/** The body alone, for a screen that keeps other blocks (a search box) on screen meanwhile. */
export function ContentWaitBody({ content }: { content: Pick<ContentReadiness, 'problem' | 'retry'> }) {
  const navigate = useNavigate();
  if (content.problem === null) return <StatusLine>{OPENING_LINE}</StatusLine>;
  return (
    <>
      <StatusLine tone="warning">{content.problem}</StatusLine>
      <Actions>
        <Button size="shop" onClick={content.retry}>
          Try again
        </Button>
        <Button size="shop" onClick={() => navigate('/')}>
          Home
        </Button>
      </Actions>
    </>
  );
}

export interface ContentWaitProps {
  title: string;
  back: { to: string; label: string };
  /** Undefined while only the Customer View flag is loading: the frame alone, as before. */
  content?: Pick<ContentReadiness, 'problem' | 'retry'>;
  internal?: boolean;
}

/** True while a screen is still waiting: no answer yet, or no failure yet. A failure is a final state. */
export function contentBusy(content: Pick<ContentReadiness, 'problem'> & { ready?: boolean } | undefined): boolean {
  return content === undefined || (content.ready !== true && content.problem === null);
}

export function ContentWait({ title, back, content, internal }: ContentWaitProps) {
  return (
    <Screen title={title} back={back} internal={internal} busy={contentBusy(content)}>
      {content === undefined ? null : <ContentWaitBody content={content} />}
    </Screen>
  );
}
