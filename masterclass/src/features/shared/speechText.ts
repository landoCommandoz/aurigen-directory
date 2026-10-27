/**
 * Turning content into words a phone voice reads well. Shared by Quick Cards, Fix It, and the
 * procedure pages. Applied only to the spoken text; the screen keeps the knowledge base's own
 * wording. Pure: no React, no DOM.
 */
import { lineStatus, lineText, type LineValue, type StatusName } from '../../schemas';

/** Units spelled out, "2 x 2" as "2 by 2". */
export function speakable(text: string): string {
  return text
    .replace(/(\d)\s*µm\b/g, '$1 microns')
    .replace(/\bµm\b/g, 'microns')
    .replace(/(\d)\s*x\s*(\d)/g, '$1 by $2')
    .replace(/(\d)\s*oz\b/g, '$1 ounces')
    .replace(/(\d)\s*gal\b/g, '$1 gallons')
    .replace(/(\d)\s*ft\b/g, '$1 feet')
    .replace(/(\d)\s*lb\b/g, '$1 pounds')
    .replace(/(\d)\s*%/g, '$1 percent')
    .replace(/\s+/g, ' ')
    .trim();
}

/** The text with a full stop, unless it already ends a sentence. Empty stays empty. */
export function sentence(text: string): string {
  const t = text.trim();
  if (t === '') return '';
  return /[.!?:]$/.test(t) ? t : `${t}.`;
}

/** A line that waits on a decision Lando has not made. The writers mark it "(pending)". */
export function isPendingText(text: string): boolean {
  return /\(pending\)/i.test(text);
}

/**
 * One line as it is read aloud. A line marked verify inside an item that is not itself verify is
 * read with "Unverified." first, the spoken twin of the badge on screen. A pending line already
 * says "pending", so it gets no prefix.
 */
export function spokenLine(line: LineValue, itemStatus: StatusName): string {
  const text = sentence(lineText(line));
  const own = lineStatus(line, itemStatus);
  if (own === 'verify' && itemStatus !== 'verify' && !isPendingText(text)) return `Unverified. ${text}`;
  return text;
}
