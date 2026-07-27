import type { ReactNode } from 'react'
import { useReveal } from '../lib/hooks'

/** Chapter header — the recurring document structure of the prospectus. */
export default function Chapter({
  no,
  label,
  title,
  center = false,
}: {
  no: string
  label: string
  title?: ReactNode
  center?: boolean
}) {
  const ref = useReveal<HTMLElement>()
  return (
    <header className={`ch reveal${center ? ' center' : ''}`} ref={ref}>
      <div className="ch-rule">
        <span className="ch-no">{no}</span>
        <span className="ch-label">{label}</span>
        {!center && <span className="ch-side">Fastline Paddock Club</span>}
      </div>
      {title && <p className="ch-title">{title}</p>}
    </header>
  )
}
