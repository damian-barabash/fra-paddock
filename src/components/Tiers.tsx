import { useReveal } from '../lib/hooks'
import Chapter from './Chapter'
import { tiers, copy } from '../content'

export default function Tiers() {
  const block = useReveal<HTMLDivElement>()
  const model = useReveal<HTMLDivElement>()
  return (
    <section className="section tiers" id="czlonkostwo">
      <div className="wrap">
        <Chapter no="III" label={copy.tiersTitle} title={copy.tiersLead} />

        <div className="tier-block reveal" ref={block}>
          {tiers.map((t) => {
            const featured = 'featured' in t && t.featured
            return (
              <a
                className={`tier-col${featured ? ' featured' : ''}`}
                key={t.key}
                href="#aplikuj"
              >
                <span className="tier-flag">{featured ? 'Najczęściej wybierany' : ' '}</span>
                <span className="tier-tagline">{t.tagline}</span>
                <h3>{t.name}</h3>
                <div className="tier-price">
                  {t.invite ? (
                    <span className="tier-invite">Na zaproszenie</span>
                  ) : (
                    <>
                      <span className="tier-amount">{t.price}</span>
                      <span className="tier-period">rocznie</span>
                    </>
                  )}
                </div>
                <p className="tier-desc">{t.desc}</p>
                <ul className="tier-features">
                  {t.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <span className="link-line tier-cta">
                  {t.invite ? 'Dowiedz się więcej' : 'Wybieram'} <span className="btn-arrow">→</span>
                </span>
              </a>
            )
          })}
        </div>

        <div className="model reveal" ref={model}>
          <span className="model-label">{copy.modelTitle}</span>
          <p>{copy.model}</p>
        </div>
      </div>
    </section>
  )
}
