import { useEffect, useState } from 'react'
import { usePastHero } from '../lib/hooks'
import { asset } from '../lib/asset'
import { applyPage, home, isApplyPage } from '../lib/links'

// numbered items are chapters of the home page; the rest live on /aplikacja
const links = [
  { no: 'I', href: home('#klub'), label: 'Klub' },
  { no: 'III', href: home('#przywileje'), label: 'Przywileje' },
  { no: '', href: applyPage('#zasady'), label: 'Zasady' },
  { no: '', href: applyPage('#aplikacja'), label: 'Aplikacja' },
]

export default function Nav() {
  // the hero carries no menu — the bar slides in with the first chapter;
  // the application page has no hero, so the bar is always there
  const past = usePastHero() || isApplyPage
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
      <nav className={`nav scrolled${past || open ? '' : ' away'}`}>
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
          <a className="nav-brand" href={isApplyPage ? '../' : '#top'} aria-label="Fastline Paddock Club">
            <img src={asset('assets/logo.webp')} alt="Fastline Paddock Club" />
          </a>
          <a className="nav-cta" href={applyPage()}>Złóż aplikację</a>
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
              {l.no && <em>{l.no}</em>}
              {l.label}
            </a>
          ))}
        </nav>
        <span className="drawer-foot">Est. MMXXVI · Wyłącznie dla Członków</span>
      </aside>
    </>
  )
}
