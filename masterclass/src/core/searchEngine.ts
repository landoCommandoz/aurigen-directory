/**
 * The search engine, shared by the content build (Node) and the app, so the index the build
 * writes and the queries the phone runs use the same rules (D1, D2). Pure: no DOM, no Vite.
 *
 * - Fields: title, synonyms, tags, body. Title is boosted, then synonyms (the "say it" words).
 * - Prefix and fuzzy 0.2 (fuzzy only on words of 4 letters or more, so short words stay exact).
 * - Synonyms from content/search/synonyms.yaml are expanded at index time: when a document holds
 *   any word or phrase of a group, every word of the group is added to it. MiniSearch has no
 *   built-in synonyms; expanding the document means any query word finds it.
 * - Results that match more of the query words rank higher; Fix It and Quick Cards get a small lift.
 */
import MiniSearch, { type AsPlainObject, type Options, type SearchResult } from 'minisearch';
import {
  lineText,
  visibleLines,
  type ContentItemValue,
  type ContentTypeName,
  type LineValue,
  type StatusName,
  type SynonymFileValue,
} from '../schemas';

export type SynonymGroups = SynonymFileValue['groups'];

export const SEARCH_FIELDS = ['title', 'synonyms', 'tags', 'body'] as const;
/** say: the item's own say-it phrases and title, normalized, one per line, for the exact-phrase bonus. */
export const SEARCH_STORE_FIELDS = ['type', 'title', 'status', 'say'] as const;

/** Quiz questions and flashcards are left out: they would surface answers and crowd the garage results. */
export const SEARCH_TYPES: readonly ContentTypeName[] = [
  'fixnode',
  'quickcard',
  'sop',
  'lesson',
  'product',
  'equipment',
  'glossaryterm',
  'drill',
  'policy',
  'script',
  'priceitem',
];

export const FIELD_BOOST = { title: 3, synonyms: 2.2, tags: 1.4, body: 1 } as const;
const TYPE_BOOST: Partial<Record<ContentTypeName, number>> = { fixnode: 1.25, quickcard: 1.2, sop: 1.05, priceitem: 0.7, script: 0.85 };

export interface SearchDoc {
  id: string;
  type: ContentTypeName;
  title: string;
  status: StatusName;
  say: string;
  synonyms: string;
  tags: string;
  body: string;
}

/** An exact say-it phrase (or the title) beats a scattered match; a multi-word title match helps too. */
const PHRASE_BONUS = { exact: 1.8, inTitle: 1.3 } as const;

export interface SearchHit {
  id: string;
  type: ContentTypeName;
  title: string;
  status: StatusName;
  score: number;
}

const STOP_WORDS = new Set(['a', 'an', 'the', 'and', 'or', 'of', 'to', 'in', 'on', 'at', 'for', 'is', 'it', 'its', 'my', 'i', 'me', 'be', 'are', 'was', 'this', 'that', 'do', 'does', 'how', 'what', 'why']);

/** Lowercase, strip accents and apostrophes, keep letters and digits. */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export function tokenize(text: string): string[] {
  const clean = normalizeText(text);
  return clean === '' ? [] : clean.split(' ');
}

export function processTerm(term: string): string | null {
  const t = normalizeText(term);
  if (t === '' || STOP_WORDS.has(t)) return null;
  if (t.length === 1 && !/\d/.test(t)) return null;
  return t;
}

export function searchOptions(): Options<SearchDoc> {
  return {
    idField: 'id',
    fields: [...SEARCH_FIELDS],
    storeFields: [...SEARCH_STORE_FIELDS],
    tokenize,
    processTerm,
    searchOptions: {
      boost: { ...FIELD_BOOST },
      prefix: (term) => term.length >= 2,
      fuzzy: (term) => (term.length >= 4 ? 0.2 : false),
      combineWith: 'OR',
    },
  };
}

/* ---------- Documents ---------- */

function lines(values: readonly LineValue[] | undefined, status: StatusName): string[] {
  return values === undefined ? [] : visibleLines(values, status).map(lineText);
}

function rows(values: ReadonlyArray<{ label: string; value: string; status?: StatusName | undefined }>, status: StatusName): string[] {
  return values.filter((r) => (r.status ?? status) !== 'superseded').map((r) => `${r.label} ${r.value}`);
}

/** The say-it words of an item: synonyms plus each type's own spoken words. */
function sayWords(item: ContentItemValue): string[] {
  const words = [...item.synonyms];
  if (item.type === 'fixnode') words.push(...item.sayIt);
  if (item.type === 'glossaryterm') words.push(item.term, ...item.alsoCalled);
  return words;
}

/** Everything else a person might search for, superseded lines left out. */
function bodyText(item: ContentItemValue): string[] {
  const s = item.status;
  switch (item.type) {
    case 'fixnode':
      return [...lines(item.stopIf, s), ...lines(item.checks, s), ...lines(item.causes, s), ...lines(item.steps, s), ...lines(item.stillHappening, s), ...lines(item.notes, s), item.body];
    case 'lesson':
      return [item.why, ...lines(item.steps, s), ...rows(item.numbers, s), ...lines(item.mistakes, s)];
    case 'sop':
      return [item.body, ...item.steps.filter((st) => (st.status ?? s) !== 'superseded').map((st) => st.text)];
    case 'quickcard':
      return rows(item.rows, s);
    case 'product':
      return [item.brand, ...item.jobs, ...item.dilutions.filter((d) => d.status !== 'superseded').map((d) => `${d.use} ${d.ratio}`), ...item.neverFor, item.labelNotes ?? ''];
    case 'equipment':
      return [item.model ?? '', ...rows(item.specs, s), ...lines(item.checks, s)];
    case 'glossaryterm':
      return [item.definition];
    case 'drill':
      return [...item.needs, ...lines(item.instructions, s), item.body];
    case 'policy':
    case 'script':
      return [item.text];
    case 'quizquestion':
      return [item.prompt];
    case 'flashcard':
      return [item.front, item.back];
    case 'priceitem':
      return [item.kind, item.vehicleType, item.size];
    default: {
      const unreachable: never = item;
      return [String(unreachable)];
    }
  }
}

