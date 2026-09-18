import { findDish } from '../src/data/malaysianDishes.js'
import { reportError } from './_sentry.js'

const FALLBACK_PROMPT = `You are a nutrition estimation assistant for SugarSafe, a Malaysian food-photo app for people managing or at risk of diabetes.

This dish is NOT in our verified database, so provide a careful, clearly-labeled rough estimate based on its visible components. Follow these rules strictly:

1. This is a food-scanning and nutrition-estimation feature, NOT a blood-glucose measurement tool. Do NOT predict blood glucose, give medical advice, diagnose conditions, or recommend medication or insulin.
2. Base your estimate on standard Malaysian hawker/mamak portion sizes for the listed components. Use reasonable ranges' midpoints rather than exact false precision.
3. Return ONLY valid JSON (no markdown, no extra text) with these exact fields:
{
  "estimatedPortion": "string",
  "kcal": number,
  "carbs_g": number,
  "sugar_g": number,
  "protein_g": number,
  "fat_g": number,
  "glycemic_load": "low" | "medium" | "medium-high" | "high",
  "tips": ["string", "string"]
}
4. tips should be 1-2 practical, culturally relevant suggestions for making this specific meal more diabetes-friendly (portion swaps, ingredient swaps, or ordering tweaks) — not generic advice.
`

async function estimateFromComponents({ apiKey, baseURL, model, dishName, components }) {
  const url = `${baseURL.replace(/\/+$/, '')}/chat/completions`
  const componentList = components.map((c) => `- ${c}`).join('\n')

  const aiRes = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: FALLBACK_PROMPT + `\n\nDish: ${dishName}\nVisible components:\n${componentList}\n`,
            },
          ],
        },
      ],
      response_format: { type: 'json_object' },
    }),
  })

  if (!aiRes.ok) {
    const errorText = await aiRes.text()
    console.error('AI provider error:', errorText)
    throw new Error(`AI provider error: ${aiRes.status}`)
  }

  const data = await aiRes.json()
  const text = data?.choices?.[0]?.message?.content || ''

  let parsed
  try {
    parsed = JSON.parse(text)
  } catch {
    console.error('Invalid AI response:', text)
    throw new Error('Invalid response from AI')
  }

  return {
    dishName,
    components,
    matchedKnownDish: false,
    roughEstimate: true,
    servingSize: parsed.estimatedPortion || null,
    source: 'AI estimate — please confirm',
    glycemicLoad: parsed.glycemic_load || null,
    swapTips: Array.isArray(parsed.tips) ? parsed.tips : [],
    nutrition: {
      kcal: typeof parsed.kcal === 'number' ? parsed.kcal : null,
      carbsG: typeof parsed.carbs_g === 'number' ? parsed.carbs_g : null,
      sugarG: typeof parsed.sugar_g === 'number' ? parsed.sugar_g : null,
      proteinG: typeof parsed.protein_g === 'number' ? parsed.protein_g : null,
      fatG: typeof parsed.fat_g === 'number' ? parsed.fat_g : null,
    },
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res
      .status(405)
      .json({ success: false, error: 'Method not allowed' })
  }

  const { dishName, components } = req.body || {}

  if (!dishName || !Array.isArray(components) || components.length === 0) {
    return res
      .status(400)
      .json({ success: false, error: 'Missing dishName or components' })
  }

  const apiKey = process.env.OPENAI_API_KEY
  const baseURL = process.env.OPENAI_BASE_URL
  const model = process.env.OPENAI_MODEL

  if (!apiKey || !baseURL || !model) {
    await reportError(new Error('Server misconfigured: missing API configuration'), { route: 'recalculate' })
    return res
      .status(500)
      .json({ success: false, error: 'Server misconfigured: missing API configuration' })
  }

  const dbEntry = findDish(dishName)

  if (dbEntry) {
    return res.status(200).json({
      success: true,
      data: {
        dishName,
        components,
        matchedKnownDish: true,
        roughEstimate: false,
        servingSize: dbEntry.servingSize || null,
        source: dbEntry.source,
        glycemicLoad: dbEntry.glycemicLoad,
        swapTips: dbEntry.swapTips || [],
        nutrition: {
          kcal: dbEntry.kcal,
          carbsG: dbEntry.carbsG,
          sugarG: dbEntry.sugarG,
          proteinG: dbEntry.proteinG ?? null,
          fatG: dbEntry.fatG ?? null,
        },
      },
    })
  }

  try {
    const result = await estimateFromComponents({ apiKey, baseURL, model, dishName, components })
    return res.status(200).json({ success: true, data: result })
  } catch (err) {
    console.error('Recalculate error:', err)
    await reportError(err, { route: 'recalculate', dishName, components })
    return res.status(500).json({
      success: false,
      error: err.message || 'Network error calling AI provider',
    })
  }
}
