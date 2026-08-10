import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import '../styles.project-slides.css'
import '../styles.project-slides.override.css'

function Media({ src, alt, embed }) {
  if (embed) return <iframe src={embed} title={alt} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
  if (!src) return <div className="ps-media-empty" />
  return /\.(mp4|webm)$/i.test(src)
    ? <video src={src} autoPlay muted loop playsInline aria-label={alt} />
    : <img src={src} alt={alt} loading="eager" />
}

export default function ProjectSlides({ deck }) {
  const scroller = useRef(null)
  const progress = useRef(null)

  useEffect(() => {
    if (scroller.current) scroller.current.scrollTop = 0
  }, [deck.slug])

  useEffect(() => {
    const el = scroller.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    let id = 0
    const update = () => {
      id = 0
      const max = el.scrollHeight - el.clientHeight
      const p = max > 0 ? el.scrollTop / max : 0
      if (progress.current) progress.current.style.transform = `scaleX(${p})`
      el.querySelectorAll('[data-case-slide]').forEach((slide, index, all) => {
        const center = index / Math.max(1, all.length - 1)
        const distance = Math.min(1, Math.abs(p - center) * all.length)
        const visible = Math.max(0, 1 - distance * 1.45)
        slide.style.opacity = visible.toFixed(3)
        slide.style.transform = `translateY(${((1 - visible) * (index < 2 ? 45 : 70)).toFixed(1)}px)`
        slide.style.pointerEvents = visible > .45 ? 'auto' : 'none'
      })
    }
    const onScroll = () => { if (!id) id = requestAnimationFrame(update) }
    update()
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => { cancelAnimationFrame(id); el.removeEventListener('scroll', onScroll) }
  }, [deck])

  return (
    <main className="ps-scroller" ref={scroller}>
      <div className="ps-space" style={{ '--case-slides': 4 + deck.sections.length }}>
        <div className="ps-stage">
          <section className="ps-slide ps-hero" data-case-slide>
            <div className="ps-hero-media"><Media src={deck.video || deck.hero} embed={deck.embed} alt={`${deck.title} video`} /></div>
            <div className="ps-hero-shade" />
            <span className="ps-scroll mono">SCROLL FOR PROJECT DETAILS</span>
          </section>

          <section className="ps-slide ps-overview" data-case-slide>
            <div className="ps-overview-copy"><span className="ps-kicker mono">{deck.kicker}</span><h1 className="ps-overview-title">{deck.title}</h1><p className="ps-lead">{deck.lead}</p><p>{deck.body}</p>{deck.link && <a className="ps-link mono" href={deck.link[1]} target="_blank" rel="noreferrer">{deck.link[0]}</a>}</div>
            <aside className="ps-facts"><div><span className="mono">MY CONTRIBUTIONS</span>{deck.roles.map((role) => <b key={role}>{role}</b>)}</div><div><span className="mono">FACTS</span>{deck.facts.map(([label, value]) => <p key={label}><i>{label}</i><b>{value}</b></p>)}</div></aside>
          </section>

          <section className="ps-slide ps-gallery" data-case-slide>
            <div className="ps-gallery-title"><span className="ps-kicker mono">SELECTED MATERIAL</span><h2>{deck.sectionTitle}<em>{deck.sectionItalic}</em></h2></div>
            <div className="ps-gallery-row">{deck.media.map((src, index) => <figure className={`ps-card ps-card-${index}`} key={src}><Media src={src} alt={`${deck.title} detail ${index + 1}`} /></figure>)}</div>
          </section>

          {deck.sections.map((section, index) => (
            <section className="ps-slide ps-story" data-case-slide key={`${section.title}-${index}`}>
              <div><span className="ps-kicker mono">{String(index + 1).padStart(2, '0')} / {section.archive ? 'VISUAL ARCHIVE' : 'PROCESS NOTES'}</span><h2>{section.title}</h2></div>
              <div className="ps-story-copy"><p>{section.body}</p>{section.media?.length > 0 && <div className="ps-section-media">{section.media.map((src, mediaIndex) => <figure key={src}><Media src={src} alt={`${deck.title} — ${section.title} ${mediaIndex + 1}`} /></figure>)}</div>}</div>
            </section>
          ))}

          <section className="ps-slide ps-next" data-case-slide>
            <div className="ps-project-nav">
              <Link className="ps-project-nav-item ps-project-nav-prev" to={`/work/${deck.previous.slug}`}>
                <span className="ps-kicker mono">PREVIOUS PROJECT</span>
                <strong><b>←</b>{deck.previous.title}</strong>
                <small className="mono">{deck.previous.meta}</small>
              </Link>
              <Link className="ps-project-nav-item ps-project-nav-next" to={`/work/${deck.next.slug}`}>
                <span className="ps-kicker mono">NEXT PROJECT</span>
                <strong>{deck.next.title}<b>→</b></strong>
                <small className="mono">{deck.next.meta}</small>
              </Link>
            </div>
          </section>
        </div>
      </div>
      <div className="ps-hud"><Link to="/" className="ps-brand"><span>Y</span>ue Hu</Link><Link to="/#work" className="mono">← ALL PROJECTS</Link></div>
      <div className="ps-progress"><div ref={progress} /></div>
    </main>
  )
}
