import { useState } from 'react'
import { HistoryIcon, TrashIcon, ScanIcon } from './icons'
import ScreenHeader from './ScreenHeader'
import Disclaimer from './Disclaimer'

const IMPACT_LABELS = {
  low: { label: 'Gentle Rise', className: 'sf-impact-pill--low' },
  medium: { label: 'Moderate', className: 'sf-impact-pill--medium' },
  'medium-high': { label: 'Moderate-High', className: 'sf-impact-pill--medium' },
  high: { label: 'Higher Impact Zone', className: 'sf-impact-pill--high' },
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

export default function HistoryList({ history, onDelete, onBack, onRescan }) {
  const [expandedId, setExpandedId] = useState(null)

  function handleToggle(id) {
    setExpandedId((current) => (current === id ? null : id))
  }

  return (
    <div className="sf-screen">
      <ScreenHeader title="Meal History" subtitle="Sejarah Pemakanan" onBack={onBack} />
      <Disclaimer />

      {(!Array.isArray(history) || history.length === 0) ? (
        <div className="history-empty" style={{ marginTop: 16 }}>
          <span className="history-empty-icon" aria-hidden="true">
            <HistoryIcon width={36} height={36} strokeWidth={1.5} />
          </span>
          <p className="history-empty-text">
            No scans yet. Take a photo of your meal to get started!
          </p>
        </div>
      ) : (
        <div className="history-list" style={{ marginTop: 16 }}>
          {history.map((item) => {
            const isExpanded = expandedId === item.id
            const calories = item.estimatedNutrition?.calories || 'N/A'
            const impact = item.glycemicLoad ? IMPACT_LABELS[item.glycemicLoad] : null

            return (
              <div key={item.id} className="sf-history-card">
                <button
                  type="button"
                  className="sf-history-card-top"
                  onClick={() => handleToggle(item.id)}
                  aria-expanded={isExpanded}
                >
                  <div>
                    <p className="sf-history-dish">{item.dishName || 'Unknown Dish'}</p>
                    {impact && (
                      <span className={`sf-impact-pill ${impact.className}`} style={{ marginBottom: 6 }}>
                        {impact.label}
                      </span>
                    )}
                    <p className="sf-history-meta">
                      {formatDate(item.timestamp)} &middot; {calories} kcal (estimated)
                    </p>
                  </div>
                  <span className={`sf-history-chevron${isExpanded ? ' sf-history-chevron--open' : ''}`} aria-hidden="true">
                    &#9662;
                  </span>
                </button>

                {isExpanded && (
                  <div className="sf-history-body">
                    {item.estimatedNutrition && (
                      <div className="sf-stat-grid">
                        <div className="sf-stat-tile">
                          <span className="sf-stat-tile-label">Calories</span>
                          <span className="sf-stat-tile-value">
                            {item.estimatedNutrition.calories || '—'}
                          </span>
                        </div>
                        <div className="sf-stat-tile">
                          <span className="sf-stat-tile-label">Carbs</span>
                          <span className="sf-stat-tile-value">
                            {item.estimatedNutrition.carbohydrates || '—'}
                          </span>
                        </div>
                        <div className="sf-stat-tile">
                          <span className="sf-stat-tile-label">Sugar</span>
                          <span className="sf-stat-tile-value">
                            {item.estimatedNutrition.sugar || '—'}
                          </span>
                        </div>
                      </div>
                    )}

                    {item.suggestion && (
                      <div className="sf-note-card">
                        <p><strong>Note:</strong> {item.suggestion}</p>
                      </div>
                    )}

                    {item.txSignature && (
                      <a
                        className="sf-chain-badge"
                        href={`https://explorer.solana.com/tx/${item.txSignature}?cluster=${item.chainCluster || 'devnet'}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Verified on Solana &#10003; <strong>{item.txSignature.slice(0, 6)}...{item.txSignature.slice(-4)}</strong>
                      </a>
                    )}

                    <div className="sf-action-row" style={{ marginTop: 4 }}>
                      <button type="button" className="sf-btn-outline" onClick={() => onDelete(item.id)}>
                        <TrashIcon width={15} height={15} />
                        Delete
                      </button>
                      {onRescan && (
                        <button type="button" className="sf-btn-primary" onClick={onRescan}>
                          <ScanIcon width={15} height={15} />
                          Scan a Meal
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
