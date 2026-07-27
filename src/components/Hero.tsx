import { motion } from 'framer-motion'
import { asset } from '../lib/asset'
import { copy } from '../content'

const ease = [0.22, 1, 0.36, 1] as const
const up = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1.1, ease, delay },
})

export default function Hero() {
  return (
    <header className="hero" id="top">
      <div className="hero-bg" aria-hidden="true">
        <div
          className="hero-photo"
          data-parallax="110"
          style={{ backgroundImage: `url(${asset('assets/hero-cars.webp')})` }}
        />
        <div className="hero-scrim" />
      </div>

      <div className="wrap hero-content">
        <motion.span className="hero-eyebrow" {...up(0.25)}>
          Prywatny klub · Fastline Racing Academy
        </motion.span>

        <motion.h1 {...up(0.5)}>
          Wspólna <em>pasja</em> jest początkiem każdej relacji.
        </motion.h1>

        <motion.p className="hero-sub" {...up(0.68)}>
          {copy.heroSub}
        </motion.p>

        <motion.div className="hero-actions" {...up(0.84)}>
          <a className="btn btn-gold" href="#aplikuj">Zostań Członkiem</a>
          <a className="link-line" href="#klub">
            Poznaj Klub <span className="btn-arrow">↓</span>
          </a>
        </motion.div>
      </div>

      <motion.div
        className="hero-foot"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, ease, delay: 1.1 }}
      >
        <div className="wrap hero-foot-inner">
          <span>Est. MMXXVI</span>
          <span className="hero-cue" aria-hidden="true" />
          <span>Wyłącznie dla Członków</span>
        </div>
      </motion.div>
    </header>
  )
}
