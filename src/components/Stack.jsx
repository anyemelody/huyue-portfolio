import { stack } from '../data/stack.js'

export default function Stack() {
  return (
    <section className="stacksec panel" id="stack">
      <div className="wrap">
        <div className="section-tag mono">stack</div>
        <h2 className="section-h">What I work with</h2>
        <div className="stack-grid">
          {stack.map((col, i) => (
            <div className="stack-col" key={i}>
              <h4>{col.h}</h4>
              <ul>
                {col.items.map((it, j) => <li key={j}>{it}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <p className="stack-note">↳ keep only what you truly know.</p>
      </div>
    </section>
  )
}
