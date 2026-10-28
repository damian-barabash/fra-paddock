import { useCallback, useEffect, useState } from 'react'
import { sb } from '../api'
import { useSession } from '../session'
import { href } from '../router'
import Icon from '../ui/Icon'
import { fmtShort, fmtTime, memberNo } from '../ui/format'
import { refreshUnseen } from './unseen'

type Person = { full_name: string; email: string }
type Row = {
  id: string
  user_id: string
  kind: 'event' | 'offer'
  event_id: string | null
  post_id: string | null
  title: string
  starts_at: string | null
  link: string | null
  created_at: string
  profiles: (Person & { phone: string | null; member_no: number }) | null
  signup_views: { admin_id: string; seen_at: string; profiles: Person | null }[]
}

const when = (d: string) => `${fmtShort(d)}, ${fmtTime(d)}`
const who = (p: Person | null) => p?.full_name || p?.email || 'Admin'

/**
 * Members who pressed „Zapisz się” / „Zarezerwuj…”. „Nowe” is personal: each admin sees their own
 * unread ones, and every row says which admins have already looked at it.
 */
export default function Signups() {
  const { profile } = useSession()
  const me = profile!.id
  const [rows, setRows] = useState<Row[] | null>(null)
  const [open, setOpen] = useState<string | null>(null)

  const load = useCallback(async () => {
    const { data } = await sb
      .from('signups')
      .select('*, profiles!signups_user_id_fkey(full_name, email, phone, member_no), signup_views(admin_id, seen_at, profiles!signup_views_admin_id_fkey(full_name, email))')
      .order('created_at', { ascending: false })
      .limit(300)
    setRows((data as Row[]) ?? [])
  }, [])
  useEffect(() => {
    load()
  }, [load])

  const seenByMe = (r: Row) => r.signup_views.some((v) => v.admin_id === me)

  const markSeen = async (ids: string[]) => {
    if (!ids.length) return
    const now = new Date().toISOString()
    // show it at once, then save
    setRows((l) =>
      l!.map((r) =>
        ids.includes(r.id) && !seenByMe(r)
          ? { ...r, signup_views: [...r.signup_views, { admin_id: me, seen_at: now, profiles: { full_name: profile!.full_name, email: profile!.email } }] }
          : r,
      ),
    )
    await sb.from('signup_views').upsert(ids.map((id) => ({ signup_id: id, admin_id: me })), { onConflict: 'signup_id,admin_id', ignoreDuplicates: true })
    refreshUnseen()
  }

  const toggle = (r: Row) => {
    setOpen(open === r.id ? null : r.id)
    if (!seenByMe(r)) markSeen([r.id])
  }

  const remove = async (r: Row) => {
    if (!window.confirm(`Usunąć zgłoszenie: ${who(r.profiles)} — ${r.title}?`)) return
    await sb.from('signups').delete().eq('id', r.id)
    setRows((l) => l!.filter((x) => x.id !== r.id))
    refreshUnseen()
  }

  if (!rows) return <div className="skeleton" />
  const unseen = rows.filter((r) => !seenByMe(r))

  return (
    <>
      <div className="su-bar">
        <span>{unseen.length ? `${unseen.length} nowych dla Ciebie` : 'Wszystko przejrzane'}</span>
        {unseen.length > 0 && (
          <button type="button" className="btn" onClick={() => markSeen(unseen.map((r) => r.id))}>
            <Icon name="check" size={15} /> Oznacz wszystkie jako przejrzane
          </button>
        )}
      </div>
      {rows.length ? (
        <ul className="alist apps su-list">
          {rows.map((r) => {
            const mine = seenByMe(r)
            const others = r.signup_views.filter((v) => v.admin_id !== me)
            return (
              <li key={r.id} className={`${open === r.id ? 'open' : ''}${mine ? '' : ' su-new'}`}>
                <button type="button" onClick={() => toggle(r)}>
                  <span className={`alist-kind ${r.kind === 'offer' ? 'k-offer' : 'k-invitation'}`}>{r.kind === 'offer' ? 'Oferta' : 'Wydarzenie'}</span>
                  <span className="alist-main">
                    <b>{who(r.profiles)} <span className="su-arrow">→</span> {r.title}</b>
                    <small>
                      {when(r.created_at)}
                      {' · '}
                      {r.signup_views.length
                        ? `Widzieli: ${r.signup_views.map((v) => (v.admin_id === me ? 'Ty' : who(v.profiles))).join(', ')}`
                        : 'Nikt jeszcze nie widział'}
                    </small>
                  </span>
                  <span className="alist-tag">{mine ? fmtShort(r.created_at) : <i className="su-dot">Nowe</i>}</span>
                </button>
                {open === r.id && (
                  <div className="app-detail">
                    <dl className="facts">
                      <div><dt>Członek</dt><dd><a href={href('klienci/' + r.user_id)}>{who(r.profiles)}</a>{r.profiles ? ` · Nr ${memberNo(r.profiles.member_no)}` : ''}</dd></div>
                      {r.profiles?.email && <div><dt>E-mail</dt><dd><a href={`mailto:${r.profiles.email}`}>{r.profiles.email}</a></dd></div>}
                      {r.profiles?.phone && <div><dt>Telefon</dt><dd><a href={`tel:${r.profiles.phone}`}>{r.profiles.phone}</a></dd></div>}
                      <div><dt>{r.kind === 'offer' ? 'Oferta' : 'Wydarzenie'}</dt><dd>
                        {r.kind === 'event' && r.event_id ? <a href={href('wydarzenia/' + r.event_id)}>{r.title}</a> : r.kind === 'offer' && r.post_id ? <a href={href('tresci/' + r.post_id)}>{r.title}</a> : r.title}
                        {r.starts_at ? ` · ${r.kind === 'offer' ? 'ważna do ' : ''}${fmtShort(r.starts_at)}` : ''}
                      </dd></div>
                      <div><dt>Zgłoszenie</dt><dd>{when(r.created_at)}</dd></div>
                      <div><dt>Przejrzeli</dt><dd>
                        {r.signup_views.length ? (
                          <ul className="su-seen">
                            {[...r.signup_views].sort((a, b) => a.seen_at.localeCompare(b.seen_at)).map((v) => (
                              <li key={v.admin_id}><Icon name="eye" size={14} /> {v.admin_id === me ? 'Ty' : who(v.profiles)} · {when(v.seen_at)}</li>
                            ))}
                          </ul>
                        ) : '—'}
                        {!others.length && mine && <small className="muted"> Pozostali administratorzy jeszcze nie widzieli.</small>}
                      </dd></div>
                    </dl>
                    <div className="row-actions">
                      {r.profiles?.email && <a className="btn" href={`mailto:${r.profiles.email}`}><Icon name="mail" size={16} /> Napisz</a>}
                      {r.profiles?.phone && <a className="btn" href={`tel:${r.profiles.phone}`}><Icon name="phone" size={16} /> Zadzwoń</a>}
                      <button type="button" className="btn btn-danger" onClick={() => remove(r)}><Icon name="trash" size={16} /> Usuń</button>
                    </div>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="empty">Brak zapisów. Gdy członek kliknie „Zapisz się” przy wydarzeniu albo przycisk oferty, zgłoszenie pojawi się tutaj.</p>
      )}
    </>
  )
}
