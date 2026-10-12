/**
 * Vite plugin for the files the content build writes to src/generated/ (QA DEF-17).
 *
 * 1. Content shards. The app imports content.json?mc-shard=<name> (src/core/contentLoaders.ts).
 *    This plugin resolves each to a virtual module holding only that shard, so each shard is its
 *    own lazy chunk, and every chunk is in the offline copy. The content build is unchanged: it
 *    still writes the one content.json, which this plugin reads.
 * 2. Plain JSON as JSON.parse. Any src/generated/<file>.json?mc-json=1 (the search index) becomes
 *    `export default JSON.parse("...")`: one string the phone parses far faster than the same
 *    data as an object literal, which is what Vite 8 emits for a plain JSON import.
 *
 * 3. A build guard (QA DEF-26). The app asks again for a lazy chunk that failed to download under a
 *    fresh address, which it reads from the chunk's loader (src/core/freshImport.ts). The build
 *    fails if any content or index chunk is not imported as import("./file.js"), so a bundler
 *    upgrade that writes loaders another way cannot quietly break Try again.
 *
 * Virtual ids (not .json ids) keep Vite's JSON step out of the way in the build, the dev server,
 * and Vitest alike. This file imports nothing from src/ on purpose: the Vite config loads it, and
 * the schemas' extensionless imports would make the config loader warn on every run. The cut below
 * must equal shardOf() in src/core/contentShards.ts; src/core/contentShards.test.ts compares the
 * two on the real bundle, shard by shard.
 */
import { readFileSync, statSync } from 'node:fs';
import { posix } from 'node:path';
import type { Plugin } from 'vite';

export const SHARD_QUERY = 'mc-shard';
export const JSON_QUERY = 'mc-json';

const GENERATED_JSON = /[\\/]src[\\/]generated[\\/][a-z0-9-]+\.json$/;
const BUNDLE_FILE = /[\\/]src[\\/]generated[\\/]content\.json$/;
/** "\0" keeps every other plugin off these ids; the rest shows in the chunk names. */
const SHARD_PREFIX = '\0mc-content-shard:';
const JSON_PREFIX = '\0mc-json:';

/** The fields of content.json this cut reads. */
interface BundleFile {
  version: number;
  items: Array<{ id: string; type: string; title: string; status: string }>;
  signOffs: unknown[];
  synonyms: unknown[];
  customerSafeIds?: string[];
}

/** One shard of the bundle, as plain data. Mirrors shardOf() in src/core/contentShards.ts. */
export function cutShard(bundle: BundleFile, name: string): Record<string, unknown> {
  const head = { version: bundle.version, shard: name };
  if (name === 'summary') {
    const counts: Record<string, number> = {};
    for (const item of bundle.items) counts[item.type] = (counts[item.type] ?? 0) + 1;
    return { ...head, counts, items: bundle.items.length, signOffs: bundle.signOffs.length };
  }
  if (name === 'catalog') {
    const safe = new Set(bundle.customerSafeIds ?? []);
    return { ...head, entries: bundle.items.map((item) => ({ id: item.id, type: item.type, title: item.title, status: item.status, customerSafe: safe.has(item.id) })) };
  }
  if (name === 'extras') return { ...head, signOffs: bundle.signOffs, synonyms: bundle.synonyms };
  return { ...head, items: bundle.items.filter((item) => item.type === name) };
}

/** The module text: the value as JSON.parse of one string literal. */
export function jsonModule(value: unknown): string {
  return `export default JSON.parse(${JSON.stringify(JSON.stringify(value))});\n`;
}

/** Parsed files, kept until they change (one read per content build, not per shard). */
const cache = new Map<string, { mtimeMs: number; size: number; value: unknown }>();

function readJson(file: string): unknown {
  const stat = statSync(file);
  const hit = cache.get(file);
  if (hit !== undefined && hit.mtimeMs === stat.mtimeMs && hit.size === stat.size) return hit.value;
  const value: unknown = JSON.parse(readFileSync(file, 'utf8'));
  cache.set(file, { mtimeMs: stat.mtimeMs, size: stat.size, value });
  return value;
}

