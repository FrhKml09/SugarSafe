const STORAGE_KEY = 'sugarsafe_glucose_log'
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

export function getGlucoseReadings() {
  return readStorage()
}

export function getRecentGlucoseReadings(limit = 5) {
  return readStorage().slice(0, limit)
}

export function addGlucoseReading({ value, unit = 'mmol/L', context, contextLabel = null, linkedScanId = null, linkedDishName = null }) {
  const readings = readStorage()
  const entry = {
    id: crypto.randomUUID(),
    value: Number(value),
    unit,
    context,
    contextLabel: context === 'custom' ? contextLabel || null : null,
    timestamp: new Date().toISOString(),
    linkedScanId,
    linkedDishName,
  }
  readings.unshift(entry)
  if (readings.length > MAX_ITEMS) {
    readings.length = MAX_ITEMS
  }
  writeStorage(readings)
  return entry
}

export function updateGlucoseReading(id, patch) {
  const readings = readStorage()
  const index = readings.findIndex((item) => item.id === id)
  if (index === -1) return
  readings[index] = { ...readings[index], ...patch }
  writeStorage(readings)
}

export function deleteGlucoseReading(id) {
  const readings = readStorage()
  const filtered = readings.filter((item) => item.id !== id)
  writeStorage(filtered)
}
