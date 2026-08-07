import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Navbar() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  function handleSearch(e) {
    e.preventDefault()
    if (query.trim()) navigate(`/suche?q=${encodeURIComponent(query.trim())}`)
  }

  async function handleRandom() {
    const { data } = await supabase.from('recipes').select('id').eq('status', 'approved')
    if (data && data.length > 0) {
      const pick = data[Math.floor(Math.random() * data.length)]
      navigate(`/rezept/${pick.id}`)
    }
  }

  return (
    <header className="navbar">
      <div className="navbar-top">
        <Link to="/" className="logo">TOPFKINO</Link>
        <form onSubmit={handleSearch} className="navbar-search">
          <input
            className="search-input"
            type="search"
            placeholder="Suchen…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>
      </div>
      <nav className="navbar-pills">
        <NavLink to="/" end className="pill">Start</NavLink>
        <NavLink to="/suche" className="pill">Alle Rezepte</NavLink>
        <NavLink to="/favoriten" className="pill">Favoriten</NavLink>
        <NavLink to="/einreichen" className="pill">Einreichen</NavLink>
        <button type="button" className="pill" onClick={handleRandom}>Überrasch mich</button>
        <NavLink to="/admin" className="pill">Admin</NavLink>
      </nav>
    </header>
  )
}
