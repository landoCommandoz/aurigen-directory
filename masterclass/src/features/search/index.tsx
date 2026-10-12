/**
 * Search feature: the export contract the shell mounts.
 *   /search      SearchScreen
 *   /items/:id   ItemPage (products, tools, glossary terms; reads the :id route param itself)
 *   SearchBox    the box with live results, used at the top of Home, Quick Cards, and Fix It
 * Also exported for other features: useItemOpener (open a hit on its page, or the fallback sheet).
 */
export { SearchScreen } from './SearchScreen';
export { SearchBox } from './SearchBox';
export type { SearchBoxProps } from './SearchBox';
export { ItemPage } from './ItemPage';
export { ItemSheet, useItemOpener } from './ItemSheet';
export type { ItemOpener } from './ItemSheet';
