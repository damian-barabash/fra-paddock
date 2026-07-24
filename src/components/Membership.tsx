import { useRef } from 'react'
import { useReveal, prefersReducedMotion } from '../lib/hooks'
import { asset } from '../lib/asset'

const perks = [
  'Imienna karta z indywidualnym numerem',
  'Priorytet zapisów na każdy rajd i dzień torowy',
  'Bezpośrednia linia do concierge Fastline',
  'Zaproszenia na zamknięte premiery i kolacje',
]

export default function Membership() {
  const copy = useReveal<HTMLDivElement>()
  const cardRef = useRef<HTMLDivElement>(null)
  const sheenRef = useRef<HTMLDivElement>(null)

  const onMove = (e: React.MouseEvent) => {
    const el = cardRef.current
    if (!el || prefersReducedMotion()) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    const rx = (0.5 - py) * 16
    const ry = (px - 0.5) * 20
    el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`
    if (sheenRef.current) {
      sheenRef.current.style.transform = `translateX(${(px - 0.5) * 40}%)`
      sheenRef.current.style.opacity = '1'
    }
  }
  const onLeave = () => {
    const el = cardRef.current
    if (!el) return
    el.style.transform = 'rotateX(0deg) rotateY(0deg)'
    if (sheenRef.current) sheenRef.current.style.opacity = '0'
  }

  return (
    <section className="member carbon" id="karta">
      <div className="wrap">
        <div className="member-copy reveal" ref={copy}>
          <span className="eyebrow">Karta członkowska</span>
          <h2>Kawałek karbonu, który otwiera bariery.</h2>
          <p>
            Nie plastik z paskiem magnetycznym. Karta Paddock Club to obiekt —
            karbon, złocony grawer i numer, który zostaje z Tobą na zawsze.
          </p>
          <ul className="member-list">
            {perks.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <a className="btn btn-gold" href="#aplikuj">
            Zdobądź swoją kartę <span className="btn-arrow">→</span>
          </a>
        </div>

        <div className="card-stage">
          <div
            className="card-3d"
            ref={cardRef}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
          >
            <div className="card-face">
              <div className="card-sheen" ref={sheenRef} style={{ opacity: 0 }} />
              <div className="card-top">
                <img src={asset('assets/logo.webp')} alt="" aria-hidden="true" />
                <span className="card-chip" aria-hidden="true" />
              </div>
              <div className="card-mid">
                <div className="card-label">Członek</div>
                <div className="card-name">Twoje imię</div>
              </div>
              <div className="card-bottom">
                <span className="card-no data">FPC · 0074</span>
                <span className="card-tier">Founding Member</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
