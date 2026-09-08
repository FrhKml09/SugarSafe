import { useState, useMemo } from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceArea } from 'recharts'
import { isWithinLastDays } from '../utils/nutritionHelpers'

const RANGE_OPTIONS = [
  { label: '7 days', days: 7 },
  { label: '30 days', days: 30 },
]

function formatTick(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function formatTooltipLabel(iso) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function GlucoseTrendChart({ readings }) {
  const [rangeDays, setRangeDays] = useState(7)

  const data = useMemo(() => {
    return (Array.isArray(readings) ? readings : [])
      .filter((r) => isWithinLastDays(r.timestamp, rangeDays))
      .slice()
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      .map((r) => ({ timestamp: r.timestamp, value: r.value }))
  }, [readings, rangeDays])

  return (
    <div className="glucose-chart-card">
      <div className="glucose-chart-header">
        <h3 className="glucose-chart-title">Glucose trend</h3>
        <div className="glucose-chart-toggle">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.days}
              type="button"
              className={`glucose-chart-toggle-btn ${
                rangeDays === opt.days ? 'glucose-chart-toggle-btn--active' : ''
              }`}
              onClick={() => setRangeDays(opt.days)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {data.length === 0 ? (
        <p className="glucose-chart-empty">No readings in this range yet.</p>
      ) : (
        <>
          <div className="sf-legend-row">
            <span className="sf-legend-dot sf-legend-dot--safe">Target range (4.0&ndash;7.8)</span>
            <span className="sf-legend-dot sf-legend-dot--high">Outside range</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
              <CartesianGrid stroke="#ece0cc" vertical={false} />
              <ReferenceArea y1={4.0} y2={7.8} fill="#1e3b2c" fillOpacity={0.08} />
              <XAxis
                dataKey="timestamp"
                tickFormatter={formatTick}
                tick={{ fontSize: 11, fill: '#7a6a5c' }}
                minTickGap={24}
              />
              <YAxis tick={{ fontSize: 11, fill: '#7a6a5c' }} width={36} />
              <Tooltip
                labelFormatter={formatTooltipLabel}
                formatter={(value) => [`${value} mmol/L`, 'Reading']}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#1e3b2c"
                strokeWidth={2}
                dot={(props) => {
                  const outOfRange = props.payload.value < 4.0 || props.payload.value > 7.8
                  return (
                    <circle
                      key={props.key}
                      cx={props.cx}
                      cy={props.cy}
                      r={3.5}
                      fill={outOfRange ? '#be5b3c' : '#1e3b2c'}
                    />
                  )
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}

      <p className="glucose-chart-caption">Your logged readings — estimated, not a medical analysis.</p>
    </div>
  )
}
