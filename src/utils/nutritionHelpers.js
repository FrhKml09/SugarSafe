export const PORTION_OPTIONS = [
  { label: 'All', factor: 1 },
  { label: 'About ¾', factor: 0.75 },
  { label: 'About Half', factor: 0.5 },
  { label: 'A Little', factor: 0.25 },
]

function scaleValue(value, factor) {
  return typeof value === 'number' ? Math.round(value * factor * 10) / 10 : null
}

export function scaleNutrition(nutrition, factor) {
  return {
    kcal: scaleValue(nutrition?.kcal, factor),
    carbsG: scaleValue(nutrition?.carbsG, factor),
    sugarG: scaleValue(nutrition?.sugarG, factor),
    proteinG: scaleValue(nutrition?.proteinG, factor),
    fatG: scaleValue(nutrition?.fatG, factor),
  }
}

// Proportionally scales a matched dish's nutrition when the user adds/removes
// ingredients — an honest approximation (same math as the portion-size picker),
// not invented per-ingredient precision. No-ops when the list is unchanged.
export function scaleForComponentEdit(baselineComponents, editedComponents, nutrition) {
  const baselineCount = Array.isArray(baselineComponents) ? baselineComponents.length : 0
  const editedCount = Array.isArray(editedComponents) ? editedComponents.length : 0

  if (baselineCount === 0 || editedCount === baselineCount) {
    return { nutrition, adjusted: false }
  }

  const rawRatio = editedCount / baselineCount
  const ratio = Math.min(1.5, Math.max(0.3, rawRatio))
  return { nutrition: scaleNutrition(nutrition, ratio), adjusted: true }
}

export function buildPlainSummary(carbsG, glycemicLoad) {
  if (glycemicLoad === 'high' || (typeof carbsG === 'number' && carbsG >= 70)) {
    return 'This is a higher-carb meal that can raise blood sugar quickly.'
  }
  if (glycemicLoad === 'medium-high' || (typeof carbsG === 'number' && carbsG >= 45)) {
    return 'This meal has a moderate-to-high amount of carbs.'
  }
  if (glycemicLoad === 'medium' || (typeof carbsG === 'number' && carbsG >= 25)) {
    return 'This is a moderate-carb meal.'
  }
  return 'This is a lighter, lower-carb meal.'
}

function normalize(name) {
  return (name || '').toLowerCase().trim()
}

export function buildGlucoseNote(dishName, glucoseReadings) {
  if (!Array.isArray(glucoseReadings) || glucoseReadings.length === 0) return null
  const target = normalize(dishName)
  if (!target) return null

  const related = glucoseReadings.filter((r) => {
    if (!r.linkedDishName || r.context !== 'after-meal') return false
    const linked = normalize(r.linkedDishName)
    return linked === target || linked.includes(target) || target.includes(linked)
  })

  if (related.length === 0) return null

  const latest = related[0]
  return `Your recorded reading after a similar meal was ${latest.value} ${latest.unit} — worth keeping in mind, though this isn't a diagnosis.`
}

export function isToday(isoString) {
  if (!isoString) return false
  const date = new Date(isoString)
  const now = new Date()
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  )
}

export function isWithinLastDays(isoString, days) {
  if (!isoString) return false
  const date = new Date(isoString).getTime()
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000
  return date >= cutoff
}

function parseGrams(value) {
  if (!value) return 0
  const match = String(value).match(/[\d.]+/)
  return match ? parseFloat(match[0]) : 0
}

export function macroTotalsForToday(history) {
  const todayEntries = (Array.isArray(history) ? history : []).filter((item) => isToday(item.timestamp))

  const totals = todayEntries.reduce(
    (acc, item) => {
      const n = item.estimatedNutrition || {}
      acc.carbsG += parseGrams(n.carbohydrates)
      acc.proteinG += parseGrams(n.protein)
      acc.fatG += parseGrams(n.fat)
      return acc
    },
    { carbsG: 0, proteinG: 0, fatG: 0 }
  )

  return {
    ...totals,
    mealCount: todayEntries.length,
  }
}
