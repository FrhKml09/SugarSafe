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

  if (!apiKey) {
    return res
      .status(500)
      .json({ success: false, error: 'Server misconfigured: missing API key' })
  }

  const prompt = `You are a nutrition assistant for a Malaysian food scanner app.

Analyze the food image and return ONLY valid JSON with these exact fields:

{
  "dishName": "string",
  "components": ["string"],
  "confidence": 0.0,
  "estimatedPortion": "string",
  "estimatedNutrition": {
    "carbohydrates": "string",
    "calories": "string",
    "sugar": "string"
  },
  "observations": "string",
  "suggestion": "string"
}

Rules:
- dishName is the main Malaysian dish name
- components are the visible parts/ingredients
- confidence is a 0-1 estimate
- estimatedNutrition values are strings like "65g", "580 kcal", "12g"
- observations is one short sentence about the meal
- suggestion is one practical, culturally relevant tip
- Do NOT give medical advice, glucose predictions, or medication recommendations
- Keep all values as estimates
`

  const url =
    'https://hong-hp.tail33e4e0.ts.net/v1/chat/completions'

  const body = {
    model: 'test-3a3301c8',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: prompt,
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

    const text =
      data?.choices?.[0]?.message?.content || ''

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

    const result = {
      dishName: parsed.dishName || 'Unknown Dish',
      components: Array.isArray(parsed.components)
        ? parsed.components
        : [],
      confidence:
        typeof parsed.confidence === 'number'
          ? parsed.confidence
          : 0.5,
      estimatedPortion:
        parsed.estimatedPortion || 'Unknown',
      estimatedNutrition: {
        carbohydrates:
          parsed.estimatedNutrition?.carbohydrates || 'N/A',
        calories:
          parsed.estimatedNutrition?.calories || 'N/A',
        sugar:
          parsed.estimatedNutrition?.sugar || 'N/A',
      },
      observations: parsed.observations || '',
      suggestion: parsed.suggestion || '',
    }

    return res.status(200).json({
      success: true,
      data: result,
    })
  } catch (err) {
    console.error('Network error:', err)

    return res.status(500).json({
      success: false,
      error: 'Network error calling AI provider',
    })
  }
}