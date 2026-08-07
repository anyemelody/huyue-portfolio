import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Nav() {
  const [theme, setTheme] = useState(
    () => document.documentElement.dataset.theme || 'light'
  )

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem('yh-theme', theme) } catch (e) { /* private mode */ }
  }, [theme])

  return (
    <header className="v2-nav">
      <Link to="/" className="v2-brand"><span className="zap">Y</span>ue Hu</Link>
      <nav className="v2-nav-links mono">
        <a href="/#highlight">WORK</a>
        <a href="/#index">INDEX</a>
        <a href="/#contact">ABOUT &amp; CONTACT</a>
        <button
          type="button"
          className="v2-theme"
          aria-label={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? '☀' : '☾'}
        </button>
        <a href="/Yue_Hu_Resume.pdf" target="_blank" rel="noreferrer" className="v2-nav-cta">RÉSUMÉ</a>
      </nav>
    </header>
  )
}
