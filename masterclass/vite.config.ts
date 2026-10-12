import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { contentShardsPlugin } from './scripts/content/viteShards.ts';

/**
 * Base path. "/" for Netlify (the default). The GitHub Pages workflow sets
 * VITE_BASE=/aurigen-directory/ (DECISIONS D9). Nothing else should set it.
 * App code reads the result as import.meta.env.BASE_URL.
 */
function resolveBase(raw: string | undefined): string {
  const trimmed = (raw ?? '').trim();
  if (trimmed === '') return '/';
  const base = `/${trimmed.replace(/^\/+|\/+$/g, '')}/`.replace('//', '/');
  if (!/^\/([A-Za-z0-9._~-]+\/)*$/.test(base)) {
    throw new Error(`VITE_BASE must be a plain path such as /aurigen-directory/, got "${raw}"`);
  }
  return base;
}

// ---------------------------------------------------------------------------
// Content-Security-Policy: one policy, every host.
// netlify.toml holds the policy (Netlify sends it as a header). GitHub Pages
// and `vite preview` send no headers, so the build copies the same policy into
// a <meta> tag; a CSP problem then shows on the Pages test install and in
// Playwright, not first on a paid Netlify deploy. frame-ancestors only works
// as a header and is left out of the meta copy.
// The build also fails if index.html carries an inline <script> whose sha256
// is not in script-src, or any inline style, because the policy would block it.
// ---------------------------------------------------------------------------

function readCsp(tomlPath: string): string {
  const toml = readFileSync(tomlPath, 'utf8');
  const match = /^\s*Content-Security-Policy\s*=\s*"([^"]+)"\s*$/m.exec(toml);
  if (!match?.[1]) throw new Error(`${tomlPath} has no single-line Content-Security-Policy header`);
  return match[1];
}

function directiveSources(policy: string, name: string): Set<string> {
  for (const part of policy.split(';')) {
    const [directive, ...sources] = part.trim().split(/\s+/);
    if (directive === name) return new Set(sources);
  }
  return new Set();
}

function auditInlineCode(html: string, policy: string): string[] {
  const problems: string[] = [];
  const allowed = directiveSources(policy, 'script-src');
  const scriptTag = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  for (const [, attrs = '', body = ''] of html.matchAll(scriptTag)) {
    if (/\bsrc\s*=/i.test(attrs) || body.trim() === '') continue;
    const hash = `'sha256-${createHash('sha256').update(body, 'utf8').digest('base64')}'`;
    if (!allowed.has(hash)) {
      problems.push(`an inline <script> is not in script-src. Add ${hash} to script-src in netlify.toml.`);
    }
  }
  const markup = html.replace(scriptTag, '');
  if (/<style\b/i.test(markup)) problems.push('index.html has an inline <style>; style-src allows files only.');
  if (/\sstyle\s*=/i.test(markup)) problems.push('index.html has a style="" attribute; style-src allows files only.');
  return problems;
}

function cspPlugin(): Plugin {
  let policy = '';
  return {
    name: 'masterclass:csp',
    apply: 'build',
    enforce: 'post',
    configResolved(resolved) {
      policy = readCsp(join(resolved.root, 'netlify.toml'));
    },
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        const metaPolicy = policy
          .split(';')
          .map((part) => part.trim())
          .filter((part) => part !== '' && !part.startsWith('frame-ancestors'))
          .join('; ');
        const anchor = '<meta charset="UTF-8" />';
        if (!html.includes(anchor)) throw new Error(`index.html must keep ${anchor} as its first tag`);
        const tag = `<meta http-equiv="Content-Security-Policy" content="${metaPolicy}" />`;
        return html.replace(anchor, `${anchor}\n    ${tag}`);
      },
    },
    writeBundle(_options, bundle) {
      const page = bundle['index.html'];
      if (page?.type !== 'asset') throw new Error('index.html is missing from the build output');
      const html = typeof page.source === 'string' ? page.source : new TextDecoder().decode(page.source);
      const problems = auditInlineCode(html, policy);
      if (problems.length > 0) throw new Error(`CSP check failed:\n- ${problems.join('\n- ')}`);
    },
  };
}

