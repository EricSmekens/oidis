import { createSignal, For, type Component } from 'solid-js';

import recipeImage from '../assets/recipe.jpg';

const RecipeCard: Component = (props: any) => {
    const [timeLeft, setTimeLeft] = createSignal(0);
    const [timerActive, setTimerActive] = createSignal(false);

    const startTimer = (seconds: number) => {
        setTimeLeft(seconds);
        setTimerActive(true);
        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setTimerActive(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };
    const recipe = () => props.recipe;
    return (
        <main class="max-w-3xl mx-auto p-6 font-sans text-gray-800">
            <img src={recipeImage} alt={recipe().name} class="w-full h-64 object-cover rounded-lg shadow" />
            <h1 class="text-4xl font-bold mt-6 mb-4">{recipe().name}</h1>

            <section class="mb-8">
                <h2 class="text-2xl font-semibold mb-2">Ingrediënten</h2>
                <ul class="grid grid-cols-2 gap-2 bg-gray-50 p-4 rounded-lg shadow-sm">
                    {recipe().products.map((item: any) => (
                        <li class="before:content-['•'] before:mr-2">{item.name}</li>
                    ))}
                </ul>
            </section>

            <section class="mb-8">
                <h2 class="text-2xl font-semibold mb-2">Bereidingswijze</h2>
                <ol class="list-decimal pl-6 space-y-2">
                    {recipe().steps.map((step: any) => (
                        <li>{step}</li>
                    ))}
                </ol>
            </section>

            <section>
                <h2 class="text-2xl font-semibold mb-2">Kooktimer</h2>
                <button
                    onClick={() => startTimer(600)}
                    disabled={timerActive()}
                    class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                >
                    Start 10 minuten timer
                </button>
                {timerActive() && <p class="mt-2 text-lg">Tijd over: {timeLeft()} seconden</p>}
            </section>
        </main>
    );
};

export default RecipeCard;
