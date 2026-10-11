/**
 * npm run content: validate content/ against src/schemas and write src/generated/
 * (content.json, search-index.json, content-stats.json). Exits 1, writing nothing, on any problem.
 * The rules and their order are in pipeline.ts and src/schemas/README.md sections 6 and 7.
 */
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildContent } from './pipeline';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

function main(): number {
  const result = buildContent({ root });
  const { stats } = result;
  for (const note of result.notes) console.log(`note: ${note}`);
  if (!result.ok) {
    console.error(`content build failed: ${result.problems.length} problem${result.problems.length === 1 ? '' : 's'}`);
    for (const problem of result.problems) console.error(`  - ${problem}`);
    console.error('Nothing was written to src/generated/.');
    return 1;
  }
  const types = Object.entries(stats.byType)
    .map(([type, n]) => `${type} ${n}`)
    .join(', ');
  console.log(
    `content build: ${stats.items} item${stats.items === 1 ? '' : 's'}${types === '' ? '' : ` (${types})`}, ` +
      `${stats.customerSafe} customer-safe, ${stats.supersededLeftOut} superseded left out, ` +
      `${stats.signOffs} sign-off file${stats.signOffs === 1 ? '' : 's'}, ${stats.synonymGroups} synonym group${stats.synonymGroups === 1 ? '' : 's'}, ` +
      `${stats.searchIndexDocs} search document${stats.searchIndexDocs === 1 ? '' : 's'}` +
      (stats.searchCases.found ? `, search cases ${stats.searchCases.passed} of ${stats.searchCases.count} passed` : ''),
  );
  console.log(`wrote: ${result.wrote.join(', ')}`);
  return 0;
}

try {
  process.exitCode = main();
} catch (error) {
  console.error('content build crashed:', error instanceof Error ? (error.stack ?? error.message) : error);
  process.exitCode = 1;
}
