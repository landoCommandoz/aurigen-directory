import 'fake-indexeddb/auto';
import '@testing-library/jest-dom/vitest';
import { act, cleanup, fireEvent, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { turnCustomerViewOn } from '../../core/customerView';
import { startFresh } from '../../core/deviceRole';
import { __resetSpeechForTests } from '../../core/speech';
import type { ContentItemValue, FixNodeItem } from '../../schemas';
import { afterAllReset, currentPath, renderScreen, resetAll } from '../settings/__tests__/harness';
import { CUSTOMER_VIEW_NOTICE } from '../settings/ui/InternalNotice';
import { FIX_JERK, FIX_TESLA, LESSON_PRESSURE, PRODUCT } from '../shared/__tests__/fixture';
import { installVoice, loadFixtureBundle } from '../shared/__tests__/helpers';
import { FixPage } from './FixPage';
import { fixRelatedIds, fixSpeechText } from './fixModel';

const ROUTES = {
  '/fixit': <p>All symptoms</p>,
  '/fixit/:id': <FixPage />,
  '/items/:id': <p>Item page</p>,
  '/academy/:lessonId': <p>Lesson page</p>,
  '/search': <p>Search</p>,
};

let items: ContentItemValue[] = [];
let jerk: FixNodeItem;

beforeEach(async () => {
  await resetAll();
  items = loadFixtureBundle();
  const found = items.find((i): i is FixNodeItem => i.id === FIX_JERK && i.type === 'fixnode');
  if (found === undefined) throw new Error('fixture has no fix-01');
  jerk = found;
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  __resetSpeechForTests();
  afterAllReset();
});

/** True when a comes before b in the document. */
function before(a: Element, b: Element): boolean {
  return (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
}

describe('fix model: read-aloud text and related order', () => {
  it('reads the title, every STOP line, then the numbered steps; never a superseded line', () => {
    const text = fixSpeechText(jerk);
    const at = (words: string) => text.indexOf(words);
    expect(at('Polisher jerks')).toBe(0);
    expect(at('Stop. Grinding noise')).toBeGreaterThan(0);
    expect(at('Stop. Odd shaking')).toBeGreaterThan(at('Stop. Grinding noise'));
    expect(at('Do this.')).toBeGreaterThan(at('Stop. Odd shaking'));
    expect(at('Step 1. Re-center the pad.')).toBeGreaterThan(at('Do this.'));
    expect(at('Step 2. Unverified. Hold it with two hands.')).toBeGreaterThan(at('Step 1.'));
    expect(at('Step 3. Keep the pad flat.')).toBeGreaterThan(at('Step 2.'));
    expect(text).not.toContain('Old step that was replaced');
    // Checks and causes are on screen, not in the hands-busy reading.
    expect(text).not.toContain('Unplug it first');
  });

  it('says once that an unverified fix is unverified', () => {
    const tesla = items.find((i): i is FixNodeItem => i.id === FIX_TESLA && i.type === 'fixnode');
    if (tesla === undefined) throw new Error('fixture has no tesla fix');
    expect(fixSpeechText(tesla)).toBe('Tesla test symptom. This fix is unverified. Check it against the label. Do this. Step 1. Ask Lando.');
  });

  it('lists the lesson, then products and tools, then the rest, each once', () => {
    expect(fixRelatedIds(jerk)).toEqual([LESSON_PRESSURE, PRODUCT, 'equipment-test-polisher', 'fix-02', 'card-machine-settings', 'sop-polish', 'term-test-set']);
  });
});

describe('FixPage', () => {
  it('puts STOP first, then Read aloud, then checks, causes, steps, still happening, notes', async () => {
    renderScreen(`/fixit/${FIX_JERK}`, ROUTES);
    const title = await screen.findByRole('heading', { level: 1, name: jerk.title });
    const bands = document.querySelectorAll('.ui-stopband');
    expect(bands).toHaveLength(2);
    const first = bands[0];
    if (first === undefined) throw new Error('no STOP band');
    expect(first.textContent).toContain('Grinding noise');
    const read = screen.getByRole('button', { name: 'Read aloud' });
    const headings = ['30-second checks', 'Most likely causes', 'Do this', 'Still happening?', 'Notes'].map((name) => screen.getByRole('heading', { level: 2, name }));
    expect(before(title, first)).toBe(true);
    expect(before(first, read)).toBe(true);
    let previous: Element = read;
    for (const heading of headings) {
      expect(before(previous, heading)).toBe(true);
      previous = heading;
    }
    // No heading or list sits between the title and the first STOP band.
    const between = Array.from(document.querySelectorAll('h2, ul, ol')).filter((el) => before(title, el) && before(el, first));
    expect(between).toEqual([]);
  });

  it('numbers the steps, leaves out the superseded one, and badges unverified and pending lines', async () => {
    renderScreen(`/fixit/${FIX_JERK}`, ROUTES);
    const steps = await screen.findByRole('list', { name: 'Do this' });
    expect(steps.tagName).toBe('OL');
    expect(within(steps).getAllByRole('listitem')).toHaveLength(3);
    expect(screen.queryByText('Old step that was replaced.')).toBeNull();
    expect(within(steps).getByText('unverified').closest('li')?.textContent).toContain('Hold it with two hands.');
    const notes = screen.getByRole('list', { name: 'Notes' });
    const pending = within(notes).getByText('pending').closest('li');
    expect(pending?.textContent).toContain('Lando decides which applies (pending).');
    expect(pending).toHaveAttribute('data-pending', 'true');
    // The pending row is not also called unverified.
    expect(within(notes).queryByText('unverified')).toBeNull();
    // Sources, with the address written out.
    expect(screen.getByText('https://example.com/manual.pdf')).toBeInTheDocument();
    expect(screen.getByText('Knowledge base section 21.')).toBeInTheDocument();
  });

  it('reads aloud from the tap: STOP lines first, then the steps, in order', async () => {
    const spoken = installVoice();
    renderScreen(`/fixit/${FIX_JERK}`, ROUTES);
    await act(async () => {
      fireEvent.click(await screen.findByRole('button', { name: 'Read aloud' }));
    });
    const all = spoken.join(' ');
    expect(spoken[0]).toBe('Polisher jerks, walks, or hops side to side.');
    expect(all.indexOf('Grinding noise')).toBeLessThan(all.indexOf('Re-center the pad'));
    expect(all.indexOf('Odd shaking')).toBeLessThan(all.indexOf('Re-center the pad'));
    expect(all.indexOf('Re-center the pad')).toBeLessThan(all.indexOf('Keep the pad flat'));
    expect(all).not.toContain('Old step');
  });

  it('opens related items on their pages, the lesson first', async () => {
    renderScreen(`/fixit/${FIX_JERK}`, ROUTES);
    const related = await screen.findByRole('list', { name: 'Related' });
    const rows = within(related).getAllByRole('listitem');
    expect(rows[0]?.textContent).toContain('Pressure: feel it on a scale');
    expect(rows[0]?.textContent).toContain('Lesson');
    fireEvent.click(within(related).getByText('Test polish'));
    expect(currentPath()).toBe(`/items/${PRODUCT}`);
  });

  it('an unknown fix says so and offers the way back', async () => {
    renderScreen('/fixit/fix-99', ROUTES);
    expect(await screen.findByRole('heading', { name: 'Fix not found' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Back to Fix It' }));
    expect(currentPath()).toBe('/fixit');
  });

  it('an id of another type is not shown as a fix', async () => {
    renderScreen(`/fixit/${LESSON_PRESSURE}`, ROUTES);
    expect(await screen.findByRole('heading', { name: 'Fix not found' })).toBeInTheDocument();
  });

  it('shows nothing internal in Customer View', async () => {
    await startFresh({ warningAccepted: true, newPin: '482915' });
    await turnCustomerViewOn();
    renderScreen(`/fixit/${FIX_JERK}`, ROUTES);
    expect(await screen.findByText(CUSTOMER_VIEW_NOTICE)).toBeInTheDocument();
    expect(screen.queryByText('STOP')).toBeNull();
    expect(screen.queryByText(jerk.title)).toBeNull();
    expect(document.querySelector('[data-internal]')).toBeNull();
    expect(document.body.textContent).not.toMatch(/unverified|pending/);
  });
});
