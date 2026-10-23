import { useCallback, useState } from 'react'
import { prefersReducedMotion } from './lib/hooks'
import { useGlobalParallax } from './lib/parallax'
import { useHashArrival, useSmoothScroll } from './lib/smooth'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Ecosystem from './components/Ecosystem'
import Pillars from './components/Pillars'
import Community from './components/Community'
import Velox from './components/Velox'
import Plate from './components/Plate'
import Standards from './components/Standards'
import Partners from './components/Partners'
import Footer from './components/Footer'

/** The hero film plays as a preloader unless the visitor lands on an anchor or prefers no motion. */
function wantsIntro() {
  if (prefersReducedMotion() || window.location.hash.length > 1) return false
  history.scrollRestoration = 'manual'
  window.scrollTo(0, 0)
  return true
}

export default function App() {
  const [intro] = useState(wantsIntro)
  const [locked, setLocked] = useState(intro)
  const unlock = useCallback(() => setLocked(false), [])
  useSmoothScroll(locked)
  useGlobalParallax()
  useHashArrival()
  return (
    <>
      <div className="page-frame" aria-hidden="true">
        <i /><i /><i /><i />
      </div>
      <Nav />
      <main>
        <Hero intro={intro} onDone={unlock} />
        <About />
        <Ecosystem />
        <Pillars />
        <Community />
        <Plate />
        <Standards />
        <Partners />
        <Velox />
      </main>
      <Footer />
    </>
  )
}
