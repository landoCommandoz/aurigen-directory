/**
 * A small Markdown reader for the bodies the content writers use (lesson "why", procedure and fix
 * bodies): headings, paragraphs, bold and italic, bulleted and numbered lists, quotes, and pipe
 * tables. It returns plain data; Markdown.tsx turns it into React elements, so no HTML string is
 * ever injected. Anything it does not know is kept as plain text, never dropped.
 * Links keep their words only: the app is offline-first, and a link inside a paragraph would be a
 * tap target under 44 px. Pure: no React, no DOM.
 */

export interface Inline {
  text: string;
  strong?: boolean;
  em?: boolean;
  code?: boolean;
}

export type MdBlock =
  | { kind: 'heading'; depth: number; inlines: Inline[] }
  | { kind: 'paragraph'; inlines: Inline[] }
  | { kind: 'list'; ordered: boolean; start: number; items: Inline[][] }
  | { kind: 'quote'; inlines: Inline[] }
  | { kind: 'table'; header: Inline[][]; rows: Inline[][][] };

const INLINE = /\*\*([^*]+)\*\*|__([^_]+)__|\*([^*\s][^*]*?)\*|`([^`]+)`|\[([^\]]+)\]\([^)\s]*\)/g;

/** Bold, italic, code, and link words; everything else is plain text. */
export function parseInline(text: string): Inline[] {
  const out: Inline[] = [];
  let at = 0;
  for (const match of text.matchAll(INLINE)) {
    const index = match.index;
    if (index > at) out.push({ text: text.slice(at, index) });
    const [, strong, strong2, em, code, link] = match;
    if (strong !== undefined || strong2 !== undefined) out.push({ text: strong ?? strong2 ?? '', strong: true });
    else if (em !== undefined) out.push({ text: em, em: true });
    else if (code !== undefined) out.push({ text: code, code: true });
    else out.push({ text: link ?? '' });
    at = index + match[0].length;
  }
  if (at < text.length) out.push({ text: text.slice(at) });
  return out.filter((part) => part.text !== '');
}

/** The words of a run of inlines, for search, tests, and speech. */
export function inlineText(inlines: readonly Inline[]): string {
  return inlines.map((part) => part.text).join('');
}

const HEADING = /^(#{1,6})\s+(.+?)\s*#*\s*$/;
const BULLET = /^\s*[-*+]\s+(.*)$/;
const NUMBERED = /^\s*(\d{1,3})[.)]\s+(.*)$/;
const QUOTE = /^\s*>\s?(.*)$/;
const TABLE_ROW = /^\s*\|.*\|\s*$/;
const TABLE_RULE = /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/;

function cells(line: string): Inline[][] {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => parseInline(cell.trim()));
}

/** Parse a Markdown body into blocks. Empty or blank text gives []. */
export function parseMarkdown(source: string): MdBlock[] {
  const lines = source.replace(/\r\n?/g, '\n').split('\n');
  const blocks: MdBlock[] = [];
  let paragraph: string[] = [];
  let list: { ordered: boolean; start: number; items: string[] } | null = null;
  let quote: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length > 0) blocks.push({ kind: 'paragraph', inlines: parseInline(paragraph.join(' ')) });
    paragraph = [];
  };
  const flushList = () => {
    if (list !== null) blocks.push({ kind: 'list', ordered: list.ordered, start: list.start, items: list.items.map(parseInline) });
    list = null;
  };
  const flushQuote = () => {
    if (quote.length > 0) blocks.push({ kind: 'quote', inlines: parseInline(quote.join(' ')) });
    quote = [];
  };
  const flushAll = () => {
    flushParagraph();
    flushList();
    flushQuote();
  };

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i] ?? '';
    if (line.trim() === '') {
      flushAll();
      continue;
    }
    const heading = HEADING.exec(line);
    if (heading !== null) {
      flushAll();
      blocks.push({ kind: 'heading', depth: heading[1]?.length ?? 2, inlines: parseInline(heading[2] ?? '') });
      continue;
    }
    if (TABLE_ROW.test(line) && TABLE_RULE.test(lines[i + 1] ?? '')) {
      flushAll();
      const header = cells(line);
      const rows: Inline[][][] = [];
      i += 2;
      while (i < lines.length && TABLE_ROW.test(lines[i] ?? '')) {
        rows.push(cells(lines[i] ?? ''));
        i += 1;
      }
      i -= 1;
      blocks.push({ kind: 'table', header, rows });
      continue;
    }
    const quoted = QUOTE.exec(line);
    if (quoted !== null) {
      flushParagraph();
      flushList();
      quote.push((quoted[1] ?? '').trim());
      continue;
    }
    const bullet = BULLET.exec(line);
    const numbered = bullet === null ? NUMBERED.exec(line) : null;
    if (bullet !== null || numbered !== null) {
      flushParagraph();
      flushQuote();
      const ordered = numbered !== null;
      const text = (bullet?.[1] ?? numbered?.[2] ?? '').trim();
      if (list === null || list.ordered !== ordered) {
        flushList();
        list = { ordered, start: ordered ? Number(numbered?.[1] ?? 1) : 1, items: [] };
      }
      list.items.push(text);
      continue;
    }
    // An indented line right after a list item continues that item.
    const openList: { items: string[] } | null = list;
    if (openList !== null && /^\s+\S/.test(line) && openList.items.length > 0) {
      const last = openList.items.length - 1;
      openList.items[last] = `${openList.items[last] ?? ''} ${line.trim()}`;
      continue;
    }
    flushList();
    flushQuote();
    paragraph.push(line.trim());
  }
  flushAll();
  return blocks;
}
