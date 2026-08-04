import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Navbar() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  function handleSearch(e) {
    e.preventDefault()
    if (query.trim()) navigate(`/suche?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <header className="navbar">
      <Link to="/" className="logo">KOCHAPP</Link>
      <nav>
        <NavLink to="/" end>Start</NavLink>
        <NavLink to="/favoriten">Favoriten</NavLink>
        <NavLink to="/einreichen">Rezept einreichen</NavLink>
        <NavLink to="/admin">Admin</NavLink>
      </nav>
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
