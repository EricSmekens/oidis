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

const fetchNumberOfRecipes = async (authToken: string) => {
    const response = await fetch(`${dataBaseUri}/aggregate`,
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
                "pipeline": [
                    {
                      "$count": "count"
                    }
                  ]
            })
        });

    return (await response.json()).documents[0].count;
}

export const getNumberOfRecipes = async () => {
    const authToken = await authorize();
    return fetchNumberOfRecipes(authToken);
};