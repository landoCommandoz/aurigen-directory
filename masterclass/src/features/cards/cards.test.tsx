import 'fake-indexeddb/auto';
import '@testing-library/jest-dom/vitest';
import { act, cleanup, fireEvent, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { turnCustomerViewOn } from '../../core/customerView';
import { startFresh } from '../../core/deviceRole';
import { __resetSpeechForTests } from '../../core/speech';
import type { QuickCardItem } from '../../schemas';
import { afterAllReset, currentPath, loadSeedBundle, renderScreen, resetAll } from '../settings/__tests__/harness';
import { relatedItems } from '../shared/RelatedList';
import { isPendingText } from '../shared/speechText';
import { cardSpeechText, groupCards, KIND_LABELS, speakable } from './cardModel';
import { CardsList } from './CardsList';
import { CardView } from './CardView';

const ROUTES = { '/cards': <CardsList />, '/cards/:id': <CardView />, '/items/:id': <p>Item page</p>, '/': <p>Home</p> };

let cards: QuickCardItem[] = [];

beforeEach(async () => {
  await resetAll();
  cards = loadSeedBundle().filter((item): item is QuickCardItem => item.type === 'quickcard');
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  __resetSpeechForTests();
  afterAllReset();
});

interface FakeUtterance {
  text: string;
  onstart?: () => void;
  onend?: () => void;
  onerror?: (event: { error: string }) => void;
}

function installVoice() {
  const spoken: string[] = [];
  class Utterance implements FakeUtterance {
    text: string;
    voice: unknown = null;
    lang = '';
    onstart?: () => void;
    onend?: () => void;
    constructor(text: string) {
      this.text = text;
    }
  }
  const synth = {
    speaking: false,
    pending: false,
    getVoices: () => [],
    speak: (u: FakeUtterance) => {
      spoken.push(u.text);
      u.onstart?.();
    },
    cancel: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  };
  vi.stubGlobal('SpeechSynthesisUtterance', Utterance);
  vi.stubGlobal('speechSynthesis', synth);
  __resetSpeechForTests();
  return spoken;
}

describe('card model', () => {
  it('groups by kind in a fixed order with no empty groups, titles sorted', () => {
    const groups = groupCards(cards);
    expect(groups.map((g) => g.kind)).toEqual(['stop', 'settings', 'mix', 'table', 'list'].filter((k) => cards.some((c) => c.kind === k)));
    expect(groups.flatMap((g) => g.cards)).toHaveLength(cards.length);
    for (const g of groups) expect(g.cards.map((c) => c.title)).toEqual(g.cards.map((c) => c.title).sort((a, b) => a.localeCompare(b)));
    expect(groupCards([])).toEqual([]);
  });

  it('spells out units for the voice and leaves other words alone', () => {
    expect(speakable('Reads 100 µm or more')).toBe('Reads 100 microns or more');
    expect(speakable('Tape a 2 x 2 ft square')).toBe('Tape a 2 by 2 feet square');
    expect(speakable('4 oz in 4 gal, under 10 lb, 70%')).toBe('4 ounces in 4 gallons, under 10 pounds, 70 percent');
    expect(speakable('Box of tax forms')).toBe('Box of tax forms');
  });

  it('reads the title then every row, marks unverified rows, and skips superseded ones', () => {
    const text = cardSpeechText({
      title: 'Test card',
      rows: [
        { label: 'Water', value: '4 gal' },
        { label: 'Old', value: 'gone', status: 'superseded' },
        { label: 'Pads', value: 'colors unconfirmed.', status: 'verify' },
      ],
    });
    expect(text).toBe('Test card. Water: 4 gallons. Unverified. Pads: colors unconfirmed.');
  });
});

describe('CardsList', () => {
  it('renders every seed card, grouped by kind, with the search box on top', async () => {
    renderScreen('/cards', ROUTES);
    expect(await screen.findByRole('heading', { name: 'Quick Cards', level: 1 })).toBeInTheDocument();
    // The list waits for the saved Customer View flag (fail closed), then renders.
    expect(await screen.findByLabelText('Search the cards and more')).toBeInTheDocument();
    expect(cards.length).toBeGreaterThan(0);
    for (const card of cards) expect(screen.getByText(card.title)).toBeInTheDocument();
    for (const group of groupCards(cards)) expect(screen.getByRole('heading', { name: KIND_LABELS[group.kind] })).toBeInTheDocument();
    // Internal cards sit inside the Internal wrapper.
    expect(document.querySelector('[data-internal]')).not.toBeNull();
  });

  it('opens a card on tap', async () => {
    renderScreen('/cards', ROUTES);
    fireEvent.click(await screen.findByText('Pad ladder for the test spot'));
    expect(currentPath()).toBe('/cards/card-pad-ladder');
    expect(await screen.findByRole('heading', { name: 'Pad ladder for the test spot' })).toBeInTheDocument();
  });

  it('in Customer View shows only customer-safe cards (none in the seed) and no search box', async () => {
    await startFresh({ warningAccepted: true, newPin: '482915' });
    await turnCustomerViewOn();
    renderScreen('/cards', ROUTES);
    expect(await screen.findByText('No cards to show here yet.')).toBeInTheDocument();
    for (const card of cards.filter((c) => c.visibility === 'internal')) expect(screen.queryByText(card.title)).toBeNull();
    expect(screen.queryByLabelText('Search the cards and more')).toBeNull();
    expect(document.querySelector('[data-internal]')).toBeNull();
    expect(document.body.textContent).not.toMatch(/unverified/);
  });
});

describe('CardView', () => {
  it('shows each row, and the unverified badge only on the verify rows', async () => {
    const card = cards.find((c) => c.id === 'card-pad-ladder');
    if (card === undefined) throw new Error('the seed has no card-pad-ladder');
    renderScreen('/cards/card-pad-ladder', ROUTES);
    expect(await screen.findByRole('heading', { name: card.title })).toBeInTheDocument();
    expect(screen.getByText('Rung 1')).toBeInTheDocument();
    expect(screen.getByText(/Yellow \+ M210. Wipe, IPA, light./)).toBeInTheDocument();

    // The card's own rows: the list labelled with the card title. Expected badges come from the
    // card data, so a content edit to another item cannot break this test (DEF-18).
    const rows = screen.getByLabelText(card.title);
    expect(rows.tagName).toBe('DL');
    const shown = card.rows.filter((row) => row.status !== 'superseded');
    const expected = shown
      .filter((row) => (row.status ?? card.status) === 'verify' && card.status !== 'verify' && !isPendingText(`${row.label} ${row.value}`))
      .map((row) => row.label);
    const badged = within(rows)
      .queryAllByText('unverified')
      .map((badge) => badge.closest('dt')?.firstChild?.textContent ?? '');
    expect(badged).toEqual(expected);
    expect(badged).toContain('HF finishing pads');
    expect(within(rows).getAllByRole('term')).toHaveLength(shown.length);

    // The Related list badges each related item that is itself verify, and nothing else.
    const related = screen.getByRole('list', { name: 'Related' });
    const verifyRelated = relatedItems(card.related, card.id, false).filter((item) => item.status === 'verify');
    expect(within(related).queryAllByText('unverified')).toHaveLength(verifyRelated.length);
    for (const item of verifyRelated) {
      expect(within(related).getByText(item.title).closest('li')?.textContent).toMatch(/unverified/);
    }
  });

  it('reads the card aloud from the tap, then offers Pause, Repeat, and Stop reading', async () => {
    const spoken = installVoice();
    renderScreen('/cards/card-pad-ladder', ROUTES);
    await act(async () => {
      fireEvent.click(await screen.findByRole('button', { name: 'Read aloud' }));
    });
    expect(spoken[0]).toBe('Pad ladder for the test spot.');
    expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Repeat' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Stop reading' }));
    expect(await screen.findByRole('button', { name: 'Read aloud' })).toBeInTheDocument();
  });

  it('says so plainly when the phone has no voice', async () => {
    vi.stubGlobal('speechSynthesis', undefined);
    __resetSpeechForTests();
    renderScreen('/cards/card-pad-ladder', ROUTES);
    expect(await screen.findByText(/no built-in voice/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Read aloud' })).toBeDisabled();
  });

  it('opens a related card on its page and a related tool on its item page', async () => {
    renderScreen('/cards/card-pad-ladder', ROUTES);
    const related = await screen.findByRole('list', { name: 'Related' });
    fireEvent.click(within(related).getByText('Paint thickness bands'));
    expect(currentPath()).toBe('/cards/card-thickness-bands');
    const again = await screen.findByRole('list', { name: 'Related' });
    const tool = within(again).getAllByText('Tool')[0];
    if (tool === undefined) throw new Error('no related tool');
    fireEvent.click(tool);
    expect(currentPath()).toMatch(/^\/items\/equipment-/);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('an unknown card id says so and offers the way back', async () => {
    renderScreen('/cards/card-nope', ROUTES);
    expect(await screen.findByRole('heading', { name: 'Card not found' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'See all Quick Cards' }));
    expect(currentPath()).toBe('/cards');
  });
});
