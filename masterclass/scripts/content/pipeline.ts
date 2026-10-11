/**
 * The content build (D2, BLUEPRINT 7, src/schemas/README.md section 7, in that order):
 * 1. walk content/ (not content/search/ or content/academy/signoff/), .md and .yaml only;
 * 2. parse YAML, or Markdown front matter with the body in MARKDOWN_BODY_FIELD[type];
 * 3. check the path against expectedContentPath(type, id);
 * 4. parse with SCHEMA_BY_TYPE[type], reporting every issue;
 * 5. parse each sign-off criteria file; its name must equal its skillId;
 * 6. checkContentSet (references, duplicates, supersession, customer-safe rule, sign-off pairing);
 * 7. synonyms (absent means none yet) and tests/search-cases.yaml (absent means skipped);
 * 8. leave superseded items out; write src/generated/ only when everything passed.
 */
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import {
  CONTENT_TYPES,
  MARKDOWN_BODY_FIELD,
  MIN_SEARCH_CASES,
  SCHEMA_BY_TYPE,
  SEARCH_CASES_FILE,
  SIGNOFF_DIR,
  SYNONYMS_FILE,
  SearchCaseFile,
  SignOffCriteria,
  SynonymFile,
  checkContentSet,
  expectedContentPath,
  isCustomerRenderable,
  isRenderable,
  searchCaseReferenceProblems,
  type ContentItemValue,
  type ContentTypeName,
  type SignOffCriteriaItem,
  type SynonymFileValue,
} from '../../src/schemas';
import { CONTENT_BUNDLE_VERSION, type ContentBundle, type ContentStats } from '../../src/core/contentBundle';
import { buildSearchIndex, runSearch } from '../../src/core/searchEngine';
import { formatIssues, parseYamlMapping, splitFrontMatter, walkFiles, type Parsed } from './files';

/** Phase 2 turns this on: fewer than MIN_SEARCH_CASES cases then fails the build (README section 7). */
export const ENFORCE_MIN_SEARCH_CASES = false;

export interface BuildOptions {
  /** The masterclass/ folder. */
  root: string;
  /** Write src/generated/ when everything passed (default true). */
  write?: boolean;
  enforceMinSearchCases?: boolean;
  now?: () => string;
}

export interface BuildResult {
  ok: boolean;
  problems: string[];
  notes: string[];
  stats: ContentStats;
  bundle: ContentBundle;
  wrote: string[];
}

export const GENERATED_DIR = 'src/generated';
export const OUTPUT_FILES = { bundle: 'content.json', index: 'search-index.json', stats: 'content-stats.json' } as const;

const MD_TYPES = Object.keys(MARKDOWN_BODY_FIELD) as Array<keyof typeof MARKDOWN_BODY_FIELD>;
const REQUIRED_BODY = new Set(['why', 'text']);

function isContentType(value: unknown): value is ContentTypeName {
  return typeof value === 'string' && (CONTENT_TYPES as readonly string[]).includes(value);
}

/** Read and parse one content file into a raw object ready for its schema. */
function readContentFile(root: string, rel: string): Parsed {
  const ext = rel.endsWith('.md') ? 'md' : rel.endsWith('.yaml') ? 'yaml' : null;
  if (ext === null) {
    const hint = rel.endsWith('.yml') ? ' Rename it to .yaml.' : '';
    return { ok: false, problems: [`${rel}: only .md and .yaml files belong in content/.${hint}`] };
  }
  let text: string;
  try {
    text = readFileSync(join(root, rel), 'utf8');
  } catch (error) {
    return { ok: false, problems: [`${rel}: could not be read (${error instanceof Error ? error.message : String(error)})`] };
  }
  if (ext === 'yaml') {
    const parsed = parseYamlMapping(text);
    return parsed.ok ? parsed : { ok: false, problems: parsed.problems.map((p) => `${rel}: ${p}`) };
  }
  const split = splitFrontMatter(text);
  if (split === null) return { ok: false, problems: [`${rel}: a Markdown file starts with front matter between two "---" lines`] };
  const parsed = parseYamlMapping(split.front, 1);
  if (!parsed.ok) return { ok: false, problems: parsed.problems.map((p) => `${rel}: ${p}`) };
  const type = parsed.data.type;
  if (!isContentType(type) || !(MD_TYPES as string[]).includes(type)) return parsed; // the path check names the right format
  const field = MARKDOWN_BODY_FIELD[type as keyof typeof MARKDOWN_BODY_FIELD];
  if (field in parsed.data) return { ok: false, problems: [`${rel}: ${field}: put this text in the body`] };
  if (split.body === '' && REQUIRED_BODY.has(field)) {
    return { ok: false, problems: [`${rel}: ${field}: the body below the front matter is empty; write the ${field} text there`] };
  }
  return { ok: true, data: { ...parsed.data, [field]: split.body } };
}

