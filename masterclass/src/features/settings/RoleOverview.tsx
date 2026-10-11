/**
 * The device role screen's first view: the current role in plain words and the ways to change it
 * (BLUEPRINT 3.9, D12). Tapping any button here writes nothing; the flow views do the work.
 */
import { useNavigate } from 'react-router';
import { START_FRESH_WARNING } from '../../schemas';
import { Button, Row, RowList } from '../../components/ui';
import type { SetupState } from './hooks';
import { shopTapAllowed, type RoleEvent } from './roleFlow';
import { Actions, Section } from './ui/Screen';

/** What Start fresh empties, in words (START_FRESH_CLEARS in src/schemas). */
export const START_FRESH_RESETS = [
  'Cars logged toward 25: back to 0.',
  "Founder's slots used: back to 0.",
  'Jobs, readings, job photos, issues, and debriefs on this phone: emptied.',
  'Academy progress on this phone stays.',
] as const;

export interface RoleOverviewProps {
  setup: SetupState;
  send: (event: RoleEvent) => void;
  onChooseStudy: () => void;
  studyBusy: boolean;
}

export function RoleOverview({ setup, send, onChooseStudy, studyBusy }: RoleOverviewProps) {
  const navigate = useNavigate();
  const shop = setup.deviceRole === 'shop';
  const tap = shopTapAllowed({ pinExists: setup.pinExists, role: setup.deviceRole });

  return (
    <>
      <Section title="This phone" index={1}>
        <RowList label="Current role">
          <Row
            as="li"
            title={shop ? 'This is the shop phone.' : 'This is a study phone.'}
            detail={
              shop
                ? 'It holds the jobs, the counts, and the sign-offs.'
                : setup.roleChosen
                  ? 'Study only: Fix It, Search, Quick Cards, and the Academy. No jobs.'
                  : 'Every phone starts as a study phone. You have not chosen yet.'
            }
          />
        </RowList>
      </Section>

      {shop ? (
        <>
          <Section
            title="Make this a study phone"
            index={2}
            intro={<p>Do this on the old phone after importing the newest backup onto a new one. The jobs stay in this phone's storage, but a study phone shows no job screens. Needs the owner PIN.</p>}
          >
            <Actions>
              <Button onClick={() => send('STUDY_TAP')}>Make this a study phone</Button>
            </Actions>
          </Section>
          <Section title="Replace this phone's data" index={3} intro={<p>Restoring a backup lives on the Backup screen.</p>}>
            <Actions>
              <Button onClick={() => navigate('/settings/backup')}>Open Backup and restore</Button>
            </Actions>
          </Section>
        </>
      ) : (
        <>
          <Section title="Is this the shop phone?" index={2} intro={<p>The tap changes nothing by itself. The next screen asks how, and has a Cancel.</p>}>
            <Actions>
              <Button onClick={() => send('SHOP_TAP')} disabled={!tap.allowed}>
                This is the shop phone
              </Button>
              {!setup.pinExists ? <Button onClick={() => navigate('/settings/setup')}>Create the owner PIN</Button> : null}
            </Actions>
            {tap.reason ? <p className="ui-muted">{tap.reason}</p> : null}
          </Section>

          <Section
            title="Make this the shop phone from a backup"
            index={3}
            intro={<p>For a new or second phone: import the newest backup from the shop phone. The shop role and the owner PIN come with it. Then switch the old phone to a study phone.</p>}
          >
            <Actions>
              <Button onClick={() => send('CHOOSE_IMPORT')}>Import the newest backup</Button>
            </Actions>
          </Section>

          <Section title="Start fresh" index={4} intro={<p>{START_FRESH_WARNING}</p>}>
            <ul className="mc-list">
              {START_FRESH_RESETS.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <Actions>
              <Button onClick={() => send('CHOOSE_FRESH')}>Start fresh</Button>
            </Actions>
          </Section>

          {!setup.roleChosen ? (
            <Section title="This is a study phone" index={5} intro={<p>Records the choice. No PIN needed. The setup banner moves on to the owner PIN.</p>}>
              <Actions>
                <Button onClick={onChooseStudy} loading={studyBusy} loadingLabel="Saving">
                  This is a study phone
                </Button>
              </Actions>
            </Section>
          ) : null}
        </>
      )}
    </>
  );
}
