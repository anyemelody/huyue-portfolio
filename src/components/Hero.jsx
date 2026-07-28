import { useEffect, useRef, useState } from 'react'
import NameSculpture from './NameSculpture.jsx'

export const FACES = [
  ['engineer', 'Interactive Engineer'],
  ['creator', 'Creative Technologist'],
  ['artist', 'Artist']
]

export default function Hero({ face, setFace }) {
  const api = useRef(null)
  // rebuild the sculpture when the theme flips so its voxels re-read the tokens
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light')
  useEffect(() => {
    const mo = new MutationObserver(() => setTheme(document.documentElement.dataset.theme || 'light'))
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => mo.disconnect()
  }, [])

  const pick = (name) => {
    api.current?.focusFace(name)
    setFace(name)
  }

  return (
    <section className="v2-hero" id="hero">
      <div className="v2-hero-top">
        <p className="v2-hero-intro">
          One object. Three shadows. I build AI systems with the hands of a maker and the eye of an artist.
        </p>
        <div className="v2-hero-hint mono">
          <div>DRAG THE FORM TO ROTATE</div>
          <div>EACH AXIS SPELLS A DIFFERENT WORD</div>
        </div>
      </div>

      <div className="v2-sculpt-mount">
        <NameSculpture
          api={api}
          mode={theme === 'dark' ? 'points' : 'plaster'}
          ink={theme === 'dark' ? '#efe6d8' : '#2f2b27'}
          onFace={(f) => f !== 'free' && setFace(f)}
        />
      </div>

      <div className="v2-faces">
        {FACES.map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={'v2-face' + (face === id ? ' is-on' : '')}
            onClick={() => pick(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="v2-hero-lede">
        <h1>
          Agentic AI systems, <em>shaped like art</em>.
        </h1>
        <div className="v2-hero-copy">
          <p>
            Senior Research Engineer at ByteDance / TikTok. I architected <strong>Create with AI</strong> — the
            agentic system that turns a sentence into a runnable AR effect, shipped to TikTok creators. Before
            that: nine years of WebGL, AR and installation work for IBM, Hershey and Santander.
          </p>
          <div className="v2-status mono">
            <span className="dot" />OPEN TO AI PRODUCT / RESEARCH ENGINEERING ROLES
          </div>
        </div>
      </div>
    </section>
  )
}
