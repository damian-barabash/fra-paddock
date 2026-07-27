import { useReveal } from '../lib/hooks'
import Chapter from './Chapter'
import { pathSteps, copy } from '../content'

const roman = ['I', 'II', 'III', 'IV', 'V']

export default function Path() {
  const list = useReveal<HTMLOListElement>()
  const note = useReveal<HTMLParagraphElement>()
  return (
    <section className="section path" id="sciezka">
      <div className="wrap">
        <Chapter no="IV" label={copy.pathTitle} title={copy.pathLead} />

        <ol className="path-rows reveal" ref={list}>
          {pathSteps.map((s, i) => (
            <li className="path-row" key={s.stage} style={{ transitionDelay: `${i * 110}ms` }}>
              <span className="path-no">{roman[i]}</span>
              <h3>{s.stage}</h3>
              <p>{s.desc}</p>
            </li>
          ))}
        </ol>
        <p className="path-note reveal" ref={note}>{copy.pathNote}</p>
      </div>
    </section>
  )
}
