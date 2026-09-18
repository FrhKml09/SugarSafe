import * as Sentry from '@sentry/node'

let initialized = false

// No-ops safely if SENTRY_DSN isn't set. Call once per handler invocation —
// Sentry.init() itself is idempotent-safe across warm serverless reuses.
export function initSentry() {
  if (initialized) return
  const dsn = process.env.SENTRY_DSN
  if (dsn) {
    Sentry.init({
      dsn,
      environment: process.env.VERCEL_ENV || 'development',
      sendDefaultPii: false,
    })
  }
  initialized = true
}

// Reports an error and waits briefly for it to actually send before the
// serverless function is torn down — fire-and-forget capture is unreliable
// in this environment since the process can exit before delivery.
export async function reportError(err, context) {
  initSentry()
  if (context) Sentry.setContext('request', context)
  Sentry.captureException(err)
  try {
    await Sentry.flush(2000)
  } catch {
    // never let monitoring failures affect the actual response
  }
}

export { Sentry }
