import { useReveal } from '../lib/hooks'
import Chapter from './Chapter'
import { pillars, copy } from '../content'

export default function Pillars() {
  const grid = useReveal<HTMLDivElement>()
  return (
    <section className="section pillars" id="przywileje">
      <div className="wrap">
        <Chapter no="V" label={copy.pillarsTitle} />

        <div className="pillar-grid reveal" ref={grid}>
          {pillars.map((p, i) => (
            <article className="pillar" key={p.title} style={{ transitionDelay: `${i * 100}ms` }}>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
