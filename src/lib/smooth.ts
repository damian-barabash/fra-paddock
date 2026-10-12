import { useEffect, useLayoutEffect, useRef } from 'react'
import Lenis from 'lenis'
import { prefersReducedMotion } from './hooks'

/**
 * Site-wide smooth scrolling (Lenis) + soft anchor navigation.
 * Lenis drives window scroll, so the existing reveal/parallax listeners
 * keep working untouched. Disabled under prefers-reduced-motion.
 * While `locked` (hero film still playing) the page cannot be scrolled.
 */
export function useSmoothScroll(locked = false) {
  const instance = useRef<Lenis | null>(null)

  useLayoutEffect(() => {
    document.documentElement.classList.toggle('is-intro', locked)
    if (locked) instance.current?.stop()
    else instance.current?.start()
  }, [locked])

  useEffect(() => {
    if (prefersReducedMotion()) return

    const lenis = new Lenis({
      duration: 1.35,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
      touchMultiplier: 1.4,
    })
    instance.current = lenis
    if (document.documentElement.classList.contains('is-intro')) lenis.stop()

    let raf = requestAnimationFrame(function loop(time) {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    })

    // in-page anchors glide instead of jumping
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]')
      if (!a) return
      const href = a.getAttribute('href') || ''
      if (href.length < 2) return
      const target = document.querySelector<HTMLElement>(href)
      if (!target) return
      e.preventDefault()
      lenis.scrollTo(target, { offset: -102, duration: 1.7, easing: (t) => 1 - Math.pow(1 - t, 4) })
      history.pushState(null, '', href)
    }
    document.addEventListener('click', onClick)

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('click', onClick)
      lenis.destroy()
      instance.current = null
    }
  }, [])
}
