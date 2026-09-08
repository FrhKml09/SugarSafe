import { useMemo, useState } from 'react'
import INGREDIENTS from '../data/ingredients'
import malaysianDishes from '../data/malaysianDishes'
import ScreenHeader from './ScreenHeader'
import Disclaimer from './Disclaimer'
import { ShieldIcon, SwapIcon } from './icons'

const CONFIDENCE_LABELS = {
  high: { en: 'High', my: 'Tinggi' },
  medium: { en: 'Moderate', my: 'Sederhana' },
  low: { en: 'Low', my: 'Rendah' },
}

function tokenize(str) {
  return (str || '')
    .toLowerCase()
    .split(/[^a-z]+/)
    .filter((w) => w.length >= 3)
}

function findSimilarDishes(dishName, limit = 3) {
  const targetTokens = new Set(tokenize(dishName))
  if (targetTokens.size === 0) return []

  return malaysianDishes
    .filter((d) => d.dishName.toLowerCase() !== (dishName || '').toLowerCase())
    .map((d) => {
      const tokens = tokenize(`${d.dishName} ${d.dishNameEn}`)
      const overlap = tokens.filter((t) => targetTokens.has(t)).length
      return { dish: d, overlap }
    })
    .filter((entry) => entry.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, limit)
    .map((entry) => entry.dish)
}

export default function ConfirmDish({
  dishName,
  dishNameEn,
  components,
  confidence,
  photoUrl,
  onConfirm,
  onScanAgain,
}) {
  const [editDishName, setEditDishName] = useState(dishName || '')
  const [editComponents, setEditComponents] = useState(components ? [...components] : [])
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [formError, setFormError] = useState('')

  const similarDishes = useMemo(() => findSimilarDishes(dishName), [dishName])
  const confidenceLabel = CONFIDENCE_LABELS[confidence] || CONFIDENCE_LABELS.low

  function handleComponentRename(index, value) {
    const updated = [...editComponents]
    updated[index] = value
    setEditComponents(updated)
  }

  function removeComponent(index) {
    setEditComponents((prev) => prev.filter((_, i) => i !== index))
  }

  function resetComponents() {
    setEditComponents(components ? [...components] : [])
  }

  function openSearch() {
    setSearchQuery('')
    setSearchOpen(true)
  }

  function selectIngredient(name) {
    if (editComponents.some((c) => c.toLowerCase() === name.toLowerCase())) return
    setEditComponents((prev) => [...prev, name])
    setSearchOpen(false)
    setSearchQuery('')
  }

  function selectAlternativeDish(name) {
    setEditDishName(name)
  }

  const filteredIngredients = INGREDIENTS.filter((item) =>
    item.toLowerCase().includes(searchQuery.toLowerCase())
  )

  function handleContinue() {
    if (!editDishName.trim()) {
      setFormError('Enter a dish name.')
      return
    }
    if (editComponents.length === 0) {
      setFormError('Add at least one component.')
      return
    }
    setFormError('')
    onConfirm(editDishName.trim(), editComponents)
  }

  return (
    <div className="sf-screen">
      <ScreenHeader
        title="Confirm Dish & Ingredients"
        subtitle="Sahkan Hidangan"
        onBack={onScanAgain}
      />

      <Disclaimer />

      <div className="sf-divider" />

      <div className="sf-confidence-badge">
        <span className="sf-confidence-left">
          <ShieldIcon width={16} height={16} />
          AI Confidence: <strong>{confidenceLabel.en}</strong> ({confidenceLabel.my})
        </span>
      </div>

      <div className="sf-card">
        <div className="sf-dish-card">
          {photoUrl && <img src={photoUrl} alt="Captured meal" className="sf-dish-photo" />}
          <div className="sf-dish-info">
            <p className="sf-dish-eyebrow">Detected Dish &middot; Hidangan Dikesan</p>
            <input
              id="confirm-dish-name"
              type="text"
              className="sf-dish-name-input"
              value={editDishName}
              onChange={(e) => setEditDishName(e.target.value)}
              aria-label="Dish name — tap to edit"
            />
            {dishNameEn && editDishName === dishName && (
              <p className="sf-dish-sub">{dishNameEn}</p>
            )}
          </div>
        </div>

        {similarDishes.length > 0 && (
          <div className="heritage-alternatives">
            <p className="sf-section-label">Not quite right? Try a similar dish (Pilihan lain)</p>
            <div className="heritage-alternatives-list">
              {similarDishes.map((d) => (
                <button
                  key={d.dishName}
                  type="button"
                  className="sf-alt-pill"
                  onClick={() => selectAlternativeDish(d.dishName)}
                >
                  <SwapIcon width={13} height={13} />
                  {d.dishName} ({d.dishNameEn})
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="sf-divider" />

        <div className="heritage-ingredients-header">
          <p className="sf-section-label" style={{ margin: 0 }}>
            Ingredients Detected &middot; Bahan Dikesan
          </p>
          <span className="sf-count-pill">{editComponents.length} items</span>
        </div>
        <div className="heritage-ingredients-header" style={{ marginBottom: 10 }}>
          <p className="heritage-ingredients-hint" style={{ margin: 0 }}>
            Tap &times; to remove ingredients not eaten
          </p>
          <button type="button" className="heritage-reset-btn" onClick={resetComponents}>
            Reset all (Set Semula)
          </button>
        </div>

        <div>
          {editComponents.map((comp, i) => (
            <div key={i} className="sf-ingredient-row">
              <span className="sf-ingredient-check">&#10003;</span>
              <input
                type="text"
                className="sf-ingredient-input"
                value={comp}
                onChange={(e) => handleComponentRename(i, e.target.value)}
              />
              <button
                type="button"
                className="sf-ingredient-remove"
                onClick={() => removeComponent(i)}
                aria-label={`Remove ${comp || 'component'}`}
              >
                &times;
              </button>
            </div>
          ))}
          {editComponents.length === 0 && (
            <p className="heritage-ingredients-empty">No components detected yet.</p>
          )}
        </div>

        <button type="button" className="sf-add-btn" onClick={openSearch}>
          + Add ingredient (Tambah Bahan)
        </button>

        {searchOpen && (
          <div className="scan-result-search-overlay">
            <div className="scan-result-search-panel">
              <input
                type="text"
                className="scan-result-search-input"
                placeholder="Search ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <div className="scan-result-search-results">
                {filteredIngredients.length === 0 ? (
                  <p className="scan-result-search-empty">No ingredients found.</p>
                ) : (
                  filteredIngredients.map((name) => (
                    <button
                      key={name}
                      type="button"
                      className="scan-result-search-item"
                      onClick={() => selectIngredient(name)}
                      disabled={editComponents.some((c) => c.toLowerCase() === name.toLowerCase())}
                    >
                      {name}
                      {editComponents.some((c) => c.toLowerCase() === name.toLowerCase()) && (
                        <span className="scan-result-search-item-added">Added</span>
                      )}
                    </button>
                  ))
                )}
              </div>
              <button
                type="button"
                className="scan-result-cancel scan-result-search-close"
                onClick={() => setSearchOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {formError && (
          <div className="scan-result-edit-error" role="alert">
            {formError}
          </div>
        )}

        <div className="sf-action-row">
          <button type="button" className="sf-btn-outline" onClick={onScanAgain}>
            Retake (Semula)
          </button>
          <button type="button" className="sf-btn-primary" onClick={handleContinue}>
            Confirm & Calculate (Sahkan &amp; Kira)
          </button>
        </div>
      </div>
    </div>
  )
}
