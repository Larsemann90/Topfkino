import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import RecipeCard from '../components/RecipeCard'

export default function Search() {
  const [params] = useSearchParams()
  const q = params.get('q') || ''
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data } = await supabase
        .from('recipes')
        .select('*')
        .eq('status', 'approved')
        .ilike('title', `%${q}%`)
      setResults(data || [])
      setLoading(false)
    }
    if (q) load()
    else { setResults([]); setLoading(false) }
  }, [q])

  return (
    <div style={{ padding: '32px' }}>
      <h1 style={{ fontSize: 28 }}>Suchergebnisse für „{q}“</h1>
      {loading ? (
        <p>Suche läuft…</p>
      ) : results.length === 0 ? (
        <p>Keine Rezepte gefunden.</p>
      ) : (
        <div className="category-track" style={{ padding: '16px 0', flexWrap: 'wrap' }}>
          {results.map((r) => <RecipeCard key={r.id} recipe={r} />)}
        </div>
      )}
    </div>
  )
}
