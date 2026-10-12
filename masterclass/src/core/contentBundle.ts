/**
 * The shape of the files the content build writes to src/generated/ and the app reads.
 * Pure types and constants: imported by scripts/content (Node) and by src/core/content.ts.
 */
import type { ContentItemValue, ContentTypeName, SignOffCriteriaItem, StatusName, SynonymFileValue } from '../schemas';

export const CONTENT_BUNDLE_VERSION = 1 as const;

/** src/generated/content.json: every renderable item (superseded ones left out), sorted by id. */
export interface ContentBundle {
  version: typeof CONTENT_BUNDLE_VERSION;
  items: ContentItemValue[];
  signOffs: SignOffCriteriaItem[];
  synonyms: SynonymFileValue['groups'];
  /**
   * The ids isCustomerRenderable passes, written by the content build, so the build-time shard
   * cut (scripts/content/viteShards.ts) marks the catalog without loading the schemas. Optional:
   * a bundle without it marks nothing safe (fail closed); the app's own cut checks every item.
   */
  customerSafeIds?: string[];
}

/** src/generated/content-stats.json: what the last build saw, for the developer panel and the lead. */
export interface ContentStats {
  version: typeof CONTENT_BUNDLE_VERSION;
  builtAt: string;
  files: number;
  items: number;
  byType: Partial<Record<ContentTypeName, number>>;
  byStatus: Partial<Record<StatusName, number>>;
  customerSafe: number;
  supersededLeftOut: number;
  signOffs: number;
  synonymGroups: number;
  searchCases: { found: boolean; count: number; passed: number; minimum: number; enforced: boolean };
  searchIndexDocs: number;
  notes: string[];
}

export function emptyBundle(): ContentBundle {
  return { version: CONTENT_BUNDLE_VERSION, items: [], signOffs: [], synonyms: [] };
}
