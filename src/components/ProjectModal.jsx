import { useEffect } from 'react'

export default function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!project) return null
  const d = project.detail || {}
  const facts = [d.year, d.location, d.medium, d.client].filter(Boolean).join('  ·  ')

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close mono" onClick={onClose} aria-label="Close">esc ✕</button>
        {project.img && (
          <div className="modal-cover"><img src={project.img} alt={project.name} /></div>
        )}
        <div className="modal-body">
          <h3 className="modal-title">{project.name}</h3>
          {facts && <div className="modal-facts mono">{facts}</div>}
          {d.award && <div className="modal-award">{d.award}</div>}
          {d.body && <p className="modal-text">{d.body}</p>}
          {d.role && d.role.length > 0 && (
            <div className="modal-group">
              <span className="modal-label mono">my role</span>
              <div className="modal-chips">{d.role.map((r, i) => <span className="t" key={i}>{r}</span>)}</div>
            </div>
          )}
          {d.tools && d.tools.length > 0 && (
            <div className="modal-group">
              <span className="modal-label mono">tools</span>
              <div className="modal-chips">{d.tools.map((t, i) => <span className="t" key={i}>{t}</span>)}</div>
            </div>
          )}
          {d.link && (
            <a className="modal-link mono" href={d.link[1]} target="_blank" rel="noreferrer">{d.link[0]}</a>
          )}
        </div>
      </div>
    </div>
  )
}
