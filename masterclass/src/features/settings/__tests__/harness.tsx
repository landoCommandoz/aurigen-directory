/**
 * Test harness for the feature screens (settings, Quick Cards, search, Fix It). Not imported by app
 * code. Real core modules on fake IndexedDB; the content bundle is the curator's seed files,
 * parsed through the real schemas and swapped in with core's test hook.
 */
import { fireEvent, render, screen, within, type RenderResult } from '@testing-library/react';
import type { ReactElement } from 'react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router';
import { parse } from 'yaml';
import { ToastProvider } from '../../../components/ui';
import { __setContentBundleForTests } from '../../../core/content';
import { emptyBundle } from '../../../core/contentBundle';
import { CustomerViewProvider } from '../../../core/customerView';
import { __resetDbForTests } from '../../../core/db';
import { __resetPinStateForTests } from '../../../core/pin';
import { __resetSearchForTests } from '../../../core/search';
import { __resetSettingsStoreForTests } from '../../../core/settingsStore';
import { ContentItem, type ContentItemValue } from '../../../schemas';
import { __setDevBuildForTests } from '../devTools';

const seedFiles = import.meta.glob<string>(['/content/cards/*.yaml', '/content/products/*.yaml', '/content/glossary/*.yaml'], {
  query: '?raw',
  import: 'default',
  eager: true,
});

/** The curator's seed content, parsed with the real ContentItem schema. */
export function seedItems(): ContentItemValue[] {
  return Object.values(seedFiles)
    .map((text) => ContentItem.parse(parse(text)))
    .sort((a, b) => a.id.localeCompare(b.id));
}

export function loadSeedBundle(): ContentItemValue[] {
  const items = seedItems();
  __setContentBundleForTests({ ...emptyBundle(), items });
  __resetSearchForTests();
  return items;
}

export async function resetAll(): Promise<void> {
  __resetSettingsStoreForTests();
  __resetPinStateForTests();
  __setDevBuildForTests(null);
  await __resetDbForTests();
}

export function afterAllReset(): void {
  __resetSettingsStoreForTests();
  __setContentBundleForTests(null);
  __resetSearchForTests();
  __setDevBuildForTests(null);
}

/** Shows the current path, so tests can see where a Cancel or Back went. */
function Where() {
  const location = useLocation();
  return <output data-testid="where">{`${location.pathname}${location.search}`}</output>;
}

/** Render a screen at a path inside the providers the shell gives it. */
export function renderScreen(path: string, routes: Record<string, ReactElement>): RenderResult {
  return render(
    <CustomerViewProvider>
      <ToastProvider>
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            {Object.entries(routes).map(([routePath, element]) => (
              <Route key={routePath} path={routePath} element={element} />
            ))}
            <Route path="*" element={<p>Elsewhere</p>} />
          </Routes>
          <Where />
        </MemoryRouter>
      </ToastProvider>
    </CustomerViewProvider>,
  );
}

export function currentPath(): string {
  return screen.getByTestId('where').textContent ?? '';
}

/** Tap a 6 digit PIN on the PinPad currently on screen. */
export function tapPin(pin: string): void {
  const pad = screen.getByRole('group', { name: /PIN/i });
  for (const digit of pin) fireEvent.click(within(pad).getByRole('button', { name: digit }));
}

export interface ShareMock {
  share: (data: ShareData) => Promise<void>;
  calls: ShareData[];
}

/** Install navigator.share and navigator.canShare. outcome 'ok' resolves; a name rejects with that DOMException name. */
export function installShare(outcome: 'ok' | 'AbortError' | 'NotAllowedError' = 'ok', canShare = true): ShareMock {
  const calls: ShareData[] = [];
  const share = (data: ShareData) => {
    calls.push(data);
    return outcome === 'ok' ? Promise.resolve() : Promise.reject(new DOMException('test', outcome));
  };
  Object.defineProperty(navigator, 'share', { configurable: true, writable: true, value: share });
  Object.defineProperty(navigator, 'canShare', { configurable: true, writable: true, value: () => canShare });
  return { share, calls };
}

export function removeShare(): void {
  Reflect.deleteProperty(navigator, 'share');
  Reflect.deleteProperty(navigator, 'canShare');
}
