import { useEffect, useState } from 'react'
import { facts as mockFacts } from '../data.js'

export function useFacts() {
  const [facts, setFacts] = useState([])
  const [editionDate, setEditionDate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isMock, setIsMock] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadFacts() {
      try {
        const response = await fetch('/api/facts/today')

        if (!response.ok) {
          throw new Error('No edition available')
        }

        const data = await response.json()
        if (cancelled) return

        setFacts(data.facts ?? [])
        setEditionDate(data.date)
        setIsMock(false)
        setError(null)
      } catch (fetchError) {
        if (cancelled) return

        if (import.meta.env.DEV) {
          setFacts(mockFacts)
          setEditionDate('dev')
          setIsMock(true)
          setError(null)
        } else {
          setFacts([])
          setError(fetchError.message || 'Failed to load facts')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadFacts()
    return () => {
      cancelled = true
    }
  }, [])

  return { facts, editionDate, loading, error, isMock }
}
