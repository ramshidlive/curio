import Groq from 'groq-sdk'
import { buildCurioPrompt } from './prompt.js'
import { parseFactsFromText } from './parseFacts.js'

const DEFAULT_MODEL = 'llama-3.3-70b-versatile'
const MAX_ATTEMPTS = 3

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function isRetryableError(error) {
  const message = error?.message ?? String(error)
  return /429|503|rate limit|high demand|overloaded/i.test(message)
}

export async function generateDailyFacts(editionDate) {
  const apiKey = process.env.GROQ_API_KEY?.trim()
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured')
  }

  const groq = new Groq({ apiKey })
  const model = process.env.GROQ_MODEL?.trim() || DEFAULT_MODEL
  const prompt = buildCurioPrompt(editionDate)

  let lastError

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const completion = await groq.chat.completions.create({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
      })

      const text = completion.choices[0]?.message?.content
      if (!text) {
        throw new Error('Groq returned an empty response')
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
