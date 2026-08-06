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
      <Link to="/" className="logo">KOCHAPP</Link>
      <nav>
        <NavLink to="/" end>Start</NavLink>
        <NavLink to="/suche">Alle Rezepte</NavLink>
        <NavLink to="/favoriten">Favoriten</NavLink>
        <NavLink to="/einreichen">Rezept einreichen</NavLink>
        <NavLink to="/admin">Admin</NavLink>
      </nav>
      <button type="button" className="icon-btn" onClick={handleRandom}>🎲 Überrasch mich</button>
      <form onSubmit={handleSearch}>
        <input
          className="search-input"
          type="search"
          placeholder="Rezepte suchen…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>
    </header>
  )
}
