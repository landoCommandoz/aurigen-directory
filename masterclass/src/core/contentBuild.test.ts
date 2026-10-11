// @vitest-environment node
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { buildContent, GENERATED_DIR, OUTPUT_FILES } from '../../scripts/content/pipeline';

let root = '';

function put(rel: string, text: string): void {
  const abs = join(root, rel);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, text, 'utf8');
}

const CARD = `id: card-bucket-mix
type: quickcard
title: Pre-polish bucket mix
audience: [owner, crew]
visibility: internal
status: house
kbRef: "4"
kind: mix
synonyms: [bucket mix]
rows:
  - label: Water
    value: 4 gal
`;

const FIX = `---
id: fix-01
type: fixnode
title: Polisher jerks, walks, or hops side to side
audience: [owner, crew]
visibility: internal
status: house
kbRef: "21"
group: machine
sayIt: [jerking, hopping]
causes:
  - Pad tilted onto an edge
steps:
  - Re-center the pad
related: [card-bucket-mix]
---
Optional extra notes.
`;

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'mc-content-'));
});

afterEach(() => {
  rmSync(root, { recursive: true, force: true });
});

const generated = (file: string) => join(root, GENERATED_DIR, file);

describe('content build', () => {
  it('succeeds with no content/ folder at all, says 0 items, and writes the three files', () => {
    const r = buildContent({ root });
    expect(r.ok).toBe(true);
    expect(r.stats.items).toBe(0);
    expect(r.notes.join(' ')).toMatch(/0 items/);
    expect(r.notes.join(' ')).toMatch(/search-cases\.yaml not found/);
    for (const f of Object.values(OUTPUT_FILES)) expect(existsSync(generated(f))).toBe(true);
    expect(JSON.parse(readFileSync(generated(OUTPUT_FILES.bundle), 'utf8'))).toEqual({ version: 1, items: [], signOffs: [], synonyms: [] });
  });

  it('succeeds on an empty content/ folder', () => {
    mkdirSync(join(root, 'content'));
    const r = buildContent({ root });
    expect(r.ok).toBe(true);
    expect(r.stats.items).toBe(0);
  });

  it('builds YAML and Markdown items, puts the body in its field, and indexes them', () => {
    put('content/cards/card-bucket-mix.yaml', CARD);
    put('content/fixit/fix-01.md', FIX);
    put('content/cards/.gitkeep', '');
    const r = buildContent({ root });
    expect(r.problems).toEqual([]);
    expect(r.stats).toMatchObject({ items: 2, searchIndexDocs: 2, byType: { quickcard: 1, fixnode: 1 } });
    const fix = r.bundle.items.find((i) => i.id === 'fix-01');
    expect(fix?.type === 'fixnode' && fix.body).toBe('Optional extra notes.');
  });

  it('fails with the file and field named, and writes nothing, on an invalid file', () => {
    put('content/cards/card-bucket-mix.yaml', CARD.replace('kind: mix', 'kind: mix\ncolour: red').replace('kbRef: "4"', 'kbRef: 8.1'));
    const r = buildContent({ root });
    expect(r.ok).toBe(false);
    expect(r.problems.some((p) => p.startsWith('content/cards/card-bucket-mix.yaml:') && p.includes('colour'))).toBe(true);
    expect(r.problems.some((p) => p.includes('kbRef') && p.includes('quote it'))).toBe(true);
    expect(existsSync(join(root, GENERATED_DIR))).toBe(false);
  });

  it('refuses a broken related reference', () => {
    put('content/fixit/fix-01.md', FIX);
    const r = buildContent({ root });
    expect(r.problems).toContainEqual('content/fixit/fix-01.md: related[0]: Points to "card-bucket-mix", which does not exist');
  });

  it('refuses a Markdown body field set in the front matter, and a file in the wrong folder', () => {
    put('content/fixit/fix-01.md', FIX.replace('group: machine', 'group: machine\nbody: notes here'));
    put('content/products/card-bucket-mix.yaml', CARD);
    const r = buildContent({ root });
    expect(r.problems).toContain('content/fixit/fix-01.md: body: put this text in the body');
    expect(r.problems).toContain('content/products/card-bucket-mix.yaml: this quickcard file belongs at content/cards/card-bucket-mix.yaml');
  });

  it('refuses a customer-safe item with status verify, and literal [VERIFY text in a customer-safe item', () => {
    put('content/cards/card-bucket-mix.yaml', CARD.replace('visibility: internal', 'visibility: customer-safe').replace('status: house', 'status: verify'));
    put('content/cards/card-clay-tub.yaml', CARD.replace(/card-bucket-mix/g, 'card-clay-tub').replace('visibility: internal', 'visibility: customer-safe').replace('value: 4 gal', 'value: "4 gal [VERIFY]"'));
    const r = buildContent({ root });
    expect(r.ok).toBe(false);
    expect(r.problems.some((p) => p.startsWith('content/cards/card-bucket-mix.yaml') && p.includes('status is verify'))).toBe(true);
    expect(r.problems.some((p) => p.startsWith('content/cards/card-clay-tub.yaml') && p.includes('[VERIFY'))).toBe(true);
  });

  it('refuses a duplicate id, a dangling superseded item, and .yml files', () => {
    put('content/cards/card-bucket-mix.yaml', CARD.replace('status: house', 'status: superseded'));
    put('content/cards/card-old.yml', CARD);
    const r = buildContent({ root });
    expect(r.problems.some((p) => p.includes('Superseded, but no item names it'))).toBe(true);
    expect(r.problems.some((p) => p.includes('card-old.yml') && p.includes('.yaml'))).toBe(true);
  });

  it('two files with the same id (DEF-06): the duplicate is named and left out, nothing throws, nothing is written', () => {
    put('content/cards/card-bucket-mix.yaml', CARD);
    put('content/cards/card-bucket-mix-copy.yaml', CARD);
    let r: ReturnType<typeof buildContent> | null = null;
    expect(() => {
      r = buildContent({ root });
    }).not.toThrow();
    const result = r as unknown as ReturnType<typeof buildContent>;
    expect(result.ok).toBe(false);
    const dupes = result.problems.filter((p) => p.includes('Duplicate id "card-bucket-mix"'));
    expect(dupes).toHaveLength(1);
    expect(dupes[0]).toMatch(/card-bucket-mix(-copy)?\.yaml: id: .*already uses it, so this file was left out/);
    expect(dupes[0]).toContain('card-bucket-mix-copy.yaml');
    expect(result.bundle.items.map((i) => i.id)).toEqual(['card-bucket-mix']);
    expect(result.problems.some((p) => /MiniSearch|stack|at Object\./.test(p))).toBe(false);
    expect(existsSync(join(root, GENERATED_DIR))).toBe(false);
  });

  it('leaves superseded items out of the bundle and the index', () => {
    put('content/cards/card-bucket-mix.yaml', CARD.replace('status: house', 'status: superseded'));
    put('content/cards/card-bucket-mix-v2.yaml', CARD.replace(/card-bucket-mix/g, 'card-bucket-mix-v2').replace('kind: mix', 'kind: mix\nsupersedes: card-bucket-mix'));
    const r = buildContent({ root });
    expect(r.problems).toEqual([]);
    expect(r.bundle.items.map((i) => i.id)).toEqual(['card-bucket-mix-v2']);
    expect(r.stats.supersededLeftOut).toBe(1);
    expect(r.stats.searchIndexDocs).toBe(1);
  });

  it('runs tests/search-cases.yaml: passes when the top result is expected, fails with the query named when not', () => {
    put('content/cards/card-bucket-mix.yaml', CARD);
    put('content/fixit/fix-01.md', FIX);
    put('tests/search-cases.yaml', 'version: 1\ncases:\n  - { query: jerking, expect: [fix-01] }\n  - { query: bucket mix, expect: [card-bucket-mix] }\n');
    const ok = buildContent({ root, write: false });
    expect(ok.problems).toEqual([]);
    expect(ok.stats.searchCases).toMatchObject({ found: true, count: 2, passed: 2 });
    expect(ok.notes.join(' ')).toMatch(/requires 45/);

    put('tests/search-cases.yaml', 'version: 1\ncases:\n  - { query: bucket mix, expect: [fix-01] }\n  - { query: x, expect: [fix-77] }\n');
    const bad = buildContent({ root, write: false });
    expect(bad.problems.some((p) => p.includes('expects "fix-77", which does not exist'))).toBe(true);
  });

  it('fails a wrong top result, and enforces the 45-case minimum when asked (Phase 2)', () => {
    put('content/cards/card-bucket-mix.yaml', CARD);
    put('content/fixit/fix-01.md', FIX);
    put('tests/search-cases.yaml', 'version: 1\ncases:\n  - { query: bucket mix, expect: [fix-01] }\n');
    const r = buildContent({ root, write: false, enforceMinSearchCases: true });
    expect(r.problems.some((p) => p.includes('"bucket mix": expected fix-01 on top, got "card-bucket-mix"'))).toBe(true);
    expect(r.problems.some((p) => p.includes('requires 45'))).toBe(true);
  });

  it('reads synonyms when present and refuses a malformed synonym file', () => {
    put('content/cards/card-bucket-mix.yaml', CARD);
    put('content/search/synonyms.yaml', 'version: 1\ngroups:\n  - words: [bucket, pail]\n');
    const ok = buildContent({ root, write: false });
    expect(ok.stats.synonymGroups).toBe(1);
    put('content/search/synonyms.yaml', 'version: 1\ngroups:\n  - words: [lonely]\n');
    expect(buildContent({ root, write: false }).ok).toBe(false);
  });
});
