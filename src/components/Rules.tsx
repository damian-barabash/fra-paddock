import { useReveal } from '../lib/hooks'
import Chapter from './Chapter'
import { rules, copy } from '../content'

export default function Rules() {
  const head = useReveal<HTMLDivElement>()
  const list = useReveal<HTMLUListElement>()
  return (
    <section className="section rules" id="zasady">
      <div className="wrap">
        <Chapter no="X" label={copy.zasadyTitle} title={copy.zasadyLead} />

        <div className="rules-grid" style={{ marginTop: 'clamp(4rem, 8vw, 6rem)' }}>
          <div className="rules-head reveal" ref={head}>
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
              {rules.map((r, i) => (
                <li key={r} style={{ '--i': i } as React.CSSProperties}>{r}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
