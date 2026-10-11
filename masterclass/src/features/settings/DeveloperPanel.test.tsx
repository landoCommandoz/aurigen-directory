import 'fake-indexeddb/auto';
import '@testing-library/jest-dom/vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { CustomerViewProvider, turnCustomerViewOn } from '../../core/customerView';
import { getSettings, withDb } from '../../core/db';
import { startFresh } from '../../core/deviceRole';
import { clearOwnerPass } from '../../core/pin';
import { afterAllReset, installShare, removeShare, renderScreen, resetAll } from './__tests__/harness';
import { DEV_PANEL_LABEL, DEV_TOOLS_OFF, DeveloperPanel } from './DeveloperPanel';
import { minimalPdf, parseIosVersion, shareTestFile } from './dev/devReadouts';
import { SHARE_LABELS, SPEECH_LABELS } from './dev/SpeechShareTests';
import { STATE_LABELS } from './dev/StateReadouts';
import { STORAGE_LABELS, WAKE_LABELS } from './dev/StorageWakeTests';
import { __setDevBuildForTests, developerToolsAllowed, setDeveloperToggle } from './devTools';
import { DevicePreviewBar, PREVIEW_LABEL } from './DevicePreviewBar';
import { getPreviewWidth, setPreviewWidth } from './previewWidth';

beforeEach(async () => {
  await resetAll();
  setPreviewWidth(null);
});

afterEach(() => {
  cleanup();
  removeShare();
  afterAllReset();
});

const ROUTES = { '/settings/developer': <DeveloperPanel />, '/settings': <p>Settings home</p> };

describe('developer panel', () => {
  it('is labeled as removable and renders every readout label', async () => {
    __setDevBuildForTests(true);
    renderScreen('/settings/developer', ROUTES);
    expect(await screen.findByText(DEV_PANEL_LABEL)).toBeInTheDocument();
    const labels = [
      ...Object.values(STATE_LABELS),
      ...Object.values(STORAGE_LABELS),
      ...Object.values(WAKE_LABELS),
      ...Object.values(SPEECH_LABELS),
      ...Object.values(SHARE_LABELS),
    ];
    for (const label of labels) expect(screen.getByText(label, { selector: 'dt' })).toBeInTheDocument();
    for (const name of ['Hold screen awake for 30 s', 'Test voice', 'Test share PNG', 'Test share PDF', 'Test share JSON', 'Check storage again', 'Ask to keep storage']) {
      expect(screen.getByRole('button', { name })).toBeInTheDocument();
    }
    expect(screen.getByText('Lock the screen after tapping Test voice.')).toBeInTheDocument();
    expect(screen.getByText(/Study phone/, { selector: 'dd' })).toBeInTheDocument();
  });

  it('in production stays off until the owner turns Developer tools on with the PIN', async () => {
    __setDevBuildForTests(false);
    renderScreen('/settings/developer', ROUTES);
    expect(await screen.findByText(DEV_TOOLS_OFF)).toBeInTheDocument();
    expect(screen.queryByText(DEV_PANEL_LABEL)).toBeNull();
  });

  it('the production toggle needs the owner pass and is logged', async () => {
    await startFresh({ warningAccepted: true, newPin: '482915' });
    clearOwnerPass();
    expect(await setDeveloperToggle(true)).toMatchObject({ ok: false, code: 'noOwnerPass' });
    expect((await getSettings()).developerPanel).toBe(false);
    await startFreshPass();
    expect(await setDeveloperToggle(true)).toEqual({ ok: true, on: true });
    expect((await getSettings()).developerPanel).toBe(true);
    const audit = await withDb((db) => db.auditLog.where('type').equals('developerToggle').toArray());
    expect(audit.map((a) => a.detail)).toEqual(['Developer tools turned on']);
  });

  it('the share test sends a real PDF file from the tap and reports the outcome', async () => {
    __setDevBuildForTests(true);
    const share = installShare('ok');
    renderScreen('/settings/developer', ROUTES);
    await act(async () => {
      fireEvent.click(await screen.findByRole('button', { name: 'Test share PDF' }));
    });
    expect(share.calls).toHaveLength(1);
    const file = share.calls[0]?.files?.[0];
    expect(file?.type).toBe('application/pdf');
    expect(await screen.findByText(/canShare: yes. Shared/)).toBeInTheDocument();
  });

  it('reports canShare no without calling the share sheet', async () => {
    __setDevBuildForTests(true);
    const share = installShare('ok', false);
    renderScreen('/settings/developer', ROUTES);
    fireEvent.click(await screen.findByRole('button', { name: 'Test share JSON' }));
    expect(await screen.findByText(/canShare: no/)).toBeInTheDocument();
    expect(share.calls).toHaveLength(0);
  });
});

