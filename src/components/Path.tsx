import { useReveal } from '../lib/hooks'
import { pathSteps } from '../content'

export default function Path() {
  const head = useReveal<HTMLDivElement>()
  const list = useReveal<HTMLOListElement>()
  return (
    <section className="section path" id="sciezka">
      <div className="wrap">
        <div className="section-head reveal" ref={head}>
          <span className="eyebrow">Ścieżka członkostwa</span>
          <h2>Członkostwo, które rośnie razem z Tobą.</h2>
          <p>
            Regularny udział w szkoleniach, wyjazdach i projektach Fastline otwiera
            dostęp do kolejnych poziomów i coraz szerszego zakresu przywilejów.
          </p>
        </div>

        <ol className="path-list reveal" ref={list}>
          {pathSteps.map((s, i) => (
            <li className="path-step" key={s.stage}>
              <span className="path-num data">{String(i + 1).padStart(2, '0')}</span>
              <div className="path-body">
                <h3>{s.stage}</h3>
                <p>{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
