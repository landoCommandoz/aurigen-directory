// @vitest-environment node
/**
 * The customerSafe filter (BLUEPRINT 3.4 and 7) and the content build's refusal of a customer-safe
 * item that is not safe (BUILD_PROMPT 9 item 11), run on a temporary content folder so the real
 * content/ is never touched.
 */
import { mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { stringify } from 'yaml';
import { buildContent } from '../../scripts/content/pipeline';
import { customerSafe, showUnverifiedBadge } from '../../src/core/customerSafe';
import { ContentItem, type ContentItemValue } from '../../src/schemas';
import { customerSafe as safeRaw, VALID } from '../fixtures/content';

const ROOT = resolve(__dirname, '..', '..');
const parse = (raw: Record<string, unknown>): ContentItemValue => ContentItem.parse(raw);
const confirmed = [{ label: 'Label', date: '2026-10-01', confirmedOn: '2026-10-02', confirmedBy: 'fact-checker' }];
const unconfirmed = [{ label: 'Label', date: '2026-10-01' }];

describe('customerSafe(items)', () => {
  const cases: Array<[string, Record<string, unknown>, boolean]> = [
    ['an internal house card', { ...VALID.quickcard }, false],
    ['a customer-safe house card', safeRaw('quickcard'), true],
    ['a customer-safe verify card', safeRaw('quickcard', { status: 'verify' }), false],
    ['a customer-safe superseded card', safeRaw('quickcard', { status: 'superseded' }), false],
    ['a customer-safe sourced card with no confirmed source', safeRaw('quickcard', { status: 'sourced', sources: unconfirmed }), false],
    ['a customer-safe sourced card with a fact-checker confirmation', safeRaw('quickcard', { status: 'sourced', sources: confirmed }), true],
    ['a customer-safe house card with one verify row', safeRaw('quickcard', { rows: [{ label: 'Water', value: '4 gal' }, { label: 'Soap', value: '1 oz', status: 'verify' }] }), false],
    ['a customer-safe house card with one superseded row', safeRaw('quickcard', { rows: [{ label: 'Water', value: '4 gal', status: 'superseded' }] }), false],
    ['a customer-safe house card whose text says [VERIFY]', safeRaw('quickcard', { rows: [{ label: 'Water', value: '4 gal [VERIFY]' }] }), false],
    ['a customer-safe house card whose title says [superseded', safeRaw('quickcard', { title: 'Old mix [superseded' }), false],
    ['a customer-safe house card with a sourced row and no confirmed source', safeRaw('quickcard', { rows: [{ label: 'Water', value: '4 gal', status: 'sourced' }] }), false],
    ['a customer-safe fix with a verify line', safeRaw('fixnode', { steps: ['Stop', { text: 'Use 6', status: 'verify' }] }), false],
    ['a customer-safe product with a verify dilution', safeRaw('product', { dilutions: [{ use: 'Wash', ratio: '1:10', status: 'verify' }] }), false],
    ['a customer-safe policy', safeRaw('policy'), true],
    ['a customer-safe script', safeRaw('script'), true],
    ['a customer-safe quote-unit price item marked verify (two-step)', safeRaw('priceitem', { status: 'verify', unit: 'quote', amount: undefined }), false],
  ];
  for (const [name, raw, keep] of cases) {
    it(`${keep ? 'keeps' : 'drops'} ${name}`, () => {
      expect(customerSafe([parse(raw)]).length).toBe(keep ? 1 : 0);
    });
  }

  it('keeps the order of the items it keeps and never adds any', () => {
    const items = [parse(safeRaw('policy')), parse(VALID.quickcard), parse(safeRaw('script'))];
    expect(customerSafe(items).map((i) => i.id)).toEqual([VALID.policy.id, VALID.script.id]);
    expect(customerSafe([])).toEqual([]);
  });

  it('the unverified badge shows on a verify item only, and never in Customer View', () => {
    const verify = parse({ ...VALID.quickcard, status: 'verify' });
    expect(showUnverifiedBadge(verify, false)).toBe(true);
    expect(showUnverifiedBadge(verify, true)).toBe(false);
    expect(showUnverifiedBadge(parse(VALID.quickcard), false)).toBe(false);
  });

  it('on the real Phase 1 content: nothing is customer-safe yet, and no verify item could ever pass', () => {
    const result = buildContent({ root: ROOT, write: false });
    expect(result.ok).toBe(true);
    const safe = customerSafe(result.bundle.items);
    expect(safe).toEqual([]);
    expect(result.stats.customerSafe).toBe(0);
    const verifyItems = result.bundle.items.filter((i) => i.status === 'verify');
    expect(verifyItems.length).toBeGreaterThan(0);
    expect(customerSafe(verifyItems.map((i) => ({ ...i, visibility: 'customer-safe' as const })))).toEqual([]);
  });
});

describe('the content build on a temporary content folder', () => {
  const dirs: string[] = [];
  afterEach(() => {
    for (const d of dirs.splice(0)) rmSync(d, { recursive: true, force: true });
  });

  function tempRoot(files: Record<string, string>): string {
    const root = mkdtempSync(join(tmpdir(), 'mc-qa-content-'));
    dirs.push(root);
    for (const [rel, text] of Object.entries(files)) {
      const full = join(root, rel);
      mkdirSync(join(full, '..'), { recursive: true });
      writeFileSync(full, text, 'utf8');
    }
    return root;
  }

  const card = (raw: Record<string, unknown>) => stringify(raw);

  it('a valid internal card builds and writes src/generated/ inside the temp root only', () => {
    const root = tempRoot({ 'content/cards/card-fixture-mix.yaml': card(VALID.quickcard) });
    const result = buildContent({ root, write: true });
    expect(result.problems).toEqual([]);
    expect(result.ok).toBe(true);
    expect(readdirSync(join(root, 'src/generated')).sort()).toEqual(['content-stats.json', 'content.json', 'search-index.json']);
  });

  it('refuses a customer-safe item with status verify, names the file and the reason, and writes nothing', () => {
    const root = tempRoot({ 'content/cards/card-fixture-mix.yaml': card(safeRaw('quickcard', { status: 'verify' })) });
    const result = buildContent({ root, write: true });
    expect(result.ok).toBe(false);
    expect(result.problems.join('\n')).toMatch(/content\/cards\/card-fixture-mix\.yaml.*verify/);
    expect(existsSync(join(root, 'src/generated'))).toBe(false);
  });

  it.each([
    ['a verify row', { rows: [{ label: 'Water', value: '4 gal', status: 'verify' }] }],
    ['the text [VERIFY', { rows: [{ label: 'Water', value: '4 gal [VERIFY]' }] }],
    ['status sourced with no confirmed source', { status: 'sourced', sources: unconfirmed }],
  ])('refuses a customer-safe card with %s', (_name, extra) => {
    const root = tempRoot({ 'content/cards/card-fixture-mix.yaml': card(safeRaw('quickcard', extra)) });
    expect(buildContent({ root, write: false }).ok).toBe(false);
  });

  it('leaves a superseded item out of the bundle and the search index', () => {
    const root = tempRoot({
      'content/cards/card-fixture-mix.yaml': card({ ...VALID.quickcard, status: 'superseded' }),
      'content/cards/card-fixture-new.yaml': card({ ...VALID.quickcard, id: 'card-fixture-new', supersedes: 'card-fixture-mix' }),
    });
    const result = buildContent({ root, write: false });
    expect(result.problems).toEqual([]);
    expect(result.bundle.items.map((i) => i.id)).toEqual(['card-fixture-new']);
    expect(result.stats.supersededLeftOut).toBe(1);
  });

  it.each([
    ['an unknown field', 'content/cards/card-fixture-mix.yaml', card({ ...VALID.quickcard, colour: 'red' })],
    ['a file in the wrong folder', 'content/products/card-fixture-mix.yaml', card(VALID.quickcard)],
    ['a file named differently from its id', 'content/cards/card-other.yaml', card(VALID.quickcard)],
    ['a .yml extension', 'content/cards/card-fixture-mix.yml', card(VALID.quickcard)],
    ['broken YAML', 'content/cards/card-fixture-mix.yaml', 'id: card-fixture-mix\n  type: [quickcard'],
    ['a related id that does not exist', 'content/cards/card-fixture-mix.yaml', card({ ...VALID.quickcard, related: ['card-nowhere'] })],
    ['a lesson with a skillId and no sign-off file', 'content/lessons/lesson-l4-01-machine-control.md', '---\nid: lesson-l4-01-machine-control\ntype: lesson\ntitle: Machine control\naudience: [owner, crew]\nvisibility: internal\nstatus: house\nlevel: 4\norder: 1\nsteps: [Prime]\nskillId: skill-l4-machine-polishing\n---\nWhy it matters.\n'],
  ])('refuses %s', (_name, rel, text) => {
    const root = tempRoot({ [rel]: text });
    const result = buildContent({ root, write: true });
    expect(result.ok).toBe(false);
    expect(result.problems.length).toBeGreaterThan(0);
    expect(existsSync(join(root, 'src/generated'))).toBe(false);
  });

  it('accepts distinct ids across folders', () => {
    const root = tempRoot({
      'content/cards/card-fixture-mix.yaml': card(VALID.quickcard),
      'content/products/product-fixture-soap.yaml': card(VALID.product),
      'content/glossary/term-fixture.yaml': card(VALID.glossaryterm),
    });
    expect(buildContent({ root, write: false }).ok).toBe(true);
  });

  // DEF-06 (later): the duplicate is reported, but both copies still go into the search index, and
  // MiniSearch throws "duplicate ID". The CLI then prints "content build crashed" with a stack trace
  // instead of the plain list of problems. The build still exits 1 and writes nothing.
  it.fails('refuses two files with the same id with a plain problem, without crashing', () => {
    const root = tempRoot({
      'content/cards/card-fixture-mix.yaml': card(VALID.quickcard),
      'content/cards/card-fixture-mix-copy.yaml': card(VALID.quickcard),
    });
    let result: ReturnType<typeof buildContent> | null = null;
    expect(() => {
      result = buildContent({ root, write: true });
    }).not.toThrow();
    expect(result).not.toBeNull();
    expect((result as unknown as { ok: boolean }).ok).toBe(false);
    expect(existsSync(join(root, 'src/generated'))).toBe(false);
  });

  it('a search case whose expected top result is wrong fails the build', () => {
    const root = tempRoot({
      'content/cards/card-fixture-mix.yaml': card({ ...VALID.quickcard, title: 'Bucket mix', synonyms: ['bucket mix'] }),
      'content/cards/card-fixture-new.yaml': card({ ...VALID.quickcard, id: 'card-fixture-new', title: 'Clay lube' }),
      'tests/search-cases.yaml': stringify({ version: 1, cases: [{ query: 'bucket mix', expect: ['card-fixture-new'] }] }),
    });
    const result = buildContent({ root, write: false });
    expect(result.ok).toBe(false);
    expect(result.problems.join('\n')).toMatch(/bucket mix/);
  });
});
