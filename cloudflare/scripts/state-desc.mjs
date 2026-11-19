// ONE PLAIN SENTENCE PER STATE PAGE, BUILT FROM THAT STATE'S AUDITED LEDGER.
//
// Lando, 2026-11-18: "All 51 rewritten as one plain sentence under 155 characters, built from
// that state's audited ledger: type of sale, rate or premium, redemption period, in that order.
// GA, IN, NY and TN say the law is pending and give no figure. Nothing the page itself does not
// say."
//
// WHY A GENERATOR AND NOT 51 HAND-WRITTEN LINES. The description that shipped before this was
// built from st.rate and st.redemption, the PRE-AUDIT fields. So a page could show the audited
// wording in its fact rows and the superseded wording in the line search engines read: Florida's
// page said "Until a tax deed is issued" in the page and "2 years from April 1 of issuance year"
// in its description, which is the exact wording the audit had found wrong. Building both from
// the same ledger makes that impossible, and a later audit correction reaches the description on
// the next build instead of waiting for somebody to notice.
//
// NO FIGURE IS EVER INVENTED, AND NONE IS EVER GUESSED AT. Every piece below is cut out of the
// ledger's own `shown` text; nothing is reworded. Dropping detail is allowed, adding any is not.
// Three rules keep it honest:
//   * a value that cannot be shortened to something still true falls back to "rate set by
//     statute" or "redemption period set by statute" and states no number. Colorado's rate is
//     "federal discount rate + 9 points", which contains no figure at all, so Colorado's
//     description contains none either.
//   * a clause that still carries a statute citation after its trailing citation is removed is
//     never used. Cutting a citation out of the middle of a sentence leaves broken English
//     ("persons specified in can have the property reconveyed"), and a citation left in belongs
//     on the page, not in a search result.
//   * build-site.mjs checks every number in the finished sentence against the text a reader can
//     actually see on that page, and fails the build if one of them is missing.
//
// A pending state (data/law/pending.json) gets a sentence with no sale type, no rate and no
// period in it, because its page states none of those.
import { sentences } from './law-pieces.mjs';

// "Under 155 characters", so 154 is the longest allowed. The check lives in build-site.mjs.
export const DESC_LIMIT = 154;

// Anything that marks a passage as a statute citation rather than prose.
const STATUTE = /§|\b(?:Stat\.|M\.R\.S|MCA|ORC|NRS|ORS|RCW|W\.S\.|V\.S\.A|K\.S\.A|C\.R\.S|R\.S\.|P\.L\.|U\.S\.C|O\.C\.G\.A|T\.C\.A|IC)\b/;
const squash = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();
const firstSentence = (s) => sentences(squash(s))[0] || '';

// Remove bracketed groups at the END of a string, innermost brackets counted properly, while
// each one is a citation: "...interest on delinquent taxes (W.S. §39-13-108(b)(ii))" loses the
// citation and keeps the sentence. A bracketed group that is not a citation stays: Texas's
// "(homestead/ag/mineral)" says which property the premium applies to.
function stripTrailingCite(s) {
  let t = squash(s);
  for (;;) {
    if (!t.endsWith(')')) return t;
    let depth = 0, start = -1;
    for (let i = t.length - 1; i >= 0; i--) {
      if (t[i] === ')') depth++;
      else if (t[i] === '(') { depth--; if (depth === 0) { start = i; break; } }
    }
    if (start < 0) return t;
    const inner = t.slice(start + 1, -1);
    if (!STATUTE.test(inner)) return t;
    t = squash(t.slice(0, start));
  }
}
// A piece that was cut mid-sentence can end on a comma or a joining word. Both are dropped.
// Only words that can never be the last word of a clause that means anything are listed: a
// preposition is NOT one of them, because Minnesota's "with the state bidding in" ends on one
// and needs it.
const DANGLE = /[\s,;:]+(?:which|that|and|or|then|with|unless|the|a|an)$/i;
function trimDangle(s) {
  let t = squash(s).replace(/[\s,;:.]+$/, '');
  for (;;) { const u = t.replace(DANGLE, ''); if (u === t) return squash(t); t = u; }
}
// Lower-case the first letter, unless the piece opens on the name of a place. Hawaii's ledger
// covers one county, so its rate reads "Kauai County: ..." and has to keep its capital, while
// "Until March 31 after the foreclosure judgment" does not - and a first version of this rule
// that just looked for two capitals in a row got that second one wrong.
const PLACE = /^[A-Z][a-z'’]+(?: [A-Z][a-z'’]+)* (?:County|Parish|Borough|City|Township)\b/;
function lower1(s) {
  const t = squash(s);
  if (PLACE.test(t)) return t;
  return t.replace(/^([A-Z])(?![A-Z])/, (c) => c.toLowerCase());
}
const noParens = (s) => squash(s.replace(/\s*\([^()]*\)/g, ''));
// Variants of one piece, most informative first, with nothing repeated.
const variants = (...xs) => [...new Set(xs.map((x) => squash(x)).filter(Boolean))];

