import { list, put } from '@vercel/blob'

const PREFIX = 'facts/'

function pathnameForDate(date) {
  return `${PREFIX}${date}.json`
}

export async function saveEdition(edition) {
  const pathname = pathnameForDate(edition.date)
  const blob = await put(pathname, JSON.stringify(edition), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
  })
  return blob
}

export async function getEdition(date) {
  const pathname = pathnameForDate(date)
  const { blobs } = await list({ prefix: pathname, limit: 1 })
  const blob = blobs.find((item) => item.pathname === pathname)
  if (!blob) return null

  const response = await fetch(blob.url)
  if (!response.ok) return null
  return response.json()
}

export async function getLatestEdition() {
  const { blobs } = await list({ prefix: PREFIX })
  if (!blobs.length) return null

  const latest = blobs.sort((a, b) =>
    b.pathname.localeCompare(a.pathname),
  )[0]

  const response = await fetch(latest.url)
  if (!response.ok) return null
  return response.json()
}
