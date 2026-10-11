/**
 * Any address the app does not know. No dead end: Home and Fix It are one tap away.
 * An address no route could match at all (a line break in it, DEF-02) arrives here through
 * NO_SCREEN_PATH with the real path in the location state; control characters in it are shown
 * as their %XX codes so the line reads as the address that was typed.
 */
import { useLocation } from 'react-router';
import { ButtonLink } from '../ButtonLink';
import { isUnmatchedState } from '../unmatched';
import { Block, Page } from './Page';

// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u001f\u007f]/g;

/** Pure: the path as a person reads it, control characters as %XX. Exported for tests. */
export function visiblePath(path: string): string {
  return path.replace(CONTROL_CHARS, (c) => `%${c.charCodeAt(0).toString(16).padStart(2, '0').toUpperCase()}`);
}

export function NotFound() {
  const { pathname, state } = useLocation();
  const shown = isUnmatchedState(state) ? state.unmatchedPath : pathname;
  return (
    <Page title="No screen here" lede="This address is not part of the app. It may be from an older version or a typo.">
      <Block index={1} label="Where to go">
        <p className="app-measure ui-muted app-path">{visiblePath(shown)}</p>
        <div className="app-actions">
          <ButtonLink to="/">Home</ButtonLink>
          <ButtonLink to="/fixit">Fix It</ButtonLink>
        </div>
      </Block>
    </Page>
  );
}
