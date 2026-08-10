import { useEffect, useRef } from 'react'

const ARTWORKS = [
  { title: 'LAN', type: 'GENERATIVE SKETCH', src: '/assets/creative-coding/7514a4_adffb6f84fdf492aa176d9520fb5f566.gif', href: 'https://anyemelody.github.io/LanSketch/', ratio: '4 / 5', side: 'left' },
  { title: 'MEI', type: 'GENERATIVE SKETCH', src: '/assets/creative-coding/7514a4_84db5264d1f549d0a81c4d2d5bc03bb0.gif', href: 'https://anyemelody.github.io/MeiSketch/', ratio: '4 / 5', side: 'right' },
  { title: 'GARDEN', type: 'GENERATIVE SYSTEM', src: '/assets/creative-coding/7514a4_bd5722793dc04e478178e01f790aba4a.png', href: 'https://anyemelody.github.io/Garden/', ratio: '3 / 2', side: 'left' },
  { title: 'COLLATZ PLANT', type: 'ALGORITHMIC GROWTH', src: '/assets/creative-coding/7514a4_517b2670290c43708dffa6e92f9f7c2a.gif', href: 'https://anyemelody.github.io/CollatzConjecturePlant/', ratio: '4 / 5', side: 'right' },
  { title: 'DANCING SPRING', type: 'MOTION STUDY', src: '/assets/dancing-spring/7514a4_39045e757b174c0cb3c7407a90c953bd.jpg', href: 'https://anyemelody.github.io/DancingSpring/', ratio: '16 / 9', side: 'center' },
]

export default function ArtGallery() {
  const section = useRef(null)
  const frame = useRef(null)

  useEffect(() => {
    const el = section.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    let raf = 0
    const update = () => {
      raf = 0
      const box = el.getBoundingClientRect()
      const progress = Math.max(0, Math.min(1, -box.top / Math.max(1, box.height - window.innerHeight)))
      el.style.setProperty('--gallery-progress', progress.toFixed(4))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <section className="art-gallery" id="art" ref={section}>
      <div className="art-gallery-stage" ref={frame}>
        <div className="art-gallery-head">
          <div className="mono art-gallery-kicker" data-home-reveal="1">03 — ART WORK / CREATIVE CODING</div>
          <h2 data-home-reveal="1">Pictures that <em>behave.</em></h2>
          <p data-home-reveal="1">Five small worlds built with systems, motion, and rules. Scroll to walk the gallery; open a work to play with it.</p>
        </div>

        <div className="art-gallery-room" aria-hidden="true">
          <div className="art-gallery-plane art-gallery-floor" />
          <div className="art-gallery-plane art-gallery-ceiling" />
        </div>

        <div className="art-gallery-world">
          {ARTWORKS.map((work, index) => (
            <a className={`art-station art-station-${work.side}`} key={work.title} href={work.href} target="_blank" rel="noreferrer"
              style={{ '--station-index': index, '--art-ratio': work.ratio }}>
              <div className="art-light" />
              <div className="art-frame">
                <img src={work.src} alt={`${work.title} creative coding work`} loading={index < 2 ? 'eager' : 'lazy'} />
              </div>
              <div className="art-label mono"><span>{work.type}</span> — {work.title} <b>↗</b></div>
            </a>
          ))}
        </div>
        <div className="mono art-gallery-hint">SCROLL TO WALK THE GALLERY</div>
        <div className="art-gallery-fallback mono">EXPLORE THE WORKS ↓</div>
      </div>
    </section>
  )
}
