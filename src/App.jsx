import { useState, useEffect } from 'react'
import CameraCapture from './components/CameraCapture'
import ConfirmDish from './components/ConfirmDish'
import ScanResult from './components/ScanResult'
import PortionStep from './components/PortionStep'
import FinalSummary from './components/FinalSummary'
import HistoryList from './components/HistoryList'
import GlucoseLog from './components/GlucoseLog'
import HabitsLog from './components/HabitsLog'
import Profile from './components/Profile'
import Settings from './components/Settings'
import About from './components/About'
import FeedbackBubble from './components/FeedbackBubble'
import { ScanIcon, HistoryIcon, GlucoseIcon, WalkIcon, AboutIcon } from './components/icons'
import { analyzeFoodImage, recalculateNutrition, logToChain } from './utils/api'
import { getHistory, addToHistory, updateHistoryEntry, deleteFromHistory } from './utils/storage'
import {
  getGlucoseReadings,
  addGlucoseReading,
  updateGlucoseReading,
  deleteGlucoseReading,
} from './utils/glucoseStorage'
import { getHabitEntries, addHabitEntry, updateHabitEntry, deleteHabitEntry } from './utils/habitStorage'
import { getProfile, saveProfile, hasSeenOnboarding, markOnboardingSeen } from './utils/profileStorage'
import { getRecentMeals, upsertRecentMeal } from './utils/recentMealsStorage'
import {
  scaleNutrition,
  scaleForComponentEdit,
  buildPlainSummary,
  buildGlucoseNote,
  PORTION_OPTIONS,
} from './utils/nutritionHelpers'
import './App.css'

const SCAN_VIEWS = ['scan', 'confirm', 'nutrition', 'portion', 'final']
const FEEDBACK_BUBBLE_HIDDEN_VIEWS = ['onboarding']

