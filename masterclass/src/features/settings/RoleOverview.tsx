/**
 * The device role screen's first view: the current role in plain words and the ways to change it
 * (BLUEPRINT 3.9, D12). Tapping any button here writes nothing; the flow views do the work.
 * On the shop phone, "Hand over to another phone" (D12 amendment) shows where the share sheet can
 * take the backup file; elsewhere a note names the two separate steps, which are on this screen.
 */
import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { START_FRESH_WARNING } from '../../schemas';
import { Button, Row, RowList } from '../../components/ui';
import { canShareFiles } from '../../core/platform';
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
  // Can this device hand a backup file to the share sheet? (D3: check canShare first.)
  const canHandOver = useMemo(() => canShareFiles([new File(['{}'], 'masterclass-backup.json', { type: 'application/json' })]), []);

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
            title="Hand over to another phone"
            index={2}
            intro={
              <p>
                For a new shop phone. Your PIN, then one tap saves a backup through the share sheet. Only once the backup is saved does this phone switch
                itself to a study phone. Its jobs stay on it, read only.
              </p>
            }
          >
            {canHandOver ? (
              <Actions>
                <Button onClick={() => send('HANDOVER_TAP')}>Hand over to another phone</Button>
              </Actions>
            ) : (
              <p className="ui-muted">
                This device cannot hand the backup file to a share sheet, so do it in two steps: Open Backup and restore below and save a backup, then tap
                Make this a study phone.
              </p>
            )}
          </Section>
          <Section
            title="Make this a study phone"
            index={3}
            intro={<p>Do this on the old phone after importing the newest backup onto a new one. The jobs stay in this phone's storage, but a study phone shows no job screens. Needs the owner PIN.</p>}
          >
            <Actions>
              <Button onClick={() => send('STUDY_TAP')}>Make this a study phone</Button>
            </Actions>
          </Section>
          <Section title="Replace this phone's data" index={4} intro={<p>Restoring a backup lives on the Backup screen.</p>}>
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
