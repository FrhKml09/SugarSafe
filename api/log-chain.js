import { logHashToChain } from '../src/server/solana.js'

const TIMEOUT_MS = 8000

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const { entryType, value, timestamp } = req.body || {}

  if (!entryType || value === undefined || value === null || !timestamp) {
    return res.status(400).json({ success: false, error: 'Missing entryType, value, or timestamp' })
  }

  const timeout = new Promise((resolve) =>
    setTimeout(() => resolve({ signature: null, hash: null, error: 'timeout' }), TIMEOUT_MS)
  )

  const result = await Promise.race([logHashToChain({ entryType, value, timestamp }), timeout])

  // Always 200 — chain logging is additive and must never surface as a hard failure to the client.
  return res.status(200).json({ success: true, data: result })
}
