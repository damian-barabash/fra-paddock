import { asset } from '../lib/asset'

export default function Footer() {
  const year = 2024
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-top">
          <div className="footer-brand">
            <img src={asset('assets/logo.webp')} alt="Fastline Paddock Club" />
            <p>
              Zamknięta loża właścicieli w ekosystemie Fastline. Padok, tor, rajdy
              i concierge — wyłącznie z zaproszenia.
            </p>
          </div>
          <div className="footer-col">
            <h4>Klub</h4>
            <a href="#klub">O Klubie</a>
            <a href="#czlonkostwo">Poziomy członkostwa</a>
            <a href="#przywileje">Przywileje</a>
            <a href="#zasady">Zasady i Regulamin</a>
            <a href="#aplikuj">Aplikuj</a>
          </div>
          <div className="footer-col">
            <h4>Kontakt</h4>
            <a href="mailto:klub@fastlineracingacademy.pl">klub@fastlineracingacademy.pl</a>
            <a href="https://fastlineracingacademy.pl" target="_blank" rel="noopener noreferrer">fastlineracingacademy.pl</a>
            <span>Polska</span>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {year}–2026 Fastline Paddock Club</span>
          <span>Członkostwo z zaproszenia</span>
        </div>
      </div>
    </footer>
  )
}