// ---------------------------------------------------------------------------
// Theme color and the GitHub Pages 404 page.
// The manifest colors and the theme-color meta in index.html must equal the
// --base token. The manifest reads it from tokens.css; index.html cannot, so
// the build fails if its meta tag drifts from the token.
// public/404.html is copied as-is by Vite; at build time this plugin writes
// the base path into it and gives its one inline script a strict CSP by hash.
// ---------------------------------------------------------------------------

const TOKENS_FILE = fileURLToPath(new URL('./src/design/tokens.css', import.meta.url));

function readHexToken(name: string): string {
  const css = readFileSync(TOKENS_FILE, 'utf8');
  const match = new RegExp(`(?:^|[\\s;{])${name}\\s*:\\s*(#[0-9a-fA-F]{6})\\b`, 'm').exec(css);
  if (!match?.[1]) throw new Error(`${name} must be a 6-digit hex color in src/design/tokens.css`);
  return match[1].toLowerCase();
}

/** --base from the design tokens: the manifest's theme and background color. */
const BASE_COLOR = readHexToken('--base');

/**
 * The brand name from src/app/config.ts (D7: renaming the business is one edit there). Read as
 * text, like the token above: importing config.ts here would pull package.json through Vite's
 * config loader, which warns about the JSON import.
 */