function readBundle(file: string): BundleFile {
  const bundle = readJson(file) as Partial<BundleFile> | null;
  if (bundle === null || typeof bundle.version !== 'number' || !Array.isArray(bundle.items) || !Array.isArray(bundle.signOffs) || !Array.isArray(bundle.synonyms)) {
    throw new Error(`${file} is not a content bundle. Run npm run content.`);
  }
  return bundle as BundleFile;
}

/** The path and query of an import of a generated file with one of our queries, or null. */
export function generatedRequest(source: string): { path: string; shard: string | null; json: boolean } | null {
  const at = source.indexOf('?');
  if (at < 0 || !source.slice(0, at).endsWith('.json')) return null;
  const query = new URLSearchParams(source.slice(at + 1));
  const shard = query.get(SHARD_QUERY);
  const json = query.has(JSON_QUERY);
  if (shard === null && !json) return null;
  return { path: source.slice(0, at), shard, json };
}

/** The import() shape src/core/freshImport.ts reads. Keep the two patterns equal. */
const IMPORT_CALL = /\bimport\(\s*(["'`])([^"'`$]+)\1\s*\)/g;

/** The parts of an output chunk the guard reads. */
export interface ChunkView {
  fileName: string;
  code: string;
  facadeModuleId: string | null;
  isDynamicEntry: boolean;
}

/**
 * Every lazy content or index chunk must be imported somewhere as import("./file.js"), with an
 * address relative to the importing chunk. Returns one line per chunk that is not.
 */
export function lazyImportProblems(chunks: readonly ChunkView[]): string[] {
  const imported = new Set<string>();
  for (const chunk of chunks) {
    for (const match of chunk.code.matchAll(IMPORT_CALL)) {
      const specifier = match[2];
      if (specifier === undefined || !specifier.startsWith('.')) continue;
      imported.add(posix.normalize(posix.join(posix.dirname(chunk.fileName), specifier)));
    }
  }
  return chunks
    .filter((chunk) => chunk.isDynamicEntry && chunk.facadeModuleId !== null && (chunk.facadeModuleId.startsWith(SHARD_PREFIX) || chunk.facadeModuleId.startsWith(JSON_PREFIX)))
    .filter((chunk) => !imported.has(chunk.fileName))
    .map(
      (chunk) =>
        `${chunk.fileName} is not imported as import("./file.js"). The app reads that address to ask again for a chunk that failed to download (src/core/freshImport.ts); update the pattern there and here together.`,
    );
}

export function contentShardsPlugin(): Plugin {
  /** Virtual id to the file it reads. */
  const files = new Map<string, string>();
  return {
    name: 'masterclass:content-shards',
    enforce: 'pre',
    async resolveId(source, importer) {
      const request = generatedRequest(source);
      if (request === null) return null;
      const resolved = await this.resolve(request.path, importer, { skipSelf: true });
      const file = resolved?.id.split('?')[0];
      if (file === undefined || !GENERATED_JSON.test(file)) return null;
      if (request.shard !== null) {
        if (!BUNDLE_FILE.test(file)) throw new Error(`${SHARD_QUERY} works on src/generated/content.json only, not ${file}`);
        if (!/^[a-z]+$/.test(request.shard)) throw new Error(`"${request.shard}" is not a content shard name`);
        const id = `${SHARD_PREFIX}${request.shard}`;
        files.set(id, file);
        return id;
      }
      const id = `${JSON_PREFIX}${file.split(/[\\/]/).pop() ?? 'file'}`;
      files.set(id, file);
      return id;
    },
    load(id) {
      const file = files.get(id);
      if (file === undefined) return null;
      this.addWatchFile(file);
      if (id.startsWith(SHARD_PREFIX)) return { code: jsonModule(cutShard(readBundle(file), id.slice(SHARD_PREFIX.length))), moduleType: 'js' };
      return { code: jsonModule(readJson(file)), moduleType: 'js' };
    },
    generateBundle(_options, bundle) {
      const chunks: ChunkView[] = [];
      for (const file of Object.values(bundle)) {
        if (file.type !== 'chunk') continue;
        chunks.push({ fileName: file.fileName, code: file.code, facadeModuleId: file.facadeModuleId ?? null, isDynamicEntry: file.isDynamicEntry });
      }
      const problems = lazyImportProblems(chunks);
      if (problems.length > 0) this.error(`Lazy chunk check failed:\n- ${problems.join('\n- ')}`);
    },
  };
}
