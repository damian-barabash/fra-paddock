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
          {copy.heroEyebrow}
        </motion.span>

        <h1>
          {['Wspólna', 'pasja', 'jest', 'początkiem', 'wyjątkowych', 'relacji.'].map((w, i) => (
            <motion.span
              className="w"
              key={w}
              initial={{ opacity: 0, y: '0.55em', filter: 'blur(5px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1, ease, delay: 0.45 + i * 0.08 }}
            >
              {w === 'pasja' ? <em>pasja</em> : w}
            </motion.span>
          )).flatMap((el, i) => (i < 5 ? [el, ' '] : [el]))}
        </h1>

        <motion.p className="hero-sub" {...up(0.68)}>
          {copy.heroSub}
        </motion.p>

        <motion.p className="hero-claim" {...up(0.78)}>
          {copy.heroClaim}
        </motion.p>

        <motion.div className="hero-actions" {...up(0.84)}>
          <a className="btn btn-gold" href="#aplikuj">{copy.heroCta}</a>
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
