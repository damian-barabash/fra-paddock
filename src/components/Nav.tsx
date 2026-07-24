import { useScrolled } from '../lib/hooks'
import { asset } from '../lib/asset'

const links = [
  { href: '#klub', label: 'Klub' },
  { href: '#przywileje', label: 'Przywileje' },
  { href: '#doswiadczenia', label: 'Doświadczenia' },
  { href: '#karta', label: 'Karta' },
]

export default function Nav() {
  const scrolled = useScrolled(20)
  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
      <div className="wrap nav-inner">
        <a className="nav-brand" href="#top" aria-label="Fastline Paddock Club">
          <img src={asset('assets/logo.webp')} alt="Fastline Paddock Club" />
          <span>Paddock&nbsp;Club</span>
        </a>
        <div className="nav-links">
          {links.map((l) => (
            <a key={l.href} href={l.href}>{l.label}</a>
          ))}
        </div>
        <a className="nav-cta" href="#aplikuj">Aplikuj</a>
      </div>
    </nav>
  )
}
