import { useReveal } from '../lib/hooks'
import { asset } from '../lib/asset'
import Chapter from './Chapter'
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
        <Chapter no="VII" label={copy.standardsTitle} center />
        <blockquote className="standards-quote">{copy.standardsQuote}</blockquote>
        <p className="standards-body">{copy.standards[0]}</p>
        <p className="standards-body">{copy.standards[1]}</p>
      </div>
    </section>
  )
}
