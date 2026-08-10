import { useEffect } from 'react'
import SelfIntro from './SelfIntro.jsx'
import HighlightWork from './HighlightWork.jsx'
import ArtGallery from './ArtGallery.jsx'
import Footer from './Footer.jsx'

export default function Home() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    let frame = 0
    const update = () => {
      frame = 0
      const height = window.innerHeight
      document.querySelectorAll('[data-home-reveal]').forEach((el) => {
        const box = el.getBoundingClientRect()
        const entering = Math.min(1, Math.max(0, (height - box.top) / Math.max(1, height * 0.42)))
        const leaving = Math.min(1, Math.max(0, box.bottom / Math.max(1, height * 0.3)))
        const progress = Math.min(entering, leaving)
        el.style.opacity = progress.toFixed(3)
        el.style.transform = `translateY(${((1 - progress) * 24).toFixed(1)}px)`
      })
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <>
      <SelfIntro />
      <HighlightWork />
      <ArtGallery />
      <Footer />
    </>
  )
}
