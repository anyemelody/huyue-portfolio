import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

/**
 * HighlightWork (v3) — giant section title, then two staggered flagships.
 * AIGE: cover fills the left half, title + three keyword rows on the right.
 * Sound Viz: nudged right and down (diagonal composition), text left,
 * 2×2 video grid right — one clip at rest, all four on hover.
 * Both media blocks zoom gently as they travel up the viewport (Lusion-style)
 * and click through to the case page.
 */
export default function HighlightWork() {
  const grid = useRef(null)
  const playAll = () => grid.current?.querySelectorAll('video').forEach((v) => v.play?.().catch(() => {}))
  const playOne = () => grid.current?.querySelectorAll('video').forEach((v, i) => { if (i) v.pause?.() })

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        ticking = false
        const vh = window.innerHeight
        document.querySelectorAll('[data-zoom]').forEach((el) => {
          const r = el.getBoundingClientRect()
          if (r.bottom < 0 || r.top > vh) return
          const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)))
          const target = el.querySelector('img') || el
          target.style.transform = `scale(${(1 + 0.1 * p).toFixed(4)})`
        })
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className="v3-work" id="work">
      <div className="v3-sec-head">
        <div className="mono v3-sec-meta"><span>02</span><span>02 PROJECTS</span></div>
        <h2 className="v3-giant">Highlight<br />Projects</h2>
      </div>

      <article className="v3-flag-lead">
        <div className="mono v2-flag-meta">
          <span className="hot">01</span>
          <span>2024 — PRESENT</span>
          <span>BYTEDANCE / TIKTOK</span>
          <span className="hot push">SHIPPED</span>
        </div>
        <div className="v3-flag-grid">
          <Link to="/work/aige" data-zoom="1" className="v2-well v3-flag-cover" aria-label="Create with AI — case study">
            <img src="/assets/aige/select_or_type_prompt.png" alt="Create with AI — typing an effect idea" />
          </Link>
          <div className="v3-flag-side">
            <div>
              <h3>Create with AI</h3>
              <p className="v2-flag-line">an idea, typed — an AR effect, running</p>
            </div>
            <div className="v3-keys">
              <div><span className="mono">ARCHITECTURE</span><strong>LLM plans, code executes</strong></div>
              <div><span className="mono">DECOMPOSITION</span><strong>Human · Screen · World</strong></div>
              <div><span className="mono">GROUNDING</span><strong>Hierarchical RAG + MCP</strong></div>
            </div>
            <Link className="v2-case-link mono" to="/work/aige">READ THE CASE STUDY →</Link>
          </div>
        </div>
      </article>

      <article className="v3-flag-second">
        <div className="v2-flag-body">
          <div className="mono v2-flag-meta"><span className="hot">02</span><span>2026</span><span>SOLO · IN PROGRESS</span></div>
          <div>
            <h3>Sound Visualization</h3>
            <p className="v2-flag-line">agents propose, humans commit</p>
          </div>
          <div className="v2-chips mono">
            <span>ONE PROMPT → FOUR CANDIDATES</span>
            <span>MUTATE / BREED / LOCK</span>
            <span>LIVE MIC · STAGE PROJECTION</span>
          </div>
          <Link className="v2-case-link mono" to="/work/sound-viz">READ THE CASE STUDY →</Link>
        </div>
        <Link to="/work/sound-viz" data-zoom="1" className="v2-vfx" ref={grid}
          onMouseEnter={playAll} onMouseLeave={playOne} aria-label="Sound Visualization — case study">
          {['effect-01', 'effect-02', 'effect-03', 'effect-04'].map((n, i) => (
            <div className="v2-well" key={n}>
              <video src={`/assets/sound-viz/${n}.mp4`} autoPlay={i === 0} loop muted playsInline />
            </div>
          ))}
        </Link>
      </article>
    </section>
  )
}
