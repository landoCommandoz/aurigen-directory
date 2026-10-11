import { afterEach, describe, expect, it } from 'vitest';
import { deepLinkTarget, keepBaseSlash, restoreDeepLink, slashedBaseFor, watchBaseSlash } from '../deepLink';

const ORIGIN = 'https://landocommandoz.github.io';
const PAGES = '/aurigen-directory/';

function at(pathname: string, search = '', hash = '') {
  return { pathname, search, hash, origin: ORIGIN };
}

describe('deepLinkTarget (GitHub Pages 404 redirect)', () => {
  it('restores a deep path under the Pages base', () => {
    expect(deepLinkTarget(at(PAGES, '?p=%2Fcards%2Fqc-01'), PAGES)).toBe('/aurigen-directory/cards/qc-01');
  });

  it('restores the old query and the hash', () => {
    expect(deepLinkTarget(at(PAGES, '?p=%2Fsearch&q=q%3Dpad%2Bhops', '#top'), PAGES)).toBe('/aurigen-directory/search?q=pad+hops#top');
  });

  it('works at the Netlify root base', () => {
    expect(deepLinkTarget(at('/', '?p=%2Fsettings%2Fbackup'), '/')).toBe('/settings/backup');
  });

  it('accepts the base without its trailing slash', () => {
    expect(deepLinkTarget(at('/aurigen-directory', '?p=%2Ffixit'), PAGES)).toBe('/aurigen-directory/fixit');
  });

  it('does nothing without ?p= or away from the base', () => {
    expect(deepLinkTarget(at(PAGES), PAGES)).toBeNull();
    expect(deepLinkTarget(at(PAGES, '?x=1'), PAGES)).toBeNull();
    expect(deepLinkTarget(at('/aurigen-directory/cards', '?p=%2Ffixit'), PAGES)).toBeNull();
  });

  it.each(['https://evil.example/x', '//evil.example/x', '/\\evil.example', '/a\u0000b', 'cards', '/../../other-repo/'])(
    'refuses %j (another host, protocol-relative, backslash, control character, no leading slash, climbing out of the base)',
    (p) => {
      expect(deepLinkTarget(at(PAGES, `?p=${encodeURIComponent(p)}`), PAGES)).toBe('refused');
    },
  );
});

describe('a line break smuggled in percent-encoded (DEF-02)', () => {
  it.each(['/%0d%0aSet-Cookie', '/cards/%0a', '/%7f', '/%5cevil', '/%E0%A4%A'])('refuses %j (it would decode to a control character, a backslash, or nothing valid)', (p) => {
    expect(deepLinkTarget(at(PAGES, `?p=${encodeURIComponent(p)}`), PAGES)).toBe('refused');
  });

  it('still restores an ordinary encoded path', () => {
    expect(deepLinkTarget(at(PAGES, `?p=${encodeURIComponent('/cards/caf%C3%A9')}`), PAGES)).toBe('/aurigen-directory/cards/caf%C3%A9');
  });
});

describe('the base keeps its trailing slash (DEF-09)', () => {
  afterEach(() => {
    window.history.replaceState(null, '', '/');
  });

  it('slashedBaseFor: only the bare base without its slash is changed', () => {
    expect(slashedBaseFor('/aurigen-directory', PAGES)).toBe(PAGES);
    expect(slashedBaseFor('/aurigen-directory/', PAGES)).toBeNull();
    expect(slashedBaseFor('/aurigen-directory/cards', PAGES)).toBeNull();
    expect(slashedBaseFor('/aurigen-directoryx', PAGES)).toBeNull();
    expect(slashedBaseFor('/', '/')).toBeNull();
    expect(slashedBaseFor('', '/')).toBeNull();
  });

  it('keepBaseSlash puts the slash back and keeps the query, the hash, and the entry state', () => {
    window.history.replaceState({ usr: 1 }, '', '/aurigen-directory?x=1#top');
    expect(keepBaseSlash(PAGES)).toBe(true);
    expect(`${window.location.pathname}${window.location.search}${window.location.hash}`).toBe('/aurigen-directory/?x=1#top');
    expect(window.history.state).toEqual({ usr: 1 });
    expect(keepBaseSlash(PAGES)).toBe(false);
    expect(keepBaseSlash('/')).toBe(false);
  });

  it('a Pages deep link at the bare base lands under the base, and the boot step leaves no bare base behind', () => {
    window.history.replaceState(null, '', '/aurigen-directory?p=%2Ffixit');
    expect(restoreDeepLink(PAGES)).toEqual({ restored: '/aurigen-directory/fixit', refused: false });
    window.history.replaceState(null, '', '/aurigen-directory');
    restoreDeepLink(PAGES);
    expect(window.location.pathname).toBe('/aurigen-directory/');
  });

  it('a back or forward step onto the bare base is fixed before the router reads it', () => {
    watchBaseSlash(PAGES);
    window.history.pushState(null, '', '/aurigen-directory');
    window.dispatchEvent(new PopStateEvent('popstate'));
    expect(window.location.pathname).toBe('/aurigen-directory/');
  });
});

describe('restoreDeepLink', () => {
  afterEach(() => {
    window.history.replaceState(null, '', '/');
  });

  it('rewrites the address bar before the router starts', () => {
    window.history.replaceState(null, '', '/?p=%2Fcards%2Fqc-01');
    expect(restoreDeepLink('/')).toEqual({ restored: '/cards/qc-01', refused: false });
    expect(window.location.pathname).toBe('/cards/qc-01');
  });

  it('drops a refused link and opens at the base', () => {
    window.history.replaceState(null, '', '/?p=%2F%2Fevil.example');
    expect(restoreDeepLink('/')).toEqual({ restored: null, refused: true });
    expect(window.location.pathname).toBe('/');
    expect(window.location.search).toBe('');
  });

  it('leaves a normal launch alone', () => {
    window.history.replaceState(null, '', '/fixit');
    expect(restoreDeepLink('/')).toEqual({ restored: null, refused: false });
    expect(window.location.pathname).toBe('/fixit');
  });
});
