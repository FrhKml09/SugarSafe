import { ShieldIcon, LightbulbIcon, HistoryIcon, SettingsIcon } from './icons'

const PRINCIPLES = [
  {
    icon: ShieldIcon,
    title: 'Real data, not AI guesses',
    body: 'Nutrition numbers come from a fixed Malaysian dish database (FatSecret and Malaysia’s MOH food database where available). The AI only identifies what’s on your plate — it never invents calorie or carb figures.',
  },
  {
    icon: LightbulbIcon,
    title: 'Advice for right now',
    body: 'Suggestions are things you can act on at the table — not vague tips for "next time." If a number is estimated rather than sourced, we say so.',
  },
  {
    icon: HistoryIcon,
    title: 'Your data stays yours',
    body: 'Meals and glucose readings are stored on your device. Saved entries get an optional tamper-proof hash on Solana so you can verify nothing was altered later.',
  },
]

export default function About({ onOpenSettings }) {
  return (
    <div className="sf-screen">
      <div className="sf-header">
        <p className="screen-eyebrow">SugarSafe Heritage</p>
        <h1 className="sf-header-title">About SugarSafe</h1>
        <p className="sf-header-subtitle">Perihal SugarSafe</p>
        <div className="sf-header-rule" />
      </div>

      <div className="sf-card" style={{ marginBottom: 16 }}>
        <p style={{ margin: '0 0 14px', fontSize: 14, lineHeight: 1.6, color: 'var(--color-text)' }}>
          SugarSafe helps you understand Malaysian food through simple, estimated nutrition
          guidance. Take a photo of your meal and get culturally relevant suggestions to support
          balanced eating.
        </p>
        <div className="disclaimer" style={{ margin: 0 }}>
          This tool is for general awareness only. It does not measure blood glucose, diagnose
          conditions, or replace professional medical advice.
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
        {PRINCIPLES.map(({ icon: Icon, title, body }) => (
          <div key={title} className="sf-card" style={{ display: 'flex', gap: 12 }}>
            <span className="sf-target-icon" style={{ marginTop: 2 }}>
              <Icon width={17} height={17} />
            </span>
            <div>
              <p style={{ margin: '0 0 4px', fontFamily: 'var(--font-display)', fontSize: 15.5, fontWeight: 600, color: 'var(--color-primary)' }}>
                {title}
              </p>
              <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.55, color: 'var(--color-text-secondary)' }}>
                {body}
              </p>
            </div>
          </div>
        ))}
      </div>

      {onOpenSettings && (
        <button type="button" className="sf-card sf-profile-link" onClick={onOpenSettings}>
          <span className="sf-target-icon">
            <SettingsIcon width={17} height={17} />
          </span>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <p className="sf-target-title" style={{ margin: 0 }}>Settings &amp; Data</p>
            <p className="sf-target-sub" style={{ margin: '2px 0 0' }}>
              Health profile, backup &amp; restore
            </p>
          </div>
          <span aria-hidden="true" style={{ color: 'var(--color-text-secondary)', fontSize: 18 }}>&rsaquo;</span>
        </button>
      )}
    </div>
  )
}
