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
import RecipeCard from './components/RecipeCard';
import { makeCache } from '@solid-primitives/resource';
import { Route, Router } from '@solidjs/router';
import RecipeDetailPage from './components/RecipeDetailPage';
import MainPage from './components/MainPage';

const App: Component = () => {
  const [recipesCachedCall] = makeCache(fetchRecipes, {
    storage: localStorage,
    expires: 1000 * 60 * 60 * 24 // 1 day
  });
  const [recipes] = createResource(recipesCachedCall);

  function LoadingPage() {
    return (
      <div class={styles.App}>
        <div class={styles.maincontent}>

          <Show when={recipes.loading}>
            <p class="text-3xl">Loading...</p>
            <img src={logo} class={styles.logo} alt="logo" />
          </Show>

          {/* <Switch>
            <Match when={recipes.error}>
              <span>Error: {recipes.error()}</span>
            </Match>
            <Match when={recipes()}>
              <Carousel class="w-full max-w-xs">
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
          </Switch> */}
        </div>
      </div>
    );
  }

  function MainPageWrapper() {
    return <MainPage recipes={recipes()} />;
  }

  function RecipeDetailPageWrapper() {
    return <RecipeDetailPage recipes={recipes() || []} />;
  }

  return (
    <Router>
      <Route path="/" component={MainPageWrapper} />
      <Route path="/recipe/:id" component={RecipeDetailPageWrapper} />
      <Route path="*" component={LoadingPage} />
    </Router>
  );
};

export default App;
