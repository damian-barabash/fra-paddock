import { useReveal } from '../lib/hooks'
import Chapter from './Chapter'
import { tiers, copy } from '../content'

export default function Tiers() {
  const block = useReveal<HTMLDivElement>()
  const amb = useReveal<HTMLDivElement>()
  const note = useReveal<HTMLParagraphElement>()
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
                <span className="tier-flag"> </span>
                <span className="tier-tagline">{t.tagline}</span>
                <h3>{t.name}</h3>
                <div className="tier-price">
                  <span className="tier-amount">{t.price}</span>
                  <span className="tier-period">składka roczna</span>
                </div>
                <p className="tier-join-line">
                  {'invite' in t && t.invite ? <em className="gold-text">Wyłącznie na zaproszenie</em> : t.join}
                </p>
                <p className="tier-desc">{t.desc}</p>
                <ul className="tier-features">
                  {t.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <span className="link-line tier-cta">
                  Złóż aplikację <span className="btn-arrow">→</span>
                </span>
              </a>
            )
          })}
        </div>

        <div className="model reveal" ref={amb}>
          <span className="model-label">{copy.ambTitle}</span>
          <p>{copy.amb}</p>
        </div>

        <p className="tiers-note reveal" ref={note}>{copy.tiersNote}</p>
      </div>
    </section>
  )
}
