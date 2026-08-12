import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import '../styles.project-hscroll.css'
import '../styles.project-hscroll.override.css'

function Media({ src, embed, alt }) {
  if (embed) return <iframe src={embed} title={alt} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
  if (!src) return <div className="ph-empty" />
  return /\.(mp4|webm|mov)$/i.test(src)
    ? <video src={src} autoPlay muted loop playsInline aria-label={alt} />
    : <img src={src} alt={alt} loading="lazy" />
}

export default function ProjectHScroll({ deck }) {
  const scroller = useRef(null)
  const spacer = useRef(null)
  const track = useRef(null)
  const progress = useRef(null)

  useEffect(() => {
    const el = scroller.current
    if (el) el.scrollTop = 0
  }, [deck.slug])

  useEffect(() => {
    let frame = 0
    let current = 0
    const update = () => {
      const el = scroller.current
      const rail = track.current
      if (el && rail) {
        const distance = Math.max(0, rail.scrollWidth - el.clientWidth)
        const height = el.clientHeight + distance
        if (spacer.current) spacer.current.style.height = `${height}px`
        const max = Math.max(1, el.scrollHeight - el.clientHeight)
        const target = el.scrollTop / max
        current += (target - current) * .12
        if (Math.abs(target - current) < .0004) current = target
        rail.style.transform = `translateX(${-current * distance}px)`
        if (progress.current) progress.current.style.transform = `scaleX(${current})`
      }
      frame = requestAnimationFrame(update)
    }
    frame = requestAnimationFrame(update)
    return () => cancelAnimationFrame(frame)
  }, [deck])

  return (
    <main className="ph-scroller" ref={scroller}>
      <div className="ph-spacer" ref={spacer}>
        <div className="ph-stage">
          <div className="ph-track" ref={track}>
            {!deck.hideHero && <section className="ph-panel ph-hero">
              <div className="ph-hero-media"><Media src={deck.video || deck.hero} embed={deck.embed} alt={`${deck.title} video`} /></div>
              <div className="ph-hero-shade" /><span className="ph-scroll mono">SCROLL →</span>
            </section>}

            <section className="ph-panel ph-overview">
              <div className="ph-overview-copy"><span className="ph-kicker mono">{deck.kicker}</span><h1>{deck.title}</h1><p className="ph-lead">{deck.lead}</p><p className="ph-body">{deck.body}</p>{deck.link && <a className="ph-link mono" href={deck.link[1]} target="_blank" rel="noreferrer">{deck.link[0]}</a>}</div>
              <aside className="ph-facts"><div><span className="mono">MY CONTRIBUTIONS</span>{deck.roles.map((role) => <b key={role}>{role}</b>)}</div><div><span className="mono">FACTS</span>{deck.facts.map(([label, value]) => <p key={label}><i>{label}</i><b>{value}</b></p>)}</div></aside>
            </section>

            {deck.media.length > 0 && <section className="ph-panel ph-gallery">{deck.media.map((src, index) => <figure key={src} className={index % 2 ? 'is-low' : ''}><Media src={src} alt={`${deck.title} selected work ${index + 1}`} /></figure>)}</section>}

            {deck.sections.map((section, index) => {
              const kicker = section.kicker || `${String(index + 1).padStart(2, '0')} / ${section.archive ? 'VISUAL ARCHIVE' : 'PROCESS NOTES'}`
              if (section.type === 'media-row') return <section className={`ph-panel ph-gallery ${section.className || ''}`} key={`media-${index}`}>
                {section.media.map((item, mediaIndex) => {
                  const node = typeof item === 'string' ? { src: item, ratio: '16 / 9' } : item
                  return <figure key={node.src} className={`${mediaIndex % 2 ? 'is-low' : ''} ${node.className || ''}`.trim()} style={{ aspectRatio: node.ratio }}><Media src={node.src} alt={`${deck.title} visual ${mediaIndex + 1}`} /></figure>
                })}
              </section>
              return <section className={`ph-panel ph-section ${section.wide ? 'ph-section-wide' : ''}`} key={`${section.title}-${index}`}>
                <div className="ph-section-copy"><span className="ph-kicker mono">{kicker}</span><h2>{section.title}</h2><p>{section.body}</p></div>
                {section.outcomes?.length > 0 && <ol className="ph-section-outcomes">{section.outcomes.map((outcome) => <li key={outcome.metric}><strong>{outcome.metric}</strong><span>{outcome.text}</span></li>)}</ol>}
                {section.media?.length > 0 && <div className="ph-section-media">{section.media.map((item) => {
                  const node = typeof item === 'string' ? { src: item } : item
                  return <figure key={node.src} className={node.className || ''} style={node.ratio ? { aspectRatio: node.ratio } : undefined}><Media src={node.src} alt={`${deck.title} ${section.title}`} /></figure>
                })}</div>}
              </section>
            })}

            <section className="ph-panel ph-footer">
              <Link className="ph-next" to={`/work/${deck.next.slug}`}><span className="ph-kicker mono">NEXT PROJECT</span><strong>{deck.next.title}<b>→</b></strong><small className="mono">{deck.next.meta}</small></Link>
              {!deck.hidePrevious && <Link className="ph-prev" to={`/work/${deck.previous.slug}`}><span className="mono">PREVIOUS PROJECT</span><b>← {deck.previous.title}</b></Link>}
            </section>
          </div>
          <div className="ph-hud"><Link to="/" className="ph-brand"><span>Y</span>ue Hu</Link><Link to="/#work" className="mono">← ALL PROJECTS</Link></div>
          <Link className="ph-gallery-return mono" to="/#art">← ART GALLERY</Link>
          <div className="ph-progress"><div ref={progress} /></div>
        </div>
      </div>
    </main>
  )
}
