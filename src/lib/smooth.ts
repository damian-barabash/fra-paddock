import { useEffect } from 'react'
import Lenis from 'lenis'
import { prefersReducedMotion } from './hooks'

/**
 * Site-wide smooth scrolling (Lenis) + soft anchor navigation.
 * Lenis drives window scroll, so the existing reveal/parallax listeners
 * keep working untouched. Disabled under prefers-reduced-motion.
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return

    const lenis = new Lenis({
      duration: 1.35,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
      touchMultiplier: 1.4,
    })

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
      lenis.scrollTo(target, { offset: -76, duration: 1.7, easing: (t) => 1 - Math.pow(1 - t, 4) })
      history.pushState(null, '', href)
    }
    document.addEventListener('click', onClick)

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('click', onClick)
      lenis.destroy()
    }
  }, [])
}
