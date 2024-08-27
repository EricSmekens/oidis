import { createResource, Match, Show, Switch, For, type Component, Index } from 'solid-js';

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
import RecipeCard from './components/RecipeCard';

const App: Component = () => {
  const [recipes] = createResource(fetchRecipes);

  return (
    <div class={styles.App}>
      <div class={styles.maincontent}>

        <Show when={recipes.loading}>
          <p class="text-3xl">Loading...</p>
          <img src={logo} class={styles.logo} alt="logo" />
        </Show>

        <Switch>
          <Match when={recipes.error}>
            <span>Error: {recipes.error()}</span>
          </Match>
          <Match when={recipes()}>
            <Carousel class="w-full max-w-xs">
              <CarouselContent>
                <For each={recipes()}>
                  {(recipe) => (
                    <CarouselItem>
                      <RecipeCard recipe={recipe}/>
                    </CarouselItem>
                  )}
                </For>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </Match>
        </Switch>
      </div>
    </div>
  );
};

export default App;
