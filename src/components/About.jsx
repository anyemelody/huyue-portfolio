export default function About() {
  return (
    <section className="v2-about" id="about">
      <div className="v2-about-grid">
        <div className="v2-about-left">
          <h2 className="mono">ABOUT</h2>
          <div className="v2-portrait">
            {/* swap in a real portrait: <img src="/assets/portrait.jpg" alt="Yue Hu" /> */}
            <span className="mono">[ PORTRAIT ]</span>
          </div>
        </div>

        <div className="v2-about-right">
          <p className="v2-about-lede">
            I've spent nine years on the seam between engineering and art — shader graphs and stage
            projections, agent architectures and AR installations. The through-line isn't a discipline.
            It's <em>taking a vague idea all the way to a thing that runs</em>.
          </p>
          <p className="v2-about-body">
            Biomedical engineering at Southeast University, then NYU ITP on the Red Burns Scholarship.
            Four years client-side at Havas New York, five at ByteDance. I like the problems where nobody
            has decided yet what the interface should be.
          </p>

          <div className="v2-stats">
            {[
              ['9', 'YEARS SHIPPING'],
              ['40%', 'OF TIKTOK EFFECT CREATIONS'],
              ['1', 'WEBBY AWARD'],
              ['400K', 'CREATORS TAUGHT']
            ].map(([v, l]) => (
              <div className="v2-stat" key={l}>
                <div className="v">{v}</div>
                <div className="l mono">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
