const STORAGE_KEY = 'sugarsafe_recent_meals'
const MAX_ITEMS = 8

function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeStorage(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // private browsing or quota exceeded — fail silently
  }
}

export function getRecentMeals() {
  return readStorage()
}

// Saves a confirmed dish's resolved nutrition as a "Log Again" shortcut. If the
// same dish (by name) is already saved, this just bumps it to the top and
// refreshes its snapshot instead of creating a duplicate entry.
export function upsertRecentMeal(nutritionResult) {
  const dishName = nutritionResult?.dishName?.trim()
  if (!dishName) return null

  const meals = readStorage()
  const normalized = dishName.toLowerCase()
  const existingIndex = meals.findIndex((m) => m.dishName.trim().toLowerCase() === normalized)

  const entry = {
    id: existingIndex >= 0 ? meals[existingIndex].id : crypto.randomUUID(),
    dishName,
    nutritionResult,
    lastLoggedAt: new Date().toISOString(),
  }

  if (existingIndex >= 0) {
    meals.splice(existingIndex, 1)
  }
  meals.unshift(entry)
  if (meals.length > MAX_ITEMS) {
    meals.length = MAX_ITEMS
  }
  writeStorage(meals)
  return entry
}
