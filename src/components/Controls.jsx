import { useState } from 'react'

export default function Controls({ onCompute, onSeed }) {
  const [source, setSource] = useState('jon-jones')
  const [target, setTarget] = useState('ciryl-gane')
  const [maxDepth, setMaxDepth] = useState(4)

  const handleSubmit = (e) => {
    e.preventDefault()
    onCompute({ source, target, max_depth: Number(maxDepth) })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur rounded-xl p-4 shadow flex flex-col gap-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-sm text-gray-600">From (A)</label>
          <input value={source} onChange={e=>setSource(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" placeholder="source slug e.g. jon-jones" />
        </div>
        <div>
          <label className="text-sm text-gray-600">To (C)</label>
          <input value={target} onChange={e=>setTarget(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" placeholder="target slug e.g. ciryl-gane" />
        </div>
        <div>
          <label className="text-sm text-gray-600">Max Depth</label>
          <input type="number" min="1" max="6" value={maxDepth} onChange={e=>setMaxDepth(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" />
        </div>
      </div>
      <div className="flex gap-2">
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2">Compute MMA Math</button>
        <button type="button" onClick={onSeed} className="bg-gray-700 hover:bg-gray-800 text-white rounded px-4 py-2">Seed Sample Data</button>
      </div>
    </form>
  )
}
