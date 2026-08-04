import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const emptyForm = {
  title: '',
  author: '',
  category: '',
  image_url: '',
  ingredients: [''],
  steps: [''],
}

export default function Submit() {
  const [form, setForm] = useState(emptyForm)
  const [status, setStatus] = useState('idle') // idle | saving | done | error

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function updateListItem(field, index, value) {
    setForm((f) => {
      const list = [...f[field]]
      list[index] = value
      return { ...f, [field]: list }
    })
  }

  function addListItem(field) {
    setForm((f) => ({ ...f, [field]: [...f[field], ''] }))
  }

  function removeListItem(field, index) {
    setForm((f) => ({ ...f, [field]: f[field].filter((_, i) => i !== index) }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('saving')
    const payload = {
      title: form.title.trim(),
      author: form.author.trim(),
      category: form.category.trim() || null,
      image_url: form.image_url.trim() || null,
      ingredients: form.ingredients.map((i) => i.trim()).filter(Boolean),
      steps: form.steps.map((s) => s.trim()).filter(Boolean),
      status: 'pending', // wird erst nach deiner Freigabe sichtbar
    }
    const { error } = await supabase.from('recipes').insert(payload)
    if (error) {
      console.error(error)
      setStatus('error')
    } else {
      setStatus('done')
      setForm(emptyForm)
    }
  }

  if (status === 'done') {
    return (
      <div className="form-wrap">
        <h1>Danke!</h1>
        <p>Dein Rezept wurde eingereicht und wird geprüft, bevor es veröffentlicht wird.</p>
        <button className="btn-primary" onClick={() => setStatus('idle')}>Weiteres Rezept einreichen</button>
      </div>
    )
  }

  return (
    <form className="form-wrap" onSubmit={handleSubmit}>
      <h1 style={{ fontSize: 32, marginBottom: 24 }}>Rezept einreichen</h1>

      <div className="form-field">
        <label>Titel</label>
        <input required value={form.title} onChange={(e) => updateField('title', e.target.value)} />
      </div>

      <div className="form-field">
        <label>Dein Name (Autor)</label>
        <input required value={form.author} onChange={(e) => updateField('author', e.target.value)} />
      </div>

      <div className="form-field">
        <label>Kategorie (z.B. Frühstück, Hauptgericht, Dessert)</label>
        <input value={form.category} onChange={(e) => updateField('category', e.target.value)} />
      </div>

      <div className="form-field">
        <label>Bild-URL</label>
        <input
          type="url"
          placeholder="https://…"
          value={form.image_url}
          onChange={(e) => updateField('image_url', e.target.value)}
        />
      </div>

      <div className="form-field">
        <label>Zutaten</label>
        {form.ingredients.map((ing, i) => (
          <div className="ingredient-row" key={i}>
            <input
              placeholder="z.B. 200g Mehl"
              value={ing}
              onChange={(e) => updateListItem('ingredients', i, e.target.value)}
            />
            {form.ingredients.length > 1 && (
              <button type="button" className="icon-btn" onClick={() => removeListItem('ingredients', i)}>–</button>
            )}
          </div>
        ))}
        <button type="button" className="icon-btn" onClick={() => addListItem('ingredients')}>+ Zutat hinzufügen</button>
      </div>

      <div className="form-field">
        <label>Kochanleitung</label>
        {form.steps.map((step, i) => (
          <div className="ingredient-row" key={i}>
            <input
              placeholder={`Schritt ${i + 1}`}
              value={step}
              onChange={(e) => updateListItem('steps', i, e.target.value)}
            />
            {form.steps.length > 1 && (
              <button type="button" className="icon-btn" onClick={() => removeListItem('steps', i)}>–</button>
            )}
          </div>
        ))}
        <button type="button" className="icon-btn" onClick={() => addListItem('steps')}>+ Schritt hinzufügen</button>
      </div>

      {status === 'error' && <p style={{ color: 'var(--accent)' }}>Etwas ist schiefgelaufen. Bitte versuch es erneut.</p>}

      <button className="btn-primary" type="submit" disabled={status === 'saving'}>
        {status === 'saving' ? 'Wird gesendet…' : 'Rezept einreichen'}
      </button>
    </form>
  )
}
