import { useReveal, prefersReducedMotion } from '../lib/hooks'
import { tiers, copy } from '../content'

export default function Tiers() {
  const head = useReveal<HTMLDivElement>()
  const grid = useReveal<HTMLDivElement>()
  const model = useReveal<HTMLDivElement>()

  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (prefersReducedMotion()) return
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    el.style.setProperty('--rx', `${(-py * 6).toFixed(2)}deg`)
    el.style.setProperty('--ry', `${(px * 7).toFixed(2)}deg`)
    el.style.setProperty('--mx', `${(px * 100 + 50).toFixed(1)}%`)
    el.style.setProperty('--my', `${(py * 100 + 50).toFixed(1)}%`)
  }
  const onLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }
  return (
    <section className="section tiers" id="czlonkostwo">
      <div className="wrap">
        <div className="section-head reveal" ref={head}>
          <span className="eyebrow">{copy.tiersTitle}</span>
          <p className="lead">{copy.tiersLead}</p>
        </div>

        <div className="tier-grid reveal" ref={grid}>
          {tiers.map((t) => (
            <a
              className={`tier-card${'featured' in t && t.featured ? ' featured' : ''}`}
              key={t.key}
              href="#aplikuj"
              onMouseMove={onMove}
              onMouseLeave={onLeave}
            >
              <span className="tier-glow" aria-hidden="true" />
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
              <span className={`btn ${t.invite ? '' : 'btn-gold'} tier-cta`}>
                {t.invite ? 'Dowiedz się więcej' : 'Wybieram'} <span className="btn-arrow">→</span>
              </span>
            </a>
          ))}
        </div>

        <div className="model reveal" ref={model}>
          <span className="model-label">{copy.modelTitle}</span>
          <p>{copy.model}</p>
        </div>
      </div>
    </section>
  )
}
