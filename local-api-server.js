import http from 'http'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { findDish } from './src/data/malaysianDishes.js'
import { logHashToChain } from './src/server/solana.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

function loadEnv() {
  try {
    const envPath = join(__dirname, '.env.local')
    const content = readFileSync(envPath, 'utf8')
    const lines = content.split('\n')
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const [key, ...rest] = trimmed.split('=')
      if (key && rest.length) {
        process.env[key.trim()] = rest.join('=').trim().replace(/^"|"$/g, '')
      }
    }
  } catch {
    // .env.local may not exist
  }
}

loadEnv()

const API_KEY = process.env.OPENAI_API_KEY
const BASE_URL = process.env.OPENAI_BASE_URL
const MODEL = process.env.OPENAI_MODEL

if (!API_KEY || !BASE_URL || !MODEL) {
  console.error('Missing OPENAI_API_KEY, OPENAI_BASE_URL, or OPENAI_MODEL in .env.local')
  process.exit(1)
}

const PORT = 3001

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

async function callChatCompletions(messages) {
  const url = `${BASE_URL.replace(/\/+$/, '')}/chat/completions`
  const aiRes = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
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

  try {
    return JSON.parse(text)
  } catch {
    console.error('Invalid AI response:', text)
    throw new Error('Invalid response from AI')
  }
}

async function estimateFromComponents(dishName, components) {
  const componentList = components.map((c) => `- ${c}`).join('\n')
  const parsed = await callChatCompletions([
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: FALLBACK_PROMPT + `\n\nDish: ${dishName}\nVisible components:\n${componentList}\n`,
        },
      ],
    },
  ])

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

function dbEntryToResult(dishName, components, dbEntry) {
  return {
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
  }
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    })
    res.end()
    return
  }

  if (req.method !== 'POST') {
    res.writeHead(404)
    res.end(JSON.stringify({ success: false, error: 'Not found' }))
    return
  }

  let body = ''
  req.on('data', (chunk) => {
    body += chunk
  })
  req.on('end', async () => {
    try {
      const parsedBody = JSON.parse(body)

      if (req.url === '/api/recalculate') {
        const { dishName, components } = parsedBody

        if (!dishName || !Array.isArray(components) || components.length === 0) {
          res.writeHead(400)
          res.end(JSON.stringify({ success: false, error: 'Missing dishName or components' }))
          return
        }

        const dbEntry = findDish(dishName)

        let result
        if (dbEntry) {
          result = dbEntryToResult(dishName, components, dbEntry)
        } else {
          result = await estimateFromComponents(dishName, components)
        }

        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        })
        res.end(JSON.stringify({ success: true, data: result }))
        return
      }

      if (req.url === '/api/log-chain') {
        const { entryType, value, timestamp } = parsedBody

        if (!entryType || value === undefined || value === null || !timestamp) {
          res.writeHead(400)
          res.end(JSON.stringify({ success: false, error: 'Missing entryType, value, or timestamp' }))
          return
        }

        const timeout = new Promise((resolve) =>
          setTimeout(() => resolve({ signature: null, hash: null, error: 'timeout' }), 8000)
        )
        const result = await Promise.race([logHashToChain({ entryType, value, timestamp }), timeout])

        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        })
        res.end(JSON.stringify({ success: true, data: result }))
        return
      }

      if (req.url !== '/api/scan') {
        res.writeHead(404)
        res.end(JSON.stringify({ success: false, error: 'Not found' }))
        return
      }

      const { image, mimeType } = parsedBody

      if (!image || !mimeType) {
        res.writeHead(400)
        res.end(JSON.stringify({ success: false, error: 'Missing image or mimeType' }))
        return
      }

      const parsed = await callChatCompletions([
        {
          role: 'user',
          content: [
            { type: 'text', text: IDENTIFY_PROMPT },
            { type: 'image_url', image_url: { url: `data:${mimeType};base64,${image}` } },
          ],
        },
      ])

      const dishName = parsed.dish_name || 'Unidentified dish'
      const dishNameEn = parsed.dish_name_en || ''
      const components = Array.isArray(parsed.visible_components) ? parsed.visible_components : []
      const confidence = ['high', 'medium', 'low'].includes(parsed.confidence) ? parsed.confidence : 'low'
      const matchedKnownDish = Boolean(findDish(dishName))
      const needsConfirmation = confidence !== 'high' || !matchedKnownDish

      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      })
      res.end(
        JSON.stringify({
          success: true,
          data: { dishName, dishNameEn, components, confidence, matchedKnownDish, needsConfirmation },
        })
      )
    } catch (err) {
      console.error('Request error:', err)
      res.writeHead(500)
      res.end(JSON.stringify({ success: false, error: err.message || 'Network error calling AI provider' }))
    }
  })
})

server.listen(PORT, () => {
  console.log(`Local API server running at http://localhost:${PORT}`)
})
