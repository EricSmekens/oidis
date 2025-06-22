import { createSignal, For, type Component } from 'solid-js';
import styles from '../App.module.css';
import recipeImage from '../assets/recipe.jpg';

const RecipeCard: Component = (props: any) => {
    const recipe = () => props.recipe;
    return (
        <main class={styles['recipe-card']}>
            <img src={recipeImage} alt={recipe().name} />
            <h1>{recipe().name}</h1>

            <section class="mb-8">
                <h2>Ingrediënten</h2>
                <ul>
                    {recipe().products.map((item: any) => (
                        <li class="before:content-['•'] before:mr-2">{item.count} {item.unit} {item.name}</li>
                    ))}
                </ul>
            </section>

            <section class="mb-8">
                <h2>Bereidingswijze</h2>
                <ol>
                    {recipe().steps.map((step: any, idx: number) => (
                        <li>
                            <span class={styles['step-number']}>{idx + 1}</span>
                            <span>{step}</span>
                        </li>
                    ))}
                </ol>
            </section>
        </main>
    );
};

export default RecipeCard;