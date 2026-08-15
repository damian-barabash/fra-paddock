import { useReveal } from '../lib/hooks'
import { asset } from '../lib/asset'
import Chapter from './Chapter'
import { copy, ecoTiles } from '../content'

export default function Ecosystem() {
  const lead = useReveal<HTMLParagraphElement>()
  const band = useReveal<HTMLElement>({ threshold: 0.2 })
  const tiles = useReveal<HTMLDivElement>()
  const duo1 = useReveal<HTMLDivElement>()
  const duo2 = useReveal<HTMLDivElement>()
  return (
    <section className="section ecosystem" id="swiat">
      <div className="wrap">
        <Chapter no="II" label={copy.ecoTitle} title={copy.ecoH2} />
        <p className="eco-lead reveal" ref={lead}>{copy.ecoLead}</p>
      </div>

      <figure className="eco-band" ref={band as React.RefObject<HTMLElement>}>
        <div
          className="eco-photo"
          data-parallax="45"
          style={{
            backgroundImage: `url(${asset('assets/meet-2.webp')})`,
            backgroundPosition: 'center 78%',
          }}
          role="img"
          aria-label="Pomarańczowe Lamborghini na tle Pałacu Kultury i Nauki o zachodzie słońca"
        />
        <figcaption>
          <div className="wrap">
            <span>Warszawa · Dom Fastline</span>
          </div>
        </figcaption>
      </figure>

      <div className="wrap">
        <div className="eco-tiles reveal" ref={tiles}>
          {ecoTiles.map((t, i) => (
            <article className="eco-tile" key={t.name} style={{ transitionDelay: `${i * 100}ms` }}>
              <h3>{t.name}</h3>
              <p>{t.desc}</p>
            </article>
          ))}
        </div>

        <div className="eco-duo">
          <figure>
            <div className="frame frame--still" ref={duo1}>
              <div
                className="frame-photo"
                style={{ backgroundImage: `url(${asset('assets/duo-1.webp')})` }}
                role="img"
                aria-label="Czarny karbonowy hypercar przed Pałacem Kultury i Nauki nocą"
              />
            </div>
            <figcaption className="photo-cap">Warszawa · Pałac Kultury i Nauki</figcaption>
          </figure>
          <figure>
            <div className="frame frame--still" ref={duo2}>
              <div
                className="frame-photo"
                style={{ backgroundImage: `url(${asset('assets/duo-2.webp')})` }}
                role="img"
                aria-label="Trzy Ferrari na placu przed Casino de Monte-Carlo"
              />
            </div>
            <figcaption className="photo-cap">Monte-Carlo · Casino Square</figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
