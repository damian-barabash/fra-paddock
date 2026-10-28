import { useEffect, useState } from 'react'
import { EVENTS_BLOCK_DEFAULT, featuredEvent, isUpcoming, loadEventsBlock, sb, type ClubEvent, type EventsBlock } from '../api'
import { useSession } from '../session'
import { href } from '../router'
import Icon from '../ui/Icon'
import { fmtShort, fmtTime } from '../ui/format'

/** Panel Klubu → Wydarzenia: the club calendar and the settings of the block on top of the members' Paddock. */
export default function Events() {
  const [rows, setRows] = useState<ClubEvent[] | null>(null)
  const [tab, setTab] = useState<'next' | 'past' | 'all'>('next')

  useEffect(() => {
    sb.from('club_events').select('*').order('starts_at').then(({ data }) => setRows((data as ClubEvent[]) ?? []))
  }, [])

  const now = Date.now()
  const list = (rows ?? [])
    .filter((e) => (tab === 'all' ? true : tab === 'next' ? isUpcoming(e, now) : !isUpcoming(e, now)))
    .sort((a, b) => (tab === 'past' ? b.starts_at.localeCompare(a.starts_at) : a.starts_at.localeCompare(b.starts_at)))

  return (
    <div className="apage">
      <header className="apage-head">
        <div>
          <span className="eyebrow-line">Kalendarz Klubu</span>
          <h1>Wydarzenia</h1>
        </div>
        <div className="apage-actions">
          <a className="btn btn-gold" href={href('wydarzenia/nowe')}><Icon name="plus" size={16} /> Nowe wydarzenie</a>
        </div>
      </header>

      <BlockSettings events={rows ?? []} />

      <div className="seg">
        {([['next', 'Nadchodzące'], ['past', 'Minione'], ['all', 'Wszystkie']] as const).map(([k, l]) => (
          <button key={k} type="button" className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>

      {!rows ? <div className="skeleton" /> : list.length ? (
        <ul className="alist">
          {list.map((e) => (
            <li key={e.id}>
              <a href={href('wydarzenia/' + e.id)} className={e.published ? '' : 'off'}>
                <span className="alist-kind">{e.category || 'Wydarzenie'}</span>
                <span className="alist-main">
                  <b>{e.title}</b>
                  <small>
                    {fmtShort(e.starts_at)} · {fmtTime(e.starts_at)}
                    {e.ends_at && fmtShort(e.ends_at) !== fmtShort(e.starts_at) ? ` – ${fmtShort(e.ends_at)}` : ''}
                    {e.place ? ` · ${e.place}` : ''}
                    {e.post_id ? ' · z zaproszeniem' : ''}
                  </small>
                </span>
                <span className="alist-tag">{!e.published ? 'Szkic' : isUpcoming(e, now) ? 'W kalendarzu' : 'Minione'}</span>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty">{tab === 'past' ? 'Brak minionych wydarzeń.' : 'Brak wydarzeń. Dodaj pierwsze — pojawi się na górze Paddocku u członków.'}</p>
      )}
    </div>
  )
}

/** How the „Najbliższe wydarzenie” block looks for members. */
function BlockSettings({ events }: { events: ClubEvent[] }) {
  const { profile } = useSession()
  const [b, setB] = useState<EventsBlock | null>(null)
  const [saved, setSaved] = useState<EventsBlock | null>(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ t: string; err?: boolean } | null>(null)

  useEffect(() => {
    loadEventsBlock().then((v) => {
      setB(v)
      setSaved(v)
    })
  }, [])

  if (!b) return <section className="apanel"><div className="skeleton" /></section>
  const set = <K extends keyof EventsBlock>(k: K, v: EventsBlock[K]) => setB((x) => ({ ...x!, [k]: v }))
  const dirty = JSON.stringify(b) !== JSON.stringify(saved)
  const upcoming = events.filter((e) => e.published && isUpcoming(e)).sort((x, y) => x.starts_at.localeCompare(y.starts_at))
  const shown = featuredEvent(events, b)
  const chosenGone = b.mode === 'manual' && b.featured_id && !upcoming.some((e) => e.id === b.featured_id)

  const save = async () => {
    setBusy(true)
    setMsg(null)
    const value: EventsBlock = {
      ...b,
      title: b.title.trim() || EVENTS_BLOCK_DEFAULT.title,
      all_label: b.all_label.trim() || EVENTS_BLOCK_DEFAULT.all_label,
      featured_id: b.mode === 'manual' ? b.featured_id : null,
    }
    const { error } = await sb.from('club_settings').upsert({ key: 'events_block', value, updated_at: new Date().toISOString(), updated_by: profile!.id })
    setBusy(false)
    if (error) return setMsg({ t: 'Nie udało się zapisać ustawień.', err: true })
    setB(value)
    setSaved(value)
    setMsg({ t: 'Zapisano — członkowie zobaczą zmiany po odświeżeniu.' })
  }

  return (
    <section className="apanel ev-settings">
      <h2>Blok na górze Paddocku</h2>
      <p className="muted">
        {!b.enabled
          ? 'Blok jest wyłączony — członkowie go nie widzą.'
          : shown
            ? <>Teraz członkowie widzą: <b>{shown.title}</b> ({fmtShort(shown.starts_at)}).</>
            : 'Brak nadchodzących wydarzeń — blok się nie pokaże.'}
      </p>

      <div className="form ev-settings-form">
        <label className="check"><input type="checkbox" checked={b.enabled} onChange={(e) => set('enabled', e.target.checked)} /> Pokazuj blok „najbliższe wydarzenie”</label>

        <div className="seg">
          <button type="button" className={b.mode === 'auto' ? 'on' : ''} onClick={() => set('mode', 'auto')}>Najbliższe automatycznie</button>
          <button type="button" className={b.mode === 'manual' ? 'on' : ''} onClick={() => set('mode', 'manual')}>Wybrane wydarzenie</button>
        </div>
        {b.mode === 'manual' && (
          <div className="field">
            <label htmlFor="evb-f">Wydarzenie na górze</label>
            <div className="select-wrap">
              <select id="evb-f" value={b.featured_id ?? ''} onChange={(e) => set('featured_id', e.target.value || null)}>
                <option value="">— wybierz —</option>
                {upcoming.map((e) => <option key={e.id} value={e.id}>{fmtShort(e.starts_at)} · {e.title}</option>)}
              </select>
            </div>
            <small className="muted">{chosenGone ? 'Wybrane wydarzenie już minęło — pokazujemy najbliższe.' : 'Gdy wybrane wydarzenie minie, blok sam pokaże najbliższe.'}</small>
          </div>
        )}

        <div className="form-row">
          <div className="field">
            <label htmlFor="evb-t">Nagłówek bloku</label>
            <input id="evb-t" value={b.title} onChange={(e) => set('title', e.target.value)} placeholder={EVENTS_BLOCK_DEFAULT.title} />
          </div>
          <div className="field">
            <label htmlFor="evb-a">Mały przycisk</label>
            <input id="evb-a" value={b.all_label} onChange={(e) => set('all_label', e.target.value)} placeholder={EVENTS_BLOCK_DEFAULT.all_label} />
          </div>
        </div>
        <div className="checks">
          <label className="check"><input type="checkbox" checked={b.countdown} onChange={(e) => set('countdown', e.target.checked)} /> Odliczanie („za 12 dni”)</label>
          <label className="check"><input type="checkbox" checked={b.show_past} onChange={(e) => set('show_past', e.target.checked)} /> Pokazuj minione wydarzenia w kalendarzu</label>
        </div>

        <div className="row-actions">
          <button type="button" className="btn btn-gold" onClick={save} disabled={busy || !dirty}>{busy ? 'Zapisywanie…' : 'Zapisz ustawienia'}</button>
          {msg && <span className={`form-msg${msg.err ? ' err' : ''}`}>{msg.t}</span>}
        </div>
      </div>
    </section>
  )
}
