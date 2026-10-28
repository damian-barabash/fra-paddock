import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useAnimate } from 'framer-motion'
import { asset } from '../../lib/asset'
import { prefersReducedMotion } from '../../lib/hooks'
import { memberNo } from './format'
import { sb } from '../api'

/**
 * „Sending the application”: a full-screen moment after a sign-up button (offer / event).
 * The member's card slides into a black envelope, the flap closes, a gold seal is pressed
 * and the envelope flies off to the right. Then the button's link opens.
 */
export type SendInfo = {
  /** small caps on the card, e.g. „Zgłoszenie” */
  kicker: string
  title: string
  /** date or validity line */
  meta?: string
  name: string
  memberNo?: number
  url: string
  /** what is being signed up for — recorded for Panel Klubu → Zgłoszenia */
  kind: 'event' | 'offer'
  ref: string
}

const EVT = 'fpc:sendoff'
const ease = [0.22, 1, 0.36, 1] as const
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

/**
 * Open the button's link after the animation. E-mail links are not opened (for now the sign-up
 * lands only in Panel Klubu); web links open in a new tab, or in this one if the browser blocks it.
 */
export function openLink(url: string) {
  if (!url || /^mailto:/i.test(url)) return
  if (/^tel:/i.test(url)) {
    window.location.href = url
    return
  }
  const w = window.open(url, '_blank')
  if (w) w.opener = null
  else window.location.href = url
}

/** Use as the button's onClick: plays the envelope, then follows the link. */
export function sendOff(e: React.MouseEvent, info: SendInfo) {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return // let „open in new tab” work as usual
  e.preventDefault()
  // the sign-up is saved right away (once per member and event/offer); the animation does not wait for it
  sb.rpc('club_signup', { p_kind: info.kind, p_ref: info.ref }).then(({ error }) => {
    if (error) console.warn('club_signup', error.message)
  })
  if (prefersReducedMotion()) return openLink(info.url)
  window.dispatchEvent(new CustomEvent<SendInfo>(EVT, { detail: info }))
}

/** Mount once in the members' app. */
export default function SendOffLayer() {
  const [info, setInfo] = useState<SendInfo | null>(null)
  useEffect(() => {
    const on = (e: Event) => setInfo((e as CustomEvent<SendInfo>).detail)
    window.addEventListener(EVT, on)
    return () => window.removeEventListener(EVT, on)
  }, [])
  return (
    <AnimatePresence>
      {info && <Run key={info.url + info.title} info={info} onDone={() => setInfo(null)} />}
    </AnimatePresence>
  )
}

function Run({ info, onDone }: { info: SendInfo; onDone: () => void }) {
  const [scope, animate] = useAnimate<HTMLDivElement>()
  const [phase, setPhase] = useState<'pack' | 'sent'>('pack')

  useEffect(() => {
    let alive = true
    const root = scope.current
    document.documentElement.classList.add('modal-open')
    ;(async () => {
      const flap = root.querySelector<HTMLElement>('.so-flap')!
      animate('.so-env', { opacity: [0, 1], y: [50, 0] }, { duration: 0.7, ease })
      await animate('.so-card', { opacity: [0, 1], y: ['-95%', '-78%'], scale: [0.9, 1] }, { duration: 0.8, ease, delay: 0.15 })
      await sleep(250)
      // the card slides into the pocket
      await animate('.so-card', { y: '4%' }, { duration: 0.85, ease: [0.65, 0, 0.35, 1] })
      if (!alive) return
      flap.style.zIndex = '5'
      await animate('.so-flap', { rotateX: [180, 0] }, { duration: 0.55, ease: [0.5, 0, 0.2, 1] })
      await animate('.so-seal', { scale: [0, 1.18, 1], opacity: [0, 1, 1] }, { duration: 0.5, ease })
      await sleep(200)
      setPhase('sent')
      // a short wind-up, then off to the right
      animate('.so-trail', { opacity: [0, 0.9, 0], scaleX: [0.2, 1, 1.4] }, { duration: 0.9, ease: 'easeIn', delay: 0.15 })
      await animate(
        '.so-env',
        { x: [0, -24, Math.round(window.innerWidth * 0.6 + 400)], y: [0, 6, -70], rotate: [0, -4, 9], scale: [1, 1.02, 0.86] },
        { duration: 1.05, times: [0, 0.22, 1], ease: [0.55, 0, 0.75, 0.2] },
      )
      await sleep(450)
      if (!alive) return
      openLink(info.url)
      await animate(root, { opacity: 0 }, { duration: 0.45 })
      onDone()
    })()
    return () => {
      alive = false
      document.documentElement.classList.remove('modal-open')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <motion.div
      ref={scope}
      className="so"
      role="status"
      aria-live="polite"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="so-stage">
        <i className="so-trail" aria-hidden="true" />
        <div className="so-env">
          <div className="so-back" />
          <div className="so-flap" aria-hidden="true" />
          <article className="so-card">
            <img src={asset('assets/logo.webp')} alt="" />
            <span className="so-kicker">{info.kicker}</span>
            <h3>{info.title}</h3>
            {info.meta && <p className="so-meta">{info.meta}</p>}
            <i className="so-rule" />
            <p className="so-who">
              <span>Członek</span>
              <em>{info.name}</em>
              {info.memberNo != null && <b>Nr {memberNo(info.memberNo)}</b>}
            </p>
          </article>
          <div className="so-front" aria-hidden="true">
            <svg viewBox="0 0 100 62" preserveAspectRatio="none">
              <path d="M0 0 L50 34 L100 0" fill="none" stroke="rgba(198,161,91,.55)" strokeWidth=".5" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>
          <div className="so-seal" aria-hidden="true"><img src={asset('assets/logo.webp')} alt="" /></div>
        </div>
      </div>
      <p className="so-msg">
        <AnimatePresence mode="wait">
          <motion.span key={phase} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.4 }}>
            {phase === 'pack' ? 'Przygotowujemy Twoje zgłoszenie…' : 'Wysłane. Do zobaczenia w Paddocku.'}
          </motion.span>
        </AnimatePresence>
      </p>
    </motion.div>
  )
}
