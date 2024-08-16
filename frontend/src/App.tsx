import { createResource, Match, Show, Switch, type Component } from 'solid-js';

import { getNumberOfRecipes } from './clients/oidisClient';

import logo from './logo.svg';
import styles from './App.module.css';

const App: Component = () => {
  const [numberOfRecipes] = createResource(getNumberOfRecipes);

  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <img src={logo} class={styles.logo} alt="logo" />
        Work in progress!
        <Show when={numberOfRecipes.loading}>
          <p>Loading...</p>
        </Show>

        <Switch>
          <Match when={numberOfRecipes.error}>
            <span>Error: {numberOfRecipes.error()}</span>
          </Match>
          <Match when={numberOfRecipes()}>
            <div>Number of recipes found: {numberOfRecipes()}</div>
          </Match>
        </Switch>
      </header>


    </div>
  );
};

export default App;
