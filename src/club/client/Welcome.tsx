import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import About from '../../components/About'
import Ecosystem from '../../components/Ecosystem'
import Pillars from '../../components/Pillars'
import Path from '../../components/Path'
import Community from '../../components/Community'
import Plate from '../../components/Plate'
import Program from '../../components/Program'
import Standards from '../../components/Standards'
import Partners from '../../components/Partners'
import Rules from '../../components/Rules'
import Velox from '../../components/Velox'
import { asset } from '../../lib/asset'
import { firstName } from '../ui/format'

const ease = [0.22, 1, 0.36, 1] as const

/**
 * The club presentation members see on their first visit (and any time from „O Klubie"):
 * the chapters taken off the public page. Chapter numerals are re-counted in CSS.
 */
export default function Welcome({ open, onClose, name, firstTime }: { open: boolean; onClose: () => void; name: string; firstTime: boolean }) {
  useEffect(() => {
    if (!open) return
    document.documentElement.classList.add('modal-open')
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => {
      document.documentElement.classList.remove('modal-open')
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  const fn = firstName(name)

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="welcome"
          role="dialog"
          aria-modal="true"
          aria-label="O Klubie"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <div className="welcome-bar">
            <img src={asset('assets/logo.webp')} alt="Fastline Paddock Club" />
            <button type="button" className="welcome-close" onClick={onClose}>
              {firstTime ? 'Wejdź do Paddocku' : 'Zamknij'} <span aria-hidden="true">×</span>
            </button>
          </div>

          <header className="welcome-hero" style={{ ['--welcome-img' as string]: `url(${asset('assets/preloader-end.webp')})` }}>
            <motion.span className="eyebrow-line" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease, delay: 0.3 }}>
              {firstTime ? 'Witamy w Klubie' : 'Fastline Paddock Club'}
            </motion.span>
            <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease, delay: 0.45 }}>
              {fn ? <>{fn}, <em>jesteś</em> po właściwej stronie bariery.</> : <>Jesteś po <em>właściwej</em> stronie bariery.</>}
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 0.8 }}>
              Poznaj świat, do którego właśnie dołączasz. Ta prezentacja jest zawsze pod przyciskiem „O Klubie”.
            </motion.p>
            <span className="welcome-scroll" aria-hidden="true" />
          </header>

          <div className="welcome-body">
            <About />
            <Ecosystem />
            <Pillars />
            <Path />
            <Community />
            <Plate />
            <Program />
            <Standards />
            <Partners />
            <Rules />
            <Velox />
          </div>

          <footer className="welcome-end">
            <img src={asset('assets/logo.webp')} alt="" aria-hidden="true" />
            <p>The Inner Circle of Driving.</p>
            <button type="button" className="btn btn-gold" onClick={onClose}>
              Wejdź do Paddocku <span className="btn-arrow">→</span>
            </button>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
