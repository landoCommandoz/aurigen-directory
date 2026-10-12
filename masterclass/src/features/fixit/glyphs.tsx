/**
 * One line glyph per Fix It group, for the symptom tiles. Decorative: the words on the tile carry
 * the meaning, so every glyph is aria-hidden. They draw in currentColor (the tile's dim text
 * token), so no color is typed here. The ui-designer may replace the artwork; the names stay.
 */
import type { ReactNode } from 'react';
import type { FixGroupName } from './fixModel';

function Glyph({ children }: { children: ReactNode }) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className="ui-glyph"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

const ART: Record<FixGroupName, ReactNode> = {
  // A pad on its plate, turning.
  machine: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M17.5 4.5a10 10 0 0 1 2.8 3.4" />
    </>
  ),
  // Layers of paint: clear over base.
  paint: (
    <>
      <path d="M12 4l9 4.5-9 4.5-9-4.5z" />
      <path d="M3 13l9 4.5 9-4.5" />
    </>
  ),
  'wash-dry': <path d="M12 3.5c3.8 4.6 6 7.8 6 10.5a6 6 0 0 1-12 0c0-2.7 2.2-5.9 6-10.5z" />,
  clay: (
    <>
      <rect x="4" y="8" width="16" height="8" rx="3" />
      <path d="M8 11h5M8 13.5h8" />
    </>
  ),
  protect: <path d="M12 3l7.5 3v5.5c0 4.6-3.2 7.9-7.5 9.5-4.3-1.6-7.5-4.9-7.5-9.5V6z" />,
  glass: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="1.5" />
      <path d="M8 13l5-5M10.5 16l6-6" />
    </>
  ),
  interior: (
    <>
      <path d="M8 4h5a2 2 0 0 1 2 2v7H8z" />
      <path d="M6 13h12v3H6zM8 16v4M16 16v4" />
    </>
  ),
  gauge: (
    <>
      <path d="M4 16a8 8 0 1 1 16 0" />
      <path d="M12 16l4-5" />
      <circle cx="12" cy="16" r="1" />
    </>
  ),
  'setup-time': (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  customer: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c1-4 3.8-6 7-6s6 2 7 6" />
    </>
  ),
  bike: (
    <>
      <circle cx="6" cy="16" r="3.5" />
      <circle cx="18" cy="16" r="3.5" />
      <path d="M6 16l4-7h5l3 7M10 9l3 7h-7" />
    </>
  ),
  tesla: (
    <>
      <path d="M3 16l2-5c.5-1.2 1.4-2 2.8-2h8.4c1.4 0 2.3.8 2.8 2l2 5v2H3z" />
      <circle cx="7.5" cy="18" r="1.5" />
      <circle cx="16.5" cy="18" r="1.5" />
    </>
  ),
};

export function GroupGlyph({ group }: { group: FixGroupName }) {
  return <Glyph>{ART[group]}</Glyph>;
}
