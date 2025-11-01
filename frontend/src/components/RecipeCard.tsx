import { type Component } from 'solid-js';
import styles from '../App.module.css';
import recipeImage from '../assets/recipe.jpg';
import { totalCostFor } from '../lib/cost';

const RecipeCard: Component = (props: any) => {
    const recipe = () => props.recipe;

    return (
        <main class={styles['recipe-card']}>
            <img src={recipe().picture || recipeImage} alt={recipe().name} />
            <h1>{recipe().name}</h1>
            <h5>{recipe().description}</h5>
            
            <section class="mb-8">
                <p>{recipe().amountOfPersons} personen</p>
                <p>{recipe().preparationDurationInMinutes} minuten</p>
            </section>

            <section class="mb-8">
                <h2>Ingrediënten</h2>
                <table class={styles['ingredients-table']}>
                    <tbody>
                        {recipe().products.map((item: any) => (
                            <tr>
                                <td class={styles['ingredient-amount']}>{item.count} {item.unit}</td>
                                <td class={styles['ingredient-name']}>{item.product.name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            <section class="mb-8">
                <h2>Kosten</h2>
                <p>Totale kosten: € {totalCostFor(recipe()).toFixed(2)}</p>
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