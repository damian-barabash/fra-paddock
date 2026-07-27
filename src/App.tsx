import { useGlobalParallax } from './lib/parallax'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Ecosystem from './components/Ecosystem'
import Tiers from './components/Tiers'
import Path from './components/Path'
import Pillars from './components/Pillars'
import Comparison from './components/Comparison'
import Plate from './components/Plate'
import Program from './components/Program'
import Standards from './components/Standards'
import Partners from './components/Partners'
import Rules from './components/Rules'
import Apply from './components/Apply'
import Footer from './components/Footer'

export default function App() {
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
        <Comparison />
        <Plate />
        <Program />
        <Standards />
        <Partners />
        <Rules />
        <Apply />
      </main>
      <Footer />
    </>
  )
}
