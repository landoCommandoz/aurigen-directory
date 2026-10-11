/**
 * Device preview host (developer tool; dev builds, or the owner's Developer toggle; never in
 * Customer View). At Mobile 375 or Tablet 768 the shell shows the app inside a same-origin
 * iframe of that width instead of drawing it directly. An iframe is the honest preview: media
 * queries, vw-based type, and the drawer and toasts (position: fixed on document.body) all
 * follow the frame, not the desktop window (designer's note, Phase 1).
 *
 * The app inside the frame knows it is the preview (isPreviewFrame) and shows no preview bar.
 * Hosts that forbid framing (Netlify's X-Frame-Options DENY and frame-ancestors 'none') leave
 * the frame empty; the host notices and says so in words, with Desktop full as the way back.
 */
import { useMemo, useState, type SyntheticEvent } from 'react';
import { Banner } from '../components/ui';
import { DevicePreviewBar, setPreviewWidth, type PreviewWidth } from '../features/settings';

export const PREVIEW_FRAME_ATTR = 'data-mc-preview';

/** True when this copy of the app runs inside the device preview frame. Computed once at load. */
export const isPreviewFrame: boolean = (() => {
  try {
    const frame = window.frameElement;
    return frame !== null && frame.hasAttribute(PREVIEW_FRAME_ATTR);
  } catch {
    // A cross-origin parent throws: not our preview.
    return false;
  }
})();

export function PreviewHost({ width }: { width: Exclude<PreviewWidth, null> }) {
  // The frame opens at the address the host was on; after that it navigates on its own.
  const src = useMemo(() => {
    try {
      return `${window.location.pathname}${window.location.search}${window.location.hash}`;
    } catch {
      return import.meta.env.BASE_URL;
    }
  }, []);
  const [blocked, setBlocked] = useState(false);

  function onLoad(event: SyntheticEvent<HTMLIFrameElement>) {
    try {
      const doc = event.currentTarget.contentDocument;
      setBlocked(doc === null || doc.getElementById('root') === null);
    } catch {
      setBlocked(true);
    }
  }

  return (
    <div className="app-preview">
      <DevicePreviewBar />
      {blocked ? (
        <Banner tone="warning" title="Preview blocked here" action={{ label: 'Desktop full', onAction: () => setPreviewWidth(null) }}>
          This host forbids showing the app inside a frame. The preview works in dev builds and on the GitHub Pages test link.
        </Banner>
      ) : null}
      <div className="app-preview__stage">
        <iframe
          className="app-preview__frame"
          {...{ [PREVIEW_FRAME_ATTR]: '' }}
          title={`App preview, ${width} px wide`}
          src={src}
          // Border-box: add the frame's two 1 px borders so the page inside is exactly `width` wide.
          style={{ width: `calc(${width}px + 2px)` }}
          onLoad={onLoad}
        />
      </div>
    </div>
  );
}
