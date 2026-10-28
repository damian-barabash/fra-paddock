import { useReveal } from '../lib/hooks'
import E from './E'

/** Chapter header — the recurring document structure of the prospectus. `k` = text key prefix (CMS). */
export default function Chapter({
  no,
  k,
  label,
  title,
  center = false,
}: {
  no: string
  k: string
  label: string
  title?: string
  center?: boolean
}) {
  const ref = useReveal<HTMLElement>()
  return (
    <header className={`ch reveal${center ? ' center' : ''}`} ref={ref}>
      <div className="ch-rule">
        <span className="ch-no">{no}</span>
        <E className="ch-label" k={`${k}.label`} def={label} plain />
        {!center && <span className="ch-side">Fastline Paddock Club</span>}
      </div>
      {title && <E as="p" className="ch-title" k={`${k}.title`} def={title} />}
    </header>
  )
}
