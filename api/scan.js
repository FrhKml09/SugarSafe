import { findDish } from '../src/data/malaysianDishes.js'

const IDENTIFY_PROMPT = `You are a food identification assistant for SugarSafe, a Malaysian food-photo app for people managing or at risk of diabetes.

Your ONLY job is to identify the dish and its visible components from the photo. Do NOT calculate or estimate calories, carbohydrates, sugar, or any nutrition values — nutrition is looked up separately from a fixed database, never invented here.

Return ONLY valid JSON (no markdown, no extra text) with these exact fields:
{
  "dish_name": "string, the standard Malaysian name of the dish, e.g. 'Nasi Lemak'",
  "dish_name_en": "string, a short English description",
  "visible_components": ["string", ...],
  "confidence": "high" | "medium" | "low",
  "matched_known_dish": true or false
}

Rules:
1. dish_name should be the standard Malaysian name if you recognize a common dish (e.g. Nasi Lemak, Roti Canai, Char Kway Teow, Mee Goreng Mamak, Teh Tarik, Nasi Kandar, Nasi Ayam, Curry Laksa, Banana Leaf Rice, Mee Rebus, Wantan Mee, Nasi Goreng Kampung, Economy Rice, Satay, Roti Telur, or similar).
2. visible_components should list only parts/ingredients you can actually see in the image — do not invent items you cannot see.
3. confidence reflects how sure you are about the dish identification itself, not about nutrition.
4. matched_known_dish should be true only if you recognize this as a common, standard Malaysian dish (not a rare or highly customized meal).
5. If no food is visible, set dish_name to "Unidentified dish", visible_components to an empty array, confidence to "low", and matched_known_dish to false.
`

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res
      .status(405)
      .json({ success: false, error: 'Method not allowed' })
  }

  const { image, mimeType } = req.body || {}

  if (!image || !mimeType) {
    return res
      .status(400)
      .json({ success: false, error: 'Missing image or mimeType' })
  }

  const apiKey = process.env.OPENAI_API_KEY
  const baseURL = process.env.OPENAI_BASE_URL
  const model = process.env.OPENAI_MODEL

  if (!apiKey || !baseURL || !model) {
    return res
      .status(500)
      .json({ success: false, error: 'Server misconfigured: missing API configuration' })
  }

  const url = `${baseURL.replace(/\/+$/, '')}/chat/completions`

  const body = {
    model: model,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: IDENTIFY_PROMPT,
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:${mimeType};base64,${image}`,
            },
          },
        ],
      },
    ],
    response_format: {
      type: 'json_object',
    },
  }

  try {
    const aiRes = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    })

    if (!aiRes.ok) {
      const errorText = await aiRes.text()
      console.error('AI provider error:', errorText)

      return res.status(500).json({
        success: false,
        error: `AI provider error: ${aiRes.status}`,
      })
    }

    const data = await aiRes.json()
    const text = data?.choices?.[0]?.message?.content || ''

    let parsed
    try {
      parsed = JSON.parse(text)
    } catch {
      console.error('Invalid AI response:', text)
      return res.status(500).json({
        success: false,
        error: 'Invalid response from AI',
      })
    }

    const dishName = parsed.dish_name || 'Unidentified dish'
    const dishNameEn = parsed.dish_name_en || ''
    const components = Array.isArray(parsed.visible_components) ? parsed.visible_components : []
    const confidence = ['high', 'medium', 'low'].includes(parsed.confidence) ? parsed.confidence : 'low'

    // matched_known_dish is decided by OUR database lookup, not the AI's self-report —
    // the model has no visibility into what's actually in malaysianDishes.js.
    const matchedKnownDish = Boolean(findDish(dishName))
    const needsConfirmation = confidence !== 'high' || !matchedKnownDish

    return res.status(200).json({
      success: true,
      data: {
        dishName,
        dishNameEn,
        components,
        confidence,
        matchedKnownDish,
        needsConfirmation,
      },
    })
  } catch (err) {
    console.error('Network error:', err)

    return res.status(500).json({
      success: false,
      error: 'Network error calling AI provider',
    })
  }
}
