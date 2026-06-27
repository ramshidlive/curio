import { getEditionDate } from '../../lib/editionDate.js'
import { replaceEdition } from '../../lib/blobStore.js'
import { facts } from '../../src/data.js'

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
    const edition = {
      date: editionDate,
      createdAt: new Date().toISOString(),
      facts,
    }

    const { blob, deletedCount } = await replaceEdition(edition)

    return res.status(200).json({
      ok: true,
      date: editionDate,
      factsCount: facts.length,
      deletedEditions: deletedCount,
      blobUrl: blob.url,
    })
  } catch (error) {
    console.error('seed-edition failed:', error)
    return res.status(500).json({
      error: error.message || 'Failed to seed edition',
    })
  }
}
