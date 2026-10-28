import E from './E'
import { asset } from '../lib/asset'
import { clubUrl, home, openApply } from '../lib/links'
import { useEditing } from '../lib/texts'

export default function Footer() {
  const editing = useEditing()
  const Btn = editing ? 'span' : 'button'
  return (
    <footer className="footer">
      <div className="wrap">
        <img className="footer-crest" src={asset('assets/logo.webp')} alt="Fastline Paddock Club" />
        <E as="p" className="footer-line" k="footer.line" def="Prywatny klub · Est. MMXXVI" plain />

        <nav className="footer-nav" aria-label="Stopka">
          <a href={home('#klub')}><E k="footer.about" def="O Klubie" plain /></a>
          <Btn type="button" onClick={editing ? undefined : openApply}><E k="footer.apply" def="Aplikuj" plain /></Btn>
          <a href={clubUrl}><E k="footer.login" def="Zaloguj" plain /></a>
        </nav>

        <div className="footer-bottom">
          <E k="footer.copy" def="© Fastline Events Sp. z o.o. · Greywolf Group · Warszawa" plain />
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
