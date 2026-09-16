import { useState } from 'react'
import ScreenHeader from './ScreenHeader'
import StreakCalendar from './StreakCalendar'
import { WalkIcon, TrashIcon } from './icons'

const HABIT_TYPES = [
  { value: 'walking', label: 'Walking' },
  { value: 'brisk-walking', label: 'Brisk walking' },
  { value: 'jogging', label: 'Jogging / Running' },
  { value: 'cycling', label: 'Cycling' },
  { value: 'swimming', label: 'Swimming' },
  { value: 'housework', label: 'Housework / Chores' },
  { value: 'stretching', label: 'Stretching / Yoga' },
  { value: 'gym', label: 'Gym / Strength training' },
  { value: 'other', label: 'Other' },
]

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

export default function HabitsLog({ entries, onAdd, onDelete, onBack }) {
  const [type, setType] = useState('walking')
  const [durationMinutes, setDurationMinutes] = useState('')
  const [note, setNote] = useState('')
  const [formError, setFormError] = useState('')

  function resetForm() {
    setType('walking')
    setDurationMinutes('')
    setNote('')
    setFormError('')
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (durationMinutes && (Number.isNaN(Number(durationMinutes)) || Number(durationMinutes) <= 0)) {
      setFormError('Duration must be a positive number of minutes.')
      return
    }

    const typeLabel = HABIT_TYPES.find((opt) => opt.value === type)?.label || type

    onAdd({ type, typeLabel, durationMinutes, note })
    resetForm()
  }

  return (
    <div className="sf-screen">
      <ScreenHeader title="Healthy Habits" subtitle="Tabiat Sihat" tag="Move More" onBack={onBack} />

      <StreakCalendar
        title="Habit Streak"
        subtitle="Days you've logged some movement"
        entries={entries}
        hint="Walking after meals can help blunt blood sugar spikes — even 10-15 minutes helps."
      />

      <div className="glucose-log" style={{ marginTop: 16 }}>
        <form className="glucose-form" onSubmit={handleSubmit}>
          <label className="scan-result-edit-label" htmlFor="habit-type">
            Activity
          </label>
          <select
            id="habit-type"
            className="scan-result-edit-input glucose-select"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            {HABIT_TYPES.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <label className="scan-result-edit-label" htmlFor="habit-duration">
            Duration (minutes, optional)
          </label>
          <input
            id="habit-duration"
            type="number"
            inputMode="numeric"
            min="0"
            placeholder="e.g. 20"
            className="scan-result-edit-input"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(e.target.value)}
          />

          <label className="scan-result-edit-label" htmlFor="habit-note">
            Note (optional)
          </label>
          <input
            id="habit-note"
            type="text"
            placeholder="e.g. Evening walk around the block"
            className="scan-result-edit-input"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          {formError && (
            <div className="scan-result-edit-error" role="alert">
              {formError}
            </div>
          )}

          <button type="submit" className="glucose-save">
            Log activity
          </button>
        </form>

        <p className="sf-section-label" style={{ marginTop: 20 }}>Activity Log &middot; Log Aktiviti</p>

        <div className="glucose-list">
          {!Array.isArray(entries) || entries.length === 0 ? (
            <div className="history-empty">
              <span className="history-empty-icon" aria-hidden="true">
                <WalkIcon width={36} height={36} strokeWidth={1.5} />
              </span>
              <p className="history-empty-text">
                No activity logged yet. Log a walk or workout to start your streak.
              </p>
            </div>
          ) : (
            entries.map((entry) => (
              <div key={entry.id} className="sf-reading-row">
                <span className="sf-reading-icon">
                  <WalkIcon width={16} height={16} />
                </span>
                <div className="sf-reading-body">
                  <div className="sf-reading-top">
                    <span className="sf-reading-value">
                      {entry.typeLabel}
                      {entry.durationMinutes ? ` · ${entry.durationMinutes} min` : ''}
                    </span>
                    <button
                      type="button"
                      className="sf-ingredient-remove"
                      onClick={() => onDelete(entry.id)}
                      aria-label={`Delete ${entry.typeLabel} entry`}
                    >
                      <TrashIcon width={15} height={15} />
                    </button>
                  </div>
                  <p className="sf-reading-meta">{formatDate(entry.timestamp)}</p>
                  {entry.note && <p className="sf-reading-linked">{entry.note}</p>}
                  {entry.txSignature && (
                    <a
                      className="sf-chain-badge"
                      style={{ marginTop: 6 }}
                      href={`https://explorer.solana.com/tx/${entry.txSignature}?cluster=${entry.chainCluster || 'devnet'}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Verified on Solana &#10003;
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
