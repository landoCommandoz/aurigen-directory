/// <reference types="vite/client" />

/**
 * The boot guard defined by the inline script in index.html.
 * main.tsx calls done() as soon as the app module runs; if that never
 * happens within 8 seconds, the guard shows a plain "did not start" message.
 */
interface MasterclassBootGuard {
  done: () => void;
  show: () => void;
}

interface Window {
  __mcBoot?: MasterclassBootGuard;
}
