export async function analyzeFoodImage(imageFile) {
  const base64 = await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(imageFile)
  })

  const response = await fetch('/api/scan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: base64, mimeType: imageFile.type }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Scan failed: ${text}`)
  }

  return response.json()
}
