import { useEffect, useRef } from 'react'

export default function Footer() {
  const footer = useRef(null)

  useEffect(() => {
    const element = footer.current
    if (!element) return undefined
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      entry.target.classList.add('is-visible')
      observer.disconnect()
    }, { threshold: 0.42 })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <footer className="v2-footer" id="contact" ref={footer}>
      <div className="v2-footer-content">
        <div className="v2-foot-top">
          <div>
            <div className="v2-foot-tag mono">SAY HELLO</div>
            <a className="v2-foot-mail" href="mailto:anyemelody@gmail.com">anyemelody@gmail.com</a>
          </div>
          <div className="v2-foot-links mono">
            <a href="https://github.com/anyemelody" target="_blank" rel="noreferrer">GITHUB</a>
            <a href="https://www.linkedin.com/in/yuehu-melody" target="_blank" rel="noreferrer">LINKEDIN</a>
            <a href="/Yue_Hu_Resume.pdf" target="_blank" rel="noreferrer">RÉSUMÉ</a>
          </div>
        </div>
        <div className="v2-foot-meta mono">
          <span>YUE HU</span>
          <span>ENGINEER / CREATOR / ARTIST — SAME OBJECT</span>
        </div>
      </div>
    </footer>
  )
}
