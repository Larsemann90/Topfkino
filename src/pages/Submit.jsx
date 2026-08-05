import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import RecipeForm from '../components/RecipeForm'

export default function Submit() {
  const [status, setStatus] = useState('idle') // idle | saving | done | error
  const [formKey, setFormKey] = useState(0) // erzwingt ein frisches, leeres Formular nach dem Absenden

  async function handleSave(payload) {
    setStatus('saving')
    const { error } = await supabase.from('recipes').insert({ ...payload, status: 'pending' })
    if (error) {
      console.error(error)
      setStatus('error')
    } else {
      setStatus('done')
    }
  }

  if (status === 'done') {
    return (
      <div className="form-wrap">
        <h1>Danke!</h1>
        <p>Dein Rezept wurde eingereicht und wird geprüft, bevor es veröffentlicht wird.</p>
        <button className="btn-primary" onClick={() => { setStatus('idle'); setFormKey((k) => k + 1) }}>
          Weiteres Rezept einreichen
        </button>
      </div>
    )
  }

  return (
    <div className="form-wrap">
      <h1 style={{ fontSize: 32, marginBottom: 24 }}>Rezept einreichen</h1>
      {status === 'error' && (
        <p style={{ color: 'var(--accent)', marginBottom: 16 }}>Etwas ist schiefgelaufen. Bitte versuch es erneut.</p>
      )}
      <RecipeForm key={formKey} onSave={handleSave} saving={status === 'saving'} submitLabel="Rezept einreichen" />
    </div>
  )
}
