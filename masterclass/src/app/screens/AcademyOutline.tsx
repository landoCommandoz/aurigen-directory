/**
 * /academy, the Phase 1 placeholder. A real screen: the Masterclass outline, Levels 0 to 8 as
 * BUILD_PROMPT section 2 lists them, with the phases that bring the lessons, and links to what
 * works now (Quick Cards, Search). Home is always in reach.
 */
import { Row, RowList } from '../../components/ui';
import { Internal } from '../../core/customerView';
import { ButtonLink } from '../ButtonLink';
import { Block, Page } from './Page';

const LEVELS: ReadonlyArray<{ title: string; detail: string }> = [
  { title: 'Level 0. Ground rules', detail: "How paint works, what can and can't be fixed, safety, the never list, shop setup." },
  { title: 'Level 1. Wash and decon', detail: 'Wheels first, the hose-only towel method, pre-soak, hard water, drying, clay.' },
  { title: 'Level 2. Interior', detail: 'Interior detailing.' },
  { title: 'Level 3. Inspect and measure', detail: 'Light, the TC100 gauge, bands, the 8 checks, the walk-away list, the script.' },
  {
    title: 'Level 4. Machine polishing',
    detail:
      'The long-throw DA, priming and product amount, pressure, arm speed, sets, marker-line rotation, test spot and ladder, edges, heat, pad care, the backing plate. Its sign-off on the shop phone is what lets crew polish on a job.',
  },
  { title: 'Level 5. Protection and finishing', detail: 'Outline in v1.' },
  { title: 'Level 6. Specialty', detail: 'Tesla, motorcycles, headlights, pet hair, odor. Outline in v1.' },
  { title: 'Level 7. Business', detail: 'Menu, floor price, policies, booking flow, what kills the buff, retention, seasons, setup checklist. Outline in v1.' },
  { title: 'Level 8. Mastery', detail: 'Unlocks at 25 cars: two-step correction, speed, two-person flow, teaching others. Outline in v1.' },
];

export function AcademyOutline() {
  return (
    <Page title="Academy" eyebrow="Masterclass 101" lede="Lessons arrive in Phase 2 and 5. Levels 0 to 4 are written in full; 5 to 8 start as outlines.">
      <Internal>
        <Block index={1} label="Use now">
          <p className="app-measure">Until then, the numbers you need on a job are on the Quick Cards, and Search finds any card or term.</p>
          <div className="app-actions">
            <ButtonLink to="/cards" end={false}>
              Quick cards
            </ButtonLink>
            <ButtonLink to="/search">Search</ButtonLink>
            <ButtonLink to="/" variant="ghost">
              Home
            </ButtonLink>
          </div>
        </Block>
        <Block index={2} label="Levels">
          <h2 className="app-block__title">The levels</h2>
          <RowList label="Levels 0 to 8">
            {LEVELS.map((level) => (
              <Row key={level.title} as="li" title={level.title} detail={level.detail} />
            ))}
          </RowList>
        </Block>
      </Internal>
    </Page>
  );
}