function readBrandName(): string {
  const source = readFileSync(fileURLToPath(new URL('./src/app/config.ts', import.meta.url)), 'utf8');
  const match = /\bbrandName:\s*(['"])(.+?)\1/.exec(source);
  if (!match?.[2]) throw new Error('src/app/config.ts must keep a brandName: "..." line; the web manifest name reads it');
  return match[2];
}

function render404(html: string, base: string): string {
  if (!html.includes('__MC_BASE__') || !html.includes('__MC_404_CSP__')) {
    throw new Error('public/404.html must keep its __MC_BASE__ and __MC_404_CSP__ placeholders');
  }
  const withBase = html.replaceAll('__MC_BASE__', base);
  const scripts = [...withBase.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((match) => match[1] ?? '');
  if (scripts.length !== 1 || scripts[0] === undefined) throw new Error('public/404.html must hold exactly one inline <script>');
  const hash = createHash('sha256').update(scripts[0], 'utf8').digest('base64');
  const policy = `default-src 'none'; script-src 'sha256-${hash}'; base-uri 'none'; form-action 'none'`;
  return withBase.replace('__MC_404_CSP__', policy);
}

function shellGuardsPlugin(base: string): Plugin {
  let outDir = '';
  return {
    name: 'masterclass:shell-guards',
    apply: 'build',
    configResolved(resolved) {
      outDir = resolve(resolved.root, resolved.build.outDir);
    },
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        const meta = /<meta name="theme-color" content="(#[0-9a-fA-F]{6})"/.exec(html);
        if (!meta?.[1]) throw new Error('index.html must keep <meta name="theme-color" content="#rrggbb" />');
        if (meta[1].toLowerCase() !== BASE_COLOR) {
          throw new Error(`index.html theme-color ${meta[1]} differs from --base ${BASE_COLOR} in src/design/tokens.css. Make them equal.`);
        }
        return html;
      },
    },
    writeBundle() {
      // Vite copied public/ into outDir before writing; the service worker is generated after
      // this hook (closeBundle), so its precache entry carries the final 404.html.
      const file = join(outDir, '404.html');
      if (!existsSync(file)) throw new Error('public/404.html is missing: GitHub Pages deep links need it');
      writeFileSync(file, render404(readFileSync(file, 'utf8'), base));
    },
  };
}

/** A chunk name with no leading "_" (see chunkFileNames below). */
function readableChunkName(name: string): string {
  return name.replace(/^_mc-content-shard_/, 'content-').replace(/^_mc-json_/, '').replace(/^_+/, '') || 'chunk';
}

const base = resolveBase(process.env.VITE_BASE);

export default defineConfig({
  base,
  plugins: [
    react(),
    // The content bundle, cut into one lazy chunk per shard (QA DEF-17; src/core/contentShards.ts).
    contentShardsPlugin(),

    // ===== PWA (D1, BLUEPRINT 3.5 and 5) =====
    // vite-plugin-pwa 2, generateSW, registerType 'prompt': a new service worker
    // waits until the app says so (src/core/pwa.ts applyUpdateWhenIdle), so an
    // update never interrupts a running job. injectRegister false: the app
    // registers through virtual:pwa-register (src/core/pwaRegister.ts), because
    // an inline register script would be blocked by the CSP. The service worker
    // is served at <base>sw.js with scope <base>, so both hosts work:
    // GitHub Pages builds with VITE_BASE=/aurigen-directory/, Netlify with "/".
    VitePWA({
      strategies: 'generateSW',
      registerType: 'prompt',
      injectRegister: false,
      // The png glob below already precaches the icons; listing them again would duplicate entries.
      includeManifestIcons: false,
      manifest: {
        name: `${readBrandName()} Masterclass 101`,
        short_name: 'Masterclass',
        description: 'Fix It, Shop Mode, and the Academy, offline in the garage.',
        lang: 'en',
        dir: 'ltr',
        // Relative to the manifest, which sits at <base>manifest.webmanifest,
        // so start_url and scope resolve to the base path on either host.
        start_url: '.',
        scope: '.',
        // standalone keeps the Home Screen app exempt from Safari's 7-day wipe (D3).
        display: 'standalone',
        // Both mirror the --base token; BASE_COLOR is read from src/design/tokens.css.
        background_color: BASE_COLOR,
        theme_color: BASE_COLOR,
        // The artwork bleeds to every edge with its mark inside the maskable safe
        // circle (src/design/icon.svg), so one file serves both purposes.
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Everything Shop Mode, Fix It, Search, Quick Cards, and the Academy need is
        // precached at install: the app code, every lazy content shard and the lazy
        // search-index chunk (all js), styles, the five woff2 fonts, icons, and the
        // HTML. The plugin adds the web manifest itself.
        globPatterns: ['**/*.{js,css,html,woff2,svg,png,ico,json}'],
        // D1: the 2 MiB per-file limit stays (Workbox's default, written out here).
        // A file over it is left out of the offline copy, and vite-plugin-pwa then
        // fails the build on purpose, so a bundle too big to save never ships.
        maximumFileSizeToCacheInBytes: 2 * 1024 * 1024,
        // A deep link opened offline gets the app shell; the router takes it from there.
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
        // Prompt mode: the new worker waits. Never claim open pages on its own.
        clientsClaim: false,
        skipWaiting: false,
      },
      // No service worker in `vite dev`: dev builds always load fresh code.
      devOptions: { enabled: false },
    }),
    // ===== end PWA block =====

    shellGuardsPlugin(base),
    cspPlugin(),
  ],
  // JSON modules (the content shards, the search index) ship as JSON.parse of one string, which the
  // phone parses far faster than the same data as an object literal.
  json: { stringify: true },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rolldownOptions: {
      output: {
        // Long-lived chunks, so an update downloads only what changed: the libraries change
        // rarely, the app code more often. The content is not grouped: each content shard is its
        // own lazy chunk (content.json?mc-shard=<name>, src/core/contentLoaders.ts), loaded when a
        // screen draws it, and the search index stays its own lazy chunk (src/core/search.ts).
        // Nothing from src/generated is on the first screen's path except the item counts.
        codeSplitting: {
          groups: [{ name: 'vendor', test: /[\\/]node_modules[\\/]/ }],
        },
        // The shards come from virtual modules ("\0mc-content-shard:fixnode"), whose default chunk
        // names start with "_". Some static hosts hide such files, so they ship as
        // content-fixnode-<hash>.js and search-index-<hash>.js.
        chunkFileNames: (chunk) => `assets/${readableChunkName(chunk.name)}-[hash].js`,
      },
    },
    // The real ceiling is the 2 MiB per-file precache limit above (D1), which fails the build.
    // Warn at 512 KiB: the largest content shard (the lessons) is about 270 KiB today, so a warning
    // means one shard has doubled and should be cut again (src/core/contentShards.ts).
    chunkSizeWarningLimit: 512,
  },
  preview: {
    port: 4173,
    strictPort: true,
  },
});
