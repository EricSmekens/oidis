export interface Recipe {
    _id: string;
    name: string;
    description: string;
    preparationDurationInMinutes: number;
    products: Product[];
    steps: string[];
}

export interface Product {
    name: string;
    count: number;
    unit: string;
}