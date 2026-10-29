import { useEffect, useMemo, useState } from 'react'
import { sb, syncFpl, type Profile } from '../api'
import { href } from '../router'
import Icon from '../ui/Icon'
import GoldCoin from '../ui/GoldCoin'
import { fmtNum, fmtShort, memberNo, shownEmail } from '../ui/format'
import MemberForm from './MemberForm'

type Row = Profile & { fpl_snapshots: { litres_balance: number; found: boolean; synced_at: string | null } | null }

export default function Clients() {
  const [rows, setRows] = useState<Row[] | null>(null)
  const [q, setQ] = useState('')
  const [adding, setAdding] = useState(false)
  const [sync, setSync] = useState('')

  const load = async () => {
    const { data } = await sb
      .from('profiles')
      .select('*, fpl_snapshots(litres_balance, found, synced_at)')
      .eq('role', 'client')
      .order('created_at', { ascending: false })
    setRows((data as Row[]) ?? [])
  }
  useEffect(() => {
    load()
  }, [])

  const list = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!rows) return []
    return s ? rows.filter((r) => `${r.full_name} ${r.email} ${r.phone ?? ''} ${memberNo(r.member_no)}`.toLowerCase().includes(s)) : rows
  }, [rows, q])

  const syncAll = async () => {
    setSync('Synchronizacja…')
    try {
      const r = await syncFpl({ all: true })
      if (!r.configured) setSync('Połączenie z Performance Lab nie jest jeszcze skonfigurowane.')
      else {
        const found = r.results?.filter((x) => x.found).length ?? 0
        const errs = r.results?.filter((x) => x.error).length ?? 0
        setSync(`Zsynchronizowano: ${found} połączonych${errs ? `, błędy: ${errs}` : ''}.`)
        load()
      }
    } catch (e) {
      setSync((e as Error).message)
    }
  }

  return (
    <div className="apage">
      <header className="apage-head">
        <div>
          <span className="eyebrow-line">Członkowie</span>
          <h1>Klienci {rows && <small>{rows.length}</small>}</h1>
        </div>
        <div className="apage-actions">
          <button type="button" className="btn" onClick={syncAll}><Icon name="refresh" size={16} /> Performance Lab</button>
          <button type="button" className="btn btn-gold" onClick={() => setAdding(true)}><Icon name="plus" size={16} /> Nowy klient</button>
        </div>
      </header>
      {sync && <p className="note">{sync}</p>}

      <div className="search">
        <Icon name="search" size={16} />
        <input placeholder="Szukaj: imię, e-mail, telefon, numer" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      {!rows ? (
        <div className="skeleton" />
      ) : list.length ? (
        <ul className="alist">
          {list.map((r) => (
            <li key={r.id}>
              <a href={href('klienci/' + r.id)} className={r.disabled ? 'off' : ''}>
                <span className="alist-no">{memberNo(r.member_no)}</span>
                <span className="alist-main">
                  <b>{r.full_name || shownEmail(r.email) || r.phone}</b>
                  <small>{[shownEmail(r.email), r.phone].filter(Boolean).join(' · ')}</small>
                </span>
                <span className="alist-gl" title={r.fpl_snapshots?.synced_at ? `Sync ${fmtShort(r.fpl_snapshots.synced_at)}` : 'Bez synchronizacji'}>
                  <GoldCoin size={18} shine={false} />
                  {r.fpl_snapshots?.found ? fmtNum(r.fpl_snapshots.litres_balance) : '—'}
                </span>
                <span className="alist-tag">{r.disabled ? 'Zablokowany' : r.welcome_seen_at ? 'Aktywny' : 'Nie logował się'}</span>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty">{rows.length ? 'Brak wyników.' : 'Nie ma jeszcze klientów. Dodaj pierwszego.'}</p>
      )}

      <MemberForm open={adding} role="client" onClose={() => setAdding(false)} onCreated={() => load()} />
    </div>
  )
}
