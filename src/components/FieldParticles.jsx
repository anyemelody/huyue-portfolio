import { useEffect, useRef } from 'react'

/**
 * FieldParticles — the sculpture's particles, escaped.
 *
 * A fixed, pointer-transparent canvas over the whole page. Three states:
 *   dormant  — while the hero sculpture is on screen the swarm is invisible;
 *              it "lives" inside the sculpture.
 *   cursor   — once the hero scrolls away the particles spill out of the hero's
 *              last position and orbit the pointer with per-particle lag.
 *   attract  — hovering any [data-attract] element pulls them onto its perimeter,
 *              where they travel along the outline as a live highlight.
 *
 * Screen-blended, so it can only lighten the page — no box edge on any ground.
 * Skipped entirely under prefers-reduced-motion and on touch/narrow viewports.
 *
 * Tuning pass (Cowork, per Melody 2026-07-28): smaller sizes, laggier follow
 * (lag .006–.04, damping .9), idle-condense to a small orb (calm factor),
 * attract = no size growth + gentler perimeter wobble (pad 8±3, slower travel).\n * Trail pass 2 (final): orbit 6-42 tight cloud; dots only, no streak rendering.
 */
const R = (a, b) => a + Math.random() * (b - a)

export default function FieldParticles({
  count = 620,
  dim = '#6f6659',
  glowA = '#7fd45a',
  glowB = '#b6f08a',
  hot = '#ffffff'
}) {
  const hostRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(max-width: 760px)').matches || 'ontouchstart' in window) return

    const cv = hostRef.current
    if (!cv) return
    const ctx = cv.getContext('2d')

    let W = 0, H = 0
    const dpr = Math.min(window.devicePixelRatio, 2)
    const resize = () => {
      W = window.innerWidth; H = window.innerHeight
      cv.width = W * dpr; cv.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const P = []
    for (let i = 0; i < count; i++) {
      const r = Math.random()
      P.push({
        x: R(0, W), y: R(0, H), vx: 0, vy: 0,
        ang: R(0, Math.PI * 2), spin: R(0.25, 0.9) * (Math.random() < 0.5 ? -1 : 1),
        orbit: R(6, 42), lag: R(0.004, 0.035), t: R(0, 1),
        size: r > 0.96 ? R(1.1, 1.7) : r > 0.84 ? R(0.8, 1.3) : R(0.45, 0.85),
        color: r > 0.96 ? hot : r > 0.9 ? glowB : r > 0.84 ? glowA : dim,
        bright: r > 0.84,
        alpha: 0
      })
    }

    let mx = W / 2, my = H / 2, hasPointer = false
    let lastMove = 0, calm = 0 // calm→1 when the pointer rests: the swarm condenses
    const onMove = (e) => { mx = e.clientX; my = e.clientY; hasPointer = true; lastMove = performance.now() }
    window.addEventListener('pointermove', onMove, { passive: true })

    let host = null, hostRect = null
    const onOver = (e) => {
      const el = e.target instanceof Element ? e.target.closest('[data-attract]') : null
      if (el !== host) { host = el; hostRect = el ? el.getBoundingClientRect() : null }
    }
    const onOut = (e) => { if (!e.relatedTarget) { host = null; hostRect = null } }
    window.addEventListener('pointerover', onOver, { passive: true })
    window.addEventListener('pointerout', onOut, { passive: true })

    let sculpt = null, presence = 0, seeded = false
    const sculptRect = () => {
      sculpt = sculpt || document.querySelector('.v2-sculpt-mount')
      return sculpt ? sculpt.getBoundingClientRect() : null
    }

    // a point on the host's perimeter, parameterised 0..1 clockwise from top-left
    const perimeter = (r, t, pad) => {
      const w = r.width + pad * 2, h = r.height + pad * 2
      const per = 2 * (w + h)
      let d = ((((t % 1) + 1) % 1)) * per
      const x0 = r.left - pad, y0 = r.top - pad
      if (d < w) return [x0 + d, y0]
      d -= w
      if (d < h) return [x0 + w, y0 + d]
      d -= h
      if (d < w) return [x0 + w - d, y0 + h]
      d -= w
      return [x0, y0 + h - d]
    }

    let raf = 0, last = performance.now()
    const loop = (now) => {
      const dt = Math.min(48, now - last) / 16.7
      last = now

      calm += (((now - lastMove) > 260 ? 1 : 0) - calm) * 0.035 * dt
      const sr = sculptRect()
      const heroVisible = sr ? (sr.bottom > 60 && sr.top < H - 60) : false
      presence += ((heroVisible ? 0 : 1) - presence) * 0.045 * dt

      if (!seeded && presence > 0.02 && sr) {
        for (const p of P) {
          p.x = R(sr.left, sr.right)
          p.y = R(Math.max(sr.top, -H), Math.min(sr.bottom, H * 2))
        }
        seeded = true
      }

      if (host) hostRect = host.getBoundingClientRect()
      if (hostRect && (hostRect.bottom < 0 || hostRect.top > H)) { host = null; hostRect = null }
      const attracting = !!hostRect

      ctx.clearRect(0, 0, W, H)
      ctx.globalCompositeOperation = 'lighter'

      for (const p of P) {
        let tx, ty, k
        if (attracting) {
          p.t += 0.0011 * p.spin * dt
          const [px, py] = perimeter(hostRect, p.t, 8 + Math.sin(p.ang + now / 950) * 3)
          tx = px; ty = py; k = p.lag * 2.6
        } else {
          p.ang += 0.006 * p.spin * dt
          const orb = p.orbit * (1 - calm * 0.72) // at rest: condense to ~28% radius
          tx = mx + Math.cos(p.ang) * orb
          ty = my + Math.sin(p.ang) * orb * 0.62
          k = p.lag
        }
        p.vx += (tx - p.x) * k * dt
        p.vy += (ty - p.y) * k * dt
        p.vx *= 0.9; p.vy *= 0.9
        p.x += p.vx * dt; p.y += p.vy * dt

        const want = presence * (hasPointer || attracting ? 1 : 0.35) * (p.bright ? 1 : 0.5)
        p.alpha += (want - p.alpha) * 0.06 * dt
        if (p.alpha < 0.01) continue

        ctx.globalAlpha = p.alpha
        ctx.fillStyle = p.color
        ctx.shadowBlur = p.bright ? 6 : 0
        if (p.bright) ctx.shadowColor = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.shadowBlur = 0
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      window.removeEventListener('pointerout', onOut)
    }
  }, [count, dim, glowA, glowB, hot])

  return <canvas className="v2-field" ref={hostRef} aria-hidden="true" />
}
