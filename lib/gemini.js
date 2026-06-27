import { GoogleGenerativeAI } from '@google/generative-ai'
import { buildCurioPrompt } from './prompt.js'
import { parseFactsFromText } from './parseFacts.js'

export async function generateDailyFacts(editionDate) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured')
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    tools: [{ googleSearch: {} }],
  })

  const prompt = buildCurioPrompt(editionDate)
  const result = await model.generateContent(prompt)
  const text = result.response.text()

  return parseFactsFromText(text)
}
