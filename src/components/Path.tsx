import { useReveal } from '../lib/hooks'
import { pathSteps, copy } from '../content'

export default function Path() {
  const head = useReveal<HTMLDivElement>()
  const list = useReveal<HTMLOListElement>()
  return (
    <section className="section path" id="sciezka">
      <div className="wrap">
        <div className="section-head reveal" ref={head}>
          <span className="eyebrow">{copy.pathTitle}</span>
          <p className="lead">{copy.pathLead}</p>
        </div>

        <ol className="path-list reveal" ref={list}>
          {pathSteps.map((s, i) => (
            <li className="path-step" key={s.stage} style={{ transitionDelay: `${i * 90}ms` }}>
              <span className="path-num data">{String(i + 1).padStart(2, '0')}</span>
              <div className="path-dot" aria-hidden="true" />
              <div className="path-body">
                <h3>{s.stage}</h3>
                <p>{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="path-note">{copy.pathNote}</p>
      </div>
    </section>
  )
}
