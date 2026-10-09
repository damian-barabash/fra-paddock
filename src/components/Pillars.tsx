import { useReveal } from '../lib/hooks'
import { asset } from '../lib/asset'
import Chapter from './Chapter'
import { pillars, copy } from '../content'

const strip = [
  { img: 'assets/strip-1.webp', cap: 'Bolonia · Golden hour', alt: 'Czerwone Ferrari na ulicy Bolonii w świetle golden hour', still: true },
  { img: 'assets/strip-2.webp', cap: 'Ferrari · Kokpit', alt: 'Kierownica Ferrari z karbonu w ciepłym, złotym świetle', still: false },
  { img: 'assets/strip-3.webp', cap: 'Track Day · Zmierzch', alt: 'Czarne Porsche 911 GT3 ze złotym pasem na torze o zmierzchu, za nim kolumna aut', still: true },
] as const

export default function Pillars() {
  const grid = useReveal<HTMLDivElement>()
  const s0 = useReveal<HTMLDivElement>()
  const s1 = useReveal<HTMLDivElement>()
  const s2 = useReveal<HTMLDivElement>()
  const refs = [s0, s1, s2]
  return (
    <section className="section pillars" id="przywileje">
      <div className="wrap">
        <Chapter no="IV" label={copy.pillarsTitle} title={copy.pillarsH2} />

        <div className="pillar-grid reveal" ref={grid}>
          {pillars.map((p, i) => (
            <article className="pillar" key={p.title} style={{ transitionDelay: `${i * 100}ms` }}>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </article>
          ))}
        </div>

        <div className="pillar-strip">
          {strip.map((s, i) => (
            <figure key={s.img}>
              <div className={s.still ? 'frame frame--still frame--wide' : 'frame'} ref={refs[i]}>
                <div
                  className="frame-photo"
                  data-parallax={s.still ? undefined : String(40 + i * 15)}
                  style={{ backgroundImage: `url(${asset(s.img)})` }}
                  role="img"
                  aria-label={s.alt}
                />
              </div>
              <figcaption className="photo-cap">{s.cap}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
