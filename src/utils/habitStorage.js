const STORAGE_KEY = 'sugarsafe_habit_log'
const MAX_ITEMS = 200

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

export function getHabitEntries() {
  return readStorage()
}

export function addHabitEntry({ type, typeLabel, durationMinutes = null, note = null }) {
  const entries = readStorage()
  const entry = {
    id: crypto.randomUUID(),
    type,
    typeLabel,
    durationMinutes: durationMinutes != null && durationMinutes !== '' ? Number(durationMinutes) : null,
    note: note?.trim() || null,
    timestamp: new Date().toISOString(),
  }
  entries.unshift(entry)
  if (entries.length > MAX_ITEMS) {
    entries.length = MAX_ITEMS
  }
  writeStorage(entries)
  return entry
}

export function updateHabitEntry(id, patch) {
  const entries = readStorage()
  const index = entries.findIndex((item) => item.id === id)
  if (index === -1) return
  entries[index] = { ...entries[index], ...patch }
  writeStorage(entries)
}

export function deleteHabitEntry(id) {
  const entries = readStorage()
  const filtered = entries.filter((item) => item.id !== id)
  writeStorage(filtered)
}

export function replaceAllHabitEntries(items) {
  writeStorage(Array.isArray(items) ? items : [])
}
