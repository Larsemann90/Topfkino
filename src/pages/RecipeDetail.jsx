import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { exportRecipeAsWord, exportRecipeAsPdf } from '../lib/recipeExport'
import { isFavorite, toggleFavorite } from '../lib/favorites'

export default function RecipeDetail() {
  const { id } = useParams()
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [fav, setFav] = useState(false)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('recipes').select('*').eq('id', id).single()
      setRecipe(data)
      setLoading(false)
      setFav(isFavorite(id))
      // Aufruf zählen (für den Top-10-Bereich), Fehler hier sind unkritisch
      supabase.from('recipe_views').insert({ recipe_id: id }).then(() => {})
    }
    load()
  }, [id])

  function handleFavClick() {
    setFav(toggleFavorite(id).includes(id))
  }

  if (loading) return <div className="empty-state">Lade…</div>
  if (!recipe) return <div className="empty-state">Rezept nicht gefunden.</div>

  const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : []
  const steps = Array.isArray(recipe.steps) ? recipe.steps : []

  return (
    <div className="detail-wrap">
      <div className="detail-actions no-print">
        <button className="icon-btn" onClick={() => window.print()}>🖨️ Drucken</button>
        <button className="icon-btn" onClick={() => exportRecipeAsWord(recipe)}>⬇️ Als Word</button>
        <button className="icon-btn" onClick={() => exportRecipeAsPdf(recipe)}>⬇️ Als PDF</button>
      </div>

      {recipe.image_url && (
        <img className="detail-hero-img no-print" src={recipe.image_url} alt={recipe.title} />
      )}
      <h1>{recipe.title}</h1>
      <div className="detail-author-row">
        <p className="detail-author">von {recipe.author}{recipe.category ? ` · ${recipe.category}` : ''}</p>
        <button className="fav-toggle-inline no-print" onClick={handleFavClick} aria-label="Favorit umschalten">
          {fav ? '♥ Favorit' : '♡ Als Favorit merken'}
        </button>
      </div>

      <div className="detail-section">
        <h2>Zutaten</h2>
        <ul>
          {ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
        </ul>
      </div>

      <div className="detail-section">
        <h2>Zubereitung</h2>
        <ol>
          {steps.map((step, i) => <li key={i}>{step}</li>)}
        </ol>
      </div>
    </div>
  )
}
