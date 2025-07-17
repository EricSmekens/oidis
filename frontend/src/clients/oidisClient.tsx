const apiUri = "https://service-name-300347239104.europe-west1.run.app";

const fetchAllRecipes = async () => {
    const response = await fetch(`${apiUri}/recipes`,
        {
            method: "get",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        });

    return (await response.json());
}

export const fetchRecipes = async () => {
    return fetchAllRecipes();
};