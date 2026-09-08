import { useState } from 'react'
import { GlucoseIcon, ShieldIcon, TrashIcon } from './icons'
import GlucoseTrendChart from './GlucoseTrendChart'
import DailySummary from './DailySummary'
import ScreenHeader from './ScreenHeader'

const TARGET_LOW = 4.0
const TARGET_HIGH = 7.8

const CONTEXT_OPTIONS = [
  { value: 'before-meal', label: 'Before meal' },
  { value: 'after-meal', label: 'After meal' },
  { value: 'morning', label: 'Morning (fasting)' },
  { value: 'evening', label: 'Evening' },
  { value: 'custom', label: 'Custom' },
]

function statusForReading(value) {
  if (value < TARGET_LOW) return { label: 'Low (Rendah)', className: 'sf-impact-pill--medium' }
  if (value > TARGET_HIGH) return { label: 'Elevated (Meningkat)', className: 'sf-impact-pill--high' }
  return { label: 'In Range (Dalam Sasaran)', className: 'sf-impact-pill--low' }
}

function percentInRange(readings) {
  if (!Array.isArray(readings) || readings.length === 0) return null
  const inRange = readings.filter((r) => r.value >= TARGET_LOW && r.value <= TARGET_HIGH).length
  return Math.round((inRange / readings.length) * 100)
}

function contextLabelFor(reading) {
  if (reading.context === 'custom') {
    return reading.contextLabel?.trim() || 'Custom'
  }
  return CONTEXT_OPTIONS.find((opt) => opt.value === reading.context)?.label || reading.context
}

function formatDate(isoString) {
  const date = new Date(isoString)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function GlucoseLog({ readings, scanHistory, onAdd, onDelete, onBack }) {
  const [value, setValue] = useState('')
  const [context, setContext] = useState('before-meal')
  const [contextLabel, setContextLabel] = useState('')
  const [linkedScanId, setLinkedScanId] = useState('')
  const [formError, setFormError] = useState('')

  const recentScans = Array.isArray(scanHistory) ? scanHistory.slice(0, 20) : []

  function resetForm() {
    setValue('')
    setContext('before-meal')
    setContextLabel('')
    setLinkedScanId('')
    setFormError('')
  }

  function handleSubmit(event) {
    event.preventDefault()

    const numericValue = Number(value)
    if (!value || Number.isNaN(numericValue) || numericValue <= 0) {
      setFormError('Enter a valid glucose reading.')
      return
    }

    if (context === 'custom' && !contextLabel.trim()) {
      setFormError('Describe the custom context (e.g. "before exercise").')
      return
    }

    const linkedScan = recentScans.find((item) => item.id === linkedScanId)

    onAdd({
      value: numericValue,
      context,
      contextLabel: context === 'custom' ? contextLabel.trim() : null,
      linkedScanId: linkedScan ? linkedScan.id : null,
      linkedDishName: linkedScan ? linkedScan.dishName : null,
    })

    resetForm()
  }

  const inRangePercent = percentInRange(readings)

  return (
    <div className="sf-screen">
      <ScreenHeader title="Glucose Trends & Tracking" subtitle="Trend Glukosa" tag="My Care" onBack={onBack} />

      <div className="sf-card sf-target-card" style={{ marginBottom: 16 }}>
        <span className="sf-target-icon">
          <ShieldIcon width={18} height={18} />
        </span>
        <div style={{ flex: 1 }}>
          <p className="sf-target-title">Target Range: {TARGET_LOW.toFixed(1)} &ndash; {TARGET_HIGH.toFixed(1)} mmol/L</p>
          <p className="sf-target-sub">Julat Sasaran &middot; A common general-reference range — ask your care team for your personal target.</p>
          {inRangePercent != null && (
            <span className="sf-range-pill">{inRangePercent}% In Target Range (Dalam Sasaran)</span>
          )}
        </div>
      </div>

      <div className="glucose-log">
      <form className="glucose-form" onSubmit={handleSubmit}>
        <label className="scan-result-edit-label" htmlFor="glucose-value">
          Reading (mmol/L)
        </label>
        <input
          id="glucose-value"
          type="number"
          inputMode="decimal"
          step="0.1"
          min="0"
          placeholder="e.g. 6.5"
          className="scan-result-edit-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <label className="scan-result-edit-label" htmlFor="glucose-context">
          Context
        </label>
        <select
          id="glucose-context"
          className="scan-result-edit-input glucose-select"
          value={context}
          onChange={(e) => setContext(e.target.value)}
        >
          {CONTEXT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {context === 'custom' && (
          <>
            <label className="scan-result-edit-label" htmlFor="glucose-context-label">
              Describe context
            </label>
            <input
              id="glucose-context-label"
              type="text"
              placeholder="e.g. Before exercise"
              className="scan-result-edit-input"
              value={contextLabel}
              onChange={(e) => setContextLabel(e.target.value)}
            />
          </>
        )}

        {recentScans.length > 0 && (
          <>
            <label className="scan-result-edit-label" htmlFor="glucose-linked-scan">
              Link to a food log entry (optional)
            </label>
            <select
              id="glucose-linked-scan"
              className="scan-result-edit-input glucose-select"
              value={linkedScanId}
              onChange={(e) => setLinkedScanId(e.target.value)}
            >
              <option value="">None</option>
              {recentScans.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.dishName || 'Unknown dish'} · {formatDate(item.timestamp)}
                </option>
              ))}
            </select>
          </>
        )}

        {formError && (
          <div className="scan-result-edit-error" role="alert">
            {formError}
          </div>
        )}

        <button type="submit" className="glucose-save">
          Save reading
        </button>
      </form>

      <DailySummary scanHistory={scanHistory} glucoseReadings={readings} />

      <GlucoseTrendChart readings={readings} />

      <p className="sf-section-label" style={{ marginTop: 20 }}>All Readings &middot; Semua Bacaan</p>

      <div className="glucose-list">
        {!Array.isArray(readings) || readings.length === 0 ? (
          <div className="history-empty">
            <span className="history-empty-icon" aria-hidden="true">
              <GlucoseIcon width={36} height={36} strokeWidth={1.5} />
            </span>
            <p className="history-empty-text">
              No glucose readings yet. Log a reading to start tracking patterns.
            </p>
          </div>
        ) : (
          readings.map((reading) => {
            const status = statusForReading(reading.value)
            return (
              <div key={reading.id} className="sf-reading-row">
                <span className="sf-reading-icon">
                  <GlucoseIcon width={16} height={16} />
                </span>
                <div className="sf-reading-body">
                  <div className="sf-reading-top">
                    <span className="sf-reading-value">
                      {reading.value} {reading.unit}
                    </span>
                    <button
                      type="button"
                      className="sf-ingredient-remove"
                      onClick={() => onDelete(reading.id)}
                      aria-label={`Delete reading of ${reading.value} ${reading.unit}`}
                    >
                      <TrashIcon width={15} height={15} />
                    </button>
                  </div>
                  <span className={`sf-impact-pill ${status.className}`}>{status.label}</span>
                  <p className="sf-reading-meta">
                    {contextLabelFor(reading)} &middot; {formatDate(reading.timestamp)}
                  </p>
                  {reading.linkedDishName && (
                    <p className="sf-reading-linked">Linked to: {reading.linkedDishName}</p>
                  )}
                  {reading.txSignature && (
                    <a
                      className="sf-chain-badge"
                      style={{ marginTop: 6 }}
                      href={`https://explorer.solana.com/tx/${reading.txSignature}?cluster=${reading.chainCluster || 'devnet'}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Verified on Solana &#10003;
                    </a>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
      </div>
    </div>
  )
}
