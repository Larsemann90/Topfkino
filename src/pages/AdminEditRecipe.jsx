import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import RecipeForm from '../components/RecipeForm'

export default function AdminEditRecipe() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [session, setSession] = useState(undefined)
  const [recipe, setRecipe] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
  }, [])

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('recipes').select('*').eq('id', id).single()
      setRecipe(data)
    }
    if (session) load()
  }, [id, session])

  async function handleSave(payload) {
    setSaving(true)
    const { error } = await supabase.from('recipes').update(payload).eq('id', id)
    setSaving(false)
    if (!error) navigate('/admin')
  }

  if (session === undefined) return <div className="empty-state">Lade…</div>
  if (session === null) return <div className="empty-state">Bitte zuerst unter /admin anmelden.</div>
  if (!recipe) return <div className="empty-state">Lade Rezept…</div>

  return (
    <div className="form-wrap">
      <h1 style={{ fontSize: 32, marginBottom: 24 }}>Rezept bearbeiten</h1>
      <RecipeForm initial={recipe} onSave={handleSave} saving={saving} submitLabel="Speichern" />
    </div>
  )
}
