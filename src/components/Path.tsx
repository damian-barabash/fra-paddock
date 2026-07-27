import { useReveal } from '../lib/hooks'
import { asset } from '../lib/asset'
import Chapter from './Chapter'
import { pathSteps, copy } from '../content'

const roman = ['I', 'II', 'III', 'IV', 'V']

export default function Path() {
  const list = useReveal<HTMLOListElement>()
  const note = useReveal<HTMLParagraphElement>()
  const photo = useReveal<HTMLDivElement>()
  return (
    <section className="section path" id="sciezka">
      <div className="wrap">
        <Chapter no="IV" label={copy.pathTitle} title={copy.pathLead} />

        <div className="path-grid">
          <div>
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

          <figure className="path-aside">
            <div className="frame path-frame" ref={photo}>
              <div
                className="frame-photo"
                data-parallax="55"
                style={{ backgroundImage: `url(${asset('assets/path-amg.webp')})` }}
                role="img"
                aria-label="Czarny samochód sportowy na tle jachtów w porcie Monako"
              />
            </div>
            <figcaption className="photo-cap">Monako · Port Hercule</figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
