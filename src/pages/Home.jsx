import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import CategoryRow from '../components/CategoryRow'

export default function Home() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
      if (!error) setRecipes(data || [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="empty-state">Lade Rezepte…</div>

  if (recipes.length === 0) {
    return (
      <div className="empty-state">
        <h2>Noch keine Rezepte da</h2>
        <p>Leg los und <Link to="/einreichen" style={{ color: 'var(--accent)' }}>reiche das erste Rezept ein</Link>.</p>
      </div>
    )
  }

  const featured = recipes[0]
  const categories = groupByCategory(recipes)

  return (
    <>
      <div
        className="hero"
        style={{ backgroundImage: featured.image_url ? `url(${featured.image_url})` : 'none' }}
      >
        <div className="hero-content">
          <h1 className="hero-title">{featured.title}</h1>
          <p className="hero-meta">von {featured.author}{featured.category ? ` · ${featured.category}` : ''}</p>
          <Link to={`/rezept/${featured.id}`} className="btn-primary">Rezept ansehen</Link>
        </div>
      </div>

      {Object.entries(categories).map(([cat, list]) => (
        <CategoryRow key={cat} title={cat} recipes={list} />
      ))}
    </>
  )
}

function groupByCategory(recipes) {
  const groups = {}
  for (const r of recipes) {
    const cat = r.category || 'Sonstiges'
    if (!groups[cat]) groups[cat] = []
    groups[cat].push(r)
  }
  return groups
}
