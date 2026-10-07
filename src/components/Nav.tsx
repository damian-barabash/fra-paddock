import { useEffect, useState } from 'react'
import { useScrolled } from '../lib/hooks'
import { asset } from '../lib/asset'

const links = [
  { no: 'I', href: '#klub', label: 'Klub' },
  { no: 'IV', href: '#przywileje', label: 'Przywileje' },
  { no: 'IX', href: '#zasady', label: 'Zasady' },
  { no: 'X', href: '#aplikuj', label: 'Aplikacja' },
]

export default function Nav() {
  const scrolled = useScrolled(20)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
        <div className="wrap nav-inner">
          <button
            type="button"
            className={`nav-burger${open ? ' open' : ''}`}
            aria-label={open ? 'Zamknij menu' : 'Otwórz menu'}
            aria-expanded={open}
            aria-controls="menu-drawer"
            onClick={() => setOpen((v) => !v)}
          >
            <i /><i />
          </button>
          <a className="nav-brand" href="#top" aria-label="Fastline Paddock Club">
            <img src={asset('assets/logo.webp')} alt="Fastline Paddock Club" />
          </a>
          <a className="nav-cta" href="#aplikuj">Złóż aplikację</a>
        </div>
      </nav>

      <div
        className={`drawer-veil${open ? ' open' : ''}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <aside id="menu-drawer" className={`drawer${open ? ' open' : ''}`} aria-hidden={!open}>
        <span className="drawer-label">Fastline Paddock Club</span>
        <nav className="drawer-links">
          {links.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              style={{ transitionDelay: open ? `${0.16 + i * 0.06}s` : '0s' }}
              onClick={() => setOpen(false)}
            >
              <em>{l.no}</em>
              {l.label}
            </a>
          ))}
        </nav>
        <span className="drawer-foot">Est. MMXXVI · Wyłącznie dla Członków</span>
      </aside>
    </>
  )
}
