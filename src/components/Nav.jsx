import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

// Theme follows local time by default: 7:00–19:00 light, otherwise dark.
// Clicking the toggle overrides it for the current visit only (sessionStorage);
// the next visit returns to time-based auto switching.
const timeTheme = () => {
  const hour = new Date().getHours()
  return hour >= 7 && hour < 19 ? 'light' : 'dark'
}

export default function Nav() {
  const [theme, setTheme] = useState(
    () => document.documentElement.dataset.theme || timeTheme()
  )

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  // while no manual override, keep following the clock (e.g. page left open past 19:00)
  useEffect(() => {
    const tick = setInterval(() => {
      try {
        if (sessionStorage.getItem('yh-theme-override')) return
        const next = timeTheme()
        setTheme((current) => (current === next ? current : next))
      } catch (e) { /* private mode */ }
    }, 60000)
    return () => clearInterval(tick)
  }, [])

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    try { sessionStorage.setItem('yh-theme-override', next) } catch (e) { /* private mode */ }
  }

  return (
    <header className="v2-nav">
      <Link to="/" className="v2-brand"><span className="zap">Y</span>ue Hu</Link>
      <nav className="v2-nav-links mono">
        <Link to="/">ABOUT</Link>
        <a href="/#work">WORK</a>
        <a href="/#art">ART</a>
        <a href="/#contact">CONTACT</a>
        <a href="/Yue_Hu_Resume.pdf" target="_blank" rel="noreferrer" className="v2-nav-cta">RÉSUMÉ</a>
        <button
          type="button"
          className="v2-theme"
          aria-label={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
          onClick={toggle}
        >
          {theme === 'dark' ? '☀' : '☾'}
        </button>
      </nav>
    </header>
  )
}
