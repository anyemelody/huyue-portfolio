import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Nav from './components/Nav.jsx'
import Home from './components/Home.jsx'
import ProjectPage from './components/ProjectPage.jsx'

// scroll to a #hash target after route change (e.g. /#journey from a project page)
function HashScroll() {
  const { hash, pathname } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash)
      if (el) { el.scrollIntoView({ behavior: 'smooth' }); return }
    }
    if (pathname === '/' && !hash) window.scrollTo(0, 0)
  }, [hash, pathname])
  return null
}

export default function App() {
  return (
    <>
      <div className="content">
        <Nav />
        <HashScroll />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work/:slug" element={<ProjectPage />} />
          <Route path="*" element={<ProjectPage />} />
        </Routes>
      </div>
    </>
  )
}
