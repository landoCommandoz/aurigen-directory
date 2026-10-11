/**
 * Line glyphs used inside the base components. Always decorative: the words
 * next to a glyph carry the meaning, so every glyph is aria-hidden. They draw
 * in currentColor, so they take the color of the text around them.
 *
 *   <OctagonGlyph />  the STOP octagon (with the word STOP beside it, always)
 */
import type { ReactNode, SVGProps } from 'react';

type GlyphProps = Omit<SVGProps<SVGSVGElement>, 'children'>;

function Glyph({ children, ...props }: GlyphProps & { children: ReactNode }) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className="ui-glyph"
      {...props}
    >
      {children}
    </svg>
  );
}

/** The STOP octagon: a solid octagon with a bar cut through it. */
export function OctagonGlyph(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path fill="currentColor" fillRule="evenodd" d="M7 1.5h10L22.5 7v10L17 22.5H7L1.5 17V7zM5.5 10.25v3.5h13v-3.5z" />
    </Glyph>
  );
}

export function CheckGlyph(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.5l5 5L19.5 7" />
    </Glyph>
  );
}

export function InfoGlyph(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <path fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" d="M12 11v6" />
      <circle cx="12" cy="7.5" r="1.5" fill="currentColor" />
    </Glyph>
  );
}

/** A warning triangle. Never red: red belongs to STOP. */
export function WarningGlyph(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" d="M12 2.8L22 20.5H2z" />
      <path fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" d="M12 9.5v5" />
      <circle cx="12" cy="17.6" r="1.4" fill="currentColor" />
    </Glyph>
  );
}

/** Loading ring. It spins; with reduced motion it holds still. */
export function SpinnerGlyph(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
      <path fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" d="M12 3a9 9 0 0 1 9 9" />
    </Glyph>
  );
}
