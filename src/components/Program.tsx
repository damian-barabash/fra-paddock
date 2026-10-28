import { useReveal } from '../lib/hooks'
import Chapter from './Chapter'
import E from './E'
import { copy } from '../content'

export default function Program() {
  const lead = useReveal<HTMLParagraphElement>()
  return (
    <section className="section program" id="program">
      <div className="wrap">
        <Chapter no="II" k="refuel.ch" label={copy.refuelTitle} title={copy.refuelH2} />
        <E as="p" className="eco-after reveal" ref={lead} style={{ marginTop: '2.2rem' }} k="refuel.lead" def={copy.refuelLead} />

      </div>
    </section>
  )
}
