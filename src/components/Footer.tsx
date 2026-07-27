import { asset } from '../lib/asset'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <img className="footer-crest" src={asset('assets/logo.webp')} alt="Fastline Paddock Club" />
        <p className="footer-line">Prywatny klub · Est. MMXXVI</p>

        <nav className="footer-nav" aria-label="Stopka">
          <a href="#klub">O Klubie</a>
          <a href="#czlonkostwo">Członkostwo</a>
          <a href="#przywileje">Przywileje</a>
          <a href="#zasady">Zasady</a>
          <a href="#aplikuj">Aplikuj</a>
        </nav>

        <div className="footer-bottom">
          <span>© 2026 Fastline Paddock Club</span>
          <a href="mailto:klub@fastlineracingacademy.pl">klub@fastlineracingacademy.pl</a>
          <a href="https://fastlineracingacademy.pl" target="_blank" rel="noopener noreferrer">
            fastlineracingacademy.pl
          </a>
        </div>
      </div>
    </footer>
  )
}
