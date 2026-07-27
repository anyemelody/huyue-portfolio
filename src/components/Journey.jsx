import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { eras } from '../data/eras.js'
import PlaceholderThumb from './PlaceholderThumb.jsx'

const N = eras.length

export default function Journey() {
  const rootRef = useRef()
  const navigate = useNavigate()
  const open = (p) => {
    if (p.external && p.href) window.open(p.href, '_blank', 'noopener,noreferrer')
    else if (p.slug) navigate('/work/' + p.slug)
  }

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches
    const isTouch = window.matchMedia('(max-width:760px)').matches || 'ontouchstart' in window
    const journey = rootRef.current
    if (!journey) return

    if (reduce || isTouch) {
      journey.classList.add('fallback')
      return
    }

    const pin = journey.querySelector('.journey-pin')
    const rows = journey.querySelector('.rows')
    const rowsVp = rows.parentElement
    const axisRail = journey.querySelector('.axis-rail')
    const axisDot = journey.querySelector('.axis-dot')
    const axisHint = journey.querySelector('.axis-hint')
    const tracks = () => [...journey.querySelectorAll('.eratrack')]

    let segs = [], totalLen = 0, stageH = 0, overflow = []

    function buildSegs() {
      segs = []; overflow = []
      const tr = tracks()
      const vpW = rowsVp.clientWidth
      const VD = Math.round(window.innerHeight * 0.55)
      for (let i = 0; i < N; i++) {
        const ov = Math.max(0, tr[i].scrollWidth - vpW)
        overflow[i] = ov
        const HL = ov + Math.round(window.innerHeight * 0.35)
        segs.push({ type: 'H', era: i, len: HL })
        if (i < N - 1) segs.push({ type: 'V', from: i, to: i + 1, len: VD })
      }
      totalLen = segs.reduce((a, s) => a + s.len, 0)
    }
    function measure() {
      stageH = window.innerHeight
      buildSegs()
      pin.style.height = (stageH + totalLen) + 'px'
      onScroll()
    }
    function compute(px) {
      let acc = 0, vpos = 0, hx = new Array(N).fill(0)
      for (const seg of segs) {
        if (px < acc + seg.len) {
          const local = (px - acc) / seg.len
          if (seg.type === 'H') { vpos = seg.era; hx[seg.era] = local }
          else { vpos = seg.from + (seg.to - seg.from) * local }
          return { vpos, hx }
        } else {
          if (seg.type === 'H') { hx[seg.era] = 1; vpos = seg.era }
          else { vpos = seg.to }
          acc += seg.len
        }
      }
      return { vpos: N - 1, hx: hx.map(() => 1) }
    }
    function onScroll() {
      const rect = pin.getBoundingClientRect()
      const px = Math.min(totalLen, Math.max(0, -rect.top))
      const { vpos, hx } = compute(px)
      rows.style.transform = `translateY(${-vpos * stageH}px)`
      tracks().forEach((tr, i) => { tr.style.transform = `translateX(${-hx[i] * overflow[i]}px)` })
      const railH = axisRail.clientHeight
      axisDot.style.top = ((N === 1 ? 0 : vpos / (N - 1)) * railH) + 'px'
      const active = Math.round(vpos)
      journey.querySelectorAll('.anode').forEach((n, i) => n.classList.toggle('active', i === active))
      const inH = Math.abs(vpos - active) < 0.04
      if (axisHint) {
        axisHint.textContent = inH
          ? `era 0${active + 1} · ${eras[active].title} — scroll → for projects`
          : 'moving between eras…'
      }
    }

    measure()
    let ticking = false
    const sh = () => {
      if (!ticking) { requestAnimationFrame(() => { onScroll(); ticking = false }); ticking = true }
    }
    const rs = () => measure()
    window.addEventListener('scroll', sh, { passive: true })
    window.addEventListener('resize', rs)
    return () => {
      window.removeEventListener('scroll', sh)
      window.removeEventListener('resize', rs)
    }
  }, [])

  return (
    <section className="journey" id="journey" ref={rootRef}>
      <div className="journey-intro wrap">
        <div className="section-tag mono">the journey · the path here</div>
        <div className="throughline">
          The title kept changing. The <span className="g">throughline</span> never did.
        </div>
        <p className="throughline-sub">
          Visual, music, interaction — one obsession across a decade. These are just the labels the industry gave the
          same pursuit, each era deepening the engineering the next one needed.
        </p>
        <div className="now-link mono">…arriving at now → GenAI Engineer · ↑ see Highlight Work</div>
        <span className="h-hint mono">scroll ↓ to drop into an era, keep scrolling → to walk its projects</span>
      </div>

      <div className="journey-pin">
        <div className="jstage">
          <div className="axis">
            <div className="axis-rail">
              <div className="axis-now mono">
                now<b>GenAI Engineer</b><span>↑ Highlight Work</span>
              </div>
              <div className="axis-dot" />
              {eras.map((e, i) => (
                <div
                  key={i}
                  className={'anode' + (i === 0 ? ' active' : '')}
                  style={{ top: (N === 1 ? 50 : (i / (N - 1)) * 100) + '%' }}
                >
                  <div className="mk" />
                  <div className="yr">{e.years}</div>
                  <div className="ti">{e.title}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rows-vp">
            <div className="rows">
              {eras.map((e, i) => (
                <div className="erarow" key={i} data-era={i}>
                  <div className="erarow-head">
                    <div className="yr">{e.years}</div>
                    <div className="ti">{e.title} <small>· era 0{i + 1}</small></div>
                    <div className="bd" dangerouslySetInnerHTML={{ __html: e.build }} />
                  </div>
                  <div className="eratrack-vp">
                    <div className="eratrack">
                      {e.projects.map((p, j) => (
                        <div className="pcard" key={j} role="button" tabIndex={0}
                          onClick={() => open(p)} onKeyDown={(ev) => { if (ev.key === 'Enter') open(p) }}>
                          <div className="pv">
                            {p.img ? (
                              <img src={p.img} alt={p.name} loading="lazy" />
                            ) : (
                              <>
                                <PlaceholderThumb hue={p.hue} />
                                <span className="lab">[ image ]</span>
                              </>
                            )}
                          </div>
                          <div className="pb">
                            <div className="pt">{p.name}</div>
                            <div className="pm">{p.meta}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="axis-hint mono" />
        </div>
      </div>
    </section>
  )
}
