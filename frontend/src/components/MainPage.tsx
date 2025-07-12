import { createSignal, For } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import styles from '../App.module.css';

export default function MainPage(props: { recipes: any[] }) {
  const [search, setSearch] = createSignal('');
  const navigate = useNavigate();

  const filtered = () =>
    props.recipes?.filter(r =>
      r.name.toLowerCase().includes(search().toLowerCase())
    );

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
        <For each={filtered()}>
          {recipe => (
            <div
              class={styles.recipeCard}
              onClick={() => navigate(`/recipe/${recipe.id}`)}
              tabIndex={0}
              role="button"
            >
              <div class={styles.recipeImgWrap}>
                <img src={recipe.picture} alt={recipe.name} class={styles.recipeImg} />
              </div>
              <div class={styles.recipeTitle}>{recipe.name}</div>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}