function groupsFound(paddedText: string, groups: SynonymGroups): Set<number> {
  const found = new Set<number>();
  groups.forEach((group, index) => {
    if (group.words.some((word) => {
      const phrase = normalizeText(word);
      return phrase !== '' && paddedText.includes(` ${phrase} `);
    })) {
      found.add(index);
    }
  });
  return found;
}

/** One search document per item, with synonym groups expanded into it. */
export function toSearchDoc(item: ContentItemValue, groups: SynonymGroups): SearchDoc {
  const say = sayWords(item);
  const body = bodyText(item).filter((t) => t !== '');
  const primary = ` ${normalizeText([item.title, ...say, ...item.tags].join(' '))} `;
  const secondary = ` ${normalizeText(body.join(' '))} `;
  const inPrimary = groupsFound(primary, groups);
  const inBody = groupsFound(secondary, groups);
  const expand = (indexes: Iterable<number>) => [...indexes].flatMap((i) => groups[i]?.words ?? []);
  return {
    id: item.id,
    type: item.type,
    title: item.title,
    status: item.status,
    say: [...new Set([item.title, ...say].map(normalizeText).filter((t) => t !== ''))].join('\n'),
    synonyms: [...say, ...expand(inPrimary)].join(' \n '),
    tags: item.tags.join(' \n '),
    body: [...body, ...expand([...inBody].filter((i) => !inPrimary.has(i)))].join(' \n '),
  };
}

export function toSearchDocs(items: readonly ContentItemValue[], groups: SynonymGroups): SearchDoc[] {
  return items.filter((item) => item.status !== 'superseded' && SEARCH_TYPES.includes(item.type)).map((item) => toSearchDoc(item, groups));
}

export function buildSearchIndex(items: readonly ContentItemValue[], groups: SynonymGroups): MiniSearch<SearchDoc> {
  const index = new MiniSearch<SearchDoc>(searchOptions());
  index.addAll(toSearchDocs(items, groups));
  return index;
}

/** Load the index the content build wrote (src/generated/search-index.json). */
export function loadSearchIndex(json: AsPlainObject): MiniSearch<SearchDoc> {
  return MiniSearch.loadJS<SearchDoc>(json, searchOptions());
}

/* ---------- Querying ---------- */

/** "FIX-01", "fix 1", "fix01" all name fix-01. */
function idFromQuery(query: string): string | null {
  const m = /^\s*([a-z]+)[\s-]*0*(\d{1,3})\s*$/i.exec(query);
  if (m?.[1] === undefined || m[2] === undefined) return null;
  return `${m[1].toLowerCase()}-${m[2].padStart(2, '0')}`;
}

export interface RunSearchOptions {
  limit?: number;
  types?: readonly ContentTypeName[];
}

export function runSearch(index: MiniSearch<SearchDoc>, query: string, opts: RunSearchOptions = {}): SearchHit[] {
  const limit = opts.limit ?? 20;
  const terms = new Set(tokenize(query).map(processTerm).filter((t): t is string => t !== null));
  if (terms.size === 0) return [];
  const results: SearchResult[] = index.search(query, {
    boostDocument: (_id, _term, stored) => TYPE_BOOST[stored?.type as ContentTypeName] ?? 1,
    ...(opts.types === undefined ? {} : { filter: (r) => opts.types?.includes(r.type as ContentTypeName) === true }),
  });
  const phrase = normalizeText(query);
  const hits = results.map((r) => {
    const coverage = new Set(r.queryTerms).size / terms.size;
    const say = typeof r.say === 'string' ? r.say.split('\n') : [];
    const title = normalizeText(String(r.title));
    const bonus = say.includes(phrase) ? PHRASE_BONUS.exact : phrase.includes(' ') && title.includes(phrase) ? PHRASE_BONUS.inTitle : 1;
    return {
      id: String(r.id),
      type: r.type as ContentTypeName,
      title: String(r.title),
      status: r.status as StatusName,
      score: r.score * (0.5 + coverage) * bonus,
    };
  });
  hits.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
  const named = idFromQuery(query);
  if (named !== null && index.has(named)) {
    const at = hits.findIndex((h) => h.id === named);
    if (at > 0) hits.unshift(...hits.splice(at, 1));
    if (at < 0) {
      const stored = index.getStoredFields(named);
      const type = stored?.type as ContentTypeName | undefined;
      if (stored !== undefined && type !== undefined && (opts.types === undefined || opts.types.includes(type))) {
        hits.unshift({ id: named, type, title: String(stored.title), status: stored.status as StatusName, score: (hits[0]?.score ?? 0) + 1 });
      }
    }
  }
  return hits.slice(0, limit);
}
