import { useReveal } from '../lib/hooks'
import { asset } from '../lib/asset'
import { copy } from '../content'

export default function Ecosystem() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section className="section ecosystem" id="swiat">
      <div className="wrap reveal" ref={ref}>
        <div className="eco-grid">
          <div className="eco-photo-frame">
            <div
              className="eco-photo"
              data-parallax="90"
              style={{ backgroundImage: `url(${asset('assets/meet-2.webp')})` }}
              role="img"
              aria-label="Członkowie Fastline Paddock Club podczas zlotu supersamochodów"
            />
          </div>
          <div className="eco-copy" data-parallax="-40">
            <span className="eyebrow">{copy.ecoTitle}</span>
            <p className="eco-lead">{copy.eco[0]}</p>
            <p className="eco-soft">{copy.eco[1]}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
