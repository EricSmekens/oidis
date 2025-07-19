import { useParams } from '@solidjs/router';
import RecipeCard from './RecipeCard';

export default function RecipeDetailPage(props: { recipes: any[] }) {
  const params = useParams();
  const recipe = () => props.recipes.find(r => r._id === params.id);
  return recipe() ? <RecipeCard recipe={recipe()} /> : <div>Niet gevonden</div>;
}