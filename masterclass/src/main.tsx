// First: Zod must be told not to probe eval before any module parses a schema (CSP, see the file).
import './app/zodSetup';
import './design/index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import { config } from './app/config';
import { parseAppConfig } from './schemas';
import { restoreDeepLink } from './app/deepLink';
import { initInstallPrompt } from './app/installCard';
import { scheduleWarmUp } from './app/warmUp';
import { applyDocumentAttributes, modeStore } from './app/mode';
import { initConnectivity } from './core/connectivity';
import { checkUpdatedOnBoot, initPwa } from './core/pwa';
import { initStorageProbe } from './core/storage';

// This module ran, so the boot guard in index.html can stand down.
window.__mcBoot?.done();

const FAILURE_TEXT = 'The app hit a problem. Reload, or tell Lando if it keeps happening.';

function errorSummary(error: unknown): string {
  if (error instanceof Error) return `${error.name}: ${error.message}`.slice(0, 200);
  try {
    return String(error).slice(0, 200);
  } catch {
    return 'Unknown error';
  }
}

/**
 * Visible fallback drawn with plain DOM calls, so it works even when React
 * cannot render. Styles go through the CSSOM (allowed under the strict CSP);
 * colors are inherited from the page, never set here.
 */
function showFailure(error: unknown): void {
  console.error('[boot] the app stopped with an error', error);
  try {
    const host = document.getElementById('root') ?? document.body;
    const box = document.createElement('div');
    box.setAttribute('role', 'alert');
    box.style.cssText = 'padding:24px;font-size:20px;line-height:1.4';

    const message = document.createElement('p');
    message.textContent = FAILURE_TEXT;

    const detail = document.createElement('p');
    detail.style.cssText = 'font-size:14px;opacity:0.8;overflow-wrap:anywhere';
    detail.textContent = errorSummary(error);

    const reload = document.createElement('button');
    reload.type = 'button';
    reload.textContent = 'Reload';
    reload.style.cssText = 'min-height:44px;min-width:44px;padding:0 20px;font-size:18px';
    reload.addEventListener('click', () => window.location.reload());

    box.append(message, detail, reload);
    host.replaceChildren(box);
  } catch {
    // The DOM itself is unusable: let the inline guard show its message.
    window.__mcBoot?.show();
  }
}

/** Runs one start-up step; a failure is logged and never stops the app from drawing. */
function step(name: string, run: () => unknown): void {
  try {
    const result = run();
    if (result instanceof Promise) {
      result.catch((error: unknown) => console.error(`[boot] ${name} failed`, error));
    }
  } catch (error) {
    console.error(`[boot] ${name} failed`, error);
  }
}

/** Start-up work that must happen before the first screen draws. */
function beforeRender(): void {
  // A GitHub Pages deep link arrives as <base>?p=...; put the real path back before the router reads it.
  step('deep link', () => restoreDeepLink());
  // The density on <html> before the first paint, so the first frame has the right sizes.
  step('density', () => applyDocumentAttributes(modeStore.get().mode, 'left'));
  // Catch the browser's install prompt early (Chrome, Edge); iOS uses the install card's words.
  step('install prompt', () => initInstallPrompt());
}

/** Start-up work that runs after the first render. Each step reports its own failures. */
function afterRender(): void {
  step('connectivity', () => initConnectivity());
  // Quota, usage, and "storage kept" for the developer panel; persist() is asked inside the first tap (D3).
  step('storage probe', () => initStorageProbe());
  // The offline copy and updates (D1, 3.5). No service worker in `vite dev`.
  if (import.meta.env.PROD) step('offline helper', () => initPwa());
  // "Updated" banner once after a new version boots (3.5); a first install records the version silently.
  step('version check', () => checkUpdatedOnBoot(config.version));
  // After the first screen, while the phone is idle: the search index, then the Fix It and Quick
  // Card content, so the first search and the first fix open at once (DEF-17: never before the
  // first screen draws).
  step('warm-up', () => scheduleWarmUp());
}

function boot(): void {
  const container = document.getElementById('root');
  if (container === null) throw new Error('index.html has no #root element');
  // D7: the public brand config must match its schema; a bad value stops here with every problem named.
  parseAppConfig(config);
  beforeRender();

  const root = createRoot(container, {
    // A render error is asynchronous, so the try/catch below cannot see it.
    // React unmounts the tree first; draw the fallback once it lets go.
    onUncaughtError: (error) => {
      window.setTimeout(() => showFailure(error), 0);
    },
  });

  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  afterRender();
}

try {
  boot();
} catch (error) {
  showFailure(error);
}
