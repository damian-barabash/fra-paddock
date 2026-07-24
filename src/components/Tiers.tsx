import { useReveal } from '../lib/hooks'
import { tiers } from '../content'

export default function Tiers() {
  const head = useReveal<HTMLDivElement>()
  const grid = useReveal<HTMLDivElement>()
  return (
    <section className="section tiers" id="czlonkostwo">
      <div className="wrap">
        <div className="section-head reveal" ref={head}>
          <span className="eyebrow">Poziomy członkostwa</span>
          <h2>Trzy poziomy zaangażowania w świat Fastline.</h2>
          <p>
            Każdy kolejny poziom rozszerza zakres przywilejów, zapewniając dostęp do
            nowych doświadczeń, projektów i możliwości.
          </p>
        </div>

        <div className="tier-grid reveal" ref={grid}>
          {tiers.map((t) => (
            <article className={`tier-card${'featured' in t && t.featured ? ' featured' : ''}`} key={t.key}>
              {'featured' in t && t.featured && <span className="tier-badge">Najczęściej wybierany</span>}
              <div className="tier-top">
                <span className="tier-tagline">{t.tagline}</span>
                <h3>{t.name}</h3>
                <div className="tier-price">
                  {t.invite ? (
                    <span className="tier-invite">Na zaproszenie</span>
                  ) : (
                    <>
                      <span className="tier-amount gold-text">{t.price}</span>
                      <span className="tier-period">{t.period}</span>
                    </>
                  )}
                </div>
                <p className="tier-desc">{t.desc}</p>
              </div>
              <ul className="tier-features">
                {t.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <a className={`btn ${t.invite ? '' : 'btn-gold'} tier-cta`} href="#aplikuj">
                {t.invite ? 'Dowiedz się więcej' : 'Wybieram'} <span className="btn-arrow">→</span>
              </a>
            </article>
          ))}
        </div>
        <p className="tiers-note">
          Model hybrydowy: roczne członkostwo łączy się z aktywnym uczestnictwem w
          świecie Fastline. Zakres przywilejów rozwija się wraz z Twoim zaangażowaniem.
        </p>
      </div>
    </section>
  )
}
