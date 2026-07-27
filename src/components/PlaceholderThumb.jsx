import { useRef, useEffect } from 'react'

// Generative gradient + node-graph placeholder. Replace with real <img>/<video> later.
export default function PlaceholderThumb({ hue = 260 }) {
  const ref = useRef()
  useEffect(() => {
    const cv = ref.current
    if (!cv) return
    const r = cv.getBoundingClientRect()
    cv.width = Math.max(300, r.width || 320)
    cv.height = Math.max(180, r.height || 200)
    const ctx = cv.getContext('2d')
    ctx.fillStyle = '#0e0e15'
    ctx.fillRect(0, 0, cv.width, cv.height)
    const g = ctx.createLinearGradient(0, 0, cv.width, cv.height)
    g.addColorStop(0, `hsla(${hue},70%,55%,.24)`)
    g.addColorStop(1, `hsla(${(hue + 50) % 360},70%,45%,.10)`)
    ctx.fillStyle = g
    ctx.fillRect(0, 0, cv.width, cv.height)
    const pts = []
    const n = 7
    for (let i = 0; i < n; i++) pts.push([Math.random() * cv.width, Math.random() * cv.height])
    ctx.strokeStyle = `hsla(${hue},80%,70%,.30)`
    ctx.lineWidth = 1
    for (let i = 0; i < n; i++)
      for (let j = i + 1; j < n; j++)
        if (Math.random() < 0.4) {
          ctx.beginPath()
          ctx.moveTo(pts[i][0], pts[i][1])
          ctx.lineTo(pts[j][0], pts[j][1])
          ctx.stroke()
        }
    pts.forEach((p) => {
      ctx.beginPath()
      ctx.fillStyle = `hsla(${hue},85%,72%,.9)`
      ctx.arc(p[0], p[1], 3.2, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.fillStyle = `hsla(${hue},85%,72%,.13)`
      ctx.arc(p[0], p[1], 10, 0, Math.PI * 2)
      ctx.fill()
    })
  }, [hue])
  return <canvas ref={ref} className="thumbph" />
}
