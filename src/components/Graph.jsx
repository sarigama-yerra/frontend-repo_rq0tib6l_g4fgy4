import { useEffect, useMemo, useRef } from 'react'

// Simple force layout using canvas for performance
export default function Graph({ steps, path }) {
  const canvasRef = useRef(null)

  const nodes = useMemo(() => {
    const uniques = Array.from(new Set(path || []))
    return uniques.map((slug, idx) => ({ id: slug, x: 80 + idx * 160, y: 120 }))
  }, [path])

  const nodeIndex = useMemo(() => Object.fromEntries(nodes.map((n, i) => [n.id, i])), [nodes])

  const links = useMemo(() => {
    return (steps || []).map(s => ({ source: s.winner.slug, target: s.loser.slug }))
  }, [steps])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height
    ctx.clearRect(0, 0, width, height)

    // Draw links
    ctx.strokeStyle = '#93c5fd'
    ctx.lineWidth = 2
    links.forEach(l => {
      const a = nodes[nodeIndex[l.source]]
      const b = nodes[nodeIndex[l.target]]
      if (!a || !b) return
      drawArrow(ctx, a.x, a.y, b.x, b.y)
    })

    // Draw nodes
    nodes.forEach((n) => {
      ctx.fillStyle = '#1d4ed8'
      ctx.beginPath()
      ctx.arc(n.x, n.y, 18, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#fff'
      ctx.font = '12px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      const label = n.id.replaceAll('-', ' ')
      ctx.fillText(label, n.x, n.y - 28)
    })
  }, [nodes, links, nodeIndex])

  return (
    <div className="w-full overflow-x-auto">
      <canvas ref={canvasRef} width={Math.max(360, (nodes.length) * 160)} height={240} className="rounded border" />
      <p className="text-xs text-gray-500 mt-2">Arrows go from winner to loser</p>
    </div>
  )
}

function drawArrow(ctx, x1, y1, x2, y2) {
  const headlen = 10
  const dx = x2 - x1
  const dy = y2 - y1
  const angle = Math.atan2(dy, dx)
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(x2, y2)
  ctx.lineTo(x2 - headlen * Math.cos(angle - Math.PI / 6), y2 - headlen * Math.sin(angle - Math.PI / 6))
  ctx.lineTo(x2 - headlen * Math.cos(angle + Math.PI / 6), y2 - headlen * Math.sin(angle + Math.PI / 6))
  ctx.lineTo(x2, y2)
  ctx.fillStyle = '#93c5fd'
  ctx.fill()
}