const shownText = (L, field) => L
  ? squash(L.claims.filter((c) => c.field === field && c.lang === 'en' && c.shown !== '').map((c) => c.shown).join(' '))
  : '';

// Every number in a string, as the reader sees it written.
export const figuresIn = (s) => (String(s).match(/\d[\d.,/]*\s*(?:%|percent|points?)?/gi) || [])
  .map((x) => squash(x).replace(/[.,/]+$/, ''))
  .filter(Boolean);

// ---------- the sale type ----------
// The ledger's own words, with a trailing explanation in brackets dropped and the sentence cut at
// its first semicolon. Delaware's "Tax sale by the sheriff (deed by court order if not redeemed)"
// becomes "tax sale by the sheriff": shorter, and it says nothing the longer line did not.
function typeVariants(L) {
  const raw = shownText(L, 'type');
  if (!raw) return ['sale type not yet verified'];
  const t = stripTrailingCite(firstSentence(raw)).replace(/\s*\([^()]*\)\s*$/, '');
  const full = lower1(trimDangle(stripTrailingCite(t.split(/;/)[0])));
  // Shorter: the first thing the state does, without what follows it.
  const short = lower1(trimDangle(full.split(/[:;]|,\s*(?=then |with |and )|\s+then\s+/)[0]));
  const out = variants(full, noParens(full), short).filter((x) => !STATUTE.test(x));
  return out.length ? out : ['sale type set out on the page'];
}

// ---------- the rate or premium ----------
// A rate row that says the rate does not apply ("N/A", "Not applicable: property is sold at a
// foreclosure sale", "No interest to buyers") becomes one plain phrase. Nothing else is
// collapsed: a figure keeps the words around it, because a flat percentage and a yearly rate are
// not the same number, and the one thing this sentence must not do is blur the two.
const NO_RATE = /^(n\/a|not applicable|no interest|no lien[- ]purchase|no lien interest)/i;
const RATE_FALLBACK = 'rate set by statute';
const RATE_LEADS = [
  [/^maximum premium set by law:\s*/i, 'premium up to '],
  [/^maximum rate set by law(?: for redemption)?:\s*/i, 'up to '],
  [/^rate set by law(?: for redemption)?:\s*/i, ''],
  [/^interest up to\s*/i, 'up to '],
  [/^interest (?:on redemption|on a delinquency set by law|on unpaid real property taxes|on delinquent taxes set by law|set by law|at the rate)\s*:?\s*/i, ''],
  [/^redemption interest of\s*/i, ''],
  [/^interest rate set in the certificate,\s*/i, ''],
  [/^redemption pays the purchase price plus\s*/i, 'the purchase price plus '],
];
const FIGURE = /\d[\d.,]*\s*(?:%|percent)/i;
function rateVariants(L) {
  const raw = shownText(L, 'rate');
  if (!raw) return ['rate not yet verified'];
  const s1 = stripTrailingCite(firstSentence(raw));
  if (NO_RATE.test(s1)) return ['no interest rate for buyers'];
  let body = s1, prefix = '';
  for (const [re, p] of RATE_LEADS) if (re.test(body)) { body = body.replace(re, ''); prefix = p; break; }
  // A second pass, because the label in front hides these two: Delaware reads "Rate set by law:
  // redemption pays the purchase price plus 15 percent in addition", and Montana reads "Maximum
  // rate set by law: interest of 5/6 of 1% a month on delinquent taxes".
  body = body.replace(/^redemption pays the purchase price plus\s*/i, 'the purchase price plus ')
    .replace(/^interest of\s*/i, '');
  // "a penalty bid of up to 9%" already says "up to"; it is not said twice.
  if (prefix === 'up to ' && /\bup to\b/i.test(body)) prefix = '';
  // Cut off the trailing modifiers: what the rate is charged on, how it is bid, when it runs from.
  const clause = trimDangle(stripTrailingCite(body.split(/;|,\s*(?=from |depending|bid down|or the rate|plus |which |and |for each |on the )|\s+(?:from the date of sale|from the time of sale|on delinquent taxes|on the taxes|simple interest|on the original sum|on the amount paid|on the total purchase price)\b/)[0]));
  const full = lower1(squash(prefix + clause));
  if (!FIGURE.test(full) || STATUTE.test(full)) return [RATE_FALLBACK];
  // Shortest: the figure and the unit of time the ledger gives it, and nothing else. A figure
  // with no unit of time has no short form - "15%" alone would read as a yearly rate where
  // Delaware's statute means a flat 15% added to the price - so that one degrades straight to
  // the fallback instead.
  const m = full.match(/(\d[\d.,]*\s*(?:%|percent))\s*(per year|a year|annually|per annum|simple per year|per month|a month|per month or part of a month)?/i);
  const short = m && m[2] ? lower1(squash(prefix + m[1] + ' ' + m[2])) : '';
  return variants(full, noParens(full), short, RATE_FALLBACK).filter((x) => !STATUTE.test(x));
}

