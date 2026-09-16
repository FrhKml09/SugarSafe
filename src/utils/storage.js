const STORAGE_KEY = 'sugarsafe_scan_history'
const MAX_ITEMS = 50

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

export function getHistory() {
  return readStorage()
}

export function addToHistory(item) {
  const history = readStorage()
  const entry = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    dishName: item.dishName,
    glycemicLoad: item.glycemicLoad || null,
    estimatedNutrition: item.estimatedNutrition,
    suggestion: item.suggestion,
  }
  history.unshift(entry)
  if (history.length > MAX_ITEMS) {
    history.length = MAX_ITEMS
  }
  writeStorage(history)
  return entry
}

export function updateHistoryEntry(id, patch) {
  const history = readStorage()
  const index = history.findIndex((item) => item.id === id)
  if (index === -1) return
  history[index] = { ...history[index], ...patch }
  writeStorage(history)
}

export function deleteFromHistory(id) {
  const history = readStorage()
  const filtered = history.filter((item) => item.id !== id)
  writeStorage(filtered)
}

export function clearHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // fail silently
  }
}

export function replaceAllHistory(items) {
  writeStorage(Array.isArray(items) ? items : [])
}
