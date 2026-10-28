import { useReveal } from '../lib/hooks'
import Chapter from './Chapter'
import E from './E'
import { rules, copy } from '../content'

export default function Rules() {
  const head = useReveal<HTMLDivElement>()
  const list = useReveal<HTMLUListElement>()
  return (
    <section className="section rules" id="zasady">
      <div className="wrap">
        <Chapter no="III" k="rules.ch" label={copy.zasadyTitle} title={copy.zasadyLead} />

        <div className="rules-grid" style={{ marginTop: 'clamp(4rem, 8vw, 6rem)' }}>
          <div className="rules-head reveal" ref={head}>
            <E as="p" className="rules-reg" k="rules.reg" def={copy.regulamin} />
            <a
              className="btn rules-download"
              href="#"
              onClick={(e) => e.preventDefault()}
              aria-disabled="true"
            >
              <E k="rules.download" def="Pobierz Regulamin" plain /> <span className="btn-arrow">↓</span>
            </a>
          </div>

          <div className="rules-col">
            <E as="h3" className="rules-h" k="rules.h" def="Najważniejsze informacje" plain />
            <ul className="rules-list reveal" ref={list}>
              {rules.map((r, i) => (
                <E as="li" key={r} style={{ '--i': i } as React.CSSProperties} k={`rules.${i}`} def={r} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
