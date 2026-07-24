import { useReveal, useParallax } from '../lib/hooks'
import { asset } from '../lib/asset'
import { copy } from '../content'

export default function Partners() {
  const ref = useReveal<HTMLDivElement>()
  const photo = useParallax<HTMLDivElement>(70)
  return (
    <section className="section partners" id="partnerzy">
      <div
        className="partners-photo"
        ref={photo}
        style={{ backgroundImage: `url(${asset('assets/meet-1.webp')})` }}
        aria-hidden="true"
      />
      <div className="partners-scrim" aria-hidden="true" />
      <div className="wrap reveal" ref={ref}>
        <div className="partners-inner">
          <span className="eyebrow">{copy.partnersTitle}</span>
          <p className="partners-lead">{copy.partners[0]}</p>
          <p className="partners-soft">{copy.partners[1]}</p>
          <a className="btn btn-gold" href="#aplikuj">
            Zostań Partnerem <span className="btn-arrow">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
