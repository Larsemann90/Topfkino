import { useState } from 'react'
import { CATEGORIES } from '../lib/categories'

export default function RecipeForm({ initial, onSave, saving, submitLabel }) {
  const [title, setTitle] = useState(initial?.title || '')
  const [author, setAuthor] = useState(initial?.author || '')
  const [category, setCategory] = useState(initial?.category || '')
  const [imageUrl, setImageUrl] = useState(initial?.image_url || '')
  const [ingredientsText, setIngredientsText] = useState(
    initial?.ingredients?.length ? initial.ingredients.join('\n') : ''
  )
  const [steps, setSteps] = useState(
    initial?.steps?.length ? initial.steps : ['']
  )

  function updateStep(i, value) {
    setSteps((list) => list.map((item, idx) => (idx === i ? value : item)))
  }
  function addStep() {
    setSteps((list) => [...list, ''])
  }
  function removeStep(i) {
    setSteps((list) => list.filter((_, idx) => idx !== i))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSave({
      title: title.trim(),
      author: author.trim(),
      category: category || null,
      image_url: imageUrl.trim() || null,
      ingredients: ingredientsText.split('\n').map((i) => i.trim()).filter(Boolean),
      steps: steps.map((s) => s.trim()).filter(Boolean),
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-field">
        <label>Titel</label>
        <input required value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div className="form-field">
        <label>Autor</label>
        <input required value={author} onChange={(e) => setAuthor(e.target.value)} />
      </div>

      <div className="form-field">
        <label>Kategorie</label>
        <select required value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="" disabled>Bitte wählen…</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="form-field">
        <label>Bild-URL</label>
        <input type="url" placeholder="https://…" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
      </div>

      <div className="form-field">
        <label>Zutaten (eine pro Zeile, gerne direkt eingefügt/kopiert)</label>
        <textarea
          required
          rows={8}
          placeholder={'z.B.\n200g Mehl\n2 Eier\n1 Prise Salz'}
          value={ingredientsText}
          onChange={(e) => setIngredientsText(e.target.value)}
        />
      </div>

      <div className="form-field">
        <label>Kochanleitung</label>
        {steps.map((step, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 4 }}>Schritt {i + 1}</div>
            <div className="ingredient-row" style={{ alignItems: 'flex-start' }}>
              <textarea
                rows={4}
                placeholder="Was ist bei diesem Schritt zu tun?"
                value={step}
                onChange={(e) => updateStep(i, e.target.value)}
              />
              {steps.length > 1 && (
                <button type="button" className="icon-btn" onClick={() => removeStep(i)}>–</button>
              )}
            </div>
          </div>
        ))}
        <button type="button" className="icon-btn" onClick={addStep}>+ Nächster Schritt</button>
      </div>

      <button className="btn-primary" type="submit" disabled={saving}>
        {saving ? 'Wird gespeichert…' : submitLabel}
      </button>
    </form>
  )
}
