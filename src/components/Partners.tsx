import { useReveal } from '../lib/hooks'
import { asset } from '../lib/asset'
import Chapter from './Chapter'
import E from './E'
import { copy } from '../content'

export default function Partners() {
  const grid = useReveal<HTMLDivElement>()
  return (
    <section className="section partners" id="partnerzy">
      <div className="wrap">
        <Chapter no="VI" k="partners.ch" label={copy.partnersTitle} title={copy.partnersH2} />

        <div className="partners-grid reveal" ref={grid}>
          <figure style={{ margin: 0 }}>
            <div className="partners-frame">
              <div
                className="partners-photo"
                data-parallax="70"
                style={{ backgroundImage: `url(${asset('assets/meet-1.webp')})` }}
                role="img"
                aria-label="Kolekcjonerski garaż supersamochodów, auto pod pokrowcem"
              />
            </div>
            <E as="figcaption" className="photo-cap" k="partners.cap" def="Garaż kolekcjonerski" plain />
          </figure>
          <div className="partners-copy">
            <E as="p" k="partners.p1" def={copy.partners[0]} />
            <E as="p" k="partners.p2" def={copy.partners[1]} />
            <a className="btn" href={copy.partnersMail}>
              <E k="partners.cta" def={copy.partnersCta} plain /> <span className="btn-arrow">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
