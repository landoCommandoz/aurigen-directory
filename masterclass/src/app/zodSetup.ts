/**
 * Zod without eval. Zod 4 speeds up object parsing by compiling code with `new Function`, and it
 * probes for that once. The app's CSP has no 'unsafe-eval', so the probe fails and the browser
 * reports a securitypolicyviolation on every launch (seen in the Phase 1 Chromium smoke), even
 * though Zod catches it. jitless skips the probe and the compiler; parsing stays correct, and the
 * records here are small, so the speed difference does not matter.
 *
 * main.tsx imports this module first, so it runs before any schema parses.
 */
import * as z from 'zod';

z.config({ jitless: true });
