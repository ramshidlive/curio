import { GoogleGenAI } from '@google/genai'
import { buildCurioPrompt } from './prompt.js'
import { parseFactsFromText } from './parseFacts.js'

const DEFAULT_MODEL = 'gemini-2.5-pro'
const MAX_ATTEMPTS = 3

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function isRetryableError(error) {
  const message = error?.message ?? String(error)
  return /429|503|rate limit|high demand|overloaded|resource exhausted/i.test(
    message,
  )
}

export async function generateDailyFacts(editionDate) {
  const apiKey = process.env.GEMINI_API_KEY?.trim()
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured')
  }

  const ai = new GoogleGenAI({ apiKey })
  const model = process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL
  const prompt = buildCurioPrompt(editionDate)

  let lastError

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      })

      const text = response.text
      if (!text) {
        throw new Error('Gemini returned an empty response')
      }

      return parseFactsFromText(text)
    } catch (error) {
      lastError = error
      if (!isRetryableError(error) || attempt === MAX_ATTEMPTS) {
        throw error
      }
      await sleep(attempt * 2000)
    }
  }

  throw lastError
}
