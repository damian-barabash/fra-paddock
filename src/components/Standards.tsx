import { useReveal } from '../lib/hooks'
import { asset } from '../lib/asset'
import Chapter from './Chapter'
import E from './E'
import { copy } from '../content'

export default function Standards() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section className="section standards" id="standardy">
      <div
        className="standards-bg"
        data-parallax="90"
        style={{ backgroundImage: `url(${asset('assets/standards-bg.webp')})` }}
        aria-hidden="true"
      />
      <div className="standards-scrim" aria-hidden="true" />
      <div className="wrap reveal" ref={ref}>
        <Chapter no="V" k="standards.ch" label={copy.standardsTitle} center />
        <E as="blockquote" className="standards-quote" k="standards.quote" def={copy.standardsQuote} />
        <E as="p" className="standards-body" k="standards.p1" def={copy.standards[0]} />
        <E as="p" className="standards-body" k="standards.p2" def={copy.standards[1]} />
      </div>
    </section>
  )
}
