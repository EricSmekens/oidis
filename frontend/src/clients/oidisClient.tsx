const dataBaseUri = "https://eu-central-1.aws.data.mongodb-api.com/app/oidis-backend-cmimcek/endpoint/data/v1/action";
const authUri = "https://eu-central-1.aws.services.cloud.mongodb.com/api/client/v2.0/app/oidis-backend-cmimcek/auth/providers/anon-user/login";

const authorize = async () => {
    const response = await fetch(authUri,
        {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }
    );

    const responseBody = await response.json();
    return responseBody.access_token;
}

const fetchAllRecipes = async (authToken: string) => {
    const response = await fetch(`${dataBaseUri}/find`,
        {
            method: "post",
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "dataSource": "mongodb-atlas",
                "database": "oidis",
                "collection": "recipes",
                "filter": { }
            })
        });

    return (await response.json()).documents;
}

export const fetchRecipes = async () => {
    const authToken = await authorize();
    return fetchAllRecipes(authToken);
};