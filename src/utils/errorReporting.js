import * as Sentry from '@sentry/react'

// No-ops safely if VITE_SENTRY_DSN isn't set — lets this ship before monitoring is configured.
export function initErrorReporting() {
  const dsn = import.meta.env.VITE_SENTRY_DSN
  if (!dsn) return

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    sendDefaultPii: false,
  })
}

export { Sentry }
