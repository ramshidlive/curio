/**
 * Upload manual facts from src/data.js to Vercel Blob.
 *
 * Usage:
 *   vercel env pull .env.local
 *   node scripts/seed-blob.mjs
 */

import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { config } from 'dotenv'
import { del, list, put } from '@vercel/blob'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
config({ path: join(root, '.env.local') })

const PREFIX = 'facts/'

function getEditionDate(timezone = process.env.CURIO_TIMEZONE || 'UTC') {
  return new Intl.DateTimeFormat('en-CA', { timeZone: timezone }).format(
    new Date(),
  )
}

async function main() {
  const rawToken = process.env.BLOB_READ_WRITE_TOKEN
  const token = rawToken?.trim()

  if (!token) {
    const pulledButEmpty =
      rawToken === '' ||
      rawToken === '""' ||
      (typeof rawToken === 'string' && rawToken.length === 0)

    console.error('Missing BLOB_READ_WRITE_TOKEN.')
    console.error('')
    if (pulledButEmpty) {
      console.error(
        'vercel env pull left BLOB_READ_WRITE_TOKEN empty — linked Blob tokens are often not copied locally.',
      )
      console.error('')
      console.error('Paste the token manually into .env.local:')
      console.error('  Vercel → curio → Settings → Environment Variables')
      console.error('  → BLOB_READ_WRITE_TOKEN → reveal → copy value')
      console.error('')
      console.error('Or from Storage → curio-blob → Quickstart → copy BLOB_READ_WRITE_TOKEN')
      console.error('')
    }
    console.error('Easiest: seed on production (token already on the server):')
    console.error('  curl -X POST https://curio-teal.vercel.app/api/cron/seed-edition \\')
    console.error('    -H "Authorization: Bearer YOUR_CRON_SECRET"')
    console.error('')
    console.error('Get CRON_SECRET from the same Environment Variables page.')
    process.exit(1)
  }

  const dataPath = join(root, 'src/data.js')
  const module = await import(dataPath)
  const facts = module.facts

  const editionDate = getEditionDate()
  const edition = {
    date: editionDate,
    createdAt: new Date().toISOString(),
    facts,
  }

  const { blobs } = await list({ prefix: PREFIX, token })
  if (blobs.length) {
    console.log(`Deleting ${blobs.length} existing edition(s)...`)
    await del(blobs.map((blob) => blob.url), { token })
  }

  const pathname = `${PREFIX}${editionDate}.json`
  const blob = await put(pathname, JSON.stringify(edition), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
    token,
  })

  console.log(`Seeded ${facts.length} facts for ${editionDate}`)
  console.log(blob.url)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
