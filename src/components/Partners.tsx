import { useReveal } from '../lib/hooks'
import { asset } from '../lib/asset'
import Chapter from './Chapter'
import { copy } from '../content'

export default function Partners() {
  const grid = useReveal<HTMLDivElement>()
  return (
    <section className="section partners" id="partnerzy">
      <div className="wrap">
        <Chapter no="IX" label={copy.partnersTitle} />

        <div className="partners-grid reveal" ref={grid}>
          <div className="partners-frame">
            <div
              className="partners-photo"
              data-parallax="70"
              style={{ backgroundImage: `url(${asset('assets/meet-1.webp')})` }}
              role="img"
              aria-label="Wejście do Casino de Monte-Carlo wieczorem"
            />
          </div>
          <div className="partners-copy">
            <p>{copy.partners[0]}</p>
            <p>{copy.partners[1]}</p>
            <a className="btn" href="#aplikuj">
              Zostań Partnerem <span className="btn-arrow">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
