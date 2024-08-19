import { createResource, Match, Show, Switch, For, type Component } from 'solid-js';
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
import { Timeline } from './components/ui/timeline';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './components/ui/table';

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
                          Ingredients
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead></TableHead>
                                <TableHead class="text-center">Aantal</TableHead>
                                <TableHead class="text-center">Eenheid</TableHead>
                                <TableHead class="text-right">Prijs</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <For each={recipe.products}>
                                {(product) => (
                                  <TableRow>
                                    <TableCell class="text-left">{product.name}</TableCell>
                                    <TableCell class="text-middle">{product.count}</TableCell>
                                    <TableCell class="text-middle">{product.unit}</TableCell>
                                    <TableCell class="text-right">TBD</TableCell>
                                  </TableRow>
                                )}
                              </For>
                            </TableBody>
                          </Table>
                          <Button class="w-full">Add to todo</Button>
                        </CardContent>
                        <CardFooter>
                          <div class="flex-col justify-center w-full">
                            <div class="">Zo maak je het:</div>
                            <Timeline items={recipe.steps.map((x: any, index: number) => {
                              return { title: `Stap ${index + 1}`, description: x };
                            })}
                              activeItem={0}
                            />
                          </div>
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
