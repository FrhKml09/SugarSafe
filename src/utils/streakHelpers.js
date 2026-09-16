function dateKeyOf(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function toDateKey(isoString) {
  const d = new Date(isoString)
  if (Number.isNaN(d.getTime())) return null
  return dateKeyOf(d)
}

export function getLoggedDateKeys(entries) {
  const keys = new Set()
  for (const entry of Array.isArray(entries) ? entries : []) {
    const key = toDateKey(entry.timestamp)
    if (key) keys.add(key)
  }
  return keys
}

// Last `days` days (oldest first) with whether each had a logged entry.
export function buildStreakDays(entries, days = 28) {
  const keys = getLoggedDateKeys(entries)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const result = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = dateKeyOf(d)
    result.push({
      key,
      dayLabel: d.getDate(),
      logged: keys.has(key),
      isToday: i === 0,
    })
  }
  return result
}

// Consecutive days logged, counting back from today. If today has nothing
// logged yet, the streak still counts from yesterday (so it doesn't zero out
// the moment the clock rolls over before you've logged anything today).
export function currentStreak(entries) {
  const keys = getLoggedDateKeys(entries)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const cursor = new Date(today)
  if (!keys.has(dateKeyOf(cursor))) {
    cursor.setDate(cursor.getDate() - 1)
  }

  let streak = 0
  while (keys.has(dateKeyOf(cursor))) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}
