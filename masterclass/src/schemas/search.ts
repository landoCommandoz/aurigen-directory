/**
 * Search contracts (troubleshooter writes the files; the content build and QA read them).
 * content/search/synonyms.yaml: groups of words that mean the same thing, expanded at index time.
 * tests/search-cases.yaml: query, then the content ids allowed as the top result.
 * Owner: architect.
 */
import * as z from 'zod';
import { ContentId } from './common';

/** One group: every word in it finds what any other word in it finds ("jerking", "hopping", "walking"). */
export const SynonymGroup = z.strictObject({
  words: z.array(z.string().min(1).transform((w) => w.trim().toLowerCase())).min(2),
  note: z.string().min(1).optional(),
});

export const SynonymFile = z.strictObject({
  version: z.literal(1),
  groups: z.array(SynonymGroup).default([]),
});
export type SynonymFileValue = z.infer<typeof SynonymFile>;

/**
 * One search case. The top result must be one of `expect` (knowledge base 24 lists some cases
 * with two acceptable answers, such as "wet the pad": 8.2 / FIX-04).
 * kb keeps the knowledge base's own wording of the expected answer, for the reader.
 */
export const SearchCase = z.strictObject({
  query: z.string().min(1),
  expect: z.array(ContentId).min(1),
  kb: z.string().min(1).optional(),
});
export type SearchCaseValue = z.infer<typeof SearchCase>;

/** The file. The build prompt asks for 45 or more cases once Phase 2 content lands. */
export const SearchCaseFile = z.strictObject({
  version: z.literal(1),
  cases: z.array(SearchCase).default([]),
});
export type SearchCaseFileValue = z.infer<typeof SearchCaseFile>;

/** The number of cases the build requires from Phase 2 on (BUILD_PROMPT section 8). */
export const MIN_SEARCH_CASES = 45;

/** Cases whose expected ids are not in the content set, as messages. */
export function searchCaseReferenceProblems(cases: readonly SearchCaseValue[], ids: ReadonlySet<string>): string[] {
  const problems: string[] = [];
  cases.forEach((c, i) => {
    for (const id of c.expect) {
      if (!ids.has(id)) problems.push(`cases[${i}] "${c.query}": expects "${id}", which does not exist`);
    }
  });
  return problems;
}
