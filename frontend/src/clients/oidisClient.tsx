const apiUri = "https://oidis-backend-300347239104.europe-west4.run.app";

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