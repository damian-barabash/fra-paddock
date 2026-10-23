import { useState } from 'react'
import type { Post, Rsvp } from '../api'
import Icon from '../ui/Icon'
import { fmtDate, fmtDay, fmtMonth, fmtTime, fmtWeekday, fmtYear } from '../ui/format'
import { asset } from '../../lib/asset'
import { href } from '../router'

/**
 * Personal invitation — the club's "printed card": double gold frame, engraved date,
 * crest seal and the answer right on the card.
 */
export default function InvitationCard({
  post,
  name,
  rsvp,
  onAnswer,
  base,
  full = false,
}: {
  post: Post
  name: string
  rsvp?: Rsvp
  onAnswer: (id: string, s: 'yes' | 'no') => Promise<void>
  base: string
  full?: boolean
}) {
  const [busy, setBusy] = useState<'' | 'yes' | 'no'>('')
  const [err, setErr] = useState('')
  const [change, setChange] = useState(false)
  const past = post.event_at ? new Date(post.event_end_at ?? post.event_at).getTime() < Date.now() : false
  const closed = past || (post.rsvp_until ? new Date(post.rsvp_until).getTime() < Date.now() : false)

  const answer = async (s: 'yes' | 'no') => {
    setErr('')
    setBusy(s)
    try {
      await onAnswer(post.id, s)
      setChange(false)
    } catch (e) {
      setErr((e as Error).message)
    } finally {
      setBusy('')
    }
  }

  const showButtons = !closed && (!rsvp || change)

  return (
    <article className={`invite${full ? ' invite--full' : ''}${past ? ' invite--past' : ''}`}>
      {post.cover_url && (
        <div className="invite-cover" style={{ backgroundImage: `url(${post.cover_url})` }} role="img" aria-label={post.title} />
      )}
      <div className="invite-paper">
        <span className="invite-corner tl" /><span className="invite-corner tr" />
        <span className="invite-corner bl" /><span className="invite-corner br" />

        <span className="invite-kicker">{post.audience === 'selected' ? 'Zaproszenie imienne' : 'Zaproszenie'}</span>
        {name && <p className="invite-for"><span>Gość</span><em>{name}</em></p>}
        <h3 className="invite-title">
          {full ? post.title : <a href={href(base + 'wpis/' + post.id)}>{post.title}</a>}
        </h3>
        {post.lead && <p className="invite-lead">{post.lead}</p>}

        {post.event_at && (
          <div className="invite-date">
            <span className="invite-wd">{fmtWeekday(post.event_at)}</span>
            <b className="invite-day">{fmtDay(post.event_at)}</b>
            <span className="invite-my">{fmtMonth(post.event_at)} {fmtYear(post.event_at)}</span>
            <span className="invite-hour">
              godz. {fmtTime(post.event_at)}
              {post.event_end_at ? ` – ${fmtTime(post.event_end_at)}` : ''}
            </span>
          </div>
        )}

        <ul className="invite-facts">
          {post.event_place && (
            <li><Icon name="pin" size={16} /> {post.event_place}</li>
          )}
          {post.dress_code && (
            <li><Icon name="sparkle" size={16} /> Dress code: {post.dress_code}</li>
          )}
          {post.rsvp_until && !past && (
            <li><Icon name="clock" size={16} /> Odpowiedź do {fmtDate(post.rsvp_until)}</li>
          )}
        </ul>

        <div className="invite-rsvp">
          {rsvp && !change && (
            <p className={`invite-state ${rsvp.status}`}>
              <Icon name={rsvp.status === 'yes' ? 'check' : 'x'} size={16} />
              {rsvp.status === 'yes' ? 'Potwierdzono obecność' : 'Odpowiedź: nie mogę'}
              {!closed && (
                <button type="button" onClick={() => setChange(true)}>Zmień</button>
              )}
            </p>
          )}
          {showButtons && (
            <div className="invite-btns">
              <button type="button" className="btn btn-gold" disabled={!!busy} onClick={() => answer('yes')}>
                {busy === 'yes' ? 'Zapisywanie…' : 'Będę'}
              </button>
              <button type="button" className="btn" disabled={!!busy} onClick={() => answer('no')}>
                {busy === 'no' ? 'Zapisywanie…' : 'Nie mogę'}
              </button>
            </div>
          )}
          {closed && !rsvp && <p className="invite-state">{past ? 'Wydarzenie zakończone' : 'Zapisy zamknięte'}</p>}
          {err && <p className="form-msg err">{err}</p>}
        </div>

        <div className="invite-seal" aria-hidden="true">
          <img src={asset('assets/logo.webp')} alt="" />
        </div>
      </div>
    </article>
  )
}
