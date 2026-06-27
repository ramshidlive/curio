import Header from './components/Header'
import FactFeed from './components/FactFeed'
import { useFacts } from './hooks/useFacts'

export default function App() {
  const { facts, editionDate, loading, error, isMock } = useFacts()

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-xl px-4 py-12 sm:px-6">
        <Header />
        {loading ? (
          <p className="pt-10 text-center text-sm text-stone-500">
            Loading today&apos;s facts…
          </p>
        ) : error ? (
          <p className="pt-10 text-center text-sm text-stone-500">{error}</p>
        ) : (
          <>
            {editionDate && editionDate !== 'dev' && (
              <p className="pt-6 text-center text-xs text-stone-400">
                Edition · {editionDate}
              </p>
            )}
            {isMock && import.meta.env.DEV && (
              <p className="pt-2 text-center text-xs text-stone-400">
                Local mock data (API not available)
              </p>
            )}
            <FactFeed facts={facts} />
          </>
        )}
      </main>
    </div>
  )
}
