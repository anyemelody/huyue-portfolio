export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="wrap">
        <span className="status mono">
          <span className="pulse" /> open to roles · agentic AI × creative tooling · based in ___
        </span>
        <h1 className="title">
          I build <span className="g">agentic AI tools</span> that reinvent how visual &amp; creative work gets made.
        </h1>
        <p className="lede">
          Design engineer at the intersection of agentic systems and visual/interaction design — I architect the AI,
          design the workflow, and ship the tool end-to-end.
        </p>
        <div className="chips">
          <span className="chip-k hl">Agentic systems</span>
          <span className="chip-k hl">LLM tooling</span>
          <span className="chip-k">Tool-use / MCP</span>
          <span className="chip-k">Real-time / WebGL</span>
          <span className="chip-k">Generative visuals</span>
        </div>
        <div className="hero-ctas">
          <a href="#highlight" className="btn btn-primary">See highlight work</a>
          <a href="#journey" className="btn btn-ghost">Travel my journey ↓</a>
        </div>
      </div>
    </section>
  )
}
