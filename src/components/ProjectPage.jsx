import { useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { bySlug } from '../data/projects.js'

function TikTokEffectHouseCase({ p }) {
  const rail = useRef(null)
  const d = p.detail || {}
  const media = [p.cover, ...(p.images || [])].filter(Boolean)

  useEffect(() => {
    const el = rail.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    let frame = 0
    const update = () => {
      frame = 0
      const box = el.getBoundingClientRect()
      const progress = Math.min(1, Math.max(0, -box.top / Math.max(1, box.height - window.innerHeight)))
      el.style.setProperty('--tiktok-rail-progress', progress.toFixed(4))
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <main className="tiktok-case">
      <div className="tiktok-case-topline mono">
        <Link to="/#work">← back to selected work</Link>
        <span>CASE STUDY / 2021 — PRESENT</span>
      </div>

      <section className="tiktok-case-hero">
        <div className="tiktok-case-hero-copy">
          <span className="mono">TIKTOK / AR AUTHORING PLATFORM</span>
          <h1>Effect<br /><em>House.</em></h1>
          <p>Create, publish, and share augmented-reality effects for TikTok.</p>
        </div>
        <div className="tiktok-case-video">
          <iframe src={d.videoEmbed} title="TikTok Effect House video" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
        </div>
      </section>

      <section className="tiktok-case-intro">
        <p>{d.body}</p>
        <div className="tiktok-case-facts mono">
          <span>CLIENT / TIKTOK</span><span>LOCATION / SAN JOSE</span><span>ROLE / PRODUCT + CREATIVE TECHNOLOGY</span>
        </div>
        <a className="tiktok-case-link mono" href="https://effecthouse.tiktok.com/" target="_blank" rel="noreferrer">TRY EFFECT HOUSE ↗</a>
      </section>

      <section className="tiktok-rail" ref={rail}>
        <div className="tiktok-rail-stage">
          <div className="tiktok-rail-track">
            <article className="tiktok-rail-panel tiktok-rail-panel--text">
              <div className="mono tiktok-rail-index">01 / PROJECT OBJECTIVE</div>
              <div>
                <h2>More ways to<br /><em>make effects.</em></h2>
                <p>Effect House opens TikTok’s effects universe to creators, designers, and developers — making Community Effects possible without a traditional production pipeline.</p>
              </div>
            </article>
            <article className="tiktok-rail-panel">
              <div className="tiktok-rail-visual"><img src={media[1] || media[0]} alt="Effect House template example" /></div>
              <div className="tiktok-rail-copy">
                <div className="mono tiktok-rail-index">02 / TEMPLATE PRODUCTION</div>
                <h2>Ideas that<br /><em>ship.</em></h2>
                <p>I led the Template Team, turning new product capabilities and trends into inspiring, production-ready effects — plus tutorials and live education to help creators use them.</p>
                <div className="tiktok-case-metrics"><span><b>120+</b> templates delivered</span><span><b>40%</b> effect conversion</span></div>
              </div>
            </article>
            <article className="tiktok-rail-panel">
              <div className="tiktok-rail-copy">
                <div className="mono tiktok-rail-index">03 / GRAPH PRODUCTION</div>
                <h2>Visual logic,<br /><em>made legible.</em></h2>
                <p>Graph is a node-based coding system for building visual and interactive effects. I researched, designed, prototyped, and shipped nodes — including their inputs, outputs, demos, and creator documentation.</p>
                <div className="tiktok-case-tags mono"><span>NODE DESIGN</span><span>PROTOTYPING</span><span>DOCUMENTATION</span></div>
              </div>
              <div className="tiktok-rail-visual"><img src={media[8] || media[2] || media[0]} alt="Effect House graph interface" /></div>
            </article>
            <article className="tiktok-rail-panel">
              <div className="tiktok-rail-visual"><img src={media[12] || media[3] || media[0]} alt="Effect House material graph node" /></div>
              <div className="tiktok-rail-copy">
                <div className="mono tiktok-rail-index">04 / SCREEN ART NODES</div>
                <h2>Effects as<br /><em>a language.</em></h2>
                <p>I designed screen-effect nodes across three families: transitions for property animation, 2D SDF shape generation, and packaged effects such as dissolve, blur, edge detection, and math-art functions.</p>
                <div className="tiktok-case-tags mono"><span>TRANSITION</span><span>2D SDF</span><span>EFFECT</span></div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <footer className="tiktok-case-footer">
        <span className="mono">TIKTOK EFFECT HOUSE / 2021 — PRESENT</span>
        <Link className="mono" to="/#work">BACK TO SELECTED WORK ↑</Link>
      </footer>
    </main>
  )
}

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
  const legacyVideo = d.videoEmbed
  // full depth -> all images; light -> first 6
  const imgs = p.depth === 'full' ? p.images : p.images.slice(0, 6)

  if (slug === 'tiktok-effect-house') return <TikTokEffectHouseCase p={p} />

  return (
    <main className="project-page">
      <div className="wrap project-wrap">
        <div className="proj-topline mono">
          <Link className="proj-back" to="/#work">← back to selected work</Link>
          <span>CASE STUDY / {p.era}</span>
        </div>

        <header className="proj-head">
          <div className="proj-era mono">SELECTED SHIPPED WORK</div>
          <h1 className="proj-title">{p.name}</h1>
          {facts && <div className="proj-facts mono">{facts}</div>}
          {d.award && <div className="proj-award">{d.award}</div>}
        </header>

        {legacyVideo ? (
          <div className="proj-hero proj-legacy-video">
            <iframe src={legacyVideo} title={`${p.name} video`} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
          </div>
        ) : p.video ? (
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
            {(d.body || p.story) && <div className="proj-section-label mono">PROJECT OVERVIEW</div>}
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
          <Link className="proj-back mono" to="/#work">← back to highlights</Link>
        </div>
      </div>
    </main>
  )
}
