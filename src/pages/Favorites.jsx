import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { getFavorites } from '../lib/favorites'
import RecipeCard from '../components/RecipeCard'

export default function Favorites() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const ids = getFavorites()
      if (ids.length === 0) { setLoading(false); return }
      const { data } = await supabase.from('recipes').select('*').in('id', ids)
      setRecipes(data || [])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div style={{ padding: '32px' }}>
      <h1 style={{ fontSize: 28 }}>Deine Favoriten</h1>
      {loading ? (
        <p>Lade…</p>
      ) : recipes.length === 0 ? (
        <p>Noch keine Favoriten gespeichert. Tippe auf das Herz bei einem Rezept.</p>
      ) : (
        <div className="category-track" style={{ padding: '16px 0', flexWrap: 'wrap' }}>
          {recipes.map((r) => <RecipeCard key={r.id} recipe={r} />)}
        </div>
      )}
    </div>
  )
}
