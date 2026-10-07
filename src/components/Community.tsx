import { useReveal } from '../lib/hooks'
import Chapter from './Chapter'
import { communityNums, copy } from '../content'

export default function Community() {
  const grid = useReveal<HTMLDivElement>()
  return (
    <section className="section community" id="spolecznosc">
      <div className="wrap">
        <Chapter no="V" label={copy.communityTitle} title={copy.communityH2} center />

        <div className="com-grid reveal" ref={grid}>
          {communityNums.map((c, i) => (
            <div className="com-num" key={c.label} style={{ transitionDelay: `${i * 120}ms` }}>
              <b>{c.n}</b>
              <span>{c.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
