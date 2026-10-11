/**
 * The screen frame every room shares (BLUEPRINT 2.1):
 *
 *   html, body, #root      100dvh flex columns that never scroll (src/design/index.css)
 *   .app-frame             flex column, min-height 0
 *     device preview bar   developer tool, when enabled
 *     .app-top             title, offline marker, Home and Settings (no header in Customer View)
 *     .app-scroll          THE scroll container: flex 1, min-height 0, overflow-y auto
 *       notices            storage, offline, update on every screen; setup, backup reminder,
 *                          and install card on Home and Settings (none in Customer View)
 *       the route          one screen, inside an error boundary keyed by route
 *                          (Home carries the mode switch: Shop, Academy, Customer)
 *     .app-bottom          Fix It, Quick cards, Search; in Customer View only the way out
 *
 * The density lives on <html> (data-density), so the drawer and toasts follow it. While the
 * saved Customer View flag is still loading, no internal screen renders (fail closed, 3.4); in
 * Customer View every route shows the customer screen instead of its own content.
 *
 * Before the flag is read (DEF-01), the synchronous hint decides the first frames: "on" draws the
 * customer density and no top bar; "unknown" (first launch, storage blocked) also holds the top
 * bar; "off" draws the title without its buttons, as before. If storage is stuck past
 * SLOW_STORAGE_MS and the hint is not "on", the title shows with the Reload offer, so the frame
 * is never bare.
 */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { Button } from '../components/ui';
import { useCustomerView } from '../core/customerView';
import { reloadIfPending } from '../core/pwa';
import { useSettings } from '../core/settingsStore';
import { DeveloperPanel, DevicePreviewBar, useDeveloperToolsEnabled, usePreviewWidth } from '../features/settings';
import { BannerStack } from './banners/BannerStack';
import { BottomRow } from './BottomRow';
import { ButtonLink } from './ButtonLink';
import { applyDocumentAttributes, densityFor, useMode } from './mode';
import { PreviewHost, isPreviewFrame } from './PreviewHost';
import { ScreenErrorBoundary } from './ScreenErrorBoundary';
import { CustomerScreen } from './screens/CustomerScreen';
import { StatusChip } from './StatusChip';
import './shell.css';

/** How long to wait on storage before offering a reload instead of "Opening". */
export const SLOW_STORAGE_MS = 4000;

export function Shell() {
  const devTools = useDeveloperToolsEnabled();
  const previewWidth = usePreviewWidth();
  if (devTools && previewWidth !== null && !isPreviewFrame) return <PreviewHost width={previewWidth} />;
  return <AppFrame previewBar={devTools && !isPreviewFrame} />;
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
}

function AppFrame({ previewBar }: { previewBar: boolean }) {
  const location = useLocation();
  const navigate = useNavigate();
  const customerView = useCustomerView();
  const mode = useMode();
  const snapshot = useSettings();
  const devTools = useDeveloperToolsEnabled();
  const [panelOpen, setPanelOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const internalRef = useRef(false);
  const slow = useSlowFlag(!customerView.ready);
  const density = densityFor(mode, customerView.ready ? customerView.on : customerView.hint === 'on');
  const handedness = snapshot.settings?.handedness ?? 'left';
  const internal = customerView.ready && !customerView.on;
  const header = showTopBar({ ready: customerView.ready, on: customerView.on, hint: customerView.hint, slow });

  useLayoutEffect(() => {
    applyDocumentAttributes(density, handedness);
  }, [density, handedness]);

  useEffect(() => {
    internalRef.current = internal;
  }, [internal]);

  // Every route change: back to the top of the new screen, and let a waiting update reload
  // here if the moment is quiet (3.5: "otherwise at the next navigation").
  useEffect(() => {
    if (scrollRef.current !== null) scrollRef.current.scrollTop = 0;
    void reloadIfPending();
  }, [location.pathname]);

  // "/" opens search from anywhere on a keyboard (BLUEPRINT 5, the PC at night). Not in Customer View.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== '/' || event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
      if (!internalRef.current || isTypingTarget(event.target)) return;
      event.preventDefault();
      navigate('/search');
    }
    // On window, so it runs after a mounted search box (which listens on document) has taken the key.
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [navigate]);

  let body;
  if (!customerView.ready) body = <Opening slow={slow} />;
  else if (customerView.on) body = <CustomerScreen />;
  else {
    body = (
      <ScreenErrorBoundary key={location.pathname}>
        <Outlet />
      </ScreenErrorBoundary>
    );
  }

  return (
    <div className="app-frame">
      {previewBar ? <DevicePreviewBar /> : null}
      {!header ? null : (
        <header className="app-top" data-print="hide">
          <div className="app-top__brand">
            <p className="app-top__title">Masterclass 101</p>
            <StatusChip />
          </div>
          {internal ? (
            <div className="app-top__actions">
              {devTools ? (
                <Button variant="ghost" onClick={() => setPanelOpen(true)}>
                  Developer
                </Button>
              ) : null}
              <ButtonLink to="/" variant="ghost">
                Home
              </ButtonLink>
              <ButtonLink to="/settings" variant="ghost" end={false}>
                Settings
              </ButtonLink>
            </div>
          ) : null}
        </header>
      )}
      <div ref={scrollRef} className="app-scroll" data-headless={header ? undefined : 'true'}>
        <BannerStack path={location.pathname} />
        {body}
      </div>
      <BottomRow />
      {devTools ? <DeveloperPanel open={panelOpen && internal} onClose={() => setPanelOpen(false)} /> : null}
    </div>
  );
}

/**
 * Whether the top bar is drawn (pure, tested). Always while internal screens show; never in
 * Customer View; before the flag is read, only when the hint says the last session was not in
 * Customer View, or when storage is stuck and the hint is not "on".
 */
export function showTopBar(input: { ready: boolean; on: boolean; hint: 'on' | 'off' | 'unknown'; slow: boolean }): boolean {
  if (input.ready) return !input.on;
  if (input.hint === 'off') return true;
  return input.hint === 'unknown' && input.slow;
}

/** True once storage has kept the app waiting SLOW_STORAGE_MS; false again when it answers. */
function useSlowFlag(waiting: boolean): boolean {
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    if (!waiting) return undefined;
    const timer = window.setTimeout(() => setSlow(true), SLOW_STORAGE_MS);
    return () => window.clearTimeout(timer);
  }, [waiting]);
  return waiting && slow;
}

/** Shown for the few milliseconds the saved Customer View flag takes to read. */
function Opening({ slow }: { slow: boolean }) {
  return (
    <main className="app-page" aria-busy="true" aria-label="Opening">
      <output className="ui-muted app-opening">
        {slow ? 'This phone is slow to answer. Reload, or close the app fully and open it again.' : 'Opening'}
      </output>
      {slow ? (
        <div className="app-actions">
          <Button onClick={() => window.location.reload()}>Reload</Button>
        </div>
      ) : null}
    </main>
  );
}
