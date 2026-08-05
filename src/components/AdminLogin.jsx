import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function AdminLogin({ onLoggedIn }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError('E-Mail oder Passwort falsch.')
    } else {
      onLoggedIn()
    }
  }

  return (
    <div className="form-wrap" style={{ maxWidth: 380 }}>
      <h1 style={{ fontSize: 28, marginBottom: 20 }}>Admin-Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label>E-Mail</label>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-field">
          <label>Passwort</label>
          <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <p style={{ color: 'var(--accent)', fontSize: 13 }}>{error}</p>}
        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? 'Prüfe…' : 'Anmelden'}
        </button>
      </form>
    </div>
  )
}
