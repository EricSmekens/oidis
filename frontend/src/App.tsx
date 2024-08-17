import { createResource, Match, Show, Switch, For, type Component } from 'solid-js';
import { Col, Grid } from "~/components/ui/grid";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";

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

          <Carousel>
            <CarouselContent>
            <For each={recipes()}>
                {(recipe, i) => (
                  <CarouselItem>
                    <Card>
                      <CardHeader>
                        <CardTitle>{recipe.name}</CardTitle>
                        <CardDescription>{recipe.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <For each={recipe.products}>
                          {(product, i) => (
                            <p>{product.name}</p>
                          )}
                        </For>
                      </CardContent>
                      <CardFooter>
                        <Button class="w-full">Add to todo</Button>
                      </CardFooter>
                    </Card>
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
