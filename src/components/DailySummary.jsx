import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { macroTotalsForToday, isToday } from '../utils/nutritionHelpers'

const COLORS = { Carbs: '#1e3b2c', Protein: '#be5b3c', Fat: '#d98a2b' }

export default function DailySummary({ scanHistory, glucoseReadings }) {
  const macros = macroTotalsForToday(scanHistory)
  const todayReadings = (Array.isArray(glucoseReadings) ? glucoseReadings : []).filter((r) =>
    isToday(r.timestamp)
  )

  const chartData = [
    { name: 'Carbs', value: macros.carbsG },
    { name: 'Protein', value: macros.proteinG },
    { name: 'Fat', value: macros.fatG },
  ].filter((d) => d.value > 0)

  return (
    <div className="daily-summary-card">
      <h3 className="glucose-chart-title">Today</h3>

      <div className="daily-summary-carbs">
        <span className="daily-summary-carbs-value">{Math.round(macros.carbsG)}g</span>
        <span className="daily-summary-carbs-label">
          carbs consumed today (estimated, from {macros.mealCount} logged{' '}
          {macros.mealCount === 1 ? 'meal' : 'meals'})
        </span>
      </div>

      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={70} paddingAngle={2}>
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={COLORS[entry.name]} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => [`${Math.round(value)}g`, name]} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <p className="glucose-chart-empty">No meals logged today yet.</p>
      )}

      <div className="daily-summary-glucose">
        <p className="daily-summary-glucose-title">Today's glucose readings ({todayReadings.length})</p>
        {todayReadings.length === 0 ? (
          <p className="glucose-chart-empty">No readings logged today yet.</p>
        ) : (
          <div className="daily-summary-glucose-list">
            {todayReadings.map((r) => (
              <span key={r.id} className="daily-summary-glucose-pill">
                {r.value} {r.unit}
              </span>
            ))}
          </div>
        )}
      </div>

      <p className="glucose-chart-caption">
        Shown together for reference only — your logged data, not a proven correlation between meals and readings.
      </p>
    </div>
  )
}
