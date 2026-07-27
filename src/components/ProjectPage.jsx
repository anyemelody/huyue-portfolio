import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { bySlug } from '../data/projects.js'

export default function ProjectPage() {
  const { slug } = useParams()
  const p = bySlug[slug]

  useEffect(() => { window.scrollTo(0, 0) }, [slug])

  if (!p) {
    return (
      <main className="project-page">
        <div className="wrap" style={{ padding: '140px 0' }}>
          <div className="section-tag mono">404</div>
          <h1 className="section-h">Project not found</h1>
          <Link className="proj-back mono" to="/">← back home</Link>
        </div>
      </main>
    )
  }

  const d = p.detail || {}
  const facts = [d.year, d.location, d.medium, d.client].filter(Boolean).join('  ·  ')
  // full depth -> all images; light -> first 6
  const imgs = p.depth === 'full' ? p.images : p.images.slice(0, 6)

  return (
    <main className="project-page">
      <div className="wrap">
        <Link className="proj-back mono" to="/#journey">← back</Link>

        <header className="proj-head">
          <div className="proj-era mono">{p.era}</div>
          <h1 className="proj-title">{p.name}</h1>
          {facts && <div className="proj-facts mono">{facts}</div>}
          {d.award && <div className="proj-award">{d.award}</div>}
        </header>

        {p.video ? (
          <div className="proj-hero">
            <video src={p.video} controls autoPlay muted loop playsInline
              onError={(e) => { const h = e.currentTarget.closest('.proj-hero'); if (h) h.style.display = 'none' }} />
          </div>
        ) : p.cover ? (
          <div className="proj-hero">
            <img src={p.cover} alt={p.name}
              onError={(e) => { const h = e.currentTarget.closest('.proj-hero'); if (h) h.style.display = 'none' }} />
          </div>
        ) : null}

        <div className="proj-grid">
          <div className="proj-main">
            {d.body && <p className="proj-body" dangerouslySetInnerHTML={{ __html: d.body }} />}
            {d.arch && (
              <pre className="arch" dangerouslySetInnerHTML={{ __html: d.arch }} />
            )}
            {p.story && p.story.split(/\n{2,}/).map((block, i) => {
              if (block.startsWith('### ') || block.startsWith('## ')) {
                // first line = heading, remaining lines = body paragraph
                const isSub = block.startsWith('### ')
                const nl = block.indexOf('\n')
                const head = (nl === -1 ? block : block.slice(0, nl)).slice(isSub ? 4 : 3)
                const rest = nl === -1 ? '' : block.slice(nl + 1).trim()
                return (
                  <div key={i}>
                    {isSub
                      ? <h4 className="proj-h" style={{ fontSize: '0.92em', opacity: 0.88 }}>{head}</h4>
                      : <h3 className="proj-h">{head}</h3>}
                    {rest && <p className="proj-body">{rest}</p>}
                  </div>
                )
              }
              if (block.trim().startsWith('[img:')) {
                const srcs = [...block.matchAll(/\[img:([^\]]+)\]/g)].map((m) => m[1])
                const shot = (src, j) => (
                  <figure className="proj-shot" key={j}>
                    {/\.(mp4|webm)$/i.test(src) ? (
                      <video src={src} autoPlay muted loop playsInline
                        onError={(e) => { const f = e.currentTarget.closest('figure'); if (f) f.style.display = 'none' }} />
                    ) : (
                      <img src={src} alt="" loading="lazy"
                        onError={(e) => { const f = e.currentTarget.closest('figure'); if (f) f.style.display = 'none' }} />
                    )}
                  </figure>
                )
                return srcs.length === 1
                  ? <figure className="proj-shot" key={i} style={{ margin: '18px 0' }}>
                      <img src={srcs[0]} alt="" loading="lazy"
                        onError={(e) => { const f = e.currentTarget.closest('figure'); if (f) f.style.display = 'none' }} />
                    </figure>
                  : <div className="proj-gallery" key={i} style={{ margin: '18px 0' }}>{srcs.map(shot)}</div>
              }
              return <p className="proj-body" key={i}>{block}</p>
            })}
            {Array.isArray(d.metrics) && d.metrics.length > 0 && (
              <div className="metrics">
                {d.metrics.map((m, i) => (
                  <div className="metric" key={i}><div className="v">{m[0]}</div><div className="l">{m[1]}</div></div>
                ))}
              </div>
            )}
          </div>

          <aside className="proj-aside">
            {Array.isArray(d.role) && d.role.length > 0 && (
              <div className="modal-group">
                <span className="modal-label mono">my role</span>
                <div className="modal-chips">{d.role.map((r, i) => <span className="t" key={i}>{r}</span>)}</div>
              </div>
            )}
            {Array.isArray(d.tools) && d.tools.length > 0 && (
              <div className="modal-group">
                <span className="modal-label mono">tools</span>
                <div className="modal-chips">{d.tools.map((t, i) => <span className="t" key={i}>{t}</span>)}</div>
              </div>
            )}
            {d.link && (
              <a className="modal-link mono" href={d.link[1]} target="_blank" rel="noreferrer">{d.link[0]}</a>
            )}
            {Array.isArray(d.links) && d.links.map((l, i) => (
              <a className="modal-link mono" key={i} href={l[1]} target="_blank" rel="noreferrer">{l[0]}</a>
            ))}
          </aside>
        </div>

        {imgs.length > 0 ? (
          <div className="proj-gallery">
            {imgs.map((src, i) => (
              <figure className="proj-shot" key={i}>
                {/\.(mp4|webm)$/i.test(src) ? (
                  <video src={src} autoPlay muted loop playsInline
                    onError={(e) => { const f = e.currentTarget.closest('figure'); if (f) f.style.display = 'none' }} />
                ) : (
                  <img src={src} alt={`${p.name} ${i + 1}`} loading="lazy"
                    onError={(e) => { const f = e.currentTarget.closest('figure'); if (f) f.style.display = 'none' }} />
                )}
              </figure>
            ))}
          </div>
        ) : p.story && p.story.includes('[img:') ? null : (
          <div className="proj-empty mono">
            {p.slug === 'aige' || p.slug === 'sound-viz'
              ? '[ architecture diagram, demo video & screenshots — coming soon ]'
              : '[ images coming soon — add to public/assets ]'}
          </div>
        )}

        {p.depth === 'light' && p.images.length > 6 && (
          <div className="proj-more mono">+ {p.images.length - 6} more on the original project</div>
        )}

        <div className="proj-foot">
          <Link className="proj-back mono" to="/#journey">← back to the journey</Link>
        </div>
      </div>
    </main>
  )
}
