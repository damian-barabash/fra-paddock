import { useEffect } from 'react'
import { prefersReducedMotion } from './hooks'

/**
 * Global scroll-parallax. Any element with `data-parallax="<speed>"` gets its
 * `--pary` CSS var updated on scroll (px). CSS then applies the transform.
 *
 * Two modes:
 *  - default: element translates relative to its own on-screen position
 *    (speed ≈ px of travel across one viewport).
 *  - `data-parallax-fixed`: element (usually position:fixed) drifts with raw
 *    scroll offset (speed is a small factor, e.g. 0.15–0.5).
 *
 * rAF-throttled, single listener, disabled under prefers-reduced-motion.
 */
export function useGlobalParallax() {
  useEffect(() => {
    if (prefersReducedMotion()) return
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'))
    if (!nodes.length) return
    let raf = 0
    const update = () => {
      raf = 0
      const vh = window.innerHeight
      const scrollY = window.scrollY
      for (const el of nodes) {
        const speed = parseFloat(el.dataset.parallax || '0')
        if (el.hasAttribute('data-parallax-fixed')) {
          el.style.setProperty('--pary', `${(-scrollY * speed).toFixed(1)}px`)
          continue
        }
        const r = el.getBoundingClientRect()
        const center = r.top + r.height / 2
        const progress = (center - vh / 2) / vh
        el.style.setProperty('--pary', `${(-progress * speed).toFixed(1)}px`)
      }
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])
}
