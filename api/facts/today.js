import { getEditionDate } from '../../lib/editionDate.js'
import { getEdition, getLatestEdition } from '../../lib/blobStore.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const editionDate = getEditionDate()
    let edition = await getEdition(editionDate)

    if (!edition) {
      edition = await getLatestEdition()
    }

    if (!edition) {
      return res.status(404).json({
        error: 'No facts available yet',
        date: editionDate,
        facts: [],
      })
    }

    return res.status(200).json({
      date: edition.date,
      createdAt: edition.createdAt,
      facts: edition.facts,
    })
  } catch (error) {
    console.error('facts/today failed:', error)
    return res.status(500).json({
      error: error.message || 'Failed to load facts',
    })
  }
}
