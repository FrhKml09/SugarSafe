import { useState } from 'react'
import Disclaimer from './Disclaimer'
import GlycemicSpectrum from './GlycemicSpectrum'
import ScreenHeader from './ScreenHeader'
import { GlucoseIcon, LightbulbIcon, HistoryIcon, BookmarkIcon, ScanIcon, SwapIcon } from './icons'
import { scaleNutrition } from '../utils/nutritionHelpers'

const QUICK_PORTIONS = [
  { label: '¾ of this', factor: 0.75 },
  { label: 'Half of this', factor: 0.5 },
  { label: 'A quarter of this', factor: 0.25 },
]

function pctChange(before, after) {
  if (typeof before !== 'number' || typeof after !== 'number' || before === 0) return null
  return Math.round(((after - before) / before) * 100)
}

export default function FinalSummary({
  dishName,
  plainSummary,
  swapTips,
  nutrition,
  source,
  roughEstimate,
  glucoseNote,
  portionLabel,
  glycemicLoad,
  components,
  photoUrl,
  onSaveToHistory,
  onScanAgain,
  onWhatIf,
  saved,
}) {
  const [selectedComponents, setSelectedComponents] = useState(components || [])
  const [whatIf, setWhatIf] = useState(null)
  const [whatIfLoading, setWhatIfLoading] = useState(false)
  const [whatIfError, setWhatIfError] = useState('')

  function toggleComponent(name) {
    setWhatIfError('')
    setSelectedComponents((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    )
  }

  function tryPortion(option) {
    setWhatIfError('')
    setWhatIf({
      label: `If you'd eaten ${option.label.toLowerCase()}`,
      nutrition: scaleNutrition(nutrition, option.factor),
      roughEstimate,
    })
  }

  async function tryIngredients() {
    if (!onWhatIf) return
    setWhatIfError('')
    setWhatIfLoading(true)
    try {
      const result = await onWhatIf(selectedComponents)
      setWhatIf({
        label: "If you skip what you've unchecked",
        nutrition: result?.nutrition,
        roughEstimate: result?.roughEstimate,
      })
    } catch {
      setWhatIfError('Could not estimate that — try again.')
    } finally {
      setWhatIfLoading(false)
    }
  }

  const hasMultipleComponents = Array.isArray(components) && components.length > 1
  const componentsChanged =
    Array.isArray(components) &&
    (selectedComponents.length !== components.length ||
      selectedComponents.some((c) => !components.includes(c)))
  const kcalDelta = whatIf ? pctChange(nutrition?.kcal, whatIf.nutrition?.kcal) : null

  return (
    <div className="sf-screen">
      <ScreenHeader title="Meal Analysis" onBack={onScanAgain} />

      <Disclaimer />

      {photoUrl && (
        <div className="sf-photo-card" style={{ marginTop: 16 }}>
          <img src={photoUrl} alt={dishName} />
          <span className="sf-photo-tag">Nusantara Heritage Dish</span>
        </div>
      )}

      <div className="sf-card" style={{ marginTop: 16 }}>
        <p className="sf-dish-eyebrow">Detected Dish &middot; Hidangan Dikesan</p>
        <h2 className="sf-dish-name" style={{ fontSize: 22, marginBottom: 10 }}>
          {dishName}
        </h2>
        {portionLabel && <span className="sf-tag-pill">Eaten: {portionLabel}</span>}

        <div className="sf-divider" />

        {Array.isArray(swapTips) && swapTips.length > 0 && (
          <div className="sf-card" style={{ borderLeft: '3px solid var(--color-secondary)', marginBottom: 16, boxShadow: 'none' }}>
            <div className="heritage-ingredients-header" style={{ marginBottom: 10 }}>
              <span className="sf-dish-eyebrow" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <LightbulbIcon width={15} height={15} />
                What you can do right now
              </span>
              <span className="sf-header-tag">Act now</span>
            </div>
            <div className="scan-tips-list">
              {swapTips.slice(0, 3).map((tip, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, fontSize: '13.5px', lineHeight: 1.5, color: 'var(--color-text)' }}>
                  <span className="scan-tips-check">&#10003;</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {nutrition && (
          <div className="sf-card whatif-card" style={{ marginBottom: 16, boxShadow: 'none' }}>
            <div className="heritage-ingredients-header" style={{ marginBottom: 6 }}>
              <span className="sf-dish-eyebrow" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <SwapIcon width={15} height={15} />
                See the impact
              </span>
              <span className="sf-header-tag">Estimate</span>
            </div>
            <p className="sf-dish-sub" style={{ margin: '0 0 12px' }}>
              {swapTips?.length > 0
                ? 'Try one of the tips above and see roughly how the numbers would change next time.'
                : 'See roughly how the numbers would change if you ate less of this next time.'}
            </p>

            <div className="whatif-portion-row">
              {QUICK_PORTIONS.map((opt) => (
                <button key={opt.label} type="button" className="sf-alt-pill" onClick={() => tryPortion(opt)}>
                  {opt.label}
                </button>
              ))}
            </div>

            {hasMultipleComponents && (
              <>
                <p className="scan-result-edit-label" style={{ marginTop: 14 }}>
                  Or uncheck what you&rsquo;d skip next time
                </p>
                <div className="whatif-ingredient-list">
                  {components.map((name) => (
                    <label key={name} className="whatif-ingredient-item">
                      <input
                        type="checkbox"
                        checked={selectedComponents.includes(name)}
                        onChange={() => toggleComponent(name)}
                      />
                      {name}
                    </label>
                  ))}
                </div>
                <button
                  type="button"
                  className="sf-btn-outline"
                  style={{ marginTop: 10 }}
                  onClick={tryIngredients}
                  disabled={!componentsChanged || selectedComponents.length === 0 || whatIfLoading}
                >
                  {whatIfLoading ? 'Estimating...' : 'Estimate impact'}
                </button>
              </>
            )}

            {whatIfError && (
              <div className="scan-result-edit-error" role="alert">
                {whatIfError}
              </div>
            )}

            {whatIf && (
              <div className="whatif-result">
                <p className="sf-section-label" style={{ marginTop: 14 }}>{whatIf.label}</p>
                <div className="sf-stat-grid">
                  <div className="sf-stat-tile">
                    <span className="sf-stat-tile-label">Calories</span>
                    <span className="sf-stat-tile-value">{whatIf.nutrition?.kcal ?? '—'}</span>
                  </div>
                  <div className="sf-stat-tile">
                    <span className="sf-stat-tile-label">Carbs</span>
                    <span className="sf-stat-tile-value">
                      {whatIf.nutrition?.carbsG != null ? `${whatIf.nutrition.carbsG}g` : '—'}
                    </span>
                  </div>
                  <div className="sf-stat-tile">
                    <span className="sf-stat-tile-label">Sugar</span>
                    <span className="sf-stat-tile-value">
                      {whatIf.nutrition?.sugarG != null ? `${whatIf.nutrition.sugarG}g` : '—'}
                    </span>
                  </div>
                </div>
                {kcalDelta != null && (
                  <p className="sf-dish-sub" style={{ marginTop: 8 }}>
                    {kcalDelta < 0
                      ? `About ${Math.abs(kcalDelta)}% fewer calories`
                      : `About ${kcalDelta}% more calories`}{' '}
                    than what you logged &mdash; estimate only{whatIf.roughEstimate ? ', rough estimate' : ''}.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        <div className="sf-insight-card">
          <span className="sf-insight-icon">
            <GlucoseIcon width={16} height={16} />
          </span>
          <div className="sf-insight-text">
            <h3>{plainSummary}</h3>
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <GlycemicSpectrum glycemicLoad={glycemicLoad} />
        </div>

        {glucoseNote && (
          <div className="sf-note-card" style={{ marginBottom: 16 }}>
            <span className="sf-insight-icon" style={{ background: 'var(--color-card)', color: 'var(--color-secondary)' }}>
              <HistoryIcon width={15} height={15} />
            </span>
            <p>{glucoseNote}</p>
          </div>
        )}

        <p className="sf-section-label">
          Nutrition Values (Estimated) &middot; Nilai Pemakanan
          {portionLabel && <span className="sf-count-pill">{portionLabel}</span>}
        </p>
        <div className="sf-stat-grid">
          <div className="sf-stat-tile">
            <span className="sf-stat-tile-label">Calories</span>
            <span className="sf-stat-tile-value">
              {nutrition?.kcal != null ? nutrition.kcal : '—'}
            </span>
          </div>
          <div className="sf-stat-tile">
            <span className="sf-stat-tile-label">Carbs</span>
            <span className="sf-stat-tile-value">
              {nutrition?.carbsG != null ? `${nutrition.carbsG}g` : '—'}
            </span>
          </div>
          <div className="sf-stat-tile">
            <span className="sf-stat-tile-label">Sugar</span>
            <span className="sf-stat-tile-value">
              {nutrition?.sugarG != null ? `${nutrition.sugarG}g` : '—'}
            </span>
          </div>
        </div>
        <p className="sf-dish-sub" style={{ marginTop: 10 }}>
          Source: {source || 'estimated'}
          {roughEstimate ? ' — rough estimate' : ''}
        </p>

        <div className="sf-action-row" style={{ marginTop: 18, flexDirection: 'column' }}>
          <button type="button" className="sf-btn-primary" onClick={onSaveToHistory} disabled={saved}>
            <BookmarkIcon width={16} height={16} />
            {saved ? 'Saved' : 'Save to Meal History'}
          </button>
          <button type="button" className="sf-btn-outline" onClick={onScanAgain}>
            <ScanIcon width={16} height={16} />
            Scan Another Meal
          </button>
        </div>
      </div>
    </div>
  )
}
