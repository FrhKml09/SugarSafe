import { BackIcon } from './icons'

export default function ScreenHeader({ title, subtitle, tag, onBack }) {
  return (
    <div className="sf-header">
      <div className="sf-header-row">
        <button type="button" className="sf-back-btn" onClick={onBack} aria-label="Back to Scan">
          <BackIcon width={20} height={20} />
        </button>
        <div className="sf-header-text">
          <p className="screen-eyebrow">
            SugarSafe Heritage
            {tag && <span className="sf-header-tag">{tag}</span>}
          </p>
          <h1 className="sf-header-title">{title}</h1>
          {subtitle && <p className="sf-header-subtitle">{subtitle}</p>}
        </div>
        <span className="sf-header-spacer" aria-hidden="true" />
      </div>
      <div className="sf-header-rule" />
    </div>
  )
}
