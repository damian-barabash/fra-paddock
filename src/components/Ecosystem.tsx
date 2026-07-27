import { useReveal } from '../lib/hooks'
import { asset } from '../lib/asset'
import Chapter from './Chapter'
import { copy } from '../content'

export default function Ecosystem() {
  const lead = useReveal<HTMLParagraphElement>()
  const band = useReveal<HTMLElement>({ threshold: 0.2 })
  const after = useReveal<HTMLParagraphElement>()
  return (
    <section className="section ecosystem" id="swiat">
      <div className="wrap">
        <Chapter no="II" label={copy.ecoTitle} />
        <p className="eco-lead reveal" ref={lead}>{copy.eco[0]}</p>
      </div>

      <figure className="eco-band" ref={band as React.RefObject<HTMLElement>}>
        <div
          className="eco-photo"
          data-parallax="90"
          style={{ backgroundImage: `url(${asset('assets/meet-2.webp')})` }}
          role="img"
          aria-label="Członkowie Fastline Paddock Club podczas zlotu supersamochodów"
        />
        <figcaption>
          <div className="wrap">
            <span>Świat doświadczeń Fastline</span>
          </div>
        </figcaption>
      </figure>

      <div className="wrap">
        <p className="eco-after reveal" ref={after}>{copy.eco[1]}</p>
      </div>
    </section>
  )
}
