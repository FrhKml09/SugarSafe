const STORAGE_KEY = 'sugarsafe_profile'
const ONBOARDING_KEY = 'sugarsafe_onboarding_seen'

function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function getProfile() {
  return readStorage()
}

export function saveProfile(profile) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
  } catch {
    // private browsing or quota exceeded — fail silently
  }
  return profile
}

export function clearProfile() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // fail silently
  }
}

export function hasSeenOnboarding() {
  try {
    return localStorage.getItem(ONBOARDING_KEY) === 'true'
  } catch {
    return false
  }
}

export function markOnboardingSeen() {
  try {
    localStorage.setItem(ONBOARDING_KEY, 'true')
  } catch {
    // fail silently
  }
}

export function calculateBMI(heightCm, weightKg) {
  const h = Number(heightCm)
  const w = Number(weightKg)
  if (!h || !w || h <= 0 || w <= 0) return null
  const meters = h / 100
  return Math.round((w / (meters * meters)) * 10) / 10
}

// Asian/Malaysian BMI cutoffs (Malaysia CPG on Obesity, WHO Western Pacific classification)
// are lower than the standard WHO ranges — used here since the app is Malaysia-focused.
export function bmiCategory(bmi) {
  if (bmi == null) return null
  if (bmi < 18.5) return { label: 'Underweight', className: 'sf-impact-pill--medium' }
  if (bmi < 23) return { label: 'Normal', className: 'sf-impact-pill--low' }
  if (bmi < 27.5) return { label: 'Overweight', className: 'sf-impact-pill--medium' }
  return { label: 'Obese', className: 'sf-impact-pill--high' }
}

export const DIABETES_TYPE_OPTIONS = [
  { value: 'none', label: 'Not managing diabetes' },
  { value: 'prediabetes', label: 'Prediabetes' },
  { value: 'type1', label: 'Type 1 diabetes' },
  { value: 'type2', label: 'Type 2 diabetes' },
  { value: 'gestational', label: 'Gestational diabetes' },
  { value: 'unsure', label: 'Prefer not to say' },
]

export const ACTIVITY_LEVEL_OPTIONS = [
  { value: 'sedentary', label: 'Sedentary (little to no exercise)' },
  { value: 'light', label: 'Lightly active (1-2 days/week)' },
  { value: 'moderate', label: 'Moderately active (3-4 days/week)' },
  { value: 'active', label: 'Very active (5+ days/week)' },
]
