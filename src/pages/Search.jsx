import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { CATEGORIES } from '../lib/categories'
import RecipeCard from '../components/RecipeCard'

export default function Search() {
  const [params] = useSearchParams()
  const q = params.get('q') || ''
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('neu') // 'neu' | 'beliebt'
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const table = sort === 'beliebt' ? 'recipe_popularity' : 'recipes'
      let query = supabase.from(table).select('*')
      if (table === 'recipes') query = query.eq('status', 'approved')
      if (q) query = query.or(`title.ilike.%${q}%,author.ilike.%${q}%`)
      if (category) query = query.eq('category', category)
      query = sort === 'beliebt'
        ? query.order('views_total', { ascending: false })
        : query.order('created_at', { ascending: false })

      const { data } = await query
      setResults(data || [])
      setLoading(false)
    }
    load()
  }, [q, category, sort])

  return (
    <div style={{ padding: '32px' }}>
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>
        {q ? `Suchergebnisse für „${q}“ (Titel & Autor)` : 'Alle Rezepte'}
      </h1>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <select className="search-input" style={{ width: 'auto' }} value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Alle Kategorien</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="search-input" style={{ width: 'auto' }} value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="neu">Neueste zuerst</option>
          <option value="beliebt">Beliebteste zuerst</option>
        </select>
      </div>

      {loading ? (
        <p>Lade…</p>
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
