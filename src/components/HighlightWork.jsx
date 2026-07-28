import { Link } from 'react-router-dom'
import { useRef } from 'react'

/**
 * HighlightWork (v2 / "5A") — keywords only, detail lives on the case page.
 *
 * AIGE runs full width with a three-column keyword strip under its cover;
 * Sound Visualization is half width with a 2x2 video grid that plays one clip
 * at rest and all four on hover.
 * Both <article>s carry data-attract, so FieldParticles rings them on hover.
 */
export default function HighlightWork() {
  const grid = useRef(null)
  const playAll = () => grid.current?.querySelectorAll('video')
    .forEach((v) => v.play?.().catch(() => {}))
  const playOne = () => grid.current?.querySelectorAll('video')
    .forEach((v, i) => { if (i) v.pause?.() })

  return (
    <section className="v2-work" id="highlight">
      <div className="v2-sec-head">
        <h2>SELECTED WORK</h2>
        <span>02 PROJECTS</span>
      </div>

      <article className="v2-flag-lead" data-attract="aige">
        <div className="v2-flag-meta">
          <span className="hot">01</span>
          <span>2024 — PRESENT</span>
          <span>BYTEDANCE / TIKTOK</span>
          <span className="hot push">SHIPPED</span>
        </div>
        <h3>Create with AI</h3>
        <p className="v2-flag-line">an idea, typed — an AR effect, running</p>
        <div className="v2-well v2-flag-cover">
          <img src="/assets/aige/select_or_type_prompt.png"
            alt="Create with AI — typing an effect idea" />
        </div>
        <div className="v2-keys">
          <div><span>ARCHITECTURE</span><strong>LLM plans, code executes</strong></div>
          <div><span>DECOMPOSITION</span><strong>Human · Screen · World</strong></div>
          <div><span>GROUNDING</span><strong>Hierarchical RAG + MCP</strong></div>
        </div>
        <Link className="v2-case-link" to="/work/aige">READ THE CASE STUDY →</Link>
      </article>

      <article className="v2-flag-second" data-attract="sound-viz">
        <div className="v2-flag-body">
          <div className="v2-flag-meta">
            <span className="hot">02</span>
            <span>2026</span>
            <span>SOLO · IN PROGRESS</span>
          </div>
          <div>
            <h3>Sound Visualization</h3>
            <p className="v2-flag-line">agents propose, humans commit</p>
          </div>
          <div className="v2-chips">
            <span>ONE PROMPT → FOUR CANDIDATES</span>
            <span>MUTATE / BREED / LOCK</span>
            <span>LIVE MIC · STAGE PROJECTION</span>
          </div>
          <Link className="v2-case-link" to="/work/sound-viz">READ THE CASE STUDY →</Link>
        </div>
        <div className="v2-vfx" ref={grid} onMouseEnter={playAll} onMouseLeave={playOne}>
          {['effect-01', 'effect-02', 'effect-03', 'effect-04'].map((n, i) => (
            <div className="v2-well" key={n}>
              <video src={`/assets/sound-viz/${n}.mp4`}
                autoPlay={i === 0} loop muted playsInline />
            </div>
          ))}
        </div>
      </article>
    </section>
  )
}
