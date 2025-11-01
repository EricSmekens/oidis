import { createSignal, For } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import styles from '../App.module.css';
import { totalCostFor } from '../lib/cost';

export default function MainPage(props: { recipes: any[] }) {
  const [search, setSearch] = createSignal('');
  const navigate = useNavigate();

  const filtered = () =>
    props.recipes?.filter(r =>
      r.name.toLowerCase().includes(search().toLowerCase())
    );

  // sort state: 'none' | 'asc' | 'desc'
  const [sortOrder, setSortOrder] = createSignal<'none' | 'asc' | 'desc'>('asc');

  const displayed = () => {
    const list = (filtered() || []).slice();
    if (sortOrder() === 'asc') {
      list.sort((a: any, b: any) => totalCostFor(a) - totalCostFor(b));
    } else if (sortOrder() === 'desc') {
      list.sort((a: any, b: any) => totalCostFor(b) - totalCostFor(a));
    }
    return list;
  };

  return (
    <div class={styles.pageBg}>
      <div class={styles.headerBar}>
        <input
          type="text"
          placeholder="Zoek recept..."
          value={search()}
          onInput={e => setSearch(e.currentTarget.value)}
          class={styles.searchBar}
        />
      </div>
      <div class={styles.recipeGrid}>
        <div class={styles.sortRow}>
          <label for="sort" class={styles.sortLabel}>Sorteer op prijs:</label>
          <select id="sort" value={sortOrder()} onInput={e => setSortOrder((e.currentTarget as HTMLSelectElement).value as any)} class={styles.sortSelect}>
            <option value="none">Geen</option>
            <option value="asc">Prijs oplopend</option>
            <option value="desc">Prijs aflopend</option>
          </select>
        </div>

        <For each={displayed()}>
          {recipe => (
            <div
              class={styles.recipeCard}
              onClick={() => navigate(`/recipe/${recipe._id}`)}
              tabIndex={0}
              role="button"
            >
              <div class={styles.recipeImgWrap}>
                <img src={recipe.picture} alt={recipe.name} class={styles.recipeImg} />
              </div>
              <div class={styles.recipeTitle}>{recipe.name}</div>
              <div class={styles.recipeMeta}>€ {totalCostFor(recipe).toFixed(2)}</div>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}