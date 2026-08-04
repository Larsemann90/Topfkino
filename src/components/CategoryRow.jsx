import RecipeCard from './RecipeCard'

export default function CategoryRow({ title, recipes }) {
  if (!recipes || recipes.length === 0) return null
  return (
    <section className="category-row">
      <h2>{title}</h2>
      <div className="category-track">
        {recipes.map((r) => (
          <RecipeCard key={r.id} recipe={r} />
        ))}
      </div>
    </section>
  )
}
