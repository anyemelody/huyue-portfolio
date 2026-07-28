import { Link } from 'react-router-dom'
import { eras } from '../data/eras.js'

// The three hero faces map onto the three eras already defined in data/eras.js.
const ERA_FOR_FACE = {
  engineer: 'Interactive Engineer',
  creator: 'Creative Technologist',
  artist: 'Creative Coder / Artist'
}

export default function IdentityIndex({ face }) {
  const wanted = ERA_FOR_FACE[face] || ERA_FOR_FACE.engineer
  const era = eras.find((e) => e.title === wanted) || eras[0]

  return (
    <section className="v2-index" id="index">
      <div className="v2-index-head">
        <h2 className="mono">INDEX — {era.title.toUpperCase()}</h2>
        <span className="mono">{era.years} · SWITCH THE FACE ABOVE TO REFILTER</span>
      </div>

      <div className="v2-index-list">
        {era.projects.map((p, i) => {
          const body = (
            <>
              <span className="v2-idx-thumb">{p.img && <img src={p.img} alt="" loading="lazy" />}</span>
              <span className="v2-idx-title">{p.name}</span>
              <span className="v2-idx-meta">{p.meta}</span>
              <span className="v2-idx-go mono">{p.external ? 'live ↗' : 'open ↗'}</span>
            </>
          )
          return p.external
            ? <a className="v2-idx-row" key={i} href={p.href} target="_blank" rel="noreferrer">{body}</a>
            : <Link className="v2-idx-row" key={i} to={'/work/' + p.slug}>{body}</Link>
        })}
      </div>
    </section>
  )
}
