/**
 * /search: the search screen. The box, results grouped by type, Enter opens the top result, and an
 * empty box shows the top five Quick Cards. The query rides in the address (?q=), so a refresh or
 * the back button keeps it.
 */
import { useSearchParams } from 'react-router';
import { Screen, Section } from '../settings/ui/Screen';
import { SearchBox } from './SearchBox';

export function SearchScreen() {
  const [params, setParams] = useSearchParams();
  const initial = params.get('q') ?? '';

  return (
    <Screen title="Search" back={{ to: '/', label: 'Home' }} lede="Fix It, Quick Cards, products, tools, and words. Everything is on the phone, so it works with no signal.">
      <Section index={1}>
        <SearchBox
          focusOnOpen
          showEmptyState
          initialQuery={initial}
          onQueryChange={(next) => {
            const q = next.trim();
            setParams(q === '' ? {} : { q }, { replace: true });
          }}
        />
      </Section>
    </Screen>
  );
}
