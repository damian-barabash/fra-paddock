import { motion } from 'framer-motion'
import { asset } from '../lib/asset'

const ease = [0.22, 1, 0.36, 1] as const

export default function Hero() {
  return (
    <header className="hero" id="top">
      <div className="hero-bg" aria-hidden="true">
        <div
          className="hero-photo"
          style={{ backgroundImage: `url(${asset('assets/hero-cars.webp')})` }}
        />
        <div className="hero-scrim" />
        <div className="hero-halo" />
      </div>

      <div className="wrap hero-content">
        <motion.span
          className="eyebrow center"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.1 }}
        >
          Prywatny klub · Fastline Racing Academy
        </motion.span>

        <motion.img
          className="hero-logo"
          src={asset('assets/logo.webp')}
          alt="Fastline Paddock Club"
          initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.1, ease, delay: 0.2 }}
        />

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.45 }}
        >
          Wspólna pasja jest początkiem <em>każdej relacji</em>.
        </motion.h1>

        <motion.p
          className="hero-sub"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.6 }}
        >
          Prywatny klub dla osób, które łączy pasja do sportowych samochodów oraz
          wyjątkowy styl życia, jaki im towarzyszy.
        </motion.p>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.75 }}
        >
          <a className="btn btn-gold" href="#czlonkostwo">
            Zostań Członkiem <span className="btn-arrow">→</span>
          </a>
          <a className="btn" href="#klub">Poznaj Klub</a>
        </motion.div>
      </div>
    </header>
  )
}
