import { useReveal } from '../lib/hooks'
import { pillars } from '../content'

export default function Pillars() {
  const head = useReveal<HTMLDivElement>()
  const grid = useReveal<HTMLDivElement>()
  return (
    <section className="section pillars" id="przywileje">
      <div className="wrap">
        <div className="section-head reveal" ref={head}>
          <span className="eyebrow">Przywileje członkostwa</span>
          <h2>Cztery filary wartości Klubu.</h2>
        </div>

        <div className="pillar-grid reveal" ref={grid}>
          {pillars.map((p, i) => (
            <article className="pillar-card" key={p.title}>
              <span className="pillar-idx data">{String(i + 1).padStart(2, '0')}</span>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
