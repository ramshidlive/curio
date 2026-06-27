import { z } from 'zod'

const factSchema = z.object({
  id: z.number().int().min(1).max(5),
  title: z.string().min(10),
  category: z.string().min(1),
  story: z.string().min(50),
})

const factsSchema = z.array(factSchema).length(5)

export function parseFactsFromText(text) {
  const trimmed = text.trim()
  const withoutFences = trimmed
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()

  const start = withoutFences.indexOf('[')
  const end = withoutFences.lastIndexOf(']')
  if (start === -1 || end === -1) {
    throw new Error('No JSON array found in model response')
  }

  const jsonSlice = withoutFences.slice(start, end + 1)
  const parsed = JSON.parse(jsonSlice)
  const facts = factsSchema.parse(parsed)

  return facts
    .sort((a, b) => a.id - b.id)
    .map((fact, index) => ({ ...fact, id: index + 1 }))
}
