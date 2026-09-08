import { PORTION_OPTIONS } from '../utils/nutritionHelpers'

export default function PortionStep({ dishName, onSelect, onScanAgain }) {
  return (
    <div className="portion-step">
      <div className="portion-step-card">
        <h2 className="portion-step-title">How much of this did you actually eat?</h2>
        {dishName && <p className="portion-step-dish">{dishName}</p>}

        <div className="portion-step-options">
          {PORTION_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              type="button"
              className="portion-step-option"
              onClick={() => onSelect(opt.factor)}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <button type="button" className="scan-result-cancel" onClick={onScanAgain}>
          Scan again
        </button>
      </div>
    </div>
  )
}
