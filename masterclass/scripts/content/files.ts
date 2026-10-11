/**
 * Reading content files for the build: walk content/, parse YAML, split Markdown front matter,
 * and format zod issues the way src/schemas/README.md section 6 shows them
 * ("content/fixit/fix-07.md: causes: Too small ...").
 */
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { parseDocument } from 'yaml';
import type * as z from 'zod';

/** Files the walk skips silently: dotfiles (.gitkeep, .DS_Store) and README.md notes. */
export function isIgnoredFile(name: string): boolean {
  return name.startsWith('.') || name.toLowerCase() === 'readme.md';
}

/** Every file under dir, as posix paths relative to base, sorted. Skips the excluded relative folders. */
export function walkFiles(base: string, dir: string, exclude: readonly string[]): string[] {
  const out: string[] = [];
  const visit = (absDir: string, relDir: string) => {
    let names: string[];
    try {
      names = readdirSync(absDir).sort();
    } catch {
      return;
    }
    for (const name of names) {
      const abs = join(absDir, name);
      const rel = relDir === '' ? name : `${relDir}/${name}`;
      if (exclude.includes(rel)) continue;
      let isDir = false;
      try {
        isDir = statSync(abs).isDirectory();
      } catch {
        continue;
      }
      if (isDir) {
        if (!name.startsWith('.')) visit(abs, rel);
      } else if (!isIgnoredFile(name)) {
        out.push(rel);
      }
    }
  };
  visit(join(base, dir), dir);
  return out;
}

export type Parsed = { ok: true; data: Record<string, unknown> } | { ok: false; problems: string[] };

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/** Parse YAML text into a mapping. lineOffset shifts reported line numbers (front matter starts on line 2). */
export function parseYamlMapping(text: string, lineOffset = 0): Parsed {
  let doc;
  try {
    doc = parseDocument(text, { uniqueKeys: true, prettyErrors: false });
  } catch (error) {
    return { ok: false, problems: [`YAML could not be read: ${error instanceof Error ? error.message : String(error)}`] };
  }
  const issues = [...doc.errors, ...doc.warnings].map((e) => {
    const line = e.linePos?.[0]?.line;
    return line === undefined ? `YAML: ${e.message.split('\n')[0]}` : `line ${line + lineOffset}: YAML: ${e.message.split('\n')[0]}`;
  });
  if (issues.length > 0) return { ok: false, problems: issues };
  let data: unknown;
  try {
    data = doc.toJS();
  } catch (error) {
    return { ok: false, problems: [`YAML could not be read: ${error instanceof Error ? error.message : String(error)}`] };
  }
  if (!isRecord(data)) return { ok: false, problems: ['The file must be a YAML mapping (lines of "key: value").'] };
  return { ok: true, data };
}

/** Split a Markdown file into its front matter (between a first line "---" and the next "---") and its trimmed body. */
export function splitFrontMatter(text: string): { front: string; body: string } | null {
  const lines = text.replace(/^﻿/, '').replace(/\r\n?/g, '\n').split('\n');
  if (lines[0]?.trim() !== '---') return null;
  const end = lines.findIndex((line, i) => i > 0 && line.trim() === '---');
  if (end < 0) return null;
  return { front: lines.slice(1, end).join('\n'), body: lines.slice(end + 1).join('\n').trim() };
}

/** "steps[2].quickCardId" from a zod issue path. */
export function formatPath(path: readonly PropertyKey[]): string {
  let out = '';
  for (const part of path) {
    if (typeof part === 'number') out += `[${part}]`;
    else out += out === '' ? String(part) : `.${String(part)}`;
  }
  return out;
}

/** One line per zod issue, with hints for the YAML traps the README names. */
export function formatIssues(rel: string, error: z.ZodError): string[] {
  return error.issues.map((issue) => {
    const field = formatPath(issue.path);
    let message = issue.message;
    if (field.endsWith('kbRef') && /expected string/i.test(message)) message += ' (quote it: kbRef: "7.3")';
    if (/expected string, received number/i.test(message) && !field.endsWith('kbRef')) message += ' (put the value in quotes)';
    return field === '' ? `${rel}: ${message}` : `${rel}: ${field}: ${message}`;
  });
}
