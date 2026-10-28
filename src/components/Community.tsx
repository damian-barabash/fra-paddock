import { useReveal } from '../lib/hooks'
import Chapter from './Chapter'
import E from './E'
import { communityNums, copy } from '../content'

export default function Community() {
  const grid = useReveal<HTMLDivElement>()
  return (
    <section className="section community" id="spolecznosc">
      <div className="wrap">
        <Chapter no="IV" k="community.ch" label={copy.communityTitle} title={copy.communityH2} center />

        <div className="com-grid reveal" ref={grid}>
          {communityNums.map((c, i) => (
            <div className="com-num" key={c.label} style={{ transitionDelay: `${i * 120}ms` }}>
              <E as="b" k={`community.${i}.n`} def={c.n} plain />
              <E k={`community.${i}.label`} def={c.label} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
