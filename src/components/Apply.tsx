import { useReveal } from '../lib/hooks'
import { asset } from '../lib/asset'
import Chapter from './Chapter'
import { copy, CONTACT_EMAIL } from '../content'
import ApplyForm from './ApplyForm'

export default function Apply() {
  const intro = useReveal<HTMLDivElement>()
  const band = useReveal<HTMLElement>({ threshold: 0.2 })
  const formWrap = useReveal<HTMLDivElement>()

  return (
    <section className="section apply" id="aplikacja">
      <figure className="eco-band apply-band" ref={band}>
        <div
          className="eco-photo"
          data-parallax="45"
          style={{ backgroundImage: `url(${asset('assets/road-fastline.webp')})`, backgroundPosition: 'center 76%' }}
          role="img"
          aria-label="Zielony supersamochód na Plaza de España w Sewilli o zachodzie słońca"
        />
        <figcaption>
          <div className="wrap">
            <span>Sewilla · Plaza de España</span>
          </div>
        </figcaption>
      </figure>
      <div className="wrap">
        <div className="apply-head reveal" ref={intro}>
          <Chapter no="IV" label={copy.applyTitle} center />
          <h2>{copy.applyH2}</h2>
          <p>{copy.applyLead}</p>
          <div className="apply-meta">
            <span>Rozpatrzenie 48h</span>
            <span>Miejsca limitowane</span>
            <span>{CONTACT_EMAIL}</span>
          </div>
        </div>

        <div className="reveal" ref={formWrap} id="aplikacja-form">
          <ApplyForm />
        </div>
      </div>
    </section>
  )
}
