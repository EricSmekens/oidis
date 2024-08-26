import { createResource, Match, Show, Switch, For, type Component } from 'solid-js';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "~/components/ui/carousel";

import { fetchRecipes } from './clients/oidisClient';

import logo from './logo.svg';
import styles from './App.module.css';
import RecipeCard from './components/recipeCard';

const App: Component = () => {
  const [recipes] = createResource(fetchRecipes);

  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <img src={logo} class={styles.logo} alt="logo" />

        <Show when={recipes.loading}>
          <p>Loading...</p>
        </Show>

        <Switch>
          <Match when={recipes.error}>
            <span>Error: {recipes.error()}</span>
          </Match>
          <Match when={recipes()}>
            <Carousel class="max-w-screen-md">
              <CarouselContent>
                <For each={recipes()}>
                  {(recipe) => (
                    <CarouselItem>
                      <RecipeCard recipe={recipe} />
                    </CarouselItem>
                  )}
                </For>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </Match>
        </Switch>
      </header>
    </div>
  );
};

export default App;
