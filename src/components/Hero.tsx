import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { asset } from '../lib/asset'
import { prefersReducedMotion } from '../lib/hooks'
import { copy } from '../content'
import { clubUrl, openApply } from '../lib/links'
import { usePublishedTexts, useEditing } from '../lib/texts'
import { cleanHtml, escapeHtml } from '../lib/richtext'
import E from './E'

const TITLE = 'Wspólna <em>pasja</em> jest początkiem wyjątkowych relacji.'

/** Split inline HTML into words for the staggered entrance; tags stay whole inside their word. */
function words(html: string): string[] {
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html')
  const out: string[] = []
  let cur = ''
  const flush = () => {
    if (cur) out.push(cur)
    cur = ''
  }
  doc.body.childNodes.forEach((n) => {
    if (n.nodeType === Node.TEXT_NODE) {
      ;(n.textContent ?? '').split(/(\s+)/).forEach((part) => {
        if (!part) return
        if (/^\s+$/.test(part)) flush()
        else cur += escapeHtml(part)
      })
    } else if (n.nodeType === Node.ELEMENT_NODE) {
      if ((n as Element).tagName === 'BR') {
        flush()
        out.push('<br>')
      } else cur += (n as Element).outerHTML
    }
  })
  flush()
  return out
}

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
  const editing = useEditing()
  const texts = usePublishedTexts()
  const title = useMemo(() => words(texts['hero.title'] ? cleanHtml(texts['hero.title']) : TITLE), [texts])
  const video = useRef<HTMLVideoElement>(null)
  const bar = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(!intro)
  // the lit final frame instead of the film (reduced motion, autoplay blocked, load failure, the editor)
  const [still, setStill] = useState(() => prefersReducedMotion() || editing)
  const Btn = editing ? 'span' : 'button'

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
          <E k="hero.eyebrow" def={copy.heroEyebrow} plain />
        </motion.span>

        {editing ? (
          <E as="h1" k="hero.title" html={TITLE} />
        ) : (
          <h1>
            {title.map((w, i) =>
              w === '<br>' ? (
                <br key={i} />
              ) : (
                <motion.span
                  className="w"
                  key={i + w}
                  initial={false}
                  animate={
                    visible
                      ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                      : { opacity: 0, y: '0.55em', filter: 'blur(5px)' }
                  }
                  transition={{ duration: 1, ease, delay: 0.12 + i * 0.08 }}
                  dangerouslySetInnerHTML={{ __html: w }}
                />
              ),
            ).flatMap((el, i) => (i < title.length - 1 ? [el, ' '] : [el]))}
          </h1>
        )}
      </div>

      <div className="hero-side hero-side--r">
        <motion.p className="hero-claim" {...rise(0.4)}>
          <E k="hero.claim" def={copy.heroClaim} />
        </motion.p>
        <motion.p className="hero-sub" {...rise(0.52)}>
          <E k="hero.sub" def={copy.heroSub} />
        </motion.p>
      </div>

      <motion.div className="hero-foot" {...rise(0.7)}>
        <E className="hero-note" k="hero.noteLeft" def="Est. MMXXVI" plain />
        <Btn type="button" className="btn btn-gold" onClick={editing ? undefined : openApply}>
          <E k="hero.cta" def={copy.heroCta} plain />
        </Btn>
        <i className="hero-foot-gap" aria-hidden="true" />
        <a className="link-line" href={clubUrl}>
          <E k="hero.login" def="Zaloguj" plain /> <span className="btn-arrow">→</span>
        </a>
        <E className="hero-note" k="hero.noteRight" def="Wyłącznie dla Członków" plain />
      </motion.div>

      <span className="hero-progress" aria-hidden="true"><i ref={bar} /></span>
    </header>
  )
}
