import { Link } from 'react-router-dom'
import { useState } from 'react'
import { isFavorite, toggleFavorite } from '../lib/favorites'

export default function RecipeCard({ recipe }) {
  const [fav, setFav] = useState(isFavorite(recipe.id))

  function handleFavClick(e) {
    e.preventDefault()
    setFav(toggleFavorite(recipe.id).includes(recipe.id))
  }

  return (
    <Link to={`/rezept/${recipe.id}`} className="recipe-card">
      <button className="fav-toggle" onClick={handleFavClick} aria-label="Favorit umschalten">
        {fav ? '♥' : '♡'}
      </button>
      <img src={recipe.image_url} alt={recipe.title} loading="lazy" />
      <div className="info">
        <h3>{recipe.title}</h3>
        <p>von {recipe.author}</p>
      </div>
    </Link>
  )
}
