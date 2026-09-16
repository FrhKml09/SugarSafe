import { useState } from 'react'
import ScreenHeader from './ScreenHeader'
import { ProfileIcon, DownloadIcon, UploadIcon } from './icons'
import { downloadBackup, restoreBackup } from '../utils/backupRestore'

export default function Settings({ onOpenProfile, onBack }) {
  const [restoreStatus, setRestoreStatus] = useState('')
  const [restoreError, setRestoreError] = useState('')

  function handleExport() {
    downloadBackup()
  }

  function handleRestoreFile(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    const confirmed = window.confirm(
      'Restoring will replace the meals, glucose readings, habits, and profile currently on this device with what’s in the backup file. Continue?'
    )
    if (!confirmed) return

    setRestoreError('')
    setRestoreStatus('Restoring...')

    restoreBackup(file)
      .then(() => {
        setRestoreStatus('Restored — reloading...')
        window.location.reload()
      })
      .catch((err) => {
        setRestoreStatus('')
        setRestoreError(err.message || 'Could not restore that backup.')
      })
  }

  return (
    <div className="sf-screen">
      <ScreenHeader title="Settings & Data" subtitle="Tetapan & Data" onBack={onBack} />

      <button type="button" className="sf-card sf-profile-link" onClick={onOpenProfile} style={{ marginBottom: 16 }}>
        <span className="sf-target-icon">
          <ProfileIcon width={17} height={17} />
        </span>
        <div style={{ flex: 1, textAlign: 'left' }}>
          <p className="sf-target-title" style={{ margin: 0 }}>Your Health Profile</p>
          <p className="sf-target-sub" style={{ margin: '2px 0 0' }}>
            Add your height, weight, and diabetes status for more relevant advice
          </p>
        </div>
        <span aria-hidden="true" style={{ color: 'var(--color-text-secondary)', fontSize: 18 }}>&rsaquo;</span>
      </button>

      <div className="sf-card">
        <p className="sf-dish-eyebrow" style={{ marginBottom: 4 }}>Backup &amp; Restore</p>
        <p style={{ margin: '0 0 12px', fontSize: 12.5, lineHeight: 1.55, color: 'var(--color-text-secondary)' }}>
          Your data lives only on this device. Export a backup before switching phones or clearing
          your browser — you can restore it anytime, on any device.
        </p>
        <div className="sf-action-row" style={{ marginTop: 0 }}>
          <button type="button" className="sf-btn-outline" onClick={handleExport}>
            <DownloadIcon width={15} height={15} />
            Export my data
          </button>
          <label className="sf-btn-outline backup-restore-label">
            <UploadIcon width={15} height={15} />
            Restore from backup
            <input
              type="file"
              accept="application/json,.json"
              className="backup-restore-input"
              onChange={handleRestoreFile}
            />
          </label>
        </div>
        {restoreStatus && <p className="sf-dish-sub" style={{ marginTop: 10 }}>{restoreStatus}</p>}
        {restoreError && (
          <div className="scan-result-edit-error" role="alert" style={{ marginTop: 10 }}>
            {restoreError}
          </div>
        )}
      </div>
    </div>
  )
}
