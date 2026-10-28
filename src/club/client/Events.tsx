import { featuredEvent, isUpcoming, type ClubEvent } from '../api'
import type { MemberData } from './ClientApp'
import { href } from '../router'
import Icon from '../ui/Icon'
import RichContent from '../ui/RichContent'
import { fmtDay, fmtMonth, fmtTime, fmtWeekday, fmtYear, plural } from '../ui/format'
import { asset } from '../../lib/asset'
import { useSession } from '../session'
import { sendOff } from '../ui/SendOff'

const tz = 'Europe/Warsaw'
/** photo for events without their own: a car under a silk cover — „something is coming” */
const FALLBACK = 'assets/hero-cars.webp'
const dayKey = (d: Date) => new Intl.DateTimeFormat('en-CA', { timeZone: tz }).format(d) // 2026-11-14
const dayNo = (d: Date) => {
  const [y, m, dd] = dayKey(d).split('-').map(Number)
  return Date.UTC(y, m - 1, dd) / 864e5
}

/** „za 12 dni”, „Jutro”, „Dziś · 18:00”, „Trwa teraz”. */
export function countdown(e: ClubEvent, now = new Date()) {
  const start = new Date(e.starts_at)
  const end = new Date(e.ends_at ?? e.starts_at)
  if (start <= now && end >= now && e.ends_at) return 'Trwa teraz'
  const days = dayNo(start) - dayNo(now)
  if (days <= 0) return `Dziś · ${fmtTime(e.starts_at)}`
  if (days === 1) return `Jutro · ${fmtTime(e.starts_at)}`
  return `za ${days} ${plural(days, 'dzień', 'dni', 'dni')}`
}

/** „sobota, 14 listopada · 10:00” or a range „14–16 listopada” for multi-day events. */
export function whenLine(e: ClubEvent) {
  const t = whenRaw(e)
  return t.charAt(0).toUpperCase() + t.slice(1)
}
function whenRaw(e: ClubEvent) {
  const s = e.starts_at
  const multi = e.ends_at && dayKey(new Date(e.ends_at)) !== dayKey(new Date(s))
  if (multi) {
    const sameMonth = fmtMonth(s) === fmtMonth(e.ends_at!)
    return sameMonth
      ? `${fmtDay(s)}–${fmtDay(e.ends_at!)} ${monthGen(s)} ${fmtYear(s)}`
      : `${fmtDay(s)} ${monthGen(s)} – ${fmtDay(e.ends_at!)} ${monthGen(e.ends_at!)} ${fmtYear(e.ends_at!)}`
  }
  return `${fmtWeekday(s)}, ${fmtDay(s)} ${monthGen(s)} · ${fmtTime(s)}${e.ends_at ? `–${fmtTime(e.ends_at)}` : ''}`
}
/** month in the genitive, as Polish dates need („14 listopada”) */
const monthGen = (d: string) =>
  new Intl.DateTimeFormat('pl-PL', { day: 'numeric', month: 'long', timeZone: tz }).format(new Date(d)).replace(/^\d+\s*/, '')
const monthTitle = (d: string) =>
  new Intl.DateTimeFormat('pl-PL', { month: 'long', year: 'numeric', timeZone: tz }).format(new Date(d))

/** Where the main button of an event leads: its invitation (answer there), its own link, or the details. */
function primary(e: ClubEvent, base: string, data: MemberData) {
  // a named invitation is only visible to its guests — others get the link or the details
  if (e.post_id && data.posts.some((p) => p.id === e.post_id)) return { href: href(base + 'wpis/' + e.post_id), label: 'Zaproszenie', external: false }
  // a button with only a label just signs the member up (lands in Panel Klubu → Zgłoszenia)
  if (e.cta_url || e.cta_label) return { href: e.cta_url || '#', label: e.cta_label || 'Zapisz się', external: true }
  return { href: href(base + 'wydarzenia/' + e.id), label: 'Szczegóły', external: false }
}

