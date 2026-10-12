/**
 * Helpers for the Phase 2 content audit (qa-adversary). Not imported by app code.
 *
 * The audit reads the content the way the app ships it: the bundle the content build makes
 * (scripts/content/pipeline.ts, write: false), plus the raw files for checks on characters.
 *
 * A "unit" is one piece of text a person reads on its own: a line, a row, a step, a step's note,
 * a title, a paragraph field. Each carries the status it renders with: its own status when it has
 * one, otherwise the item's (a step's notes inherit the step's status, as the SOP page does).
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { buildContent } from '../../scripts/content/pipeline';
import type { ContentItemValue, StatusName } from '../../src/schemas';

export const ROOT = resolve(__dirname, '..', '..');

let cached: ReturnType<typeof buildContent> | null = null;

/** The content build, once per test file. */
export function built(): ReturnType<typeof buildContent> {
  cached ??= buildContent({ root: ROOT, write: false });
  return cached;
}

export function items(): ContentItemValue[] {
  return built().bundle.items;
}

export interface TextUnit {
  id: string;
  type: ContentItemValue['type'];
  field: string;
  text: string;
  status: StatusName;
}

type Loose = Record<string, unknown>;

function lineOf(value: unknown): { text: string; status?: StatusName } | null {
  if (typeof value === 'string') return { text: value };
  if (value !== null && typeof value === 'object' && typeof (value as Loose).text === 'string') {
    const v = value as { text: string; status?: StatusName };
    return v.status === undefined ? { text: v.text } : { text: v.text, status: v.status };
  }
  return null;
}

const LINE_FIELDS = ['checks', 'causes', 'stillHappening', 'notes', 'mistakes', 'instructions', 'passMark', 'stopIf', 'jobs', 'neverFor', 'steps', 'ownerChecks'];
const ROW_FIELDS = ['rows', 'numbers', 'specs'];
const TEXT_FIELDS = ['title', 'why', 'body', 'definition', 'prompt', 'explanation', 'front', 'back', 'labelNotes', 'term'];

/** Every piece of reading text in an item, each with the status it renders with. */
export function units(item: ContentItemValue): TextUnit[] {
  const out: TextUnit[] = [];
  const it = item as unknown as Loose;
  const own = item.status;
  const push = (field: string, text: unknown, status: StatusName | undefined) => {
    if (typeof text === 'string' && text.trim() !== '') out.push({ id: item.id, type: item.type, field, text, status: status ?? own });
  };
  for (const field of TEXT_FIELDS) push(field, it[field], undefined);
  for (const field of LINE_FIELDS) {
    const list = it[field];
    if (!Array.isArray(list)) continue;
    list.forEach((raw, i) => {
      if (item.type === 'sop' && field === 'steps') {
        const step = raw as { text: string; status?: StatusName; stopIf?: string; notes?: unknown[] };
        push(`steps[${i}]`, step.text, step.status);
        push(`steps[${i}].stopIf`, step.stopIf, step.status);
        (step.notes ?? []).forEach((n, j) => {
          const line = lineOf(n);
          if (line !== null) push(`steps[${i}].notes[${j}]`, line.text, line.status ?? step.status);
        });
        return;
      }
      const line = lineOf(raw);
      if (line !== null) push(`${field}[${i}]`, line.text, line.status);
    });
  }
  for (const field of ROW_FIELDS) {
    const rows = it[field];
    if (!Array.isArray(rows)) continue;
    rows.forEach((row: { label: string; value: string; status?: StatusName }, i) => push(`${field}[${i}]`, `${row.label}: ${row.value}`, row.status));
  }
  const dilutions = it.dilutions;
  if (Array.isArray(dilutions)) dilutions.forEach((d: { use: string; ratio: string; status?: StatusName }, i) => push(`dilutions[${i}]`, `${d.use}: ${d.ratio}`, d.status));
  if (item.type === 'quizquestion') {
    item.choices.forEach((c, i) => push(i === item.correctIndex ? `choices[${i}] (correct)` : `choices[${i}]`, c, undefined));
  }
  return out;
}

/** Every string anywhere in an item (search words and sources included), with its path. */
export function allStrings(value: unknown, path = '', out: Array<{ path: string; text: string }> = []): Array<{ path: string; text: string }> {
  if (typeof value === 'string') out.push({ path, text: value });
  else if (Array.isArray(value)) value.forEach((v, i) => allStrings(v, `${path}[${i}]`, out));
  else if (value !== null && typeof value === 'object') for (const [k, v] of Object.entries(value)) allStrings(v, path === '' ? k : `${path}.${k}`, out);
  return out;
}

/** Every file under a folder, relative to the project root. */
export function filesUnder(dir: string): string[] {
  const out: string[] = [];
  const walk = (abs: string) => {
    for (const name of readdirSync(abs)) {
      const p = join(abs, name);
      if (statSync(p).isDirectory()) walk(p);
      else out.push(relative(ROOT, p));
    }
  };
  walk(resolve(ROOT, dir));
  return out.sort();
}

export function readText(rel: string): string {
  return readFileSync(resolve(ROOT, rel), 'utf8');
}

/** Lesson rows of the curriculum table: `| 1 | \`lesson-...\` Title | goal | \`drill-...\` | \`quiz-...\` (4) |`. */
export interface CurriculumRow {
  order: number;
  lessonId: string;
  level: number;
  drillId: string;
  quizId: string;
  quizCount: number;
}

export function curriculumRows(): CurriculumRow[] {
  const rows: CurriculumRow[] = [];
  const re = /^\| (\d+) \| `(lesson-l(\d)-[a-z0-9-]+)`.*\| `(drill-[a-z0-9-]+)` \| `(quiz-[a-z0-9-]+)` \((\d+)\) \|\s*$/;
  for (const line of readText('docs/CURRICULUM.md').split('\n')) {
    const m = re.exec(line);
    if (m === null) continue;
    rows.push({ order: Number(m[1]), lessonId: m[2] ?? '', level: Number(m[3]), drillId: m[4] ?? '', quizId: m[5] ?? '', quizCount: Number(m[6]) });
  }
  return rows;
}

/** True when the text says, in so many words, that the fact is old, unsettled, or not used. */
export function negated(text: string): boolean {
  return /\b(not|never|no|none|old|older|booklet|superseded|useless|until|instead|was|wrong|replaced|corrected|unconfirmed|unverified|badge|pending)\b/i.test(text);
}

/** Sentences of a text: split after . ! ? (not after a unit like "in." or "oz.") and at line breaks. */
export function sentences(text: string): string[] {
  return text
    .split(/(?<!\b(?:in|oz|ft|lb|gal|No|approx)\.)(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s !== '');
}

/**
 * The sentences that match `re` and are NOT negated by themselves, the Markdown heading above
 * them, or the two sentences right after them ("... 3 cups water. That ratio is not confirmed
 * yet."). A long paragraph is judged one sentence at a time, so a stray "no" elsewhere in it
 * never excuses a match.
 */
export function settledMatches(text: string, re: RegExp): string[] {
  const list = sentences(text);
  let heading = '';
  const out: string[] = [];
  list.forEach((s, i) => {
    if (s.startsWith('#')) heading = s;
    if (re.test(s) && !negated(`${heading} ${s} ${list[i + 1] ?? ''} ${list[i + 2] ?? ''}`)) out.push(s);
  });
  return out;
}
