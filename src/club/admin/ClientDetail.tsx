import { useEffect, useState } from 'react'
import { callFn, sb, syncFpl, type Post, type Profile, type Rsvp, type Snapshot } from '../api'
import { go, href } from '../router'
import Icon from '../ui/Icon'
import GoldCoin from '../ui/GoldCoin'
import { fmtDate, fmtNum, fmtShort, makePassword, memberNo, shownEmail } from '../ui/format'

type RsvpRow = Rsvp & { posts: Pick<Post, 'id' | 'title' | 'event_at'> | null }

export default function ClientDetail({ id }: { id: string }) {
  const [p, setP] = useState<Profile | null | undefined>()
  const [snap, setSnap] = useState<Snapshot | null>(null)
  const [rsvps, setRsvps] = useState<RsvpRow[]>([])
  const [f, setF] = useState({ full_name: '', email: '', phone: '', fpl_email: '' })
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null)
  const [busy, setBusy] = useState('')
  const [newPass, setNewPass] = useState('')

  const load = async () => {
    const [a, b, c] = await Promise.all([
      sb.from('profiles').select('*').eq('id', id).maybeSingle(),
      sb.from('fpl_snapshots').select('*').eq('user_id', id).maybeSingle(),
      sb.from('rsvps').select('*, posts(id, title, event_at)').eq('user_id', id).order('responded_at', { ascending: false }),
    ])
    const prof = (a.data as Profile) ?? null
    setP(prof)
    if (prof) setF({ full_name: prof.full_name, email: shownEmail(prof.email), phone: prof.phone ?? '', fpl_email: prof.fpl_email ?? '' })
    setSnap((b.data as Snapshot) ?? null)
    setRsvps((c.data as RsvpRow[]) ?? [])
  }
  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const run = async (key: string, fn: () => Promise<string | void>) => {
    setMsg(null)
    setBusy(key)
    try {
      const t = await fn()
      if (t) setMsg({ ok: true, t })
    } catch (e) {
      setMsg({ ok: false, t: (e as Error).message })
    } finally {
      setBusy('')
    }
  }

  if (p === undefined) return <div className="apage"><div className="skeleton" /></div>
  if (p === null) return <div className="apage"><p className="empty">Nie znaleziono konta.</p></div>

  const save = (e: React.FormEvent) => {
    e.preventDefault()
    run('save', async () => {
      // phone-only member: an empty e-mail field keeps the internal login address
      const email = f.email.trim() && f.email.trim() !== shownEmail(p.email) ? f.email : undefined
      await callFn('admin-users', { action: 'update', id, ...f, email })
      await load()
      return 'Zapisano.'
    })
  }

  const sync = () =>
    run('sync', async () => {
      const r = await syncFpl({ user_id: id })
      if (!r.configured) return 'Połączenie z Performance Lab nie jest jeszcze skonfigurowane.'
      await load()
      const res = r.results?.[0]
      if (res?.error) throw new Error('Performance Lab nie odpowiada: ' + res.error)
      return res?.found ? 'Dane z Performance Lab pobrane.' : 'Nie znaleziono konta w Performance Lab — sprawdź e-mail.'
    })

  const setPassword = () =>
    run('pass', async () => {
      const pw = newPass || makePassword()
      await callFn('admin-users', { action: 'set_password', id, password: pw })
      setNewPass(pw)
      return `Nowe hasło: ${pw}`
    })

  const toggleBlock = () =>
    run('block', async () => {
      await callFn('admin-users', { action: 'update', id, disabled: !p.disabled })
      await load()
      return p.disabled ? 'Konto odblokowane.' : 'Konto zablokowane.'
    })

  const remove = () => {
    if (!window.confirm(`Usunąć konto ${p.full_name || shownEmail(p.email) || p.phone}? Tej operacji nie można cofnąć.`)) return
    run('del', async () => {
      await callFn('admin-users', { action: 'delete', id })
      go(p.role === 'admin' ? 'admini' : '')
    })
  }

  return (
    <div className="apage">
      <a className="back" href={href(p.role === 'admin' ? 'admini' : '')}><Icon name="back" size={18} /> {p.role === 'admin' ? 'Administratorzy' : 'Klienci'}</a>
      <header className="apage-head">
        <div>
          <span className="eyebrow-line">{p.role === 'admin' ? 'Administrator' : `Członek nr ${memberNo(p.member_no)}`}</span>
          <h1>{p.full_name || shownEmail(p.email) || p.phone}</h1>
          <p className="muted">
            Od {fmtDate(p.member_since)} · {p.disabled ? 'zablokowany' : p.welcome_seen_at ? `pierwsze logowanie ${fmtShort(p.welcome_seen_at)}` : 'jeszcze się nie logował'}
          </p>
        </div>
      </header>
      {msg && <p className={`note ${msg.ok ? '' : 'err'}`}>{msg.t}</p>}

      <div className="agrid">
        <section className="apanel">
          <h2>Dane</h2>
          <form className="form" onSubmit={save}>
            <div className="field"><label htmlFor="cd-n">Imię i nazwisko</label><input id="cd-n" value={f.full_name} onChange={(e) => setF({ ...f, full_name: e.target.value })} /></div>
            <div className="field"><label htmlFor="cd-e">E-mail (login)</label><input id="cd-e" type="email" value={f.email} placeholder="brak — logowanie telefonem" onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
            <div className="field"><label htmlFor="cd-p">Telefon <small>(też login: 9 cyfr)</small></label><input id="cd-p" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></div>
            {p.role === 'client' && (
              <div className="field"><label htmlFor="cd-f">E-mail w Performance Lab</label><input id="cd-f" type="email" value={f.fpl_email} placeholder="ten sam co login" onChange={(e) => setF({ ...f, fpl_email: e.target.value })} /></div>
            )}
            <button className="btn btn-gold" type="submit" disabled={busy === 'save'}>{busy === 'save' ? 'Zapisywanie…' : 'Zapisz'}</button>
          </form>
        </section>

        {p.role === 'client' && (
          <section className="apanel">
            <h2>Performance Lab</h2>
            <div className="gl-big">
              <GoldCoin size={52} />
              <div>
                <b>{fmtNum(snap?.litres_balance ?? 0)}</b>
                <span>Golden Liters</span>
              </div>
            </div>
            <p className="muted">
              {snap?.synced_at
                ? `${snap.found ? 'Połączone' : 'Brak konta o tym e-mailu'} · sync ${fmtShort(snap.synced_at)}`
                : 'Jeszcze nie synchronizowano.'}
              {snap?.error ? ` · ostatni błąd: ${snap.error}` : ''}
            </p>
            <button type="button" className="btn" onClick={sync} disabled={busy === 'sync'}>
              <Icon name="refresh" size={16} /> {busy === 'sync' ? 'Pobieranie…' : 'Pobierz z Performance Lab'}
            </button>
            {snap?.found && (
              <ul className="mini-list">
                <li><span>Szkolenia</span><b>{snap.sessions.length}</b></li>
                <li><span>Wyprawy</span><b>{snap.trips.length}</b></li>
                <li><span>Ostatnie szkolenie</span><b>{snap.sessions[0] ? `${fmtShort(snap.sessions[0].date)} · ${snap.sessions[0].location}` : '—'}</b></li>
              </ul>
            )}
          </section>
        )}

        {p.role === 'client' && (
          <section className="apanel">
            <h2>Odpowiedzi na zaproszenia</h2>
            {rsvps.length ? (
              <ul className="mini-list">
                {rsvps.map((r) => (
                  <li key={r.post_id}>
                    <a href={href('tresci/' + r.post_id)}>{r.posts?.title ?? 'Zaproszenie'}</a>
                    <b className={r.status === 'yes' ? 'yes' : 'no'}>{r.status === 'yes' ? 'Będzie' : 'Nie może'}</b>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted">Brak odpowiedzi.</p>
            )}
          </section>
        )}

        <section className="apanel">
          <h2>Dostęp</h2>
          <div className="field">
            <label htmlFor="cd-pw">Nowe hasło <small>(puste = wygeneruj)</small></label>
            <input id="cd-pw" className="mono" value={newPass} onChange={(e) => setNewPass(e.target.value)} />
          </div>
          <div className="row-actions">
            <button type="button" className="btn" onClick={setPassword} disabled={busy === 'pass'}><Icon name="key" size={16} /> Ustaw hasło</button>
            <button type="button" className="btn" onClick={toggleBlock} disabled={busy === 'block'}>
              <Icon name="lock" size={16} /> {p.disabled ? 'Odblokuj' : 'Zablokuj'}
            </button>
            <button type="button" className="btn btn-danger" onClick={remove} disabled={busy === 'del'}><Icon name="trash" size={16} /> Usuń konto</button>
          </div>
        </section>
      </div>
    </div>
  )
}
