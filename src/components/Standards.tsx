import { useReveal } from '../lib/hooks'
import Chapter from './Chapter'
import { copy } from '../content'

export default function Standards() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section className="section standards" id="standardy">
      <div className="wrap reveal" ref={ref}>
        <Chapter no="VIII" label={copy.standardsTitle} center />
        <blockquote className="standards-quote">{copy.standardsQuote}</blockquote>
        <p className="standards-body">{copy.standards[0]}</p>
        <p className="standards-body">{copy.standards[1]}</p>
      </div>
    </section>
  )
}
