import { useReveal } from '../lib/hooks'
import { asset } from '../lib/asset'
import Chapter from './Chapter'
import E from './E'
import { pathSteps, copy } from '../content'

const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']

export default function Path() {
  const list = useReveal<HTMLOListElement>()
  const note = useReveal<HTMLParagraphElement>()
  const photo = useReveal<HTMLDivElement>()
  return (
    <section className="section path" id="sciezka">
      <div className="wrap">
        <Chapter no="I" k="path.ch" label={copy.pathTitle} title={copy.pathH2} />

        <div className="path-grid">
          <div>
            <ol className="path-rows reveal" ref={list}>
              {pathSteps.map((s, i) => (
                <li className="path-row" key={s.stage} style={{ transitionDelay: `${i * 110}ms` }}>
                  <span className="path-no">{roman[i]}</span>
                  <E as="h3" k={`path.${i}.stage`} def={s.stage} plain />
                  <E as="p" k={`path.${i}.desc`} def={s.desc} />
                </li>
              ))}
            </ol>
            <E as="p" className="path-note reveal" ref={note} k="path.note" def={copy.pathNote} />
          </div>

          <figure className="path-aside">
            <div className="frame frame--still path-frame" ref={photo}>
              <div
                className="frame-photo"
                style={{ backgroundImage: `url(${asset('assets/path-amg.webp')})` }}
                role="img"
                aria-label="Zielony hypercar na nabrzeżu mariny na tle jachtów o zachodzie słońca"
              />
            </div>
            <E as="figcaption" className="photo-cap" k="path.cap" def="Marina · Golden hour" plain />
          </figure>
        </div>
      </div>
    </section>
  )
}
