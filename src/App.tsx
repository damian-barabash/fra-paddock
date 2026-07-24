import Nav from './components/Nav'
import Hero from './components/Hero'
import Manifesto from './components/Manifesto'
import Privileges from './components/Privileges'
import Experiences from './components/Experiences'
import Membership from './components/Membership'
import Apply from './components/Apply'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Manifesto />
        <Privileges />
        <Experiences />
        <Membership />
        <Apply />
      </main>
      <Footer />
    </>
  )
}
