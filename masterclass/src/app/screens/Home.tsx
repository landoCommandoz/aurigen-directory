/**
 * Home (/): the mode switch (Shop, Academy, Customer), the search box, the five rooms as tiles,
 * each with one plain sentence and where it stands, plus the phone's role and last backup (D3: a
 * visible "last backup" line on the home screen). Home is one tap from every screen (top bar).
 * Every tile does something real: the live rooms open, the later rooms open a placeholder that
 * says which phase brings them and links to what works now. Customer View turns on from here
 * too (on the shop phone; a study phone is told why not, with the way to set it up).
 */
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Banner, Row, RowList, Tile, TileGrid } from '../../components/ui';
import { getItemsByType } from '../../core/content';
import { Internal, useCustomerView } from '../../core/customerView';
import { useSettings } from '../../core/settingsStore';
import { SearchBox } from '../../features/search';
import { describeDate } from '../banners/bannerRules';
import { ButtonLink } from '../ButtonLink';
import { ModeSwitch } from '../ModeSwitch';
import { config } from '../config';
import { Block, Page } from './Page';

function countOf(type: 'quickcard' | 'fixnode'): number {
  try {
    return getItemsByType(type).length;
  } catch {
    return 0;
  }
}

function plural(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`;
}

export function Home() {
  const navigate = useNavigate();
  const customerView = useCustomerView();
  const snapshot = useSettings();
  const [notice, setNotice] = useState<{ text: string; setup: boolean } | null>(null);
  const [turningOn, setTurningOn] = useState(false);
  const settings = snapshot.settings;
  const cards = countOf('quickcard');
  const fixes = countOf('fixnode');

  async function openCustomerView() {
    if (turningOn) return;
    setTurningOn(true);
    setNotice(null);
    const result = await customerView.turnOn();
    setTurningOn(false);
    if (!result.ok) setNotice({ text: result.message, setup: result.code === 'notShopPhone' });
  }

  const role = settings?.deviceRole ?? 'study';
  const roleLine =
    settings === null
      ? 'Not saved on this phone: storage is unavailable.'
      : role === 'shop'
        ? 'The shop phone. Jobs, counters, and sign-offs live here.'
        : settings.roleChosenAt === null
          ? 'A study phone until you set it up. Fix It, Quick Cards, and Search work now.'
          : 'A study phone: Fix It, Quick Cards, Search, and the Academy.';

  return (
    <Page title="Masterclass 101" eyebrow={config.brandName} lede="Fix It and Quick Cards work now, with no signal.">
      <Internal>
        <Block index={1} label="Mode">
          <ModeSwitch />
        </Block>

        <Block index={2} label="Search">
          <SearchBox />
        </Block>

        <Block index={3} label="Rooms" className="app-rooms">
          <TileGrid label="Rooms">
            <Tile
              label="Fix It"
              detail={fixes > 0 ? `What went wrong and how to fix it. Live now: ${plural(fixes, 'fix', 'fixes')}.` : 'What went wrong and how to fix it. Live now; the fix pages land in Phase 2.'}
              onClick={() => navigate('/fixit')}
            />
            <Tile
              label="Quick cards"
              detail={cards > 0 ? `Mixes, settings, and rules, one card each. Live now: ${plural(cards, 'card', 'cards')}.` : 'Mixes, settings, and rules, one card each. Cards land in Phase 2.'}
              onClick={() => navigate('/cards')}
            />
            <Tile label="Job Runner" detail="Runs a job step by step with timers. Arrives in Phase 3." onClick={() => navigate('/job')} />
            <Tile label="Academy" detail="Levels 0 to 8: lessons, drills, quizzes, sign-offs. Arrives in Phase 2 and 5." onClick={() => navigate('/academy')} />
            <Tile
              label="Customer View"
              detail="Switch it on to see what a customer sees. Its screens arrive in Phase 4."
              onClick={() => void openCustomerView()}
              aria-busy={turningOn ? true : undefined}
            />
            <Tile label="Business" detail="Pricing, policies, and the job log. Arrives in Phase 4 and 6." onClick={() => navigate('/business')} />
          </TileGrid>
          {notice !== null ? (
            <Banner
              tone="info"
              action={notice.setup ? { label: 'Set up this phone', onAction: () => navigate('/settings/setup') } : undefined}
              onDismiss={() => setNotice(null)}
              dismissLabel="OK"
            >
              {notice.text}
            </Banner>
          ) : null}
        </Block>

        <Block index={4} label="This phone">
          <RowList label="This phone">
            <Row as="li" title="This phone" detail={roleLine} trailing={<ButtonLink to="/settings/device">Role</ButtonLink>} />
            <Row
              as="li"
              title="Last backup"
              detail={settings === null ? 'Unknown' : describeDate(settings.lastBackupAt)}
              trailing={<ButtonLink to="/settings/backup">Backup</ButtonLink>}
            />
          </RowList>
        </Block>
      </Internal>
    </Page>
  );
}
