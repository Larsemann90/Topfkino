import { useState } from 'react'
import { CATEGORIES } from '../lib/categories'

export default function RecipeForm({ initial, onSave, saving, submitLabel }) {
  const [title, setTitle] = useState(initial?.title || '')
  const [author, setAuthor] = useState(initial?.author || '')
  const [category, setCategory] = useState(initial?.category || '')
  const [imageUrl, setImageUrl] = useState(initial?.image_url || '')
  const [ingredients, setIngredients] = useState(
    initial?.ingredients?.length ? initial.ingredients : ['']
  )
  const [stepsText, setStepsText] = useState(
    initial?.steps?.length ? initial.steps.join('\n') : ''
  )

  function updateIngredient(i, value) {
    setIngredients((list) => list.map((item, idx) => (idx === i ? value : item)))
  }
  function addIngredient() {
    setIngredients((list) => [...list, ''])
  }
  function removeIngredient(i) {
    setIngredients((list) => list.filter((_, idx) => idx !== i))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSave({
      title: title.trim(),
      author: author.trim(),
      category: category || null,
      image_url: imageUrl.trim() || null,
      ingredients: ingredients.map((i) => i.trim()).filter(Boolean),
      steps: stepsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
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
        <label>Zutaten</label>
        {ingredients.map((ing, i) => (
          <div className="ingredient-row" key={i}>
            <input
              placeholder="z.B. 200g Mehl"
              value={ing}
              onChange={(e) => updateIngredient(i, e.target.value)}
            />
            {ingredients.length > 1 && (
              <button type="button" className="icon-btn" onClick={() => removeIngredient(i)}>–</button>
            )}
          </div>
        ))}
        <button type="button" className="icon-btn" onClick={addIngredient}>+ Zutat hinzufügen</button>
      </div>

      <div className="form-field">
        <label>Kochanleitung (jeder Schritt in eine neue Zeile)</label>
        <textarea
          required
          rows={10}
          placeholder={'z.B.\nOfen auf 180°C vorheizen\nMehl und Zucker vermischen\n…'}
          value={stepsText}
          onChange={(e) => setStepsText(e.target.value)}
        />
      </div>

      <button className="btn-primary" type="submit" disabled={saving}>
        {saving ? 'Wird gespeichert…' : submitLabel}
      </button>
    </form>
  )
}