function App() {
  const [currentView, setCurrentView] = useState(() =>
    !getProfile() && !hasSeenOnboarding() ? 'onboarding' : 'scan'
  )
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
  const [habitEntries, setHabitEntries] = useState(() => getHabitEntries())
  const [profile, setProfile] = useState(() => getProfile())
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState(null)
  const [recentMeals, setRecentMeals] = useState(() => getRecentMeals())

  useEffect(() => {
    setHistory(getHistory())
  }, [])

  async function resolveNutrition(dishName, components) {
    const data = await recalculateNutrition(dishName, components)
    return data.data
  }

  // A dish is "confirmed" either by passing through ConfirmDish, or by being
  // auto-matched with high confidence straight from the photo — both count as
  // confirmed for Log Again purposes.
  function saveToRecentMeals(nut) {
    upsertRecentMeal(nut)
    setRecentMeals(getRecentMeals())
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
      saveToRecentMeals(nut)
      setCurrentView('nutrition')
    } catch (err) {
      setError(err.message || 'Could not look up nutrition. Please try again.')
      setCurrentView('confirm')
    } finally {
      setResolving(false)
    }
  }

  function handleManualEntry(dishName) {
    setError('')
    setNutritionResult(null)
    setFinalResult(null)
    setSaved(false)
    if (capturedPhotoUrl) URL.revokeObjectURL(capturedPhotoUrl)
    setCapturedPhotoUrl(null)
    setIdentification({
      dishName,
      dishNameEn: '',
      components: [],
      confidence: 'low',
      needsConfirmation: true,
    })
    setCurrentView('confirm')
  }

  async function handleConfirm(dishName, components) {
    setError('')
    setResolving(true)
    try {
      const nut = await resolveNutrition(dishName, components)
      let resolved = nut

      if (nut.matchedKnownDish) {
        const { nutrition, adjusted } = scaleForComponentEdit(
          identification?.components,
          components,
          nut.nutrition
        )
        resolved = { ...nut, nutrition, componentAdjusted: adjusted }
      }

      setNutritionResult(resolved)
      saveToRecentMeals(resolved)
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

      if (nut.matchedKnownDish && newDishName === nutritionResult?.dishName) {
        const { nutrition, adjusted } = scaleForComponentEdit(
          nutritionResult?.components,
          newComponents,
          nut.nutrition
        )
        setNutritionResult({ ...nut, nutrition, componentAdjusted: adjusted })
      } else {
        setNutritionResult(nut)
      }
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
      portionFactor: factor,
      components: nutritionResult.components,
      matchedKnownDish: nutritionResult.matchedKnownDish,
      glycemicLoad: nutritionResult.glycemicLoad,
      componentAdjusted: nutritionResult.componentAdjusted,
    })
    setCurrentView('final')
  }

  // Preview-only "what if" recalculation for the Final screen — never overwrites
  // the meal actually being saved to history, just estimates the impact of
  // eating less or skipping an ingredient next time.
  async function handleWhatIfRecalculate(newComponents) {
    if (!finalResult) return null

    const nut = await resolveNutrition(finalResult.dishName, newComponents)
    let nutrition = nut.nutrition

    if (nut.matchedKnownDish) {
      const { nutrition: adjusted } = scaleForComponentEdit(
        finalResult.components,
        newComponents,
        nut.nutrition
      )
      nutrition = adjusted
    }

    return {
      ...nut,
      nutrition: scaleNutrition(nutrition, finalResult.portionFactor ?? 1),
    }
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

  // Skips the camera, vision identification, and confirm steps entirely —
  // reuses the nutrition snapshot saved when this dish was last confirmed,
  // and drops the user straight into "how much did you eat this time."
  function handleLogAgain(meal) {
    setError('')
    setIdentification(null)
    setFinalResult(null)
    setSaved(false)
    if (capturedPhotoUrl) URL.revokeObjectURL(capturedPhotoUrl)
    setCapturedPhotoUrl(null)
    setNutritionResult(meal.nutritionResult)
    setCurrentView('portion')
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

  function handleAddHabit(habit) {
    const entry = addHabitEntry(habit)
    setHabitEntries(getHabitEntries())

    // Additive tamper-proof logging — fires in the background, never blocks the save.
    logToChain('habit', entry.typeLabel, entry.timestamp).then(({ signature, cluster }) => {
      if (signature) {
        updateHabitEntry(entry.id, { txSignature: signature, chainCluster: cluster })
        setHabitEntries(getHabitEntries())
      }
    })
  }

  function handleDeleteHabit(id) {
    deleteHabitEntry(id)
    setHabitEntries(getHabitEntries())
  }

  function handleSaveProfile(newProfile) {
    saveProfile(newProfile)
    setProfile(newProfile)
  }

  function handleOnboardingSave(newProfile) {
    saveProfile(newProfile)
    setProfile(newProfile)
    markOnboardingSeen()
    setCurrentView('scan')
  }

  function handleOnboardingSkip() {
    markOnboardingSeen()
    setCurrentView('scan')
  }

  function goToScan() {
    setCurrentView('scan')
  }

  function renderView() {
    if (currentView === 'onboarding') {
      return (
        <Profile
          mode="onboarding"
          profile={profile}
          onSave={handleOnboardingSave}
          onSkip={handleOnboardingSkip}
        />
      )
    }

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

    if (currentView === 'habits') {
      return (
        <HabitsLog
          entries={habitEntries}
          onAdd={handleAddHabit}
          onDelete={handleDeleteHabit}
          onBack={goToScan}
        />
      )
    }

    if (currentView === 'profile') {
      return <Profile profile={profile} onSave={handleSaveProfile} onBack={() => setCurrentView('settings')} />
    }

    if (currentView === 'settings') {
      return (
        <Settings
          onOpenProfile={() => setCurrentView('profile')}
          onBack={() => setCurrentView('about')}
        />
      )
    }

    if (currentView === 'about') {
      return <About onOpenSettings={() => setCurrentView('settings')} />
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
          onWhatIf={handleWhatIfRecalculate}
          saved={saved}
        />
      )
    }

    return (
      <CameraCapture
        onCapture={handleCapture}
        onManualEntry={handleManualEntry}
        history={history}
        recentMeals={recentMeals}
        onLogAgain={handleLogAgain}
      />
    )
  }

  return (
    <div className="app">
      <div className="app-content">
        {currentView === 'portion' && (
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

      {!FEEDBACK_BUBBLE_HIDDEN_VIEWS.includes(currentView) && <FeedbackBubble />}

      {currentView !== 'onboarding' && (
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
          className={`tab-item ${currentView === 'habits' ? 'tab-item-active' : ''}`}
          onClick={() => setCurrentView('habits')}
          aria-label="Habits"
        >
          <span className="tab-icon"><WalkIcon /></span>
          <span className="tab-label">Habits</span>
        </button>
        <button
          type="button"
          className={`tab-item ${['about', 'settings', 'profile'].includes(currentView) ? 'tab-item-active' : ''}`}
          onClick={() => setCurrentView('about')}
          aria-label="About"
        >
          <span className="tab-icon"><AboutIcon /></span>
          <span className="tab-label">About</span>
        </button>
      </nav>
      )}
    </div>
  )
}

export default App
