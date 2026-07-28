import { useState } from 'react'
import Hero from './Hero.jsx'
import FieldParticles from './FieldParticles.jsx'
import HighlightWork from './HighlightWork.jsx'
import Journey from './Journey.jsx'
import Stack from './Stack.jsx'
import About from './About.jsx'
import Footer from './Footer.jsx'

export default function Home() {
  // the hero sculpture and the index share one "which face am I showing" state
  const [face, setFace] = useState('engineer')

  return (
    <>
      <FieldParticles />
      <Hero face={face} setFace={setFace} />
      <HighlightWork />
      <Journey />
      <Stack />
      <About />
      <Footer />
    </>
  )
}
