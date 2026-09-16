import { useState } from 'react'
import ScreenHeader from './ScreenHeader'
import {
  calculateBMI,
  bmiCategory,
  DIABETES_TYPE_OPTIONS,
  ACTIVITY_LEVEL_OPTIONS,
} from '../utils/profileStorage'
import { ShieldIcon } from './icons'

export default function Profile({ profile, onSave, onBack, onSkip, mode = 'edit' }) {
  const isOnboarding = mode === 'onboarding'
  const [heightCm, setHeightCm] = useState(profile?.heightCm ?? '')
  const [weightKg, setWeightKg] = useState(profile?.weightKg ?? '')
  const [age, setAge] = useState(profile?.age ?? '')
  const [diabetesType, setDiabetesType] = useState(profile?.diabetesType ?? 'unsure')
  const [activityLevel, setActivityLevel] = useState(profile?.activityLevel ?? 'moderate')
  const [saved, setSaved] = useState(false)

  const bmi = calculateBMI(heightCm, weightKg)
  const category = bmiCategory(bmi)

  function handleSubmit(event) {
    event.preventDefault()
    onSave({
      heightCm: heightCm ? Number(heightCm) : null,
      weightKg: weightKg ? Number(weightKg) : null,
      age: age ? Number(age) : null,
      diabetesType,
      activityLevel,
    })
    if (isOnboarding) return
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="sf-screen">
      {isOnboarding ? (
        <div className="sf-header">
          <p className="screen-eyebrow">
            SugarSafe Heritage
            <span className="sf-header-tag">Welcome</span>
          </p>
          <h1 className="sf-header-title">Let&rsquo;s Personalize This</h1>
          <p className="sf-header-subtitle">Mari Peribadikan</p>
          <div className="sf-header-rule" />
        </div>
      ) : (
        <ScreenHeader title="Your Health Profile" subtitle="Profil Kesihatan Anda" tag="Personalize" onBack={onBack} />
      )}

      <div className="sf-card" style={{ marginBottom: 16 }}>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: 'var(--color-text-secondary)' }}>
          {isOnboarding
            ? 'A few quick details make your advice more accurate — BMI, portion guidance, all of it. Takes about 30 seconds and stays on this device only.'
            : 'This helps SugarSafe tailor advice to you specifically. It stays on this device — the same as your meal and glucose logs — and is never sent anywhere.'}
        </p>
      </div>

      <form className="glucose-log" onSubmit={handleSubmit}>
        <label className="scan-result-edit-label" htmlFor="profile-height">
          Height (cm)
        </label>
        <input
          id="profile-height"
          type="number"
          inputMode="decimal"
          min="0"
          placeholder="e.g. 165"
          className="scan-result-edit-input"
          value={heightCm}
          onChange={(e) => setHeightCm(e.target.value)}
        />

        <label className="scan-result-edit-label" htmlFor="profile-weight">
          Weight (kg)
        </label>
        <input
          id="profile-weight"
          type="number"
          inputMode="decimal"
          min="0"
          placeholder="e.g. 68"
          className="scan-result-edit-input"
          value={weightKg}
          onChange={(e) => setWeightKg(e.target.value)}
        />

        {bmi != null && (
          <div className="sf-card sf-target-card" style={{ marginBottom: 16, boxShadow: 'none' }}>
            <span className="sf-target-icon">
              <ShieldIcon width={16} height={16} />
            </span>
            <div style={{ flex: 1 }}>
              <p className="sf-target-title">
                BMI: {bmi} {category && <span className={`sf-impact-pill ${category.className}`} style={{ marginLeft: 6 }}>{category.label}</span>}
              </p>
              <p className="sf-target-sub">
                Based on Malaysian/Asian BMI cutoffs (MOH Clinical Practice Guidelines), which are lower
                than standard WHO ranges — not a diagnosis, just a general reference point.
              </p>
            </div>
          </div>
        )}

        <label className="scan-result-edit-label" htmlFor="profile-age">
          Age
        </label>
        <input
          id="profile-age"
          type="number"
          inputMode="numeric"
          min="0"
          placeholder="e.g. 45"
          className="scan-result-edit-input"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <label className="scan-result-edit-label" htmlFor="profile-diabetes-type">
          Diabetes status
        </label>
        <select
          id="profile-diabetes-type"
          className="scan-result-edit-input glucose-select"
          value={diabetesType}
          onChange={(e) => setDiabetesType(e.target.value)}
        >
          {DIABETES_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <label className="scan-result-edit-label" htmlFor="profile-activity">
          Activity level
        </label>
        <select
          id="profile-activity"
          className="scan-result-edit-input glucose-select"
          value={activityLevel}
          onChange={(e) => setActivityLevel(e.target.value)}
        >
          {ACTIVITY_LEVEL_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <button type="submit" className="glucose-save">
          {isOnboarding ? 'Continue' : saved ? 'Saved ✓' : 'Save profile'}
        </button>

        {isOnboarding && (
          <button type="button" className="onboarding-skip-btn" onClick={onSkip}>
            Skip for now
          </button>
        )}
      </form>
    </div>
  )
}
