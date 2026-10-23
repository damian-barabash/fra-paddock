import { useState } from 'react'
import type { MemberData } from './ClientApp'
import type { FplSession, FplTrip } from '../api'
import Icon from '../ui/Icon'
import GoldCoin from '../ui/GoldCoin'
import { fmtDate, fmtDay, fmtMonth, fmtNum, fmtShort, plural } from '../ui/format'

const PROGRAMS: Record<string, string> = {
  PERFORMANCE_LAB: 'Performance Lab',
  DRIVER2RACER: 'Driver2Racer',
  SPORT_DRIVING: 'Sport Driving',
  HEELS_ON_TRACK: 'Heels on the Track',
}
const programName = (p: string, heels: boolean) =>
  heels ? 'Heels on the Track' : PROGRAMS[p] ?? p.toLowerCase().replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase())

type Item =
  | { kind: 'session'; date: string; s: FplSession }
  | { kind: 'trip'; date: string; t: FplTrip }

export default function History({ data }: { data: MemberData }) {
  const [tab, setTab] = useState<'events' | 'litres'>('events')
  const snap = data.snapshot
  const now = Date.now()

  const items: Item[] = [
    ...(snap?.sessions ?? []).filter((s) => s.status !== 'CANCELLED').map((s) => ({ kind: 'session' as const, date: s.date, s })),
    ...(snap?.trips ?? []).map((t) => ({ kind: 'trip' as const, date: t.startDate, t })),
  ].sort((a, b) => b.date.localeCompare(a.date))
  const upcoming = items.filter((i) => new Date(i.date).getTime() > now).reverse()
  const past = items.filter((i) => new Date(i.date).getTime() <= now)
  const byYear = past.reduce<Record<string, Item[]>>((m, i) => {
    const y = i.date.slice(0, 4)
    ;(m[y] ||= []).push(i)
    return m
  }, {})
  const attended = (snap?.sessions ?? []).filter((s) => s.attended || s.status === 'COMPLETED').length
  const trips = (snap?.trips ?? []).filter((t) => new Date(t.startDate).getTime() <= now).length

  return (
    <div className="page">
      <header className="page-head">
        <span className="eyebrow-line">Twoja historia</span>
        <h1>Na torze i w drodze.</h1>
      </header>

      <div className="stats">
        <div><b>{attended}</b><span>{plural(attended, 'szkolenie', 'szkolenia', 'szkoleń')}</span></div>
        <div><b>{trips}</b><span>{plural(trips, 'wyprawa', 'wyprawy', 'wypraw')}</span></div>
        <div className="stats-gl"><GoldCoin size={30} shine={false} /><b>{fmtNum(snap?.litres_balance ?? 0)}</b><span>Golden Liters</span></div>
      </div>

      <div className="seg" role="tablist">
        <button role="tab" aria-selected={tab === 'events'} className={tab === 'events' ? 'on' : ''} onClick={() => setTab('events')}>Wydarzenia</button>
        <button role="tab" aria-selected={tab === 'litres'} className={tab === 'litres' ? 'on' : ''} onClick={() => setTab('litres')}>Golden Liters</button>
      </div>

      {!snap?.found && !data.loading && (
        <p className="empty">
          {data.syncing ? 'Pobieramy Twoją historię z Performance Lab…' : 'Twoja historia z Fastline Performance Lab pojawi się tu po połączeniu konta.'}
        </p>
      )}

      {tab === 'events' && snap?.found && (
        <>
          {upcoming.length > 0 && (
            <section className="block">
              <h2 className="block-h"><span>Przed Tobą</span><i /></h2>
              <ol className="tl">{upcoming.map((i) => <Row key={i.kind + (i.kind === 'session' ? i.s.id : i.t.id)} i={i} soon />)}</ol>
            </section>
          )}
          {Object.keys(byYear).sort().reverse().map((y) => (
            <section className="block" key={y}>
              <h2 className="block-h"><span>{y}</span><i /></h2>
              <ol className="tl">{byYear[y].map((i) => <Row key={i.kind + (i.kind === 'session' ? i.s.id : i.t.id)} i={i} />)}</ol>
            </section>
          ))}
          {!items.length && <p className="empty">Brak wydarzeń w historii.</p>}
        </>
      )}

      {tab === 'litres' && snap?.found && (
        <section className="block">
          <p className="note">10 zł wydane w Fastline = 1 Golden Liter. Saldo pochodzi z Fastline Performance Lab.</p>
          <ol className="ledger">
            {snap.litres.map((l) => (
              <li key={l.id}>
                <span className="ledger-d">{fmtShort(l.createdAt)}</span>
                <span className="ledger-t">{l.kind === 'PAYMENT' ? 'Tankowanie z zakupu' : l.note || 'Korekta Klubu'}</span>
                <b className={l.amount < 0 ? 'neg' : ''}>{l.amount > 0 ? '+' : ''}{fmtNum(l.amount)}</b>
              </li>
            ))}
          </ol>
          {!snap.litres.length && <p className="empty">Jeszcze bez naliczeń.</p>}
        </section>
      )}
    </div>
  )
}

function Row({ i, soon = false }: { i: Item; soon?: boolean }) {
  if (i.kind === 'session') {
    const s = i.s
    return (
      <li className={`tl-row${soon ? ' soon' : ''}`}>
        <div className="tl-date"><b>{fmtDay(s.date)}</b><span>{fmtMonth(s.date).slice(0, 3)}</span></div>
        <div className="tl-body">
          <span className="tl-kind"><Icon name="flag" size={14} /> {programName(s.program, s.isHeels)}</span>
          <h3>{s.location}</h3>
          {s.cars.length > 0 && <p><Icon name="car" size={15} /> {s.cars.join(' · ')}</p>}
          {soon && <p className="tl-tag">Zapisano</p>}
        </div>
      </li>
    )
  }
  const t = i.t
  return (
    <li className={`tl-row trip${soon ? ' soon' : ''}`}>
      <div className="tl-date"><b>{fmtDay(t.startDate)}</b><span>{fmtMonth(t.startDate).slice(0, 3)}</span></div>
      <div className="tl-body">
        <span className="tl-kind"><Icon name="globe" size={14} /> Wyprawa</span>
        <h3>{t.title}</h3>
        <p><Icon name="pin" size={15} /> {t.city} · {fmtDate(t.startDate)} – {fmtDate(t.endDate)}</p>
      </div>
    </li>
  )
}
