/**
 * Ticker — the credibility strip between the intro and Highlight Projects.
 */
const ITEMS = ['BYTEDANCE / TIKTOK', 'WEBBY AWARD 2019 · AR', 'NYU ITP · RED BURNS SCHOLAR', 'PARSONS ADJUNCT FACULTY', 'IBM · HERSHEY · SANTANDER · ADIDAS', '400K DISCORD · 64K YOUTUBE']

export default function Ticker() {
  const run = (
    <div className="v3-ticker-run mono">
      {ITEMS.map((t) => (
        <span key={t} className="v3-ticker-item">{t}<span className="dia">◆</span></span>
      ))}
    </div>
  )
  return (
    <div className="v3-ticker" aria-hidden="true">
      <div className="v3-ticker-track">{run}{run}</div>
    </div>
  )
}
