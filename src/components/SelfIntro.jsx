import { useEffect, useState } from 'react'

/**
 * SelfIntro — homepage screen 1 (v3).
 * Three selves, one full-viewport stage: click anywhere (or a chip) to meet
 * the next one. Card stack rotates, glow + accents follow the active tint:
 * sage for the engineer, oncidium gold for drummer / artist.
 */
const STATES = [
  {
    key: 'engineer', label: 'ENGINEER', tint: '#9db08f', kicker: 'BY DAY', tag: 'SELF · 01',
    title: 'An engineer who', italic: 'owns the product.',
    body: 'Nine years of client-facing agency experience, turning ambiguous ideas into shipped systems and products — across AI agents, real-time graphics, and AR/VR.',
    src: '/assets/self/selfie.JPG', pos: '38% 40%'
  },
  {
    key: 'drummer', label: 'MUSICIAN', tint: '#e3b95c', kicker: 'AFTER HOURS', tag: 'SELF · 02',
    title: 'Keeping time,', italic: 'making noise.',
    body: 'Drummer of Di Band, an indie rock band focused on writing and performing original songs.',
    src: '/assets/self/drum_cover.JPG', pos: '50% 38%'
  },
  {
    key: 'artist', label: 'ARTIST', tint: '#e3b95c', kicker: 'ALL ALONG', tag: 'SELF · 03',
    title: 'Pictures that', italic: 'behave.',
    body: 'Obsessed with generative art, VJing, and live performance — making systems that move, respond, and take on a life of their own.',
    src: '/assets/self/Rain_Rite_Performance.JPG', pos: '50% 42%'
  }
]

export default function SelfIntro() {
  const [i, setI] = useState(0)
  const S = STATES[i]
  const next = () => setI((i + 1) % 3)

  // Let the three identities introduce themselves when the visitor is idle.
  // Any click changes `i`, which restarts the five-second idle window.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const timer = window.setInterval(() => {
      if (!document.hidden) next()
    }, 5000)
    return () => window.clearInterval(timer)
  }, [i])

  return (
    <section className="v3-intro" onClick={next}>
      <div className="v3-intro-glow" style={{ background: `radial-gradient(ellipse 70% 60% at 62% 46%, ${S.tint}14 0%, transparent 66%)` }} />
      <div className="v3-intro-stage">
        <div className="v3-intro-cards">
          {STATES.map((s, n) => (
            <div key={s.key} className="v3-intro-card" style={{
              opacity: n === i ? 1 : 0,
              transform: n === i ? 'translateY(0) rotate(0deg)' : n === (i + 1) % 3 ? 'translateY(26px) rotate(2.5deg)' : 'translateY(-26px) rotate(-2.5deg)'
            }}>
              <div style={{ width: '100%', height: '100%', backgroundImage: `url(${s.src})`, backgroundSize: 'cover', backgroundPosition: s.pos }} />
            </div>
          ))}
        </div>
        <div className="v3-intro-copy">
          <div className="mono v3-intro-kicker" data-home-reveal="1" style={{ color: S.tint }}>{S.kicker}</div>
          <div className="v3-intro-title" data-home-reveal="1">{S.title}</div>
          <div className="v3-intro-italic" data-home-reveal="1" style={{ color: S.tint }}>{S.italic}</div>
          <p className="v3-intro-body" data-home-reveal="1">{S.body}</p>
          <div className="v3-intro-chips">
            {STATES.map((s, n) => (
              <button key={s.key} type="button"
                onClick={(e) => { e.stopPropagation(); setI(n) }}
                className="mono"
                style={n === i
                  ? { borderColor: s.tint, background: s.tint + '1e', color: s.tint }
                  : { borderColor: 'rgba(237,231,221,0.25)', background: 'transparent', color: 'var(--v2-soft)' }}>
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="mono v3-intro-hint">SCROLL TO EXPLORE NEXT</div>
    </section>
  )
}
