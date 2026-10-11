import 'fake-indexeddb/auto';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ContentItem, type ContentItemValue } from '../schemas';
import { __resetDbForTests, getSettings, withDb } from './db';
import {
  CustomerViewProvider,
  Internal,
  customerSafe,
  showUnverifiedBadge,
  turnCustomerViewOff,
  turnCustomerViewOn,
  useCustomerScreen,
  useCustomerView,
} from './customerView';
import { startFresh } from './deviceRole';
import { __resetPinStateForTests, verifyPin } from './pin';
import { __resetSettingsStoreForTests } from './settingsStore';

const card = (extra: Record<string, unknown>): ContentItemValue =>
  ContentItem.parse({
    id: 'card-aftercare',
    type: 'quickcard',
    title: 'Aftercare',
    audience: ['customer'],
    visibility: 'customer-safe',
    status: 'house',
    kind: 'list',
    rows: [{ label: 'Wash', value: 'Every 2 weeks' }],
    ...extra,
  });

beforeEach(async () => {
  __resetSettingsStoreForTests();
  __resetPinStateForTests();
  await __resetDbForTests();
});

afterEach(() => {
  cleanup();
  __resetSettingsStoreForTests();
});

describe('customerSafe(items)', () => {
  it('keeps only customer-safe items with status house or confirmed sourced', () => {
    const items = [
      card({ id: 'card-house' }),
      card({ id: 'card-internal', visibility: 'internal' }),
      card({ id: 'card-verify', status: 'verify' }),
      card({ id: 'card-superseded', status: 'superseded' }),
      card({ id: 'card-sourced-unconfirmed', status: 'sourced', sources: [{ label: 'HF page', date: '2026-10-06' }] }),
      card({ id: 'card-sourced-confirmed', status: 'sourced', sources: [{ label: 'HF page', date: '2026-10-06', confirmedOn: '2026-10-09', confirmedBy: 'fact-checker' }] }),
      card({ id: 'card-verify-row', rows: [{ label: 'Wash', value: 'Every 2 weeks', status: 'verify' }] }),
      card({ id: 'card-tag-text', rows: [{ label: 'Wash', value: 'Every 2 weeks [VERIFY]' }] }),
    ];
    expect(customerSafe(items).map((i) => i.id)).toEqual(['card-house', 'card-sourced-confirmed']);
  });

  it('handles an empty list', () => {
    expect(customerSafe([])).toEqual([]);
  });

  it('shows the unverified badge on a verify item internally, never in Customer View', () => {
    const v = card({ status: 'verify', visibility: 'internal' });
    expect(showUnverifiedBadge(v, false)).toBe(true);
    expect(showUnverifiedBadge(v, true)).toBe(false);
    expect(showUnverifiedBadge(card({}), false)).toBe(false);
  });
});

function Probe() {
  const cv = useCustomerView();
  return (
    <div>
      <p data-testid="state">{`${cv.ready ? 'ready' : 'loading'} ${cv.on ? 'on' : 'off'} ${cv.sessionActive ? 'session' : 'nosession'} ${cv.held ? 'held' : 'free'} ${cv.focusReminderDue ? 'focus' : 'nofocus'}`}</p>
      <Internal>
        <button type="button">Fix It</button>
      </Internal>
      <p>Customer-safe text</p>
    </div>
  );
}

function CheckInScreen() {
  useCustomerScreen();
  return <p>Walkaround</p>;
}

describe('<Internal> and the switch', () => {
  it('fails closed: nothing internal renders before the persisted flag is read', () => {
    render(
      <CustomerViewProvider>
        <Probe />
      </CustomerViewProvider>,
    );
    expect(screen.getByTestId('state').textContent).toContain('loading');
    expect(screen.queryByText('Fix It')).toBeNull();
  });

  it('outside the provider, <Internal> also renders nothing', () => {
    render(
      <Internal>
        <span>secret</span>
      </Internal>,
    );
    expect(screen.queryByText('secret')).toBeNull();
  });

  it('renders internals when off, marked data-internal; removes them from the page when on', async () => {
    await startFresh({ warningAccepted: true, newPin: '482915' });
    render(
      <CustomerViewProvider>
        <Probe />
      </CustomerViewProvider>,
    );
    await waitFor(() => expect(screen.getByTestId('state').textContent).toBe('ready off nosession free nofocus'));
    const button = screen.getByText('Fix It');
    expect(button.closest('[data-internal]')).not.toBeNull();

    await act(async () => {
      expect(await turnCustomerViewOn()).toEqual({ ok: true, on: true });
    });
    await waitFor(() => expect(screen.getByTestId('state').textContent).toBe('ready on nosession held focus'));
    expect(screen.queryByText('Fix It')).toBeNull();
    expect(document.querySelector('[data-internal]')).toBeNull();
    expect(screen.getByText('Customer-safe text')).toBeTruthy();
  });

  it('a refresh keeps Customer View on and never flashes internals', async () => {
    await startFresh({ warningAccepted: true, newPin: '482915' });
    await turnCustomerViewOn();
    // "Refresh": a new provider and a cold settings store.
    __resetSettingsStoreForTests();
    render(
      <CustomerViewProvider>
        <Probe />
      </CustomerViewProvider>,
    );
    expect(screen.queryByText('Fix It')).toBeNull();
    await waitFor(() => expect(screen.getByTestId('state').textContent).toContain('ready on'));
    expect(screen.queryByText('Fix It')).toBeNull();
    expect((await getSettings()).customerViewOn).toBe(true);
  });

  it('a study phone cannot turn Customer View on', async () => {
    expect(await turnCustomerViewOn()).toMatchObject({ ok: false, code: 'notShopPhone' });
  });

  it('off needs no PIN without a session; with a session it needs the owner pass and is logged', async () => {
    await startFresh({ warningAccepted: true, newPin: '482915' });
    await turnCustomerViewOn();
    __resetPinStateForTests();
    expect(await turnCustomerViewOff()).toEqual({ ok: true, on: false });

    await turnCustomerViewOn();
    render(
      <CustomerViewProvider>
        <Probe />
        <CheckInScreen />
      </CustomerViewProvider>,
    );
    await waitFor(() => expect(screen.getByTestId('state').textContent).toContain('ready on session'));
    expect(await turnCustomerViewOff()).toMatchObject({ ok: false, code: 'needsOwnerPass' });
    expect((await getSettings()).customerViewOn).toBe(true);
    await verifyPin('482915');
    await act(async () => {
      expect(await turnCustomerViewOff()).toEqual({ ok: true, on: false });
    });
    const logged = await withDb((db) => db.auditLog.where('type').equals('customerViewOff').count());
    expect(logged).toBe(1);
    await waitFor(() => expect(screen.getByText('Fix It')).toBeTruthy());
  });

  it('the session is active whether the customer screen opened before or after the switch', async () => {
    await startFresh({ warningAccepted: true, newPin: '482915' });
    render(
      <CustomerViewProvider>
        <Probe />
        <CheckInScreen />
      </CustomerViewProvider>,
    );
    await waitFor(() => expect(screen.getByTestId('state').textContent).toContain('ready off nosession'));
    await act(async () => {
      await turnCustomerViewOn();
    });
    await waitFor(() => expect(screen.getByTestId('state').textContent).toContain('ready on session'));
  });
});
