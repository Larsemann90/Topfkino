import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

// Hinweis: Diese Seite ist absichtlich nicht durch einen Login geschützt (siehe README).
// Am einfachsten hältst du die URL /admin einfach für dich privat, oder richtest
// später einen echten Login ein.
export default function Admin() {
  const [pending, setPending] = useState([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('recipes')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
    setPending(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function approve(id) {
    await supabase.from('recipes').update({ status: 'approved' }).eq('id', id)
    setPending((p) => p.filter((r) => r.id !== id))
  }

  async function reject(id) {
    await supabase.from('recipes').delete().eq('id', id)
    setPending((p) => p.filter((r) => r.id !== id))
  }

  if (loading) return <div className="empty-state">Lade Einreichungen…</div>

  return (
    <div style={{ padding: '32px', maxWidth: 720, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, marginBottom: 20 }}>Ausstehende Einreichungen</h1>
      {pending.length === 0 && <p className="empty-state">Keine offenen Einreichungen. 🎉</p>}
      {pending.map((r) => (
        <div className="admin-item" key={r.id}>
          {r.image_url && <img src={r.image_url} alt={r.title} />}
          <div>
            <h3 style={{ margin: '0 0 4px' }}>{r.title}</h3>
            <p style={{ margin: 0, color: 'var(--text-dim)', fontSize: 13 }}>
              von {r.author}{r.category ? ` · ${r.category}` : ''} · {r.ingredients?.length || 0} Zutaten
            </p>
            <div className="admin-actions">
              <button className="btn-approve" onClick={() => approve(r.id)}>Freigeben</button>
              <button className="btn-reject" onClick={() => reject(r.id)}>Ablehnen</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
