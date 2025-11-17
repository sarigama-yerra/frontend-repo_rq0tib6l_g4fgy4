import { useEffect, useState } from 'react'

export default function Header() {
  const [backendUrl, setBackendUrl] = useState('')
  useEffect(() => {
    setBackendUrl(import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000')
  }, [])
  return (
    <header className="w-full border-b bg-white/70 backdrop-blur sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-blue-600 text-white grid place-items-center font-bold">M</div>
          <h1 className="text-xl font-bold text-gray-800">MMA Math Visualizer</h1>
        </div>
        <div className="text-xs text-gray-500">API: {backendUrl}</div>
      </div>
    </header>
  )
}
