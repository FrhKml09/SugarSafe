import Disclaimer from './Disclaimer'
import GlycemicSpectrum from './GlycemicSpectrum'
import ScreenHeader from './ScreenHeader'
import { GlucoseIcon, LightbulbIcon, HistoryIcon, BookmarkIcon, ScanIcon } from './icons'

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
  photoUrl,
  onSaveToHistory,
  onScanAgain,
  saved,
}) {
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

        {Array.isArray(swapTips) && swapTips.length > 0 && (
          <div className="sf-card" style={{ borderLeft: '3px solid var(--color-secondary)', marginBottom: 16 }}>
            <div className="heritage-ingredients-header" style={{ marginBottom: 10 }}>
              <span className="sf-dish-eyebrow" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <LightbulbIcon width={15} height={15} />
                What you could try next time
              </span>
              <span className="sf-header-tag">Tips</span>
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
