import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.ts';

/**
 * Unit tests share Vite's transform (React plugin, base path) so code is tested
 * the way it ships. Playwright suites (tests/e2e and friends) are not run here.
 * Globals are off: import describe, it, and expect from 'vitest'. With globals
 * off, Testing Library's auto-cleanup does not run, so a shared setup file must
 * call cleanup() in afterEach; add it to setupFiles when it exists.
 */
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      globals: false,
      include: ['src/**/*.test.{ts,tsx}', 'tests/unit/**/*.test.{ts,tsx}'],
      passWithNoTests: true,
    },
  }),
);
