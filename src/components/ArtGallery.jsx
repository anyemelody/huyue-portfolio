import { useEffect, useRef, useState } from 'react'

const ARTWORKS = [
  { title: 'LAN', type: 'GENERATIVE SKETCH', src: '/assets/creative-coding/lan_flower_sketch.gif', href: 'https://anyemelody.github.io/LanSketch/', ratio: '4 / 5', side: 'left' },
  { title: 'MEI', type: 'GENERATIVE SKETCH', src: '/assets/creative-coding/mei_sketch.gif', href: 'https://anyemelody.github.io/MeiSketch/', ratio: '4 / 5', side: 'right' },
  { title: 'GARDEN', type: 'GENERATIVE SYSTEM', src: '/assets/creative-coding/garden.png', href: 'https://anyemelody.github.io/Garden/', ratio: '3 / 2', side: 'left' },
  { title: 'GREEN HAIR GRASS', type: 'GENERATIVE SKETCH', src: '/assets/creative-coding/green_hair_grass_circle.gif', href: 'https://anyemelody.github.io/GreenHairGrass/', ratio: '4 / 5', side: 'right' },
  { title: 'DANCING SPRING', type: 'MOTION STUDY', src: '/assets/dancing-spring/Dancing_Spring.png', href: 'https://anyemelody.github.io/SingSpring/', ratio: '16 / 9', side: 'left' },
  { title: 'COLLATZ PLANT', type: 'ALGORITHMIC GROWTH', src: '/assets/creative-coding/collatz_conjecture_plant.gif', href: 'https://anyemelody.github.io/CollatzConjecturePlant/', ratio: '4 / 5', side: 'right' },
  { title: 'SOUND EMOTION', type: 'SOUND VISUALIZATION', src: '/assets/sound-emotion/Sound_Emotion.png', video: 'https://player.vimeo.com/video/164668057?autoplay=1', ratio: '16 / 9', side: 'left' },
]

export default function ArtGallery() {
  const section = useRef(null)
  const frame = useRef(null)
  const [playing, setPlaying] = useState(null)

  useEffect(() => {
    const el = section.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    let raf = 0
    const update = () => {
      raf = 0
      const box = el.getBoundingClientRect()
      const progress = Math.max(0, Math.min(1, -box.top / Math.max(1, box.height - window.innerHeight)))
      el.style.setProperty('--gallery-progress', progress.toFixed(4))
      const titleOut = Math.max(0, Math.min(1, (progress - 0.22) / 0.16))
      // Keep the first work visible beside the Art introduction; only the camera
      // progression waits until the introduction has faded away.
      const galleryIn = 1
      const galleryProgress = Math.max(0, Math.min(1, (progress - 0.4) / 0.6))
      // Let the final work leave the room before the contact section takes over.
      const galleryOut = Math.max(0, Math.min(1, (progress - 0.88) / 0.12))
      el.style.setProperty('--art-title-opacity', (1 - titleOut).toFixed(3))
      el.style.setProperty('--art-title-y', `${(-titleOut * 22).toFixed(1)}px`)
      el.style.setProperty('--gallery-content-opacity', (galleryIn * (1 - galleryOut)).toFixed(3))
      el.style.setProperty('--gallery-reel-progress', galleryProgress.toFixed(4))
      const world = el.querySelector('.art-gallery-world')
      if (world) world.style.pointerEvents = galleryIn > 0.98 && galleryOut < 0.98 ? 'auto' : 'none'
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
          <div className="mono art-gallery-kicker">03 — ART WORK / CREATIVE CODING</div>
          <h2>Pictures that <em>behave.</em></h2>
          <p>Five small worlds built with systems, motion, and rules. Scroll to walk the gallery; open a work to play with it.</p>
        </div>

        <div className="art-gallery-room" aria-hidden="true">
          <div className="art-gallery-plane art-gallery-floor" />
          <div className="art-gallery-plane art-gallery-ceiling" />
        </div>

        <div className="art-gallery-world">
          {ARTWORKS.map((work, index) => (
            <a className={`art-station art-station-${work.side}`} key={work.title} href={work.video || work.href} target={work.video ? undefined : '_blank'} rel={work.video ? undefined : 'noreferrer'}
              onClick={(event) => { if (work.video) { event.preventDefault(); setPlaying(work) } }}
              style={{ '--station-index': index, '--art-ratio': work.ratio }}>
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
      {playing && (
        <div className="art-video-modal" role="dialog" aria-modal="true" aria-label="Sound Emotion video" onClick={() => setPlaying(null)}>
          <div className="art-video-modal-frame" onClick={(event) => event.stopPropagation()}>
            <button className="mono" type="button" onClick={() => setPlaying(null)}>CLOSE ×</button>
            <iframe src={playing.video} title={`${playing.title} video`} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
          </div>
        </div>
      )}
    </section>
  )
}
