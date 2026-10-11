/**
 * Every address in the app (Phase 1). Paths are relative to the base path: the router's
 * basename is import.meta.env.BASE_URL, so the same routes work at / (Netlify) and at
 * /aurigen-directory/ (GitHub Pages). Features own their screens (export contract); the shell
 * owns Home, the Academy and room placeholders, and Not found. Any unknown address lands on
 * Not found, which offers Home and Fix It.
 *
 * No address renders nothing (DEF-02): react-router's "*" pattern does not match a line break,
 * so a first segment holding an encoded CR or LF ("/%0a") matches no route at all. When nothing
 * matches, the table is rendered for NO_SCREEN_PATH instead, which "*" always matches, and the
 * real address travels in the location state for Not found to show.
 */
import { matchRoutes, useLocation, useRoutes, type Location, type RouteObject } from 'react-router';
import { CardView, CardsList } from '../features/cards';
import { FixItGrid } from '../features/fixit';
import { SearchScreen } from '../features/search';
import { BackupScreen, DeveloperPanel, DeviceRoleScreen, SettingsHome, SetupFlow } from '../features/settings';
import { AcademyOutline } from './screens/AcademyOutline';
import { Home } from './screens/Home';
import { NotFound } from './screens/NotFound';
import { RoomPlaceholder } from './screens/RoomPlaceholder';
import { Shell } from './Shell';
import { NO_SCREEN_PATH, type UnmatchedState } from './unmatched';

/** The route table, for tests and the developer panel: every path the shell mounts. */
export const ROUTE_PATHS = [
  '/',
  '/fixit',
  '/cards',
  '/cards/:id',
  '/search',
  '/settings',
  '/settings/setup',
  '/settings/device',
  '/settings/backup',
  '/settings/developer',
  '/academy',
  '/job',
  '/business',
] as const;

const ROUTES: RouteObject[] = [
  {
    element: <Shell />,
    children: [
      { index: true, element: <Home /> },
      { path: 'fixit', element: <FixItGrid /> },
      { path: 'cards', element: <CardsList /> },
      { path: 'cards/:id', element: <CardView /> },
      { path: 'search', element: <SearchScreen /> },
      { path: 'settings', element: <SettingsHome /> },
      { path: 'settings/setup', element: <SetupFlow /> },
      { path: 'settings/device', element: <DeviceRoleScreen /> },
      { path: 'settings/backup', element: <BackupScreen /> },
      { path: 'settings/developer', element: <DeveloperPanel /> },
      { path: 'academy', element: <AcademyOutline /> },
      { path: 'job', element: <RoomPlaceholder room="job" /> },
      { path: 'business', element: <RoomPlaceholder room="business" /> },
      { path: '*', element: <NotFound /> },
    ],
  },
];

/** Pure: the location to render. The real one when a route matches, else NO_SCREEN_PATH carrying it. Exported for tests. */
export function renderLocationFor(location: Location): Location | undefined {
  if (matchRoutes(ROUTES, location) !== null) return undefined;
  const state: UnmatchedState = { unmatchedPath: location.pathname };
  return { ...location, pathname: NO_SCREEN_PATH, search: '', hash: '', state };
}

export function AppRoutes() {
  const location = useLocation();
  return useRoutes(ROUTES, renderLocationFor(location));
}