async function startFreshPass() {
  // A correct PIN opens the owner pass, as the Settings toggle does through the PIN pad.
  const { verifyPin } = await import('../../core/pin');
  expect(await verifyPin('482915')).toEqual({ ok: true });
}

describe('visibility rule', () => {
  it('dev builds always, production only with the toggle, never in Customer View or while loading', () => {
    expect(developerToolsAllowed({ dev: true, toggle: false, customerViewReady: true, customerViewOn: false })).toBe(true);
    expect(developerToolsAllowed({ dev: false, toggle: false, customerViewReady: true, customerViewOn: false })).toBe(false);
    expect(developerToolsAllowed({ dev: false, toggle: true, customerViewReady: true, customerViewOn: false })).toBe(true);
    expect(developerToolsAllowed({ dev: true, toggle: true, customerViewReady: true, customerViewOn: true })).toBe(false);
    expect(developerToolsAllowed({ dev: true, toggle: true, customerViewReady: false, customerViewOn: false })).toBe(false);
  });

  it('the slide-over and the preview bar render nothing in Customer View', async () => {
    __setDevBuildForTests(true);
    await startFresh({ warningAccepted: true, newPin: '482915' });
    const view = render(
      <CustomerViewProvider>
        <MemoryRouter>
          <DevicePreviewBar />
          <DeveloperPanel open onClose={() => undefined} />
        </MemoryRouter>
      </CustomerViewProvider>,
    );
    expect(await screen.findByText(PREVIEW_LABEL)).toBeInTheDocument();
    expect(screen.getByText(DEV_PANEL_LABEL)).toBeInTheDocument();
    await act(async () => {
      expect(await turnCustomerViewOn()).toEqual({ ok: true, on: true });
    });
    await waitFor(() => expect(screen.queryByText(PREVIEW_LABEL)).toBeNull());
    expect(screen.queryByText(DEV_PANEL_LABEL)).toBeNull();
    expect(document.querySelector('[data-internal]')).toBeNull();
    view.unmount();
  });

  it('the preview bar sets the shared width with 3 labeled buttons', async () => {
    __setDevBuildForTests(true);
    render(
      <CustomerViewProvider>
        <DevicePreviewBar />
      </CustomerViewProvider>,
    );
    fireEvent.click(await screen.findByRole('button', { name: 'Mobile 375' }));
    expect(getPreviewWidth()).toBe(375);
    expect(screen.getByRole('button', { name: 'Mobile 375' })).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Tablet 768' }));
    expect(getPreviewWidth()).toBe(768);
    fireEvent.click(screen.getByRole('button', { name: 'Desktop full' }));
    expect(getPreviewWidth()).toBeNull();
  });
});

describe('developer readout helpers', () => {
  it('reads the iOS version from the user agent', () => {
    expect(parseIosVersion('Mozilla/5.0 (iPhone; CPU iPhone OS 18_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148')).toBe('18.4');
    expect(parseIosVersion('Mozilla/5.0 (iPhone; CPU iPhone OS 17_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1')).toBe('17.5.1');
    expect(parseIosVersion('Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1')).toBe(
      '26.0 (Safari version; the OS field reads 18.6)',
    );
    expect(parseIosVersion('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.4 Safari/605.1.15', 5)).toBe('iPadOS, Safari 18.4');
    expect(parseIosVersion('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36')).toBe('not iOS');
    expect(parseIosVersion('')).toBe('not iOS');
  });

  it('writes a PDF whose cross-reference offsets point at each object', () => {
    const pdf = minimalPdf();
    expect(pdf.startsWith('%PDF-1.4\n')).toBe(true);
    expect(pdf.trimEnd().endsWith('%%EOF')).toBe(true);
    const offsets = Array.from(pdf.matchAll(/^(\d{10}) 00000 n $/gm), (m) => Number(m[1]));
    expect(offsets).toHaveLength(5);
    offsets.forEach((offset, index) => {
      const head = `${index + 1} 0 obj\n`;
      expect(pdf.slice(offset, offset + head.length)).toBe(head);
    });
    const startxref = Number(/startxref\n(\d+)\n/.exec(pdf)?.[1]);
    expect(pdf.slice(startxref, startxref + 4)).toBe('xref');
  });

  it('builds share test files of the right type', () => {
    expect(shareTestFile('png', '2026-10-10T12:00:00.000Z').type).toBe('image/png');
    expect(shareTestFile('pdf', '2026-10-10T12:00:00.000Z').type).toBe('application/pdf');
    const json = shareTestFile('json', '2026-10-10T12:00:00.000Z');
    expect(json.type).toBe('application/json');
    expect(json.name).toBe('masterclass-share-test.json');
  });
});
