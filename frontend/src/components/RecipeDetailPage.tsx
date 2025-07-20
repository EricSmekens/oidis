
import { useParams, useNavigate } from '@solidjs/router';
import RecipeCard from './RecipeCard';
import styles from '../App.module.css';

export default function RecipeDetailPage(props: { recipes: any[] }) {
  const params = useParams();
  const navigate = useNavigate();
  const recipe = () => props.recipes.find(r => r._id === params.id);

  if (!recipe()) return <div class={styles.pageBg}><div class={styles.maincontent}>Niet gevonden</div></div>;

  return (
    <div class={styles.pageBg}>
      <div class={styles.headerBar} style="">
        <button
          onClick={() => navigate('/')}
          style={{
            background: '#388e3c',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 18px',
            fontWeight: 600,
            fontSize: '1rem',
            cursor: 'pointer',
            marginRight: '16px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
          }}
        >
          ← Terug
        </button>
      </div>
      <div style={{ display: 'flex', 'min-height': 'calc(100vh - 80px)', padding: '24px 0', 'align-items': 'center', 'justify-content': 'space-around' }}>
      {/* @ts-ignore */}
      <RecipeCard recipe={recipe()} />
    </div>
    </div >
  );
}