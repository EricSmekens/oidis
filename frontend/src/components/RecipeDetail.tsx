// src/components/RecipeDetail.tsx
import { useParams } from "@solidjs/router";
import { Component, createSignal, onMount } from "solid-js";
import { Recipe } from "~/clients/Recipe";

const RecipeDetail: Component = (props: any) => {
    const recipe = (): Recipe => props.recipe;

    return (
        <div class="recipe-detail">
            <h2>{recipe()!.name}</h2>
            <h3>Ingredients</h3>
            <ul>
                {recipe()!.products.map(ingredient => (
                    <li>{ingredient.name}</li>
                ))}
            </ul>
            <h3>Instructions</h3>
            <ul>
                {recipe()!.steps.map(step => (
                    <li>{step}</li>
                ))}
            </ul>
        </div>
    );
};

export default RecipeDetail;