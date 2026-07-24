import { useReveal } from '../lib/hooks'
import { rules, copy } from '../content'

export default function Rules() {
  const head = useReveal<HTMLDivElement>()
  const list = useReveal<HTMLUListElement>()
  return (
    <section className="section rules" id="zasady">
      <div className="wrap">
        <div className="rules-grid">
          <div className="section-head reveal" ref={head}>
            <span className="eyebrow">{copy.zasadyTitle}</span>
            <p className="lead">{copy.zasadyLead}</p>
            <p className="rules-reg">{copy.regulamin}</p>
            <a
              className="btn rules-download"
              href="#"
              onClick={(e) => e.preventDefault()}
              aria-disabled="true"
            >
              Pobierz Regulamin <span className="btn-arrow">↓</span>
            </a>
          </div>

          <div className="rules-col">
            <h3 className="rules-h">Najważniejsze informacje</h3>
            <ul className="rules-list reveal" ref={list}>
              {rules.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