// ---------- the redemption period ----------
const NO_REDEEM = /^(none|n\/a)\b/i;
const REDEEM_FALLBACK = 'redemption period set by statute';
// Clauses that read as a period of time take the word "redemption" in front of them. A clause
// that reads as something else ("lien foreclosed October 1 after notice") takes a colon instead,
// because "redemption lien foreclosed" is not English. A clause that already says "redeem" takes
// neither.
const TIMELIKE = /^(?:\d+|until|within|before|any time|at any time|at least|ends|up to|by the|six|twelve|one|two|three|fourteen|eighteen|from|to the)\b/i;
function redeemVariants(L) {
  const raw = shownText(L, 'redemption');
  if (!raw) return ['redemption period not yet verified'];
  const s1 = stripTrailingCite(firstSentence(raw));
  if (NO_REDEEM.test(s1)) return ['no redemption after the sale'];
  let clause = trimDangle(stripTrailingCite(s1.split(/;|,\s*(?=unless|and after|or |by paying|which |then |a shorter|other )|\s+\(/)[0]));
  // "Kauai County: 1 year from the sale" -> "in Kauai County, 1 year from the sale".
  clause = clause.replace(/^([A-Z][a-z]+(?: [A-Z][a-z]+)* County):\s*/, 'in $1, ');
  const lead = /redeem/i.test(clause) ? '' : TIMELIKE.test(clause) || /^in [A-Z]/.test(clause) ? 'redemption ' : 'redemption: ';
  const full = lead + lower1(clause);
  const out = variants(full, noParens(full), REDEEM_FALLBACK).filter((x) => !STATUTE.test(x));
  return out.length ? out : [REDEEM_FALLBACK];
}

// ---------- the sentence ----------
// The three pieces are assembled in Lando's order. When the longest form will not fit in 154
// characters, the shorter forms are tried: the type is given up first, because the page title
// already names it, and the rate and the period are what somebody searching came for. Of every
// combination that fits, the one that gives up the least is used - weighted so that losing a
// figure costs three times what losing a word of the sale type costs - and ties go to the
// longest sentence, so the choice is the same on every machine and every build.
const WEIGHT = { type: 1, rate: 3, redeem: 3 };
export function stateDesc(st, { pending = null } = {}) {
  if (pending) {
    return `${st.name}: sale type, rate and redemption period are not stated here, because Platbook has not yet read ${st.name}'s official source.`;
  }
  const L = st.ledger;
  const T = typeVariants(L), R = rateVariants(L), D = redeemVariants(L);
  let best = null;
  for (let i = 0; i < T.length; i++) for (let j = 0; j < R.length; j++) for (let k = 0; k < D.length; k++) {
    const s = `${st.name}: ${T[i]}, ${R[j]}, ${D[k]}.`;
    if (s.length > DESC_LIMIT) continue;
    const cost = i * WEIGHT.type + j * WEIGHT.rate + k * WEIGHT.redeem;
    if (!best || cost < best.cost || (cost === best.cost && s.length > best.s.length)) best = { cost, s };
  }
  // Nothing fits: the last resort states no figure at all, which is always short enough.
  return best ? best.s : `${st.name}: ${T[T.length - 1]}, ${RATE_FALLBACK}, ${REDEEM_FALLBACK}.`;
}

// Every number a finished description states, so build-site.mjs can look for each one in the
// text a reader can see on that page. The state's own name is left out of the search, because
// nothing in it is a figure.
export function descFigures(st, { pending = null } = {}) {
  if (pending) return [];
  return figuresIn(stateDesc(st, {}).slice(st.name.length));
}
