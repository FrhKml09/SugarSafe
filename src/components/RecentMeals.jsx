import { HistoryIcon, ScanIcon } from './icons'

function timeAgo(isoString) {
  const then = new Date(isoString)
  const now = new Date()
  const startOfThen = new Date(then.getFullYear(), then.getMonth(), then.getDate())
  const startOfNow = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const days = Math.round((startOfNow - startOfThen) / (24 * 60 * 60 * 1000))

  if (days <= 0) return 'Today'
  if (days === 1) return 'Yesterday'
  return `${days} days ago`
}

export default function RecentMeals({ meals, onSelect }) {
  if (!Array.isArray(meals) || meals.length === 0) return null

  return (
    <div className="sf-card recent-meals-card">
      <p className="sf-section-label" style={{ margin: '0 0 10px' }}>
        <HistoryIcon width={14} height={14} />
        Log Again
      </p>
      <div className="recent-meals-row">
        {meals.map((meal) => (
          <button
            key={meal.id}
            type="button"
            className="recent-meal-chip"
            onClick={() => onSelect(meal)}
          >
            <span className="recent-meal-chip-icon">
              <ScanIcon width={15} height={15} />
            </span>
            <span className="recent-meal-chip-name">{meal.dishName}</span>
            <span className="recent-meal-chip-meta">{timeAgo(meal.lastLoggedAt)}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
