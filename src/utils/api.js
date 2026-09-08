export async function analyzeFoodImage(imageFile) {
  const base64 = await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.onerror = () =>
      reject(new Error('Failed to read image file'))
    reader.readAsDataURL(imageFile)
  })

  const response = await fetch('/api/scan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: base64, mimeType: imageFile.type }),
  })

  if (!response.ok) {
    const text = await response.text()
    let message = `Scan failed (${response.status})`

    try {
      const data = JSON.parse(text)
      message = data.error || message
    } catch {
      message = text || message
    }

    throw new Error(message)
  }

  return response.json()
}

export async function recalculateNutrition(dishName, components) {
  const response = await fetch('/api/recalculate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dishName, components }),
  })

  if (!response.ok) {
    const text = await response.text()
    let message = `Recalculation failed (${response.status})`

    try {
      const data = JSON.parse(text)
      message = data.error || message
    } catch {
      message = text || message
    }

    throw new Error(message)
  }

  return response.json()
}

// Additive, best-effort tamper-proof logging — never throws, never blocks the caller.
export async function logToChain(entryType, value, timestamp) {
  try {
    const response = await fetch('/api/log-chain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entryType, value, timestamp }),
    })

    if (!response.ok) return { signature: null }

    const data = await response.json()
    return data.data || { signature: null }
  } catch {
    return { signature: null }
  }
}
