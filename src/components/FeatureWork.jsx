import { Link } from 'react-router-dom'

/**
 * FeatureWork (v3) — Lusion-style catalogue: giant title left, small-caps
 * blurb right, then a two-column grid of large covers. Hover eases the image
 * up to 1.055 inside its well and warms the project name.
 */
const PROJECTS = [
  ['effect-house.gif', 'TikTok Effect House', 'MR CREATION TOOL • AR AUTHORING • SHIPPED', '/work/tiktok-effect-house'],
  ['hershey.png', 'Hershey Pop Kisses', 'MIXED REALITY • DAYDREAM VR • HAVAS', '/work/hershey-pop-kisses'],
  ['ibm-watson.png', 'IBM Watson AR', 'AR MOBILE • AI ASSISTANT • HAVAS', '/work/ibm-watson'],
  ['vuse.png', 'Vuse Unboxing AR', 'AR MOBILE • RETAIL EXPERIENCE', '/work/vuse-unboxing-ar'],
  ['santander.jpg', 'Santander', 'AR MOBILE • WEBBY 2019', '/work/santander']
]

export default function FeatureWork() {
  return (
    <section className="v3-feature" id="journey">
      <div className="v3-feature-head">
        <h2 className="v3-giant">Feature<br />Work</h2>
        <p className="mono">A selection of past work — across MR creation tools, mixed-reality experiences, VFX, and immersive art.</p>
      </div>
      <div className="v3-feature-grid">
        {PROJECTS.map(([img, name, meta, to]) => (
          <Link className="fw-card" key={name} to={to}>
            <div className="v2-well fw-well">
              <img src={`/assets/era/${img}`} alt={name} loading="lazy" />
            </div>
            <div>
              <div className="mono fw-meta">{meta}</div>
              <div className="fw-name">{name}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
