import { useReveal } from '../lib/hooks'
import { asset } from '../lib/asset'

export default function Partners() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section className="section partners" id="partnerzy">
      <div
        className="partners-photo"
        style={{ backgroundImage: `url(${asset('assets/meet-1.webp')})` }}
        aria-hidden="true"
      />
      <div className="partners-scrim" aria-hidden="true" />
      <div className="wrap reveal" ref={ref}>
        <div className="partners-inner">
          <span className="eyebrow">Partnerzy Klubu</span>
          <h2>Zostań częścią świata Fastline.</h2>
          <p>
            Zapraszamy do współpracy Partnerów, którzy chcą wspólnie tworzyć wyjątkowe
            doświadczenia dla Członków Klubu. Współpraca opiera się na wspólnych
            wartościach, najwyższej jakości i długofalowych relacjach.
          </p>
          <p className="partners-soft">
            Obecność w Fastline Paddock Club to szansa na budowanie relacji z wymagającą
            grupą klientów premium oraz naturalną obecność marki w świecie opartym na
            pasji, zaufaniu i jakości.
          </p>
          <a className="btn btn-gold" href="#aplikuj">
            Zostań Partnerem <span className="btn-arrow">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
