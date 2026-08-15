import { useGlobalParallax } from './lib/parallax'
import { useSmoothScroll } from './lib/smooth'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Ecosystem from './components/Ecosystem'
import Tiers from './components/Tiers'
import Path from './components/Path'
import Pillars from './components/Pillars'
import Community from './components/Community'
import Comparison from './components/Comparison'
import Velox from './components/Velox'
import Plate from './components/Plate'
import Program from './components/Program'
import Standards from './components/Standards'
import Partners from './components/Partners'
import Rules from './components/Rules'
import Apply from './components/Apply'
import Footer from './components/Footer'

export default function App() {
  useSmoothScroll()
  useGlobalParallax()
  return (
    <>
      <div className="page-frame" aria-hidden="true">
        <i /><i /><i /><i />
      </div>
      <Nav />
      <main>
        <Hero />
        <About />
        <Ecosystem />
        <Tiers />
        <Path />
        <Pillars />
        <Community />
        <Comparison />
        <Plate />
        <Program />
        <Standards />
        <Partners />
        <Rules />
        <Apply />
        <Velox />
      </main>
      <Footer />
    </>
  )
}
