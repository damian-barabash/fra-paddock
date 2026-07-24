import { motion } from 'framer-motion'
import { asset } from '../lib/asset'

const stats = [
  { num: '150', lbl: 'Limit miejsc' },
  { num: '12', lbl: 'Tory partnerskie' },
  { num: '24/7', lbl: 'Concierge' },
  { num: '6', lbl: 'Rajdów rocznie' },
]

const ease = [0.22, 1, 0.36, 1] as const

export default function Hero() {
  return (
    <>
      <header className="hero" id="top">
        <div className="hero-bg" aria-hidden="true">
          <div className="hero-halo" />
          <div className="glowline" />
          <div className="hero-grid" />
        </div>

        <div className="wrap hero-content">
          <motion.div
            className="hero-tag"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.1 }}
          >
            <span className="eyebrow center">Wyłącznie z zaproszenia</span>
          </motion.div>

          <motion.img
            className="hero-logo"
            src={asset('assets/logo.webp')}
            alt="Fastline Paddock Club"
            initial={{ opacity: 0, y: 22, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.1, ease, delay: 0.2 }}
          />

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.45 }}
          >
            Życie po <em>właściwej</em> stronie bariery.
          </motion.h1>

          <motion.p
            className="hero-sub"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.6 }}
          >
            Zamknięta loża właścicieli Fastline. Padok bez granic, tor na wyłączność
            i rajdy, których nie znajdziesz w żadnym kalendarzu.
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.75 }}
          >
            <a className="btn btn-gold" href="#aplikuj">
              Aplikuj o członkostwo <span className="btn-arrow">→</span>
            </a>
            <a className="btn" href="#przywileje">Poznaj przywileje</a>
          </motion.div>
        </div>

        <div className="hero-scroll" aria-hidden="true">
          <span>Przewiń</span>
          <span className="line" />
        </div>
      </header>

      <div className="hero-stats">
        <div className="wrap">
          {stats.map((s) => (
            <div className="stat" key={s.lbl}>
              <div className="num gold-text">{s.num}</div>
              <div className="lbl">{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
