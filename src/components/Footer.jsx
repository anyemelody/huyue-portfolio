import { useEffect, useRef } from 'react'
import { FaGithub, FaInstagram, FaLinkedinIn, FaVimeoV, FaYoutube } from 'react-icons/fa6'

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/anyemelody', Icon: FaGithub },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/yue-melody-hu-60a84295/',
    Icon: FaLinkedinIn,
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/watch?v=iMw3da1VIuo&list=PL68yBH9mbDAyLis85tYUav0YoqEYoR6rJ',
    Icon: FaYoutube,
  },
  { label: 'Vimeo', href: 'https://vimeo.com/user44110761', Icon: FaVimeoV },
  { label: 'Instagram', href: 'https://www.instagram.com/anyemelody/', Icon: FaInstagram },
]

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
            <div className="v2-foot-tag mono"><span aria-hidden="true" />OPEN TO NEW OPPORTUNITIES</div>
            <p className="v2-foot-invitation">Tell me what you’re building —</p>
            <a className="v2-foot-mail" href="mailto:anyemelody@gmail.com">anyemelody@gmail.com</a>
            <a className="v2-foot-resume mono" href="/Yue_Hu_Resume.pdf" target="_blank" rel="noreferrer">VIEW RÉSUMÉ ↗</a>
          </div>
          <div className="v2-foot-actions">
            <nav className="v2-foot-socials" aria-label="Social links">
              {socialLinks.map(({ label, href, Icon }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} title={label}>
                  <Icon aria-hidden="true" />
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  )
}
