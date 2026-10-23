import { useGlobalParallax } from './lib/parallax'
import { useHashArrival, useSmoothScroll } from './lib/smooth'
import Nav from './components/Nav'
import Path from './components/Path'
import Program from './components/Program'
import Rules from './components/Rules'
import Apply from './components/Apply'
import Footer from './components/Footer'

/** /aplikacja — membership path, Refueling System, rules and the application form. */
export default function ApplyPage() {
  useSmoothScroll(false)
  useGlobalParallax()
  useHashArrival()

  return (
    <>
      <div className="page-frame" aria-hidden="true">
        <i /><i /><i /><i />
      </div>
      <Nav />
      <main className="subpage">
        <Path />
        <Program />
        <Rules />
        <Apply />
      </main>
      <Footer />
    </>
  )
}
