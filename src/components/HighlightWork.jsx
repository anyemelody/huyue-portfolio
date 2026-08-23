import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

const SELECTED_PROJECTS = [
  { slug: 'tiktok-effect-house', title: 'TikTok Effect House', meta: '2021 — PRESENT · TIKTOK · AR AUTHORING TOOL', image: '/assets/era/effect-house.gif' },
  { slug: 'hershey-pop-kisses', title: 'Hershey Pop Kiss Studio', meta: '2017 · HAVAS · DAYDREAM VR INSTALLATION', image: '/assets/era/hershey.png' },
  { slug: 'ibm-watson', title: 'IBM Watson Holobot', meta: '2018 · HAVAS · AR STORYTELLING', image: '/assets/era/ibm-watson.png' },
  { slug: 'vuse-unboxing-ar', title: 'VUSE Alto Unboxing', meta: '2018 · HAVAS · MOBILE AR', image: '/assets/era/vuse.png' },
  { slug: 'palace-museum', title: 'The Palace Museum Interactive Installation', meta: '2019 · BEIJING PALACE MUSEUM · INTERACTIVE INSTALLATION', image: '/assets/era/palace_museum.gif' },
  { slug: 'santander', title: "Santander — In Someone Else's Shoes", meta: '2018 · WEBBY 2019 · VOLUMETRIC AR', image: '/assets/era/santander.jpg' },
]

/**
 * HighlightWork (v3) — giant section title, then two staggered highlights.
 * AIGE: cover fills the left half, title + three keyword rows on the right.
 * Rain Rite: nudged right and down (diagonal composition), text left,
 * and a single live-performance still on the right.
 * Both media blocks zoom gently as they travel up the viewport (Lusion-style)
 * and click through to the case page.
 */
