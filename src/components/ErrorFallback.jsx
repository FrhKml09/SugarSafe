export default function ErrorFallback({ resetError }) {
  function handleReload() {
    resetError()
    window.location.reload()
  }

  return (
    <div className="sf-screen" style={{ padding: '60px 24px', textAlign: 'center' }}>
      <p className="screen-eyebrow">SugarSafe Heritage</p>
      <h1 className="sf-header-title">Something Went Wrong</h1>
      <p style={{ margin: '12px 0 24px', fontSize: 14, lineHeight: 1.6, color: 'var(--color-text-secondary)' }}>
        The app hit an unexpected error. Your saved data is safe on this device — reloading should
        fix it. If it keeps happening, let me know on WhatsApp from the About screen.
      </p>
      <button
        type="button"
        className="sf-btn-primary"
        style={{ maxWidth: 260, margin: '0 auto' }}
        onClick={handleReload}
      >
        Reload SugarSafe
      </button>
    </div>
  )
}
