import { useEffect, useState } from 'react'

/** Tiny hash router: `#/admin/klienci/123` → ['admin', 'klienci', '123']. Works on static hosting. */
const parse = () => window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent)

export function useRoute() {
  const [route, setRoute] = useState(parse)
  useEffect(() => {
    const on = () => {
      setRoute(parse())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return route
}

export const go = (path: string) => {
  window.location.hash = '#/' + path.replace(/^\/+/, '')
}
export const href = (path: string) => '#/' + path.replace(/^\/+/, '')
