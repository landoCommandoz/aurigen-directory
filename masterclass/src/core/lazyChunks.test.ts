// @vitest-environment node
/**
 * The build guard behind Try again (QA DEF-26): the app reads each lazy chunk's address from its
 * loader (freshImport.ts), so the build fails when a content or index chunk is not imported as
 * import("./file.js"). The chunks below mirror dist/ today; the guard also ran on the real build
 * output (16 lazy chunks seen, 0 problems) when this was written.
 */
import { describe, expect, it } from 'vitest';
import { lazyImportProblems, type ChunkView } from '../../scripts/content/viteShards';
import { importedAddress } from './freshImport';

const shard = (name: string, hash: string): ChunkView => ({
  fileName: `assets/content-${name}-${hash}.js`,
  code: 'export default JSON.parse("{}");',
  facadeModuleId: `\0mc-content-shard:${name}`,
  isDynamicEntry: true,
});
const index: ChunkView = { fileName: 'assets/search-index-B8wEEo4M.js', code: 'export default JSON.parse("{}");', facadeModuleId: '\0mc-json:search-index.json', isDynamicEntry: true };
const app = (code: string): ChunkView => ({ fileName: 'assets/index-Abc.js', code, facadeModuleId: '/src/main.tsx', isDynamicEntry: false });

const LOADERS = [
  'lesson:Object.assign({"../generated/content.json":()=>T(()=>import(`./content-lesson-BGNcr8Lu.js`).then(e=>e.default),[])})',
  'sop:Object.assign({"../generated/content.json":()=>T(()=>import("./content-sop-BU3i3Q-U.js").then(e=>e.default),[])})',
  'Tl=Object.assign({"../generated/search-index.json":()=>T(()=>import(\'./search-index-B8wEEo4M.js\').then(e=>e.default),[])})',
].join(',');

describe('lazyImportProblems', () => {
  it('passes when every lazy content and index chunk is imported as import("./file.js")', () => {
    expect(lazyImportProblems([app(LOADERS), shard('lesson', 'BGNcr8Lu'), shard('sop', 'BU3i3Q-U'), index])).toEqual([]);
  });

  it('fails, naming the chunk, when a loader is written another way or is missing', () => {
    const changed = LOADERS.replace('import(`./content-lesson-BGNcr8Lu.js`)', 'import(`./content-lesson-${"BGNcr8Lu"}.js`)').replace('import("./content-sop-BU3i3Q-U.js")', 'load("./content-sop-BU3i3Q-U.js")');
    const problems = lazyImportProblems([app(changed), shard('lesson', 'BGNcr8Lu'), shard('sop', 'BU3i3Q-U'), index]);
    expect(problems).toHaveLength(2);
    expect(problems[0]).toMatch(/^assets\/content-lesson-BGNcr8Lu\.js is not imported as import\("\.\/file\.js"\)/);
    expect(problems[1]).toMatch(/^assets\/content-sop-BU3i3Q-U\.js /);
  });

  it('leaves alone chunks that are not lazy content (the app, the vendor code, an eager shard)', () => {
    const eager = { ...shard('summary', 'X'), isDynamicEntry: false };
    const vendor: ChunkView = { fileName: 'assets/vendor-Y.js', code: '', facadeModuleId: null, isDynamicEntry: false };
    expect(lazyImportProblems([app(''), eager, vendor])).toEqual([]);
  });

  it('accepts exactly the addresses the app can read back', () => {
    for (const call of ['import(`./content-lesson-BGNcr8Lu.js`)', 'import("./content-lesson-BGNcr8Lu.js")', "import('./content-lesson-BGNcr8Lu.js')", 'import( "./content-lesson-BGNcr8Lu.js" )']) {
      const loader = new Function(`return () => ${call};`)() as () => Promise<unknown>;
      expect({ call, address: importedAddress(loader, 'https://example.test/assets/index-Abc.js') }).toEqual({ call, address: 'https://example.test/assets/content-lesson-BGNcr8Lu.js' });
      expect({ call, problems: lazyImportProblems([app(call), shard('lesson', 'BGNcr8Lu')]) }).toEqual({ call, problems: [] });
    }
  });
});
