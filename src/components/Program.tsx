import { useReveal } from '../lib/hooks'
import Chapter from './Chapter'
import { copy } from '../content'

export default function Program() {
  const lead = useReveal<HTMLParagraphElement>()
  return (
    <section className="section program" id="program">
      <div className="wrap">
        <Chapter no="VI" label={copy.refuelTitle} title={copy.refuelH2} />
        <p className="eco-after reveal" ref={lead} style={{ marginTop: '2.2rem' }}>
          {copy.refuelLead}
        </p>

      </div>
    </section>
  )
}
