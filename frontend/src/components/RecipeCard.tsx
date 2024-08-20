import { For, type Component } from 'solid-js';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Timeline } from '~/components/ui/timeline';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';

const RecipeCard: Component = (props: any) => {
    const recipe = () => props.recipe;
    return (
        <Card>
            <CardHeader>
                <CardTitle>{recipe().name}</CardTitle>
                <CardDescription>{recipe().description}</CardDescription>
            </CardHeader>
            <CardContent>
                Ingredients
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead></TableHead>
                            <TableHead class="text-center">Aantal</TableHead>
                            <TableHead class="text-center">Eenheid</TableHead>
                            <TableHead class="text-right">Prijs</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <For each={recipe().products}>
                            {(product) => (
                                <TableRow>
                                    <TableCell class="text-left">{product.name}</TableCell>
                                    <TableCell class="text-middle">{product.count}</TableCell>
                                    <TableCell class="text-middle">Under construction 🛠️</TableCell>
                                    <TableCell class="text-right">Under construction 🛠️</TableCell>
                                </TableRow>
                            )}
                        </For>
                    </TableBody>
                </Table>
                <Button class="w-full" disabled>Add to todo (Microsoft) - Under construction 🛠️</Button>
                <Button class="w-full" disabled>Add to reminders (iOS) - Under construction 🛠️</Button>
            </CardContent>
            <CardFooter>
                <div class="flex-col justify-center w-full">
                    <div class="">Zo maak je het:</div>
                    <Timeline items={recipe().steps.map((x: any, index: number) => {
                        return { title: `Stap ${index + 1}`, description: x };
                    })}
                        activeItem={0}
                    />
                </div>
            </CardFooter>
        </Card>
    );
};

export default RecipeCard;
