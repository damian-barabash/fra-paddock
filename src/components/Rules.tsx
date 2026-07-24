import { useReveal } from '../lib/hooks'
import { rules } from '../content'

export default function Rules() {
  const head = useReveal<HTMLDivElement>()
  const list = useReveal<HTMLUListElement>()
  return (
    <section className="section rules" id="zasady">
      <div className="wrap">
        <div className="rules-grid">
          <div className="section-head reveal" ref={head}>
            <span className="eyebrow">Zasady członkostwa</span>
            <h2>Przejrzyste reguły, wspólne standardy.</h2>
            <p>
              Klub funkcjonuje w oparciu o jasne zasady, których celem jest budowanie
              zaangażowanej społeczności i najwyższa jakość doświadczeń.
            </p>
            <a
              className="btn rules-download"
              href="#"
              onClick={(e) => e.preventDefault()}
              aria-disabled="true"
            >
              Pobierz Regulamin <span className="btn-arrow">↓</span>
            </a>
          </div>

          <ul className="rules-list reveal" ref={list}>
            {rules.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
