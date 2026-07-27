export default function About() {
  return (
    <section className="about panel" id="about">
      <div className="wrap about-grid">
        <div>
          <h2>An engineer with a designer's eye — building the tools, not just using them.</h2>
          <p>
            Most people who can architect agentic systems don't have visual taste; most people with visual taste don't
            ship AI systems. I've spent a decade in the overlap — and now I build the tools that live there.
          </p>
          <p className="mono" style={{ color: 'var(--ink-dim)', fontSize: 13 }}>
            ↳ placeholder bio — replace with your real story.
          </p>
        </div>
        <div className="portrait">[ your photo ]</div>
      </div>
    </section>
  )
}
