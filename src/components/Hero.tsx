import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { asset } from '../lib/asset'
import { prefersReducedMotion } from '../lib/hooks'
import { copy } from '../content'

const ease = [0.22, 1, 0.36, 1] as const

/** Copy starts to appear this long before the film ends (the light has settled by then). */
const TEXT_LEAD = 1.3
/** Give up waiting for the film if it has not started / finished by then. */
const START_TIMEOUT = 6000
const HARD_TIMEOUT = 12000

type Props = {
  /** Play the film as a preloader: copy stays hidden and the page locked until it ends. */
  intro: boolean
  onDone: () => void
}

export default function Hero({ intro, onDone }: Props) {
  const video = useRef<HTMLVideoElement>(null)
  const bar = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(!intro)
  // the lit final frame instead of the film (reduced motion, autoplay blocked, load failure)
  const [still, setStill] = useState(() => prefersReducedMotion())

  useEffect(() => {
    const v = video.current
    if (!v) return
    let raf = 0
    let finished = false
    const finish = () => {
      if (finished) return
      finished = true
      setShown(true)
      onDone()
    }
    const fail = () => {
      cancelAnimationFrame(raf)
      setStill(true)
      finish()
    }
    const tick = () => {
      const d = v.duration
      if (d > 0) {
        if (bar.current) bar.current.style.transform = `scaleX(${Math.min(1, v.currentTime / d)})`
        if (v.currentTime >= d - TEXT_LEAD) setShown(true)
      }
      if (!v.ended && v.isConnected) raf = requestAnimationFrame(tick)
    }

    v.muted = true
    v.addEventListener('ended', finish)
    v.addEventListener('error', fail)
    v.play().then(() => { raf = requestAnimationFrame(tick) }).catch(fail)
    const slow = window.setTimeout(() => { if (v.currentTime === 0) fail() }, START_TIMEOUT)
    const hard = window.setTimeout(finish, HARD_TIMEOUT)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(slow)
      clearTimeout(hard)
      v.removeEventListener('ended', finish)
      v.removeEventListener('error', fail)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (still) onDone()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [still])

  const rise = (delay: number) => ({
    initial: false as const,
    animate: shown || still ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
    transition: { duration: 1.1, ease, delay },
  })
  const visible = shown || still

  return (
    <header className={`hero${visible ? ' is-in' : ''}`} id="top">
      <div className="hero-stage" aria-hidden="true">
        {still ? (
          <img className="hero-film" src={asset('assets/preloader-end.webp')} alt="" />
        ) : (
          <video
            ref={video}
            className="hero-film"
            muted
            playsInline
            preload="auto"
            poster={asset('assets/preloader-start.webp')}
          >
            <source src={asset('assets/preloader.webm')} type="video/webm" />
            <source src={asset('assets/preloader.mp4')} type="video/mp4" />
          </video>
        )}
        <div className="hero-scrim" />
      </div>

      <div className="hero-side hero-side--l">
        <motion.span className="hero-eyebrow" {...rise(0)}>
          {copy.heroEyebrow}
        </motion.span>

        <h1>
          {['Wspólna', 'pasja', 'jest', 'początkiem', 'wyjątkowych', 'relacji.'].map((w, i) => (
            <motion.span
              className="w"
              key={w}
              initial={false}
              animate={
                visible
                  ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                  : { opacity: 0, y: '0.55em', filter: 'blur(5px)' }
              }
              transition={{ duration: 1, ease, delay: 0.12 + i * 0.08 }}
            >
              {w === 'pasja' ? <em>pasja</em> : w}
            </motion.span>
          )).flatMap((el, i) => (i < 5 ? [el, ' '] : [el]))}
        </h1>
      </div>

      <div className="hero-side hero-side--r">
        <motion.p className="hero-claim" {...rise(0.4)}>
          {copy.heroClaim}
        </motion.p>
        <motion.p className="hero-sub" {...rise(0.52)}>
          {copy.heroSub}
        </motion.p>
      </div>

      <motion.div className="hero-foot" {...rise(0.7)}>
        <span className="hero-note">Est. MMXXVI</span>
        <a className="btn btn-gold" href="#aplikuj">{copy.heroCta}</a>
        <i className="hero-foot-gap" aria-hidden="true" />
        <a className="link-line" href="#klub">
          Poznaj Klub <span className="btn-arrow">↓</span>
        </a>
        <span className="hero-note">Wyłącznie dla Członków</span>
      </motion.div>

      <span className="hero-progress" aria-hidden="true"><i ref={bar} /></span>
    </header>
  )
}
