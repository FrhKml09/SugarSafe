import { useEffect, useRef, useState } from 'react'
import Disclaimer from './Disclaimer'
import StreakCalendar from './StreakCalendar'
import RecentMeals from './RecentMeals'
import { CheckIcon } from './icons'

const SCAN_TIPS = [
  'Hold the camera directly above the plate',
  'Shoot in good light and avoid heavy shadows',
  'Fit the whole portion in the frame',
]

export default function CameraCapture({ onCapture, onManualEntry, history, recentMeals, onLogAgain }) {
  const videoRef = useRef(null)
  const fileInputRef = useRef(null)
  const canvasRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [manualName, setManualName] = useState('')

  useEffect(() => {
    let active = true

    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        })

        if (!active) {
          mediaStream.getTracks().forEach((track) => track.stop())
          return
        }

        setStream(mediaStream)
        setError('')
      } catch (err) {
        if (!active) return

        setLoading(false)
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setError('Camera access was denied. You can still upload a photo using the option below.')
        } else if (err.name === 'NotFoundError') {
          setError('No camera found on this device. Please use the file upload option below.')
        } else {
          setError('Unable to access the camera. Please use the file upload option below.')
        }
      }
    }

    startCamera()

    return () => {
      active = false
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
      videoRef.current.play().catch(() => {})
      setLoading(false)
    }
  }, [stream])

  function captureFrame() {
    const video = videoRef.current
    const canvas = canvasRef.current

    if (!video || !canvas) return

    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480

    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    canvas.toBlob((blob) => {
      if (!blob) return
      const file = new File([blob], 'capture.jpg', { type: blob.type })
      onCapture(file)
    }, 'image/jpeg', 0.92)
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0]
    if (file) {
      onCapture(file)
    }
    event.target.value = ''
  }

  function handleManualSubmit(event) {
    event.preventDefault()
    if (!manualName.trim()) return
    onManualEntry(manualName.trim())
    setManualName('')
  }

  return (
    <div className="scan-screen">
      <p className="screen-eyebrow">SugarSafe Heritage</p>
      <h1 className="screen-title">Scan Your Meal</h1>

      {Array.isArray(history) && (
        <StreakCalendar
          title="Meal Logging Streak"
          subtitle="Days you've logged a meal"
          entries={history}
          hint="Log every meal you scan to keep your streak going."
        />
      )}

      {onLogAgain && <RecentMeals meals={recentMeals} onSelect={onLogAgain} />}

      <Disclaimer />

      <div className="camera-capture">
        <div className="camera-preview">
          {error ? (
            <div className="camera-error" role="alert">
              <span className="camera-error-icon">!</span>
              <p>{error}</p>
            </div>
          ) : (
            <>
              <video ref={videoRef} playsInline muted autoPlay className="camera-video" />
              {loading && <div className="camera-loading" aria-label="Loading camera" />}
            </>
          )}
        </div>

        <canvas ref={canvasRef} className="camera-canvas" aria-hidden="true" />

        {!error && (
          <button
            type="button"
            className="camera-capture-button"
            onClick={captureFrame}
            disabled={loading || !stream}
            aria-label="Capture photo"
          >
            <span className="camera-capture-button-inner" />
          </button>
        )}

        <div className="camera-upload-fallback">
          <p className="camera-upload-text">Or upload a photo from your device</p>
          <label className="camera-upload-label">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="camera-upload-input"
              onChange={handleFileChange}
            />
            <span className="camera-upload-button">Choose file</span>
          </label>
        </div>

        {onManualEntry && (
          <form className="camera-manual-entry" onSubmit={handleManualSubmit}>
            <p className="camera-upload-text">Photo recognition unavailable? Type the dish name</p>
            <div className="camera-manual-entry-row">
              <input
                type="text"
                className="camera-manual-entry-input"
                placeholder="e.g. Nasi Lemak"
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
              />
              <button type="submit" className="camera-manual-entry-btn" disabled={!manualName.trim()}>
                Go
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="scan-tips-card">
        <div className="scan-tips-header">
          <span className="tips-badge">TIPS</span>
          <p>Get a clearer result</p>
        </div>
        <ul className="scan-tips-list">
          {SCAN_TIPS.map((tip) => (
            <li key={tip}>
              <span className="scan-tips-check">
                <CheckIcon width={13} height={13} />
              </span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
