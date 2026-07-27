import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { flagships } from '../data/flagships.js'
import PlaceholderThumb from './PlaceholderThumb.jsx'

function Flag({ f }) {
  const ref = useRef()
  const onMove = (e) => {
    const reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches
    const isTouch = window.matchMedia('(max-width:760px)').matches || 'ontouchstart' in window
    if (reduce || isTouch) return
    const el = ref.current
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `rotateY(${px * 6}deg) rotateX(${-py * 6}deg) translateZ(6px)`
  }
  const onLeave = () => { if (ref.current) ref.current.style.transform = '' }

  return (
    <article className="flag" ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}>
      <div className="flag-inner">
        <div className="flag-visual">
          <PlaceholderThumb hue={f.hue} />
          {f.cover && (
            <img className="flag-cover" src={f.cover} alt=""
              onError={(e) => { e.currentTarget.style.display = 'none' }} />
          )}
          <div className="flag-badges">
            {f.badges.map((b, i) => (
              <span key={i} className={'badge ' + b[0]}>{b[1]}</span>
            ))}
          </div>
          {!f.cover && <span className="ph">[ architecture diagram / demo gif ]</span>}
        </div>
        <div className="flag-body">
          <span className="flag-cat">{f.cat}</span>
          <span className="flag-title">{f.title}</span>
          <span className="flag-desc" dangerouslySetInnerHTML={{ __html: f.tagline || f.desc }} />
          <div className="metrics">
            {f.metrics.map((m, i) => (
              <div className="metric" key={i}>
                <div className="v">{m[0]}</div>
                <div className="l">{m[1]}</div>
              </div>
            ))}
          </div>
          <div className="stack">
            {f.stack.map((t, i) => <span className="t" key={i}>{t}</span>)}
          </div>
          <div className="flag-links">
            <Link to={'/work/' + f.slug}>open case ↗</Link>
            {f.links.map((l, i) => <a key={i} href={l[1]}>{l[0]}</a>)}
          </div>
        </div>
      </div>
    </article>
  )
}

export default function HighlightWork() {
  return (
    <section className="highlight panel" id="highlight">
      <div className="wrap">
        <div className="section-tag mono">highlight work · now</div>
        <h2 className="section-h">Two systems I'm building right now</h2>
        <p className="section-sub">
          The current chapter — agentic AI applied to visual &amp; musical creation. Depth over breadth:
          architecture, demo, decisions.
        </p>
        <div className="flag-list">
          {flagships.map((f, i) => <Flag key={i} f={f} />)}
        </div>
      </div>
    </section>
  )
}
