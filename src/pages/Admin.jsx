import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import AdminLogin from '../components/AdminLogin'

export default function Admin() {
  const [session, setSession] = useState(undefined) // undefined = wird geladen
  const [tab, setTab] = useState('pending')
  const [pending, setPending] = useState([])
  const [approved, setApproved] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => setSession(s))
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session) loadAll()
  }, [session])

  async function loadAll() {
    setLoading(true)
    const [{ data: p }, { data: a }] = await Promise.all([
      supabase.from('recipes').select('*').eq('status', 'pending').order('created_at', { ascending: true }),
      supabase.from('recipes').select('*').eq('status', 'approved').order('created_at', { ascending: false }),
    ])
    setPending(p || [])
    setApproved(a || [])
    setLoading(false)
  }

  async function approve(id) {
    await supabase.from('recipes').update({ status: 'approved' }).eq('id', id)
    setPending((list) => list.filter((r) => r.id !== id))
    loadAll()
  }

  async function remove(id, fromTab) {
    if (!confirm('Rezept wirklich löschen?')) return
    await supabase.from('recipes').delete().eq('id', id)
    if (fromTab === 'pending') setPending((list) => list.filter((r) => r.id !== id))
    else setApproved((list) => list.filter((r) => r.id !== id))
  }

  async function logout() {
    await supabase.auth.signOut()
  }

  if (session === undefined) return <div className="empty-state">Lade…</div>
  if (session === null) return <AdminLogin onLoggedIn={() => {}} />

  const list = tab === 'pending' ? pending : approved

  return (
    <div style={{ padding: '32px', maxWidth: 780, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: 28, margin: 0 }}>Admin-Dashboard</h1>
        <button className="icon-btn" onClick={logout}>Abmelden</button>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <button
          className="icon-btn"
          style={tab === 'pending' ? { borderColor: 'var(--accent)', color: 'var(--text)' } : {}}
          onClick={() => setTab('pending')}
        >
          Ausstehend ({pending.length})
        </button>
        <button
          className="icon-btn"
          style={tab === 'approved' ? { borderColor: 'var(--accent)', color: 'var(--text)' } : {}}
          onClick={() => setTab('approved')}
        >
          Veröffentlicht ({approved.length})
        </button>
      </div>

      {loading ? (
        <p>Lade…</p>
      ) : list.length === 0 ? (
        <p className="empty-state">{tab === 'pending' ? 'Keine offenen Einreichungen. 🎉' : 'Noch keine veröffentlichten Rezepte.'}</p>
      ) : (
        list.map((r) => (
          <div className="admin-item" key={r.id}>
            {r.image_url && <img src={r.image_url} alt={r.title} />}
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 4px' }}>{r.title}</h3>
              <p style={{ margin: 0, color: 'var(--text-dim)', fontSize: 13 }}>
                von {r.author}{r.category ? ` · ${r.category}` : ''} · {r.ingredients?.length || 0} Zutaten
              </p>
              <div className="admin-actions">
                {tab === 'pending' && (
                  <button className="btn-approve" onClick={() => approve(r.id)}>Freigeben</button>
                )}
                <Link to={`/admin/bearbeiten/${r.id}`} className="icon-btn" style={{ padding: '6px 14px', fontSize: 13 }}>
                  Bearbeiten
                </Link>
                <button className="btn-reject" onClick={() => remove(r.id, tab)}>Löschen</button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
