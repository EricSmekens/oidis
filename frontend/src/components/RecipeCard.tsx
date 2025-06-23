import { createSignal, For, type Component } from 'solid-js';
import styles from '../App.module.css';
import recipeImage from '../assets/recipe.jpg';

const RecipeCard: Component = (props: any) => {
    const recipe = () => props.recipe;
    return (
        <main class={styles['recipe-card']}>
            <img src={recipeImage} alt={recipe().name} />
            <h1>{recipe().name}</h1>
            <h4>{recipe().description}</h4>

            <section class="mb-8">
                <h2>Ingrediënten</h2>
                <table class={styles['ingredients-table']}>
                    <tbody>
                        {recipe().products.map((item: any) => (
                            <tr>
                                <td class={styles['ingredient-amount']}>{item.count} {item.unit}</td>
                                <td class={styles['ingredient-name']}>{item.name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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