export default function HighlightWork() {
  const feature = useRef(null)

  useEffect(() => {
    let ticking = false
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
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
        document.querySelectorAll('[data-unveil]').forEach((el) => {
          const r = el.getBoundingClientRect()
          const entering = Math.min(1, Math.max(0, (vh - r.top) / Math.max(1, vh * 0.52)))
          const leaving = Math.min(1, Math.max(0, r.bottom / Math.max(1, vh * 0.42)))
          const raw = reducedMotion ? 1 : Math.min(entering, leaving)
          const delay = Number(el.dataset.unveilDelay || 0)
          const p = Math.min(1, Math.max(0, (raw - delay) / (1 - delay)))
          const tween = p * p * (3 - 2 * p)
          el.style.opacity = tween.toFixed(3)
          el.style.transform = el.dataset.unveil === 'card'
            ? 'none'
            : `translateY(${((1 - tween) * 54).toFixed(1)}px)`
          el.style.clipPath = el.dataset.unveil === 'card'
            ? 'none'
            : `inset(${((1 - tween) * 100).toFixed(1)}% 0 0 0)`
          const cover = el.querySelector('.v3-selected-cover')
          if (cover) {
            const inset = ((1 - tween) * 50).toFixed(1)
            cover.style.clipPath = `inset(${inset}% ${inset}% ${inset}% ${inset}%)`
          }
          const image = el.querySelector('.v3-selected-cover img')
          if (image) image.style.setProperty('--unveil-image-scale', (0.92 + tween * 0.08).toFixed(3))
          el.querySelectorAll('[data-unveil-char]').forEach((char, index) => {
            const letterP = Math.min(1, Math.max(0, (p - index * 0.028) / 0.34))
            char.style.opacity = letterP.toFixed(3)
            char.style.transform = `translateY(${((1 - letterP) * 18).toFixed(1)}px)`
          })
        })
        const featureEl = feature.current
        if (featureEl && !reducedMotion) {
          const r = featureEl.getBoundingClientRect()
          const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - vh)))
          const media = featureEl.querySelector('[data-feature-media]')
          const copy = featureEl.querySelector('[data-feature-copy]')
          if (media) {
            // Start on the shared 8vw image grid used by the intro.
            const offset = -(1 - p) * Math.min(window.innerWidth * 0.21, 310)
            media.style.transform = `translate(-50%, -50%) translateX(${offset.toFixed(1)}px) scale(${(0.76 + p * 0.32).toFixed(3)})`
          }
          if (copy) {
            copy.style.opacity = (1 - Math.min(1, p * 1.45)).toFixed(3)
            copy.style.transform = `translateY(${(-p * 30).toFixed(1)}px)`
          }
        }
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className="v3-work" id="work">
      <div className="v3-sec-head">
        <div className="mono v3-sec-meta" data-home-reveal="1"><span>02</span></div>
        <h2 className="v3-giant v3-giant-sage" data-home-reveal="1">Highlight<br />Projects</h2>
      </div>

      <article className="v3-feature-takeover" ref={feature}>
        <div className="v3-feature-stage">
          <div className="v3-feature-copy" data-feature-copy="1">
            <div className="mono v2-flag-meta" data-home-reveal="1">
              <span className="hot">01</span>
              <span>2024 — PRESENT</span>
              <span>BYTEDANCE / TIKTOK</span>
              <span className="hot push">SHIPPED</span>
            </div>
            <div className="v3-flag-side">
              <div>
                <h3 data-home-reveal="1">AI Generate Effects</h3>
                <p className="v2-flag-line" data-home-reveal="1">Turn a written idea into a runnable TikTok AR effect — ready to customize, publish, and share.</p>
              </div>
              <div className="v3-feature-keywords mono" data-home-reveal="1">
                <span>AGENTIC AI</span>
                <span>AR AUTHORING</span>
              </div>
              <span className="mono v3-feature-scroll-hint" data-home-reveal="1">CLICK THE IMAGE TO ENTER THE CASE STUDY</span>
            </div>
          </div>
          <Link to="/work/aige" data-zoom="1" data-feature-media="1" className="v2-well v3-flag-cover" aria-label="AI Generate Effects — case study">
            <img src="/assets/aige/cover_image.gif" alt="AI Generate Effects — TikTok Effect House case study" />
          </Link>
        </div>
      </article>

      <article className="v3-flag-second">
        <div className="v2-flag-body">
          <div className="mono v2-flag-meta"><span className="hot">02</span><span>2025</span><span>INDEPENDENT · CICA, NY</span></div>
          <div>
            <h3>Rain Rite</h3>
            <p className="v2-flag-line">live performance in motion</p>
          </div>
          <div className="v2-chips mono">
            <span>LIVE PERFORMANCE</span>
            <span>CICA, NY</span>
            <span>VISUAL ART JOURNAL</span>
          </div>
          <span className="v2-case-link mono">ENTER THE PROJECT →</span>
        </div>
        <Link to="/work/rain-rite" data-zoom="1" className="v2-well v3-rain-rite-cover" aria-label="Rain Rite — project page">
          <img src="/assets/rain-rite/cover.png" alt="Rain Rite live performance" />
        </Link>
      </article>

      <div className="v3-selected-head" data-unveil="heading">
        <span className="mono v3-unveil-title" aria-label="Selected Shipped Work">
          {'SELECTED SHIPPED WORK'.split('').map((character, index) => (
            <span data-unveil-char="1" aria-hidden="true" key={`${character}-${index}`}>{character === ' ' ? '\u00a0' : character}</span>
          ))}
        </span>
        <p>AR creation tools, immersive retail and brand experiences — built from interaction concept through real-time implementation.</p>
      </div>
      <div className="v3-selected-grid">
        {SELECTED_PROJECTS.map((project, index) => (
          <Link to={`/work/${project.slug}`} className="v3-selected-card" data-unveil="card" data-unveil-delay={(index * 0.09).toFixed(2)} key={project.slug}>
            <div className="v2-well v3-selected-cover">
              <img src={project.image} alt={project.title} loading={index < 2 ? 'eager' : 'lazy'} />
            </div>
            <div className="mono v3-selected-meta" data-home-reveal="1">{project.meta}</div>
            <h3 data-home-reveal="1">{project.title}</h3>
            <span className="mono v3-selected-link" data-home-reveal="1">READ THE CASE STUDY →</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
