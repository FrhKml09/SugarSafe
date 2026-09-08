import { useState, useEffect } from 'react'
import CameraCapture from './components/CameraCapture'
import ConfirmDish from './components/ConfirmDish'
import ScanResult from './components/ScanResult'
import PortionStep from './components/PortionStep'
import FinalSummary from './components/FinalSummary'
import HistoryList from './components/HistoryList'
import GlucoseLog from './components/GlucoseLog'
import About from './components/About'
import { ScanIcon, HistoryIcon, GlucoseIcon, AboutIcon } from './components/icons'
import { analyzeFoodImage, recalculateNutrition, logToChain } from './utils/api'
import { getHistory, addToHistory, updateHistoryEntry, deleteFromHistory } from './utils/storage'
import {
  getGlucoseReadings,
  addGlucoseReading,
  updateGlucoseReading,
  deleteGlucoseReading,
} from './utils/glucoseStorage'
import { scaleNutrition, buildPlainSummary, buildGlucoseNote, PORTION_OPTIONS } from './utils/nutritionHelpers'
import './App.css'

const SCAN_VIEWS = ['scan', 'confirm', 'nutrition', 'portion', 'final']

function App() {
  const [currentView, setCurrentView] = useState('scan')
  const [loading, setLoading] = useState(false)
  const [resolving, setResolving] = useState(false)
  const [recalculating, setRecalculating] = useState(false)
  const [identification, setIdentification] = useState(null)
  const [nutritionResult, setNutritionResult] = useState(null)
  const [finalResult, setFinalResult] = useState(null)
  const [error, setError] = useState('')
  const [history, setHistory] = useState(() => getHistory())
  const [saved, setSaved] = useState(false)
  const [glucoseReadings, setGlucoseReadings] = useState(() => getGlucoseReadings())
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState(null)

  useEffect(() => {
    setHistory(getHistory())
  }, [])

  async function resolveNutrition(dishName, components) {
    const data = await recalculateNutrition(dishName, components)
    return data.data
  }

  async function handleCapture(file) {
    setLoading(true)
    setError('')
    setIdentification(null)
    setNutritionResult(null)
    setFinalResult(null)
    setSaved(false)
    if (capturedPhotoUrl) URL.revokeObjectURL(capturedPhotoUrl)
    setCapturedPhotoUrl(URL.createObjectURL(file))

    let idResult
    try {
      const data = await analyzeFoodImage(file)
      idResult = data.data
      setIdentification(idResult)
    } catch (err) {
      setError(err.message || 'Something went wrong while analyzing the image.')
      setLoading(false)
      return
    }
    setLoading(false)

    if (idResult.needsConfirmation) {
      setCurrentView('confirm')
      return
    }

    setResolving(true)
    try {
      const nut = await resolveNutrition(idResult.dishName, idResult.components)
      setNutritionResult(nut)
      setCurrentView('nutrition')
    } catch (err) {
      setError(err.message || 'Could not look up nutrition. Please try again.')
      setCurrentView('confirm')
    } finally {
      setResolving(false)
    }
  }

  async function handleConfirm(dishName, components) {
    setError('')
    setResolving(true)
    try {
      const nut = await resolveNutrition(dishName, components)
      setNutritionResult(nut)
      setCurrentView('nutrition')
    } catch (err) {
      setError(err.message || 'Could not look up nutrition. Please try again.')
    } finally {
      setResolving(false)
    }
  }

  async function handleRecalculateFromNutrition(newDishName, newComponents) {
    setRecalculating(true)
    setError('')
    try {
      const nut = await resolveNutrition(newDishName, newComponents)
      setNutritionResult(nut)
    } catch (err) {
      setError(err.message || 'Recalculation failed. Please try again.')
    } finally {
      setRecalculating(false)
    }
  }

  function handlePortionSelect(factor) {
    if (!nutritionResult) return

    const scaled = scaleNutrition(nutritionResult.nutrition, factor)
    const plainSummary = buildPlainSummary(scaled.carbsG, nutritionResult.glycemicLoad)
    const glucoseNote = buildGlucoseNote(nutritionResult.dishName, glucoseReadings)
    const portionLabel = PORTION_OPTIONS.find((o) => o.factor === factor)?.label || null

    setFinalResult({
      dishName: nutritionResult.dishName,
      plainSummary,
      swapTips: nutritionResult.swapTips,
      nutrition: scaled,
      source: nutritionResult.source,
      roughEstimate: nutritionResult.roughEstimate,
      glucoseNote,
      portionLabel,
      glycemicLoad: nutritionResult.glycemicLoad,
    })
    setCurrentView('final')
  }

  function handleSaveToHistory() {
    if (!finalResult) return
    const entry = addToHistory({
      dishName: finalResult.dishName,
      glycemicLoad: finalResult.glycemicLoad,
      estimatedNutrition: {
        calories: finalResult.nutrition.kcal != null ? `${finalResult.nutrition.kcal}` : 'N/A',
        carbohydrates: finalResult.nutrition.carbsG != null ? `${finalResult.nutrition.carbsG}g` : 'N/A',
        sugar: finalResult.nutrition.sugarG != null ? `${finalResult.nutrition.sugarG}g` : 'N/A',
        protein: finalResult.nutrition.proteinG != null ? `${finalResult.nutrition.proteinG}g` : null,
        fat: finalResult.nutrition.fatG != null ? `${finalResult.nutrition.fatG}g` : null,
      },
      suggestion: [finalResult.plainSummary, ...(finalResult.swapTips || []).slice(0, 1)]
        .filter(Boolean)
        .join(' '),
    })
    setHistory(getHistory())
    setSaved(true)

    // Additive tamper-proof logging — fires in the background, never blocks the save.
    logToChain('meal', entry.dishName, entry.timestamp).then(({ signature, cluster }) => {
      if (signature) {
        updateHistoryEntry(entry.id, { txSignature: signature, chainCluster: cluster })
        setHistory(getHistory())
      }
    })
  }

  function handleScanAgain() {
    setIdentification(null)
    setNutritionResult(null)
    setFinalResult(null)
    setError('')
    setSaved(false)
    if (capturedPhotoUrl) URL.revokeObjectURL(capturedPhotoUrl)
    setCapturedPhotoUrl(null)
    setCurrentView('scan')
  }

  function handleDelete(id) {
    deleteFromHistory(id)
    setHistory(getHistory())
  }

  function handleAddGlucoseReading(reading) {
    const entry = addGlucoseReading(reading)
    setGlucoseReadings(getGlucoseReadings())

    // Additive tamper-proof logging — fires in the background, never blocks the save.
    logToChain('glucose', entry.value, entry.timestamp).then(({ signature, cluster }) => {
      if (signature) {
        updateGlucoseReading(entry.id, { txSignature: signature, chainCluster: cluster })
        setGlucoseReadings(getGlucoseReadings())
      }
    })
  }

  function handleDeleteGlucoseReading(id) {
    deleteGlucoseReading(id)
    setGlucoseReadings(getGlucoseReadings())
  }

  function goToScan() {
    setCurrentView('scan')
  }

  function renderView() {
    if (currentView === 'history') {
      return <HistoryList history={history} onDelete={handleDelete} onBack={goToScan} onRescan={handleScanAgain} />
    }

    if (currentView === 'glucose') {
      return (
        <GlucoseLog
          readings={glucoseReadings}
          scanHistory={history}
          onAdd={handleAddGlucoseReading}
          onDelete={handleDeleteGlucoseReading}
          onBack={goToScan}
        />
      )
    }

    if (currentView === 'about') {
      return <About />
    }

    if (currentView === 'confirm' && identification) {
      return (
        <ConfirmDish
          dishName={identification.dishName}
          dishNameEn={identification.dishNameEn}
          components={identification.components}
          confidence={identification.confidence}
          photoUrl={capturedPhotoUrl}
          onConfirm={handleConfirm}
          onScanAgain={handleScanAgain}
        />
      )
    }

    if (currentView === 'nutrition' && nutritionResult) {
      return (
        <ScanResult
          result={nutritionResult}
          photoUrl={capturedPhotoUrl}
          onContinue={() => setCurrentView('portion')}
          onScanAgain={handleScanAgain}
          onRecalculate={handleRecalculateFromNutrition}
          recalculating={recalculating}
        />
      )
    }

    if (currentView === 'portion' && nutritionResult) {
      return (
        <PortionStep
          dishName={nutritionResult.dishName}
          onSelect={handlePortionSelect}
          onScanAgain={handleScanAgain}
        />
      )
    }

    if (currentView === 'final' && finalResult) {
      return (
        <FinalSummary
          {...finalResult}
          photoUrl={capturedPhotoUrl}
          onSaveToHistory={handleSaveToHistory}
          onScanAgain={handleScanAgain}
          saved={saved}
        />
      )
    }

    return <CameraCapture onCapture={handleCapture} />
  }

  return (
    <div className="app">
      <div className="app-content">
        {(currentView === 'portion' || currentView === 'about') && (
          <header className="app-header">
            <h1>SugarSafe</h1>
            <p>Malaysian food photos → simple, culturally relevant diabetes guidance</p>
          </header>
        )}

        {(loading || resolving) && (
          <div className="app-loading">
            <div className="app-loading-bar">
              <div className="app-loading-sweep" />
            </div>
            <p className="app-loading-text">
              {loading ? 'Analyzing your photo...' : 'Looking up nutrition...'}
            </p>
          </div>
        )}

        {error && (
          <div className="app-error" role="alert">
            {error}
          </div>
        )}

        {renderView()}
      </div>

      <nav className="tab-bar" aria-label="Main navigation">
        <button
          type="button"
          className={`tab-item ${SCAN_VIEWS.includes(currentView) ? 'tab-item-active' : ''}`}
          onClick={() => setCurrentView('scan')}
          aria-label="Scan"
        >
          <span className="tab-icon"><ScanIcon /></span>
          <span className="tab-label">Scan</span>
        </button>
        <button
          type="button"
          className={`tab-item ${currentView === 'history' ? 'tab-item-active' : ''}`}
          onClick={() => setCurrentView('history')}
          aria-label="History"
        >
          <span className="tab-icon"><HistoryIcon /></span>
          <span className="tab-label">History</span>
        </button>
        <button
          type="button"
          className={`tab-item ${currentView === 'glucose' ? 'tab-item-active' : ''}`}
          onClick={() => setCurrentView('glucose')}
          aria-label="Glucose"
        >
          <span className="tab-icon"><GlucoseIcon /></span>
          <span className="tab-label">Glucose</span>
        </button>
        <button
          type="button"
          className={`tab-item ${currentView === 'about' ? 'tab-item-active' : ''}`}
          onClick={() => setCurrentView('about')}
          aria-label="About"
        >
          <span className="tab-icon"><AboutIcon /></span>
          <span className="tab-label">About</span>
        </button>
      </nav>
    </div>
  )
}

export default App
