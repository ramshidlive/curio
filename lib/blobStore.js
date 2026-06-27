import { head, list, put } from '@vercel/blob'

const PREFIX = 'facts/'

function pathnameForDate(date) {
  return `${PREFIX}${date}.json`
}

function getBlobToken() {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim()
  if (!token) {
    throw new Error(
      'BLOB_READ_WRITE_TOKEN is missing on this deployment. In Vercel: confirm the variable exists for Production, then Redeploy.',
    )
  }
  return token
}

async function readEditionBlob(blobMeta, token) {
  const response = await fetch(blobMeta.downloadUrl, {
    headers: { authorization: `Bearer ${token}` },
  })
  if (!response.ok) return null
  return response.json()
}

export async function saveEdition(edition) {
  const token = getBlobToken()
  const pathname = pathnameForDate(edition.date)

  const blob = await put(pathname, JSON.stringify(edition), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
    token,
  })

  return blob
}

export async function getEdition(date) {
  const token = getBlobToken()
  const pathname = pathnameForDate(date)

  try {
    const meta = await head(pathname, { token })
    return readEditionBlob(meta, token)
  } catch {
    const { blobs } = await list({ prefix: pathname, limit: 1, token })
    const blob = blobs.find((item) => item.pathname === pathname)
    if (!blob) return null
    return readEditionBlob(blob, token)
  }
}

export async function getLatestEdition() {
  const token = getBlobToken()
  const { blobs } = await list({ prefix: PREFIX, token })
  if (!blobs.length) return null

  const latest = blobs.sort((a, b) =>
    b.pathname.localeCompare(a.pathname),
  )[0]

  return readEditionBlob(latest, token)
}
