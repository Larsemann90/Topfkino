const KEY = 'kochapp:favorites'

export function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || []
  } catch {
    return []
  }
}

export function isFavorite(id) {
  return getFavorites().includes(id)
}

export function toggleFavorite(id) {
  const current = getFavorites()
  const next = current.includes(id)
    ? current.filter((x) => x !== id)
    : [...current, id]
  localStorage.setItem(KEY, JSON.stringify(next))
  return next
}
