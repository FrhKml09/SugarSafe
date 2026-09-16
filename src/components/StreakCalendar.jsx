import { useState } from 'react'
import { buildStreakDays, currentStreak } from '../utils/streakHelpers'
import { CheckIcon, ChevronIcon } from './icons'

function keyToDate(key) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function formatRange(startKey, endKey) {
  const opts = { month: 'short', day: 'numeric' }
  const start = keyToDate(startKey).toLocaleDateString('en-US', opts)
  const end = keyToDate(endKey).toLocaleDateString('en-US', opts)
  return start === end ? start : `${start} – ${end}`
}

export default function StreakCalendar({ title, subtitle, entries, hint, days = 28 }) {
  const [expanded, setExpanded] = useState(false)
  const [weekOffset, setWeekOffset] = useState(0)

  const allDays = buildStreakDays(entries, days)
  const streak = currentStreak(entries)
  const totalWeeks = Math.ceil(days / 7)

  const endIdx = allDays.length - 7 * weekOffset
  const startIdx = Math.max(0, endIdx - 7)
  const weekDays = allDays.slice(startIdx, endIdx)

  const visibleDays = expanded ? allDays : weekDays
  const canGoOlder = weekOffset < totalWeeks - 1
  const canGoNewer = weekOffset > 0
  const rangeLabel = weekDays.length
    ? formatRange(weekDays[0].key, weekDays[weekDays.length - 1].key)
    : ''

  return (
    <div className="sf-card streak-card">
      <div className="streak-card-header">
        <div>
          <p className="sf-section-label" style={{ margin: 0 }}>{title}</p>
          {subtitle && <p className="sf-dish-sub" style={{ margin: '2px 0 0' }}>{subtitle}</p>}
        </div>
        <div className="streak-count-badge">
          <span className="streak-count-value">{streak}</span>
          <span className="streak-count-label">day streak</span>
        </div>
      </div>

      {!expanded && (
        <div className="streak-week-nav">
          <button
            type="button"
            className="streak-nav-btn"
            onClick={() => setWeekOffset((w) => w + 1)}
            disabled={!canGoOlder}
            aria-label="Previous week"
          >
            <ChevronIcon width={13} height={13} style={{ transform: 'rotate(90deg)' }} />
          </button>
          <span className="streak-week-label">{rangeLabel}</span>
          <button
            type="button"
            className="streak-nav-btn"
            onClick={() => setWeekOffset((w) => Math.max(0, w - 1))}
            disabled={!canGoNewer}
            aria-label="Next week"
          >
            <ChevronIcon width={13} height={13} style={{ transform: 'rotate(-90deg)' }} />
          </button>
        </div>
      )}

      <div className={`streak-grid${expanded ? '' : ' streak-grid--week'}`}>
        {visibleDays.map((d) => (
          <span
            key={d.key}
            className={`streak-dot${d.logged ? ' streak-dot--filled' : ''}${d.isToday ? ' streak-dot--today' : ''}`}
            title={d.key}
          >
            {d.logged ? <CheckIcon width={11} height={11} /> : d.dayLabel}
          </span>
        ))}
      </div>

      <button
        type="button"
        className="streak-expand-btn"
        onClick={() => {
          setExpanded((e) => !e)
          setWeekOffset(0)
        }}
      >
        <ChevronIcon width={12} height={12} style={{ transform: expanded ? 'rotate(180deg)' : 'none' }} />
        {expanded ? 'Show less' : `Show full ${totalWeeks}-week history`}
      </button>

      {hint && <p className="streak-hint">{hint}</p>}
    </div>
  )
}
