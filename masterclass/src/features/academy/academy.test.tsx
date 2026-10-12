import 'fake-indexeddb/auto';
import '@testing-library/jest-dom/vitest';
import { act, cleanup, fireEvent, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { __setContentBundleForTests } from '../../core/content';
import { emptyBundle } from '../../core/contentBundle';
import { turnCustomerViewOn } from '../../core/customerView';
import { startFresh } from '../../core/deviceRole';
import { __resetSpeechForTests } from '../../core/speech';
import { afterAllReset, currentPath, renderScreen, resetAll } from '../settings/__tests__/harness';
import { CUSTOMER_VIEW_NOTICE } from '../settings/ui/InternalNotice';
import { CARD_SETTINGS, FIX_JERK, LESSON_OUTLINE, LESSON_PRESSURE, LESSON_RULES, SOP_POLISH } from '../shared/__tests__/fixture';
import { installVoice, loadFixtureBundle } from '../shared/__tests__/helpers';
import { PHASE_5_LINE } from './academyModel';
import { AcademyOutline } from './AcademyOutline';
import { LessonPage } from './LessonPage';
import { SopList } from './SopList';
import { SopPage } from './SopPage';

const ROUTES = {
  '/academy': <AcademyOutline />,
  '/academy/:lessonId': <LessonPage />,
  '/sops': <SopList />,
  '/sops/:id': <SopPage />,
  '/fixit/:id': <p>Fix page</p>,
  '/cards/:id': <p>Card page</p>,
  '/search': <p>Search</p>,
  '/': <p>Home</p>,
};

beforeEach(async () => {
  await resetAll();
  loadFixtureBundle();
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  __resetSpeechForTests();
  afterAllReset();
});

describe('AcademyOutline', () => {
  it('lists Levels 0 to 8, the real lessons in order under their level, and the Phase 5 line', async () => {
    renderScreen('/academy', ROUTES);
    expect(await screen.findByRole('heading', { level: 1, name: 'Academy' })).toBeInTheDocument();
    for (let level = 0; level <= 8; level += 1) expect(screen.getByRole('heading', { name: new RegExp(`^Level ${level}\\. `) })).toBeInTheDocument();
    expect(screen.getByText(new RegExp(PHASE_5_LINE.replace('.', '\\.')))).toBeInTheDocument();
    const level4 = screen.getByRole('list', { name: 'Level 4. Machine polishing' });
    expect(within(level4).getByText('3. Pressure: feel it on a scale')).toBeInTheDocument();
    // The goal line is the row's detail.
    expect(within(level4).getByText('Feel the pressure on a scale.')).toBeInTheDocument();
    expect(within(screen.getByRole('list', { name: 'Level 5. Protection and finishing' })).getByText('Outline')).toBeInTheDocument();
    expect(screen.getAllByText('No lessons in this build yet.').length).toBe(6);
  });

  it('opens a lesson on tap, and the procedures', async () => {
    renderScreen('/academy', ROUTES);
    fireEvent.click(await screen.findByText('3. Pressure: feel it on a scale'));
    expect(currentPath()).toBe(`/academy/${LESSON_PRESSURE}`);
    fireEvent.click(await screen.findByRole('button', { name: 'Back to the Academy' }));
    fireEvent.click(await screen.findByText('All procedures'));
    expect(currentPath()).toBe('/sops');
  });

  it('with no lessons in the build, still lists the levels and the way on', async () => {
    __setContentBundleForTests(emptyBundle());
    renderScreen('/academy', ROUTES);
    expect(await screen.findByRole('heading', { name: 'Level 0. Ground rules' })).toBeInTheDocument();
    expect(screen.getAllByText('No lessons in this build yet.')).toHaveLength(9);
    expect(screen.getByText('None in this build yet.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    expect(currentPath()).toBe('/search');
  });
});

describe('LessonPage', () => {
  it('shows the title, the goal, why, steps, numbers with badges, mistakes, and the Phase 5 line', async () => {
    renderScreen(`/academy/${LESSON_PRESSURE}`, ROUTES);
    expect(await screen.findByRole('heading', { level: 1, name: 'Pressure: feel it on a scale' })).toBeInTheDocument();
    expect(screen.getByText('Level 4, lesson 3')).toBeInTheDocument();
    expect(screen.getByText('Feel the pressure on a scale.')).toBeInTheDocument();
    // The goal is not repeated inside the why.
    expect(screen.queryByText(/\*\*Goal/)).toBeNull();
    expect(screen.getByRole('heading', { level: 2, name: 'Why it matters' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Why a scale' })).toBeInTheDocument();
    expect(screen.getByText('scale', { selector: 'strong' })).toBeInTheDocument();
    // The table reads as one group per row.
    expect(screen.getByText('No polish')).toBeInTheDocument();
    const steps = screen.getByRole('list', { name: 'The steps' });
    expect(steps.tagName).toBe('OL');
    expect(within(steps).getByText('pending').closest('li')?.textContent).toContain('Lando decides which applies (pending).');
    expect(document.querySelector('dl[aria-label="The numbers"]')).not.toBeNull();
    expect(screen.getByText('Not checked').closest('dt')?.textContent).toContain('unverified');
    expect(screen.queryByText('Old value.')).toBeNull();
    expect(screen.getByRole('list', { name: 'Common mistakes' })).toBeInTheDocument();
    expect(screen.getByText(PHASE_5_LINE)).toBeInTheDocument();
  });

  it('opens related items and the next lesson', async () => {
    renderScreen(`/academy/${LESSON_RULES}`, ROUTES);
    const next = await screen.findByRole('list', { name: 'Keep going' });
    fireEvent.click(within(next).getByText('Next lesson'));
    expect(currentPath()).toBe(`/academy/${LESSON_PRESSURE}`);
    const related = await screen.findByRole('list', { name: 'Related' });
    fireEvent.click(within(related).getByText('Machine settings'));
    expect(currentPath()).toBe(`/cards/${CARD_SETTINGS}`);
  });

  it('says plainly when a lesson is an outline', async () => {
    renderScreen(`/academy/${LESSON_OUTLINE}`, ROUTES);
    expect(await screen.findByText('An outline for now. The full lesson comes later.')).toBeInTheDocument();
  });

  it('an unknown lesson says so and offers the outline', async () => {
    renderScreen('/academy/lesson-l9-99-nope', ROUTES);
    expect(await screen.findByRole('heading', { name: 'Lesson not found' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'All lessons' }));
    expect(currentPath()).toBe('/academy');
  });

  it('shows nothing internal in Customer View', async () => {
    await startFresh({ warningAccepted: true, newPin: '482915' });
    await turnCustomerViewOn();
    renderScreen(`/academy/${LESSON_PRESSURE}`, ROUTES);
    expect(await screen.findByText(CUSTOMER_VIEW_NOTICE)).toBeInTheDocument();
    expect(screen.queryByText('Pressure: feel it on a scale')).toBeNull();
    expect(document.querySelector('[data-internal]')).toBeNull();
  });
});

describe('procedures', () => {
  it('lists procedures by stage and opens one', async () => {
    renderScreen('/sops', ROUTES);
    const polish = await screen.findByRole('list', { name: 'Machine polish' });
    expect(within(polish).getByText('Any car, planned 150 min')).toBeInTheDocument();
    fireEvent.click(within(polish).getByText('Machine polishing, one-step'));
    expect(currentPath()).toBe(`/sops/${SOP_POLISH}`);
  });

  it('shows each step with its STOP band, timer, notes, and card; never a superseded step', async () => {
    renderScreen(`/sops/${SOP_POLISH}`, ROUTES);
    expect(await screen.findByRole('heading', { level: 1, name: 'Machine polishing, one-step' })).toBeInTheDocument();
    const steps = screen.getByRole('list', { name: 'The steps' });
    expect(steps.querySelectorAll(':scope > li')).toHaveLength(2);
    expect(within(steps).getByText('Sun on the panel. Do not polish.').closest('.ui-stopband')).not.toBeNull();
    expect(within(steps).getByText('Section timer: 4 min.')).toBeInTheDocument();
    expect(within(steps).getByText('pending')).toBeInTheDocument();
    expect(screen.queryByText('Old step.')).toBeNull();
    fireEvent.click(within(steps).getByText('Open the card'));
    expect(currentPath()).toBe(`/cards/${CARD_SETTINGS}`);
  });

  it('reads the procedure aloud from the tap, step by step', async () => {
    const spoken = installVoice();
    renderScreen(`/sops/${SOP_POLISH}`, ROUTES);
    await act(async () => {
      fireEvent.click(await screen.findByRole('button', { name: 'Read aloud' }));
    });
    const all = spoken.join(' ');
    expect(all.indexOf('Step 1')).toBeLessThan(all.indexOf('Sun on the panel'));
    expect(all.indexOf('Sun on the panel')).toBeLessThan(all.indexOf('Step 2'));
    expect(all).not.toContain('Old step');
  });

  it('related rows open their pages, and an unknown procedure offers the list', async () => {
    renderScreen(`/sops/${SOP_POLISH}`, ROUTES);
    fireEvent.click(within(await screen.findByRole('list', { name: 'Related' })).getByText('Polisher jerks, walks, or hops side to side'));
    expect(currentPath()).toBe(`/fixit/${FIX_JERK}`);
    cleanup();
    renderScreen('/sops/sop-nope', ROUTES);
    expect(await screen.findByRole('heading', { name: 'Procedure not found' })).toBeInTheDocument();
  });

  it('with none in the build, the list says so and keeps the way back', async () => {
    __setContentBundleForTests(emptyBundle());
    renderScreen('/sops', ROUTES);
    expect(await screen.findByText('No procedures in this build yet.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Back to the Academy' }));
    expect(currentPath()).toBe('/academy');
  });
});
