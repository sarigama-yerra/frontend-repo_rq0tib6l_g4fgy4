import { useState } from 'react'
import Header from './components/Header'
import Controls from './components/Controls'
import Graph from './components/Graph'

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function App() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const compute = async (payload) => {
    setLoading(true)
    setMessage('')
    try {
      const res = await fetch(`${BASE_URL}/mma-math`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      setResult(data)
      if (!data.exists) setMessage('No path found within the chosen depth.')
    } catch (e) {
      setMessage('Failed to compute. Check API availability.')
    } finally {
      setLoading(false)
    }
  }

  const seed = async () => {
    setMessage('Seeding sample data...')
    try {
      // Create sample fighters
      const fighters = ['jon jones', 'ciryl gane', 'stipe miocic', 'francis ngannou']
      for (const f of fighters) {
        await fetch(`${BASE_URL}/fighters`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: f })
        })
      }
      // Create sample fights (winner -> loser)
      const fights = [
        { winner: 'jon-jones', loser: 'ciryl-gane', event: 'UFC 285', method: 'Sub' },
        { winner: 'francis-ngannou', loser: 'stipe-miocic', event: 'UFC 260', method: 'KO' },
        { winner: 'stipe-miocic', loser: 'francis-ngannou', event: 'UFC 220', method: 'Decision' },
        { winner: 'jon-jones', loser: 'stipe-miocic', event: 'Hypothetical', method: 'TBD' }
      ]
      for (const fight of fights) {
        await fetch(`${BASE_URL}/fights`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(fight)
        })
      }
      setMessage('Seed complete. Try computing jon-jones -> francis-ngannou with depth 3.')
    } catch (e) {
      setMessage('Seeding failed. Make sure backend is connected to DB.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <main className="max-w-5xl mx-auto p-4 space-y-6">
        <section className="text-center py-6">
          <h2 className="text-3xl font-bold text-gray-800">Build MMA Math Chains</h2>
          <p className="text-gray-600">Show transitive win paths: A beat B, B beat C, so A beats C.</p>
        </section>

        <Controls onCompute={compute} onSeed={seed} />

        {loading && <p className="text-blue-700">Computing...</p>}
        {message && <p className="text-sm text-gray-700">{message}</p>}

        {result && result.exists && (
          <div className="bg-white/80 rounded-xl p-4 shadow space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Result</h3>
            <div className="text-gray-700">
              <p>
                {result.source.name} can reach {result.target.name} via {result.steps.length} step(s):
              </p>
              <ol className="list-decimal ml-6 mt-2 space-y-1">
                {result.steps.map((s, idx) => (
                  <li key={idx}>
                    <span className="font-semibold">{s.winner.name}</span> beat <span className="font-semibold">{s.loser.name}</span>
                    {s.event ? ` at ${s.event}` : ''}
                    {s.method ? ` by ${s.method}` : ''}
                  </li>
                ))}
              </ol>
            </div>
            <Graph steps={result.steps} path={result.path} />
          </div>
        )}
      </main>
    </div>
  )
}

export default App
