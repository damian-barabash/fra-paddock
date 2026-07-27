import { useReveal } from '../lib/hooks'
import { asset } from '../lib/asset'
import Chapter from './Chapter'
import { copy } from '../content'

export default function Ecosystem() {
  const lead = useReveal<HTMLParagraphElement>()
  const band = useReveal<HTMLElement>({ threshold: 0.2 })
  const after = useReveal<HTMLParagraphElement>()
  const duo1 = useReveal<HTMLDivElement>()
  const duo2 = useReveal<HTMLDivElement>()
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
          style={{
            backgroundImage: `url(${asset('assets/meet-2.webp')})`,
            backgroundPosition: 'center 60%',
          }}
          role="img"
          aria-label="Czerwone Porsche 911 na ulicy Warszawy o zachodzie słońca"
        />
        <figcaption>
          <div className="wrap">
            <span>Warszawa · Dom Fastline</span>
          </div>
        </figcaption>
      </figure>

      <div className="wrap">
        <p className="eco-after reveal" ref={after}>{copy.eco[1]}</p>

        <div className="eco-duo">
          <figure>
            <div className="frame" ref={duo1}>
              <div
                className="frame-photo"
                data-parallax="50"
                style={{ backgroundImage: `url(${asset('assets/duo-1.webp')})` }}
                role="img"
                aria-label="Czarny samochód sportowy przed Pałacem Kultury i Nauki w Warszawie"
              />
            </div>
            <figcaption className="photo-cap">Warszawa · Pałac Kultury i Nauki</figcaption>
          </figure>
          <figure>
            <div className="frame" ref={duo2}>
              <div
                className="frame-photo"
                data-parallax="70"
                style={{ backgroundImage: `url(${asset('assets/duo-2.webp')})` }}
                role="img"
                aria-label="Dwa Ferrari przed Café de Paris w Monte-Carlo"
              />
            </div>
            <figcaption className="photo-cap">Café de Paris · Monte-Carlo</figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
