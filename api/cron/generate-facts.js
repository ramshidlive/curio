import { getEditionDate } from '../../lib/editionDate.js'
import { getEdition, saveEdition } from '../../lib/blobStore.js'
import { generateDailyFacts } from '../../lib/generateFacts.js'

function isAuthorized(req) {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  return req.headers.authorization === `Bearer ${secret}`
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!isAuthorized(req)) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const editionDate = getEditionDate()
    const existing = await getEdition(editionDate)

    if (existing) {
      return res.status(200).json({
        ok: true,
        skipped: true,
        date: editionDate,
        message: 'Edition already exists',
      })
    }

    const facts = await generateDailyFacts(editionDate)
    const edition = {
      date: editionDate,
      createdAt: new Date().toISOString(),
      facts,
    }

    const blob = await saveEdition(edition)

    return res.status(200).json({
      ok: true,
      skipped: false,
      date: editionDate,
      factsCount: facts.length,
      blobUrl: blob.url,
    })
  } catch (error) {
    console.error('generate-facts failed:', error)
    return res.status(500).json({
      error: error.message || 'Failed to generate facts',
    })
  }
}
