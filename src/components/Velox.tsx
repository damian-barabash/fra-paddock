import { useReveal } from '../lib/hooks'
import Chapter from './Chapter'
import E from './E'
import { copy } from '../content'

export default function Velox() {
  const body = useReveal<HTMLParagraphElement>()
  return (
    <section className="section velox" id="fundacja">
      <div className="wrap">
        <Chapter no="VII" k="velox.ch" label={copy.veloxTitle} title={copy.veloxH2} center />
        <E
          as="p"
          className="velox-mission reveal"
          ref={body}
          k="velox.text"
          html="Fastline Paddock Club wspiera <strong>Fundację Velox Victoria</strong>, inicjatywę, która daje szansę następnemu pokoleniu mistrzów. Talent nie pyta o zaplecze. My też nie."
        />
      </div>
    </section>
  )
}