/** What goes on the card in the envelope when a member signs up for an event. */
const signUp = (e: ClubEvent, profile: ReturnType<typeof useSession>['profile']) => ({
  kicker: 'Zgłoszenie',
  title: e.title,
  meta: whenLine(e) + (e.place ? ` · ${e.place}` : ''),
  name: profile?.full_name ?? '',
  memberNo: profile?.member_no,
  url: e.cta_url ?? '',
  kind: 'event' as const,
  ref: e.id,
})

/** The block on top of the Paddock: the nearest (or chosen) club event + a small „all events” button. */
export function NextEvent({ data, base }: { data: MemberData; base: string }) {
  const { profile } = useSession()
  const block = data.eventsBlock
  if (!block.enabled || data.loading) return null
  const e = featuredEvent(data.events, block)
  const all = (
    <a className="nev-all" href={href(base + 'wydarzenia')}>
      <Icon name="calendar" size={14} /> {block.all_label}
    </a>
  )
  if (!e) {
    // nothing ahead: keep only the way into the calendar, when there is anything to show there
    return data.events.length && block.show_past ? <div className="nev-empty"><span>{block.title}</span>{all}</div> : null
  }
  const go = primary(e, base, data)
  return (
    <section className="nev" aria-label={block.title}>
      <div className="nev-photo" style={{ backgroundImage: `url(${e.cover_url || asset(FALLBACK)})` }} aria-hidden="true" />
      <div className="nev-in">
        <div className="nev-top">
          <span className="nev-kicker">{block.title}</span>
          {all}
        </div>

        <a className="nev-main" href={href(base + 'wydarzenia/' + e.id)}>
          <div className="nev-date" aria-hidden="true">
            <b>{fmtDay(e.starts_at)}</b>
            <span>{fmtMonth(e.starts_at).slice(0, 3)}</span>
          </div>
          <div className="nev-text">
            {e.category && <span className="nev-cat">{e.category}</span>}
            <h2>{e.title}</h2>
            <p className="nev-when">{whenLine(e)}</p>
            {e.place && <p className="nev-place"><Icon name="pin" size={14} /> {e.place}</p>}
          </div>
        </a>

        <div className="nev-foot">
          {block.countdown && <span className="nev-count">{countdown(e)}</span>}
          <a
            className="btn btn-gold nev-cta"
            href={go.href}
            {...(go.external ? { target: '_blank', rel: 'noopener noreferrer', onClick: (ev: React.MouseEvent) => sendOff(ev, signUp(e, profile)) } : {})}
          >
            {go.label} <span className="btn-arrow">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}

function EventRow({ e, base, past }: { e: ClubEvent; base: string; past?: boolean }) {
  return (
    <li>
      <a className={`ev-row${past ? ' past' : ''}`} href={href(base + 'wydarzenia/' + e.id)}>
        <span className="ev-tile" aria-hidden="true">
          <b>{fmtDay(e.starts_at)}</b>
          <span>{fmtMonth(e.starts_at).slice(0, 3)}</span>
        </span>
        <span className="ev-main">
          {e.category && <span className="ev-cat">{e.category}</span>}
          <b>{e.title}</b>
          <small>{whenLine(e)}{e.place ? ` · ${e.place}` : ''}</small>
        </span>
        {!past && <span className="ev-count">{countdown(e)}</span>}
        <Icon name="arrow" size={16} />
      </a>
    </li>
  )
}

/** „Wszystkie wydarzenia” — the club calendar, upcoming by month and (optionally) the past ones. */
export function EventsPage({ data, base }: { data: MemberData; base: string }) {
  const now = Date.now()
  const list = data.events.filter((e) => e.published)
  const upcoming = list.filter((e) => isUpcoming(e, now)).sort((a, b) => a.starts_at.localeCompare(b.starts_at))
  const past = list.filter((e) => !isUpcoming(e, now)).sort((a, b) => b.starts_at.localeCompare(a.starts_at))
  const months: [string, ClubEvent[]][] = []
  upcoming.forEach((e) => {
    const m = monthTitle(e.starts_at)
    const last = months[months.length - 1]
    if (last && last[0] === m) last[1].push(e)
    else months.push([m, [e]])
  })

  return (
    <div className="page">
      <a className="back" href={href(base)}><Icon name="back" size={18} /> Paddock</a>
      <header className="page-head">
        <span className="eyebrow-line">Kalendarz Klubu</span>
        <h1>Wydarzenia <em>Fastline</em> Paddock Club.</h1>
      </header>

      {data.loading ? (
        <div className="skeleton" />
      ) : months.length ? (
        months.map(([m, evs]) => (
          <section className="block" key={m}>
            <h2 className="block-h"><span>{m}</span><i /></h2>
            <ul className="ev-list">{evs.map((e) => <EventRow key={e.id} e={e} base={base} />)}</ul>
          </section>
        ))
      ) : (
        <p className="empty">Kolejne wydarzenia Klubu pojawią się tutaj wkrótce.</p>
      )}

      {data.eventsBlock.show_past && past.length > 0 && (
        <section className="block">
          <h2 className="block-h"><span>Minione</span><i /></h2>
          <ul className="ev-list">{past.map((e) => <EventRow key={e.id} e={e} base={base} past />)}</ul>
        </section>
      )}
    </div>
  )
}

export function EventView({ id, data, base }: { id: string; data: MemberData; base: string }) {
  const { profile } = useSession()
  const e = data.events.find((x) => x.id === id)
  if (data.loading) return <div className="page"><div className="skeleton" /></div>
  if (!e) {
    return (
      <div className="page">
        <a className="back" href={href(base + 'wydarzenia')}><Icon name="back" size={18} /> Wydarzenia</a>
        <p className="empty">To wydarzenie nie jest już dostępne.</p>
      </div>
    )
  }
  const ahead = isUpcoming(e)
  const invite = e.post_id ? data.posts.find((p) => p.id === e.post_id) : undefined
  const answer = e.post_id ? data.rsvps[e.post_id] : undefined

  return (
    <article className="page post ev-view">
      <a className="back" href={href(base + 'wydarzenia')}><Icon name="back" size={18} /> Wydarzenia</a>
      <div className="post-cover" style={{ backgroundImage: `url(${e.cover_url || asset(FALLBACK)})` }} role="img" aria-label={e.title} />
      <header className="post-head">
        <span className="eyebrow-line">{e.category || 'Wydarzenie Klubu'}</span>
        <h1>{e.title}</h1>
        {e.lead && <p className="post-lead">{e.lead}</p>}
      </header>

      <ul className="ev-facts">
        <li><Icon name="calendar" size={16} /> {whenLine(e)}</li>
        {e.place && <li><Icon name="pin" size={16} /> {e.place}</li>}
        <li><Icon name="clock" size={16} /> {ahead ? countdown(e) : 'Wydarzenie zakończone'}</li>
        {answer && <li><Icon name={answer.status === 'yes' ? 'check' : 'x'} size={16} /> {answer.status === 'yes' ? 'Obecność potwierdzona' : 'Odpowiedź: nie mogę'}</li>}
      </ul>

      <RichContent html={e.body_html} className="post-body" />

      {ahead && (
        <div className="ev-actions">
          {invite && (
            <a className="btn btn-gold" href={href(base + 'wpis/' + invite.id)}>
              {answer ? 'Zobacz zaproszenie' : 'Odpowiedz na zaproszenie'} <span className="btn-arrow">→</span>
            </a>
          )}
          {(e.cta_url || e.cta_label) && (
            <a
              className={`btn${invite ? '' : ' btn-gold'}`}
              href={e.cta_url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(ev) => sendOff(ev, signUp(e, profile))}
            >
              {e.cta_label || 'Zapisz się'} <span className="btn-arrow">→</span>
            </a>
          )}
        </div>
      )}
    </article>
  )
}
