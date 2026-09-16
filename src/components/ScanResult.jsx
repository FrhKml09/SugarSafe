import { useState } from 'react'
import Disclaimer from './Disclaimer'
import ScreenHeader from './ScreenHeader'
import INGREDIENTS from '../data/ingredients'

export default function ScanResult({
  result,
  photoUrl,
  onContinue,
  onScanAgain,
  onRecalculate,
  recalculating,
}) {
  const {
    dishName,
    dishNameEn,
    components,
    servingSize,
    nutrition,
    glycemicLoad,
    source,
    roughEstimate,
    matchedKnownDish,
    componentAdjusted,
  } = result || {}

  const [editing, setEditing] = useState(false)
  const [editDishName, setEditDishName] = useState('')
  const [editComponents, setEditComponents] = useState([])
  const [edited, setEdited] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [recalcError, setRecalcError] = useState('')

  function enterEditMode() {
    setEditDishName(dishName || '')
    setEditComponents(components ? [...components] : [])
    setEditing(true)
    setRecalcError('')
  }

  function cancelEdit() {
    setEditing(false)
    setSearchOpen(false)
    setSearchQuery('')
    setRecalcError('')
  }

  function handleComponentRename(index, value) {
    const updated = [...editComponents]
    updated[index] = value
    setEditComponents(updated)
  }

  function removeComponent(index) {
    setEditComponents((prev) => prev.filter((_, i) => i !== index))
  }

  function openSearch() {
    setSearchQuery('')
    setSearchOpen(true)
  }

  function closeSearch() {
    setSearchOpen(false)
    setSearchQuery('')
  }

  function selectIngredient(name) {
    if (editComponents.some((c) => c.toLowerCase() === name.toLowerCase())) return
    setEditComponents((prev) => [...prev, name])
    setSearchOpen(false)
    setSearchQuery('')
  }

  const filteredIngredients = INGREDIENTS.filter((item) =>
    item.toLowerCase().includes(searchQuery.toLowerCase())
  )

  async function handleRecalculate() {
    setRecalcError('')

    if (!editDishName.trim()) {
      setRecalcError('Enter a dish name.')
      return
    }
    if (editComponents.length === 0) {
      setRecalcError('Add at least one component before recalculating.')
      return
    }
    if (editComponents.some((c) => c.trim() === '')) {
      setRecalcError('All components must have a name.')
      return
    }

    setEdited(true)
    setEditing(false)

    try {
      await onRecalculate(editDishName.trim(), [...editComponents])
    } catch {
      setRecalcError('Recalculation failed. Your edits are saved. Try again.')
    }
  }

  return (
    <div className="sf-screen">
      <ScreenHeader title="Nutrition Detail" subtitle="Butiran Nutrisi" onBack={onScanAgain} />
      <Disclaimer />

      <div className={`sf-card scan-result-card${edited ? ' scan-result-card--edited' : ''}`} style={{ marginTop: 16 }}>
        {edited && <div className="scan-result-badge">AI detected + user corrected</div>}

        {editing ? (
          <>
            <label className="scan-result-edit-label">
              Dish name
              <input
                type="text"
                className="scan-result-edit-input"
                value={editDishName}
                onChange={(e) => setEditDishName(e.target.value)}
              />
            </label>

            <fieldset className="scan-result-edit-components">
              <legend className="scan-result-edit-label">Components</legend>
              {editComponents.map((comp, i) => (
                <div key={i} className="scan-result-edit-component-row">
                  <input
                    type="text"
                    className="scan-result-edit-input scan-result-edit-input--inline"
                    value={comp}
                    onChange={(e) => handleComponentRename(i, e.target.value)}
                  />
                  <button
                    type="button"
                    className="scan-result-edit-remove"
                    onClick={() => removeComponent(i)}
                    aria-label={`Remove ${comp || 'component'}`}
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button type="button" className="scan-result-edit-add" onClick={openSearch}>
                + Add component
              </button>
            </fieldset>

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
                          disabled={editComponents.some(
                            (c) => c.toLowerCase() === name.toLowerCase()
                          )}
                        >
                          {name}
                          {editComponents.some(
                            (c) => c.toLowerCase() === name.toLowerCase()
                          ) && (
                            <span className="scan-result-search-item-added">Added</span>
                          )}
                        </button>
                      ))
                    )}
                  </div>
                  <button
                    type="button"
                    className="scan-result-cancel scan-result-search-close"
                    onClick={closeSearch}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {recalcError && (
              <div className="scan-result-edit-error" role="alert">
                {recalcError}
              </div>
            )}

            <div className="scan-result-edit-actions">
              <button
                type="button"
                className="scan-result-recalculate"
                onClick={handleRecalculate}
                disabled={recalculating}
              >
                {recalculating ? 'Recalculating...' : 'Save & recalculate'}
              </button>
              <button type="button" className="scan-result-cancel" onClick={cancelEdit}>
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            {photoUrl && (
              <div className="sf-photo-card" style={{ marginBottom: 14 }}>
                <img src={photoUrl} alt={dishName || 'Captured meal'} />
              </div>
            )}

            <p className="sf-dish-eyebrow">Detected Dish &middot; Hidangan Dikesan</p>
            <h2 className="sf-dish-name" style={{ fontSize: 20 }}>{dishName || 'Unknown Dish'}</h2>
            {dishNameEn && <p className="sf-dish-sub">{dishNameEn}</p>}

            {Array.isArray(components) && components.length > 0 && (
              <div className="scan-result-components" style={{ marginTop: 10 }}>
                {components.map((item) => (
                  <span key={item} className="scan-result-pill">
                    {item}
                  </span>
                ))}
              </div>
            )}

            {servingSize && <p className="scan-result-portion">Estimated serving: {servingSize}</p>}

            {roughEstimate && (
              <div className="scan-result-rough-banner">
                Rough estimate — please confirm the components above are accurate.
              </div>
            )}

            {!roughEstimate && matchedKnownDish && componentAdjusted && (
              <p className="sf-dish-sub" style={{ marginTop: 8 }}>
                Adjusted proportionally for your ingredient changes from the standard {dishName} recipe —
                an approximation based on ingredient count, not a measured per-ingredient breakdown.
              </p>
            )}
            {!roughEstimate && matchedKnownDish && !componentAdjusted && (
              <p className="sf-dish-sub" style={{ marginTop: 8 }}>
                These are values for a standard {dishName}.
              </p>
            )}

            <div className="sf-divider" />

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

            {glycemicLoad && <p className="sf-dish-sub" style={{ marginTop: 10 }}>Glycemic load: {glycemicLoad}</p>}
            {source && <p className="sf-dish-sub">Source: {source}</p>}

            {recalculating && (
              <div className="scan-result-recalculating">
                Recalculating nutrition based on your corrections...
              </div>
            )}

            {!recalculating && (
              <div className="sf-action-row" style={{ marginTop: 16, flexDirection: 'column' }}>
                <button type="button" className="sf-btn-primary" onClick={onContinue}>
                  Continue
                </button>
                <button type="button" className="sf-btn-outline" onClick={enterEditMode}>
                  Edit analysis
                </button>
                <button type="button" className="scan-result-cancel" onClick={onScanAgain}>
                  Scan Again
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
