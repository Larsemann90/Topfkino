import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { CATEGORIES } from '../lib/categories'
import CategoryRow from '../components/CategoryRow'

export default function Home() {
  const [recent, setRecent] = useState([])
  const [top, setTop] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [{ data: recentData, error: recentError }, { data: topData, error: topError }] = await Promise.all([
        supabase
          .from('recipes')
          .select('*')
          .eq('status', 'approved')
          .order('created_at', { ascending: false }),
        supabase
          .from('recipe_popularity')
          .select('*')
          .order('views_last_30d', { ascending: false })
          .limit(10),
      ])
      if (!recentError) setRecent(recentData || [])
      if (!topError) setTop(topData || [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="empty-state">Lade Rezepte…</div>

  if (recent.length === 0) {
    return (
      <div className="empty-state">
        <h2>Noch keine Rezepte da</h2>
        <p>Leg los und <Link to="/einreichen" style={{ color: 'var(--accent)' }}>reiche das erste Rezept ein</Link>.</p>
      </div>
    )
  }

  const featured = recent[0]
  const categories = CATEGORIES
    .map((cat) => ({ cat, recipes: recent.filter((r) => r.category === cat) }))
    .filter((group) => group.recipes.length > 0)

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

      <CategoryRow title="Kürzlich hinzugefügt" recipes={recent} />
      <CategoryRow title="Top 10 (letzter Monat)" recipes={top} />

      {categories.map(({ cat, recipes }) => (
        <CategoryRow key={cat} title={cat} recipes={recipes} />
      ))}
    </>
  )
}
