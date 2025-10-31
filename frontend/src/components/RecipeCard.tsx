import { type Component } from 'solid-js';
import styles from '../App.module.css';
import recipeImage from '../assets/recipe.jpg';

const RecipeCard: Component = (props: any) => {
    const recipe = () => props.recipe;

    const totalCost = () => {
        const products = recipe()?.products || [];
        return products.reduce((sum: number, item: any) => {
            const p = item.product || {};
            const packageSize = Number(p.packageSize) || 0;
            const packagePrize = Number(p.packagePrize) || 0;
            const count = Number(item.count) || 0;

            if (packageSize <= 0 || packagePrize <= 0) return sum;

            const cost = (count / packageSize) * packagePrize;
            return sum + cost;
        }, 0);
    };

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
                <p>Totale kosten: € {totalCost().toFixed(2)}</p>
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