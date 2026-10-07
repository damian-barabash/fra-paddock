import { useReveal } from '../lib/hooks'
import Chapter from './Chapter'
import { copy } from '../content'

export default function Velox() {
  const body = useReveal<HTMLParagraphElement>()
  return (
    <section className="section velox" id="fundacja">
      <div className="wrap">
        <Chapter no="XI" label={copy.veloxTitle} title={copy.veloxH2} center />
        <p className="velox-mission reveal" ref={body}>
          FPC wspiera <strong>Fundację Velox Victoria</strong>, inicjatywę, która daje
          szansę następnemu pokoleniu mistrzów. Talent nie pyta o zaplecze. My też nie.
        </p>
      </div>
    </section>
  )
}
