/**
 * /cards/:id: one Quick Card, read-aloud friendly (BLUEPRINT 2.3, 5). Each row is a label and a
 * value in big type. "Read aloud" uses the phone's own voice; the first tap unlocks it (iOS).
 * Verify rows carry the internal "unverified" badge. Related items sit at the bottom: cards open
 * their page, anything else opens in a sheet. Internal cards never render in Customer View.
 */
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button, Row, RowList } from '../../components/ui';
import { getItem } from '../../core/content';
import { Internal, showUnverifiedBadge, useCustomerView } from '../../core/customerView';
import { pause, repeat, resume, speak, stop, useSpeechStatus } from '../../core/speech';
import type { ContentItemValue, QuickCardItem } from '../../schemas';
import { RowsList, UnverifiedBadge } from '../search/contentViews';
import { useItemOpener } from '../search/ItemSheet';
import { TYPE_SINGULAR } from '../search/searchModel';
import { Actions, Screen, Section, StatusLine } from '../settings/ui/Screen';
import { cardSpeechText, KIND_LABELS } from './cardModel';
import './cards.css';

const BACK = { to: '/cards', label: 'All Quick Cards' };

function ReadAloud({ card }: { card: QuickCardItem }) {
  const speech = useSpeechStatus();
  const [note, setNote] = useState<string | null>(null);
  const [mine, setMine] = useState(false);
  const mineRef = useRef(false);

  // Leaving the card stops what it started, so the voice never reads a card that is not on screen.
  useEffect(
    () => () => {
      if (mineRef.current) stop();
    },
    [],
  );

  function claim(on: boolean) {
    mineRef.current = on;
    setMine(on);
  }

  function read() {
    const result = speak(cardSpeechText(card));
    claim(result.ok);
    setNote(result.ok ? null : result.message);
  }

  const active = mine && (speech.speaking || speech.paused);
  return (
    <div className="qc-voice">
      <Actions>
        {!active ? (
          <Button variant="primary" size="shop" onClick={read} disabled={!speech.supported}>
            Read aloud
          </Button>
        ) : speech.paused ? (
          <Button variant="primary" size="shop" onClick={() => resume()}>
            Resume
          </Button>
        ) : (
          <Button variant="primary" size="shop" onClick={() => pause()}>
            Pause
          </Button>
        )}
        {active ? (
          <>
            <Button size="shop" onClick={() => repeat()}>
              Repeat
            </Button>
            <Button
              size="shop"
              onClick={() => {
                stop();
                claim(false);
              }}
            >
              Stop reading
            </Button>
          </>
        ) : null}
      </Actions>
      {!speech.supported ? <p className="ui-muted">This phone has no built-in voice for web apps. The card still reads on screen.</p> : null}
      {note !== null ? <StatusLine tone="warning">{note}</StatusLine> : null}
      {speech.lastError !== null && active ? <p className="ui-muted">{speech.lastError}</p> : null}
    </div>
  );
}

function Related({ item, customerView }: { item: QuickCardItem; customerView: boolean }) {
  const opener = useItemOpener();
  const related = item.related
    .map((id) => getItem(id, { customerView }))
    .filter((r): r is ContentItemValue => r !== undefined && r.id !== item.id);
  if (related.length === 0) return null;
  return (
    <Section title="Related" index={3}>
      <RowList label="Related">
        {related.map((r) => (
          <Row key={r.id} as="li" title={r.title} detail={TYPE_SINGULAR[r.type]} trailing="Open" onClick={() => opener.open(r)} />
        ))}
      </RowList>
      {opener.sheet}
    </Section>
  );
}

function CardBody({ card, customerView }: { card: QuickCardItem; customerView: boolean }) {
  return (
    <>
      <Section index={1}>
        {showUnverifiedBadge(card, customerView) ? (
          <p className="ui-muted">
            <UnverifiedBadge show /> Check this card against the label before relying on it.
          </p>
        ) : null}
        <ReadAloud card={card} />
      </Section>
      <Section index={2} className="qc-card">
        <RowsList rows={card.rows} label={card.title} />
        {customerView ? null : (
          <Internal>
            <p className="ui-muted qc-source">
              {[card.kbRef ? `Knowledge base ${card.kbRef}` : null, ...card.sources.map((s) => `${s.label}, ${s.date}`)].filter(Boolean).join('. ')}
            </p>
          </Internal>
        )}
      </Section>
      <Related item={card} customerView={customerView} />
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
