import { asset } from '../lib/asset'
import { clubUrl, home, openApply } from '../lib/links'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <img className="footer-crest" src={asset('assets/logo.webp')} alt="Fastline Paddock Club" />
        <p className="footer-line">Prywatny klub · Est. MMXXVI</p>

        <nav className="footer-nav" aria-label="Stopka">
          <a href={home('#klub')}>O Klubie</a>
          <button type="button" onClick={openApply}>Aplikuj</button>
          <a href={clubUrl}>Zaloguj</a>
        </nav>

        <div className="footer-bottom">
          <span>© Fastline Events Sp. z o.o. · Greywolf Group · Warszawa</span>
          <a href="mailto:paddock@fastlineracingacademy.pl">paddock@fastlineracingacademy.pl</a>
          <a href="https://fastlineracingacademy.pl" target="_blank" rel="noopener noreferrer">
            Fastline Racing Academy
          </a>
          <a
            href="https://fastlineracingacademy.pl/heels-on-the-track"
            target="_blank"
            rel="noopener noreferrer"
          >
            Heels on the Track
          </a>
        </div>
      </div>
    </footer>
  )
}
