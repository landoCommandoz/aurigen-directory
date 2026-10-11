/**
 * /job and /business: Phase 1 placeholders that do something real. Each says which phase brings
 * the room, links to what works now, and keeps Home in reach. On a study phone it also says the
 * room opens on the shop phone only, with the way to set this phone up (D12 consequences).
 */
import { Internal } from '../../core/customerView';
import { useSettings } from '../../core/settingsStore';
import { ButtonLink } from '../ButtonLink';
import { Block, Page } from './Page';

export type PlaceholderRoom = 'job' | 'business';

const COPY: Record<PlaceholderRoom, { title: string; lede: string; body: string; shopOnly: string }> = {
  job: {
    title: 'Job Runner',
    lede: 'The Job Runner arrives in Phase 3.',
    body: 'Until then, the Model Y job sheet in reference/ is the stopgap. Fix It and the Quick Cards work now, offline.',
    shopOnly: 'Jobs run on the shop phone only. This phone is a study phone.',
  },
  business: {
    title: 'Business',
    lede: 'Pricing and policies arrive in Phase 4; the job log and dashboard in Phase 6.',
    body: 'Until then, the Quick Cards and Search work now, offline.',
    shopOnly: 'The Business room opens on the shop phone only. This phone is a study phone.',
  },
};

export function RoomPlaceholder({ room }: { room: PlaceholderRoom }) {
  const snapshot = useSettings();
  const copy = COPY[room];
  const studyPhone = snapshot.settings !== null && snapshot.settings.deviceRole === 'study';

  return (
    <Page title={copy.title} eyebrow="Coming in a later phase" lede={copy.lede}>
      <Internal>
        <Block index={1} label="Use now">
          <p className="app-measure">{copy.body}</p>
          <div className="app-actions">
            {room === 'job' ? <ButtonLink to="/fixit">Fix It</ButtonLink> : <ButtonLink to="/search">Search</ButtonLink>}
            <ButtonLink to="/cards" end={false}>
              Quick cards
            </ButtonLink>
            <ButtonLink to="/" variant="ghost">
              Home
            </ButtonLink>
          </div>
        </Block>
        {studyPhone ? (
          <Block index={2} label="Shop phone only">
            <p className="app-measure ui-muted">{copy.shopOnly}</p>
            <div className="app-actions">
              <ButtonLink to="/settings/setup">Set up this phone</ButtonLink>
            </div>
          </Block>
        ) : null}
      </Internal>
    </Page>
  );
}
