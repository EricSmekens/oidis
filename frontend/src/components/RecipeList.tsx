// src/components/RecipeList.tsx
import { Component } from "solid-js";
import { A } from "@solidjs/router";
import { Recipe } from "~/clients/Recipe";

const RecipeList: Component = (props: any) => {
  const recipes = (): Recipe[] => props.recipes;

  return (
    <div class="recipe-grid">
      {recipes().map(recipe => (
        <div class="recipe-card">
          {/* <A href={`/recipe/${recipe._id}`}> */}
            <h3>{recipe.name}</h3>
          {/* </A> */}
        </div>
      ))}
    </div>
  );
};

export default RecipeList;