function emptyStats(builtAt: string): ContentStats {
  return {
    version: CONTENT_BUNDLE_VERSION,
    builtAt,
    files: 0,
    items: 0,
    byType: {},
    byStatus: {},
    customerSafe: 0,
    supersededLeftOut: 0,
    signOffs: 0,
    synonymGroups: 0,
    searchCases: { found: false, count: 0, passed: 0, minimum: MIN_SEARCH_CASES, enforced: false },
    searchIndexDocs: 0,
    notes: [],
  };
}

function writeAtomic(path: string, text: string): void {
  const temp = `${path}.tmp`;
  writeFileSync(temp, text, 'utf8');
  renameSync(temp, path);
}

export function buildContent(opts: BuildOptions): BuildResult {
  const { root } = opts;
  const write = opts.write ?? true;
  const enforceMin = opts.enforceMinSearchCases ?? ENFORCE_MIN_SEARCH_CASES;
  const stats = emptyStats((opts.now ?? (() => new Date().toISOString()))());
  stats.searchCases.enforced = enforceMin;
  const problems: string[] = [];
  const notes: string[] = [];

  /* 1 to 4: content items */
  const contentDirExists = existsSync(join(root, 'content'));
  if (!contentDirExists) notes.push('content/ does not exist yet: 0 items.');
  const files = contentDirExists ? walkFiles(root, 'content', ['content/search', `content/${SIGNOFF_DIR}`]) : [];
  stats.files = files.length;
  const items: ContentItemValue[] = [];
  const fileOf = new Map<string, string>();
  for (const rel of files) {
    const parsed = readContentFile(root, rel);
    if (!parsed.ok) {
      problems.push(...parsed.problems);
      continue;
    }
    const { type, id } = parsed.data;
    if (!isContentType(type)) {
      problems.push(`${rel}: type: must be one of ${CONTENT_TYPES.join(', ')}`);
      continue;
    }
    if (typeof id === 'string') {
      const expected = expectedContentPath(type, id);
      if (expected !== rel) problems.push(`${rel}: this ${type} file belongs at ${expected}`);
    }
    const result = SCHEMA_BY_TYPE[type].safeParse(parsed.data);
    if (!result.success) {
      problems.push(...formatIssues(rel, result.error));
      continue;
    }
    const item = result.data as ContentItemValue;
    if (fileOf.has(item.id)) problems.push(`${rel}: id: Duplicate id "${item.id}": ${fileOf.get(item.id)} already uses it`);
    else fileOf.set(item.id, rel);
    items.push(item);
  }

  /* 5: sign-off criteria */
  const signOffs: SignOffCriteriaItem[] = [];
  const signOffFiles = walkFiles(root, `content/${SIGNOFF_DIR}`, []);
  for (const rel of signOffFiles) {
    if (!rel.endsWith('.yaml')) {
      problems.push(`${rel}: sign-off criteria files are .yaml`);
      continue;
    }
    let text = '';
    try {
      text = readFileSync(join(root, rel), 'utf8');
    } catch {
      problems.push(`${rel}: could not be read`);
      continue;
    }
    const parsed = parseYamlMapping(text);
    if (!parsed.ok) {
      problems.push(...parsed.problems.map((p) => `${rel}: ${p}`));
      continue;
    }
    const result = SignOffCriteria.safeParse(parsed.data);
    if (!result.success) {
      problems.push(...formatIssues(rel, result.error));
      continue;
    }
    if (basename(rel, '.yaml') !== result.data.skillId) problems.push(`${rel}: the file name must equal its skillId ("${result.data.skillId}.yaml")`);
    fileOf.set(result.data.skillId, rel);
    signOffs.push(result.data);
  }
  stats.signOffs = signOffs.length;

  /* 6: whole-set checks (only on what parsed, so one broken file does not cascade) */
  for (const p of checkContentSet(items, signOffs)) {
    if (p.field === 'id' && p.message.startsWith('Duplicate id')) continue; // reported above with both files
    const file = fileOf.get(p.id) ?? (p.id === 'signoff' ? `content/${SIGNOFF_DIR}` : 'content');
    problems.push(p.field === '' ? `${file}: ${p.message}` : `${file}: ${p.field}: ${p.message}`);
  }

  /* 7: synonyms */
  let synonyms: SynonymFileValue['groups'] = [];
  const synonymsPath = join(root, 'content', SYNONYMS_FILE);
  if (existsSync(synonymsPath)) {
    const parsed = parseYamlMapping(readFileSync(synonymsPath, 'utf8'));
    const rel = `content/${SYNONYMS_FILE}`;
    if (!parsed.ok) problems.push(...parsed.problems.map((p) => `${rel}: ${p}`));
    else {
      const result = SynonymFile.safeParse(parsed.data);
      if (result.success) synonyms = result.data.groups;
      else problems.push(...formatIssues(rel, result.error));
    }
  } else {
    notes.push(`content/${SYNONYMS_FILE} not found: no synonyms yet (troubleshooter, Phase 2).`);
  }
  stats.synonymGroups = synonyms.length;

  /* 8: the bundle, superseded items left out */
  const renderable = items.filter((item) => isRenderable(item)).sort((a, b) => a.id.localeCompare(b.id));
  stats.supersededLeftOut = items.length - renderable.length;
  stats.items = renderable.length;
  for (const item of renderable) {
    stats.byType[item.type] = (stats.byType[item.type] ?? 0) + 1;
    stats.byStatus[item.status] = (stats.byStatus[item.status] ?? 0) + 1;
    if (isCustomerRenderable(item)) stats.customerSafe += 1;
  }
  const bundle: ContentBundle = {
    version: CONTENT_BUNDLE_VERSION,
    items: renderable,
    signOffs: [...signOffs].sort((a, b) => a.skillId.localeCompare(b.skillId)),
    synonyms,
  };
  const index = buildSearchIndex(renderable, synonyms);
  stats.searchIndexDocs = index.documentCount;

  /* 7 (continued): search cases, run against the same index the app ships */
  const casesPath = join(root, SEARCH_CASES_FILE);
  if (existsSync(casesPath)) {
    stats.searchCases.found = true;
    const parsed = parseYamlMapping(readFileSync(casesPath, 'utf8'));
    const result = parsed.ok ? SearchCaseFile.safeParse(parsed.data) : null;
    if (!parsed.ok) problems.push(...parsed.problems.map((p) => `${SEARCH_CASES_FILE}: ${p}`));
    else if (result !== null && !result.success) problems.push(...formatIssues(SEARCH_CASES_FILE, result.error));
    else if (result !== null && result.success) {
      const cases = result.data.cases;
      stats.searchCases.count = cases.length;
      const refProblems = searchCaseReferenceProblems(cases, new Set(renderable.map((i) => i.id)));
      problems.push(...refProblems.map((p) => `${SEARCH_CASES_FILE}: ${p}`));
      if (problems.length > 0) {
        notes.push('Search cases were not run, because of the problems listed.');
      } else {
        cases.forEach((c, i) => {
          const top = runSearch(index, c.query, { limit: 1 })[0];
          if (top !== undefined && c.expect.includes(top.id)) stats.searchCases.passed += 1;
          else problems.push(`${SEARCH_CASES_FILE}: cases[${i}] "${c.query}": expected ${c.expect.join(' or ')} on top, got ${top === undefined ? 'no result' : `"${top.id}"`}`);
        });
      }
      if (cases.length < MIN_SEARCH_CASES) {
        const message = `${cases.length} search cases; the build requires ${MIN_SEARCH_CASES} from Phase 2 on.`;
        if (enforceMin) problems.push(`${SEARCH_CASES_FILE}: ${message}`);
        else notes.push(message);
      }
    }
  } else {
    notes.push(`${SEARCH_CASES_FILE} not found: search cases skipped (troubleshooter, Phase 2).`);
  }

  stats.notes = notes;
  const wrote: string[] = [];
  if (problems.length === 0 && write) {
    const outDir = join(root, GENERATED_DIR);
    mkdirSync(outDir, { recursive: true });
    writeAtomic(join(outDir, OUTPUT_FILES.bundle), JSON.stringify(bundle));
    writeAtomic(join(outDir, OUTPUT_FILES.index), JSON.stringify(index));
    writeAtomic(join(outDir, OUTPUT_FILES.stats), `${JSON.stringify(stats, null, 2)}\n`);
    wrote.push(...Object.values(OUTPUT_FILES).map((f) => `${GENERATED_DIR}/${f}`));
  }
  return { ok: problems.length === 0, problems, notes, stats, bundle, wrote };
}
