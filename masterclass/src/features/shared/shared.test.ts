// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { SEARCH_TYPES } from '../../core/searchEngine';
import { CONTENT_TYPES } from '../../schemas';
import { hasPage, pageRoute, uniqueIds } from './contentRoutes';
import { inlineText, parseInline, parseMarkdown } from './markdown';
import { isPendingText, sentence, speakable, spokenLine } from './speechText';
import { plainDate } from './format';

describe('content routes: every search result opens a real page', () => {
  it('gives every searchable type a page', () => {
    expect(SEARCH_TYPES.filter((type) => !hasPage(type))).toEqual([]);
  });

  it('keeps drills, quiz questions, and flashcards out of search, and gives them no page yet', () => {
    for (const type of ['drill', 'quizquestion', 'flashcard'] as const) {
      expect(SEARCH_TYPES).not.toContain(type);
      expect(pageRoute({ id: `${type}-x`, type })).toBeNull();
    }
  });

  it('a type with no page is never searchable', () => {
    const withoutPage = CONTENT_TYPES.filter((type) => !hasPage(type));
    expect(withoutPage.length).toBeGreaterThan(0);
    expect(withoutPage.filter((type) => SEARCH_TYPES.includes(type))).toEqual([]);
  });

  it('builds the address for each page type and encodes the id', () => {
    expect(pageRoute({ id: 'fix-01', type: 'fixnode' })).toBe('/fixit/fix-01');
    expect(pageRoute({ id: 'card-a', type: 'quickcard' })).toBe('/cards/card-a');
    expect(pageRoute({ id: 'lesson-l0-01-a', type: 'lesson' })).toBe('/academy/lesson-l0-01-a');
    expect(pageRoute({ id: 'sop-wash', type: 'sop' })).toBe('/sops/sop-wash');
    for (const type of ['product', 'equipment', 'glossaryterm'] as const) expect(pageRoute({ id: 'x-1', type })).toBe('/items/x-1');
    expect(pageRoute({ id: 'a b/c', type: 'product' })).toBe('/items/a%20b%2Fc');
  });

  it('dedupes ids in order and drops blanks and the page itself', () => {
    expect(uniqueIds(['b', undefined, 'a', '', 'b', 'self', 'c'], 'self')).toEqual(['b', 'a', 'c']);
    expect(uniqueIds([])).toEqual([]);
  });
});

describe('speech text', () => {
  it('spells out units and ends sentences', () => {
    expect(speakable('Reads 100 µm on a 2 x 2 ft square')).toBe('Reads 100 microns on a 2 by 2 feet square');
    expect(sentence('Re-center the pad')).toBe('Re-center the pad.');
    expect(sentence('Ready?')).toBe('Ready?');
    expect(sentence('   ')).toBe('');
  });

  it('marks unverified lines, never pending ones, and never inside an unverified item', () => {
    expect(spokenLine({ text: 'Hold it', status: 'verify' }, 'house')).toBe('Unverified. Hold it.');
    expect(spokenLine({ text: 'Lando decides (pending)', status: 'verify' }, 'house')).toBe('Lando decides (pending).');
    expect(spokenLine({ text: 'Hold it', status: 'verify' }, 'verify')).toBe('Hold it.');
    expect(spokenLine('Plain line', 'house')).toBe('Plain line.');
    expect(isPendingText('What crew does next: Lando decides (Pending)')).toBe(true);
    expect(isPendingText('Pending work')).toBe(false);
  });
});

describe('markdown', () => {
  it('reads headings, paragraphs, bold, lists, quotes, and tables', () => {
    const blocks = parseMarkdown(
      '**Goal:** One line.\n\n## Why\n\nA **bold** word and *soft* one\nwrapped.\n\n- one\n- two\n  more\n\n1. first\n2. second\n\n> Said out loud.\n\n| A | B |\n|---|---|\n| x | y |\n| z | w |',
    );
    expect(blocks.map((b) => b.kind)).toEqual(['paragraph', 'heading', 'paragraph', 'list', 'list', 'quote', 'table']);
    const para = blocks[2];
    if (para?.kind !== 'paragraph') throw new Error('expected a paragraph');
    expect(inlineText(para.inlines)).toBe('A bold word and soft one wrapped.');
    expect(para.inlines.find((p) => p.strong)?.text).toBe('bold');
    expect(para.inlines.find((p) => p.em)?.text).toBe('soft');
    const bullets = blocks[3];
    if (bullets?.kind !== 'list') throw new Error('expected a list');
    expect(bullets.ordered).toBe(false);
    expect(bullets.items.map(inlineText)).toEqual(['one', 'two more']);
    const table = blocks[6];
    if (table?.kind !== 'table') throw new Error('expected a table');
    expect(table.header.map(inlineText)).toEqual(['A', 'B']);
    expect(table.rows.map((row) => row.map(inlineText))).toEqual([
      ['x', 'y'],
      ['z', 'w'],
    ]);
  });

  it('keeps link words, drops the address, and never loses text', () => {
    expect(inlineText(parseInline('See [the manual](https://example.com) now'))).toBe('See the manual now');
    expect(inlineText(parseInline('2 * 3 = 6 and a lone ** pair'))).toBe('2 * 3 = 6 and a lone ** pair');
    expect(inlineText(parseInline('<script>alert(1)</script>'))).toBe('<script>alert(1)</script>');
  });

  it('gives nothing for empty text', () => {
    expect(parseMarkdown('')).toEqual([]);
    expect(parseMarkdown('  \n\n ')).toEqual([]);
  });
});

describe('plain dates', () => {
  it('writes ISO dates in words and leaves anything else alone', () => {
    expect(plainDate('2026-10-07')).toBe('Oct 7, 2026');
    expect(plainDate('soon')).toBe('soon');
  });
});
