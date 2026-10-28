import type { MemberData } from './ClientApp'
import Icon from '../ui/Icon'
import { sendOff, type SendInfo } from '../ui/SendOff'

/**
 * A sign-up button („Zapisz się”, „Zarezerwuj z rabatem” …). After sending it stays grey:
 * „Zgłoszenie wysłane” — the member's sign-ups are loaded with the rest of the zone, so it survives a reload.
 */
export default function SignupButton({
  data,
  info,
  label,
  className = 'btn btn-gold',
}: {
  data: MemberData
  info: SendInfo
  label: string
  className?: string
}) {
  if (data.signups.has(`${info.kind}:${info.ref}`)) {
    return (
      <span className={`${className} btn-sent`} role="status" aria-disabled="true">
        <Icon name="check" size={16} /> Zgłoszenie wysłane
      </span>
    )
  }
  return (
    <a
      className={className}
      href={info.url || '#'}
      target={info.url ? '_blank' : undefined}
      rel="noopener noreferrer"
      onClick={(e) => sendOff(e, info, () => data.markSigned(info.kind, info.ref))}
    >
      {label} <span className="btn-arrow">→</span>
    </a>
  )
}
