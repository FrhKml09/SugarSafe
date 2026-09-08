const POSITION_MAP = {
  low: 12,
  medium: 38,
  'medium-high': 65,
  high: 90,
}

const LOAD_LABELS = {
  low: 'Gentle rise',
  medium: 'Moderate',
  'medium-high': 'Moderate-high',
  high: 'Higher impact zone',
}

export default function GlycemicSpectrum({ glycemicLoad }) {
  if (!glycemicLoad || !(glycemicLoad in POSITION_MAP)) return null

  const position = POSITION_MAP[glycemicLoad]

  return (
    <div className="glycemic-spectrum">
      <p className="sf-section-label">&#9679; Glycemic Impact Spectrum</p>
      <p className="glycemic-spectrum-title">
        Estimated impact: <strong>{LOAD_LABELS[glycemicLoad]}</strong>
      </p>

      <div className="glycemic-spectrum-track">
        <div className="glycemic-spectrum-marker" style={{ left: `${position}%` }} />
      </div>

      <div className="glycemic-spectrum-labels">
        <span>Gentle Rise</span>
        <span>Moderate</span>
        <span>Higher Impact Zone</span>
      </div>

      <p className="glycemic-spectrum-caption">
        Based on this dish's estimated category — not a lab-measured or predictive value.
      </p>
    </div>
  )
}
