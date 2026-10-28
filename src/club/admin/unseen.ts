import { useEffect, useState } from 'react'
import { sb } from '../api'

/** Sign-ups the signed-in admin has not opened yet — the number on „Zgłoszenia” in the menu. */
const EVT = 'fpc:unseen'
export const refreshUnseen = () => window.dispatchEvent(new Event(EVT))

export function useUnseenSignups() {
  const [n, setN] = useState(0)
  useEffect(() => {
    let alive = true
    const load = () =>
      sb.rpc('unseen_signups').then(({ data }) => {
        if (alive && typeof data === 'number') setN(data)
      })
    load()
    const t = window.setInterval(load, 60_000)
    window.addEventListener(EVT, load)
    window.addEventListener('focus', load)
    return () => {
      alive = false
      clearInterval(t)
      window.removeEventListener(EVT, load)
      window.removeEventListener('focus', load)
    }
  }, [])
  return n
}
