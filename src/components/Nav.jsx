import { Link } from 'react-router-dom'

export default function Nav() {
  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <Link to="/" className="brand"><span className="sq" /> Yue Hu</Link>
        <nav className="nav-links">
          <a href="/#highlight">Highlight</a>
          <a href="/#journey">Journey</a>
          <a href="/#stack">Stack</a>
          <a href="/#contact">Contact</a>
        </nav>
        <a href="/#contact" className="nav-cta mono">résumé ↗</a>
      </div>
    </header>
  )
}
